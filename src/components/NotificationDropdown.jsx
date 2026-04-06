// src/components/NotificationDropdown.jsx (Dizayn WOW versiyasi)

import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import PlaceholderUserImage from '../assests/userImage.jpeg'; // A new placeholder for notification avatars
import { timeUntilDeadline } from '../utils/timeUntilDeadline'; // timeUntilDeadline funksiyasi
import { markNotificationAsRead, markAllNotificationsAsRead } from '../middleware/notificationMiddleware'; 

// Constants
const baseUrl = "http://127.0.0.1:8000";

const dropdownVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15, ease: "easeIn" } },
};

// Notification Item uchun alohida kichik komponent (rasmdagi dizaynga o'xshatildi)
const NotificationItem = ({ notification, handleMarkOneAsRead }) => {
  // notification.problem?.problem - vazifa nomini olish uchun kutiladi
  const problemTitle = notification.problem?.problem || 'Noma\'lum vazifa'; 
  const senderUsername = notification.sender?.username || 'Noma\'lum';
  const createdAt = new Date(notification.created_at);
  // notification.problem?.id - vazifaning ID'sini olish uchun kutiladi
  const problemId = notification.problem?.id || notification.id; // object_id ni zaxira sifatida ishlatamiz
  console.log("notification ", notification)

  const imageSrc = notification.sender?.image 
    ? `${baseUrl}${notification.sender.image}` 
    : PlaceholderUserImage;
    
  let typeIcon = 'fas fa-info-circle';
  let typeText = notification.message || 'Yangi bildirishnoma';
  let problemUrl = problemId ? `/problem/${problemId}/detail` : '/problems';

  // notification.type asosida ikonka va matnni belgilash
  if (notification.type === "problem_assigned" || notification.type === "problem_urgent") {
    typeIcon = 'fas fa-clipboard-check';
    typeText = `Yangi vazifa: Sizga "${problemTitle}" vazifasi yuklatildi.`;
  } else if (notification.type === "problem_completed") {
    typeIcon = 'fas fa-check-circle';
    typeText = `Hal qilindi: "${problemTitle}" hal qilindi.`;
  } else if (notification.type === "new_feedback") {
    typeIcon = 'fas fa-comment-dots';
    typeText = `Yangi fikr: "${problemTitle}" bo'yicha yangi fikr keldi.`;
  } else if (notification.content_type === "problem") {
    // Agar type bo'lmasa, content_type "problem" bo'lsa (yangi muammo joylandi)
    typeIcon = 'fas fa-plus-square';
    // message: "Yangi muammo joylandi: Muammo 6"
    const titleMatch = notification.message.match(/:\s*(.*)/);
    const inferredTitle = titleMatch ? titleMatch[1].trim() : problemTitle;
    typeText = notification.message; // Asl xabarni qoldiramiz
  } else if (notification.content_type === "star") {
    // Agar content_type "star" bo'lsa (star berildi)
    typeIcon = 'fas fa-star text-yellow-400';
    typeText = notification.message; // Asl xabarni qoldiramiz
  }
  
  const isUnread = !notification.is_read;
  
  // Link bosilganda ham o'qildi deb belgilanishi uchun Link'ni o'rab oldik
  return (
    <Link 
      to={problemUrl} // Problem detal sahifasiga o'tish
      className={`relative flex items-start gap-3 px-4 py-3 border-b border-gray-700 last:border-b-0 transition-all duration-200 ${
        isUnread ? 'bg-indigo-900/40 hover:bg-indigo-900/60' : 'hover:bg-gray-700/50'
      }`}
      onClick={() => handleMarkOneAsRead(notification.id)} // Link bosilganda o'qildi deb belgilash
    >
      {/* Notification User Image */}
      <img
        src={imageSrc}
        alt="User"
        className="h-10 w-10 rounded-full object-cover flex-shrink-0 mt-0.5 border-2 border-indigo-400/50"
      />

      <div className="flex-grow">
        {/* Yuqori qator: Icon + Xabar matni */}
        <p className="text-sm font-semibold text-white mb-1 leading-tight pr-4"> 
          <span className={`${typeIcon.includes('text-yellow') ? '' : 'text-indigo-400'} mr-2`}><i className={typeIcon}></i></span>
          {typeText}
        </p>
        
        {/* Pastki qator: Detallar vaqt bilan */}
        {/* "problem_assigned", "problem_urgent" yoki "problem" turidagi xabarlar uchun */}
        {(notification.type === "problem_assigned" || notification.type === "problem_urgent" || notification.content_type === "problem") && (
          <div className="flex flex-col space-y-1 mt-1">
            {/* Kimdan/Coin/Deadline */}
            <p className="text-xs text-gray-300 flex items-center space-x-2">
              <span className="inline-flex items-center">
                <i className="fas fa-user mr-1 text-gray-400"></i>
                {senderUsername}
              </span>

              {/* offered_coins ni notification.offered_coins dan yoki notification.problem?.offered_coins dan olish */}
              {(notification.offered_coins || notification.problem?.offered_coins) && (
                  <span className="inline-flex items-center">
                    • <i className="fas fa-coins text-yellow-400 ml-2 mr-1"></i>
                    <span className="text-yellow-400 font-bold">{notification.offered_coins || notification.problem.offered_coins}</span>
                  </span>
              )}

              {/* deadline ni notification.deadline dan yoki notification.problem?.deadline dan olish */}
              {(notification.deadline || notification.problem?.deadline) && (
                  <span className="inline-flex items-center">
                    • <i className="fas fa-clock text-red-500 ml-2 mr-1"></i>
                    <span className="text-red-400">{timeUntilDeadline(notification.deadline || notification.problem.deadline)}</span>
                  </span>
              )}
            </p>

            {/* Vaqtni rasmga o'xshatib pastga joylashtirdik */}
            <span className="text-xs text-gray-500 block text-right">
                {createdAt.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })} - {createdAt.toLocaleDateString('uz-UZ')}
            </span>
          </div>
        )}
         {/* Boshqa turlarda faqat sender va vaqtni pastga joylashtirish */}
        {!(notification.type === "problem_assigned" || notification.type === "problem_urgent" || notification.content_type === "problem") && (
            <div className="flex flex-col space-y-1 mt-1">
                <p className="text-xs text-gray-300 flex items-center">
                    <i className="fas fa-user mr-1 text-gray-400"></i>
                    {senderUsername}
                    {/* problem_completed turida coins bor bo'lsa */}
                    {notification.type === "problem_completed" && notification.coins && (
                      <span className="inline-flex items-center ml-4">
                        <i className="fas fa-gift text-green-400 mr-1"></i> 
                        <span className="text-green-400 font-bold">{notification.coins} Coin berildi</span>
                      </span>
                    )}
                </p>
                <span className="text-xs text-gray-500 block text-right">
                    {createdAt.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })} - {createdAt.toLocaleDateString('uz-UZ')}
                </span>
            </div>
        )}
        
      </div>
      {/* O'qilmaganlik belgisi (Absolute pozitsiyada, rasmga o'xshatildi) */}
      {isUnread && (
        <span className="absolute top-4 right-3 h-2.5 w-2.5 rounded-full bg-indigo-500 flex-shrink-0"></span>
      )}
    </Link>
  );
};


