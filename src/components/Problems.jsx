import React, { useEffect, useState, useCallback } from 'react';
import ProblemCard from './ProblemCard';
import { getProblemStart, getProblemSuccess, getProblemtFailure } from '../features/problems/Problems';
import { useDispatch, useSelector } from 'react-redux';
import ProblemService from '../services/problems';
import { Link } from 'react-router-dom';

const Problems = () => {
  const dispatch = useDispatch();
  const { problems, isLoading, count, error } = useSelector((state) => state.problem);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(''); // Debounce uchun yangi state
  const pageSize = 6;

  // 1. Debounce mexanizmi: Foydalanuvchi yozishdan to'xtaganidan 500ms keyin qidiruvni boshlaydi
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer); // Tozalash (cleanup)
  }, [searchTerm]);

  // 2. Muammolarni olish funksiyasi
  const getProblems = useCallback(async (page, term) => {
    dispatch(getProblemStart());
    try {
      let response;
      if (term && term.trim() !== '') {
        response = await ProblemService.getProblemSearch(term, page);
      } else {
        response = await ProblemService.getProblemsList(page);
      }
      dispatch(getProblemSuccess(response));
    } catch (error) {
      console.error("Xatolik:", error);
      dispatch(getProblemtFailure(error.message));
    }
  }, [dispatch]);

  // 3. Qidiruv so'zi o'zgarganda sahifani 1-ga qaytarish
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  // 4. Sahifa yoki qidiruv so'zi (debounced) o'zgarganda ma'lumotni yuklash
  useEffect(() => {
    getProblems(currentPage, debouncedSearchTerm);
  }, [currentPage, debouncedSearchTerm, getProblems]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Sahifa almashganda tepaga chiqarish
  };

  const problemList = problems || [];
  const totalPages = Math.ceil((count || 0) / pageSize);

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
            {isLoading && searchTerm && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <i className="fas fa-spinner fa-spin text-indigo-500"></i>
              </div>
            )}
          </div>
        </div>

        {/* Error message */}
        {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-md mb-8 text-center max-w-2xl mx-auto">
                <i className="fas fa-exclamation-circle mr-2"></i>
                Xato yuz berdi: {error}
            </div>
        )}

        {/* Problems Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            [...Array(pageSize)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-800 p-6 flex flex-col h-full rounded-lg shadow-xl border border-gray-700 space-y-4">
                <div className="h-10 w-10 rounded-full bg-gray-700"></div>
                <div className="h-6 bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                <div className="h-20 bg-gray-700 rounded w-full"></div>
              </div>
            ))
          ) : (
            problemList.length > 0 ? (
              problemList.map((problem) => (
                <ProblemCard
                  key={problem.id}
                  id={problem.id}
                  username={problem.user?.username}
                  firstName={problem.user?.first_name}
                  lastName={problem.user?.last_name}
                  image={problem.user?.image}
                  name={problem.problem}
                  views={problem.total_views}
                  languages={problem.language_data}
                  createdAt={problem.created_at}
                  star={problem.star}
                  responseCount={problem.response_count}
                  isSolved={problem.is_solved}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                 <i className="fas fa-search text-5xl text-gray-600 mb-4"></i>
                 <p className="text-gray-400 text-xl">"{debouncedSearchTerm}" bo'yicha hech qanday muammo topilmadi.</p>
              </div>
            )
          )}
        </div>

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex justify-center items-center mt-16 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md border transition-all ${
                currentPage === 1
                  ? "bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed"
                  : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-indigo-600 hover:text-white"
              }`}
            >
              <i className="fas fa-chevron-left"></i>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .map((page, index, array) => (
                <React.Fragment key={page}>
                  {index > 0 && array[index-1] !== page - 1 && <span className="text-gray-600">...</span>}
                  <button
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-md border transition-all ${
                      currentPage === page
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-indigo-600 hover:text-white"
                    }`}
                  >
                    {page}
                  </button>
                </React.Fragment>
              ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md border transition-all ${
                currentPage === totalPages
                  ? "bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed"
                  : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-indigo-600 hover:text-white"
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