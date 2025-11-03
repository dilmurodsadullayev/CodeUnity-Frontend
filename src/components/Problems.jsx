import React, { useEffect, useState, useCallback } from 'react';
import ProblemCard from './ProblemCard';
import { getProblemStart, getProblemSuccess, getProblemtFailure } from '../features/problems/Problems';
import { useDispatch, useSelector } from 'react-redux';
import ProblemService from '../services/problems';
import { Link } from 'react-router-dom';

const Problems = () => {
  const dispatch = useDispatch();
  const { problems, isLoading, count, error } = useSelector((state) => state.problem); // error state'ini ham olish
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const pageSize = 6;

  const getProblems = useCallback(async (page = 1, term = '') => {
    dispatch(getProblemStart());
    try {
      let response;
      if (term.trim() !== '') {
        console.log(`API ga qidiruv so'rovi yuborilmoqda: term=${term}, page=${page}`);
        response = await ProblemService.getProblemSearch(term, page);
      } else {
        console.log(`API ga muammolar ro'yxati so'rovi yuborilmoqda: page=${page}`);
        response = await ProblemService.getProblemsList(page);
      }
      console.log("API dan kelgan javob:", response); // !!! Javobni konsolda ko'rish uchun
      dispatch(getProblemSuccess(response));
    } catch (error) {
      console.error("Muammolarni yuklashda yoki qidirishda xato:", error);
      dispatch(getProblemtFailure(error.message));
    }
  }, [dispatch]);

  useEffect(() => {
    // Agar searchTerm o'zgarganda currentPage ni 1 ga qaytarish muhim
    if (searchTerm.trim() !== '') {
      setCurrentPage(1); // Qidiruv boshlanganda sahifani 1 ga o'rnatamiz
      getProblems(1, searchTerm); // 1-sahifa va qidiruv termi bilan yuklaymiz
    } else {
      // Qidiruv termi bo'sh bo'lsa, oddiy sahifalashni davom ettiramiz
      getProblems(currentPage, searchTerm);
    }
  }, [currentPage, searchTerm, getProblems]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const problemList = problems || [];
  const totalPages = Math.ceil((count || 0) / pageSize);

  // Redux state'idagi ma'lumotlarni konsolda ko'rish
  useEffect(() => {
    console.log("Redux 'problems' state o'zgardi:", problems);
    console.log("Redux 'count' state o'zgardi:", count);
    console.log("Redux 'isLoading' state o'zgardi:", isLoading);
    console.log("Redux 'error' state o'zgardi:", error);
  }, [problems, count, isLoading, error]);


  return (
    <section id="problems-hero" className="py-20 px-4 min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100">
      <div className="container mx-auto max-w-7xl">
        {/* Hero Section */}
        <div className="text-center animate-fade-in-up">
          <h1 className="text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
            Muammolar <span className="hero-gradient-text bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-600">Markazi</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
            Jamiyatimiz bilimini o'rganing, o'z muammolaringizni baham ko'ring va eng yaxshi yechimlarni toping.
          </p>
          <Link to={'/problem-create'}
            className="btn-primary text-white font-bold py-3 px-8 rounded-lg text-lg inline-flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300 shadow-lg"
          >
            <i className="fas fa-plus-circle text-xl"></i>
            <span>Yangi Muammo Qo'shish</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="bg-transparent my-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="relative w-full max-w-2xl mx-auto">
            <i className="fa fa-search text-gray-500 absolute top-1/2 left-4 -translate-y-1/2 text-lg"></i>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Python, React, Docker... bo'yicha qidirish"
              className="input-dark w-full rounded-full py-3 pl-12 pr-4 text-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
            />
          </div>
        </div>

        {/* Xato xabari (agar mavjud bo'lsa) */}
        {error && (
            <div className="bg-red-700 text-white p-4 rounded-md mb-8 text-center max-w-2xl mx-auto">
                <p>Xato yuz berdi: {error}</p>
                <p>Iltimos, qayta urinib ko'ring yoki keyinroq qayting.</p>
            </div>
        )}

        {/* Problems Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            [...Array(pageSize)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-800 p-6 flex flex-col h-full rounded-lg shadow-xl border border-gray-700 space-y-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-700/50 border-2 border-gray-600"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-gray-700/50 rounded"></div>
                      <div className="h-3 w-16 bg-gray-700/50 rounded"></div>
                    </div>
                  </div>
                  <div className="h-5 w-16 bg-gray-700/50 rounded-full"></div>
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
                <ProblemCard
                  key={problem.id}
                  id={problem.id}
                  username={problem.user.username}
                  firstName={problem.user.first_name}
                  lastName={problem.user.last_name}
                  image={problem.user.image}
                  name={problem.problem}
                  views={problem.total_views}
                  // `languages` propining qiymati `language_data` dan kelishini ta'minlash
                  languages={problem.language_data}
                  createdAt={problem.created_at}
                  star={problem.star}
                  responseCount={problem.response_count}
                  isSolved={problem.is_solved}
                />
              ))
            ) : (
              // Agar qidiruv natijasi bo'lmasa yoki umuman muammo topilmasa
              <p className="col-span-full text-center text-gray-400 text-xl py-10">Hech qanday muammo topilmadi.</p>
            )
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-16 space-x-2 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md border ${
                currentPage === 1
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-transparent border-gray-700 text-gray-300 hover:bg-indigo-600 hover:text-white"
              }`}
            >
              <i className="fas fa-chevron-left"></i>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(Math.max(0, currentPage - 2), Math.min(totalPages, currentPage + 1))
              .map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-md border ${
                    currentPage === page
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-transparent border-gray-700 text-gray-300 hover:bg-indigo-600 hover:text-white"
                  }`}
                >
                  {page}
                </button>
              ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md border ${
                currentPage === totalPages
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-transparent border-gray-700 text-gray-300 hover:bg-indigo-600 hover:text-white"
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

export default Problems;