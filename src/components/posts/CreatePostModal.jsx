// src/components/posts/CreatePostModal.jsx

import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    AlignLeft,
    AlertTriangle,
    BriefcaseBusiness,
    Check,
    Cpu,
    Dumbbell,
    Gamepad2,
    Layers3,
    Loader2,
    PenLine,
    Save,
    Send,
    Sparkles,
    Type,
    X,
} from "lucide-react";

import {
    siteToast,
} from "../ui/AuthToast";


// =========================================================
// POST TYPES
// =========================================================

const POST_TYPES = [
    {
        value: "TEX",
        label: "Texnologiya",
        description: "Dasturlash, IT va texnologiyalar",
        Icon: Cpu,

        activeClass:
            "border-indigo-400/50 bg-indigo-500/15 text-indigo-200",

        iconClass:
            "border-indigo-400/20 bg-indigo-500/10 text-indigo-300",

        glowClass:
            "bg-indigo-500/20",
    },

    {
        value: "SPO",
        label: "Sport",
        description: "Sport, mashg‘ulot va faol hayot",
        Icon: Dumbbell,

        activeClass:
            "border-emerald-400/50 bg-emerald-500/15 text-emerald-200",

        iconClass:
            "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",

        glowClass:
            "bg-emerald-500/20",
    },

    {
        value: "BIZ",
        label: "Biznes",
        description: "Biznes, startup va freelancing",
        Icon: BriefcaseBusiness,

        activeClass:
            "border-amber-400/50 bg-amber-500/15 text-amber-200",

        iconClass:
            "border-amber-400/20 bg-amber-500/10 text-amber-300",

        glowClass:
            "bg-amber-500/20",
    },

    {
        value: "ENT",
        label: "O‘yin-kulgi",
        description: "Gaming, media va qiziqarli mavzular",
        Icon: Gamepad2,

        activeClass:
            "border-pink-400/50 bg-pink-500/15 text-pink-200",

        iconClass:
            "border-pink-400/20 bg-pink-500/10 text-pink-300",

        glowClass:
            "bg-pink-500/20",
    },

    {
        value: "OTH",
        label: "Boshqa",
        description: "Boshqa turdagi foydali kontent",
        Icon: Layers3,

        activeClass:
            "border-cyan-400/50 bg-cyan-500/15 text-cyan-200",

        iconClass:
            "border-cyan-400/20 bg-cyan-500/10 text-cyan-300",

        glowClass:
            "bg-cyan-500/20",
    },
];


// =========================================================
// EMPTY FORM
// =========================================================

const EMPTY_FORM = {
    post_type: "TEX",
    title: "",
    content: "",
};


// =========================================================
// ERROR PARSER
// =========================================================

