import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    getPostFailure, 
    getPostStart, 
    getPostSuccess,
    createPostStart,
    createPostSuccess,
    createPostFailure
} from '../features/posts';
import PostService from '../services/post';
import { getPostTypeIcon } from '../utils/colorUtils';
import timeAgo from '../utils/timeAgo';

// 🌟 YANGI IMPORT
import CreatePostModal from './CreatePostModal'; 
import { Link } from 'react-router-dom';

const selectPostState = (state) => state.post; 

const ProfilePosts = ({username}) => {
    const dispatch = useDispatch();
    const { isLoggedIn, user } = useSelector((state) => state.auth); 
  
    const { 
        posts, 
        post_isLoading, 
        post_error,
        create_isLoading, 
        create_error 
    } = useSelector(selectPostState);
    

    // 🌟 MODAL STATE'LARI
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Foydalanuvchi o'z profilidami?
    const isCurrentUser = isLoggedIn && user?.username === username;


    const getPost = async () => { 
        dispatch(getPostStart());
        try {
            const response = await PostService.getPosts(username); 
            dispatch(getPostSuccess(response)); 
        } catch (err) {
            console.error("Post olishda xato:", err);
            dispatch(getPostFailure(err.message));
        }
    };

    useEffect(() => {
        getPost()
    }, [username]); 

    // 🌟 YANGI: POST YARATISH FUNKSIYASI
    const handleCreatePost = useCallback(async (postData) => {
        if (!isCurrentUser) return; 

        // 1. Jarayonni boshlash
        dispatch(createPostStart()); 
        
        try {
            // 2. APIga yuborish
            // Backend mantiqiga ko'ra, username'ni yuborish kerak emas.
            // Agar backendda: /posts/post/create/ ishlatilsa.
            const newPost = await PostService.createPost(username, postData); 
            
            // 3. Muvaffaqiyatli bo'lsa, state'ni yangilash
            dispatch(createPostSuccess(newPost)); 
            
            // 4. Modalni yopish 
            setIsModalOpen(false); 
            
            return true; 

        } catch (error) {
            // 5. Xato bo'lsa, state'ni yangilash
            const errorMessage = JSON.parse(error.message)?.detail || error.message || "Post yaratishda kutilmagan xato";
            dispatch(createPostFailure(errorMessage));
            
            // Xatoni yuqoriga tashlash (modalda ko'rsatish uchun)
            throw new Error(errorMessage); 
        }
    }, [username, isCurrentUser, dispatch]); 


    // ... (getPostTypeDisplayName va NoPosts kabi mavjud funksiyalar)
    const getPostTypeDisplayName = (typeKey) => {
        switch (typeKey) {
            case 'TEX':
                return 'Texnologiya';
            case 'SPO':
                return 'Sport';
            case 'BIZ':
                return 'Biznes';
            case 'ENT':
                return 'O\'yin-kulgi';
            case 'OTH':
                return 'Boshqa';
            default:
                return 'Noma\'lum tur';
        }
    };
    
    // =============================================================
    // LOADSING, ERROR, NO_POSTS UI LAR (Kodni qisqartirish uchun qoldirildi)
    // =============================================================
    const NoPosts = ({ message }) => (
        <div className="text-center p-8 bg-gray-800/50 rounded-lg border border-dashed border-gray-700">
            <i className="fa-solid fa-comments text-5xl text-gray-500 mb-4"></i>
            <h4 className="text-xl font-semibold text-white mb-2">Hech qanday post/javob mavjud emas</h4>
            <p className="text-gray-400">{message}</p>
        </div>
    );
    
    if (post_isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="project-card bg-gray-800 p-5 rounded-lg animate-pulse border-l-4 border-gray-700">
                        <div className="h-4 bg-gray-700 rounded w-1/4 mb-3"></div>
                        <div className="h-6 bg-gray-700 rounded w-full mb-3"></div>
                        <div className="h-4 bg-gray-700 rounded w-2/3 mb-4"></div>
                        <div className="flex space-x-4 pt-3 border-t border-gray-700">
                            <div className="h-4 bg-gray-700 rounded w-1/6"></div>
                            <div className="h-4 bg-gray-700 rounded w-1/6"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
    
    if (post_error) {
        return (
            <NoPosts 
                message={`Postlarni yuklashda xato yuz berdi: ${post_error}`}
            />
        );
    }
    
    if (!posts || posts.length === 0) {
        return (
            <NoPosts 
                message="Foydalanuvchi hali biron bir maqola chop etmagan yoki savollarga javob bermagan."
            />
        );
    }


    // =============================================================
    // MA'LUMOTLAR MAVJUD BO'LGAN HOLAT
    // =============================================================
    return (
        <>
            <div className="flex justify-end mb-4">
                {isCurrentUser && (
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <i className="fas fa-plus-circle"></i> Yangi Post
                    </button>
                )}
            </div>
            
            {/* 🌟 YANGI POST YARATISH XATOSI */}
            {create_error && isModalOpen === false && (
                <div className="p-3 bg-red-900/50 text-red-400 rounded-lg mb-4 border border-red-700">
                    <p className='font-semibold'>Post yaratishda xato: {create_error}</p>
                </div>
            )}
            
            <div id="posts" className="space-y-4">
                {posts.map((post) => (
                    // ⭐ Noto'g'ri yopilgan <a> o'rniga Link to'g'ri o'rab olindi
                    <Link
                        to={`/${username}/post/${post.slug}/`}
                        key={post.id} 
                        className="block project-card bg-gray-800 p-5 rounded-lg border-l-4 border-indigo-500 hover:border-indigo-400 transition-shadow duration-300 shadow-md hover:shadow-lg"
                    >
                        <div className="flex items-center text-gray-400 mb-3 text-sm">
                            <i className={`${getPostTypeIcon(post.post_type)} text-indigo-400 mr-2`}></i>
                            <span className="font-semibold">{getPostTypeDisplayName(post.post_type)}</span>
                            <span className="mx-2">&middot;</span>
                            <span>{timeAgo(post.created_at)}</span>
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2 hover:text-indigo-400 transition-colors">{post.title}</h4>
                        {/* post.content qismi to'g'ridan-to'g'ri Link ichida yashirin holatda edi, endi 
                           <p> tegi ichida ko'rsatildi, shunda to'g'ri ma'noda tushuniladi */}
                        {post.content && (
                            <p className="text-gray-400 text-sm italic border-l-2 border-gray-700 pl-3 line-clamp-2">
                                {/* Faqat bir necha qatorni ko'rsatish uchun line-clamp-2 qo'shildi */}
                                {post.content} 
                            </p>
                        )}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400 mt-4 pt-3 border-t border-gray-700">
                            <span className="flex items-center gap-1.5 text-pink-400" title="Layklar">
                                <i className="fa-solid fa-heart"></i> {post.likes_count}
                            </span>
                            <span className="flex items-center gap-1.5" title="Ko'rishlar">
                                <i className="fa-solid fa-eye"></i> {post.views_count}
                            </span>
                            <span className="flex items-center gap-1.5" title="Sharhlar">
                                <i className="fa-solid fa-comments"></i> {post.comments_count}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
            
            {/* 🌟 YANGI MODAL KOMPONENTI */}
            <CreatePostModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreatePost} 
                isSubmitting={create_isLoading} 
            />
        </>
    );
};

export default ProfilePosts;