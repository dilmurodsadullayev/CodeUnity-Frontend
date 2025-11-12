import React, { useEffect, useState } from 'react';
import { getProjectCommentFailure, getProjectCommentStart, getProjectCommentSuccess } from '../features/projects';
import { useDispatch, useSelector } from 'react-redux';
import ProjectService from '../services/project'; 
import UserImage from '../assests/userImage.jpeg'
import timeAgo from '../utils/timeAgo';

// O'chirishni tasdiqlash modalini import qilish
import DeleteConfirmationModal from './DeleteConfirmationModal'; // Sizning bergan yo'lingizga qarab o'zgartiring!

const selectProjectState = (state) => state.project;

// ===========================================
// **Yangi qism: $ belgilarini belgilash funksiyasi**
// ===========================================
const renderCommentBody = (text) => {
    // $ bilan boshlangan so'zlarni (alfa-raqamli belgilar, _ yoki - bo'lishi mumkin) ajratib oladigan regex
    const parts = text.split(/(\$[a-zA-Z0-9_-]+)/g);

    // Agar belgilash bosilganda biror ish qilmoqchi bo'lsangiz, bu yerga funksiya qo'shing.
    const handleTagClick = (tag) => {
        // Bu joyda siz $tag bo'yicha navigatsiya yoki boshqa logikani amalga oshirishingiz mumkin
        console.log("Belgilash bosildi:", tag); 
        // Masalan: navigate(`/tags/${tag.substring(1)}`);
        alert(`Siz "${tag}" belgisini bosdingiz.`);
    };

    return parts.map((part, index) => {
        if (part.startsWith('$')) {
            // $ belgisi bilan boshlangan so'z. Uni belgilaymiz.
            return (
                <span 
                    key={index} 
                    className="text-indigo-400 font-medium cursor-pointer hover:text-indigo-300 transition duration-100"
                    onClick={(e) => {
                        e.stopPropagation(); // Sharh bloki bosilishining oldini olish
                        handleTagClick(part);
                    }}
                >
                    {part}
                </span>
            );
        }
        // Oddiy matn
        return <span key={index}>{part}</span>;
    });
};
// ===========================================
// ===========================================


