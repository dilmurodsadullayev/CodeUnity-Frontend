// ProfileProjects.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Redux'dan ma'lumot olish uchun
import { getTechColorClass, getTechnologyColor } from '../utils/colorUtils'; // Utility funksiyani import qilish
import { getProjectFailure, getProjectStart, getProjectSuccess } from '../features/projects';
import ProjectService from '../services/project';

// Redux state-ning Project qismini tanlab olish uchun selector
const selectProjectState = (state) => state.project;

const ProfileProjects = () => {
    // Redux store'dan loyihalar ma'lumotlarini olish
    const dispatch = useDispatch()
    const { projects, project_isLoading, project_error } = useSelector(selectProjectState);


    const getProject = async () => { 
        dispatch(getProjectStart());
        try {
            const response = await ProjectService.getProjects(); 
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

    useEffect(() => {
        getProject() // Loyihalar uchun API chaqiruvi - zaruratga qarab yoqish mumkin
    }, []); 
    
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
    // BO'SH HOLATI
    // =============================================================
    if (!projects || projects.length === 0) {
        return (
            <NoProjects 
                message="Foydalanuvchida hali hech qanday loyiha mavjud emas."
            />
        );
    }


    // =============================================================
    // MA'LUMOTLAR MAVJUD BO'LGAN HOLAT
    // =============================================================
    return (
        <div id="projects" className="grid md:grid-cols-2 gap-6">
            {projects.map((project) => (
                <div key={project.id} className="project-card bg-gray-800 rounded-lg overflow-hidden flex flex-col">
                    <div className="h-48 overflow-hidden">
                        <img src={project?.images[0]?.image} alt="Loyiha skrinshoti" className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"/>
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                        <h4 className="text-xl font-bold text-white">{project.title}</h4>
                        <p className="text-gray-400 mt-1 mb-4 flex-grow">{project.description}</p>
                        
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

                        <div className="border-t border-gray-700 pt-4 flex justify-between items-center text-gray-400">
                          <div className="flex items-center space-x-4">
                                {/* 1. Yulduzlar (Kontur va sariq rangda) */}
                                <span title="Yulduzlar">
                                    <i className="fa-regular fa-star text-yellow-400 mr-1"></i> {project.stars_count} 
                                </span>
                                
                                {/* 2. Forklar (Kontur va kulrangda) */}
                                <span title="Forklar">
                                    {/* 'fa-code-fork' uchun 'fa-regular' versiyasi bo'lmasligi mumkin. Odatda 'fa-code-branch' ishlatiladi. */}
                                    {/* Agar 'fa-code-fork' ni konturi bo'lmasa, uni 'fa-solid' qilib qoldirdim, yoki 'fa-regular fa-code-branch' ga o'tish kerak. */}
                                    <i className="fa-solid fa-code-fork text-gray-500 mr-1"></i> {project.collaborations_count}
                                </span>
                                
                                {/* 3. Izohlar (Kontur va kulrangda) */}
                                <span title="Izohlar">
                                    <i className="fa-regular fa-comment text-gray-500 mr-1"></i> {project.comments_count}
                                </span>
                                
                                {/* 4. Ko'rishlar (Kontur va kulrangda) */}
                                <span title="Ko'rishlar">
                                    <i className="fa-regular fa-eye text-gray-500 mr-1"></i> {project.views_count}
                                </span>
                            </div>
                            <a href={project.detailLink} className="text-indigo-400 hover:text-indigo-300 font-semibold text-sm">
                                Batafsil <i className="fa-solid fa-arrow-right ml-1"></i>
                            </a>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProfileProjects;