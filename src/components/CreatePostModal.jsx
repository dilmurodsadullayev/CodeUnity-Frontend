import React, { useState, useEffect } from 'react';

// Statuslar ro'yxati sizning backenddagidek
const POST_TYPES = [
    { value: 'TEX', label: 'Texnologiya' },
    { value: 'SPO', label: 'Sport' },
    { value: 'BIZ', label: 'Biznes' },
    { value: 'ENT', label: 'O\'yin-kulgi' },
    { value: 'OTH', label: 'Boshqa' },
];

// initialData: { post_type, title, content } bo'lishi kutiladi
// Agar mavjud bo'lsa, tahrirlash rejimida ishlaydi.
const CreatePostModal = ({ isOpen, onClose, onSubmit, isSubmitting, initialData = null }) => {
    
    // 🌟 1. Initial Data bilan state'ni boshlash uchun funksiya
    const getInitialFormData = () => {
        if (initialData) {
            return {
                post_type: initialData.post_type || POST_TYPES[0].value,
                title: initialData.title || '',
                content: initialData.content || ''
            };
        }
        return {
            post_type: POST_TYPES[0].value,
            title: '',
            content: ''
        };
    };

    const [formData, setFormData] = useState(getInitialFormData());
    const [error, setError] = useState(null);

    // 🌟 2. initialData o'zgarganda yoki modal ochilganda formani yangilash
    useEffect(() => {
        if (isOpen) {
            setFormData(getInitialFormData());
            setError(null);
        }
    }, [isOpen, initialData]); // initialData o'zgarganda ham yangilanadi

    if (!isOpen) return null;

    // 🌟 3. Tahrirlash rejimini aniqlash
    const isEditMode = !!initialData;
    const modalTitle = isEditMode ? "Postni Tahrirlash" : "Yangi Post Yaratish";
    const buttonText = isEditMode ? "Tahrirlashni Saqlash" : "Postni Chop Etish";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        // Oddiy Validatsiya
        if (!formData.title.trim() || !formData.content.trim()) {
            setError("Sarlavha va kontent maydonlarini to'ldirish shart!");
            return;
        }

        try {
            // onSubmit funksiyasi endi tahrirlash yoki yaratishni o'z ichiga oladi
            await onSubmit(formData); 
            
            // Faqat Yaratishda tozalash shart (tahrirlashda ota komponent yopiladi)
            if (!isEditMode) {
                setFormData({
                    post_type: POST_TYPES[0].value,
                    title: '',
                    content: ''
                });
            }
            // Ota komponent onClose ni chaqiradi
            
        } catch (err) {
            // Ota komponentdan tashlangan xatoni qabul qilish
            // Agar xato JSON bo'lsa, uni tahlil qilish
            let errMsg = err.message;
            try {
                const parsedError = JSON.parse(err.message);
                // Agar Django backend'dan kelgan xato bo'lsa
                errMsg = parsedError.detail || Object.values(parsedError).flat().join(', ') || errMsg;
            } catch (e) {
                // JSON emas
            }
            setError(errMsg || "Post yaratishda kutilmagan xato yuz berdi.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-lg mx-4 p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-3">
                    {/* 🌟 Sarlavha o'zgartirildi */}
                    <h3 className="text-2xl font-bold text-white">{modalTitle}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-2">
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Post Turi */}
                    <div className="mb-4">
                        <label htmlFor="post_type" className="block text-sm font-medium text-gray-300 mb-1">Kategoriya</label>
                        <select
                            id="post_type"
                            name="post_type"
                            value={formData.post_type}
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-indigo-500 focus:border-indigo-500"
                            disabled={isSubmitting}
                        >
                            {POST_TYPES.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>
                    </div>
                    
                    {/* Sarlavha */}
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Sarlavha</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Post sarlavhasini kiriting"
                            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-indigo-500 focus:border-indigo-500"
                            maxLength="150"
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Kontent */}
                    <div className="mb-6">
                        <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">Kontent</label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            rows="6"
                            placeholder="Postning asosiy kontentini kiriting..."
                            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white resize-none focus:ring-indigo-500 focus:border-indigo-500"
                            disabled={isSubmitting}
                        ></textarea>
                    </div>

                    {/* Xato xabari */}
                    {error && (
                        <p className="text-red-400 text-sm mb-4 bg-red-900/30 p-3 rounded-lg border border-red-700">{error}</p>
                    )}

                    {/* Tugma */}
                    <button
                        type="submit"
                        className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                            isSubmitting ? 'bg-indigo-700/50 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i>
                                Yuklanmoqda...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-paper-plane"></i>
                                {buttonText} {/* 🌟 Tugma yozuvi o'zgartirildi */}
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreatePostModal;