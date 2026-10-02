// src/components/feedback/FeedbackEditModal.jsx

import {
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
    ImagePlus,
    Loader2,
    Pencil,
    Save,
    ShieldAlert,
    Trash2,
    UploadCloud,
    X,
} from "lucide-react";

import {
    siteToast,
} from "../ui/AuthToast";

import {
    FEEDBACK_ACCEPT,
    FEEDBACK_ALLOWED_FILE_TYPES,
    FEEDBACK_MAX_FILE_SIZE,
    FEEDBACK_MESSAGE_MIN_LENGTH,
    FEEDBACK_TITLE_MAX_LENGTH,
    FEEDBACK_TITLE_MIN_LENGTH,
    FEEDBACK_TYPES,
    formatFeedbackFileSize,
    getFeedbackTypeConfig,
} from "./feedbackConfig";

import {
    canModifyFeedback,
    getFeedbackScreenshot,
} from "./feedbackHelpers";

// =========================================================
// HELPERS
// =========================================================

const DEFAULT_FEEDBACK_TYPE =
    "suggestion";

const isValidFeedbackType = (
    value
) => {
    return FEEDBACK_TYPES.some(
        (
            item
        ) => (
            item.value ===
            value
        )
    );
};

const getInitialFeedbackType = (
    feedback
) => {
    const value =
        feedback?.feedback_type
        ??
        feedback?.feedbackType;

    return isValidFeedbackType(
        value
    )
        ? value
        : DEFAULT_FEEDBACK_TYPE;
};

// =========================================================
// TYPE BUTTON
// =========================================================

const FeedbackTypeButton = ({
    config,
    active,
    disabled,
    onSelect,
}) => {
    const {
        value,
        label,
        reward,
        Icon,
        activeClass,
        inactiveHoverClass,
        iconClass,
    } = config;

    return (
        <button
            type="button"
            onClick={() => {
                onSelect?.(
                    value
                );
            }}
            disabled={
                disabled
            }
            aria-pressed={
                active
            }
            className={`
                flex
                items-center
                gap-3
                rounded-2xl
                border
                p-3
                text-left
                transition-all

                ${
                    active
                        ? activeClass
                        : `
                            border-white/[0.06]
                            bg-white/[0.025]
                            text-gray-400
                            ${inactiveHoverClass}
                        `
                }

                disabled:cursor-not-allowed
                disabled:opacity-50
            `}
        >
            <div
                className={`
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    ${iconClass}
                `}
            >
                <Icon
                    size={17}
                />
            </div>

            <div
                className="
                    min-w-0
                    flex-1
                "
            >
                <p
                    className="
                        font-display
                        text-xs
                        font-semibold
                    "
                >
                    {label}
                </p>

                <p
                    className="
                        mt-0.5
                        text-[9px]
                        font-medium
                        text-gray-600
                    "
                >
                    Tasdiqlansa +{reward} FCoin
                </p>
            </div>
        </button>
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
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.14em]
                    text-gray-400
                "
            >
                {children}
            </span>

            {optional && (
                <span
                    className="
                        text-[9px]
                        text-gray-600
                    "
                >
                    ixtiyoriy
                </span>
            )}
        </div>
    );
};

// =========================================================
// EDIT MODAL
// =========================================================

