import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom'; 
import './Register.css'; 
import { signUserStart, signUserFailer, signUserSuccess } from '../features/auth/Auth';
import AuthService from '../services/auth';

// Redux holatlarini tanlash uchun funksiya
const selectAuthState = (state) => state.auth;


// =================================================================
// 1. FIELD KOMPONENTI (MUSTAQIL, RE-RENDER MUAMMOSINI HAL QILISH UCHUN)
// =================================================================
const FieldWithIcon = ({ id, label, iconClass, type, placeholder, value, onChange, error }) => {
    // Parol turini boshqarish uchun local state
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const inputType = type === 'password' && isPasswordVisible ? 'text' : type;
    
    // Parol maydoni bo'lsa, ko'zni ko'rsatish
    const isPasswordField = type === 'password';

    return (
        <div>
            <label htmlFor={id} className="text-sm font-medium text-gray-300">{label}</label>
            <div className="relative mt-1">
                <i className={`${iconClass} text-gray-500 absolute top-1/2 left-3 -translate-y-1/2`}></i>
                <input 
                    id={id} 
                    name={id} 
                    type={inputType} // Ko'rsatish holatiga qarab type o'zgaradi
                    required 
                    className={`input-dark w-full pl-10 pr-10 py-2.5 rounded-lg ${error ? 'border-red-500 focus:border-red-500' : ''}`} 
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
                
                {/* Parolni ko'rsatish/yashirish tugmasi */}
                {isPasswordField && (
                    <button
                        type="button"
                        onClick={() => setIsPasswordVisible(prev => !prev)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-indigo-400 transition-colors"
                        title={isPasswordVisible ? "Parolni yashirish" : "Parolni ko'rsatish"}
                    >
                        <i className={`fa-solid ${isPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                )}
            </div>
            {error && <p className="text-red-400 text-xs mt-1">{Array.isArray(error) ? error[0] : error}</p>}
        </div>
    );
};
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
        
        if (!validateForm()) {
            return; 
        }

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
    

    return (
        <div className="register-page-container"> 
            <div className="animate-fade-in w-full max-w-md p-8 space-y-6 bg-[#161b22] rounded-xl shadow-2xl border border-[#30363d]">
                <div className="text-center">
                    <Link to="/" className="inline-flex items-center space-x-2">
                        <i className="fa-solid fa-code-fork text-indigo-400 text-3xl"></i>
                        <span className="text-2xl font-bold text-white">Code<span className="text-indigo-400">Unity</span></span>
                    </Link>
                    <h1 className="text-3xl font-bold hero-gradient-text mt-4">
                        Hisob Yaratish
                    </h1>
                    <p className="text-gray-400 mt-2">Bugun yangi nimalar o'rganamiz?</p>
                </div>

                {/* Global Xato Xabari */}
                {error && typeof error === 'string' && (
                    <div className="bg-red-900/50 text-red-300 p-3 rounded-lg border border-red-700 text-sm">
                        {error}
                    </div>
                )}


                {/* Social Login */}
                <div className="grid grid-cols-2 gap-4">
                    <button type="button" className="social-btn w-full flex items-center justify-center py-2.5 rounded-lg">
                        <i className="fab fa-github mr-2"></i> GitHub
                    </button>
                    <button type="button" className="social-btn w-full flex items-center justify-center py-2.5 rounded-lg">
                        <i className="fab fa-google mr-2"></i> Google
                    </button>
                </div>

                <div className="flex items-center justify-center space-x-2">
                    <span className="h-px w-16 bg-gray-600"></span>
                    <span className="text-gray-500 font-normal">yoki email orqali</span>
                    <span className="h-px w-16 bg-gray-600"></span>
                </div>

                {/* Register Form */}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    
                    <FieldWithIcon
                        id="username"
                        label="Username"
                        iconClass="fas fa-user"
                        type="text"
                        placeholder="Noyob ism tanlang"
                        value={formData.username}
                        onChange={handleChange}
                        error={formErrors.username}
                    />

                    <FieldWithIcon
                        id="email"
                        label="Email"
                        iconClass="fas fa-envelope"
                        type="email"
                        placeholder="sizning@email.com"
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
                        iconClass="fas fa-lock"
                        type="password"
                        placeholder="Parolni qayta kiriting"
                        value={formData.password2}
                        onChange={handleChange}
                        error={formErrors.password2}
                    />

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full btn-primary font-semibold py-3 rounded-lg text-white" 
                    >
                        {isLoading ? <i className="fa-solid fa-spinner fa-spin mr-2"></i> : null}
                        {isLoading ? "Ro'yxatdan O'tilmoqda..." : "Ro'yxatdan o'tish"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-400">
                    Hisobingiz bormi?
                    <Link to="/login" className="font-medium text-indigo-400 hover:underline ml-1">
                    Kirish
                </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;