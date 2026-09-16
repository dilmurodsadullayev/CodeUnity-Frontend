import React, {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    AnimatePresence,
    motion,
} from "framer-motion";

import toast from "react-hot-toast";

import {
    AlertCircle,
    Bug,
    FileImage,
    Heart,
    Lightbulb,
    Loader2,
    MessageSquareText,
    Save,
    UploadCloud,
    X,
} from "lucide-react";

import FeedbackService from "../../services/feedback";


// =========================================================
// CONFIG
// =========================================================

const MAX_FILE_SIZE =
    5 * 1024 * 1024;


const ALLOWED_FILE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
];


const FEEDBACK_TYPES = [
    {
        value:
            "bug",

        label:
            "Bug",

        Icon:
            Bug,
    },

    {
        value:
            "suggestion",

        label:
            "Taklif",

        Icon:
            Lightbulb,
    },

    {
        value:
            "praise",

        label:
            "Maqtov",

        Icon:
            Heart,
    },

    {
        value:
            "other",

        label:
            "Boshqa",

        Icon:
            MessageSquareText,
    },
];


// =========================================================
// ERROR PARSER
// =========================================================

const getErrorMessage = (
    error
) => {
    const data =
        error?.response?.data;


    if (!data) {
        return (
            error?.message
            ||
            "Server bilan bog‘lanishda xatolik yuz berdi."
        );
    }


    if (
        typeof data ===
        "string"
    ) {
        return data;
    }


    if (
        data?.detail
    ) {
        return data.detail;
    }


    if (
        data?.message
    ) {
        return data.message;
    }


    if (
        typeof data ===
        "object"
    ) {
        const firstKey =
            Object.keys(
                data
            )[0];


        if (
            firstKey
        ) {
            const value =
                data[
                    firstKey
                ];


            if (
                Array.isArray(
                    value
                )
            ) {
                return (
                    value[0]
                    ||
                    "Xatolik yuz berdi."
                );
            }


            if (
                typeof value ===
                "string"
            ) {
                return value;
            }
        }
    }


    return (
        "Feedbackni yangilashda "
        + "xatolik yuz berdi."
    );
};


// =========================================================
// EDIT MODAL
// =========================================================

