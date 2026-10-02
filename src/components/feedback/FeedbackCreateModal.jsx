// src/components/feedback/FeedbackCreateModal.jsx

import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    AnimatePresence,
    motion,
} from "framer-motion";

import {
    FileImage,
    Gift,
    ImagePlus,
    Loader2,
    MessageSquareText,
    ShieldCheck,
    Sparkles,
    Trash2,
    UploadCloud,
    X,
} from "lucide-react";

import FeedbackService from "../../services/feedback";

import {
    siteToast,
} from "../ui/AuthToast";

import {
    FEEDBACK_ACCEPT,
    FEEDBACK_ALLOWED_FILE_TYPES,
    FEEDBACK_DEFAULT_TYPE,
    FEEDBACK_MAX_FILE_SIZE,
    FEEDBACK_MESSAGE_MIN_LENGTH,
    FEEDBACK_TITLE_MAX_LENGTH,
    FEEDBACK_TITLE_MIN_LENGTH,
    FEEDBACK_TYPES,
    formatFeedbackFileSize,
    getFeedbackTypeConfig,
} from "./feedbackConfig";


// =========================================================
// ERROR MESSAGE
// =========================================================

const getErrorMessage = (
    error,
    fallback = "Feedback yuborishda xatolik yuz berdi."
) => {
    const data =
        error?.serverData
        ||
        error?.response?.data;


    if (
        typeof data === "string"
        &&
        data.trim()
    ) {
        return data.trim();
    }


    if (
        data?.detail
    ) {
        return String(
            data.detail
        );
    }


    if (
        data?.message
    ) {
        return String(
            data.message
        );
    }


    if (
        data?.error
    ) {
        return String(
            data.error
        );
    }


    if (
        data
        &&
        typeof data === "object"
    ) {
        const firstValue =
            Object.values(
                data
            )[0];


        if (
            Array.isArray(
                firstValue
            )
            &&
            firstValue.length > 0
        ) {
            return String(
                firstValue[0]
            );
        }


        if (
            typeof firstValue ===
            "string"
        ) {
            return firstValue;
        }
    }


    if (
        error?.message
    ) {
        return String(
            error.message
        );
    }


    return fallback;
};


// =========================================================
// TYPE CARD
// =========================================================

const FeedbackTypeCard = ({
    config,
    active,
    disabled,
    onSelect,
}) => {
    const {
        value,
        label,
        description,
        reward,
        Icon,
        activeClass,
        inactiveHoverClass,
        iconClass,
        rewardClass,
    } = config;


    const handleClick = () => {
        if (
            disabled
            ||
            typeof onSelect !==
                "function"
        ) {
            return;
        }


        onSelect(
            value
        );
    };


    return (
        <motion.button
            type="button"

            whileHover={
                disabled
                    ? undefined
                    : {
                        y:
                            -2,
                    }
            }

            whileTap={
                disabled
                    ? undefined
                    : {
                        scale:
                            0.985,
                    }
            }

            onClick={
                handleClick
            }

            disabled={
                disabled
            }

            aria-pressed={
                active
            }

            className={`
                group

                relative
                overflow-hidden

                rounded-2xl

                border

                p-4

                text-left

                transition-all
                duration-200

                ${
                    active
                        ? activeClass
                        : (
                            "border-white/[0.06] "
                            +
                            "bg-white/[0.025] "
                            +
                            "text-gray-300 "
                            +
                            inactiveHoverClass
                        )
                }

                disabled:cursor-not-allowed
                disabled:opacity-50
            `}
        >
            <div
                className="
                    flex
                    items-start

                    gap-3
                "
            >
                {/* =========================================
                    ICON
                ========================================== */}

                <div
                    className={`
                        flex
                        h-10
                        w-10

                        shrink-0

                        items-center
                        justify-center

                        rounded-xl

                        border

                        ${iconClass}
                    `}
                >
                    <Icon
                        size={18}
                    />
                </div>


                {/* =========================================
                    CONTENT
                ========================================== */}

                <div
                    className="
                        min-w-0
                        flex-1
                    "
                >
                    <div
                        className="
                            flex
                            items-center
                            justify-between

                            gap-2
                        "
                    >
                        <p
                            className="
                                font-display

                                text-sm
                                font-semibold
                            "
                        >
                            {label}
                        </p>


                        <span
                            className={`
                                inline-flex
                                shrink-0

                                items-center

                                gap-1

                                rounded-full

                                border

                                px-2
                                py-1

                                font-display

                                text-[9px]
                                font-semibold

                                ${rewardClass}
                            `}
                        >
                            <Gift
                                size={11}
                            />

                            +{reward}
                        </span>
                    </div>


                    <p
                        className="
                            mt-1

                            font-sans

                            text-[11px]
                            font-medium

                            leading-5

                            text-gray-500
                        "
                    >
                        {description}
                    </p>
                </div>
            </div>
        </motion.button>
    );
};


