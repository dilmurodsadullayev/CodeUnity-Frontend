import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import FeedbackService from '../services/feedback'; // Bu fayl mavjudligiga ishonch hosil qiling

const FeedbackModal = ({ isOpen, onClose, onSubmit, feedbackToEdit }) => {
    const [feedbackText, setFeedbackText] = useState('');
    const [feedbackType, setFeedbackType] = useState('suggestion');
    const [title, setTitle] = useState('');
    const [screenshot, setScreenshot] = useState(null); // File object
    const [existingScreenshotUrl, setExistingScreenshotUrl] = useState(''); // Mavjud screenshot URL'i
    const navigate = useNavigate();

    const isEditing = !!feedbackToEdit; // Agar feedbackToEdit mavjud bo'lsa, tahrirlash rejimida

    useEffect(() => {
        if (isEditing && feedbackToEdit) {
            setFeedbackText(feedbackToEdit.message);
            setFeedbackType(feedbackToEdit.feedback_type);
            setTitle(feedbackToEdit.title || '');
            // Agar mavjud screenshot bo'lsa, uni saqlab qolish
            if (feedbackToEdit.screenshot) {
                setExistingScreenshotUrl(`${FeedbackService.BASEURL}${feedbackToEdit.screenshot}`);
            } else {
                setExistingScreenshotUrl('');
            }
            setScreenshot(null); // Yangi fayl tanlanmaguncha bo'sh
        } else {
            // Yangi feedback uchun modal ochilganda holatlarni tozalash
            setFeedbackText('');
            setFeedbackType('suggestion');
            setTitle('');
            setScreenshot(null);
            setExistingScreenshotUrl('');
        }
    }, [isOpen, isEditing, feedbackToEdit]); // isOpen o'zgarganda ham ishga tushsin

    if (!isOpen) return null;

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('feedback_type', feedbackType); // Backendga mos nom
        formData.append('title', title);
        formData.append('message', feedbackText);

        if (screenshot) {
            formData.append('screenshot', screenshot); // Yangi faylni qo'shish
        } else if (isEditing && !existingScreenshotUrl) {
            // Agar tahrirlash rejimida bo'lsa va avvalgi screenshot o'chirilgan bo'lsa
            // (ya'ni, existingScreenshotUrl bo'shatilgan bo'lsa), screenshotni null qilib yuboramiz.
            // Bu backendda rasmni o'chirishni bildiradi.
            // Backend bu holatni qanday boshqarishini tekshirish kerak.
            // Ba'zi hollarda alohida `remove_screenshot` flag kerak bo'lishi mumkin.
            // Hozircha, agar yangi fayl tanlanmasa va existingScreenshotUrl bo'sh bo'lsa,
            // 'screenshot' maydonini umuman yubormaslik mumkin yoki 'null' string qilib yuborish.
            // Lekin FormData bilan 'null' string yuborish faylni o'chirishni anglatmaydi.
            // Backendning spetsifikatsiyasiga qarang. Agar screenshotni o'chirish kerak bo'lsa,
            // bu yerda maxsus 'DELETE_SCREENSHOT' flag yuborish yaxshiroq bo'lishi mumkin.
            // Hozirgi kodda, agar `screenshot` bo'lmasa, u umuman yuborilmaydi.
            // Backendda bu mavjud rasmni o'chirmaslikni anglatishi mumkin.
            // Agar o'chirish kerak bo'lsa, backendda bu logikani implementatsiya qilish lozim.
        }

        try {
            let response;
            if (isEditing) {
                // Tahrirlash
                response = await FeedbackService.updateFeedback(feedbackToEdit.id, formData);
                alert('Fikr-mulohaza muvaffaqiyatli tahrirlandi!');
            } else {
                // Yaratish
                response = await FeedbackService.postFeedback(formData);
                alert('Fikr-mulohazangiz muvaffaqiyatli yuborildi!');
            }
            console.log("Response:", response.data);

            // Callback funksiyasini chaqirish
            onSubmit(response.data); 

            // Modallarni yopish va formani tozalash
            setFeedbackText('');
            setFeedbackType('suggestion');
            setTitle('');
            setScreenshot(null);
            setExistingScreenshotUrl('');
            onClose();
            // Agar kerak bo'lsa, sahifani yangilash yoki yo'naltirish
            // navigate("/feedback"); // Agar kerak bo'lsa
        } catch (error) {
            console.error("Fikr-mulohazani yuborishda/tahrirlashda xatolik yuz berdi:", error);
            alert(`Xatolik yuz berdi! Tafsilotlar: ${error.message || 'Noma\'lum xato'}`);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setScreenshot(e.target.files[0]);
            setExistingScreenshotUrl(''); // Yangi fayl tanlanganda eskisi o'chadi
        } else {
            setScreenshot(null);
        }
    };

    const handleRemoveExistingScreenshot = () => {
        setExistingScreenshotUrl(''); // Mavjud screenshot URL'ini o'chirish
        setScreenshot(null); // Yangi tanlangan screenshotni ham o'chirish
        // Bu yerda backendga rasmni o'chirish haqida signal yuborish kerak bo'lishi mumkin
        // agar rasm yuborilmasa, u o'zgarishsiz qolishi mumkin.
        // Backend logikangizga qarang.
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg animate-fade-in"
            onClick={onClose}
        >
            <div
                className="relative bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-2xl transform scale-95 opacity-0 animate-scale-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Yopish tugmasi */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
                    aria-label="Yopish"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>

                <h2 className="text-4xl font-extrabold text-white mb-8 text-center tracking-tight leading-tight">
                    {isEditing ? "Fikr-mulohazani tahrirlash" : "Fikringizni bildiring!"}
                </h2>

                <form onSubmit={handleFormSubmit}>
                    {/* Fikr turi */}
                    <div className="mb-6">
                        <label htmlFor="feedbackType" className="block text-gray-300 text-sm font-bold mb-2">
                            Fikr turi
                        </label>
                        <select
                            id="feedbackType"
                            name="feedback_type" // Backendga mos nom
                            value={feedbackType}
                            onChange={(e) => setFeedbackType(e.target.value)}
                            className="w-full bg-gray-700/50 border border-gray-600 rounded-xl p-4 text-white text-lg focus:ring-4 focus:ring-blue-600 focus:border-blue-600 transition-all duration-300 outline-none"
                            required
                        >
                            <option value="suggestion">Taklif</option>
                            <option value="bug">Xato / Bug</option>
                            <option value="praise">Maqtov / Kompliment</option>
                            <option value="other">Boshqa</option>
                        </select>
                    </div>

                    {/* Sarlavha */}
                    <div className="mb-6">
                        <label htmlFor="title" className="block text-gray-300 text-sm font-bold mb-2">
                            Sarlavha
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-gray-700/50 border border-gray-600 rounded-xl p-4 text-white text-lg placeholder-gray-400 focus:ring-4 focus:ring-blue-600 focus:border-blue-600 transition-all duration-300 outline-none"
                            placeholder="Qisqa sarlavha kiriting..."
                            required
                            maxLength="150"
                        />
                    </div>

                    {/* Xabar matni */}
                    <div className="mb-6">
                        <label htmlFor="feedbackText" className="block text-gray-300 text-sm font-bold mb-2">
                            Xabar
                        </label>
                        <textarea
                            id="feedbackText"
                            name="message" // Backendga mos nom
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            className="w-full bg-gray-700/50 border border-gray-600 rounded-xl p-5 text-white text-lg placeholder-gray-400 focus:ring-4 focus:ring-blue-600 focus:border-blue-600 transition-all duration-300 resize-none outline-none custom-scrollbar"
                            rows="7"
                            placeholder="Bu yerga qimmatli fikr-mulohazalaringizni yozing..."
                            required
                        ></textarea>
                    </div>

                    {/* Skrinshot yuklash */}
                    <div className="mb-8">
                        <label htmlFor="screenshot" className="block text-gray-300 text-sm font-bold mb-2">
                            Skrinshot yuklash (ixtiyoriy)
                        </label>
                        <input
                            type="file"
                            id="screenshot"
                            name="screenshot"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block w-full text-white text-sm file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:transition-all file:duration-300 cursor-pointer"
                        />
                        {screenshot && (
                            <p className="mt-2 text-gray-400 text-sm">Yuklangan yangi fayl: {screenshot.name}</p>
                        )}
                        {existingScreenshotUrl && !screenshot && (
                            <div className="mt-4 flex items-center bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                                <img src={existingScreenshotUrl} alt="Mavjud skrinshot" className="w-20 h-20 object-cover rounded-md mr-3" />
                                <span className="text-gray-300 text-sm">Mavjud rasm</span>
                                <button
                                    type="button"
                                    onClick={handleRemoveExistingScreenshot}
                                    className="ml-auto text-red-400 hover:text-red-500 transition-colors duration-200"
                                    aria-label="Mavjud rasmni o'chirish"
                                >
                                    <i className="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        )}
                        {!screenshot && !existingScreenshotUrl && isEditing && (
                            <p className="mt-2 text-gray-400 text-sm">Hozirda skrinshot yo'q.</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-700 hover:bg-blue-800 text-white font-extrabold py-4 rounded-xl text-xl transition-all duration-300 transform hover:scale-102 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-70"
                    >
                        {isEditing ? "Tahrirlashni saqlash" : "Yuborish"}
                    </button>
                </form>

                {/* Yaponcha naqshlar yoki soyalar qo'shish */}
                <div className="absolute top-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl -translate-x-12 -translate-y-12"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-xl translate-x-16 translate-y-16"></div>
            </div>

            {/* Global uslublar va animatsiyalar */}
            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes scale-up {
                    from { transform: scale(0.8); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }

                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }

                .animate-scale-up {
                    animation: scale-up 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; /* Tezroq va silliqroq animatsiya */
                }

                /* Maxsus scrollbar uslubi */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }

                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #374151; /* gray-700 */
                    border-radius: 10px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #4B5563; /* gray-600 */
                    border-radius: 10px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #6B7280; /* gray-500 */
                }
            `}</style>
        </div>
    );
};

FeedbackModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    feedbackToEdit: PropTypes.object, // Tahrirlanishi kerak bo'lgan feedback obyekti (ixtiyoriy)
};

export default FeedbackModal;