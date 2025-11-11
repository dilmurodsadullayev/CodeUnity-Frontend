// ProjectCollaboration.jsx
import React, { useState, useCallback } from 'react';
import UserImage from '../assests/userImage.jpeg'; // Profil rasmi yo'q bo'lsa

const ProjectCollaboration = ({ 
    currentCollaborators: initialCollaborators, 
    pendingRequests: initialRequests, 
    projectOwner, 
    isOwner, 
    isCollaborator, 
    hasSentRequest 
}) => {
    // Hamkorlik logikasi uchun state'lar
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState('');
    const [comment, setComment] = useState('');
    
    const [showManageModal, setShowManageModal] = useState(false);
    const [activeTab, setActiveTab] = useState('requests');
    
    // DEMO uchun ichki state
    const [pendingRequests, setPendingRequests] = useState(initialRequests);
    const [currentCollaborators, setCurrentCollaborators] = useState(initialCollaborators);


    // =============================================================
    // HANDLERS
    // =============================================================

    const sendJoinRequest = useCallback(() => {
        if (!selectedRole) return;
        
        // Aslida bu yerda backendga so'rov yuboriladi
        console.log('So\'rov yuborildi:', selectedRole, comment);
        
        // Bu yerda hasSentRequest state'ini global (Redux) da yangilash lozim

        setShowJoinModal(false);
        setSelectedRole('');
        setComment('');
        
        alert('Hamkorlik so\'rovingiz muvaffaqiyatli yuborildi va tasdiqlash kutilmoqda!');
    }, [selectedRole, comment]);

    const acceptRequest = useCallback((requestId) => {
        const reqIndex = pendingRequests.findIndex(req => req.id === requestId);
        if (reqIndex !== -1) {
            const acceptedReq = pendingRequests[reqIndex];
            setPendingRequests(prev => prev.filter(req => req.id !== requestId));
            setCurrentCollaborators(prev => [...prev, {
                id: acceptedReq.id,
                user: acceptedReq.user,
                role: acceptedReq.role,
                avatar: acceptedReq.avatar
            }]);
            alert(`${acceptedReq.user} loyihaga hamkor sifatida qo'shildi!`);
        }
    }, [pendingRequests]);

    const rejectRequest = useCallback((requestId) => {
        setPendingRequests(prev => prev.filter(req => req.id !== requestId));
        alert('So\'rov rad etildi.');
    }, []);

    const removeCollaborator = useCallback((collaboratorId) => {
        setCurrentCollaborators(prev => prev.filter(col => col.id !== collaboratorId));
        alert('Hamkor loyihadan olib tashlandi.');
    }, []);

    // =============================================================
    // MODAL COMPONENTS
    // =============================================================

    const JoinModal = ({ show, onClose, onSend }) => {
        if (!show) return null;
        // ... (JoinModal JSX-i ProjectDetail.jsx dan o'zgarishsiz olinadi) ...
        return (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
                <div onClick={(e) => e.stopPropagation()} className="bg-dark-bg-secondary border border-gray-700 rounded-xl p-8 max-w-lg w-full shadow-2xl space-y-6">
                    <h3 className="text-2xl font-bold text-white text-center">Loyiha Hamkorligi So'rovi</h3>
                    <div>
                        <label htmlFor="role" className="block text-gray-300 text-sm font-medium mb-2">Sizning rolingiz:</label>
                        <select 
                            id="role" 
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="" disabled>Rolni tanlang</option>
                            <option value="frontend">Frontend Developer</option>
                            <option value="backend">Backend Developer</option>
                            <option value="designer">Designer</option>
                            <option value="qa">QA Engineer</option>
                            <option value="devops">DevOps Engineer</option>
                            <option value="other">Boshqa</option>
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
                        <button onClick={onClose} className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">Bekor qilish</button>
                        <button 
                            onClick={onSend} 
                            disabled={!selectedRole} 
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            So'rov yuborish
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const ManageCollaboratorsModal = ({ show, onClose }) => {
        if (!show) return null;
        // ... (ManageCollaboratorsModal JSX-i ProjectDetail.jsx dan o'zgarishsiz olinadi) ...
        return (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
                <div onClick={(e) => e.stopPropagation()} className="bg-dark-bg-secondary border border-gray-700 rounded-xl p-8 max-w-2xl w-full shadow-2xl space-y-6">
                    <h3 className="text-2xl font-bold text-white text-center">Hamkorlarni boshqarish</h3>
                    <div className="flex border-b border-gray-700">
                        <button onClick={() => setActiveTab('requests')} className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === 'requests' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}>
                            So'rovlar ({pendingRequests.length})
                        </button>
                        <button onClick={() => setActiveTab('collaborators')} className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === 'collaborators' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}>
                            Mavjud Hamkorlar ({currentCollaborators.length})
                        </button>
                    </div>

                    {activeTab === 'requests' && (
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                            {pendingRequests.length === 0 ? (
                                <p className="text-gray-400 text-center py-4">Hozircha yangi hamkorlik so'rovlari yo'q.</p>
                            ) : (
                                pendingRequests.map(request => (
                                    <div key={request.id} className="flex items-center justify-between bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                                        <div className="flex items-center gap-3">
                                            <img src={request.avatar} className="w-10 h-10 rounded-full" alt={request.user} />
                                            <div>
                                                <p className="font-bold text-white">{request.user}</p>
                                                <p className="text-sm text-gray-400">{request.role}</p>
                                                {request.comment && <p className="text-xs text-gray-500 mt-1">{request.comment}</p>}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => acceptRequest(request.id)} className="bg-green-600 hover:bg-green-700 text-white py-1.5 px-3 rounded-md text-sm transition-colors">
                                                <i className="fas fa-check"></i> Qabul
                                            </button>
                                            <button onClick={() => rejectRequest(request.id)} className="bg-red-600 hover:bg-red-700 text-white py-1.5 px-3 rounded-md text-sm transition-colors">
                                                <i className="fas fa-times"></i> Rad
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'collaborators' && (
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                            {currentCollaborators.length === 0 ? (
                                <p className="text-gray-400 text-center py-4">Hozircha hamkorlar yo'q.</p>
                            ) : (
                                currentCollaborators.map(collaborator => (
                                    <div key={collaborator.id} className="flex items-center justify-between bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                                        <div className="flex items-center gap-3">
                                            <img src={collaborator.avatar} className="w-10 h-10 rounded-full" alt={collaborator.user} />
                                            <div>
                                                <p className="font-bold text-white">{collaborator.user}</p>
                                                <p className="text-sm text-gray-400">{collaborator.role}</p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Project Owner */}
                    <div className="flex items-center gap-3 bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <img src={projectOwner.image || UserImage} className="w-12 h-12 rounded-full object-cover" alt="Project Owner" />
                        <div>
                            <p className="font-bold text-white">{`${projectOwner.first_name || ''} ${projectOwner.last_name || projectOwner.username}`}</p>
                            <p className="text-sm text-gray-400 flex items-center gap-1"><i className="fas fa-crown text-yellow-500"></i> Project Owner</p>
                        </div>
                    </div>
                    {/* Collaborators */}
                    {currentCollaborators.map(collaborator => (
                        <div key={collaborator.id} className="flex items-center gap-3 bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                            <img src={collaborator.avatar} className="w-12 h-12 rounded-full" alt={collaborator.user} />
                            <div>
                                <p className="font-bold text-white">{collaborator.user}</p>
                                <p className="text-sm text-gray-400">{collaborator.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Collaboration Buttons (Sidebar uchun) */}
            <div className="space-y-3 mt-8">
                {/* Loyihaga qo'shilish tugmasi */}
                {!isOwner && !hasSentRequest && !isCollaborator && (
                    <button onClick={() => setShowJoinModal(true)} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-5 rounded-lg transition-colors">
                        <i className="fas fa-user-plus"></i> Loyihaga qo'shilish
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
                        <i className="fas fa-users-cog"></i> Hamkorlarni boshqarish
                    </button>
                )}
            </div>

            {/* Modals */}
            <JoinModal 
                show={showJoinModal} 
                onClose={() => setShowJoinModal(false)} 
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