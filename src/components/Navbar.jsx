import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import UserImage from '../assests/userImage.jpeg'; // Default user image
import PlaceholderUserImage from '../assests/userImage.jpeg'; // A new placeholder for notification avatars

const Navbar = () => {
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const { loggedIn, user } = useSelector((state) => state.auth);
  const { notificationss, status } = useSelector((state) => state.notification);
  console.log("Notification lar ", notificationss)

  
  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const baseUrl = "http://127.0.0.1:8000";

  // Mock Notification Data (Enhanced with imageUrl for better demonstration)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "problem_assigned",
      problemName: "Implement User Authentication",
      assignedBy: "Alice Smith",
      assignedByImage: PlaceholderUserImage, // Added for demo
      coins: 150,
      deadline: "2 days",
      read: false,
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      type: "problem_completed",
      problemName: "Fix Payment Gateway Bug",
      completedBy: "Bob Johnson",
      completedByImage: PlaceholderUserImage, // Added for demo
      coins: 200,
      timestamp: "1 day ago",
      read: true,
    },
    {
      id: 3,
      type: "new_feedback",
      feedbackFrom: "Charlie Brown",
      feedbackFromImage: PlaceholderUserImage, // Added for demo
      problemName: "Dashboard UI Redesign",
      timestamp: "3 days ago",
      read: false,
    },
    {
      id: 4,
      type: "problem_assigned",
      problemName: "Develop REST API for Products",
      assignedBy: "David Lee",
      assignedByImage: PlaceholderUserImage, // Added for demo
      coins: 180,
      deadline: "4 days",
      read: false,
      timestamp: "5 hours ago",
    },
    {
      id: 5,
      type: "problem_completed",
      problemName: "Refactor Database Schema",
      completedBy: "Eve White",
      completedByImage: PlaceholderUserImage, // Added for demo
      coins: 250,
      timestamp: "6 hours ago",
      read: false,
    },
  ]);

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

  const handleLogout = () => {
    console.log('Logout clicked');
    // Implement your actual logout logic here (e.g., dispatch an action)
    setOpenUserMenu(false);
    navigate('/login');
  };

  const markNotificationAsRead = (id) => {
    // In a real application, you would dispatch an action to update the backend
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    // You might want to navigate to a specific problem/feedback page here
    // For now, we keep the dropdown open after marking as read to allow viewing other notifications
    // setOpenNotifications(false); // Uncomment this if you want to close after any click
  };

  const navLinks = [
    { path: "/feedback", iconClass: "fas fa-comments", text: "Feedback" },
    { path: "/problems", iconClass: "fas fa-puzzle-piece", text: "Problems" },
    { path: "/users", iconClass: "fas fa-users", text: "Users" },
    { path: "/codecoin", iconClass: "fas fa-coins", text: "CodeCoin" },
  ];

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

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
            {loggedIn ? (
              <>
                <Link
                  to={'/codecoin-history'}
                  className="hidden sm:flex items-center space-x-2 bg-gray-800/50 border border-yellow-500/30 rounded-full p-1 pr-3 cursor-pointer hover:border-yellow-500/60 transition-colors"
                >
                  <div className="bg-yellow-400 rounded-full h-7 w-7 flex items-center justify-center">
                    <i className="fa-solid fa-coins text-yellow-800"></i>
                  </div>
                  <span className="font-bold text-md text-white">{user?.coins || 0}</span>
                </Link>

                {/* Notifications Icon */}
                <div className="relative" ref={notificationsRef}>
                  <button
                    onClick={() => setOpenNotifications(!openNotifications)}
                    className="relative p-2 rounded-full hover:bg-gray-700/50 transition-colors duration-200 focus:outline-none"
                    aria-label="Bildirishnomalar"
                  >
                    <i className="fas fa-bell text-white text-xl"></i>
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full z-10">
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {openNotifications && (
                      <motion.div
                        className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-gray-800 border border-gray-700 rounded-md shadow-lg z-20 notification-dropdown transform origin-top-right"
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                          <h3 className="text-lg font-bold text-white">Bildirishnomalar</h3>
                          {unreadNotificationsCount > 0 && (
                            <span className="text-sm text-gray-400">{unreadNotificationsCount} yangi</span>
                          )}
                        </div>
                        <div className="py-1">
                          {notifications.length > 0 ? (
                            notifications.map((notification) => (
                              <div
                                key={notification.id}
                                className={`flex items-start gap-3 px-4 py-3 border-b border-gray-700 last:border-b-0 cursor-pointer transition-all duration-200 ${
                                  !notification.read ? 'bg-indigo-900/30 hover:bg-indigo-900/50' : 'hover:bg-gray-700/50'
                                }`}
                                onClick={() => markNotificationAsRead(notification.id)}
                              >
                                {/* Notification User Image */}
                                <img
                                  src={
                                    notification.type === "problem_assigned"
                                      ? notification.assignedByImage || PlaceholderUserImage
                                      : notification.type === "new_feedback"
                                      ? notification.feedbackFromImage || PlaceholderUserImage
                                      : notification.type === "problem_completed"
                                      ? notification.completedByImage || PlaceholderUserImage
                                      : PlaceholderUserImage // Default if no specific image type
                                  }
                                  alt="User"
                                  className="h-9 w-9 rounded-full object-cover flex-shrink-0 mt-0.5"
                                />

                                <div className="flex-grow">
                                  <p className="text-sm font-semibold text-white mb-1 leading-tight">
                                    {notification.type === "problem_assigned" && (
                                      <>
                                        <span className="text-indigo-400">Yangi vazifa:</span> Sizga <span className="text-indigo-200">"{notification.problemName}"</span> vazifasi yuklatildi.
                                      </>
                                    )}
                                    {notification.type === "problem_completed" && (
                                      <>
                                        <span className="text-green-400">Hal qilindi:</span> <span className="text-green-200">"{notification.problemName}"</span> hal qilindi.
                                      </>
                                    )}
                                    {notification.type === "new_feedback" && (
                                      <>
                                        <span className="text-blue-400">Yangi fikr:</span> <span className="text-blue-200">"{notification.problemName}"</span> bo'yicha yangi fikr keldi.
                                      </>
                                    )}
                                  </p>
                                  <p className="text-xs text-gray-400 space-x-1">
                                    {notification.type === "problem_assigned" && (
                                      <>
                                        <span><i className="fas fa-user mr-1"></i>{notification.assignedBy}</span> •
                                        <span className="text-yellow-400"><i className="fas fa-coins mr-1"></i>{notification.coins}</span> •
                                        <span className="text-red-400"><i className="fas fa-calendar-alt mr-1"></i>{notification.deadline}</span>
                                      </>
                                    )}
                                     {notification.type === "problem_completed" && (
                                      <>
                                        <span><i className="fas fa-user-check mr-1"></i>{notification.completedBy}</span> •
                                        <span className="text-yellow-400">{notification.coins} Coin berildi</span>
                                      </>
                                    )}
                                    {notification.type === "new_feedback" && (
                                      <>
                                        <span><i className="fas fa-user-edit mr-1"></i>{notification.feedbackFrom}</span>
                                      </>
                                    )}
                                  </p>
                                  <span className="text-xs text-gray-500 mt-2 block text-right">{notification.timestamp}</span>
                                </div>
                                {!notification.read && (
                                  <span className="ml-2 h-2 w-2 rounded-full bg-indigo-500 flex-shrink-0 mt-2"></span>
                                )}
                              </div>
                            ))
                          ) : (
                            <p className="px-4 py-3 text-sm text-gray-400 text-center">Bildirishnomalar yo'q.</p>
                          )}
                        </div>
                        {notifications.length > 0 && (
                          <div className="p-2 border-t border-gray-700">
                            <Link
                              to="/notifications"
                              className="block text-center text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                              onClick={() => setOpenNotifications(false)}
                            >
                              Ko'proq ko'rish <i className="fas fa-arrow-right ml-1"></i>
                            </Link>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* User Dropdown */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setOpenUserMenu(!openUserMenu)}
                    className="flex items-center gap-2 focus:outline-none group"
                    aria-label="Foydalanuvchi menyusi"
                  >
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

                        <div className="py-1">
                          <Link
                            to="/profile"
                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-indigo-600 hover:text-white transition-colors duration-200"
                            onClick={() => setOpenUserMenu(false)}
                          >
                            <i className="fas fa-user-circle mr-2"></i> Mening Profilim
                          </Link>
                          <Link
                            to="/settings"
                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-indigo-600 hover:text-white transition-colors duration-200"
                            onClick={() => setOpenUserMenu(false)}
                          >
                            <i className="fas fa-cog mr-2"></i> Sozlamalar
                          </Link>
                        </div>

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