// components/CoverImageEditModal.jsx

import React, { useState } from 'react';
import ProfileService from '../services/profile'; // ProfileService ni import qilish
import { useDispatch } from 'react-redux';
import { getProfileSuccess } from '../features/profile';

const CoverImageEditModal = ({ isOpen, onClose, currentCoverImage }) => {
    const dispatch = useDispatch();
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(currentCoverImage);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            setError(null);
            setSuccess(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!file) {
            setError("Iltimos, yangi fon rasmini tanlang.");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        // FormData obyekti rasmlarni API ga yuborish uchun ishlatiladi
        const formData = new FormData();
        formData.append('cover_image', file); // API dagi maydon nomiga mos kelishi kerak

        try {
            // *ESLATMA: ProfileService.updateCoverImage funksiyasi mavjud bo'lishi kerak.*
            const response = await ProfileService.updateCoverImage(formData); 
            
            // Redux state'ni yangilash
            dispatch(getProfileSuccess(response)); 

            setLoading(false);
            setSuccess(true);
            
            // 1 sekunddan keyin modalni yopish va rasm yangilanishi uchun qayta yuklash
            setTimeout(onClose, 1000); 

        } catch (err) {
            console.error("Fon rasmini tahrirlashda xato:", err);
            const errorMessage = err.message || "Rasmni saqlashda xato yuz berdi.";
            setError(errorMessage);
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFile(null);
        setPreviewUrl(currentCoverImage);
        setError(null);
        setSuccess(false);
        onClose();
    };


    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target.id === 'cover-modal-backdrop' && handleClose()}
            id="cover-modal-backdrop"
        >
            <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto transform transition-all">
                <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">Fon Rasmini Tahrirlash</h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
                        <i className="fa-solid fa-times text-2xl"></i>
                    </button>
                </div>
                
                <form onSubmit={handleSave} className="p-6 space-y-5">
                    
                    {/* Hozirgi rasm yoki oldindan ko'rish */}
                    <div className="relative h-40 w-full rounded-lg overflow-hidden border-2 border-dashed border-gray-600">
                        {previewUrl && (
                            <img 
                                src={previewUrl} 
                                alt="Fon rasmi oldindan ko'rish" 
                                className="w-full h-full object-cover"
                            />
                        )}
                        {!previewUrl && (
                             <div className="w-full h-full flex items-center justify-center text-gray-500">Rasm tanlanmagan</div>
                        )}
                        <label 
                            htmlFor="cover-upload" 
                            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white cursor-pointer hover:bg-opacity-70 transition-opacity"
                        >
                             <i className="fa-solid fa-camera mr-2"></i> Yangi rasm tanlash
                        </label>
                        <input 
                            type="file" 
                            id="cover-upload" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                            className="hidden"
                        />
                    </div>

                    {/* Holat va tugmalar */}
                    {error && <div className="bg-red-900/50 text-red-400 p-3 rounded-lg text-sm flex items-start"><i className="fa-solid fa-exclamation-triangle mr-2 mt-1"></i> <p>{error}</p></div>}
                    {success && <div className="bg-green-900/50 text-green-400 p-3 rounded-lg text-sm font-semibold flex items-center"><i className="fa-solid fa-check-circle mr-2"></i> Rasm muvaffaqiyatli saqlandi!</div>}

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-5 rounded-lg transition-all"
                        >
                            Bekor qilish
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !file}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <i className="fa-solid fa-spinner fa-spin"></i>
                                    <span>Yuklanmoqda...</span>
                                </>
                            ) : (
                                <span>Saqlash</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CoverImageEditModal;