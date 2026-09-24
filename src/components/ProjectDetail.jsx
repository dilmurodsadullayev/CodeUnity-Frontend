// src/components/ProjectDetail.jsx

import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    AlertTriangle,
    Code2,
    Eye,
    ExternalLink,
    Github,
    ImageIcon,
    Loader2,
    MessageCircle,
    Pencil,
    Rocket,
    Settings2,
    ShieldCheck,
    Sparkles,
    Star,
    Trash2,
    UserRound,
} from "lucide-react";

import {
    getProjectDetailFailure,
    getProjectDetailStart,
    getProjectDetailSuccess,
} from "../features/projects";

import ProjectService from "../services/project";

import {
    BACKEND_URL,
} from "../services/config";

import UserImage from "../assests/userImage.jpeg";

import ProjectDiscussion from "./ProjectDiscussion";

import ProjectCollaboration from "./ProjectCollaboration";

import ProjectLoadingSkeleton from "./ProjectLoadingSkeleton";

import DeleteConfirmationModal from "./DeleteConfirmationModal";

import ProjectBoost from "./ProjectBoost";

import ProjectFormModal from "./projects/CreateProjectModal";

import {
    siteToast,
} from "./ui/AuthToast";


// =========================================================
// SELECTOR
// =========================================================

const selectProjectState = (
    state
) => state.project;


// =========================================================
// SAFE NUMBER
// =========================================================

const safeNumber = (
    value
) => {
    const number =
        Number(
            value
        );


    if (
        !Number.isFinite(
            number
        )
    ) {
        return 0;
    }


    return Math.max(
        0,
        number
    );
};


// =========================================================
// ERROR MESSAGE
// =========================================================

const getErrorMessage = (
    error,
    fallback = "Xatolik yuz berdi."
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


            if (
                parsed?.message
            ) {
                return String(
                    parsed.message
                );
            }


            if (
                parsed?.error
            ) {
                return String(
                    parsed.error
                );
            }


            if (
                parsed
                &&
                typeof parsed ===
                "object"
            ) {
                const firstValue =
                    Object.values(
                        parsed
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

        } catch {
            return String(
                error.message
            );
        }
    }


    return fallback;
};


// =========================================================
// FEATURES
// =========================================================

const formatFeatureList = (
    featuresString
) => {
    if (
        !featuresString
    ) {
        return [];
    }


    return String(
        featuresString
    )
        .split(
            /,\s*|\n/
        )
        .map(
            (
                item
            ) =>
                item.trim()
        )
        .filter(
            Boolean
        );
};


// =========================================================
// IMAGE URL
// =========================================================

const getImageUrl = (
    image
) => {
    if (
        !image
    ) {
        return UserImage;
    }


    const value =
        String(
            image
        ).trim();


    if (
        !value
    ) {
        return UserImage;
    }


    if (
        /^https?:\/\//i.test(
            value
        )
    ) {
        return value;
    }


    if (
        value.startsWith(
            "blob:"
        )
        ||
        value.startsWith(
            "data:"
        )
    ) {
        return value;
    }


    const baseUrl =
        String(
            BACKEND_URL || ""
        ).replace(
            /\/+$/,
            ""
        );


    const path =
        value.startsWith(
            "/"
        )
            ? value
            : `/${value}`;


    return `${baseUrl}${path}`;
};


// =========================================================
// PROJECT TITLE
// =========================================================

const getProjectTitle = (
    project
) => {
    return (
        project?.name
        ||
        project?.title
        ||
        "Noma’lum loyiha"
    );
};


// =========================================================
// AUTHOR NAME
// =========================================================

const getAuthorName = (
    author
) => {
    const fullName =
        `${
            author?.first_name
            ||
            ""
        } ${
            author?.last_name
            ||
            ""
        }`
            .trim();


    return (
        fullName
        ||
        author?.username
        ||
        "Noma’lum foydalanuvchi"
    );
};


// =========================================================
// STAT PILL
// =========================================================

const StatPill = ({
    icon: Icon,
    label,
    value,
    tone = "default",
}) => {
    const tones = {
        default:
            "text-gray-300",

        yellow:
            "text-yellow-300",

        cyan:
            "text-cyan-300",

        indigo:
            "text-indigo-300",
    };


    return (
        <div
            className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-white/[0.07]
                bg-white/[0.025]
                px-3.5
                py-2.5
                text-xs
                font-bold
                shadow-lg
                shadow-black/10
            "
        >
            <Icon
                size={15}
                className={
                    tones[tone]
                    ||
                    tones.default
                }
            />


            <span
                className="
                    font-black
                    text-white
                "
            >
                {value}
            </span>


            <span
                className="
                    text-gray-600
                "
            >
                {label}
            </span>
        </div>
    );
};


// =========================================================
// TECH BADGE
// =========================================================

const TechBadge = ({
    children,
    type = "indigo",
}) => {
    const classes = {
        blue:
            "border-blue-400/25 bg-blue-500/[0.08] text-blue-300",

        purple:
            "border-purple-400/25 bg-purple-500/[0.08] text-purple-300",

        indigo:
            "border-indigo-400/25 bg-indigo-500/[0.08] text-indigo-300",
    };


    return (
        <span
            className={`
                inline-flex
                items-center
                rounded-full
                border
                px-3
                py-1.5
                text-[10px]
                font-black
                uppercase
                tracking-wider

                ${
                    classes[type]
                    ||
                    classes.indigo
                }
            `}
        >
            {children}
        </span>
    );
};


// =========================================================
// OWNER CONTROLS
// =========================================================

