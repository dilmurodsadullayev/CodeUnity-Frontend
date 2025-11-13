import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

import PostService from '../services/post'; 
import { 
    getPostDetailStart, 
    getPostDetailSuccess, 
    getPostDetailFailure,
    togglePostLikeSuccess, 
    // 🌟 COMMENT ACTIONLAR
    getCommentsStart,
    getCommentsSuccess,
    getCommentsFailure,
    addCommentSuccess,
    addCommentFailure
} from '../features/posts'; 
import timeAgo from '../utils/timeAgo'; 
import './PostDetail.css'; 
// import { getPostTypeDisplay } from '../utils/colorUtils'; 
import DeleteConfirmationModal from './DeleteConfirmationModal'; 
import CreatePostModal from './CreatePostModal'; 
import PostCommentItem from './PostCommentItem';

// =============================================================
// REDUX VA HELPER FUNKSIYALAR 
// =============================================================
const selectPostDetailState = (state) => state.post; 
const selectAuthState = (state) => state.auth; 

// 🌟 HELPER: POST TURI RANG VA NOMINI OLISH
const getPostTypeDisplay = (typeKey) => {
    switch (typeKey) {
        case 'TEX':
            return { name: 'Texnologiya', class: 'bg-indigo-600/50 text-indigo-300 border-indigo-500' };
        case 'SPO':
            return { name: 'Sport', class: 'bg-green-600/50 text-green-300 border-green-500' };
        case 'BIZ':
            return { name: 'Biznes', class: 'bg-yellow-600/50 text-yellow-300 border-yellow-500' };
        case 'ENT':
            return { name: 'O\'yin-kulgi', class: 'bg-pink-600/50 text-pink-300 border-pink-500' };
        case 'OTH':
            return { name: 'Boshqa', class: 'bg-gray-600/50 text-gray-300 border-gray-500' };
        default:
            return { name: 'Noma\'lum', class: 'bg-gray-800/50 text-gray-500 border-gray-600' };
    }
};

