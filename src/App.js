import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // Providerni App.js da ishlatmasdan, index.js da ishlatamiz

import {
  Main, Navbar, Footer, Login, Register, Problems, Feedback, CodeCoin, Users,
  Profile, NotFound, ProblemDetail, ProblemCreate, ProblemSolutionUpdate,
  CodeCoinHistory, NotificationsPage // NotificationsPage komponentini import qiling
} from "./components";
// import store from "./store"; // store ni index.js da Providerga beramiz
import AuthService from "./services/auth";
import { logoutUser, signUserSuccess, signUserStart, signUserFailer } from "./features/auth/Auth";
import { connectWebSocket, disconnectWebSocket } from "./middleware/notificationMiddleware"; // Middleware dan action creatorlarni import qilish

// PrivateRoute komponenti
const PrivateRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useSelector((state) => state.auth);
  // console.log("PrivateRoute Render: isLoading =", isLoading, ", isLoggedIn =", isLoggedIn);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen dark:bg-[#0d1117] text-gray-800 dark:text-gray-200">
        Yuklanmoqda...
      </div>
    );
  }

  // Agar login bo'lmagan bo'lsa, /login ga yo'naltiramiz
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

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

    // Agar user allaqachon login bo'lmasa VA hozir loading holatida bo'lmasa, user holatini tekshirish
    // yoki user login bo'lgan bo'lsa va loading tugagan bo'lsa, bu blokni tashlab ketish.
    // Faqatgina dastlabki yuklanishda yoki login holati o'zgarganda tekshiramiz.
    if (!isLoggedIn && isLoading) { // Agar hali login bo'lmagan bo'lsa va yuklanayotgan bo'lsa
      checkUserStatus();
    } else if (isLoggedIn && !isLoading) {
      // Agar allaqachon login bo'lgan bo'lsa va loading tugagan bo'lsa
      // WebSocket ulanishini ta'minlash (agar allaqachon ulanmagan bo'lsa)
      dispatch(connectWebSocket());
    } else if (!isLoggedIn && !isLoading && !isPublicPath) {
      // Agar login bo'lmagan bo'lsa, loading tugagan bo'lsa va public yo'lda bo'lmasa,
      // bu holatda foydalanuvchini logout deb belgilab, WebSocketni uzamiz
      dispatch(logoutUser());
      dispatch(disconnectWebSocket());
    } else if (!isLoggedIn && !isLoading && isPublicPath) {
      // Agar login bo'lmagan bo'lsa, loading tugagan bo'lsa va public yo'lda bo'lsa
      // WebSocketni uzamiz, chunki login bo'lmagan userga bildirishnomalar kerak emas
      dispatch(disconnectWebSocket());
    }

    // `isLoggedIn` dependency'si kerak, chunki login/logout sodir bo'lganda `useEffect` qayta ishga tushishi kerak.
    // `isLoading` ni esa ichkarida boshqarganimiz uchun tashqarida dependency sifatida kiritmadik.
  }, [dispatch, isLoggedIn, isLoading, location.pathname]); // location.pathname ham dependency ga qo'shildi

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
          <Route path="problem-create" element={<ProblemCreate />} />
          <Route path="problem/:id/edit" element={<ProblemCreate />} />
          <Route path="problem/:id/solution/:solutionId/edit" element={<ProblemSolutionUpdate />} />
          <Route path="problem/:id/detail" element={<ProblemDetail />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="codecoin" element={<CodeCoin />} />
          <Route path="users" element={<Users />} />
          <Route path="profile" element={<Profile />} />
          <Route path="codecoin-history" element={<CodeCoinHistory />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    // Providerni bu yerda ishlatish kerak, chunki AppContent ichida useSelector va useDispatch ishlatiladi
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;