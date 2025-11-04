import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProblemResponseStart, getProblemResponseSuccess } from '../features/problemResponse/problemResponse';
import ProblemResponseService from '../services/problemResponse';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCopy, faRocket, faCheckCircle, faAward } from '@fortawesome/free-solid-svg-icons'; 
import { Link } from 'react-router-dom';
import UserImage from '../assests/userImage.jpeg'
import timeAgo from '../utils/timeAgo';

const ProblemResponse = ({ 
    id, 
    isOwner, 
    isSolved, 
    onAcceptSolution 
}) => {
    const dispatch = useDispatch();
    const { problemResponses, isLoading } = useSelector((state) => state.problemResponse);

    const responsesArray = Array.isArray(problemResponses) ? problemResponses : (problemResponses ? [problemResponses] : []);

    const [userStars, setUserStars] = useState({});

    // Kiritilgan `id` o'zgarganda yoki komponent yuklanganda yechimlarni yuklash
    useEffect(() => {
        const getProblemResponse = async () => {
            dispatch(getProblemResponseStart());
            try {
                const response = await ProblemResponseService.getProblemResponse(id);
                const fetchedResponses = Array.isArray(response) ? response : (response ? [response] : []);
                
                dispatch(getProblemResponseSuccess(fetchedResponses));

                const initialUserStars = {};
                fetchedResponses.forEach(res => {
                    initialUserStars[res.id] = res.star_by_user;
                });
                setUserStars(initialUserStars);

            } catch (error) {
                console.error("Yechimlarni yuklashda xatolik yuz berdi:", error);
            }
        };

        if (id) {
            getProblemResponse();
        }
    }, [id, dispatch]); 

 

    // ⭐ STAR bosish/olib tashlash funksiyasi
    const handleStarClick = async (responseId) => {
        try {
            const alreadyStarred = userStars[responseId]; 
            let updatedResponse;

            if (alreadyStarred) {
                // ❌ delete
                await ProblemResponseService.removeStar(responseId); 
                updatedResponse = {
                    ...responsesArray.find(res => res.id === responseId),
                    total_stars: (responsesArray.find(res => res.id === responseId)?.total_stars || 1) - 1,
                    star_by_user: false
                };
            } else {
                // ✅ post
                await ProblemResponseService.addStar(responseId); 
                updatedResponse = {
                    ...responsesArray.find(res => res.id === responseId),
                    total_stars: (responsesArray.find(res => res.id === responseId)?.total_stars || 0) + 1,
                    star_by_user: true
                };
            }

            setUserStars((prev) => ({
                ...prev,
                [responseId]: !alreadyStarred,
            }));

            // Redux store'dagi problemResponses arrayini yangilash
            dispatch(getProblemResponseSuccess(
                responsesArray.map(res =>
                    res.id === responseId ? updatedResponse : res
                )
            ));

        } catch (error) {
            console.error("Yulduz qo'yish/olib tashlashda xatolik yuz berdi:", error);
            alert("Yulduz qo'yish/olib tashlashda xato yuz berdi!");
        }
    };


    return (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-gray-200">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl font-extrabold text-white mb-10 text-center animate-fade-in-up">
                    {responsesArray.length > 0 ? `${responsesArray.length} ta Ajoyib Yechim` : "Yechimlar mavjud emas"}
                </h2>

                {isLoading ? (
                    // Yuklanish holati: skeleton
                    [...Array(2)].map((_, i) => (
                        <div key={i} className="animate-pulse bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 mb-8">
                            {/* ... Skeleton UI qoldi */}
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center">
                                    <div className="w-16 h-16 rounded-full bg-gray-700 mr-5 border-2 border-gray-600"></div>
                                    <div>
                                        <div className="h-6 w-40 bg-gray-700 rounded mb-2"></div>
                                        <div className="h-4 w-32 bg-gray-700 rounded"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4 mb-6">
                                <div className="h-4 bg-gray-700 rounded w-full"></div>
                                <div className="h-4 bg-gray-700 rounded w-11/12"></div>
                            </div>
                            <div className="border-t border-gray-700 pt-6 h-10"></div>
                        </div>
                    ))
                ) : (
                    responsesArray.length > 0 ? (
                        responsesArray.map((response, index) => {
                            const isStarredByUser = userStars[response.id]; 
                            // isSolved va correctAnswerId proplari ProblemDetail'dan keladi, u esa Redux yangilanishiga bog'liq.
                            const isCurrentSolution = response.is_selected
                            const showAcceptButton = isOwner && !isSolved && !isCurrentSolution; 

                            return (
                                <div
                                    key={response.id || index}
                                    // isCurrentSolution o'zgarganda UI yangilanadi
                                    className={`solution-card p-8 rounded-2xl shadow-xl border transform hover:scale-101 transition-all duration-300 animate-fade-in-up mb-8 
                                        ${isCurrentSolution 
                                            ? 'bg-green-900/30 border-green-600/70' 
                                            : 'bg-gray-800/50 border-gray-700 hover:border-indigo-500'}`
                                    }
                                >
                                    {/* isCurrentSolution o'zgarganda UI yangilanadi */}
                                    {isCurrentSolution && (
                                        <div className="mb-4 flex items-center justify-end text-lg font-bold text-green-400">
                                            <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                                            TO'G'RI YECHIM DEB QABUL QILINGAN
                                        </div>
                                    )}

                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center">
                                            <img
                                                src={response.user.image || UserImage}
                                                className="w-16 h-16 rounded-full mr-5 border-2 border-indigo-500 shadow-lg object-cover"
                                                alt={`${response.user.username} avatari`}
                                            />
                                            <div>
                                                <a href="#" className="font-bold text-white text-xl hover:text-indigo-400 transition-colors duration-200 block">
                                                    {response.user.username || "Noma'lum foydalanuvchi"}
                                                </a>
                                                 
                                                <div className="text-md text-gray-400 font-medium">
                                                    {response.user.skill_level ? `${response.user.skill_level.charAt(0).toUpperCase() + response.user.skill_level.slice(1)} dasturchi` : "Dasturchi"}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* showAcceptButton o'zgarganda tugma holati yangilanadi */}
                                        {showAcceptButton && (
                                            <button
                                                onClick={() => onAcceptSolution(response.id)}
                                                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                                            >
                                                <FontAwesomeIcon icon={faAward} />
                                                Yechimni Qabul Qilish
                                            </button>
                                        )}

                                    </div>

                                    <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed text-lg mb-6">
                                        {/* Savolga javob matni */}
                                        <p className="mb-4">
                                            {response.answer}
                                        </p>
                                        {/* Qo'shimcha izoh */}
                                        {response.description && (
                                            <div className="bg-gray-700 p-4 rounded-lg shadow-inner mb-6">
                                                <h4 className="text-indigo-300 font-semibold mb-2">Qo'shimcha izoh:</h4>
                                                <p className="text-gray-300 text-base">{response.description}</p>
                                            </div>
                                        )}
                                        {/* Kod bloki */}
                                        {response.code && (
                                            <div className="code-block bg-gray-700 rounded-lg overflow-hidden shadow-2xl mt-6">
                                                <div className="code-block-header flex justify-between items-center bg-gray-700/70 px-5 py-3 text-gray-300 border-b border-gray-600">
                                                    <span className="font-mono text-sm text-indigo-300">{response.language || "Boshqa"}</span>
                                                    <button
                                                        className="copy-btn bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2 px-5 rounded-md transition-colors duration-200 flex items-center shadow-md hover:shadow-lg"
                                                        onClick={() => navigator.clipboard.writeText(response.code)}
                                                    >
                                                        <FontAwesomeIcon icon={faCopy} className="mr-2" />Nusxalash
                                                    </button>
                                                </div>
                                                <pre className="p-6 text-gray-50 text-sm overflow-x-auto custom-scrollbar">
                                                    <code>{response.code}</code>
                                                </pre>
                                            </div>
                                        )}
                                    </div>

                                    <div className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row justify-between items-center mt-8">
                                      <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                                        {/* Like tugmasi */}
                                        <button
                                            onClick={() => handleStarClick(response.id)} 
                                          className="flex items-center space-x-1 text-lg cursor-pointer transition-colors duration-200"
                                        >
                                          <FontAwesomeIcon
                                            icon={faStar}
                                            className={`${
                                              isStarredByUser 
                                                ? 'text-yellow-500 hover:text-yellow-400' 
                                                : 'text-gray-600 hover:text-gray-500'
                                            }`}
                                          />
                                          <span className="text-base text-gray-400 font-medium">
                                            {response.total_stars > 0 ? response.total_stars : 0}
                                          </span>
                                        </button>

                                        {/* Tahrirlash tugmasi (Faqat o'z javobini) */}
                                        <Link
                                            to={`/problem/${id}/solution/${response?.id}/edit`}
                                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-md bg-blue-600 hover:bg-blue-500 text-white transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                                        >
                                            <i className="fas fa-edit"></i>
                                            Tahrirlash
                                        </Link>
                                      </div>

                                      {/* Vaqt */}
                                      <span className="text-sm text-gray-500 font-medium">
                                        {timeAgo(response.created_at)}
                                      </span>
                                    </div>

                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center text-gray-400 py-20 text-2xl font-semibold animate-fade-in">
                            <FontAwesomeIcon icon={faRocket} className="text-indigo-500 text-4xl mb-4 block mx-auto" />
                            Hali hech qanday javob qo‘shilmagan! Birinchisi bo'ling 🚀
                        </div>
                    )
                )}
            </div>
        </section>
    );
};

export default ProblemResponse;