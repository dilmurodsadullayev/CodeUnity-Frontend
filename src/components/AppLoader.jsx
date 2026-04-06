import React from 'react';
import { motion } from 'framer-motion';
import FSocietyLogo from '../assests/logo/f_society.png'; // Logotip yo'li

const AppLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#05070a] overflow-hidden relative">
      
      {/* --- BACKGROUND GLOW EFFECT --- */}
      <div className="absolute w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>

      <div className="relative flex flex-col items-center">
        
        {/* --- LOGO ANIMATION SECTION --- */}
        <div className="relative w-40 h-40 md:w-56 md:h-56 flex items-center justify-center">
          
          {/* Outer Rotating Ring (Hi-Tech Style) */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="absolute inset-0 border-t-2 border-b-2 border-indigo-500/30 rounded-full"
          ></motion.div>

          {/* Inner Fast Rotating Ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="absolute inset-4 border-r-2 border-l-2 border-indigo-400 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.5)]"
          ></motion.div>

          {/* Central Logo with Glitch and Glow */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: [0.9, 1.05, 1],
              opacity: 1,
              filter: [
                "drop-shadow(0 0 10px rgba(99,102,241,0.5))",
                "drop-shadow(0 0 30px rgba(99,102,241,0.8))",
                "drop-shadow(0 0 10px rgba(99,102,241,0.5))"
              ]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="z-10"
          >
            <img 
              src={FSocietyLogo} 
              alt="F.Society Logo" 
              className="w-32 h-32 md:w-44 md:h-44 object-contain"
            />
          </motion.div>

          {/* Scanning Line Effect */}
          <motion.div 
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-[2px] bg-indigo-500/50 shadow-[0_0_15px_#6366f1] z-20"
          ></motion.div>
        </div>

        {/* --- TEXT SECTION --- */}
        <div className="mt-12 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black tracking-[0.2em] text-white uppercase italic"
          >
            F.<span className="text-indigo-500 animate-pulse">Society</span>
          </motion.h1>

          <div className="flex items-center justify-center space-x-2 mt-4">
            {/* Typing Animation for Subtext */}
            <motion.p 
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-indigo-400 font-mono text-sm md:text-base tracking-widest uppercase"
            >
              Initializing system scan...
            </motion.p>
          </div>

          {/* Progress Bar Container */}
          <div className="w-64 h-1 bg-gray-900 mt-6 rounded-full overflow-hidden border border-gray-800">
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-full h-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
            ></motion.div>
          </div>
        </div>

        {/* --- DECORATIVE BINARY CODE (Optional) --- */}
        <div className="absolute -bottom-20 opacity-5 font-mono text-xs text-indigo-500 select-none hidden md:block">
            01010100 01101000 01100101 00100000 01110111 01101111 01110010 01101100 01100100 00100000 01101001 01110011 00100000 01101111 01110101 01110010 01110011
        </div>
      </div>
    </div>
  );
};

export default AppLoader;