// src/components/ProblemResponseForm.jsx

import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import Editor from "react-simple-code-editor";

import "prismjs/themes/prism-dark.css";

import {
    highlight,
    languages,
} from "prismjs/components/prism-core";

import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import "prismjs/components/prism-go";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-markup-templating";
import "prismjs/components/prism-php";

import {
    AlertTriangle,
    Check,
    CheckCircle2,
    Code2,
    Eraser,
    FileCode2,
    FileText,
    Languages as LanguagesIcon,
    Lightbulb,
    Loader2,
    RefreshCw,
    Search,
    Send,
    Sparkles,
    Terminal,
} from "lucide-react";

import ProblemResponseService from "../services/problemResponse";
import ProblemService from "../services/problems";

import {
    siteToast,
} from "./ui/AuthToast";


// =========================================================
// CONFIG
// =========================================================

const DEFAULT_EDITOR_LANGUAGE = "javascript";

const DEFAULT_CODE = "";


// =========================================================
// NORMALIZE LANGUAGES RESPONSE
// =========================================================

const normalizeLanguages = (response) => {
    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response?.results)) {
        return response.results;
    }

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    return [];
};


// =========================================================
// LANGUAGE -> PRISM
// =========================================================

const getPrismLanguage = (languageName) => {
    if (!languageName) {
        return DEFAULT_EDITOR_LANGUAGE;
    }

    const value = String(languageName)
        .trim()
        .toLowerCase();

    if (
        [
            "javascript",
            "js",
            "node",
            "node.js",
            "nodejs",
            "express",
            "express.js",
        ].includes(value)
    ) {
        return "javascript";
    }

    if (
        [
            "react",
            "react.js",
            "reactjs",
            "jsx",
        ].includes(value)
    ) {
        return "jsx";
    }

    if (
        [
            "typescript",
            "ts",
        ].includes(value)
    ) {
        return "typescript";
    }

    if (
        [
            "tsx",
            "react typescript",
            "react + typescript",
        ].includes(value)
    ) {
        return "tsx";
    }

    if (
        [
            "python",
            "py",
            "django",
            "django rest framework",
            "drf",
            "fastapi",
            "flask",
        ].includes(value)
    ) {
        return "python";
    }

    if (
        [
            "html",
            "html5",
            "markup",
        ].includes(value)
    ) {
        return "markup";
    }

    if (
        [
            "css",
            "css3",
            "tailwind",
            "tailwindcss",
            "bootstrap",
        ].includes(value)
    ) {
        return "css";
    }

    if (value === "java") {
        return "java";
    }

    if (value === "c") {
        return "c";
    }

    if (
        [
            "c++",
            "cpp",
            "c plus plus",
        ].includes(value)
    ) {
        return "cpp";
    }

    if (
        [
            "c#",
            "csharp",
            "c sharp",
            ".net",
            "dotnet",
        ].includes(value)
    ) {
        return "csharp";
    }

    if (
        [
            "sql",
            "mysql",
            "postgresql",
            "postgres",
            "sqlite",
            "sqlite3",
            "mariadb",
        ].includes(value)
    ) {
        return "sql";
    }

    if (
        [
            "php",
            "laravel",
        ].includes(value)
    ) {
        return "php";
    }

    if (
        [
            "bash",
            "shell",
            "linux",
            "ubuntu",
            "terminal",
        ].includes(value)
    ) {
        return "bash";
    }

    if (value === "json") {
        return "json";
    }

    if (
        [
            "go",
            "golang",
        ].includes(value)
    ) {
        return "go";
    }

    if (value === "rust") {
        return "rust";
    }

    if (languages[value]) {
        return value;
    }

    return "clike";
};


// =========================================================
// FILE NAME
// =========================================================

const getEditorFileName = (prismLanguage) => {
    const extensions = {
        javascript: "solution.js",
        jsx: "solution.jsx",
        typescript: "solution.ts",
        tsx: "solution.tsx",
        python: "solution.py",
        markup: "solution.html",
        css: "solution.css",
        java: "Solution.java",
        c: "solution.c",
        cpp: "solution.cpp",
        csharp: "Solution.cs",
        sql: "solution.sql",
        php: "solution.php",
        bash: "solution.sh",
        json: "solution.json",
        go: "solution.go",
        rust: "solution.rs",
        clike: "solution.code",
    };

    return extensions[prismLanguage] || "solution.code";
};


// =========================================================
// ERROR MESSAGE
// =========================================================

const getErrorMessage = (
    error,
    fallback = "Yechimni yuborishda xatolik yuz berdi."
) => {
    const data =
        error?.serverData ||
        error?.response?.data;

    if (
        typeof data === "string" &&
        data.trim()
    ) {
        return data;
    }

    if (data?.detail) {
        return String(data.detail);
    }

    if (data?.message) {
        return String(data.message);
    }

    if (data?.error) {
        return String(data.error);
    }

    if (
        data &&
        typeof data === "object"
    ) {
        const labels = {
            answer: "Qisqa yechim",
            description: "Tavsif",
            code: "Kod",
            language: "Dasturlash tili",
            language_name: "Dasturlash tili",
        };

        for (const [key, value] of Object.entries(data)) {
            const label = labels[key] || key;

            if (
                Array.isArray(value) &&
                value.length > 0
            ) {
                return `${label}: ${value[0]}`;
            }

            if (typeof value === "string") {
                return `${label}: ${value}`;
            }
        }
    }

    if (error?.message) {
        return String(error.message);
    }

    return fallback;
};


