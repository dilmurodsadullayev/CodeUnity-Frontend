import React from 'react';
import './Login.css'; // Komponentga tegishli CSS faylini import qilamiz

const Register = () => {
    return (
        <div className="animate-fade-in w-full max-w-md p-8 space-y-6 bg-[#161b22] rounded-xl shadow-2xl border border-[#30363d]">
            <div className="text-center">
                <a href="/" className="inline-flex items-center space-x-2">
                    <i className="fa-solid fa-code-fork text-indigo-400 text-3xl"></i>
                    <span className="text-2xl font-bold text-white">Code<span className="text-indigo-400">Unity</span></span>
                </a>
                <h1 className="text-3xl font-bold hero-gradient-text mt-4">
                    Hisob Yaratish
                </h1>
                <p className="text-gray-400 mt-2">Bugun yangi nimalar o'rganamiz?</p>
            </div>

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
                <span className="text-gray-500 font-normal">yoki email orqali</span>
                <span className="h-px w-16 bg-gray-600"></span>
            </div>

            {/* Login Form */}
            <form className="space-y-4">
                <div>
                    <label htmlFor="username" className="text-sm font-medium text-gray-300">Username</label>
                    <div className="relative mt-1">
                        <i className="fas fa-user text-gray-500 absolute top-1/2 left-3 -translate-y-1/2"></i>
                        <input id="username" name="username" type="text" required className="input-dark w-full pl-10 pr-3 py-2.5 rounded-lg" placeholder="Noyob ism tanlang" />
                    </div>
                </div>
                  <div>
                    <label for="email" className="text-sm font-medium text-gray-300">Email</label>
                    <div className="relative mt-1">
                        <i className="fas fa-envelope text-gray-500 absolute top-1/2 left-3 -translate-y-1/2"></i>
                        <input id="email" name="email" type="email" required class="input-dark w-full pl-10 pr-3 py-2.5 rounded-lg" placeholder="sizning@email.com"/>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between items-center">
                        <label htmlFor="password" className="text-sm font-medium text-gray-300">Parol</label>
                    </div>
                    <div className="relative mt-1">
                        <i className="fas fa-lock text-gray-500 absolute top-1/2 left-3 -translate-y-1/2"></i>
                        <input id="password" name="password" type="password" required className="input-dark w-full pl-10 pr-3 py-2.5 rounded-lg" placeholder="Kamida 8 belgi" />
                    </div>
                </div>
                <button type="submit" className="w-full btn-primary font-semibold py-3 rounded-lg text-white">
                    Ro'yxatdan o'tish
                </button>
            </form>

            <p className="text-center text-sm text-gray-400">
                Hisobingiz bormi?
                <a href="/login" className="font-medium text-indigo-400 hover:underline">
                Kirish
            </a>
            </p>
        </div>
    );
};

export default Register;