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

import ProjectService from "../../services/project";

import {
    BACKEND_URL,
} from "../../services/config";

import {
    siteToast,
} from "../ui/AuthToast";


// =========================================================
// CONFIG
// =========================================================

const MAX_PROJECT_IMAGES = 4;

const DEFAULT_STACK_COLOR =
    "#64748B";


// =========================================================
// EMPTY FORM
// =========================================================

const EMPTY_FORM = {
    name: "",
    main_features: "",
    description: "",
    website_url: "",
};


// =========================================================
// MEDIA URL
// =========================================================

const getMediaUrl = (
    value
) => {

    if (!value) {
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
// STACK COLOR
// =========================================================

const getStackColor = (
    item
) => {

    const color =
        item?.color;


    if (
        typeof color ===
            "string"
        &&
        /^#[0-9A-Fa-f]{6}$/.test(
            color
        )
    ) {
        return color;
    }


    return DEFAULT_STACK_COLOR;
};


// =========================================================
// COLOR + ALPHA
// =========================================================

const withAlpha = (
    color,
    alpha
) => {

    const safeColor =
        (
            typeof color ===
                "string"
            &&
            /^#[0-9A-Fa-f]{6}$/.test(
                color
            )
        )
            ? color
            : DEFAULT_STACK_COLOR;


    return (
        `${safeColor}${alpha}`
    );
};


// =========================================================
// NORMALIZE CATALOG
// =========================================================

const normalizeCatalog = (
    items
) => {

    if (
        !Array.isArray(
            items
        )
    ) {
        return [];
    }


    return items
        .filter(
            Boolean
        )
        .map(
            (
                item,
                index
            ) => {

                if (
                    typeof item ===
                        "string"
                ) {

                    return {
                        id:
                            item,

                        name:
                            item,

                        color:
                            DEFAULT_STACK_COLOR,

                        _key:
                            `${item}-${index}`,
                    };
                }


                return {

                    ...item,

                    id:
                        item.id
                        ??
                        `${item.name || "stack"}-${index}`,

                    name:
                        item.name
                        ||
                        item.title
                        ||
                        "Noma’lum",

                    color:
                        getStackColor(
                            item
                        ),
                };
            }
        );
};


// =========================================================
// NORMALIZE IDS
// =========================================================

const normalizeIds = (
    items
) => {

    if (
        !Array.isArray(
            items
        )
    ) {
        return [];
    }


    const ids =
        items
            .map(
                (
                    item
                ) => {

                    if (
                        item
                        &&
                        typeof item ===
                            "object"
                    ) {
                        return item.id;
                    }


                    return item;
                }
            )
            .filter(
                (
                    value
                ) =>
                    value !==
                        null
                    &&
                    value !==
                        undefined
                    &&
                    value !==
                        ""
            )
            .map(
                (
                    value
                ) =>
                    String(
                        value
                    )
            );


    return [
        ...new Set(
            ids
        ),
    ];
};


// =========================================================
// GET INITIAL LANGUAGE IDS
// =========================================================

const getInitialLanguageIds = (
    data
) => {

    if (!data) {
        return [];
    }


    if (
        Array.isArray(
            data.languages_data
        )
        &&
        data.languages_data.length >
            0
    ) {

        return normalizeIds(
            data.languages_data
        );
    }


    if (
        Array.isArray(
            data.languages
        )
        &&
        data.languages.length >
            0
    ) {

        return normalizeIds(
            data.languages
        );
    }


    if (
        data.language_data
            ?.id
    ) {

        return [
            String(
                data.language_data.id
            ),
        ];
    }


    if (
        data.language
        &&
        typeof data.language ===
            "object"
        &&
        data.language.id
    ) {

        return [
            String(
                data.language.id
            ),
        ];
    }


    if (
        data.language !==
            null
        &&
        data.language !==
            undefined
        &&
        data.language !==
            ""
    ) {

        return [
            String(
                data.language
            ),
        ];
    }


    return [];
};


// =========================================================
// GET INITIAL TECHNOLOGY IDS
// =========================================================

const getInitialTechnologyIds = (
    data
) => {

    if (!data) {
        return [];
    }


    if (
        Array.isArray(
            data.technologies_data
        )
        &&
        data.technologies_data.length >
            0
    ) {

        return normalizeIds(
            data.technologies_data
        );
    }


    if (
        Array.isArray(
            data.technologies
        )
        &&
        data.technologies.length >
            0
    ) {

        return normalizeIds(
            data.technologies
        );
    }


    if (
        data.technology_data
            ?.id
    ) {

        return [
            String(
                data.technology_data.id
            ),
        ];
    }


    if (
        data.technology
        &&
        typeof data.technology ===
            "object"
        &&
        data.technology.id
    ) {

        return [
            String(
                data.technology.id
            ),
        ];
    }


    if (
        data.technology !==
            null
        &&
        data.technology !==
            undefined
        &&
        data.technology !==
            ""
    ) {

        return [
            String(
                data.technology
            ),
        ];
    }


    return [];
};


