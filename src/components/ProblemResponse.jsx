import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProblemResponseStart, getProblemResponseSuccess } from '../features/problemResponse/problemResponse';
import ProblemResponseService from '../services/problemResponse';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCopy, faRocket } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
// faThumbsUp import qilinmagan, agar ishlatilmasa olib tashlash mumkin
// import { faThumbsUp } from "@fortawesome/free-solid-svg-icons"; 
// ⭐ starAPI ni import qilish kerak (Agar mavjud bo'lsa)

const ProblemResponse = ({ id }) => {
    const dispatch = useDispatch();
    const { problemResponses, isLoading } = useSelector((state) => state.problemResponse);

    // problemResponses obyekt yoki array bo'lishi mumkin. Uni doim array qilib olish uchun.
    const responsesArray = Array.isArray(problemResponses) ? problemResponses : (problemResponses ? [problemResponses] : []);

    // Baholash (stars) uchun lokal state, bu foydalanuvchining bosgan yulduzlarini saqlaydi
    // Ob'ekt ko'rinishida { responseId: true/false }
    const [userStars, setUserStars] = useState({});

    // Kiritilgan `id` o'zgarganda yoki komponent yuklanganda yechimlarni yuklash
    useEffect(() => {
        const getProblemResponse = async () => {
            dispatch(getProblemResponseStart());
            try {
                const response = await ProblemResponseService.getProblemResponse(id);
                dispatch(getProblemResponseSuccess(response));

                // Yuklangan ma'lumotlarga qarab userStars holatini boshlang'ich qilib o'rnatish
                const initialUserStars = {};
                if (Array.isArray(response)) {
                    response.forEach(res => {
                        initialUserStars[res.id] = res.star_by_user;
                    });
                } else if (response && response.id) { // Agar bitta obyekt bo'lsa
                     initialUserStars[response.id] = response.star_by_user;
                }
                setUserStars(initialUserStars);

            } catch (error) {
                console.error("Yechimlarni yuklashda xatolik yuz berdi:", error);
                // Foydalanuvchiga xatolik haqida xabar berish uchun toast yoki alert qo'shishingiz mumkin
            }
        };

        if (id) {
            getProblemResponse();
        }
    }, [id, dispatch]); // dispatch ham dependency arrayga qo'shilishi kerak

    // Vaqtni hisoblash funksiyasi
    function timeAgo(createdAt) {
        if (!createdAt) return "Vaqt noma'lum";
        const now = new Date();
        const created = new Date(createdAt);

        const diffMs = now - created;
        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);
        const diffMonths = Math.floor(diffDays / 30); // Taxminan 30 kun
        const diffYears = Math.floor(diffDays / 365); // Taxminan 365 kun


        if (diffYears > 0) {
            return diffYears === 1 ? "1 yil oldin" : `${diffYears} yil oldin`;
        } else if (diffMonths > 0) {
            return diffMonths === 1 ? "1 oy oldin" : `${diffMonths} oy oldin`;
        } else if (diffDays > 0) {
            return diffDays === 1 ? "1 kun oldin" : `${diffDays} kun oldin`;
        } else if (diffHours > 0) {
            return diffHours === 1 ? "1 soat oldin" : `${diffHours} soat oldin`;
        } else if (diffMinutes > 0) {
            return diffMinutes === 1 ? "1 daqiqa oldin" : `${diffMinutes} daqiqa oldin`;
        } else {
            return "Hozirgina";
        }
    }

    // ⭐ STAR bosish/olib tashlash funksiyasi
    const handleStarClick = async (responseId) => {
        try {
            const alreadyStarred = userStars[responseId]; // Hozirgi holatni tekshiramiz
            let updatedResponse;

            if (alreadyStarred) {
                // ❌ Agar allaqachon bosgan bo‘lsa → delete
                await ProblemResponseService.removeStar(responseId); // API chaqirig'i
                updatedResponse = {
                    ...responsesArray.find(res => res.id === responseId),
                    total_stars: (responsesArray.find(res => res.id === responseId)?.total_stars || 1) - 1,
                    star_by_user: false
                };
            } else {
                // ✅ Yangi bosganda → post
                await ProblemResponseService.addStar(responseId); // API chaqirig'i
                updatedResponse = {
                    ...responsesArray.find(res => res.id === responseId),
                    total_stars: (responsesArray.find(res => res.id === responseId)?.total_stars || 0) + 1,
                    star_by_user: true
                };
            }

            // UI ni yangilash: userStars holatini o'zgartirish
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
            // Xatolikni foydalanuvchiga ko'rsatish
        }
    };


    return (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 min-h-screen text-gray-200">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl font-extrabold text-white mb-10 text-center animate-fade-in-up">
                    {responsesArray.length > 0 ? `${responsesArray.length} ta Ajoyib Yechim` : "Yechimlar mavjud emas"}
                </h2>

                {isLoading ? (
                    // Yuklanish holati: chiroyli "skeleton" animatsiya
                    [...Array(3)].map((_, i) => ( // Minimal 3ta skeleton ko'rsatish
                        <div key={i} className="animate-pulse bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 mb-8 transform hover:scale-102 transition-all duration-300">
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
                                <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                            </div>
                            <div className="bg-gray-700 rounded-lg overflow-hidden mb-8 h-48">
                                <div className="flex justify-between items-center bg-gray-600 px-5 py-3 h-12">
                                    <div className="h-4 w-28 bg-gray-500 rounded"></div>
                                    <div className="h-8 w-24 bg-indigo-700 rounded-md"></div>
                                </div>
                                <div className="p-5 space-y-2">
                                    <div className="h-4 bg-gray-600 rounded w-full"></div>
                                    <div className="h-4 bg-gray-600 rounded w-11/12"></div>
                                    <div className="h-4 bg-gray-600 rounded w-10/12"></div>
                                </div>
                            </div>
                            <div className="border-t border-gray-700 pt-6 flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                    {[...Array(5)].map((_, starIdx) => (
                                        <div key={starIdx} className="h-6 w-6 bg-gray-700 rounded-full"></div>
                                    ))}
                                    <div className="h-4 w-24 bg-gray-700 rounded ml-2"></div>
                                </div>
                                <div className="h-4 w-28 bg-gray-700 rounded"></div>
                            </div>
                        </div>
                    ))
                ) : (
                    responsesArray.length > 0 ? (
                        responsesArray.map((response, index) => {
                            // `userStars[response.id]` bizning lokal holatimizdagi yulduz holati
                            const isStarredByUser = userStars[response.id]; 

                            return (
                                <div
                                    key={response.id || index}
                                    className="solution-card bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 transform hover:scale-105 transition-all duration-300 animate-fade-in-up mb-8"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center">
                                            <img
                                                src={response.user.image || "https://i.pravatar.cc/60?u=anonUser"}
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
                                        <Link
                                            to={`/problem/${id}/solution/${response?.id}/edit`}
                                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-md bg-blue-600 hover:bg-blue-500 text-white transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                                        >
                                            <i className="fas fa-edit"></i>
                                            Tahrirlash
                                        </Link>
                                    </div>

                                    <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed text-lg mb-6">
                                        <p className="mb-4">
                                            {response.answer}
                                        </p>
                                        {response.description && (
                                            <div className="bg-gray-700 p-4 rounded-lg shadow-inner mb-6">
                                                <h4 className="text-indigo-300 font-semibold mb-2">Qo'shimcha izoh:</h4>
                                                <p className="text-gray-300 text-base">{response.description}</p>
                                            </div>
                                        )}
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
                                      <div className="flex items-center space-x-2 mb-4 sm:mb-0">
                                        {/* Like tugmasi */}
                                        <button
                                            onClick={() => handleStarClick(response.id)} // Faqat ID ni o'tkazamiz
                                          className="flex items-center space-x-1 text-lg cursor-pointer transition-colors duration-200"
                                        >
                                          <FontAwesomeIcon
                                            icon={faStar}
                                            className={`${
                                              isStarredByUser // userStars holatiga qarab rangni o'zgartiramiz
                                                ? 'text-blue-500 hover:text-blue-400'
                                                : 'text-gray-600 hover:text-gray-500'
                                            }`}
                                          />
                                          <span className="text-base text-gray-400 font-medium">
                                            {response.total_stars > 0 ? response.total_stars : 0}
                                          </span>
                                        </button>
                                        {/* ✏️ Tahrirlash tugmasi */}
                                        
                                        
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