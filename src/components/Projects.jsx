import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getProjectStart, getProjectSuccess, getProjectFailure } from '../features/projects';
import ProjectService from '../services/project';
import UserImage from '../assests/userImage.jpeg';

const Projects = () => {
    const dispatch = useDispatch();
    const { projects, project_isLoading } = useSelector(state => state.project);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchProjects = useCallback(async () => {
        dispatch(getProjectStart());
        try {
            const data = await ProjectService.getAllProjects({ search: searchTerm });
            dispatch(getProjectSuccess(data));
        } catch (error) {
            dispatch(getProjectFailure(error.message));
        }
    }, [dispatch, searchTerm]);

    useEffect(() => {
        const delay = setTimeout(fetchProjects, 400);
        return () => clearTimeout(delay);
    }, [fetchProjects]);

    return (
        <div className="min-h-screen bg-[#0a0c10] pt-28 pb-20 px-4 md:px-6 overflow-hidden relative">
            
            {/* Fon uchun dekorativ chiroqlar (Ambient Light) */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-600/10 blur-[100px] rounded-full"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                
                {/* --- HEADER SECTION --- */}
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
                        CODE<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600">UNITY</span> PROJECTS
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                        O'zbekistonning eng iqtidorli dasturchilari tomonidan yaratilgan ochiq manbali loyihalar olami.
                    </p>

                    {/* Minimalist Search Bar */}
                    <div className="max-w-2xl mx-auto pt-6">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-focus-within:opacity-50 transition duration-500"></div>
                            <div className="relative flex items-center bg-[#161b22] rounded-2xl border border-white/5">
                                <i className="fas fa-search ml-6 text-gray-500"></i>
                                <input 
                                    type="text"
                                    placeholder="Loyiha yoki texnologiya bo'yicha qidirish..."
                                    className="w-full bg-transparent border-none text-white px-6 py-5 focus:ring-0 placeholder:text-gray-600"
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <div className="pr-4 hidden md:block">
                                    <span className="bg-gray-800 text-gray-400 px-3 py-1 rounded-lg text-xs font-mono">CTRL + K</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- PROJECTS GRID --- */}
                {project_isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[1, 2, 3].map(n => (
                            <div key={n} className="h-[450px] bg-white/5 rounded-[2rem] animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {projects?.map((project) => (
                            <Link 
                                to={`/project/${project.id}/detail`} 
                                key={project.id}
                                className="group relative"
                            >
                                {/* Boosted bo'lsa orqa fondagi glow */}
                                {project.is_boosted && (
                                    <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[2.5rem] blur-lg opacity-30 group-hover:opacity-60 transition duration-500"></div>
                                )}

                                <div className="relative h-full bg-[#0d1117] border border-white/5 rounded-[2rem] overflow-hidden hover:border-white/20 transition-all duration-500 flex flex-col">
                                    
                                    {/* Image Section */}
                                    <div className="relative h-60 overflow-hidden">
                                        <img 
                                            src={project.images?.[0]?.image || "https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=1964&auto=format&fit=crop"} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-90"
                                            alt={project.name}
                                        />
                                        
                                        {/* Floating Tags */}
                                        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                                            <span className="backdrop-blur-md bg-black/40 text-white text-[10px] font-bold px-3 py-1.5 rounded-full border border-white/10 uppercase tracking-widest">
                                                {project.language_data?.name}
                                            </span>
                                        </div>

                                        {project.is_boosted && (
                                            <div className="absolute top-4 right-4 bg-white text-black px-3 py-1.5 rounded-full text-[10px] font-black flex items-center gap-2">
                                                <i className="fas fa-rocket text-indigo-600"></i> PROMOTED
                                            </div>
                                        )}

                                        {/* View Details Overlay */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <span className="bg-white text-black px-6 py-2.5 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                Loyihani ko'rish
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-8 flex flex-col flex-grow">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                                                {project.name}
                                            </h3>
                                            <div className="flex items-center gap-1.5 text-yellow-500">
                                                <i className="fas fa-star"></i>
                                                <span className="text-lg font-black">{project.stars_count}</span>
                                            </div>
                                        </div>

                                        <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-3">
                                            {project.description || "Ushbu loyiha dasturchilar hamjamiyati uchun ochiq manba sifatida taqdim etilgan."}
                                        </p>

                                        {/* Bottom Info */}
                                        <div className="mt-auto flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-500"></div>
                                                    <img 
                                                        src={project.user?.image || UserImage} 
                                                        className="relative w-10 h-10 rounded-full border-2 border-[#0d1117] object-cover" 
                                                        alt="avatar"
                                                    />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-white text-sm font-bold truncate w-24">
                                                        {project.user?.first_name || project.user?.username}
                                                    </span>
                                                    <span className="text-gray-600 text-[10px] uppercase font-bold tracking-tighter">Muallif</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 text-gray-600">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-white font-bold text-sm">{project.views_count}</span>
                                                    <i className="fas fa-eye text-[10px]"></i>
                                                </div>
                                                <div className="w-[1px] h-6 bg-white/5"></div>
                                                <div className="flex flex-col items-center">
                                                    <span className="text-white font-bold text-sm">{project.comments_count}</span>
                                                    <i className="fas fa-comments text-[10px]"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* --- EMPTY STATE --- */}
                {!project_isLoading && projects?.length === 0 && (
                    <div className="text-center py-40">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/5 mb-8 border border-white/10">
                            <i className="fas fa-ghost text-4xl text-gray-700"></i>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">Loyihalar topilmadi</h2>
                        <p className="text-gray-500">Qidiruv bo'yicha hech qanday natija topilmadi. <br/> Balki birinchilardan bo'lib siz loyiha qo'sharsiz?</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Projects;