const OwnerControls = ({
    onEdit,
    onDelete,
    isUpdating,
    isDeleting,
}) => {
    const busy =
        isUpdating
        ||
        isDeleting;


    return (
        <div
            className="
                inline-flex
                max-w-full
                items-center
                gap-1.5
                rounded-2xl
                border
                border-white/[0.07]
                bg-black/20
                p-1.5
                shadow-lg
                shadow-black/20
                backdrop-blur-xl
            "
        >

            {/* =============================================
                OWNER LABEL
            ============================================== */}

            <div
                className="
                    hidden
                    items-center
                    gap-2
                    px-3
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.15em]
                    text-gray-600

                    md:flex
                "
            >
                <Settings2
                    size={13}
                    className="
                        text-indigo-400
                    "
                />

                Owner tools
            </div>


            <span
                className="
                    hidden
                    h-6
                    w-px
                    bg-white/[0.07]

                    md:block
                "
            />


            {/* =============================================
                EDIT
            ============================================== */}

            <button
                type="button"
                onClick={
                    onEdit
                }
                disabled={
                    busy
                }
                className="
                    group
                    inline-flex
                    min-h-[38px]
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-transparent
                    px-3.5
                    py-2
                    text-xs
                    font-black
                    text-indigo-300
                    transition-all
                    duration-200

                    hover:border-indigo-400/20
                    hover:bg-indigo-500/[0.08]
                    hover:text-indigo-200

                    active:scale-[0.96]

                    disabled:cursor-not-allowed
                    disabled:opacity-40
                "
            >
                {isUpdating ? (
                    <Loader2
                        size={15}
                        className="
                            animate-spin
                        "
                    />
                ) : (
                    <Pencil
                        size={15}
                        className="
                            transition-transform
                            group-hover:-rotate-6
                        "
                    />
                )}


                <span>
                    {isUpdating
                        ? "Saqlanmoqda"
                        : "Tahrirlash"}
                </span>
            </button>


            {/* =============================================
                DELETE

                Bu tugma API ni to'g'ridan-to'g'ri
                chaqirmaydi.

                Faqat confirmation modalni ochadi.
            ============================================== */}

            <button
                type="button"
                onClick={
                    onDelete
                }
                disabled={
                    busy
                }
                className="
                    group
                    inline-flex
                    min-h-[38px]
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-transparent
                    px-3.5
                    py-2
                    text-xs
                    font-black
                    text-red-400
                    transition-all
                    duration-200

                    hover:border-red-400/20
                    hover:bg-red-500/[0.08]
                    hover:text-red-300

                    active:scale-[0.96]

                    disabled:cursor-not-allowed
                    disabled:opacity-40
                "
            >
                {isDeleting ? (
                    <Loader2
                        size={15}
                        className="
                            animate-spin
                        "
                    />
                ) : (
                    <Trash2
                        size={15}
                        className="
                            transition-transform
                            group-hover:rotate-6
                        "
                    />
                )}


                <span>
                    {isDeleting
                        ? "O‘chirilmoqda"
                        : "O‘chirish"}
                </span>
            </button>

        </div>
    );
};


// =========================================================
// PROJECT DETAIL
// =========================================================

