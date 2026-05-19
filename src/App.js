import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  Main,
  Navbar,
  Footer,
  Login,
  Register,
  Problems,
  Feedback,
  FCoin,
  Users,
  Profile,
  NotFound,
  ProblemDetail,
  ProblemCreate,
  ProblemSolutionUpdate,
  FCoinHistory,
  NotificationsPage,
  MyProblems,
  ProjectDetail,
  PostDetail,
  Projects,
  SocialCallback,
} from "./components";

import AuthService from "./services/auth";

import {
  logoutUser,
  signUserSuccess,
  signUserStart,
  signUserFailer,
} from "./features/auth/Auth";

import {
  connectWebSocket,
  disconnectWebSocket,
} from "./middleware/notificationMiddleware";

import { motion } from "framer-motion";
import FSocietyLogo from "./assests/logo/f_society.png";

// ====================================================================
// APP LOADER
// ====================================================================
const AppLoader = () => {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#05070a]">
      <div className="absolute h-[500px] w-[500px] animate-pulse rounded-full bg-indigo-600/10 blur-[120px]" />

      <div className="relative flex flex-col items-center">
        <div className="relative flex h-40 w-40 items-center justify-center md:h-56 md:w-56">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="absolute inset-0 rounded-full border-b-2 border-t-2 border-indigo-500/30"
          />

          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="absolute inset-4 rounded-full border-l-2 border-r-2 border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.5)]"
          />

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: [0.9, 1.05, 1],
              opacity: 1,
              filter: [
                "drop-shadow(0 0 10px rgba(99,102,241,0.5))",
                "drop-shadow(0 0 30px rgba(99,102,241,0.8))",
                "drop-shadow(0 0 10px rgba(99,102,241,0.5))",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="z-10"
          >
            <img
              src={FSocietyLogo}
              alt="F.Society Logo"
              className="h-32 w-32 object-contain md:h-44 md:w-44"
            />
          </motion.div>

          <motion.div
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 z-20 h-[2px] bg-indigo-500/50 shadow-[0_0_15px_#6366f1]"
          />
        </div>

        <div className="mt-12 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black uppercase italic tracking-[0.2em] text-white md:text-5xl"
          >
            F<span className="animate-pulse text-indigo-500">Society</span>
          </motion.h1>

          <div className="mt-4 flex items-center justify-center space-x-2">
            <motion.p
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="font-mono text-sm uppercase tracking-widest text-indigo-400 md:text-base"
            >
              Initializing system scan...
            </motion.p>
          </div>

          <div className="mt-6 h-1 w-64 overflow-hidden rounded-full border border-gray-800 bg-gray-900">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut",
              }}
              className="h-full w-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// ====================================================================
// PRIVATE ROUTE
// ====================================================================
const PrivateRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return <AppLoader />;
  }

  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

// ====================================================================
// PUBLIC AUTH WRAPPER
// ====================================================================
const PublicAuthPage = ({ children, isDarkMode }) => {
  const { isLoggedIn, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return <AppLoader />;
  }

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <div
      className={`flex min-h-screen items-center justify-center bg-[#0d1117] ${
        isDarkMode ? "dark" : ""
      }`}
    >
      {children}
    </div>
  );
};

// ====================================================================
// APP LAYOUT
// ====================================================================
const AppLayout = ({ isDarkMode, toggleTheme }) => {
  return (
    <PrivateRoute>
      <div className="flex min-h-screen flex-col">
        <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />

        <div
          className={`flex-grow text-gray-800 transition-colors duration-300 dark:text-gray-200 ${
            isDarkMode ? "dark" : ""
          } bg-gray-100 dark:bg-[#0d1117]`}
        >
          <Outlet />
        </div>

        <Footer />
      </div>
    </PrivateRoute>
  );
};

// ====================================================================
// APP CONTENT
// ====================================================================
function AppContent() {
  const dispatch = useDispatch();
  const location = useLocation();

  const { isLoggedIn } = useSelector((state) => state.auth);

  const [isDarkMode, setIsDarkMode] = useState(false);

  // Theme load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;

      if (newMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }

      return newMode;
    });
  };

  // Auth check
  useEffect(() => {
    let isMounted = true;

    const checkUserStatus = async () => {
      dispatch(signUserStart());

      try {
        const response = await AuthService.getUser();

        if (!isMounted) return;

        if (response && response.id) {
          dispatch(signUserSuccess(response));
          return;
        }

        dispatch(signUserFailer("Foydalanuvchi ma'lumotlari topilmadi."));
        dispatch(logoutUser());
      } catch (error) {
        if (!isMounted) return;

        dispatch(
          signUserFailer(
            error?.message || "Autentifikatsiya tekshiruvida xatolik yuz berdi."
          )
        );
        dispatch(logoutUser());
      }
    };

    checkUserStatus();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  // api.js refresh failed bo‘lsa auth:logout event yuboradi
  useEffect(() => {
    const handleForceLogout = () => {
      dispatch(logoutUser());
      dispatch(disconnectWebSocket());
    };

    window.addEventListener("auth:logout", handleForceLogout);

    return () => {
      window.removeEventListener("auth:logout", handleForceLogout);
    };
  }, [dispatch]);

  // WebSocket connect/disconnect
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(connectWebSocket());
    } else {
      dispatch(disconnectWebSocket());
    }

    return () => {
      dispatch(disconnectWebSocket());
    };
  }, [dispatch, isLoggedIn]);

  return (
    <Routes>
      {/* PUBLIC AUTH PAGES */}
      <Route
        path="/login"
        element={
          <PublicAuthPage isDarkMode={isDarkMode}>
            <Login />
          </PublicAuthPage>
        }
      />

      <Route
        path="/register"
        element={
          <PublicAuthPage isDarkMode={isDarkMode}>
            <Register />
          </PublicAuthPage>
        }
      />

      <Route
        path="/callback/:provider"
        element={
          <div
            className={`flex min-h-screen items-center justify-center bg-[#0d1117] ${
              isDarkMode ? "dark" : ""
            }`}
          >
            <SocialCallback />
          </div>
        }
      />

      {/* PRIVATE LAYOUT */}
      <Route
        path="/"
        element={
          <AppLayout isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        }
      >
        <Route index element={<Main />} />

        <Route path="problems" element={<Problems />} />
        <Route path="my-problems" element={<MyProblems />} />
        <Route path="problem-create" element={<ProblemCreate />} />
        <Route path="problem/:id/edit" element={<ProblemCreate />} />
        <Route
          path="problem/:id/solution/:solutionId/edit"
          element={<ProblemSolutionUpdate />}
        />
        <Route path="problem/:id/detail" element={<ProblemDetail />} />

        <Route path="feedback" element={<Feedback />} />
        <Route path="fcoin" element={<FCoin />} />
        <Route path="fcoin-history" element={<FCoinHistory />} />

        <Route path="users" element={<Users />} />
        <Route path=":username/profile" element={<Profile />} />

        <Route path="projects" element={<Projects />} />
        <Route path="project/:projectId/detail" element={<ProjectDetail />} />

        <Route path="notifications" element={<NotificationsPage />} />
        <Route path=":username/post/:slug/" element={<PostDetail />} />
      </Route>

      {/* NOT FOUND */}
      <Route
        path="*"
        element={
          <div
            className={`flex min-h-screen items-center justify-center bg-[#0d1117] ${
              isDarkMode ? "dark" : ""
            }`}
          >
            <NotFound />
          </div>
        }
      />
    </Routes>
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