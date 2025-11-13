// ProjectCollaboration.jsx
import React, { useState, useCallback, useEffect } from 'react'; 
import { useSelector, useDispatch } from 'react-redux'; 
import { 
    fetchCollaborationRequests, 
    sendCollaborationRequest,
    manageCollaborationRequest, 
    fetchProjectCollaborators 
} from '../redux/thunks/projectThunks'; 
import UserImage from '../assests/userImage.jpeg'; 

// Modelda mavjud bo'lgan ROLE_CHOICES ni frontendda ishlatish uchun
const COLLABORATION_ROLES = [
    { value: 'backend', label: 'Backend Developer' },
    { value: 'api_developer', label: 'API Developer' },
    { value: 'database_admin', label: 'Database Administrator' },
    { value: 'devops', label: 'DevOps Engineer' },
    { value: 'frontend', label: 'Frontend Developer' },
    { value: 'react_dev', label: 'React Developer' },
    { value: 'vue_dev', label: 'Vue Developer' },
    { value: 'angular_dev', label: 'Angular Developer' },
    { value: 'fullstack', label: 'Fullstack Developer' },
    { value: 'uiux', label: 'UI/UX Designer' },
    { value: 'graphic_designer', label: 'Graphic Designer' },
    { value: 'android_dev', label: 'Android Developer' },
    { value: 'ios_dev', label: 'iOS Developer' },
    { value: 'flutter_dev', label: 'Flutter Developer' },
    { value: 'ml_engineer', label: 'Machine Learning Engineer' },
    { value: 'data_scientist', label: 'Data Scientist' },
    { value: 'ai_researcher', label: 'AI Researcher' },
    { value: 'cybersecurity', label: 'Cybersecurity Specialist' },
    { value: 'pentester', label: 'Penetration Tester' },
    { value: 'game_dev', label: 'Game Developer' },
    { value: 'software_architect', label: 'Software Architect' },
    { value: 'qa_tester', label: 'QA Tester / Software Tester' },
    { value: 'project_manager', label: 'Project Manager' },
    { value: 'mentor', label: 'Mentor / Instructor' },
    { value: 'researcher', label: 'Researcher' },
    { value: 'tech_writer', label: 'Technical Writer' },
];

