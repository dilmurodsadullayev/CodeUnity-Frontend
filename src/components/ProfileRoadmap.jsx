import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    getRoadMapFailure, getRoadMapStart, getRoadMapSuccess,
    deleteRoadMapStart, deleteRoadMapSuccess, deleteRoadMapFailure,
    // LIKE/UNLIKE uchun yangi action'lar
    toggleLikeRoadmapStart, toggleLikeRoadmapSuccess, toggleLikeRoadmapFailure
} from '../features/roadmap';
import RoadmapService from '../services/roadmap';

// Yangi komponentlarni import qilish
import RoadmapItem from './RoadmapItem'; // Tahrirlash/o'chirish/like tugmalari bilan
import DeleteConfirmationModal from './DeleteConfirmationModal'; // O'chirishni tasdiqlash modal
import RoadmapFormModal from './RoadmapCreateModal';
// Nom to'g'irlandi: Create va Edit uchun umumiy modal


const selectRoadmapState = (state) => state.roadmap;
const selectAuthUsername = (state) => state.auth.user?.username; // Autentifikatsiya qilingan user

const ProfileRoadmap = ({username}) => {
    const dispatch = useDispatch();

    const { 
        roadmaps, 
        roadmap_isLoading, 
        roadmap_error,
        isDeleting,      // O'chirish holati
        deleteError,      // O'chirish xatosi
        isLiking,       // Yoqtirish holati
        likeError       // Yoqtirish xatosi
    } = useSelector(selectRoadmapState);
    
    // Form Modal (Yaratish/Tahrirlash) holatlari
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingRoadmap, setEditingRoadmap] = useState(null); // Null = Yaratish, Ob'ekt = Tahrirlash
    
    // Delete Modal (O'chirishni tasdiqlash) holatlari
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingRoadmap, setDeletingRoadmap] = useState(null); // O'chirilayotgan ob'ekt

    const currentAuthUsername = useSelector(selectAuthUsername);
    // Profil egasi ekanligini tekshirish
    const isOwner = currentAuthUsername === username; 

    // =============================================================
    // GET (READ) MANTIG'I
    // =============================================================
    const getRoadmap = async () => { 
        dispatch(getRoadMapStart());
        try {
            const response = await RoadmapService.getRoadmap(username); 
            dispatch(getRoadMapSuccess(response)); 
        } catch (err) {
            console.error("Roadmap olishda xato:", err);
            dispatch(getRoadMapFailure(err.response?.data?.detail || err.message));
        }
    };

    useEffect(() => {
        getRoadmap() 
    }, [username]); 

    // =============================================================
    // MODAL/FORM FUNKSIYALARI (CREATE/UPDATE)
    // =============================================================

    // Yaratish modalini ochish
    const handleCreateClick = () => {
        setEditingRoadmap(null); // Yaratish rejimiga o'tish
        setIsFormModalOpen(true);
    }
    
    // Tahrirlash modalini ochish
    const handleEditClick = (roadmap) => {
        setEditingRoadmap(roadmap); // Tahrirlash uchun ma'lumotni yuklash
        setIsFormModalOpen(true);
    }

    // Form Modalni yopish
    const handleCloseFormModal = () => {
        setIsFormModalOpen(false);
        setEditingRoadmap(null); // Modal yopilganda tahrirlash holatini tozalash
    }
    
    // =============================================================
    // DELETE MANTIG'I
    // =============================================================
    
    // O'chirish modalini ochish
    const handleDeleteClick = (roadmap) => {
        setDeletingRoadmap(roadmap);
        setIsDeleteModalOpen(true);
    }

    // O'chirish modalini yopish
    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeletingRoadmap(null);
    }

    // O'chirishni tasdiqlash va API chaqiruvi
    const handleConfirmDelete = async () => {
        if (!deletingRoadmap || isDeleting) return; // Qayta bosishni bloklash
        
        dispatch(deleteRoadMapStart());

        try {
            const deletedId = await RoadmapService.deleteRoadmap(username, deletingRoadmap.id);
            dispatch(deleteRoadMapSuccess(deletedId)); 
            handleCloseDeleteModal(); 

        } catch (err) {
            console.error("Roadmap o'chirishda xato:", err.response?.data || err.message);
            const errorMessage = err.response?.data?.detail || err.message || "O'chirishda kutilmagan xato yuz berdi.";
            dispatch(deleteRoadMapFailure(errorMessage));
            handleCloseDeleteModal(); 
            alert(`Xato: ${errorMessage}`);
        }
    }
    
    // =============================================================
    // LIKE/UNLIKE MANTIG'I
    // =============================================================
    const handleToggleLike = async (roadmapId) => {
        // Asosiy loadingni tekshirish
        if (isLiking || isDeleting || roadmap_isLoading) return; 
        
        if (!currentAuthUsername) {
            alert("Yoqtirish uchun avval tizimga kiring.");
            return;
        }

        dispatch(toggleLikeRoadmapStart());

        try {
            // API chaqiruvi: toggleLikeRoadmap faqat roadmapId ni qabul qiladi
            const updatedRoadmap = await RoadmapService.toggleLikeRoadmap(roadmapId);
            dispatch(toggleLikeRoadmapSuccess(updatedRoadmap)); 
        } catch (err) {
            console.error("Roadmap yoqtirishda xato:", err.response?.data || err.message);
            const errorMessage = err.response?.data?.detail || err.message || "Yoqtirishda kutilmagan xato yuz berdi.";
            dispatch(toggleLikeRoadmapFailure(errorMessage));
            alert(`Xato: ${errorMessage}`);
        }
    }


    // =============================================================
    // YO'L XARITASI MAVJUD BO'LMAGAN HOLAT UCHUN KOMPONENT
    // =============================================================
    const NoRoadmap = ({ message }) => (
        <div className="text-center p-8 bg-gray-800/50 rounded-lg border border-dashed border-gray-700">
            <i className="fa-solid fa-map-location-dot text-5xl text-gray-500 mb-4"></i>
            <h4 className="text-xl font-semibold text-white mb-2">Yo'l xaritasi tuzilmagan</h4>
            <p className="text-gray-400">{message}</p>
            {isOwner && (
                <button 
                    onClick={handleCreateClick} 
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                    <i className="fa-solid fa-plus mr-2"></i>
                    Qo'shish
                </button>
            )}
        </div>
    );

    // =============================================================
    // YUKLANISH (LOADING) HOLATI
    // =============================================================
    if (roadmap_isLoading) {
        // ... (Sklet UI avvalgidek) ...
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
            <>
                <NoRoadmap 
                    message={isOwner ? "Sizning rivojlanish bosqichlaringizni qo'shing!" : "Foydalanuvchi o'zining rivojlanish bosqichlarini hali kiritmagan."}
                />
                <RoadmapFormModal
                    isOpen={isFormModalOpen} 
                    onClose={handleCloseFormModal} 
                    username={username} 
                    initialData={editingRoadmap}
                />
            </>
        );
    }

    // =============================================================
    // MA'LUMOTLAR MAVJUD BO'LGAN HOLAT (RENDER)
    // =============================================================
    return (
        <div id="roadmap">
            {/* Faqat egasi uchun qo'shish tugmasi */}
            {isOwner && (
                <div className="mb-4 flex justify-end">
                     <button 
                        onClick={handleCreateClick} 
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                    >
                        <i className="fa-solid fa-plus mr-2"></i>
                        Roadmap qo'shish
                    </button>
                </div>
            )}
            
            <div className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-lg">
                <div className="relative">
                    {/* Vertikal liniya */}
                    <div className="absolute left-4 top-4 h-full w-0.5 bg-gray-700"></div>

                    {roadmaps.map((event, index) => (
                        <RoadmapItem 
                            key={event.id} 
                            event={event} 
                            index={index} 
                            onEdit={handleEditClick} 
                            onDelete={handleDeleteClick} 
                            onToggleLike={handleToggleLike} // Like/Unlike funksiyasi
                        />
                    ))}
                </div>
            </div>

            {/* 1. Form Modal (Yaratish va Tahrirlash) */}
            <RoadmapFormModal 
                isOpen={isFormModalOpen} 
                onClose={handleCloseFormModal} 
                username={username} 
                initialData={editingRoadmap} 
            />
            
            {/* 2. Delete Confirmation Modal (O'chirish) */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                itemTitle={deletingRoadmap ? deletingRoadmap.title : ''}
            />
            
            {/* O'chirish yoki Yoqtirish paytida loading holati uchun to'siq/spinner */}
            {(isDeleting || isLiking) && ( 
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50">
                    <i className="fa-solid fa-spinner fa-spin text-4xl text-indigo-500"></i>
                    <p className="ml-3 text-indigo-500 font-semibold">
                        {isDeleting ? "O'chirilmoqda..." : "Amal bajarilmoqda..."}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ProfileRoadmap;