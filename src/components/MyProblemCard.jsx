// src/components/MyProblemCard.jsx

import React from 'react';
import UserImage from '../assests/userImage.jpeg'; // Agar bu joylashuv to'g'ri bo'lsa
import { Link } from 'react-router-dom';
import { limitText } from '../utils/limitText'; // limitText utilitasi mavjud deb hisoblaymiz
import timeAgo from '../utils/timeAgo';

const MyProblemCard = ({
    id, 
    username, 
    firstName, 
    lastName, 
    image, 
    name, 
    status, 
    views, 
    languages, 
    createdAt, 
    star, 
    responseCount,
    deadline, // ⭐ YANGI: Deadline
    isUrgent // Agar is_urgent kelsa, uni ham ishlatamiz (sizning API javobingizda mavjud)
}) => {

    
    // ⭐ YANGI: Deadline qolgan vaqtni hisoblash
    const getDeadlineText = (deadline) => {
        if (!deadline) return null;

        const now = new Date();
        const deadlineDate = new Date(deadline);
        const diffMs = deadlineDate - now;

        if (diffMs < 0) return { text: "Muddati tugagan", color: "text-red-500" };

        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffDays > 0) {
            return { text: `${diffDays} kun qoldi`, color: "text-yellow-400" };
        } else if (diffHours > 0) {
            return { text: `${diffHours} soat qoldi`, color: "text-yellow-500" };
        } else {
            return { text: `${diffMinutes} daqiqa qoldi`, color: "text-red-500" };
        }
    };

    const deadlineInfo = getDeadlineText(deadline);

    return (
        <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Link 
                to={`/problem/${id}/detail`} 
                // Card dizaynini Mening Muammolarim sahifasiga moslashtiramiz
                className="my-problem-card p-6 flex flex-col h-full bg-gray-800 rounded-xl shadow-xl border-2 border-purple-700/50 hover:border-pink-600 hover:shadow-2xl transition-all duration-300 group"
            >
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <img
                            src={image || UserImage}
                            alt="User avatar"
                            className="w-10 h-10 rounded-full border-2 border-purple-600 group-hover:border-pink-500 transition-colors duration-300 object-cover"
                        />                
                        <div>
                            {firstName && lastName ? (
                                <h4 className="font-semibold text-white">{firstName} {lastName}</h4>
                            ) : (
                                <h4 className="font-semibold text-white">{username}</h4>
                            )}
                            <p className="text-xs text-gray-500">{timeAgo(createdAt)}</p>
                        </div>
                    </div>
                    {/* Status va Tezkor yorliq */}
                    <div className="flex flex-col items-end space-y-1">
                        <span className={`text-xs font-bold py-1 px-3 rounded-full ${
                            status ? "bg-green-500/20 text-green-300 border border-green-500/30" : "bg-red-500/20 text-red-300 border border-red-500/30"
                        }`}>
                            {status ? "Yechilgan" : "Yechilmagan"}
                        </span>
                        {isUrgent && (
                            <span className="text-xs font-bold py-1 px-3 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                                Tezkor!
                            </span>
                        )}
                    </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-pink-400 transition-colors duration-300">{limitText(name)}</h3>
                
                {/* ⭐ YANGI: Deadline Bloki */}
                {deadlineInfo && (
                    <div className={`flex items-center space-x-2 text-sm font-semibold mb-3 p-2 rounded-lg bg-gray-700/50 ${deadlineInfo.color}`}>
                        <i className="fas fa-hourglass-half"></i>
                        <span>{deadlineInfo.text}</span>
                    </div>
                )}
                
                <div className="flex-grow"></div>
                
                {/* Tillar ro'yxati (Rangni MyProblems'ga moslashtiramiz) */}
                <div className="flex flex-wrap gap-2 mb-5">
                    {languages?.map((language, index) => (
                        <span key={index} className="bg-purple-500/10 text-purple-400 text-xs font-semibold px-2 py-1 rounded-full border border-purple-500/20">
                            {language.name}
                        </span>
                    ))}
                </div>
                
                <div className="border-t border-gray-700 pt-4 flex justify-between items-center text-sm text-gray-400">
                    <div className="flex gap-4 items-center">
                        <span title="Ko'rishlar soni"><i className="fas fa-eye mr-1"></i> {views || 0}</span>
                        <span title="Yulduzlar soni"><i className="fas fa-star mr-1.5 text-yellow-400"></i> {star || 0}</span>
                        
                        {/* ⭐ YANGI: Katta va ko'zga tashlanadigan Javoblar soni */}
                        <div className="flex items-center text-pink-400 font-bold ml-2 py-1 px-3 rounded-full bg-pink-600/20 border border-pink-500/50" title="Yechimlar soni">
                            <i className="fas fa-comments mr-2 text-lg"></i>
                            <span className="text-lg">{responseCount}</span>
                        </div>
                    </div>
                    <span className="font-semibold text-pink-400 group-hover:text-white transition-colors duration-300">
                        Batafsil <i className="fas fa-arrow-right ml-1"></i>
                    </span>
                </div>
            </Link>
        </div>
    );
}

export default MyProblemCard;