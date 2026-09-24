// src/components/Projects.jsx

import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    Link,
} from "react-router-dom";

import {
    AlertTriangle,
    ChevronLeft,
    ChevronRight,
    Eye,
    FolderKanban,
    Ghost,
    Loader2,
    MessageCircle,
    RefreshCw,
    Rocket,
    Search,
    Sparkles,
    Star,
    X,
} from "lucide-react";


import {
    getProjectFailure,
    getProjectStart,
    getProjectSuccess,
} from "../features/projects";

import ProjectService from "../services/project";

import UserImage from "../assests/userImage.jpeg";

import {
    BACKEND_URL,
} from "../services/config";

import {
    getUserAvatarUrl,
    handleUserImageError,
} from "../utils/imageUtils";


// =========================================================
// CONFIG
// =========================================================

const PAGE_SIZE = 6;

const SEARCH_DELAY = 400;


// =========================================================
// ERROR MESSAGE
// =========================================================

const getErrorMessage = (
    error
) => {
    const data =
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
        return data.detail;
    }


    if (
        data?.message
    ) {
        return data.message;
    }


    return (
        error?.message ||
        "Projectlarni yuklashda xatolik yuz berdi."
    );
};


// =========================================================
// CANCELED REQUEST
// =========================================================

const isCanceledRequest = (
    error
) => {
    return (
        error?.code ===
        "ERR_CANCELED"
        ||
        error?.name ===
        "CanceledError"
    );
};


// =========================================================
// IMAGE URL
// =========================================================

const getProjectImageUrl = (
    image
) => {
    if (
        !image
    ) {
        return (
            "https://images.unsplash.com/"
            +
            "photo-1618477388954-7852f32655ec"
            +
            "?q=80&w=1600&auto=format&fit=crop"
        );
    }


    const value =
        String(
            image
        ).trim();


    if (
        /^https?:\/\//i.test(
            value
        )
        ||
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


    const base =
        String(
            BACKEND_URL || ""
        ).replace(
            /\/+$/,
            ""
        );


    return (
        `${base}${
            value.startsWith("/")
                ? value
                : `/${value}`
        }`
    );
};


// =========================================================
// ACTIVE BOOST
// =========================================================

const isProjectPromoted = (
    project
) => {
    if (
        !project?.is_boosted
        ||
        !project?.boost_expires_at
    ) {
        return false;
    }


    const expiresAt =
        new Date(
            project.boost_expires_at
        ).getTime();


    if (
        Number.isNaN(
            expiresAt
        )
    ) {
        return false;
    }


    return (
        expiresAt >
        Date.now()
    );
};


// =========================================================
// PAGINATION ITEMS
// =========================================================

const getPaginationItems = (
    currentPage,
    totalPages
) => {
    if (
        totalPages <= 7
    ) {
        return Array.from(
            {
                length:
                    totalPages,
            },
            (
                _,
                index
            ) =>
                index + 1
        );
    }


    const items = [
        1,
    ];


    if (
        currentPage > 4
    ) {
        items.push(
            "ellipsis-left"
        );
    }


    const startPage =
        Math.max(
            2,
            currentPage - 1
        );


    const endPage =
        Math.min(
            totalPages - 1,
            currentPage + 1
        );


    for (
        let page = startPage;
        page <= endPage;
        page += 1
    ) {
        items.push(
            page
        );
    }


    if (
        currentPage <
        totalPages - 3
    ) {
        items.push(
            "ellipsis-right"
        );
    }


    items.push(
        totalPages
    );


    return items;
};


// =========================================================
// PROJECT CARD SKELETON
// =========================================================

