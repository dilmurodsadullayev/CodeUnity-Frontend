// ProfileProjects.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTechnologyColor } from '../utils/colorUtils';
// Redux actions. Mavjud deb faraz qilamiz
import { getProjectFailure, getProjectStart, getProjectSuccess } from '../features/projects';
import { createProjectFailure, createProjectStart, createProjectSuccess } from '../features/projects'; 
import ProjectService from '../services/project';
import { Link } from 'react-router-dom';
import CreateProjectModal from './CreateProjectModal';

// Redux state-ning Project qismini tanlab olish uchun selector
const selectProjectState = (state) => state.project;


const ProfileProjects = ({username}) => {
    const dispatch = useDispatch()
    const { projects, project_isLoading, project_error } = useSelector(selectProjectState);
    // Tizimga kirgan foydalanuvchini olish.
    const { isLoggedIn, user } = useSelector((state) => state.auth); 
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); 
    
    // Foydalanuvchi ushbu profilning egasimi, tekshirish
    const isOwner = user && user.username === username;


    const getProject = async () => { 
        dispatch(getProjectStart());
        try {
            // Asl API chaqiruvi
            const response = await ProjectService.getProjects(username); 
            dispatch(getProjectSuccess(response)); 
        } catch (err) {
            console.error("Project olishda xato:", err);
            dispatch(getProjectFailure(err.message));
        }
    };

    // =============================================================
    // LOYIHALAR MAVJUD BO'LMAGAN HOLAT UCHUN KOMPONENT
    // =============================================================
    const NoProjects = ({ message }) => (
        <div className="md:col-span-2 text-center p-8 bg-gray-800/50 rounded-lg border border-dashed border-gray-700">
            <i className="fa-solid fa-folder-open text-5xl text-gray-500 mb-4"></i>
            <h4 className="text-xl font-semibold text-white mb-2">Loyihalar mavjud emas</h4>
            <p className="text-gray-400">{message}</p>
        </div>
    );
    
     // =============================================================
    // LOYIHA AMALLARI FUNKSIYALARI
    // =============================================================
    const handleCreateProject = () => {
        setIsCreateModalOpen(true); // Modalni ochish
    };
    
    /**
     * Yangi loyihani backendga yuborish funksiyasi.
     */
    const handleProjectSubmit = async (formDataWithImages) => {
        // dispatch(createProjectStart()); // Agar Redux ishlatsangiz
        
        try {
            // ** ASOSIY API CHAQIRUVI **
            const response = await ProjectService.createProject(formDataWithImages); 
            
            // dispatch(createProjectSuccess(response.data)); 
            
            console.log("Loyihani yaratish muvaffaqiyatli:", response.data);
            
            // Loyihalar ro'yxatini yangilash
            getProject(); 
            
            return response.data; 

        } catch (err) {
            console.error("Yangi loyiha yaratishda xato:", err);
            // dispatch(createProjectFailure(err.message));
            
            // Xatoni modalga qaytarish uchun
            throw new Error(err.response?.data?.detail || err.message || "Loyihani yaratishda kutilmagan xato."); 
        }
    };

    const handleEditProject = (projectId) => {
        alert(`Loyihani tahrirlash modalini ochish: ID ${projectId}`);
        // setIsEditModalOpen(true, projectId); 
    };

    const handleDeleteProject = (projectId) => {
        if (window.confirm("Haqiqatan ham bu loyihani o'chirmoqchimisiz?")) {
            alert(`Loyihani o'chirish logikasi chaqirildi: ID ${projectId}`);
            // dispatch(deleteProject(projectId)); 
        }
    };
    // =============================================================


    useEffect(() => {
        getProject()
    }, [username]); 
    
    // =============================================================
    // YUKLANISH (LOADING) HOLATI
    // =============================================================
    if (project_isLoading) {
        // Sklet (Skeleton) yoki Loading spinner
        return (
            <div className="grid md:grid-cols-2 gap-6">
                {[1, 2].map(i => (
                    <div key={i} className="project-card bg-gray-800 rounded-lg p-5 animate-pulse">
                        <div className="h-32 bg-gray-700 rounded mb-4"></div>
                        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-700 rounded mb-4"></div>
                        <div className="flex flex-wrap gap-2 mb-4">
                            <div className="h-5 w-16 bg-gray-700 rounded-full"></div>
                            <div className="h-5 w-12 bg-gray-700 rounded-full"></div>
                        </div>
                        <div className="h-10 bg-gray-700 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    // =============================================================
    // XATO HOLATI
    // =============================================================
    if (project_error) {
        return (
            <NoProjects 
                message={`Loyihalarni yuklashda xato yuz berdi: ${project_error}`}
            />
        );
    }
    
    // =============================================================
    // BO'SH HOLATI - **MODAL BU YERGA QO'SHILDI**
    // =============================================================
    if (!projects || projects.length === 0) {
        return (
            <div className="space-y-6">
                {isOwner && ( // Tekshiruv: Faqat egasi bo'lsa ko'rsatilsin
                    <div className="flex justify-end">
                        <button 
                            onClick={handleCreateProject}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-all flex items-center space-x-2 shadow-lg shadow-indigo-600/30"
                        >
                            <i className="fa-solid fa-plus"></i>
                            <span>Yangi loyiha yaratish</span>
                        </button>
                    </div>
                )}
                <NoProjects 
                    message={
                        isOwner ? 
                        "Sizda hali hech qanday loyiha mavjud emas. Birinchi loyihangizni yarating!" : 
                        "Foydalanuvchida hali hech qanday loyiha mavjud emas."
                    }
                />
                {/* Modalni bu yerda ko'rsatish shart, aks holda loyihalar yo'q bo'lsa ochilmaydi */}
                 <CreateProjectModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSubmit={handleProjectSubmit}
                />
            </div>
        );
    }


    // =============================================================
    // MA'LUMOTLAR MAVJUD BO'LGAN HOLAT - **MODAL BU YERGA QO'SHILDI**
    // =============================================================
    return (
        <div className="space-y-6"> 
            
            {/* 1. YANGI LOYIHA YARATISH TUGMASI - Faqat egasi bo'lsa ko'rsatilsin */}
            {isOwner && (
                <div className="flex justify-end">
                    <button 
                        onClick={handleCreateProject}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-all flex items-center space-x-2 shadow-lg shadow-indigo-600/30"
                    >
                        <i className="fa-solid fa-plus"></i>
                        <span>Yangi loyiha yaratish</span>
                    </button>
                </div>
            )}

            {/* 2. LOYIHALAR GRIDI */}
            <div id="projects" className="grid md:grid-cols-2 gap-6">
                {projects.map((project) => (
                    <div 
                        key={project.id} 
                        className="project-card bg-gray-800 rounded-lg overflow-hidden flex flex-col relative shadow-xl hover:shadow-2xl transition-shadow"
                    >
                        {/* A. Rasm qismi */}
                        <div className="h-48 overflow-hidden">
                            <img src={project?.images[0]?.image} alt="Loyiha skrinshoti" className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"/>
                        </div>
                        
                        {/* B. Kontent qismi */}
                        <div className="p-5 flex flex-col flex-grow relative"> 
                    
                            
                            {/* Asosiy kontent */}
                            <h4 className="text-xl font-bold text-white pr-20">{project.title}</h4> 
                            <p className="text-gray-400 mt-1 mb-4 flex-grow">{project.description}</p>
                            
                            {/* Texnologiyalar (o'zgarishsiz) */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {/* Language badge */}
                                {project?.language_data && (
                                    <span
                                    className={`${getTechnologyColor(project.language_data)} text-xs font-semibold px-2.5 py-1 rounded-full`}
                                    >
                                    {project.language_data.name}
                                    </span>
                                )}

                                {/* Technology badge */}
                                {project?.technology_data && (
                                    <span
                                    className={`${getTechnologyColor(project.technology_data)} text-xs font-semibold px-2.5 py-1 rounded-full`}
                                    >
                                    {project.technology_data.name}
                                    </span>
                                )}
                            </div>

                            {/* Footer va Statistikalar (o'zgarishsiz) */}
                            <div className="border-t border-gray-700 pt-4 flex justify-between items-center text-gray-400">
                                <div className="flex items-center space-x-4">
                                    <span title="Yulduzlar">
                                        <i className="fa-regular fa-star text-yellow-400 mr-1"></i> {project.stars_count} 
                                    </span>
                                    
                                    <span title="Forklar">
                                        <i className="fa-solid fa-code-fork text-gray-500 mr-1"></i> {project.collaborations_count}
                                    </span>
                                    
                                    <span title="Izohlar">
                                        <i className="fa-regular fa-comment text-gray-500 mr-1"></i> {project.comments_count}
                                    </span>
                                    
                                    <span title="Ko'rishlar">
                                        <i className="fa-regular fa-eye text-gray-500 mr-1"></i> {project.views_count}
                                    </span>
                                </div>
                                <Link to={`/project/${project.id}/detail`}
                                    className="text-indigo-400 hover:text-indigo-300 font-semibold text-sm">
                                    Batafsil <i className="fa-solid fa-arrow-right ml-1"></i>
                                
                                </Link>
                            </div>

                        </div>
                    </div>
                ))}
            </div>
             {/* Modalni loyihalar grididan keyin, asosiy konteyner ichida ko'rsatish */}
             <CreateProjectModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleProjectSubmit}
            />
        </div>
    );
};

export default ProfileProjects;