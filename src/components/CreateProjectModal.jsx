// ProjectFormModal.jsx
import React, { useEffect, useState } from 'react';

// =================================================================
// MOCK MA'LUMOTLAR (O'zgarishsiz)
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

// Default boshlang'ich ma'lumotlar
const initialFormState = {
    name: '',
    main_features: '',
    description: '',
    website_url: '',
    language: '', // ID
    technology: '', // ID
};

// Edit rejimida rasmlarni to'g'ri boshlash uchun funksiya
const formatImagesForEdit = (projectImages) => {
    if (!projectImages || projectImages.length === 0) {
        return [{ id: Date.now(), title: '', file: null, isNew: true, url: null }];
    }
    // Backenddan kelgan rasmlarni formatlaymiz (url bor, file yo'q)
    return projectImages.map(img => ({
        id: img.id, 
        title: img.title || '',
        file: null, 
        isNew: false, 
        url: img.image 
    }));
};


/**
 * Loyiha yaratish/tahrirlash uchun modal komponenti.
 * @param {boolean} isOpen - Modalning ochiqligi holati.
 * @param {function} onClose - Modalni yopish funksiyasi.
 * @param {function} onSubmit - Forma yuborilganda chaqiriladigan funksiya (Create yoki Update).
 * @param {object|null} initialData - Agar tahrirlash rejimi bo'lsa, mavjud loyiha ma'lumotlari.
 */
const ProjectFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
    
    // Loyihaning mavjudligi (tahrirlash yoki yaratish)
    const isEditMode = !!initialData;
    
    // State'ni initialData yoki default holat bilan boshlash
    const [formData, setFormData] = useState(initialFormState);
    const [images, setImages] = useState([]);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // initialData o'zgarganda yoki modal ochilganda state'ni sinxronlash
    useEffect(() => {
        if (isOpen) {
            if (isEditMode) {
                // Tahrirlash rejimi: Kelgan datani yuklash
                setFormData({
                    name: initialData.name || '',
                    main_features: initialData.main_features || '',
                    description: initialData.description || '',
                    website_url: initialData.website_url || '',
                    
                    // !!! XATONI BARTARAF ETISH: initialData.language va initialData.technology undefined bo'lishi mumkin
                    // Optional Chaining (?.) ishlatildi.
                    language: String(initialData.language?.id || '') || '', 
                    technology: String(initialData.technology?.id || '') || '',
                });
                setImages(formatImagesForEdit(initialData.images));
            } else {
                // Yaratish rejimi: State'ni tozalash
                setFormData(initialFormState);
                setImages([{ id: Date.now(), title: '', file: null, isNew: true, url: null }]);
            }
            setError(null);
        }
    }, [isOpen, initialData, isEditMode]); 

    if (!isOpen) return null;


    // Asosiy maydonlardagi o'zgarishlarni boshqarish (O'zgarishsiz)
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Dinamik rasm ma'lumotlaridagi o'zgarishlarni boshqarish (O'zgarishsiz)
    const handleImageChange = (id, field, value) => {
        setImages(images.map(image => 
            image.id === id ? { ...image, [field]: value } : image
        ));
    };

    // Yangi rasm maydonini qo'shish (O'zgarishsiz)
    const handleAddImage = () => {
        setImages(prev => [...prev, { id: Date.now(), title: '', file: null, isNew: true, url: null }]); 
    };

    // Rasm maydonini o'chirish (O'zgarishsiz)
    const handleRemoveImage = (id) => {
        setImages(prev => prev.filter(image => image.id !== id));
    };
    
    // Fayl tanlanganini boshqarish (O'zgarishsiz)
    const handleFileChange = (id, file) => {
         setImages(images.map(image => 
            image.id === id ? { ...image, file: file, url: URL.createObjectURL(file) } : image
        ));
    }


    // Forma yuborish funksiyasi (O'zgarishsiz)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        // 1. Ma'lumotlarni tekshirish
        if (!formData.name || !formData.language || !formData.technology || !formData.description) {
            setError("Loyiha nomi, Tili, Texnologiyasi va Tavsifi majburiy maydonlardir.");
            return;
        }

        const hasImageFileOrExistingUrl = images.some(img => img.file || img.url);
        if (!hasImageFileOrExistingUrl) {
             setError("Loyihaning asosiy rasmi majburiy.");
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

        // Rasmlarni qo'shish (CREATE va UPDATE uchun)
        images.forEach((img, index) => {
            
            // Faqat fayl mavjud bo'lsa (yangi rasm yoki o'zgartirilgan rasm)
            if (img.file) { 
                projectData.append(`images[${index}]image`, img.file, img.file.name);
                projectData.append(`images[${index}]title`, img.title || `Image ${index + 1}`); 
                
                // Agar u mavjud rasm bo'lib, o'zgartirilgan bo'lsa (Edit rejimida)
                if (isEditMode && !img.isNew) {
                     projectData.append(`images[${index}]id`, img.id); // Mavjud rasm ID'si
                }
            } 
            // Yoki fayl o'zgarmagan, lekin mavjud rasm bo'lsa (faqat sarlavhasi o'zgarishi mumkin)
            else if (isEditMode && img.url && !img.isNew) {
                projectData.append(`images[${index}]id`, img.id);
                projectData.append(`images[${index}]title`, img.title || `Image ${index + 1}`);
            }
        });

        try {
            await onSubmit(projectData, initialData?.id); // initialData.id ni tahrirlash uchun yuboramiz
            
            onClose(); 
            
        } catch (err) {
            // Xatolar kelganda ularni modalda ko'rsatish
            let errorMessage = err.message || "Loyihani saqlashda xato yuz berdi.";
            if (err.response && err.response.data) {
                if (err.response.data.name) errorMessage = `Nomi: ${err.response.data.name.join(', ')}`;
                else if (err.response.data.images) errorMessage = `Rasmlar: ${JSON.stringify(err.response.data.images)}`; // Rasmlar xatosini yaxshiroq ko'rsatish
                else if (err.response.data.detail) errorMessage = err.response.data.detail;
                else errorMessage = JSON.stringify(err.response.data);
            }
            setError(errorMessage);
            
        } finally {
            setIsSubmitting(false);
        }
    };

    // Modal sarlavhasini tanlash
    const title = isEditMode ? "Loyihani tahrirlash" : "Yangi loyiha yaratish";
    const submitText = isEditMode ? "O'zgarishlarni saqlash" : "Loyihani saqlash";

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-75 backdrop-blur-sm flex justify-center items-center">
            <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl m-4 md:m-8 max-h-[90vh] overflow-y-auto transform transition-all">
                
                {/* Modal sarlavhasi */}
                <div className="sticky top-0 bg-gray-800 p-6 border-b border-gray-700 flex justify-between items-center z-10">
                    <h3 className="text-2xl font-bold text-white">{title}</h3>
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

                    {/* 1. Asosiy Loyiha Ma'lumotlari - (O'zgarishsiz) */}
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

                    {/* 2. Til va Texnologiya tanlash - (O'zgarishsiz) */}
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


                    {/* 3. Loyiha Rasmlari (Dinamik qism - Edit uchun kengaytirildi) */}
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
                                            required={index === 0 && !image.url} 
                                        />
                                        
                                        {/* Tahrirlash rejimi uchun rasm ko'rinishi */}
                                        {(image.file || image.url) && (
                                            <div className="mt-2 flex items-center gap-2">
                                                <img 
                                                    src={image.file ? image.url : image.url} 
                                                    alt="Preview" 
                                                    className="w-10 h-10 object-cover rounded" 
                                                />
                                                <p className="text-xs text-green-400 mt-1 truncate">
                                                    Tanlangan fayl: {image.file ? image.file.name : "Mavjud rasm"}
                                                </p>
                                            </div>
                                        )}
                                        
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
                                    <span>Saqlanmoqda...</span>
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-paper-plane"></i>
                                    <span>{submitText}</span>
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ProjectFormModal;