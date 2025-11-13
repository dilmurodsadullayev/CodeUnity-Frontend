import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  Main, Navbar, Footer, Login, Register, Problems, Feedback, CodeCoin, Users,
  Profile, NotFound, ProblemDetail, ProblemCreate, ProblemSolutionUpdate,
  CodeCoinHistory, NotificationsPage,
  MyProblems,
  ProjectDetail,
  PostDetail
} from "./components";
import AuthService from "./services/auth";
import { logoutUser, signUserSuccess, signUserStart, signUserFailer } from "./features/auth/Auth";
import { connectWebSocket, disconnectWebSocket } from "./middleware/notificationMiddleware";

// ====================================================================
// WOW LOADER KOMPONENTI - AppLoader
// ====================================================================

/**
 * Loyihaning mavzusiga mos keladigan chiroyli yuklanish animatsiyasi.
 * Dark Mode'ni qo'llab-quvvatlaydi.
 */
const AppLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-[#0d1117] transition-colors duration-300">
      {/* Kodga ishora qiluvchi animatsiya - < / > simvoli bilan aylanuvchi spinner */}
      <div className="relative w-24 h-24">
        {/* Tashqi Ring - Yumshoq pulsatsiya */}
        <div className="absolute inset-0 border-4 border-gray-400 dark:border-gray-700 rounded-full animate-ping opacity-50"></div>
        
        {/* Asosiy Spinner - CodeUnity ning asosiy rangi bilan aylanadi */}
        <div className="w-full h-full border-8 border-t-8 border-t-blue-600 dark:border-t-blue-400 border-gray-200 dark:border-gray-800 rounded-full animate-spin"></div>
        
        {/* Markaziy Kontent - Kod simboli */}
        <div className="absolute inset-0 flex items-center justify-center text-4xl font-extrabold text-blue-600 dark:text-blue-400">
          {/* SVG ikonka: < / > ga o'xshash qavslar */}
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
          </svg>
        </div>
      </div>
      
      {/* Yuklanish Matni */}
      <p className="mt-8 text-2xl font-bold text-gray-900 dark:text-gray-100">
        CodeUnity
      </p>
      <p className="text-md text-gray-600 dark:text-gray-400 mt-2 animate-pulse">
        Muammolar yechimi yuklanmoqda...
      </p>
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
          <Route path="codecoin" element={<CodeCoin />} />
          <Route path="users" element={<Users />} />
          <Route path="/:username/profile" element={<Profile />} />
          <Route path="project/:projectId/detail" element={<ProjectDetail />} />
          <Route path="codecoin-history" element={<CodeCoinHistory />} />
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