const ProjectDetail = () => {

    // =====================================================
    // ROUTER
    // =====================================================

    const {
        projectId,
    } = useParams();


    const navigate =
        useNavigate();


    const dispatch =
        useDispatch();


    // =====================================================
    // AUTH
    // =====================================================

    const {
        isLoggedIn,
        user,
    } = useSelector(
        (
            state
        ) =>
            state.auth
    );


    // =====================================================
    // PROJECT REDUX
    // =====================================================

    const {
        projectDetail,
        projectDetailIsLoading,
        projectDetailError,
    } = useSelector(
        selectProjectState
    );


    // =====================================================
    // LOCAL STATE
    // =====================================================

    const [
        activeIndex,
        setActiveIndex,
    ] = useState(
        0
    );


    const [
        isStarred,
        setIsStarred,
    ] = useState(
        false
    );


    const [
        isStarLoading,
        setIsStarLoading,
    ] = useState(
        false
    );


    const [
        isEditModalOpen,
        setIsEditModalOpen,
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
        isDeleting,
        setIsDeleting,
    ] = useState(
        false
    );


    const [
        isUpdating,
        setIsUpdating,
    ] = useState(
        false
    );


    // =====================================================
    // PROJECT DATA
    // =====================================================

    const projectData =
        projectDetail
        ||
        {};


    const projectImages =
        Array.isArray(
            projectData?.images
        )
            ? projectData.images
            : [];


    const author =
        projectData?.user
        ||
        {};


    const projectTitle =
        getProjectTitle(
            projectData
        );


    const authorImage =
        getImageUrl(
            author?.image
        );


    const featuresList =
        useMemo(
            () => {
                return formatFeatureList(
                    projectData
                        ?.main_features
                );
            },
            [
                projectData
                    ?.main_features,
            ]
        );


    // =====================================================
    // OWNER
    //
    // ID asosiy.
    // Username fallback.
    // =====================================================

    const isOwner =
        useMemo(
            () => {
                if (
                    user?.id
                    &&
                    author?.id
                ) {
                    return (
                        Number(
                            user.id
                        )
                        ===
                        Number(
                            author.id
                        )
                    );
                }


                if (
                    user?.username
                    &&
                    author?.username
                ) {
                    return (
                        String(
                            user.username
                        )
                        ===
                        String(
                            author.username
                        )
                    );
                }


                return false;
            },
            [
                user?.id,
                user?.username,
                author?.id,
                author?.username,
            ]
        );


    // =====================================================
    // STATS
    // =====================================================

    const starsCount =
        safeNumber(
            projectData
                ?.stars_count
        );


    const viewsCount =
        safeNumber(
            projectData
                ?.views_count
        );


    const commentsCount =
        safeNumber(
            projectData
                ?.comments_count
        );


    // =====================================================
    // OWNER PROFILE PATH
    // =====================================================

    const ownerProfilePath =
        author?.username
            ? `/${author.username}/profile/`
            : "/projects";


    // =====================================================
    // GET PROJECT DETAIL
    // =====================================================

    const getProjectDetail =
        useCallback(
            async () => {
                if (
                    !projectId
                ) {
                    return;
                }


                dispatch(
                    getProjectDetailStart()
                );


                try {
                    const response =
                        await ProjectService
                            .projectDetail(
                                projectId
                            );


                    dispatch(
                        getProjectDetailSuccess(
                            response
                        )
                    );


                    const responseImages =
                        Array.isArray(
                            response?.images
                        )
                            ? response.images
                            : [];


                    setActiveIndex(
                        (
                            previous
                        ) => {
                            if (
                                responseImages.length ===
                                0
                            ) {
                                return 0;
                            }


                            return Math.min(
                                previous,
                                responseImages.length -
                                1
                            );
                        }
                    );


                    setIsStarred(
                        Boolean(
                            response
                                ?.is_starred_by_user
                        )
                    );

                } catch (
                    requestError
                ) {
                    console.error(
                        "ProjectDetail olishda xato:",
                        requestError
                    );


                    dispatch(
                        getProjectDetailFailure(
                            getErrorMessage(
                                requestError,
                                "Loyihani yuklashda xato yuz berdi."
                            )
                        )
                    );
                }
            },
            [
                projectId,
                dispatch,
            ]
        );


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(
        () => {
            getProjectDetail();
        },
        [
            getProjectDetail,
        ]
    );


    // =====================================================
    // SYNC STAR
    // =====================================================

    useEffect(
        () => {
            setIsStarred(
                Boolean(
                    projectDetail
                        ?.is_starred_by_user
                )
            );
        },
        [
            projectDetail
                ?.is_starred_by_user,
        ]
    );


    // =====================================================
    // OPEN EDIT
    // =====================================================

    const handleOpenEditModal =
        () => {
            if (
                !isOwner
                ||
                isUpdating
                ||
                isDeleting
            ) {
                return;
            }


            setIsEditModalOpen(
                true
            );
        };


    // =====================================================
    // CLOSE EDIT
    // =====================================================

    const handleCloseEditModal =
        () => {
            if (
                isUpdating
            ) {
                return;
            }


            setIsEditModalOpen(
                false
            );
        };


    // =====================================================
    // UPDATE PROJECT
    // =====================================================

    const handleUpdateProject =
        async (
            formData,
            projectIdToUpdate
        ) => {
            if (
                isUpdating
                ||
                isDeleting
            ) {
                return false;
            }


            const targetProjectId =
                projectIdToUpdate
                ||
                projectData?.id;


            if (
                !targetProjectId
            ) {
                siteToast.error(
                    "Loyiha ID topilmadi.",
                    {
                        title:
                            "Loyiha yangilanmadi",
                    }
                );

                return false;
            }


            setIsUpdating(
                true
            );


            const toastId =
                siteToast.loading(
                    "Loyihadagi o‘zgarishlar saqlanmoqda...",
                    {
                        title:
                            "Loyiha yangilanmoqda",
                    }
                );


            try {
                await ProjectService
                    .updateProject(
                        targetProjectId,
                        formData
                    );


                await getProjectDetail();


                setIsEditModalOpen(
                    false
                );


                siteToast.success(
                    "Loyiha ma’lumotlari muvaffaqiyatli yangilandi.",
                    {
                        id:
                            toastId,

                        title:
                            "Loyiha yangilandi",

                        duration:
                            3800,
                    }
                );


                return true;

            } catch (
                requestError
            ) {
                const message =
                    getErrorMessage(
                        requestError,
                        "Loyihani tahrirlashda xato yuz berdi."
                    );


                console.error(
                    "Loyihani tahrirlashda xato:",
                    requestError
                );


                siteToast.error(
                    message,
                    {
                        id:
                            toastId,

                        title:
                            "Loyiha yangilanmadi",

                        duration:
                            5000,
                    }
                );


                throw requestError;

            } finally {
                setIsUpdating(
                    false
                );
            }
        };


    // =====================================================
    // OPEN DELETE CONFIRMATION
    //
    // MUHIM:
    // Bu yerda delete API chaqirilmaydi.
    // Faqat confirmation modal ochiladi.
    // =====================================================

    const handleOpenDeleteModal =
        () => {
            if (
                !isOwner
                ||
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
    // CLOSE DELETE CONFIRMATION
    // =====================================================

    const handleCloseDeleteModal =
        () => {
            /*
                API ishlayotgan bo‘lsa modalni
                yopishga ruxsat bermaymiz.

                ESC / backdrop / X / cancel
                DeleteConfirmationModal ichida ham
                isProcessing orqali bloklanadi.
            */

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
    // CONFIRM DELETE
    //
    // Faqat DeleteConfirmationModal ichidagi
    // "Ha, o‘chirish" bosilganda ishlaydi.
    // =====================================================

    const handleConfirmDelete =
        async () => {
            if (
                !projectData?.id
                ||
                isDeleting
            ) {
                return;
            }


            setIsDeleting(
                true
            );


            /*
                Modal OCHIQ qoladi.

                isProcessing=true bo‘lgani uchun
                DeleteConfirmationModal avtomatik:

                - loader ko‘rsatadi
                - close buttonni bloklaydi
                - cancelni bloklaydi
                - delete buttonni bloklaydi

                API success bo‘lgandan keyingina
                modal yopiladi.
            */

            const toastId =
                siteToast.loading(
                    `"${projectTitle}" loyihasi o‘chirilmoqda...`,
                    {
                        title:
                            "Loyiha o‘chirilmoqda",
                    }
                );


            try {
                await ProjectService
                    .deleteProject(
                        projectData.id
                    );


                // =========================================
                // SUCCESS
                // =========================================

                setIsDeleteModalOpen(
                    false
                );


                siteToast.success(
                    `"${projectTitle}" loyihasi muvaffaqiyatli o‘chirildi.`,
                    {
                        id:
                            toastId,

                        title:
                            "Loyiha o‘chirildi",

                        duration:
                            3500,
                    }
                );


                navigate(
                    ownerProfilePath,
                    {
                        replace:
                            true,
                    }
                );

            } catch (
                requestError
            ) {
                const message =
                    getErrorMessage(
                        requestError,
                        "Loyihani o‘chirishda xato yuz berdi."
                    );


                console.error(
                    "Loyihani o‘chirishda xato:",
                    requestError
                );


                /*
                    ERROR bo‘lsa modal ochiq qoladi.

                    isDeleting finally ichida false bo‘ladi
                    va user qayta urinishi mumkin.
                */

                siteToast.error(
                    message,
                    {
                        id:
                            toastId,

                        title:
                            "Loyiha o‘chirilmadi",

                        duration:
                            5000,
                    }
                );

            } finally {
                setIsDeleting(
                    false
                );
            }
        };


    // =====================================================
    // STAR TOGGLE
    // =====================================================

    const handleStarToggle =
        useCallback(
            async () => {
                // =========================================
                // AUTH
                // =========================================

                if (
                    !isLoggedIn
                ) {
                    siteToast.warning(
                        "Loyihaga star berish uchun avval tizimga kiring.",
                        {
                            title:
                                "Kirish talab qilinadi",

                            duration:
                                3500,
                        }
                    );

                    return;
                }


                if (
                    isStarLoading
                    ||
                    !projectDetail?.id
                ) {
                    return;
                }


                setIsStarLoading(
                    true
                );


                // =========================================
                // OLD STATE
                // =========================================

                const oldIsStarred =
                    Boolean(
                        isStarred
                    );


                const oldStarsCount =
                    safeNumber(
                        projectDetail
                            ?.stars_count
                    );


                // =========================================
                // OPTIMISTIC STATE
                // =========================================

                const nextIsStarred =
                    !oldIsStarred;


                const optimisticStarsCount =
                    Math.max(
                        0,
                        oldStarsCount
                        +
                        (
                            nextIsStarred
                                ? 1
                                : -1
                        )
                    );


                setIsStarred(
                    nextIsStarred
                );


                dispatch(
                    getProjectDetailSuccess({
                        ...projectDetail,

                        stars_count:
                            optimisticStarsCount,

                        is_starred_by_user:
                            nextIsStarred,
                    })
                );


                try {
                    const response =
                        await ProjectService
                            .toggleProjectStar(
                                projectId
                            );


                    const backendIsStarred =
                        typeof response
                            ?.is_starred_by_user ===
                        "boolean"

                            ? response
                                .is_starred_by_user

                            : nextIsStarred;


                    const backendStarsCount =
                        Number.isFinite(
                            Number(
                                response
                                    ?.stars_count
                            )
                        )
                            ? safeNumber(
                                response
                                    ?.stars_count
                            )
                            : optimisticStarsCount;


                    setIsStarred(
                        backendIsStarred
                    );


                    dispatch(
                        getProjectDetailSuccess({
                            ...projectDetail,

                            stars_count:
                                backendStarsCount,

                            is_starred_by_user:
                                backendIsStarred,
                        })
                    );


                    if (
                        backendIsStarred
                    ) {
                        siteToast.success(
                            "Loyihaga star berildi.",
                            {
                                title:
                                    "Star berildi",

                                duration:
                                    2500,
                            }
                        );

                    } else {
                        siteToast.info(
                            "Loyihadan star olib tashlandi.",
                            {
                                title:
                                    "Star bekor qilindi",

                                duration:
                                    2300,
                            }
                        );
                    }

                } catch (
                    requestError
                ) {
                    console.error(
                        "Star/Unstar qilishda xato:",
                        requestError
                    );


                    // =====================================
                    // ROLLBACK
                    // =====================================

                    setIsStarred(
                        oldIsStarred
                    );


                    dispatch(
                        getProjectDetailSuccess({
                            ...projectDetail,

                            stars_count:
                                oldStarsCount,

                            is_starred_by_user:
                                oldIsStarred,
                        })
                    );


                    siteToast.error(
                        getErrorMessage(
                            requestError,
                            "Star amalini bajarib bo‘lmadi."
                        ),
                        {
                            title:
                                "Star saqlanmadi",

                            duration:
                                4500,
                        }
                    );

                } finally {
                    setIsStarLoading(
                        false
                    );
                }
            },
            [
                isLoggedIn,
                isStarLoading,
                isStarred,
                projectDetail,
                projectId,
                dispatch,
            ]
        );


    // =====================================================
    // LOADING
    // =====================================================

    if (
        projectDetailIsLoading
        &&
        !projectData?.id
    ) {
        return (
            <ProjectLoadingSkeleton />
        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (
        projectDetailError
        ||
        !projectData?.id
    ) {
        return (
            <div
                className="
                    min-h-screen
                    bg-[#05070a]
                    px-4
                    pt-40
                    text-white
                "
            >

                <div
                    className="
                        mx-auto
                        max-w-xl
                        rounded-[28px]
                        border
                        border-red-400/20
                        bg-[#0b1018]
                        p-8
                        text-center
                        shadow-[0_35px_100px_rgba(0,0,0,0.45)]
                    "
                >

                    <div
                        className="
                            mx-auto
                            grid
                            h-16
                            w-16
                            place-items-center
                            rounded-2xl
                            border
                            border-red-400/15
                            bg-red-500/[0.07]
                            text-red-300
                        "
                    >
                        <AlertTriangle
                            size={28}
                        />
                    </div>


                    <h1
                        className="
                            mt-5
                            text-2xl
                            font-black
                            text-white
                        "
                    >
                        Loyiha topilmadi
                    </h1>


                    <p
                        className="
                            mt-2
                            text-sm
                            font-medium
                            text-gray-600
                        "
                    >
                        Loyiha ID:{" "}
                        <span
                            className="
                                font-black
                                text-gray-400
                            "
                        >
                            {projectId}
                        </span>
                    </p>


                    {projectDetailError && (
                        <div
                            className="
                                mt-5
                                rounded-2xl
                                border
                                border-red-400/15
                                bg-red-500/[0.05]
                                p-4
                                text-sm
                                font-medium
                                leading-6
                                text-red-200/80
                            "
                        >
                            {projectDetailError}
                        </div>
                    )}


                    <button
                        type="button"
                        onClick={
                            getProjectDetail
                        }
                        className="
                            mt-6
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-red-400/20
                            bg-red-600
                            px-5
                            py-3
                            text-sm
                            font-black
                            text-white
                            transition-all

                            hover:bg-red-500

                            active:scale-[0.98]
                        "
                    >
                        <Loader2
                            size={15}
                        />

                        Qayta urinish
                    </button>

                </div>

            </div>
        );
    }


    // =====================================================
    // JSX
    // =====================================================

    return (
        <div
            className="
                relative
                min-h-screen
                overflow-hidden
                bg-[#05070a]
                text-white
            "
        >

            {/* =================================================
                BACKGROUND
            ================================================== */}

            <div
                className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-[linear-gradient(rgba(99,102,241,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.04)_1px,transparent_1px)]
                    bg-[size:58px_58px]
                    [mask-image:radial-gradient(circle_at_center,black_0%,transparent_74%)]
                "
            />


            <div
                className="
                    pointer-events-none
                    absolute
                    left-1/2
                    top-24
                    h-[460px]
                    w-[460px]
                    -translate-x-1/2
                    rounded-full
                    bg-indigo-600/10
                    blur-[135px]
                "
            />


            <div
                className="
                    pointer-events-none
                    absolute
                    -right-40
                    top-1/3
                    h-[380px]
                    w-[380px]
                    rounded-full
                    bg-purple-500/[0.07]
                    blur-[125px]
                "
            />


            {/* =================================================
                MAIN
            ================================================== */}

            <main
                className="
                    relative
                    z-10
                    mx-auto
                    w-full
                    max-w-[1520px]
                    px-4
                    py-24

                    sm:px-6

                    xl:px-8
                "
            >

                <div
                    className="
                        overflow-hidden
                        rounded-[32px]
                        border
                        border-white/[0.07]
                        bg-[#0b1018]/90
                        shadow-[0_40px_110px_rgba(0,0,0,0.45)]
                        backdrop-blur-xl
                    "
                >

                    {/* =================================================
                        HEADER
                    ================================================== */}

                    <header
                        className="
                            border-b
                            border-white/[0.07]
                            p-5

                            sm:p-8

                            xl:p-10
                        "
                    >

                        {/* =============================================
                            TITLE + OWNER CONTROLS
                        ============================================== */}

                        <div
                            className="
                                flex
                                flex-col
                                gap-6

                                xl:flex-row
                                xl:items-start
                                xl:justify-between
                            "
                        >

                            <div
                                className="
                                    min-w-0
                                    flex-1
                                "
                            >

                                <div
                                    className="
                                        mb-4
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-full
                                        border
                                        border-indigo-400/25
                                        bg-indigo-500/[0.08]
                                        px-3.5
                                        py-1.5
                                        text-[10px]
                                        font-black
                                        uppercase
                                        tracking-[0.20em]
                                        text-indigo-300
                                    "
                                >
                                    <Rocket
                                        size={14}
                                    />

                                    Project showcase
                                </div>


                                <h1
                                    className="
                                        max-w-5xl
                                        break-words
                                        bg-gradient-to-r
                                        from-white
                                        via-indigo-100
                                        to-purple-300
                                        bg-clip-text
                                        text-4xl
                                        font-black
                                        leading-[1.08]
                                        tracking-tight
                                        text-transparent

                                        sm:text-5xl

                                        xl:text-6xl
                                    "
                                >
                                    {projectTitle}
                                </h1>


                                <p
                                    className="
                                        mt-4
                                        max-w-4xl
                                        whitespace-pre-wrap
                                        break-words
                                        text-sm
                                        font-medium
                                        leading-7
                                        text-gray-500

                                        sm:text-base
                                    "
                                >
                                    {projectData
                                        ?.description
                                        ||
                                        "Ushbu loyiha uchun hali to‘liq tavsif kiritilmagan."}
                                </p>

                            </div>


                            {/* =========================================
                                OWNER TOOLS
                            ========================================== */}

                            {isOwner && (
                                <div
                                    className="
                                        shrink-0
                                    "
                                >
                                    <OwnerControls
                                        onEdit={
                                            handleOpenEditModal
                                        }
                                        onDelete={
                                            handleOpenDeleteModal
                                        }
                                        isUpdating={
                                            isUpdating
                                        }
                                        isDeleting={
                                            isDeleting
                                        }
                                    />
                                </div>
                            )}

                        </div>


                        {/* =============================================
                            STATS
                        ============================================== */}

                        <div
                            className="
                                mt-7
                                flex
                                flex-wrap
                                items-center
                                gap-2.5
                            "
                        >

                            {/* STAR */}

                            <button
                                type="button"
                                onClick={
                                    handleStarToggle
                                }
                                disabled={
                                    isStarLoading
                                    ||
                                    isDeleting
                                }
                                title={
                                    isStarred
                                        ? "Starni olib tashlash"
                                        : "Loyihaga star berish"
                                }
                                className={`
                                    group
                                    relative
                                    inline-flex
                                    min-h-[42px]
                                    items-center
                                    gap-2
                                    rounded-xl
                                    border
                                    px-3.5
                                    py-2.5
                                    text-xs
                                    font-black
                                    transition-all

                                    active:scale-[0.97]

                                    disabled:cursor-not-allowed
                                    disabled:opacity-60

                                    ${
                                        isStarred
                                            ? `
                                                border-yellow-400/25
                                                bg-yellow-500/[0.10]
                                                text-yellow-200
                                            `
                                            : `
                                                border-white/[0.07]
                                                bg-white/[0.025]
                                                text-gray-400

                                                hover:border-yellow-400/20
                                                hover:bg-yellow-500/[0.06]
                                                hover:text-yellow-300
                                            `
                                    }
                                `}
                            >
                                {isStarLoading ? (
                                    <Loader2
                                        size={17}
                                        className="
                                            animate-spin
                                        "
                                    />
                                ) : (
                                    <Star
                                        size={17}
                                        className={
                                            isStarred
                                                ? "fill-yellow-300 text-yellow-300"
                                                : ""
                                        }
                                    />
                                )}


                                <span>
                                    {isStarred
                                        ? "Starred"
                                        : "Star berish"}
                                </span>


                                {isStarred && (
                                    <span
                                        className="
                                            absolute
                                            -right-1
                                            -top-1
                                            h-2.5
                                            w-2.5
                                            rounded-full
                                            bg-yellow-300
                                            shadow-[0_0_12px_rgba(250,204,21,0.8)]
                                        "
                                    />
                                )}

                            </button>


                            <StatPill
                                icon={
                                    Star
                                }
                                value={
                                    starsCount
                                        .toLocaleString()
                                }
                                label="star"
                                tone="yellow"
                            />


                            <StatPill
                                icon={
                                    Eye
                                }
                                value={
                                    viewsCount
                                        .toLocaleString()
                                }
                                label="ko‘rish"
                                tone="cyan"
                            />


                            <StatPill
                                icon={
                                    MessageCircle
                                }
                                value={
                                    commentsCount
                                        .toLocaleString()
                                }
                                label="sharh"
                                tone="indigo"
                            />

                        </div>


                        {/* =============================================
                            GALLERY
                        ============================================== */}

                        <div
                            className="
                                mt-8
                            "
                        >

                            <div
                                className="
                                    relative
                                    overflow-hidden
                                    rounded-[26px]
                                    border
                                    border-white/[0.07]
                                    bg-black/30
                                    shadow-2xl
                                    shadow-black/30
                                "
                            >

                                <div
                                    className="
                                        relative
                                        aspect-video
                                    "
                                >

                                    {projectImages.length >
                                    0 ? (
                                        projectImages.map(
                                            (
                                                image,
                                                index
                                            ) => (
                                                <img
                                                    key={
                                                        image?.id
                                                        ||
                                                        index
                                                    }
                                                    src={
                                                        getImageUrl(
                                                            image
                                                                ?.image
                                                        )
                                                    }
                                                    alt={
                                                        image?.title
                                                        ||
                                                        `Project Screenshot ${index + 1}`
                                                    }
                                                    onError={(
                                                        event
                                                    ) => {
                                                        event
                                                            .currentTarget
                                                            .onerror =
                                                            null;


                                                        event
                                                            .currentTarget
                                                            .src =
                                                            UserImage;
                                                    }}
                                                    className={`
                                                        absolute
                                                        inset-0
                                                        h-full
                                                        w-full
                                                        object-contain
                                                        transition-all
                                                        duration-500

                                                        ${
                                                            activeIndex ===
                                                            index
                                                                ? `
                                                                    scale-100
                                                                    opacity-100
                                                                `
                                                                : `
                                                                    pointer-events-none
                                                                    scale-[0.98]
                                                                    opacity-0
                                                                `
                                                        }
                                                    `}
                                                />
                                            )
                                        )
                                    ) : (
                                        <div
                                            className="
                                                flex
                                                h-full
                                                w-full
                                                items-center
                                                justify-center
                                                bg-gray-950/70
                                            "
                                        >
                                            <div
                                                className="
                                                    text-center
                                                "
                                            >
                                                <ImageIcon
                                                    className="
                                                        mx-auto
                                                        mb-3
                                                        text-gray-800
                                                    "
                                                    size={72}
                                                />


                                                <p
                                                    className="
                                                        text-sm
                                                        font-bold
                                                        text-gray-600
                                                    "
                                                >
                                                    Rasm mavjud emas
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                </div>

                            </div>


                            {/* =========================================
                                THUMBNAILS
                            ========================================== */}

                            {projectImages.length >
                            1 && (
                                <div
                                    className="
                                        mt-4
                                        flex
                                        flex-wrap
                                        justify-center
                                        gap-2
                                    "
                                >
                                    {projectImages.map(
                                        (
                                            image,
                                            index
                                        ) => (
                                            <button
                                                key={
                                                    image?.id
                                                    ||
                                                    index
                                                }
                                                type="button"
                                                onClick={() =>
                                                    setActiveIndex(
                                                        index
                                                    )
                                                }
                                                className={`
                                                    h-16
                                                    w-24
                                                    overflow-hidden
                                                    rounded-xl
                                                    border
                                                    transition-all

                                                    ${
                                                        activeIndex ===
                                                        index
                                                            ? `
                                                                border-indigo-400/60
                                                                opacity-100
                                                                ring-2
                                                                ring-indigo-500/20
                                                            `
                                                            : `
                                                                border-white/[0.07]
                                                                opacity-50

                                                                hover:border-white/[0.15]
                                                                hover:opacity-100
                                                            `
                                                    }
                                                `}
                                            >
                                                <img
                                                    src={
                                                        getImageUrl(
                                                            image
                                                                ?.image
                                                        )
                                                    }
                                                    alt={
                                                        image?.title
                                                        ||
                                                        ""
                                                    }
                                                    className="
                                                        h-full
                                                        w-full
                                                        object-cover
                                                    "
                                                    onError={(
                                                        event
                                                    ) => {
                                                        event
                                                            .currentTarget
                                                            .onerror =
                                                            null;


                                                        event
                                                            .currentTarget
                                                            .src =
                                                            UserImage;
                                                    }}
                                                />
                                            </button>
                                        )
                                    )}
                                </div>
                            )}

                        </div>

                    </header>


                    {/* =================================================
                        CONTENT + SIDEBAR
                    ================================================== */}

                    <div
                        className="
                            grid

                            xl:grid-cols-[minmax(0,1fr)_520px]
                        "
                    >

                        {/* =============================================
                            LEFT
                        ============================================== */}

                        <section
                            className="
                                min-w-0
                                border-white/[0.07]

                                xl:border-r
                            "
                        >

                            <article
                                className="
                                    p-5

                                    sm:p-8

                                    xl:p-10
                                "
                            >

                                {/* =====================================
                                    INTRO
                                ====================================== */}

                                <div
                                    className="
                                        rounded-2xl
                                        border
                                        border-indigo-400/15
                                        bg-indigo-500/[0.055]
                                        px-5
                                        py-4
                                        text-sm
                                        font-medium
                                        leading-7
                                        text-indigo-100/90

                                        sm:text-base
                                    "
                                >
                                    {projectData
                                        ?.description
                                        ||
                                        "Ushbu loyiha uchun hali to‘liq tavsif kiritilmagan."}
                                </div>


                                {/* =====================================
                                    ABOUT
                                ====================================== */}

                                <div
                                    className="
                                        mt-9
                                    "
                                >
                                    <h2
                                        className="
                                            flex
                                            items-center
                                            gap-3
                                            text-2xl
                                            font-black
                                            text-white
                                        "
                                    >
                                        <Sparkles
                                            size={24}
                                            className="
                                                text-indigo-300
                                            "
                                        />

                                        Loyiha haqida
                                    </h2>


                                    <p
                                        className="
                                            mt-4
                                            whitespace-pre-wrap
                                            break-words
                                            text-sm
                                            font-medium
                                            leading-8
                                            text-gray-500

                                            sm:text-base
                                        "
                                    >
                                        {projectData
                                            ?.description
                                            ||
                                            "Loyiha haqida to‘liqroq ma’lumotlar tez orada kiritiladi."}
                                    </p>
                                </div>


                                {/* =====================================
                                    FEATURES
                                ====================================== */}

                                {featuresList.length >
                                0 && (
                                    <div
                                        className="
                                            mt-9
                                        "
                                    >
                                        <h3
                                            className="
                                                flex
                                                items-center
                                                gap-3
                                                text-lg
                                                font-black
                                                text-white

                                                sm:text-xl
                                            "
                                        >
                                            <ShieldCheck
                                                size={21}
                                                className="
                                                    text-emerald-300
                                                "
                                            />

                                            Asosiy imkoniyatlar
                                        </h3>


                                        <div
                                            className="
                                                mt-4
                                                grid
                                                gap-3

                                                md:grid-cols-2
                                            "
                                        >
                                            {featuresList.map(
                                                (
                                                    feature,
                                                    index
                                                ) => (
                                                    <div
                                                        key={
                                                            `${feature}-${index}`
                                                        }
                                                        className="
                                                            group
                                                            flex
                                                            items-start
                                                            gap-3
                                                            rounded-2xl
                                                            border
                                                            border-white/[0.07]
                                                            bg-white/[0.02]
                                                            p-4
                                                            text-sm
                                                            font-semibold
                                                            leading-6
                                                            text-gray-400
                                                            transition-all

                                                            hover:border-indigo-400/20
                                                            hover:bg-indigo-500/[0.035]
                                                            hover:text-gray-300
                                                        "
                                                    >
                                                        <span
                                                            className="
                                                                mt-0.5
                                                                flex
                                                                h-7
                                                                w-7
                                                                shrink-0
                                                                items-center
                                                                justify-center
                                                                rounded-lg
                                                                border
                                                                border-indigo-400/15
                                                                bg-indigo-500/[0.07]
                                                                text-[9px]
                                                                font-black
                                                                text-indigo-300
                                                            "
                                                        >
                                                            {String(
                                                                index +
                                                                1
                                                            ).padStart(
                                                                2,
                                                                "0"
                                                            )}
                                                        </span>


                                                        <span>
                                                            {feature}
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}

                            </article>


                            {/* =========================================
                                COLLABORATION
                            ========================================== */}

                            <ProjectCollaboration
                                currentCollaborators={
                                    Array.isArray(
                                        projectData
                                            ?.collaborations
                                    )
                                        ? projectData
                                            .collaborations
                                        : []
                                }
                                pendingRequests={[]}
                                projectOwner={
                                    author
                                }
                                isOwner={
                                    isOwner
                                }
                                isCollaborator={
                                    false
                                }
                                hasSentRequest={
                                    false
                                }
                                projectId={
                                    projectId
                                }
                            />

                        </section>


                        {/* =============================================
                            SIDEBAR
                        ============================================== */}

                        <aside
                            className="
                                min-w-0
                                bg-black/[0.07]
                                p-5

                                sm:p-7
                            "
                        >
                            <div
                                className="
                                    min-w-0
                                    space-y-5

                                    xl:sticky
                                    xl:top-24
                                "
                            >

                                {/* =====================================
                                    BOOST
                                ====================================== */}

                                {isOwner && (
                                    <div
                                        className="
                                            min-w-0
                                            overflow-hidden
                                            rounded-3xl

                                            [&>div]:mb-0
                                            [&>div]:w-full
                                        "
                                    >
                                        <ProjectBoost
                                            projectId={
                                                projectData
                                                    .id
                                            }
                                            projectName={
                                                projectTitle
                                            }
                                            userCoins={
                                                safeNumber(
                                                    user
                                                        ?.coins
                                                )
                                            }
                                        />
                                    </div>
                                )}


                                {/* =====================================
                                    AUTHOR
                                ====================================== */}

                                <section
                                    className="
                                        rounded-3xl
                                        border
                                        border-white/[0.07]
                                        bg-white/[0.025]
                                        p-5
                                        shadow-xl
                                        shadow-black/15
                                    "
                                >

                                    <div
                                        className="
                                            mb-4
                                            flex
                                            items-center
                                            gap-3
                                        "
                                    >
                                        <div
                                            className="
                                                flex
                                                h-9
                                                w-9
                                                items-center
                                                justify-center
                                                rounded-xl
                                                border
                                                border-indigo-400/15
                                                bg-indigo-500/[0.07]
                                                text-indigo-300
                                            "
                                        >
                                            <UserRound
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
                                                Muallif
                                            </h3>


                                            <p
                                                className="
                                                    mt-0.5
                                                    text-[9px]
                                                    font-semibold
                                                    uppercase
                                                    tracking-wider
                                                    text-gray-700
                                                "
                                            >
                                                Project owner
                                            </p>
                                        </div>

                                    </div>


                                    {author?.username ? (
                                        <Link
                                            to={`/${author.username}/profile/`}
                                            className="
                                                group
                                                flex
                                                items-center
                                                gap-4
                                                rounded-2xl
                                                border
                                                border-white/[0.07]
                                                bg-black/20
                                                p-4
                                                transition-all

                                                hover:border-indigo-400/20
                                                hover:bg-indigo-500/[0.04]
                                            "
                                        >
                                            <img
                                                src={
                                                    authorImage
                                                }
                                                alt={
                                                    author
                                                        ?.username
                                                    ||
                                                    "Project owner"
                                                }
                                                className="
                                                    h-14
                                                    w-14
                                                    shrink-0
                                                    rounded-2xl
                                                    border
                                                    border-white/[0.08]
                                                    bg-gray-900
                                                    object-cover
                                                "
                                                onError={(
                                                    event
                                                ) => {
                                                    event
                                                        .currentTarget
                                                        .onerror =
                                                        null;


                                                    event
                                                        .currentTarget
                                                        .src =
                                                        UserImage;
                                                }}
                                            />


                                            <div
                                                className="
                                                    min-w-0
                                                "
                                            >
                                                <p
                                                    className="
                                                        truncate
                                                        text-sm
                                                        font-black
                                                        text-white
                                                        transition

                                                        group-hover:text-indigo-300
                                                    "
                                                >
                                                    {getAuthorName(
                                                        author
                                                    )}
                                                </p>


                                                <p
                                                    className="
                                                        mt-1
                                                        truncate
                                                        text-[10px]
                                                        font-semibold
                                                        text-gray-600
                                                    "
                                                >
                                                    @
                                                    {author
                                                        ?.username}
                                                </p>


                                                <p
                                                    className="
                                                        mt-1.5
                                                        text-[10px]
                                                        font-black
                                                        uppercase
                                                        tracking-wider
                                                        text-indigo-300
                                                    "
                                                >
                                                    {author
                                                        ?.skill_level
                                                        ||
                                                        "Aniqlanmagan"}
                                                </p>
                                            </div>
                                        </Link>
                                    ) : (
                                        <div
                                            className="
                                                rounded-2xl
                                                border
                                                border-white/[0.07]
                                                bg-black/20
                                                p-4
                                                text-sm
                                                text-gray-600
                                            "
                                        >
                                            Muallif ma’lumoti topilmadi.
                                        </div>
                                    )}

                                </section>


                                {/* =====================================
                                    TECHNOLOGIES
                                ====================================== */}

                                <section
                                    className="
                                        rounded-3xl
                                        border
                                        border-white/[0.07]
                                        bg-white/[0.025]
                                        p-5
                                        shadow-xl
                                        shadow-black/15
                                    "
                                >

                                    <div
                                        className="
                                            mb-4
                                            flex
                                            items-center
                                            gap-3
                                        "
                                    >
                                        <div
                                            className="
                                                flex
                                                h-9
                                                w-9
                                                items-center
                                                justify-center
                                                rounded-xl
                                                border
                                                border-purple-400/15
                                                bg-purple-500/[0.07]
                                                text-purple-300
                                            "
                                        >
                                            <Code2
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
                                                Texnologiyalar
                                            </h3>


                                            <p
                                                className="
                                                    mt-0.5
                                                    text-[9px]
                                                    font-semibold
                                                    uppercase
                                                    tracking-wider
                                                    text-gray-700
                                                "
                                            >
                                                Project stack
                                            </p>
                                        </div>
                                    </div>


                                    <div
                                        className="
                                            flex
                                            flex-wrap
                                            gap-2
                                        "
                                    >
                                        {projectData
                                            ?.language_data && (
                                            <TechBadge
                                                type="blue"
                                            >
                                                {projectData
                                                    .language_data
                                                    .name}
                                            </TechBadge>
                                        )}


                                        {projectData
                                            ?.technology_data && (
                                            <TechBadge
                                                type="purple"
                                            >
                                                {projectData
                                                    .technology_data
                                                    .name}
                                            </TechBadge>
                                        )}


                                        {!projectData
                                            ?.language_data
                                            &&
                                            !projectData
                                                ?.technology_data
                                            && (
                                                <p
                                                    className="
                                                        text-sm
                                                        font-semibold
                                                        text-gray-600
                                                    "
                                                >
                                                    Texnologiyalar hali kiritilmagan.
                                                </p>
                                            )}
                                    </div>

                                </section>


                                {/* =====================================
                                    LINKS
                                ====================================== */}

                                {(
                                    projectData
                                        ?.github_url
                                    ||
                                    projectData
                                        ?.website_url
                                ) && (
                                    <section
                                        className="
                                            space-y-2.5
                                        "
                                    >

                                        {projectData
                                            ?.github_url && (
                                            <a
                                                href={
                                                    projectData
                                                        .github_url
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="
                                                    group
                                                    flex
                                                    w-full
                                                    items-center
                                                    justify-between
                                                    gap-3
                                                    rounded-2xl
                                                    border
                                                    border-white/[0.07]
                                                    bg-white/[0.025]
                                                    px-4
                                                    py-3.5
                                                    text-sm
                                                    font-black
                                                    text-gray-300
                                                    transition-all

                                                    hover:border-white/[0.14]
                                                    hover:bg-white/[0.05]
                                                    hover:text-white

                                                    active:scale-[0.98]
                                                "
                                            >
                                                <span
                                                    className="
                                                        flex
                                                        items-center
                                                        gap-2
                                                    "
                                                >
                                                    <Github
                                                        size={18}
                                                    />

                                                    GitHub
                                                </span>


                                                <ExternalLink
                                                    size={14}
                                                    className="
                                                        text-gray-700
                                                        transition

                                                        group-hover:text-gray-400
                                                    "
                                                />
                                            </a>
                                        )}


                                        {projectData
                                            ?.website_url && (
                                            <a
                                                href={
                                                    projectData
                                                        .website_url
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="
                                                    group
                                                    flex
                                                    w-full
                                                    items-center
                                                    justify-between
                                                    gap-3
                                                    rounded-2xl
                                                    border
                                                    border-indigo-400/20
                                                    bg-indigo-500/[0.08]
                                                    px-4
                                                    py-3.5
                                                    text-sm
                                                    font-black
                                                    text-indigo-200
                                                    transition-all

                                                    hover:border-indigo-400/35
                                                    hover:bg-indigo-500/[0.13]
                                                    hover:text-white

                                                    active:scale-[0.98]
                                                "
                                            >
                                                <span
                                                    className="
                                                        flex
                                                        items-center
                                                        gap-2
                                                    "
                                                >
                                                    <ExternalLink
                                                        size={18}
                                                    />

                                                    Live Demo
                                                </span>


                                                <ExternalLink
                                                    size={14}
                                                    className="
                                                        text-indigo-500
                                                        transition-transform

                                                        group-hover:translate-x-0.5
                                                        group-hover:-translate-y-0.5
                                                    "
                                                />
                                            </a>
                                        )}

                                    </section>
                                )}

                            </div>
                        </aside>

                    </div>


                    {/* =================================================
                        DISCUSSION
                    ================================================== */}

                    <ProjectDiscussion
                        projectId={
                            projectId
                        }
                    />

                </div>

            </main>


            {/* =================================================
                EDIT MODAL
            ================================================== */}

            {isOwner && (
                <ProjectFormModal
                    isOpen={
                        isEditModalOpen
                    }
                    onClose={
                        handleCloseEditModal
                    }
                    onSubmit={
                        handleUpdateProject
                    }
                    initialData={
                        projectData
                    }
                    isSubmitting={
                        isUpdating
                    }
                />
            )}


            {/* =================================================
                DELETE CONFIRMATION MODAL

                FLOW:

                OwnerControls Delete
                       ↓
                handleOpenDeleteModal()
                       ↓
                DeleteConfirmationModal
                       ↓
                "Ha, o‘chirish"
                       ↓
                handleConfirmDelete()
                       ↓
                isDeleting = true
                       ↓
                Modal loader
                       ↓
                DELETE API
                  ↓          ↓
              SUCCESS       ERROR
                  ↓          ↓
               close      modal stays
               toast      toast error
               redirect   retry possible
            ================================================== */}

            {isOwner && (
                <DeleteConfirmationModal
                    isOpen={
                        isDeleteModalOpen
                    }
                    onClose={
                        handleCloseDeleteModal
                    }
                    onConfirm={
                        handleConfirmDelete
                    }
                    itemTitle={
                        projectTitle
                    }
                    isProcessing={
                        isDeleting
                    }
                />
            )}

        </div>
    );
};


export default ProjectDetail;