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

// Yordamchi funksiya: Backend xatoliklarini o'qish uchun
const formatBackendErrors = (errorObject) => {
    // Agar ob'ekt bo'lsa (DRF validatsiya xatosi)
    if (errorObject && typeof errorObject === 'object' && !Array.isArray(errorObject)) {
        let errorMessage = "Quyidagi maydonlarda xatoliklar aniqlandi:\n";
        for (const key in errorObject) {
            if (errorObject.hasOwnProperty(key)) {
                const errorMessages = Array.isArray(errorObject[key]) ? errorObject[key].join(', ') : errorObject[key];
                
                // Xatolik sarlavhasini chiroyli formatlash
                let title = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');

                errorMessage += `[${title}]: ${errorMessages}\n`;
            }
        }
        return errorMessage.trim();
    } 
    // Agar plain text yoki HTML xatolik bo'lsa (500 xatosi)
    else if (typeof errorObject === 'string') {
        // HTML kontentini to'g'ridan-to'g'ri ko'rsatishdan saqlanish, lekin uni foydalanuvchiga debug uchun berish
        if (errorObject.includes('<!DOCTYPE html>')) {
             // Faqat title va exception_value ni ajratib olishga urinish
             const titleMatch = errorObject.match(/<title>(.*?)<\/title>/i);
             const exceptionMatch = errorObject.match(/<pre class="exception_value">(.*?)<\/pre>/i);
             
             let debugInfo = "Backend Server (500 Internal Error) Xatosi:\n";
             if (titleMatch && titleMatch[1]) {
                 debugInfo += `Sarlavha: ${titleMatch[1].trim()}\n`;
             }
             if (exceptionMatch && exceptionMatch[1]) {
                 debugInfo += `Exception: ${exceptionMatch[1].trim()}\n`;
             }
             debugInfo += "\nTo'liq server debug ma'lumotlari konsolda mavjud.";
             return debugInfo;
        }
        return errorObject;
    }
    
    return "Noma'lum server xatosi yuz berdi.";
};

