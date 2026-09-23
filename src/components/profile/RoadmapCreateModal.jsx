// src/components/profile/RoadmapCreateModal.jsx

import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    AlertTriangle,
    BookOpen,
    BriefcaseBusiness,
    CalendarDays,
    Check,
    CircleDot,
    Clock3,
    Flag,
    GraduationCap,
    Loader2,
    Map,
    Pencil,
    Rocket,
    Save,
    Sparkles,
    Target,
    X,
} from "lucide-react";

import {
    siteToast,
} from "../ui/AuthToast";


// =========================================================
// ROADMAP TYPES
// =========================================================

const ROADMAP_TYPES = [
    {
        value: "learning",
        label: "O‘rganish",
        shortLabel: "Learning",

        description:
            "Yangi texnologiya, dasturlash tili yoki skillni o‘rganish yo‘li.",

        Icon:
            GraduationCap,

        activeClass:
            "border-indigo-400/35 bg-indigo-500/[0.10] text-indigo-200",

        iconClass:
            "border-indigo-400/20 bg-indigo-500/[0.10] text-indigo-300",

        glowClass:
            "bg-indigo-500/[0.12]",
    },

    {
        value: "experience",
        label: "Tajriba",
        shortLabel: "Experience",

        description:
            "Ish, loyiha, kompaniya yoki professional tajriba bosqichi.",

        Icon:
            BriefcaseBusiness,

        activeClass:
            "border-emerald-400/35 bg-emerald-500/[0.10] text-emerald-200",

        iconClass:
            "border-emerald-400/20 bg-emerald-500/[0.10] text-emerald-300",

        glowClass:
            "bg-emerald-500/[0.12]",
    },
];


// =========================================================
// EMPTY FORM
// =========================================================

const EMPTY_FORM = {
    title: "",
    type: "learning",
    description: "",
    started_at: "",
    finished_at: "",
};


// =========================================================
// DATE FORMAT
// =========================================================

const formatDateForInput = (
    value
) => {
    if (
        !value
    ) {
        return "";
    }


    return String(
        value
    ).slice(
        0,
        10
    );
};


// =========================================================
// DISPLAY DATE
// =========================================================

const formatDisplayDate = (
    value
) => {
    if (
        !value
    ) {
        return "Belgilanmagan";
    }


    try {
        return new Intl.DateTimeFormat(
            "uz-UZ",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        ).format(
            new Date(
                `${value}T00:00:00`
            )
        );

    } catch {
        return value;
    }
};


// =========================================================
// ERROR PARSER
// =========================================================