// =========================================================
// CHECK ITEM
// =========================================================

const ChecklistItem = ({
    completed,
    optional = false,
    children,
}) => (
    <div className="flex items-start gap-2.5">
        <div
            className={`
                mt-0.5
                grid
                h-5
                w-5
                shrink-0
                place-items-center
                rounded-full
                border
                transition-all

                ${
                    completed
                        ? `
                            border-emerald-400/25
                            bg-emerald-500/[0.10]
                            text-emerald-300
                        `
                        : optional
                            ? `
                                border-indigo-400/15
                                bg-indigo-500/[0.05]
                                text-indigo-400
                            `
                            : `
                                border-white/[0.08]
                                bg-white/[0.025]
                                text-gray-700
                            `
                }
            `}
        >
            {completed ? (
                <Check size={11} />
            ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
            )}
        </div>

        <div className="min-w-0">
            <span
                className={`
                    text-[11px]
                    font-medium
                    leading-5

                    ${
                        completed
                            ? "text-gray-300"
                            : "text-gray-600"
                    }
                `}
            >
                {children}
            </span>

            {optional && (
                <span
                    className="
                        ml-1.5
                        text-[8px]
                        font-black
                        uppercase
                        tracking-wider
                        text-indigo-500
                    "
                >
                    ixtiyoriy
                </span>
            )}
        </div>
    </div>
);


// =========================================================
// PROBLEM RESPONSE FORM
// =========================================================

