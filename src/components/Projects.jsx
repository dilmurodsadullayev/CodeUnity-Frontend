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
    AlertTriangle,
    Loader2,
    RefreshCw,
} from "lucide-react";

import {
    getProjectFailure,
    getProjectStart,
    getProjectSuccess,
} from "../features/projects";

import ProjectService from "../services/project";

import ProjectGridCard from "./projects/ProjectGridCard";
import ProjectCardSkeleton from "./projects/ProjectCardSkeleton";
import ProjectsEmptyState from "./projects/ProjectsEmptyState";
import ProjectsHero from "./projects/ProjectsHero";
import ProjectsPagination from "./projects/ProjectsPagination";


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
        typeof data?.detail ===
        "string"
    ) {
        return data.detail;
    }


    if (
        Array.isArray(
            data?.detail
        )
        &&
        data.detail.length >
        0
    ) {

        return String(
            data.detail[0]
        );
    }


    if (
        typeof data?.message ===
        "string"
    ) {
        return data.message;
    }


    if (
        typeof data?.error ===
        "string"
    ) {
        return data.error;
    }


    return (
        error?.message
        ||
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
        ||
        error?.name ===
        "AbortError"
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

        count:
            0,

        next:
            null,

        previous:
            null,

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
                    pagination.count <=
                    0
                ) {
                    return 0;
                }


                return Math.ceil(
                    pagination.count
                    /
                    PAGE_SIZE
                );

            },
            [
                pagination.count,
            ]
        );


    // =====================================================
    // RANGE
    // =====================================================

    const rangeStart =

        pagination.count >
        0

            ? (
                (
                    currentPage -
                    1
                )
                *
                PAGE_SIZE
            )
            +
            1

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
                        event.key
                            .toLowerCase()
                        ===
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
    // FETCH
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


                    const responseTotalPages =

                        response.count >
                        0

                            ? Math.ceil(
                                response.count
                                /
                                PAGE_SIZE
                            )

                            : 0;


                    if (
                        responseTotalPages >
                        0
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


                    dispatch(
                        getProjectFailure(
                            getErrorMessage(
                                error
                            )
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
                page <
                1
                ||
                page >
                totalPages
                ||
                page ===
                currentPage
                ||
                project_isLoading
            ) {
                return;
            }


            setCurrentPage(
                page
            );


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

            fetchProjects();
        };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div
            className="
                relative
                min-h-screen
                overflow-hidden
                bg-[#07090d]
                px-4
                pb-24
                pt-28

                md:px-6
            "
        >

            {/* =================================================
                GLOBAL BACKGROUND GRID
            ================================================== */}

            <div
                className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-[linear-gradient(rgba(99,102,241,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.035)_1px,transparent_1px)]
                    bg-[size:64px_64px]
                    [mask-image:radial-gradient(circle_at_center,black_10%,transparent_78%)]
                "
            />


            {/* LEFT GLOW */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -left-48
                    top-10
                    h-[500px]
                    w-[500px]
                    rounded-full
                    bg-indigo-600/[0.10]
                    blur-[150px]
                "
            />


            {/* RIGHT GLOW */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -right-52
                    top-[38%]
                    h-[460px]
                    w-[460px]
                    rounded-full
                    bg-purple-600/[0.09]
                    blur-[145px]
                "
            />


            {/* BOTTOM GLOW */}

            <div
                className="
                    pointer-events-none
                    absolute
                    bottom-0
                    left-1/2
                    h-[320px]
                    w-[700px]
                    -translate-x-1/2
                    rounded-full
                    bg-cyan-500/[0.035]
                    blur-[150px]
                "
            />


            <div
                className="
                    relative
                    z-10
                    mx-auto
                    max-w-[1440px]
                "
            >

                {/* =================================================
                    HERO
                ================================================== */}

                <ProjectsHero

                    searchTerm={
                        searchTerm
                    }

                    searchInputRef={
                        searchInputRef
                    }

                    onSearchChange={
                        handleSearchChange
                    }

                    onClearSearch={
                        handleClearSearch
                    }

                    isLoading={
                        project_isLoading
                    }

                    count={
                        pagination.count
                    }

                    activeSearch={
                        debouncedSearch
                    }

                />


                {/* =================================================
                    ERROR
                ================================================== */}

                {project_error && (

                    <div
                        className="
                            mb-8
                            overflow-hidden
                            rounded-[28px]
                            border
                            border-red-400/15
                            bg-red-500/[0.035]
                        "
                    >

                        <div
                            className="
                                flex
                                flex-col
                                items-center
                                justify-center
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


                            <p
                                className="
                                    mt-4
                                    font-mono
                                    text-[9px]
                                    font-black
                                    uppercase
                                    tracking-[0.16em]
                                    text-red-400/50
                                "
                            >
                                system.error/project_directory
                            </p>


                            <h2
                                className="
                                    mt-2
                                    text-xl
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
                                    text-red-200/55
                                "
                            >
                                {project_error}
                            </p>


                            <button
                                type="button"

                                onClick={
                                    handleRetry
                                }

                                disabled={
                                    project_isLoading
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

                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >

                                {project_isLoading ? (

                                    <Loader2
                                        size={14}
                                        className="
                                            animate-spin
                                        "
                                    />

                                ) : (

                                    <RefreshCw
                                        size={14}
                                    />
                                )}

                                Qayta urinish

                            </button>

                        </div>

                    </div>
                )}


                {/* =================================================
                    PROJECT DIRECTORY
                ================================================== */}

                <section
                    ref={
                        projectsGridRef
                    }

                    className="
                        scroll-mt-28
                    "
                >

                    {/* =============================================
                        DIRECTORY HEADER
                    ============================================== */}

                    {(
                        !project_isLoading
                        &&
                        !project_error
                        &&
                        pagination.count >
                        0
                    ) && (

                        <div
                            className="
                                mb-5
                                flex
                                flex-col
                                gap-3
                                rounded-2xl
                                border
                                border-white/[0.05]
                                bg-white/[0.018]
                                px-4
                                py-3.5

                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                "
                            >

                                <span
                                    className="
                                        h-2
                                        w-2
                                        rounded-full
                                        bg-emerald-400
                                        shadow-[0_0_10px_rgba(52,211,153,0.7)]
                                    "
                                />


                                <p
                                    className="
                                        font-mono
                                        text-[10px]
                                        font-semibold
                                        text-gray-600
                                    "
                                >

                                    showing{" "}

                                    <span
                                        className="
                                            font-black
                                            text-gray-300
                                        "
                                    >
                                        {rangeStart}
                                        –
                                        {rangeEnd}
                                    </span>

                                    {" "}
                                    of{" "}

                                    <span
                                        className="
                                            font-black
                                            text-gray-300
                                        "
                                    >
                                        {pagination.count}
                                    </span>

                                    {" "}
                                    projects

                                </p>

                            </div>


                            <p
                                className="
                                    font-mono
                                    text-[9px]
                                    font-black
                                    uppercase
                                    tracking-[0.13em]
                                    text-gray-700
                                "
                            >

                                page{" "}

                                <span
                                    className="
                                        text-indigo-400
                                    "
                                >
                                    {currentPage}
                                </span>

                                {" / "}

                                {totalPages}

                            </p>

                        </div>
                    )}


                    {/* =============================================
                        LOADING
                    ============================================== */}

                    {project_isLoading ? (

                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-6

                                md:grid-cols-2

                                xl:grid-cols-3
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

                    ) : (
                        !project_error
                        &&
                        projectList.length >
                        0
                    ) ? (

                        /* =========================================
                            PROJECT GRID
                        ========================================== */

                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-6

                                md:grid-cols-2

                                xl:grid-cols-3
                            "
                        >

                            {projectList.map(
                                (
                                    project,
                                    index
                                ) => (

                                    <ProjectGridCard

                                        key={
                                            project.id
                                        }

                                        project={
                                            project
                                        }

                                        index={
                                            (
                                                (
                                                    currentPage -
                                                    1
                                                )
                                                *
                                                PAGE_SIZE
                                            )
                                            +
                                            index
                                            +
                                            1
                                        }

                                    />
                                )
                            )}

                        </div>

                    ) : (
                        !project_error
                    ) ? (

                        <ProjectsEmptyState

                            searchTerm={
                                debouncedSearch
                            }

                            onClearSearch={
                                handleClearSearch
                            }

                        />

                    ) : null}


                    {/* =============================================
                        PAGINATION
                    ============================================== */}

                    <ProjectsPagination

                        currentPage={
                            currentPage
                        }

                        totalPages={
                            totalPages
                        }

                        count={
                            pagination.count
                        }

                        rangeStart={
                            rangeStart
                        }

                        rangeEnd={
                            rangeEnd
                        }

                        hasPrevious={
                            Boolean(
                                pagination.previous
                            )
                        }

                        hasNext={
                            Boolean(
                                pagination.next
                            )
                        }

                        isLoading={
                            project_isLoading
                        }

                        hasError={
                            Boolean(
                                project_error
                            )
                        }

                        onPageChange={
                            handlePageChange
                        }

                    />

                </section>

            </div>

        </div>
    );
};


export default Projects;