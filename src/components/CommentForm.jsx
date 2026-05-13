import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import  UserImage  from '../assests/userImage.jpeg'
import { useNavigate } from 'react-router-dom';
import { postCommentFailure, postCommentStart, postCommentSuccess } from '../features/comments/Comment';
import CommentService from '../services/comments';

const CommentForm = () => {
    const { loggedIn, user } = useSelector((state) => state.auth);
    const BASE_URL = window.location.origin;
    const [message, setMessage] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const formSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return; // Bo'sh xabar yubormaslik uchun

        dispatch(postCommentStart());
        try {
            const response = await CommentService.postComment(message);
            // response ichida yangi yaratilgan komment ob'ekti bo'lishi kerak
            dispatch(postCommentSuccess(response));
            
            setMessage(''); // 1. Formani tozalash
            // navigate('/') // 2. Buni olib tashlaymiz, sahifa yangilanmasligi uchun
        } catch (error) {
            dispatch(postCommentFailure());
            console.log(error);
        }
    };

  return (
        <div className="max-w-3xl mx-auto mb-16 bg-[#161b22] border border-[#30363d] rounded-lg p-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            
            <div className="flex items-start space-x-4">
               
                 <img
                    src={
                        user?.image
                            ? user.image.startsWith("http")
                                ? user.image
                                : `${window.location.origin}${user.image}`
                            : UserImage
                    }
                    alt="User Avatar"
                    className="w-12 h-12 rounded-full mt-1 object-cover"
                />
                <div className="w-full">
                     <form onSubmit={formSubmit}>
                        <textarea
                        name='message'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                         className="w-full bg-[#0d1117] border border-[#30363d] rounded-md p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" rows="3" placeholder="O'z fikringizni shu yerga yozing..."></textarea>
                        <div className="flex justify-end mt-3">
                            <button type="submit" className="btn-primary font-semibold py-2 px-5 rounded-lg">Fikr Qoldirish</button>
                        </div>
                    </form>
                </div>
            </div>
                {/* <!-- Agar user tizimga kirmagan bo'lsa (bu blokni ko'rsatasiz) */}
            {/* Reactda buni state orqali boshqarasiz. Misol uchun: */}
            {/* {isLoggedIn ? (
                <div className="flex items-start space-x-4">
                    ... (yuqoridagi code) ...
                </div>
            ) : (
                <div className="text-center text-gray-400">
                    Fikr qoldirish uchun, iltimos, <a href="login.html" className="text-indigo-400 font-semibold hover:underline">tizimga kiring</a> yoki <a href="register.html" className="text-indigo-400 font-semibold hover:underline">ro'yxatdan o'ting</a>.
                </div>
            )} */}
            {/* --> */}
        </div>
  )
}

export default CommentForm