const ProjectDiscussion = ({projectId}) => {
    const dispatch = useDispatch();
    const { projectComments, project_comment_isLoading, project_comment_error } = useSelector(selectProjectState);
    const { isLoggedIn, user } = useSelector((state) => state.auth);

    // Yangi comment uchun state
    const [newCommentText, setNewCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    
    // Sharhni kattalashtirib ko'rsatish uchun state
    const [selectedComment, setSelectedComment] = useState(null); 
    
    // ==========================================================
    // **Yangi State'lar (Edit & Delete uchun)**
    // ==========================================================
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingComment, setEditingComment] = useState(null);
    const [editCommentText, setEditCommentText] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    // ==========================================================

    // Sharhlarni yuklash funksiyasi
    const getProjectComments = async () => {
        dispatch(getProjectCommentStart());
        try {
            // BACKENDGA YUBORILADIGAN DATA: projectId
            const response = await ProjectService.getProjectComments(projectId); 
            
            dispatch(getProjectCommentSuccess(response || [])); 
        } catch (err) {
            console.error("ProjectComments olishda xato:", err);
            dispatch(getProjectCommentFailure(err.message || "Sharhlarni yuklashda noma'lum xato yuz berdi."));
        }
    };

    // Yangi sharh qo'shish funksiyasi
    const addProjectComment = async () => {
        if (!newCommentText.trim()) {
            setSubmitError("Iltimos, sharh matnini kiriting.");
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const commentData = {
                body: newCommentText // BACKENDGA YUBORILADIGAN DATA
            }
            
            await ProjectService.projectCommentCreate(projectId, commentData) 
            
            setNewCommentText(''); // Inputni tozalash
            await getProjectComments(); // Ro'yxatni yangilash

        } catch (err) {
            console.error("Sharh yuborishda xato:", err);
            let errorMessage = err.message || "Sharhni yuborishda xato yuz berdi.";
            if (err.response && err.response.data && err.response.data.body) {
                errorMessage = err.response.data.body.join(', ');
            }
            setSubmitError(errorMessage);

        } finally {
            setIsSubmitting(false);
        }
    };
    
    // ==========================================================
    // **Tahrirlash (Edit) funksiyalari**
    // ==========================================================
    
    const handleEditClick = (comment) => {
        setSelectedComment(null); // Agar View Modal ochiq bo'lsa yopish
        setEditingComment(comment);
        setEditCommentText(comment.body);
        setUpdateError(null);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingComment(null);
        setEditCommentText('');
        setUpdateError(null);
    };

    const handleUpdateComment = async () => {
        if (!editCommentText.trim()) {
            setUpdateError("Iltimos, sharh matnini kiriting.");
            return;
        }

        setIsUpdating(true);
        setUpdateError(null);

        try {
            const updateData = {
                body: editCommentText // BACKENDGA YUBORILADIGAN DATA (PATCH/PUT)
            }
            
            await ProjectService.projectCommentUpdate(projectId, editingComment.id, updateData); 
            
            await getProjectComments(); // Ro'yxatni yangilash
            handleCloseEditModal(); // Modalni yopish

        } catch (err) {
            console.error("Sharhni tahrirlashda xato:", err);
            let errorMessage = err.message || "Sharhni tahrirlashda xato yuz berdi.";
            if (err.response && err.response.data && err.response.data.body) {
                errorMessage = err.response.data.body.join(', ');
            }
            setUpdateError(errorMessage);

        } finally {
            setIsUpdating(false);
        }
    };

    // ==========================================================
    // **O'chirish (Delete) funksiyalari**
    // ==========================================================

    const handleDeleteClick = (comment) => {
        setSelectedComment(null); // Agar View Modal ochiq bo'lsa yopish
        setCommentToDelete(comment);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setCommentToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!commentToDelete) return;

        setIsDeleting(true);

        try {
            // BACKENDGA YUBORILADIGAN DATA: projectId, commentId
            await ProjectService.projectCommentDelete(projectId, commentToDelete.id); 
            
            await getProjectComments(); // Ro'yxatni yangilash
            handleCloseDeleteModal();

        } catch (err) {
            console.error("Sharhni o'chirishda xato:", err);
            alert("Sharhni o'chirishda xato yuz berdi: " + (err.message || "Noma'lum xato")); // Foydalanuvchiga xato haqida xabar berish
            handleCloseDeleteModal(); // Xatoga qaramay modalni yopish
        } finally {
            setIsDeleting(false);
        }
    };


    // Sharhni ochish
    const handleCommentClick = (comment) => {
        setSelectedComment(comment);
    };

    // Modalni yopish
    const handleCloseModal = () => {
        setSelectedComment(null);
    };

    // Komponent yuklanganda va projectId o'zgarganda sharhlarni yuklash
    useEffect(() => {
        getProjectComments();
    }, [projectId]); 
 

    return (
        <section className="p-6 md:p-10 border-t border-gray-700/50 bg-gray-900 shadow-xl rounded-lg mt-4 relative">
            <h2 className="text-3xl font-extrabold text-white mb-8 border-b border-indigo-500/30 pb-3">
                Loyiha Muhokamasi <span className="text-indigo-400">({projectComments.length})</span>
            </h2>
            
            {/* Yangi sharh qo'shish qismi - (O'zgarishsiz) */}
            <div className="flex items-start gap-4 mb-10 p-4 border border-gray-800 rounded-xl bg-gray-950/50"> 
                <img 
                    src={user?.image ?? 'https://i.pravatar.cc/150?u=current_user'} 
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0 border-2 border-indigo-500" 
                    alt="Current User" 
                />
                <div className="w-full">
                    <textarea 
                        className="w-full bg-gray-800 border border-gray-700/60 rounded-lg p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200" 
                        rows="4" 
                        placeholder={isLoggedIn ? "Fikringizni qoldiring... ($belgi foydalanib belgilashingiz mumkin)" : "Sharh qoldirish uchun tizimga kiring..."}
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        disabled={isSubmitting || !isLoggedIn} 
                    ></textarea>

                    {/* Xatolik xabari */}
                    {submitError && (
                         <p className="text-sm text-red-400 mt-2 mb-2 p-2 bg-red-900/30 rounded-md border border-red-700">{submitError}</p>
                    )}
                    
                    <button 
                        className={`mt-3 text-white font-semibold py-2 px-5 rounded-xl shadow-lg shadow-indigo-500/30 transition-all duration-200 float-right flex items-center gap-2
                            ${isSubmitting || !newCommentText.trim() || !isLoggedIn
                                ? 'bg-indigo-700/50 cursor-not-allowed shadow-none' 
                                : 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700'
                            }`}
                        onClick={addProjectComment}
                        disabled={isSubmitting || !newCommentText.trim() || !isLoggedIn} 
                    >
                        {isSubmitting && (
                            // Loading Spinner SVG
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {isLoggedIn ? 'Yuborish' : 'Kirish kerak'}
                    </button>
                </div>
            </div>
            
            {/* Mavjud sharhlar ro'yxati - (Edit/Delete tugmalari qo'shildi) */}
            <div className="space-y-6 pt-6 border-t border-gray-800">
                {/* ... (Error/Loading/No Comments holatlari o'zgarishsiz) ... */}
                {project_comment_error ? (
                    <div className="text-center py-10 bg-red-900/30 border-2 border-red-700 rounded-xl shadow-inner">
                        <svg className="w-14 h-14 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <p className="text-red-300 font-bold text-xl">Sharhlarni yuklashda xatolik yuz berdi!</p>
                        <p className="text-sm text-red-400 mt-2">Xato: {project_comment_error}</p>
                    </div>
                ) : 
                
                project_comment_isLoading ? (
                    <div className="text-center py-10">
                        <svg className="animate-spin h-8 w-8 text-indigo-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="mt-4 text-gray-400 font-medium">Sharhlar yuklanmoqda, iltimos kuting...</p>
                    </div>
                ) : 
                
                projectComments.length === 0 ? (
                    <div className="text-center py-10 bg-gray-800/50 rounded-xl border border-gray-700">
                        <svg className="w-14 h-14 text-indigo-500 mx-auto opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.549A9.995 9.995 0 013 12C3 7.582 7.03 4 12 4s9 3.582 9 8z"></path>
                        </svg>
                        <p className="mt-4 text-xl font-bold text-gray-300">Hozircha hech qanday sharh yo'q.</p>
                        <p className="text-gray-500">Birinchi bo'lib fikringizni bildiring!</p>
                    </div>
                ) : (
                    
                    /* Sharhlar ro'yxati */
                    <div className="space-y-4">
                        {projectComments.map(comment => {
                             const isAuthor = isLoggedIn && user?.id === comment.user.id; // Yozuvchi ekanligini tekshirish

                            return (
                                <div key={comment.id} className="flex gap-4 p-4 rounded-xl border border-gray-800 bg-gray-950 transition duration-150 hover:bg-gray-800/70 shadow-md">
                                    <img 
                                        src={comment.user?.image ?? UserImage} 
                                        className="w-12 h-12 rounded-full mt-1 object-cover flex-shrink-0 border-2 border-gray-700" 
                                        alt={comment.user.username} 
                                    />
                                    <div className='flex-1'>
                                        <div className="flex justify-between items-start">
                                            <p className="font-semibold text-white flex flex-col md:flex-row items-start md:items-center gap-1">
                                                {comment.user.username} 
                                                <span className="text-xs font-normal text-gray-400 md:ml-3">
                                                    {timeAgo(comment.created_at)}
                                                </span>
                                            </p>
                                            
                                            {/* Edit va Delete tugmalari */}
                                            {isAuthor && (
                                                <div className="flex gap-2">
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleEditClick(comment); }}
                                                        className="p-1 text-sm rounded-full text-indigo-400 hover:text-indigo-300 hover:bg-gray-700 transition duration-150"
                                                        title="Tahrirlash"
                                                    >
                                                        {/* Edit Icon */}
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-7-3l-4 4L8 15l-1 4h4l4-4 4-4-4-4z"></path></svg>
                                                    </button>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleDeleteClick(comment); }}
                                                        className="p-1 text-sm rounded-full text-red-400 hover:text-red-300 hover:bg-gray-700 transition duration-150"
                                                        title="O'chirish"
                                                    >
                                                        {/* Delete Icon */}
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Sharh matnini bosiladigan qildik va $ belgilarini belgilash uchun renderCommentBody ishlatildi */}
                                        <div 
                                            className="text-gray-300 mt-2 whitespace-pre-line break-words leading-relaxed cursor-pointer hover:text-gray-100 transition duration-150" 
                                            onClick={() => handleCommentClick(comment)}
                                        >
                                            {/* Agar matn uzun bo'lsa, tug'ri chiziq bilan kesish uchun */}
                                            {comment.body.length > 200 
                                                ? <>{renderCommentBody(`${comment.body.substring(0, 200)}... (To'liq ko'rish)`)}</>
                                                : renderCommentBody(comment.body)
                                            }
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            
            {/* ======================================= */}
            {/* **Sharhni ko'rsatish Modal (View)** */}
            {/* ======================================= */}
            {selectedComment && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 transition-opacity duration-300" 
                    onClick={handleCloseModal} 
                >
                    <div 
                        className="bg-gray-900 border border-indigo-600/50 rounded-xl shadow-2xl max-w-xl w-full p-6 md:p-8 transform transition-all duration-300 scale-100 opacity-100" 
                        onClick={(e) => e.stopPropagation()} 
                    >
                        {/* Modal Bosh sahifasi (Header) */}
                        <div className="flex justify-between items-start border-b border-gray-700/70 pb-3 mb-4">
                            <div className='flex items-center gap-3'>
                                 <img 
                                    src={selectedComment.user?.image ?? UserImage} 
                                    className="w-12 h-12 rounded-full object-cover flex-shrink-0 border-2 border-indigo-500" 
                                    alt={selectedComment.user.username} 
                                />
                                <div>
                                    <p className="font-bold text-white text-xl">{selectedComment.user.username}</p>
                                    <span className="text-md font-normal text-indigo-400">{timeAgo(selectedComment.created_at)}</span>
                                </div>
                            </div>
                            <div className='flex items-center gap-2'>
                                {/* Yozuvchi bo'lsa, tahrirlash tugmasini qo'shish */}
                                {isLoggedIn && user?.id === selectedComment.user.id && (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleEditClick(selectedComment); }}
                                        className="text-gray-400 hover:text-indigo-400 transition duration-150 p-2 rounded-full hover:bg-gray-800"
                                        title="Tahrirlash"
                                    >
                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-7-3l-4 4L8 15l-1 4h4l4-4 4-4-4-4z"></path></svg>
                                    </button>
                                )}

                                {/* Yopish tugmasi */}
                                <button 
                                    onClick={handleCloseModal}
                                    className="text-gray-400 hover:text-white transition duration-150 p-2 rounded-full hover:bg-gray-800"
                                >
                                    {/* Close Icon (X) */}
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>
                        </div>
                        
                        {/* Sharh matni (to'liq matn uchun renderCommentBody) */}
                        <div className="max-h-[70vh] overflow-y-auto pr-2">
                             <p className="text-xl text-gray-200 whitespace-pre-line break-words leading-relaxed font-light">
                                {renderCommentBody(selectedComment.body)}
                            </p>
                        </div>
                       
                    </div>
                </div>
            )}

            {/* ======================================= */}
            {/* **Sharhni Tahrirlash Modal (Edit)** */}
            {/* ======================================= */}
            {isEditModalOpen && editingComment && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 transition-opacity duration-300" 
                    onClick={handleCloseEditModal} 
                >
                    <div 
                        className="bg-gray-900 border border-indigo-600/50 rounded-xl shadow-2xl max-w-xl w-full p-6 md:p-8 transform transition-all duration-300 scale-100 opacity-100" 
                        onClick={(e) => e.stopPropagation()} 
                    >
                        {/* Modal Bosh sahifasi (Header) */}
                        <div className="flex justify-between items-start border-b border-gray-700/70 pb-3 mb-4">
                            <h3 className="text-2xl font-bold text-white">Sharhni tahrirlash</h3>
                            <button 
                                onClick={handleCloseEditModal}
                                className="text-gray-400 hover:text-white transition duration-150 p-2 rounded-full hover:bg-gray-800"
                            >
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        {/* Tahrirlash formasi */}
                        <textarea 
                            className="w-full bg-gray-800 border border-gray-700/60 rounded-lg p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200" 
                            rows="6" 
                            placeholder="Sharh matnini kiriting..."
                            value={editCommentText}
                            onChange={(e) => setEditCommentText(e.target.value)}
                            disabled={isUpdating} 
                        ></textarea>
                        
                        {/* Xatolik xabari */}
                        {updateError && (
                            <p className="text-sm text-red-400 mt-2 mb-2 p-2 bg-red-900/30 rounded-md border border-red-700">{updateError}</p>
                        )}

                        {/* Tugmalar */}
                        <div className="flex justify-end gap-3 mt-4">
                            <button 
                                onClick={handleCloseEditModal}
                                className="text-gray-400 font-semibold py-2 px-5 rounded-xl transition-all duration-200 hover:bg-gray-800"
                                disabled={isUpdating}
                            >
                                Bekor Qilish
                            </button>
                            <button 
                                onClick={handleUpdateComment}
                                disabled={isUpdating || !editCommentText.trim()} 
                                className={`text-white font-semibold py-2 px-5 rounded-xl shadow-lg shadow-indigo-500/30 transition-all duration-200 flex items-center gap-2
                                    ${isUpdating || !editCommentText.trim()
                                        ? 'bg-indigo-700/50 cursor-not-allowed shadow-none' 
                                        : 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700'
                                    }`}
                            >
                                {isUpdating && (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                Saqlash
                            </button>
                        </div>
                       
                    </div>
                </div>
            )}
            
            {/* ======================================= */}
            {/* **O'chirishni tasdiqlash Modal (Delete)** */}
            {/* ======================================= */}
            <DeleteConfirmationModal 
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                itemTitle={commentToDelete ? commentToDelete.body.substring(0, 50) + '...' : 'Sharh'} 
                isProcessing={isDeleting} // Bu propni DeleteConfirmationModal'ga qo'shish kerak (agar mavjud bo'lsa)
            />

        </section>
    );
};

export default ProjectDiscussion;
