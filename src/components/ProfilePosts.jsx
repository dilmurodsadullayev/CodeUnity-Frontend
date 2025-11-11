// ProfilePosts.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPostFailure, getPostStart, getPostSuccess } from '../features/posts';
import PostService from '../services/post';
import { getPostTypeIcon } from '../utils/colorUtils';
import timeAgo from '../utils/timeAgo';

// Agar sizning slice'ingiz nomi 'post' bo'lsa
const selectPostState = (state) => state.post; 

const ProfilePosts = ({username}) => {
    const dispatch = useDispatch()
  
    const { posts, post_isLoading, post_error } = useSelector(selectPostState);



    const getPost= async () => { 
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
        getPost() // Loyihalar uchun API chaqiruvi - zaruratga qarab yoqish mumkin
    }, []); 

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
    // POSTLAR MAVJUD BO'LMAGAN HOLAT UCHUN KOMPONENT
    // =============================================================
    const NoPosts = ({ message }) => (
        <div className="text-center p-8 bg-gray-800/50 rounded-lg border border-dashed border-gray-700">
            <i className="fa-solid fa-comments text-5xl text-gray-500 mb-4"></i>
            <h4 className="text-xl font-semibold text-white mb-2">Hech qanday post/javob mavjud emas</h4>
            <p className="text-gray-400">{message}</p>
        </div>
    );


    // =============================================================
    // YUKLANISH (LOADING) HOLATI
    // =============================================================
    if (post_isLoading) {
        // Sklet (Skeleton) UI
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

    // =============================================================
    // XATO HOLATI
    // =============================================================
    if (post_error) {
        return (
            <NoPosts 
                message={`Postlarni yuklashda xato yuz berdi: ${post_error}`}
            />
        );
    }
    
    // =============================================================
    // BO'SH HOLATI
    // =============================================================
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
       <div id="posts" className="space-y-4">
            {posts.map((post) => (
                <a 
                    key={post.id} 
                    href={post.detailLink} 
                    className="block project-card bg-gray-800 p-5 rounded-lg border-l-4 border-indigo-500 hover:border-indigo-400 transition-shadow duration-300 shadow-md hover:shadow-lg"
                >
                    <div className="flex items-center text-gray-400 mb-3 text-sm">
                        {/* ICON DYNAMIC QILINDI: post.type ga qarab o'zgaradi */}
                        <i className={`${getPostTypeIcon(post.post_type)} text-indigo-400 mr-2`}></i>
                        
                        {/* post.type endi qisqa kod o'rniga to'liq nomni chiqarishi kerak (Agar u Django'dan kelayotgan bo'lsa) */}
                        {/* post.type nomini ko'rsatish uchun post.typeDisplay yoki shunga o'xshash field kerak bo'lishi mumkin. */}
                        <span className="font-semibold">{getPostTypeDisplayName(post.post_type)}</span>
                        
                        <span className="mx-2">&middot;</span>
                        <span>{timeAgo(post.created_at)}</span>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2 hover:text-indigo-400 transition-colors">{post.title}</h4>
                    {post.content && (
                        <p className="text-gray-400 text-sm italic border-l-2 border-gray-700 pl-3">
                            {post.content}
                        </p>
                    )}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400 mt-4 pt-3 border-t border-gray-700">
                        {/* Layklar */}
                        <span className="flex items-center gap-1.5 text-pink-400" title="Layklar">
                            <i className="fa-solid fa-heart"></i> {post.likes_count}
                        </span>
                        {/* Ko'rishlar */}
                        <span className="flex items-center gap-1.5" title="Ko'rishlar">
                            <i className="fa-solid fa-eye"></i> {post.views_count}
                        </span>
                        {/* Sharhlar */}
                        <span className="flex items-center gap-1.5" title="Sharhlar">
                            <i className="fa-solid fa-comments"></i> {post.comments_count}
                        </span>
                    </div>
                </a>
            ))}
        </div>
    );
};

export default ProfilePosts;