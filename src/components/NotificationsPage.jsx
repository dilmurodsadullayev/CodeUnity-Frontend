import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import PlaceholderUserImage from '../assests/userImage.jpeg'; // Ensure this path is correct

// Mock Notification Data (similar to Navbar, but can be expanded)
const initialNotifications = [
  {
    id: 1,
    type: "problem_assigned",
    problemName: "Implement User Authentication",
    assignedBy: "Alice Smith",
    assignedByImage: PlaceholderUserImage,
    coins: 150,
    deadline: "2 days",
    read: false,
    timestamp: "2 hours ago",
    link: "/problems/1" // Example link to the problem
  },
  {
    id: 2,
    type: "problem_completed",
    problemName: "Fix Payment Gateway Bug",
    completedBy: "Bob Johnson",
    completedByImage: PlaceholderUserImage,
    coins: 200,
    timestamp: "1 day ago",
    read: true,
    link: "/problems/2"
  },
  {
    id: 3,
    type: "new_feedback",
    feedbackFrom: "Charlie Brown",
    feedbackFromImage: PlaceholderUserImage,
    problemName: "Dashboard UI Redesign",
    timestamp: "3 days ago",
    read: false,
    link: "/feedback/3"
  },
  {
    id: 4,
    type: "problem_assigned",
    problemName: "Develop REST API for Products",
    assignedBy: "David Lee",
    assignedByImage: PlaceholderUserImage,
    coins: 180,
    deadline: "4 days",
    read: false,
    timestamp: "5 hours ago",
    link: "/problems/4"
  },
  {
    id: 5,
    type: "problem_completed",
    problemName: "Refactor Database Schema",
    completedBy: "Eve White",
    completedByImage: PlaceholderUserImage,
    coins: 250,
    timestamp: "6 hours ago",
    read: false,
    link: "/problems/5"
  },
  {
    id: 6,
    type: "new_feedback",
    feedbackFrom: "Frank Green",
    feedbackFromImage: PlaceholderUserImage,
    problemName: "User Profile Page",
    timestamp: "1 week ago",
    read: true,
    link: "/feedback/6"
  },
];


const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'

  const markNotificationAsRead = (id) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      )
    );
    // In a real app, you'd send an API call here to mark as read on the backend
    console.log(`Notification ${id} marked as read.`);
  };

  const markAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(n => ({ ...n, read: true }))
    );
    // API call to mark all as read
    console.log("All notifications marked as read.");
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationDetails = (notification) => {
    let icon = "";
    let colorClass = "";
    let text = "";
    let userImage = PlaceholderUserImage;
    let userName = "Foydalanuvchi";

    switch (notification.type) {
      case "problem_assigned":
        icon = "fas fa-puzzle-piece";
        colorClass = "text-indigo-400";
        text = `Sizga <span class="font-semibold text-white">"${notification.problemName}"</span> vazifasi yuklatildi.`;
        userImage = notification.assignedByImage || PlaceholderUserImage;
        userName = notification.assignedBy;
        break;
      case "problem_completed":
        icon = "fas fa-check-circle";
        colorClass = "text-green-400";
        text = `<span class="font-semibold text-white">"${notification.problemName}"</span> vazifasi yakunlandi va sizga <span class="text-yellow-400 font-semibold">${notification.coins} Coin</span> berildi.`;
        userImage = notification.completedByImage || PlaceholderUserImage;
        userName = notification.completedBy;
        break;
      case "new_feedback":
        icon = "fas fa-comments";
        colorClass = "text-blue-400";
        text = `<span class="font-semibold text-white">"${notification.problemName}"</span> bo'yicha yangi fikr keldi.`;
        userImage = notification.feedbackFromImage || PlaceholderUserImage;
        userName = notification.feedbackFrom;
        break;
      default:
        icon = "fas fa-info-circle";
        colorClass = "text-gray-400";
        text = "Yangi bildirishnoma.";
    }
    return { icon, colorClass, text, userImage, userName };
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold text-white mb-8 text-center"
        >
          Bildirishnomalar <span className="text-indigo-400">Markazi</span>
        </motion.h1>

        {/* Action and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-xl p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4"
        >
          <div className="flex space-x-2">
            {['all', 'unread', 'read'].map(option => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === option
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                }`}
              >
                {option === 'all' && 'Hammasi'}
                {option === 'unread' && `O'qilmagan (${unreadCount})`}
                {option === 'read' && "O'qilgan"}
              </button>
            ))}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center text-sm font-medium"
            >
              <i className="fas fa-check-double mr-2"></i> Hammasini o'qilgan deb belgilash
            </button>
          )}
        </motion.div>

        {/* Notifications List */}
        <motion.div layout className="space-y-4">
          <AnimatePresence>
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => {
                const { icon, colorClass, text, userImage, userName } = getNotificationDetails(notification);
                const notificationLink = notification.link || `/notifications/${notification.id}`; // Fallback link

                return (
                  <motion.div
                    key={notification.id}
                    layout
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className={`bg-gray-800/70 backdrop-blur-md border ${
                      !notification.read ? 'border-indigo-600' : 'border-gray-700'
                    } rounded-xl p-4 flex items-start gap-4 transition-all duration-300 hover:shadow-lg hover:bg-gray-700/70`}
                  >
                    {/* User Avatar */}
                    <Link to={notificationLink} className="flex-shrink-0">
                      <img
                        src={userImage}
                        alt={userName}
                        className="h-12 w-12 rounded-full object-cover border-2 border-indigo-500"
                      />
                    </Link>

                    {/* Notification Content */}
                    <div className="flex-grow">
                      <Link to={notificationLink} className="block text-white hover:text-indigo-400 transition-colors">
                        <p className="text-base mb-1" dangerouslySetInnerHTML={{ __html: text }}></p>
                      </Link>
                      <p className="text-gray-400 text-xs flex items-center gap-2">
                        <i className={`fas fa-user ${colorClass}`}></i>
                        <span className="font-medium">{userName}</span>
                        <span className="text-gray-600">•</span>
                        <i className="fas fa-clock"></i>
                        <span>{notification.timestamp}</span>
                      </p>
                    </div>

                    {/* Actions and Status */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      {!notification.read && (
                        <button
                          onClick={() => markNotificationAsRead(notification.id)}
                          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center"
                        >
                          <i className="fas fa-check mr-1"></i> O'qilgan
                        </button>
                      )}
                      {!notification.read && (
                        <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" title="Yangi bildirishnoma"></span>
                      )}
                      {notification.read && (
                         <span className="text-xs text-gray-500">O'qilgan</span>
                      )}
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-xl p-6 text-center text-gray-400 text-lg"
              >
                <i className="fas fa-bell-slash text-4xl mb-3 text-gray-600"></i>
                <p>Hozircha bildirishnomalar yo'q.</p>
                {filter !== 'all' && (
                    <button onClick={() => setFilter('all')} className="mt-4 text-indigo-400 hover:underline">
                        Barcha bildirishnomalarni ko'rish
                    </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default NotificationsPage;