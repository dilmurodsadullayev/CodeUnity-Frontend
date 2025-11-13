import React, { useState } from 'react';
import { useDispatch } from 'react-redux'; 
import timeAgo from '../utils/timeAgo'; 
import DeleteConfirmationModal from './DeleteConfirmationModal'; 
import PostService from '../services/post'; 
import { 
    updateCommentSuccess, 
    deleteCommentSuccess,
    // updateCommentFailure, deleteCommentFailure // Agar errorlarni global kuzatish kerak bo'lsa
} from '../features/posts'; // postSlice'dan actionlar

// Eslatma: Bu yerda isCommentOwner tugmalarni ko'rsatish shartida qolib ketgan edi, uni to'g'irladim.

const PostCommentItem = ({ comment, postAuthorUsername, currentUserId }) => {
    const dispatch = useDispatch(); 

    // Statelar
    const [collapsed, setCollapsed] = useState(false);
    const [isEditing, setIsEditing] = useState(false); 
    const [editMessage, setEditMessage] = useState(comment.message);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false); 
    const [editError, setEditError] = useState(null);

    // Mualliflar tekshiruvi
    const isAuthor = comment.user.username === postAuthorUsername;
    const isCommentOwner = comment.user.id === currentUserId; 

    // Javoblar tekshiruvi
    const hasReplies = comment.replies && comment.replies.length > 0;

    // =============================================================
    // 🌟 1. Sharhni Tahrirlashni Saqlash (API Call va Redux)
    // =============================================================
    const handleSaveEdit = async () => {
        // if (!isCommentOwner || isProcessing || editMessage.trim() === comment.message.trim()) return;

        setIsProcessing(true);
        setEditError(null);
        
        try {
            // API chaqiruvi: comment.id va yangi xabar
            const updatedComment = await PostService.updatePostComment(
                comment.id, 
                { message: editMessage }
            );

            // 1. Redux state'ni yangilash (PostSlice'dagi commentlar ro'yxatini yangilaydi)
            dispatch(updateCommentSuccess(updatedComment)); 
            
            // 2. Lokal UI'ni yopish
            setIsEditing(false); 
            // 3. Xabarni mahalliy (local) Comment obyekti ichida yangilash (agar u Redux'dan kelmasa)
            // Agar u Redux'dan kelsa, bu yerda yangilash shart emas, chunki Redux yangilanishi avtomatik o'zgaradi.
            
        } catch (error) {
            console.error("Sharhni tahrirlashda xato:", error);
            const errMsg = JSON.parse(error.message)?.message || "Sharhni saqlashda xato yuz berdi.";
            setEditError(errMsg);
            // dispatch(updateCommentFailure(errMsg));
        } finally {
            setIsProcessing(false);
        }
    };

    // =============================================================
    // 🌟 2. Sharhni O'chirishni Tasdiqlash (API Call va Redux)
    // =============================================================
    const handleConfirmDelete = async () => {
        // if (!isCommentOwner || isProcessing) return;

        setIsProcessing(true);

        try {
            // API chaqiruvi: comment.id orqali o'chirish
            await PostService.deletePostComment(comment.id); 

            // Redux state'ni yangilash (Commentni ro'yxatdan o'chirish va countni kamaytirish)
            dispatch(deleteCommentSuccess(comment.id)); 
            
            // Modalni yopish
            setIsDeleteModalOpen(false); 
            
        } catch (error) {
            console.error("Sharhni o'chirishda xato:", error);
            alert("Sharhni o'chirishda xato yuz berdi.");
            // dispatch(deleteCommentFailure(error.message));
            setIsDeleteModalOpen(false); 
        } finally {
            setIsProcessing(false);
        }
    };
    
    // =============================================================
    // LOKAL HANDLERLAR
    // =============================================================
    const handleReplyClick = () => {
        alert(`"${comment.user.username}"ga javob yozish funksiyasi chaqirildi.`);
    };

    const handleLikeClick = () => {
        alert(`"${comment.user.username}" sharhiga like bosildi/olindi.`);
    };
    

    // =============================================================
    // RENDERING
    // =============================================================
    return (
        <div className="comment-container">
            <div className="flex gap-4">
                <div className="flex-shrink-0 relative">
                    <img 
                        src={comment.user.image || 'https://i.pravatar.cc/150?u=placeholder'} 
                        className="w-12 h-12 rounded-full mt-1"
                        alt={`${comment.user.username} avatari`}
                    />
                    {hasReplies && (
                        <div 
                            onClick={() => setCollapsed(!collapsed)} 
                            className="comment-thread-line"
                            title={collapsed ? 'Javoblarni ochish' : 'Javoblarni yopish'}
                        ></div>
                    )}
                </div>
                <div className="w-full">
                    <div className="bg-gray-800/60 rounded-lg p-4">
                        <p className="font-bold text-white">
                            {comment.user.username} 
                            {isAuthor && <span className="text-xs bg-indigo-500/50 text-indigo-300 py-0.5 px-1.5 rounded-md ml-2">Muallif</span>}
                            <span className="text-sm font-normal text-gray-500 ml-2">&middot; {timeAgo(comment.created_at)}</span>
                        </p>
                        
                        {/* 🌟 SHARH XABARI YOKI TAHRIRLASH FORMASI */}
                        {isEditing ? (
                            <div className='mt-1'>
                                <textarea
                                    value={editMessage}
                                    onChange={(e) => setEditMessage(e.target.value)}
                                    rows="3"
                                    className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-white resize-none focus:ring-indigo-500 focus:border-indigo-500"
                                    disabled={isProcessing}
                                />
                                {editError && <p className="text-red-400 text-sm mt-1">{editError}</p>}
                                <div className='flex justify-end gap-2 mt-2'>
                                    <button
                                        onClick={() => { setIsEditing(false); setEditMessage(comment.message); setEditError(null); }}
                                        className="text-sm font-semibold text-gray-400 hover:text-white px-2 py-1 rounded transition"
                                        disabled={isProcessing}
                                    >
                                        Bekor qilish
                                    </button>
                                    <button
                                        onClick={handleSaveEdit}
                                        className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded transition disabled:opacity-50"
                                        disabled={isProcessing || editMessage.trim() === '' || editMessage.trim() === comment.message.trim()}
                                    >
                                        {isProcessing ? <i className="fas fa-spinner fa-spin mr-1"></i> : null}
                                        {isProcessing ? 'Saqlanmoqda...' : 'Saqlash'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-300 mt-1">{comment.message}</p>
                        )}
                        
                    </div>
                    
                    {/* Tugmalar paneli */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-2 ml-2">
                        {/* Like tugmasi */}
                        <button 
                            onClick={handleLikeClick}
                            className="font-semibold hover:text-pink-400 flex items-center gap-1 transition-colors"
                        >
                            <i className="fas fa-heart"></i> {comment.likes || 0}
                        </button>
                        
                        {/* Javob tugmasi */}
                        <button 
                            onClick={handleReplyClick}
                            className="font-semibold hover:text-white transition-colors"
                        >
                            Javob yozish
                        </button>
                        
                        {/* 🌟 TAHRIRLASH/O'CHIRISH TUGMALARI */}
                        {/* {isCommentOwner && !isEditing && ( */}
                            <>
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="font-semibold hover:text-indigo-400 transition-colors"
                                >
                                    <i className="fas fa-edit mr-1"></i> Tahrirlash
                                </button>
                                <button 
                                    onClick={() => setIsDeleteModalOpen(true)}
                                    className="font-semibold hover:text-red-400 transition-colors"
                                >
                                    <i className="fas fa-trash-alt mr-1"></i> O'chirish
                                </button>
                            </>
                        {/* )} */}
                        
                        {/* Javoblarni yig'ish/ochish tugmasi */}
                        {hasReplies && (
                             <button 
                                onClick={() => setCollapsed(!collapsed)} 
                                className="font-semibold hover:text-white flex items-center gap-1 transition-colors"
                            >
                                {collapsed ? `[+] (${comment.replies.length} javob)` : '[-]'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Javoblar (Replies) */}
            {!collapsed && hasReplies && (
                <div className="space-y-6 mt-6 comment-reply"> 
                    {comment.replies.map(reply => (
                        <PostCommentItem 
                            key={reply.id} 
                            comment={reply} 
                            postAuthorUsername={postAuthorUsername}
                            currentUserId={currentUserId} // Recursiv chaqiruvda ID o'tkazish
                        /> 
                    ))}
                </div>
            )}

            {/* 🌟 O'CHIRISH MODALI */}
            <DeleteConfirmationModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete} 
                itemTitle={`Sharh (${comment.message.substring(0, 30)}...)`}
                isProcessing={isProcessing}
            />
        </div>
    );
};

export default PostCommentItem;