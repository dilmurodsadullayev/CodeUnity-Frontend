// src/components/projects/CreateProjectModal.jsx

import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    AlertTriangle,
    Braces,
    Check,
    Code2,
    ExternalLink,
    FileImage,
    ImagePlus,
    Images,
    Layers3,
    Loader2,
    Pencil,
    Plus,
    Rocket,
    Save,
    Sparkles,
    Trash2,
    Type,
    UploadCloud,
    X,
} from "lucide-react";

import {
    BACKEND_URL,
} from "../../services/config";

import {
    siteToast,
} from "../ui/AuthToast";


// =========================================================
// DATA
//
// Hozircha loyihangizdagi mavjud static ro‘yxat.
// Keyinchalik API orqali Language / Technology list olamiz.
// =========================================================

const LANGUAGES = [
    {
        id: 1,
        name: "Python",
    },
    {
        id: 2,
        name: "JS",
    },
    {
        id: 3,
        name: "TypeScript",
    },
    {
        id: 4,
        name: "Java",
    },
    {
        id: 5,
        name: "C++",
    },
    {
        id: 6,
        name: "C#",
    },
    {
        id: 7,
        name: "PHP",
    },
    {
        id: 8,
        name: "GO",
    },
    {
        id: 9,
        name: "Swift",
    },
    {
        id: 10,
        name: "Ruby",
    },
    {
        id: 11,
        name: "Dart",
    },
];


const TECHNOLOGIES = [
    {
        id: 1,
        name: "Django",
    },
    {
        id: 2,
        name: "React",
    },
    {
        id: 3,
        name: "Vue.js",
    },
    {
        id: 4,
        name: "Angular",
    },
    {
        id: 5,
        name: "Next.js",
    },
    {
        id: 6,
        name: "Node.js",
    },
    {
        id: 7,
        name: "Laravel",
    },
    {
        id: 8,
        name: "Spring Boot",
    },
    {
        id: 9,
        name: "Flutter",
    },
    {
        id: 10,
        name: "FastAPI",
    },
    {
        id: 11,
        name: "DRF",
    },
];


// =========================================================
// EMPTY FORM
// =========================================================

const EMPTY_FORM = {
    name: "",
    main_features: "",
    description: "",
    website_url: "",
    language: "",
    technology: "",
};


// =========================================================
// ABSOLUTE MEDIA URL
// =========================================================

const getMediaUrl = (
    value
) => {
    if (
        !value
    ) {
        return "";
    }


    const image =
        String(
            value
        ).trim();


    if (
        /^https?:\/\//i.test(
            image
        )
        ||
        image.startsWith(
            "blob:"
        )
        ||
        image.startsWith(
            "data:"
        )
    ) {
        return image;
    }


    const base =
        String(
            BACKEND_URL
            ||
            ""
        ).replace(
            /\/+$/,
            ""
        );


    return (
        `${base}${
            image.startsWith("/")
                ? image
                : `/${image}`
        }`
    );
};


// =========================================================
// EDIT IMAGES
// =========================================================

const formatImagesForEdit = (
    projectImages
) => {
    if (
        !Array.isArray(
            projectImages
        )
        ||
        projectImages.length ===
        0
    ) {
        return [
            {
                id:
                    `new-${Date.now()}`,

                title:
                    "",

                file:
                    null,

                isNew:
                    true,

                url:
                    "",
            },
        ];
    }


    return projectImages.map(
        (
            image
        ) => ({
            id:
                image.id,

            title:
                image.title
                ||
                "",

            file:
                null,

            isNew:
                false,

            url:
                getMediaUrl(
                    image.image
                ),
        })
    );
};


// =========================================================
// ERROR PARSER
// =========================================================

