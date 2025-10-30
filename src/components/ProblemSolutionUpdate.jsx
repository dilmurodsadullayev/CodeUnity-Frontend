import React, { useState, useEffect, useRef } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/themes/prism-dark.css';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
// Agar boshqa tillarni qo'shmoqchi bo'lsangiz, bu yerga import qiling:
// import 'prismjs/components/prism-python';
// import 'prismjs/components/prism-java';

import ProblemResponseService from '../services/problemResponse';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { useNavigate, useParams } from 'react-router-dom';

const ProblemSolutionUpdate = () => {
    const { solutionId } = useParams();
    const { id } = useParams();

    const [shortInfo, setShortInfo] = useState('');
    const [description, setDescription] = useState('');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const defaultLanguage = 'javascript';
    const isMounted = useRef(true);
    const navigate = useNavigate();

    useEffect(() => {
        isMounted.current = true;

        const fetchSolution = async () => {
            if (!solutionId) {
                setLoading(false);
                setError("Yechim IDsi taqdim etilmagan.");
                return;
            }
            try {
                const data = await ProblemResponseService.getSolutionById(solutionId);
                if (isMounted.current) {
                    setShortInfo(data.answer || '');
                    setDescription(data.description || '');
                    setCode(data.code || '');
                    setLoading(false);
                }
            } catch (err) {
                if (isMounted.current) {
                    console.error("Yechimni yuklashda xatolik:", err);
                    setError("Yechimni yuklashda xatolik yuz berdi.");
                    setLoading(false);
                }
            }
        };

        fetchSolution();

        return () => {
            isMounted.current = false;
        };
    }, [solutionId]);

    const highlightCode = (codeToHighlight) => {
        const grammar = languages[defaultLanguage] || languages.clike || {};
        return highlight(codeToHighlight, grammar, defaultLanguage);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!shortInfo || !description) {
            alert("Iltimos, qisqa ma'lumot va tavsif maydonlarini to'ldiring.");
            return;
        }
        const updatedSolutionData = {
            answer: shortInfo,
            description: description,
            code: code,
            // language: defaultLanguage,
        };

        try {
            await ProblemResponseService.updateSolution(solutionId, updatedSolutionData);
            alert('Yechim muvaffaqiyatli yangilandi!');
            navigate(`/problem/${id}/detail`);
        } catch (error) {
            console.error("Yechimni yangilashda xatolik yuz berdi:", error);
            alert("Yechimni yangilashda xatolik yuz berdi!");
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            await ProblemResponseService.deleteSolution(solutionId);
            alert('Yechim muvaffaqiyatli o‘chirildi!');
            setIsDeleteModalOpen(false);
            navigate(`/problem/${id}/detail`);
        } catch (error) {
            console.error("Yechimni o'chirishda xatolik yuz berdi:", error);
            alert("Yechimni o'chirishda xatolik yuz berdi!");
            setIsDeleteModalOpen(false);
        }
    };

    const handleCancel = () => {
        navigate(`/problem/${id}/detail`);
    };

    if (loading) {
        return <div className="text-white text-center text-xl mt-10">Yuklanmoqda...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center text-xl mt-10">{error}</div>;
    }

    return (
        <section className="mt-10 animate-fade-in-up flex justify-center" style={{ animationDelay: '0.7s' }}>
            <div className="w-full max-w-4xl"> {/* Bu yerda max-w-4xl va justify-center qo'shildi */}
                <h2 className="text-2xl font-bold text-white mb-4">Yechimni Yangilash</h2>
                <form onSubmit={handleUpdate} className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 space-y-6">
                    <div>
                        <label htmlFor="shortInfo" className="block text-lg font-medium text-white mb-2">
                            Qisqa ma'lumot <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="shortInfo"
                            type="text"
                            className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            placeholder="Yechimning qisqa tavsifi"
                            value={shortInfo}
                            onChange={(e) => setShortInfo(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-lg font-medium text-white mb-2">
                            Tavsif <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="description"
                            className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            rows="5"
                            placeholder="Muammoning yechimini to'liq tushuntiring..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <div>
                        <label htmlFor="code" className="block text-lg font-medium text-white mb-2">
                            Kod (ixtiyoriy)
                        </label>
                        <Editor
                            value={code}
                            onValueChange={setCode}
                            highlight={highlightCode}
                            padding={10}
                            textareaClassName="focus:outline-none"
                            preClassName="rounded-md overflow-auto border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            style={{
                                fontFamily: '"Fira code", "Fira Mono", monospace',
                                fontSize: 14,
                                backgroundColor: '#1a202c',
                                color: '#ffffff',
                                height: '200px',
                                overflowY: 'auto',
                            }}
                        />
                    </div>

                    <div className="flex justify-between items-center mt-6">
                        <button
                            type="button"
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                            Yechimni O'chirish
                        </button>
                        <div className="flex space-x-4">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2.5 px-6 rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                            >
                                Bekor Qilish
                            </button>
                            <button
                                type="submit"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                            >
                                Yangilash
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                itemTitle={shortInfo || "Bu yechim"}
            />
        </section>
    );
};

export default ProblemSolutionUpdate;