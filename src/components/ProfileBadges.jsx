import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion'; // Animatsiyalar uchun
import { Award, Calendar, ShieldCheck } from 'lucide-react'; // Iconlar
import { getBadgesStart, getBadgesSuccess, getBadgesFailure } from '../features/badge';
import BadgeService from '../services/badge';
import { formatPrettyDate } from '../utils/formatDate';

const ProfileBadges = ({ username }) => {
    const dispatch = useDispatch();
    const { userBadges, isLoading } = useSelector((state) => state.badge || {});

    useEffect(() => {
        const fetchBadges = async () => {
            dispatch(getBadgesStart());
            try {
                const response = await BadgeService.getUserBadges(username);
                dispatch(getBadgesSuccess(response));
            } catch (err) {
                dispatch(getBadgesFailure(err.message));
            }
        };
        if (username) fetchBadges();
    }, [username, dispatch]);

    if (isLoading) {
        return (
            <div className="bg-gray-800/50 p-6 rounded-3xl border border-gray-700 animate-pulse">
                <div className="h-8 w-40 bg-gray-700 rounded-lg mb-6"></div>
                <div className="grid grid-cols-1 gap-4">
                    {[1, 2].map(i => <div key={i} className="h-24 bg-gray-700/50 rounded-2xl"></div>)}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-800/40 backdrop-blur-md p-6 rounded-3xl border border-gray-700/50 shadow-2xl relative overflow-hidden">
            {/* Fon uchun estetik neon nur */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl"></div>
            
            <div className="flex justify-between items-center mb-8 relative z-10">
                <h3 className="text-2xl font-black text-white flex items-center tracking-tight">
                    <div className="p-2.5 bg-yellow-500/20 rounded-xl mr-4 shadow-inner">
                        <Award className="text-yellow-500" size={28} />
                    </div>
                    Nishonlar
                </h3>
                <span className="bg-indigo-500/20 text-indigo-300 text-xs font-black px-4 py-1.5 rounded-full border border-indigo-500/30 tracking-widest uppercase">
                    {userBadges?.length || 0} TA
                </span>
            </div>

            {userBadges && userBadges.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 relative z-10">
                    {userBadges.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.15 }}
                            whileHover={{ scale: 1.02 }}
                            className="group flex items-center p-0 rounded-2xl bg-gray-900/40 border border-gray-700/50 hover:border-indigo-500/50 hover:bg-gray-800/60 transition-all duration-500 overflow-hidden shadow-lg"
                        >
                            {/* NISHON RASMI - Kvadratni to'liq to'ldiradi */}
                            <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 overflow-hidden border-r border-gray-700/50">
                                {item.badge.image ? (
                                    <img 
                                        src={item.badge.image} 
                                        alt={item.badge.name} 
                                        className="w-full h-full object-cover transform group-hover:scale-115 transition-transform duration-700 ease-in-out"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                        <ShieldCheck className="text-gray-600" size={40} />
                                    </div>
                                )}
                                {/* Rasm ustidagi yengil gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>

                            {/* MA'LUMOTLAR QISMI */}
                            <div className="p-4 flex-grow">
                                <h4 className="text-lg sm:text-xl font-black text-white group-hover:text-indigo-300 transition-colors leading-tight">
                                    {item.badge.name}
                                </h4>
                                
                                <div className="flex items-center mt-2 text-gray-300 bg-gray-700/40 w-fit px-2.5 py-1 rounded-lg border border-gray-600/30">
                                    <Calendar size={14} className="mr-2 text-indigo-400" />
                                    <span className="text-[11px] font-bold uppercase tracking-wider">
                                        {formatPrettyDate(item.awarded_at)} olingan
                                    </span>
                                </div>

                                <p className="text-xs sm:text-sm text-gray-400 mt-2.5 font-medium line-clamp-1 group-hover:line-clamp-none transition-all duration-300">
                                    {item.badge.description || "Ushbu yutuq haqida ma'lumot mavjud emas."}
                                </p>
                            </div>

                            {/* O'ng tarafdagi indikator */}
                            <div className="w-1 h-full bg-transparent group-hover:bg-indigo-500 transition-all duration-500 shadow-[0_0_15px_rgba(99,102,241,0.8)]"></div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-14 bg-gray-900/30 rounded-3xl border-2 border-dashed border-gray-700/50">
                    <div className="inline-flex p-5 bg-gray-800/80 rounded-full mb-4 shadow-xl">
                        <ShieldCheck className="text-gray-600" size={48} />
                    </div>
                    <p className="text-gray-500 font-bold text-lg">Hali nishonlar mavjud emas</p>
                    <p className="text-gray-600 text-sm">Faol bo'ling va ilk nishoningizni qo'lga kiriting!</p>
                </div>
            )}
        </div>
    );
};

export default ProfileBadges;