// =============================================================
// Asosiy Komponent
// =============================================================
const PostDetail = () => {
    const { username, slug } = useParams(); 
    const navigate = useNavigate(); 
    const dispatch = useDispatch();
    const { isLoggedIn, user: currentUser } = useSelector(selectAuthState); 
    
    // REDUX STATE'DAN MA'LUMOTLARNI OLISH
    const { 
        postDetail: postData, 
        detail_isLoading: isLoading, 
        detail_error: error,
        // 🌟 COMMENT STATE'LARI
        comments,
        comments_isLoading,
        comments_error
    } = useSelector(selectPostDetailState); 
    
    // ** Lokal Statelar **
    const [commentText, setCommentText] = useState('');
    const [isCommentSubmitting, setIsCommentSubmitting] = useState(false); // Comment yuborish loadingi
    const [isLiking, setIsLiking] = useState(false); 
    
    // YANGI STATE'LAR (Edit/Delete uchun)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const isOwner = currentUser?.username === postData?.user?.username;

    
    // =============================================================
    // API: POST DETALLARINI YUKLASH
    // =============================================================
    const getDetail = useCallback(async () => {
        dispatch(getPostDetailStart()); 
        try {
            const response = await PostService.getPostDetail(username, slug); 
            dispatch(getPostDetailSuccess(response)); 
            
        } catch (err) {
            console.error("Post Detail olishda xato:", err);
            dispatch(getPostDetailFailure(err.message)); 
        }
    }, [username, slug, dispatch]); 
    
    // =============================================================
    // 🌟 API: SHARHLARNI YUKLASH
    // =============================================================
    const getComments = useCallback(async (postId) => {
        dispatch(getCommentsStart());
        try {
            const commentsData = await PostService.getPostComments(postId);
            dispatch(getCommentsSuccess(commentsData));
        } catch (err) {
            console.error("Sharhlarni yuklashda xato:", err);
            dispatch(getCommentsFailure(err.message));
        }
    }, [dispatch]);


    useEffect(() => {
        getDetail();
    }, [getDetail]);

    // Post detail yuklangandan so'ng sharhlarni yuklash
    useEffect(() => {
        if (postData?.id) {
            getComments(postData.id);
        }
    }, [postData?.id, getComments]);
    
    
    // =============================================================
    // 🌟 POSTNI TAHRIRLASH FUNKSIYASI
    // =============================================================
    const handleUpdatePost = async (formData) => {
        if (!isOwner || !postData?.id) return;
        
        try {
            // PostService.updatePost(username, slug, formData)
            const updatedPost = await PostService.updatePost(username, postData.slug, formData); 
            setIsEditModalOpen(false);
            dispatch(getPostDetailSuccess(updatedPost)); 
        } catch (error) {
            console.error("Postni tahrirlashda xato:", error);
            throw error; 
        }
    };
    
    // =============================================================
    // 🌟 POSTNI O'CHIRISH FUNKSIYASI
    // =============================================================
    const handleConfirmDelete = async () => {
        if (!isOwner || !postData?.id) return;

        setIsDeleting(true);

        try {
            await PostService.deletePost(username, postData.slug); 
            navigate(`/${currentUser.username}/profile/`); 

        } catch (err) {
            console.error("Postni o'chirishda xato:", err);
            setIsDeleteModalOpen(false); 
        } finally {
            setIsDeleting(false);
        }
    };
    
    // =============================================================
    // API: LIKE/UNLIKE MANTIQI
    // =============================================================
    const handleLikeToggle = async () => { /* ... */ };
    
    // =============================================================
    // 🌟 YANGILANGAN: SHARH YUBORISH FUNKSIYASI
    // =============================================================
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!isLoggedIn) {
             alert("Sharh qoldirish uchun avval tizimga kiring!");
             return;
        }
        if (!commentText.trim() || !postData?.id || isCommentSubmitting) return;

        setIsCommentSubmitting(true);
        const postId = postData.id;

        try {
            // Sharh yaratish
            const newComment = await PostService.createPostComment(postId, { message: commentText }); 
            setCommentText(''); // Textareanini tozalash
            
            // Redux state'ni yangilash
            dispatch(addCommentSuccess(newComment)); 
            
        } catch (error) {
            console.error("Sharh yuborishda xato:", error);
            const errMsg = error.response?.data?.message || "Sharh yuborishda xato yuz berdi.";
            dispatch(addCommentFailure(errMsg));
            alert(errMsg);
        } finally {
            setIsCommentSubmitting(false);
        }
    };
    
    // =============================================================
    // LOADING / ERROR UI
    // =============================================================
    if (isLoading) {
        return <div className='text-center text-white pt-40'>Yuklanmoqda...</div>;
    }
    
    if (error || !postData) {
         return <div className='text-center text-red-500 pt-40'>Maqola topilmadi yoki xato yuz berdi: {error}</div>;
    }

    const { 
        user: author, 
        post_type, 
        title, 
        content, 
        created_at, 
        likes_count, 
        views_count, 
        comments_count, 
        is_liked_by_user 
    } = postData;
    
    const authorName = `${author?.first_name || ''} ${author?.last_name || author?.username || ''}`.trim() || 'Anonim Foydalanuvchi';
    const typeDisplay = getPostTypeDisplay(post_type);
    
    // =============================================================
    // ASOSIY KOMPONENT RENDERINGI
    // =============================================================
    
    return (
        <div className="post-body min-h-screen"> 
            
             <i className="fas fa-shield-halved atmospheric-bg-icon"></i>

            <main className="container mx-auto px-4">
                <div className="main-content-wrapper">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                        
                        <div className="lg:col-span-8 p-6 md:p-8">
                            
                            {/* Sarlavha: Muallif va Kontekst */}
                            <section>
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-4 mb-4">
                                        <a href={`/profile/${author?.username}`}><img src={author?.image || 'https://i.pravatar.cc/150?u=placeholder'} className="w-16 h-16 rounded-full"/></a>
                                        <div>
                                            <p className="text-xl font-bold text-white">{authorName}</p>
                                            <div className="text-sm text-gray-400 mt-1">{timeAgo(created_at)} chop etildi</div>
                                        </div>
                                    </div>

                                    {/* 🌟 TAHRIRLASH VA O'CHIRISH TUGMALARI */}
                                    {isOwner && (
                                        <div className='flex gap-2 ml-4'>
                                            <button 
                                                onClick={() => setIsEditModalOpen(true)}
                                                className="p-3 text-sm rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition duration-150 flex items-center gap-2 font-semibold"
                                                title="Postni tahrirlash"
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button 
                                                onClick={() => setIsDeleteModalOpen(true)}
                                                className="p-3 text-sm rounded-lg bg-red-600 hover:bg-red-700 text-white transition duration-150 flex items-center gap-2 font-semibold"
                                                title="Postni o'chirish"
                                            >
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Post Turi */}
                                <span className={`inline-block text-sm font-semibold py-1 px-3 rounded-full border ${typeDisplay.class}`}>
                                    {typeDisplay.name}
                                </span>                                
                                <h1 className="text-3xl lg:text-4xl font-bold text-white mt-4">
                                    {title}
                                </h1>
                            </section>

                            <hr className="border-gray-700/50 my-6"/>

                            {/* Maqola Matni */}
                            <article 
                                className="prose-custom max-w-none w-full" 
                                dangerouslySetInnerHTML={{ __html: content }}
                            >
                            </article>

                            <hr className="border-gray-700/50 my-8"/>

                            {/* SHARHLAR BO'LIMI */}
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-6">Sharhlar ({comments_count?.toLocaleString() || 0})</h2>
                                
                                {/* Sharh yozish maydoni */}
                                <form onSubmit={handleCommentSubmit} className="flex items-start gap-4 mb-8">
                                    {/* Joriy foydalanuvchi avatari */}
                                    <img src={currentUser?.image || 'https://i.pravatar.cc/150?u=current_user'} className="w-12 h-12 rounded-full flex-shrink-0"/>
                                    <div className="w-full">
                                        <textarea 
                                            className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" 
                                            rows="3" 
                                            placeholder={isLoggedIn ? "O'z fikringizni qoldiring..." : "Sharh qoldirish uchun avval tizimga kiring..."}
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            disabled={!isLoggedIn || isCommentSubmitting}
                                        ></textarea>
                                        <div className="flex justify-end mt-2">
                                            <button 
                                                type="submit"
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                                                disabled={!isLoggedIn || commentText.trim() === '' || isCommentSubmitting}
                                            >
                                                {isCommentSubmitting ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
                                                {isCommentSubmitting ? 'Yuborilmoqda...' : 'Yuborish'}
                                            </button>
                                        </div>
                                    </div>
                                </form>

                                {/* Sharhlar Yuklanish Holati */}
                                {comments_isLoading && <div className='text-center text-gray-500'><i className="fas fa-spinner fa-spin mr-2"></i>Sharhlar yuklanmoqda...</div>}
                                
                                {/* Sharhlar Xato Holati */}
                                {comments_error && <div className='text-center text-red-400 pt-4'>Sharhlarni yuklashda xato yuz berdi: {comments_error}</div>}

                                {/* Sharhlar Ro'yxati */}
                                <div className="space-y-6">
                                    {comments?.map(comment => (
                                        <PostCommentItem 
                                            key={comment.id} 
                                            comment={comment} 
                                            postAuthorUsername={author?.username}
                                        />
                                    ))}
                                    {!comments_isLoading && !comments_error && comments?.length === 0 && (
                                        <p className='text-gray-500 text-center pt-4'>Hali sharhlar mavjud emas. Birinchi bo'lishingiz mumkin!</p>
                                    )}
                                </div>
                            </section>
                        </div>
                        
                        {/* Sidebar */}
                        <aside className="lg:col-span-4 p-6">
                            <div className="sticky top-6 space-y-6">
                                <h3 className="text-lg font-semibold text-white">Maqola Statistikasi</h3>
                                
                                {/* ... (Statistikalar) ... */}
                                <div 
                                    className="bg-gray-800/50 p-4 rounded-lg flex items-center gap-4 cursor-pointer hover:bg-gray-700/50 transition-colors" 
                                    onClick={handleLikeToggle}
                                >
                                    <i className={`fas fa-heart text-2xl ${is_liked_by_user ? 'text-pink-500' : 'text-gray-500'}`}></i>
                                    <div>
                                        <p className="text-xl font-bold text-white">{likes_count?.toLocaleString() || 0}</p>
                                        <p className="text-sm text-gray-400">ta layk</p>
                                    </div>
                                    {isLiking && <i className="fas fa-spinner fa-spin text-gray-400 ml-auto"></i>}
                                </div>
                                
                                <div className="bg-gray-800/50 p-4 rounded-lg flex items-center gap-4">
                                    <i className="fas fa-eye text-2xl text-cyan-400"></i>
                                    <div>
                                        <p className="text-xl font-bold text-white">{views_count?.toLocaleString() || 0}</p>
                                        <p className="text-sm text-gray-400">marta ko'rilgan</p>
                                    </div>
                                </div>
                                <div className="bg-gray-800/50 p-4 rounded-lg flex items-center gap-4">
                                    <i className="fas fa-comments text-2xl text-green-400"></i>
                                    <div>
                                        <p className="text-xl font-bold text-white">{comments_count?.toLocaleString() || 0}</p>
                                        <p className="text-sm text-gray-400">ta sharh</p>
                                    </div>
                                </div>
                                
                                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors"><i className="fas fa-bookmark mr-2"></i> Saqlab qolish</button>
                            </div>
                        </aside>

                    </div>
                </div>
            </main>

            {/* ======================================= */}
            {/* 🌟 POSTNI TAHRIRLASH MODALI */}
            {/* ======================================= */}
            {isOwner && (
                <CreatePostModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSubmit={handleUpdatePost} 
                    initialData={{ 
                        post_type: postData.post_type,
                        title: postData.title,
                        content: postData.content
                    }}
                    isSubmitting={false} 
                />
            )}
            
            {/* ======================================= */}
            {/* 🌟 POSTNI O'CHIRISH MODALI */}
            {/* ======================================= */}
            {isOwner && (
                <DeleteConfirmationModal 
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleConfirmDelete} 
                    itemTitle={postData.title}
                    isProcessing={isDeleting}
                />
            )}
        </div>
    );
};

export default PostDetail;