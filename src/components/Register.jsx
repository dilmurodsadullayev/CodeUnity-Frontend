import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom'; 
import './Register.css'; 
import { signUserStart, signUserFailer, signUserSuccess } from '../features/auth/Auth';
import AuthService from '../services/auth';
import { GOOGLE_AUTH_URL, GITHUB_AUTH_URL } from '../services/config';

// Logotipni import qilish
import FSocietyLogo from '../assests/logo/f_society.png';

// Redux holatlarini tanlash uchun funksiya
const selectAuthState = (state) => state.auth;

// =================================================================
// 1. FIELD KOMPONENTI (MUSTAQIL, DIZAYN TO'G'IRLANGAN)
// =================================================================
const FieldWithIcon = ({ id, label, iconClass, type, placeholder, value, onChange, error }) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const inputType = type === 'password' && isPasswordVisible ? 'text' : type;
    const isPasswordField = type === 'password';

    return (
        <div>
            <label htmlFor={id} className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">
                {label}
            </label>
            <div className="relative mt-1.5">
                <i className={`${iconClass} text-gray-600 absolute top-1/2 left-4 -translate-y-1/2`}></i>
                <input 
                    id={id} 
                    name={id} 
                    type={inputType} 
                    required 
                    className={`w-full bg-[#0d1117] border ${error ? 'border-red-500' : 'border-[#30363d]'} text-white pl-12 pr-12 py-3.5 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-700`} 
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
                
                {isPasswordField && (
                    <button
                        type="button"
                        onClick={() => setIsPasswordVisible(prev => !prev)}
                        className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-600 hover:text-indigo-400 transition-colors"
                    >
                        <i className={`fa-solid ${isPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                )}
            </div>
            {error && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase tracking-tighter">
                {Array.isArray(error) ? error[0] : error}
            </p>}
        </div>
    );
};

// =================================================================
// 2. ASOSIY REGISTER KOMPONENTI
// =================================================================
const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { isLoading, error, isLoggedIn } = useSelector(selectAuthState);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: '', 
    });

    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/'); 
        }
    }, [isLoggedIn, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
             setFormErrors(prev => ({ ...prev, [name]: null }));
        }
    };
    
    const validateForm = () => {
        const errors = {};
        if (formData.password !== formData.password2) {
            errors.password2 = "Parollar mos kelmadi.";
        }
        if (!formData.username) {
             errors.username = "Username kiritish majburiy.";
        }
        if (!formData.password || formData.password.length < 8) {
             errors.password = "Parol kamida 8 belgidan iborat bo'lishi kerak.";
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return; 

        dispatch(signUserStart());
        try {
            const response = await AuthService.userRegister(formData);
            dispatch(signUserSuccess(response.user));
        } catch (err) {
            console.error("Ro'yxatdan o'tish xatosi:", err.response?.data || err.message);
            const serverErrors = err.response?.data || { detail: "Kutilmagan xato yuz berdi." };
            
            if (serverErrors.username || serverErrors.email || serverErrors.password || serverErrors.password2) {
                 setFormErrors(serverErrors);
                 dispatch(signUserFailer("Validatsiya xatolari mavjud.")); 
            } else {
                 dispatch(signUserFailer(serverErrors.msg || serverErrors.detail || "Kirish xatosi"));
            }
        }
    };

    const handleSocialLogin = (url) => {
        window.location.href = url;
    };

    return (
        <div className="register-page-container flex items-center justify-center min-h-screen bg-[#0d1117] px-4 py-12"> 
            <div className="animate-fade-in w-full max-w-md p-8 space-y-6 bg-[#161b22] rounded-2xl shadow-2xl border border-[#30363d]">
                
                {/* --- LOGO VA SARLAVHA --- */}
                <div className="text-center">
                    <Link to="/" className="inline-flex flex-col items-center group">
                        <img 
                            src={FSocietyLogo} 
                            alt="F.Society Logo" 
                            className="h-20 w-auto object-contain transition-transform duration-500 group-hover:rotate-[360deg]" 
                        />
                        <span className="text-2xl font-black text-white mt-2 tracking-tighter">
                            F<span className="text-indigo-500">Society</span>
                        </span>
                    </Link>
                    <h1 className="text-2xl font-bold hero-gradient-text mt-6">
                        Yangi Hisob Yaratish
                    </h1>
                    <p className="text-gray-500 mt-1 text-sm font-medium">Jamiyatimizga xush kelibsiz!</p>
                </div>

                {/* Global Xato Xabari */}
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
                    <span className="text-gray-600 text-[10px] font-black uppercase tracking-tighter whitespace-nowrap">yoki email orqali</span>
                    <span className="h-px w-full bg-gray-800"></span>
                </div>

                {/* Register Form */}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    
                    <FieldWithIcon
                        id="username"
                        label="Username"
                        iconClass="fas fa-user"
                        type="text"
                        placeholder="foydalanuvchi_nomi"
                        value={formData.username}
                        onChange={handleChange}
                        error={formErrors.username}
                    />

                    <FieldWithIcon
                        id="email"
                        label="Email manzili"
                        iconClass="fas fa-envelope"
                        type="email"
                        placeholder="misol@f.soc"
                        value={formData.email}
                        onChange={handleChange}
                        error={formErrors.email}
                    />

                    <FieldWithIcon
                        id="password"
                        label="Parol"
                        iconClass="fas fa-lock"
                        type="password"
                        placeholder="Kamida 8 belgi"
                        value={formData.password}
                        onChange={handleChange}
                        error={formErrors.password}
                    />
                    
                    <FieldWithIcon
                        id="password2"
                        label="Parolni tasdiqlash"
                        iconClass="fas fa-shield-check"
                        type="password"
                        placeholder="Qayta kiriting"
                        value={formData.password2}
                        onChange={handleChange}
                        error={formErrors.password2}
                    />

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-black py-4 rounded-xl transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98] uppercase tracking-widest text-sm"
                    >
                        {isLoading ? (
                            <><i className="fa-solid fa-spinner fa-spin mr-2"></i> Yaratilmoqda...</>
                        ) : (
                            "Hisob Yaratish"
                        )}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 pt-2">
                    Hisobingiz bormi?
                    <Link to="/login" className="font-black text-indigo-400 hover:text-indigo-300 ml-2 transition-colors">
                        Kirish
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;