// =========================================================
// FORM LABEL
// =========================================================

const FormLabel = ({
    children,
    optional = false,
}) => {
    return (
        <div
            className="
                mb-2

                flex
                items-center

                gap-2
            "
        >
            <span
                className="
                    font-display

                    text-[10px]
                    font-semibold

                    uppercase

                    tracking-[0.14em]

                    text-gray-400
                "
            >
                {children}
            </span>


            {
                optional
                &&
                (
                    <span
                        className="
                            text-[10px]
                            font-medium

                            text-gray-600
                        "
                    >
                        ixtiyoriy
                    </span>
                )
            }
        </div>
    );
};


// =========================================================
// CREATE MODAL
// =========================================================

const FeedbackCreateModal = ({
    isOpen,
    onClose,
    onCreated,
}) => {
    // =====================================================
    // FORM
    // =====================================================

    const [
        feedbackType,
        setFeedbackType,
    ] = useState(
        FEEDBACK_DEFAULT_TYPE
    );


    const [
        title,
        setTitle,
    ] = useState(
        ""
    );


    const [
        message,
        setMessage,
    ] = useState(
        ""
    );


    const [
        screenshot,
        setScreenshot,
    ] = useState(
        null
    );


    // =====================================================
    // REQUEST
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
    ] = useState(
        ""
    );


    // =====================================================
    // REF
    // =====================================================

    const fileInputRef =
        useRef(
            null
        );


    // =====================================================
    // SELECTED TYPE
    // =====================================================

    const selectedType =
        useMemo(
            () => {
                return (
                    getFeedbackTypeConfig(
                        feedbackType
                    )
                );
            },
            [
                feedbackType,
            ]
        );


    // =====================================================
    // PREVIEW URL
    // =====================================================

    const previewUrl =
        useMemo(
            () => {
                if (
                    !screenshot
                ) {
                    return null;
                }


                return URL.createObjectURL(
                    screenshot
                );
            },
            [
                screenshot,
            ]
        );


    useEffect(
        () => {
            return () => {
                if (
                    previewUrl
                ) {
                    URL.revokeObjectURL(
                        previewUrl
                    );
                }
            };
        },
        [
            previewUrl,
        ]
    );


    // =====================================================
    // RESET FORM
    // =====================================================

    const resetForm =
        useCallback(
            () => {
                setFeedbackType(
                    FEEDBACK_DEFAULT_TYPE
                );


                setTitle(
                    ""
                );


                setMessage(
                    ""
                );


                setScreenshot(
                    null
                );


                setError(
                    ""
                );


                if (
                    fileInputRef.current
                ) {
                    fileInputRef.current.value =
                        "";
                }
            },
            []
        );


    // =====================================================
    // CLOSE
    // =====================================================

    const handleClose =
        useCallback(
            () => {
                if (
                    isSubmitting
                ) {
                    return;
                }


                resetForm();


                onClose?.();
            },
            [
                isSubmitting,
                onClose,
                resetForm,
            ]
        );


    // =====================================================
    // BODY LOCK + ESCAPE
    // =====================================================

    useEffect(
        () => {
            if (
                !isOpen
            ) {
                return undefined;
            }


            const previousOverflow =
                document.body.style.overflow;


            document.body.style.overflow =
                "hidden";


            const handleKeyDown = (
                event
            ) => {
                if (
                    event.key ===
                    "Escape"
                ) {
                    handleClose();
                }
            };


            window.addEventListener(
                "keydown",
                handleKeyDown
            );


            return () => {
                document.body.style.overflow =
                    previousOverflow;


                window.removeEventListener(
                    "keydown",
                    handleKeyDown
                );
            };
        },
        [
            handleClose,
            isOpen,
        ]
    );


    // =====================================================
    // FILE CHANGE
    // =====================================================

    const handleFileChange = (
        event
    ) => {
        setError(
            ""
        );


        const file =
            event
                .target
                .files?.[0];


        if (
            !file
        ) {
            return;
        }


        // =================================================
        // FILE TYPE
        // =================================================

        if (
            !FEEDBACK_ALLOWED_FILE_TYPES.includes(
                file.type
            )
        ) {
            const validationMessage =
                "Faqat JPG, PNG yoki WEBP rasm yuklash mumkin.";


            setError(
                validationMessage
            );


            siteToast.warning(
                validationMessage
            );


            event.target.value =
                "";


            return;
        }


        // =================================================
        // FILE SIZE
        // =================================================

        if (
            file.size >
            FEEDBACK_MAX_FILE_SIZE
        ) {
            const validationMessage =
                "Skrinshot hajmi 5 MB dan oshmasligi kerak.";


            setError(
                validationMessage
            );


            siteToast.warning(
                validationMessage
            );


            event.target.value =
                "";


            return;
        }


        setScreenshot(
            file
        );
    };


    // =====================================================
    // REMOVE SCREENSHOT
    // =====================================================

    const removeScreenshot = () => {
        setScreenshot(
            null
        );


        if (
            fileInputRef.current
        ) {
            fileInputRef.current.value =
                "";
        }
    };


    // =====================================================
    // VALIDATE
    // =====================================================

    const validateForm = () => {
        const cleanTitle =
            title.trim();


        const cleanMessage =
            message.trim();


        if (
            cleanTitle.length <
            FEEDBACK_TITLE_MIN_LENGTH
        ) {
            return (
                `Sarlavha kamida ${FEEDBACK_TITLE_MIN_LENGTH} ta `
                +
                "belgidan iborat bo‘lishi kerak."
            );
        }


        if (
            cleanTitle.length >
            FEEDBACK_TITLE_MAX_LENGTH
        ) {
            return (
                `Sarlavha ${FEEDBACK_TITLE_MAX_LENGTH} ta belgidan `
                +
                "oshmasligi kerak."
            );
        }


        if (
            cleanMessage.length <
            FEEDBACK_MESSAGE_MIN_LENGTH
        ) {
            return (
                `Feedback matni kamida ${FEEDBACK_MESSAGE_MIN_LENGTH} ta `
                +
                "belgidan iborat bo‘lishi kerak."
            );
        }


        const feedbackTypeExists =
            FEEDBACK_TYPES.some(
                (
                    item
                ) => (
                    item.value ===
                    feedbackType
                )
            );


        if (
            !feedbackTypeExists
        ) {
            return (
                "Feedback turi noto‘g‘ri."
            );
        }


        return null;
    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (
        event
    ) => {
        event.preventDefault();


        if (
            isSubmitting
        ) {
            return;
        }


        setError(
            ""
        );


        const validationError =
            validateForm();


        if (
            validationError
        ) {
            setError(
                validationError
            );


            siteToast.warning(
                validationError
            );


            return;
        }


        // =================================================
        // GLOBAL LOADING TOAST
        // =================================================

        const toastId =
            siteToast.loading(
                "Feedback yuborilmoqda..."
            );


        setIsSubmitting(
            true
        );


        try {
            // =============================================
            // REQUEST
            // =============================================

            const response =
                await FeedbackService
                    .createFeedback({
                        feedbackType,

                        title:
                            title.trim(),

                        message:
                            message.trim(),

                        screenshot,
                    });


            // =============================================
            // RESPONSE
            // =============================================

            const createdFeedback =
                response?.feedback
                ||
                response;


            // =============================================
            // LOADING -> SUCCESS
            // =============================================

            siteToast.update(
                toastId,
                "success",
                (
                    "Feedback yuborildi. "
                    +
                    "Admin tasdiqlasa "
                    +
                    `${selectedType.reward} FCoin beriladi.`
                )
            );


            // =============================================
            // RESET
            // =============================================

            resetForm();


            // =============================================
            // PARENT CALLBACK
            // =============================================

            onCreated?.(
                createdFeedback
            );


            onClose?.();

        } catch (
            requestError
        ) {
            // =============================================
            // ERROR MESSAGE
            // =============================================

            const errorMessage =
                getErrorMessage(
                    requestError
                );


            setError(
                errorMessage
            );


            // =============================================
            // LOADING -> ERROR
            // =============================================

            siteToast.update(
                toastId,
                "error",
                errorMessage
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
            {
                isOpen
                &&
                (
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

                            font-sans

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
                                    24,

                                scale:
                                    0.96,
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
                                    16,

                                scale:
                                    0.97,
                            }}

                            transition={{
                                duration:
                                    0.2,
                            }}

                            role="dialog"

                            aria-modal="true"

                            aria-labelledby="feedback-create-title"

                            className="
                                relative

                                max-h-[92vh]
                                w-full
                                max-w-3xl

                                overflow-y-auto

                                rounded-[28px]

                                border
                                border-white/[0.08]

                                bg-[#090b10]/95

                                shadow-2xl
                                shadow-indigo-950/30
                            "
                        >
                            {/* =================================
                                BACKGROUND
                            ================================== */}

                            <div
                                aria-hidden="true"

                                className="
                                    pointer-events-none

                                    absolute
                                    -right-28
                                    -top-28

                                    h-72
                                    w-72

                                    rounded-full

                                    bg-indigo-500/[0.07]

                                    blur-[100px]
                                "
                            />


                            {/* =================================
                                HEADER
                            ================================== */}

                            <div
                                className="
                                    sticky
                                    top-0
                                    z-20

                                    flex
                                    items-center
                                    justify-between

                                    gap-4

                                    border-b
                                    border-white/[0.06]

                                    bg-[#090b10]/90

                                    px-5
                                    py-4

                                    backdrop-blur-xl

                                    sm:px-6
                                    sm:py-5
                                "
                            >
                                <div
                                    className="
                                        flex
                                        min-w-0

                                        items-center

                                        gap-3

                                        sm:gap-4
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            h-11
                                            w-11

                                            shrink-0

                                            items-center
                                            justify-center

                                            rounded-2xl

                                            border
                                            border-indigo-400/20

                                            bg-indigo-500/10

                                            text-indigo-300

                                            sm:h-12
                                            sm:w-12
                                        "
                                    >
                                        <MessageSquareText
                                            size={22}
                                        />
                                    </div>


                                    <div
                                        className="
                                            min-w-0
                                        "
                                    >
                                        <h2
                                            id="feedback-create-title"

                                            className="
                                                font-display

                                                text-lg
                                                font-semibold

                                                tracking-tight

                                                text-white
                                            "
                                        >
                                            Feedback yuborish
                                        </h2>


                                        <p
                                            className="
                                                mt-1

                                                text-xs
                                                font-medium

                                                text-gray-500
                                            "
                                        >
                                            F.Society’ni yaxshilashga yordam bering.
                                        </p>
                                    </div>
                                </div>


                                <button
                                    type="button"

                                    onClick={
                                        handleClose
                                    }

                                    disabled={
                                        isSubmitting
                                    }

                                    aria-label="Modalni yopish"

                                    className="
                                        flex
                                        h-10
                                        w-10

                                        shrink-0

                                        items-center
                                        justify-center

                                        rounded-xl

                                        border
                                        border-white/[0.06]

                                        bg-white/[0.03]

                                        text-gray-500

                                        transition

                                        hover:border-white/[0.10]
                                        hover:bg-white/[0.07]
                                        hover:text-white

                                        disabled:cursor-not-allowed
                                        disabled:opacity-40
                                    "
                                >
                                    <X
                                        size={18}
                                    />
                                </button>
                            </div>


                            {/* =================================
                                FORM
                            ================================== */}

                            <form
                                onSubmit={
                                    handleSubmit
                                }

                                className="
                                    relative
                                    z-10

                                    space-y-7

                                    p-5

                                    sm:p-6
                                "
                            >
                                {/* =============================
                                    TYPE
                                ============================== */}

                                <div>
                                    <div
                                        className="
                                            mb-3

                                            flex
                                            flex-col

                                            gap-3

                                            sm:flex-row
                                            sm:items-center
                                            sm:justify-between
                                        "
                                    >
                                        <FormLabel>
                                            Feedback turi
                                        </FormLabel>


                                        <span
                                            className={`
                                                inline-flex
                                                w-fit

                                                items-center

                                                gap-1.5

                                                rounded-full

                                                border

                                                px-3
                                                py-1.5

                                                font-display

                                                text-[10px]
                                                font-semibold

                                                ${selectedType.rewardClass}
                                            `}
                                        >
                                            <Gift
                                                size={12}
                                            />

                                            Tasdiqlansa
                                            {" "}

                                            +{selectedType.reward}

                                            {" "}

                                            FCoin
                                        </span>
                                    </div>


                                    <div
                                        className="
                                            grid
                                            grid-cols-1

                                            gap-3

                                            sm:grid-cols-2
                                        "
                                    >
                                        {
                                            FEEDBACK_TYPES.map(
                                                (
                                                    type
                                                ) => (
                                                    <FeedbackTypeCard
                                                        key={
                                                            type.value
                                                        }

                                                        config={
                                                            type
                                                        }

                                                        active={
                                                            feedbackType ===
                                                            type.value
                                                        }

                                                        disabled={
                                                            isSubmitting
                                                        }

                                                        onSelect={
                                                            setFeedbackType
                                                        }
                                                    />
                                                )
                                            )
                                        }
                                    </div>
                                </div>


                                {/* =============================
                                    TITLE
                                ============================== */}

                                <div>
                                    <div
                                        className="
                                            flex
                                            items-center
                                            justify-between

                                            gap-3
                                        "
                                    >
                                        <FormLabel>
                                            Sarlavha
                                        </FormLabel>


                                        <span
                                            className={`
                                                mb-2

                                                font-display

                                                text-[9px]
                                                font-medium

                                                ${
                                                    title.length >
                                                    140
                                                        ? "text-red-400"
                                                        : "text-gray-600"
                                                }
                                            `}
                                        >
                                            {
                                                title.length
                                            }

                                            /

                                            {
                                                FEEDBACK_TITLE_MAX_LENGTH
                                            }
                                        </span>
                                    </div>


                                    <input
                                        type="text"

                                        value={
                                            title
                                        }

                                        onChange={
                                            (
                                                event
                                            ) => {
                                                setTitle(
                                                    event.target.value
                                                );


                                                if (
                                                    error
                                                ) {
                                                    setError(
                                                        ""
                                                    );
                                                }
                                            }
                                        }

                                        disabled={
                                            isSubmitting
                                        }

                                        maxLength={
                                            FEEDBACK_TITLE_MAX_LENGTH
                                        }

                                        autoComplete="off"

                                        placeholder="Masalan: Login sahifasida Google tugmasi ishlamayapti"

                                        className="
                                            w-full

                                            rounded-2xl

                                            border
                                            border-white/[0.07]

                                            bg-white/[0.025]

                                            px-4
                                            py-3.5

                                            text-sm
                                            font-medium

                                            text-white

                                            outline-none

                                            transition

                                            placeholder:text-gray-700

                                            focus:border-indigo-400/40
                                            focus:bg-indigo-500/[0.035]
                                            focus:ring-2
                                            focus:ring-indigo-500/[0.06]

                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        "
                                    />
                                </div>


                                {/* =============================
                                    MESSAGE
                                ============================== */}

                                <div>
                                    <FormLabel>
                                        Batafsil ma’lumot
                                    </FormLabel>


                                    <textarea
                                        value={
                                            message
                                        }

                                        onChange={
                                            (
                                                event
                                            ) => {
                                                setMessage(
                                                    event.target.value
                                                );


                                                if (
                                                    error
                                                ) {
                                                    setError(
                                                        ""
                                                    );
                                                }
                                            }
                                        }

                                        disabled={
                                            isSubmitting
                                        }

                                        rows={6}

                                        placeholder={
                                            feedbackType ===
                                            "bug"
                                                ? (
                                                    "Xatoni qanday takrorlash mumkinligini yozing..."
                                                )
                                                : (
                                                    "Fikringizni batafsil yozing..."
                                                )
                                        }

                                        className="
                                            min-h-[150px]
                                            w-full

                                            resize-y

                                            rounded-2xl

                                            border
                                            border-white/[0.07]

                                            bg-white/[0.025]

                                            px-4
                                            py-3.5

                                            text-sm
                                            font-medium

                                            leading-6

                                            text-white

                                            outline-none

                                            transition

                                            placeholder:text-gray-700

                                            focus:border-indigo-400/40
                                            focus:bg-indigo-500/[0.035]
                                            focus:ring-2
                                            focus:ring-indigo-500/[0.06]

                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        "
                                    />
                                </div>


                                {/* =============================
                                    SCREENSHOT
                                ============================== */}

                                <div>
                                    <FormLabel
                                        optional
                                    >
                                        Skrinshot
                                    </FormLabel>


                                    {
                                        !screenshot
                                            ? (
                                                <button
                                                    type="button"

                                                    onClick={
                                                        () => {
                                                            fileInputRef
                                                                .current
                                                                ?.click();
                                                        }
                                                    }

                                                    disabled={
                                                        isSubmitting
                                                    }

                                                    className="
                                                        group

                                                        flex
                                                        w-full
                                                        flex-col

                                                        items-center
                                                        justify-center

                                                        rounded-2xl

                                                        border
                                                        border-dashed
                                                        border-white/[0.10]

                                                        bg-white/[0.02]

                                                        px-6
                                                        py-8

                                                        text-center

                                                        transition

                                                        hover:border-indigo-400/30
                                                        hover:bg-indigo-500/[0.035]

                                                        disabled:cursor-not-allowed
                                                        disabled:opacity-50
                                                    "
                                                >
                                                    <div
                                                        className="
                                                            mb-3

                                                            flex
                                                            h-12
                                                            w-12

                                                            items-center
                                                            justify-center

                                                            rounded-2xl

                                                            border
                                                            border-indigo-400/10

                                                            bg-indigo-500/10

                                                            text-indigo-300

                                                            transition-transform

                                                            group-hover:scale-105
                                                        "
                                                    >
                                                        <UploadCloud
                                                            size={22}
                                                        />
                                                    </div>


                                                    <p
                                                        className="
                                                            font-display

                                                            text-sm
                                                            font-semibold

                                                            text-gray-300
                                                        "
                                                    >
                                                        Skrinshot tanlang
                                                    </p>


                                                    <p
                                                        className="
                                                            mt-1

                                                            text-[11px]
                                                            font-medium

                                                            text-gray-600
                                                        "
                                                    >
                                                        JPG, PNG yoki WEBP
                                                        {" · "}
                                                        maksimal 5 MB
                                                    </p>
                                                </button>
                                            )
                                            : (
                                                <div
                                                    className="
                                                        overflow-hidden

                                                        rounded-2xl

                                                        border
                                                        border-white/[0.08]

                                                        bg-white/[0.025]
                                                    "
                                                >
                                                    <div
                                                        className="
                                                            relative

                                                            bg-black/30
                                                        "
                                                    >
                                                        <img
                                                            src={
                                                                previewUrl
                                                            }

                                                            alt="Feedback screenshot preview"

                                                            className="
                                                                max-h-[320px]
                                                                w-full

                                                                object-contain
                                                            "
                                                        />


                                                        <button
                                                            type="button"

                                                            onClick={
                                                                removeScreenshot
                                                            }

                                                            disabled={
                                                                isSubmitting
                                                            }

                                                            aria-label="Skrinshotni olib tashlash"

                                                            className="
                                                                absolute
                                                                right-3
                                                                top-3

                                                                flex
                                                                h-9
                                                                w-9

                                                                items-center
                                                                justify-center

                                                                rounded-xl

                                                                border
                                                                border-red-400/20

                                                                bg-black/70

                                                                text-red-300

                                                                transition

                                                                hover:bg-red-500/20

                                                                disabled:cursor-not-allowed
                                                                disabled:opacity-50
                                                            "
                                                        >
                                                            <Trash2
                                                                size={16}
                                                            />
                                                        </button>
                                                    </div>


                                                    <div
                                                        className="
                                                            flex
                                                            items-center

                                                            gap-3

                                                            px-4
                                                            py-3
                                                        "
                                                    >
                                                        <FileImage
                                                            size={17}

                                                            className="
                                                                shrink-0

                                                                text-indigo-300
                                                            "
                                                        />


                                                        <div
                                                            className="
                                                                min-w-0
                                                                flex-1
                                                            "
                                                        >
                                                            <p
                                                                className="
                                                                    truncate

                                                                    text-xs
                                                                    font-semibold

                                                                    text-gray-300
                                                                "
                                                            >
                                                                {
                                                                    screenshot.name
                                                                }
                                                            </p>


                                                            <p
                                                                className="
                                                                    mt-0.5

                                                                    text-[10px]

                                                                    text-gray-600
                                                                "
                                                            >
                                                                {
                                                                    formatFeedbackFileSize(
                                                                        screenshot.size
                                                                    )
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                    }


                                    <input
                                        ref={
                                            fileInputRef
                                        }

                                        type="file"

                                        accept={
                                            FEEDBACK_ACCEPT
                                        }

                                        onChange={
                                            handleFileChange
                                        }

                                        disabled={
                                            isSubmitting
                                        }

                                        className="
                                            hidden
                                        "
                                    />
                                </div>


                                {/* =============================
                                    ERROR
                                ============================== */}

                                {
                                    error
                                    &&
                                    (
                                        <motion.div
                                            initial={{
                                                opacity:
                                                    0,

                                                y:
                                                    -4,
                                            }}

                                            animate={{
                                                opacity:
                                                    1,

                                                y:
                                                    0,
                                            }}

                                            className="
                                                rounded-2xl

                                                border
                                                border-red-400/15

                                                bg-red-500/[0.06]

                                                px-4
                                                py-3

                                                text-xs
                                                font-medium

                                                leading-5

                                                text-red-300
                                            "
                                        >
                                            {error}
                                        </motion.div>
                                    )
                                }


                                {/* =============================
                                    REWARD INFO
                                ============================== */}

                                <div
                                    className="
                                        relative
                                        overflow-hidden

                                        rounded-2xl

                                        border
                                        border-indigo-400/10

                                        bg-indigo-500/[0.035]

                                        px-4
                                        py-4
                                    "
                                >
                                    <div
                                        aria-hidden="true"

                                        className={`
                                            pointer-events-none

                                            absolute
                                            -right-10
                                            -top-10

                                            h-28
                                            w-28

                                            rounded-full

                                            blur-3xl

                                            ${selectedType.glowClass}
                                        `}
                                    />


                                    <div
                                        className="
                                            relative
                                            z-10

                                            flex
                                            items-start

                                            gap-3
                                        "
                                    >
                                        <ShieldCheck
                                            size={18}

                                            className="
                                                mt-0.5
                                                shrink-0

                                                text-indigo-300
                                            "
                                        />


                                        <div
                                            className="
                                                min-w-0
                                            "
                                        >
                                            <p
                                                className="
                                                    font-display

                                                    text-xs
                                                    font-semibold

                                                    text-gray-300
                                                "
                                            >
                                                Admin tasdig‘idan keyin reward
                                            </p>


                                            <p
                                                className="
                                                    mt-1

                                                    text-[11px]
                                                    font-medium

                                                    leading-5

                                                    text-gray-500
                                                "
                                            >
                                                Feedback yuborilgan zahoti FCoin
                                                berilmaydi. Admin tasdiqlasa
                                                {" "}

                                                <strong
                                                    className="
                                                        font-semibold

                                                        text-indigo-300
                                                    "
                                                >
                                                    +{selectedType.reward} FCoin
                                                </strong>

                                                {" "}

                                                balansingizga qo‘shiladi.
                                            </p>
                                        </div>
                                    </div>
                                </div>


                                {/* =============================
                                    FOOTER
                                ============================== */}

                                <div
                                    className="
                                        flex
                                        flex-col-reverse

                                        gap-3

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
                                            hidden

                                            items-center

                                            gap-2

                                            text-[10px]
                                            font-medium

                                            text-gray-600

                                            sm:flex
                                        "
                                    >
                                        <Sparkles
                                            size={13}
                                        />

                                        Sifatli feedback communityga yordam beradi
                                    </div>


                                    <div
                                        className="
                                            flex
                                            flex-col-reverse

                                            gap-3

                                            sm:flex-row
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

                                                bg-white/[0.025]

                                                px-5
                                                py-3

                                                font-display

                                                text-xs
                                                font-semibold

                                                text-gray-400

                                                transition

                                                hover:bg-white/[0.06]
                                                hover:text-white

                                                disabled:cursor-not-allowed
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

                                                border
                                                border-indigo-400/20

                                                bg-indigo-600

                                                px-6
                                                py-3

                                                font-display

                                                text-xs
                                                font-semibold

                                                text-white

                                                shadow-lg
                                                shadow-indigo-950/30

                                                transition-all

                                                hover:-translate-y-0.5
                                                hover:bg-indigo-500

                                                active:translate-y-0
                                                active:scale-[0.98]

                                                disabled:cursor-not-allowed
                                                disabled:opacity-50
                                                disabled:hover:translate-y-0
                                            "
                                        >
                                            {
                                                isSubmitting
                                                    ? (
                                                        <>
                                                            <Loader2
                                                                size={16}

                                                                className="
                                                                    animate-spin
                                                                "
                                                            />

                                                            Yuborilmoqda...
                                                        </>
                                                    )
                                                    : (
                                                        <>
                                                            <ImagePlus
                                                                size={16}
                                                            />

                                                            Feedback yuborish
                                                        </>
                                                    )
                                            }
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )
            }
        </AnimatePresence>
    );
};


// =========================================================
// EXPORT
// =========================================================

export default FeedbackCreateModal;