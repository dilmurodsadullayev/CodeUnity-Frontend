import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProjectDetailFailure, getProjectDetailStart, getProjectDetailSuccess } from '../features/projects';
import ProjectService from '../services/project';
import { useParams } from 'react-router-dom';
import UserImage from '../assests/userImage.jpeg'; // Agar rasm manzili bo'lmasa

// Lokal komponentlarni import qilish
import ProjectDiscussion from './ProjectDiscussion'; 
import ProjectCollaboration from './ProjectCollaboration'; 
import ProjectLoadingSkeleton from './ProjectLoadingSkeleton'; // Loading komponenti

// ** CSS Styles **
const styles = `
    :root {
        --dark-bg: #0d1117;
        --dark-bg-secondary: #161b22;
        --border-color: rgba(193, 205, 219, 0.2);
        --text-primary: #c9d1d9;
        --indigo: #4f46e5;
        --purple: #a855f7;
        --gold: #f59e0b;
    }
    .project-body {
        font-family: 'Inter', sans-serif;
        background-color: var(--dark-bg);
        color: var(--text-primary);
    }
    .atmospheric-bg {
        position: absolute;
        top: 0; left: 0; right: 0; height: 600px;
        overflow: hidden;
        z-index: -1;
    }
    .atmospheric-bg::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(to top, var(--dark-bg) 10%, transparent 100%);
    }
    .main-content-wrapper {
        background: rgba(13, 17, 23, 0.7);
        backdrop-filter: blur(20px);
        border: 1px solid var(--border-color);
        margin-top: 200px;
    }
    .sticky-sidebar {
        position: sticky;
        top: 80px;
    }
    .prose-custom { color: #a6adbb; line-height: 1.7; }
    .prose-custom h2 { color: #f0f6fc; margin-top: 2em; margin-bottom: 1em; padding-bottom: 0.3em; border-bottom: 1px solid var(--border-color); }
    .prose-custom h3 { color: #e6edf3; margin-top: 1.5em; margin-bottom: 0.5em; }
    .prose-custom strong { color: #fff; }
    .prose-custom a { color: var(--indigo); text-decoration: none; font-weight: 600; }
    .prose-custom a:hover { text-decoration: underline; }
    .prose-custom ul > li { padding-left: 1em; margin-top: 0.5em; }
    .prose-custom ul > li::marker { color: var(--indigo); }
    .prose-custom code { color: #f472b6; background-color: rgba(236, 72, 150, 0.1); padding: 2px 5px; border-radius: 4px; font-weight: 600; }
    .prose-custom blockquote {
        border-left: 4px solid var(--indigo);
        padding-left: 1.5rem;
        margin-left: 0;
        font-style: italic;
        color: #d1d5db;
    }
    .star-rating { display: inline-flex; }
    .star-rating label {
        font-size: 1.75rem; 
        color: #4b5563; 
        cursor: pointer;
        transition: color 0.2s ease;
    }
    .star-rating label.active {
        color: var(--gold);
    }
    .text-gradient {
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
        background-image: linear-gradient(to right, #6366f1, #a855f7);
    }
`;

const selectProjectState = (state) => state.project;

// Yordamchi funksiyalar
const formatFeatureList = (featuresString) => {
    if (!featuresString) return [];
    // Matnni vergul yoki yangi qator bo'yicha ajratishga harakat qilamiz
    const items = featuresString.split(/,\s*|\n/).filter(item => item.trim() !== '');
    return items.map(item => item.trim());
};

