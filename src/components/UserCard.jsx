import React from 'react'
import { FaStar, FaCoins } from 'react-icons/fa';
import UserImage from '../assests/userImage.jpeg'
import { Link } from 'react-router-dom';

const UserCard = ({ user, isLoading, index }) => {

    const getSkillColor = (skill) => {
        switch (skill?.toLowerCase()) {
            case 'python': return 'bg-sky-500/10 text-sky-400';
            case 'django': return 'bg-orange-500/10 text-orange-400';
            case 'docker': return 'bg-blue-500/10 text-blue-400';
            case 'fastapi': return 'bg-green-500/10 text-green-400';
            case 'js': return 'bg-yellow-500/10 text-yellow-400';
            case 'react': return 'bg-cyan-500/10 text-cyan-400';
            case 'tailwind': return 'bg-teal-500/10 text-teal-400';
            case 'figma': return 'bg-pink-500/10 text-pink-400';
            case 'adobe xd': return 'bg-purple-500/10 text-purple-400';
            case 'aws': return 'bg-amber-500/10 text-amber-400';
            case 'kubernetes': return 'bg-indigo-500/10 text-indigo-400';
            case 'terraform': return 'bg-gray-500/10 text-gray-400';
            case 'pandas': return 'bg-lime-500/10 text-lime-400';
            case 'machine learning': return 'bg-red-500/10 text-red-400';
            case 'flutter': return 'bg-blue-600/10 text-blue-500';
            case 'dart': return 'bg-cyan-600/10 text-cyan-500';
            case 'firebase': return 'bg-orange-600/10 text-orange-500';
            case 'node.js': return 'bg-green-600/10 text-green-500';
            case 'mongodb': return 'bg-emerald-600/10 text-emerald-500';
            default: return 'bg-gray-500/10 text-gray-400';
        }
    };

    // --- SKELETON LOADER ---
    if (isLoading) {
        return (
            <div className="flex flex-col items-center bg-gray-900 rounded-3xl px-4 pb-6 pt-16 border border-gray-800 animate-pulse">
                <div className="w-20 h-20 rounded-full bg-gray-700 absolute -top-10" />
                <div className="w-3/4 h-5 bg-gray-700 rounded-full mb-2 mt-2" />
                <div className="w-1/2 h-4 bg-gray-800 rounded-full mb-4" />
                <div className="w-full h-16 bg-gray-800 rounded-xl mb-4" />
                <div className="w-full h-10 bg-gray-700 rounded-xl" />
            </div>
        );
    }

    const visibleSkills = user?.skills?.slice(0, 3) || [];
    const extraSkills = (user?.skills?.length || 0) - 3;

    return (
        <div className="group relative flex flex-col items-center bg-gray-900 rounded-3xl shadow-xl hover:shadow-indigo-500/10 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 px-4 pb-6 pt-16 border border-gray-800 hover:border-indigo-500/40">
            
            {/* Avatar */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-indigo-500/30 blur-lg group-hover:bg-indigo-500/50 transition-all duration-500" />
                    <img
                        src={user?.image || UserImage}
                        alt={user?.username}
                        className="relative w-20 h-20 rounded-full border-4 border-indigo-600 object-cover shadow-lg"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="text-center w-full mt-2">
                <h3 className="text-base font-black text-white mb-0.5 truncate uppercase group-hover:text-indigo-400 transition-colors">
                    {user?.username || "Anonymous"}
                </h3>
                <p className="text-indigo-400 font-semibold text-xs mb-4">
                    {user?.skill_level || "Member"}
                </p>

                {/* Rating & Coins */}
                <div className="flex justify-around items-center py-3 border-y border-gray-800 w-full mb-4">
                    <div className="flex items-center gap-1.5">
                        <FaStar className="text-yellow-400 text-sm" />
                        <div>
                            <p className="font-black text-sm text-white leading-tight">
                                {Number(user?.total_rating || 0).toFixed(1)}
                            </p>
                            <p className="text-gray-500 text-[9px] uppercase tracking-wider">Reyting</p>
                        </div>
                    </div>
                    <div className="w-px h-8 bg-gray-800" />
                    <div className="flex items-center gap-1.5">
                        <FaCoins className="text-amber-400 text-sm" />
                        <div>
                            <p className="font-black text-sm text-white leading-tight">
                                {user?.coins || 0}
                            </p>
                            <p className="text-gray-500 text-[9px] uppercase tracking-wider">Coin</p>
                        </div>
                    </div>
                </div>

                {/* Skills - max 3 ta + extra badge */}
                <div className="w-full mb-5 min-h-[48px]">
                    <p className="text-[9px] text-gray-600 mb-2 font-bold uppercase tracking-widest">Ko'nikmalar</p>
                    <div className="flex flex-wrap gap-1 justify-center">
                        {visibleSkills.map(skill => (
                            <span
                                key={skill}
                                className={`${getSkillColor(skill)} text-[10px] font-semibold px-2 py-0.5 rounded-full`}
                            >
                                {skill}
                            </span>
                        ))}
                        {extraSkills > 0 && (
                            <span className="bg-gray-700/50 text-gray-400 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                                +{extraSkills}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <Link
                to={`/profile/${user?.username}`}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white font-bold py-2.5 rounded-xl transition-all duration-300 text-center text-xs uppercase tracking-widest shadow-lg"
            >
                Profilni Ko'rish
            </Link>
        </div>
    );
};

export default UserCard;