const ProjectCardSkeleton = () => {
    return (
        <div
            className="
                overflow-hidden
                rounded-[2rem]
                border
                border-white/[0.05]
                bg-[#0d1117]
            "
        >

            <div
                className="
                    h-60
                    animate-pulse
                    bg-white/[0.05]
                "
            />


            <div
                className="
                    space-y-5
                    p-7
                "
            >

                <div
                    className="
                        h-7
                        w-2/3
                        animate-pulse
                        rounded-lg
                        bg-white/[0.07]
                    "
                />


                <div
                    className="
                        space-y-2
                    "
                >
                    <div
                        className="
                            h-3
                            w-full
                            animate-pulse
                            rounded
                            bg-white/[0.04]
                        "
                    />

                    <div
                        className="
                            h-3
                            w-5/6
                            animate-pulse
                            rounded
                            bg-white/[0.04]
                        "
                    />

                    <div
                        className="
                            h-3
                            w-2/3
                            animate-pulse
                            rounded
                            bg-white/[0.04]
                        "
                    />
                </div>


                <div
                    className="
                        flex
                        items-center
                        justify-between
                        pt-4
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
                                h-10
                                w-10
                                animate-pulse
                                rounded-full
                                bg-white/[0.06]
                            "
                        />

                        <div
                            className="
                                h-3
                                w-20
                                animate-pulse
                                rounded
                                bg-white/[0.05]
                            "
                        />
                    </div>


                    <div
                        className="
                            h-7
                            w-20
                            animate-pulse
                            rounded-lg
                            bg-white/[0.04]
                        "
                    />

                </div>

            </div>

        </div>
    );
};


// =========================================================
// PROJECTS
// =========================================================

const Projects = () => {
    const dispatch =
        useDispatch();


    // =====================================================
    // REDUX
    // =====================================================

    const {
        projects,
        project_isLoading,
        project_error,
    } = useSelector(
        (
            state
        ) =>
            state.project
    );


    // =====================================================
    // REFS
    // =====================================================

    const searchInputRef =
        useRef(
            null
        );


    const projectsGridRef =
        useRef(
            null
        );


    // =====================================================
    // SEARCH
    // =====================================================

    const [
        searchTerm,
        setSearchTerm,
    ] = useState(
        ""
    );


    const [
        debouncedSearch,
        setDebouncedSearch,
    ] = useState(
        ""
    );


    // =====================================================
    // PAGINATION
    // =====================================================

    const [
        currentPage,
        setCurrentPage,
    ] = useState(
        1
    );


    const [
        pagination,
        setPagination,
    ] = useState({
        count: 0,
        next: null,
        previous: null,
    });


    // =====================================================
    // SAFE PROJECTS
    // =====================================================

    const projectList =
        useMemo(
            () => {
                return Array.isArray(
                    projects
                )
                    ? projects
                    : [];
            },
            [
                projects,
            ]
        );


    // =====================================================
    // TOTAL PAGES
    // =====================================================

    const totalPages =
        useMemo(
            () => {
                if (
                    pagination.count <= 0
                ) {
                    return 0;
                }


                return Math.ceil(
                    pagination.count /
                    PAGE_SIZE
                );
            },
            [
                pagination.count,
            ]
        );


    // =====================================================
    // PAGE ITEMS
    // =====================================================

    const pageItems =
        useMemo(
            () => {
                return getPaginationItems(
                    currentPage,
                    totalPages
                );
            },
            [
                currentPage,
                totalPages,
            ]
        );


    // =====================================================
    // CURRENT RANGE
    // =====================================================

    const rangeStart =
        pagination.count > 0
            ? (
                (
                    currentPage - 1
                )
                *
                PAGE_SIZE
            )
            + 1
            : 0;


    const rangeEnd =
        Math.min(
            currentPage *
            PAGE_SIZE,

            pagination.count
        );


    // =====================================================
    // SEARCH DEBOUNCE
    // =====================================================

    useEffect(
        () => {
            const timer =
                setTimeout(
                    () => {
                        setDebouncedSearch(
                            searchTerm.trim()
                        );
                    },
                    SEARCH_DELAY
                );


            return () => {
                clearTimeout(
                    timer
                );
            };
        },
        [
            searchTerm,
        ]
    );


    // =====================================================
    // CTRL + K
    // =====================================================

    useEffect(
        () => {
            const handleKeyDown =
                (
                    event
                ) => {
                    if (
                        (
                            event.ctrlKey
                            ||
                            event.metaKey
                        )
                        &&
                        event.key.toLowerCase() ===
                        "k"
                    ) {
                        event.preventDefault();


                        searchInputRef
                            .current
                            ?.focus();
                    }
                };


            window.addEventListener(
                "keydown",
                handleKeyDown
            );


            return () => {
                window.removeEventListener(
                    "keydown",
                    handleKeyDown
                );
            };
        },
        []
    );


    // =====================================================
    // FETCH PROJECTS
    // =====================================================

    const fetchProjects =
        useCallback(
            async (
                signal
            ) => {
                dispatch(
                    getProjectStart()
                );


                try {
                    const response =
                        await ProjectService
                            .getAllProjects({
                                page:
                                    currentPage,

                                pageSize:
                                    PAGE_SIZE,

                                search:
                                    debouncedSearch,

                                signal,
                            });


                    /*
                        MUHIM:

                        Redux ichida projects ARRAY bo‘lib qoladi.

                        Pagination ma’lumotlarini local state
                        boshqaradi.

                        Shuning uchun:
                        response emas,
                        response.results dispatch qilamiz.
                    */

                    dispatch(
                        getProjectSuccess(
                            response.results
                        )
                    );


                    setPagination({
                        count:
                            response.count,

                        next:
                            response.next,

                        previous:
                            response.previous,
                    });


                    // Masalan:
                    // page=5 turib projectlar kamayib
                    // total page=4 bo‘lib qolsa.
                    const responseTotalPages =
                        response.count > 0
                            ? Math.ceil(
                                response.count /
                                PAGE_SIZE
                            )
                            : 0;


                    if (
                        responseTotalPages > 0
                        &&
                        currentPage >
                        responseTotalPages
                    ) {
                        setCurrentPage(
                            responseTotalPages
                        );
                    }

                } catch (
                    error
                ) {
                    if (
                        isCanceledRequest(
                            error
                        )
                    ) {
                        return;
                    }


                    const message =
                        getErrorMessage(
                            error
                        );


                    dispatch(
                        getProjectFailure(
                            message
                        )
                    );
                }
            },
            [
                dispatch,
                currentPage,
                debouncedSearch,
            ]
        );


    // =====================================================
    // LOAD
    // =====================================================

    useEffect(
        () => {
            const controller =
                new AbortController();


            fetchProjects(
                controller.signal
            );


            return () => {
                controller.abort();
            };
        },
        [
            fetchProjects,
        ]
    );


    // =====================================================
    // SEARCH CHANGE
    // =====================================================

    const handleSearchChange =
        (
            event
        ) => {
            setSearchTerm(
                event.target.value
            );


            /*
                Search o‘zgarsa har doim
                1-sahifadan qidiramiz.
            */

            setCurrentPage(
                1
            );
        };


    // =====================================================
    // CLEAR SEARCH
    // =====================================================

    const handleClearSearch =
        () => {
            setSearchTerm(
                ""
            );


            setDebouncedSearch(
                ""
            );


            setCurrentPage(
                1
            );


            searchInputRef
                .current
                ?.focus();
        };


    // =====================================================
    // PAGE CHANGE
    // =====================================================

    const handlePageChange =
        (
            page
        ) => {
            if (
                page < 1
                ||
                page > totalPages
                ||
                page === currentPage
                ||
                project_isLoading
            ) {
                return;
            }


            setCurrentPage(
                page
            );


            /*
                Pagination bosilganda projectlar
                boshlanishiga yumshoq scroll.
            */

            setTimeout(
                () => {
                    projectsGridRef
                        .current
                        ?.scrollIntoView({
                            behavior:
                                "smooth",

                            block:
                                "start",
                        });
                },
                50
            );
        };


    // =====================================================
    // RETRY
    // =====================================================

    const handleRetry =
        () => {
            const controller =
                new AbortController();


            fetchProjects(
                controller.signal
            );
        };


    // =====================================================
    // JSX
    // =====================================================

    return (
        <div
            className="
                relative
                min-h-screen
                overflow-hidden
                bg-[#0a0c10]
                px-4
                pb-20
                pt-28

                md:px-6
            "
        >

            {/* =================================================
                AMBIENT BACKGROUND
            ================================================== */}

            <div
                className="
                    pointer-events-none
                    absolute
                    left-[-10%]
                    top-[-10%]
                    h-[40%]
                    w-[40%]
                    rounded-full
                    bg-indigo-600/10
                    blur-[120px]
                "
            />


            <div
                className="
                    pointer-events-none
                    absolute
                    bottom-[10%]
                    right-[-5%]
                    h-[30%]
                    w-[30%]
                    rounded-full
                    bg-purple-600/10
                    blur-[100px]
                "
            />


            <div
                className="
                    relative
                    z-10
                    mx-auto
                    max-w-7xl
                "
            >

                {/* =================================================
                    HEADER
                ================================================== */}

                <header
                    className="
                        mb-12
                        text-center

                        md:mb-16
                    "
                >

                    {/* BADGE */}

                    <div
                        className="
                            mb-5
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-indigo-400/15
                            bg-indigo-500/[0.06]
                            px-3
                            py-1.5
                            text-[9px]
                            font-black
                            uppercase
                            tracking-[0.18em]
                            text-indigo-300
                        "
                    >
                        <FolderKanban
                            size={13}
                        />

                        Community Projects
                    </div>


                    {/* TITLE */}

                    <h1
                        className="
                            text-4xl
                            font-black
                            tracking-tighter
                            text-white

                            sm:text-5xl
                            md:text-7xl
                        "
                    >
                        F

                        <span
                            className="
                                bg-gradient-to-r
                                from-blue-400
                                via-indigo-500
                                to-purple-600
                                bg-clip-text
                                text-transparent
                            "
                        >
                            Society
                        </span>

                        {" "}
                        PROJECTS
                    </h1>


                    {/* DESCRIPTION */}

                    <p
                        className="
                            mx-auto
                            mt-5
                            max-w-2xl
                            text-sm
                            font-medium
                            leading-7
                            text-gray-500

                            md:text-lg
                        "
                    >
                        O‘zbekiston dasturchilari yaratgan loyihalar,
                        g‘oyalar va texnologik tajribalarni kashf eting.
                    </p>


                    {/* =================================================
                        SEARCH
                    ================================================== */}

                    <div
                        className="
                            mx-auto
                            mt-8
                            max-w-2xl
                        "
                    >

                        <div
                            className="
                                group
                                relative
                            "
                        >

                            {/* GLOW */}

                            <div
                                className="
                                    absolute
                                    -inset-1
                                    rounded-2xl
                                    bg-gradient-to-r
                                    from-indigo-500
                                    to-purple-600
                                    opacity-15
                                    blur
                                    transition
                                    duration-500

                                    group-focus-within:opacity-45
                                "
                            />


                            {/* INPUT CONTAINER */}

                            <div
                                className="
                                    relative
                                    flex
                                    items-center
                                    rounded-2xl
                                    border
                                    border-white/[0.06]
                                    bg-[#121720]/95
                                    shadow-2xl
                                    shadow-black/20
                                "
                            >

                                <Search
                                    size={18}
                                    className="
                                        ml-5
                                        shrink-0
                                        text-gray-600
                                        transition

                                        group-focus-within:text-indigo-400
                                    "
                                />


                                <input
                                    ref={
                                        searchInputRef
                                    }
                                    type="text"
                                    value={
                                        searchTerm
                                    }
                                    onChange={
                                        handleSearchChange
                                    }
                                    placeholder="Loyiha, dasturchi yoki texnologiya bo‘yicha qidiring..."
                                    className="
                                        min-w-0
                                        flex-1
                                        border-none
                                        bg-transparent
                                        px-4
                                        py-4
                                        text-sm
                                        font-medium
                                        text-white
                                        outline-none

                                        placeholder:text-gray-700

                                        focus:ring-0

                                        sm:py-5
                                    "
                                />


                                {/* CLEAR */}

                                {searchTerm && (
                                    <button
                                        type="button"
                                        onClick={
                                            handleClearSearch
                                        }
                                        className="
                                            mr-2
                                            grid
                                            h-8
                                            w-8
                                            shrink-0
                                            place-items-center
                                            rounded-lg
                                            text-gray-600
                                            transition

                                            hover:bg-white/[0.05]
                                            hover:text-white
                                        "
                                        title="Qidiruvni tozalash"
                                    >
                                        <X
                                            size={15}
                                        />
                                    </button>
                                )}


                                {/* CTRL K */}

                                <div
                                    className="
                                        mr-4
                                        hidden
                                        items-center
                                        gap-1
                                        rounded-lg
                                        border
                                        border-white/[0.06]
                                        bg-black/25
                                        px-2.5
                                        py-1.5
                                        font-mono
                                        text-[9px]
                                        font-bold
                                        text-gray-600

                                        md:flex
                                    "
                                >
                                    CTRL
                                    <span>
                                        +
                                    </span>
                                    K
                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        RESULT INFO
                    ================================================== */}

                    <div
                        className="
                            mt-5
                            flex
                            flex-wrap
                            items-center
                            justify-center
                            gap-2
                            text-[10px]
                            font-semibold
                            text-gray-600
                        "
                    >

                        {project_isLoading ? (
                            <>
                                <Loader2
                                    size={12}
                                    className="
                                        animate-spin
                                        text-indigo-400
                                    "
                                />

                                Projectlar qidirilmoqda...
                            </>
                        ) : (
                            <>
                                <Sparkles
                                    size={12}
                                    className="
                                        text-indigo-400
                                    "
                                />

                                <span>
                                    {
                                        pagination.count
                                    }
                                    {" "}
                                    ta loyiha topildi
                                </span>


                                {debouncedSearch && (
                                    <>
                                        <span
                                            className="
                                                text-gray-800
                                            "
                                        >
                                            •
                                        </span>

                                        <span>
                                            “
                                            {
                                                debouncedSearch
                                            }
                                            ”
                                        </span>
                                    </>
                                )}
                            </>
                        )}

                    </div>

                </header>


                {/* =================================================
                    ERROR
                ================================================== */}

                {project_error && (
                    <div
                        className="
                            mb-8
                            flex
                            flex-col
                            items-center
                            justify-center
                            rounded-[26px]
                            border
                            border-red-400/15
                            bg-red-500/[0.04]
                            px-6
                            py-10
                            text-center
                        "
                    >

                        <div
                            className="
                                grid
                                h-14
                                w-14
                                place-items-center
                                rounded-2xl
                                border
                                border-red-400/15
                                bg-red-500/[0.07]
                                text-red-300
                            "
                        >
                            <AlertTriangle
                                size={24}
                            />
                        </div>


                        <h2
                            className="
                                mt-4
                                text-lg
                                font-black
                                text-white
                            "
                        >
                            Projectlarni yuklab bo‘lmadi
                        </h2>


                        <p
                            className="
                                mt-2
                                max-w-lg
                                text-xs
                                font-medium
                                leading-6
                                text-red-200/60
                            "
                        >
                            {
                                project_error
                            }
                        </p>


                        <button
                            type="button"
                            onClick={
                                handleRetry
                            }
                            className="
                                mt-5
                                inline-flex
                                items-center
                                gap-2
                                rounded-xl
                                border
                                border-red-400/15
                                bg-red-500/[0.06]
                                px-4
                                py-2.5
                                text-xs
                                font-black
                                text-red-200
                                transition

                                hover:bg-red-500/[0.12]
                            "
                        >
                            <RefreshCw
                                size={14}
                            />

                            Qayta urinish
                        </button>

                    </div>
                )}


                {/* =================================================
                    PROJECT SECTION
                ================================================== */}

                <section
                    ref={
                        projectsGridRef
                    }
                    className="
                        scroll-mt-28
                    "
                >

                    {/* =================================================
                        TOP INFO
                    ================================================== */}

                    {!project_isLoading
                        &&
                        !project_error
                        &&
                        pagination.count > 0
                        && (
                            <div
                                className="
                                    mb-5
                                    flex
                                    flex-col
                                    gap-2

                                    sm:flex-row
                                    sm:items-center
                                    sm:justify-between
                                "
                            >

                                <p
                                    className="
                                        text-xs
                                        font-medium
                                        text-gray-600
                                    "
                                >
                                    <span
                                        className="
                                            font-black
                                            text-gray-300
                                        "
                                    >
                                        {
                                            rangeStart
                                        }
                                        –
                                        {
                                            rangeEnd
                                        }
                                    </span>

                                    {" "}
                                    /{" "}

                                    <span
                                        className="
                                            font-black
                                            text-gray-300
                                        "
                                    >
                                        {
                                            pagination.count
                                        }
                                    </span>

                                    {" "}
                                    loyiha
                                </p>


                                {totalPages > 1 && (
                                    <p
                                        className="
                                            text-[10px]
                                            font-black
                                            uppercase
                                            tracking-[0.12em]
                                            text-gray-700
                                        "
                                    >
                                        Sahifa{" "}
                                        <span
                                            className="
                                                text-indigo-400
                                            "
                                        >
                                            {
                                                currentPage
                                            }
                                        </span>

                                        {" "}
                                        /{" "}

                                        {
                                            totalPages
                                        }
                                    </p>
                                )}

                            </div>
                        )
                    }


                    {/* =================================================
                        LOADING
                    ================================================== */}

                    {project_isLoading ? (

                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-7

                                md:grid-cols-2

                                lg:grid-cols-3
                            "
                        >
                            {Array.from(
                                {
                                    length:
                                        PAGE_SIZE,
                                }
                            ).map(
                                (
                                    _,
                                    index
                                ) => (
                                    <ProjectCardSkeleton
                                        key={
                                            index
                                        }
                                    />
                                )
                            )}
                        </div>

                    ) : !project_error
                        &&
                        projectList.length > 0 ? (

                        // =============================================
                        // PROJECT GRID
                        // =============================================

                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-7

                                md:grid-cols-2

                                lg:grid-cols-3
                            "
                        >

                            {projectList.map(
                                (
                                    project
                                ) => {
                                    const promoted =
                                        isProjectPromoted(
                                            project
                                        );


                                    const projectImage =
                                        getProjectImageUrl(
                                            project
                                                ?.images?.[0]
                                                ?.image
                                        );


                                    const avatar =
                                        project?.user
                                            ? getUserAvatarUrl(
                                                project.user
                                            )
                                            : UserImage;


                                    return (
                                        <Link
                                            to={`/project/${project.id}/detail`}
                                            key={
                                                project.id
                                            }
                                            className="
                                                group
                                                relative
                                                block
                                                h-full
                                            "
                                        >

                                            {/* =================================
                                                PROMOTED GLOW
                                            ================================== */}

                                            {promoted && (
                                                <div
                                                    className="
                                                        absolute
                                                        -inset-1.5
                                                        rounded-[2.2rem]
                                                        bg-gradient-to-r
                                                        from-indigo-500
                                                        via-purple-500
                                                        to-pink-500
                                                        opacity-20
                                                        blur-lg
                                                        transition
                                                        duration-500

                                                        group-hover:opacity-45
                                                    "
                                                />
                                            )}


                                            {/* =================================
                                                CARD
                                            ================================== */}

                                            <article
                                                className="
                                                    relative
                                                    flex
                                                    h-full
                                                    flex-col
                                                    overflow-hidden
                                                    rounded-[2rem]
                                                    border
                                                    border-white/[0.06]
                                                    bg-[#0d1117]
                                                    shadow-xl
                                                    shadow-black/20
                                                    transition-all
                                                    duration-500

                                                    hover:-translate-y-1
                                                    hover:border-white/[0.14]
                                                    hover:shadow-2xl
                                                    hover:shadow-black/30
                                                "
                                            >

                                                {/* =============================
                                                    IMAGE
                                                ============================== */}

                                                <div
                                                    className="
                                                        relative
                                                        h-60
                                                        overflow-hidden
                                                        bg-black
                                                    "
                                                >

                                                    <img
                                                        src={
                                                            projectImage
                                                        }
                                                        alt={
                                                            project.name
                                                        }
                                                        className="
                                                            h-full
                                                            w-full
                                                            object-cover
                                                            opacity-65
                                                            transition-all
                                                            duration-700

                                                            group-hover:scale-105
                                                            group-hover:opacity-90
                                                        "
                                                        onError={(
                                                            event
                                                        ) => {
                                                            event
                                                                .currentTarget
                                                                .src =
                                                                (
                                                                    "https://images.unsplash.com/"
                                                                    +
                                                                    "photo-1618477388954-7852f32655ec"
                                                                    +
                                                                    "?q=80&w=1600&auto=format&fit=crop"
                                                                );
                                                        }}
                                                    />


                                                    {/* OVERLAY */}

                                                    <div
                                                        className="
                                                            absolute
                                                            inset-0
                                                            bg-gradient-to-t
                                                            from-[#0d1117]
                                                            via-transparent
                                                            to-black/20
                                                        "
                                                    />


                                                    {/* TAGS */}

                                                    <div
                                                        className="
                                                            absolute
                                                            left-4
                                                            top-4
                                                            flex
                                                            max-w-[70%]
                                                            flex-wrap
                                                            gap-2
                                                        "
                                                    >

                                                        {project
                                                            ?.language_data
                                                            ?.name && (
                                                            <span
                                                                className="
                                                                    rounded-full
                                                                    border
                                                                    border-white/10
                                                                    bg-black/45
                                                                    px-3
                                                                    py-1.5
                                                                    text-[9px]
                                                                    font-black
                                                                    uppercase
                                                                    tracking-wider
                                                                    text-white
                                                                    backdrop-blur-md
                                                                "
                                                            >
                                                                {
                                                                    project
                                                                        .language_data
                                                                        .name
                                                                }
                                                            </span>
                                                        )}


                                                        {project
                                                            ?.technology_data
                                                            ?.name && (
                                                            <span
                                                                className="
                                                                    rounded-full
                                                                    border
                                                                    border-indigo-400/20
                                                                    bg-indigo-500/15
                                                                    px-3
                                                                    py-1.5
                                                                    text-[9px]
                                                                    font-black
                                                                    uppercase
                                                                    tracking-wider
                                                                    text-indigo-200
                                                                    backdrop-blur-md
                                                                "
                                                            >
                                                                {
                                                                    project
                                                                        .technology_data
                                                                        .name
                                                                }
                                                            </span>
                                                        )}

                                                    </div>


                                                    {/* PROMOTED */}

                                                    {promoted && (
                                                        <div
                                                            className="
                                                                absolute
                                                                right-4
                                                                top-4
                                                                inline-flex
                                                                items-center
                                                                gap-1.5
                                                                rounded-full
                                                                bg-white
                                                                px-3
                                                                py-1.5
                                                                text-[9px]
                                                                font-black
                                                                uppercase
                                                                tracking-wide
                                                                text-black
                                                                shadow-lg
                                                            "
                                                        >
                                                            <Rocket
                                                                size={11}
                                                                className="
                                                                    text-indigo-600
                                                                "
                                                            />

                                                            Promoted
                                                        </div>
                                                    )}


                                                    {/* VIEW OVERLAY */}

                                                    <div
                                                        className="
                                                            absolute
                                                            inset-0
                                                            flex
                                                            items-center
                                                            justify-center
                                                            bg-black/35
                                                            opacity-0
                                                            transition
                                                            duration-300

                                                            group-hover:opacity-100
                                                        "
                                                    >
                                                        <span
                                                            className="
                                                                translate-y-3
                                                                rounded-full
                                                                bg-white
                                                                px-5
                                                                py-2.5
                                                                text-xs
                                                                font-black
                                                                text-black
                                                                shadow-xl
                                                                transition-transform
                                                                duration-300

                                                                group-hover:translate-y-0
                                                            "
                                                        >
                                                            Loyihani ko‘rish
                                                        </span>
                                                    </div>

                                                </div>


                                                {/* =============================
                                                    CONTENT
                                                ============================== */}

                                                <div
                                                    className="
                                                        flex
                                                        flex-1
                                                        flex-col
                                                        p-6

                                                        sm:p-7
                                                    "
                                                >

                                                    {/* TITLE */}

                                                    <div
                                                        className="
                                                            flex
                                                            items-start
                                                            justify-between
                                                            gap-4
                                                        "
                                                    >

                                                        <h3
                                                            className="
                                                                min-w-0
                                                                flex-1
                                                                break-words
                                                                text-xl
                                                                font-black
                                                                leading-tight
                                                                text-white
                                                                transition-colors

                                                                group-hover:text-indigo-300

                                                                sm:text-2xl
                                                            "
                                                        >
                                                            {
                                                                project.name
                                                            }
                                                        </h3>


                                                        <div
                                                            className="
                                                                flex
                                                                shrink-0
                                                                items-center
                                                                gap-1.5
                                                                text-amber-400
                                                            "
                                                        >
                                                            <Star
                                                                size={16}
                                                                fill="currentColor"
                                                            />

                                                            <span
                                                                className="
                                                                    text-sm
                                                                    font-black
                                                                "
                                                            >
                                                                {
                                                                    project
                                                                        ?.stars_count
                                                                    ??
                                                                    0
                                                                }
                                                            </span>
                                                        </div>

                                                    </div>


                                                    {/* DESCRIPTION */}

                                                    <p
                                                        className="
                                                            mb-7
                                                            mt-4
                                                            line-clamp-3
                                                            text-sm
                                                            font-medium
                                                            leading-6
                                                            text-gray-600
                                                        "
                                                    >
                                                        {
                                                            project.description
                                                            ||
                                                            "Ushbu loyiha F.Society dasturchilar hamjamiyatida taqdim etilgan."
                                                        }
                                                    </p>


                                                    {/* BOTTOM */}

                                                    <div
                                                        className="
                                                            mt-auto
                                                            flex
                                                            items-center
                                                            justify-between
                                                            gap-4
                                                            border-t
                                                            border-white/[0.05]
                                                            pt-5
                                                        "
                                                    >

                                                        {/* AUTHOR */}

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
                                                                    relative
                                                                    shrink-0
                                                                "
                                                            >

                                                                <div
                                                                    className="
                                                                        absolute
                                                                        -inset-1
                                                                        rounded-full
                                                                        bg-gradient-to-r
                                                                        from-indigo-500
                                                                        to-purple-600
                                                                        opacity-25
                                                                        blur
                                                                        transition

                                                                        group-hover:opacity-70
                                                                    "
                                                                />


                                                                <img
                                                                    src={
                                                                        avatar
                                                                    }
                                                                    alt={
                                                                        project
                                                                            ?.user
                                                                            ?.username
                                                                        ||
                                                                        "User"
                                                                    }
                                                                    onError={
                                                                        handleUserImageError
                                                                    }
                                                                    className="
                                                                        relative
                                                                        h-10
                                                                        w-10
                                                                        rounded-full
                                                                        border-2
                                                                        border-[#0d1117]
                                                                        object-cover
                                                                    "
                                                                />

                                                            </div>


                                                            <div
                                                                className="
                                                                    min-w-0
                                                                "
                                                            >
                                                                <p
                                                                    className="
                                                                        max-w-[120px]
                                                                        truncate
                                                                        text-xs
                                                                        font-black
                                                                        text-white
                                                                    "
                                                                >
                                                                    {
                                                                        project
                                                                            ?.user
                                                                            ?.first_name

                                                                        ||
                                                                        project
                                                                            ?.user
                                                                            ?.username

                                                                        ||
                                                                        "Foydalanuvchi"
                                                                    }
                                                                </p>


                                                                <p
                                                                    className="
                                                                        mt-0.5
                                                                        text-[8px]
                                                                        font-black
                                                                        uppercase
                                                                        tracking-widest
                                                                        text-gray-700
                                                                    "
                                                                >
                                                                    Muallif
                                                                </p>
                                                            </div>

                                                        </div>


                                                        {/* STATS */}

                                                        <div
                                                            className="
                                                                flex
                                                                shrink-0
                                                                items-center
                                                                gap-3
                                                            "
                                                        >

                                                            <div
                                                                className="
                                                                    flex
                                                                    items-center
                                                                    gap-1.5
                                                                    text-gray-600
                                                                "
                                                            >
                                                                <Eye
                                                                    size={13}
                                                                />

                                                                <span
                                                                    className="
                                                                        text-xs
                                                                        font-black
                                                                        text-gray-300
                                                                    "
                                                                >
                                                                    {
                                                                        project
                                                                            ?.views_count
                                                                        ??
                                                                        0
                                                                    }
                                                                </span>
                                                            </div>


                                                            <div
                                                                className="
                                                                    h-5
                                                                    w-px
                                                                    bg-white/[0.06]
                                                                "
                                                            />


                                                            <div
                                                                className="
                                                                    flex
                                                                    items-center
                                                                    gap-1.5
                                                                    text-gray-600
                                                                "
                                                            >
                                                                <MessageCircle
                                                                    size={13}
                                                                />

                                                                <span
                                                                    className="
                                                                        text-xs
                                                                        font-black
                                                                        text-gray-300
                                                                    "
                                                                >
                                                                    {
                                                                        project
                                                                            ?.comments_count
                                                                        ??
                                                                        0
                                                                    }
                                                                </span>
                                                            </div>

                                                        </div>

                                                    </div>

                                                </div>

                                            </article>

                                        </Link>
                                    );
                                }
                            )}

                        </div>

                    ) : !project_error ? (

                        // =============================================
                        // EMPTY
                        // =============================================

                        <div
                            className="
                                py-28
                                text-center
                            "
                        >

                            <div
                                className="
                                    mx-auto
                                    grid
                                    h-20
                                    w-20
                                    place-items-center
                                    rounded-[24px]
                                    border
                                    border-white/[0.07]
                                    bg-white/[0.025]
                                    text-gray-700
                                "
                            >
                                <Ghost
                                    size={32}
                                />
                            </div>


                            <h2
                                className="
                                    mt-6
                                    text-2xl
                                    font-black
                                    text-white

                                    sm:text-3xl
                                "
                            >
                                Loyihalar topilmadi
                            </h2>


                            <p
                                className="
                                    mx-auto
                                    mt-3
                                    max-w-lg
                                    text-sm
                                    font-medium
                                    leading-7
                                    text-gray-600
                                "
                            >
                                {debouncedSearch
                                    ? (
                                        <>
                                            “
                                            {
                                                debouncedSearch
                                            }
                                            ” bo‘yicha hech qanday loyiha topilmadi.
                                        </>
                                    )
                                    : (
                                        <>
                                            Hozircha platformada ko‘rsatiladigan loyiha mavjud emas.
                                        </>
                                    )
                                }
                            </p>


                            {debouncedSearch && (
                                <button
                                    type="button"
                                    onClick={
                                        handleClearSearch
                                    }
                                    className="
                                        mt-6
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-xl
                                        border
                                        border-indigo-400/20
                                        bg-indigo-500/[0.07]
                                        px-4
                                        py-2.5
                                        text-xs
                                        font-black
                                        text-indigo-300
                                        transition

                                        hover:bg-indigo-500/[0.12]
                                    "
                                >
                                    <X
                                        size={14}
                                    />

                                    Qidiruvni tozalash
                                </button>
                            )}

                        </div>

                    ) : null}


                    {/* =================================================
                        PAGINATION
                    ================================================== */}

                    {!project_isLoading
                        &&
                        !project_error
                        &&
                        totalPages > 1
                        && (
                            <div
                                className="
                                    mt-12
                                    flex
                                    flex-col
                                    items-center
                                    gap-4
                                "
                            >

                                {/* =================================
                                    BUTTONS
                                ================================== */}

                                <div
                                    className="
                                        flex
                                        flex-wrap
                                        items-center
                                        justify-center
                                        gap-1.5
                                        rounded-2xl
                                        border
                                        border-white/[0.06]
                                        bg-[#0d1117]/80
                                        p-2
                                        shadow-xl
                                        shadow-black/20
                                        backdrop-blur-xl
                                    "
                                >

                                    {/* PREVIOUS */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handlePageChange(
                                                currentPage - 1
                                            )
                                        }
                                        disabled={
                                            !pagination.previous
                                            ||
                                            currentPage <= 1
                                        }
                                        className="
                                            inline-flex
                                            h-10
                                            items-center
                                            justify-center
                                            gap-1.5
                                            rounded-xl
                                            border
                                            border-transparent
                                            px-3
                                            text-xs
                                            font-black
                                            text-gray-500
                                            transition

                                            hover:border-white/[0.07]
                                            hover:bg-white/[0.04]
                                            hover:text-white

                                            disabled:cursor-not-allowed
                                            disabled:opacity-25
                                            disabled:hover:bg-transparent
                                        "
                                    >
                                        <ChevronLeft
                                            size={16}
                                        />

                                        <span
                                            className="
                                                hidden
                                                sm:inline
                                            "
                                        >
                                            Oldingi
                                        </span>
                                    </button>


                                    {/* PAGES */}

                                    {pageItems.map(
                                        (
                                            item
                                        ) => {
                                            if (
                                                typeof item !==
                                                "number"
                                            ) {
                                                return (
                                                    <span
                                                        key={
                                                            item
                                                        }
                                                        className="
                                                            grid
                                                            h-10
                                                            w-8
                                                            place-items-center
                                                            text-xs
                                                            font-black
                                                            text-gray-700
                                                        "
                                                    >
                                                        …
                                                    </span>
                                                );
                                            }


                                            const active =
                                                item ===
                                                currentPage;


                                            return (
                                                <button
                                                    key={
                                                        item
                                                    }
                                                    type="button"
                                                    onClick={() =>
                                                        handlePageChange(
                                                            item
                                                        )
                                                    }
                                                    aria-current={
                                                        active
                                                            ? "page"
                                                            : undefined
                                                    }
                                                    className={`
                                                        grid
                                                        h-10
                                                        min-w-10
                                                        place-items-center
                                                        rounded-xl
                                                        border
                                                        px-3
                                                        text-xs
                                                        font-black
                                                        transition-all

                                                        ${
                                                            active
                                                                ? `
                                                                    border-indigo-400/30
                                                                    bg-indigo-600
                                                                    text-white
                                                                    shadow-lg
                                                                    shadow-indigo-600/20
                                                                `
                                                                : `
                                                                    border-transparent
                                                                    text-gray-500

                                                                    hover:border-white/[0.07]
                                                                    hover:bg-white/[0.04]
                                                                    hover:text-white
                                                                `
                                                        }
                                                    `}
                                                >
                                                    {
                                                        item
                                                    }
                                                </button>
                                            );
                                        }
                                    )}


                                    {/* NEXT */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handlePageChange(
                                                currentPage + 1
                                            )
                                        }
                                        disabled={
                                            !pagination.next
                                            ||
                                            currentPage >=
                                            totalPages
                                        }
                                        className="
                                            inline-flex
                                            h-10
                                            items-center
                                            justify-center
                                            gap-1.5
                                            rounded-xl
                                            border
                                            border-transparent
                                            px-3
                                            text-xs
                                            font-black
                                            text-gray-500
                                            transition

                                            hover:border-white/[0.07]
                                            hover:bg-white/[0.04]
                                            hover:text-white

                                            disabled:cursor-not-allowed
                                            disabled:opacity-25
                                            disabled:hover:bg-transparent
                                        "
                                    >
                                        <span
                                            className="
                                                hidden
                                                sm:inline
                                            "
                                        >
                                            Keyingi
                                        </span>

                                        <ChevronRight
                                            size={16}
                                        />
                                    </button>

                                </div>


                                {/* =================================
                                    PAGE INFO
                                ================================== */}

                                <p
                                    className="
                                        text-[10px]
                                        font-semibold
                                        text-gray-700
                                    "
                                >
                                    {
                                        rangeStart
                                    }
                                    –
                                    {
                                        rangeEnd
                                    }
                                    {" "}
                                    /{" "}
                                    {
                                        pagination.count
                                    }
                                    {" "}
                                    loyiha
                                </p>

                            </div>
                        )
                    }

                </section>

            </div>

        </div>
    );
};


export default Projects;