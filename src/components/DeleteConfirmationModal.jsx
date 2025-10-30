// src/components/DeleteConfirmationModal.jsx

import React from 'react';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemTitle }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4">
            <div className="bg-gray-800 rounded-2xl shadow-3xl border border-red-700 p-8 w-full max-w-md transform transition-all duration-300 scale-100 opacity-100 hover:shadow-neon-red">
                <div className="text-center mb-6">
                    <svg
                        className="mx-auto mb-4 w-16 h-16 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        ></path>
                    </svg>
                    <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 mb-2 leading-tight">
                        Tasdiqlash
                    </h3>
                    <p className="text-gray-300 text-lg">
                        Haqiqatan ham <span className="font-bold text-red-400">"{itemTitle}"</span>ni o'chirmoqchimisiz?
                    </p>
                    <p className="text-gray-400 text-md mt-2">Bu amalni bekor qilib bo'lmaydi.</p>
                </div>
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl text-gray-300 font-semibold bg-gray-700 hover:bg-gray-600 transition-colors duration-300 border border-gray-600 shadow-md hover:shadow-lg-gray text-lg transform hover:-translate-y-0.5"
                    >
                        Bekor Qilish
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-3 rounded-xl text-white font-bold bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 transition-all duration-300 shadow-lg shadow-red-500/50 transform hover:scale-105 hover:-translate-y-0.5 text-lg"
                    >
                        O'chirish
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;