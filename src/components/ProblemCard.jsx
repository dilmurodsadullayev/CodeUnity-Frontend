import React from 'react'
import UserImage from '../assests/userImage.jpeg';
import { Link } from 'react-router-dom';

const ProblemCard = ({id, username, firstName, lastName, image, name, status, views, languages, createdAt, star, responseCount}) => {

    function timeAgo(createdAt) {
        const now = new Date();
        const created = new Date(createdAt);

        const diffMs = now - created; // millisekund farq
        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffDays > 0) {
            return diffDays === 1
                ? "1 kun oldin"
                : `${diffDays} kun oldin`;
        } else if (diffHours > 0) {
            return diffHours === 1
                ? "1 soat oldin"
                : `${diffHours} soat oldin`;
        } else if (diffMinutes > 0) {
            return diffMinutes === 1
                ? "1 daqiqa oldin"
                : `${diffMinutes} daqiqa oldin`;
        } else {
            return "hozirgina";
        }
    }

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <Link to={`/problem/${id}/detail`} className="problem-card-v2 p-6 flex flex-col h-full bg-gray-800 rounded-lg shadow-xl border border-gray-700 hover:border-indigo-600 hover:shadow-2xl transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">

                <img
                src={image ? image : UserImage}
                alt="User avatar"
                className="w-10 h-10 rounded-full border-2 border-gray-600 group-hover:border-indigo-500 transition-colors duration-300 object-cover"
                />                <div>
                  {firstName && lastName ? (
                    <h4 className="font-semibold text-white">${firstName} ${lastName}</h4>
                    ) : (
                    <h4 className="font-semibold text-white">{username}</h4>
                    )}

                
                <p className="text-xs text-gray-500">{timeAgo(createdAt)}</p>
                </div>
            </div>
            <span className="text-xs font-bold py-1 px-3 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">{status}</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors duration-300">{name}</h3>
            <div className="flex-grow"></div>
            <div className="flex flex-wrap gap-2 mb-5">
                {languages?.map((language) => (
                    <span className="bg-red-500/10 text-red-400 text-xs font-semibold px-2 py-1 rounded-full border border-red-500/20">{language.name}</span>
                ))}
            </div>
            <div className="border-t border-gray-700 pt-4 flex justify-between items-center text-sm text-gray-400">
            <div className="flex gap-4">
                <span><i className="fas fa-eye mr-1"></i> {views ? views: 0}</span>
                <span><i className="fas fa-comment-alt mr-1.5 text-indigo-400"></i> {responseCount}</span>
                <span><i className="fas fa-star mr-1.5 text-yellow-400"></i> {star}</span>
            </div>
            <span className="font-semibold text-indigo-400 group-hover:text-white transition-colors duration-300">Yechimni ko'rish <i className="fas fa-arrow-right ml-1"></i></span>
            </div>
        </Link>
        </div>
  )
}

export default ProblemCard