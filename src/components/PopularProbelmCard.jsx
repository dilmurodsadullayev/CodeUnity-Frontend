import React from 'react';

// Sizning matnni cheklovchi utilitingiz. Bu fayl mavjudligiga ishonch hosil qiling.
import { limitText } from '../utils/limitText';

const PopularProblemCard = ({ problem, description, star, response, views }) => {
  return (
    // Asosiy karta: Gradient fon, shisha effekti va silliq animatsiyalar
    <div className="
      group
      relative
      flex
      h-full
      flex-col
      rounded-2xl
      bg-gradient-to-br from-gray-900 via-gray-900/95 to-indigo-900/60
      p-6
      border border-white/10
      shadow-lg
      transition-all duration-300 ease-in-out
      hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/50
    ">
      {/* Sarlavha: Chiroyli shrift va hover effekti */}
      <h3 className="mb-3 cursor-pointer text-xl font-bold text-gray-100 transition-colors duration-300 group-hover:text-indigo-400">
        {limitText(problem, 40)} {/* Matn uzunligini moslashtiring */}
      </h3>

      {/* Tavsif: O'qishga oson rang va o'lcham */}
      <p className="mb-4 flex-grow text-sm text-gray-400">
        {limitText(description, 100)} {/* Matn uzunligini moslashtiring */}
      </p>

      {/* Karta quyi qismi */}
      <div className="mt-auto flex items-end justify-between">
        {/* Teglar: Kichik hover animatsiyasi */}
        <div className="flex flex-wrap gap-2">
          <span className="transform rounded-full bg-sky-500/20 px-2.5 py-1 text-xs font-semibold text-sky-300 transition-transform duration-200 hover:scale-110">
            Python
          </span>
          <span className="transform rounded-full bg-green-500/20 px-2.5 py-1 text-xs font-semibold text-green-300 transition-transform duration-200 hover:scale-110">
            Asyncio
          </span>
        </div>

        {/* Statistikalar: Ikonkalar va raqamlar */}
        <div className="flex items-center space-x-5 text-sm text-gray-400">
          <span className="flex items-center transition-colors duration-300 hover:text-white">
            <i className="fas fa-eye mr-2"></i> {views ? views : 0}
          </span>
          <span className="flex items-center transition-colors duration-300 hover:text-white">
            <i className="fas fa-comment-alt mr-2"></i> {response}
          </span>
          <span className="flex items-center transition-colors duration-300 hover:text-white">
            <i className="fas fa-arrow-up mr-2"></i> {star ? star : 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PopularProblemCard;
