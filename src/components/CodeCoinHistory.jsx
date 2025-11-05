import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { 
    faSpinner, 
    faExclamationTriangle, 
    faChevronLeft, 
    faChevronRight, 
    faCoins, 
    faArrowUp, 
    faArrowDown,
    // Agar bu ikonalar COIN_STATUS_MAP da bo'lmasa, ularni bu yerga qo'shish kerak. 
    // Masalan: faComment, faGift, faRocket
} from '@fortawesome/free-solid-svg-icons'; 
import CoinService from '../services/coin';
import { getCoinFailure, getCoinStart, getCoinSuccess } from '../features/coins'; 
// UTILITY_ICONS o'rniga COIN_STATUS_MAP dagi ikonni ishlatamiz.
import { COIN_STATUS_MAP, UTILITY_ICONS } from './CoinHistoryMap'; 

import './CodeCoinHistory.css'; 
import { motion } from 'framer-motion'; 
import timeAgo from '../utils/timeAgo';

const CodeCoinHistory = () => {
    const dispatch = useDispatch();
    const { 
        coins, 
        isLoading, 
        error,
        count, 
        currentPage, 
        pageSize, 
    } = useSelector((state) => state.coin);

    // Namuna uchun: Siz buni o'z state'ingizdan olishingiz kerak
    const username = coins.length > 0 ? coins[0].user.username : '';
    const totalCoins = coins.length > 0 ? coins[0].user.coins : 0;

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

    // Paginatsiya Tugmalari Komponenti (o'zgarishsiz)
    const PaginationControls = () => {
        if (totalPages <= 1 || isLoading) {
            return null; 
        }

        const btnClass = "px-4 py-2 rounded-lg font-semibold transition duration-300 border border-indigo-600 shadow-lg";
        const inactiveBtn = "bg-gray-700 text-gray-300 hover:bg-indigo-500/50 hover:border-indigo-500";
        const disabledBtn = "bg-gray-800 text-gray-500 cursor-not-allowed border-gray-700 opacity-60";

        return (
            <div className="flex justify-center items-center space-x-4 mt-10">
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

    // Yordamchi funksiya: Sababni aniqlash (o'zgarishsiz)
    const getCoinDetails = (item) => {
        const map = COIN_STATUS_MAP[item.status] || COIN_STATUS_MAP.other;
        const description = item.reason || map.text;
        const icon = map.icon; // <-- Bu siz izlayotgan icon
        const color = map.color;
        const type = item.amount > 0 ? 'earn' : 'spend'; 
        
        return { description, icon, color, type };
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05 
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };


    return (
        <main className="container mx-auto px-4 py-16">
           <section className="text-center pt-8 pb-12">
            <h1 className="text-5xl md:text-6xl font-black text-white mt-4 animate-slide-in-up">
              <span style={{ background: 'linear-gradient(90deg, var(--gold), #ffbf44)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {username}
              </span> CodeCoin Tarixi
            </h1>
            
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mt-4 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
              Jami "CodeCoin"laringiz: 
              <span className="text-gold font-bold text-2xl ml-2 inline-flex items-center">
                  {totalCoins} 
                  <FontAwesomeIcon 
                    icon={faCoins} 
                    className="ml-2 text-yellow-400" 
                  />
              </span>
            </p>
          </section>

            {/* Yuklanish holati */}
            {isLoading && (
                <p className="text-center text-indigo-400 mt-8 text-xl">
                    <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> Coin tarixi yuklanmoqda...
                </p>
            )}

            {/* Xato holati */}
            {error && (
                <p className="text-center text-red-500 mt-8 text-xl">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" /> Xato yuz berdi: {error}
                </p>
            )}

            {/* Tarix Ro'yxati */}
            {!isLoading && !error && (
                <motion.div 
                    className="history-cards-wrapper grid grid-cols-1 gap-4 lg:gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {coins.map((item) => {
                        const { description, icon, color, type } = getCoinDetails(item);
                        
                        // Rasmda ko'rsatilgan kabi rangli borderlar uchun
                        const borderColor = type === 'earn' ? 'border-green-500' : 'border-purple-500';

                        return (
                            <motion.div
                                key={item.id} 
                                variants={itemVariants} 
                                // Border rangini o'zgartiramiz: rasmda chap tomonda 
                                className={`history-item relative p-4 rounded-xl shadow-xl transition duration-300 transform hover:scale-[1.01] bg-gray-800/80 border-l-4 ${borderColor}`}
                            >
                                <div className="flex items-center gap-4">
                                    {/* Rasmda ko'rsatilgan 'uch nuqta' joyi - Endi u yerdan COIN_STATUS_MAP dan kelayotgan icon ko'rinadi */}
                                    <div className={`icon w-14 h-14 rounded-full flex items-center justify-center text-xl shadow-inner 
                                        ${type === 'earn' ? 'bg-green-500/10 text-green-400' : 'bg-purple-500/10 text-purple-400'} border border-gray-700/50`}>
                                        
                                        {/* COIN_STATUS_MAP dan kelayotgan asosiy icon */}
                                        <FontAwesomeIcon icon={icon} /> 
                                    </div>
                                    
                                    <div className="flex-grow">
                                        {/* Birinchi qator: Sabab nomi / Sarlavha */}
                                        <p className="text-lg font-semibold text-white">{description}</p>
                                        {/* Ikkinchi qator: Vaqt */}
                                        <p className="text-sm text-gray-400">
                                            {timeAgo(item.created_at)}
                                        </p>
                                    </div>
                                    {/* Coin miqdori va Sarflanish/Topilish Ikonasi */}
                                    <span className={`amount font-bold text-2xl ${color} tracking-wide flex items-center`}>
                                        <FontAwesomeIcon 
                                            icon={type === 'earn' ? faArrowUp : faArrowDown} 
                                            className={`text-xl mr-2 ${type === 'earn' ? 'text-green-400' : 'text-purple-400'}`}
                                        />
                                        {item.amount > 0 ? '+' : ''}{item.amount}
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })}
                    
                    {coins.length === 0 && !isLoading && !error && (
                        <p className="text-center text-gray-400 mt-8 text-xl">
                            Hali CodeCoin tarixi mavjud emas.
                        </p>
                    )}
                </motion.div>
            )}

            {/* Paginatsiya Tugmalari */}
            <PaginationControls />
        </main>
    );
};

export default CodeCoinHistory;