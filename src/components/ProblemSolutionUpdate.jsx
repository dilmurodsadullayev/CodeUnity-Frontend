import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import Editor from "react-simple-code-editor";

import {
    highlight,
    languages,
} from "prismjs/components/prism-core";

import "prismjs/themes/prism-dark.css";


// =========================================================
// PRISM LANGUAGES
// =========================================================

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


// =========================================================
// ICONS
// =========================================================

import {
    AlertCircle,
    ArrowLeft,
    CheckCircle2,
    Code2,
    FileCode2,
    FileText,
    Loader2,
    Pencil,
    RefreshCw,
    Save,
    ShieldAlert,
    Sparkles,
    Terminal,
    Trash2,
} from "lucide-react";


// =========================================================
// SERVICES
// =========================================================

import ProblemResponseService from "../services/problemResponse";


// =========================================================
// COMPONENTS
// =========================================================

import DeleteConfirmationModal from "./DeleteConfirmationModal";


// =========================================================
// TOAST
// =========================================================

import {
    siteToast,
} from "./ui/AuthToast";


// =========================================================
// CONSTANTS
// =========================================================

const DEFAULT_LANGUAGE =
    "javascript";


// =========================================================
// ERROR MESSAGE
// =========================================================

const getErrorMessage = (
    error,
    fallback = "Noma’lum xatolik yuz berdi."
) => {
    return (
        error?.response?.data?.detail
        ||
        error?.response?.data?.message
        ||
        error?.response?.data?.error
        ||
        error?.message
        ||
        fallback
    );
};


// =========================================================
// NORMALIZE LANGUAGE NAME
// =========================================================

const getSolutionLanguageName = (
    solution
) => {
    if (
        solution?.language_data?.name
    ) {
        return solution.language_data.name;
    }


    if (
        solution?.language_name
    ) {
        return solution.language_name;
    }


    if (
        typeof solution?.language ===
        "string"
    ) {
        return solution.language;
    }


    if (
        solution?.language?.name
    ) {
        return solution.language.name;
    }


    return "JavaScript";
};


// =========================================================
// PRISM LANGUAGE MAP
// =========================================================

const getPrismLanguageName = (
    languageName
) => {
    if (
        !languageName
    ) {
        return DEFAULT_LANGUAGE;
    }


    const value =
        String(
            languageName
        )
            .trim()
            .toLowerCase();


    if (
        value.includes(
            "typescript"
        )
        &&
        value.includes(
            "react"
        )
    ) {
        return "tsx";
    }


    if (
        value ===
        "tsx"
    ) {
        return "tsx";
    }


    if (
        value.includes(
            "react"
        )
        ||
        value ===
        "jsx"
    ) {
        return "jsx";
    }


    if (
        value.includes(
            "typescript"
        )
    ) {
        return "typescript";
    }


    if (
        value.includes(
            "javascript"
        )
        ||
        value ===
        "js"
    ) {
        return "javascript";
    }


    if (
        value.includes(
            "python"
        )
        ||
        value.includes(
            "django"
        )
        ||
        value.includes(
            "fastapi"
        )
        ||
        value.includes(
            "flask"
        )
    ) {
        return "python";
    }


    if (
        value ===
        "html"
        ||
        value.includes(
            "html"
        )
    ) {
        return "markup";
    }


    if (
        value ===
        "css"
        ||
        value.includes(
            "tailwind"
        )
    ) {
        return "css";
    }


    if (
        value ===
        "java"
    ) {
        return "java";
    }


    if (
        value ===
        "c"
    ) {
        return "c";
    }


    if (
        value.includes(
            "c++"
        )
        ||
        value ===
        "cpp"
    ) {
        return "cpp";
    }


    if (
        value.includes(
            "c#"
        )
        ||
        value ===
        "csharp"
    ) {
        return "csharp";
    }


    if (
        value.includes(
            "postgres"
        )
        ||
        value.includes(
            "mysql"
        )
        ||
        value.includes(
            "sqlite"
        )
        ||
        value ===
        "sql"
    ) {
        return "sql";
    }


    if (
        value.includes(
            "php"
        )
        ||
        value.includes(
            "laravel"
        )
    ) {
        return "php";
    }


    if (
        value.includes(
            "bash"
        )
        ||
        value.includes(
            "linux"
        )
        ||
        value.includes(
            "shell"
        )
    ) {
        return "bash";
    }


    if (
        value ===
        "json"
    ) {
        return "json";
    }


    if (
        value ===
        "go"
        ||
        value ===
        "golang"
    ) {
        return "go";
    }


    if (
        value ===
        "rust"
    ) {
        return "rust";
    }


    return DEFAULT_LANGUAGE;
};


// =========================================================
// LOADING STATE
// =========================================================