const ProjectDetail = () => {
    const { projectId } = useParams()
    const dispatch = useDispatch()
    const { isLoggedIn, user } = useSelector((state) => state.auth);
            
        
            
    

    
    // Hamkorlar ma'lumotlari (Bu demo ma'lumotlar endi ProjectCollaboration'ga uzatiladi)
    const [pendingRequests] = useState([
        { id: 1, user: 'Anakin Skywalker', role: 'Backend Developer', comment: 'APIlar bilan ishlashda katta tajribam bor.', avatar: 'https://i.pravatar.cc/150?u=anakin' },
        { id: 2, user: 'Padme Amidala', role: 'Frontend Developer', comment: 'Interfeyslarni tez va sifatli qila olaman.', avatar: 'https://i.pravatar.cc/150?u=padme' }
    ]);
    const [currentCollaborators] = useState([
        { id: 3, user: 'Obi-Wan Kenobi', role: 'DevOps Engineer', avatar: 'https://i.pravatar.cc/150?u=obiwan' }
    ]);

    const [activeIndex, setActiveIndex] = useState(0);
    // ---------------------------------------------------
    
    const { projectDetail, projectDetailIsLoading, projectDetailError } = useSelector(selectProjectState);
            // Foydalanuvchi ushbu profilning egasimi, tekshirish
    const isOwner = user?.username && projectDetail?.user?.username && user.username === projectDetail.user.username;


    // Barcha ma'lumotlar yuklangandan so'ng, ularni oson ishlatish uchun tayyorlaymiz
    const projectData = projectDetail || {};
    const projectImages = projectData?.images || [];
    const mainImage = projectImages[activeIndex]?.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop';
    const author = projectData?.user || {};
    const featuresList = formatFeatureList(projectData.main_features);

    // ---------------------------------------------------
    // API chaqiruvi
    // ---------------------------------------------------

    const getProjectDetail = async () => { 
        dispatch(getProjectDetailStart());
        try {
            const response = await ProjectService.projectDetail(projectId); 
            dispatch(getProjectDetailSuccess(response)); 
        } catch (err) {
            console.error("ProjectDetail olishda xato:", err);
            dispatch(getProjectDetailFailure(err.message));
        }
    };

    useEffect(() => {
        getProjectDetail()
    }, [projectId]); 

    // ---------------------------------------------------

    const styleTag = <style dangerouslySetInnerHTML={{ __html: styles }} />;


    // =============================================================
    // LOYIHANI YUKLASH HOLATI
    // =============================================================
    if (projectDetailIsLoading) {
        return <ProjectLoadingSkeleton styleTag={styleTag} />;
    }

    // =============================================================
    // XATO HOLATI YOKI MA'LUMOT BO'LMASA
    // =============================================================
    if (projectDetailError || !projectData.id) {
        return (
            <div className="project-body min-h-screen pt-40 flex items-start justify-center">
                {styleTag}
                <div className="bg-dark-bg-secondary border border-gray-700 p-8 rounded-lg max-w-xl text-center">
                    <i className="fa-solid fa-triangle-exclamation text-red-500 text-5xl mb-4"></i>
                    <h1 className="text-white text-2xl font-bold mb-2">Loyiha topilmadi yoki xato yuz berdi.</h1>
                    <p className="text-gray-400">Loyihani yuklashda muammo yuz berdi. ID: {projectId}</p>
                    {projectDetailError && <p className="text-red-400 mt-2 text-sm">{projectDetailError}</p>}
                </div>
            </div>
        );
    }
    
    // =============================================================
    // ASOSIY KOMPONENT RENDERINGI
    // =============================================================

    return (
        <div className="project-body">
            {styleTag}

            {/* Fonga blur effekt uchun Project rasmi */}
            {/* <div className="atmospheric-bg">
                <img src={mainImage} className="w-full h-full object-cover filter blur-xl scale-110" alt="Background Blur" />
            </div> */}

            <main className="container mx-auto px-4">
                <div className="main-content-wrapper rounded-xl shadow-2xl mb-16">
                    
                    {/* Loyiha Sarlavhasi va Statistikasi */}
                    <header className="p-6 md:p-10 border-b border-gray-700/50">
                        <h1 className="text-4xl md:text-5xl font-black text-gradient">{projectData.name}</h1>
                        
                        {/* Yutuqlar Paneli */}
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-4 text-gray-400">
                            <div className="flex items-center gap-2">
                                <div className="star-rating">
                                    {Array(5).fill(0).map((_, i) => (
                                        <label key={i} className={i < (projectData.stars_count || 0) ? 'active' : ''}>★</label>
                                    ))}
                                </div>
                                <span className="font-bold text-white text-lg">{(projectData.stars_count || 0).toFixed(1)}</span>
                                <span className="text-sm">({(projectData.stars_count * 50 || 0).toLocaleString()} baho)</span> {/* Demo baho hisobi */}
                            </div>
                            <div className="flex items-center gap-2 text-sm"><i className="fas fa-eye w-5"></i> {projectData.views_count.toLocaleString()} ko'rish</div>
                            <div className="flex items-center gap-2 text-sm"><i className="fas fa-comments w-5"></i> {projectData.comments_count.toLocaleString()} sharh</div>
                        </div>

                        {/* Rasm Galereyasi */}
                        <div className="mt-8">
                            <div className="relative aspect-video bg-black/20 rounded-lg overflow-hidden">
                                {projectImages.map((img, index) => (
                                    <img 
                                        key={img.id} 
                                        src={img.image} 
                                        className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${activeIndex === index ? 'opacity-100' : 'opacity-0'}`}
                                        alt={img.title || `Project Screenshot ${index + 1}`}
                                    />
                                ))}
                            </div>
                            <div className="flex justify-center gap-2 mt-4">
                                {projectImages.map((_, index) => (
                                    <button 
                                        key={index} 
                                        onClick={() => setActiveIndex(index)} 
                                        className={`w-2.5 h-2.5 rounded-full transition-colors ${activeIndex === index ? 'bg-white' : 'bg-gray-600 hover:bg-gray-400'}`}
                                    ></button>
                                ))}
                            </div>
                        </div>
                    </header>

                    <div className="flex flex-col lg:flex-row">
                        <div className="w-full lg:w-2/3 border-r-0 lg:border-r border-gray-700/50">
                            {/* Loyiha Tavsifi */}
                            <article className="p-6 md:p-10 prose-custom max-w-none">
                                <blockquote>
                                    {projectData.description || "Ushbu loyiha uchun hali to'liq tavsif kiritilmagan."}
                                </blockquote>
                                
                                <h2>Loyiha Haqida</h2>
                                <p>
                                    {projectData.description || "Loyiha haqida to'liqroq ma'lumotlar tez orada kiritiladi."}
                                </p>
                                
                                {featuresList.length > 0 && (
                                    <>
                                        <h3>Asosiy Imkoniyatlar:</h3>
                                        <ul>
                                            {featuresList.map((feature, index) => (
                                                <li key={index}>{feature}</li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </article>

                            {/* Loyiha Jamoasi Bo'limi - ProjectCollaboration komponentiga o'tkazildi */}
                            <ProjectCollaboration 
                                currentCollaborators={projectDetail.collaborations} // Demo ma'lumot
                                pendingRequests={pendingRequests} // Demo ma'lumot
                                projectOwner={author} // Real ma'lumot
                                isOwner={isOwner} // Egasi ekanligini tekshirish lozim (hozircha true)
                                isCollaborator={false} // Hamkor ekanligini tekshirish lozim (hozircha false)
                                hasSentRequest={false} // So'rov yuborilganini tekshirish lozim (hozircha false)
                            />

                        </div>

                        {/* Sidebar */}
                        <aside className="w-full lg:w-1/3 p-6 md:p-10">
                            <div className="sticky-sidebar space-y-8">
                                 <div>
                                    <h3 className="font-bold text-white mb-3">Muallif</h3>
                                    <a href={`/profile/${author.username}`} className="flex items-center gap-3 bg-gray-800/50 hover:bg-gray-700/50 p-3 rounded-lg transition-colors">
                                        <img src={author.image || UserImage} className="w-12 h-12 rounded-full object-cover" alt={author.username} />
                                        <div>
                                            <p className="font-bold text-white">{`${author.first_name || ''} ${author.last_name || author.username}`}</p>
                                            <p className="text-sm text-gray-400">Daraja: {author.skill_level || 'Aniqlanmagan'}</p>
                                        </div>
                                    </a>
                                </div>
                                
                                <div>
                                    <h3 className="font-bold text-white mb-3">Texnologiyalar</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {projectData.language_data && (
                                            <span className="bg-blue-600/20 text-blue-300 text-xs font-semibold px-2.5 py-1 rounded-full">{projectData.language_data.name}</span>
                                        )}
                                        {projectData.technology_data && (
                                            <span className="bg-purple-600/20 text-purple-300 text-xs font-semibold px-2.5 py-1 rounded-full">{projectData.technology_data.name}</span>
                                        )}
                                        {/* Boshqa techlar uchun qo'shimcha logic */}
                                        
                                    </div>
                                </div>
                                
                                <div className="space-y-3">
                                    {projectData.github_url && (
                                        <a href={projectData.github_url} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-5 rounded-lg transition-colors">
                                            <i className="fab fa-github"></i> GitHub
                                        </a>
                                    )}
                                    {projectData.website_url && (
                                        <a href={projectData.website_url} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-5 rounded-lg transition-colors">
                                            <i className="fas fa-external-link-alt"></i> Live Demo
                                        </a>
                                    )}
                                </div>
                            </div>
                        </aside>
                    </div>
                    
                    {/* Muhokama Bo'limi - ProjectDiscussion komponentiga o'tkazildi */}
                    <ProjectDiscussion />
                </div>
            </main>
        </div>
    );
};

export default ProjectDetail;