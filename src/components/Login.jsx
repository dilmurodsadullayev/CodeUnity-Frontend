import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom'; // Link to'g'ri import qilindi
import './Login.css'; // YANGI CSS fayli import qilindi
import { signUserFailer, signUserStart, signUserSuccess } from '../features/auth/Auth';
import AuthService from '../services/auth';

const selectAuthState = (state) => state.auth;

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Parolni ko'rsatish/yashirish holati

    const dispatch = useDispatch()
    const {isLoading, isLoggedIn, error} = useSelector(selectAuthState) 
    const navigate = useNavigate()
    
    const passwordInputType = isPasswordVisible ? 'text' : 'password';

    const loginHandler  = async e => {
        e.preventDefault()
        dispatch(signUserStart())

        try {
            const response = await AuthService.userLogin({username,password})
        
            dispatch(signUserSuccess(response.user)) 
            navigate('/')
        } catch (err) {
            console.error("Login error:", err.response); 
            
            const errorMessage = err.response?.data?.msg || err.response?.data?.detail || "Kiritilgan ma'lumotlar noto'g'ri. Iltimos, qayta urinib ko'ring.";
            
            if (err.response?.status === 401) {
                 dispatch(signUserFailer("Foydalanuvchi nomi yoki parol noto'g'ri."));
            } else {
                 dispatch(signUserFailer(errorMessage)); 
            }
        }
    }

    useEffect(() => {
        if (isLoggedIn){
            navigate('/')
        }
        }, [isLoggedIn, navigate])
    

    return (
        // Konteyner CSS dan olinadi
        <div className="login-page-container"> 
            <div className="animate-fade-in w-full max-w-md p-8 space-y-6 bg-[#161b22] rounded-xl shadow-2xl border border-[#30363d]">
                <div className="text-center">
                    <Link to="/" className="inline-flex items-center space-x-2">
                        <i className="fa-solid fa-code-fork text-indigo-400 text-3xl"></i>
                        <span className="text-2xl font-bold text-white">Code<span className="text-indigo-400">Unity</span></span>
                    </Link>
                    <h1 className="text-3xl font-bold hero-gradient-text mt-4">
                        Hisobga Kirish
                    </h1>
                    <p className="text-gray-400 mt-2">Jamiyatga qaytganingiz bilan!</p>
                </div>

                {/* Xato Xabari (DEBUG) */}
                {error && typeof error === 'string' && (
                    <div className="bg-red-900/50 text-red-300 p-3 rounded-lg border border-red-700 text-sm">
                        {error}
                    </div>
                )}


                {/* Social Login */}
                <div className="grid grid-cols-2 gap-4">
                    <button className="social-btn w-full flex items-center justify-center py-2.5 rounded-lg">
                        <i className="fab fa-github mr-2"></i> GitHub
                    </button>
                    <button className="social-btn w-full flex items-center justify-center py-2.5 rounded-lg">
                        <i className="fab fa-google mr-2"></i> Google
                    </button>
                </div>

                <div className="flex items-center justify-center space-x-2">
                    <span className="h-px w-16 bg-gray-600"></span>
                    <span className="text-gray-500 font-normal">yoki</span>
                    <span className="h-px w-16 bg-gray-600"></span>
                </div>

                {/* Login Form */}
                <form className="space-y-4" onSubmit={loginHandler}>
                    <div>
                        <label htmlFor="username" className="text-sm font-medium text-gray-300">Username</label>
                        <div className="relative mt-1">
                            <i className="fas fa-user text-gray-500 absolute top-1/2 left-3 -translate-y-1/2"></i>
                            <input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                type="text"
                                id="username"
                                name="username"
                                required 
                                className="input-dark w-full pl-10 pr-3 py-2.5 rounded-lg" 
                                placeholder="username_123" 
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-center">
                            <label htmlFor="password" className="text-sm font-medium text-gray-300">Parol</label>
                            <Link to="#" className="text-sm text-indigo-400 hover:underline">Parolni unutdingizmi?</Link> {/* a o'rniga Link ishlatildi */}
                        </div>
                        <div className="relative mt-1">
                            <i className="fas fa-lock text-gray-500 absolute top-1/2 left-3 -translate-y-1/2"></i>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                id="password"
                                name="password" 
                                type={passwordInputType} 
                                required 
                                className="input-dark w-full pl-10 pr-10 py-2.5 rounded-lg" 
                                placeholder="••••••••" />
                            
                            {/* Parolni ko'rsatish/yashirish tugmasi */}
                            <button
                                type="button"
                                onClick={() => setIsPasswordVisible(prev => !prev)}
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-indigo-400 transition-colors"
                                title={isPasswordVisible ? "Parolni yashirish" : "Parolni ko'rsatish"}
                            >
                                <i className={`fa-solid ${isPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        disabled={isLoading} 
                        className="w-full btn-primary font-semibold py-3 rounded-lg text-white"
                    >
                        {isLoading ? <i className="fa-solid fa-spinner fa-spin mr-2"></i> : null}
                        {isLoading ? "Kirilmoqda..." : "Kirish"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-400">
                    Hisobingiz yo'qmi?
                    <Link to="/register" className="font-medium text-indigo-400 hover:underline ml-1">
                        Ro'yxatdan o'ting
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;