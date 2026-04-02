// src/components/SocialCallback.js (yoki src/pages/SocialCallback.js)

import React, { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { signUserStart, signUserSuccess, signUserFailer } from '../features/auth/Auth';
import AuthService from '../services/auth';
import { connectWebSocket } from '../middleware/notificationMiddleware';

const SocialCallback = () => {
    const { provider } = useParams(); // URL'dan 'google' yoki 'github'ni oladi
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    /**
     * Social Auth jarayonini boshqaruvchi funksiya.
     * useCallback ishlatish ESLint dependency xatolarini oldini oladi.
     */
    const handleSocialAuth = useCallback(async (code) => {
        dispatch(signUserStart());
        try {
            // Backend'ga (Django) kodni yuboramiz
            const data = await AuthService.socialLogin(provider, code);
            
            // Muvaffaqiyatli bo'lsa Redux holatini yangilaymiz
            if (data && data.user) {
                dispatch(signUserSuccess(data.user));
                // Bildirishnomalar uchun WebSocket'ga ulanish
                dispatch(connectWebSocket());
                // Bosh sahifaga yo'naltirish
                navigate('/');
            } else {
                throw new Error("Foydalanuvchi ma'lumotlari kelmadi.");
            }
        } catch (err) {
            console.error(`${provider} auth error:`, err);
            const errorMessage = err.response?.data?.detail || "Ijtimoiy tarmoq orqali kirishda xatolik yuz berdi.";
            dispatch(signUserFailer(errorMessage));
            // Xatolik bo'lsa login sahifasiga qaytarish
            navigate('/login');
        }
    }, [dispatch, navigate, provider]);

    /**
     * Sahifa yuklanganda URL'dan 'code'ni sug'urib olish
     */
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');

        if (code) {
            handleSocialAuth(code);
        } else {
            navigate('/login');
        }
    }, [location.search, navigate, handleSocialAuth]);

    return (
        <div className="min-h-screen bg-[#0d1117] flex items-center justify-center text-white">
            <div className="text-center space-y-6 animate-fade-in">
                {/* Yuklanish spinneri - Loyihangiz dizayniga mos */}
                <div className="relative w-20 h-20 mx-auto">
                    {/* Tashqi aylanuvchi xalqa */}
                    <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin"></div>
                    
                    {/* Markaziy ikonka */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <i className={`fab fa-${provider} text-2xl text-indigo-400`}></i>
                    </div>
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-bold hero-gradient-text">
                        Avtorizatsiya ketmoqda...
                    </h2>
                    <p className="text-gray-400">
                        {provider === 'google' ? 'Google' : 'GitHub'} orqali hisobingiz tasdiqlanmoqda.
                    </p>
                </div>

                {/* Pastki qismdagi kichik matn */}
                <p className="text-xs text-gray-500 animate-pulse">
                    CodeUnity xavfsiz ulanishni ta'minlamoqda
                </p>
            </div>
        </div>
    );
};

export default SocialCallback;