const getErrorMessage = (
    error,
    fallback = "Roadmapni saqlashda xatolik yuz berdi."
) => {
    if (
        !error
    ) {
        return fallback;
    }


    const data =
        error?.serverData
        ||
        error?.response?.data;


    // =====================================================
    // STRING
    // =====================================================

    if (
        typeof data === "string"
        &&
        data.trim()
    ) {
        return data;
    }


    // =====================================================
    // DETAIL
    // =====================================================

    if (
        data?.detail
    ) {
        return String(
            data.detail
        );
    }


    // =====================================================
    // FIELD ERRORS
    // =====================================================

    const fieldLabels = {
        title:
            "Sarlavha",

        type:
            "Roadmap turi",

        description:
            "Tavsif",

        started_at:
            "Boshlanish sanasi",

        finished_at:
            "Tugash sanasi",
    };


    if (
        data
        &&
        typeof data ===
        "object"
    ) {
        for (
            const [
                field,
                value,
            ]
            of Object.entries(
                data
            )
        ) {
            const label =
                fieldLabels[field]
                ||
                field;


            if (
                Array.isArray(
                    value
                )
                &&
                value.length >
                0
            ) {
                return (
                    `${label}: ${value[0]}`
                );
            }


            if (
                typeof value ===
                "string"
            ) {
                return (
                    `${label}: ${value}`
                );
            }
        }
    }


    // =====================================================
    // ERROR.MESSAGE
    // =====================================================

    if (
        error?.message
    ) {
        try {
            const parsed =
                JSON.parse(
                    error.message
                );


            if (
                parsed?.detail
            ) {
                return String(
                    parsed.detail
                );
            }


            if (
                parsed
                &&
                typeof parsed ===
                "object"
            ) {
                const [
                    field,
                    value,
                ] =
                    Object.entries(
                        parsed
                    )[0]
                    ||
                    [];


                if (
                    field
                ) {
                    const label =
                        fieldLabels[field]
                        ||
                        field;


                    if (
                        Array.isArray(
                            value
                        )
                    ) {
                        return (
                            `${label}: ${
                                value[0]
                                ||
                                fallback
                            }`
                        );
                    }


                    if (
                        typeof value ===
                        "string"
                    ) {
                        return (
                            `${label}: ${value}`
                        );
                    }
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
// ROADMAP CREATE / UPDATE MODAL
// =========================================================

const RoadmapCreateModal = ({
    isOpen,
    onClose,
    onSubmit,
    initialData = null,
    isSubmitting = false,
}) => {
    // =====================================================
    // MODE
    // =====================================================

    const isEditMode =
        Boolean(
            initialData
        );


    // =====================================================
    // STATE
    // =====================================================

    const [
        formData,
        setFormData,
    ] = useState({
        ...EMPTY_FORM,
    });


    const [
        error,
        setError,
    ] = useState(
        ""
    );


    const [
        isProcessing,
        setIsProcessing,
    ] = useState(
        false
    );


    const busy =
        isSubmitting
        ||
        isProcessing;


    // =====================================================
    // INITIAL DATA
    // =====================================================

    useEffect(
        () => {
            if (
                !isOpen
            ) {
                return;
            }


            setError(
                ""
            );


            if (
                initialData
            ) {
                setFormData({
                    title:
                        initialData?.title
                        ||
                        "",

                    type:
                        initialData?.type
                        ||
                        "learning",

                    description:
                        initialData?.description
                        ||
                        "",

                    started_at:
                        formatDateForInput(
                            initialData
                                ?.started_at
                        ),

                    finished_at:
                        formatDateForInput(
                            initialData
                                ?.finished_at
                        ),
                });

            } else {
                setFormData({
                    ...EMPTY_FORM,
                });
            }
        },
        [
            isOpen,
            initialData,
        ]
    );


    // =====================================================
    // BODY LOCK + ESC
    // =====================================================

    useEffect(
        () => {
            if (
                !isOpen
            ) {
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
                (
                    event
                ) => {
                    if (
                        event.key ===
                        "Escape"
                        &&
                        !busy
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
            busy,
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
                    ROADMAP_TYPES.find(
                        (
                            item
                        ) =>
                            item.value ===
                            formData.type
                    )
                    ||
                    ROADMAP_TYPES[0]
                );
            },
            [
                formData.type,
            ]
        );


    const SelectedTypeIcon =
        selectedType.Icon;


    // =====================================================
    // PROGRESS STATUS
    // =====================================================

    const roadmapStatus =
        useMemo(
            () => {
                if (
                    formData.finished_at
                ) {
                    return {
                        label:
                            "Yakunlangan",

                        description:
                            "Roadmap tugash sanasi belgilangan.",

                        className:
                            "border-emerald-400/20 bg-emerald-500/[0.07] text-emerald-300",

                        dotClass:
                            "bg-emerald-400",
                    };
                }


                if (
                    formData.started_at
                ) {
                    return {
                        label:
                            "Jarayonda",

                        description:
                            "Roadmap davom etmoqda.",

                        className:
                            "border-indigo-400/20 bg-indigo-500/[0.07] text-indigo-300",

                        dotClass:
                            "bg-indigo-400",
                    };
                }


                return {
                    label:
                        "Rejalashtirilmoqda",

                    description:
                        "Boshlanish sanasi hali tanlanmagan.",

                    className:
                        "border-gray-400/10 bg-white/[0.025] text-gray-500",

                    dotClass:
                        "bg-gray-600",
                };
            },
            [
                formData.started_at,
                formData.finished_at,
            ]
        );


    // =====================================================
    // CHANGE
    // =====================================================

    const handleChange =
        (
            event
        ) => {
            const {
                name,
                value,
            } =
                event.target;


            setFormData(
                (
                    current
                ) => ({
                    ...current,

                    [name]:
                        value,
                })
            );


            if (
                error
            ) {
                setError(
                    ""
                );
            }
        };


    // =====================================================
    // TYPE CHANGE
    // =====================================================

    const handleTypeChange =
        (
            value
        ) => {
            if (
                busy
            ) {
                return;
            }


            setFormData(
                (
                    current
                ) => ({
                    ...current,

                    type:
                        value,
                })
            );


            if (
                error
            ) {
                setError(
                    ""
                );
            }
        };


    // =====================================================
    // CLOSE
    // =====================================================

    const handleClose =
        () => {
            if (
                busy
            ) {
                return;
            }


            setError(
                ""
            );


            onClose?.();
        };


    // =====================================================
    // BACKDROP
    // =====================================================

    const handleBackdropClick =
        (
            event
        ) => {
            if (
                event.target ===
                event.currentTarget
            ) {
                handleClose();
            }
        };


    // =====================================================
    // VALIDATION
    // =====================================================

    const validateForm =
        () => {
            const cleanTitle =
                formData
                    .title
                    .trim();


            const cleanDescription =
                formData
                    .description
                    .trim();


            // =============================================
            // TITLE
            // =============================================

            if (
                !cleanTitle
            ) {
                return (
                    "Roadmap sarlavhasini kiriting."
                );
            }


            if (
                cleanTitle.length <
                2
            ) {
                return (
                    "Roadmap sarlavhasi kamida 2 ta belgidan iborat bo‘lishi kerak."
                );
            }


            if (
                cleanTitle.length >
                255
            ) {
                return (
                    "Roadmap sarlavhasi 255 ta belgidan oshmasligi kerak."
                );
            }


            // =============================================
            // TYPE
            // =============================================

            if (
                ![
                    "learning",
                    "experience",
                ].includes(
                    formData.type
                )
            ) {
                return (
                    "Roadmap turini to‘g‘ri tanlang."
                );
            }


            // =============================================
            // START DATE
            // =============================================

            if (
                !formData.started_at
            ) {
                return (
                    "Roadmap boshlanish sanasini kiriting."
                );
            }


            // =============================================
            // END DATE
            // =============================================

            if (
                formData.finished_at
                &&
                formData.started_at
                &&
                formData.finished_at <
                formData.started_at
            ) {
                return (
                    "Tugash sanasi boshlanish sanasidan oldin bo‘lishi mumkin emas."
                );
            }


            // =============================================
            // DESCRIPTION
            // =============================================

            if (
                cleanDescription.length >
                3000
            ) {
                return (
                    "Roadmap tavsifi juda uzun. Uni biroz qisqartiring."
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
                busy
            ) {
                return;
            }


            setError(
                ""
            );


            // =============================================
            // VALIDATE
            // =============================================

            const validationError =
                validateForm();


            if (
                validationError
            ) {
                setError(
                    validationError
                );


                siteToast.warning(
                    validationError,
                    {
                        title:
                            "Roadmap ma’lumotlarini tekshiring",

                        duration:
                            4000,
                    }
                );


                return;
            }


            // =============================================
            // PAYLOAD
            //
            // FAQAT BACKEND MODELDA BOR FIELDLAR
            // =============================================

            const payload = {
                title:
                    formData
                        .title
                        .trim(),

                type:
                    formData.type,

                description:
                    formData
                        .description
                        .trim(),

                started_at:
                    formData.started_at,

                finished_at:
                    formData.finished_at
                    ||
                    null,
            };


            // =============================================
            // LOADING TOAST
            // =============================================

            const toastId =
                siteToast.loading(
                    isEditMode

                        ? "Roadmapdagi o‘zgarishlar saqlanmoqda..."

                        : "Yangi roadmap yaratilmoqda...",
                    {
                        title:
                            isEditMode

                                ? "Roadmap yangilanmoqda"

                                : "Roadmap yaratilmoqda",
                    }
                );


            setIsProcessing(
                true
            );


            try {
                const result =
                    await onSubmit?.(
                        payload
                    );


                // =========================================
                // PARENT FALSE QAYTARSA
                // =========================================

                if (
                    result === false
                ) {
                    siteToast.dismiss(
                        toastId
                    );

                    return;
                }


                // =========================================
                // SUCCESS
                // =========================================

                siteToast.success(
                    isEditMode

                        ? "Roadmap ma’lumotlari muvaffaqiyatli yangilandi."

                        : "Yangi roadmap profilingizga muvaffaqiyatli qo‘shildi.",
                    {
                        id:
                            toastId,

                        title:
                            isEditMode

                                ? "Roadmap yangilandi"

                                : "Roadmap yaratildi",

                        duration:
                            3800,
                    }
                );


                // =========================================
                // RESET CREATE
                // =========================================

                if (
                    !isEditMode
                ) {
                    setFormData({
                        ...EMPTY_FORM,
                    });
                }


                // =========================================
                // CLOSE
                // =========================================

                onClose?.();

            } catch (
                requestError
            ) {
                const message =
                    getErrorMessage(
                        requestError,

                        isEditMode

                            ? "Roadmapni yangilashda xato yuz berdi."

                            : "Roadmap yaratishda xato yuz berdi."
                    );


                console.error(
                    "Roadmap submit xato:",
                    requestError
                );


                setError(
                    message
                );


                siteToast.error(
                    message,
                    {
                        id:
                            toastId,

                        title:
                            isEditMode

                                ? "Roadmap yangilanmadi"

                                : "Roadmap yaratilmadi",

                        duration:
                            5000,
                    }
                );

            } finally {
                setIsProcessing(
                    false
                );
            }
        };


    // =====================================================
    // CLOSED
    // =====================================================

    if (
        !isOpen
    ) {
        return null;
    }


    // =====================================================
    // TEXT
    // =====================================================

    const modalTitle =
        isEditMode
            ? "Roadmapni tahrirlash"
            : "Yangi roadmap yaratish";


    const modalDescription =
        isEditMode
            ? "Roadmap bosqichingiz haqidagi ma’lumotlarni yangilang."
            : "O‘rganish yoki professional tajribangizni timeline ko‘rinishida saqlang.";


    const submitText =
        isEditMode
            ? "O‘zgarishlarni saqlash"
            : "Roadmap yaratish";


    const SubmitIcon =
        isEditMode
            ? Save
            : Rocket;


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

                sm:px-5
            "
        >

            {/* =================================================
                BACKGROUND GLOW
            ================================================== */}

            <div
                className="
                    pointer-events-none
                    fixed
                    left-1/2
                    top-[20%]
                    h-[430px]
                    w-[430px]
                    -translate-x-1/2
                    rounded-full
                    bg-indigo-600/[0.10]
                    blur-[130px]
                "
            />


            {/* =================================================
                MODAL
            ================================================== */}

            <div
                onMouseDown={(
                    event
                ) =>
                    event
                        .stopPropagation()
                }
                className="
                    relative
                    my-auto
                    w-full
                    max-w-5xl
                    overflow-hidden
                    rounded-[30px]
                    border
                    border-white/[0.08]
                    bg-[#0a0e16]/95
                    shadow-[0_40px_120px_rgba(0,0,0,0.70)]
                    backdrop-blur-2xl
                "
            >

                {/* =================================================
                    TOP GLOW
                ================================================== */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        left-1/2
                        top-0
                        h-32
                        w-[65%]
                        -translate-x-1/2
                        -translate-y-1/2
                        rounded-full
                        bg-indigo-500/[0.14]
                        blur-[70px]
                    "
                />


                {/* =================================================
                    HEADER
                ================================================== */}

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

                        {/* ICON */}

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
                                border-indigo-400/20
                                bg-indigo-500/[0.08]
                                text-indigo-300
                                shadow-lg
                                shadow-indigo-500/[0.08]
                            "
                        >
                            {isEditMode ? (
                                <Pencil
                                    size={21}
                                />
                            ) : (
                                <Map
                                    size={22}
                                />
                            )}
                        </div>


                        {/* TEXT */}

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
                                    text-[9px]
                                    font-black
                                    uppercase
                                    tracking-[0.18em]
                                    text-indigo-400
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

                                F.Society Roadmap
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
                                    text-gray-600

                                    sm:text-sm
                                "
                            >
                                {modalDescription}
                            </p>

                        </div>

                    </div>


                    {/* CLOSE */}

                    <button
                        type="button"
                        onClick={
                            handleClose
                        }
                        disabled={
                            busy
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
                            bg-white/[0.025]
                            text-gray-500
                            transition-all

                            hover:border-red-400/20
                            hover:bg-red-500/[0.07]
                            hover:text-red-300

                            active:scale-[0.94]

                            disabled:cursor-not-allowed
                            disabled:opacity-40
                        "
                    >
                        <X
                            size={18}
                        />
                    </button>

                </header>


                {/* =================================================
                    FORM
                ================================================== */}

                <form
                    onSubmit={
                        handleSubmit
                    }
                >

                    <div
                        className="
                            grid

                            lg:grid-cols-[minmax(0,1fr)_310px]
                        "
                    >

                        {/* =================================================
                            LEFT
                        ================================================== */}

                        <div
                            className="
                                space-y-7
                                p-5

                                sm:p-7

                                lg:border-r
                                lg:border-white/[0.06]
                            "
                        >

                            {/* =================================================
                                TYPE
                            ================================================== */}

                            <section>

                                <div
                                    className="
                                        mb-3
                                    "
                                >
                                    <p
                                        className="
                                            text-xs
                                            font-black
                                            uppercase
                                            tracking-[0.14em]
                                            text-gray-400
                                        "
                                    >
                                        Roadmap turi
                                    </p>


                                    <p
                                        className="
                                            mt-1
                                            text-[10px]
                                            font-medium
                                            text-gray-600
                                        "
                                    >
                                        Roadmap nimani ifodalashini tanlang.
                                    </p>
                                </div>


                                <div
                                    className="
                                        grid
                                        gap-3

                                        sm:grid-cols-2
                                    "
                                >

                                    {ROADMAP_TYPES.map(
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
                                                formData.type ===
                                                value;


                                            return (
                                                <button
                                                    key={
                                                        value
                                                    }
                                                    type="button"
                                                    disabled={
                                                        busy
                                                    }
                                                    onClick={() =>
                                                        handleTypeChange(
                                                            value
                                                        )
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

                                                        active:scale-[0.98]

                                                        disabled:cursor-not-allowed
                                                        disabled:opacity-50

                                                        ${
                                                            active
                                                                ? activeClass
                                                                : `
                                                                    border-white/[0.07]
                                                                    bg-white/[0.018]
                                                                    text-gray-400

                                                                    hover:border-white/[0.12]
                                                                    hover:bg-white/[0.035]
                                                                `
                                                        }
                                                    `}
                                                >

                                                    <div
                                                        className={`
                                                            pointer-events-none
                                                            absolute
                                                            -right-10
                                                            -top-10
                                                            h-24
                                                            w-24
                                                            rounded-full
                                                            blur-[35px]
                                                            transition-opacity

                                                            ${
                                                                active
                                                                    ? "opacity-100"
                                                                    : "opacity-0 group-hover:opacity-50"
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
                                                                h-11
                                                                w-11
                                                                shrink-0
                                                                items-center
                                                                justify-center
                                                                rounded-xl
                                                                border

                                                                ${iconClass}
                                                            `}
                                                        >
                                                            <Icon
                                                                size={19}
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
                                                                    <span
                                                                        className="
                                                                            grid
                                                                            h-5
                                                                            w-5
                                                                            place-items-center
                                                                            rounded-full
                                                                            bg-white/[0.08]
                                                                        "
                                                                    >
                                                                        <Check
                                                                            size={11}
                                                                        />
                                                                    </span>
                                                                )}

                                                            </div>


                                                            <p
                                                                className="
                                                                    mt-1.5
                                                                    text-[10px]
                                                                    font-medium
                                                                    leading-5
                                                                    text-gray-600
                                                                "
                                                            >
                                                                {
                                                                    description
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>

                                                </button>
                                            );
                                        }
                                    )}

                                </div>

                            </section>


                            {/* =================================================
                                TITLE
                            ================================================== */}

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
                                        htmlFor="roadmap-title"
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            text-xs
                                            font-black
                                            uppercase
                                            tracking-[0.14em]
                                            text-gray-400
                                        "
                                    >
                                        <Target
                                            size={14}
                                            className="
                                                text-indigo-300
                                            "
                                        />

                                        Sarlavha
                                    </label>


                                    <span
                                        className={`
                                            text-[9px]
                                            font-black

                                            ${
                                                formData
                                                    .title
                                                    .length >
                                                230

                                                    ? "text-amber-300"

                                                    : "text-gray-700"
                                            }
                                        `}
                                    >
                                        {
                                            formData
                                                .title
                                                .length
                                        }
                                        /255
                                    </span>

                                </div>


                                <input
                                    id="roadmap-title"
                                    type="text"
                                    name="title"
                                    value={
                                        formData.title
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    maxLength={255}
                                    disabled={
                                        busy
                                    }
                                    autoComplete="off"
                                    placeholder={
                                        formData.type ===
                                        "experience"

                                            ? "Masalan: Backend Developer @ Company"

                                            : "Masalan: Django REST Framework"
                                    }
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

                                        focus:border-indigo-400/35
                                        focus:bg-indigo-500/[0.02]
                                        focus:ring-4
                                        focus:ring-indigo-500/[0.05]

                                        disabled:cursor-not-allowed
                                        disabled:opacity-50

                                        sm:text-base
                                    "
                                />

                            </section>


                            {/* =================================================
                                DESCRIPTION
                            ================================================== */}

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
                                        htmlFor="roadmap-description"
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            text-xs
                                            font-black
                                            uppercase
                                            tracking-[0.14em]
                                            text-gray-400
                                        "
                                    >
                                        <BookOpen
                                            size={14}
                                            className="
                                                text-purple-300
                                            "
                                        />

                                        Tavsif
                                    </label>


                                    <span
                                        className="
                                            text-[9px]
                                            font-black
                                            text-gray-700
                                        "
                                    >
                                        Ixtiyoriy
                                    </span>

                                </div>


                                <textarea
                                    id="roadmap-description"
                                    name="description"
                                    value={
                                        formData.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    rows={5}
                                    disabled={
                                        busy
                                    }
                                    placeholder={
                                        formData.type ===
                                        "experience"

                                            ? "Bu tajribada nimalar qildingiz, qanday texnologiyalar bilan ishladingiz..."

                                            : "Nimani o‘rgandingiz, maqsadingiz nima edi, qanday natijaga erishdingiz..."
                                    }
                                    className="
                                        min-h-[135px]
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

                                        focus:border-purple-400/30
                                        focus:bg-purple-500/[0.02]
                                        focus:ring-4
                                        focus:ring-purple-500/[0.05]

                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                />

                            </section>


                            {/* =================================================
                                DATE RANGE
                            ================================================== */}

                            <section>

                                <div
                                    className="
                                        mb-3
                                    "
                                >
                                    <p
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            text-xs
                                            font-black
                                            uppercase
                                            tracking-[0.14em]
                                            text-gray-400
                                        "
                                    >
                                        <CalendarDays
                                            size={14}
                                            className="
                                                text-cyan-300
                                            "
                                        />

                                        Vaqt oralig‘i
                                    </p>


                                    <p
                                        className="
                                            mt-1
                                            text-[10px]
                                            font-medium
                                            text-gray-600
                                        "
                                    >
                                        Tugash sanasi majburiy emas.
                                    </p>

                                </div>


                                <div
                                    className="
                                        relative
                                        grid
                                        gap-4

                                        sm:grid-cols-2
                                    "
                                >

                                    {/* START */}

                                    <div>
                                        <label
                                            htmlFor="roadmap-started-at"
                                            className="
                                                mb-2
                                                block
                                                text-[10px]
                                                font-black
                                                text-gray-500
                                            "
                                        >
                                            Boshlanish sanasi
                                            <span
                                                className="
                                                    ml-1
                                                    text-red-400
                                                "
                                            >
                                                *
                                            </span>
                                        </label>


                                        <div
                                            className="
                                                relative
                                            "
                                        >
                                            <CalendarDays
                                                size={15}
                                                className="
                                                    pointer-events-none
                                                    absolute
                                                    left-4
                                                    top-1/2
                                                    -translate-y-1/2
                                                    text-indigo-400
                                                "
                                            />


                                            <input
                                                id="roadmap-started-at"
                                                type="date"
                                                name="started_at"
                                                value={
                                                    formData.started_at
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                disabled={
                                                    busy
                                                }
                                                className="
                                                    w-full
                                                    rounded-2xl
                                                    border
                                                    border-white/[0.07]
                                                    bg-[#0c1119]
                                                    py-3.5
                                                    pl-11
                                                    pr-4
                                                    text-sm
                                                    font-semibold
                                                    text-gray-300
                                                    outline-none
                                                    transition-all

                                                    [color-scheme:dark]

                                                    focus:border-indigo-400/30
                                                    focus:ring-4
                                                    focus:ring-indigo-500/[0.05]

                                                    disabled:cursor-not-allowed
                                                    disabled:opacity-50
                                                "
                                            />
                                        </div>
                                    </div>


                                    {/* FINISH */}

                                    <div>
                                        <label
                                            htmlFor="roadmap-finished-at"
                                            className="
                                                mb-2
                                                block
                                                text-[10px]
                                                font-black
                                                text-gray-500
                                            "
                                        >
                                            Tugash sanasi
                                        </label>


                                        <div
                                            className="
                                                relative
                                            "
                                        >
                                            <Flag
                                                size={15}
                                                className="
                                                    pointer-events-none
                                                    absolute
                                                    left-4
                                                    top-1/2
                                                    -translate-y-1/2
                                                    text-emerald-400
                                                "
                                            />


                                            <input
                                                id="roadmap-finished-at"
                                                type="date"
                                                name="finished_at"
                                                value={
                                                    formData.finished_at
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                min={
                                                    formData.started_at
                                                    ||
                                                    undefined
                                                }
                                                disabled={
                                                    busy
                                                }
                                                className="
                                                    w-full
                                                    rounded-2xl
                                                    border
                                                    border-white/[0.07]
                                                    bg-[#0c1119]
                                                    py-3.5
                                                    pl-11
                                                    pr-4
                                                    text-sm
                                                    font-semibold
                                                    text-gray-300
                                                    outline-none
                                                    transition-all

                                                    [color-scheme:dark]

                                                    focus:border-emerald-400/30
                                                    focus:ring-4
                                                    focus:ring-emerald-500/[0.05]

                                                    disabled:cursor-not-allowed
                                                    disabled:opacity-50
                                                "
                                            />
                                        </div>
                                    </div>

                                </div>

                            </section>


                            {/* =================================================
                                ERROR
                            ================================================== */}

                            {error && (
                                <div
                                    className="
                                        flex
                                        items-start
                                        gap-3
                                        rounded-2xl
                                        border
                                        border-red-400/20
                                        bg-red-500/[0.06]
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
                                            bg-red-500/[0.09]
                                            text-red-300
                                        "
                                    >
                                        <AlertTriangle
                                            size={16}
                                        />
                                    </div>


                                    <div>
                                        <p
                                            className="
                                                text-[10px]
                                                font-black
                                                uppercase
                                                tracking-[0.12em]
                                                text-red-300
                                            "
                                        >
                                            Xatolik
                                        </p>


                                        <p
                                            className="
                                                mt-1
                                                text-xs
                                                font-medium
                                                leading-5
                                                text-red-200/80
                                            "
                                        >
                                            {error}
                                        </p>
                                    </div>

                                </div>
                            )}

                        </div>


                        {/* =================================================
                            RIGHT
                        ================================================== */}

                        <aside
                            className="
                                hidden
                                bg-black/[0.08]
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

                                {/* =============================================
                                    PREVIEW TITLE
                                ============================================== */}

                                <div
                                    className="
                                        mb-5
                                    "
                                >
                                    <p
                                        className="
                                            text-[9px]
                                            font-black
                                            uppercase
                                            tracking-[0.18em]
                                            text-gray-500
                                        "
                                    >
                                        Roadmap preview
                                    </p>


                                    <p
                                        className="
                                            mt-1
                                            text-[10px]
                                            font-medium
                                            text-gray-700
                                        "
                                    >
                                        Profil timeline’da taxminan shunday ko‘rinadi.
                                    </p>
                                </div>


                                {/* =============================================
                                    TYPE
                                ============================================== */}

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                    "
                                >

                                    <div
                                        className={`
                                            flex
                                            h-11
                                            w-11
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-xl
                                            border

                                            ${selectedType.iconClass}
                                        `}
                                    >
                                        <SelectedTypeIcon
                                            size={19}
                                        />
                                    </div>


                                    <div>
                                        <p
                                            className="
                                                text-[9px]
                                                font-black
                                                uppercase
                                                tracking-[0.13em]
                                                text-gray-600
                                            "
                                        >
                                            Turi
                                        </p>


                                        <p
                                            className="
                                                mt-0.5
                                                text-sm
                                                font-black
                                                text-white
                                            "
                                        >
                                            {
                                                selectedType.label
                                            }
                                        </p>
                                    </div>

                                </div>


                                {/* =============================================
                                    TIMELINE
                                ============================================== */}

                                <div
                                    className="
                                        relative
                                        mt-7
                                        pl-5
                                    "
                                >

                                    {/* LINE */}

                                    <div
                                        className="
                                            absolute
                                            bottom-3
                                            left-[7px]
                                            top-3
                                            w-px
                                            bg-gradient-to-b
                                            from-indigo-400/50
                                            via-indigo-400/20
                                            to-emerald-400/40
                                        "
                                    />


                                    {/* START */}

                                    <div
                                        className="
                                            relative
                                            pb-7
                                        "
                                    >

                                        <span
                                            className="
                                                absolute
                                                -left-[18px]
                                                top-1
                                                h-3
                                                w-3
                                                rounded-full
                                                border-2
                                                border-[#0a0e16]
                                                bg-indigo-400
                                                shadow-[0_0_10px_rgba(129,140,248,0.7)]
                                            "
                                        />


                                        <p
                                            className="
                                                text-[8px]
                                                font-black
                                                uppercase
                                                tracking-[0.15em]
                                                text-indigo-400
                                            "
                                        >
                                            Boshlanish
                                        </p>


                                        <p
                                            className="
                                                mt-1
                                                text-xs
                                                font-black
                                                text-gray-300
                                            "
                                        >
                                            {
                                                formatDisplayDate(
                                                    formData.started_at
                                                )
                                            }
                                        </p>

                                    </div>


                                    {/* TARGET */}

                                    <div
                                        className="
                                            relative
                                            pb-7
                                        "
                                    >

                                        <span
                                            className="
                                                absolute
                                                -left-[18px]
                                                top-1
                                                h-3
                                                w-3
                                                rounded-full
                                                border
                                                border-indigo-400/30
                                                bg-[#0a0e16]
                                            "
                                        />


                                        <p
                                            className="
                                                text-[8px]
                                                font-black
                                                uppercase
                                                tracking-[0.15em]
                                                text-gray-600
                                            "
                                        >
                                            Maqsad
                                        </p>


                                        <p
                                            className={`
                                                mt-1
                                                break-words
                                                text-sm
                                                font-black
                                                leading-5

                                                ${
                                                    formData
                                                        .title
                                                        .trim()

                                                        ? "text-white"

                                                        : "text-gray-700"
                                                }
                                            `}
                                        >
                                            {
                                                formData
                                                    .title
                                                    .trim()

                                                ||
                                                "Roadmap sarlavhasi"
                                            }
                                        </p>

                                    </div>


                                    {/* FINISH */}

                                    <div
                                        className="
                                            relative
                                        "
                                    >

                                        <span
                                            className={`
                                                absolute
                                                -left-[18px]
                                                top-1
                                                h-3
                                                w-3
                                                rounded-full
                                                border-2
                                                border-[#0a0e16]

                                                ${
                                                    formData.finished_at

                                                        ? `
                                                            bg-emerald-400
                                                            shadow-[0_0_10px_rgba(52,211,153,0.7)]
                                                        `

                                                        : `
                                                            bg-gray-700
                                                        `
                                                }
                                            `}
                                        />


                                        <p
                                            className="
                                                text-[8px]
                                                font-black
                                                uppercase
                                                tracking-[0.15em]
                                                text-gray-600
                                            "
                                        >
                                            Tugash
                                        </p>


                                        <p
                                            className="
                                                mt-1
                                                text-xs
                                                font-black
                                                text-gray-300
                                            "
                                        >
                                            {
                                                formData.finished_at

                                                    ? formatDisplayDate(
                                                        formData.finished_at
                                                    )

                                                    : "Davom etmoqda"
                                            }
                                        </p>

                                    </div>

                                </div>


                                {/* =============================================
                                    STATUS
                                ============================================== */}

                                <div
                                    className="
                                        mt-7
                                        border-t
                                        border-white/[0.06]
                                        pt-5
                                    "
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
                                                mt-0.5
                                                flex
                                                h-8
                                                w-8
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-xl
                                                border

                                                ${roadmapStatus.className}
                                            `}
                                        >
                                            <CircleDot
                                                size={14}
                                            />
                                        </div>


                                        <div>
                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                "
                                            >
                                                <span
                                                    className={`
                                                        h-1.5
                                                        w-1.5
                                                        rounded-full

                                                        ${roadmapStatus.dotClass}
                                                    `}
                                                />


                                                <p
                                                    className="
                                                        text-xs
                                                        font-black
                                                        text-gray-300
                                                    "
                                                >
                                                    {
                                                        roadmapStatus.label
                                                    }
                                                </p>
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
                                                {
                                                    roadmapStatus.description
                                                }
                                            </p>
                                        </div>

                                    </div>

                                </div>


                                {/* =============================================
                                    DESCRIPTION PREVIEW
                                ============================================== */}

                                {formData
                                    .description
                                    .trim() && (
                                    <div
                                        className="
                                            mt-5
                                            border-l-2
                                            border-purple-400/25
                                            pl-3
                                        "
                                    >
                                        <p
                                            className="
                                                line-clamp-5
                                                whitespace-pre-wrap
                                                break-words
                                                text-[11px]
                                                font-medium
                                                leading-5
                                                text-gray-600
                                            "
                                        >
                                            {
                                                formData.description
                                            }
                                        </p>
                                    </div>
                                )}


                                {/* =============================================
                                    TIP
                                ============================================== */}

                                <div
                                    className="
                                        mt-6
                                        flex
                                        items-start
                                        gap-2
                                        border-t
                                        border-white/[0.06]
                                        pt-5
                                    "
                                >
                                    <Sparkles
                                        size={14}
                                        className="
                                            mt-0.5
                                            shrink-0
                                            text-indigo-400
                                        "
                                    />


                                    <p
                                        className="
                                            text-[10px]
                                            font-medium
                                            leading-5
                                            text-gray-700
                                        "
                                    >
                                        Roadmap profilingizdagi rivojlanish tarixini tartibli ko‘rsatishga yordam beradi.
                                    </p>
                                </div>

                            </div>

                        </aside>

                    </div>


                    {/* =================================================
                        FOOTER
                    ================================================== */}

                    <footer
                        className="
                            flex
                            flex-col-reverse
                            gap-3
                            border-t
                            border-white/[0.06]
                            bg-black/[0.10]
                            px-5
                            py-4

                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                            sm:px-7
                        "
                    >

                        {/* INFO */}

                        <div
                            className="
                                hidden
                                items-center
                                gap-2
                                text-[10px]
                                font-medium
                                text-gray-700

                                sm:flex
                            "
                        >
                            <Clock3
                                size={13}
                            />

                            ESC tugmasi orqali modalni yopishingiz mumkin.
                        </div>


                        {/* ACTIONS */}

                        <div
                            className="
                                flex
                                flex-col
                                gap-2

                                sm:flex-row
                            "
                        >

                            {/* CANCEL */}

                            <button
                                type="button"
                                onClick={
                                    handleClose
                                }
                                disabled={
                                    busy
                                }
                                className="
                                    inline-flex
                                    min-h-[43px]
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
                                    transition-all

                                    hover:border-white/[0.12]
                                    hover:bg-white/[0.05]
                                    hover:text-white

                                    active:scale-[0.97]

                                    disabled:cursor-not-allowed
                                    disabled:opacity-40
                                "
                            >
                                <X
                                    size={15}
                                />

                                Bekor qilish
                            </button>


                            {/* SUBMIT */}

                            <button
                                type="submit"
                                disabled={
                                    busy
                                }
                                className="
                                    group
                                    relative
                                    inline-flex
                                    min-h-[43px]
                                    min-w-[190px]
                                    items-center
                                    justify-center
                                    gap-2
                                    overflow-hidden
                                    rounded-xl
                                    border
                                    border-indigo-400/30
                                    bg-gradient-to-r
                                    from-indigo-600
                                    to-violet-600
                                    px-5
                                    py-2.5
                                    text-xs
                                    font-black
                                    text-white
                                    shadow-lg
                                    shadow-indigo-600/20
                                    transition-all
                                    duration-200

                                    hover:-translate-y-0.5
                                    hover:shadow-indigo-500/30

                                    active:translate-y-0
                                    active:scale-[0.98]

                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                    disabled:hover:translate-y-0
                                "
                            >

                                {/* SHINE */}

                                <span
                                    className="
                                        pointer-events-none
                                        absolute
                                        inset-y-0
                                        -left-16
                                        w-12
                                        rotate-12
                                        bg-white/[0.12]
                                        blur-md
                                        transition-all
                                        duration-700

                                        group-hover:left-[120%]
                                    "
                                />


                                <span
                                    className="
                                        relative
                                        z-10
                                        inline-flex
                                        items-center
                                        gap-2
                                    "
                                >

                                    {busy ? (
                                        <>
                                            <Loader2
                                                size={16}
                                                className="
                                                    animate-spin
                                                "
                                            />

                                            {
                                                isEditMode

                                                    ? "Saqlanmoqda..."

                                                    : "Yaratilmoqda..."
                                            }
                                        </>
                                    ) : (
                                        <>
                                            <SubmitIcon
                                                size={16}
                                            />

                                            {
                                                submitText
                                            }
                                        </>
                                    )}

                                </span>

                            </button>

                        </div>

                    </footer>

                </form>

            </div>

        </div>
    );
};


export default RoadmapCreateModal;