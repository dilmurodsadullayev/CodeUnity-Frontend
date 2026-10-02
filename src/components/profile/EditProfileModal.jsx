// src/components/profile/EditProfileModal.jsx

import React, {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    useDispatch,
} from "react-redux";

import {
    AnimatePresence,
    motion,
} from "framer-motion";

import {
    AlertTriangle,
    BriefcaseBusiness,
    Building2,
    CalendarDays,
    Camera,
    ChevronDown,
    Code2,
    FileText,
    Github,
    Image as ImageIcon,
    Link2,
    Loader2,
    Mail,
    MapPin,
    Save,
    ShieldCheck,
    Sparkles,
    Trash2,
    UploadCloud,
    UserRound,
    X,
} from "lucide-react";

import ProfileService from "../../services/profile";

import {
    getProfileSuccess,
} from "../../features/profile";

import {
    siteToast,
} from "../ui/AuthToast";

// =========================================================
// CONSTANTS
// =========================================================

const SKILL_LEVELS = [
    {
        value: "beginner",
        label: "Boshlang‘ich",
    },
    {
        value: "junior",
        label: "Junior (Kichik mutaxassis)",
    },
    {
        value: "intermediate",
        label: "O‘rta (Intermediate)",
    },
    {
        value: "advanced",
        label: "Kengaytirilgan (Advanced)",
    },
    {
        value: "senior",
        label: "Senior (Katta mutaxassis)",
    },
    {
        value: "lead",
        label: "Lead / Tech Lead (Yetakchi)",
    },
    {
        value: "expert",
        label: "Expert / Architect (Ekspert)",
    },
];

const INITIAL_FORM_DATA = {
    first_name: "",
    last_name: "",
    email: "",
    birthday: "",
    address: "",
    about_me: "",
    skill_level: "beginner",
    skills: "",
    company: "",
    position: "",
    website_url: "",
    github_url: "",
};

// =========================================================
// NORMALIZE DATE
// =========================================================

const normalizeDateForInput = (
    dateValue
) => {
    if (
        !dateValue
    ) {
        return "";
    }

    if (
        typeof dateValue ===
            "string"
        &&
        /^\d{4}-\d{2}-\d{2}$/.test(
            dateValue
        )
    ) {
        return dateValue;
    }

    if (
        typeof dateValue ===
            "string"
        &&
        dateValue.includes(
            "T"
        )
    ) {
        return (
            dateValue.split(
                "T"
            )[0]
            ||
            ""
        );
    }

    return "";
};

// =========================================================
// NORMALIZE SKILLS
// =========================================================

const normalizeSkillsForInput = (
    skills
) => {
    if (
        !skills
    ) {
        return "";
    }

    if (
        Array.isArray(
            skills
        )
    ) {
        return skills
            .map(
                (
                    skill
                ) => {
                    if (
                        typeof skill ===
                        "string"
                    ) {
                        return skill;
                    }

                    return (
                        skill?.name
                        ||
                        skill?.title
                        ||
                        ""
                    );
                }
            )
            .filter(
                Boolean
            )
            .join(
                ", "
            );
    }

    return String(
        skills
    );
};

// =========================================================
// ERROR MESSAGE
// =========================================================

const getProfileErrorMessage = (
    error,
    fallback = "Ma’lumotlarni saqlashda xatolik yuz berdi."
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
        return data.trim();
    }

    if (
        typeof data?.detail ===
            "string"
        &&
        data.detail.trim()
    ) {
        return data.detail.trim();
    }

    if (
        data?.email
    ) {
        const emailError =
            Array.isArray(
                data.email
            )
                ? data.email[0]
                : data.email;

        return `Email: ${emailError}`;
    }

    if (
        data?.birthday
    ) {
        const birthdayError =
            Array.isArray(
                data.birthday
            )
                ? data.birthday[0]
                : data.birthday;

        return (
            `Tug‘ilgan sana: ${birthdayError}`
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
                parsed?.email
            ) {
                return (
                    `Email: ${
                        Array.isArray(
                            parsed.email
                        )
                            ? parsed.email[0]
                            : parsed.email
                    }`
                );
            }

            if (
                parsed?.birthday
            ) {
                return (
                    `Tug‘ilgan sana: ${
                        Array.isArray(
                            parsed.birthday
                        )
                            ? parsed.birthday[0]
                            : parsed.birthday
                    }`
                );
            }

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
        } catch {
            return String(
                error.message
            );
        }
    }

    return fallback;
};

// =========================================================
// SECTION HEADER
// =========================================================

