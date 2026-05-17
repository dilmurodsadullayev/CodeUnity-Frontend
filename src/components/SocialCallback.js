// src/components/SocialCallback.js

import React, { useEffect, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import {
    signUserStart,
    signUserSuccess,
    signUserFailer,
} from "../features/auth/Auth";

import AuthService from "../services/auth";
import { connectWebSocket } from "../middleware/notificationMiddleware";

const SocialCallback = () => {
    const { provider } = useParams();
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const hasRunRef = useRef(false);

    const handleSocialAuth = useCallback(
        async (code) => {
            if (hasRunRef.current) {
                console.warn("Social login allaqachon yuborilgan. Ikkinchi request to'xtatildi.");
                return;
            }

            hasRunRef.current = true;

          

            if (!provider || !["google", "github"].includes(provider)) {
                const msg = `Provider noto'g'ri yoki topilmadi: ${provider}`;
                dispatch(signUserFailer(msg));
                navigate("/login");
                return;
            }

            dispatch(signUserStart());

            try {
                const data = await AuthService.socialLogin(provider, code);

                console.log("SOCIAL CALLBACK DATA:", data);

                if (data && data.user) {
                    dispatch(signUserSuccess(data.user));

                    setTimeout(() => {
                        dispatch(connectWebSocket());
                    }, 300);

                    navigate("/");
                    return;
                }

                throw new Error("Foydalanuvchi ma'lumotlari kelmadi.");
            } catch (err) {
                console.error(`${provider} auth error:`, err);
                console.error("response status:", err.response?.status);
                console.error("response data:", err.response?.data);

                const errorMessage =
                    err.response?.data?.detail ||
                    err.response?.data?.non_field_errors?.[0] ||
                    err.message ||
                    "Ijtimoiy tarmoq orqali kirishda xatolik yuz berdi.";

                dispatch(signUserFailer(errorMessage));
                navigate("/login");
            }
        },
        [dispatch, navigate, provider, location.search]
    );

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const code = params.get("code");
        const error = params.get("error");

        if (error) {
            dispatch(signUserFailer(error));
            navigate("/login");
            return;
        }

        if (code) {
            handleSocialAuth(code);
        } else {
            dispatch(signUserFailer("OAuth code topilmadi."));
            navigate("/login");
        }
    }, [location.search, navigate, handleSocialAuth, dispatch]);

    return (
        <div className="min-h-screen bg-[#0d1117] flex items-center justify-center text-white">
            <div className="text-center space-y-6 animate-fade-in">
                <div className="relative w-20 h-20 mx-auto">
                    <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin"></div>

                    <div className="absolute inset-0 flex items-center justify-center">
                        <i className={`fab fa-${provider || "google"} text-2xl text-indigo-400`}></i>
                    </div>
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-bold hero-gradient-text">
                        Avtorizatsiya ketmoqda...
                    </h2>
                    <p className="text-gray-400">
                        {provider === "github" ? "GitHub" : "Google"} orqali hisobingiz tasdiqlanmoqda.
                    </p>
                </div>

                <p className="text-xs text-gray-500 animate-pulse">
                    CodeUnity xavfsiz ulanishni ta'minlamoqda
                </p>
            </div>
        </div>
    );
};

export default SocialCallback;