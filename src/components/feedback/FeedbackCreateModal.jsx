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
    Bug,
    FileImage,
    Gift,
    Heart,
    ImagePlus,
    Lightbulb,
    Loader2,
    MessageSquareText,
    Sparkles,
    Trash2,
    UploadCloud,
    X,
} from "lucide-react";

import FeedbackService from "../../services/feedback";
import api from "../../services/api";


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


const EMPTY_FEEDBACK_REWARDS = {
    bug: null,
    suggestion: null,
    praise: null,
    other: null,
};


const FEEDBACK_TYPES = [
    {
        value:
            "bug",

        label:
            "Bug",

        description:
            "Saytda xato yoki noto‘g‘ri ishlayotgan joy topdingiz.",

        Icon:
            Bug,

        activeClass:
            "border-red-400/40 bg-red-500/[0.10] text-red-300",

        iconClass:
            "bg-red-500/10 text-red-300",
    },

    {
        value:
            "suggestion",

        label:
            "Taklif",

        description:
            "Platformani yaxshilash uchun yangi g‘oyangiz bor.",

        Icon:
            Lightbulb,

        activeClass:
            "border-amber-400/40 bg-amber-500/[0.10] text-amber-300",

        iconClass:
            "bg-amber-500/10 text-amber-300",
    },

    {
        value:
            "praise",

        label:
            "Maqtov",

        description:
            "Yoqtirgan jihatingiz yoki ijobiy fikringizni yuboring.",

        Icon:
            Heart,

        activeClass:
            "border-emerald-400/40 bg-emerald-500/[0.10] text-emerald-300",

        iconClass:
            "bg-emerald-500/10 text-emerald-300",
    },

    {
        value:
            "other",

        label:
            "Boshqa",

        description:
            "Yuqoridagi turlarga kirmaydigan fikr yoki xabar.",

        Icon:
            MessageSquareText,

        activeClass:
            "border-indigo-400/40 bg-indigo-500/[0.10] text-indigo-300",

        iconClass:
            "bg-indigo-500/10 text-indigo-300",
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
        "Feedback yuborishda xatolik yuz berdi."
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
        screenshot,
        setScreenshot,
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


    const [
        feedbackRewards,
        setFeedbackRewards,
    ] = useState(
        EMPTY_FEEDBACK_REWARDS
    );


    const [
        isRewardConfigLoading,
        setIsRewardConfigLoading,
    ] = useState(
        false
    );


    const fileInputRef =
        useRef(
            null
        );


    // =====================================================
    // REWARD CONFIG
    // =====================================================
    //
    // Asosiy qiymatlar backenddagi:
    //
    //     coins/reward_coin.py
    //
    // dan /api/coins/rewards/ endpoint orqali olinadi.
    //
    // Frontendda reward soni hardcode qilinmaydi.
    // Endpoint ishlamasa reward o‘rnida "..." ko‘rsatiladi.
    // =====================================================

    useEffect(
        () => {

            if (
                !isOpen
            ) {
                return undefined;
            }


            let isMounted =
                true;


            const loadRewardConfig =
                async () => {

                    setIsRewardConfigLoading(
                        true
                    );


                    try {

                        const {
                            data,
                        } = await api.get(
                            "/coins/rewards/"
                        );


                        const serverRewards =
                            data?.feedback;


                        if (
                            !isMounted
                            ||
                            !serverRewards
                            ||
                            typeof serverRewards
                            !== "object"
                        ) {
                            return;
                        }


                        const normalizeReward =
                            (
                                key
                            ) => {

                                const value =
                                    Number(
                                        serverRewards[
                                            key
                                        ]
                                    );


                                return (
                                    Number.isFinite(
                                        value
                                    )
                                    &&
                                    value >= 0
                                )
                                    ? value
                                    : null;
                            };


                        setFeedbackRewards({
                            bug:
                                normalizeReward(
                                    "bug"
                                ),

                            suggestion:
                                normalizeReward(
                                    "suggestion"
                                ),

                            praise:
                                normalizeReward(
                                    "praise"
                                ),

                            other:
                                normalizeReward(
                                    "other"
                                ),
                        });

                    } catch (
                        requestError
                    ) {

                        if (
                            isMounted
                        ) {
                            setFeedbackRewards(
                                EMPTY_FEEDBACK_REWARDS
                            );
                        }


                        console.warn(
                            "FCoin reward config yuklanmadi. "
                            + "Fallback qiymatlar ishlatiladi.",
                            requestError
                        );

                    } finally {

                        if (
                            isMounted
                        ) {
                            setIsRewardConfigLoading(
                                false
                            );
                        }
                    }
                };


            loadRewardConfig();


            return () => {

                isMounted =
                    false;
            };

        },
        [
            isOpen,
        ]
    );


    // =====================================================
    // PREVIEW
    // =====================================================

    const previewUrl =
        useMemo(
            () => {

                if (
                    !screenshot
                ) {
                    return null;
                }


                return (
                    URL.createObjectURL(
                        screenshot
                    )
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
    // RESET
    // =====================================================

    const resetForm =
        () => {

            setFeedbackType(
                "suggestion"
            );

            setTitle("");

            setMessage("");

            setScreenshot(
                null
            );

            setError("");


            if (
                fileInputRef.current
            ) {

                fileInputRef.current.value =
                    "";

            }
        };


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


            resetForm();

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

                const message =
                    "Faqat JPG, PNG yoki WEBP rasm yuklash mumkin.";


                setError(
                    message
                );


                toast.error(
                    message
                );


                event.target.value =
                    "";

                return;
            }


            if (
                file.size >
                MAX_FILE_SIZE
            ) {

                const message =
                    "Skrinshot hajmi 5 MB dan oshmasligi kerak.";


                setError(
                    message
                );


                toast.error(
                    message
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

    const removeScreenshot =
        () => {

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

    const validateForm =
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
                isSubmitting
            ) {
                return;
            }


            setError("");


            const validationError =
                validateForm();


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
                    "Feedback yuborilmoqda..."
                );


            setIsSubmitting(
                true
            );


            try {

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


                const createdFeedback =
                    response?.feedback
                    ||
                    response;


                toast.success(
                    "Feedback muvaffaqiyatli yuborildi. Admin tekshiruvini kutmoqda.",
                    {
                        id:
                            toastId,

                        duration:
                            4500,
                    }
                );


                resetForm();


                onCreated?.(
                    createdFeedback
                );


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
    // SELECTED TYPE
    // =====================================================

    const selectedReward =
        feedbackRewards[
            feedbackType
        ]
        ??
        null;


    // =====================================================
    // JSX
    // =====================================================

    return (
        <AnimatePresence>

            {isOpen && (

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

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-4
                                "
                            >

                                <div
                                    className="
                                        grid
                                        h-12
                                        w-12
                                        place-items-center
                                        rounded-2xl
                                        border
                                        border-indigo-400/20
                                        bg-indigo-500/10
                                        text-indigo-300
                                    "
                                >

                                    <MessageSquareText
                                        size={22}
                                    />

                                </div>


                                <div>

                                    <h2
                                        className="
                                            text-lg
                                            font-black
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
                                            text-gray-500
                                        "
                                    >
                                        F.Society’ni yaxshilashga
                                        yordam bering.
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
                                    disabled:cursor-not-allowed
                                    disabled:opacity-40
                                "
                            >

                                <X
                                    size={18}
                                />

                            </button>

                        </div>


                        <form
                            onSubmit={
                                handleSubmit
                            }
                            className="
                                relative
                                z-10
                                space-y-7
                                p-6
                            "
                        >

                            {/* TYPE */}

                            <div>

                                <div
                                    className="
                                        mb-3
                                        flex
                                        items-center
                                        justify-between
                                        gap-3
                                    "
                                >

                                    <label
                                        className="
                                            text-xs
                                            font-bold
                                            uppercase
                                            tracking-[0.15em]
                                            text-gray-400
                                        "
                                    >
                                        Feedback turi
                                    </label>


                                    <span
                                        className="
                                            inline-flex
                                            items-center
                                            gap-1.5
                                            rounded-full
                                            border
                                            border-amber-400/15
                                            bg-amber-500/[0.06]
                                            px-3
                                            py-1
                                            text-[10px]
                                            font-bold
                                            text-amber-300
                                        "
                                    >

                                        <Gift
                                            size={12}
                                        />

                                        Tasdiqlansa
                                        {" "}
                                        +
                                        {
                                            (
                                                isRewardConfigLoading
                                                ||
                                                selectedReward ===
                                                null
                                            )
                                                ? "..."
                                                : selectedReward
                                        }
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

                                    {FEEDBACK_TYPES.map(
                                        ({
                                            value,
                                            label,
                                            description,
                                            Icon,
                                            activeClass,
                                            iconClass,
                                        }) => {

                                            const active =
                                                feedbackType ===
                                                value;


                                            const rewardAmount =
                                                feedbackRewards[
                                                    value
                                                ]
                                                ??
                                                null;


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
                                                        rounded-2xl
                                                        border
                                                        p-4
                                                        text-left
                                                        transition-all
                                                        duration-200

                                                        ${
                                                            active
                                                                ? activeClass
                                                                : `
                                                                    border-white/[0.06]
                                                                    bg-white/[0.025]
                                                                    text-gray-300
                                                                    hover:border-white/[0.12]
                                                                    hover:bg-white/[0.045]
                                                                `
                                                        }
                                                    `}
                                                >

                                                    <div
                                                        className="
                                                            flex
                                                            items-start
                                                            gap-3
                                                        "
                                                    >

                                                        <div
                                                            className={`
                                                                grid
                                                                h-10
                                                                w-10
                                                                flex-shrink-0
                                                                place-items-center
                                                                rounded-xl
                                                                ${iconClass}
                                                            `}
                                                        >

                                                            <Icon
                                                                size={18}
                                                            />

                                                        </div>


                                                        <div>

                                                            <p
                                                                className="
                                                                    text-sm
                                                                    font-bold
                                                                "
                                                            >
                                                                {label}
                                                            </p>


                                                            <p
                                                                className="
                                                                    mt-1
                                                                    text-[11px]
                                                                    leading-5
                                                                    text-gray-500
                                                                "
                                                            >
                                                                {description}
                                                            </p>


                                                            <span
                                                                className="
                                                                    mt-2
                                                                    inline-flex
                                                                    items-center
                                                                    gap-1
                                                                    rounded-full
                                                                    border
                                                                    border-amber-400/15
                                                                    bg-amber-500/[0.06]
                                                                    px-2
                                                                    py-1
                                                                    text-[10px]
                                                                    font-black
                                                                    text-amber-300
                                                                "
                                                            >
                                                                <Gift
                                                                    size={11}
                                                                />

                                                                Tasdiqlansa
                                                                {" "}
                                                                +
                                                                {
                                                                    (
                                                                        isRewardConfigLoading
                                                                        ||
                                                                        rewardAmount ===
                                                                        null
                                                                    )
                                                                        ? "..."
                                                                        : rewardAmount
                                                                }
                                                                {" "}
                                                                FCoin
                                                            </span>

                                                        </div>

                                                    </div>

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
                                            text-xs
                                            font-bold
                                            uppercase
                                            tracking-[0.15em]
                                            text-gray-400
                                        "
                                    >
                                        Sarlavha
                                    </label>


                                    <span
                                        className={`
                                            text-[10px]

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
                                        /150
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
                                        ) =>
                                            setTitle(
                                                event.target.value
                                            )
                                    }
                                    maxLength={
                                        150
                                    }
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
                                        text-white
                                        outline-none
                                        transition
                                        placeholder:text-gray-700
                                        focus:border-indigo-400/40
                                        focus:bg-indigo-500/[0.035]
                                    "
                                />

                            </div>


                            {/* MESSAGE */}

                            <div>

                                <label
                                    className="
                                        mb-2
                                        block
                                        text-xs
                                        font-bold
                                        uppercase
                                        tracking-[0.15em]
                                        text-gray-400
                                    "
                                >
                                    Batafsil ma’lumot
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
                                        6
                                    }
                                    placeholder={
                                        feedbackType ===
                                        "bug"

                                            ? (
                                                "Xatoni qanday takrorlash "
                                                + "mumkinligini yozing..."
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
                                        leading-6
                                        text-white
                                        outline-none
                                        transition
                                        placeholder:text-gray-700
                                        focus:border-indigo-400/40
                                        focus:bg-indigo-500/[0.035]
                                    "
                                />

                            </div>


                            {/* SCREENSHOT */}

                            <div>

                                <label
                                    className="
                                        mb-2
                                        block
                                        text-xs
                                        font-bold
                                        uppercase
                                        tracking-[0.15em]
                                        text-gray-400
                                    "
                                >
                                    Skrinshot

                                    <span
                                        className="
                                            ml-2
                                            normal-case
                                            tracking-normal
                                            text-gray-600
                                        "
                                    >
                                        ixtiyoriy
                                    </span>

                                </label>


                                {!screenshot ? (

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
                                        "
                                    >

                                        <div
                                            className="
                                                mb-3
                                                grid
                                                h-12
                                                w-12
                                                place-items-center
                                                rounded-2xl
                                                bg-indigo-500/10
                                                text-indigo-300
                                            "
                                        >

                                            <UploadCloud
                                                size={22}
                                            />

                                        </div>


                                        <p
                                            className="
                                                text-sm
                                                font-bold
                                                text-gray-300
                                            "
                                        >
                                            Skrinshot tanlang
                                        </p>


                                        <p
                                            className="
                                                mt-1
                                                text-[11px]
                                                text-gray-600
                                            "
                                        >
                                            JPG, PNG yoki WEBP
                                            · maksimal 5 MB
                                        </p>

                                    </button>

                                ) : (

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
                                                alt="Screenshot preview"
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
                                                className="
                                                    absolute
                                                    right-3
                                                    top-3
                                                    grid
                                                    h-9
                                                    w-9
                                                    place-items-center
                                                    rounded-xl
                                                    border
                                                    border-red-400/20
                                                    bg-black/70
                                                    text-red-300
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
                                                        font-bold
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
                                                        (
                                                            screenshot.size
                                                            /
                                                            1024
                                                            /
                                                            1024
                                                        ).toFixed(
                                                            2
                                                        )
                                                    }
                                                    {" "}
                                                    MB
                                                </p>

                                            </div>

                                        </div>

                                    </div>

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
                                        rounded-2xl
                                        border
                                        border-red-400/15
                                        bg-red-500/[0.06]
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


                            {/* INFO */}

                            <div
                                className="
                                    flex
                                    items-start
                                    gap-3
                                    rounded-2xl
                                    border
                                    border-indigo-400/10
                                    bg-indigo-500/[0.035]
                                    px-4
                                    py-3
                                "
                            >

                                <Sparkles
                                    size={17}
                                    className="
                                        mt-0.5
                                        flex-shrink-0
                                        text-indigo-300
                                    "
                                />


                                <p
                                    className="
                                        text-[11px]
                                        leading-5
                                        text-gray-500
                                    "
                                >
                                    Feedback avval admin
                                    tekshiruvidan o‘tadi.
                                    FCoin faqat tasdiqlangan
                                    feedback uchun beriladi.
                                </p>

                            </div>


                            {/* FOOTER */}

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
                                        text-xs
                                        font-bold
                                        text-gray-400
                                        transition
                                        hover:bg-white/[0.06]
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
                                        px-6
                                        py-3
                                        text-xs
                                        font-black
                                        text-white
                                        shadow-lg
                                        shadow-indigo-950/30
                                        transition
                                        hover:bg-indigo-500
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >

                                    {isSubmitting ? (
                                        <>
                                            <Loader2
                                                size={16}
                                                className="
                                                    animate-spin
                                                "
                                            />

                                            Yuborilmoqda...
                                        </>
                                    ) : (
                                        <>
                                            <ImagePlus
                                                size={16}
                                            />

                                            Feedback yuborish
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


export default FeedbackCreateModal;