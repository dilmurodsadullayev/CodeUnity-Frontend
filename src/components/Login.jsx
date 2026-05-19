import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import "./Login.css";

import {
    signUserStart,
    signUserSuccess,
    signUserFailure,
    clearAuthError,
} from "../features/auth/Auth";

import AuthService from "../services/auth";
import { GOOGLE_AUTH_URL, GITHUB_AUTH_URL } from "../services/config";

import FSocietyLogo from "../assests/logo/f_society.png";

const selectAuthState = (state) => state.auth;

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isLoading, isLoggedIn, error } = useSelector(selectAuthState);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const passwordInputType = isPasswordVisible ? "text" : "password";

    useEffect(() => {
        dispatch(clearAuthError());

        return () => {
            dispatch(clearAuthError());
        };
    }, [dispatch]);

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/", { replace: true });
        }
    }, [isLoggedIn, navigate]);

    const getLoginErrorMessage = (err) => {
        return (
            err?.message ||
            err?.response?.data?.msg ||
            err?.response?.data?.detail ||
            "Foydalanuvchi nomi yoki parol noto‘g‘ri."
        );
    };

    const loginHandler = async (e) => {
        e.preventDefault();

        const cleanUsername = username.trim();

        if (!cleanUsername || !password) {
            dispatch(signUserFailure("Username va parolni kiriting."));
            return;
        }

        dispatch(signUserStart());

        try {
            const response = await AuthService.userLogin({
                username: cleanUsername,
                password,
            });

            const loggedUser = response?.user || response;

            if (!loggedUser || !loggedUser.id) {
                throw new Error("Login bo‘ldi, lekin user ma’lumoti kelmadi.");
            }

            dispatch(signUserSuccess(loggedUser));
            navigate("/", { replace: true });
        } catch (err) {
            console.error("Login error:", err);

            dispatch(signUserFailure(getLoginErrorMessage(err)));
        }
    };

    const handleSocialLogin = (url) => {
        if (!url) {
            dispatch(signUserFailure("Social login URL topilmadi."));
            return;
        }

        window.location.assign(url);
    };

    const isSubmitDisabled = isLoading || !username.trim() || !password;

    return (
        <div className="login-page-container relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0d1117] px-4">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/10 blur-[110px]" />
            <div className="pointer-events-none absolute -right-32 top-20 h-72 w-72 rounded-full bg-pink-500/10 blur-[100px]" />
            <div className="pointer-events-none absolute -left-32 bottom-20 h-72 w-72 rounded-full bg-purple-500/10 blur-[100px]" />

            <div className="animate-fade-in relative z-10 w-full max-w-md space-y-6 rounded-3xl border border-[#30363d] bg-[#161b22]/95 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">
                <div className="text-center">
                    <Link to="/" className="group inline-flex flex-col items-center">
                        <img
                            src={FSocietyLogo}
                            alt="F.Society Logo"
                            className="h-24 w-auto object-contain transition-transform duration-500 group-hover:rotate-[360deg]"
                        />

                        <span className="mt-2 text-3xl font-black tracking-tighter text-white">
                            F<span className="text-indigo-500">Society</span>
                        </span>
                    </Link>

                    <h1 className="mt-6 text-2xl font-black uppercase tracking-widest text-gray-100">
                        Xush kelibsiz
                    </h1>

                    <p className="mt-1 text-sm font-semibold text-gray-500">
                        Jamiyatga qaytganingiz bilan!
                    </p>
                </div>

                {error && typeof error === "string" && (
                    <div className="rounded-2xl border border-red-800/50 bg-red-900/30 p-3 text-center text-sm font-semibold text-red-300">
                        <i className="fas fa-exclamation-circle mr-2"></i>
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => handleSocialLogin(GITHUB_AUTH_URL)}
                        disabled={isLoading}
                        className="flex items-center justify-center rounded-xl border border-[#30363d] bg-[#0d1117] py-3 text-sm font-black text-white shadow-lg transition-all hover:border-indigo-500/50 hover:bg-[#30363d] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <i className="fab fa-github mr-2 text-lg"></i>
                        GitHub
                    </button>

                    <button
                        type="button"
                        onClick={() => handleSocialLogin(GOOGLE_AUTH_URL)}
                        disabled={isLoading}
                        className="flex items-center justify-center rounded-xl border border-[#30363d] bg-[#0d1117] py-3 text-sm font-black text-white shadow-lg transition-all hover:border-indigo-500/50 hover:bg-[#30363d] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <i className="fab fa-google mr-2 text-lg text-red-500"></i>
                        Google
                    </button>
                </div>

                <div className="flex items-center justify-center space-x-3">
                    <span className="h-px w-full bg-gray-800"></span>
                    <span className="text-xs font-black uppercase tracking-tighter text-gray-600">
                        yoki
                    </span>
                    <span className="h-px w-full bg-gray-800"></span>
                </div>

                <form className="space-y-5" onSubmit={loginHandler}>
                    <div>
                        <label
                            htmlFor="username"
                            className="ml-1 text-xs font-black uppercase tracking-widest text-gray-500"
                        >
                            Username
                        </label>

                        <div className="relative mt-1.5">
                            <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"></i>

                            <input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                type="text"
                                id="username"
                                autoComplete="username"
                                required
                                disabled={isLoading}
                                className="w-full rounded-xl border border-[#30363d] bg-[#0d1117] py-3.5 pl-12 pr-4 text-white outline-none transition-all placeholder:text-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                                placeholder="foydalanuvchi_nomi"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="password"
                                className="ml-1 text-xs font-black uppercase tracking-widest text-gray-500"
                            >
                                Parol
                            </label>

                            <Link
                                to="#"
                                className="text-xs font-bold text-indigo-400 hover:text-indigo-300"
                            >
                                Unutdingizmi?
                            </Link>
                        </div>

                        <div className="relative mt-1.5">
                            <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"></i>

                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                id="password"
                                type={passwordInputType}
                                autoComplete="current-password"
                                required
                                disabled={isLoading}
                                className="w-full rounded-xl border border-[#30363d] bg-[#0d1117] py-3.5 pl-12 pr-12 text-white outline-none transition-all placeholder:text-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                                placeholder="••••••••"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setIsPasswordVisible((prev) => !prev)
                                }
                                disabled={isLoading}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 transition-colors hover:text-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <i
                                    className={`fa-solid ${
                                        isPasswordVisible
                                            ? "fa-eye-slash"
                                            : "fa-eye"
                                    }`}
                                ></i>
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitDisabled}
                        className="w-full rounded-xl bg-indigo-600 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-indigo-600/20 transition-all hover:bg-indigo-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-indigo-900 disabled:text-indigo-200/60"
                    >
                        {isLoading ? (
                            <>
                                <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                                Kirilmoqda...
                            </>
                        ) : (
                            "Tizimga Kirish"
                        )}
                    </button>
                </form>

                <p className="pt-2 text-center text-sm text-gray-500">
                    Hisobingiz yo‘qmi?
                    <Link
                        to="/register"
                        className="ml-2 font-black text-indigo-400 transition-colors hover:text-indigo-300"
                    >
                        Ro‘yxatdan o‘ting
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;