const NotificationDropdown = ({ openNotifications, setOpenNotifications, notificationsRef }) => {
  const dispatch = useDispatch();
  // Redux store'dan bildirishnomalarni olish
  const { notifications } = useSelector((state) => state.notifications); 
  const unreadNotificationsCount = notifications.filter(n => !n.is_read).length; 

  const handleMarkOneAsRead = (notificationId) => {
    dispatch(markNotificationAsRead(notificationId)); 
  };
  
  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead()); 
  };
  
  // Eng oxirgi kelgan xabarni birinchi ko'rsatish uchun saralash
  const sortedNotifications = [...notifications].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  
  // Faqat o'qilmagan bildirishnomalar ro'yxati
  const unreadNotificationsList = sortedNotifications.filter(notification => !notification.is_read);


  return (
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
            className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-gray-800 border border-gray-700 rounded-md shadow-2xl z-20 notification-dropdown transform origin-top-right"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900/50">
              <h3 className="text-lg font-bold text-white flex items-center">
                Bildirishnomalar 
                {unreadNotificationsCount > 0 && (
                    <span className="text-sm text-indigo-400 ml-2 font-normal">({unreadNotificationsCount})</span>
                )}
              </h3>
              {/* Barchasini o'qildi qilish tugmasi */}
              {unreadNotificationsCount > 0 && (
                <button
                    onClick={handleMarkAllAsRead}
                    className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors flex items-center"
                    aria-label="Barchasini o'qildi qilish"
                >
                    <i className="fas fa-check-double mr-1"></i> Barchasi o'qildi
                </button>
              )}
            </div>
            
            <div className="py-1">
              {notifications.length === 0 ? ( // 1. Umumiy ro'yxat bo'sh bo'lsa
                <div className="px-4 py-6 text-center">
                  <i className="fas fa-box-open text-4xl text-gray-600 mb-2"></i> {/* Yangi ikonka */}
                  <p className="text-sm font-medium text-gray-400">
                    Hali bildirishnomalar mavjud emas.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Yangi vazifalar yoki fikrlar kelganda bu yerda ko'rinadi.
                  </p>
                </div>
              ) : unreadNotificationsList.length > 0 ? ( // 2. O'qilmaganlar bo'lsa, ularni ko'rsatamiz
                unreadNotificationsList.map(notification => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    handleMarkOneAsRead={handleMarkOneAsRead}
                  />
                ))
              ) : ( // 3. Bildirishnomalar bor, lekin hammasi o'qilgan
                <div className="px-4 py-6 text-center">
                  <i className="fas fa-check-circle text-4xl text-green-500/70 mb-2"></i> {/* Yangi ikonka */}
                  <p className="text-sm font-medium text-gray-400">
                    Barcha bildirishnomalar o'qilgan.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Yangi xabarlar kelishini kuting.
                  </p>
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-2 border-t border-gray-700 bg-gray-900/50">
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
  );
};

export default NotificationDropdown;