import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  Main, Navbar, Footer, Login, Register, Problems, Feedback, FCoin, Users,
  Profile, NotFound, ProblemDetail, ProblemCreate, ProblemSolutionUpdate,
  FCoinHistory, NotificationsPage,
  MyProblems,
  ProjectDetail,
  PostDetail, Projects, SocialCallback
} from "./components";

import AuthService from "./services/auth";
import { logoutUser, signUserSuccess, signUserStart, signUserFailer } from "./features/auth/Auth";
import { connectWebSocket, disconnectWebSocket } from "./middleware/notificationMiddleware";

import { motion } from 'framer-motion';
import FSocietyLogo from './assests/logo/f_society.png'; // Logotip yo'li

// ====================================================================
// WOW LOADER KOMPONENTI - AppLoader
// ====================================================================

/**
 * Loyihaning mavzusiga mos keladigan chiroyli yuklanish animatsiyasi.
 * Dark Mode'ni qo'llab-quvvatlaydi.
 */
const AppLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#05070a] overflow-hidden relative">
      
      {/* --- BACKGROUND GLOW EFFECT --- */}
      <div className="absolute w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>

      <div className="relative flex flex-col items-center">
        
        {/* --- LOGO ANIMATION SECTION --- */}
        <div className="relative w-40 h-40 md:w-56 md:h-56 flex items-center justify-center">
          
          {/* Outer Rotating Ring (Hi-Tech Style) */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="absolute inset-0 border-t-2 border-b-2 border-indigo-500/30 rounded-full"
          ></motion.div>

          {/* Inner Fast Rotating Ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="absolute inset-4 border-r-2 border-l-2 border-indigo-400 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.5)]"
          ></motion.div>

          {/* Central Logo with Glitch and Glow */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: [0.9, 1.05, 1],
              opacity: 1,
              filter: [
                "drop-shadow(0 0 10px rgba(99,102,241,0.5))",
                "drop-shadow(0 0 30px rgba(99,102,241,0.8))",
                "drop-shadow(0 0 10px rgba(99,102,241,0.5))"
              ]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="z-10"
          >
            <img 
              src={FSocietyLogo} 
              alt="F.Society Logo" 
              className="w-32 h-32 md:w-44 md:h-44 object-contain"
            />
          </motion.div>

          {/* Scanning Line Effect */}
          <motion.div 
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-[2px] bg-indigo-500/50 shadow-[0_0_15px_#6366f1] z-20"
          ></motion.div>
        </div>

        {/* --- TEXT SECTION --- */}
        <div className="mt-12 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black tracking-[0.2em] text-white uppercase italic"
          >
            F<span className="text-indigo-500 animate-pulse">Society</span>
          </motion.h1>

          <div className="flex items-center justify-center space-x-2 mt-4">
            {/* Typing Animation for Subtext */}
            <motion.p 
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-indigo-400 font-mono text-sm md:text-base tracking-widest uppercase"
            >
              Initializing system scan...
            </motion.p>
          </div>

          {/* Progress Bar Container */}
          <div className="w-64 h-1 bg-gray-900 mt-6 rounded-full overflow-hidden border border-gray-800">
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-full h-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
            ></motion.div>
          </div>
        </div>

        {/* --- DECORATIVE BINARY CODE (Optional) --- */}
        <div className="absolute -bottom-20 opacity-5 font-mono text-xs text-indigo-500 select-none hidden md:block">
            01010100 01101000 01100101 00100000 01110111 01101111 01110010 01101100 01100100 00100000 01101001 01110011 00100000 01101111 01110101 01110010 01110011
        </div>
      </div>
    </div>
  );
};

// ====================================================================
// PrivateRoute komponenti
// ====================================================================
const PrivateRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    // Endi AppLoader komponentini ishlatamiz
    return <AppLoader />;
  }

  // Agar login bo'lmagan bo'lsa, /login ga yo'naltiramiz
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

