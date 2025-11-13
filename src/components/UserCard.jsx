import React from 'react'
import { FaSearch, FaChevronLeft, FaChevronRight, FaStar, FaCoins } from 'react-icons/fa'; // React Icons kutubxonasidan foydalanamiz
import UserImage from '../assests/userImage.jpeg'
import { Link } from 'react-router-dom';

const UserCard = ({user, index}) => {


    const getSkillColor = (skill) => {
            switch (skill.toLowerCase()) {
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
  return (
   <div
        key={user?.id}
        className="user-card flex flex-col items-center bg-gray-900 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 relative px-6 pb-8 pt-24 border border-gray-800 animate-fade-in-up transform-gpu"
        style={{ animationDelay: `${index * 80}ms` }}
    >
        <img
            src={user?.image ? user.image : UserImage}
            alt={user?.username}
            className="w-32 h-32 rounded-full border-4 border-indigo-600 absolute -top-16 shadow-lg object-cover"
        />
        <div className="mt-4 text-center">
            <h3 className="text-2xl font-bold text-white mb-1">{user?.username}</h3>
            <p className="text-indigo-400 font-medium text-lg mb-4">{user?.skill_level}</p>
            
            <div className="flex justify-center gap-8 mt-4 text-sm border-t border-b border-gray-700 py-4 mb-4 w-full">
                <div className="flex items-center gap-2">
                    <FaStar className="text-yellow-400 text-xl" />
                    <div>
                        <p className="font-bold text-lg text-white">{user?.rating}</p>
                        <p className="text-gray-500 text-xs uppercase">Reyting</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <FaCoins className="text-amber-400 text-xl" />
                    <div>
                        <p className="font-bold text-lg text-white">{user?.coin}</p>
                        <p className="text-gray-500 text-xs uppercase">Coin</p>
                    </div>
                </div>
            </div>

            <div className="w-full">
                <p className="text-sm text-gray-500 mb-3 font-semibold uppercase tracking-wide">Asosiy Ko'nikmalar</p>
                <div className="flex flex-wrap gap-2 justify-center">
                    {user?.skills.map(skill => (
                        <span key={skill} className={`${getSkillColor(skill)} text-xs font-semibold px-3 py-1 rounded-full shadow-md`}>
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        </div>
        <Link
        to = {`/${user?.username}/profile/`}
         className={`mt-8 w-full bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-semibold py-3 rounded-xl transition-all duration-300 text-center shadow-lg transform hover:-translate-y-0.5`}>
            Profilni Ko'rish
        </Link>
    </div>
  )
}

export default UserCard