const FeedbackEditModal = ({
    isOpen,
    feedback,
    isSubmitting = false,
    onClose,
    onSubmit,
}) => {
    // =====================================================
    // STATE
    // =====================================================

    const [
        feedbackType,
        setFeedbackType,
    ] = useState(
        DEFAULT_FEEDBACK_TYPE
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
        screenshot,
        setScreenshot,
    ] = useState(null);

    const [
        error,
        setError,
    ] = useState("");

    const fileInputRef =
        useRef(null);

    // =====================================================
    // ORIGINAL VALUES
    // =====================================================

    const initialFeedbackType =
        useMemo(
            () => {
                return getInitialFeedbackType(
                    feedback
                );
            },
            [
                feedback,
            ]
        );

    const initialTitle =
        useMemo(
            () => {
                return String(
                    feedback?.title
                    ??
                    ""
                );
            },
            [
                feedback,
            ]
        );

    const initialMessage =
        useMemo(
            () => {
                return String(
                    feedback?.message
                    ??
                    ""
                );
            },
            [
                feedback,
            ]
        );

    // =====================================================
    // CURRENT SCREENSHOT
    // =====================================================

    const currentScreenshot =
        useMemo(
            () => {
                return getFeedbackScreenshot(
                    feedback
                );
            },
            [
                feedback,
            ]
        );

    // =====================================================
    // NEW PREVIEW
    // =====================================================

    const newPreviewUrl =
        useMemo(
            () => {
                if (
                    !screenshot
                ) {
                    return null;
                }

                return URL
                    .createObjectURL(
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

    // =====================================================
    // SELECTED CONFIG
    // =====================================================

    const selectedType =
        useMemo(
            () => {
                return getFeedbackTypeConfig(
                    feedbackType
                );
            },
            [
                feedbackType,
            ]
        );

    // =====================================================
    // HAS CHANGES
    // =====================================================

    const hasChanges =
        useMemo(
            () => {
                return (
                    feedbackType !==
                        initialFeedbackType
                    ||
                    title.trim() !==
                        initialTitle.trim()
                    ||
                    message.trim() !==
                        initialMessage.trim()
                    ||
                    Boolean(
                        screenshot
                    )
                );
            },
            [
                feedbackType,
                initialFeedbackType,
                initialMessage,
                initialTitle,
                message,
                screenshot,
                title,
            ]
        );

    // =====================================================
    // FILL FORM
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
                getInitialFeedbackType(
                    feedback
                )
            );

            setTitle(
                String(
                    feedback?.title
                    ??
                    ""
                )
            );

            setMessage(
                String(
                    feedback?.message
                    ??
                    ""
                )
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
                fileInputRef
                    .current
                    .value = "";
            }
        },
        [
            feedback,
            isOpen,
        ]
    );

    // =====================================================
    // ESC + BODY LOCK
    // =====================================================

    useEffect(
        () => {
            if (
                !isOpen
            ) {
                return undefined;
            }

            const previousOverflow =
                document
                    .body
                    .style
                    .overflow;

            document
                .body
                .style
                .overflow =
                "hidden";

            const handleKeyDown = (
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
                document
                    .body
                    .style
                    .overflow =
                    previousOverflow;

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
    // TYPE
    // =====================================================

    const handleTypeSelect = (
        nextType
    ) => {
        if (
            isSubmitting
        ) {
            return;
        }

        if (
            !isValidFeedbackType(
                nextType
            )
        ) {
            const validationMessage =
                "Feedback turi noto‘g‘ri.";

            setError(
                validationMessage
            );

            siteToast.warning(
                validationMessage
            );

            return;
        }

        setFeedbackType(
            nextType
        );

        setError(
            ""
        );
    };

    // =====================================================
    // FILE
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

        if (
            !FEEDBACK_ALLOWED_FILE_TYPES
                .includes(
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

        if (
            file.size >
            FEEDBACK_MAX_FILE_SIZE
        ) {
            const validationMessage =
                `Skrinshot hajmi ${formatFeedbackFileSize(
                    FEEDBACK_MAX_FILE_SIZE
                )} dan oshmasligi kerak.`;

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
    // REMOVE NEW SCREENSHOT
    // =====================================================

    const removeNewScreenshot = () => {
        if (
            isSubmitting
        ) {
            return;
        }

        setScreenshot(
            null
        );

        setError(
            ""
        );

        if (
            fileInputRef.current
        ) {
            fileInputRef
                .current
                .value = "";
        }
    };

    // =====================================================
    // VALIDATE
    // =====================================================

    const validate = () => {
        const cleanTitle =
            title.trim();

        const cleanMessage =
            message.trim();

        if (
            !isValidFeedbackType(
                feedbackType
            )
        ) {
            return (
                "Feedback turini to‘g‘ri tanlang."
            );
        }

        if (
            cleanTitle.length <
            FEEDBACK_TITLE_MIN_LENGTH
        ) {
            return (
                `Sarlavha kamida ${FEEDBACK_TITLE_MIN_LENGTH} ta belgidan iborat bo‘lishi kerak.`
            );
        }

        if (
            cleanTitle.length >
            FEEDBACK_TITLE_MAX_LENGTH
        ) {
            return (
                `Sarlavha ${FEEDBACK_TITLE_MAX_LENGTH} ta belgidan oshmasligi kerak.`
            );
        }

        if (
            cleanMessage.length <
            FEEDBACK_MESSAGE_MIN_LENGTH
        ) {
            return (
                `Feedback matni kamida ${FEEDBACK_MESSAGE_MIN_LENGTH} ta belgidan iborat bo‘lishi kerak.`
            );
        }

        if (
            screenshot
        ) {
            if (
                !FEEDBACK_ALLOWED_FILE_TYPES
                    .includes(
                        screenshot.type
                    )
            ) {
                return (
                    "Faqat JPG, PNG yoki WEBP rasm yuklash mumkin."
                );
            }

            if (
                screenshot.size >
                FEEDBACK_MAX_FILE_SIZE
            ) {
                return (
                    `Skrinshot hajmi ${formatFeedbackFileSize(
                        FEEDBACK_MAX_FILE_SIZE
                    )} dan oshmasligi kerak.`
                );
            }
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

        if (
            !feedback?.id
        ) {
            siteToast.error(
                "Feedback ma’lumotlari topilmadi."
            );

            return;
        }

        if (
            !canModifyFeedback(
                feedback
            )
        ) {
            siteToast.warning(
                "Bu feedbackni tahrirlash mumkin emas."
            );

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

            siteToast.warning(
                validationError
            );

            return;
        }

        if (
            !hasChanges
        ) {
            siteToast.info(
                "Hech qanday o‘zgarish kiritilmadi."
            );

            return;
        }

        if (
            typeof onSubmit !==
                "function"
        ) {
            siteToast.error(
                "Feedbackni saqlash funksiyasi mavjud emas."
            );

            return;
        }

        setError(
            ""
        );

        const success =
            await onSubmit(
                feedback.id,
                {
                    feedbackType,

                    title:
                        title.trim(),

                    message:
                        message.trim(),

                    screenshot:
                        screenshot
                        ||
                        undefined,
                }
            );

        if (
            success
        ) {
            setScreenshot(
                null
            );

            setError(
                ""
            );

            if (
                fileInputRef.current
            ) {
                fileInputRef
                    .current
                    .value = "";
            }
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
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                    }}
                    exit={{
                        opacity: 0,
                    }}
                    className="
                        fixed
                        inset-0
                        z-[1000]
                        flex
                        items-center
                        justify-center
                        bg-black/75
                        px-4
                        py-6
                        font-sans
                        backdrop-blur-md
                    "
                    onMouseDown={(
                        event
                    ) => {
                        if (
                            event.target ===
                                event.currentTarget
                            &&
                            !isSubmitting
                        ) {
                            onClose?.();
                        }
                    }}
                >
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 20,
                            scale: 0.97,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                        }}
                        exit={{
                            opacity: 0,
                            y: 14,
                            scale: 0.98,
                        }}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="feedback-edit-title"
                        onMouseDown={(
                            event
                        ) => {
                            event.stopPropagation();
                        }}
                        className="
                            max-h-[92vh]
                            w-full
                            max-w-3xl
                            overflow-y-auto
                            rounded-[28px]
                            border
                            border-white/[0.08]
                            bg-[#090b10]/95
                            shadow-2xl
                            shadow-black/50
                        "
                    >
                        {/* =============================
                            HEADER
                        ============================== */}

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
                            "
                        >
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                "
                            >
                                <div
                                    className="
                                        flex
                                        h-11
                                        w-11
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        border
                                        border-cyan-400/15
                                        bg-cyan-500/[0.07]
                                        text-cyan-300
                                    "
                                >
                                    <Pencil
                                        size={19}
                                    />
                                </div>

                                <div>
                                    <h2
                                        id="feedback-edit-title"
                                        className="
                                            font-display
                                            text-lg
                                            font-semibold
                                            text-white
                                        "
                                    >
                                        Feedbackni tahrirlash
                                    </h2>

                                    <p
                                        className="
                                            mt-0.5
                                            text-[11px]
                                            font-medium
                                            text-gray-600
                                        "
                                    >
                                        Faqat tekshiruvdagi feedbackni
                                        o‘zgartirish mumkin.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={
                                    onClose
                                }
                                disabled={
                                    isSubmitting
                                }
                                aria-label="Modalni yopish"
                                className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border
                                    border-white/[0.06]
                                    bg-white/[0.025]
                                    text-gray-500
                                    transition
                                    hover:bg-white/[0.06]
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

                        {/* =============================
                            FORM
                        ============================== */}

                        <form
                            onSubmit={
                                handleSubmit
                            }
                            className="
                                space-y-6
                                p-5
                                sm:p-6
                            "
                        >
                            {/* =========================
                                WARNING
                            ========================== */}

                            <div
                                className="
                                    flex
                                    items-start
                                    gap-3
                                    rounded-2xl
                                    border
                                    border-amber-400/10
                                    bg-amber-500/[0.04]
                                    p-4
                                "
                            >
                                <ShieldAlert
                                    size={17}
                                    className="
                                        mt-0.5
                                        shrink-0
                                        text-amber-300
                                    "
                                />

                                <p
                                    className="
                                        text-[11px]
                                        font-medium
                                        leading-5
                                        text-gray-500
                                    "
                                >
                                    Admin tasdiqlagan yoki reward
                                    berilgan feedback endi
                                    tahrirlanmaydi. Tahrirdan so‘ng
                                    u tekshiruv jarayonida qoladi.
                                </p>
                            </div>

                            {/* =========================
                                TYPE
                            ========================== */}

                            <div>
                                <FormLabel>
                                    Feedback turi
                                </FormLabel>

                                <div
                                    className="
                                        grid
                                        grid-cols-1
                                        gap-2
                                        sm:grid-cols-2
                                    "
                                >
                                    {FEEDBACK_TYPES.map(
                                        (
                                            config
                                        ) => (
                                            <FeedbackTypeButton
                                                key={
                                                    config.value
                                                }
                                                config={
                                                    config
                                                }
                                                active={
                                                    feedbackType ===
                                                    config.value
                                                }
                                                disabled={
                                                    isSubmitting
                                                }
                                                onSelect={
                                                    handleTypeSelect
                                                }
                                            />
                                        )
                                    )}
                                </div>

                                <p
                                    className="
                                        mt-2
                                        text-[10px]
                                        font-medium
                                        text-gray-600
                                    "
                                >
                                    Tanlangan tur tasdiqlansa{" "}

                                    <span
                                        className="
                                            text-amber-300
                                        "
                                    >
                                        +{
                                            selectedType
                                                .reward
                                        } FCoin
                                    </span>{" "}

                                    reward beradi.
                                </p>
                            </div>

                            {/* =========================
                                TITLE
                            ========================== */}

                            <div>
                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                    "
                                >
                                    <FormLabel>
                                        Sarlavha
                                    </FormLabel>

                                    <span
                                        className="
                                            mb-2
                                            text-[9px]
                                            text-gray-600
                                        "
                                    >
                                        {title.length}
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
                                    onChange={(
                                        event
                                    ) => {
                                        setTitle(
                                            event
                                                .target
                                                .value
                                        );

                                        setError(
                                            ""
                                        );
                                    }}
                                    minLength={
                                        FEEDBACK_TITLE_MIN_LENGTH
                                    }
                                    maxLength={
                                        FEEDBACK_TITLE_MAX_LENGTH
                                    }
                                    required
                                    disabled={
                                        isSubmitting
                                    }
                                    aria-label="Feedback sarlavhasi"
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
                                        focus:border-cyan-400/30
                                        focus:ring-2
                                        focus:ring-cyan-500/[0.05]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                />
                            </div>

                            {/* =========================
                                MESSAGE
                            ========================== */}

                            <div>
                                <FormLabel>
                                    Batafsil ma’lumot
                                </FormLabel>

                                <textarea
                                    value={
                                        message
                                    }
                                    onChange={(
                                        event
                                    ) => {
                                        setMessage(
                                            event
                                                .target
                                                .value
                                        );

                                        setError(
                                            ""
                                        );
                                    }}
                                    minLength={
                                        FEEDBACK_MESSAGE_MIN_LENGTH
                                    }
                                    rows={6}
                                    required
                                    disabled={
                                        isSubmitting
                                    }
                                    aria-label="Feedback matni"
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
                                        focus:border-cyan-400/30
                                        focus:ring-2
                                        focus:ring-cyan-500/[0.05]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                />
                            </div>

                            {/* =========================
                                SCREENSHOT
                            ========================== */}

                            <div>
                                <FormLabel
                                    optional
                                >
                                    Skrinshot
                                </FormLabel>

                                {newPreviewUrl ? (
                                    <div
                                        className="
                                            overflow-hidden
                                            rounded-2xl
                                            border
                                            border-cyan-400/15
                                            bg-black/20
                                        "
                                    >
                                        <img
                                            src={
                                                newPreviewUrl
                                            }
                                            alt="Yangi screenshot"
                                            className="
                                                max-h-[320px]
                                                w-full
                                                object-contain
                                            "
                                        />

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
                                                size={16}
                                                className="
                                                    text-cyan-300
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
                                                        screenshot
                                                            ?.name
                                                    }
                                                </p>

                                                <p
                                                    className="
                                                        mt-0.5
                                                        text-[9px]
                                                        text-gray-600
                                                    "
                                                >
                                                    {
                                                        formatFeedbackFileSize(
                                                            screenshot
                                                                ?.size
                                                        )
                                                    }
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={
                                                    removeNewScreenshot
                                                }
                                                disabled={
                                                    isSubmitting
                                                }
                                                aria-label="Yangi screenshotni olib tashlash"
                                                className="
                                                    flex
                                                    h-9
                                                    w-9
                                                    items-center
                                                    justify-center
                                                    rounded-xl
                                                    border
                                                    border-red-400/15
                                                    bg-red-500/[0.05]
                                                    text-red-300
                                                    transition
                                                    hover:bg-red-500/10
                                                    disabled:cursor-not-allowed
                                                    disabled:opacity-40
                                                "
                                            >
                                                <Trash2
                                                    size={15}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                ) : currentScreenshot ? (
                                    <div
                                        className="
                                            overflow-hidden
                                            rounded-2xl
                                            border
                                            border-white/[0.07]
                                            bg-black/20
                                        "
                                    >
                                        <img
                                            src={
                                                currentScreenshot
                                            }
                                            alt="Joriy screenshot"
                                            className="
                                                max-h-[280px]
                                                w-full
                                                object-contain
                                            "
                                        />

                                        <div
                                            className="
                                                flex
                                                flex-col
                                                gap-3
                                                px-4
                                                py-3
                                                sm:flex-row
                                                sm:items-center
                                                sm:justify-between
                                            "
                                        >
                                            <div
                                                className="
                                                    min-w-0
                                                "
                                            >
                                                <p
                                                    className="
                                                        text-xs
                                                        font-semibold
                                                        text-gray-400
                                                    "
                                                >
                                                    Joriy screenshot
                                                </p>

                                                <p
                                                    className="
                                                        mt-0.5
                                                        text-[9px]
                                                        text-gray-600
                                                    "
                                                >
                                                    Yangi rasm tanlasangiz
                                                    almashtiriladi.
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    fileInputRef
                                                        .current
                                                        ?.click();
                                                }}
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
                                                    border-cyan-400/15
                                                    bg-cyan-500/[0.05]
                                                    px-3
                                                    py-2
                                                    font-display
                                                    text-[10px]
                                                    font-semibold
                                                    text-cyan-300
                                                    transition
                                                    hover:bg-cyan-500/10
                                                    disabled:cursor-not-allowed
                                                    disabled:opacity-40
                                                "
                                            >
                                                <ImagePlus
                                                    size={14}
                                                />

                                                Almashtirish
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            fileInputRef
                                                .current
                                                ?.click();
                                        }}
                                        disabled={
                                            isSubmitting
                                        }
                                        className="
                                            flex
                                            w-full
                                            flex-col
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            border
                                            border-dashed
                                            border-white/[0.09]
                                            bg-white/[0.02]
                                            px-5
                                            py-7
                                            text-center
                                            transition
                                            hover:border-cyan-400/20
                                            hover:bg-cyan-500/[0.03]
                                            disabled:cursor-not-allowed
                                            disabled:opacity-40
                                        "
                                    >
                                        <UploadCloud
                                            size={21}
                                            className="
                                                text-cyan-300
                                            "
                                        />

                                        <p
                                            className="
                                                mt-2
                                                font-display
                                                text-xs
                                                font-semibold
                                                text-gray-300
                                            "
                                        >
                                            Yangi screenshot
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-[9px]
                                                text-gray-600
                                            "
                                        >
                                            JPG, PNG, WEBP ·{" "}
                                            {
                                                formatFeedbackFileSize(
                                                    FEEDBACK_MAX_FILE_SIZE
                                                )
                                            }{" "}
                                            gacha
                                        </p>
                                    </button>
                                )}

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
                                    className="hidden"
                                />
                            </div>

                            {/* =========================
                                ERROR
                            ========================== */}

                            {error && (
                                <div
                                    role="alert"
                                    className="
                                        rounded-2xl
                                        border
                                        border-red-400/15
                                        bg-red-500/[0.05]
                                        px-4
                                        py-3
                                        text-xs
                                        font-medium
                                        text-red-300
                                    "
                                >
                                    {error}
                                </div>
                            )}

                            {/* =========================
                                ACTIONS
                            ========================== */}

                            <div
                                className="
                                    flex
                                    flex-col-reverse
                                    gap-3
                                    border-t
                                    border-white/[0.06]
                                    pt-5
                                    sm:flex-row
                                    sm:justify-end
                                "
                            >
                                <button
                                    type="button"
                                    onClick={
                                        onClose
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
                                        border-cyan-400/20
                                        bg-cyan-600
                                        px-5
                                        py-3
                                        font-display
                                        text-xs
                                        font-semibold
                                        text-white
                                        transition-all
                                        hover:-translate-y-0.5
                                        hover:bg-cyan-500
                                        active:translate-y-0
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

                                            Saqlash
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

// =========================================================
// EXPORT
// =========================================================

export default FeedbackEditModal;