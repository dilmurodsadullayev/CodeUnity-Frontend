import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import PlaceholderUserImage from '../assests/userImage.jpeg'; // Ensure this path is correct
import { useSelector, useDispatch } from 'react-redux'; // useDispatch qo'shildi
import { timeUntilDeadline } from '../utils/timeUntilDeadline';
import { markNotificationAsRead, markAllNotificationsAsRead } from '../middleware/notificationMiddleware'; // Middleware funksiyalari qo'shildi
import timeAgo from '../utils/timeAgo';

// Constants
const baseUrl = "http://127.0.0.1:8000";

const NotificationsPage = () => {
  const dispatch = useDispatch();
  // Redux store'dan bildirishnomalarni olish
  const { notifications } = useSelector((state) => state.notifications); 
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'

  // O'qildi deb belgilash funksiyalari (Redux orqali)
  const markNotificationAsReadAction = (id) => {
    dispatch(markNotificationAsRead(id));
  };

  const markAllAsReadAction = () => {
    dispatch(markAllNotificationsAsRead());
  };

  // is_read property'si asosida filterlash
  const filteredNotifications = [...notifications]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Eng yangisini birinchi ko'rsatish
    .filter(n => {
    if (filter === 'unread') return !n.is_read; // is_read ishlatildi
    if (filter === 'read') return n.is_read;    // is_read ishlatildi
    return true;
  });

  const unreadCount = notifications.filter(n => !n.is_read).length; // is_read ishlatildi

  const getNotificationDetails = (notification) => {
    let icon = "fas fa-info-circle";
    let colorClass = "text-gray-400";
    let text = notification.message || "Yangi bildirishnoma.";
    
    // Vazifa nomini olish (agar mavjud bo'lsa)
    const problemTitle = notification.problem?.problem || 'Noma\'lum vazifa'; 
    
    // Kimdan ekanligini olish
    let userName = notification.sender?.username || 'Noma\'lum';
    let userImage = notification.sender?.image 
      ? `${baseUrl}${notification.sender.image}` 
      : PlaceholderUserImage;
    
    // Problem ID ni object_id yoki problem.id dan olish
    const problemId = notification.object_id || notification.problem?.id; 
    let problemUrl = problemId ? `/problem/${problemId}/detail` : '/problems';


    // content_type yoki type ga qarab xabar turini aniqlash
    if (notification.content_type === "problem") {
        icon = "fas fa-plus-square";
        colorClass = "text-indigo-400";
        // message: "Yangi muammo joylandi: Muammo 6"
        const titleMatch = notification.message.match(/:\s*(.*)/);
        const inferredTitle = titleMatch ? titleMatch[1].trim() : 'Yangi vazifa';
        text = `Yangi muammo joylandi: <span class="font-semibold text-white">"${inferredTitle}"</span>.`;

    } else if (notification.content_type === "star") {
        icon = "fas fa-star";
        colorClass = "text-yellow-400";
        // message: "anakin foydalanuvchi siz yuklagan '...' muammoga ⭐ star berdi."
        text = `<span class="font-semibold text-white">${notification.message}</span>`;
    } else if (notification.type === "problem_assigned" || notification.type === "problem_urgent") {
        icon = "fas fa-puzzle-piece";
        colorClass = "text-indigo-400";
        text = `Sizga <span class="font-semibold text-white">"${problemTitle}"</span> vazifasi yuklatildi.`;
    } else if (notification.type === "problem_completed") {
        icon = "fas fa-check-circle";
        colorClass = "text-green-400";
        const coins = notification.coins || notification.offered_coins; // Coin ni tekshirish
        const coinsText = coins ? ` va sizga <span class="text-yellow-400 font-semibold">${coins} Coin</span> berildi` : '';
        text = `<span class="font-semibold text-white">"${problemTitle}"</span> vazifasi yakunlandi${coinsText}.`;
    } else if (notification.type === "new_feedback") {
        icon = "fas fa-comments";
        colorClass = "text-blue-400";
        text = `<span class="font-semibold text-white">"${problemTitle}"</span> bo'yicha yangi fikr keldi.`;
    }
    
    // Agar sender yo'q bo'lsa
    if (!notification.sender) {
        userName = 'Tizim';
    }

    return { icon, colorClass, text, userImage, userName, problemUrl };
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
              onClick={markAllAsReadAction} // Yangilangan funksiya
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
                const { icon, colorClass, text, userImage, userName, problemUrl } = getNotificationDetails(notification);

                return (
                  <motion.div
                    key={notification.id}
                    layout
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className={`bg-gray-800/70 backdrop-blur-md border ${
                      !notification.is_read ? 'border-indigo-600' : 'border-gray-700' // is_read ishlatildi
                    } rounded-xl p-4 flex items-start gap-4 transition-all duration-300 hover:shadow-lg hover:bg-gray-700/70`}
                  >
                    {/* User Avatar */}
                    <Link to={problemUrl} className="flex-shrink-0">
                      <img
                        src={userImage}
                        alt={userName}
                        className="h-12 w-12 rounded-full object-cover border-2 border-indigo-500"
                      />
                    </Link>

                    {/* Notification Content */}
                    <div className="flex-grow">
                      <Link to={problemUrl} className="block text-white hover:text-indigo-400 transition-colors">
                        <p className="text-base mb-1 flex items-center">
                            <i className={`${icon} ${colorClass} text-lg mr-2`}></i> 
                            <span dangerouslySetInnerHTML={{ __html: text }}></span>
                        </p>
                      </Link>
                      
                      <p className="text-gray-400 text-xs flex items-center gap-2">
                        <i className={`fas fa-user text-gray-400`}></i>
                        <span className="font-medium">{userName}</span>
                        <span className="text-gray-600">•</span>
                        
                        {/* Problem-related (deadline, coins) */}
                        {(notification.content_type === "problem" || notification.type === "problem_assigned" || notification.type === "problem_urgent") && (
                            <>
                                {/* Deadline: Asosiy deadline ni yoki problem ichidagi deadline ni ishlatish */}
                                {(notification.deadline || notification.problem?.deadline) && (
                                    <>
                                        <i className="fas fa-clock text-red-500"></i>
                                        <span className="text-red-400">{timeUntilDeadline(notification.deadline || notification.problem.deadline)}</span>
                                        <span className="text-gray-600">•</span>
                                    </>
                                )}
                                
                                {/* Coins: Asosiy offered_coins ni yoki problem ichidagi coins ni ishlatish */}
                                {(notification.offered_coins || notification.problem?.offered_coins) && (
                                    <>
                                        <i className="fas fa-coins text-yellow-400"></i>
                                        <span className="text-yellow-400 font-bold">{notification.offered_coins || notification.problem.offered_coins}</span>
                                        <span className="text-gray-600">•</span>
                                    </>
                                )}
                                
                            </>
                        )}

                        {/* Umumiy vaqt */}
                        <i className="fas fa-calendar-alt"></i>
                        <span>
                            {timeAgo(notification.created_at)}
                        </span>
                      </p>
                    </div>

                    {/* Actions and Status */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      {!notification.is_read && ( // Agar o'qilmagan bo'lsa, o'qildi deb belgilash tugmasi
                        <button
                          onClick={() => markNotificationAsReadAction(notification.id)}
                          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center font-medium"
                          title="O'qildi deb belgilash"
                        >
                          <i className="fas fa-check mr-1"></i> O'qildi
                        </button>
                      )}
                      
                      {/* Status indicator */}
                      {!notification.is_read ? (
                        <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse mt-auto" title="Yangi bildirishnoma"></span>
                      ) : (
                         <span className="text-xs text-gray-500 mt-auto">O'qilgan</span>
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
                <p>Hozircha {filter === 'unread' ? 'o\'qilmagan' : filter === 'read' ? 'o\'qilgan' : ''} bildirishnomalar yo'q.</p>
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