// CreateProjectModal.jsx
import React, { useState } from 'react';

// =================================================================
// MOCK MA'LUMOTLAR (Siz bularni Redux orqali yuklab olishingiz kerak)
// =================================================================
const mockLanguages = [
    { id: 1, name: 'Python' },
    { id: 2, name: 'JS' },
    { id: 3, name: 'TypeScript' },
    { id: 4, name: 'Java' },
    { id: 5, name: 'C++' },
    { id: 6, name: 'C#' },
    { id: 7, name: 'PHP' },
    { id: 8, name: 'GO' },
    { id: 9, name: 'Swift' },
    { id: 10, name: 'Ruby' },
    { id: 11, name: 'Dart' },
];


const mockTechnologies = [
    { id: 1, name: 'Django' },
    { id: 2, name: 'React' },
    { id: 3, name: 'Vue.js' },
    { id: 4, name: 'Angular' },
    { id: 5, name: 'Next.js' },
    { id: 6, name: 'Node.js' },
    { id: 7, name: 'Laravel' },
    { id: 8, name: 'Spring Boot' },
    { id: 9, name: 'Flutter' },
    { id: 10, name: 'FastAPI' },
    { id: 11, name: 'DRF' },
];
// =================================================================

/**
 * Yangi loyiha yaratish uchun modal komponent.
 * @param {boolean} isOpen - Modalning ochiqligi holati.
 * @param {function} onClose - Modalni yopish funksiyasi.
 * @param {function} onSubmit - Forma yuborilganda chaqiriladigan funksiya (ProjectService.createProject).
 */
