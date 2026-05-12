import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { 
    faSpinner, 
    faExclamationTriangle, 
    faChevronLeft, 
    faChevronRight, 
    faArrowUp, 
    faArrowDown,
} from '@fortawesome/free-solid-svg-icons'; 
import CoinService from '../services/coin';
import { getCoinFailure, getCoinStart, getCoinSuccess } from '../features/coins'; 
import { COIN_STATUS_MAP } from './CoinHistoryMap'; 

// Rasm
import FCoinIcon from '../assests/coin/fcoin.png';

import './FCoinHistory.css'; 
import { motion } from 'framer-motion'; 
import timeAgo from '../utils/timeAgo';

const FCoinHistory = () => {
    const dispatch = useDispatch();
    
    // User ma'lumotlarini auth state-dan olamiz (bu aniqroq)
    const { user: authUser } = useSelector((state) => state.auth);
    const { 
        coins, 
        isLoading, 
        error,
        count, 
        currentPage, 
        pageSize, 
    } = useSelector((state) => state.coin);

    // Ism va jami coinlar
    const username = authUser?.username || (coins.length > 0 ? coins[0].user.username : 'FSociety');
    const totalCoins = authUser?.coins ?? (coins.length > 0 ? coins[0].user.coins : 0);

    const totalPages = Math.ceil(count / pageSize);

    const getCoin = async (page = 1, size = pageSize) => { 
        dispatch(getCoinStart({ page, pageSize: size }));
        try {
            const response = await CoinService.getCoins(page, size); 
            dispatch(getCoinSuccess(response)); 
        } catch (err) {
            console.error("Coin tarixi olishda xato:", err);
            dispatch(getCoinFailure(err.message));
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            getCoin(newPage);
        }
    };

    useEffect(() => {
        getCoin(currentPage, pageSize); 
    }, []); 

    const PaginationControls = () => {
        if (totalPages <= 1 || isLoading) return null; 

        const btnClass = "px-4 py-2 rounded-lg font-semibold transition duration-300 border border-indigo-600 shadow-lg";
        const inactiveBtn = "bg-gray-700 text-gray-300 hover:bg-indigo-500/50 hover:border-indigo-500";
        const disabledBtn = "bg-gray-800 text-gray-500 cursor-not-allowed border-gray-700 opacity-60";

        return (
            <div className="flex justify-center items-center space-x-4 mt-10 pb-10">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`${btnClass} ${currentPage === 1 ? disabledBtn : inactiveBtn}`}
                >
                    <FontAwesomeIcon icon={faChevronLeft} className="mr-2" /> Oldingi
                </motion.button>
                
                <span className="text-white px-4 py-2 text-lg font-bold bg-gray-800 rounded-lg shadow-inner">
                    {currentPage} / {totalPages}
                </span>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`${btnClass} ${currentPage === totalPages ? disabledBtn : inactiveBtn}`}
                >
                    Keyingi <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
                </motion.button>
            </div>
        );
    };

    const getCoinDetails = (item) => {
        const map = COIN_STATUS_MAP[item.status] || COIN_STATUS_MAP.other;
        const description = item.reason || map.text;
        const icon = map.icon;
        const color = map.color;
        const type = item.amount > 0 ? 'earn' : 'spend'; 
        
        return { description, icon, color, type };
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <main className="container mx-auto px-4 py-16">
            <section className="text-center pt-8 pb-12">
                {/* Ismni ko'rinmay qolishi to'g'irlangan qism */}
                <h1 className="text-5xl md:text-6xl font-black text-white mt-4 animate-slide-in-up">
                    <span className="text-yellow-500">
                        {username}
                    </span> FCoin Tarixi
                </h1>
                
                <div className="flex flex-col items-center mt-6 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                    <p className="text-lg text-gray-400">Jami hisobingiz:</p>
                    <div className="flex items-center gap-3 bg-gray-800/40 border border-gray-700 px-6 py-2 rounded-2xl mt-2">
                        <span className="text-yellow-500 font-black text-4xl tracking-tighter">
                            {totalCoins}
                        </span>
                        <img 
                            src={FCoinIcon} 
                            alt="FCoin" 
                            className="h-10 w-10 object-contain drop-shadow-[0_0_12px_rgba(234,179,8,0.5)]" 
                        />
                    </div>
                </div>
            </section>

            {isLoading && (
                <p className="text-center text-indigo-400 mt-8 text-xl">
                    <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> Ma'lumotlar yuklanmoqda...
                </p>
            )}

            {error && (
                <p className="text-center text-red-500 mt-8 text-xl">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" /> Xato: {error}
                </p>
            )}

            {!isLoading && !error && (
                <motion.div 
                    className="grid grid-cols-1 gap-4 max-w-4xl mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {coins.map((item) => {
                        const { description, icon, color, type } = getCoinDetails(item);
                        const borderColor = type === 'earn' ? 'border-green-500' : 'border-purple-500';

                        return (
                            <motion.div
                                key={item.id} 
                                variants={itemVariants} 
                                className={`relative p-5 rounded-2xl bg-gray-800/50 border-l-4 ${borderColor} backdrop-blur-sm shadow-xl transition-all hover:scale-[1.02] hover:bg-gray-800/80`}
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-5">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl 
                                            ${type === 'earn' ? 'bg-green-500/10 text-green-400' : 'bg-purple-500/10 text-purple-400'} border border-gray-700/50`}>
                                            <FontAwesomeIcon icon={icon} /> 
                                        </div>
                                        
                                        <div>
                                            <p className="text-lg font-bold text-white leading-tight">{description}</p>
                                            <p className="text-sm text-gray-500 mt-1 font-medium italic">
                                                {timeAgo(item.created_at)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <span className={`text-2xl font-black ${color} flex items-center justify-end`}>
                                                <FontAwesomeIcon 
                                                    icon={type === 'earn' ? faArrowUp : faArrowDown} 
                                                    className="text-xs mr-2 opacity-70"
                                                />
                                                {item.amount > 0 ? '+' : ''}{item.amount}
                                            </span>
                                        </div>
                                        <img 
                                            src={FCoinIcon} 
                                            alt="coin" 
                                            className="h-8 w-8 object-contain drop-shadow-[0_0_5px_rgba(234,179,8,0.3)]" 
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                    
                    {coins.length === 0 && !isLoading && !error && (
                        <div className="text-center py-20 bg-gray-800/20 rounded-3xl border border-dashed border-gray-700">
                            <p className="text-gray-500 text-xl font-medium">Hali tranzaksiyalar mavjud emas.</p>
                        </div>
                    )}
                </motion.div>
            )}

            <PaginationControls />
        </main>
    );
};

export default FCoinHistory;