const ProblemResponseForm = ({
    id,
    onSuccess,
    problemLanguages = [],
}) => {

    // =====================================================
    // FORM STATE
    // =====================================================

    const [shortInfo, setShortInfo] = useState("");
    const [description, setDescription] = useState("");
    const [code, setCode] = useState(DEFAULT_CODE);

    // =====================================================
    // LANGUAGE STATE
    // =====================================================

    const [languageOptions, setLanguageOptions] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [languageSearch, setLanguageSearch] = useState("");
    const [isLanguagesLoading, setIsLanguagesLoading] = useState(true);
    const [languageError, setLanguageError] = useState("");

    // =====================================================
    // SUBMIT STATE
    // =====================================================

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState("");

    const isMounted = useRef(true);


    // =====================================================
    // MOUNT
    // =====================================================

    useEffect(() => {
        isMounted.current = true;

        return () => {
            isMounted.current = false;
        };
    }, []);


    // =====================================================
    // EDITOR LANGUAGE
    // =====================================================

    const editorLanguage = useMemo(
        () =>
            getPrismLanguage(
                selectedLanguage?.name
            ),
        [selectedLanguage]
    );


    const editorFileName = useMemo(
        () =>
            getEditorFileName(
                editorLanguage
            ),
        [editorLanguage]
    );


    // =====================================================
    // FETCH LANGUAGE LIST
    //
    // MUHIM:
    // selectedLanguage dependency emas.
    // Til bosilganda API qayta-qayta chaqirilmaydi.
    // =====================================================

    const fetchLanguages = useCallback(async () => {
        setIsLanguagesLoading(true);
        setLanguageError("");

        try {
            const response =
                await ProblemService.getLanguagesList();

            const normalized =
                normalizeLanguages(response);

            if (!isMounted.current) {
                return;
            }

            setLanguageOptions(normalized);

        } catch (error) {
            console.error(
                "Tillarni olishda xatolik:",
                error
            );

            if (!isMounted.current) {
                return;
            }

            const message =
                getErrorMessage(
                    error,
                    "Dasturlash tillarini yuklab bo‘lmadi."
                );

            setLanguageError(message);

            siteToast.error(
                message,
                {
                    title: "Tillar yuklanmadi",
                    duration: 4500,
                }
            );

        } finally {
            if (isMounted.current) {
                setIsLanguagesLoading(false);
            }
        }
    }, []);


    useEffect(() => {
        fetchLanguages();
    }, [fetchLanguages]);


    // =====================================================
    // AUTO SELECT PROBLEM LANGUAGE
    // =====================================================

    useEffect(() => {
        if (
            selectedLanguage ||
            languageOptions.length === 0 ||
            !Array.isArray(problemLanguages) ||
            problemLanguages.length === 0
        ) {
            return;
        }

        const firstProblemLanguage =
            problemLanguages[0];

        const matchById =
            languageOptions.find(
                (language) =>
                    Number(language?.id) ===
                    Number(firstProblemLanguage?.id)
            );

        const matchByName =
            languageOptions.find(
                (language) =>
                    String(language?.name || "")
                        .toLowerCase() ===
                    String(firstProblemLanguage?.name || "")
                        .toLowerCase()
            );

        setSelectedLanguage(
            matchById ||
            matchByName ||
            null
        );

    }, [
        languageOptions,
        problemLanguages,
        selectedLanguage,
    ]);


    // =====================================================
    // FILTER LANGUAGES
    // =====================================================

    const filteredLanguages = useMemo(() => {
        const search =
            languageSearch
                .trim()
                .toLowerCase();

        if (!search) {
            return languageOptions;
        }

        return languageOptions.filter(
            (language) =>
                String(language?.name || "")
                    .toLowerCase()
                    .includes(search)
        );

    }, [
        languageOptions,
        languageSearch,
    ]);


    // =====================================================
    // CODE HIGHLIGHT
    // =====================================================

    const highlightCode = (value) => {
        const grammar =
            languages[editorLanguage] ||
            languages.clike ||
            languages.javascript;

        if (!grammar) {
            return value;
        }

        return highlight(
            value,
            grammar,
            editorLanguage
        );
    };


    // =====================================================
    // FORM STATUS
    // =====================================================

    const formStatus = useMemo(() => {
        const answerReady =
            shortInfo.trim().length >= 5;

        const descriptionReady =
            description.trim().length >= 15;

        const languageReady =
            Boolean(selectedLanguage?.id);

        const codeReady =
            Boolean(code.trim());

        const completed = [
            answerReady,
            descriptionReady,
            languageReady,
        ].filter(Boolean).length;

        return {
            answerReady,
            descriptionReady,
            languageReady,
            codeReady,
            percent:
                Math.round(
                    (completed / 3) * 100
                ),
            ready:
                answerReady &&
                descriptionReady &&
                languageReady,
        };

    }, [
        shortInfo,
        description,
        selectedLanguage,
        code,
    ]);


    // =====================================================
    // HELPERS
    // =====================================================

    const clearFormError = () => {
        if (formError) {
            setFormError("");
        }
    };


    const resetForm = () => {
        setShortInfo("");
        setDescription("");
        setCode(DEFAULT_CODE);
        setFormError("");

        /*
            Til ataylab reset qilinmaydi.

            Bir xil problemga yana yechim
            yozilganda user tilni qayta
            tanlashiga hojat qolmaydi.
        */
    };


    const handleLanguageSelect = (language) => {
        if (isSubmitting) {
            return;
        }

        setSelectedLanguage(language);
        clearFormError();
    };


    const handleClearCode = () => {
        if (
            isSubmitting ||
            !code.trim()
        ) {
            return;
        }

        setCode("");

        siteToast.info(
            "Kod maydoni tozalandi.",
            {
                title: "Kod tozalandi",
                duration: 1800,
            }
        );
    };


    // =====================================================
    // VALIDATION
    // =====================================================

    const validateForm = () => {
        const cleanShortInfo =
            shortInfo.trim();

        const cleanDescription =
            description.trim();

        if (!cleanShortInfo) {
            return "Yechimning qisqa ma’lumotini kiriting.";
        }

        if (cleanShortInfo.length < 5) {
            return "Qisqa yechim kamida 5 ta belgidan iborat bo‘lishi kerak.";
        }

        if (cleanShortInfo.length > 255) {
            return "Qisqa yechim 255 ta belgidan oshmasligi kerak.";
        }

        if (!cleanDescription) {
            return "Yechim tavsifini kiriting.";
        }

        if (cleanDescription.length < 15) {
            return "Yechimni biroz batafsilroq tushuntiring.";
        }

        if (!selectedLanguage?.id) {
            return "Yechim qaysi dasturlash tilida ekanini tanlang.";
        }

        return null;
    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        setFormError("");

        const validationError =
            validateForm();

        if (validationError) {
            setFormError(validationError);

            siteToast.warning(
                validationError,
                {
                    title: "Yechimni tekshiring",
                    duration: 4000,
                }
            );

            return;
        }

        if (!id) {
            const message =
                "Muammo ID topilmadi.";

            setFormError(message);

            siteToast.error(
                message,
                {
                    title: "Yechim yuborilmadi",
                }
            );

            return;
        }

        const solutionData = {
            answer:
                shortInfo.trim(),

            description:
                description.trim(),

            code:
                code.trim(),

            language:
                selectedLanguage.id,

            language_name:
                selectedLanguage.name,
        };


        setIsSubmitting(true);

        const toastId =
            siteToast.loading(
                `${selectedLanguage.name} yechimingiz yuborilmoqda...`,
                {
                    title: "Yechim yuborilmoqda",
                }
            );


        let createdSolution = null;


        // =================================================
        // 1. SOLUTION POST
        // =================================================

        try {
            createdSolution =
                await ProblemResponseService
                    .postSolution(
                        id,
                        solutionData
                    );

            if (!isMounted.current) {
                return;
            }

            /*
                MUHIM:

                POST muvaffaqiyatli bo‘ldi.
                Shu yerdan keyingi parent refresh
                muvaffaqiyatsiz bo‘lsa ham,
                yechim serverda yaratilgan bo‘ladi.
            */

            resetForm();

            siteToast.success(
                "Yechimingiz muvaffaqiyatli yuborildi.",
                {
                    id: toastId,
                    title: "Yechim yuborildi",
                    duration: 3500,
                }
            );

        } catch (error) {
            console.error(
                "Yechim yuborishda xatolik:",
                error
            );

            if (!isMounted.current) {
                return;
            }

            const message =
                getErrorMessage(error);

            setFormError(message);

            siteToast.error(
                message,
                {
                    id: toastId,
                    title: "Yechim yuborilmadi",
                    duration: 5000,
                }
            );

            if (isMounted.current) {
                setIsSubmitting(false);
            }

            return;
        }


        // =================================================
        // 2. PARENT REFRESH
        //
        // Bu alohida try/catch.
        //
        // Parent refresh yiqilsa POST successni
        // "Yechim yuborilmadi" deb noto‘g‘ri
        // ko‘rsatmaymiz.
        // =================================================

        if (
            typeof onSuccess === "function"
        ) {
            try {
                await onSuccess(
                    createdSolution
                );

            } catch (refreshError) {
                console.error(
                    "Yechim yuborildi, lekin ro‘yxatni yangilashda xato:",
                    refreshError
                );

                siteToast.warning(
                    "Yechim saqlandi, lekin ro‘yxatni avtomatik yangilashda muammo yuz berdi.",
                    {
                        title: "Ro‘yxat yangilanmadi",
                        duration: 4000,
                    }
                );
            }
        }


        if (isMounted.current) {
            setIsSubmitting(false);
        }
    };


    // =====================================================
    // JSX
    // =====================================================

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full"
        >

            <div
                className="
                    grid
                    gap-6
                    xl:grid-cols-[minmax(0,1fr)_280px]
                    xl:items-start
                "
            >

                {/* =========================================
                    LEFT SIDE
                ========================================== */}

                <div className="min-w-0 space-y-6">

                    {/* SHORT INFO */}

                    <section>
                        <div
                            className="
                                mb-2.5
                                flex
                                items-center
                                justify-between
                                gap-3
                            "
                        >
                            <label
                                htmlFor="shortInfo"
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    text-xs
                                    font-black
                                    text-gray-300
                                "
                            >
                                <FileText
                                    size={14}
                                    className="text-cyan-300"
                                />

                                Qisqa yechim

                                <span className="text-red-400">
                                    *
                                </span>
                            </label>

                            <span
                                className={`
                                    text-[9px]
                                    font-black
                                    ${
                                        shortInfo.length > 230
                                            ? "text-amber-300"
                                            : "text-gray-700"
                                    }
                                `}
                            >
                                {shortInfo.length}/255
                            </span>
                        </div>

                        <input
                            id="shortInfo"
                            type="text"
                            value={shortInfo}
                            maxLength={255}
                            disabled={isSubmitting}
                            autoComplete="off"
                            placeholder="Masalan: JWT tokenni HttpOnly cookie orqali yuboring"
                            onChange={(event) => {
                                setShortInfo(
                                    event.target.value
                                );

                                clearFormError();
                            }}
                            className="
                                w-full
                                rounded-2xl
                                border
                                border-white/[0.07]
                                bg-black/20
                                px-4
                                py-3.5
                                text-sm
                                font-semibold
                                text-white
                                outline-none
                                transition-all

                                placeholder:text-gray-700

                                focus:border-cyan-400/30
                                focus:bg-cyan-500/[0.015]
                                focus:ring-4
                                focus:ring-cyan-500/[0.05]

                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        />

                        <p
                            className="
                                mt-2
                                text-[10px]
                                font-medium
                                leading-5
                                text-gray-600
                            "
                        >
                            Asosiy yechimni qisqa va tushunarli jumlada yozing.
                        </p>
                    </section>


                    {/* DESCRIPTION */}

                    <section>
                        <div
                            className="
                                mb-2.5
                                flex
                                items-center
                                justify-between
                                gap-3
                            "
                        >
                            <label
                                htmlFor="solution-description"
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    text-xs
                                    font-black
                                    text-gray-300
                                "
                            >
                                <Lightbulb
                                    size={14}
                                    className="text-yellow-300"
                                />

                                Batafsil tushuntirish

                                <span className="text-red-400">
                                    *
                                </span>
                            </label>

                            <span
                                className="
                                    text-[9px]
                                    font-black
                                    text-gray-700
                                "
                            >
                                {description.length} belgi
                            </span>
                        </div>

                        <textarea
                            id="solution-description"
                            rows={7}
                            value={description}
                            disabled={isSubmitting}
                            placeholder="Muammo nimadan kelib chiqqanini va uni qanday tuzatganingizni bosqichma-bosqich tushuntiring..."
                            onChange={(event) => {
                                setDescription(
                                    event.target.value
                                );

                                clearFormError();
                            }}
                            className="
                                min-h-[175px]
                                w-full
                                resize-y
                                rounded-2xl
                                border
                                border-white/[0.07]
                                bg-black/20
                                px-4
                                py-3.5
                                text-sm
                                font-medium
                                leading-7
                                text-gray-300
                                outline-none
                                transition-all

                                placeholder:text-gray-700

                                focus:border-yellow-400/25
                                focus:ring-4
                                focus:ring-yellow-500/[0.04]

                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        />
                    </section>


                    {/* LANGUAGE */}

                    <section
                        className="
                            rounded-[22px]
                            border
                            border-white/[0.06]
                            bg-white/[0.015]
                            p-5
                        "
                    >
                        <div
                            className="
                                flex
                                flex-col
                                gap-4
                                sm:flex-row
                                sm:items-start
                                sm:justify-between
                            "
                        >
                            <div className="flex items-start gap-3">
                                <div
                                    className="
                                        grid
                                        h-10
                                        w-10
                                        shrink-0
                                        place-items-center
                                        rounded-xl
                                        border
                                        border-indigo-400/15
                                        bg-indigo-500/[0.07]
                                        text-indigo-300
                                    "
                                >
                                    <LanguagesIcon size={18} />
                                </div>

                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3
                                            className="
                                                text-sm
                                                font-black
                                                text-white
                                            "
                                        >
                                            Kod tili
                                        </h3>

                                        <span className="text-red-400">
                                            *
                                        </span>
                                    </div>

                                    <p
                                        className="
                                            mt-1
                                            text-[10px]
                                            font-medium
                                            leading-5
                                            text-gray-600
                                        "
                                    >
                                        Tilni tanlang — syntax highlighting avtomatik moslashadi.
                                    </p>
                                </div>
                            </div>

                            {selectedLanguage && (
                                <div
                                    className="
                                        inline-flex
                                        self-start
                                        items-center
                                        gap-2
                                        rounded-xl
                                        border
                                        border-emerald-400/15
                                        bg-emerald-500/[0.06]
                                        px-3
                                        py-2
                                    "
                                >
                                    <CheckCircle2
                                        size={13}
                                        className="text-emerald-300"
                                    />

                                    <div>
                                        <p
                                            className="
                                                text-[8px]
                                                font-black
                                                uppercase
                                                tracking-wider
                                                text-gray-600
                                            "
                                        >
                                            Selected
                                        </p>

                                        <p
                                            className="
                                                text-[10px]
                                                font-black
                                                text-emerald-300
                                            "
                                        >
                                            {selectedLanguage.name}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>


                        {/* LANGUAGE SEARCH */}

                        {!isLanguagesLoading &&
                            !languageError &&
                            languageOptions.length > 8 && (
                                <div className="relative mt-5">
                                    <Search
                                        size={14}
                                        className="
                                            absolute
                                            left-3
                                            top-1/2
                                            -translate-y-1/2
                                            text-gray-700
                                        "
                                    />

                                    <input
                                        type="text"
                                        value={languageSearch}
                                        onChange={(event) =>
                                            setLanguageSearch(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Til yoki texnologiyani qidiring..."
                                        className="
                                            w-full
                                            rounded-xl
                                            border
                                            border-white/[0.06]
                                            bg-black/20
                                            py-2.5
                                            pl-9
                                            pr-3
                                            text-xs
                                            font-medium
                                            text-white
                                            outline-none

                                            placeholder:text-gray-700

                                            focus:border-indigo-400/25
                                            focus:ring-4
                                            focus:ring-indigo-500/[0.04]
                                        "
                                    />
                                </div>
                            )}


                        {/* LANGUAGE LOADING */}

                        {isLanguagesLoading && (
                            <div className="mt-5 flex flex-wrap gap-2">
                                {Array.from({
                                    length: 7,
                                }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="
                                            h-9
                                            w-24
                                            animate-pulse
                                            rounded-full
                                            bg-white/[0.05]
                                        "
                                    />
                                ))}
                            </div>
                        )}


                        {/* LANGUAGE ERROR */}

                        {!isLanguagesLoading &&
                            languageError && (
                                <div
                                    className="
                                        mt-5
                                        rounded-2xl
                                        border
                                        border-red-400/15
                                        bg-red-500/[0.04]
                                        p-4
                                    "
                                >
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle
                                            size={16}
                                            className="
                                                mt-0.5
                                                shrink-0
                                                text-red-300
                                            "
                                        />

                                        <div className="min-w-0">
                                            <p
                                                className="
                                                    text-xs
                                                    font-black
                                                    text-red-200
                                                "
                                            >
                                                Tillar yuklanmadi
                                            </p>

                                            <p
                                                className="
                                                    mt-1
                                                    text-[10px]
                                                    font-medium
                                                    leading-5
                                                    text-red-200/60
                                                "
                                            >
                                                {languageError}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={fetchLanguages}
                                        className="
                                            mt-3
                                            inline-flex
                                            items-center
                                            gap-2
                                            rounded-xl
                                            border
                                            border-red-400/15
                                            bg-red-500/[0.05]
                                            px-3
                                            py-2
                                            text-[10px]
                                            font-black
                                            text-red-200
                                            transition
                                            hover:bg-red-500/[0.10]
                                        "
                                    >
                                        <RefreshCw size={12} />
                                        Qayta urinish
                                    </button>
                                </div>
                            )}


                        {/* LANGUAGE BUTTONS */}

                        {!isLanguagesLoading &&
                            !languageError &&
                            filteredLanguages.length > 0 && (
                                <div
                                    className="
                                        mt-5
                                        flex
                                        max-h-[190px]
                                        flex-wrap
                                        gap-2
                                        overflow-y-auto
                                        pr-1
                                    "
                                >
                                    {filteredLanguages.map(
                                        (language) => {
                                            const active =
                                                Number(
                                                    selectedLanguage?.id
                                                ) ===
                                                Number(language.id);

                                            const syntax =
                                                getPrismLanguage(
                                                    language?.name
                                                );

                                            return (
                                                <button
                                                    key={language.id}
                                                    type="button"
                                                    disabled={isSubmitting}
                                                    title={`Syntax: ${syntax}`}
                                                    onClick={() =>
                                                        handleLanguageSelect(
                                                            language
                                                        )
                                                    }
                                                    className={`
                                                        inline-flex
                                                        items-center
                                                        gap-2
                                                        rounded-full
                                                        border
                                                        px-3.5
                                                        py-2
                                                        text-[10px]
                                                        font-black
                                                        transition-all

                                                        active:scale-[0.96]

                                                        disabled:cursor-not-allowed
                                                        disabled:opacity-40

                                                        ${
                                                            active
                                                                ? `
                                                                    border-indigo-400/30
                                                                    bg-indigo-500/[0.11]
                                                                    text-indigo-200
                                                                    shadow-lg
                                                                    shadow-indigo-500/[0.06]
                                                                `
                                                                : `
                                                                    border-white/[0.07]
                                                                    bg-white/[0.02]
                                                                    text-gray-500

                                                                    hover:border-white/[0.13]
                                                                    hover:bg-white/[0.045]
                                                                    hover:text-white
                                                                `
                                                        }
                                                    `}
                                                >
                                                    {active ? (
                                                        <Check size={11} />
                                                    ) : (
                                                        <FileCode2 size={11} />
                                                    )}

                                                    {language.name}
                                                </button>
                                            );
                                        }
                                    )}
                                </div>
                            )}


                        {!isLanguagesLoading &&
                            !languageError &&
                            filteredLanguages.length === 0 && (
                                <div
                                    className="
                                        mt-5
                                        rounded-xl
                                        border
                                        border-dashed
                                        border-white/[0.07]
                                        p-5
                                        text-center
                                    "
                                >
                                    <p
                                        className="
                                            text-xs
                                            font-medium
                                            text-gray-600
                                        "
                                    >
                                        Ushbu nom bilan til topilmadi.
                                    </p>
                                </div>
                            )}
                    </section>


                    {/* CODE EDITOR */}

                    <section>
                        <div
                            className="
                                mb-2.5
                                flex
                                flex-wrap
                                items-start
                                justify-between
                                gap-3
                            "
                        >
                            <div>
                                <div
                                    className="
                                        flex
                                        flex-wrap
                                        items-center
                                        gap-2
                                    "
                                >
                                    <Code2
                                        size={14}
                                        className="text-indigo-300"
                                    />

                                    <span
                                        className="
                                            text-xs
                                            font-black
                                            text-gray-300
                                        "
                                    >
                                        Kod namunasi
                                    </span>

                                    <span
                                        className="
                                            rounded-full
                                            border
                                            border-indigo-400/10
                                            bg-indigo-500/[0.04]
                                            px-2
                                            py-0.5
                                            text-[8px]
                                            font-black
                                            uppercase
                                            tracking-wider
                                            text-indigo-400
                                        "
                                    >
                                        Ixtiyoriy
                                    </span>

                                    {selectedLanguage && (
                                        <span
                                            className="
                                                rounded-full
                                                border
                                                border-emerald-400/10
                                                bg-emerald-500/[0.04]
                                                px-2
                                                py-0.5
                                                text-[8px]
                                                font-black
                                                text-emerald-400
                                            "
                                        >
                                            {selectedLanguage.name}
                                        </span>
                                    )}
                                </div>

                                <p
                                    className="
                                        mt-1.5
                                        text-[10px]
                                        font-medium
                                        text-gray-600
                                    "
                                >
                                    Tanlangan tilga qarab syntax highlighting o‘zgaradi.
                                </p>
                            </div>

                            {code.trim() && (
                                <button
                                    type="button"
                                    onClick={handleClearCode}
                                    disabled={isSubmitting}
                                    className="
                                        inline-flex
                                        items-center
                                        gap-1.5
                                        rounded-lg
                                        border
                                        border-white/[0.06]
                                        bg-white/[0.02]
                                        px-2.5
                                        py-1.5
                                        text-[9px]
                                        font-black
                                        text-gray-600
                                        transition

                                        hover:border-red-400/15
                                        hover:bg-red-500/[0.05]
                                        hover:text-red-300
                                    "
                                >
                                    <Eraser size={12} />
                                    Tozalash
                                </button>
                            )}
                        </div>


                        <div
                            className="
                                overflow-hidden
                                rounded-2xl
                                border
                                border-white/[0.07]
                                bg-[#070b12]
                                shadow-2xl
                                shadow-black/25
                                transition-all

                                focus-within:border-indigo-400/25
                                focus-within:ring-4
                                focus-within:ring-indigo-500/[0.04]
                            "
                        >

                            {/* TERMINAL HEADER */}

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-3
                                    border-b
                                    border-white/[0.06]
                                    bg-white/[0.018]
                                    px-4
                                    py-3
                                "
                            >
                                <div className="flex items-center gap-2">
                                    <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                                </div>

                                <div className="flex items-center gap-2">
                                    <Terminal
                                        size={12}
                                        className="text-indigo-400"
                                    />

                                    <span
                                        className="
                                            font-mono
                                            text-[9px]
                                            font-black
                                            tracking-[0.12em]
                                            text-gray-600
                                        "
                                    >
                                        {editorFileName}
                                    </span>
                                </div>
                            </div>


                            {/* EDITOR */}

                            <div
                                className={`
                                    relative
                                    max-h-[430px]
                                    overflow-auto

                                    ${
                                        isSubmitting
                                            ? `
                                                pointer-events-none
                                                opacity-50
                                            `
                                            : ""
                                    }
                                `}
                            >
                                <Editor
                                    value={code}
                                    onValueChange={(value) => {
                                        if (isSubmitting) {
                                            return;
                                        }

                                        setCode(value);
                                        clearFormError();
                                    }}
                                    highlight={highlightCode}
                                    padding={18}
                                    textareaId="solution-code"
                                    textareaClassName="focus:outline-none"
                                    style={{
                                        fontFamily:
                                            '"Fira Code", "Fira Mono", Consolas, monospace',
                                        fontSize: 14,
                                        backgroundColor: "#070b12",
                                        color: "#d4d4d4",
                                        minHeight: "260px",
                                        lineHeight: "1.7",
                                        outline: "none",
                                    }}
                                />
                            </div>


                            {/* EDITOR FOOTER */}

                            <div
                                className="
                                    flex
                                    flex-wrap
                                    items-center
                                    justify-between
                                    gap-3
                                    border-t
                                    border-white/[0.05]
                                    bg-black/15
                                    px-4
                                    py-2.5
                                "
                            >
                                <div className="flex items-center gap-2">
                                    <Code2
                                        size={10}
                                        className="text-indigo-500"
                                    />

                                    <span
                                        className="
                                            font-mono
                                            text-[8px]
                                            font-black
                                            uppercase
                                            tracking-[0.14em]
                                            text-gray-700
                                        "
                                    >
                                        {selectedLanguage?.name || "Til tanlanmagan"}
                                    </span>

                                    <span className="text-gray-800">
                                        /
                                    </span>

                                    <span
                                        className="
                                            font-mono
                                            text-[8px]
                                            font-black
                                            text-indigo-500
                                        "
                                    >
                                        {editorLanguage}
                                    </span>
                                </div>

                                <span
                                    className="
                                        font-mono
                                        text-[9px]
                                        font-semibold
                                        text-gray-700
                                    "
                                >
                                    {code.length} chars
                                </span>
                            </div>
                        </div>
                    </section>


                    {/* FORM ERROR */}

                    {formError && (
                        <div
                            className="
                                flex
                                items-start
                                gap-3
                                rounded-2xl
                                border
                                border-red-400/20
                                bg-red-500/[0.05]
                                p-4
                            "
                        >
                            <div
                                className="
                                    mt-0.5
                                    grid
                                    h-8
                                    w-8
                                    shrink-0
                                    place-items-center
                                    rounded-xl
                                    border
                                    border-red-400/10
                                    bg-red-500/[0.07]
                                    text-red-300
                                "
                            >
                                <AlertTriangle size={15} />
                            </div>

                            <div>
                                <p
                                    className="
                                        text-[9px]
                                        font-black
                                        uppercase
                                        tracking-[0.14em]
                                        text-red-300
                                    "
                                >
                                    Yechim yuborilmadi
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        font-medium
                                        leading-5
                                        text-red-200/75
                                    "
                                >
                                    {formError}
                                </p>
                            </div>
                        </div>
                    )}
                </div>


                {/* =========================================
                    RIGHT SIDE
                ========================================== */}

                <aside className="hidden xl:block">
                    <div className="sticky top-24 space-y-4">

                        {/* PROGRESS */}

                        <section
                            className="
                                rounded-[22px]
                                border
                                border-white/[0.06]
                                bg-white/[0.018]
                                p-5
                            "
                        >
                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-3
                                "
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="
                                            grid
                                            h-9
                                            w-9
                                            place-items-center
                                            rounded-xl
                                            border
                                            border-cyan-400/15
                                            bg-cyan-500/[0.06]
                                            text-cyan-300
                                        "
                                    >
                                        <CheckCircle2 size={16} />
                                    </div>

                                    <div>
                                        <h3
                                            className="
                                                text-xs
                                                font-black
                                                text-white
                                            "
                                        >
                                            Yechim tayyorligi
                                        </h3>

                                        <p
                                            className="
                                                mt-0.5
                                                text-[9px]
                                                font-medium
                                                text-gray-700
                                            "
                                        >
                                            Required fields
                                        </p>
                                    </div>
                                </div>

                                <span
                                    className={`
                                        text-sm
                                        font-black
                                        ${
                                            formStatus.percent === 100
                                                ? "text-emerald-300"
                                                : "text-cyan-300"
                                        }
                                    `}
                                >
                                    {formStatus.percent}%
                                </span>
                            </div>


                            <div
                                className="
                                    mt-5
                                    h-1.5
                                    overflow-hidden
                                    rounded-full
                                    bg-white/[0.05]
                                "
                            >
                                <div
                                    className="
                                        h-full
                                        rounded-full
                                        bg-gradient-to-r
                                        from-cyan-400
                                        to-indigo-500
                                        transition-all
                                        duration-500
                                    "
                                    style={{
                                        width: `${formStatus.percent}%`,
                                    }}
                                />
                            </div>


                            <div className="mt-5 space-y-3">
                                <ChecklistItem
                                    completed={formStatus.answerReady}
                                >
                                    Qisqa va tushunarli yechim
                                </ChecklistItem>

                                <ChecklistItem
                                    completed={formStatus.descriptionReady}
                                >
                                    Batafsil tushuntirish
                                </ChecklistItem>

                                <ChecklistItem
                                    completed={formStatus.languageReady}
                                >
                                    Dasturlash tili tanlangan
                                </ChecklistItem>

                                <ChecklistItem
                                    completed={formStatus.codeReady}
                                    optional
                                >
                                    Kod namunasi
                                </ChecklistItem>
                            </div>


                            {formStatus.ready && (
                                <div
                                    className="
                                        mt-5
                                        flex
                                        items-center
                                        gap-2
                                        rounded-xl
                                        border
                                        border-emerald-400/10
                                        bg-emerald-500/[0.045]
                                        px-3
                                        py-2.5
                                        text-[10px]
                                        font-bold
                                        text-emerald-300
                                    "
                                >
                                    <Check size={13} />
                                    Yechim yuborishga tayyor
                                </div>
                            )}
                        </section>


                        {/* LANGUAGE INFO */}

                        <section
                            className="
                                rounded-[22px]
                                border
                                border-indigo-400/[0.10]
                                bg-indigo-500/[0.035]
                                p-5
                            "
                        >
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    text-indigo-300
                                "
                            >
                                <LanguagesIcon size={14} />

                                <span
                                    className="
                                        text-[9px]
                                        font-black
                                        uppercase
                                        tracking-[0.15em]
                                    "
                                >
                                    Editor language
                                </span>
                            </div>

                            {selectedLanguage ? (
                                <div className="mt-4">
                                    <p
                                        className="
                                            text-lg
                                            font-black
                                            text-white
                                        "
                                    >
                                        {selectedLanguage.name}
                                    </p>

                                    <div className="mt-2 flex flex-wrap items-center gap-2">
                                        <span
                                            className="
                                                rounded-lg
                                                border
                                                border-indigo-400/10
                                                bg-indigo-500/[0.06]
                                                px-2
                                                py-1
                                                font-mono
                                                text-[9px]
                                                font-black
                                                text-indigo-300
                                            "
                                        >
                                            {editorLanguage}
                                        </span>

                                        <span
                                            className="
                                                rounded-lg
                                                border
                                                border-white/[0.06]
                                                bg-white/[0.02]
                                                px-2
                                                py-1
                                                font-mono
                                                text-[9px]
                                                font-black
                                                text-gray-600
                                            "
                                        >
                                            {editorFileName}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <p
                                    className="
                                        mt-3
                                        text-[11px]
                                        font-medium
                                        leading-5
                                        text-gray-600
                                    "
                                >
                                    Tilni tanlasangiz, kod muharriri shu tilga avtomatik moslashadi.
                                </p>
                            )}
                        </section>


                        {/* TIP */}

                        <section
                            className="
                                rounded-[22px]
                                border
                                border-cyan-400/[0.10]
                                bg-cyan-500/[0.03]
                                p-5
                            "
                        >
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    text-cyan-300
                                "
                            >
                                <Sparkles size={14} />

                                <span
                                    className="
                                        text-[9px]
                                        font-black
                                        uppercase
                                        tracking-[0.15em]
                                    "
                                >
                                    F.Society tip
                                </span>
                            </div>

                            <p
                                className="
                                    mt-3
                                    text-[11px]
                                    font-medium
                                    leading-5
                                    text-gray-600
                                "
                            >
                                Faqat kod emas, xatolik nimadan kelib chiqqanini
                                va yechim nima uchun ishlashini ham tushuntiring.
                            </p>
                        </section>
                    </div>
                </aside>
            </div>


            {/* MOBILE PROGRESS */}

            <section
                className="
                    mt-6
                    rounded-2xl
                    border
                    border-white/[0.06]
                    bg-white/[0.018]
                    p-4
                    xl:hidden
                "
            >
                <div
                    className="
                        flex
                        items-center
                        justify-between
                        gap-3
                    "
                >
                    <div className="flex items-center gap-2">
                        <CheckCircle2
                            size={15}
                            className="text-cyan-300"
                        />

                        <span
                            className="
                                text-xs
                                font-black
                                text-gray-300
                            "
                        >
                            Yechim tayyorligi
                        </span>
                    </div>

                    <span
                        className="
                            text-xs
                            font-black
                            text-cyan-300
                        "
                    >
                        {formStatus.percent}%
                    </span>
                </div>

                <div
                    className="
                        mt-3
                        h-1.5
                        overflow-hidden
                        rounded-full
                        bg-white/[0.05]
                    "
                >
                    <div
                        className="
                            h-full
                            rounded-full
                            bg-gradient-to-r
                            from-cyan-400
                            to-indigo-500
                            transition-all
                            duration-500
                        "
                        style={{
                            width: `${formStatus.percent}%`,
                        }}
                    />
                </div>
            </section>


            {/* FOOTER */}

            <div
                className="
                    mt-6
                    flex
                    flex-col
                    gap-4
                    border-t
                    border-white/[0.06]
                    pt-5

                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >
                <div
                    className="
                        flex
                        max-w-xl
                        items-start
                        gap-2
                        text-[10px]
                        font-medium
                        leading-5
                        text-gray-700
                    "
                >
                    <Lightbulb
                        size={13}
                        className="
                            mt-0.5
                            shrink-0
                            text-yellow-500
                        "
                    />

                    <span>
                        Qisqa yechim, batafsil tushuntirish va til tanlash
                        majburiy. Kod namunasi ixtiyoriy.
                    </span>
                </div>


                <button
                    type="submit"
                    disabled={
                        isSubmitting ||
                        isLanguagesLoading
                    }
                    className="
                        group
                        relative
                        inline-flex
                        min-h-[44px]
                        min-w-[205px]
                        items-center
                        justify-center
                        gap-2
                        overflow-hidden
                        rounded-xl
                        border
                        border-cyan-400/25
                        bg-gradient-to-r
                        from-cyan-600
                        via-blue-600
                        to-indigo-600
                        px-5
                        py-2.5
                        text-xs
                        font-black
                        text-white
                        shadow-lg
                        shadow-cyan-600/15
                        transition-all

                        hover:-translate-y-0.5
                        hover:shadow-cyan-500/25

                        active:translate-y-0
                        active:scale-[0.98]

                        disabled:cursor-not-allowed
                        disabled:opacity-50
                        disabled:hover:translate-y-0
                    "
                >
                    {!isSubmitting && (
                        <span
                            className="
                                pointer-events-none
                                absolute
                                inset-y-0
                                -left-16
                                w-12
                                rotate-12
                                bg-white/[0.10]
                                blur-md
                                transition-all
                                duration-700

                                group-hover:left-[120%]
                            "
                        />
                    )}

                    <span
                        className="
                            relative
                            z-10
                            inline-flex
                            items-center
                            gap-2
                        "
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2
                                    size={16}
                                    className="animate-spin"
                                />

                                Yuborilmoqda...
                            </>
                        ) : isLanguagesLoading ? (
                            <>
                                <Loader2
                                    size={16}
                                    className="animate-spin"
                                />

                                Tillar yuklanmoqda...
                            </>
                        ) : (
                            <>
                                <Send size={16} />
                                Yechimni yuborish
                            </>
                        )}
                    </span>
                </button>
            </div>
        </form>
    );
};


export default ProblemResponseForm;