const CreateProjectModal = ({ isOpen, onClose, onSubmit }) => {
    
    // Asosiy loyiha ma'lumotlari uchun state
    const [formData, setFormData] = useState({
        name: '',
        main_features: '',
        description: '',
        website_url: '',
        language: '', // ID
        technology: '', // ID
    });

    // Loyiha rasmlari uchun state: [{id: number, title: string, file: File}]
    const [images, setImages] = useState([{ id: Date.now(), title: '', file: null }]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    // Asosiy maydonlardagi o'zgarishlarni boshqarish
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Dinamik rasm ma'lumotlaridagi o'zgarishlarni boshqarish
    const handleImageChange = (id, field, value) => {
        setImages(images.map(image => 
            image.id === id ? { ...image, [field]: value } : image
        ));
    };

    // Yangi rasm maydonini qo'shish
    const handleAddImage = () => {
        setImages(prev => [...prev, { id: Date.now(), title: '', file: null }]);
    };

    // Rasm maydonini o'chirish
    const handleRemoveImage = (id) => {
        setImages(prev => prev.filter(image => image.id !== id));
    };
    
    // Fayl tanlanganini boshqarish (e.target.files[0] ni oladi)
    const handleFileChange = (id, file) => {
         setImages(images.map(image => 
            image.id === id ? { ...image, file: file } : image
        ));
    }


    // Forma yuborish funksiyasi
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        // 1. Ma'lumotlarni tekshirish (qisman)
        if (!formData.name || !formData.language || !formData.technology || !formData.description) {
            setError("Loyiha nomi, Tili, Texnologiyasi va Tavsifi majburiy maydonlardir.");
            return;
        }

        setIsSubmitting(true);
        
        // 2. Ma'lumotlarni API ga mos formatga keltirish (FormData)
        const projectData = new FormData();
        
        // Asosiy ma'lumotlarni qo'shish
        Object.keys(formData).forEach(key => {
            if (formData[key]) {
                 projectData.append(key, formData[key]);
            }
        });

        // Rasmlarni qo'shish
        images.forEach((img, index) => {
            if (img.file) {
                // Rasm faylini qo'shish. Backendga to'g'ri ishlashi uchun images[index]image kabi formatlash tavsiya etiladi.
                projectData.append(`images[${index}]image`, img.file, img.file.name);
                
                // Rasm sarlavhasini qo'shish
                projectData.append(`images[${index}]title`, img.title || `Image ${index + 1}`); 
            }
        });

        try {
            await onSubmit(projectData); // API chaqiruvi uchun ProfileProjects ga uzatish
            
            // Muvaffaqiyatli bo'lsa
            onClose(); // Modalni yopish
            // Formani tozalash (Modal yopilganda qayta ochilsa toza bo'lishi uchun)
            setFormData({ name: '', main_features: '', description: '', website_url: '', language: '', technology: '' });
            setImages([{ id: Date.now(), title: '', file: null }]);
            
        } catch (err) {
            // onSubmit funksiyasidan kelgan xatoni ushlab olish
            setError(err.message || "Loyihani yaratishda xato yuz berdi.");
            
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-75 backdrop-blur-sm flex justify-center items-center">
            <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl m-4 md:m-8 max-h-[90vh] overflow-y-auto transform transition-all">
                
                {/* Modal sarlavhasi */}
                <div className="sticky top-0 bg-gray-800 p-6 border-b border-gray-700 flex justify-between items-center z-10">
                    <h3 className="text-2xl font-bold text-white">Yangi loyiha yaratish</h3>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-white transition-colors p-2 rounded-full"
                    >
                        <i className="fa-solid fa-xmark text-xl"></i>
                    </button>
                </div>
                
                {/* Modal Tana Qismi (Scrollable) */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    
                    {/* Xato xabari */}
                    {error && (
                        <div className="bg-red-900/50 border border-red-700 text-red-300 p-3 rounded-lg">
                            <p className="font-semibold">{error}</p>
                        </div>
                    )}

                    {/* 1. Asosiy Loyiha Ma'lumotlari */}
                    <div className="space-y-4">
                        <label className="block text-lg font-semibold text-white border-b border-gray-700 pb-2">Asosiy ma'lumotlar</label>
                        
                        {/* Loyiha nomi */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Nomi (maks. 30)</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                maxLength={30}
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>

                        {/* Asosiy xususiyatlar */}
                        <div>
                            <label htmlFor="main_features" className="block text-sm font-medium text-gray-400 mb-1">Asosiy xususiyatlar (maks. 150)</label>
                            <input
                                type="text"
                                id="main_features"
                                name="main_features"
                                value={formData.main_features}
                                onChange={handleInputChange}
                                maxLength={150}
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>

                        {/* Vebsayt URL */}
                        <div>
                            <label htmlFor="website_url" className="block text-sm font-medium text-gray-400 mb-1">Vebsayt/Demo URL (Ixtiyoriy)</label>
                            <input
                                type="url"
                                id="website_url"
                                name="website_url"
                                value={formData.website_url}
                                onChange={handleInputChange}
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        {/* Tavsif (Description) */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">Tavsif</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="4"
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            ></textarea>
                        </div>
                    </div>

                    {/* 2. Til va Texnologiya tanlash */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                        {/* Til (Language) */}
                        <div>
                            <label htmlFor="language" className="block text-sm font-medium text-gray-400 mb-1">Til (Language)</label>
                            <select
                                id="language"
                                name="language"
                                value={formData.language}
                                onChange={handleInputChange}
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                                required
                            >
                                <option value="" disabled>Tilni tanlang</option>
                                {mockLanguages.map(lang => (
                                    <option key={lang.id} value={lang.id}>{lang.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Texnologiya (Technology) */}
                        <div>
                            <label htmlFor="technology" className="block text-sm font-medium text-gray-400 mb-1">Texnologiya (Technology)</label>
                            <select
                                id="technology"
                                name="technology"
                                value={formData.technology}
                                onChange={handleInputChange}
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                                required
                            >
                                <option value="" disabled>Texnologiyani tanlang</option>
                                {mockTechnologies.map(tech => (
                                    <option key={tech.id} value={tech.id}>{tech.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>


                    {/* 3. Loyiha Rasmlari (Dinamik qism) */}
                    <div className="space-y-4 pt-4 border-t border-gray-700">
                        <label className="block text-lg font-semibold text-white">Loyiha Rasmlari ({images.length} ta)</label>
                        
                        {images.map((image, index) => (
                            <div key={image.id} className="p-4 border border-gray-700 rounded-lg bg-gray-700/50 relative">
                                
                                {images.length > 1 && (
                                    <button 
                                        type="button" 
                                        onClick={() => handleRemoveImage(image.id)}
                                        className="absolute top-2 right-2 text-red-400 hover:text-red-500 p-1 transition-colors rounded-full"
                                        title="Rasmni o'chirish"
                                    >
                                        <i className="fa-solid fa-trash-alt"></i>
                                    </button>
                                )}
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Rasm Title */}
                                    <div>
                                        <label htmlFor={`image-title-${image.id}`} className="block text-sm font-medium text-gray-400 mb-1">Rasm uchun sarlavha (maks. 100)</label>
                                        <input
                                            type="text"
                                            id={`image-title-${image.id}`}
                                            value={image.title}
                                            onChange={(e) => handleImageChange(image.id, 'title', e.target.value)}
                                            maxLength={100}
                                            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                                        />
                                    </div>
                                    
                                    {/* Rasm Fayli */}
                                    <div>
                                        <label htmlFor={`image-file-${image.id}`} className="block text-sm font-medium text-gray-400 mb-1">Fayl tanlash {index === 0 ? "(Asosiy rasm)" : ""}</label>
                                        <input
                                            type="file"
                                            id={`image-file-${image.id}`}
                                            onChange={(e) => handleFileChange(image.id, e.target.files[0])}
                                            accept="image/*"
                                            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-500 file:text-white hover:file:bg-indigo-600"
                                            required={index === 0} // Birinchi rasm majburiy bo'lsin
                                        />
                                        {image.file && <p className="text-xs text-green-400 mt-1 truncate">Tanlangan fayl: {image.file.name}</p>}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button 
                            type="button" 
                            onClick={handleAddImage}
                            className="w-full border border-dashed border-gray-600 hover:border-indigo-500 text-gray-400 hover:text-indigo-400 p-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                        >
                            <i className="fa-solid fa-image"></i>
                            <span>Qo'shimcha rasm qo'shish</span>
                        </button>
                    </div>


                    {/* 4. Forma Footer va Yuborish Tugmasi */}
                    <div className="pt-4 border-t border-gray-700 flex justify-end">
                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-lg shadow-indigo-600/30 disabled:opacity-50 flex items-center space-x-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <i className="fa-solid fa-spinner fa-spin"></i>
                                    <span>Yaratilmoqda...</span>
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-paper-plane"></i>
                                    <span>Loyihani saqlash</span>
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default CreateProjectModal;