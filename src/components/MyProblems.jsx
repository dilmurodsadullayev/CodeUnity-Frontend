// src/components/MyProblems.jsx (To'liq kod)

import React, { useEffect, useState, useCallback } from 'react';
import MyProblemCard from './MyProblemCard'; 
import { 
    getMyProblemStart, 
    getMyProblemSuccess, 
    getMyProblemtFailure 
} from '../features/problems/Problems'; 
import { useDispatch, useSelector } from 'react-redux';
import ProblemService from '../services/problems'; 
import { Link } from 'react-router-dom';

const MyProblems = () => {
  const dispatch = useDispatch();
  
  const { 
      myProblems, 
      isLoading, 
      myProblemsCount, 
      error 
  } = useSelector((state) => state.problem); 
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const pageSize = 6; // pageSize = 6 deb qabul qilamiz

  const getMyProblems = useCallback(async (page = 1, term = '') => {
    dispatch(getMyProblemStart());
    try {
      let response;
      if (term.trim() !== '') {
        console.log(`API ga qidiruv so'rovi yuborilmoqda (Mening): term=${term}, page=${page}`);
        response = await ProblemService.getMyProblemSearch(term, page); 
      } else {
        console.log(`API ga muammolar ro'yxati so'rovi yuborilmoqda (Mening): page=${page}`);
        response = await ProblemService.getMyProblemsList(page); 
      }
      
      console.log("API dan kelgan javob (Mening):", response);
      dispatch(getMyProblemSuccess(response));
    } catch (error) {
      console.error("Mening Muammolarimni yuklashda yoki qidirishda xato:", error);
      if (error.response && error.response.status === 401) {
          dispatch(getMyProblemtFailure("Bu shaxsiy sahifa. Davom etish uchun avval tizimga kiring."));
      } else {
          dispatch(getMyProblemtFailure(error.message));
      }
    }
  }, [dispatch]);

  useEffect(() => {
    if (searchTerm.trim() !== '' && currentPage !== 1) {
        setCurrentPage(1);
    } else {
        getMyProblems(currentPage, searchTerm);
    }
  }, [currentPage, searchTerm, getMyProblems]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (currentPage !== 1) setCurrentPage(1); 
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const problemList = myProblems || [];
  const totalPages = Math.ceil((myProblemsCount || 0) / pageSize);

  // ⭐ PAGINATION MANTIQI YAXSHILANDI (ko'rsatiladigan sahifalarni aniqlash)
  const getPageNumbers = () => {
    const maxPagesToShow = 6; // Sahifalash qatorida ko'rsatiladigan maksimal raqamlar
    const pageNumbers = [];

    if (totalPages <= maxPagesToShow) {
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
    } else {
        // Har doim 1-sahifani qo'shamiz
        pageNumbers.push(1);

        // O'rtadagi sahifalar
        let start = Math.max(2, currentPage - 1);
        let end = Math.min(totalPages - 1, currentPage + 1);

        // ... ni qo'shish
        if (start > 2) {
            pageNumbers.push('...');
        }

        // O'rtadagi asosiy sahifalarni qo'shamiz
        for (let i = start; i <= end; i++) {
            if (i > 1 && i < totalPages) {
                pageNumbers.push(i);
            }
        }

        // ... ni qo'shish
        if (end < totalPages - 1) {
            pageNumbers.push('...');
        }
        
        // Oxirgi sahifani qo'shamiz (agar u allaqachon o'rtada qo'shilmagan bo'lsa)
        if (totalPages > 1 && !pageNumbers.includes(totalPages)) {
            if (pageNumbers[pageNumbers.length - 1] !== '...') {
                 // Agar oxirgi element '...' bo'lmasa, uni qo'shmaymiz, chunki
                 // end < totalPages - 1 da yuqorida qo'shgan bo'lishi mumkin.
            }
            pageNumbers.push(totalPages);
        }
    }
    
    // Qaytmaslik uchun arrayni set orqali tozalash
    return [...new Set(pageNumbers)];
  };

  const pageNumbers = getPageNumbers();
  // ⭐ PAGINATION MANTIQI YAXSHILANDI TUGADI

  return (
    <section id="my-problems-hero" className="py-20 px-4 min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100">
      <div className="container mx-auto max-w-7xl">
        {/* Hero Section */}
        <div className="text-center animate-fade-in-up">
          <h1 className="text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
            <span className="hero-gradient-text bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">Mening</span> Muammolarim
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">
            Bu yerda sizning texnik dunyoga qo'shgan barcha savollaringiz, ularning holati va yechimlari joylashgan. Ularni kuzating va yangilang.
          </p>
          
          {/* Tugmalar guruhini qo'shish */}
          <div className="flex justify-center space-x-4">
              <Link to={'/problem-create'}
                  className="text-white font-bold py-3 px-6 rounded-lg text-lg inline-flex items-center justify-center space-x-2 bg-pink-600 hover:bg-pink-700 transition-colors duration-300 shadow-lg shadow-pink-500/30"
              >
                  <i className="fas fa-plus-circle text-xl"></i>
                  <span>Yangi Muammo Qo'shish</span>
              </Link>
              <Link to={'/problems'} 
                  className="text-white font-bold py-3 px-6 rounded-lg text-lg inline-flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 transition-colors duration-300 shadow-lg"
              >
                  <i className="fas fa-globe text-xl"></i>
                  <span>Barcha Muammolar</span>
              </Link>
          </div>
        </div>

        {/* Search Bar (Purple/Pink fokus bilan) */}
        <div className="bg-transparent my-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="relative w-full max-w-2xl mx-auto">
            <i className="fa fa-search text-gray-500 absolute top-1/2 left-4 -translate-y-1/2 text-lg"></i>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Muammo nomi yoki tili bo'yicha qidirish..."
              className="input-dark w-full rounded-full py-3 pl-12 pr-4 text-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
            />
          </div>
        </div>

        {/* Xato xabari (ajratib ko'rsatilgan) */}
        {error && (
            <div className="bg-red-800 border border-red-600 text-white p-4 rounded-xl mb-8 text-center max-w-2xl mx-auto shadow-2xl">
                <p className="font-bold text-lg mb-1"><i className="fas fa-exclamation-triangle mr-2"></i> Diqqat!</p>
                <p>{error}</p>
            </div>
        )}

        {/* Problems Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Skeleton Loader
            [...Array(pageSize)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-800 p-6 flex flex-col h-full rounded-xl shadow-xl border border-gray-700 space-y-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-700/50 border-2 border-purple-600/50"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-gray-700/50 rounded"></div>
                      <div className="h-3 w-16 bg-gray-700/50 rounded"></div>
                    </div>
                  </div>
                  <div className="h-5 w-16 bg-purple-700/50 rounded-full"></div>
                </div>
                <div className="h-6 w-3/4 bg-gray-700/50 rounded mb-3"></div>
                <div className="flex flex-wrap gap-2 mb-5">
                  <div className="h-5 w-12 bg-gray-700/50 rounded-full"></div>
                  <div className="h-5 w-16 bg-gray-700/50 rounded-full"></div>
                </div>
                <div className="border-t border-gray-700 pt-4 flex justify-between items-center text-sm">
                  <div className="flex gap-4">
                    <div className="h-4 w-8 bg-gray-700/50 rounded"></div>
                    <div className="h-4 w-8 bg-gray-700/50 rounded"></div>
                  </div>
                  <div className="h-4 w-24 bg-gray-700/50 rounded"></div>
                </div>
              </div>
            ))
          ) : (
            problemList.length > 0 ? (
              problemList.map((problem) => (
                <MyProblemCard
                  key={problem.id}
                  id={problem.id}
                  username={problem.user.username}
                  firstName={problem.user.first_name}
                  lastName={problem.user.last_name}
                  image={problem.user.image}
                  name={problem.problem}
                  status={problem.is_solved}
                  views={problem.total_views}
                  languages={problem.language_data}
                  createdAt={problem.created_at}
                  star={problem.star}
                  responseCount={problem.response_count}
                  deadline={problem.deadline} 
                  isUrgent={problem.is_urgent} 
                />
              ))
            ) : (
              // Ma'lumot topilmagan holat
              <div className="col-span-full text-center py-12 bg-gray-800/50 rounded-xl border border-purple-700/50">
                  <p className="text-purple-400 text-3xl mb-4"><i className="fas fa-box-open"></i></p>
                  <p className="text-gray-300 text-xl font-semibold mb-2">
                      {searchTerm 
                          ? `Sizning muammolaringiz orasida: "${searchTerm}" topilmadi.` 
                          : "Siz hali hech qanday muammo joylamagansiz!"
                      }
                  </p>
                  {!searchTerm && (
                      <Link to={'/problem-create'} className="text-pink-400 hover:text-pink-300 transition-colors mt-2 inline-block">
                          <i className="fas fa-pencil-alt mr-1"></i> Birinchi muammoingizni qo'shish uchun bosing!
                      </Link>
                  )}
              </div>
            )
          )}
        </div>

        {/* Pagination (Purple rang bilan ajratilgan) */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-16 space-x-2 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
            {/* Oldinga button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md border transition-colors duration-200 ${
                currentPage === 1
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed border-gray-800"
                  : "bg-transparent border-purple-700 text-gray-300 hover:bg-purple-600 hover:text-white hover:border-purple-600"
              }`}
            >
              <i className="fas fa-chevron-left"></i>
            </button>

            {/* Sahifa raqamlari (Yaxshilangan mantiq asosida) */}
            {pageNumbers.map((page, index) => (
                page === '...' ? (
                    <span key={index} className="px-4 py-2 text-gray-500">...</span>
                ) : (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-md border transition-colors duration-200 font-semibold ${
                            currentPage === page
                                ? "bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-500/50"
                                : "bg-transparent border-gray-700 text-gray-300 hover:bg-purple-600 hover:text-white"
                        }`}
                    >
                        {page}
                    </button>
                )
            ))}
              
            {/* Keyingi button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md border transition-colors duration-200 ${
                currentPage === totalPages
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed border-gray-800"
                  : "bg-transparent border-purple-700 text-gray-300 hover:bg-purple-600 hover:text-white hover:border-purple-600"
              }`}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

export default MyProblems;