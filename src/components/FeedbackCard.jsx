import React, { useState } from 'react';
import PropTypes from 'prop-types';
import UserImagePlaceholder from '../assests/userImage.jpeg';
import DeleteConfirmationModal from './DeleteConfirmationModal'; // DeleteConfirmationModal'ni import qilamiz
import FeedbackService from '../services/feedback'; // BASEURL uchun
import timeAgo from '../utils/timeAgo';

const FeedbackCard = ({ feedback, onEdit, onDeleteSuccess }) => { // onDeleteSuccess propini qabul qilamiz
    const [isVerifiedUser] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // O'chirish modalini boshqarish holati

    const BASEURL = "http://127.0.0.1:8000/";
    console.log(feedback.user.image)
    const userAvatar = feedback.user.image
        ? `${feedback.user.image}`
        : UserImagePlaceholder;

    const screenshotUrl = feedback.screenshot
        ? `${feedback.screenshot}`
        : null;

    const getFeedbackTypeDisplay = (type) => {
        switch (type) {
            case 'suggestion':
                return {
                    label: "Taklif",
                    icon: "fas fa-lightbulb",
                    color: "text-blue-400 bg-blue-900/40 border-blue-700",
                    hoverColor: "hover:bg-blue-800/60"
                };
            case 'bug':
                return {
                    label: "Xato / Bug",
                    icon: "fas fa-bug",
                    color: "text-red-400 bg-red-900/40 border-red-700",
                    hoverColor: "hover:bg-red-800/60"
                };
            case 'praise':
                return {
                    label: "Maqtov",
                    icon: "fas fa-star",
                    color: "text-yellow-400 bg-yellow-900/40 border-yellow-700",
                    hoverColor: "hover:bg-yellow-800/60"
                };
            case 'other':
                return {
                    label: "Boshqa",
                    icon: "fas fa-info-circle",
                    color: "text-gray-400 bg-gray-700/40 border-gray-600",
                    hoverColor: "hover:bg-gray-600/60"
                };
            default:
                return {
                    label: "Noma'lum",
                    icon: "fas fa-question-circle",
                    color: "text-gray-500 bg-gray-800/40 border-gray-700",
                    hoverColor: "hover:bg-gray-700/60"
                };
        }
    };

    const feedbackTypeDisplay = getFeedbackTypeDisplay(feedback.feedback_type);

 

    const handleEditClick = () => {
        if (onEdit) {
            onEdit(feedback);
        }
    };

    const handleDeleteClick = () => {
            setIsDeleteModalOpen(true); // O'chirish modalini ochamiz
        };
    
    const handleConfirmDelete = async () => {
        try {
            await FeedbackService.deleteFeedback(feedback.id);
            setIsDeleteModalOpen(false); // Modalni yopamiz
            if (onDeleteSuccess) {
                onDeleteSuccess(feedback.id); // Yuqori komponentga o'chirish muvaffaqiyatli bo'lganini xabar beramiz
            }
        } catch (error) {
            console.error("Feedbackni o'chirishda xato yuz berdi:", error);
            // Foydalanuvchiga xato haqida xabar berish
            alert("Fikrni o'chirishda xato yuz berdi: " + (error.message || "Noma'lum xato"));
        }
    };

    

    return (
        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 p-7 rounded-3xl shadow-2xl border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-2 hover:scale-102 h-full flex flex-col justify-between overflow-hidden group">
            {/* Orqa fon bezaklari (yoki abstrakt shakllar) */}
            <div className="absolute top-0 left-0 w-24 h-24 bg-blue-600/10 rounded-full blur-xl -translate-x-1/3 -translate-y-1/3 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 bg-purple-600/10 rounded-full blur-xl translate-x-1/4 translate-y-1/4 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="flex items-start mb-5 z-10">
                <img
                    src={userAvatar}
                    alt={`${feedback.user.username} avatari`}
                    className="w-16 h-16 rounded-full border-4 border-blue-500 shadow-md transform group-hover:scale-110 transition-transform duration-200 object-cover"
                />
                <div className="ml-5 flex-grow">
                    <h4 className="font-extrabold text-white text-2xl leading-tight flex items-center">
                        {feedback.user.username}
                        {isVerifiedUser && (
                            <span className="ml-2 text-blue-400 text-base" aria-label="Tasdiqlangan foydalanuvchi">
                                <i className="fas fa-check-circle"></i>
                            </span>
                        )}
                    </h4>
                    {isVerifiedUser && (
                        <p className="text-xs text-blue-300 font-medium mt-1">
                            Tasdiqlangan foydalanuvchi
                        </p>
                    )}
                    {feedback.title && (
                         <p className="text-gray-400 text-sm mt-1 italic">
                            Mavzu: {feedback.title}
                        </p>
                    )}
                </div>
            </div>

            {/* Feedback turini ko'rsatish */}
            <div className="mb-4 z-10">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border-2 ${feedbackTypeDisplay.color} transition-all duration-200`}>
                    <i className={`${feedbackTypeDisplay.icon} mr-2`}></i>
                    {feedbackTypeDisplay.label}
                </span>
            </div>

            <p className="text-gray-200 text-lg leading-relaxed mb-6 flex-grow custom-scrollbar-text z-10">
                {feedback.message}
            </p>

            {/* Screenshotni ko'rsatish */}
            {screenshotUrl && (
                <div className="mb-6 z-10">
                    <h5 className="text-gray-300 text-sm font-semibold mb-2">Ilova:</h5>
                    <a
                        href={screenshotUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-lg overflow-hidden border border-gray-600 hover:border-blue-500 transition-colors duration-200 shadow-lg"
                    >
                        <img
                            src={screenshotUrl}
                            alt={`Screenshot for ${feedback.title || 'feedback'}`}
                            className="w-full h-auto max-h-60 object-contain object-center bg-gray-900 rounded-lg"
                        />
                    </a>
                    <p className="text-xs text-gray-500 mt-2">Tasvirni kattaroq ko'rish uchun bosing.</p>
                </div>
            )}

            <div className="border-t border-gray-700 pt-4 flex justify-between items-center text-gray-400 text-sm z-10">
                <span className="text-gray-500 text-base" aria-label="Fikr yozilgan vaqti">
                    {timeAgo(feedback.created_at)}
                </span>

                <div className="flex space-x-3"> {/* Tugmalar orasiga bo'sh joy qo'shish */}
                    {/* Tahrirlash tugmasi */}
                    <button
                        onClick={handleEditClick}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors duration-200 flex items-center shadow-md"
                    >
                        <i className="fas fa-edit mr-2"></i> Tahrirlash
                    </button>

                    {/* O'chirish tugmasi */}
                    <button
                        onClick={handleDeleteClick}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors duration-200 flex items-center shadow-md"
                    >
                        <i className="fas fa-trash-alt mr-2"></i> O'chirish
                    </button>
                </div>
            </div>

            {/* Maxsus scrollbar uslubi - faqat matn uchun */}
            <style jsx>{`
                .custom-scrollbar-text {
                    max-height: 150px;
                    overflow-y: auto;
                    padding-right: 8px;
                }

                .custom-scrollbar-text::-webkit-scrollbar {
                    width: 8px;
                }

                .custom-scrollbar-text::-webkit-scrollbar-track {
                    background: transparent;
                }

                .custom-scrollbar-text::-webkit-scrollbar-thumb {
                    background: #4B5563;
                    border-radius: 10px;
                }

                .custom-scrollbar-text::-webkit-scrollbar-thumb:hover {
                    background: #6B7280;
                }
            `}</style>

            {/* O'chirishni tasdiqlash modali */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                itemTitle={feedback.title || feedback.message.substring(0, 30) + "..."} // Fikr sarlavhasi yoki xabarning bir qismi
            />
        </div>
    );
};

FeedbackCard.propTypes = {
    feedback: PropTypes.shape({
        id: PropTypes.number.isRequired,
        user: PropTypes.shape({
            id: PropTypes.number.isRequired,
            username: PropTypes.string.isRequired,
            first_name: PropTypes.string,
            last_name: PropTypes.string,
            skill_level: PropTypes.string,
            image: PropTypes.string,
        }).isRequired,
        feedback_type: PropTypes.string.isRequired,
        title: PropTypes.string,
        message: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        admin_comment: PropTypes.string,
        created_at: PropTypes.string.isRequired,
        screenshot: PropTypes.string,
    }).isRequired,
    onEdit: PropTypes.func,
    onDeleteSuccess: PropTypes.func, // onDeleteSuccess propini qo'shamiz
};

export default FeedbackCard;