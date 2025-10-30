import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector, Provider } from "react-redux"; // Providerni bu yerdan olamiz, asliga ko'ra

import {
  Main, Navbar, Footer, Login, Register, Problems, Feedback, CodeCoin, Users,
  Profile, NotFound, ProblemDetail, ProblemCreate, ProblemSolutionUpdate,
  CodeCoinHistory, NotificationsPage
} from "./components";
import store from "./store";
import AuthService from "./services/auth";
import { logoutUser, signUserSuccess, isLoading } from "./features/auth/Auth"; // signUserFailure ham kerak bo'lishi mumkin
import { closeWebSocket, initWebSocket } from "./services/notificationService";

// PrivateRoute komponenti
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    // Agar autentifikatsiya holati yuklanayotgan bo'lsa, yuklanish indikatorini ko'rsatish
    return <div className="flex items-center justify-center min-h-screen dark:bg-[#0d1117] text-gray-800 dark:text-gray-200">Yuklanmoqda...</div>;
  }

  // Agar login bo'lmagan bo'lsa, login sahifasiga yo'naltiramiz
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function AppContent() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth); // isLoading ni Redux'dan olamiz
  const navigate = useNavigate();

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
    const checkUserStatus = async () => {
      dispatch(isLoading(true)); // Loadingni boshlaymiz
      try {
        const response = await AuthService.getUser(); // Backend'dan user holatini tekshirish (cookie orqali)
        // Agar muvaffaqiyatli bo'lsa, user ma'lumotlari bilan Redux state'ni yangilaymiz
        // response.user deb olsak, chunki AuthService'dan shunday keladi deb faraz qilyapmiz
        dispatch(signUserSuccess(response.user));
      } catch (error) {
        console.log("Foydalanuvchi sessioni yaroqsiz yoki mavjud emas:", error);
        dispatch(logoutUser()); // Token yaroqsiz bo'lsa, logout qilamiz
      } finally {
        dispatch(isLoading(false)); // Loadingni tugatamiz
      }
    };

    checkUserStatus();
  }, [dispatch]); // Faqat bir marta, komponent yuklanganda ishga tushadi

  // WebSocketni boshqarish
  useEffect(() => {
    // isLoading tugagandan so'ng va isAuthenticated bo'lsa, WebSocketni ulaymiz
    if (!isLoading && isAuthenticated && user && user.id) { // user.id mavjudligini ham tekshiramiz
      console.log("isAuthenticated true, WebSocket ulanmoqda...");
      initWebSocket(dispatch, user.id); // user.id ni initWebSocket ga o'tkazamiz
    } else if (!isLoading && !isAuthenticated) {
      console.log("isAuthenticated false, WebSocket uzilmoqda...");
      closeWebSocket();
      // Logout bo'lganda yoki autentifikatsiya yo'q bo'lganda,
      // agar hozirgi sahifa login/register emas bo'lsa, login sahifasiga yo'naltiramiz
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        navigate('/login');
      }
    }

    // Komponent o'chirilganda WebSocketni yopish
    return () => {
      closeWebSocket();
    };
  }, [isAuthenticated, user, dispatch, navigate, isLoading]); // Dependency'larga isLoading'ni ham qo'shamiz

  // isLoading state Redux'dan keladi, ilova yuklanayotganini ko'rsatish uchun ishlatiladi
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'dark' : ''} bg-[#0d1117]`}>
        <h1 className="text-white text-3xl">Yuklanmoqda...</h1>
      </div>
    );
  }

  return (
    <>
      <Routes>
        {/* Login va Register sahifalari */}
        <Route path="/login" element={
          <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'dark' : ''} bg-[#0d1117]`}>
            <Login />
          </div>
        } />
        <Route path="/register" element={
          <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'dark' : ''} bg-[#0d1117]`}>
            <Register />
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
            <PrivateRoute> {/* Himoyalangan route */}
              <div className="flex flex-col min-h-screen"> {/* Footer'ni pastga itarish uchun */}
                <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
                <div
                  className={`flex-grow ${ // Kontentni kengaytirish uchun
                    isDarkMode ? "dark" : ""
                  } text-gray-800 dark:text-gray-200 transition-colors duration-300 bg-gray-100 dark:bg-[#0d1117]`}
                >
                  <Outlet /> {/* ichki sahifalar shu yerga chiqadi */}
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
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;