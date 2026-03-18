import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { FaSearch, FaChevronLeft, FaChevronRight, FaUsers, FaGhost, FaCircleNotch } from 'react-icons/fa';
import UserCard from './UserCard';
import UserService from '../services/user'; 
import { getUserStart, getUserSuccess, getUserFailure } from '../features/users';
import { useDispatch, useSelector } from 'react-redux';

const Users = () => {
    const dispatch = useDispatch();
    
    // --- LOCAL STATE ---
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('Reyting'); 
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(8);

    // --- REDUX STATE ---
    const { 
        users: paginatedData, 
        isLoading, 
        error 
    } = useSelector((state) => state.user);

    // --- 🌟 MA'LUMOTLARNI TO'G'RI AJRATIB OLISH (Failsafe) ---
    // Loglarda ko'ringan muammoni hal qiladi: agar data massiv bo'lsa ham, obyekt bo'lsa ham ishlaydi
    const usersList = useMemo(() => {
        if (!paginatedData) return [];
        // Agar Backend'dan to'g'ridan-to'g'ri massiv kelsa
        if (Array.isArray(paginatedData)) return paginatedData;
        // Agar Paginatsiya obyekti kelsa (.results ichida)
        return paginatedData.results || [];
    }, [paginatedData]);

    const totalUsersCount = paginatedData?.count || usersList.length || 0;
    const totalPages = Math.ceil(totalUsersCount / usersPerPage);

    // --- API FETCH FUNKSIYASI ---
    const fetchUsers = useCallback(async (page, search, ordering) => {
        dispatch(getUserStart());
        try {
            // Backend'ga barcha filtrlarni yuboramiz (Global Search uchun)
            const response = await UserService.getUsers(page, usersPerPage, search, ordering);
            dispatch(getUserSuccess(response)); 
            
            // Sahifa o'zgarganda tepaga yumshoq skroll qilish
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error("Foydalanuvchilarni yuklashda xato:", err);
            dispatch(getUserFailure(err.message));
        }
    }, [dispatch, usersPerPage]);

    // --- DEBOUNCE EFFECT ---
    // Foydalanuvchi yozayotganda serverni qiynamaslik uchun 500ms kutish
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers(currentPage, searchTerm, filter);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm, filter, currentPage, fetchUsers]);

    // --- HANDLERS ---
    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setCurrentPage(1); 
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); 
    };

    // --- PAGINATION LOGIC ---
    const pageNumbers = useMemo(() => {
        const pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 4) {
                pages.push(1, 2, 3, 4, 5, '...', totalPages);
            } else if (currentPage > totalPages - 4) {
                pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return pages;
    }, [currentPage, totalPages]);

    return (
        <main className="min-h-screen bg-gray-950 text-white py-12 px-4 selection:bg-indigo-500/30">
            <div className="container mx-auto max-w-7xl">
                
                {/* 1. Header Section */}
                <header className="text-center mb-16">
                    <div className="inline-flex items-center px-4 py-1.5 mb-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold tracking-widest uppercase">
                        <FaUsers className="mr-2" /> {totalUsersCount} ta hamjamiyat a'zosi
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
                        Bizning <span className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">Hamjamiyat</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        Bilim ulashuvchi va bir-birini qo'llab-quvvatlovchi eng faol dasturchilar bilan tanishing.
                    </p>
                </header>

                {/* 2. Control Panel (Search & Filter) */}
                <div className="max-w-5xl mx-auto mb-12">
                    <div className="flex flex-col md:flex-row gap-4 p-3 bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-3xl shadow-2xl">
                        {/* Search Input */}
                        <div className="relative flex-grow">
                            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Ism, ko'nikma yoki foydalanuvchi nomi..."
                                className="w-full bg-gray-800/40 border border-gray-700/50 rounded-2xl py-4 pl-14 pr-6 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-600"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>

                        {/* Filter Buttons */}
                        <div className="flex bg-gray-800/60 p-1.5 rounded-2xl border border-gray-700/30">
                            {['Reyting', 'Yangi', 'Faol'].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => handleFilterChange(item)}
                                    className={`px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                                        filter === item 
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40' 
                                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                    }`}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
                    {searchTerm && !isLoading && (
                        <p className="mt-4 text-center text-gray-500 animate-fade-in">
                            Qidiruv bo'yicha <span className="text-indigo-400 font-bold">{totalUsersCount}</span> ta natija topildi.
                        </p>
                    )}
                </div>

                {/* 3. User Grid Section */}
                <section className="grid grid-cols-2 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-[450px] mt-12">
                    {isLoading ? (
                        // Skeletal Loader
                        Array.from({ length: usersPerPage }).map((_, i) => (
                            <UserCard key={`loading-${i}`} isLoading={true} />
                        ))
                    ) : error ? (
                        <div className="col-span-full py-20 text-center">
                            <div className="bg-red-500/5 border border-red-500/10 text-red-400 p-8 rounded-3xl inline-block">
                                <p className="font-bold text-lg mb-2">Xatolik yuz berdi</p>
                                <p className="text-sm opacity-70">{error}</p>
                            </div>
                        </div>
                    ) : usersList.length === 0 ? (
                        <div className="col-span-full py-24 text-center">
                            <FaGhost className="mx-auto text-6xl text-gray-800 mb-6" />
                            <p className="text-gray-500 text-xl font-medium">Hech qanday foydalanuvchi topilmadi.</p>
                        </div>
                    ) : (
                        // Foydalanuvchilar Ro'yxati
                        usersList.map((user) => (
                            <UserCard key={user.id} user={user} isLoading={false} />
                        ))
                    )}
                </section>

                {/* 4. Pagination Section */}
                {!isLoading && totalPages > 1 && (
                    <nav className="flex justify-center items-center mt-20 gap-3">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-900 border border-gray-800 hover:border-indigo-500 disabled:opacity-20 transition-all shadow-xl text-indigo-400"
                        >
                            <FaChevronLeft />
                        </button>

                        <div className="flex items-center gap-2">
                            {pageNumbers.map((num, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => typeof num === 'number' && setCurrentPage(num)}
                                    className={`w-12 h-12 rounded-2xl font-bold transition-all border ${
                                        currentPage === num 
                                        ? 'bg-indigo-600 text-white border-transparent shadow-lg shadow-indigo-600/30 scale-110' 
                                        : 'bg-gray-900 border border-gray-800 text-gray-500 hover:border-gray-600'
                                    } ${num === '...' ? 'cursor-default pointer-events-none border-none' : ''}`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-900 border border-gray-800 hover:border-indigo-500 disabled:opacity-20 transition-all shadow-xl text-indigo-400"
                        >
                            <FaChevronRight />
                        </button>
                    </nav>
                )}
            </div>
        </main>
    );
};

export default Users;