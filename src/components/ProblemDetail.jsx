import React, { use, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { deleteProblemStarFailure, deleteProblemStarStart, deleteProblemStarSuccess, getProblemDetailFailure, getProblemDetailStart, getProblemDetailSuccess, postProblemStarStart, postProblemStarSuccess } from '../features/problems/Problems';
import ProblemService from '../services/problems';
import UserImage from '../assests/userImage.jpeg';
import ProblemResponse from './ProblemResponse';
import ProblemResponseForm from './ProblemResponseForm';
import ProblemCreate from './ProblemCreate';

const ProblemDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [copied, setCopied] = useState(false);
    const { problemDetail } = useSelector(state => state.problem);
    const [isEditProblemModalOpen, setIsEditProblemModalOpen] = useState(false); // Challenge tahrirlash modali
    

    useEffect(() => {
        const getProblemDetail = async () => {
        dispatch(getProblemDetailStart());
        try {
            const response = await ProblemService.getProblemDetail(id);
            dispatch(getProblemDetailSuccess(response));
            // setFavorited(response.article.favorited);
            // setFavoritesCount(response.article.favoritesCount || 0);
        } catch (error) {
            dispatch(getProblemDetailFailure());
        }
        };
        getProblemDetail();
    }, [id, dispatch]);

    const handleCopy = () => {
    navigator.clipboard.writeText(problemDetail?.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

    const handleStarClick = async (problemId) => {
        dispatch(postProblemStarStart());
        try {
            const response = await ProblemService.addStar(problemId);
            dispatch(postProblemStarSuccess(response));
            console.log("Star qo'shildi ✅", response);
        } catch (error) {
            console.error("Star qo'shishda xatolik ❌", error);
        }
        };

    const handleStarDeleteClick = async (problemId) => {
        dispatch(deleteProblemStarStart());
        try {
            const response = await ProblemService.removeStar(problemId);
            dispatch(deleteProblemStarSuccess(response));
            console.log("Star olib tashlandi ❌", response);
        } catch (error) {
            dispatch(deleteProblemStarFailure(error));
            console.error("Star olib tashlashda xatolik ❌", error);
        }
        };


  function timeAgo(createdAt) {
        const now = new Date();
        const created = new Date(createdAt);

        const diffMs = now - created; // millisekund farq
        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffDays > 0) {
            return diffDays === 1
                ? "1 kun oldin"
                : `${diffDays} kun oldin`;
        } else if (diffHours > 0) {
            return diffHours === 1
                ? "1 soat oldin"
                : `${diffHours} soat oldin`;
        } else if (diffMinutes > 0) {
            return diffMinutes === 1
                ? "1 daqiqa oldin"
                : `${diffMinutes} daqiqa oldin`;
        } else {
            return "hozirgina";
        }
    }

    const handleOpenEditProblemModal = () => {
        setIsEditProblemModalOpen(true);
    };

    const handleProblemCreatedOrUpdated = async (updatedProblemData) => {
        console.log("Challenge yaratildi yoki yangilash uchun ma'lumot keldi:", updatedProblemData);
        
        try {
            const response = await ProblemService.patchProblem(id, updatedProblemData);
            console.log("✅ Problem yangilandi:", response);
            
            // Redux storeni yangi/yangilangan challenge bilan yangilash
            dispatch(getProblemDetailSuccess(response));
            setIsEditProblemModalOpen(false); // Modalni yopish
        } catch (error) {
            console.error("❌ Problem'ni yangilashda xato yuz berdi:", error.response?.data || error.message);
            // Xatolikni foydalanuvchiga ko'rsatish mumkin
            alert("Problem yangilashda xato: " + (error.response?.data?.detail || error.message));
        }
    };


    if (!problemDetail) return <div className="text-center text-gray-400 p-8">Loading problem...</div>;


  return (
    <main className="container mx-auto px-4 py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">

            <div className="lg:col-span-8">
                <div className="container mx-auto px-4 py-8">
                    <section className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {problemDetail?.language_data?.map((language) => (
                                <span key={language.name} className="bg-orange-500/20 text-orange-300 text-xs font-semibold px-2.5 py-1 rounded-full">{language.name}</span>
                            ))}
                        </div>
                        <div className="flex justify-between items-start mb-4">
                            <h1 className="text-3xl lg:text-4xl font-bold text-white max-w-[70%]">{problemDetail?.problem}</h1>
                            {/* Edit and Delete Buttons - Moved Here */}
                            <div className="flex gap-3">
                                <Link
                                    to={`/problem/${problemDetail?.id}/edit`}
                                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-md bg-blue-600 hover:bg-blue-500 text-white transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                                >
                                    <i className="fas fa-edit"></i>
                                    Tahrirlash
                                </Link>
                                {/* <button
                                    // onClick={() => handleDeleteClick(problemDetail.id)}
                                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-md bg-red-600 hover:bg-red-500 text-white transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                                >
                                    <i className="fas fa-trash-alt"></i>
                                    O'chirish
                                </button> */}
                            </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-400 mb-6">
                            {problemDetail?.image ? (
                                <img src={problemDetail?.image} className="w-8 h-8 rounded-full mr-3" alt="Avatar"/>
                            ) : (
                                <img src={UserImage} className="w-8 h-8 rounded-full mr-3" alt="Avatar"/>
                            )}
                            <a href="#" className="font-semibold text-white hover:underline">{problemDetail?.user.username}</a>
                            <span className="mx-2">&bull;</span>
                            <span>{timeAgo(problemDetail?.created_at)} so'ralgan</span>
                            <span className="mx-2">&bull;</span>
                            <span>{problemDetail?.total_views} marta ko'rilgan</span>
                        </div>
                        
                    </section>
                    

                    <div className="flex mt-6">
                        {/* <!-- Ovoz Berish --> */}
                        <div className="flex flex-col items-center mr-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <button
                                onClick={() => handleStarClick(problemDetail.id)}
                                className="text-gray-500 hover:text-green-400 transition-colors">
                                <i className="fas fa-arrow-up text-3xl"></i>
                            </button>
                            <span className="text-3xl font-bold my-1 text-white">{problemDetail?.star}</span>
                            <button
                                onClick={() => handleStarDeleteClick(problemDetail.id)}
                                className="text-gray-500 hover:text-red-400 transition-colors">
                                <i className="fas fa-arrow-down text-3xl"></i>
                            </button>
                        </div>
                        

                        {/* <!-- Muammo Tanasi --> */}
                        <div className="w-full">
                            <div className="w-full">
                                <article
                                    className="prose prose-invert max-w-none text-gray-300 animate-fade-in-up"
                                    style={{ animationDelay: "0.3s" }}
                                >
                                    {/* Problem description */}
                                    <p className="leading-relaxed text-lg text-gray-200 mb-3">
                                        {problemDetail?.description}
                                    </p>

                                    {/* Section title */}
                                    <h3 className="text-white text-xl font-semibold border-b border-gray-700 pb-2 mb-4 mt-6">
                                        ❌ Xatolik bo'lgan kod:
                                    </h3>

                                    {/* Code block */}
                                    <div className="bg-[#1E1E2F] rounded-2xl shadow-lg overflow-hidden border border-gray-700 mb-6">
                                        {problemDetail?.code ? (
                                            <>
                                                <div className="flex items-center justify-between bg-[#2A2A3D] px-4 py-2">
                                                    <span className="text-sm font-mono text-gray-400">
                                                        error.py <span className="text-indigo-400">(Python)</span>
                                                    </span>
                                                    <button
                                                        onClick={handleCopy}
                                                        className="copy-btn flex items-center gap-2 px-3 py-1 text-sm rounded-md bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                                                    >
                                                        <i className="fas fa-copy"></i>
                                                        {copied ? "✅ Nusxalandi" : "Nusxalash"}
                                                    </button>
                                                </div>
                                                <pre className="overflow-x-auto p-4 text-sm leading-relaxed bg-[#1E1E2F] text-gray-200">
                                                    <code>{problemDetail?.code}</code>
                                                </pre>
                                            </>

                                        ) : (
                                            <>
                                                <p className="text-base text-gray-300 italic p-4">Kod mavjud emas.</p>
                                            </>
                                        )}
                                    </div>

                                    {/* Footer question */}
                                    <p className="text-base text-gray-300 italic">
                                        💡 Ushbu muammoni optimallashtirish uchun eng to'g'ri yondashuv qanday?
                                    </p>
                                </article>
                            </div>
                            
                        </div>
                        
                    </div>

                    <hr className="border-gray-700 my-8"/>

                    <ProblemResponse id={id}/>

                    <ProblemResponseForm id={id}/>
                    
                </div>
                
                
                </div>
                

            <aside className="lg:col-span-4 mt-12 lg:mt-0">
               
                <div className="sticky top-24">
                     <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-5 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <h3 className="text-lg font-bold text-white mb-4">Shu kabi muammolar</h3>
                        <ul className="space-y-4">
                            <li className="border-b border-gray-700 pb-3">
                                <a href="#" className="text-gray-300 hover:text-indigo-400 transition">Django-rest-framework'da Serializer bilan bog'liq N+1</a>
                                <div className="text-xs text-gray-500 mt-1">7 ta javob</div>
                            </li>
                             <li className="border-b border-gray-700 pb-3">
                                <a href="#" className="text-gray-300 hover:text-indigo-400 transition">`only` va `defer` qachon ishlatiladi?</a>
                                <div className="text-xs text-gray-500 mt-1">4 ta javob</div>
                            </li>
                             <li>
                                <a href="#" className="text-gray-300 hover:text-indigo-400 transition">Raw SQL so'rovlarni optimallashtirish</a>
                                <div className="text-xs text-gray-500 mt-1">11 ta javob</div>
                            </li>
                        </ul>
                     </div>
                </div>
                
            </aside>
            

        </div>
       
        
    </main>
    
  )
}

export default ProblemDetail