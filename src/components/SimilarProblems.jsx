// SimilarProblems.jsx (Dizayn va animatsiyalar bilan to'liq versiya)

import React, { useEffect, Fragment } from 'react'; // Fragment React.memo uchun kerak emas, lekin odatda foydalanish mumkin
import { Link } from 'react-router-dom'; 
import { similarProblemsStart, similarProblemsSuccess, similarProblemsFailure } from '../features/problems/Problems'; 
import { useDispatch, useSelector } from 'react-redux';
import ProblemService from '../services/problems';

// Yuklanish skeleti komponenti
const SkeletonLoader = () => (
    <div className="space-y-4 animate-pulse">
        {[...Array(5)].map((_, index) => (
            <div key={index} className="flex flex-col space-y-2 border-b border-gray-700 pb-3">
                <div className="h-4 bg-gray-700 rounded w-11/12"></div>
                <div className="flex gap-2">
                    <div className="h-3 bg-gray-600 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-600 rounded w-1/3"></div>
                </div>
            </div>
        ))}
    </div>
);

const SimilarProblems = ({ problemId }) => { 
    const dispatch = useDispatch();
    
    // Yuklanish holatlarini ajratish
    const { similarProblems, similarIsLoading, similarError } = useSelector((state) => state.problem); 

    useEffect(() => {
        const getSimilarProblems = async () => {
            dispatch(similarProblemsStart());
            try {
                const response = await ProblemService.getSimilarProblems(problemId);
                dispatch(similarProblemsSuccess(response));
                
            } catch (err) {
                console.error("O'xshash muammolarni yuklashda xatolik yuz berdi:", err);
                dispatch(similarProblemsFailure(err.message || 'Server xatosi')); 
            }
        };

        if (problemId) {
            getSimilarProblems();
        }

    }, [problemId, dispatch]); 

    // --- HTML Qismi ---

    return (
        // Yangi dizayn: chiroyli gradient fon, yumshoqroq shadow
        <div className="sticky top-24">
            <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <h3 className="text-xl font-extrabold text-white mb-5 border-b border-indigo-500/50 pb-3">
                    <i className="fas fa-search-plus mr-2 text-indigo-400"></i>
                    Shu kabi muammolar
                </h3>
                
                {/* Yuklanish holatini ko'rsatish (Skeleton) */}
                {similarIsLoading && <SkeletonLoader />}

                {/* Xatolik holatini ko'rsatish */}
                {similarError && (
                    <div className="text-red-400 p-3 bg-red-900/30 rounded-lg border border-red-700/50">
                        <i className="fas fa-exclamation-triangle mr-2"></i>
                        Xatolik: {similarError}
                    </div>
                )}

                {/* Natijalarni ko'rsatish */}
                {!similarIsLoading && !similarError && similarProblems && similarProblems.length > 0 ? (
                    <ul className="space-y-4">
                        {similarProblems.map((problem, index) => (
                            <li 
                                key={problem.id} 
                                className="border-b border-gray-700/70 pb-3 transition-all duration-300 transform hover:translate-x-1 hover:bg-gray-700/30 rounded-md p-1 -mx-1"
                            > 
                                <Link 
                                    to={`/problems/${problem.id}`} 
                                    // Chiroyliroq ranglar va effekt
                                    className="text-gray-200 font-semibold hover:text-indigo-400 transition block text-base"
                                >
                                    {problem.problem}
                                </Link>
                                <div className="text-xs text-gray-400 mt-1 flex flex-wrap gap-x-2 items-center">
                                    <span className="flex items-center">
                                        <i className="fas fa-coins text-yellow-500 mr-1"></i>
                                        {problem.offered_coins} Tanga
                                    </span>
                                    <span>&bull;</span>
                                    {/* Tillarni chiroyli badge ko'rinishida */}
                                    {(problem.language || problem.language_data || []) 
                                        .map(lang => (
                                            <span key={lang.name} className="text-indigo-400 bg-indigo-900/30 px-1.5 py-0.5 rounded text-[10px] font-medium transition duration-300 hover:bg-indigo-900">
                                                {lang.name}
                                            </span>
                                        ))}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    // Natija topilmasa
                    !similarIsLoading && !similarError && (
                        <div className="text-gray-400 text-center py-4 border-dashed border-2 border-gray-700 rounded-lg">
                            <i className="fas fa-exclamation-circle mb-2 text-xl"></i>
                            <p>O'xshash muammolar topilmadi.</p>
                        </div>
                    )
                )}
            </div>
        </div>
    )
}

// Komponentni memorizatsiya qilishni unutmaymiz
export default React.memo(SimilarProblems);