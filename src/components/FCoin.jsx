import React from 'react';
import { motion } from 'framer-motion';
import './FCoin.css';

// Rasmni import qilish
import FCoinImage from '../assests/coin/fcoin.png'; 

const FCoin = () => {
  return (
    <div className="bg-[#05070a] min-h-screen relative overflow-hidden">
      
      {/* --- FLOATING BACKGROUND ANIMATION (Rasm ishlatilgan versiya) --- */}
      <div className="floating-coins-bg opacity-20">
        {[...Array(10)].map((_, i) => (
          <motion.img 
            key={i}
            src={FCoinImage}
            alt="fcoin-bg"
            className="absolute pointer-events-none"
            initial={{ y: '110vh', opacity: 0 }}
            animate={{ 
                y: '-20vh', 
                opacity: [0, 1, 1, 0],
                rotate: 360 
            }}
            transition={{ 
                duration: Math.random() * 10 + 10, 
                repeat: Infinity, 
                delay: Math.random() * 5,
                ease: "linear"
            }}
            style={{ 
              width: `${Math.random() * 40 + 20}px`, 
              left: `${Math.random() * 100}%`,
              filter: 'blur(1px)' 
            }}
          />
        ))}
      </div>

      <main className="container mx-auto px-4 py-16 relative z-10">
        
        {/* --- HEADER SECTION --- */}
        <section className="text-center pt-8 pb-12">
          
          {/* ASOSIY TANGA (Sizning fcoin.png rasmingiz) */}
          <div className="relative flex justify-center">
             {/* Orqa fondagi yorug'lik */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-indigo-600/30 blur-[60px] rounded-full animate-pulse"></div>
             
             <motion.img 
                src={FCoinImage}
                alt="FCoin Digital Asset"
                initial={{ scale: 0, rotateY: -180 }}
                animate={{ scale: 1, rotateY: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.2 }}
                whileHover={{ scale: 1.1, rotateY: 10 }}
                className="w-32 h-32 md:w-44 md:h-44 object-contain relative z-10 drop-shadow-[0_0_30px_rgba(99,102,241,0.8)]"
             />
          </div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-7xl font-black text-white mt-8 tracking-tighter"
          >
            FCoin <span className="text-indigo-500 drop-shadow-[0_0_15px_rgba(99,102,241,0.6)] uppercase italic">Iqtisodiyoti</span>
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 inline-block px-6 py-2 rounded-full bg-indigo-900/30 border border-indigo-500/30 backdrop-blur-sm"
          >
            <p className="text-indigo-300 font-mono text-sm uppercase tracking-widest">
              <span className="font-black text-white">FCoin</span> (FixCoin) — F.Society tizimining ichki yoqilg'isi
            </p>
          </motion.div>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto mt-6">
            Hissangizni qadrlaymiz. Har bir harakatingiz raqamli aktivga aylanadi. 
            Ko'proq yechim, ko'proq <span className="text-white font-bold tracking-widest">FCOIN</span>.
          </p>
        </section>

        {/* --- MAIN CARDS SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* EARNING FCoin */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="info-card earning-bg border border-green-500/20 bg-gray-900/40 backdrop-blur-md rounded-[40px] overflow-hidden shadow-2xl"
          >
            <div className="p-8">
              <h2 className="text-3xl font-black text-white flex items-center gap-3 uppercase tracking-tight italic">
                <i className="fas fa-arrow-up-right-dots text-green-400"></i>
                Ishlash yo'llari
              </h2>
              <div className="mt-8 space-y-3">
                {[
                  { icon: "fas fa-edit", text: "Yangi maqola / Post yozish", bonus: "+20" },
                  { icon: "fas fa-pen-nib", text: "Muammolarga javob yozish", bonus: "+5" },
                  { icon: "fas fa-heart", text: "Post Like (❤️) olish", bonus: "+3" },
                  { icon: "fas fa-crown", text: "Eng Yaxshi Yechim topish", bonus: "+50" },
                  { icon: "fas fa-rocket", text: "Yangi loyiha yuklash", bonus: "+100" },
                  { icon: "fas fa-calendar-day", text: "Daily Login (Kunlik kirish)", bonus: "+1" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-green-500/10 transition-all border border-transparent hover:border-green-500/30 group">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-green-500/20 text-green-400 group-hover:scale-110 transition-transform">
                      <i className={item.icon}></i>
                    </div>
                    <p className="flex-grow text-gray-300 font-medium">{item.text}</p>
                    <span className="font-black text-white bg-green-600/30 px-3 py-1 rounded-lg border border-green-500/30">{item.bonus}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* SPENDING FCoin */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="info-card spending-bg border border-indigo-500/20 bg-gray-900/40 backdrop-blur-md rounded-[40px] overflow-hidden shadow-2xl"
          >
            <div className="p-8">
              <h2 className="text-3xl font-black text-white flex items-center gap-3 uppercase tracking-tight italic">
                <i className="fas fa-shopping-cart text-indigo-400"></i>
                Sarflash
              </h2>
              <div className="mt-8 space-y-6">
                <div>
                  <h3 className="font-bold text-indigo-300 text-lg mb-3 flex items-center gap-2 uppercase tracking-widest">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                    Profil Dizayni
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-gray-300 text-sm flex items-center gap-3 hover:bg-indigo-600/10 transition-colors">
                      <i className="fas fa-id-badge text-indigo-400"></i> Avatar ramkalari
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-gray-300 text-sm flex items-center gap-3 hover:bg-indigo-600/10 transition-colors">
                      <i className="fas fa-palette text-indigo-400"></i> Eksklyuziv temalar
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-indigo-300 text-lg mb-3 flex items-center gap-2 uppercase tracking-widest">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                    Imtiyozlar
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 group hover:border-indigo-500/40 transition-all">
                       <i className="fas fa-bullhorn text-xl text-indigo-400"></i>
                       <p className="text-gray-300">Loyihani TOP-ga ko'tarish</p>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 group hover:border-indigo-500/40 transition-all">
                       <i className="fas fa-graduation-cap text-xl text-indigo-400"></i>
                       <p className="text-gray-300">Premium Kurslarga kirish</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-indigo-600/10 border border-indigo-500/30 rounded-2xl">
                  <p className="text-indigo-300 text-sm italic">
                    "Kelajakda FCoin orqali real F.Society brend mahsulotlariga (stikerlar, kiyimlar) ega bo'lish imkoniyati qo'shiladi."
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* --- RULES SECTION --- */}
        <motion.section 
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-gray-900 via-indigo-950/20 to-black p-1 rounded-[45px] border border-indigo-500/10"
        >
          <div className="bg-gray-950 p-8 md:p-12 rounded-[44px]">
            <h2 className="text-4xl font-black text-white flex items-center gap-4 mb-8 italic uppercase tracking-tighter">
              <i className="fas fa-shield-halved text-indigo-500"></i>
              Tizim Qoidalari
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="space-y-3">
                <h4 className="text-white font-bold text-lg uppercase tracking-wider">Shaffoflik</h4>
                <p className="text-gray-400 text-sm leading-relaxed">Profilingizdagi "Hamyon" bo'limida har bir operatsiya blokcheyn kabi aniq saqlanadi.</p>
              </div>
              <div className="space-y-3">
                <h4 className="text-white font-bold text-lg uppercase tracking-wider">Legalite</h4>
                <p className="text-gray-400 text-sm leading-relaxed">FCoin haqiqiy valyuta emas. Uni sotish yoki tashqi pulga ayirboshlash taqiqlanadi.</p>
              </div>
              <div className="space-y-3">
                <h4 className="text-white font-bold text-lg uppercase tracking-wider">Adolat</h4>
                <p className="text-gray-400 text-sm leading-relaxed">Spam yoki bot orqali to'plangan aktivlar avtomatik musodara qilinadi.</p>
              </div>
            </div>
          </div>
        </motion.section>

      </main>
    </div>
  );
};

export default FCoin;