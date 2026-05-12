import React, { useEffect, useState } from 'react';
import CommentForm from './CommentForm';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getCommentStart, getCommentSuccess } from '../features/comments/Comment';
import CommentService from '../services/comments';
import UserImage from '../assests/userImage.jpeg';

const CommentSection = () => {
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const { comments, isLoading } = useSelector((state) => state.comment);
    const dispatch = useDispatch();
    const BASE_URL = window.location.origin;

    const getComments = async () => {
        dispatch(getCommentStart());
        try {
            const response = await CommentService.getComments();
            dispatch(getCommentSuccess(response));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getComments();
    }, []);

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

    return (
        <section id="feedback" className="py-20 px-4">
            <div className="container mx-auto">
                <h2 className="text-4xl font-bold text-center mb-4 text-white animate-fade-in-up">
                    Hamjamiyatimiz <span className="hero-gradient-text">Biz Haqimizda</span>
                </h2>
                <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    Platformamiz foydalanuvchilarining fikrlari biz uchun eng muhim rag'bat. O'z tajribangiz bilan bo'lishing!
                </p>
                {isLoggedIn ? (
                    <CommentForm />
                ) : (
                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            Fikr qoldirish uchun <Link to="/login" className="text-blue-600 hover:underline">kiring</Link> yoki{" "}
                            <Link to="/register" className="text-green-600 hover:underline">ro‘yxatdan o‘ting</Link>.
                        </p>
                    </div>
                )}

                {/* <!-- Comments List --> */}
                <div className="max-w-3xl mx-auto space-y-6">
                    {comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            timeAgo={timeAgo}
                            BASE_URL={BASE_URL}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

// Sharhni ko'rsatish uchun alohida komponent
const CommentItem = ({ comment, timeAgo, BASE_URL }) => {
    const [showSpoiler, setShowSpoiler] = useState(comment.status !== "visible");

    return (
        <div className="problem-card p-5 rounded-lg flex space-x-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            {comment?.user?.image ? (
                <img
                    src={`${BASE_URL}${comment.user.image}`}
                    alt="User Avatar"
                    className="w-12 h-12 rounded-full mt-1 object-cover"
                />
            ) : (
                <img
                    src={UserImage}
                    alt="User Avatar"
                    className="w-12 h-12 rounded-full mt-1 object-cover"
                />

            )}
            <div className="w-full">
                <div className="flex items-center space-x-3">
                    <h4 className="font-bold text-white text-lg">{comment?.user?.username}</h4>
                    <span className="text-xs text-gray-500">{timeAgo(comment?.created_at)}</span>
                </div>
                {showSpoiler ? (
                    <div className="mt-2 p-4 bg-red-900/20 border border-red-500/30 rounded-md text-red-300/80 italic">
                        <p>Bu sharh nomaqbul deb topilgan. Ko'rish uchun bosing.</p>
                        <button onClick={() => setShowSpoiler(false)} className="mt-2 text-sm font-semibold text-white hover:underline">Sharhni ko'rsatish</button>
                    </div>
                ) : (
                    <p className="text-gray-300 mt-1">{comment?.message}</p>
                )}
            </div>
        </div>
    );
};

export default CommentSection;