const getErrorMessage = (
    error,
    fallback = "Postni saqlashda kutilmagan xatolik yuz berdi."
) => {
    if (!error) {
        return fallback;
    }

    const serverData =
        error?.serverData ||
        error?.response?.data;

    if (
        typeof serverData === "string" &&
        serverData.trim()
    ) {
        return serverData;
    }

    if (serverData?.detail) {
        return String(
            serverData.detail
        );
    }

    if (serverData?.message) {
        return String(
            serverData.message
        );
    }

    if (serverData?.error) {
        return String(
            serverData.error
        );
    }

    if (serverData?.title) {
        const value =
            serverData.title;

        return Array.isArray(value)
            ? `Sarlavha: ${value[0]}`
            : `Sarlavha: ${value}`;
    }

    if (serverData?.content) {
        const value =
            serverData.content;

        return Array.isArray(value)
            ? `Kontent: ${value[0]}`
            : `Kontent: ${value}`;
    }

    if (
        serverData &&
        typeof serverData === "object"
    ) {
        const firstValue =
            Object.values(
                serverData
            )[0];

        if (
            Array.isArray(firstValue) &&
            firstValue.length > 0
        ) {
            return String(
                firstValue[0]
            );
        }

        if (
            typeof firstValue === "string" &&
            firstValue.trim()
        ) {
            return firstValue;
        }
    }

    if (error?.message) {
        try {
            const parsed =
                JSON.parse(
                    error.message
                );

            if (parsed?.detail) {
                return String(
                    parsed.detail
                );
            }

            if (parsed?.message) {
                return String(
                    parsed.message
                );
            }

            if (parsed?.error) {
                return String(
                    parsed.error
                );
            }

            if (parsed?.title) {
                const value =
                    parsed.title;

                return Array.isArray(value)
                    ? `Sarlavha: ${value[0]}`
                    : `Sarlavha: ${value}`;
            }

            if (parsed?.content) {
                const value =
                    parsed.content;

                return Array.isArray(value)
                    ? `Kontent: ${value[0]}`
                    : `Kontent: ${value}`;
            }

            if (
                parsed &&
                typeof parsed === "object"
            ) {
                const firstValue =
                    Object.values(
                        parsed
                    )[0];

                if (
                    Array.isArray(firstValue) &&
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
        } catch {
            return String(
                error.message
            );
        }
    }

    return fallback;
};


// =========================================================
// HTML -> TEXT
// =========================================================

const stripHtml = (
    html = ""
) => {
    return String(html)
        .replace(
            /<style[^>]*>.*?<\/style>/gis,
            ""
        )
        .replace(
            /<script[^>]*>.*?<\/script>/gis,
            ""
        )
        .replace(
            /<[^>]+>/g,
            " "
        )
        .replace(
            /&nbsp;/g,
            " "
        )
        .replace(
            /&amp;/g,
            "&"
        )
        .replace(
            /&lt;/g,
            "<"
        )
        .replace(
            /&gt;/g,
            ">"
        )
        .replace(
            /&quot;/g,
            "\""
        )
        .replace(
            /&#039;/g,
            "'"
        )
        .replace(
            /\s+/g,
            " "
        )
        .trim();
};


// =========================================================
// CREATE POST MODAL
// =========================================================

const CreatePostModal = ({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting = false,
    initialData = null,
}) => {
    // =====================================================
    // MODE
    // =====================================================

    const isEditMode =
        Boolean(
            initialData
        );


    // =====================================================
    // FORM STATE
    // =====================================================

    const [
        formData,
        setFormData,
    ] = useState(
        EMPTY_FORM
    );


    const [
        error,
        setError,
    ] = useState(
        ""
    );


    // =====================================================
    // INITIAL DATA
    // =====================================================

    useEffect(
        () => {
            if (!isOpen) {
                return;
            }

            if (initialData) {
                setFormData({
                    post_type:
                        initialData?.post_type ||
                        "TEX",

                    title:
                        initialData?.title ||
                        "",

                    content:
                        initialData?.content ||
                        "",
                });
            } else {
                setFormData({
                    ...EMPTY_FORM,
                });
            }

            setError("");
        },
        [
            isOpen,
            initialData?.post_type,
            initialData?.title,
            initialData?.content,
        ]
    );


    // =====================================================
    // BODY LOCK + ESC
    // =====================================================

    useEffect(
        () => {
            if (!isOpen) {
                return undefined;
            }

            const oldOverflow =
                document
                    .body
                    .style
                    .overflow;

            document
                .body
                .style
                .overflow =
                "hidden";


            const handleKeyDown =
                (event) => {
                    if (
                        event.key ===
                            "Escape" &&
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
                    oldOverflow;

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
    // SELECTED TYPE
    // =====================================================

    const selectedType =
        useMemo(
            () => {
                return (
                    POST_TYPES.find(
                        (item) =>
                            item.value ===
                            formData.post_type
                    ) ||
                    POST_TYPES[0]
                );
            },
            [
                formData.post_type,
            ]
        );


    // =====================================================
    // PREVIEW CONTENT
    // =====================================================

    const cleanPreviewContent =
        useMemo(
            () => {
                return stripHtml(
                    formData.content
                );
            },
            [
                formData.content,
            ]
        );


    // =====================================================
    // WORD COUNT
    // =====================================================

    const wordCount =
        useMemo(
            () => {
                const content =
                    stripHtml(
                        formData.content
                    ).trim();

                if (!content) {
                    return 0;
                }

                return content
                    .split(/\s+/)
                    .filter(Boolean)
                    .length;
            },
            [
                formData.content,
            ]
        );


    // =====================================================
    // CHANGE
    // =====================================================

    const handleChange =
        (event) => {
            const {
                name,
                value,
            } = event.target;

            setFormData(
                (previous) => ({
                    ...previous,

                    [name]:
                        value,
                })
            );

            if (error) {
                setError("");
            }
        };


    // =====================================================
    // CATEGORY CHANGE
    // =====================================================

    const handleCategoryChange =
        (value) => {
            if (isSubmitting) {
                return;
            }

            setFormData(
                (previous) => ({
                    ...previous,

                    post_type:
                        value,
                })
            );

            if (error) {
                setError("");
            }
        };


    // =====================================================
    // CLOSE
    // =====================================================

    const handleClose =
        () => {
            if (isSubmitting) {
                return;
            }

            setError("");

            onClose?.();
        };


    // =====================================================
    // BACKDROP
    // =====================================================

    const handleBackdropClick =
        (event) => {
            if (
                event.target ===
                event.currentTarget
            ) {
                handleClose();
            }
        };


    // =====================================================
    // VALIDATE
    // =====================================================

    const validateForm =
        () => {
            const cleanTitle =
                formData
                    .title
                    .trim();

            const cleanContent =
                formData
                    .content
                    .trim();


            if (!cleanTitle) {
                return (
                    "Post sarlavhasini kiriting."
                );
            }


            if (
                cleanTitle.length < 3
            ) {
                return (
                    "Sarlavha kamida 3 ta belgidan iborat bo‘lishi kerak."
                );
            }


            if (
                cleanTitle.length > 150
            ) {
                return (
                    "Sarlavha 150 ta belgidan oshmasligi kerak."
                );
            }


            if (!cleanContent) {
                return (
                    "Post kontentini kiriting."
                );
            }


            return null;
        };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit =
        async (event) => {
            event.preventDefault();

            if (isSubmitting) {
                return;
            }

            setError("");


            // =============================================
            // VALIDATION
            // =============================================

            const validationError =
                validateForm();


            if (validationError) {
                setError(
                    validationError
                );

                siteToast.warning(
                    validationError,
                    {
                        title:
                            "Post ma’lumotlarini tekshiring",

                        duration:
                            4000,
                    }
                );

                return;
            }


            // =============================================
            // PAYLOAD
            // =============================================

            const payload = {
                post_type:
                    formData.post_type,

                title:
                    formData
                        .title
                        .trim(),

                content:
                    formData
                        .content
                        .trim(),
            };


            /*
                CREATE rejimida API jarayoni shu modalga tegishli,
                shuning uchun loading toast chiqaramiz.

                EDIT rejimida esa PostDetail hozircha o‘zining
                success/error toastini boshqaryapti.

                Shu sabab editda duplicate toast chiqarmaymiz.
            */

            let loadingToastId =
                null;


            if (!isEditMode) {
                loadingToastId =
                    siteToast.loading(
                        "Yangi post serverga yuborilmoqda...",
                        {
                            title:
                                "Post yaratilmoqda",
                        }
                    );
            }


            try {
                const result =
                    await onSubmit?.(
                        payload
                    );


                // =========================================
                // PARENT FALSE QAYTARSA
                // =========================================

                if (result === false) {
                    if (
                        loadingToastId
                    ) {
                        siteToast.dismiss(
                            loadingToastId
                        );
                    }

                    return;
                }


                // =========================================
                // CREATE SUCCESS
                // =========================================

                if (!isEditMode) {
                    siteToast.success(
                        "Yangi postingiz community uchun muvaffaqiyatli chop etildi.",
                        {
                            id:
                                loadingToastId,

                            title:
                                "Post chop etildi",

                            duration:
                                3800,
                        }
                    );

                    setFormData({
                        ...EMPTY_FORM,
                    });
                }


                /*
                    Edit success uchun hozir bu modal toast
                    chiqarmaydi.

                    Sababi PostDetail edit jarayonini boshqaradi.
                    Keyingi refactorda PostDetaildagi toastni ham
                    siteToastga almashtiramiz.
                */

            } catch (
                submitError
            ) {
                const message =
                    getErrorMessage(
                        submitError,

                        isEditMode
                            ? (
                                "Postni tahrirlashda xato yuz berdi."
                            )
                            : (
                                "Post yaratishda xato yuz berdi."
                            )
                    );


                setError(
                    message
                );


                // =========================================
                // CREATE ERROR
                // =========================================

                if (!isEditMode) {
                    siteToast.error(
                        message,
                        {
                            id:
                                loadingToastId,

                            title:
                                "Post yaratilmadi",

                            duration:
                                5000,
                        }
                    );
                }

                /*
                    Edit error ham hozircha PostDetail tomonidan
                    chiqariladi. Duplicate alert chiqmasligi uchun
                    shu yerda edit error toast bermaymiz.
                */
            }
        };


    // =====================================================
    // CLOSED
    // =====================================================

    if (!isOpen) {
        return null;
    }


    // =====================================================
    // TEXTS
    // =====================================================

    const modalTitle =
        isEditMode
            ? "Postni tahrirlash"
            : "Yangi post yaratish";


    const modalDescription =
        isEditMode
            ? (
                "Postingizni yangilang va o‘zgarishlarni saqlang."
            )
            : (
                "Bilimingiz, tajribangiz yoki g‘oyangizni F.Society community bilan ulashing."
            );


    const submitText =
        isEditMode
            ? "O‘zgarishlarni saqlash"
            : "Postni chop etish";


    const SubmitIcon =
        isEditMode
            ? Save
            : Send;


    const SelectedIcon =
        selectedType.Icon;


    // =====================================================
    // JSX
    // =====================================================

    return (
        <div
            onMouseDown={
                handleBackdropClick
            }
            className="
                fixed
                inset-0
                z-[100]
                flex
                items-center
                justify-center
                overflow-y-auto
                bg-black/80
                px-3
                py-6
                backdrop-blur-md
                sm:px-6
            "
        >

            {/* =================================================
                BACKGROUND GLOWS
            ================================================== */}

            <div
                className="
                    pointer-events-none
                    fixed
                    left-1/2
                    top-1/4
                    h-[450px]
                    w-[450px]
                    -translate-x-1/2
                    rounded-full
                    bg-indigo-600/10
                    blur-[130px]
                "
            />


            <div
                className="
                    pointer-events-none
                    fixed
                    bottom-0
                    right-0
                    h-[350px]
                    w-[350px]
                    rounded-full
                    bg-purple-600/10
                    blur-[120px]
                "
            />


            {/* =================================================
                MODAL
            ================================================== */}

            <div
                onMouseDown={
                    (event) =>
                        event
                            .stopPropagation()
                }
                className="
                    relative
                    my-auto
                    w-full
                    max-w-6xl
                    overflow-hidden
                    rounded-[32px]
                    border
                    border-white/[0.08]
                    bg-[#0a0d14]/95
                    shadow-[0_35px_100px_rgba(0,0,0,0.75)]
                    backdrop-blur-2xl
                "
            >

                {/* =============================================
                    TOP GLOW
                ============================================== */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        left-1/2
                        top-0
                        h-40
                        w-[70%]
                        -translate-x-1/2
                        -translate-y-1/2
                        rounded-full
                        bg-indigo-500/15
                        blur-[80px]
                    "
                />


                {/* =============================================
                    HEADER
                ============================================== */}

                <header
                    className="
                        relative
                        z-10
                        flex
                        items-start
                        justify-between
                        gap-4
                        border-b
                        border-white/[0.06]
                        px-5
                        py-5
                        sm:px-7
                        sm:py-6
                    "
                >

                    <div
                        className="
                            flex
                            min-w-0
                            items-start
                            gap-4
                        "
                    >

                        <div
                            className="
                                flex
                                h-12
                                w-12
                                shrink-0
                                items-center
                                justify-center
                                rounded-2xl
                                border
                                border-indigo-400/25
                                bg-indigo-500/10
                                text-indigo-300
                                shadow-lg
                                shadow-indigo-500/10
                            "
                        >
                            {isEditMode ? (
                                <PenLine
                                    size={22}
                                />
                            ) : (
                                <Sparkles
                                    size={22}
                                />
                            )}
                        </div>


                        <div
                            className="
                                min-w-0
                            "
                        >

                            <div
                                className="
                                    mb-1.5
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    border
                                    border-indigo-400/20
                                    bg-indigo-500/[0.08]
                                    px-2.5
                                    py-1
                                    text-[9px]
                                    font-black
                                    uppercase
                                    tracking-[0.18em]
                                    text-indigo-300
                                "
                            >

                                <span
                                    className="
                                        h-1.5
                                        w-1.5
                                        rounded-full
                                        bg-indigo-400
                                        shadow-[0_0_8px_rgba(129,140,248,0.8)]
                                    "
                                />

                                F.Society Posts

                            </div>


                            <h2
                                className="
                                    truncate
                                    text-xl
                                    font-black
                                    tracking-tight
                                    text-white
                                    sm:text-2xl
                                "
                            >
                                {modalTitle}
                            </h2>


                            <p
                                className="
                                    mt-1
                                    max-w-xl
                                    text-xs
                                    font-medium
                                    leading-5
                                    text-gray-500
                                    sm:text-sm
                                "
                            >
                                {modalDescription}
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
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-white/[0.07]
                            bg-white/[0.03]
                            text-gray-500
                            transition-all
                            duration-200
                            hover:border-red-400/30
                            hover:bg-red-500/10
                            hover:text-red-300
                            active:scale-95
                            disabled:cursor-not-allowed
                            disabled:opacity-40
                        "
                        aria-label="Modalni yopish"
                    >
                        <X
                            size={19}
                        />
                    </button>

                </header>


                {/* =============================================
                    FORM
                ============================================== */}

                <form
                    onSubmit={
                        handleSubmit
                    }
                >

                    <div
                        className="
                            grid
                            lg:grid-cols-[minmax(0,1.3fr)_minmax(300px,0.7fr)]
                        "
                    >

                        {/* =====================================
                            LEFT
                        ====================================== */}

                        <div
                            className="
                                space-y-7
                                p-5
                                sm:p-7
                                lg:border-r
                                lg:border-white/[0.06]
                            "
                        >

                            {/* =================================
                                CATEGORY
                            ================================== */}

                            <section>

                                <div
                                    className="
                                        mb-3
                                        flex
                                        items-center
                                        justify-between
                                        gap-4
                                    "
                                >

                                    <div>

                                        <label
                                            className="
                                                text-xs
                                                font-black
                                                uppercase
                                                tracking-[0.16em]
                                                text-gray-400
                                            "
                                        >
                                            Post turi
                                        </label>


                                        <p
                                            className="
                                                mt-1
                                                text-xs
                                                text-gray-600
                                            "
                                        >
                                            Postingizga eng mos kategoriyani tanlang.
                                        </p>

                                    </div>


                                    <div
                                        className="
                                            hidden
                                            items-center
                                            gap-1.5
                                            rounded-full
                                            border
                                            border-emerald-400/15
                                            bg-emerald-500/[0.06]
                                            px-3
                                            py-1
                                            text-[10px]
                                            font-bold
                                            text-emerald-300
                                            sm:flex
                                        "
                                    >

                                        <Check
                                            size={12}
                                        />

                                        {
                                            selectedType.label
                                        }

                                    </div>

                                </div>


                                <div
                                    className="
                                        grid
                                        gap-3
                                        sm:grid-cols-2
                                        xl:grid-cols-3
                                    "
                                >

                                    {POST_TYPES.map(
                                        ({
                                            value,
                                            label,
                                            description,
                                            Icon,
                                            activeClass,
                                            iconClass,
                                            glowClass,
                                        }) => {
                                            const active =
                                                formData.post_type ===
                                                value;


                                            return (
                                                <button
                                                    key={
                                                        value
                                                    }
                                                    type="button"
                                                    onClick={() =>
                                                        handleCategoryChange(
                                                            value
                                                        )
                                                    }
                                                    disabled={
                                                        isSubmitting
                                                    }
                                                    className={`
                                                        group
                                                        relative
                                                        overflow-hidden
                                                        rounded-2xl
                                                        border
                                                        p-3.5
                                                        text-left
                                                        transition-all
                                                        duration-300
                                                        active:scale-[0.98]
                                                        disabled:cursor-not-allowed
                                                        disabled:opacity-50

                                                        ${
                                                            active
                                                                ? activeClass
                                                                : `
                                                                    border-white/[0.07]
                                                                    bg-white/[0.025]
                                                                    text-gray-300
                                                                    hover:border-white/[0.12]
                                                                    hover:bg-white/[0.045]
                                                                `
                                                        }
                                                    `}
                                                >

                                                    <div
                                                        className={`
                                                            pointer-events-none
                                                            absolute
                                                            -right-8
                                                            -top-8
                                                            h-20
                                                            w-20
                                                            rounded-full
                                                            blur-2xl
                                                            transition-opacity

                                                            ${
                                                                active
                                                                    ? "opacity-100"
                                                                    : "opacity-0 group-hover:opacity-60"
                                                            }

                                                            ${glowClass}
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
                                                                        text-sm
                                                                        font-black
                                                                        text-white
                                                                    "
                                                                >
                                                                    {label}
                                                                </p>


                                                                {active && (
                                                                    <div
                                                                        className="
                                                                            flex
                                                                            h-5
                                                                            w-5
                                                                            items-center
                                                                            justify-center
                                                                            rounded-full
                                                                            bg-white/10
                                                                        "
                                                                    >
                                                                        <Check
                                                                            size={12}
                                                                        />
                                                                    </div>
                                                                )}

                                                            </div>


                                                            <p
                                                                className="
                                                                    mt-1
                                                                    text-[10px]
                                                                    font-medium
                                                                    leading-4
                                                                    text-gray-500
                                                                "
                                                            >
                                                                {description}
                                                            </p>

                                                        </div>

                                                    </div>

                                                </button>
                                            );
                                        }
                                    )}

                                </div>

                            </section>


                            {/* =================================
                                TITLE
                            ================================== */}

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
                                        htmlFor="title"
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            text-xs
                                            font-black
                                            uppercase
                                            tracking-[0.16em]
                                            text-gray-400
                                        "
                                    >

                                        <Type
                                            size={14}
                                            className="
                                                text-indigo-300
                                            "
                                        />

                                        Sarlavha

                                    </label>


                                    <span
                                        className={`
                                            text-[10px]
                                            font-bold

                                            ${
                                                formData.title.length >= 140
                                                    ? "text-amber-300"
                                                    : "text-gray-600"
                                            }
                                        `}
                                    >
                                        {
                                            formData.title.length
                                        }
                                        /150
                                    </span>

                                </div>


                                <div
                                    className="
                                        group
                                        relative
                                    "
                                >

                                    <div
                                        className="
                                            pointer-events-none
                                            absolute
                                            inset-0
                                            rounded-2xl
                                            bg-indigo-500/0
                                            blur-xl
                                            transition
                                            group-focus-within:bg-indigo-500/[0.06]
                                        "
                                    />


                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={
                                            formData.title
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        maxLength={150}
                                        disabled={
                                            isSubmitting
                                        }
                                        autoComplete="off"
                                        placeholder="Masalan: Django REST Framework’da JWT authentication..."
                                        className="
                                            relative
                                            z-10
                                            w-full
                                            rounded-2xl
                                            border
                                            border-white/[0.08]
                                            bg-black/20
                                            px-4
                                            py-3.5
                                            text-sm
                                            font-semibold
                                            text-white
                                            outline-none
                                            transition-all
                                            placeholder:text-gray-700
                                            focus:border-indigo-400/40
                                            focus:bg-indigo-500/[0.025]
                                            focus:ring-4
                                            focus:ring-indigo-500/[0.06]
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                            sm:text-base
                                        "
                                    />

                                </div>

                            </section>


                            {/* =================================
                                CONTENT
                            ================================== */}

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
                                        htmlFor="content"
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            text-xs
                                            font-black
                                            uppercase
                                            tracking-[0.16em]
                                            text-gray-400
                                        "
                                    >

                                        <AlignLeft
                                            size={14}
                                            className="
                                                text-purple-300
                                            "
                                        />

                                        Post mazmuni

                                    </label>


                                    <span
                                        className="
                                            text-[10px]
                                            font-bold
                                            text-gray-600
                                        "
                                    >
                                        {wordCount}
                                        {" "}
                                        so‘z
                                    </span>

                                </div>


                                <div
                                    className="
                                        group
                                        relative
                                    "
                                >

                                    <div
                                        className="
                                            pointer-events-none
                                            absolute
                                            inset-0
                                            rounded-2xl
                                            bg-purple-500/0
                                            blur-xl
                                            transition
                                            group-focus-within:bg-purple-500/[0.05]
                                        "
                                    />


                                    <textarea
                                        id="content"
                                        name="content"
                                        value={
                                            formData.content
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        rows={11}
                                        disabled={
                                            isSubmitting
                                        }
                                        placeholder={`O‘z fikringizni yozing...

Masalan:
• Muammo nima edi?
• Qanday yechim topdingiz?
• Code snippet yoki tavsiyalar
• Boshqalarga qanday foyda beradi?`}
                                        className="
                                            relative
                                            z-10
                                            min-h-[260px]
                                            w-full
                                            resize-y
                                            rounded-2xl
                                            border
                                            border-white/[0.08]
                                            bg-black/20
                                            px-4
                                            py-4
                                            text-sm
                                            font-medium
                                            leading-7
                                            text-gray-200
                                            outline-none
                                            transition-all
                                            placeholder:text-gray-700
                                            focus:border-purple-400/40
                                            focus:bg-purple-500/[0.02]
                                            focus:ring-4
                                            focus:ring-purple-500/[0.05]
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        "
                                    />

                                </div>

                            </section>


                            {/* =================================
                                INLINE ERROR
                            ================================== */}

                            {error && (
                                <div
                                    className="
                                        flex
                                        items-start
                                        gap-3
                                        rounded-2xl
                                        border
                                        border-red-400/20
                                        bg-red-500/[0.08]
                                        p-4
                                    "
                                >

                                    <div
                                        className="
                                            mt-0.5
                                            flex
                                            h-8
                                            w-8
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-red-500/10
                                            text-red-300
                                        "
                                    >
                                        <AlertTriangle
                                            size={17}
                                        />
                                    </div>


                                    <div>

                                        <p
                                            className="
                                                text-xs
                                                font-black
                                                uppercase
                                                tracking-wider
                                                text-red-300
                                            "
                                        >
                                            Xatolik
                                        </p>


                                        <p
                                            className="
                                                mt-1
                                                text-sm
                                                font-medium
                                                leading-6
                                                text-red-200/80
                                            "
                                        >
                                            {error}
                                        </p>

                                    </div>

                                </div>
                            )}

                        </div>


                        {/* =====================================
                            RIGHT — LIVE PREVIEW
                        ====================================== */}

                        <aside
                            className="
                                hidden
                                bg-black/10
                                p-6
                                lg:block
                            "
                        >

                            <div
                                className="
                                    sticky
                                    top-4
                                "
                            >

                                {/* =================================
                                    PREVIEW HEADER
                                ================================== */}

                                <div
                                    className="
                                        mb-4
                                        flex
                                        items-center
                                        justify-between
                                        gap-3
                                    "
                                >

                                    <div>

                                        <p
                                            className="
                                                text-xs
                                                font-black
                                                uppercase
                                                tracking-[0.16em]
                                                text-gray-400
                                            "
                                        >
                                            Live preview
                                        </p>


                                        <p
                                            className="
                                                mt-1
                                                text-[10px]
                                                text-gray-600
                                            "
                                        >
                                            Post kartada taxminan shunday ko‘rinadi
                                        </p>

                                    </div>


                                    <span
                                        className="
                                            rounded-full
                                            border
                                            border-white/[0.07]
                                            bg-white/[0.03]
                                            px-2.5
                                            py-1
                                            text-[9px]
                                            font-bold
                                            uppercase
                                            tracking-wider
                                            text-gray-500
                                        "
                                    >
                                        Preview
                                    </span>

                                </div>


                                {/* =================================
                                    PREVIEW CARD
                                ================================== */}

                                <div
                                    className="
                                        relative
                                        overflow-hidden
                                        rounded-[26px]
                                        border
                                        border-white/[0.08]
                                        bg-[#101521]
                                        p-5
                                        shadow-2xl
                                        shadow-black/30
                                    "
                                >

                                    <div
                                        className={`
                                            pointer-events-none
                                            absolute
                                            -right-16
                                            -top-16
                                            h-40
                                            w-40
                                            rounded-full
                                            blur-[55px]
                                            ${selectedType.glowClass}
                                        `}
                                    />


                                    <div
                                        className="
                                            relative
                                            z-10
                                        "
                                    >

                                        {/* CATEGORY */}

                                        <div
                                            className="
                                                flex
                                                items-center
                                                justify-between
                                                gap-3
                                            "
                                        >

                                            <div
                                                className={`
                                                    inline-flex
                                                    items-center
                                                    gap-2
                                                    rounded-full
                                                    border
                                                    px-3
                                                    py-1.5
                                                    text-[10px]
                                                    font-black
                                                    uppercase
                                                    tracking-wider
                                                    ${selectedType.activeClass}
                                                `}
                                            >

                                                <SelectedIcon
                                                    size={12}
                                                />

                                                {
                                                    selectedType.label
                                                }

                                            </div>


                                            <span
                                                className="
                                                    text-[10px]
                                                    font-bold
                                                    text-gray-600
                                                "
                                            >
                                                Hozir
                                            </span>

                                        </div>


                                        {/* TITLE */}

                                        <h3
                                            className={`
                                                mt-5
                                                break-words
                                                font-black
                                                leading-tight

                                                ${
                                                    formData.title.trim()
                                                        ? "text-xl text-white"
                                                        : "text-lg text-gray-700"
                                                }
                                            `}
                                        >
                                            {
                                                formData.title.trim() ||
                                                "Post sarlavhasi shu yerda ko‘rinadi..."
                                            }
                                        </h3>


                                        {/* CONTENT */}

                                        <div
                                            className="
                                                mt-4
                                                border-l-2
                                                border-indigo-400/40
                                                pl-4
                                            "
                                        >

                                            <p
                                                className={`
                                                    line-clamp-6
                                                    whitespace-pre-wrap
                                                    break-words
                                                    text-sm
                                                    font-medium
                                                    leading-7

                                                    ${
                                                        cleanPreviewContent
                                                            ? "text-gray-400"
                                                            : "text-gray-700"
                                                    }
                                                `}
                                            >
                                                {
                                                    cleanPreviewContent ||
                                                    "Post mazmunini yozishni boshlaganingizda preview shu yerda paydo bo‘ladi."
                                                }
                                            </p>

                                        </div>


                                        {/* STATS PREVIEW */}

                                        <div
                                            className="
                                                mt-6
                                                flex
                                                items-center
                                                gap-4
                                                border-t
                                                border-white/[0.06]
                                                pt-4
                                                text-xs
                                                font-bold
                                                text-gray-600
                                            "
                                        >
                                            <span>
                                                ♡ 0
                                            </span>

                                            <span>
                                                ◉ 0
                                            </span>

                                            <span>
                                                ◯ 0
                                            </span>
                                        </div>

                                    </div>

                                </div>


                                {/* =================================
                                    TIPS
                                ================================== */}

                                <div
                                    className="
                                        mt-4
                                        rounded-2xl
                                        border
                                        border-indigo-400/15
                                        bg-indigo-500/[0.05]
                                        p-4
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            text-xs
                                            font-black
                                            text-indigo-300
                                        "
                                    >

                                        <Sparkles
                                            size={14}
                                        />

                                        Yaxshi post uchun

                                    </div>


                                    <p
                                        className="
                                            mt-2
                                            text-xs
                                            font-medium
                                            leading-5
                                            text-gray-500
                                        "
                                    >
                                        Aniq sarlavha yozing, muammoni tushuntiring
                                        va boshqalarga foyda beradigan yechim yoki
                                        tajribani ulashing.
                                    </p>

                                </div>

                            </div>

                        </aside>

                    </div>


                    {/* =============================================
                        FOOTER
                    ============================================== */}

                    <footer
                        className="
                            flex
                            flex-col-reverse
                            gap-3
                            border-t
                            border-white/[0.06]
                            bg-black/15
                            px-5
                            py-4
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                            sm:px-7
                        "
                    >

                        <div
                            className="
                                text-center
                                text-[10px]
                                font-medium
                                text-gray-600
                                sm:text-left
                            "
                        >
                            ESC orqali ham yopishingiz mumkin.
                        </div>


                        <div
                            className="
                                flex
                                flex-col
                                gap-2
                                sm:flex-row
                            "
                        >

                            {/* =================================
                                CANCEL
                            ================================== */}

                            <button
                                type="button"
                                onClick={
                                    handleClose
                                }
                                disabled={
                                    isSubmitting
                                }
                                className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-2xl
                                    border
                                    border-white/[0.08]
                                    bg-white/[0.03]
                                    px-5
                                    py-3
                                    text-sm
                                    font-black
                                    text-gray-400
                                    transition-all
                                    hover:border-white/[0.14]
                                    hover:bg-white/[0.06]
                                    hover:text-white
                                    active:scale-[0.98]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-40
                                "
                            >

                                <X
                                    size={17}
                                />

                                Bekor qilish

                            </button>


                            {/* =================================
                                SUBMIT
                            ================================== */}

                            <button
                                type="submit"
                                disabled={
                                    isSubmitting
                                }
                                className="
                                    group
                                    relative
                                    inline-flex
                                    min-w-[210px]
                                    items-center
                                    justify-center
                                    gap-2
                                    overflow-hidden
                                    rounded-2xl
                                    border
                                    border-indigo-400/30
                                    bg-gradient-to-r
                                    from-indigo-600
                                    via-violet-600
                                    to-purple-600
                                    px-6
                                    py-3
                                    text-sm
                                    font-black
                                    text-white
                                    shadow-xl
                                    shadow-indigo-600/20
                                    transition-all
                                    duration-300
                                    hover:-translate-y-0.5
                                    hover:shadow-indigo-500/30
                                    active:translate-y-0
                                    active:scale-[0.98]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                    disabled:hover:translate-y-0
                                "
                            >

                                {/* SHINE */}

                                <div
                                    className="
                                        pointer-events-none
                                        absolute
                                        inset-y-0
                                        -left-20
                                        w-16
                                        rotate-12
                                        bg-white/15
                                        blur-md
                                        transition-all
                                        duration-700
                                        group-hover:left-[120%]
                                    "
                                />


                                {isSubmitting ? (
                                    <>
                                        <Loader2
                                            size={18}
                                            className="
                                                animate-spin
                                            "
                                        />

                                        {
                                            isEditMode
                                                ? "Saqlanmoqda..."
                                                : "Chop etilmoqda..."
                                        }
                                    </>
                                ) : (
                                    <>
                                        <SubmitIcon
                                            size={18}
                                        />

                                        {
                                            submitText
                                        }
                                    </>
                                )}

                            </button>

                        </div>

                    </footer>

                </form>

            </div>

        </div>
    );
};


export default CreatePostModal;