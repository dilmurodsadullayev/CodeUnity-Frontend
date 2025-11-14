import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProjectDetailFailure, getProjectDetailStart, getProjectDetailSuccess } from '../features/projects';
import ProjectService from '../services/project';
import { useParams, useNavigate } from 'react-router-dom'; // useNavigate qo'shildi
import UserImage from '../assests/userImage.jpeg'; 

// Lokal komponentlarni import qilish
import ProjectDiscussion from './ProjectDiscussion'; 
import ProjectCollaboration from './ProjectCollaboration'; 
import ProjectLoadingSkeleton from './ProjectLoadingSkeleton'; 

// === YANGI IMPORTLAR ===
import DeleteConfirmationModal from './DeleteConfirmationModal'; // O'chirish modalini import qilish
import ProjectFormModal from './CreateProjectModal';
// ========================

// ** CSS Styles ** (O'zgarishsiz qoldirildi)
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
    const items = featuresString.split(/,\s*|\n/).filter(item => item.trim() !== '');
    return items.map(item => item.trim());
};

const ProjectDetail = () => {
    const { projectId } = useParams();
    const navigate = useNavigate(); // Navigatsiya uchun
    const dispatch = useDispatch();
    const { isLoggedIn, user } = useSelector((state) => state.auth);
            
    // =============================================================
    // ** YANGI STATE'LAR (Edit/Delete uchun) **
    // =============================================================
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    // =============================================================

    const [activeIndex, setActiveIndex] = useState(0);
    
    const { projectDetail, projectDetailIsLoading, projectDetailError } = useSelector(selectProjectState);
    
    // Foydalanuvchi ushbu profilning egasimi, tekshirish
    const isOwner = user?.id && projectDetail?.user?.id && user.id === projectDetail.user.id; // ID bo'yicha tekshirish xavfsizroq

    // Barcha ma'lumotlar yuklangandan so'ng, ularni oson ishlatish uchun tayyorlaymiz
    const projectData = projectDetail || {};
    const projectImages = projectData?.images || [];
    const mainImage = projectImages[activeIndex]?.image || UserImage;
    const author = projectData?.user || {};
    const featuresList = formatFeatureList(projectData.main_features);
    const [isStarred, setIsStarred] = useState(false); // Foydalanuvchi bu loyihani yoqtirganmi


    // ---------------------------------------------------
    // API chaqiruvi (Loyihani yuklash)
    // ---------------------------------------------------

    const getProjectDetail = useCallback(async () => { 
        dispatch(getProjectDetailStart());
        try {
            const response = await ProjectService.projectDetail(projectId); 
            dispatch(getProjectDetailSuccess(response)); 
            // Rasm indexini to'g'irlash
            if (response.images && response.images.length > 0) {
                 setActiveIndex(prev => Math.min(prev, response.images.length - 1));
            } else {
                 setActiveIndex(0);
            }
        } catch (err) {
            console.error("ProjectDetail olishda xato:", err);
            dispatch(getProjectDetailFailure(err.message));
        }
    }, [projectId, dispatch]);

    useEffect(() => {
        getProjectDetail()
    }, [getProjectDetail]); 

    // ---------------------------------------------------
    // ** EDIT / DELETE FUNKSIYALARI **
    // ---------------------------------------------------

    // Loyihani tahrirlash funksiyasi (ProjectFormModal'ga uzatiladi)
    const handleUpdateProject = async (formData, projectIdToUpdate) => {
        try {
            // BACKENDGA YUBORILADIGAN DATA: projectIdToUpdate, formData (FormData obyekti)
            await ProjectService.updateProject(projectIdToUpdate, formData); 
            setIsEditModalOpen(false);
            // Yangilangan loyiha ma'lumotlarini qayta yuklash
            await getProjectDetail(); 
            // Muvaffaqiyatli xabar ko'rsatish
            // alert("Loyiha muvaffaqiyatli tahrirlandi!"); 
        } catch (error) {
            console.error("Loyihani tahrirlashda xato:", error);
            // Xatoni ProjectFormModal'ga qaytarish uchun uni tashlaymiz
            throw error; 
        }
    };
    
    // Loyihani o'chirishni tasdiqlash
    const handleConfirmDelete = async () => {
        if (!projectData.id) return;

        setIsDeleting(true);

        try {
            // BACKENDGA YUBORILADIGAN DATA: projectData.id
            await ProjectService.deleteProject(projectData.id); 
            
            // Muvaffaqiyatli o'chirilgandan so'ng, foydalanuvchini boshqa sahifaga yo'naltirish
            navigate(`/${user.username}/profile/`); // Masalan, foydalanuvchi profiliga
            // alert("Loyiha muvaffaqiyatli o'chirildi!");

        } catch (err) {
            console.error("Loyihani o'chirishda xato:", err);
            // Xatoni ko'rsatish
            alert("Loyihani o'chirishda xato yuz berdi: " + (err.message || "Noma'lum xato")); 
            setIsDeleteModalOpen(false); // Modalni yopish
        } finally {
            setIsDeleting(false);
        }
    };

    // ---------------------------------------------------
    // ** STAR/UNSTAR FUNKSIYALARI **
    // ---------------------------------------------------

    const handleStarToggle = useCallback(async () => {
        if (!isLoggedIn) {
            alert("Loyihani yoqtirish uchun avval tizimga kiring!"); 
            return;
        }
        
        // Optimistik yangilash uchun joriy holatni saqlab qolamiz
        const currentIsStarred = isStarred;
        const currentStarsCount = projectDetail.stars_count || 0;
        const willBeStarred = !currentIsStarred; 
        const newStarsCountOptimistic = willBeStarred ? currentStarsCount + 1 : currentStarsCount - 1;

        // 1. Optimistik Yangilash (UI tezkor javob berishi uchun)
        setIsStarred(willBeStarred);
        dispatch(getProjectDetailSuccess({ 
            ...projectDetail, 
            stars_count: newStarsCountOptimistic,
            is_starred_by_user: willBeStarred
        }));

        try {
            // 2. API chaqiruvi (toggleProjectStar endi hamma ishni qiladi)
            const response = await ProjectService.toggleProjectStar(projectId);
            
            // 3. API javobi bilan state'ni yakuniy yangilash (Agar optimistik count noto'g'ri bo'lsa to'g'irlash uchun)
            // Backenddan keladigan ma'lumotlar: {is_starred_by_user, stars_count, detail}
            
            // Backendning haqiqiy holatini statega qo'yish
            setIsStarred(response.is_starred_by_user);
            dispatch(getProjectDetailSuccess({ 
                ...projectDetail, 
                stars_count: response.stars_count,
                is_starred_by_user: response.is_starred_by_user
            }));

        } catch (error) {
            console.error("Star/Unstar qilishda xato:", error);
            
            // Xato bo'lsa, holatni orqaga qaytarish (Rollback)
            setIsStarred(currentIsStarred); // Avvalgi holatga qaytarish
            dispatch(getProjectDetailSuccess({ 
                ...projectDetail, 
                stars_count: currentStarsCount, // Avvalgi count'ga qaytarish
                is_starred_by_user: currentIsStarred
            }));
            
            alert("Amalni bajarishda xato yuz berdi. Iltimos, qayta urinib ko'ring.");
        }
    }, [isStarred, isLoggedIn, projectId, projectDetail, dispatch]);


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

            <main className="container mx-auto px-4">
                <div className="main-content-wrapper rounded-xl shadow-2xl mb-16">
                    
                    {/* Loyiha Sarlavhasi va Statistikasi */}
                    <header className="p-6 md:p-10 border-b border-gray-700/50">
                        <div className='flex justify-between items-start'>
                            <h1 className="text-4xl md:text-5xl font-black text-gradient">{projectData.name}</h1>
                            
                            {/* ** EDIT VA DELETE TUGMALARI ** */}
                            {isOwner && (
                                <div className='flex gap-2 ml-4'>
                                    <button 
                                        onClick={() => setIsEditModalOpen(true)}
                                        className="p-3 text-sm rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition duration-150 flex items-center gap-2 font-semibold"
                                        title="Loyihani tahrirlash"
                                    >
                                        <i className="fas fa-edit"></i>
                                        <span className="hidden md:inline">Tahrirlash</span>
                                    </button>
                                    <button 
                                        onClick={() => setIsDeleteModalOpen(true)}
                                        className="p-3 text-sm rounded-lg bg-red-600 hover:bg-red-700 text-white transition duration-150 flex items-center gap-2 font-semibold"
                                        title="Loyihani o'chirish"
                                    >
                                        <i className="fas fa-trash-alt"></i>
                                        <span className="hidden md:inline">O'chirish</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Yutuqlar Paneli */}
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-4 text-gray-400">
                            
                            {/* ** YANGI STAR BOSISH BO'LIMI ** */}
                            <div className="flex items-center gap-2">
                                {/* Faqat Tizimga kirgan foydalanuvchilar uchun Star tugmasini ko'rsatish */}
                                {isLoggedIn && (
                                    <button
                                        onClick={handleStarToggle}
                                        className={`flex items-center gap-2 p-3 rounded-lg transition-colors duration-200 text-sm font-semibold ${
                                            isStarred ? 'bg-yellow-600 hover:bg-yellow-700 text-white shadow-lg shadow-yellow-600/30' : 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-300'
                                        }`}
                                        title={isStarred ? "Yoqtirishni bekor qilish" : "Loyihani yoqtirish"}
                                    >
                                        <i className={`fas fa-star text-lg ${isStarred ? 'text-white' : 'text-yellow-500'}`}></i>
                                        <span className="hidden sm:inline">{isStarred ? "Yoqilgan" : "Yoqtirish"}</span>
                                    </button>
                                )}
                                
                                {/* Star / Yoqtirish soni statistikasi (Yangi dizayn) */}
                                <div className="flex items-center gap-2 text-sm">
                                    <i className="fas fa-star text-lg text-yellow-500"></i>
                                    <span className="font-bold text-white text-lg">{(projectData.stars_count || 0).toLocaleString()}</span>
                                    <span className="text-sm text-gray-400">Yoqish</span>
                                </div>
                            </div>
                            {/* ** YANGI STAR BOSISH BO'LIMI TUGADI ** */}

                            <div className="flex items-center gap-2 text-sm"><i className="fas fa-eye w-5"></i> {projectData.views_count?.toLocaleString() || 0} ko'rish</div>
                            <div className="flex items-center gap-2 text-sm"><i className="fas fa-comments w-5"></i> {projectData.comments_count?.toLocaleString() || 0} sharh</div>
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
                                {/* Agar rasm bo'lmasa, o'rinbosar rasm ko'rsatish */}
                                {projectImages.length === 0 && (
                                    <div className='absolute inset-0 flex items-center justify-center bg-gray-900'>
                                        <i className='fas fa-image text-gray-700 text-6xl'></i>
                                    </div>
                                )}
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
                        {/* Asosiy Tarkib */}
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

                            {/* Loyiha Jamoasi Bo'limi */}
                            <ProjectCollaboration 
                                currentCollaborators={projectDetail.collaborations} 
                                pendingRequests={[]} // Bu ma'lumotni ham backenddan olish kerak
                                projectOwner={author} 
                                isOwner={isOwner} 
                                isCollaborator={false} 
                                hasSentRequest={false} 
                                projectId={projectId} 
                            />

                        </div>

                        {/* Sidebar */}
                        <aside className="w-full lg:w-1/3 p-6 md:p-10">
                            <div className="sticky-sidebar space-y-8">
                                 {/* ... (Sidebar qismi o'zgarishsiz) ... */}
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
                    
                    {/* Muhokama Bo'limi */}
                    <ProjectDiscussion  projectId={projectId}/>
                </div>
            </main>

            {/* ======================================= */}
            {/* ** LOYIHANI TAHRIRLASH MODALI ** */}
            {/* ======================================= */}
            {isOwner && (
                <ProjectFormModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSubmit={handleUpdateProject} // Tahrirlash funksiyasini yuboramiz
                    initialData={projectData} // Tahrirlash uchun mavjud loyiha ma'lumotlarini yuboramiz
                />
            )}
            
            {/* ======================================= */}
            {/* ** LOYIHANI O'CHIRISH MODALI ** */}
            {/* ======================================= */}
            {isOwner && (
                <DeleteConfirmationModal 
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleConfirmDelete} // O'chirishni tasdiqlash funksiyasi
                    itemTitle={projectData.name}
                    isProcessing={isDeleting}
                />
            )}

        </div>
    );
};

export default ProjectDetail;