// =========================================================
// TECHNOLOGY LANGUAGE IDS
// =========================================================

const getTechnologyLanguageIds = (
    technology
) => {

    if (
        Array.isArray(
            technology?.languages
        )
    ) {

        return normalizeIds(
            technology.languages
        );
    }


    if (
        Array.isArray(
            technology?.language_data
        )
    ) {

        return normalizeIds(
            technology.language_data
        );
    }


    return [];
};


// =========================================================
// TECHNOLOGY MATCH
//
// Technology.languages = []
// bo‘lsa universal technology.
// =========================================================

const technologyMatchesLanguages = (
    technology,
    selectedLanguageIds
) => {

    const allowedLanguageIds =
        getTechnologyLanguageIds(
            technology
        );


    if (
        allowedLanguageIds.length ===
        0
    ) {
        return true;
    }


    if (
        selectedLanguageIds.length ===
        0
    ) {
        return true;
    }


    return allowedLanguageIds.some(
        (
            languageId
        ) =>
            selectedLanguageIds.includes(
                String(
                    languageId
                )
            )
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
    ) {
        return [];
    }


    return projectImages
        .slice(
            0,
            MAX_PROJECT_IMAGES
        )
        .map(
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
// CREATE LOCAL IMAGE
// =========================================================

const createLocalImage = (
    file,
    index = 0
) => {

    return {

        id:
            `new-${Date.now()}-${index}-${Math.random()
                .toString(36)
                .slice(2, 8)}`,

        title:
            file?.name
                ?.replace(
                    /\.[^.]+$/,
                    ""
                )
                ?.slice(
                    0,
                    100
                )
            ||
            "",

        file,

        isNew:
            true,

        url:
            file
                ? URL.createObjectURL(
                    file
                )
                : "",
    };
};


// =========================================================
// ALLOWED IMAGE
// =========================================================

const isAllowedImage = (
    file
) => {

    if (!file) {
        return false;
    }


    const fileName =
        String(
            file.name
            ||
            ""
        );


    return (
        /\.(jpg|jpeg|png|webp)$/i.test(
            fileName
        )
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
        &&
        data.trim()
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
        data?.languages
    ) {

        return (
            Array.isArray(
                data.languages
            )
                ? data.languages.join(
                    ", "
                )
                : String(
                    data.languages
                )
        );
    }


    if (
        data?.technologies
    ) {

        return (
            Array.isArray(
                data.technologies
            )
                ? data.technologies.join(
                    ", "
                )
                : String(
                    data.technologies
                )
        );
    }


    if (
        data?.name
    ) {

        return (
            Array.isArray(
                data.name
            )
                ? data.name.join(
                    ", "
                )
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
            firstValue.length >
                0
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
// FIELD
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
// STACK TAG
// =========================================================

const StackTag = ({
    item,
    active,
    onClick,
    disabled,
    showCategory = false,
}) => {

    const color =
        getStackColor(
            item
        );


    return (

        <button
            type="button"

            onClick={
                onClick
            }

            disabled={
                disabled
            }

            title={
                item?.name
            }

            className="
                inline-flex
                max-w-full
                items-center
                gap-2
                rounded-full
                border
                px-3
                py-2
                text-[10px]
                font-black
                transition-all
                duration-200

                hover:-translate-y-[1px]

                disabled:cursor-not-allowed
                disabled:opacity-40
            "

            style={{

                color:
                    active
                        ? color
                        : "#7C8493",

                borderColor:
                    active
                        ? withAlpha(
                            color,
                            "55"
                        )
                        : "rgba(255,255,255,0.07)",

                backgroundColor:
                    active
                        ? withAlpha(
                            color,
                            "15"
                        )
                        : "rgba(255,255,255,0.018)",

                boxShadow:
                    active
                        ? `0 0 14px ${withAlpha(
                            color,
                            "10"
                        )}`
                        : "none",
            }}
        >

            {active ? (

                <Check
                    size={12}
                    className="
                        shrink-0
                    "
                />

            ) : (

                <span
                    className="
                        h-2
                        w-2
                        shrink-0
                        rounded-full
                    "
                    style={{
                        backgroundColor:
                            color,
                    }}
                />
            )}


            <span
                className="
                    truncate
                "
            >
                {item.name}
            </span>


            {showCategory
                &&
                (
                    item?.category_display
                    ||
                    item?.category
                ) && (

                <span
                    className="
                        hidden
                        rounded-full
                        border
                        border-white/[0.06]
                        bg-black/10
                        px-1.5
                        py-0.5
                        font-mono
                        text-[8px]
                        text-white/40

                        sm:inline
                    "
                >
                    {item?.category_display
                    ||
                    item?.category}
                </span>
            )}

        </button>
    );
};


// =========================================================
// STACK PREVIEW TAG
// =========================================================

const StackPreviewTag = ({
    item,
}) => {

    const color =
        getStackColor(
            item
        );


    return (

        <span
            className="
                inline-flex
                items-center
                gap-1.5
                rounded-full
                border
                px-2.5
                py-1
                text-[10px]
                font-black
            "

            style={{

                color,

                borderColor:
                    withAlpha(
                        color,
                        "45"
                    ),

                backgroundColor:
                    withAlpha(
                        color,
                        "12"
                    ),
            }}
        >

            <span
                className="
                    h-1.5
                    w-1.5
                    rounded-full
                "

                style={{
                    backgroundColor:
                        color,
                }}
            />


            {item.name}

        </span>
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
    isSubmitting: parentSubmitting = false,
}) => {

    // =====================================================
    // MODE
    // =====================================================

    const isEditMode =
        Boolean(
            initialData
        );


    // =====================================================
    // FORM
    // =====================================================

    const [
        formData,
        setFormData,
    ] = useState({
        ...EMPTY_FORM,
    });


    // =====================================================
    // STACK CATALOG
    // =====================================================

    const [
        languages,
        setLanguages,
    ] = useState([]);


    const [
        technologies,
        setTechnologies,
    ] = useState([]);


    const [
        selectedLanguageIds,
        setSelectedLanguageIds,
    ] = useState([]);


    const [
        selectedTechnologyIds,
        setSelectedTechnologyIds,
    ] = useState([]);


    const [
        stackLoading,
        setStackLoading,
    ] = useState(false);


    const [
        stackError,
        setStackError,
    ] = useState("");


    // =====================================================
    // IMAGES
    // =====================================================

    const [
        images,
        setImages,
    ] = useState([]);


    // =====================================================
    // SUBMIT
    // =====================================================

    const [
        localSubmitting,
        setLocalSubmitting,
    ] = useState(false);


    const [
        error,
        setError,
    ] = useState("");


    const isSubmitting =
        localSubmitting
        ||
        parentSubmitting;


    // =====================================================
    // TITLE
    // =====================================================

    const modalTitle =
        isEditMode
            ? "Loyihani tahrirlash"
            : "Yangi loyiha";


    const modalDescription =
        isEditMode
            ? "Loyiha ma’lumotlari, stack va rasmlarini yangilang."
            : "Yangi loyihangizni F.Society hamjamiyatiga taqdim eting.";


    // =====================================================
    // INITIAL DATA + STACK
    // =====================================================

    useEffect(
        () => {

            if (!isOpen) {
                return;
            }


            let ignore =
                false;


            setError(
                ""
            );

            setStackError(
                ""
            );


            const initialLanguageIds =
                getInitialLanguageIds(
                    initialData
                );


            const initialTechnologyIds =
                getInitialTechnologyIds(
                    initialData
                );


            if (
                initialData
            ) {

                setFormData({

                    name:
                        initialData?.name
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
                });


                setImages(
                    formatImagesForEdit(
                        initialData
                            ?.images
                    )
                );


                setSelectedLanguageIds(
                    initialLanguageIds
                );


                setSelectedTechnologyIds(
                    initialTechnologyIds
                );

            } else {

                setFormData({
                    ...EMPTY_FORM,
                });


                setImages(
                    []
                );


                setSelectedLanguageIds(
                    []
                );


                setSelectedTechnologyIds(
                    []
                );
            }


            const loadStack =
                async () => {

                    setStackLoading(
                        true
                    );


                    try {

                        const response =
                            await ProjectService
                                .getStackCatalog();


                        if (ignore) {
                            return;
                        }


                        const loadedLanguages =
                            normalizeCatalog(
                                response
                                    ?.languages
                            );


                        const loadedTechnologies =
                            normalizeCatalog(
                                response
                                    ?.technologies
                            );


                        setLanguages(
                            loadedLanguages
                        );


                        setTechnologies(
                            loadedTechnologies
                        );


                        /*
                            Editda oldingi technology tanlangan
                            bo‘lsa va hozirgi language bilan mos
                            bo‘lmasa submitda backend reject qiladi.

                            Shuning uchun catalog kelgach moslarini
                            saqlaymiz.
                        */

                        if (
                            initialData
                        ) {

                            const validTechnologyIds =
                                initialTechnologyIds
                                    .filter(
                                        (
                                            id
                                        ) => {

                                            const technology =
                                                loadedTechnologies
                                                    .find(
                                                        (
                                                            item
                                                        ) =>
                                                            String(
                                                                item.id
                                                            )
                                                            ===
                                                            String(
                                                                id
                                                            )
                                                    );


                                            if (
                                                !technology
                                            ) {
                                                return false;
                                            }


                                            return (
                                                technologyMatchesLanguages(
                                                    technology,
                                                    initialLanguageIds
                                                )
                                            );
                                        }
                                    );


                            setSelectedTechnologyIds(
                                validTechnologyIds
                            );
                        }

                    } catch (
                        requestError
                    ) {

                        if (ignore) {
                            return;
                        }


                        console.error(
                            "Stack katalogini olishda xato:",
                            requestError
                        );


                        const message =
                            getErrorMessage(
                                requestError,
                                "Tillar va texnologiyalarni yuklab bo‘lmadi."
                            );


                        setStackError(
                            message
                        );

                    } finally {

                        if (
                            !ignore
                        ) {
                            setStackLoading(
                                false
                            );
                        }
                    }
                };


            loadStack();


            return () => {

                ignore =
                    true;
            };

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
    // SELECTED LANGUAGES
    // =====================================================

    const selectedLanguages =
        useMemo(
            () => {

                return languages
                    .filter(
                        (
                            language
                        ) =>
                            selectedLanguageIds
                                .includes(
                                    String(
                                        language.id
                                    )
                                )
                    );

            },
            [
                languages,
                selectedLanguageIds,
            ]
        );


    // =====================================================
    // AVAILABLE TECHNOLOGIES
    // =====================================================

    const compatibleTechnologies =
        useMemo(
            () => {

                return technologies
                    .filter(
                        (
                            technology
                        ) =>
                            technologyMatchesLanguages(
                                technology,
                                selectedLanguageIds
                            )
                    );

            },
            [
                technologies,
                selectedLanguageIds,
            ]
        );


    // =====================================================
    // SELECTED TECHNOLOGIES
    // =====================================================

    const selectedTechnologies =
        useMemo(
            () => {

                return technologies
                    .filter(
                        (
                            technology
                        ) =>
                            selectedTechnologyIds
                                .includes(
                                    String(
                                        technology.id
                                    )
                                )
                    );

            },
            [
                technologies,
                selectedTechnologyIds,
            ]
        );


    // =====================================================
    // INPUT CHANGE
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
    // LANGUAGE TOGGLE
    // =====================================================

    const handleLanguageToggle =
        (
            language
        ) => {

            if (
                isSubmitting
            ) {
                return;
            }


            const languageId =
                String(
                    language.id
                );


            const exists =
                selectedLanguageIds
                    .includes(
                        languageId
                    );


            const nextLanguageIds =
                exists
                    ? selectedLanguageIds
                        .filter(
                            (
                                id
                            ) =>
                                id !==
                                languageId
                        )
                    : [
                        ...selectedLanguageIds,
                        languageId,
                    ];


            setSelectedLanguageIds(
                nextLanguageIds
            );


            /*
                Til olib tashlanganda shu tillarga
                mos kelmay qolgan technologylarni
                ham avtomatik olib tashlaymiz.
            */

            setSelectedTechnologyIds(
                (
                    currentTechnologyIds
                ) => {

                    return currentTechnologyIds
                        .filter(
                            (
                                technologyId
                            ) => {

                                const technology =
                                    technologies.find(
                                        (
                                            item
                                        ) =>
                                            String(
                                                item.id
                                            )
                                            ===
                                            String(
                                                technologyId
                                            )
                                    );


                                if (
                                    !technology
                                ) {
                                    return false;
                                }


                                return (
                                    technologyMatchesLanguages(
                                        technology,
                                        nextLanguageIds
                                    )
                                );
                            }
                        );
                }
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
    // TECHNOLOGY TOGGLE
    // =====================================================

    const handleTechnologyToggle =
        (
            technology
        ) => {

            if (
                isSubmitting
            ) {
                return;
            }


            if (
                !technologyMatchesLanguages(
                    technology,
                    selectedLanguageIds
                )
            ) {

                siteToast.warning(
                    "Bu texnologiya tanlangan dasturlash tillariga mos kelmaydi.",
                    {
                        title:
                            "Technology mos emas",
                    }
                );

                return;
            }


            const technologyId =
                String(
                    technology.id
                );


            setSelectedTechnologyIds(
                (
                    current
                ) => {

                    if (
                        current.includes(
                            technologyId
                        )
                    ) {

                        return current.filter(
                            (
                                id
                            ) =>
                                id !==
                                technologyId
                        );
                    }


                    return [
                        ...current,
                        technologyId,
                    ];
                }
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
    // IMAGE TITLE
    // =====================================================

    const handleImageTitleChange =
        (
            id,
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

                                    title:
                                        value,
                                }

                                : image
                    )
            );
        };


    // =====================================================
    // ADD MULTIPLE IMAGES
    // =====================================================

    const handleMultipleImageSelect =
        (
            event
        ) => {

            const files =
                Array.from(
                    event.target.files
                    ||
                    []
                );


            /*
                Bir xil faylni qayta tanlashga
                imkon berish uchun.
            */

            event.target.value =
                "";


            if (
                files.length ===
                0
            ) {
                return;
            }


            const invalidFiles =
                files.filter(
                    (
                        file
                    ) =>
                        !isAllowedImage(
                            file
                        )
                );


            if (
                invalidFiles.length >
                0
            ) {

                siteToast.warning(
                    "Faqat JPG, JPEG, PNG yoki WEBP rasmlarini yuklash mumkin.",
                    {
                        title:
                            "Noto‘g‘ri fayl",
                    }
                );
            }


            const validFiles =
                files.filter(
                    isAllowedImage
                );


            if (
                validFiles.length ===
                0
            ) {
                return;
            }


            const remainingSlots =
                MAX_PROJECT_IMAGES
                -
                images.length;


            if (
                remainingSlots <=
                0
            ) {

                siteToast.warning(
                    `Bitta loyihaga maksimum ${MAX_PROJECT_IMAGES} ta rasm qo‘shish mumkin.`,
                    {
                        title:
                            "Rasm limiti",
                    }
                );

                return;
            }


            const acceptedFiles =
                validFiles.slice(
                    0,
                    remainingSlots
                );


            if (
                validFiles.length >
                remainingSlots
            ) {

                siteToast.info(
                    `Faqat ${remainingSlots} ta rasm uchun joy qoldi. Birinchi ${acceptedFiles.length} ta rasm qo‘shildi.`,
                    {
                        title:
                            `${MAX_PROJECT_IMAGES} ta rasm limiti`,
                    }
                );
            }


            const newImages =
                acceptedFiles.map(
                    (
                        file,
                        index
                    ) =>
                        createLocalImage(
                            file,
                            index
                        )
                );


            setImages(
                (
                    current
                ) => [
                    ...current,
                    ...newImages,
                ]
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
    // REPLACE IMAGE
    // =====================================================

    const handleReplaceImage =
        (
            id,
            file
        ) => {

            if (!file) {
                return;
            }


            if (
                !isAllowedImage(
                    file
                )
            ) {

                siteToast.warning(
                    "Faqat JPG, JPEG, PNG yoki WEBP rasmlarini yuklash mumkin.",
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
    // REMOVE IMAGE
    // =====================================================

    const handleRemoveImage =
        (
            id
        ) => {

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
                selectedLanguageIds.length ===
                0
            ) {

                return (
                    "Kamida bitta dasturlash tilini tanlang."
                );
            }


            if (
                selectedTechnologyIds.length ===
                0
            ) {

                return (
                    "Kamida bitta texnologiyani tanlang."
                );
            }


            if (
                images.length ===
                0
            ) {

                return (
                    "Loyihaning kamida bitta rasmi bo‘lishi kerak."
                );
            }


            if (
                images.length >
                MAX_PROJECT_IMAGES
            ) {

                return (
                    `Bitta loyihaga maksimum ${MAX_PROJECT_IMAGES} ta rasm qo‘shish mumkin.`
                );
            }


            const hasInvalidImage =
                images.some(
                    (
                        image
                    ) =>
                        !image.file
                        &&
                        !image.url
                );


            if (
                hasInvalidImage
            ) {

                return (
                    "Rasm bloklaridan birida fayl mavjud emas."
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


            setLocalSubmitting(
                true
            );


            // =============================================
            // FORMDATA
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


            /*
                website_url ni bo‘sh bo‘lsa ham
                yuboramiz.

                Edit paytida eski URLni o‘chirish
                mumkin bo‘ladi.
            */

            projectData.append(
                "website_url",
                formData
                    .website_url
                    .trim()
            );


            // =============================================
            // PRIMARY STACK
            //
            // Compatibility uchun.
            // =================================================

            projectData.append(
                "language",
                selectedLanguageIds[0]
            );


            projectData.append(
                "technology",
                selectedTechnologyIds[0]
            );


            // =============================================
            // FULL LANGUAGES
            // =============================================

            selectedLanguageIds.forEach(
                (
                    languageId
                ) => {

                    projectData.append(
                        "languages",
                        languageId
                    );
                }
            );


            // =============================================
            // FULL TECHNOLOGIES
            // =============================================

            selectedTechnologyIds.forEach(
                (
                    technologyId
                ) => {

                    projectData.append(
                        "technologies",
                        technologyId
                    );
                }
            );


            // =============================================
            // IMAGES
            //
            // Backend:
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

                    /*
                        Yangi yoki almashtirilgan rasm.
                    */

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
                                ?.trim()
                            ||
                            `Image ${index + 1}`
                        );


                        /*
                            Editda eski rasmni replacement
                            qilsak uning oldingi id sini ham
                            yuboramiz.
                        */

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


                    /*
                        Editdagi o‘zgarmagan eski rasm.
                    */

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
                                ?.trim()
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

            } finally {

                setLocalSubmitting(
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
                    BACKGROUND GLOW
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
                                    {isEditMode
                                        ? "Edit Project"
                                        : "New Project"}
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
                                {modalTitle}
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
                            LEFT
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
                                                {nameLength}/30
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
                                                {featuresLength}/150
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
                                                Bir nechta til va texnologiyani tanlashingiz mumkin
                                            </p>

                                        </div>

                                    </div>


                                    {stackLoading && (

                                        <Loader2
                                            size={17}
                                            className="
                                                animate-spin
                                                text-purple-300
                                            "
                                        />
                                    )}

                                </div>


                                {stackError && (

                                    <div
                                        className="
                                            mb-5
                                            rounded-xl
                                            border
                                            border-red-400/15
                                            bg-red-500/[0.05]
                                            p-3
                                            text-xs
                                            font-semibold
                                            text-red-300
                                        "
                                    >
                                        {stackError}
                                    </div>
                                )}


                                {/* =====================================
                                    LANGUAGES
                                ====================================== */}

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

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-2
                                            "
                                        >

                                            <Code2
                                                size={15}
                                                className="
                                                    text-blue-300
                                                "
                                            />


                                            <span
                                                className="
                                                    text-xs
                                                    font-black
                                                    text-gray-300
                                                "
                                            >
                                                Dasturlash tillari
                                            </span>


                                            <span
                                                className="
                                                    text-red-400
                                                "
                                            >
                                                *
                                            </span>

                                        </div>


                                        {selectedLanguageIds.length >
                                            0 && (

                                            <span
                                                className="
                                                    rounded-full
                                                    border
                                                    border-blue-400/15
                                                    bg-blue-500/[0.05]
                                                    px-2
                                                    py-0.5
                                                    text-[9px]
                                                    font-black
                                                    text-blue-300
                                                "
                                            >
                                                {selectedLanguageIds.length} ta
                                            </span>
                                        )}

                                    </div>


                                    <div
                                        className="
                                            flex
                                            flex-wrap
                                            gap-2
                                        "
                                    >

                                        {stackLoading
                                            ? [
                                                1,
                                                2,
                                                3,
                                                4,
                                                5,
                                            ].map(
                                                (
                                                    item
                                                ) => (

                                                    <div
                                                        key={
                                                            item
                                                        }
                                                        className="
                                                            h-9
                                                            w-24
                                                            animate-pulse
                                                            rounded-full
                                                            bg-white/[0.04]
                                                        "
                                                    />
                                                )
                                            )
                                            : languages.map(
                                                (
                                                    language
                                                ) => {

                                                    const active =
                                                        selectedLanguageIds
                                                            .includes(
                                                                String(
                                                                    language.id
                                                                )
                                                            );


                                                    return (

                                                        <StackTag
                                                            key={
                                                                language.id
                                                            }

                                                            item={
                                                                language
                                                            }

                                                            active={
                                                                active
                                                            }

                                                            disabled={
                                                                isSubmitting
                                                            }

                                                            onClick={() =>
                                                                handleLanguageToggle(
                                                                    language
                                                                )
                                                            }
                                                        />
                                                    );
                                                }
                                            )}

                                    </div>


                                    {!stackLoading
                                        &&
                                        languages.length ===
                                            0 && (

                                        <p
                                            className="
                                                text-xs
                                                font-semibold
                                                text-gray-600
                                            "
                                        >
                                            Dasturlash tillari topilmadi.
                                        </p>
                                    )}

                                </div>


                                {/* DIVIDER */}

                                <div
                                    className="
                                        my-5
                                        h-px
                                        bg-white/[0.06]
                                    "
                                />


                                {/* =====================================
                                    TECHNOLOGIES
                                ====================================== */}

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

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-2
                                            "
                                        >

                                            <Layers3
                                                size={15}
                                                className="
                                                    text-purple-300
                                                "
                                            />


                                            <span
                                                className="
                                                    text-xs
                                                    font-black
                                                    text-gray-300
                                                "
                                            >
                                                Texnologiyalar
                                            </span>


                                            <span
                                                className="
                                                    text-red-400
                                                "
                                            >
                                                *
                                            </span>

                                        </div>


                                        {selectedTechnologyIds.length >
                                            0 && (

                                            <span
                                                className="
                                                    rounded-full
                                                    border
                                                    border-purple-400/15
                                                    bg-purple-500/[0.05]
                                                    px-2
                                                    py-0.5
                                                    text-[9px]
                                                    font-black
                                                    text-purple-300
                                                "
                                            >
                                                {selectedTechnologyIds.length} ta
                                            </span>
                                        )}

                                    </div>


                                    {selectedLanguageIds.length ===
                                        0 && (

                                        <p
                                            className="
                                                mb-3
                                                text-[10px]
                                                font-semibold
                                                leading-5
                                                text-gray-600
                                            "
                                        >
                                            Avval dasturlash tilini tanlang. Shundan so‘ng mos texnologiyalar ko‘rsatiladi.
                                        </p>
                                    )}


                                    <div
                                        className="
                                            flex
                                            flex-wrap
                                            gap-2
                                        "
                                    >

                                        {stackLoading
                                            ? [
                                                1,
                                                2,
                                                3,
                                                4,
                                                5,
                                            ].map(
                                                (
                                                    item
                                                ) => (

                                                    <div
                                                        key={
                                                            item
                                                        }
                                                        className="
                                                            h-9
                                                            w-28
                                                            animate-pulse
                                                            rounded-full
                                                            bg-white/[0.04]
                                                        "
                                                    />
                                                )
                                            )
                                            : compatibleTechnologies.map(
                                                (
                                                    technology
                                                ) => {

                                                    const active =
                                                        selectedTechnologyIds
                                                            .includes(
                                                                String(
                                                                    technology.id
                                                                )
                                                            );


                                                    return (

                                                        <StackTag
                                                            key={
                                                                technology.id
                                                            }

                                                            item={
                                                                technology
                                                            }

                                                            active={
                                                                active
                                                            }

                                                            disabled={
                                                                isSubmitting
                                                            }

                                                            showCategory

                                                            onClick={() =>
                                                                handleTechnologyToggle(
                                                                    technology
                                                                )
                                                            }
                                                        />
                                                    );
                                                }
                                            )}

                                    </div>


                                    {!stackLoading
                                        &&
                                        compatibleTechnologies.length ===
                                            0 && (

                                        <p
                                            className="
                                                text-xs
                                                font-semibold
                                                text-gray-600
                                            "
                                        >
                                            Tanlangan tillar uchun mos texnologiya topilmadi.
                                        </p>
                                    )}

                                </div>

                            </section>

                        </div>


                        {/* =============================================
                            RIGHT SIDE
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

                                {/* =====================================
                                    IMAGE HEADER
                                ====================================== */}

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
                                                {images.length}
                                                /
                                                {MAX_PROJECT_IMAGES} ta rasm
                                            </p>

                                        </div>

                                    </div>


                                    {/* MULTI IMAGE BUTTON */}

                                    <label
                                        title={
                                            images.length >=
                                                MAX_PROJECT_IMAGES

                                                ? "Rasm limiti tugagan"

                                                : "Bir yoki bir nechta rasm qo‘shish"
                                        }

                                        className={`
                                            grid
                                            h-9
                                            w-9
                                            place-items-center
                                            rounded-xl
                                            border
                                            transition

                                            ${
                                                images.length >=
                                                    MAX_PROJECT_IMAGES
                                                ||
                                                isSubmitting

                                                    ? `
                                                        cursor-not-allowed
                                                        border-white/[0.05]
                                                        bg-white/[0.02]
                                                        text-gray-700
                                                        opacity-50
                                                    `

                                                    : `
                                                        cursor-pointer
                                                        border-indigo-400/15
                                                        bg-indigo-500/[0.06]
                                                        text-indigo-300

                                                        hover:border-indigo-400/30
                                                        hover:bg-indigo-500/[0.12]
                                                    `
                                            }
                                        `}
                                    >

                                        <Plus
                                            size={16}
                                        />


                                        <input
                                            type="file"

                                            multiple

                                            accept="
                                                image/jpeg,
                                                image/png,
                                                image/webp,
                                                .jpg,
                                                .jpeg,
                                                .png,
                                                .webp
                                            "

                                            disabled={
                                                images.length >=
                                                    MAX_PROJECT_IMAGES
                                                ||
                                                isSubmitting
                                            }

                                            onChange={
                                                handleMultipleImageSelect
                                            }

                                            className="
                                                hidden
                                            "
                                        />

                                    </label>

                                </div>


                                {/* =====================================
                                    LARGE MULTI UPLOAD
                                ====================================== */}

                                {images.length <
                                    MAX_PROJECT_IMAGES && (

                                    <label
                                        className="
                                            mt-5
                                            flex
                                            cursor-pointer
                                            flex-col
                                            items-center
                                            justify-center
                                            gap-2
                                            rounded-2xl
                                            border
                                            border-dashed
                                            border-indigo-400/15
                                            bg-indigo-500/[0.025]
                                            px-4
                                            py-5
                                            text-center
                                            transition

                                            hover:border-indigo-400/30
                                            hover:bg-indigo-500/[0.05]
                                        "
                                    >

                                        <UploadCloud
                                            size={24}
                                            className="
                                                text-indigo-300
                                            "
                                        />


                                        <span
                                            className="
                                                text-xs
                                                font-black
                                                text-gray-300
                                            "
                                        >
                                            Rasm tanlash
                                        </span>


                                        <span
                                            className="
                                                text-[9px]
                                                font-semibold
                                                leading-4
                                                text-gray-600
                                            "
                                        >
                                            Bir vaqtning o‘zida bir nechta JPG, PNG yoki WEBP tanlashingiz mumkin
                                        </span>


                                        <span
                                            className="
                                                rounded-full
                                                border
                                                border-white/[0.06]
                                                bg-black/10
                                                px-2.5
                                                py-1
                                                text-[9px]
                                                font-black
                                                text-gray-600
                                            "
                                        >
                                            Maksimum {MAX_PROJECT_IMAGES} ta
                                        </span>


                                        <input
                                            type="file"

                                            multiple

                                            accept="
                                                image/jpeg,
                                                image/png,
                                                image/webp,
                                                .jpg,
                                                .jpeg,
                                                .png,
                                                .webp
                                            "

                                            disabled={
                                                isSubmitting
                                            }

                                            onChange={
                                                handleMultipleImageSelect
                                            }

                                            className="
                                                hidden
                                            "
                                        />

                                    </label>
                                )}


                                {/* =====================================
                                    IMAGE CARDS
                                ====================================== */}

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
                                                        {index === 0
                                                            ? "Asosiy"
                                                            : `#${index + 1}`}
                                                    </span>


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
                                                            handleImageTitleChange(
                                                                image.id,
                                                                event.target.value
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
                                                            {image.file
                                                                ? image.file.name
                                                                : "Rasmni almashtirish"}
                                                        </span>


                                                        <input
                                                            type="file"

                                                            accept="
                                                                image/jpeg,
                                                                image/png,
                                                                image/webp,
                                                                .jpg,
                                                                .jpeg,
                                                                .png,
                                                                .webp
                                                            "

                                                            disabled={
                                                                isSubmitting
                                                            }

                                                            onChange={(
                                                                event
                                                            ) =>
                                                                handleReplaceImage(
                                                                    image.id,
                                                                    event.target.files?.[0]
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


                                    {images.length ===
                                        0 && (

                                        <div
                                            className="
                                                rounded-2xl
                                                border
                                                border-dashed
                                                border-white/[0.06]
                                                bg-black/10
                                                p-6
                                                text-center
                                            "
                                        >

                                            <FileImage
                                                size={30}
                                                className="
                                                    mx-auto
                                                    text-gray-800
                                                "
                                            />


                                            <p
                                                className="
                                                    mt-3
                                                    text-xs
                                                    font-bold
                                                    text-gray-600
                                                "
                                            >
                                                Hali rasm tanlanmagan
                                            </p>

                                        </div>
                                    )}

                                </div>


                                {/* =====================================
                                    STACK PREVIEW
                                ====================================== */}

                                {(
                                    selectedLanguages.length >
                                        0
                                    ||
                                    selectedTechnologies.length >
                                        0
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


                                        {selectedLanguages.length >
                                            0 && (

                                            <div
                                                className="
                                                    mb-3
                                                "
                                            >

                                                <p
                                                    className="
                                                        mb-2
                                                        text-[8px]
                                                        font-black
                                                        uppercase
                                                        tracking-[0.15em]
                                                        text-gray-700
                                                    "
                                                >
                                                    Tillar
                                                </p>


                                                <div
                                                    className="
                                                        flex
                                                        flex-wrap
                                                        gap-2
                                                    "
                                                >

                                                    {selectedLanguages.map(
                                                        (
                                                            language
                                                        ) => (

                                                            <StackPreviewTag
                                                                key={
                                                                    `preview-language-${language.id}`
                                                                }

                                                                item={
                                                                    language
                                                                }
                                                            />
                                                        )
                                                    )}

                                                </div>

                                            </div>
                                        )}


                                        {selectedTechnologies.length >
                                            0 && (

                                            <div>

                                                <p
                                                    className="
                                                        mb-2
                                                        text-[8px]
                                                        font-black
                                                        uppercase
                                                        tracking-[0.15em]
                                                        text-gray-700
                                                    "
                                                >
                                                    Texnologiyalar
                                                </p>


                                                <div
                                                    className="
                                                        flex
                                                        flex-wrap
                                                        gap-2
                                                    "
                                                >

                                                    {selectedTechnologies.map(
                                                        (
                                                            technology
                                                        ) => (

                                                            <StackPreviewTag
                                                                key={
                                                                    `preview-technology-${technology.id}`
                                                                }

                                                                item={
                                                                    technology
                                                                }
                                                            />
                                                        )
                                                    )}

                                                </div>

                                            </div>
                                        )}

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

                            Tillar, texnologiyalar va rasmlarni tekshirib, keyin saqlang.

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
                                    ||
                                    stackLoading
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