const getErrorMessage = (
    error,
    fallback = "Loyihani saqlashda xatolik yuz berdi."
) => {
    const data =
        error?.serverData
        ||
        error?.response?.data;


    if (
        typeof data ===
        "string"
    ) {
        return data;
    }


    if (
        data?.detail
    ) {
        return String(
            data.detail
        );
    }


    if (
        data?.name
    ) {
        return (
            Array.isArray(
                data.name
            )
                ? data.name.join(", ")
                : String(
                    data.name
                )
        );
    }


    if (
        data?.images
    ) {
        return (
            "Rasmlar: "
            +
            (
                typeof data.images ===
                "string"

                    ? data.images

                    : JSON.stringify(
                        data.images
                    )
            )
        );
    }


    if (
        data
        &&
        typeof data ===
        "object"
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


            const firstValue =
                Object.values(
                    parsed
                )[0];


            if (
                Array.isArray(
                    firstValue
                )
            ) {
                return String(
                    firstValue[0]
                    ||
                    fallback
                );
            }


            if (
                typeof firstValue ===
                "string"
            ) {
                return firstValue;
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
// FIELD WRAPPER
// =========================================================

const Field = ({
    label,
    description,
    required = false,
    children,
}) => {
    return (
        <div>

            <div
                className="
                    mb-2
                    flex
                    items-center
                    justify-between
                    gap-3
                "
            >

                <label
                    className="
                        text-xs
                        font-black
                        text-gray-300
                    "
                >
                    {label}

                    {required && (
                        <span
                            className="
                                ml-1
                                text-red-400
                            "
                        >
                            *
                        </span>
                    )}
                </label>

            </div>


            {children}


            {description && (
                <p
                    className="
                        mt-2
                        text-[10px]
                        font-medium
                        leading-5
                        text-gray-600
                    "
                >
                    {description}
                </p>
            )}

        </div>
    );
};


// =========================================================
// PROJECT FORM MODAL
// =========================================================

const ProjectFormModal = ({
    isOpen,
    onClose,
    onSubmit,
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
    // STATE
    // =====================================================

    const [
        formData,
        setFormData,
    ] = useState({
        ...EMPTY_FORM,
    });


    const [
        images,
        setImages,
    ] = useState([]);


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
    // TITLE
    // =====================================================

    const modalTitle =
        isEditMode
            ? "Loyihani tahrirlash"
            : "Yangi loyiha";


    const modalDescription =
        isEditMode
            ? "Loyiha ma’lumotlari, texnologiyalari va rasmlarini yangilang."
            : "Yangi loyihangizni F.Society hamjamiyatiga taqdim eting.";


    // =====================================================
    // INITIAL DATA
    //
    // MUHIM FIX:
    // ProjectDetailSerializer GET'da language va technology
    // write_only.
    //
    // Shuning uchun:
    // language_data.id
    // technology_data.id
    // orqali ham tekshiramiz.
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
                const languageId =
                    initialData
                        ?.language_data
                        ?.id
                    ??
                    initialData
                        ?.language
                        ?.id
                    ??
                    (
                        typeof initialData
                            ?.language ===
                        "number"
                            ||
                        typeof initialData
                            ?.language ===
                        "string"

                            ? initialData.language
                            : ""
                    );


                const technologyId =
                    initialData
                        ?.technology_data
                        ?.id
                    ??
                    initialData
                        ?.technology
                        ?.id
                    ??
                    (
                        typeof initialData
                            ?.technology ===
                        "number"
                            ||
                        typeof initialData
                            ?.technology ===
                        "string"

                            ? initialData.technology
                            : ""
                    );


                setFormData({
                    name:
                        initialData
                            ?.name
                        ||
                        "",

                    main_features:
                        initialData
                            ?.main_features
                        ||
                        "",

                    description:
                        initialData
                            ?.description
                        ||
                        "",

                    website_url:
                        initialData
                            ?.website_url
                        ||
                        "",

                    language:
                        languageId
                            ? String(
                                languageId
                            )
                            : "",

                    technology:
                        technologyId
                            ? String(
                                technologyId
                            )
                            : "",
                });


                setImages(
                    formatImagesForEdit(
                        initialData
                            ?.images
                    )
                );

            } else {
                setFormData({
                    ...EMPTY_FORM,
                });


                setImages([
                    {
                        id:
                            `new-${Date.now()}`,

                        title:
                            "",

                        file:
                            null,

                        isNew:
                            true,

                        url:
                            "",
                    },
                ]);
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
    // COUNTERS
    // =====================================================

    const nameLength =
        formData
            .name
            .length;


    const featuresLength =
        formData
            .main_features
            .length;


    // =====================================================
    // SELECTED LABELS
    // =====================================================

    const selectedLanguage =
        useMemo(
            () => {
                return LANGUAGES.find(
                    (
                        language
                    ) =>
                        String(
                            language.id
                        )
                        ===
                        String(
                            formData
                                .language
                        )
                );
            },
            [
                formData.language,
            ]
        );


    const selectedTechnology =
        useMemo(
            () => {
                return TECHNOLOGIES.find(
                    (
                        technology
                    ) =>
                        String(
                            technology.id
                        )
                        ===
                        String(
                            formData
                                .technology
                        )
                );
            },
            [
                formData.technology,
            ]
        );


    // =====================================================
    // CHANGE
    // =====================================================

    const handleInputChange =
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
    // IMAGE CHANGE
    // =====================================================

    const handleImageChange =
        (
            id,
            field,
            value
        ) => {
            setImages(
                (
                    current
                ) =>
                    current.map(
                        (
                            image
                        ) =>
                            image.id ===
                            id

                                ? {
                                    ...image,

                                    [field]:
                                        value,
                                }

                                : image
                    )
            );
        };


    // =====================================================
    // ADD IMAGE
    // =====================================================

    const handleAddImage =
        () => {
            setImages(
                (
                    current
                ) => [
                    ...current,

                    {
                        id:
                            `new-${Date.now()}-${current.length}`,

                        title:
                            "",

                        file:
                            null,

                        isNew:
                            true,

                        url:
                            "",
                    },
                ]
            );
        };


    // =====================================================
    // REMOVE IMAGE
    // =====================================================

    const handleRemoveImage =
        (
            id
        ) => {
            if (
                images.length <=
                1
            ) {
                siteToast.warning(
                    "Loyihada kamida bitta rasm qolishi kerak.",
                    {
                        title:
                            "Rasmni o‘chirib bo‘lmaydi",
                    }
                );

                return;
            }


            const image =
                images.find(
                    (
                        item
                    ) =>
                        item.id ===
                        id
                );


            if (
                image?.file
                &&
                image?.url
                ?.startsWith(
                    "blob:"
                )
            ) {
                URL.revokeObjectURL(
                    image.url
                );
            }


            setImages(
                (
                    current
                ) =>
                    current.filter(
                        (
                            item
                        ) =>
                            item.id !==
                            id
                    )
            );
        };


    // =====================================================
    // FILE CHANGE
    // =====================================================

    const handleFileChange =
        (
            id,
            file
        ) => {
            if (
                !file
            ) {
                return;
            }


            if (
                !file.type
                    .startsWith(
                        "image/"
                    )
            ) {
                siteToast.warning(
                    "Faqat rasm faylini tanlash mumkin.",
                    {
                        title:
                            "Noto‘g‘ri fayl",
                    }
                );

                return;
            }


            setImages(
                (
                    current
                ) =>
                    current.map(
                        (
                            image
                        ) => {
                            if (
                                image.id !==
                                id
                            ) {
                                return image;
                            }


                            if (
                                image.file
                                &&
                                image.url
                                    ?.startsWith(
                                        "blob:"
                                    )
                            ) {
                                URL.revokeObjectURL(
                                    image.url
                                );
                            }


                            return {
                                ...image,

                                file,

                                url:
                                    URL.createObjectURL(
                                        file
                                    ),
                            };
                        }
                    )
            );
        };


    // =====================================================
    // VALIDATE
    // =====================================================

    const validateForm =
        () => {
            if (
                !formData
                    .name
                    .trim()
            ) {
                return (
                    "Loyiha nomini kiriting."
                );
            }


            if (
                formData
                    .name
                    .trim()
                    .length >
                30
            ) {
                return (
                    "Loyiha nomi 30 belgidan oshmasligi kerak."
                );
            }


            if (
                !formData
                    .main_features
                    .trim()
            ) {
                return (
                    "Loyihaning asosiy imkoniyatlarini kiriting."
                );
            }


            if (
                formData
                    .main_features
                    .trim()
                    .length >
                150
            ) {
                return (
                    "Asosiy imkoniyatlar 150 belgidan oshmasligi kerak."
                );
            }


            if (
                !formData
                    .description
                    .trim()
            ) {
                return (
                    "Loyiha tavsifini kiriting."
                );
            }


            if (
                !formData
                    .language
            ) {
                return (
                    "Dasturlash tilini tanlang."
                );
            }


            if (
                !formData
                    .technology
            ) {
                return (
                    "Texnologiyani tanlang."
                );
            }


            const hasImage =
                images.some(
                    (
                        image
                    ) =>
                        Boolean(
                            image.file
                            ||
                            image.url
                        )
                );


            if (
                !hasImage
            ) {
                return (
                    "Loyihaning kamida bitta rasmi bo‘lishi kerak."
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
                    validationError,
                    {
                        title:
                            "Formani tekshiring",
                    }
                );


                return;
            }


            setIsSubmitting(
                true
            );


            // =============================================
            // FORM DATA
            // =============================================

            const projectData =
                new FormData();


            projectData.append(
                "name",
                formData
                    .name
                    .trim()
            );


            projectData.append(
                "main_features",
                formData
                    .main_features
                    .trim()
            );


            projectData.append(
                "description",
                formData
                    .description
                    .trim()
            );


            projectData.append(
                "language",
                formData.language
            );


            projectData.append(
                "technology",
                formData.technology
            );


            if (
                formData
                    .website_url
                    .trim()
            ) {
                projectData.append(
                    "website_url",
                    formData
                        .website_url
                        .trim()
                );
            }


            // =============================================
            // IMAGES
            //
            // Backend kutayotgan format:
            //
            // images[0]image
            // images[0]title
            // images[0]id
            // =============================================

            images.forEach(
                (
                    image,
                    index
                ) => {
                    if (
                        image.file
                    ) {
                        projectData.append(
                            `images[${index}]image`,
                            image.file,
                            image.file.name
                        );


                        projectData.append(
                            `images[${index}]title`,
                            image.title
                                .trim()
                            ||
                            `Image ${index + 1}`
                        );


                        if (
                            isEditMode
                            &&
                            !image.isNew
                            &&
                            image.id
                        ) {
                            projectData.append(
                                `images[${index}]id`,
                                image.id
                            );
                        }


                        return;
                    }


                    if (
                        isEditMode
                        &&
                        !image.isNew
                        &&
                        image.id
                    ) {
                        projectData.append(
                            `images[${index}]id`,
                            image.id
                        );


                        projectData.append(
                            `images[${index}]title`,
                            image.title
                                .trim()
                            ||
                            `Image ${index + 1}`
                        );
                    }
                }
            );


            try {
                await onSubmit(
                    projectData,
                    initialData?.id
                );


                /*
                    Success/error toast ProjectDetail yoki
                    ProfileProjects parent componentida chiqadi.

                    Shuning uchun bu yerda yana success toast
                    chiqarib, ikki marta toast bermaymiz.
                */

                onClose?.();

            } catch (
                requestError
            ) {
                const message =
                    getErrorMessage(
                        requestError
                    );


                setError(
                    message
                );


                // Parent error toast ishlatsa duplicate bo‘lmasligi uchun
                // bu yerda faqat inline error saqlaymiz.

            } finally {
                setIsSubmitting(
                    false
                );
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


            onClose?.();
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
    // JSX
    // =====================================================

    return (
        <div
            className="
                fixed
                inset-0
                z-[100]
                flex
                items-center
                justify-center
                overflow-y-auto
                bg-black/80
                p-3
                backdrop-blur-md

                sm:p-5
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
                    handleClose();
                }
            }}
        >

            <div
                className="
                    relative
                    flex
                    max-h-[94vh]
                    w-full
                    max-w-5xl
                    flex-col
                    overflow-hidden
                    rounded-[30px]
                    border
                    border-white/[0.08]
                    bg-[#0b1018]
                    shadow-[0_40px_120px_rgba(0,0,0,0.70)]
                "
            >

                {/* =================================================
                    BACKGROUND GLOWS
                ================================================== */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        -right-32
                        -top-32
                        h-80
                        w-80
                        rounded-full
                        bg-indigo-500/[0.12]
                        blur-[110px]
                    "
                />


                <div
                    className="
                        pointer-events-none
                        absolute
                        -bottom-32
                        left-1/4
                        h-72
                        w-72
                        rounded-full
                        bg-purple-500/[0.06]
                        blur-[110px]
                    "
                />


                {/* =================================================
                    HEADER
                ================================================== */}

                <header
                    className="
                        relative
                        z-20
                        flex
                        shrink-0
                        items-start
                        justify-between
                        gap-4
                        border-b
                        border-white/[0.06]
                        bg-[#0b1018]/95
                        px-5
                        py-5
                        backdrop-blur-xl

                        sm:px-7
                    "
                >

                    <div
                        className="
                            flex
                            min-w-0
                            items-center
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
                                border-indigo-400/20
                                bg-indigo-500/[0.08]
                                text-indigo-300
                            "
                        >
                            {isEditMode ? (
                                <Pencil
                                    size={21}
                                />
                            ) : (
                                <Rocket
                                    size={21}
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
                                    mb-1
                                    flex
                                    items-center
                                    gap-2
                                "
                            >
                                <span
                                    className="
                                        text-[9px]
                                        font-black
                                        uppercase
                                        tracking-[0.18em]
                                        text-indigo-400
                                    "
                                >
                                    {
                                        isEditMode
                                            ? "Edit Project"
                                            : "New Project"
                                    }
                                </span>
                            </div>


                            <h2
                                className="
                                    truncate
                                    text-xl
                                    font-black
                                    text-white

                                    sm:text-2xl
                                "
                            >
                                {
                                    modalTitle
                                }
                            </h2>


                            <p
                                className="
                                    mt-1
                                    hidden
                                    text-xs
                                    font-medium
                                    text-gray-600

                                    sm:block
                                "
                            >
                                {
                                    modalDescription
                                }
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
                            shrink-0
                            place-items-center
                            rounded-xl
                            border
                            border-white/[0.06]
                            bg-white/[0.025]
                            text-gray-500
                            transition

                            hover:bg-white/[0.06]
                            hover:text-white

                            active:scale-[0.96]

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
                    className="
                        relative
                        z-10
                        min-h-0
                        flex-1
                        overflow-y-auto
                    "
                >

                    <div
                        className="
                            grid
                            gap-6
                            p-5

                            sm:p-7

                            lg:grid-cols-[minmax(0,1fr)_340px]
                        "
                    >

                        {/* =============================================
                            LEFT SIDE
                        ============================================== */}

                        <div
                            className="
                                min-w-0
                                space-y-6
                            "
                        >

                            {/* ERROR */}

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
                                        text-xs
                                        font-semibold
                                        leading-6
                                        text-red-300
                                    "
                                >
                                    <AlertTriangle
                                        size={17}
                                        className="
                                            mt-0.5
                                            shrink-0
                                        "
                                    />

                                    <span>
                                        {error}
                                    </span>
                                </div>
                            )}


                            {/* =========================================
                                BASIC INFO
                            ========================================== */}

                            <section
                                className="
                                    rounded-[24px]
                                    border
                                    border-white/[0.06]
                                    bg-white/[0.018]
                                    p-5
                                "
                            >

                                <div
                                    className="
                                        mb-5
                                        flex
                                        items-center
                                        gap-3
                                    "
                                >
                                    <div
                                        className="
                                            grid
                                            h-9
                                            w-9
                                            place-items-center
                                            rounded-xl
                                            border
                                            border-indigo-400/15
                                            bg-indigo-500/[0.06]
                                            text-indigo-300
                                        "
                                    >
                                        <Type
                                            size={17}
                                        />
                                    </div>


                                    <div>

                                        <h3
                                            className="
                                                text-sm
                                                font-black
                                                text-white
                                            "
                                        >
                                            Asosiy ma’lumotlar
                                        </h3>


                                        <p
                                            className="
                                                mt-0.5
                                                text-[10px]
                                                text-gray-600
                                            "
                                        >
                                            Loyihaning asosiy identifikatsiyasi
                                        </p>

                                    </div>

                                </div>


                                <div
                                    className="
                                        space-y-5
                                    "
                                >

                                    {/* NAME */}

                                    <Field
                                        label="Loyiha nomi"
                                        required
                                    >
                                        <div
                                            className="
                                                relative
                                            "
                                        >

                                            <input
                                                type="text"
                                                name="name"
                                                value={
                                                    formData.name
                                                }
                                                onChange={
                                                    handleInputChange
                                                }
                                                maxLength={30}
                                                disabled={
                                                    isSubmitting
                                                }
                                                placeholder="Masalan: MathAI"
                                                className="
                                                    w-full
                                                    rounded-xl
                                                    border
                                                    border-white/[0.07]
                                                    bg-black/20
                                                    px-4
                                                    py-3.5
                                                    pr-16
                                                    text-sm
                                                    font-semibold
                                                    text-white
                                                    outline-none
                                                    transition

                                                    placeholder:text-gray-700

                                                    focus:border-indigo-400/30
                                                    focus:bg-black/30
                                                    focus:ring-4
                                                    focus:ring-indigo-500/[0.05]
                                                "
                                            />


                                            <span
                                                className="
                                                    absolute
                                                    right-3
                                                    top-1/2
                                                    -translate-y-1/2
                                                    text-[9px]
                                                    font-bold
                                                    text-gray-700
                                                "
                                            >
                                                {
                                                    nameLength
                                                }
                                                /30
                                            </span>

                                        </div>
                                    </Field>


                                    {/* FEATURES */}

                                    <Field
                                        label="Asosiy imkoniyatlar"
                                        required
                                        description="Vergul yoki yangi qator bilan bir nechta imkoniyat yozishingiz mumkin."
                                    >
                                        <div
                                            className="
                                                relative
                                            "
                                        >

                                            <textarea
                                                name="main_features"
                                                value={
                                                    formData
                                                        .main_features
                                                }
                                                onChange={
                                                    handleInputChange
                                                }
                                                maxLength={150}
                                                rows={3}
                                                disabled={
                                                    isSubmitting
                                                }
                                                placeholder="AI yordamchi, testlar, natijalar..."
                                                className="
                                                    w-full
                                                    resize-none
                                                    rounded-xl
                                                    border
                                                    border-white/[0.07]
                                                    bg-black/20
                                                    px-4
                                                    py-3.5
                                                    pb-8
                                                    text-sm
                                                    font-medium
                                                    leading-6
                                                    text-white
                                                    outline-none
                                                    transition

                                                    placeholder:text-gray-700

                                                    focus:border-indigo-400/30
                                                    focus:bg-black/30
                                                    focus:ring-4
                                                    focus:ring-indigo-500/[0.05]
                                                "
                                            />


                                            <span
                                                className="
                                                    absolute
                                                    bottom-3
                                                    right-3
                                                    text-[9px]
                                                    font-bold
                                                    text-gray-700
                                                "
                                            >
                                                {
                                                    featuresLength
                                                }
                                                /150
                                            </span>

                                        </div>
                                    </Field>


                                    {/* DESCRIPTION */}

                                    <Field
                                        label="Tavsif"
                                        required
                                    >
                                        <textarea
                                            name="description"
                                            value={
                                                formData
                                                    .description
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                            rows={6}
                                            disabled={
                                                isSubmitting
                                            }
                                            placeholder="Loyihangiz nima qiladi, kimlar uchun va qanday muammoni hal qiladi?"
                                            className="
                                                w-full
                                                resize-none
                                                rounded-xl
                                                border
                                                border-white/[0.07]
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
                                                focus:bg-black/30
                                                focus:ring-4
                                                focus:ring-indigo-500/[0.05]
                                            "
                                        />
                                    </Field>


                                    {/* WEBSITE */}

                                    <Field
                                        label="Demo / Website URL"
                                        description="Majburiy emas. Agar loyiha online bo‘lsa, demo manzilini kiriting."
                                    >
                                        <div
                                            className="
                                                relative
                                            "
                                        >
                                            <ExternalLink
                                                size={16}
                                                className="
                                                    absolute
                                                    left-4
                                                    top-1/2
                                                    -translate-y-1/2
                                                    text-gray-700
                                                "
                                            />


                                            <input
                                                type="url"
                                                name="website_url"
                                                value={
                                                    formData
                                                        .website_url
                                                }
                                                onChange={
                                                    handleInputChange
                                                }
                                                disabled={
                                                    isSubmitting
                                                }
                                                placeholder="https://example.com"
                                                className="
                                                    w-full
                                                    rounded-xl
                                                    border
                                                    border-white/[0.07]
                                                    bg-black/20
                                                    py-3.5
                                                    pl-11
                                                    pr-4
                                                    text-sm
                                                    font-medium
                                                    text-white
                                                    outline-none
                                                    transition

                                                    placeholder:text-gray-700

                                                    focus:border-indigo-400/30
                                                    focus:bg-black/30
                                                    focus:ring-4
                                                    focus:ring-indigo-500/[0.05]
                                                "
                                            />

                                        </div>
                                    </Field>

                                </div>

                            </section>


                            {/* =========================================
                                STACK
                            ========================================== */}

                            <section
                                className="
                                    rounded-[24px]
                                    border
                                    border-white/[0.06]
                                    bg-white/[0.018]
                                    p-5
                                "
                            >

                                <div
                                    className="
                                        mb-5
                                        flex
                                        items-center
                                        gap-3
                                    "
                                >
                                    <div
                                        className="
                                            grid
                                            h-9
                                            w-9
                                            place-items-center
                                            rounded-xl
                                            border
                                            border-purple-400/15
                                            bg-purple-500/[0.06]
                                            text-purple-300
                                        "
                                    >
                                        <Braces
                                            size={17}
                                        />
                                    </div>


                                    <div>

                                        <h3
                                            className="
                                                text-sm
                                                font-black
                                                text-white
                                            "
                                        >
                                            Texnologik stack
                                        </h3>


                                        <p
                                            className="
                                                mt-0.5
                                                text-[10px]
                                                text-gray-600
                                            "
                                        >
                                            Asosiy til va framework
                                        </p>

                                    </div>

                                </div>


                                <div
                                    className="
                                        grid
                                        gap-4
                                        sm:grid-cols-2
                                    "
                                >

                                    {/* LANGUAGE */}

                                    <Field
                                        label="Dasturlash tili"
                                        required
                                    >
                                        <select
                                            name="language"
                                            value={
                                                formData
                                                    .language
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                            disabled={
                                                isSubmitting
                                            }
                                            className="
                                                w-full
                                                rounded-xl
                                                border
                                                border-white/[0.07]
                                                bg-[#101620]
                                                px-4
                                                py-3.5
                                                text-sm
                                                font-semibold
                                                text-white
                                                outline-none
                                                transition

                                                focus:border-indigo-400/30
                                                focus:ring-4
                                                focus:ring-indigo-500/[0.05]
                                            "
                                        >
                                            <option
                                                value=""
                                            >
                                                Tilni tanlang
                                            </option>


                                            {LANGUAGES.map(
                                                (
                                                    language
                                                ) => (
                                                    <option
                                                        key={
                                                            language.id
                                                        }
                                                        value={
                                                            language.id
                                                        }
                                                    >
                                                        {
                                                            language.name
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </Field>


                                    {/* TECHNOLOGY */}

                                    <Field
                                        label="Texnologiya"
                                        required
                                    >
                                        <select
                                            name="technology"
                                            value={
                                                formData
                                                    .technology
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                            disabled={
                                                isSubmitting
                                            }
                                            className="
                                                w-full
                                                rounded-xl
                                                border
                                                border-white/[0.07]
                                                bg-[#101620]
                                                px-4
                                                py-3.5
                                                text-sm
                                                font-semibold
                                                text-white
                                                outline-none
                                                transition

                                                focus:border-purple-400/30
                                                focus:ring-4
                                                focus:ring-purple-500/[0.05]
                                            "
                                        >
                                            <option
                                                value=""
                                            >
                                                Texnologiyani tanlang
                                            </option>


                                            {TECHNOLOGIES.map(
                                                (
                                                    technology
                                                ) => (
                                                    <option
                                                        key={
                                                            technology.id
                                                        }
                                                        value={
                                                            technology.id
                                                        }
                                                    >
                                                        {
                                                            technology.name
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </Field>

                                </div>

                            </section>

                        </div>


                        {/* =============================================
                            RIGHT SIDE — IMAGES / PREVIEW
                        ============================================== */}

                        <aside
                            className="
                                min-w-0
                            "
                        >

                            <section
                                className="
                                    rounded-[24px]
                                    border
                                    border-white/[0.06]
                                    bg-white/[0.018]
                                    p-5

                                    lg:sticky
                                    lg:top-0
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-start
                                        justify-between
                                        gap-3
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
                                            <Images
                                                size={17}
                                            />
                                        </div>


                                        <div>

                                            <h3
                                                className="
                                                    text-sm
                                                    font-black
                                                    text-white
                                                "
                                            >
                                                Loyiha rasmlari
                                            </h3>


                                            <p
                                                className="
                                                    mt-0.5
                                                    text-[10px]
                                                    text-gray-600
                                                "
                                            >
                                                {
                                                    images.length
                                                }
                                                {" "}
                                                ta rasm
                                            </p>

                                        </div>

                                    </div>


                                    <button
                                        type="button"
                                        onClick={
                                            handleAddImage
                                        }
                                        disabled={
                                            isSubmitting
                                        }
                                        title="Rasm qo‘shish"
                                        className="
                                            grid
                                            h-9
                                            w-9
                                            place-items-center
                                            rounded-xl
                                            border
                                            border-indigo-400/15
                                            bg-indigo-500/[0.06]
                                            text-indigo-300
                                            transition

                                            hover:border-indigo-400/30
                                            hover:bg-indigo-500/[0.12]

                                            disabled:opacity-40
                                        "
                                    >
                                        <Plus
                                            size={16}
                                        />
                                    </button>

                                </div>


                                <div
                                    className="
                                        mt-5
                                        space-y-4
                                    "
                                >

                                    {images.map(
                                        (
                                            image,
                                            index
                                        ) => (
                                            <div
                                                key={
                                                    image.id
                                                }
                                                className="
                                                    relative
                                                    overflow-hidden
                                                    rounded-2xl
                                                    border
                                                    border-white/[0.06]
                                                    bg-black/20
                                                "
                                            >

                                                {/* PREVIEW */}

                                                <div
                                                    className="
                                                        relative
                                                        aspect-video
                                                        overflow-hidden
                                                        bg-black/30
                                                    "
                                                >

                                                    {image.url ? (
                                                        <img
                                                            src={
                                                                image.url
                                                            }
                                                            alt={
                                                                image.title
                                                                ||
                                                                `Project ${index + 1}`
                                                            }
                                                            className="
                                                                h-full
                                                                w-full
                                                                object-cover
                                                            "
                                                        />
                                                    ) : (
                                                        <div
                                                            className="
                                                                flex
                                                                h-full
                                                                flex-col
                                                                items-center
                                                                justify-center
                                                                gap-2
                                                                text-gray-700
                                                            "
                                                        >
                                                            <FileImage
                                                                size={32}
                                                            />

                                                            <span
                                                                className="
                                                                    text-[9px]
                                                                    font-black
                                                                    uppercase
                                                                    tracking-wider
                                                                "
                                                            >
                                                                Preview
                                                            </span>
                                                        </div>
                                                    )}


                                                    <span
                                                        className="
                                                            absolute
                                                            left-3
                                                            top-3
                                                            rounded-lg
                                                            border
                                                            border-white/[0.08]
                                                            bg-black/70
                                                            px-2
                                                            py-1
                                                            text-[9px]
                                                            font-black
                                                            text-gray-300
                                                            backdrop-blur
                                                        "
                                                    >
                                                        {
                                                            index ===
                                                            0
                                                                ? "Asosiy"
                                                                : `#${index + 1}`
                                                        }
                                                    </span>


                                                    {images.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleRemoveImage(
                                                                    image.id
                                                                )
                                                            }
                                                            disabled={
                                                                isSubmitting
                                                            }
                                                            title="Rasmni o‘chirish"
                                                            className="
                                                                absolute
                                                                right-3
                                                                top-3
                                                                grid
                                                                h-8
                                                                w-8
                                                                place-items-center
                                                                rounded-lg
                                                                border
                                                                border-red-400/20
                                                                bg-black/70
                                                                text-red-300
                                                                backdrop-blur
                                                                transition

                                                                hover:bg-red-500/20

                                                                disabled:opacity-40
                                                            "
                                                        >
                                                            <Trash2
                                                                size={14}
                                                            />
                                                        </button>
                                                    )}

                                                </div>


                                                {/* FIELDS */}

                                                <div
                                                    className="
                                                        space-y-3
                                                        p-3.5
                                                    "
                                                >

                                                    <input
                                                        type="text"
                                                        value={
                                                            image.title
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            handleImageChange(
                                                                image.id,
                                                                "title",
                                                                event
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        maxLength={100}
                                                        disabled={
                                                            isSubmitting
                                                        }
                                                        placeholder="Rasm sarlavhasi"
                                                        className="
                                                            w-full
                                                            rounded-xl
                                                            border
                                                            border-white/[0.06]
                                                            bg-black/20
                                                            px-3
                                                            py-2.5
                                                            text-xs
                                                            font-semibold
                                                            text-white
                                                            outline-none

                                                            placeholder:text-gray-700

                                                            focus:border-indigo-400/25
                                                        "
                                                    />


                                                    <label
                                                        className="
                                                            group
                                                            flex
                                                            cursor-pointer
                                                            items-center
                                                            justify-center
                                                            gap-2
                                                            rounded-xl
                                                            border
                                                            border-dashed
                                                            border-white/[0.09]
                                                            bg-white/[0.015]
                                                            px-3
                                                            py-3
                                                            text-[10px]
                                                            font-black
                                                            text-gray-500
                                                            transition

                                                            hover:border-indigo-400/25
                                                            hover:bg-indigo-500/[0.04]
                                                            hover:text-indigo-300
                                                        "
                                                    >

                                                        <UploadCloud
                                                            size={15}
                                                        />


                                                        <span
                                                            className="
                                                                truncate
                                                            "
                                                        >
                                                            {
                                                                image.file
                                                                    ? image
                                                                        .file
                                                                        .name
                                                                    : image.url
                                                                        ? "Rasmni almashtirish"
                                                                        : "Rasm tanlash"
                                                            }
                                                        </span>


                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            disabled={
                                                                isSubmitting
                                                            }
                                                            onChange={(
                                                                event
                                                            ) =>
                                                                handleFileChange(
                                                                    image.id,
                                                                    event
                                                                        .target
                                                                        .files?.[0]
                                                                )
                                                            }
                                                            className="
                                                                hidden
                                                            "
                                                        />

                                                    </label>

                                                </div>

                                            </div>
                                        )
                                    )}

                                </div>


                                {/* STACK PREVIEW */}

                                {(
                                    selectedLanguage
                                    ||
                                    selectedTechnology
                                ) && (
                                    <div
                                        className="
                                            mt-5
                                            rounded-2xl
                                            border
                                            border-white/[0.06]
                                            bg-black/20
                                            p-4
                                        "
                                    >

                                        <div
                                            className="
                                                mb-3
                                                flex
                                                items-center
                                                gap-2
                                            "
                                        >
                                            <Code2
                                                size={14}
                                                className="
                                                    text-purple-300
                                                "
                                            />


                                            <span
                                                className="
                                                    text-[9px]
                                                    font-black
                                                    uppercase
                                                    tracking-[0.15em]
                                                    text-gray-600
                                                "
                                            >
                                                Stack preview
                                            </span>
                                        </div>


                                        <div
                                            className="
                                                flex
                                                flex-wrap
                                                gap-2
                                            "
                                        >

                                            {selectedLanguage && (
                                                <span
                                                    className="
                                                        rounded-full
                                                        border
                                                        border-blue-400/20
                                                        bg-blue-500/[0.07]
                                                        px-2.5
                                                        py-1
                                                        text-[10px]
                                                        font-black
                                                        text-blue-300
                                                    "
                                                >
                                                    {
                                                        selectedLanguage.name
                                                    }
                                                </span>
                                            )}


                                            {selectedTechnology && (
                                                <span
                                                    className="
                                                        rounded-full
                                                        border
                                                        border-purple-400/20
                                                        bg-purple-500/[0.07]
                                                        px-2.5
                                                        py-1
                                                        text-[10px]
                                                        font-black
                                                        text-purple-300
                                                    "
                                                >
                                                    {
                                                        selectedTechnology.name
                                                    }
                                                </span>
                                            )}

                                        </div>

                                    </div>
                                )}

                            </section>

                        </aside>

                    </div>


                    {/* =================================================
                        FOOTER
                    ================================================== */}

                    <footer
                        className="
                            sticky
                            bottom-0
                            z-20
                            flex
                            flex-col-reverse
                            gap-2
                            border-t
                            border-white/[0.06]
                            bg-[#0b1018]/95
                            px-5
                            py-4
                            backdrop-blur-xl

                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                            sm:px-7
                        "
                    >

                        <div
                            className="
                                hidden
                                items-center
                                gap-2
                                text-[10px]
                                font-medium
                                text-gray-700

                                md:flex
                            "
                        >
                            <Sparkles
                                size={13}
                                className="
                                    text-indigo-500
                                "
                            />

                            Barcha muhim maydonlarni tekshirib, keyin saqlang.
                        </div>


                        <div
                            className="
                                flex
                                flex-col-reverse
                                gap-2

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
                                    inline-flex
                                    min-h-[42px]
                                    items-center
                                    justify-center
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
                                Bekor qilish
                            </button>


                            <button
                                type="submit"
                                disabled={
                                    isSubmitting
                                }
                                className="
                                    inline-flex
                                    min-h-[42px]
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-indigo-400/30
                                    bg-indigo-600
                                    px-5
                                    py-2.5
                                    text-xs
                                    font-black
                                    text-white
                                    shadow-lg
                                    shadow-indigo-600/20
                                    transition

                                    hover:bg-indigo-500

                                    active:scale-[0.98]

                                    disabled:cursor-not-allowed
                                    disabled:bg-indigo-700/40
                                    disabled:text-gray-400
                                    disabled:shadow-none
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

                                        Saqlanmoqda...
                                    </>
                                ) : isEditMode ? (
                                    <>
                                        <Save
                                            size={16}
                                        />

                                        O‘zgarishlarni saqlash
                                    </>
                                ) : (
                                    <>
                                        <Rocket
                                            size={16}
                                        />

                                        Loyihani yaratish
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


export default ProjectFormModal;