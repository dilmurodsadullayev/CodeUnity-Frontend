import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { boostProjectStart, boostProjectSuccess, boostProjectFailure } from '../features/projects';
import { signUserSuccess } from '../features/auth/Auth'; // Balansni yangilash uchun
import ProjectService from '../services/project';

const ProjectBoost = ({ projectId, userCoins, projectName }) => {
    const dispatch = useDispatch();
    const [selectedPlan, setSelectedPlan] = useState('premium');
    const { isBoosting } = useSelector(state => state.project);
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    const boostPlans = [
        { id: 'basic', name: 'Lite Boost', icon: '🚀', price: 50, duration: '24 Soat', color: 'from-blue-500 to-cyan-400', shadow: 'shadow-blue-500/20' },
        { id: 'premium', name: 'Pro Boost', icon: '💎', price: 150, duration: '3 Kun', color: 'from-indigo-600 to-purple-600', shadow: 'shadow-purple-500/30', popular: true },
        { id: 'ultra', name: 'Ultra King', icon: '🔥', price: 400, duration: '7 Kun', color: 'from-orange-500 to-red-600', shadow: 'shadow-orange-500/40' }
    ];

    const handleBoostAction = async () => {
        setErrorMsg(null);
        dispatch(boostProjectStart());

        try {
            const response = await ProjectService.boostProject(projectId, selectedPlan);
            
            // 1. Redux success
            dispatch(boostProjectSuccess({
                project_id: projectId,
                boost_expires_at: response.boost_expires_at
            }));

            // 2. User balansini yangilash
            // AuthService orqali userni qayta olish yoki shunchaki balansni ayirish
            // response ichida yangi balans kelishi kerak (Backendga qarang)
            if(response.new_balance !== undefined) {
                // Auth state-ni yangilash kodi (sizda qandayligiga qarab)
            }

            setSuccess(true);
        } catch (err) {
            const message = err.detail || "Xatolik yuz berdi";
            setErrorMsg(message);
            dispatch(boostProjectFailure(message));
        }
    };

    if (success) {
        return (
            <div className="bg-dark-bg-secondary border border-green-500/30 p-8 rounded-2xl text-center">
                <i className="fas fa-check-circle text-4xl text-green-500 mb-4"></i>
                <h2 className="text-xl font-bold text-white mb-2">Muvaffaqiyatli!</h2>
                <p className="text-gray-400 text-sm mb-6">Loyihangiz muvaffaqiyatli quvvatlantirildi.</p>
                <button onClick={() => window.location.reload()} className="px-6 py-2 bg-indigo-600 text-white rounded-lg">Davom etish</button>
            </div>
        );
    }

    return (
        <div className="bg-dark-bg-secondary/50 border border-white/10 backdrop-blur-xl rounded-2xl p-6 mb-8">
            <div className="relative z-10 mb-6 flex items-start justify-between gap-2">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <i className="fas fa-bolt text-yellow-400 animate-pulse"></i>
                    <span>Loyihani <br/> Quvvatlantirish</span>
                </h2>
                <div className="flex-shrink-0 bg-white/5 border border-white/10 px-3 py-2 rounded-xl backdrop-blur-md flex flex-col items-end">
                    <span className="text-[9px] text-gray-400 uppercase font-bold tracking-tighter">Balansingiz</span>
                    <div className="flex items-center gap-1.5">
                        <i className="fas fa-coins text-yellow-500 text-sm"></i>
                        <span className="text-white font-black text-base">{userCoins}</span>
                    </div>
                </div>
            </div>

            {errorMsg && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-xs text-center">
                    <i className="fas fa-exclamation-triangle mr-2"></i> {errorMsg}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {boostPlans.map((plan) => (
                    <div 
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan.id)}
                        className={`relative cursor-pointer transition-all duration-500 rounded-2xl border-2 p-4 ${
                            selectedPlan === plan.id 
                            ? `border-transparent bg-gradient-to-b ${plan.color} ${plan.shadow}` 
                            : 'border-white/5 bg-white/5 hover:bg-white/10'
                        }`}
                    >
                        <div className="flex flex-col h-full text-left">
                            <span className="text-2xl mb-2">{plan.icon}</span>
                            <h3 className="font-bold text-sm text-white">{plan.name}</h3>
                            <p className="text-xl font-black text-white mb-2">{plan.price} <span className="text-[10px] opacity-70">coin</span></p>
                            <ul className="text-[10px] text-white/80 space-y-1">
                                <li><i className="fas fa-clock mr-1"></i> {plan.duration}</li>
                            </ul>
                        </div>
                    </div>
                ))}
            </div>

            <button
                disabled={isBoosting}
                onClick={handleBoostAction}
                className="w-full py-4 rounded-xl font-black text-lg bg-white text-gray-900 hover:scale-[1.02] transition-all disabled:bg-gray-700 disabled:text-gray-500"
            >
                {isBoosting ? <i className="fas fa-spinner animate-spin"></i> : "BOOST QILISH"}
            </button>
        </div>
    );
};

export default ProjectBoost;