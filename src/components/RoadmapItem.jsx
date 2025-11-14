import React from 'react';
import { useSelector } from 'react-redux';
import { formatPrettyDate } from '../utils/formatDate';
import { getRoadmapColorClass, getRoadmapInnerColorClass } from '../utils/colorUtils'; 

// ... (getRoadmapStyle va colorClassMap avvalgidek qoladi) ...
const getRoadmapStyle = (type) => {
    switch (type) {
        case 'learning':
            return { icon: 'fa-solid fa-graduation-cap', colorName: 'indigo' };
        case 'experience':
             return { icon: 'fa-solid fa-laptop-code', colorName: 'teal' };
        default:
            return { icon: 'fa-solid fa-circle-info', colorName: 'gray' };
    }
};

const colorClassMap = {
    'indigo': 'text-indigo-400',
    'teal': 'text-teal-400',
    'yellow': 'text-yellow-400',
    'blue': 'text-blue-400',
    'gray': 'text-gray-400',
};

const selectAuthUsername = (state) => state.auth.user?.username;

// Yangi prop: onToggleLike - Like tugmasini bosganda chaqiriladigan funksiya
const RoadmapItem = ({ event, index, onEdit, onDelete, onToggleLike }) => { 
    // Mavjud foydalanuvchining username'ini olish
    const currentUsername = useSelector(selectAuthUsername);
    // Roadmap egasi va joriy foydalanuvchi bir xilligini tekshirish
    const isOwner = currentUsername === event.profile.username;
    const isAuthenticated = !!currentUsername; // Foydalanuvchi tizimga kirganmi
    
    const { icon: eventIcon, colorName } = getRoadmapStyle(event.type);
    const iconColorClass = colorClassMap[colorName] || 'text-gray-400';
    
    const dateDisplay = event.finished_at_display && event.finished_at_display !== "Hali tugallanmagan"
        ? `${formatPrettyDate(event.started_at)} - ${formatPrettyDate(event.finished_at)}`
        : `${formatPrettyDate(event.started_at)} - ${event.finished_at_display}`;
    
    // Back-end tomonidan keladigan Like holatlari (faraz qilinadi)
    const likeCount = event.like_count || 0;
    const isLiked = event.is_liked || false; // Joriy foydalanuvchi yoqtirganmi

    return (
        <div 
            className="relative mb-8 pl-12 fade-in group" 
            style={{ animationDelay: `${100 * (index + 1)}ms` }}
        >
            {/* Marker va ichki doira */}
            <div className={`absolute left-0 top-1.5 flex items-center justify-center w-8 h-8 ${getRoadmapColorClass(colorName)} rounded-full ring-2 ring-gray-800 transition-all group-hover:ring-indigo-500`}>
                <div className={`w-4 h-4 ${getRoadmapInnerColorClass(colorName)} rounded-full border-2 border-gray-800`}></div>
            </div>
            
            {/* Sarlavha, Ikonka va Tahrirlash Tugmalari bir qatorda */}
            <div className="flex items-start justify-between gap-4"> 
                <div className="flex items-start gap-4 flex-1"> {/* flex-1 asosiy kontentga ko'proq joy beradi */}
                    {/* Ikonka */}
                    <i className={`${eventIcon} text-3xl ${iconColorClass} pt-1`}></i> 
                    <div>
                        {/* Vaqtni ko'rsatish */}
                        <p className="text-sm text-gray-400">{dateDisplay}</p> 
                        {/* Sarlavha */}
                        <h4 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{event.title}</h4>
                    </div>
                </div>

                {/* Tahrirlash va O'chirish tugmalari (faqat egasi uchun) */}
                {isOwner && (
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity pt-1">
                        <button 
                            onClick={() => onEdit(event)}
                            className="text-gray-400 hover:text-yellow-500 p-1 rounded-full transition-colors"
                            title="Tahrirlash"
                        >
                            <i className="fa-solid fa-pen-to-square text-lg"></i>
                        </button>
                        <button 
                            onClick={() => onDelete(event)} 
                            className="text-gray-400 hover:text-red-500 p-1 rounded-full transition-colors"
                            title="O'chirish"
                        >
                            <i className="fa-solid fa-trash-can text-lg"></i>
                        </button>
                    </div>
                )}
            </div>
            
            {/* Tavsif */}
            <p className="mt-2 text-gray-300">{event.description}</p>
            
            {/* ============================================================= */}
            {/* YANGI JOY: Like Tugmasi (Tavsifdan keyin) */}
            {/* ============================================================= */}
            <div className="flex justify-end mt-3 border-t border-gray-700 pt-3">
                <div className="flex items-center">
                    <span className="text-sm font-semibold mr-1.5" style={{ color: isLiked ? '#ef4444' : '#9ca3af' }}>
                        {likeCount}
                    </span>
                    <button
                        onClick={() => isAuthenticated && onToggleLike(event.id)} // Tizimga kirgan bo'lsa, ishga tushirish
                        disabled={!isAuthenticated}
                        className={`p-1.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                            isLiked ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-400'
                        }`}
                        title={isAuthenticated ? (isLiked ? "Yoqtirmaslik" : "Yoqtirish") : "Yoqtirish uchun tizimga kiring"}
                    >
                        <i className={`fa-heart ${isLiked ? 'fa-solid' : 'fa-regular'} text-xl`}></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoadmapItem;