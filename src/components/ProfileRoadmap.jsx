// ProfileRoadmap.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Utility funksiyalarni import qilish. 
// Ular event.color o'rniga event.type/color stringni qabul qiladi deb faraz qilamiz.
import { getRoadmapColorClass, getRoadmapInnerColorClass } from '../utils/colorUtils'; 
import { formatPrettyDate } from '../utils/formatDate'; // Sanani formatlash uchun kerak bo'lishi mumkin
import { getRoadMapFailure, getRoadMapStart, getRoadMapSuccess } from '../features/roadmap';
import RoadmapService from '../services/roadmap';

// Agar sizda alohida roadmap slice bo'lsa, uni ishlatamiz.
// Agar project slice ichida bo'lsa, shunga moslashtiring.
const selectRoadmapState = (state) => state.roadmap; // state.roadmap deb faraz qilindi.


const ProfileRoadmap = ({username}) => {
   const dispatch = useDispatch()

    const { roadmaps, roadmap_isLoading, roadmap_error } = useSelector(selectRoadmapState);


    // =============================================================
    // YO'L XARITASINI TURIGA QARAB USLUBNI ANIQLASH (ICON va COLOR)
    // =============================================================
    const getRoadmapStyle = (type) => {
        // Ma'lumot turiga qarab Font Awesome ikonkalari va Tailwind rang nomlarini moslash
        switch (type) {
            case 'learning':
                return { icon: 'fa-solid fa-graduation-cap', colorName: 'indigo' };
            case 'project':
                return { icon: 'fa-solid fa-laptop-code', colorName: 'teal' };
            case 'certification':
                return { icon: 'fa-solid fa-certificate', colorName: 'yellow' };
            case 'work':
                return { icon: 'fa-solid fa-briefcase', colorName: 'blue' };
            default:
                return { icon: 'fa-solid fa-circle-info', colorName: 'gray' };
        }
    };

    // Tailwind dinamik klasslar muammosini hal qilish uchun 
    // Faqat shu yerda ishlatiladigan rang klasslari ro'yxati
    const colorClassMap = {
        'indigo': 'text-indigo-400',
        'teal': 'text-teal-400',
        'yellow': 'text-yellow-400',
        'blue': 'text-blue-400',
        'gray': 'text-gray-400',
    };

    const getRoadmap= async () => { 
        dispatch(getRoadMapStart());
        try {
            const response = await RoadmapService.getRoadmap(username); 
            // API javobida kelgan ma'lumotlarni to'g'ridan-to'g'ri slicega jo'natish
            dispatch(getRoadMapSuccess(response)); 
        } catch (err) {
            console.error("Roadmap olishda xato:", err);
            dispatch(getRoadMapFailure(err.message));
        }
    };

    useEffect(() => {
        getRoadmap() 
    }, []); 

    // =============================================================
    // YO'L XARITASI MAVJUD BO'LMAGAN HOLAT UCHUN KOMPONENT
    // =============================================================
    const NoRoadmap = ({ message }) => (
        <div className="text-center p-8 bg-gray-800/50 rounded-lg border border-dashed border-gray-700">
            <i className="fa-solid fa-map-location-dot text-5xl text-gray-500 mb-4"></i>
            <h4 className="text-xl font-semibold text-white mb-2">Yo'l xaritasi tuzilmagan</h4>
            <p className="text-gray-400">{message}</p>
        </div>
    );

    // =============================================================
    // YUKLANISH (LOADING) HOLATI
    // =============================================================
    if (roadmap_isLoading) {
        // Sklet (Skeleton) UI
        return (
            <div id="roadmap">
                <div className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-lg">
                    <div className="relative">
                        <div className="absolute left-4 top-4 h-full w-0.5 bg-gray-700"></div>
                        {[1, 2, 3].map(i => (
                            <div key={i} className="relative mb-8 pl-12 fade-in animate-pulse">
                                <div className="absolute left-0 top-1.5 flex items-center justify-center w-8 h-8 bg-gray-700 rounded-full"></div>
                                <div className="ml-4">
                                    <div className="h-3 bg-gray-700 rounded w-1/4 mb-2"></div>
                                    <div className="h-4 bg-gray-700 rounded w-1/2 mb-3"></div>
                                </div>
                                <div className="mt-2 h-4 bg-gray-700 rounded w-full"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // =============================================================
    // XATO HOLATI
    // =============================================================
    if (roadmap_error) {
        return (
            <NoRoadmap 
                message={`Yo'l xaritasini yuklashda xato yuz berdi: ${roadmap_error}`}
            />
        );
    }
    
    // =============================================================
    // BO'SH HOLATI
    // =============================================================
    if (!roadmaps || roadmaps.length === 0) {
        return (
            <NoRoadmap 
                message="Foydalanuvchi o'zining rivojlanish bosqichlarini hali kiritmagan."
            />
        );
    }

    // =============================================================
    // MA'LUMOTLAR MAVJUD BO'LGAN HOLAT
    // =============================================================
    return (
        <div id="roadmap">
            <div className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-lg">
                <div className="relative">
                    {/* Vertikal liniya */}
                    <div className="absolute left-4 top-4 h-full w-0.5 bg-gray-700"></div>

                    {roadmaps.map((event, index) => {
                        // event.type asosida rang va ikonkaga moslash
                        const { icon: eventIcon, colorName } = getRoadmapStyle(event.type);
                        const iconColorClass = colorClassMap[colorName] || 'text-gray-400';
                        
                        // Vaqtni ko'rsatish mantig'i: agar tugagan sana bo'lsa, diapazonni ko'rsatish, aks holda boshlanish sanasini
                        const dateDisplay = event.finished_at 
                            ? `${formatPrettyDate(event.started_at)} - ${formatPrettyDate(event.finished_at)}`
                            : formatPrettyDate(event.started_at);

                        return (
                            <div 
                                key={event.id} 
                                className="relative mb-8 pl-12 fade-in group" 
                                style={{ animationDelay: `${100 * (index + 1)}ms` }}
                            >
                                {/* Marker va ichki doira */}
                                <div className={`absolute left-0 top-1.5 flex items-center justify-center w-8 h-8 ${getRoadmapColorClass(colorName)} rounded-full ring-2 ring-gray-800 transition-all group-hover:ring-indigo-500`}>
                                    <div className={`w-4 h-4 ${getRoadmapInnerColorClass(colorName)} rounded-full border-2 border-gray-800`}></div>
                                </div>
                                
                                <div className="flex items-start gap-4"> {/* items-start - tepadan boshlash uchun */}
                                    {/* Ikonka */}
                                    <i className={`${eventIcon} text-3xl ${iconColorClass} pt-1`}></i> 
                                    <div>
                                        {/* Vaqtni ko'rsatish */}
                                        <p className="text-sm text-gray-400">{event.time || dateDisplay}</p> 
                                        {/* Sarlavha */}
                                        <h4 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{event.title}</h4>
                                    </div>
                                </div>
                                {/* Tavsif */}
                                <p className="mt-2 text-gray-300">{event.description}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default ProfileRoadmap;