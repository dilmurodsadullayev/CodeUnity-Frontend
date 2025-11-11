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

    // Tahrirlash uchun form state'i (matnli maydonlar)
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

    // Profil rasmi fayli va uning oldindan ko'rish (preview) holati
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState(null);

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
            
            // Mavjud profil rasmini preview sifatida o'rnatish
            setProfileImagePreview(profileData.image || null);

            // Fayl obyektini tozalash
            setProfileImageFile(null);
        }
    }, [profileData]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError(null);
        setSuccess(false);
    };

    // Rasm yuklashni boshqarish funksiyasi
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImageFile(file); // Fayl obyektini state ga saqlash
            setProfileImagePreview(URL.createObjectURL(file)); // Oldindan ko'rish uchun URL yaratish
            setError(null);
            setSuccess(false);
        }
    };
    
    // Rasm o'chirish funksiyasi
    const handleImageRemove = () => {
        // Backendga rasmni o'chirish uchun maxsus signal (masalan, "null" deb nomlangan dummy File)
        setProfileImageFile(new File([], 'null', { type: 'application/json' })); 
        setProfileImagePreview(null);
        setSuccess(false);
        setError(null);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        const isFileUpdate = profileImageFile !== null;
        let dataToSend;
        
        if (isFileUpdate) {
            // Fayl tanlangan, FormData ishlatamiz
            dataToSend = new FormData();
            
            // Barcha matnli maydonlarni FormData'ga append qilamiz
            Object.keys(formData).forEach(key => {
                if (key !== 'skills') { // Skills ni alohida append qilamiz
                    dataToSend.append(key, formData[key]);
                }
            });

            // Skills (massiv sifatida, agar API shunday qabul qilsa)
            // Vergul bilan ajratilgan satrni array elementlari sifatida yuborish
            formData.skills.split(',').map(s => s.trim()).filter(s => s).forEach(skill => {
                 dataToSend.append('skills', skill); 
            });


            // Profil rasmi faylini qo'shamiz
            if (profileImageFile) {
                // Agar dummy 'null' fayl bo'lsa (o'chirish)
                if (profileImageFile.name === 'null') {
                    dataToSend.append('image', ''); // Rasmni o'chirish signalini yuborish (API ga bog'liq)
                } else {
                    dataToSend.append('image', profileImageFile);
                }
            }

        } else {
            // Faqat matnli ma'lumotlar, JSON yuboramiz
            dataToSend = {
                ...formData,
                // 'skills' satrini massivga aylantirish
                skills: formData.skills.split(',').map(s => s.trim()).filter(s => s), 
            };
        }
        
        try {
            // API chaqiruvi (PATCH/PUT)
            // ProfileService ni FormData ni ham, JSON ni ham ishlata oladi deb faraz qilamiz
            const response = await ProfileService.updateProfile(profileData.username, dataToSend); 
            
            // Redux state'ni yangilash
            dispatch(getProfileSuccess(response)); 

            setLoading(false);
            setSuccess(true);
            
            // 1 sekunddan keyin modalni yopish
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
                        type="button" 
                    >
                        <i className="fa-solid fa-times text-2xl"></i>
                    </button>
                </div>
                
                <form onSubmit={handleSave} className="p-6 space-y-5">
                    
                    {/* Rasm yuklash guruhi */}
                    <div className="border-b border-gray-700 pb-4 space-y-4">
                        <h3 className="text-lg font-semibold text-indigo-400 col-span-full">
                            <i className="fa-solid fa-camera-retro mr-2"></i>Profil Rasmi
                        </h3>
                        
                        <div className="flex flex-col items-center p-3 border border-gray-700 rounded-lg bg-gray-700/30 w-fit mx-auto">
                            <label className="text-sm font-medium text-gray-300 mb-2">Profil Rasmini yuklash</label>
                            <div className="w-24 h-24 rounded-full overflow-hidden mb-2 border-2 border-indigo-500 bg-gray-700 flex items-center justify-center">
                                {profileImagePreview ? (
                                    <img 
                                        src={profileImagePreview} 
                                        alt="Profil Rasmi" 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <i className="fa-solid fa-user text-3xl text-gray-500"></i>
                                )}
                            </div>
                            <input
                                type="file"
                                id="profileImage"
                                hidden
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            <div className="flex space-x-2 mt-2">
                                <label 
                                    htmlFor="profileImage"
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs py-1.5 px-3 rounded-lg cursor-pointer transition-colors"
                                >
                                    <i className="fa-solid fa-upload mr-1"></i> Yuklash
                                </label>
                                {(profileImagePreview || profileImageFile) && (
                                    <button 
                                        type="button"
                                        onClick={handleImageRemove}
                                        className="bg-red-600 hover:bg-red-700 text-white text-xs py-1.5 px-3 rounded-lg transition-colors"
                                        title="Rasmni o'chirish"
                                    >
                                        <i className="fa-solid fa-trash-alt"></i> O'chirish
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    
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
                            <li>**cover\_image** (Fon rasmi bu shaklda tahrirlanmaydi)</li>
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