// ====================================================================
// AppContent komponenti
// ====================================================================
function AppContent() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const dispatch = useDispatch();
  const { isLoggedIn, isLoading } = useSelector((state) => state.auth);
  const location = useLocation();

  // Mavzuni localStorage'dan yuklash
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Mavzuni o'zgartirish funksiyasi
  const toggleTheme = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newMode;
    });
  };

  // Foydalanuvchi ma'lumotlarini dastlabki yuklash va autentifikatsiya holatini tekshirish
  useEffect(() => {
    const publicPaths = ['/login', '/register'];
    const isPublicPath = publicPaths.includes(location.pathname);

    const checkUserStatus = async () => {
      dispatch(signUserStart()); // Autentifikatsiya tekshiruvini boshlash
      try {
        const response = await AuthService.getUser();
        if (response && response.id) {
          dispatch(signUserSuccess(response));
          // Foydalanuvchi muvaffaqiyatli login bo'lganda WebSocketga ulanish
          dispatch(connectWebSocket());
        } else {
          dispatch(signUserFailer("Foydalanuvchi ma'lumotlari mavjud emas yoki noto'g'ri."));
          dispatch(logoutUser());
          // Foydalanuvchi login bo'lmaganda WebSocket ulanishini uzish
          dispatch(disconnectWebSocket());
        }
      } catch (error) {
        dispatch(signUserFailer(error.message || "Autentifikatsiya xatosi yuz berdi."));
        dispatch(logoutUser());
        // Xato yuz berganda WebSocket ulanishini uzish
        dispatch(disconnectWebSocket());
      }
    };

    // Autentifikatsiya holatini tekshirish mantig'i
    if (!isLoggedIn && isLoading) { 
      checkUserStatus();
    } else if (isLoggedIn && !isLoading) {
      dispatch(connectWebSocket());
    } else if (!isLoggedIn && !isLoading && !isPublicPath) {
      dispatch(logoutUser());
      dispatch(disconnectWebSocket());
    } else if (!isLoggedIn && !isLoading && isPublicPath) {
      dispatch(disconnectWebSocket());
    }

  }, [dispatch, isLoggedIn, isLoading, location.pathname]);

  return (
    <>
      <Routes>
        {/* Login va Register sahifalari */}
        <Route path="/login" element={
          <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'dark' : ''} bg-[#0d1117]`}>
            {isLoggedIn ? <Navigate to="/" replace /> : <Login />}
          </div>
        } />
        <Route path="/register" element={
          <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'dark' : ''} bg-[#0d1117]`}>
            {isLoggedIn ? <Navigate to="/" replace /> : <Register />}
          </div>
        } />

          {/* Social Login Callback Route */}
        <Route path="/callback/:provider" element={
           <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'dark' : ''} bg-[#0d1117]`}>
             <SocialCallback />
           </div>
        } />

        {/* Not Found sahifasi */}
        <Route path="*" element={
          <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'dark' : ''} bg-[#0d1117]`}>
            <NotFound />
          </div>
        } />

        {/* Asosiy sahifalar (PrivateRoute orqali himoyalangan) */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <div className="flex flex-col min-h-screen">
                <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
                <div
                  className={`flex-grow ${
                    isDarkMode ? "dark" : ""
                  } text-gray-800 dark:text-gray-200 transition-colors duration-300 bg-gray-100 dark:bg-[#0d1117]`}
                >
                  <Outlet />
                </div>
                <Footer />
              </div>
            </PrivateRoute>
          }
        >
          {/* ichki sahifalar */}
          <Route index element={<Main />} />
          <Route path="problems" element={<Problems />} />
          <Route path="my-problems" element={<MyProblems />} />
          <Route path="problem-create" element={<ProblemCreate />} />
          <Route path="problem/:id/edit" element={<ProblemCreate />} />
          <Route path="problem/:id/solution/:solutionId/edit" element={<ProblemSolutionUpdate />} />
          <Route path="problem/:id/detail" element={<ProblemDetail />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="fcoin" element={<FCoin />} />
          <Route path="users" element={<Users />} />
          <Route path="/:username/profile" element={<Profile />} />
          <Route path="projects" element={<Projects />} />
          <Route path="project/:projectId/detail" element={<ProjectDetail />} />
          <Route path="fcoin-history" element={<FCoinHistory />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="/:username/post/:slug/" element={<PostDetail />} />
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;