const LoadingState = () => {
    return (
        <div
            className="
                mx-auto
                w-full
                max-w-5xl
                px-4
                py-10

                sm:px-6
                lg:px-8
            "
        >
            <div
                className="
                    overflow-hidden
                    rounded-[30px]
                    border
                    border-white/[0.07]
                    bg-white/[0.025]
                    shadow-2xl
                    shadow-black/20
                "
            >
                <div
                    className="
                        flex
                        items-center
                        gap-4
                        border-b
                        border-white/[0.06]
                        px-5
                        py-5

                        sm:px-7
                    "
                >
                    <div
                        className="
                            h-11
                            w-11
                            animate-pulse
                            rounded-2xl
                            bg-white/[0.06]
                        "
                    />

                    <div
                        className="
                            flex-1
                            space-y-2
                        "
                    >
                        <div
                            className="
                                h-4
                                w-48
                                animate-pulse
                                rounded
                                bg-white/[0.06]
                            "
                        />

                        <div
                            className="
                                h-3
                                w-72
                                max-w-full
                                animate-pulse
                                rounded
                                bg-white/[0.04]
                            "
                        />
                    </div>
                </div>


                <div
                    className="
                        space-y-6
                        p-5

                        sm:p-7
                    "
                >
                    <div
                        className="
                            h-14
                            animate-pulse
                            rounded-2xl
                            bg-white/[0.04]
                        "
                    />

                    <div
                        className="
                            h-40
                            animate-pulse
                            rounded-2xl
                            bg-white/[0.04]
                        "
                    />

                    <div
                        className="
                            h-64
                            animate-pulse
                            rounded-2xl
                            bg-white/[0.04]
                        "
                    />
                </div>
            </div>
        </div>
    );
};


// =========================================================
// ERROR STATE
// =========================================================

const ErrorState = ({
    message,
    onRetry,
    onBack,
}) => {
    return (
        <div
            className="
                mx-auto
                flex
                min-h-[55vh]
                w-full
                max-w-3xl
                items-center
                justify-center
                px-4
                py-12
            "
        >
            <div
                className="
                    relative
                    w-full
                    overflow-hidden
                    rounded-[30px]
                    border
                    border-red-400/15
                    bg-red-500/[0.035]
                    p-6
                    text-center
                    shadow-2xl
                    shadow-black/30

                    sm:p-9
                "
            >
                <div
                    className="
                        pointer-events-none
                        absolute
                        left-1/2
                        top-0
                        h-40
                        w-40
                        -translate-x-1/2
                        -translate-y-1/2
                        rounded-full
                        bg-red-500/10
                        blur-[80px]
                    "
                />


                <div
                    className="
                        relative
                        mx-auto
                        grid
                        h-16
                        w-16
                        place-items-center
                        rounded-[20px]
                        border
                        border-red-400/15
                        bg-red-500/[0.07]
                        text-red-300
                    "
                >
                    <AlertCircle
                        size={28}
                    />
                </div>


                <h2
                    className="
                        mt-5
                        text-xl
                        font-black
                        tracking-tight
                        text-white

                        sm:text-2xl
                    "
                >
                    Yechim yuklanmadi
                </h2>


                <p
                    className="
                        mx-auto
                        mt-3
                        max-w-lg
                        text-sm
                        font-medium
                        leading-6
                        text-gray-500
                    "
                >
                    {message}
                </p>


                <div
                    className="
                        mt-6
                        flex
                        flex-col
                        justify-center
                        gap-2.5

                        sm:flex-row
                    "
                >
                    <button
                        type="button"
                        onClick={
                            onBack
                        }
                        className="
                            inline-flex
                            min-h-[44px]
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-white/[0.07]
                            bg-white/[0.025]
                            px-5
                            py-2.5
                            text-xs
                            font-black
                            text-gray-400
                            transition

                            hover:bg-white/[0.05]
                            hover:text-white
                        "
                    >
                        <ArrowLeft
                            size={15}
                        />

                        Ortga
                    </button>


                    <button
                        type="button"
                        onClick={
                            onRetry
                        }
                        className="
                            inline-flex
                            min-h-[44px]
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-cyan-400/20
                            bg-cyan-500/[0.08]
                            px-5
                            py-2.5
                            text-xs
                            font-black
                            text-cyan-300
                            transition

                            hover:bg-cyan-500/[0.14]
                        "
                    >
                        <RefreshCw
                            size={15}
                        />

                        Qayta urinish
                    </button>
                </div>
            </div>
        </div>
    );
};


// =========================================================
// PROBLEM SOLUTION UPDATE
// =========================================================

