import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // <-- useDispatch qo'shildi
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import UserImage from '../assests/userImage.jpeg'; // Default user image
import NotificationDropdown from './NotificationDropdown';
import { logoutUser } from '../features/auth/Auth'; // <-- Logout action import qilindi
import AuthService from '../services/auth';


const Navbar = () => {
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const { notifications } = useSelector((state) => state.notifications); 

  const dispatch = useDispatch(); // <-- Dispatch qo'shildi

  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const baseUrl = "http://127.0.0.1:8000";

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setOpenUserMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setOpenNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => { // <-- Logout funksiyasi async qilindi
    console.log('Logout clicked. Attempting to logout...');
    setOpenUserMenu(false); // Menyuni yopish

    try {
        // 1. Serverga so'rov yuborish (RefreshTokenni bekor qilish va cookie'larni o'chirish)
        await AuthService.userLogout(); 

        // 2. Redux holatini tozalash
        dispatch(logoutUser());
        
        // 3. Login sahifasiga yo'naltirish
        navigate('/login');
        console.log("Logout successful.");

    } catch (error) {
        // Xato bo'lsa ham (masalan, internet yo'q), Redux holatini tozalash kerak
        console.error("Logoutda xato yuz berdi, lekin Redux holati tozalanadi:", error);
        dispatch(logoutUser());
        navigate('/login');
    }
  };
  
  const navLinks = [
    { path: "/projects", iconClass: "fas fa-diagram-project", text: "Projects" },
    { path: "/feedback", iconClass: "fas fa-comments", text: "Feedback" },
    { path: "/problems", iconClass: "fas fa-puzzle-piece", text: "Problems" },
    { path: "/users", iconClass: "fas fa-users", text: "Users" },
    { path: "/codecoin", iconClass: "fas fa-coins", text: "CodeCoin" },
  ];

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15, ease: "easeIn" } },
  };

  return (
    <header className="glass-navbar sticky top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-2">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <i className="fa-solid fa-code-fork text-indigo-400 text-3xl"></i>
            <span className="text-2xl font-bold text-white">Code<span className="text-indigo-400">Unity</span></span>
          </Link>

          {/* Center: Navigation Panel */}
          <nav className="hidden lg:flex items-center space-x-2 bg-gray-900/50 p-1.5 rounded-xl border border-gray-700/50">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                }`}
              >
                <i className={link.iconClass}></i>
                <span className="font-semibold">{link.text}</span>
              </Link>
            ))}
          </nav>

          {/* Right: Coins, Notifications & Auth (User logged in state) */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {/* Coin Display */}
                <Link
                  to={'/codecoin-history'}
                  className="hidden sm:flex items-center space-x-2 bg-gray-800/50 border border-yellow-500/30 rounded-full p-1 pr-3 cursor-pointer hover:border-yellow-500/60 transition-colors"
                >
                  <div className="bg-yellow-400 rounded-full h-7 w-7 flex items-center justify-center">
                    <i className="fa-solid fa-coins text-yellow-800"></i>
                  </div>
                  <span className="font-bold text-md text-white">{user?.coins || 0}</span>
                </Link>

                {/* Notifications Icon (NotificationDropdown komponentiga almashtirildi) */}
                <NotificationDropdown
                    openNotifications={openNotifications}
                    setOpenNotifications={setOpenNotifications}
                    notificationsRef={notificationsRef}
                />

                {/* User Dropdown */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setOpenUserMenu(!openUserMenu)}
                    className="flex items-center gap-2 focus:outline-none group"
                    aria-label="Foydalanuvchi menyusi"
                  >
                    {/* User Image or Default */}
                    {user?.image ? (
                      <img
                        src={`${baseUrl}${user.image}`}
                        alt="Profil rasmi"
                        className="h-9 w-9 rounded-full border-2 border-transparent group-hover:border-indigo-500 transition-all object-cover"
                      />
                    ) : (
                      <img
                        src={UserImage}
                        alt="Profil rasmi"
                        className="h-9 w-9 rounded-full border-2 border-transparent group-hover:border-indigo-500 transition-all object-cover"
                      />
                    )}

                    <motion.span
                      whileHover={{ color: "#6366f1" }}
                      transition={{ duration: 0.3 }}
                      className="text-white font-medium hidden sm:block"
                    >
                      {user?.username || "guest"}
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {openUserMenu && (
                      <motion.div
                        className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-20 user-dropdown transform origin-top-right"
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        {/* User Info */}
                        <div className="flex items-center gap-3 p-3 border-b border-gray-700">
                          <img
                            src={user?.image ? `${baseUrl}${user.image}` : UserImage}
                            alt="Profil rasmi"
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-semibold text-white">
                              {user?.first_name && user?.last_name ? (
                                <>{user.first_name} {user.last_name}</>
                              ) : (
                                <>No Name</>
                              )}
                            </p>
                            <p className="text-sm text-gray-400">@{user?.username || 'user'}</p>
                          </div>
                        </div>

                        {/* Dropdown Links */}
                        <div className="py-1">
                          <Link 
                          to={`/${user.username}/profile`}
                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-indigo-600 hover:text-white transition-colors duration-200"
                            onClick={() => setOpenUserMenu(false)}
                          >
                            <i className="fas fa-user-circle mr-2"></i> Mening Profilim
                          </Link>
                         <Link
                          to="/my-problems"
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-indigo-600 hover:text-white transition-colors duration-200"
                          onClick={() => setOpenUserMenu(false)}
                        >
                          <i className="fas fa-bug mr-2"></i> Muammolar paneli
                        </Link>

                        </div>

                        {/* Logout Button */}
                        <div className="py-1 border-t border-gray-700">
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-600 hover:text-white transition-colors duration-200"
                          >
                            <i className="fas fa-sign-out-alt mr-2"></i> Chiqish
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <Link
                to={'/login'}
                className="hidden sm:inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-full shadow-md hover:bg-indigo-500 hover:shadow-lg transition-all duration-200"
              >
                <i className="fa-solid fa-right-to-bracket mr-2"></i>
                Kirish
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;