const FeedbackEditModal = ({
    isOpen,
    feedback,
    onClose,
    onUpdated,
}) => {

    // =====================================================
    // FORM
    // =====================================================

    const [
        feedbackType,
        setFeedbackType,
    ] = useState(
        "suggestion"
    );


    const [
        title,
        setTitle,
    ] = useState("");


    const [
        message,
        setMessage,
    ] = useState("");


    const [
        newScreenshot,
        setNewScreenshot,
    ] = useState(
        null
    );


    // =====================================================
    // STATE
    // =====================================================

    const [
        isSubmitting,
        setIsSubmitting,
    ] = useState(
        false
    );


    const [
        error,
        setError,
    ] = useState("");


    const fileInputRef =
        useRef(
            null
        );


    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(
        () => {

            if (
                !isOpen
                ||
                !feedback
            ) {
                return;
            }


            setFeedbackType(
                feedback.feedback_type
                ||
                "suggestion"
            );


            setTitle(
                feedback.title
                ||
                ""
            );


            setMessage(
                feedback.message
                ||
                ""
            );


            setNewScreenshot(
                null
            );


            setError("");


            if (
                fileInputRef.current
            ) {

                fileInputRef.current.value =
                    "";

            }

        },
        [
            isOpen,
            feedback,
        ]
    );


    // =====================================================
    // PREVIEW
    // =====================================================

    const newPreviewUrl =
        useMemo(
            () => {

                if (
                    !newScreenshot
                ) {
                    return null;
                }


                return (
                    URL.createObjectURL(
                        newScreenshot
                    )
                );

            },
            [
                newScreenshot,
            ]
        );


    useEffect(
        () => {

            return () => {

                if (
                    newPreviewUrl
                ) {

                    URL.revokeObjectURL(
                        newPreviewUrl
                    );

                }
            };

        },
        [
            newPreviewUrl,
        ]
    );


    const currentScreenshot =
        feedback?.screenshot_url
        ||
        feedback?.screenshot
        ||
        null;


    // =====================================================
    // BODY LOCK
    // =====================================================

    useEffect(
        () => {

            if (
                !isOpen
            ) {
                return undefined;
            }


            document.body.style.overflow =
                "hidden";


            const handleKeyDown =
                (
                    event
                ) => {

                    if (
                        event.key ===
                        "Escape"
                        &&
                        !isSubmitting
                    ) {

                        onClose?.();

                    }
                };


            window.addEventListener(
                "keydown",
                handleKeyDown
            );


            return () => {

                document.body.style.overflow =
                    "";

                window.removeEventListener(
                    "keydown",
                    handleKeyDown
                );

            };

        },
        [
            isOpen,
            isSubmitting,
            onClose,
        ]
    );


    // =====================================================
    // CLOSE
    // =====================================================

    const handleClose =
        () => {

            if (
                isSubmitting
            ) {
                return;
            }


            setError("");

            setNewScreenshot(
                null
            );


            onClose?.();
        };


    // =====================================================
    // FILE CHANGE
    // =====================================================

    const handleFileChange =
        (
            event
        ) => {

            setError("");


            const file =
                event
                    .target
                    .files?.[0];


            if (
                !file
            ) {
                return;
            }


            if (
                !ALLOWED_FILE_TYPES.includes(
                    file.type
                )
            ) {

                const errorMessage =
                    "Faqat JPG, PNG yoki WEBP rasm yuklash mumkin.";


                setError(
                    errorMessage
                );


                toast.error(
                    errorMessage
                );


                event.target.value =
                    "";

                return;
            }


            if (
                file.size >
                MAX_FILE_SIZE
            ) {

                const errorMessage =
                    "Skrinshot hajmi 5 MB dan oshmasligi kerak.";


                setError(
                    errorMessage
                );


                toast.error(
                    errorMessage
                );


                event.target.value =
                    "";

                return;
            }


            setNewScreenshot(
                file
            );
        };


    // =====================================================
    // VALIDATE
    // =====================================================

    const validate =
        () => {

            const cleanTitle =
                title.trim();


            const cleanMessage =
                message.trim();


            if (
                cleanTitle.length <
                4
            ) {

                return (
                    "Sarlavha kamida 4 ta "
                    + "belgidan iborat bo‘lishi kerak."
                );

            }


            if (
                cleanTitle.length >
                150
            ) {

                return (
                    "Sarlavha 150 ta belgidan "
                    + "oshmasligi kerak."
                );

            }


            if (
                cleanMessage.length <
                10
            ) {

                return (
                    "Feedback matni kamida "
                    + "10 ta belgidan iborat bo‘lishi kerak."
                );

            }


            return null;
        };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit =
        async (
            event
        ) => {

            event.preventDefault();


            if (
                !feedback?.id
                ||
                isSubmitting
            ) {
                return;
            }


            const validationError =
                validate();


            if (
                validationError
            ) {

                setError(
                    validationError
                );


                toast.error(
                    validationError
                );


                return;
            }


            const toastId =
                toast.loading(
                    "Feedback yangilanmoqda..."
                );


            setIsSubmitting(
                true
            );

            setError("");


            try {

                const updatedFeedback =
                    await FeedbackService
                        .updateFeedback(
                            feedback.id,
                            {
                                feedbackType,

                                title:
                                    title.trim(),

                                message:
                                    message.trim(),

                                screenshot:
                                    newScreenshot,
                            }
                        );


                toast.success(
                    "Feedback muvaffaqiyatli yangilandi.",
                    {
                        id:
                            toastId,

                        duration:
                            3500,
                    }
                );


                setError("");

                setNewScreenshot(
                    null
                );


                onUpdated?.(
                    updatedFeedback
                );


                // handleClose() emas.
                // Chunki hozir isSubmitting=true.
                onClose?.();

            } catch (
                requestError
            ) {

                const errorMessage =
                    getErrorMessage(
                        requestError
                    );


                setError(
                    errorMessage
                );


                toast.error(
                    errorMessage,
                    {
                        id:
                            toastId,

                        duration:
                            5000,
                    }
                );

            } finally {

                setIsSubmitting(
                    false
                );

            }
        };


    // =====================================================
    // JSX
    // =====================================================

    return (
        <AnimatePresence>

            {isOpen && feedback && (

                <motion.div
                    initial={{
                        opacity:
                            0,
                    }}
                    animate={{
                        opacity:
                            1,
                    }}
                    exit={{
                        opacity:
                            0,
                    }}
                    className="
                        fixed
                        inset-0
                        z-[999]
                        flex
                        items-center
                        justify-center
                        bg-black/75
                        px-4
                        py-6
                        backdrop-blur-md
                    "
                    onMouseDown={
                        (
                            event
                        ) => {

                            if (
                                event.target ===
                                event.currentTarget
                            ) {

                                handleClose();

                            }
                        }
                    }
                >

                    <motion.div
                        initial={{
                            opacity:
                                0,

                            y:
                                20,

                            scale:
                                0.97,
                        }}
                        animate={{
                            opacity:
                                1,

                            y:
                                0,

                            scale:
                                1,
                        }}
                        exit={{
                            opacity:
                                0,

                            y:
                                12,

                            scale:
                                0.98,
                        }}
                        className="
                            max-h-[92vh]
                            w-full
                            max-w-2xl
                            overflow-y-auto
                            rounded-[28px]
                            border
                            border-white/[0.08]
                            bg-[#090b10]/95
                            shadow-2xl
                        "
                    >

                        {/* HEADER */}

                        <div
                            className="
                                sticky
                                top-0
                                z-20
                                flex
                                items-center
                                justify-between
                                border-b
                                border-white/[0.06]
                                bg-[#090b10]/90
                                px-6
                                py-5
                                backdrop-blur-xl
                            "
                        >

                            <div>

                                <h2
                                    className="
                                        text-lg
                                        font-black
                                        text-white
                                    "
                                >
                                    Feedbackni tahrirlash
                                </h2>


                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        text-gray-600
                                    "
                                >
                                    Faqat pending feedbackni
                                    tahrirlash mumkin.
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={
                                    handleClose
                                }
                                disabled={
                                    isSubmitting
                                }
                                className="
                                    grid
                                    h-10
                                    w-10
                                    place-items-center
                                    rounded-xl
                                    border
                                    border-white/[0.06]
                                    bg-white/[0.03]
                                    text-gray-500
                                    transition
                                    hover:bg-white/[0.07]
                                    hover:text-white
                                    disabled:opacity-40
                                "
                            >

                                <X
                                    size={18}
                                />

                            </button>

                        </div>


                        {/* FORM */}

                        <form
                            onSubmit={
                                handleSubmit
                            }
                            className="
                                space-y-6
                                p-6
                            "
                        >

                            {/* TYPE */}

                            <div>

                                <label
                                    className="
                                        mb-2
                                        block
                                        text-[10px]
                                        font-black
                                        uppercase
                                        tracking-[0.15em]
                                        text-gray-500
                                    "
                                >
                                    Feedback turi
                                </label>


                                <div
                                    className="
                                        grid
                                        grid-cols-2
                                        gap-2
                                    "
                                >

                                    {FEEDBACK_TYPES.map(
                                        ({
                                            value,
                                            label,
                                            Icon,
                                        }) => {

                                            const active =
                                                feedbackType ===
                                                value;


                                            return (
                                                <button
                                                    key={
                                                        value
                                                    }
                                                    type="button"
                                                    onClick={() =>
                                                        setFeedbackType(
                                                            value
                                                        )
                                                    }
                                                    className={`
                                                        flex
                                                        items-center
                                                        gap-2
                                                        rounded-xl
                                                        border
                                                        px-3
                                                        py-3
                                                        text-xs
                                                        font-bold
                                                        transition

                                                        ${
                                                            active
                                                                ? `
                                                                    border-indigo-400/30
                                                                    bg-indigo-500/[0.10]
                                                                    text-indigo-300
                                                                `
                                                                : `
                                                                    border-white/[0.06]
                                                                    bg-white/[0.02]
                                                                    text-gray-500
                                                                    hover:bg-white/[0.05]
                                                                `
                                                        }
                                                    `}
                                                >

                                                    <Icon
                                                        size={15}
                                                    />

                                                    {label}

                                                </button>
                                            );
                                        }
                                    )}

                                </div>

                            </div>


                            {/* TITLE */}

                            <div>

                                <div
                                    className="
                                        mb-2
                                        flex
                                        items-center
                                        justify-between
                                    "
                                >

                                    <label
                                        className="
                                            text-[10px]
                                            font-black
                                            uppercase
                                            tracking-[0.15em]
                                            text-gray-500
                                        "
                                    >
                                        Sarlavha
                                    </label>


                                    <span
                                        className="
                                            text-[10px]
                                            text-gray-700
                                        "
                                    >
                                        {
                                            title.length
                                        }
                                        /150
                                    </span>

                                </div>


                                <input
                                    type="text"
                                    value={
                                        title
                                    }
                                    maxLength={
                                        150
                                    }
                                    onChange={
                                        (
                                            event
                                        ) =>
                                            setTitle(
                                                event.target.value
                                            )
                                    }
                                    className="
                                        w-full
                                        rounded-2xl
                                        border
                                        border-white/[0.07]
                                        bg-white/[0.025]
                                        px-4
                                        py-3.5
                                        text-sm
                                        text-white
                                        outline-none
                                        transition
                                        focus:border-indigo-400/40
                                    "
                                />

                            </div>


                            {/* MESSAGE */}

                            <div>

                                <label
                                    className="
                                        mb-2
                                        block
                                        text-[10px]
                                        font-black
                                        uppercase
                                        tracking-[0.15em]
                                        text-gray-500
                                    "
                                >
                                    Feedback
                                </label>


                                <textarea
                                    value={
                                        message
                                    }
                                    onChange={
                                        (
                                            event
                                        ) =>
                                            setMessage(
                                                event.target.value
                                            )
                                    }
                                    rows={
                                        7
                                    }
                                    className="
                                        min-h-[160px]
                                        w-full
                                        resize-y
                                        rounded-2xl
                                        border
                                        border-white/[0.07]
                                        bg-white/[0.025]
                                        px-4
                                        py-3.5
                                        text-sm
                                        leading-6
                                        text-white
                                        outline-none
                                        transition
                                        focus:border-indigo-400/40
                                    "
                                />

                            </div>


                            {/* SCREENSHOT */}

                            <div>

                                <label
                                    className="
                                        mb-2
                                        block
                                        text-[10px]
                                        font-black
                                        uppercase
                                        tracking-[0.15em]
                                        text-gray-500
                                    "
                                >
                                    Skrinshot
                                </label>


                                {newScreenshot ? (

                                    <div
                                        className="
                                            overflow-hidden
                                            rounded-2xl
                                            border
                                            border-indigo-400/15
                                        "
                                    >

                                        <img
                                            src={
                                                newPreviewUrl
                                            }
                                            alt="New screenshot"
                                            className="
                                                max-h-[300px]
                                                w-full
                                                bg-black/30
                                                object-contain
                                            "
                                        />


                                        <div
                                            className="
                                                flex
                                                items-center
                                                justify-between
                                                gap-3
                                                px-4
                                                py-3
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    min-w-0
                                                    items-center
                                                    gap-2
                                                "
                                            >

                                                <FileImage
                                                    size={16}
                                                    className="
                                                        flex-shrink-0
                                                        text-indigo-300
                                                    "
                                                />


                                                <span
                                                    className="
                                                        truncate
                                                        text-xs
                                                        text-gray-400
                                                    "
                                                >
                                                    {
                                                        newScreenshot.name
                                                    }
                                                </span>

                                            </div>


                                            <button
                                                type="button"
                                                onClick={
                                                    () => {

                                                        setNewScreenshot(
                                                            null
                                                        );


                                                        if (
                                                            fileInputRef.current
                                                        ) {

                                                            fileInputRef.current.value =
                                                                "";

                                                        }
                                                    }
                                                }
                                                className="
                                                    text-xs
                                                    font-bold
                                                    text-red-400
                                                "
                                            >
                                                Bekor qilish
                                            </button>

                                        </div>

                                    </div>

                                ) : currentScreenshot ? (

                                    <div
                                        className="
                                            overflow-hidden
                                            rounded-2xl
                                            border
                                            border-white/[0.06]
                                        "
                                    >

                                        <img
                                            src={
                                                currentScreenshot
                                            }
                                            alt="Current screenshot"
                                            className="
                                                max-h-[300px]
                                                w-full
                                                bg-black/30
                                                object-contain
                                            "
                                        />


                                        <button
                                            type="button"
                                            onClick={() =>
                                                fileInputRef
                                                    .current
                                                    ?.click()
                                            }
                                            className="
                                                flex
                                                w-full
                                                items-center
                                                justify-center
                                                gap-2
                                                border-t
                                                border-white/[0.05]
                                                px-4
                                                py-3
                                                text-xs
                                                font-bold
                                                text-indigo-300
                                                transition
                                                hover:bg-indigo-500/[0.05]
                                            "
                                        >

                                            <UploadCloud
                                                size={15}
                                            />

                                            Skrinshotni almashtirish

                                        </button>

                                    </div>

                                ) : (

                                    <button
                                        type="button"
                                        onClick={() =>
                                            fileInputRef
                                                .current
                                                ?.click()
                                        }
                                        className="
                                            flex
                                            w-full
                                            flex-col
                                            items-center
                                            rounded-2xl
                                            border
                                            border-dashed
                                            border-white/[0.10]
                                            bg-white/[0.02]
                                            px-5
                                            py-7
                                            text-gray-600
                                            transition
                                            hover:border-indigo-400/30
                                            hover:text-indigo-300
                                        "
                                    >

                                        <UploadCloud
                                            size={23}
                                        />


                                        <span
                                            className="
                                                mt-2
                                                text-xs
                                                font-bold
                                            "
                                        >
                                            Skrinshot tanlash
                                        </span>

                                    </button>

                                )}


                                <input
                                    ref={
                                        fileInputRef
                                    }
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={
                                        handleFileChange
                                    }
                                    className="
                                        hidden
                                    "
                                />

                            </div>


                            {/* ERROR */}

                            {error && (

                                <div
                                    className="
                                        flex
                                        items-start
                                        gap-2
                                        rounded-xl
                                        border
                                        border-red-400/15
                                        bg-red-500/[0.06]
                                        px-4
                                        py-3
                                        text-xs
                                        text-red-300
                                    "
                                >

                                    <AlertCircle
                                        size={16}
                                        className="
                                            flex-shrink-0
                                        "
                                    />

                                    {error}

                                </div>

                            )}


                            {/* BUTTONS */}

                            <div
                                className="
                                    flex
                                    flex-col-reverse
                                    gap-3
                                    border-t
                                    border-white/[0.05]
                                    pt-5
                                    sm:flex-row
                                    sm:justify-end
                                "
                            >

                                <button
                                    type="button"
                                    onClick={
                                        handleClose
                                    }
                                    disabled={
                                        isSubmitting
                                    }
                                    className="
                                        rounded-xl
                                        border
                                        border-white/[0.07]
                                        px-5
                                        py-3
                                        text-xs
                                        font-bold
                                        text-gray-500
                                        transition
                                        hover:bg-white/[0.05]
                                        hover:text-white
                                        disabled:opacity-40
                                    "
                                >
                                    Bekor qilish
                                </button>


                                <button
                                    type="submit"
                                    disabled={
                                        isSubmitting
                                    }
                                    className="
                                        inline-flex
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        bg-indigo-600
                                        px-5
                                        py-3
                                        text-xs
                                        font-black
                                        text-white
                                        transition
                                        hover:bg-indigo-500
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >

                                    {isSubmitting ? (
                                        <>
                                            <Loader2
                                                size={15}
                                                className="
                                                    animate-spin
                                                "
                                            />

                                            Saqlanmoqda...
                                        </>
                                    ) : (
                                        <>
                                            <Save
                                                size={15}
                                            />

                                            O‘zgarishlarni saqlash
                                        </>
                                    )}

                                </button>

                            </div>

                        </form>

                    </motion.div>

                </motion.div>

            )}

        </AnimatePresence>
    );
};


export default FeedbackEditModal;