const SectionHeader = ({
    Icon,
    title,
    description,
}) => {
    return (
        <div
            className="
                col-span-full
                mb-1
                flex
                items-start
                gap-3
            "
        >
            <div
                className="
                    grid
                    h-10
                    w-10
                    shrink-0
                    place-items-center
                    rounded-xl
                    border
                    border-indigo-400/10
                    bg-indigo-500/[0.06]
                    text-indigo-300
                "
            >
                <Icon
                    size={17}
                />
            </div>

            <div>
                <h3
                    className="
                        font-display
                        text-sm
                        font-semibold
                        text-white
                    "
                >
                    {title}
                </h3>

                {description && (
                    <p
                        className="
                            mt-0.5
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
        </div>
    );
};

// =========================================================
// FIELD LABEL
// =========================================================

const FieldLabel = ({
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
                    tracking-[0.12em]
                    text-gray-500
                "
            >
                {children}
            </span>

            {optional && (
                <span
                    className="
                        text-[9px]
                        font-medium
                        text-gray-700
                    "
                >
                    ixtiyoriy
                </span>
            )}
        </div>
    );
};

// =========================================================
// INPUT WRAPPER
// =========================================================

const InputWrapper = ({
    Icon,
    children,
}) => {
    return (
        <div className="relative">
            {Icon && (
                <Icon
                    size={15}
                    className="
                        pointer-events-none
                        absolute
                        left-3.5
                        top-1/2
                        -translate-y-1/2
                        text-gray-600
                    "
                />
            )}

            {children}
        </div>
    );
};

// =========================================================
// EDIT PROFILE MODAL
// =========================================================

const EditProfileModal = ({
    profileData,
    isOpen,
    onClose,
}) => {
    const dispatch =
        useDispatch();

    // =====================================================
    // FORM
    // =====================================================

    const [
        formData,
        setFormData,
    ] = useState(
        INITIAL_FORM_DATA
    );

    // =====================================================
    // PROFILE IMAGE
    // =====================================================

    const [
        profileImageFile,
        setProfileImageFile,
    ] = useState(null);

    const [
        profileImagePreview,
        setProfileImagePreview,
    ] = useState(null);

    const [
        removeProfileImage,
        setRemoveProfileImage,
    ] = useState(false);

    const previewObjectUrlRef =
        useRef(null);

    const imageInputRef =
        useRef(null);

    // =====================================================
    // REQUEST
    // =====================================================

    const [
        loading,
        setLoading,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");

    // =====================================================
    // CLEAN PREVIEW OBJECT URL
    // =====================================================

    const clearLocalPreviewUrl = () => {
        if (
            previewObjectUrlRef.current
        ) {
            URL.revokeObjectURL(
                previewObjectUrlRef.current
            );

            previewObjectUrlRef.current =
                null;
        }
    };

    useEffect(
        () => {
            return () => {
                if (
                    previewObjectUrlRef.current
                ) {
                    URL.revokeObjectURL(
                        previewObjectUrlRef.current
                    );
                }
            };
        },
        []
    );

    // =====================================================
    // FILL FORM
    // =====================================================

    useEffect(
        () => {
            if (
                !isOpen
                ||
                !profileData
            ) {
                return;
            }

            clearLocalPreviewUrl();

            setFormData({
                first_name:
                    profileData.first_name
                    ??
                    "",

                last_name:
                    profileData.last_name
                    ??
                    "",

                email:
                    profileData.email
                    ??
                    "",

                birthday:
                    normalizeDateForInput(
                        profileData.birthday
                        ||
                        profileData.birth_date
                    ),

                address:
                    profileData.address
                    ??
                    "",

                about_me:
                    profileData.about_me
                    ??
                    "",

                skill_level:
                    profileData.skill_level
                    ??
                    "beginner",

                skills:
                    normalizeSkillsForInput(
                        profileData.skills
                    ),

                company:
                    profileData.company
                    ??
                    "",

                position:
                    profileData.position
                    ??
                    "",

                website_url:
                    profileData.website_url
                    ??
                    "",

                github_url:
                    profileData.github_url
                    ??
                    "",
            });

            setProfileImagePreview(
                profileData.image
                ||
                null
            );

            setProfileImageFile(
                null
            );

            setRemoveProfileImage(
                false
            );

            setError(
                ""
            );

            if (
                imageInputRef.current
            ) {
                imageInputRef
                    .current
                    .value = "";
            }
        },
        [
            isOpen,
            profileData,
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
                    !loading
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
            loading,
            onClose,
        ]
    );

    // =====================================================
    // CHANGE
    // =====================================================

    const handleChange = (
        event
    ) => {
        const {
            name,
            value,
        } = event.target;

        setFormData(
            (
                previous
            ) => ({
                ...previous,

                [name]:
                    value,
            })
        );

        setError(
            ""
        );
    };

    // =====================================================
    // IMAGE CHANGE
    // =====================================================

    const handleImageChange = (
        event
    ) => {
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
            !file.type
                ?.startsWith(
                    "image/"
                )
        ) {
            const message =
                "Faqat rasm faylini yuklash mumkin.";

            setError(
                message
            );

            siteToast.warning(
                message
            );

            event.target.value =
                "";

            return;
        }

        clearLocalPreviewUrl();

        const previewUrl =
            URL.createObjectURL(
                file
            );

        previewObjectUrlRef.current =
            previewUrl;

        setProfileImageFile(
            file
        );

        setProfileImagePreview(
            previewUrl
        );

        setRemoveProfileImage(
            false
        );

        setError(
            ""
        );
    };

    // =====================================================
    // REMOVE PROFILE IMAGE
    // =====================================================

    const handleImageRemove = () => {
        if (
            loading
        ) {
            return;
        }

        clearLocalPreviewUrl();

        setProfileImageFile(
            null
        );

        setProfileImagePreview(
            null
        );

        setRemoveProfileImage(
            true
        );

        setError(
            ""
        );

        if (
            imageInputRef.current
        ) {
            imageInputRef
                .current
                .value = "";
        }
    };

    // =====================================================
    // SKILLS ARRAY
    // =====================================================

    const buildSkillsArray = () => {
        return String(
            formData.skills
            ||
            ""
        )
            .split(
                ","
            )
            .map(
                (
                    skill
                ) => (
                    skill.trim()
                )
            )
            .filter(
                Boolean
            );
    };

    // =====================================================
    // CLOSE
    // =====================================================

    const handleClose = () => {
        if (
            loading
        ) {
            return;
        }

        onClose?.();
    };

    // =====================================================
    // BACKDROP
    // =====================================================

    const handleBackdropMouseDown = (
        event
    ) => {
        if (
            event.target ===
                event.currentTarget
            &&
            !loading
        ) {
            onClose?.();
        }
    };

    // =====================================================
    // SAVE
    // =====================================================

    const handleSave = async (
        event
    ) => {
        event.preventDefault();

        if (
            loading
        ) {
            return;
        }

        if (
            !profileData?.username
        ) {
            const message =
                "Username topilmadi. Profilni yangilab bo‘lmadi.";

            setError(
                message
            );

            siteToast.error(
                message
            );

            return;
        }

        setLoading(
            true
        );

        setError(
            ""
        );

        const toastId =
            siteToast.loading(
                "Profil saqlanmoqda..."
            );

        try {
            const hasImageUpdate =
                Boolean(
                    profileImageFile
                )
                ||
                removeProfileImage;

            let dataToSend;

            // =============================================
            // MULTIPART
            // =============================================

            if (
                hasImageUpdate
            ) {
                dataToSend =
                    new FormData();

                Object.keys(
                    formData
                ).forEach(
                    (
                        key
                    ) => {
                        if (
                            key ===
                            "skills"
                        ) {
                            return;
                        }

                        dataToSend.append(
                            key,
                            formData[key]
                            ??
                            ""
                        );
                    }
                );

                buildSkillsArray()
                    .forEach(
                        (
                            skill
                        ) => {
                            dataToSend.append(
                                "skills",
                                skill
                            );
                        }
                    );

                if (
                    profileImageFile
                ) {
                    dataToSend.append(
                        "image",
                        profileImageFile
                    );
                } else if (
                    removeProfileImage
                ) {
                    // Existing backend flow bilan
                    // backward compatible.
                    dataToSend.append(
                        "image",
                        ""
                    );
                }
            } else {
                // =========================================
                // JSON
                // =========================================

                dataToSend = {
                    ...formData,

                    birthday:
                        formData.birthday
                        ||
                        null,

                    email:
                        formData.email
                        ||
                        "",

                    skills:
                        buildSkillsArray(),
                };
            }

            const response =
                await ProfileService
                    .updateProfile(
                        profileData.username,
                        dataToSend
                    );

            dispatch(
                getProfileSuccess(
                    response
                )
            );

            siteToast.update(
                toastId,
                "success",
                "Profil muvaffaqiyatli saqlandi."
            );

            clearLocalPreviewUrl();

            onClose?.();
        } catch (
            saveError
        ) {
            console.error(
                "Profilni tahrirlashda xato:",
                saveError
            );

            const message =
                getProfileErrorMessage(
                    saveError
                );

            setError(
                message
            );

            siteToast.update(
                toastId,
                "error",
                message
            );
        } finally {
            setLoading(
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
    // JSX
    // =====================================================

    return (
        <AnimatePresence>
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
                onMouseDown={
                    handleBackdropMouseDown
                }
                className="
                    fixed
                    inset-0
                    z-[1000]
                    flex
                    items-center
                    justify-center
                    overflow-y-auto
                    bg-black/80
                    p-4
                    font-sans
                    backdrop-blur-md
                    sm:p-6
                "
            >
                {/* =========================================
                    BACKGROUND GLOW
                ========================================== */}

                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        fixed
                        left-1/2
                        top-1/2
                        h-[620px]
                        w-[620px]
                        -translate-x-1/2
                        -translate-y-1/2
                        rounded-full
                        bg-indigo-600/[0.07]
                        blur-[160px]
                    "
                />

                {/* =========================================
                    MODAL
                ========================================== */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 24,
                        scale: 0.98,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                    }}
                    exit={{
                        opacity: 0,
                        y: 16,
                        scale: 0.985,
                    }}
                    transition={{
                        duration: 0.2,
                    }}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="edit-profile-title"
                    onMouseDown={(
                        event
                    ) => {
                        event.stopPropagation();
                    }}
                    className="
                        relative
                        my-auto
                        max-h-[94vh]
                        w-full
                        max-w-4xl
                        overflow-y-auto
                        rounded-[30px]
                        border
                        border-white/[0.08]
                        bg-[#090c12]/95
                        shadow-[0_35px_120px_rgba(0,0,0,0.65)]
                        backdrop-blur-2xl
                    "
                >
                    {/* =====================================
                        HEADER
                    ====================================== */}

                    <div
                        className="
                            sticky
                            top-0
                            z-30
                            flex
                            items-center
                            justify-between
                            gap-4
                            border-b
                            border-white/[0.06]
                            bg-[#090c12]/90
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
                            "
                        >
                            <div
                                className="
                                    grid
                                    h-11
                                    w-11
                                    shrink-0
                                    place-items-center
                                    rounded-2xl
                                    border
                                    border-indigo-400/15
                                    bg-indigo-500/[0.07]
                                    text-indigo-300
                                "
                            >
                                <UserRound
                                    size={19}
                                />
                            </div>

                            <div className="min-w-0">
                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                    "
                                >
                                    <h2
                                        id="edit-profile-title"
                                        className="
                                            truncate
                                            font-display
                                            text-lg
                                            font-semibold
                                            text-white
                                            sm:text-xl
                                        "
                                    >
                                        Profilni tahrirlash
                                    </h2>

                                    <Sparkles
                                        size={14}
                                        className="
                                            hidden
                                            text-indigo-400/70
                                            sm:block
                                        "
                                    />
                                </div>

                                <p
                                    className="
                                        mt-0.5
                                        truncate
                                        text-[10px]
                                        font-medium
                                        text-gray-600
                                        sm:text-xs
                                    "
                                >
                                    Shaxsiy va kasbiy ma’lumotlaringizni yangilang
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={
                                handleClose
                            }
                            disabled={
                                loading
                            }
                            aria-label="Profil modalini yopish"
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
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                            "
                        >
                            <X
                                size={18}
                            />
                        </button>
                    </div>

                    {/* =====================================
                        FORM
                    ====================================== */}

                    <form
                        onSubmit={
                            handleSave
                        }
                        className="
                            space-y-8
                            p-5
                            sm:p-6
                        "
                    >
                        {/* =================================
                            PROFILE IMAGE
                        ================================== */}

                        <section
                            className="
                                rounded-3xl
                                border
                                border-white/[0.06]
                                bg-white/[0.018]
                                p-5
                            "
                        >
                            <SectionHeader
                                Icon={
                                    Camera
                                }
                                title="Profil rasmi"
                                description="Profilingizda ko‘rinadigan asosiy avatar."
                            />

                            <div
                                className="
                                    mt-5
                                    flex
                                    flex-col
                                    items-center
                                    gap-5
                                    sm:flex-row
                                    sm:items-center
                                "
                            >
                                <div
                                    className="
                                        relative
                                        h-28
                                        w-28
                                        shrink-0
                                        overflow-hidden
                                        rounded-full
                                        border
                                        border-indigo-400/20
                                        bg-[#10151f]
                                        shadow-xl
                                        shadow-black/30
                                    "
                                >
                                    {profileImagePreview ? (
                                        <img
                                            src={
                                                profileImagePreview
                                            }
                                            alt="Profil rasmi"
                                            className="
                                                h-full
                                                w-full
                                                object-cover
                                            "
                                        />
                                    ) : (
                                        <div
                                            className="
                                                grid
                                                h-full
                                                w-full
                                                place-items-center
                                                text-gray-700
                                            "
                                        >
                                            <UserRound
                                                size={38}
                                            />
                                        </div>
                                    )}

                                    {loading && (
                                        <div
                                            className="
                                                absolute
                                                inset-0
                                                grid
                                                place-items-center
                                                bg-black/65
                                                backdrop-blur-sm
                                            "
                                        >
                                            <Loader2
                                                size={22}
                                                className="
                                                    animate-spin
                                                    text-indigo-300
                                                "
                                            />
                                        </div>
                                    )}
                                </div>

                                <div
                                    className="
                                        flex
                                        flex-1
                                        flex-col
                                        items-center
                                        sm:items-start
                                    "
                                >
                                    <p
                                        className="
                                            text-center
                                            text-xs
                                            font-medium
                                            leading-6
                                            text-gray-500
                                            sm:text-left
                                        "
                                    >
                                        Yangi profil rasmi tanlang yoki joriy rasmni olib tashlang.
                                    </p>

                                    <input
                                        ref={
                                            imageInputRef
                                        }
                                        type="file"
                                        id="profileImage"
                                        hidden
                                        accept="image/*"
                                        disabled={
                                            loading
                                        }
                                        onChange={
                                            handleImageChange
                                        }
                                    />

                                    <div
                                        className="
                                            mt-3
                                            flex
                                            flex-wrap
                                            items-center
                                            justify-center
                                            gap-2
                                            sm:justify-start
                                        "
                                    >
                                        <label
                                            htmlFor="profileImage"
                                            className={`
                                                inline-flex
                                                items-center
                                                justify-center
                                                gap-2
                                                rounded-xl
                                                border
                                                border-indigo-400/15
                                                bg-indigo-500/[0.07]
                                                px-4
                                                py-2.5
                                                font-display
                                                text-[10px]
                                                font-semibold
                                                text-indigo-300
                                                transition
                                                hover:bg-indigo-500/[0.12]

                                                ${
                                                    loading
                                                        ? "pointer-events-none opacity-40"
                                                        : "cursor-pointer"
                                                }
                                            `}
                                        >
                                            <UploadCloud
                                                size={14}
                                            />

                                            Rasm tanlash
                                        </label>

                                        {(
                                            profileImagePreview
                                            ||
                                            profileImageFile
                                        ) && (
                                            <button
                                                type="button"
                                                onClick={
                                                    handleImageRemove
                                                }
                                                disabled={
                                                    loading
                                                }
                                                className="
                                                    inline-flex
                                                    items-center
                                                    justify-center
                                                    gap-2
                                                    rounded-xl
                                                    border
                                                    border-red-400/15
                                                    bg-red-500/[0.05]
                                                    px-4
                                                    py-2.5
                                                    font-display
                                                    text-[10px]
                                                    font-semibold
                                                    text-red-300
                                                    transition
                                                    hover:bg-red-500/10
                                                    disabled:cursor-not-allowed
                                                    disabled:opacity-40
                                                "
                                            >
                                                <Trash2
                                                    size={14}
                                                />

                                                Olib tashlash
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* =================================
                            PERSONAL INFO
                        ================================== */}

                        <section
                            className="
                                grid
                                grid-cols-1
                                gap-4
                                rounded-3xl
                                border
                                border-white/[0.06]
                                bg-white/[0.018]
                                p-5
                                md:grid-cols-2
                            "
                        >
                            <SectionHeader
                                Icon={
                                    UserRound
                                }
                                title="Shaxsiy ma’lumotlar"
                                description="Profilingizning asosiy ma’lumotlari."
                            />

                            {/* FIRST NAME */}

                            <div>
                                <FieldLabel
                                    optional
                                >
                                    Ism
                                </FieldLabel>

                                <InputWrapper
                                    Icon={
                                        UserRound
                                    }
                                >
                                    <input
                                        type="text"
                                        name="first_name"
                                        autoComplete="given-name"
                                        placeholder="Ism"
                                        value={
                                            formData.first_name
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={
                                            loading
                                        }
                                        className="
                                            w-full
                                            rounded-2xl
                                            border
                                            border-white/[0.07]
                                            bg-white/[0.025]
                                            py-3.5
                                            pl-10
                                            pr-4
                                            text-sm
                                            font-medium
                                            text-white
                                            outline-none
                                            transition
                                            placeholder:text-gray-700
                                            focus:border-indigo-400/30
                                            focus:ring-2
                                            focus:ring-indigo-500/[0.05]
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        "
                                    />
                                </InputWrapper>
                            </div>

                            {/* LAST NAME */}

                            <div>
                                <FieldLabel
                                    optional
                                >
                                    Familiya
                                </FieldLabel>

                                <InputWrapper
                                    Icon={
                                        UserRound
                                    }
                                >
                                    <input
                                        type="text"
                                        name="last_name"
                                        autoComplete="family-name"
                                        placeholder="Familiya"
                                        value={
                                            formData.last_name
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={
                                            loading
                                        }
                                        className="
                                            w-full
                                            rounded-2xl
                                            border
                                            border-white/[0.07]
                                            bg-white/[0.025]
                                            py-3.5
                                            pl-10
                                            pr-4
                                            text-sm
                                            font-medium
                                            text-white
                                            outline-none
                                            transition
                                            placeholder:text-gray-700
                                            focus:border-indigo-400/30
                                            focus:ring-2
                                            focus:ring-indigo-500/[0.05]
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        "
                                    />
                                </InputWrapper>
                            </div>

                            {/* EMAIL */}

                            <div
                                className="
                                    md:col-span-2
                                "
                            >
                                <FieldLabel
                                    optional
                                >
                                    Email
                                </FieldLabel>

                                <InputWrapper
                                    Icon={
                                        Mail
                                    }
                                >
                                    <input
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        placeholder="example@gmail.com"
                                        value={
                                            formData.email
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={
                                            loading
                                        }
                                        className="
                                            w-full
                                            rounded-2xl
                                            border
                                            border-white/[0.07]
                                            bg-white/[0.025]
                                            py-3.5
                                            pl-10
                                            pr-4
                                            text-sm
                                            font-medium
                                            text-white
                                            outline-none
                                            transition
                                            placeholder:text-gray-700
                                            focus:border-indigo-400/30
                                            focus:ring-2
                                            focus:ring-indigo-500/[0.05]
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        "
                                    />
                                </InputWrapper>

                                <p
                                    className="
                                        mt-1.5
                                        text-[10px]
                                        font-medium
                                        text-gray-700
                                    "
                                >
                                    Profil va tizim xabarlari uchun ishlatiladi.
                                </p>
                            </div>

                            {/* BIRTHDAY */}

                            <div>
                                <FieldLabel
                                    optional
                                >
                                    Tug‘ilgan sana
                                </FieldLabel>

                                <InputWrapper
                                    Icon={
                                        CalendarDays
                                    }
                                >
                                    <input
                                        type="date"
                                        name="birthday"
                                        value={
                                            formData.birthday
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={
                                            loading
                                        }
                                        className="
                                            w-full
                                            rounded-2xl
                                            border
                                            border-white/[0.07]
                                            bg-white/[0.025]
                                            py-3.5
                                            pl-10
                                            pr-4
                                            text-sm
                                            font-medium
                                            text-white
                                            outline-none
                                            transition
                                            focus:border-indigo-400/30
                                            focus:ring-2
                                            focus:ring-indigo-500/[0.05]
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                            [color-scheme:dark]
                                        "
                                    />
                                </InputWrapper>
                            </div>

                            {/* ADDRESS */}

                            <div>
                                <FieldLabel
                                    optional
                                >
                                    Manzil
                                </FieldLabel>

                                <InputWrapper
                                    Icon={
                                        MapPin
                                    }
                                >
                                    <input
                                        type="text"
                                        name="address"
                                        autoComplete="address-level2"
                                        placeholder="Masalan: Urganch, Uzbekistan"
                                        value={
                                            formData.address
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={
                                            loading
                                        }
                                        className="
                                            w-full
                                            rounded-2xl
                                            border
                                            border-white/[0.07]
                                            bg-white/[0.025]
                                            py-3.5
                                            pl-10
                                            pr-4
                                            text-sm
                                            font-medium
                                            text-white
                                            outline-none
                                            transition
                                            placeholder:text-gray-700
                                            focus:border-indigo-400/30
                                            focus:ring-2
                                            focus:ring-indigo-500/[0.05]
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        "
                                    />
                                </InputWrapper>
                            </div>

                            {/* ABOUT */}

                            <div
                                className="
                                    md:col-span-2
                                "
                            >
                                <FieldLabel
                                    optional
                                >
                                    Men haqimda
                                </FieldLabel>

                                <div className="relative">
                                    <FileText
                                        size={15}
                                        className="
                                            pointer-events-none
                                            absolute
                                            left-3.5
                                            top-4
                                            text-gray-600
                                        "
                                    />

                                    <textarea
                                        name="about_me"
                                        placeholder="O‘zingiz haqingizda qisqacha..."
                                        value={
                                            formData.about_me
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        rows={5}
                                        disabled={
                                            loading
                                        }
                                        className="
                                            min-h-[130px]
                                            w-full
                                            resize-y
                                            rounded-2xl
                                            border
                                            border-white/[0.07]
                                            bg-white/[0.025]
                                            py-3.5
                                            pl-10
                                            pr-4
                                            text-sm
                                            font-medium
                                            leading-6
                                            text-white
                                            outline-none
                                            transition
                                            placeholder:text-gray-700
                                            focus:border-indigo-400/30
                                            focus:ring-2
                                            focus:ring-indigo-500/[0.05]
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        "
                                    />
                                </div>
                            </div>
                        </section>

                        {/* =================================
                            PROFESSIONAL INFO
                        ================================== */}

                        <section
                            className="
                                grid
                                grid-cols-1
                                gap-4
                                rounded-3xl
                                border
                                border-white/[0.06]
                                bg-white/[0.018]
                                p-5
                                md:grid-cols-2
                            "
                        >
                            <SectionHeader
                                Icon={
                                    Code2
                                }
                                title="Kasbiy ma’lumotlar"
                                description="Tajriba darajangiz va texnik yo‘nalishingiz."
                            />

                            {/* LEVEL */}

                            <div>
                                <FieldLabel>
                                    Daraja
                                </FieldLabel>

                                <div className="relative">
                                    <Code2
                                        size={15}
                                        className="
                                            pointer-events-none
                                            absolute
                                            left-3.5
                                            top-1/2
                                            -translate-y-1/2
                                            text-gray-600
                                        "
                                    />

                                    <select
                                        name="skill_level"
                                        value={
                                            formData.skill_level
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={
                                            loading
                                        }
                                        className="
                                            w-full
                                            appearance-none
                                            rounded-2xl
                                            border
                                            border-white/[0.07]
                                            bg-[#0d1119]
                                            py-3.5
                                            pl-10
                                            pr-10
                                            text-sm
                                            font-medium
                                            text-white
                                            outline-none
                                            transition
                                            focus:border-indigo-400/30
                                            focus:ring-2
                                            focus:ring-indigo-500/[0.05]
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        "
                                    >
                                        {SKILL_LEVELS.map(
                                            (
                                                level
                                            ) => (
                                                <option
                                                    key={
                                                        level.value
                                                    }
                                                    value={
                                                        level.value
                                                    }
                                                >
                                                    {
                                                        level.label
                                                    }
                                                </option>
                                            )
                                        )}
                                    </select>

                                    <ChevronDown
                                        size={15}
                                        className="
                                            pointer-events-none
                                            absolute
                                            right-3.5
                                            top-1/2
                                            -translate-y-1/2
                                            text-gray-600
                                        "
                                    />
                                </div>
                            </div>

                            {/* COMPANY */}

                            <div>
                                <FieldLabel
                                    optional
                                >
                                    Kompaniya
                                </FieldLabel>

                                <InputWrapper
                                    Icon={
                                        Building2
                                    }
                                >
                                    <input
                                        type="text"
                                        name="company"
                                        autoComplete="organization"
                                        placeholder="Kompaniya"
                                        value={
                                            formData.company
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={
                                            loading
                                        }
                                        className="
                                            w-full
                                            rounded-2xl
                                            border
                                            border-white/[0.07]
                                            bg-white/[0.025]
                                            py-3.5
                                            pl-10
                                            pr-4
                                            text-sm
                                            font-medium
                                            text-white
                                            outline-none
                                            transition
                                            placeholder:text-gray-700
                                            focus:border-indigo-400/30
                                            focus:ring-2
                                            focus:ring-indigo-500/[0.05]
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        "
                                    />
                                </InputWrapper>
                            </div>

                            {/* POSITION */}

                            <div>
                                <FieldLabel
                                    optional
                                >
                                    Lavozim
                                </FieldLabel>

                                <InputWrapper
                                    Icon={
                                        BriefcaseBusiness
                                    }
                                >
                                    <input
                                        type="text"
                                        name="position"
                                        autoComplete="organization-title"
                                        placeholder="Backend Developer"
                                        value={
                                            formData.position
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={
                                            loading
                                        }
                                        className="
                                            w-full
                                            rounded-2xl
                                            border
                                            border-white/[0.07]
                                            bg-white/[0.025]
                                            py-3.5
                                            pl-10
                                            pr-4
                                            text-sm
                                            font-medium
                                            text-white
                                            outline-none
                                            transition
                                            placeholder:text-gray-700
                                            focus:border-indigo-400/30
                                            focus:ring-2
                                            focus:ring-indigo-500/[0.05]
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        "
                                    />
                                </InputWrapper>
                            </div>

                            {/* SKILLS */}

                            <div>
                                <FieldLabel
                                    optional
                                >
                                    Ko‘nikmalar
                                </FieldLabel>

                                <InputWrapper
                                    Icon={
                                        Code2
                                    }
                                >
                                    <input
                                        type="text"
                                        name="skills"
                                        placeholder="Python, Django, React, Docker"
                                        value={
                                            formData.skills
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={
                                            loading
                                        }
                                        className="
                                            w-full
                                            rounded-2xl
                                            border
                                            border-white/[0.07]
                                            bg-white/[0.025]
                                            py-3.5
                                            pl-10
                                            pr-4
                                            text-sm
                                            font-medium
                                            text-white
                                            outline-none
                                            transition
                                            placeholder:text-gray-700
                                            focus:border-indigo-400/30
                                            focus:ring-2
                                            focus:ring-indigo-500/[0.05]
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        "
                                    />
                                </InputWrapper>

                                <p
                                    className="
                                        mt-1.5
                                        text-[10px]
                                        font-medium
                                        text-gray-700
                                    "
                                >
                                    Ko‘nikmalarni vergul bilan ajrating.
                                </p>
                            </div>
                        </section>

                        {/* =================================
                            LINKS
                        ================================== */}

                        <section
                            className="
                                grid
                                grid-cols-1
                                gap-4
                                rounded-3xl
                                border
                                border-white/[0.06]
                                bg-white/[0.018]
                                p-5
                                md:grid-cols-2
                            "
                        >
                            <SectionHeader
                                Icon={
                                    Link2
                                }
                                title="Havolalar"
                                description="Portfolio va GitHub profilingiz."
                            />

                            {/* WEBSITE */}

                            <div>
                                <FieldLabel
                                    optional
                                >
                                    Veb-sayt
                                </FieldLabel>

                                <InputWrapper
                                    Icon={
                                        Link2
                                    }
                                >
                                    <input
                                        type="text"
                                        name="website_url"
                                        inputMode="url"
                                        placeholder="https://dimodev.uz"
                                        value={
                                            formData.website_url
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={
                                            loading
                                        }
                                        className="
                                            w-full
                                            rounded-2xl
                                            border
                                            border-white/[0.07]
                                            bg-white/[0.025]
                                            py-3.5
                                            pl-10
                                            pr-4
                                            text-sm
                                            font-medium
                                            text-white
                                            outline-none
                                            transition
                                            placeholder:text-gray-700
                                            focus:border-indigo-400/30
                                            focus:ring-2
                                            focus:ring-indigo-500/[0.05]
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        "
                                    />
                                </InputWrapper>
                            </div>

                            {/* GITHUB */}

                            <div>
                                <FieldLabel
                                    optional
                                >
                                    GitHub
                                </FieldLabel>

                                <InputWrapper
                                    Icon={
                                        Github
                                    }
                                >
                                    <input
                                        type="text"
                                        name="github_url"
                                        inputMode="url"
                                        placeholder="github.com/username yoki username"
                                        value={
                                            formData.github_url
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={
                                            loading
                                        }
                                        className="
                                            w-full
                                            rounded-2xl
                                            border
                                            border-white/[0.07]
                                            bg-white/[0.025]
                                            py-3.5
                                            pl-10
                                            pr-4
                                            text-sm
                                            font-medium
                                            text-white
                                            outline-none
                                            transition
                                            placeholder:text-gray-700
                                            focus:border-indigo-400/30
                                            focus:ring-2
                                            focus:ring-indigo-500/[0.05]
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        "
                                    />
                                </InputWrapper>
                            </div>
                        </section>

                        {/* =================================
                            COVER IMAGE INFO
                        ================================== */}

                        <div
                            className="
                                flex
                                items-start
                                gap-3
                                rounded-2xl
                                border
                                border-cyan-400/10
                                bg-cyan-500/[0.035]
                                p-4
                            "
                        >
                            <div
                                className="
                                    grid
                                    h-9
                                    w-9
                                    shrink-0
                                    place-items-center
                                    rounded-xl
                                    border
                                    border-cyan-400/10
                                    bg-cyan-500/[0.05]
                                    text-cyan-300
                                "
                            >
                                <ImageIcon
                                    size={16}
                                />
                            </div>

                            <div>
                                <div
                                    className="
                                        flex
                                        flex-wrap
                                        items-center
                                        gap-2
                                    "
                                >
                                    <p
                                        className="
                                            font-display
                                            text-[10px]
                                            font-semibold
                                            text-gray-300
                                        "
                                    >
                                        Fon rasmi
                                    </p>

                                    <code
                                        className="
                                            rounded-md
                                            bg-black/25
                                            px-1.5
                                            py-0.5
                                            text-[9px]
                                            text-cyan-300
                                        "
                                    >
                                        cover_image
                                    </code>
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
                                    Fon rasmi profil sahifasidagi alohida
                                    “Fon rasmi” tugmasi orqali tahrirlanadi.
                                </p>
                            </div>
                        </div>

                        {/* =================================
                            ERROR
                        ================================== */}

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{
                                        opacity: 0,
                                        y: -5,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    exit={{
                                        opacity: 0,
                                        y: -5,
                                    }}
                                    role="alert"
                                    className="
                                        flex
                                        items-start
                                        gap-3
                                        rounded-2xl
                                        border
                                        border-red-400/15
                                        bg-red-500/[0.05]
                                        p-4
                                        text-xs
                                        font-medium
                                        leading-5
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
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* =================================
                            ACTIONS
                        ================================== */}

                        <div
                            className="
                                sticky
                                bottom-0
                                z-20
                                -mx-5
                                -mb-5
                                flex
                                flex-col-reverse
                                gap-3
                                border-t
                                border-white/[0.06]
                                bg-[#090c12]/90
                                px-5
                                py-4
                                backdrop-blur-xl
                                sm:-mx-6
                                sm:-mb-6
                                sm:flex-row
                                sm:justify-end
                                sm:px-6
                            "
                        >
                            <button
                                type="button"
                                onClick={
                                    handleClose
                                }
                                disabled={
                                    loading
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
                                    loading
                                }
                                className="
                                    inline-flex
                                    min-w-[150px]
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-indigo-400/20
                                    bg-indigo-600
                                    px-5
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
                                "
                            >
                                {loading ? (
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

                    {/* =====================================
                        PROCESS BAR
                    ====================================== */}

                    {loading && (
                        <div
                            className="
                                pointer-events-none
                                absolute
                                inset-x-0
                                top-0
                                z-50
                                h-[2px]
                                overflow-hidden
                                bg-white/[0.04]
                            "
                        >
                            <motion.div
                                initial={{
                                    x: "-100%",
                                }}
                                animate={{
                                    x: "350%",
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                                className="
                                    h-full
                                    w-1/3
                                    bg-gradient-to-r
                                    from-transparent
                                    via-indigo-400
                                    to-transparent
                                "
                            />
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default EditProfileModal;