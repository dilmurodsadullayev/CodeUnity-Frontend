import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-[#161b22] border-t border-gray-800 py-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          
          {/* Chap tomon: Muallif va ijtimoiy tarmoqlar */}
          <div className="text-center md:text-left">
            <p className="text-lg font-semibold text-white">
              Created by <span className="text-indigo-400">DimoDev</span>
            </p>
            <div className="flex justify-center md:justify-start space-x-5 mt-3 text-xl">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" title="Telegram">
                <i className="fab fa-telegram"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" title="GitHub">
                <i className="fab fa-github"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" title="LinkedIn">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>

          {/* Markaz: Texnologiyalar */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-3">Powered by</p>
            <div className="flex items-center justify-center gap-6">
              
              {/* React */}
              <a href="https://react.dev/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <img src="https://cdn.svgporn.com/logos/react.svg" alt="React Logo" className="h-6 w-6"/>
                <span className="font-medium">React</span>
              </a>
              
              {/* Django */}
              <a href="https://www.djangoproject.com/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <img src="https://cdn.svgporn.com/logos/django-icon.svg" alt="Django Logo" className="h-6 w-6"/>
                <span className="font-medium">Django</span>
              </a>
              
              {/* Tailwind CSS */}
              <a href="https://tailwindcss.com/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <img src="https://cdn.svgporn.com/logos/tailwindcss-icon.svg" alt="Tailwind CSS Logo" className="h-6 w-6"/>
                <span className="font-medium">Tailwind CSS</span>
              </a>
            </div>
          </div>

          {/* O'ng tomon: Huquqlar */}
          <div className="text-center md:text-right">
            <p className="text-gray-500">&copy; 2025 F.Society.</p>
            <p className="text-gray-500">Barcha huquqlar himoyalangan.</p>
          </div>

        </div>
      </div>
    </footer>
  )
}

export default Footer
