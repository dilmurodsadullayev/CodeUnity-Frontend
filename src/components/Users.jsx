import React, { useEffect, useState } from 'react';
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import UserCard from './UserCard';
import UserService from '../services/user'; // To'g'ri import qilinganiga ishonch hosil qiling
import { getUserStart, getUserSuccess, getUserFailure } from '../features/users';
import { useDispatch, useSelector } from 'react-redux';

const Users = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('Reyting'); // 'Yangi', 'Reyting', 'Faol'
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(8); // Har sahifada ko'rsatiladigan foydalanuvchilar soni

    const { 
        users: paginatedUsersData, // API'dan kelgan butun paginatsiya obyekti
        isLoading, 
        error 
    } = useSelector((state) => state.user);

    const dispatch = useDispatch();

    // API'dan kelgan foydalanuvchilar ro'yxati (results array)
    const users = paginatedUsersData || []; 
    // Jami foydalanuvchilar soni
    const totalUsersCount = paginatedUsersData.count || 0;
    // Keyingi sahifa URL
    const nextUrl = paginatedUsersData.next;
    // Oldingi sahifa URL
    const previousUrl = paginatedUsersData.previous;

    const getUsers = async (page = 1, pageSize = 8) => { // pageSize ni qabul qiladigan qildik
        dispatch(getUserStart());
        try {
            const response = await UserService.getUsers(page, pageSize); // pageSize ni UserServicega uzatyapmiz
            dispatch(getUserSuccess(response)); 
        } catch (err) {
            console.error("Foydalanuvchilarni olishda xato:", err);
            dispatch(getUserFailure(err.message));
        }
    };

    useEffect(() => {
        getUsers(currentPage, usersPerPage); // usersPerPage uzatilyapti
    }, [currentPage, usersPerPage]);

    // Qidiruv va filter bo'yicha saralash faqat joriy sahifadagi ma'lumotlarga qo'llaniladi
    const filteredAndSortedUsers = users
        .filter(user => {
            const matchesSearchTerm = 
                user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (user.first_name && user.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (user.last_name && user.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (user.skills && user.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())));
            return matchesSearchTerm;
        })
        .sort((a, b) => {
            if (filter === 'Reyting') {
                const ratingA = a.rating?.rating || a.rating || 0; 
                const ratingB = b.rating?.rating || b.rating || 0;
                return ratingB - ratingA; 
            } else if (filter === 'Yangi') {
                return b.id - a.id; 
            } else if (filter === 'Faol') {
                // Faollik bo'yicha saralash uchun API dan tegishli ma'lumot kelishi kerak (masalan, last_login)
                return 0; // Hozircha o'zgartirishsiz qoldirilgan
            }
            return 0;
        });
    console.log(filteredAndSortedUsers);
    

    // Paginatsiya logikasi
    const totalPages = Math.ceil(totalUsersCount / usersPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };

    const handleNextPage = () => {
        if (nextUrl) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePreviousPage = () => {
        if (previousUrl) {
            setCurrentPage(prev => prev - 1);
        }
    };

    // Sahifa raqamlari qatorini generatsiya qilish (avvalgidek qoladi)
    const pageNumbers = [];
    if (totalPages <= 7) { 
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
    } else { 
        if (currentPage <= 4) {
            for (let i = 1; i <= 5; i++) pageNumbers.push(i);
            pageNumbers.push('...');
            pageNumbers.push(totalPages);
        } else if (currentPage > totalPages - 4) {
            pageNumbers.push(1);
            pageNumbers.push('...');
            for (let i = totalPages - 4; i <= totalPages; i++) pageNumbers.push(i);
        } else {
            pageNumbers.push(1);
            pageNumbers.push('...');
            for (let i = currentPage - 1; i <= currentPage + 1; i++) pageNumbers.push(i);
            pageNumbers.push('...');
            pageNumbers.push(totalPages);
        }
    }

    return (
        <main className="min-h-screen bg-gray-950 text-white py-12">
            <div className="container mx-auto px-4 max-w-7xl">
                <section className="mb-12">
                    <div className="text-center mb-10">
                        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
                            Bizning <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">Hamjamiyatimiz</span>
                        </h1>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Platformamizni bilim va tajriba bilan boyitayotgan, izlanuvchan dasturchilar bilan tanishing. Ularning profillarini ko'ring va ularga qo'shiling.
                        </p>
                    </div>

                    <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-4 items-center mb-12 p-4 rounded-xl bg-gray-900 shadow-xl">
                        <div className="relative flex-grow w-full md:w-auto">
                            <FaSearch className="text-gray-500 absolute top-1/2 left-4 -translate-y-1/2 text-lg" />
                            <input
                                type="text"
                                placeholder="Ism yoki ko'nikma bo'yicha qidirish (masalan, Python)..."
                                className="w-full bg-gray-800 border border-gray-700 rounded-full py-3 pl-12 pr-6 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 shadow-inner"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex-shrink-0 flex items-center gap-2 p-1 bg-gray-800 rounded-full text-sm border border-gray-700 shadow-md">
                            <button
                                className={`filter-btn px-5 py-2 rounded-full font-semibold ${filter === 'Yangi' ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-700'} transition-all duration-300`}
                                onClick={() => setFilter('Yangi')}
                            >
                                Yangi
                            </button>
                            <button
                                className={`filter-btn px-5 py-2 rounded-full font-semibold ${filter === 'Reyting' ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-700'} transition-all duration-300`}
                                onClick={() => setFilter('Reyting')}
                            >
                                Reyting
                            </button>
                            <button
                                className={`filter-btn px-5 py-2 rounded-full font-semibold ${filter === 'Faol' ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-700'} transition-all duration-300`}
                                onClick={() => setFilter('Faol')}
                            >
                                Faol
                            </button>
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-3">
                    {isLoading ? (
                        Array.from({ length: usersPerPage }).map((_, index) => (
                            <UserCard key={`loading-${index}`} isLoading={true} />
                        ))
                    ) : error ? (
                        <div className="col-span-full text-center text-red-500 text-xl py-10">
                            Ma'lumotlarni yuklashda xato yuz berdi: {error}
                        </div>
                    ) : filteredAndSortedUsers.length === 0 ? (
                        <div className="col-span-full text-center text-gray-400 text-xl py-10">
                            Hech qanday foydalanuvchi topilmadi.
                        </div>
                    ) : (
                        filteredAndSortedUsers.map((user) => (
                            <UserCard key={user.id} user={user} isLoading={false} />
                        ))
                    )}
                </section>

                {/* Paginatsiya qismi */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-16 space-x-3">
                        <button
                            onClick={handlePreviousPage}
                            disabled={!previousUrl}
                            className={`w-10 h-10 flex items-center justify-center rounded-full ${!previousUrl ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-800 hover:bg-indigo-600'} transition-colors text-white text-lg shadow-md`}
                        >
                            <FaChevronLeft />
                        </button>

                        {pageNumbers.map((num, index) => (
                            <React.Fragment key={index}>
                                {num === '...' ? (
                                    <span className="text-gray-400 text-xl">...</span>
                                ) : (
                                    <button
                                        onClick={() => paginate(num)}
                                        className={`w-10 h-10 flex items-center justify-center rounded-full ${currentPage === num ? 'bg-indigo-600 text-white font-bold shadow-lg' : 'bg-gray-800 hover:bg-indigo-600 text-white'} transition-colors text-lg`}
                                    >
                                        {num}
                                    </button>
                                )}
                            </React.Fragment>
                        ))}

                        <button
                            onClick={handleNextPage}
                            disabled={!nextUrl}
                            className={`w-10 h-10 flex items-center justify-center rounded-full ${!nextUrl ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-800 hover:bg-indigo-600'} transition-colors text-white text-lg shadow-md`}
                        >
                            <FaChevronRight />
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}

export default Users;