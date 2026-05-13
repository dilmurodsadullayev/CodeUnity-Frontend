import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { FaSearch, FaChevronLeft, FaChevronRight, FaUsers, FaGhost } from 'react-icons/fa';
import UserCard from './UserCard';
import UserService from '../services/user'; 
import { getUserStart, getUserSuccess, getUserFailure } from '../features/users';
import { useDispatch, useSelector } from 'react-redux';

const Users = () => {
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('Reyting'); 
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(8);

    const { users: paginatedData, isLoading, error } = useSelector((state) => state.user);

    const usersList = useMemo(() => {
        if (!paginatedData) return [];
        if (Array.isArray(paginatedData)) return paginatedData;
        return paginatedData.results || [];
    }, [paginatedData]);

    const totalUsersCount = paginatedData?.count || usersList.length || 0;
    const totalPages = Math.ceil(totalUsersCount / usersPerPage);

    const fetchUsers = useCallback(async (page, search, ordering) => {
        dispatch(getUserStart());
        try {
            const response = await UserService.getUsers(page, usersPerPage, search, ordering);
            dispatch(getUserSuccess(response)); 
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            dispatch(getUserFailure(err.message));
        }
    }, [dispatch, usersPerPage]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers(currentPage, searchTerm, filter);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm, filter, currentPage, fetchUsers]);

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setCurrentPage(1); 
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); 
    };

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
        <main className="min-h-screen bg-gray-950 text-white py-12 px-4">
            <div className="container mx-auto max-w-7xl">
                
                {/* Header */}
                <header className="text-center mb-12">
                    <div className="inline-flex items-center px-4 py-1.5 mb-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold tracking-widest uppercase">
                        <FaUsers className="mr-2" /> {totalUsersCount} ta hamjamiyat a'zosi
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight">
                        Bizning <span className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">Hamjamiyat</span>
                    </h1>
                    <p className="text-gray-400 text-base max-w-2xl mx-auto">
                        Bilim ulashuvchi va bir-birini qo'llab-quvvatlovchi eng faol dasturchilar bilan tanishing.
                    </p>
                </header>

                {/* Control Panel */}
                <div className="max-w-3xl mx-auto mb-16">
                    <div className="flex flex-col gap-3 p-2 bg-gray-900/60 border border-gray-800 rounded-2xl shadow-2xl">
                        {/* Search */}
                        <div className="relative">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                            <input
                                type="text"
                                placeholder="Ism, ko'nikma yoki foydalanuvchi nomi..."
                                className="w-full bg-gray-800/60 border border-gray-700/50 rounded-xl py-3 pl-11 pr-4 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-600"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                        {/* Filters */}
                        <div className="flex bg-gray-800/60 p-1 rounded-xl border border-gray-700/30">
                            {['Reyting', 'Yangi', 'Faol'].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => handleFilterChange(item)}
                                    className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 ${
                                        filter === item 
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                    }`}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
                    {searchTerm && !isLoading && (
                        <p className="mt-3 text-center text-gray-500 text-sm">
                            <span className="text-indigo-400 font-bold">{totalUsersCount}</span> ta natija topildi
                        </p>
                    )}
                </div>

                {/* Grid - avatar uchun pt-14 */}
                <section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-16 pt-12">
                    {isLoading ? (
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
                        usersList.map((user, idx) => (
                            <UserCard key={user.id} user={user} isLoading={false} index={idx} />
                        ))
                    )}
                </section>

                {/* Pagination */}
                {!isLoading && totalPages > 1 && (
                    <nav className="flex justify-center items-center mt-16 gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-900 border border-gray-800 hover:border-indigo-500 disabled:opacity-20 transition-all text-indigo-400"
                        >
                            <FaChevronLeft />
                        </button>
                        <div className="flex items-center gap-1.5">
                            {pageNumbers.map((num, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => typeof num === 'number' && setCurrentPage(num)}
                                    className={`w-10 h-10 rounded-xl font-bold text-sm transition-all border ${
                                        currentPage === num 
                                        ? 'bg-indigo-600 text-white border-transparent shadow-lg shadow-indigo-600/30 scale-110' 
                                        : 'bg-gray-900 border-gray-800 text-gray-500 hover:border-gray-600'
                                    } ${num === '...' ? 'cursor-default pointer-events-none border-none' : ''}`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-900 border border-gray-800 hover:border-indigo-500 disabled:opacity-20 transition-all text-indigo-400"
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