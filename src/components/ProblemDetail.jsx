import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'; 
import { 
    deleteProblemStarFailure, deleteProblemStarStart, deleteProblemStarSuccess, 
    getProblemDetailFailure, getProblemDetailStart, getProblemDetailSuccess, 
    postProblemStarStart, postProblemStarSuccess, 
    // Yechimni qabul qilish actionlari
    acceptSolutionStart, acceptSolutionSuccess, acceptSolutionFailure 
} from '../features/problems/Problems';
import ProblemService from '../services/problems';
import UserImage from '../assests/userImage.jpeg';
import ProblemResponse from './ProblemResponse';
import ProblemResponseForm from './ProblemResponseForm';
import ProblemCreate from './ProblemCreate'; // Modal komponenti
import CountdownTimer from '../utils/countdowntimer';
import timeAgo from '../utils/timeAgo';
import SimilarProblems from './SimilarProblems';

const ProblemDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [copied, setCopied] = useState(false);
    const { problemDetail, isLoading } = useSelector(state => state.problem); 
    const { user } = useSelector(state => state.auth); 
    const [isEditProblemModalOpen, setIsEditProblemModalOpen] = useState(false); 
    const responseFormRef = useRef(null); 


    // Muammoni yaratgan foydalanuvchimi?
    const isOwner = user?.username === problemDetail?.user?.username;

    useEffect(() => {
        // MUAMMO TEKSHIRUVI: Agar bu log ko'p marta chiqsa, demak useEffect qayta ishlayapti.
        // Yuqoridagi loglar sababli bu yer muammo emas, Redux store'ning o'zgarishi qayta renderga majbur qilmoqda.
        // console.log("ProblemDetail useEffect ishga tushdi. ID:", id); 
        const getProblemDetail = async () => {
            dispatch(getProblemDetailStart());
            try {
                const response = await ProblemService.getProblemDetail(id);
                dispatch(getProblemDetailSuccess(response));
            } catch (error) {
                dispatch(getProblemDetailFailure());
            }
        };
        getProblemDetail();

        // Dependensiya massivi: [id, dispatch] - Bu to'g'ri!
    }, [id, dispatch]); 

    // Nusxalash funksiyasi
    const handleCopy = () => {
        navigator.clipboard.writeText(problemDetail?.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Star qo'shish funksiyasi
    const handleStarClick = async (problemId) => {
        // Star bosilganda faqat star count/star_by_user ni yangilash, butun problemDetail ni emas.
        // Agar Redux da faqat star qismi yangilansa, bu loopni to'xtatishi mumkin.
        dispatch(postProblemStarStart());
        try {
            const response = await ProblemService.addStar(problemId);
            dispatch(postProblemStarSuccess(response));
        } catch (error) {
            console.error("Star qo'shishda xatolik ❌", error);
        }
    };

    // Star olib tashlash funksiyasi
    const handleStarDeleteClick = async (problemId) => {
        dispatch(deleteProblemStarStart());
        try {
            const response = await ProblemService.removeStar(problemId);
            dispatch(deleteProblemStarSuccess(response));
        } catch (error) {
            dispatch(deleteProblemStarFailure(error));
            console.error("Star olib tashlashda xatolik ❌", error);
        }
    };


   
    // Modalni ochish funksiyasi
    const handleOpenEditProblemModal = () => {
        setIsEditProblemModalOpen(true);
    };
    
    // Modal yopilganda chaqiriladigan funksiya
    const handleCloseEditProblemModal = () => {
        setIsEditProblemModalOpen(false);
    };


    const handleProblemCreatedOrUpdated = async (updatedProblemData) => {
        console.log("Problem'ni yangilash uchun ma'lumot keldi:", updatedProblemData);
        
        try {
            const response = await ProblemService.putProblem(id, updatedProblemData);
            console.log("✅ Problem yangilandi:", response);
            
            // MUHIM: getProblemDetailSuccess orqali yangilash to'g'ri. 
            // Agar bu Redux store'da loopga sabab bo'lsa, bu Reducer dagi xato.
            // Bu action faqat problemDetail ni yangilashi, boshqa narsani emas.
            dispatch(getProblemDetailSuccess(response)); // Redux orqali yangilash
            
            setIsEditProblemModalOpen(false); // Modalni yopish
        } catch (error) {
            console.error("❌ Problem'ni yangilashda xato yuz berdi:", error.response?.data || error.message);
            alert("Problem yangilashda xato: " + (error.response?.data?.detail || error.message));
        }
    };

    const handleWorkClick = () => {
        console.log(`Foydalanuvchi problem ID: ${problemDetail.id} ustida ishlashni boshladi.`);
        
        // Element mavjudligini tekshirish
        if (responseFormRef.current) {
            responseFormRef.current.scrollIntoView({ 
                behavior: 'smooth', // Yumshoq scroll effekti
                block: 'start'      // Elementni oynaning yuqori qismiga joylash
            });
        }
    };
    
    const handleAcceptSolution = async (solutionId) => {
        if (!isOwner) {
            alert("Faqat muammo egasi yechimni qabul qila oladi.");
            return;
        }

        if (problemDetail?.is_solved) {
            alert("Bu muammo allaqachon yechilgan.");
            return;
        }

        if (!window.confirm("Bu yechimni to'g'ri deb qabul qilishga ishonchingiz komilmi?")) {
            return;
        }

        dispatch(acceptSolutionStart());
        try {
            // response qabul qilingan yechimni o'z ichiga olishi kerak
            const response = await ProblemService.acceptSolution(id, solutionId);
            
            // is_solved holati va yechimning holatini yangilash uchun success action
            dispatch(acceptSolutionSuccess(response)); 
            
            alert("✅ Yechim muvaffaqiyatli qabul qilindi!");
        } catch (error) {
            dispatch(acceptSolutionFailure(error.response?.data?.detail || error.message));
            alert("❌ Yechimni qabul qilishda xato yuz berdi: " + (error.response?.data?.detail || error.message));
        }
    };


    if (isLoading || !problemDetail) return <div className="text-center text-gray-400 p-8">Muammo yuklanmoqda...</div>;

    return (
        <main className="container mx-auto px-4 py-12">
            <div className="lg:grid lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-8">
                    <div className="container mx-auto px-4 py-8">
                        <section className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            {/* Muammo Holati BelGisi - problemDetail?.is_solved ga bog'liq */}
                            <div className='mb-4'>
                                {problemDetail?.is_solved ? (
                                    <span className="text-sm font-bold py-2 px-4 rounded-lg bg-green-600/20 text-green-400 border border-green-600/50">
                                        <i className="fas fa-check-circle mr-2"></i> YECHILGAN
                                    </span>
                                ) : (
                                    <span className="text-sm font-bold py-2 px-4 rounded-lg bg-red-600/20 text-red-400 border border-red-600/50">
                                        <i className="fas fa-hourglass-half mr-2"></i> YECHILMAGAN
                                    </span>
                                )}
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mb-3">
                                {problemDetail?.language_data?.map((language) => (
                                    <span key={language.name} className="bg-orange-500/20 text-orange-300 text-xs font-semibold px-2.5 py-1 rounded-full">{language.name}</span>
                                ))}
                            </div>
                            <div className="flex justify-between items-start mb-4">
                                <h1 className="text-3xl lg:text-4xl font-bold text-white max-w-[70%]">{problemDetail?.problem}</h1>
                                {/* Edit and Delete Buttons - Faqat Owner ko'rishi kerak */}
                                {isOwner && (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleOpenEditProblemModal} 
                                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-md bg-blue-600 hover:bg-blue-500 text-white transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                                        >
                                            <i className="fas fa-edit"></i>
                                            Tahrirlash
                                        </button>
                                        {/* O'chirish tugmasi (handleDeleteProblem qo'shilishi kerak) */}
                                        <button
                                            // onClick={handleDeleteProblem}
                                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-md bg-red-600 hover:bg-red-500 text-white transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                            O'chirish
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center text-sm text-gray-400 mb-6">
                                {problemDetail?.user?.image ? (
                                    <img src={problemDetail?.user?.image} className="w-8 h-8 rounded-full mr-3 object-cover" alt="Avatar"/>
                                ) : (
                                    <img src={UserImage} className="w-8 h-8 rounded-full mr-3" alt="Avatar"/>
                                )}
                                <a href={`/profile/${problemDetail?.user?.username}`} className="font-semibold text-white hover:underline">{problemDetail?.user.username}</a>
                                <span className="mx-2">&bull;</span>
                                <span>{timeAgo(problemDetail?.created_at)} so'ralgan</span>
                                <span className="mx-2">&bull;</span>
                                <span>{problemDetail?.total_views} marta ko'rilgan</span>
                            </div>
                            
                        </section>
                        
                        {/* YAngi: Urgency, Coins, Deadline va "Men ishlayman" bo'limi */}
                        {(problemDetail?.is_urgent || problemDetail?.offered_coins || problemDetail?.deadline) && (
                            <div className={`
                                p-5 rounded-xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4
                                ${problemDetail?.is_urgent ? 'bg-red-900/40 border border-red-700 shadow-xl' : 'bg-gray-800/50 border border-gray-700'}
                                animate-fade-in-up
                            `} style={{ animationDelay: '0.25s' }}>
                                
                                <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
                                    {problemDetail?.is_urgent && (
                                        <div className="flex items-center text-red-400 text-sm font-bold bg-red-900/30 px-3 py-1 rounded-full">
                                            <i className="fas fa-bolt mr-2 text-lg"></i>
                                            FAVQULODDA
                                        </div>
                                    )}
                                    {problemDetail?.offered_coins > 0 && (
                                        <div className="flex items-center text-yellow-400 text-sm font-semibold bg-yellow-900/30 px-3 py-1 rounded-full">
                                            <i className="fas fa-coins mr-2"></i>
                                            Mukofot: {problemDetail.offered_coins} Tanga
                                        </div>
                                    )}
                                    {problemDetail?.deadline && (
                                        <div className="flex items-center text-indigo-400 text-sm font-semibold bg-indigo-900/30 px-3 py-1 rounded-full">
                                            <i className="fas fa-clock mr-2"></i>
                                            Muddat: <CountdownTimer targetDate ={problemDetail.deadline}/>
                                        </div>
                                    )}
                                </div>

                                {/* "Men ishlayman" tugmasi, agar is_solved bo'lmasa */}
                                {!problemDetail?.is_solved && (
                                    <button
                                        onClick={handleWorkClick}
                                        className="w-full md:w-auto flex-shrink-0 flex items-center justify-center gap-2 px-6 py-2 text-base font-bold rounded-lg bg-green-600 hover:bg-green-500 text-white transition-all duration-300 ease-in-out transform hover:scale-105 shadow-xl"
                                    >
                                        <i className="fas fa-hammer"></i>
                                        Men ishlayman!
                                    </button>
                                )}
                            </div>
                        )}

                        <div className="flex mt-6">
                            {/* <!-- Ovoz Berish --> */}
                            <div className="flex flex-col items-center mr-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                                <button
                                    onClick={() => handleStarClick(problemDetail.id)}
                                    className={`text-gray-500 transition-colors ${problemDetail?.star_by_user ? 'text-green-400' : 'hover:text-green-400'}`}>
                                    <i className="fas fa-arrow-up text-3xl"></i>
                                </button>
                                <span className="text-3xl font-bold my-1 text-white">{problemDetail?.star}</span>
                                <button
                                    onClick={() => handleStarDeleteClick(problemDetail.id)}
                                    className={`text-gray-500 transition-colors ${problemDetail?.star_by_user ? 'text-red-400' : 'hover:text-red-400'}`}>
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
                        
                        {/* Javoblar Komponenti - Proplar orqali yangilangan holat uzatiladi */}
                        <ProblemResponse 
                            id={id}
                            isOwner={isOwner} 
                            isSolved={problemDetail?.is_solved} // Redux yangilanishiga bog'liq
                            onAcceptSolution={handleAcceptSolution} // Yechimni qabul qilish funksiyasi
                        />
                        
                        <div ref={responseFormRef}>
                            <ProblemResponseForm id={id}/>
                        </div>

                        
                    </div>
                    
                    
                </div>
                

                <aside className="lg:col-span-4 mt-12 lg:mt-0">
                
                    <SimilarProblems problemId={id}/>
                    
                </aside>
                

            </div>
            
            {/* ⭐ ProblemCreate MODALINI CHAQUV */}
            {isEditProblemModalOpen && (
                <ProblemCreate
                    isOpen={isEditProblemModalOpen}
                    onClose={handleCloseEditProblemModal}
                    onSubmit={handleProblemCreatedOrUpdated}
                    isEditMode={true}
                    initialData={problemDetail}
                />
            )}
            
        </main>
    )
}
export default ProblemDetail