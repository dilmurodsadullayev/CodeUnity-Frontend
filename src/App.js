import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector, Provider } from "react-redux";

import {
  Main, Navbar, Footer, Login, Register, Problems, Feedback, CodeCoin, Users,
  Profile, NotFound, ProblemDetail, ProblemCreate, ProblemSolutionUpdate,
  CodeCoinHistory, NotificationsPage
} from "./components";
import store from "./store";
import AuthService from "./services/auth"; // AuthService import qilindi
import { logoutUser, signUserSuccess, signUserStart, signUserFailer } from "./features/auth/Auth";

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

  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

function AppContent() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const dispatch = useDispatch();
  const { isLoggedIn, isLoading } = useSelector((state) => state.auth);
  // console.log("AppContent Render: isLoggedIn =", isLoggedIn, ", isLoading =", isLoading, ", currentPath =", location.pathname);
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

    // Agar allaqachon login bo'lgan bo'lsa va public yo'lda bo'lmasak, va loading tugagan bo'lsa, qaytamiz.
    if (isLoggedIn && !isLoading && !isPublicPath) {
        // console.log("Autentifikatsiya tekshiruvini o'tkazib yuborish (Allaqachon login):", { isLoggedIn, isLoading, isPublicPath, currentPath: location.pathname });
        return;
    }
    // Agar public yo'lda bo'lsak va login bo'lmagan bo'lsak, va loading tugagan bo'lsa, qaytamiz.
    if (isPublicPath && !isLoggedIn && !isLoading) {
      // console.log("Autentifikatsiya tekshiruvini o'tkazib yuborish (Public yo'l):", { isLoggedIn, isLoading, isPublicPath, currentPath: location.pathname });
      return;
    }
    // Agar public yo'lda bo'lsak va loading tugagan bo'lsa, va login bo'lgan bo'lsak, lekin user null bo'lsa...
    // Bu yerda biroz murakkablik bor. Foydalanuvchi `/login` ga kirgan bo'lsa va allaqachon login bo'lgan bo'lsa,
    // uni `/` ga yo'naltirishimiz kerak. Bu mantiqni `Login` komponenti ichida hal qilish maqsadga muvofiq.

    const checkUserStatus = async () => {
      // console.log("Autentifikatsiya holatini tekshirishni boshlash...");
      // signUserStart dispatch qilinadi, chunki bu blok faqat loading holatida ishlaydi (yoki boshida)
      dispatch(signUserStart()); 
      try {
        const response = await AuthService.getUser();
        // console.log("AuthService.getUser() dan kelgan javob:", response); 
        
        if (response && response.id) {
          dispatch(signUserSuccess(response));
        } else {
          // Serverdan user topilmagan bo'lsa (lekin 200 OK qaytargan bo'lishi mumkin)
          // console.log("Autentifikatsiya muvaffaqiyatsiz: Foydalanuvchi obyekti topilmadi yoki noto'g'ri formatda.");
          dispatch(signUserFailer("Foydalanuvchi ma'lumotlari mavjud emas yoki noto'g'ri."));
          dispatch(logoutUser()); // Cookie ni server o'chirishi kerak, faqat Redux holatini tozalaymiz
        }
      } catch (error) {
        // Bu yerga serverdan 401 (Unauthorized) yoki boshqa xatolar keladi
        // console.error("Foydalanuvchi sessioni yaroqsiz yoki mavjud emas:", error);
        dispatch(signUserFailer(error.message || "Autentifikatsiya xatosi yuz berdi."));
        dispatch(logoutUser()); // Redux holatini tozalaymiz
      }
    };

    // Agar Reduxdagi `isLoading` hali `true` bo'lsa (dastlabki yuklanishda)
    // va public yo'lda bo'lmasak (chunki public yo'llarda user tekshiruvi shart emas)
    if (isLoading && !isPublicPath) {
      checkUserStatus();
    } else if (isLoading && isPublicPath) {
      // Agar public yo'lda bo'lsak va hali `isLoading` `true` bo'lsa, uni `false` ga o'rnatishimiz kerak
      // bu user tekshiruvini o'tkazib yuborganimizni bildiradi
      dispatch(signUserFailer(null)); // Xato emas, shunchaki loadingni tugatish
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isLoggedIn, location.pathname]); // `isLoading` ni dependency'dan olib tashladim, chunki u `useEffect` ichida boshqariladi


  return (
    <>
      <Routes>
        {/* Login va Register sahifalari */}
        <Route path="/login" element={
          <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'dark' : ''} bg-[#0d1117]`}>
            {isLoggedIn ? <Navigate to="/" replace /> : <Login />} {/* Agar login bo'lgan bo'lsa, asosiy sahifaga yo'naltirish */}
          </div>
        } />
        <Route path="/register" element={
          <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'dark' : ''} bg-[#0d1117]`}>
            {isLoggedIn ? <Navigate to="/" replace /> : <Register />} {/* Agar login bo'lgan bo'lsa, asosiy sahifaga yo'naltirish */}
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
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;