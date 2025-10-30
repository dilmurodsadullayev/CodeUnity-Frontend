// components/NotFound.jsx
import React, { useEffect } from 'react';
import './NotFound.css'; // Bu CSS faylni o'zingiz yarating va yuqoridagi style qismini unga ko'chiring

const NotFound = () => {
    useEffect(() => {
        // Yulduzlarni dinamik generatsiya qilish
        const starfield = document.querySelector('.starfield');
        if (starfield) {
            // Yulduzlar sonini mobil qurilmalar uchun optimallashtirish mumkin (masalan 50-70)
            const starCount = window.innerWidth < 768 ? 70 : 100; 
            for (let i = 0; i < starCount; i++) {
                const star = document.createElement('div');
                star.classList.add('star');
                
                const size = Math.random() * 3 + 1; // 1px dan 4px gacha
                star.style.width = `${size}px`;
                star.style.height = `${size}px`;
                
                star.style.left = `${Math.random() * 100}%`;
                
                const duration = Math.random() * 5 + 5; // 5s dan 10s gacha
                star.style.animationDuration = `${duration}s`;
                
                const delay = Math.random() * 5; // 0s dan 5s gacha
                star.style.animationDelay = `${delay}s`;

                starfield.appendChild(star);
            }
        }

        // Cleanup function - komponent o'chirilganda yulduzlarni tozalash uchun
        return () => {
            if (starfield) {
                starfield.innerHTML = '';
            }
        };
    }, []); // Faqat komponent bir marta yuklanganda ishlashi uchun bo'sh massiv

    return (
        <div className="flex items-center justify-center min-h-screen body-bg">
            {/* Orqa fon uchun yulduzlar */}
            <div className="starfield"></div>

            <div className="text-center p-8 z-10">
                {/* Golografik 404 raqami */}
                <h1 className="text-7xl md:text-9xl font-black text-white glitch-text">404</h1>

                {/* Suzib yuruvchi droid */}
                <div className="my-8">
                    <i className="fas fa-robot text-7xl text-indigo-400 floating-droid"></i>
                </div>

                {/* Asosiy xabar */}
                <p className="text-xl md:text-2xl font-bold text-white mb-2">
                    Bu siz izlayotgan sahifa emas.
                </p>
                <p className="text-gray-400 max-w-md mx-auto">
                    Aftidan, siz galaktikaning noma'lum sektoriga kirib qoldingiz. Kiritilgan koordinatalar noto'g'ri yoki bu yulduz tizimi allaqachon yo'q qilingan bo'lishi mumkin.
                </p>

                {/* Bosh sahifaga qaytish tugmasi */}
                <a 
                    href="/" // React Router ishlatilganda <Link to="/"> ishlatish tavsiya etiladi
                    className="mt-8 inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg shadow-indigo-500/30"
                >
                    <i className="fas fa-rocket mr-2"></i> Bosh Sahifaga Qaytish
                </a>
            </div>
        </div>
    );
};

export default NotFound;