const ProblemSolutionUpdate = () => {

    // =====================================================
    // ROUTER
    // =====================================================

    const {
        id,
        solutionId,
    } = useParams();


    const navigate =
        useNavigate();


    // =====================================================
    // FORM STATE
    // =====================================================

    const [
        shortInfo,
        setShortInfo,
    ] = useState(
        ""
    );


    const [
        description,
        setDescription,
    ] = useState(
        ""
    );


    const [
        code,
        setCode,
    ] = useState(
        ""
    );


    const [
        languageName,
        setLanguageName,
    ] = useState(
        "JavaScript"
    );


    // =====================================================
    // REQUEST STATE
    // =====================================================

    const [
        loading,
        setLoading,
    ] = useState(
        true
    );


    const [
        error,
        setError,
    ] = useState(
        ""
    );


    const [
        isUpdating,
        setIsUpdating,
    ] = useState(
        false
    );


    const [
        isDeleting,
        setIsDeleting,
    ] = useState(
        false
    );


    const [
        isDeleteModalOpen,
        setIsDeleteModalOpen,
    ] = useState(
        false
    );


    const [
        formError,
        setFormError,
    ] = useState(
        ""
    );


    // =====================================================
    // REFS
    // =====================================================

    const isMounted =
        useRef(
            true
        );


    // =====================================================
    // CURRENT PRISM LANGUAGE
    // =====================================================

    const prismLanguageName =
        useMemo(
            () =>
                getPrismLanguageName(
                    languageName
                ),
            [
                languageName,
            ]
        );


    // =====================================================
    // BACK TO PROBLEM
    // =====================================================

    const goToProblem =
        useCallback(
            () => {
                if (
                    id
                ) {
                    navigate(
                        `/problem/${id}/detail`
                    );

                    return;
                }


                navigate(
                    -1
                );
            },
            [
                id,
                navigate,
            ]
        );


    // =====================================================
    // FETCH SOLUTION
    // =====================================================

    const fetchSolution =
        useCallback(
            async ({
                showLoading = true,
            } = {}) => {

                if (
                    !solutionId
                ) {
                    setLoading(
                        false
                    );


                    setError(
                        "Yechim ID topilmadi."
                    );


                    return;
                }


                if (
                    showLoading
                ) {
                    setLoading(
                        true
                    );
                }


                setError(
                    ""
                );


                try {
                    const data =
                        await ProblemResponseService
                            .getSolutionById(
                                solutionId
                            );


                    if (
                        !isMounted.current
                    ) {
                        return;
                    }


                    if (
                        !data
                    ) {
                        throw new Error(
                            "Yechim ma’lumotlari topilmadi."
                        );
                    }


                    setShortInfo(
                        data?.answer
                        ||
                        ""
                    );


                    setDescription(
                        data?.description
                        ||
                        ""
                    );


                    setCode(
                        data?.code
                        ||
                        ""
                    );


                    setLanguageName(
                        getSolutionLanguageName(
                            data
                        )
                    );


                    setFormError(
                        ""
                    );

                } catch (
                    requestError
                ) {
                    console.error(
                        "Yechimni yuklashda xatolik:",
                        requestError
                    );


                    if (
                        !isMounted.current
                    ) {
                        return;
                    }


                    setError(
                        getErrorMessage(
                            requestError,
                            "Yechimni yuklashda xatolik yuz berdi."
                        )
                    );

                } finally {
                    if (
                        isMounted.current
                    ) {
                        setLoading(
                            false
                        );
                    }
                }
            },
            [
                solutionId,
            ]
        );


    // =====================================================
    // MOUNT
    // =====================================================

    useEffect(
        () => {
            isMounted.current =
                true;


            fetchSolution();


            return () => {
                isMounted.current =
                    false;
            };
        },
        [
            fetchSolution,
        ]
    );


    // =====================================================
    // HIGHLIGHT CODE
    // =====================================================

    const highlightCode =
        useCallback(
            (
                codeToHighlight
            ) => {
                const grammar =
                    languages[
                        prismLanguageName
                    ]
                    ||
                    languages.javascript
                    ||
                    languages.clike;


                if (
                    !grammar
                ) {
                    return codeToHighlight;
                }


                try {
                    return highlight(
                        codeToHighlight,
                        grammar,
                        prismLanguageName
                    );

                } catch (
                    highlightError
                ) {
                    console.error(
                        "Syntax highlight xatosi:",
                        highlightError
                    );


                    return codeToHighlight;
                }
            },
            [
                prismLanguageName,
            ]
        );


    // =====================================================
    // VALIDATION
    // =====================================================

    const validateForm =
        () => {
            const cleanShortInfo =
                shortInfo
                    .trim();


            const cleanDescription =
                description
                    .trim();


            if (
                !cleanShortInfo
            ) {
                return (
                    "Qisqa ma’lumotni kiriting."
                );
            }


            if (
                cleanShortInfo.length <
                5
            ) {
                return (
                    "Qisqa ma’lumot kamida 5 ta belgidan iborat bo‘lishi kerak."
                );
            }


            if (
                cleanShortInfo.length >
                255
            ) {
                return (
                    "Qisqa ma’lumot 255 ta belgidan oshmasligi kerak."
                );
            }


            if (
                !cleanDescription
            ) {
                return (
                    "Yechim tavsifini kiriting."
                );
            }


            if (
                cleanDescription.length <
                15
            ) {
                return (
                    "Yechimni biroz batafsilroq tushuntiring."
                );
            }


            return null;
        };


    // =====================================================
    // UPDATE
    // =====================================================

    const handleUpdate =
        async (
            event
        ) => {
            event.preventDefault();


            if (
                isUpdating
                ||
                isDeleting
            ) {
                return;
            }


            setFormError(
                ""
            );


            const validationError =
                validateForm();


            if (
                validationError
            ) {
                setFormError(
                    validationError
                );


                siteToast.warning(
                    validationError,
                    {
                        title:
                            "Yechimni tekshiring",

                        duration:
                            4000,
                    }
                );


                return;
            }


            if (
                !solutionId
            ) {
                siteToast.error(
                    "Yechim ID topilmadi.",
                    {
                        title:
                            "Yangilash bajarilmadi",
                    }
                );


                return;
            }


            const updatedSolutionData = {
                answer:
                    shortInfo
                        .trim(),

                description:
                    description
                        .trim(),

                code:
                    code
                        .trim(),
            };


            setIsUpdating(
                true
            );


            const toastId =
                siteToast.loading(
                    "Yechimdagi o‘zgarishlar saqlanmoqda...",
                    {
                        title:
                            "Yechim yangilanmoqda",
                    }
                );


            try {
                await ProblemResponseService
                    .updateSolution(
                        solutionId,
                        updatedSolutionData
                    );


                if (
                    !isMounted.current
                ) {
                    return;
                }


                siteToast.success(
                    "Yechim muvaffaqiyatli yangilandi.",
                    {
                        id:
                            toastId,

                        title:
                            "O‘zgarishlar saqlandi",

                        duration:
                            3000,
                    }
                );


                goToProblem();

            } catch (
                requestError
            ) {
                console.error(
                    "Yechimni yangilashda xatolik:",
                    requestError
                );


                if (
                    !isMounted.current
                ) {
                    return;
                }


                const message =
                    getErrorMessage(
                        requestError,
                        "Yechimni yangilashda xatolik yuz berdi."
                    );


                setFormError(
                    message
                );


                siteToast.error(
                    message,
                    {
                        id:
                            toastId,

                        title:
                            "Yechim yangilanmadi",

                        duration:
                            5000,
                    }
                );

            } finally {
                if (
                    isMounted.current
                ) {
                    setIsUpdating(
                        false
                    );
                }
            }
        };


    // =====================================================
    // OPEN DELETE MODAL
    // =====================================================

    const handleOpenDeleteModal =
        () => {
            if (
                isUpdating
                ||
                isDeleting
            ) {
                return;
            }


            setIsDeleteModalOpen(
                true
            );
        };


    // =====================================================
    // CLOSE DELETE MODAL
    // =====================================================

    const handleCloseDeleteModal =
        () => {
            if (
                isDeleting
            ) {
                return;
            }


            setIsDeleteModalOpen(
                false
            );
        };


    // =====================================================
    // DELETE
    // =====================================================

    const handleDeleteConfirm =
        async () => {
            if (
                isDeleting
                ||
                isUpdating
            ) {
                return;
            }


            if (
                !solutionId
            ) {
                siteToast.error(
                    "Yechim ID topilmadi.",
                    {
                        title:
                            "O‘chirish bajarilmadi",
                    }
                );


                return;
            }


            setIsDeleting(
                true
            );


            const toastId =
                siteToast.loading(
                    "Yechim o‘chirilmoqda...",
                    {
                        title:
                            "Yechim o‘chirilmoqda",
                    }
                );


            try {
                await ProblemResponseService
                    .deleteSolution(
                        solutionId
                    );


                if (
                    !isMounted.current
                ) {
                    return;
                }


                setIsDeleteModalOpen(
                    false
                );


                siteToast.success(
                    "Yechim muvaffaqiyatli o‘chirildi.",
                    {
                        id:
                            toastId,

                        title:
                            "Yechim o‘chirildi",

                        duration:
                            3000,
                    }
                );


                goToProblem();

            } catch (
                requestError
            ) {
                console.error(
                    "Yechimni o‘chirishda xatolik:",
                    requestError
                );


                if (
                    !isMounted.current
                ) {
                    return;
                }


                siteToast.error(
                    getErrorMessage(
                        requestError,
                        "Yechimni o‘chirishda xatolik yuz berdi."
                    ),
                    {
                        id:
                            toastId,

                        title:
                            "Yechim o‘chirilmadi",

                        duration:
                            5000,
                    }
                );

            } finally {
                if (
                    isMounted.current
                ) {
                    setIsDeleting(
                        false
                    );
                }
            }
        };


    // =====================================================
    // CANCEL
    // =====================================================

    const handleCancel =
        () => {
            if (
                isUpdating
                ||
                isDeleting
            ) {
                return;
            }


            goToProblem();
        };


    // =====================================================
    // LOADING
    // =====================================================

    if (
        loading
    ) {
        return (
            <LoadingState />
        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (
        error
    ) {
        return (
            <ErrorState
                message={
                    error
                }
                onRetry={() =>
                    fetchSolution()
                }
                onBack={
                    goToProblem
                }
            />
        );
    }


    // =====================================================
    // JSX
    // =====================================================

    return (
        <>
            <section
                className="
                    relative
                    mx-auto
                    w-full
                    max-w-5xl
                    px-4
                    py-8

                    sm:px-6
                    sm:py-10

                    lg:px-8
                "
            >

                {/* =================================================
                    BACKGROUND GLOW
                ================================================== */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        -left-24
                        top-20
                        h-72
                        w-72
                        rounded-full
                        bg-cyan-500/[0.035]
                        blur-[110px]
                    "
                />


                <div
                    className="
                        pointer-events-none
                        absolute
                        -right-24
                        top-72
                        h-72
                        w-72
                        rounded-full
                        bg-indigo-500/[0.035]
                        blur-[110px]
                    "
                />


                {/* =================================================
                    TOP BAR
                ================================================== */}

                <div
                    className="
                        relative
                        z-10
                        mb-5
                        flex
                        flex-col
                        gap-4

                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >
                    <button
                        type="button"
                        onClick={
                            handleCancel
                        }
                        disabled={
                            isUpdating
                            ||
                            isDeleting
                        }
                        className="
                            inline-flex
                            w-fit
                            items-center
                            gap-2
                            rounded-xl
                            border
                            border-white/[0.07]
                            bg-white/[0.025]
                            px-3.5
                            py-2
                            text-xs
                            font-black
                            text-gray-500
                            transition

                            hover:bg-white/[0.05]
                            hover:text-white

                            disabled:cursor-not-allowed
                            disabled:opacity-40
                        "
                    >
                        <ArrowLeft
                            size={15}
                        />

                        Muammoga qaytish
                    </button>


                    <div
                        className="
                            inline-flex
                            w-fit
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-cyan-400/10
                            bg-cyan-500/[0.035]
                            px-3
                            py-1.5
                            font-mono
                            text-[9px]
                            font-black
                            uppercase
                            tracking-[0.18em]
                            text-cyan-400
                        "
                    >
                        <ShieldAlert
                            size={12}
                        />

                        Edit solution
                    </div>
                </div>


                {/* =================================================
                    MAIN CARD
                ================================================== */}

                <div
                    className="
                        relative
                        z-10
                        overflow-hidden
                        rounded-[30px]
                        border
                        border-white/[0.075]
                        bg-[#090d14]/85
                        shadow-[0_30px_100px_rgba(0,0,0,0.35)]
                        backdrop-blur-2xl
                    "
                >

                    {/* =============================================
                        HEADER
                    ============================================== */}

                    <header
                        className="
                            relative
                            overflow-hidden
                            border-b
                            border-white/[0.06]
                            px-5
                            py-6

                            sm:px-7
                            sm:py-7
                        "
                    >
                        <div
                            className="
                                pointer-events-none
                                absolute
                                -right-14
                                -top-20
                                h-52
                                w-52
                                rounded-full
                                bg-cyan-500/[0.06]
                                blur-[80px]
                            "
                        />


                        <div
                            className="
                                relative
                                flex
                                flex-col
                                gap-5

                                sm:flex-row
                                sm:items-start
                                sm:justify-between
                            "
                        >
                            <div
                                className="
                                    flex
                                    items-start
                                    gap-4
                                "
                            >
                                <div
                                    className="
                                        grid
                                        h-12
                                        w-12
                                        shrink-0
                                        place-items-center
                                        rounded-2xl
                                        border
                                        border-cyan-400/15
                                        bg-cyan-500/[0.055]
                                        text-cyan-300
                                    "
                                >
                                    <Pencil
                                        size={21}
                                    />
                                </div>


                                <div>
                                    <div
                                        className="
                                            mb-2
                                            flex
                                            flex-wrap
                                            items-center
                                            gap-2
                                        "
                                    >
                                        <span
                                            className="
                                                inline-flex
                                                items-center
                                                gap-1.5
                                                rounded-full
                                                border
                                                border-white/[0.06]
                                                bg-white/[0.025]
                                                px-2.5
                                                py-1
                                                text-[9px]
                                                font-black
                                                uppercase
                                                tracking-[0.14em]
                                                text-gray-500
                                            "
                                        >
                                            <FileCode2
                                                size={11}
                                            />

                                            #{solutionId}
                                        </span>


                                        <span
                                            className="
                                                inline-flex
                                                items-center
                                                gap-1.5
                                                rounded-full
                                                border
                                                border-indigo-400/10
                                                bg-indigo-500/[0.04]
                                                px-2.5
                                                py-1
                                                text-[9px]
                                                font-black
                                                uppercase
                                                tracking-[0.14em]
                                                text-indigo-300
                                            "
                                        >
                                            <Code2
                                                size={11}
                                            />

                                            {languageName}
                                        </span>
                                    </div>


                                    <h1
                                        className="
                                            text-2xl
                                            font-black
                                            tracking-tight
                                            text-white

                                            sm:text-3xl
                                        "
                                    >
                                        Yechimni tahrirlash
                                    </h1>


                                    <p
                                        className="
                                            mt-2
                                            max-w-2xl
                                            text-sm
                                            font-medium
                                            leading-6
                                            text-gray-500
                                        "
                                    >
                                        Yechim matni, tushuntirish va koddagi
                                        o‘zgarishlarni tekshirib, keyin saqlang.
                                    </p>
                                </div>
                            </div>


                            <div
                                className="
                                    hidden
                                    items-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-emerald-400/10
                                    bg-emerald-500/[0.035]
                                    px-3
                                    py-2
                                    text-[10px]
                                    font-black
                                    text-emerald-300

                                    md:inline-flex
                                "
                            >
                                <Sparkles
                                    size={13}
                                />

                                Existing solution
                            </div>
                        </div>
                    </header>


                    {/* =============================================
                        FORM
                    ============================================== */}

                    <form
                        onSubmit={
                            handleUpdate
                        }
                        className="
                            p-5

                            sm:p-7
                        "
                    >

                        <div
                            className="
                                space-y-6
                            "
                        >

                            {/* =====================================
                                FORM ERROR
                            ====================================== */}

                            {formError && (
                                <div
                                    className="
                                        flex
                                        items-start
                                        gap-3
                                        rounded-2xl
                                        border
                                        border-red-400/15
                                        bg-red-500/[0.04]
                                        p-4
                                    "
                                >
                                    <AlertCircle
                                        size={17}
                                        className="
                                            mt-0.5
                                            shrink-0
                                            text-red-300
                                        "
                                    />


                                    <div>
                                        <p
                                            className="
                                                text-xs
                                                font-black
                                                text-red-200
                                            "
                                        >
                                            Ma’lumotlarni tekshiring
                                        </p>


                                        <p
                                            className="
                                                mt-1
                                                text-xs
                                                font-medium
                                                leading-5
                                                text-red-300/70
                                            "
                                        >
                                            {formError}
                                        </p>
                                    </div>
                                </div>
                            )}


                            {/* =====================================
                                SHORT INFO
                            ====================================== */}

                            <div>
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
                                            size={15}
                                            className="
                                                text-cyan-400
                                            "
                                        />

                                        Qisqa ma’lumot

                                        <span
                                            className="
                                                text-red-400
                                            "
                                        >
                                            *
                                        </span>
                                    </label>


                                    <span
                                        className={`
                                            font-mono
                                            text-[10px]
                                            font-bold

                                            ${
                                                shortInfo.length >
                                                255
                                                    ? "text-red-400"
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
                                    value={
                                        shortInfo
                                    }
                                    onChange={(
                                        event
                                    ) => {
                                        setShortInfo(
                                            event.target.value
                                        );


                                        if (
                                            formError
                                        ) {
                                            setFormError(
                                                ""
                                            );
                                        }
                                    }}
                                    disabled={
                                        isUpdating
                                        ||
                                        isDeleting
                                    }
                                    autoComplete="off"
                                    placeholder="Masalan: API so‘rovini async/await orqali tuzatish"
                                    className="
                                        min-h-[52px]
                                        w-full
                                        rounded-2xl
                                        border
                                        border-white/[0.08]
                                        bg-black/20
                                        px-4
                                        py-3
                                        text-sm
                                        font-semibold
                                        text-white
                                        outline-none
                                        transition

                                        placeholder:text-gray-700

                                        focus:border-cyan-400/30
                                        focus:bg-cyan-500/[0.025]
                                        focus:ring-4
                                        focus:ring-cyan-500/[0.04]

                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                />
                            </div>


                            {/* =====================================
                                DESCRIPTION
                            ====================================== */}

                            <div>
                                <div
                                    className="
                                        mb-2.5
                                        flex
                                        items-center
                                        justify-between
                                    "
                                >
                                    <label
                                        htmlFor="description"
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
                                            size={15}
                                            className="
                                                text-indigo-400
                                            "
                                        />

                                        Batafsil tushuntirish

                                        <span
                                            className="
                                                text-red-400
                                            "
                                        >
                                            *
                                        </span>
                                    </label>


                                    <span
                                        className="
                                            font-mono
                                            text-[10px]
                                            font-bold
                                            text-gray-700
                                        "
                                    >
                                        {
                                            description
                                                .length
                                        } belgi
                                    </span>
                                </div>


                                <textarea
                                    id="description"
                                    rows={7}
                                    value={
                                        description
                                    }
                                    onChange={(
                                        event
                                    ) => {
                                        setDescription(
                                            event.target.value
                                        );


                                        if (
                                            formError
                                        ) {
                                            setFormError(
                                                ""
                                            );
                                        }
                                    }}
                                    disabled={
                                        isUpdating
                                        ||
                                        isDeleting
                                    }
                                    placeholder="Muammo nimadan kelib chiqqani va yechim qanday ishlashini tushuntiring..."
                                    className="
                                        w-full
                                        resize-y
                                        rounded-2xl
                                        border
                                        border-white/[0.08]
                                        bg-black/20
                                        px-4
                                        py-3.5
                                        text-sm
                                        font-medium
                                        leading-7
                                        text-white
                                        outline-none
                                        transition

                                        placeholder:text-gray-700

                                        focus:border-indigo-400/30
                                        focus:bg-indigo-500/[0.025]
                                        focus:ring-4
                                        focus:ring-indigo-500/[0.04]

                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                />
                            </div>


                            {/* =====================================
                                CODE EDITOR
                            ====================================== */}

                            <div>
                                <div
                                    className="
                                        mb-2.5
                                        flex
                                        flex-col
                                        gap-2

                                        sm:flex-row
                                        sm:items-center
                                        sm:justify-between
                                    "
                                >
                                    <label
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            text-xs
                                            font-black
                                            text-gray-300
                                        "
                                    >
                                        <Terminal
                                            size={15}
                                            className="
                                                text-emerald-400
                                            "
                                        />

                                        Yechim kodi

                                        <span
                                            className="
                                                font-medium
                                                text-gray-700
                                            "
                                        >
                                            ixtiyoriy
                                        </span>
                                    </label>


                                    <span
                                        className="
                                            inline-flex
                                            w-fit
                                            items-center
                                            gap-1.5
                                            rounded-full
                                            border
                                            border-emerald-400/10
                                            bg-emerald-500/[0.035]
                                            px-2.5
                                            py-1
                                            font-mono
                                            text-[9px]
                                            font-black
                                            uppercase
                                            tracking-[0.12em]
                                            text-emerald-300
                                        "
                                    >
                                        <Code2
                                            size={11}
                                        />

                                        {languageName}
                                    </span>
                                </div>


                                <div
                                    className="
                                        overflow-hidden
                                        rounded-[22px]
                                        border
                                        border-white/[0.08]
                                        bg-[#05080d]
                                        shadow-inner
                                        shadow-black/30
                                    "
                                >

                                    {/* TERMINAL HEADER */}

                                    <div
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                            gap-4
                                            border-b
                                            border-white/[0.06]
                                            bg-white/[0.025]
                                            px-4
                                            py-2.5
                                        "
                                    >
                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-2
                                            "
                                        >
                                            <span
                                                className="
                                                    h-2.5
                                                    w-2.5
                                                    rounded-full
                                                    bg-red-400/70
                                                "
                                            />

                                            <span
                                                className="
                                                    h-2.5
                                                    w-2.5
                                                    rounded-full
                                                    bg-amber-400/70
                                                "
                                            />

                                            <span
                                                className="
                                                    h-2.5
                                                    w-2.5
                                                    rounded-full
                                                    bg-emerald-400/70
                                                "
                                            />
                                        </div>


                                        <span
                                            className="
                                                truncate
                                                font-mono
                                                text-[9px]
                                                font-bold
                                                uppercase
                                                tracking-[0.14em]
                                                text-gray-700
                                            "
                                        >
                                            solution.editor
                                        </span>
                                    </div>


                                    {/* EDITOR */}

                                    <div
                                        className="
                                            max-h-[480px]
                                            min-h-[250px]
                                            overflow-auto
                                        "
                                    >
                                        <Editor
                                            value={
                                                code
                                            }
                                            onValueChange={
                                                setCode
                                            }
                                            highlight={
                                                highlightCode
                                            }
                                            padding={18}
                                            disabled={
                                                isUpdating
                                                ||
                                                isDeleting
                                            }
                                            textareaClassName="
                                                focus:outline-none
                                            "
                                            style={{
                                                fontFamily:
                                                    '"Fira Code", "Fira Mono", "JetBrains Mono", monospace',

                                                fontSize:
                                                    13,

                                                lineHeight:
                                                    1.8,

                                                minHeight:
                                                    "250px",

                                                backgroundColor:
                                                    "transparent",

                                                color:
                                                    "#e5e7eb",

                                                tabSize:
                                                    4,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>


                            {/* =====================================
                                INFORMATION
                            ====================================== */}

                            <div
                                className="
                                    flex
                                    items-start
                                    gap-3
                                    rounded-2xl
                                    border
                                    border-cyan-400/10
                                    bg-cyan-500/[0.025]
                                    p-4
                                "
                            >
                                <CheckCircle2
                                    size={16}
                                    className="
                                        mt-0.5
                                        shrink-0
                                        text-cyan-400
                                    "
                                />


                                <p
                                    className="
                                        text-[11px]
                                        font-medium
                                        leading-5
                                        text-gray-600
                                    "
                                >
                                    Yangilash mavjud yechimni almashtiradi.
                                    Muammo sahifasiga qaytgandan so‘ng
                                    yangi ma’lumotlar avtomatik ko‘rinadi.
                                </p>
                            </div>
                        </div>


                        {/* =========================================
                            ACTIONS
                        ========================================== */}

                        <div
                            className="
                                mt-7
                                flex
                                flex-col-reverse
                                gap-3
                                border-t
                                border-white/[0.06]
                                pt-6

                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                            "
                        >

                            {/* DELETE */}

                            <button
                                type="button"
                                onClick={
                                    handleOpenDeleteModal
                                }
                                disabled={
                                    isUpdating
                                    ||
                                    isDeleting
                                }
                                className="
                                    inline-flex
                                    min-h-[46px]
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-red-400/15
                                    bg-red-500/[0.045]
                                    px-5
                                    py-2.5
                                    text-xs
                                    font-black
                                    text-red-300
                                    transition

                                    hover:border-red-400/25
                                    hover:bg-red-500/[0.09]

                                    active:scale-[0.98]

                                    disabled:cursor-not-allowed
                                    disabled:opacity-40
                                "
                            >
                                {isDeleting ? (
                                    <Loader2
                                        size={16}
                                        className="
                                            animate-spin
                                        "
                                    />
                                ) : (
                                    <Trash2
                                        size={16}
                                    />
                                )}


                                {isDeleting
                                    ? "O‘chirilmoqda..."
                                    : "Yechimni o‘chirish"}
                            </button>


                            {/* RIGHT */}

                            <div
                                className="
                                    grid
                                    gap-2.5

                                    sm:flex
                                    sm:items-center
                                "
                            >
                                <button
                                    type="button"
                                    onClick={
                                        handleCancel
                                    }
                                    disabled={
                                        isUpdating
                                        ||
                                        isDeleting
                                    }
                                    className="
                                        inline-flex
                                        min-h-[46px]
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        border
                                        border-white/[0.07]
                                        bg-white/[0.025]
                                        px-5
                                        py-2.5
                                        text-xs
                                        font-black
                                        text-gray-400
                                        transition

                                        hover:bg-white/[0.05]
                                        hover:text-white

                                        disabled:cursor-not-allowed
                                        disabled:opacity-40
                                    "
                                >
                                    <ArrowLeft
                                        size={15}
                                    />

                                    Bekor qilish
                                </button>


                                <button
                                    type="submit"
                                    disabled={
                                        isUpdating
                                        ||
                                        isDeleting
                                    }
                                    className="
                                        inline-flex
                                        min-h-[46px]
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        border
                                        border-cyan-400/20
                                        bg-cyan-600
                                        px-6
                                        py-2.5
                                        text-xs
                                        font-black
                                        text-white
                                        shadow-lg
                                        shadow-cyan-600/10
                                        transition

                                        hover:bg-cyan-500

                                        active:scale-[0.98]

                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >
                                    {isUpdating ? (
                                        <>
                                            <Loader2
                                                size={16}
                                                className="
                                                    animate-spin
                                                "
                                            />

                                            Saqlanmoqda...
                                        </>
                                    ) : (
                                        <>
                                            <Save
                                                size={16}
                                            />

                                            O‘zgarishlarni saqlash
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>


                {/* =================================================
                    SMALL FOOTER
                ================================================== */}

                <div
                    className="
                        relative
                        z-10
                        mt-4
                        text-center
                    "
                >
                    <Link
                        to={
                            id
                                ? `/problem/${id}/detail`
                                : "/"
                        }
                        className="
                            text-[10px]
                            font-bold
                            text-gray-700
                            transition

                            hover:text-gray-400
                        "
                    >
                        Muammo sahifasiga qaytish
                    </Link>
                </div>
            </section>


            {/* =====================================================
                DELETE MODAL
            ====================================================== */}

            <DeleteConfirmationModal
                isOpen={
                    isDeleteModalOpen
                }
                onClose={
                    handleCloseDeleteModal
                }
                onConfirm={
                    handleDeleteConfirm
                }
                itemTitle={
                    shortInfo
                    ||
                    "Bu yechim"
                }
                isProcessing={
                    isDeleting
                }
            />
        </>
    );
};


export default ProblemSolutionUpdate;