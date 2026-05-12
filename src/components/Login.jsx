import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import { signUserFailer, signUserStart, signUserSuccess } from '../features/auth/Auth';
import AuthService from '../services/auth';
import { GOOGLE_AUTH_URL, GITHUB_AUTH_URL } from '../services/config';

// Logotipni import qilish
import FSocietyLogo from '../assests/logo/f_society.png';

const selectAuthState = (state) => state.auth;

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const dispatch = useDispatch()
    const {isLoading, isLoggedIn, error} = useSelector(selectAuthState) 
    const navigate = useNavigate()
    
    const passwordInputType = isPasswordVisible ? 'text' : 'password';

    // Standart Login Handler
    const loginHandler  = async e => {
        e.preventDefault()
        dispatch(signUserStart())

        try {
            const response = await AuthService.userLogin({username, password})
            dispatch(signUserSuccess(response.user)) 
            navigate('/')
        } catch (err) {
            console.error("Login error:", err.response); 
            const errorMessage = err.response?.data?.msg || err.response?.data?.detail || "Kiritilgan ma'lumotlar noto'g'ri.";
            
            if (err.response?.status === 401) {
                 dispatch(signUserFailer("Foydalanuvchi nomi yoki parol noto'g'ri."));
            } else {
                 dispatch(signUserFailer(errorMessage)); 
            }
        }
    }

    // Ijtimoiy login funksiyasi
    const handleSocialLogin = (url) => {
        window.location.href = url;
    };

    useEffect(() => {
        if (isLoggedIn){
            navigate('/')
        }
    }, [isLoggedIn, navigate])
    

    return (
        <div className="login-page-container flex items-center justify-center min-h-screen bg-[#0d1117] px-4"> 
            <div className="animate-fade-in w-full max-w-md p-8 space-y-6 bg-[#161b22] rounded-2xl shadow-2xl border border-[#30363d]">
                
                {/* --- LOGO VA SARLAVHA --- */}
                <div className="text-center">
                    <Link to="/" className="inline-flex flex-col items-center group">
                        <img 
                            src={FSocietyLogo} 
                            alt="F.Society Logo" 
                            className="h-24 w-auto object-contain transition-transform duration-500 group-hover:rotate-[360deg]" 
                        />
                        <span className="text-3xl font-black text-white mt-2 tracking-tighter">
                            F<span className="text-indigo-500">Society</span>
                        </span>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-200 mt-6 uppercase tracking-widest">
                        Xush kelibsiz
                    </h1>
                    <p className="text-gray-500 mt-1 text-sm">Jamiyatga qaytganingiz bilan!</p>
                </div>

                {/* Xato Xabari */}
                {error && typeof error === 'string' && (
                    <div className="bg-red-900/30 text-red-400 p-3 rounded-xl border border-red-800/50 text-sm text-center">
                        <i className="fas fa-exclamation-circle mr-2"></i> {error}
                    </div>
                )}

                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        type="button"
                        onClick={() => handleSocialLogin(GITHUB_AUTH_URL)}
                        className="flex items-center justify-center py-3 bg-[#0d1117] text-white border border-[#30363d] rounded-xl hover:bg-[#30363d] transition-all font-bold text-sm shadow-lg"
                    >
                        <i className="fab fa-github mr-2 text-lg"></i> GitHub
                    </button>
                    <button 
                        type="button"
                        onClick={() => handleSocialLogin(GOOGLE_AUTH_URL)}
                        className="flex items-center justify-center py-3 bg-[#0d1117] text-white border border-[#30363d] rounded-xl hover:bg-[#30363d] transition-all font-bold text-sm shadow-lg"
                    >
                        <i className="fab fa-google mr-2 text-lg text-red-500"></i> Google
                    </button>
                </div>

                <div className="flex items-center justify-center space-x-3">
                    <span className="h-px w-full bg-gray-800"></span>
                    <span className="text-gray-600 text-xs font-black uppercase tracking-tighter">yoki</span>
                    <span className="h-px w-full bg-gray-800"></span>
                </div>

                {/* Login Form */}
                <form className="space-y-5" onSubmit={loginHandler}>
                    <div>
                        <label htmlFor="username" className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Username</label>
                        <div className="relative mt-1.5">
                            <i className="fas fa-user text-gray-600 absolute top-1/2 left-4 -translate-y-1/2"></i>
                            <input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                type="text"
                                id="username"
                                required 
                                className="w-full bg-[#0d1117] border border-[#30363d] text-white pl-12 pr-4 py-3.5 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" 
                                placeholder="foydalanuvchi_nomi" 
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center">
                            <label htmlFor="password" className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Parol</label>
                            <Link to="#" className="text-xs text-indigo-400 hover:text-indigo-300 font-bold">Unutdingizmi?</Link>
                        </div>
                        <div className="relative mt-1.5">
                            <i className="fas fa-lock text-gray-600 absolute top-1/2 left-4 -translate-y-1/2"></i>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                id="password"
                                type={passwordInputType} 
                                required 
                                className="w-full bg-[#0d1117] border border-[#30363d] text-white pl-12 pr-12 py-3.5 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" 
                                placeholder="••••••••" />
                            
                            <button
                                type="button"
                                onClick={() => setIsPasswordVisible(prev => !prev)}
                                className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-600 hover:text-indigo-400 transition-colors"
                            >
                                <i className={`fa-solid ${isPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading} 
                        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-black py-4 rounded-xl transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98] uppercase tracking-widest text-sm"
                    >
                        {isLoading ? (
                            <><i className="fa-solid fa-spinner fa-spin mr-2"></i> Kirilmoqda...</>
                        ) : (
                            "Tizimga Kirish"
                        )}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 pt-2">
                    Hisobingiz yo'qmi?
                    <Link to="/register" className="font-black text-indigo-400 hover:text-indigo-300 ml-2 transition-colors">
                        Ro'yxatdan o'ting
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;