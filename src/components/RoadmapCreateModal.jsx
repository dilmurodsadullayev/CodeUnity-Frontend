import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    createRoadMapStart, createRoadMapSuccess, createRoadMapFailure,
    updateRoadMapStart, updateRoadMapSuccess, updateRoadMapFailure
} from '../features/roadmap';
import RoadmapService from '../services/roadmap';

const selectRoadmapState = (state) => state.roadmap;

// 'initialData' prop'i: agar tahrirlash rejimi bo'lsa, mavjud roadmap obyekti
const RoadmapFormModal = ({ isOpen, onClose, username, initialData = null }) => {
    const dispatch = useDispatch();
    const isEditMode = !!initialData; // initialData mavjud bo'lsa, tahrirlash rejimi

    const { 
        isCreating, createError, 
        isUpdating, updateError 
    } = useSelector(selectRoadmapState);
    
    // Yuborilayotgan holatni va xatoni tanlash
    const isSubmitting = isEditMode ? isUpdating : isCreating;
    const currentError = isEditMode ? updateError : createError;

    // Default bo'sh holat
    const defaultFormData = {
        title: '',
        type: 'learning',
        description: '',
        started_at: '',
        finished_at: ''
    };

    const [formData, setFormData] = useState(defaultFormData);

    // initialData o'zgarganda (ya'ni modal tahrirlash uchun ochilganda) formani to'ldirish
    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                type: initialData.type || 'learning',
                description: initialData.description || '',
                // Sanani YYYY-MM-DD formatida olish
                started_at: initialData.started_at || '',
                finished_at: initialData.finished_at || ''
            });
        } else {
            // Yaratish rejimi bo'lsa formani tozalash
            setFormData(defaultFormData);
        }
    }, [initialData, isOpen]); // isOpen ham o'zgarishini kuzatamiz

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Dispatch start action
        isEditMode ? dispatch(updateRoadMapStart()) : dispatch(createRoadMapStart());

        try {
            const dataToSend = {
                ...formData,
                description: formData.description || null,
                // finished_at agar bo'sh string bo'lsa, null ga o'zgartirish
                finished_at: formData.finished_at || null,
            };

            let response;
            if (isEditMode) {
                // UPDATE amali (PATCH so'rovi)
                response = await RoadmapService.updateRoadmap(username, initialData.id, dataToSend);
                dispatch(updateRoadMapSuccess(response));
            } else {
                // CREATE amali (POST so'rovi)
                response = await RoadmapService.createRoadmap(username, dataToSend);
                dispatch(createRoadMapSuccess(response));
                setFormData(defaultFormData); // Yaratishdan keyin formani tozalash
            }

            onClose(); // Muvaqqiyatli bo'lsa modalni yopish

        } catch (err) {
            console.error("Roadmap amalida xato:", err.response?.data || err.message);
            
            // Xato xabarini aniqlash (Backend xato xabarini olishga harakat qilish)
            const errorData = err.response?.data;
            let errorMessage = errorData?.detail || errorData?.title?.[0] || err.message || "Xato yuz berdi.";
            
            isEditMode ? dispatch(updateRoadMapFailure(errorMessage)) : dispatch(createRoadMapFailure(errorMessage));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
            <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-md border border-gray-700">
                <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">
                        {isEditMode ? "Yo'l Xaritasini Tahrirlash" : "Yangi Yo'l Xaritasi Qo'shish"}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <i className="fa-solid fa-xmark text-xl"></i>
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6">
                    {/* Xato xabari */}
                    {currentError && (
                        <div className="bg-red-900/50 text-red-300 p-3 rounded mb-4 text-sm border border-red-700">
                            {currentError}
                        </div>
                    )}

                    {/* ... (Qolgan barcha form maydonlari avvalgidek qoladi) ... */}
                    
                    {/* Title */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="title">Sarlavha</label>
                        <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500" maxLength={255} />
                    </div>
                    
                    {/* Type */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="type">Tur</label>
                        <select id="type" name="type" value={formData.type} onChange={handleChange} required className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="learning">O'rganish (Learning)</option>
                            <option value="experience">Tajriba (Experience)</option>
                        </select>
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="description">Qo‘shimcha izoh (ixtiyoriy)</label>
                        <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                    </div>
                    
                    {/* Started At */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="started_at">Boshlangan sana</label>
                        <input type="date" id="started_at" name="started_at" value={formData.started_at} onChange={handleChange} required className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    
                    {/* Finished At (ixtiyoriy) */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="finished_at">Tugagan sana (ixtiyoriy)</label>
                        <input type="date" id="finished_at" name="finished_at" value={formData.finished_at} onChange={handleChange} className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>

                    {/* Tugma */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? <i className="fa-solid fa-spinner fa-spin mr-2"></i> : null}
                        {isEditMode 
                            ? (isSubmitting ? "Yangilanmoqda..." : "Yangilash")
                            : (isSubmitting ? "Yaratilmoqda..." : "Saqlash")
                        }
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RoadmapFormModal;