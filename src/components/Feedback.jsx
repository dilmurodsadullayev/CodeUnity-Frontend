import React, { useState, useEffect, useRef } from 'react';
import './feedback.css'; // Global uslublarni import qilish
import FeedbackCard from './FeedbackCard';
import FeedbackModal from './FeedbackModal';
import {
    getFeedbackStart,
    getFeedbackSuccess,
    getFeedbackFailure,
    postFeedbackStart,
    postFeedbackSuccess,
    postFeedbackFailure,
    updateFeedbackStart,
    updateFeedbackSuccess,
    updateFeedbackFailure,
    deleteFeedbackStart,   // Redux action for delete
    deleteFeedbackSuccess, // Redux action for delete
    deleteFeedbackFailure, // Redux action for delete
} from '../features/feedback';
import { useDispatch, useSelector } from 'react-redux';
import FeedbackService from '../services/feedback';
import { useNavigate } from 'react-router-dom';

const Feedback = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab] = useState(0); // Hozircha ishlatilmayapti, lekin qoldirildi
    const [indicatorStyle, setIndicatorStyle] = useState({}); // Hozircha ishlatilmayapti, lekin qoldirildi
    const [visibleItems, setVisibleItems] = useState(3);
    const [feedbackToEdit, setFeedbackToEdit] = useState(null); // Tahrirlanishi kerak bo'lgan feedback obyekti

    const dispatch = useDispatch();
    const { feedbacks, isLoading, error } = useSelector((state) => state.feedback);
    const navigate = useNavigate();

    // const tabs = ['Eng Yangilari', 'Eng Mashhurlari', 'Eng Ko\'p Ko\'rilganlar']; // Hozircha ishlatilmayapti, lekin qoldirildi
    const tabRefs = useRef([]); // Hozircha ishlatilmayapti, lekin qoldirildi

    const getFeedbacks = async () => {
        dispatch(getFeedbackStart());
        try {
            const response = await FeedbackService.getFeedbacks();
            dispatch(getFeedbackSuccess(response));
        } catch (error) {
            console.error("Fikrlarni olishda xatolik yuz berdi:", error);
            dispatch(getFeedbackFailure(error.message));
        }
    };

    useEffect(() => {
        getFeedbacks(); // Komponent yuklanganda fikrlarni olish
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                closeModal();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    // Tab indikatorini o'rnatish (agar kelajakda tablar qaytarilsa)
    useEffect(() => {
        const setIndicator = () => {
            if (tabRefs.current[activeTab]) {
                const button = tabRefs.current[activeTab];
                setIndicatorStyle({
                    width: `${button.offsetWidth}px`,
                    left: `${button.offsetLeft}px`
                });
            }
        };
        setIndicator();
        window.addEventListener('resize', setIndicator);
        return () => window.removeEventListener('resize', setIndicator);
    }, [activeTab, feedbacks]); // feedbacks o'zgarganda ham yangilash

    // Modalni yopish funksiyasi
    const closeModal = () => {
        setIsModalOpen(false);
        setFeedbackToEdit(null); // Modal yopilganda tahrirlanayotgan feedbackni tozalash
    };

    // FeedbackCarddagi "Tahrirlash" tugmasi bosilganda
    const handleEditFeedback = (feedback) => {
        setFeedbackToEdit(feedback); // Tahrirlanishi kerak bo'lgan feedbackni o'rnatish
        setIsModalOpen(true); // Modalni ochish
    };

    

    // FeedbackModal yuborish tugmasi bosilganda (yaratish yoki tahrirlash)
    const handleModalSubmit = async (feedbackData) => {
        if (feedbackToEdit) {
            // Tahrirlash rejimi
            dispatch(updateFeedbackStart());
            try {
                const response = await FeedbackService.updateFeedback(feedbackToEdit.id, feedbackData);
                dispatch(updateFeedbackSuccess(response)); // Redux state'ini yangilash
                closeModal();
                alert('Fikr-mulohaza muvaffaqiyatli tahrirlandi!');
                // navigate('/feedback'); // Agar kerak bo'lsa
            } catch (error) {
                console.error("Fikr-mulohazani tahrirlashda xatolik:", error);
                dispatch(updateFeedbackFailure(error.message));
                alert(`Xatolik yuz berdi: ${error.message || 'Noma\'lum xato'}`);
            }
        } else {
            // Yaratish rejimi
            dispatch(postFeedbackStart());
            try {
                const response = await FeedbackService.postFeedback(feedbackData);
                dispatch(postFeedbackSuccess(response)); // Redux state'ini yangilash
                closeModal();
                alert('Fikr-mulohazangiz muvaffaqiyatli yuborildi!');
                // navigate('/feedback'); // Agar kerak bo'lsa
            } catch (error) {
                console.error("Fikr-mulohazani yuborishda xatolik:", error);
                dispatch(postFeedbackFailure(error.message));
                alert(`Xatolik yuz berdi: ${error.message || 'Noma\'lum xato'}`);
            }
        }
    };

    // Feedback muvaffaqiyatli o'chirilganda chaqiriladigan funksiya
    const handleDeleteFeedbackSuccess = (deletedFeedbackId) => {
        dispatch(deleteFeedbackStart()); // O'chirish jarayonini boshlash
        try {
            // FeedbackCard allaqachon service.deleteFeedback() ni chaqirgan,
            // shuning uchun bu yerda faqat Redux state'ini yangilash kerak
            dispatch(deleteFeedbackSuccess(deletedFeedbackId));
            alert('Fikr-mulohaza muvaffaqiyatli o‘chirildi!');
        } catch (error) {
            console.error("Redux state'ini yangilashda xatolik (o'chirishdan keyin):", error);
            dispatch(deleteFeedbackFailure(error.message)); // Xato yuz bersa, Redux state'ini yangilash
            alert(`O'chirishdan keyin state'ni yangilashda xatolik: ${error.message || 'Noma\'lum xato'}`);
        }
    };


    const title = "Fikrlar Markazi";

    return (
        <div className="aurora-section">
            <div className="aurora-bg">
                <div className="aurora-1"></div>
                <div className="aurora-2"></div>
            </div>

            <main className="relative z-10">
                {/* 1. DRAMATIK HERO SECTION */}
                <section className="min-h-screen flex flex-col items-center justify-center text-center p-4">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-4">
                        {title.split('').map((char, i) => (
                            <span
                                key={i}
                                className="fade-in-char"
                                style={{ animationDelay: `${i * 50}ms` }}
                            >
                                {char === ' ' ? '\u00A0' : char}
                            </span>
                        ))}
                    </h1>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8 animate-slide-in" style={{ animationDelay: '0.7s' }}>
                        Hamjamiyatimizning yuragi shu yerda uradi. O'z taklifingizni qoldiring va loyihamizni birga rivojlantiraylik.
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg shadow-indigo-500/20 animate-slide-in"
                        style={{ animationDelay: '0.9s' }}
                    >
                        <i className="fas fa-plus-circle mr-2"></i> Fikr Qo'shish
                    </button>
                </section>

                {/* 2. "TAKTIL" FILTR PANELI (hozircha izohda) */}
                {/* <div className="sticky top-4 z-20 flex justify-center p-4">
                    <div className="relative flex items-center gap-2 p-1.5 bg-black/20 rounded-xl">
                        <div
                            className="absolute h-[80%] rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                            style={indicatorStyle}
                        ></div>
                        {tabs.map((tab, index) => (
                            <button
                                key={index}
                                ref={el => tabRefs.current[index] = el}
                                onClick={() => setActiveTab(index)}
                                className={`relative z-10 flex-1 py-2 px-4 rounded-md text-sm md:text-base font-semibold transition-colors ${
                                    activeTab === index ? 'text-white' : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div> */}

                {/* 3. TIMELINE KONTEYNERI */}
                <div className="container mx-auto px-4 py-16">
                    {isLoading && (
                        <div className="text-center text-gray-400 text-xl py-10">
                            <i className="fas fa-spinner fa-spin text-4xl mb-4 text-blue-500"></i>
                            <p>Fikrlarni yuklash...</p>
                        </div>
                    )}

                    {error && (
                        <div className="text-center text-red-400 text-xl py-10">
                            <i className="fas fa-exclamation-triangle text-4xl mb-4"></i>
                            <p>Xatolik yuz berdi: {error}</p>
                        </div>
                    )}

                    {!isLoading && !error && (
                        <div className="timeline-container flex flex-col items-stretch gap-y-16">
                            {feedbacks && feedbacks.length > 0 ? (
                                feedbacks.slice(0, visibleItems).map((feedback, i) => (
                                    <div
                                        key={feedback.id}
                                        className="timeline-item animate-slide-in"
                                        style={{ animationDelay: `${(i + 1) * 150}ms` }}
                                    >
                                        <FeedbackCard
                                            feedback={feedback}
                                            onEdit={handleEditFeedback}
                                            onDeleteSuccess={handleDeleteFeedbackSuccess} // Yangi propni uzatish
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-400 text-xl py-10 animate-slide-in">
                                    <i className="fas fa-comment-slash text-6xl mb-4 text-gray-600"></i>
                                    <p>Hozircha hech qanday fikr qoldirilmagan.</p>
                                    <p className="text-lg mt-2">Birinchi bo'lib o'z fikringizni qoldiring!</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Ko'proq Yuklash Tugmasi */}
                    {feedbacks && feedbacks.length > visibleItems && (
                        <div className="text-center mt-16">
                            <button
                                onClick={() => setVisibleItems(prev => prev + 3)}
                                className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
                            >
                                Ko'proq Yuklash
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* Fikr Qoldirish / Tahrirlash uchun Modal Oyna */}
            <FeedbackModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={handleModalSubmit}
                feedbackToEdit={feedbackToEdit}
            />
        </div>
    );
};

export default Feedback;