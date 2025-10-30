import React, { useEffect, useState } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-css";
import { useDispatch, useSelector } from 'react-redux';
import { getLanguagesStart, getLanguagesSuccess, getProblemDetailSuccess } from '../features/problems/Problems';
import ProblemService from '../services/problems';
import { useNavigate, useParams } from 'react-router-dom';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const ProblemCreate = () => {
    const dispatch = useDispatch();
    const [problemTitle, setProblemTitle] = useState('');
    const [description, setDescription] = useState('');
    const [codeSnippet, setCodeSnippet] = useState('');
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [editorLanguage, setEditorLanguage] = useState('javascript');
    const { id } = useParams();
    const navigate = useNavigate();

    const { languages: availableLanguages, isLoading } = useSelector((state) => state.problem);
    const { problemDetail } = useSelector(state => state.problem);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // YANGI: Modal holati

    // Fetch available languages
    const fetchLanguages = async () => {
        dispatch(getLanguagesStart());
        try {
            const response = await ProblemService.getLanguagesList();
            dispatch(getLanguagesSuccess(response));
        } catch (error) {
            console.error("Dasturlash tillarini olishda xatolik yuz berdi:", error);
        }
    };

    // Fetch problem details if in edit mode
    const fetchProblemDetail = async (problemId) => {
        try {
            const response = await ProblemService.getProblemDetail(problemId);
            dispatch(getProblemDetailSuccess(response));

            setProblemTitle(response.problem);
            setDescription(response.description);
            setCodeSnippet(response.code || '');

            // Tanlangan tillarni sozlash
            if (response.language_data && response.language_data.length > 0 && availableLanguages.length > 0) {
                const initialSelected = availableLanguages.filter(lang =>
                    response.language_data.some(pdLang => pdLang.id === lang.id)
                );
                setSelectedLanguages(initialSelected);

                // Editor tilini sozlash
                if (initialSelected.length > 0) {
                    const firstLangName = initialSelected[0].name.toLowerCase();
                    if (languages[firstLangName]) {
                        setEditorLanguage(firstLangName);
                    } else {
                        setEditorLanguage('clike'); // Agar tanlangan til PrimsJS'da bo'lmasa, default clike
                    }
                }
            } else if (!response.language_data || response.language_data.length === 0) {
                // Agar til ma'lumotlari yo'q bo'lsa, editor tilini defaultga qaytarish
                setEditorLanguage('javascript');
                setSelectedLanguages([]);
            }

        } catch (error) {
            console.error("Muammo ma'lumotlarini olishda xatolik yuz berdi:", error);
            alert("Muammo ma'lumotlarini yuklashda xatolik yuz berdi!");
            navigate("/problems");
        }
    };

    useEffect(() => {
        fetchLanguages();
    }, []);

    useEffect(() => {
        if (id && availableLanguages.length > 0) {
            fetchProblemDetail(id);
        } else if (!id) {
            // Agar create mode bo'lsa, formani tozalash
            setProblemTitle('');
            setDescription('');
            setCodeSnippet('');
            setSelectedLanguages([]);
            setEditorLanguage('javascript');
        }
    }, [id, availableLanguages]);

    const handleLanguageChange = (language) => {
        setSelectedLanguages((prev) => {
            const isAlreadySelected = prev.some(sLang => sLang.id === language.id);
            const newSelected = isAlreadySelected
                ? prev.filter((lang) => lang.id !== language.id)
                : [...prev, language];

            // Agar yangi tanlangan tillar ro'yxatida birinchi til bo'lsa, editor tilini o'zgartirish
            if (newSelected.length > 0) {
                const firstLangName = newSelected[0].name.toLowerCase();
                if (languages[firstLangName]) {
                    setEditorLanguage(firstLangName);
                } else {
                    setEditorLanguage('clike'); // Agar tanlangan til PrimsJS'da bo'lmasa, default clike
                }
            } else {
                setEditorLanguage('javascript'); // Agar hech qaysi til tanlanmagan bo'lsa, defaultga qaytarish
            }
            return newSelected;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedLanguages.length === 0) {
            alert("Iltimos, kamida bitta dasturlash tilini tanlang!");
            return;
        }

        const problemData = {
            problem: problemTitle,
            description: description,
            code: codeSnippet,
            // Backend `language` maydonini ID'lar ro'yxati sifatida kutyapti
            language: selectedLanguages.map(lang => lang.id),
        };

        try {
            if (id) {
                const response = await ProblemService.putProblem(id, problemData);
                console.log("Muammo muvaffaqiyatli yangilandi:", response);
                alert('Muammo muvaffaqiyatli yangilandi!');
            } else {
                const response = await ProblemService.postProblem(problemData);
                console.log("Muammo muvaffaqiyatli yaratildi:", response);
                alert('Muammo muvaffaqiyatli qo\'shildi!');
                setProblemTitle('');
                setDescription('');
                setCodeSnippet('');
                setSelectedLanguages([]);
                setEditorLanguage('javascript');
            }
            navigate("/problems");
        } catch (error) {
            console.error(`Muammoni ${id ? 'yangilashda' : 'yaratishda'} xatolik yuz berdi:`, error);
            alert(`Muammoni ${id ? 'yangilashda' : 'yaratishda'} xatolik yuz berdi!`);
        }
    };
    // YANGI: Muammoni o'chirish funksiyasi
    const handleDeleteConfirm = async () => {
        if (!id) return; // ID bo'lmasa o'chirish imkonsiz

        try {
            await ProblemService.deleteProblem(id);
            alert("Muammo muvaffaqiyatli o'chirildi!");
            setIsDeleteModalOpen(false); // Modalni yopish
            navigate("/problems"); // Muammolar ro'yxatiga qaytarish
        } catch (error) {
            console.error("Muammoni o'chirishda xatolik yuz berdi:", error);
            alert("Muammoni o'chirishda xatolik yuz berdi!");
            setIsDeleteModalOpen(false); // Modalni yopish
        }
    };

    const getHighlighter = (lang) => {
        if (languages[lang]) {
            return code => highlight(code, languages[lang], lang);
        }
        return code => highlight(code, languages.clike, 'clike');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
            <div className="bg-gray-800 rounded-2xl shadow-3xl p-6 sm:p-8 lg:p-10 w-full max-w-4xl border border-gray-700 transform transition-all duration-500 hover:border-purple-500 hover:shadow-neon-purple">
                <div className="mb-10 text-center">
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-indigo-500 mb-4 tracking-tight leading-tight">
                        {id ? (
                            <>
                                Muammoni Tahrirlash
                            </>
                        ) : (
                            <>
                                Yangi Dasturlash Muammosini Yarating
                            </>
                        )}
                    </h2>
                    <p className="text-gray-300 text-md sm:text-lg max-w-2xl mx-auto leading-relaxed opacity-90">
                        {id ? (
                            <>
                                <span className="text-fuchsia-400 font-semibold">"{problemDetail?.problem}"</span> muammosini tahrirlash.
                            </>
                        ) : (
                            <>
                                Dasturlash hamjamiyatiga o'zingiz duch kelgan qiziqarli muammoni qo'shing. Aniq tasvirlang va kerakli kod namunalarini taqdim eting.
                            </>
                        )}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <label htmlFor="problemTitle" className="block text-gray-100 text-base font-semibold mb-2">
                            Muammo Sarlavhasi <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            id="problemTitle"
                            className="w-full rounded-xl py-3 px-5 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-fuchsia-600 focus:border-fuchsia-500 transition duration-300 text-lg shadow-inner-dark"
                            placeholder="Muammoingizni qisqacha izohlang (Masalan: React Hooks bilan state muammosi)"
                            value={problemTitle}
                            onChange={(e) => setProblemTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-gray-100 text-base font-semibold mb-2">
                            Muammo Tavsifi <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            id="description"
                            rows="7"
                            className="w-full rounded-xl py-3 px-5 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-fuchsia-600 focus:border-fuchsia-500 transition duration-300 text-lg resize-y shadow-inner-dark"
                            placeholder="Muammoingizni batafsil tushuntiring, qanday holatlarda yuzaga kelishini, kutilgan natijani va sinab ko'rgan yechimlaringizni izohlang..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        ></textarea>
                        <p className="text-sm text-gray-400 mt-2 opacity-80">Bu yerga faqat matnli tavsifni kiriting. Kod uchun alohida maydon mavjud.</p>
                    </div>

                    <div>
                        <label htmlFor="codeSnippet" className="block text-gray-100 text-base font-semibold mb-2">
                            Kod Fragmenti (ixtiyoriy)
                        </label>
                        <div className="relative rounded-xl overflow-hidden border border-gray-600 focus-within:ring-4 focus-within:ring-fuchsia-600 transition duration-300 shadow-lg-code">
                            <Editor
                                value={codeSnippet}
                                onValueChange={setCodeSnippet}
                                highlight={getHighlighter(editorLanguage)}
                                padding={18}
                                style={{
                                    fontFamily: '"Fira code", "Fira Mono", monospace',
                                    fontSize: 17,
                                    backgroundColor: '#1e1e1e',
                                    color: '#d4d4d4',
                                    minHeight: '280px',
                                    borderRadius: '10px',
                                    lineHeight: '1.5',
                                }}
                                className="code-editor"
                            />
                        </div>
                        <p className="text-sm text-gray-400 mt-2 opacity-80">Kodingizni shu yerga joylashtiring. Sintaksis ranglari tanlangan tillar asosida ajratiladi.</p>
                    </div>

                    <div>
                        <label className="block text-gray-100 text-base font-semibold mb-2">
                            Dasturlash Tillari <span className="text-red-400">*</span>
                        </label>
                        {isLoading ? (
                            <p className="text-gray-400">Tillarni yuklash...</p>
                        ) : (
                            <div className="flex flex-wrap gap-4">
                                {availableLanguages && availableLanguages.length > 0 ? (
                                    availableLanguages.map((lang) => (
                                        <button
                                            key={lang.id}
                                            type="button"
                                            onClick={() => handleLanguageChange(lang)}
                                            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 shadow-md transform hover:-translate-y-1 hover:scale-105 ${
                                                selectedLanguages.some(sLang => sLang.id === lang.id)
                                                    ? 'bg-gradient-to-r from-indigo-600 to-pink-600 text-white border border-fuchsia-700 shadow-lg shadow-fuchsia-500/40'
                                                    : 'bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600 hover:border-gray-500 hover:text-white'
                                            }`}
                                        >
                                            {lang.name}
                                        </button>
                                    ))
                                ) : (
                                    <p className="text-gray-400">Dasturlash tillari topilmadi.</p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end space-x-4 pt-6">
                        {id && ( // Faqat tahrirlash rejimida o'chirish tugmasini ko'rsatish
                            <button
                                type="button"
                                onClick={() => setIsDeleteModalOpen(true)} // Modalni ochish
                                className="px-8 py-3 rounded-xl text-white font-semibold bg-red-600 hover:bg-red-700 transition-colors duration-300 border border-red-700 shadow-md hover:shadow-lg-red text-lg transform hover:-translate-y-0.5"
                            >
                                O'chirish
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => {
                                if (id && problemDetail) {
                                    setProblemTitle(problemDetail.problem);
                                    setDescription(problemDetail.description);
                                    setCodeSnippet(problemDetail.code || '');

                                    if (problemDetail.language_data && problemDetail.language_data.length > 0 && availableLanguages.length > 0) {
                                        const initialSelected = availableLanguages.filter(lang =>
                                            problemDetail.language_data.some(pdLang => pdLang.id === lang.id)
                                        );
                                        setSelectedLanguages(initialSelected);
                                        if (initialSelected.length > 0) {
                                            const firstLangName = initialSelected[0].name.toLowerCase();
                                            if (languages[firstLangName]) {
                                                setEditorLanguage(firstLangName);
                                            } else {
                                                setEditorLanguage('clike');
                                            }
                                        } else {
                                            setEditorLanguage('javascript');
                                        }
                                    } else {
                                        setSelectedLanguages([]);
                                        setEditorLanguage('javascript');
                                    }
                                } else {
                                    setProblemTitle('');
                                    setDescription('');
                                    setCodeSnippet('');
                                    setSelectedLanguages([]);
                                    setEditorLanguage('javascript');
                                }
                                alert('Forma o\'zgartirishlar bekor qilindi!');
                                navigate("/problems");
                            }}
                            className="px-8 py-3 rounded-xl text-gray-300 font-semibold bg-gray-700 hover:bg-gray-600 transition-colors duration-300 border border-gray-600 shadow-md hover:shadow-lg-gray text-lg transform hover:-translate-y-0.5"
                        >
                            Bekor Qilish
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-3 rounded-xl text-white font-bold bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-pink-500/50 transform hover:scale-105 hover:-translate-y-0.5 text-lg"
                        >
                            {id ? "Yangilash" : "Muammo Qo'shish"}
                        </button>
                    </div>
                </form>
            </div>
             <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                itemTitle={problemDetail?.problem || 'ushbu muammoni'} // O'chirilayotgan narsaning nomini ko'rsatish
            />
        </div>
    );
};

export default ProblemCreate;