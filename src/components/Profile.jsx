import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfileFailure, getProfileStart, getProfileSuccess } from '../features/profile';
import ProfileService from '../services/profile';
import UserImage from '../assests/userImage.jpeg'
import { formatPrettyDate } from '../utils/formatDate';
import { getTechColorClass } from '../utils/colorUtils'; // Utility funksiyani import qilish

// Yangi yaratilgan modal komponentlarni import qilish
import EditProfileModal from './EditProfileModal'; 
import CoverImageEditModal from './CoverImageEditModal'; // Fon rasmi modal
// import ProfileImageEditModal from './ProfileImageEditModal'; // Agar kerak bo'lsa, bu modalni ham yarating va import qiling

import ProfileProjects from './ProfileProjects';
import ProfilePosts from './ProfilePosts';
import ProfileRoadmap from './ProfileRoadmap';
import { useParams } from 'react-router-dom';


const Profile = () => {
    const dispatch = useDispatch();
    const { 
        profile, 
        isLoading, 
        error,
    } = useSelector((state) => state.profile);
    const {username} = useParams()

    // Modalni boshqarish uchun state'lar
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCoverModalOpen, setIsCoverModalOpen] = useState(false); 
    const [isProfileImageModalOpen, setIsProfileImageModalOpen] = useState(false); // Profil rasmi uchun modal state

    const { isLoggedIn, user } = useSelector((state) => state.auth);
        
    
        
        // Foydalanuvchi ushbu profilning egasimi, tekshirish
    const isOwner = user && user.username === username;

    // ... (getProfile va fullName funksiyalari o'zgarishsiz)

    console.log("Profile ", profile)

 
    const getProfile = async () => { 
        dispatch(getProfileStart());
        try {
            const response = await ProfileService.getProfile(username); 
            dispatch(getProfileSuccess(response)); 
        } catch (err) {
            console.error("Profile olishda xato:", err);
            dispatch(getProfileFailure(err.message));
        }
    };

   

    const fullName = (first_name, last_name)=>{
        if (first_name || last_name){
            return `${first_name} ${last_name}`
        }else{
            return "No Name"
        }
    }
   

    useEffect(() => {
        getProfile(); 
    }, []); 

    
    // currentUser obyektini Redux'dan kelgan ma'lumotlarga moslab yaratish
    const currentUser = {
        profileImage: profile?.image ? profile?.image : UserImage,
        coverImage: profile?.cover_image ?? "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop",
        fullName: fullName(profile?.first_name, profile?.last_name),
        username: profile?.username,
        position: profile?.position, 
        skill_level: profile?.skill_level,
        company: profile?.company, 
        rating: profile?.total_rating ?? "0", 
        codeCoin: profile?.coins,
        problemCount: profile?.problems_count ?? "0",
        projectsCount: profile?.projects_count ?? "0",
        location: profile?.address ?? "Hali mavjud emas",
        website: profile?.website_url,
        github: profile?.github_url,
        memberSince: formatPrettyDate(profile?.date_joined),
        aboutMe: profile?.about_me,
        skills: profile?.skills ?? ["Hali Mavjud emas"],
        badges: [
          { emoji: "🏆", title: "Top 10 Dasturchi", text: "Top 10" },
          { emoji: "🧪", title: "Beta Tester", text: "Beta Tester" },
          { emoji: "📅", title: "1 Yillik A'zo", text: "Veteran" },
          { emoji: "🐍", title: "Python Ustasi", text: "Pythonista" },
        ],
    };
    
    
    // Skill Level uchun rang beruvchi funksiya (o'zgarishsiz)
    const getSkillLevelBadge = (level) => {
        const defaultLevel = { 
            display: "Daraja aniqlanmagan", 
            classes: "bg-gray-600/30 text-gray-400 border border-gray-500/50", 
            icon: "fa-solid fa-layer-group" 
        };

        if (!level) return null; // Daraja bo'lmasa ko'rsatmaslik

        const lowerLevel = level.toLowerCase();
        let classes = "flex items-center text-sm font-medium px-3 py-1 rounded-full border whitespace-nowrap";
        let icon = "fa-solid fa-graduation-cap"; 
        let displayLevel = level.charAt(0).toUpperCase() + level.slice(1); 

        if (lowerLevel.includes('beginner')) {
            classes += " bg-blue-600/30 text-blue-300 border-blue-500/50";
            icon = "fa-solid fa-graduation-cap"; 
        } else if (lowerLevel.includes('junior')) {
            classes += " bg-green-600/30 text-green-300 border-green-500/50";
            icon = "fa-solid fa-seedling";
        } else if (lowerLevel.includes('mid') || lowerLevel.includes('intermediate')) {
            classes += " bg-yellow-600/30 text-yellow-300 border-yellow-500/50";
            icon = "fa-solid fa-code";
        } else if (lowerLevel.includes('senior')) {
            classes += " bg-red-600/30 text-red-300 border-red-500/50";
            icon = "fa-solid fa-dragon";
        } else if (lowerLevel.includes('lead') || lowerLevel.includes('tech lead')) {
            classes += " bg-indigo-600/30 text-indigo-300 border-indigo-500/50";
            icon = "fa-solid fa-crown";
        } else if (lowerLevel.includes('expert') || lowerLevel.includes('advanced')) {
            classes += " bg-purple-600/30 text-purple-300 border-purple-500/50";
            icon = "fa-solid fa-bolt";
        }

        return (
            <span className={classes}>
                <i className={`${icon} mr-2`}></i>
                {displayLevel} darajasi
            </span>
        );
    };

    // URL funksiyalari (o'zgarishsiz)
    const formatUrl = (url) => {
        if (!url) return null;
        let formattedUrl = url.startsWith('http') ? url : `https://${url}`;
        return formattedUrl;
    };

    const formatGithubUrl = (github) => {
        if (!github) return null;
        if (github.includes('/')) return github;
        return `https://github.com/${github}`;
    };


    const [activeTab, setActiveTab] = useState('projects'); 

    return (
        <main className="container mx-auto p-4 fade-in">
            
            <div className="bg-gray-800 rounded-lg shadow-2xl overflow-hidden border border-gray-700/50">
                
                {/* COVER IMAGE QISMI (YANGILANGAN) */}
                <div 
                    className="h-48 md:h-64 relative" 
                    // Rasmni CSS orqali fon rasmi sifatida joylashtirish
                    style={{ 
                        backgroundImage: `url('${currentUser.coverImage}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    {/* Qo'shimcha estetik overlay/effekt (ixtiyoriy) */}
                    <div className="absolute inset-0 bg-black opacity-10"></div> 
                    
                </div>
                
                {/* Asosiy profil ma'lumotlari qismi */}
                {/* ... (Qolgan qismi o'zgarishsiz) ... */}
                <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-12">
                    
                    {/* Profil Rasmi (Tahrirlash iconi bilan) */}
                    <div 
                        className="relative h-32 w-32 rounded-full border-4 border-gray-800 z-10 group cursor-pointer"
                        onClick={() => setIsProfileImageModalOpen(true)} // Profil rasmi modalini ochish
                    >
                        <img 
                            src={currentUser.profileImage} 
                            alt="Profil rasmi" 
                            className="h-full w-full rounded-full object-cover"
                        />
                        {/* Tahrirlash overlayi - Profile rasm ustida */}
                        <div className="absolute inset-0 rounded-full bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <i className="fa-solid fa-camera text-white text-xl"></i>
                        </div>
                    </div>
                    
                    {/* Ism, Lavozim, Kompaniya, Daraja bloki */}
                    <div className="sm:ml-6 mt-4 sm:mt-0 text-center sm:text-left flex-grow">
                        
                        {/* 1. To'liq Ism va Daraja (Rasmga ko'ra yonma-yon) */}
                        <div className="flex flex-wrap items-center sm:justify-start gap-3">
                            <h1 className="text-2xl md:text-3xl font-bold text-white whitespace-nowrap">{currentUser.fullName}</h1>
                            {/* Skill Level Badge qismi - Ismning yonida turadi */}
                            {currentUser.skill_level && getSkillLevelBadge(currentUser.skill_level)}
                        </div>

                        {/* 2. Lavozim va Kompaniya (Ikkinchi qator) */}
                        {(currentUser.position || currentUser.company) ? (
                            <p className="text-gray-400 flex items-center text-base font-medium mt-1">
                                <i className="fa-solid fa-briefcase mr-2 text-indigo-400"></i>
                                {currentUser.position || "Lavozim aniqlanmagan"}
                                {currentUser.company && (
                                    <span className="text-gray-500 ml-1">@ {currentUser.company}</span>
                                )}
                            </p>
                        ) : (
                            <p className="text-gray-500 text-sm mt-1">Kasbiy ma'lumotlar mavjud emas.</p>
                        )}
                        
                    </div>
                    
                    {/* Tugmalar qismi */}
                    <div className="flex space-x-2 mt-4 sm:mt-0 sm:ml-auto">
                        <button className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-5 rounded-lg transition-all">
                            Mentorlik so'rash
                        </button>
                       {isOwner && (
                        <div className="flex gap-2">
                            {/* FON RASMINI TAHRIRLASH TUGMASI */}
                            <button 
                            onClick={() => setIsCoverModalOpen(true)}
                            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-5 rounded-lg transition-all flex items-center space-x-2"
                            >
                            <i className="fa-solid fa-image"></i>
                            <span className="hidden sm:inline">Fon rasmi</span>
                            </button>

                            {/* TAHRIRLASH TUGMASI */}
                            <button 
                            onClick={() => setIsEditModalOpen(true)}
                            className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-5 rounded-lg transition-all flex items-center space-x-2"
                            >
                            <i className="fa-solid fa-edit"></i>
                            <span>Tahrirlash</span>
                            </button>
                        </div>
                        )}

                    </div>
                </div>
                
                {/* Reyting va stats bloki (o'zgarishsiz) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-700/50">
                    <div className="bg-gray-800/80 text-center p-4">
                        <p className="text-sm text-gray-400">Reyting</p>
                        <p className="text-3xl font-black stat-gradient-text">{currentUser.rating}</p>
                    </div>
                    <div className="bg-gray-800/80 text-center p-4">
                        <p className="text-sm text-gray-400">CodeCoin</p>
                        <p className="text-3xl font-black stat-gradient-text">{currentUser.codeCoin}</p>
                    </div>
                    <div className="bg-gray-800/80 text-center p-4">
                        <p className="text-sm text-gray-400">Muammolar</p>
                        <p className="text-3xl font-black stat-gradient-text">{currentUser.problemCount}</p>
                    </div>
                    <div className="bg-gray-800/80 text-center p-4">
                        <p className="text-sm text-gray-400">Loyihalar</p>
                        <p className="text-3xl font-black stat-gradient-text">{currentUser.projectsCount}</p>
                    </div>
                </div>
            </div>

            {/* Asosiy kontent va sidebar (o'zgarishsiz) */}
            <div className="flex flex-col lg:flex-row gap-6 mt-6">
                
                <aside className="lg:w-1/3 flex flex-col gap-6">
                    {/* Ma'lumot qismi (o'zgarishsiz) */}
                    <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold text-white mb-4">Ma'lumot</h3>
                        <ul className="space-y-3 text-gray-300">
                            <li className="flex items-center"><i className="fa-solid fa-location-dot w-6 text-gray-400"></i> {currentUser.location}</li>
                            <li className="flex items-center">
                            <i className="fa-solid fa-link w-6 text-gray-400"></i>{" "}
                            {currentUser?.website ? (
                                <a
                                href={formatUrl(currentUser.website)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-400 hover:underline break-all" 
                                >
                                {currentUser.website}
                                </a>
                            ) : (
                                "Hali mavjud emas"
                            )}
                            </li>
                            <li className="flex items-center">
                            <i className="fa-brands fa-github w-6 text-gray-400"></i>{" "}
                            {currentUser?.github ? (
                                <a
                                href={formatGithubUrl(currentUser.github)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-400 hover:underline break-all"
                                >
                                {currentUser.github}
                                </a>
                            ) : (
                                "Hali mavjud emas"
                            )}
                            </li>
                            <li className="flex items-center"><i className="fa-solid fa-calendar-alt w-6 text-gray-400"></i> {currentUser.memberSince}</li>
                        </ul>

                        <div className="mt-6 pt-6 border-t border-gray-700">
                            <div className="bg-gray-900/60 rounded-xl p-5 border border-gray-700 shadow-inner shadow-black/20 ring-1 ring-white/10 relative overflow-hidden">
                                <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-600/30 rounded-full blur-3xl"></div>
                                
                                <h3 className="flex items-center text-xl font-bold text-white mb-3 relative z-10">
                                    <i className="fa-solid fa-terminal mr-3 text-indigo-400"></i>
                                    Men haqimda
                                </h3>
                                <p className="text-gray-300 leading-relaxed relative z-10">
                                    {currentUser?.aboutMe?.trim() ? currentUser.aboutMe : "Hali mavjud emas"}

                                </p>
                            </div>
                        </div>
                    </div>
                                
                    {/* Ko'nikmalar qismi (o'zgarishsiz) */}
                    <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold text-white mb-4">Ko'nikmalar</h3>
                        <div className="flex flex-wrap gap-2">
                            {currentUser.skills.map((skill, index) => (
                                <span key={index} className={`${getTechColorClass(skill.toLowerCase().split(' ')[0])} text-sm font-semibold px-3 py-1 rounded-full`}>{skill}</span>
                            ))}
                        </div>
                    </div>

                    {/* Nishonlar qismi (o'zgarishsiz) */}
                    <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold text-white mb-4">Nishonlar</h3>
                        <div className="grid grid-cols-4 gap-4 text-center">
                            {currentUser.badges.map((badge, index) => (
                                <div key={index}>
                                    <span className="text-4xl" title={badge.title}>{badge.emoji}</span>
                                    <p className="text-xs mt-1 text-gray-400">{badge.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
                
                {/* Tablar qismi (o'zgarishsiz) */}
                <div className="lg:w-2/3">
                    <div className="flex space-x-2 border-b border-gray-700 mb-4">
                        <button
                            onClick={() => setActiveTab('projects')}
                            className={`tab-btn font-semibold px-6 py-3 border-b-2 border-transparent text-gray-400 hover:text-white transition-all ${activeTab === 'projects' ? 'border-indigo-500 text-white' : ''}`}
                        >
                            Loyihalar
                        </button>
                        <button
                            onClick={() => setActiveTab('posts')}
                            className={`tab-btn font-semibold px-6 py-3 border-b-2 border-transparent text-gray-400 hover:text-white transition-all ${activeTab === 'posts' ? 'border-indigo-500 text-white' : ''}`}
                        >
                            Postlar / Javoblar
                        </button>
                        <button
                            onClick={() => setActiveTab('roadmap')}
                            className={`tab-btn font-semibold px-6 py-3 border-b-2 border-transparent text-gray-400 hover:text-white transition-all ${activeTab === 'roadmap' ? 'border-indigo-500 text-white' : ''}`}
                        >
                            Yo'l Xaritasi
                        </button>
                    </div>
                    
                    <div id="tab-content" className="space-y-4">
                        {activeTab === 'projects' && <ProfileProjects username={username}/>}
                        {activeTab === 'posts' && <ProfilePosts username={username}/>}
                        {activeTab === 'roadmap' && <ProfileRoadmap username={username} />}
                    </div>
                </div>
            </div>
            
            {/* MODALLAR */}
            <EditProfileModal
                profileData={profile} 
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    getProfile(); 
                }}
            />
            
            <CoverImageEditModal
                isOpen={isCoverModalOpen}
                onClose={() => {
                    setIsCoverModalOpen(false);
                    getProfile(); 
                }}
                currentCoverImage={currentUser.coverImage}
            />
            
            {/* PROFILE IMAGE TAHRIRLASH MODALI (Agar ProfileImageEditModal.jsx yaratilgan bo'lsa) */}
            {/* <ProfileImageEditModal
                isOpen={isProfileImageModalOpen}
                onClose={() => {
                    setIsProfileImageModalOpen(false);
                    getProfile(); 
                }}
                currentProfileImage={currentUser.profileImage}
            /> */}

        </main>
    )
}

export default Profile;