const ProjectCollaboration = ({ 
    projectId, 
    projectOwner, 
    isOwner, 
    isCollaborator, 
    hasSentRequest: initialHasSentRequest 
}) => {
    const dispatch = useDispatch();

    // Redux State'dan ma'lumotlarni olish
    const { 
        collaborators: currentCollaborators = [], 
        collaboratorsIsLoading: collaboratorsLoading, 
        
        collaborationRequestIsLoading: isLoading, 
        collaborationRequests: pendingRequests = [], 
        collaborationRequestError: error,
        isCollaborationActionLoading: isActionLoading 
    } = useSelector(state => state.project || {}); 

    // Hamkorlik logikasi uchun local state'lar
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState('');
    const [comment, setComment] = useState('');
    const [joinRequestError, setJoinRequestError] = useState(null); 
    
    const [showManageModal, setShowManageModal] = useState(false);
    const [activeTab, setActiveTab] = useState('requests');
    
    const [hasSentRequest, setHasSentRequest] = useState(initialHasSentRequest);

    // =============================================================
    // EFFECT: Ma'lumotlarni yuklash
    // =============================================================
    useEffect(() => {
        // 1. So'rovlarni yuklash (Faqat owner uchun)
        if (isOwner && projectId) {
            dispatch(fetchCollaborationRequests(projectId));
        }
        
        // 2. Hamkorlarni yuklash (Har kim uchun)
        if (projectId) {
            dispatch(fetchProjectCollaborators(projectId));
        }

    }, [dispatch, isOwner, projectId]);

    // Yordamchi funksiya: Rolning qisqa nomini to'liq nomga o'girish
    const getRoleLabel = (value) => {
        const role = COLLABORATION_ROLES.find(r => r.value === value);
        return role ? role.label : value;
    };
    
    // ✅ YORDAMCHI FUNKSIYA: Ism/Familiya yoki Username ni qaytarish
    const getFullNameOrUsername = (user) => {
        if (!user) return 'Noma\'lum';
        // Ism va Familiyani birlashtirib, bo'sh joylarni olib tashlaymiz
        const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
        // Agar to'liq ism mavjud bo'lsa, uni, aks holda username ni qaytaramiz
        return fullName || user.username || 'Noma\'lum Foydalanuvchi';
    }


    // =============================================================
    // HANDLERS
    // =============================================================

    const sendJoinRequest = useCallback(async () => {
        if (!selectedRole) return;
        
        setJoinRequestError(null); 

        const requestData = {
            role: selectedRole,
            message: comment,
        };

        try {
            await dispatch(sendCollaborationRequest(projectId, requestData));
            
            setShowJoinModal(false);
            setSelectedRole('');
            setComment('');
            setHasSentRequest(true); 
            
            alert('Hamkorlik so\'rovingiz muvaffaqiyatli yuborildi va tasdiqlash kutilmoqda!');

        } catch (err) {
            const errorMessage = err.message || "So'rov yuborishda xato yuz berdi.";
            setJoinRequestError(errorMessage);
            console.error("So'rov yuborish xatosi:", err);
        }
    }, [selectedRole, comment, projectId, dispatch]);


    // ✅ Qabul qilish (Haqiqiy backend chaqiruvi bilan)
    const acceptRequest = useCallback(async (requestId) => {
        if(isActionLoading) return; 
        try {
            await dispatch(manageCollaborationRequest(requestId, 'accepted', projectId));
            alert('So\'rov muvaffaqiyatli qabul qilindi va hamkor qo\'shildi!');
            
        } catch (error) {
            alert(`Xato: ${error.message}`);
        }
    }, [projectId, dispatch, isActionLoading]); 

    // ✅ Rad etish (Haqiqiy backend chaqiruvi bilan)
    const rejectRequest = useCallback(async (requestId) => {
        if(isActionLoading) return; 
        try {
            await dispatch(manageCollaborationRequest(requestId, 'rejected', projectId));
            alert('So\'rov muvaffaqiyatli rad etildi.');
        } catch (error) {
            alert(`Xato: ${error.message}`);
        }
    }, [projectId, dispatch, isActionLoading]);

    // O'chirish (Collaboratorlarni o'chirish)
    const removeCollaborator = useCallback((collaboratorId) => {
        // ... (Bu yerda ProjectCollaboration ob'ektini o'chirish Thunk'i chaqirilishi kerak)
        alert('Hamkor loyihadan olib tashlandi.');
    }, []);


    // =============================================================
    // MODAL COMPONENTS
    // =============================================================

    const JoinModal = ({ show, onClose, onSend }) => {
        if (!show) return null;
        return (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
                <div onClick={(e) => e.stopPropagation()} className="bg-dark-bg-secondary border border-gray-700 rounded-xl p-8 max-w-lg w-full shadow-2xl space-y-6">
                    <h3 className="text-2xl font-bold text-white text-center">Loyiha Hamkorligi So'rovi</h3>
                    {joinRequestError && ( 
                         <div className="bg-red-900/50 border border-red-700 text-red-300 p-3 rounded-md text-sm">
                            <i className="fas fa-exclamation-circle mr-2"></i> {joinRequestError}
                        </div>
                    )}
                    <div>
                        <label htmlFor="role" className="block text-gray-300 text-sm font-medium mb-2">Sizning rolingiz:</label>
                        <select 
                            id="role" 
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="" disabled>Rolni tanlang</option>
                            {COLLABORATION_ROLES.map(role => ( 
                                <option key={role.value} value={role.value}>{role.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="comment" className="block text-gray-300 text-sm font-medium mb-2">Qo'shimcha izoh (ixtiyoriy):</label>
                        <textarea 
                            id="comment" 
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows="4" 
                            className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                            placeholder="Qanday yordam bera olishingizni yozing..."
                        ></textarea>
                    </div>
                    <div className="flex justify-end gap-3">
                        <button onClick={onClose} disabled={isActionLoading} className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50">Bekor qilish</button>
                        <button 
                            onClick={onSend} 
                            disabled={!selectedRole || isActionLoading} 
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <i className={`fas ${isActionLoading ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`}></i> {isActionLoading ? 'Yuborilmoqda...' : 'So\'rov yuborish'}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const ManageCollaboratorsModal = ({ show, onClose }) => {
        if (!show) return null;

        return (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
                <div onClick={(e) => e.stopPropagation()} className="bg-dark-bg-secondary border border-gray-700 rounded-xl p-8 max-w-2xl w-full shadow-2xl space-y-6">
                    <h3 className="text-2xl font-bold text-white text-center">Hamkorlarni boshqarish</h3>
                    <div className="flex border-b border-gray-700">
                        <button onClick={() => setActiveTab('requests')} className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === 'requests' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}>
                            So'rovlar ({isLoading ? '...' : pendingRequests.length})
                        </button>
                        <button onClick={() => setActiveTab('collaborators')} className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === 'collaborators' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}>
                            Mavjud Hamkorlar ({currentCollaborators.length})
                        </button>
                    </div>

                    {activeTab === 'requests' && (
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                            {isLoading && <p className="text-center text-indigo-400 py-4"><i className="fas fa-spinner fa-spin"></i> So'rovlar yuklanmoqda...</p>}
                            {error && <p className="text-center text-red-500 py-4"><i className="fas fa-exclamation-triangle"></i> Xato: {error}</p>}
                            
                            {!isLoading && pendingRequests.length === 0 && (
                                <p className="text-gray-400 text-center py-4">Hozircha yangi hamkorlik so'rovlari yo'q.</p>
                            )}

                            {!isLoading && pendingRequests.length > 0 && (
                                pendingRequests.map(request => (
                                    <div key={request.id} className="flex items-center justify-between bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                                        <div className="flex items-center gap-3">
                                            <img src={request.user?.image || UserImage} className="w-10 h-10 rounded-full" alt={request.user?.username} />
                                            <div>
                                                <p className="font-bold text-white">{getFullNameOrUsername(request.user)}</p> {/* ✅ getFullNameOrUsername ishlatildi */}
                                                <p className="text-sm text-gray-400">{getRoleLabel(request?.role)}</p> 
                                                {request?.message && <p className="text-xs text-gray-500 mt-1">{request?.message}</p>}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => acceptRequest(request.id)} 
                                                disabled={isActionLoading}
                                                className="bg-green-600 hover:bg-green-700 text-white py-1.5 px-3 rounded-md text-sm transition-colors disabled:opacity-50"
                                            >
                                                <i className={`fas ${isActionLoading ? 'fa-spinner fa-spin' : 'fa-check'}`}></i> Qabul
                                            </button>
                                            <button 
                                                onClick={() => rejectRequest(request.id)} 
                                                disabled={isActionLoading}
                                                className="bg-red-600 hover:bg-red-700 text-white py-1.5 px-3 rounded-md text-sm transition-colors disabled:opacity-50"
                                            >
                                                <i className={`fas ${isActionLoading ? 'fa-spinner fa-spin' : 'fa-times'}`}></i> Rad
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'collaborators' && (
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                            {collaboratorsLoading && <p className="text-center text-indigo-400 py-4"><i className="fas fa-spinner fa-spin"></i> Hamkorlar yuklanmoqda...</p>} 
                            
                            {!collaboratorsLoading && currentCollaborators.length === 0 ? (
                                <p className="text-gray-400 text-center py-4">Hozircha hamkorlar yo'q.</p>
                            ) : (
                                currentCollaborators.map(collaborator => (
                                    <div key={collaborator.id} className="flex items-center justify-between bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                                        <div className="flex items-center gap-3">
                                            <img src={collaborator.user?.image ?? UserImage } className="w-12 h-12 rounded-full" alt={collaborator.user?.username} />
                                            <div>
                                                <p className="font-bold text-white">{getFullNameOrUsername(collaborator.user)}</p> {/* ✅ getFullNameOrUsername ishlatildi */}
                                                <p className="text-sm text-gray-400">{getRoleLabel(collaborator?.role)}</p> 
                                            </div>
                                        </div>
                                        <div>
                                            <button onClick={() => removeCollaborator(collaborator.id)} className="bg-red-600/20 text-red-300 hover:text-red-400 py-1 px-2 rounded-md text-xs transition-colors">
                                                <i className="fas fa-trash-alt"></i> O'chirish
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    <div className="flex justify-end">
                        <button onClick={onClose} className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">Yopish</button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            {/* Loyiha Jamoasi Bo'limi - Asosiy Rendering */}
            <section className="p-6 md:p-10 border-t border-gray-700/50">
                <h2 className="text-2xl font-bold text-white mb-6">Loyiha Jamoasi ({currentCollaborators.length + 1})</h2>
                {collaboratorsLoading && <p className="text-center text-indigo-400 py-4"><i className="fas fa-spinner fa-spin"></i> Hamkorlar yuklanmoqda...</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Project Owner */}
                    <div className="flex items-center gap-3 bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <img src={projectOwner.image || UserImage} className="w-12 h-12 rounded-full object-cover" alt="Project Owner" />
                        <div>
                            {/* ✅ Project Owner uchun ham getFullNameOrUsername ishlatildi */}
                            <p className="font-bold text-white">{getFullNameOrUsername(projectOwner)}</p> 
                            <p className="text-sm text-gray-400 flex items-center gap-1"><i className="fas fa-crown text-yellow-500"></i> Project Owner</p>
                        </div>
                    </div>
                    {/* Collaborators */}
                    {!collaboratorsLoading && currentCollaborators.map(collaborator => (
                        <div key={collaborator.id} className="flex items-center gap-3 bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                            <img src={collaborator.user?.image ?? UserImage } className="w-12 h-12 rounded-full" alt={collaborator.user?.username} />
                            <div>
                                {/* ✅ getFullNameOrUsername ishlatildi */}
                                <p className="font-bold text-white">{getFullNameOrUsername(collaborator.user)}</p> 
                                <p className="text-sm text-gray-400">{getRoleLabel(collaborator?.role)}</p> 
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Collaboration Buttons (Sidebar uchun) */}
            <div className="space-y-3 mt-8">
                {/* Loyihaga qo'shilish tugmasi */}
                {!isOwner && !hasSentRequest && !isCollaborator && (
                    <button onClick={() => setShowJoinModal(true)} disabled={isActionLoading} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <i className={`fas ${isActionLoading ? 'fa-spinner fa-spin' : 'fa-user-plus'}`}></i> Loyihaga qo'shilish
                    </button>
                )}

                {/* So'rov kutilmoqda tugmasi */}
                {!isOwner && hasSentRequest && !isCollaborator && (
                    <button disabled className="w-full flex items-center justify-center gap-2 bg-gray-700 text-gray-400 font-semibold py-3 px-5 rounded-lg cursor-not-allowed">
                        <i className="fas fa-hourglass-half"></i> So'rov kutilmoqda...
                    </button>
                )}

                {/* Siz hamkorsiz tugmasi */}
                {!isOwner && isCollaborator && (
                    <div className="w-full flex items-center justify-center gap-2 bg-green-600/20 text-green-300 font-semibold py-3 px-5 rounded-lg">
                        <i className="fas fa-check-circle"></i> Siz hamkorsiz!
                    </div>
                )}

                {/* Hamkorlarni boshqarish tugmasi (faqat owner uchun) */}
                {isOwner && (
                    <button onClick={() => setShowManageModal(true)} className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-5 rounded-lg transition-colors">
                        <i className="fas fa-users-cog"></i> Hamkorlarni boshqarish ({isLoading ? '...' : pendingRequests.length})
                    </button>
                )}
            </div>

            {/* Modals */}
            <JoinModal 
                show={showJoinModal} 
                onClose={() => {
                    setShowJoinModal(false); 
                    setJoinRequestError(null); 
                }} 
                onSend={sendJoinRequest} 
            />
            
            <ManageCollaboratorsModal 
                show={showManageModal} 
                onClose={() => setShowManageModal(false)} 
            />
        </>
    );
};

export default ProjectCollaboration;