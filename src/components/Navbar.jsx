import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'; 
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";

// Rasmlarni import qilish
import UserImage from '../assests/userImage.jpeg'; 
import FSocietyLogo from '../assests/logo/f_society.png'; 
import FCoinIcon from '../assests/coin/fcoin.png'; // FCoin rasmi

import NotificationDropdown from './NotificationDropdown';
import { logoutUser } from '../features/auth/Auth'; 
import AuthService from '../services/auth';

const Navbar = () => {
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const { notifications } = useSelector((state) => state.notifications); 

  const dispatch = useDispatch();
  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const baseUrl = "http://127.0.0.1:8000";

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) setOpenUserMenu(false);
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) setOpenNotifications(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setOpenUserMenu(false);
    setIsMobileMenuOpen(false);
    try {
        await AuthService.userLogout(); 
        dispatch(logoutUser());
        navigate('/login');
    } catch (error) {
        dispatch(logoutUser());
        navigate('/login');
    }
  };
  
  const navLinks = [
    { path: "/projects", iconClass: "fas fa-diagram-project", text: "Projects" },
    { path: "/feedback", iconClass: "fas fa-comments", text: "Feedback" },
    { path: "/problems", iconClass: "fas fa-puzzle-piece", text: "Problems" },
    { path: "/users", iconClass: "fas fa-users", text: "Users" },
    { path: "/fcoin", iconClass: "fas fa-coins", text: "FCoin" },
  ];

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15 } },
  };

  return (
    <header className="glass-navbar sticky top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          
          {/* --- LEFT: LOGO --- */}
          <Link to="/" className="flex items-center space-x-4 group relative z-50">
            <motion.img 
              src={FSocietyLogo} 
              alt="F.Society" 
              className="h-16 md:h-20 w-auto object-contain transition-all duration-500 group-hover:rotate-[360deg]" 
            />
            
            <div className="relative flex flex-col justify-center overflow-hidden h-12 pr-6">
              <span className="text-2xl md:text-3xl font-black text-white transition-all duration-500 transform group-hover:-translate-y-full group-hover:opacity-0 tracking-tighter">
                F.<span className="text-indigo-500">Society</span>
              </span>
              
              <span className="absolute text-2xl md:text-3xl font-black text-indigo-400 transition-all duration-500 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 whitespace-nowrap tracking-tighter">
                Fix <span className="text-white">Society</span>
              </span>
            </div>
          </Link>

          {/* --- CENTER: DESKTOP NAV --- */}
          <nav className="hidden lg:flex items-center space-x-1 bg-gray-800/40 p-1.5 rounded-2xl border border-gray-700/30">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 ${
                  isActive(link.path)
                    ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]'
                    : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                }`}
              >
                <i className={`${link.iconClass} text-sm`}></i>
                <span className="font-bold text-sm uppercase tracking-wider">{link.text}</span>
              </Link>
            ))}
          </nav>

          {/* --- RIGHT: ACTIONS --- */}
          <div className="flex items-center space-x-3 md:space-x-5">
            {isLoggedIn ? (
              <>
                {/* FCoin Display */}
                <Link
                  to={'/fcoin-history'}
                  className="hidden sm:flex items-center space-x-2 bg-gray-800/60 border border-gray-700 rounded-full py-1 px-4 hover:border-yellow-500/50 transition-all group"
                >
                  <motion.img 
                      whileHover={{ scale: 1.15 }}
                      src={FCoinIcon} 
                      alt="FCoin" 
                      className="h-11 w-11 md:h-12 md:w-12 object-contain drop-shadow-[0_0_10px_rgba(234,179,8,0.6)]" 
                  />
                  <span className="font-black text-yellow-500 text-xl md:text-2xl tracking-tighter">
                    {user?.coins || 0}
                  </span>
                </Link>

                {/* Notifications */}
                <NotificationDropdown
                    openNotifications={openNotifications}
                    setOpenNotifications={setOpenNotifications}
                    notificationsRef={notificationsRef}
                />

                {/* User Profile Dropdown */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setOpenUserMenu(!openUserMenu)}
                    className="flex items-center gap-2 outline-none group"
                  >
                    {/* BU YERDA rounded-full QILINDI */}
                    <img
                      src={user?.image ? `${baseUrl}${user.image}` : UserImage}
                      alt="User"
                      className="h-10 w-10 md:h-12 md:w-12 rounded-full border-2 border-gray-700 group-hover:border-indigo-500 transition-all object-cover shadow-xl"
                    />
                  </button>

                  <AnimatePresence>
                    {openUserMenu && (
                      <motion.div
                        className="absolute right-0 mt-3 w-64 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl z-[60] overflow-hidden"
                        variants={dropdownVariants}
                        initial="hidden" animate="visible" exit="exit"
                      >
                        <div className="p-4 bg-gray-800/50 border-b border-gray-700">
                          <p className="font-bold text-white truncate text-lg">
                            {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : 'User'}
                          </p>
                          <p className="text-xs text-indigo-400 font-mono">@{user?.username}</p>
                        </div>
                        <div className="p-2">
                          <Link to={`/${user.username}/profile`} className="flex items-center p-3 text-gray-300 hover:bg-indigo-600 rounded-xl transition-all" onClick={() => setOpenUserMenu(false)}>
                            <i className="fas fa-user-circle mr-3"></i> Profilim
                          </Link>
                          <Link to="/my-problems" className="flex items-center p-3 text-gray-300 hover:bg-indigo-600 rounded-xl transition-all" onClick={() => setOpenUserMenu(false)}>
                            <i className="fas fa-bug mr-3"></i> Muammolarim
                          </Link>
                          <button onClick={handleLogout} className="w-full flex items-center p-3 text-red-400 hover:bg-red-500/20 rounded-xl transition-all border-t border-gray-800 mt-2">
                            <i className="fas fa-sign-out-alt mr-3"></i> Chiqish
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <Link to={'/login'} className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/30">
                Kirish
              </Link>
            )}

            {/* --- MOBILE MENU TOGGLE --- */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white text-2xl p-2 focus:outline-none"
            >
              <i className={isMobileMenuOpen ? "fas fa-times" : "fas fa-bars-staggered"}></i>
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE NAVIGATION --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-gray-900 border-t border-gray-800 overflow-hidden"
          >
            <div className="flex flex-col p-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-4 p-4 rounded-xl font-bold transition-all ${
                    isActive(link.path) ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-800'
                  }`}
                >
                  <i className={`${link.iconClass} w-6`}></i>
                  <span>{link.text}</span>
                </Link>
              ))}
              
              {!isLoggedIn && (
                 <Link to="/login" className="w-full text-center p-4 bg-indigo-600 text-white rounded-xl font-bold mt-4">
                    Kirish
                 </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;