const ProblemCreate = () => {
    const dispatch = useDispatch();
    const [problemTitle, setProblemTitle] = useState('');
    const [description, setDescription] = useState('');
    const [codeSnippet, setCodeSnippet] = useState('');
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [editorLanguage, setEditorLanguage] = useState('javascript');
    
    // YANGI STATE MAYDONLARI
    const [isUrgent, setIsUrgent] = useState(false);
    const [deadline, setDeadline] = useState('');
    const [offeredCoins, setOfferedCoins] = useState('');
    const [submissionError, setSubmissionError] = useState(null); // Xatolik xabari

    const { id } = useParams();
    const navigate = useNavigate();

    const { languages: availableLanguages, isLoading } = useSelector((state) => state.problem);
    const { problemDetail } = useSelector(state => state.problem);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

    const resetFormStates = () => {
        setProblemTitle('');
        setDescription('');
        setCodeSnippet('');
        setSelectedLanguages([]);
        setEditorLanguage('javascript');
        setIsUrgent(false);
        setDeadline('');
        setOfferedCoins('');
        setSubmissionError(null);
    }
    
    // Fetch problem details if in edit mode
    const fetchProblemDetail = async (problemId) => {
        setSubmissionError(null); 
        try {
            const response = await ProblemService.getProblemDetail(problemId);
            dispatch(getProblemDetailSuccess(response));

            setProblemTitle(response.problem);
            setDescription(response.description);
            setCodeSnippet(response.code || '');
            
            setIsUrgent(response.is_urgent || false);
            setOfferedCoins(response.offered_coins === null ? '' : response.offered_coins); 
            
            if (response.deadline) {
                try {
                    const date = new Date(response.deadline);
                    const formattedDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
                    setDeadline(formattedDate);
                } catch (e) {
                    console.error("Deadline formatlashda xatolik:", e);
                    setDeadline('');
                }
            } else {
                setDeadline('');
            }


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
                        setEditorLanguage('clike'); 
                    }
                }
            } else if (!response.language_data || response.language_data.length === 0) {
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
            resetFormStates();
        }
    }, [id, availableLanguages]);

    const handleLanguageChange = (language) => {
        setSelectedLanguages((prev) => {
            const isAlreadySelected = prev.some(sLang => sLang.id === language.id);
            const newSelected = isAlreadySelected
                ? prev.filter((lang) => lang.id !== language.id)
                : [...prev, language];

            if (newSelected.length > 0) {
                const firstLangName = newSelected[0].name.toLowerCase();
                if (languages[firstLangName]) {
                    setEditorLanguage(firstLangName);
                } else {
                    setEditorLanguage('clike'); 
                }
            } else {
                setEditorLanguage('javascript'); 
            }
            return newSelected;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmissionError(null); 

        if (selectedLanguages.length === 0) {
            setSubmissionError("Iltimos, kamida bitta dasturlash tilini tanlang!");
            return;
        }
        
        let finalDeadline = null;
        let finalOfferedCoins = null;

        // Tezkor muammo uchun validatsiya
        if (isUrgent) {
            if (!deadline) {
                setSubmissionError("Tezkor muammo uchun 'Deadline' maydoni talab qilinadi!");
                return;
            }
            const coins = parseInt(offeredCoins);
            if (!offeredCoins || isNaN(coins) || coins <= 0) {
                setSubmissionError("Tezkor muammo uchun 'Taklif etilayotgan Coinlar' maydoni musbat raqam bo'lishi kerak!");
                return;
            }
            
            finalDeadline = new Date(deadline).toISOString(); 
            finalOfferedCoins = coins;
        } else {
            // is_urgent false bo'lsa
            finalOfferedCoins = 0; 
            finalDeadline = null; 
        }

        const problemData = {
            problem: problemTitle,
            description: description,
            code: codeSnippet,
            language: selectedLanguages.map(lang => lang.id),
            is_urgent: isUrgent,
            deadline: finalDeadline, 
            offered_coins: finalOfferedCoins,
        };
        
        console.log("Yuborilayotgan ma'lumotlar:", problemData);


        try {
            if (id) {
                const response = await ProblemService.putProblem(id, problemData);
                console.log("Muammo muvaffaqiyatli yangilandi:", response);
                alert('Muammo muvaffaqiyatli yangilandi!');
            } else {
                const response = await ProblemService.postProblem(problemData);
                console.log("Muammo muvaffaqiyatli yaratildi:", response);
                
                // MUHIM: Faqat muvaffaqiyatli bo'lgandagina (200/201 statusi) tozalash va redirect qilish!
                alert('Muammo muvaffaqiyatli qo\'shildi!');
                resetFormStates();
            }
            navigate("/problems");
        } catch (error) {
            console.error(`Muammoni ${id ? 'yangilashda' : 'yaratishda'} xatolik yuz berdi:`, error.response ? error.response.data : error.message);
            
            let displayError = `Muammoni ${id ? 'yangilashda' : 'yaratishda'} xatolik yuz berdi!`;
            if (error.response) {
                if (error.response.data) {
                    // Agar DRF validatsiya xatosi bo'lsa (JSON)
                    if (typeof error.response.data === 'object' && !Array.isArray(error.response.data)) {
                        displayError = formatBackendErrors(error.response.data);
                    } 
                    // Agar 500 HTML sahifasi kelgan bo'lsa
                    else if (typeof error.response.data === 'string' && error.response.data.includes('<!DOCTYPE html>')) {
                        displayError = formatBackendErrors(error.response.data);
                    }
                    // Boshqa turdagi ma'lumotlar
                    else if (error.response.data.detail) {
                        displayError += ` Detal: ${error.response.data.detail}`;
                    } else {
                        displayError += ` Detal: ${JSON.stringify(error.response.data)}`;
                    }
                } else {
                    displayError += ` Status: ${error.response.status} - ${error.response.statusText}`;
                }
            } else {
                displayError += ` Tarmoq xatosi: ${error.message}`;
            }

            setSubmissionError(displayError);
        }
    };
    
    // Muammoni o'chirish funksiyasi
    const handleDeleteConfirm = async () => {
        if (!id) return; 

        try {
            await ProblemService.deleteProblem(id);
            alert("Muammo muvaffaqiyatli o'chirildi!");
            setIsDeleteModalOpen(false); 
            navigate("/problems"); 
        } catch (error) {
            console.error("Muammoni o'chirishda xatolik yuz berdi:", error);
            alert("Muammoni o'chirishda xatolik yuz berdi!");
            setIsDeleteModalOpen(false); 
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
                
                {/* XATOLIK XABARINI CHIQARISH */}
                {submissionError && (
                    <div className="mb-6 p-4 bg-red-800 border border-red-600 rounded-xl shadow-lg whitespace-pre-wrap">
                        <h3 className="text-lg font-bold text-red-100 mb-2">Yuborishda Xatolik:</h3>
                        {/* pre tagini ishlatish xatolikni bitta qatorga jamlab yubormaydi va to'g'ri ko'rsatadi */}
                        <pre className="text-red-200 text-sm font-mono overflow-auto bg-red-900/50 p-3 rounded">{submissionError}</pre>
                    </div>
                )}


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
                    
                    {/* IS_URGENT CHECKBOX */}
                    <div className="flex items-center space-x-3 p-4 bg-gray-700 rounded-xl border border-gray-600 shadow-inner-dark">
                        <input
                            id="isUrgent"
                            type="checkbox"
                            className="h-5 w-5 text-fuchsia-600 bg-gray-800 border-gray-600 rounded focus:ring-fuchsia-500 cursor-pointer"
                            checked={isUrgent}
                            onChange={(e) => {
                                setIsUrgent(e.target.checked);
                                if (!e.target.checked) {
                                    setDeadline('');
                                    setOfferedCoins(''); 
                                }
                            }}
                        />
                        <label htmlFor="isUrgent" className="text-gray-100 text-base font-semibold cursor-pointer select-none">
                            Bu Muammo Tezkor Yechim Talab Qiladi
                            <span className="ml-2 text-fuchsia-400 text-sm font-normal">(Agar belgilansa, Deadline va Coin miqdori kiritilishi **shart**)</span>
                        </label>
                    </div>

                    {/* SHARTLI MAYDONLAR */}
                    {isUrgent && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-700 p-6 rounded-xl border border-fuchsia-700/50 shadow-neon-fuchsia transition-all duration-300">
                            <div>
                                <label htmlFor="deadline" className="block text-gray-100 text-base font-semibold mb-2">
                                    Deadline <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="datetime-local"
                                    id="deadline"
                                    className="w-full rounded-xl py-3 px-5 bg-gray-600 border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-fuchsia-600 focus:border-fuchsia-500 transition duration-300 text-lg shadow-inner-dark"
                                    value={deadline}
                                    onChange={(e) => setDeadline(e.target.value)}
                                    required={isUrgent} 
                                    min={new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 16)} 
                                />
                                <p className="text-sm text-gray-400 mt-2 opacity-80">Muammoni yechish uchun so'nggi muddat.</p>
                            </div>

                            <div>
                                <label htmlFor="offeredCoins" className="block text-gray-100 text-base font-semibold mb-2">
                                    Taklif etilayotgan Coinlar <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="number"
                                    id="offeredCoins"
                                    className="w-full rounded-xl py-3 px-5 bg-gray-600 border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-fuchsia-600 focus:border-fuchsia-500 transition duration-300 text-lg shadow-inner-dark [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    placeholder="Yechim uchun taklif etiladigan coin miqdori"
                                    value={offeredCoins}
                                    onChange={(e) => setOfferedCoins(e.target.value)}
                                    required={isUrgent} 
                                    min="1"
                                />
                                <p className="text-sm text-gray-400 mt-2 opacity-80">Yechim uchun to'lanadigan coin miqdori (1 dan katta).</p>
                            </div>
                        </div>
                    )}
                    
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
                        {id && ( 
                            <button
                                type="button"
                                onClick={() => setIsDeleteModalOpen(true)} 
                                className="px-8 py-3 rounded-xl text-white font-semibold bg-red-600 hover:bg-red-700 transition-colors duration-300 border border-red-700 shadow-md hover:shadow-lg-red text-lg transform hover:-translate-y-0.5"
                            >
                                O'chirish
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => {
                                if (id && problemDetail) {
                                    fetchProblemDetail(id); 
                                } else {
                                    resetFormStates();
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
                itemTitle={problemDetail?.problem || 'ushbu muammoni'} 
            />
        </div>
    );
};

export default ProblemCreate;