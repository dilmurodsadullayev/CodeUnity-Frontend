// EditProfileModal.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ProfileService from '../services/profile'; // ProfileService ni import qilish
import { getProfileSuccess } from '../features/profile'; // Ma'lumot yangilangandan so'ng Redux state'ni yangilash uchun

// Skill Level opsiyalari (serverdagi ma'lumotlarga mos)
const SKILL_LEVELS = [
    { value: 'beginner', label: 'Boshlang\'ich' },
    { value: 'junior', label: 'Junior (Kichik mutaxassis)' },
    { value: 'intermediate', label: 'O\'rta (Intermediate)' },
    { value: 'advanced', label: 'Kengaytirilgan (Advanced)' },
    { value: 'senior', label: 'Senior (Katta mutaxassis)' },
    { value: 'lead', label: 'Lead / Tech Lead (Yetakchi)' },
    { value: 'expert', label: 'Expert / Architect (Ekspert)' },
];

const EditProfileModal = ({ profileData, isOpen, onClose }) => {
    const dispatch = useDispatch();

    // Tahrirlash uchun form state'i
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        address: '',
        about_me: '',
        skill_level: '',
        skills: '', // Satr sifatida qabul qilinadi
        company: '',
        position: '',
        website_url: '',
        github_url: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Profile ma'lumotlari kelganida formani yangilash
    useEffect(() => {
        if (profileData) {
            setFormData({
                // Null/Undefined qiymatlarni bo'sh satrga aylantirish uchun ?? '' operatori
                first_name: profileData.first_name ?? '',
                last_name: profileData.last_name ?? '',
                address: profileData.address ?? '',
                about_me: profileData.about_me ?? '',
                // Agar skill_level bo'lmasa, 'beginner'ni default qilib belgilash
                skill_level: profileData.skill_level ?? 'beginner', 
                // Arrayni vergul bilan ajratilgan satrga aylantirish
                skills: Array.isArray(profileData.skills) ? profileData.skills.join(', ') : profileData.skills ?? '', 
                company: profileData.company ?? '',
                position: profileData.position ?? '',
                website_url: profileData.website_url ?? '',
                github_url: profileData.github_url ?? '',
            });
        }
    }, [profileData]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError(null);
        setSuccess(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        // API ga jo'natish uchun ma'lumotlarni tayyorlash
        const dataToSend = {
            ...formData,
            // 'skills' satrini massivga aylantirish va bo'sh elementlarni olib tashlash
            skills: formData.skills.split(',').map(s => s.trim()).filter(s => s), 
        };
        
        try {
            // API chaqiruvi (PATCH/PUT)
            const response = await ProfileService.updateProfile(dataToSend); 
            
            // Redux state'ni yangilash
            dispatch(getProfileSuccess(response)); 

            setLoading(false);
            setSuccess(true);
            
            // 1 sekunddan keyin modalni yopish (onClose orqali Profile.jsx dagi getProfile chaqiriladi)
            setTimeout(onClose, 1000); 

        } catch (err) {
            console.error("Profilni tahrirlashda xato:", err);
            // Error obyekti ichidan xato xabarini olish
            const errorMessage = err.message || "Ma'lumotlarni saqlashda xato yuz berdi.";
            setError(errorMessage);
            setLoading(false);
        }
    };
    
    // Modalning fonini yopish funksiyasi
    const handleBackgroundClick = (e) => {
        if (e.target.id === 'modal-backdrop') {
            onClose();
        }
    };


    return (
        <div 
            id="modal-backdrop"
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={handleBackgroundClick}
        >
            <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all">
                <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">Profilni tahrirlash</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700"
                        type="button" // Modal ichidagi buttonlar default submit bo'lmasligi uchun
                    >
                        <i className="fa-solid fa-times text-2xl"></i>
                    </button>
                </div>
                
                <form onSubmit={handleSave} className="p-6 space-y-5">
                    
                    {/* Shaxsiy ma'lumotlar guruhi */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-700 pb-4">
                        <h3 className="text-lg font-semibold text-indigo-400 col-span-full">
                            <i className="fa-solid fa-user-edit mr-2"></i>Shaxsiy Ma'lumotlar
                        </h3>
                        <input
                            type="text"
                            name="first_name"
                            placeholder="Ism"
                            value={formData.first_name}
                            onChange={handleChange}
                            className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                        <input
                            type="text"
                            name="last_name"
                            placeholder="Familiya"
                            value={formData.last_name}
                            onChange={handleChange}
                            className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                        <input
                            type="text"
                            name="address"
                            placeholder="Manzil (Masalan: Tashkent, Uzbekistan)"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 col-span-full"
                        />
                        <textarea
                            name="about_me"
                            placeholder="Men haqimda..."
                            value={formData.about_me}
                            onChange={handleChange}
                            rows="4"
                            className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 col-span-full"
                        ></textarea>
                    </div>

                    {/* Kasbiy ma'lumotlar guruhi */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-700 pb-4">
                        <h3 className="text-lg font-semibold text-indigo-400 col-span-full">
                            <i className="fa-solid fa-laptop-code mr-2"></i>Kasbiy Ma'lumotlar
                        </h3>
                        {/* Skill Level Select */}
                        <div className="relative">
                            <select
                                name="skill_level"
                                value={formData.skill_level}
                                onChange={handleChange}
                                className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none pr-8" // pr-8 o'qni joyi
                            >
                                {SKILL_LEVELS.map(level => (
                                    <option key={level.value} value={level.value}>{level.label}</option>
                                ))}
                            </select>
                            <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                        </div>
                         <input
                            type="text"
                            name="company"
                            placeholder="Kompaniya (ixtiyoriy)"
                            value={formData.company}
                            onChange={handleChange}
                            className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                         <input
                            type="text"
                            name="position"
                            placeholder="Lavozim (ixtiyoriy)"
                            value={formData.position}
                            onChange={handleChange}
                            className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                        <div className="col-span-full">
                             <input
                                type="text"
                                name="skills"
                                placeholder="Ko'nikmalar (Vergul bilan ajratilgan, Masalan: Python, Django, React, CSS)"
                                value={formData.skills}
                                onChange={handleChange}
                                className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                            <p className="text-xs text-gray-500 mt-1 flex items-center">
                                <i className="fa-solid fa-info-circle mr-1"></i>Ko'nikmalarni vergul (,) bilan ajratib yozing.
                            </p>
                        </div>
                    </div>

                    {/* Ijtimoiy tarmoqlar guruhi */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-700 pb-4">
                        <h3 className="text-lg font-semibold text-indigo-400 col-span-full">
                            <i className="fa-solid fa-share-alt mr-2"></i>Ijtimoiy tarmoqlar
                        </h3>
                        <div className="relative">
                            <i className="fa-solid fa-link absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            <input
                                type="text"
                                name="website_url"
                                placeholder="Shaxsiy veb-sayt (URL)"
                                value={formData.website_url}
                                onChange={handleChange}
                                className="w-full bg-gray-700 text-white rounded-lg p-3 pl-10 border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="relative">
                            <i className="fa-brands fa-github absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            <input
                                type="text"
                                name="github_url"
                                placeholder="GitHub username"
                                value={formData.github_url}
                                onChange={handleChange}
                                className="w-full bg-gray-700 text-white rounded-lg p-3 pl-10 border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                    
                    {/* Tahrirlash mumkin bo'lmagan ma'lumotlar haqida eslatma */}
                    <div className="text-sm text-gray-500 pt-2 bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                        <p className="font-semibold mb-1 text-gray-300 flex items-center"><i className="fa-solid fa-lock mr-2 text-red-400"></i>Tahrirlab bo'lmaydigan ma'lumotlar</p>
                        <ul className="list-disc list-inside ml-2">
                            <li>**username, id, coins** (Tizim tomonidan boshqariladi)</li>
                            <li>**date\_joined** (Avtomatik sana)</li>
                            <li>**image, cover\_image** (Rasmlar alohida joyda tahrirlanadi)</li>
                        </ul>
                    </div>

                    {/* Holat va tugmalar */}
                    {error && <div className="bg-red-900/50 text-red-400 p-3 rounded-lg text-sm flex items-start"><i className="fa-solid fa-exclamation-triangle mr-2 mt-1"></i> <p>{error}</p></div>}
                    {success && <div className="bg-green-900/50 text-green-400 p-3 rounded-lg text-sm font-semibold flex items-center"><i className="fa-solid fa-check-circle mr-2"></i> Profil muvaffaqiyatli saqlandi!</div>}

                    <div className="flex justify-end space-x-3 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-5 rounded-lg transition-all"
                        >
                            Bekor qilish
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <i className="fa-solid fa-spinner fa-spin"></i>
                                    <span>Saqlanmoqda...</span>
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-save"></i>
                                    <span>Saqlash</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;