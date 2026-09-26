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
    getProjectFailure,
    getProjectStart,
    getProjectSuccess,
} from "../features/projects";

import ProjectService from "../services/project";

import ProjectsPageCard from "./projects/ProjectsPageCard";

import ProjectCardSkeleton from "./projects/ProjectCardSkeleton";

import ProjectsEmptyState from "./projects/ProjectsEmptyState";

import ProjectsErrorState from "./projects/ProjectsErrorState";

import ProjectsHeader from "./projects/ProjectsHeader";

import ProjectsToolbar from "./projects/ProjectsToolbar";

import ProjectsPagination from "./projects/ProjectsPagination";

import {
    getErrorMessage,
    getPaginationItems,
    isCanceledRequest,
    safeNumber,
} from "./projects/projectHelpers";


// =========================================================
// CONFIG
// =========================================================

const PAGE_SIZE = 6;

const SEARCH_DELAY = 400;


// =========================================================
// PROJECTS
// =========================================================

const Projects = () => {

    const dispatch =
        useDispatch();


    const projectsSectionRef =
        useRef(
            null
        );


    const searchInputRef =
        useRef(
            null
        );


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
    // PAGE
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
                    pagination.count /
                    PAGE_SIZE
                );

            },
            [
                pagination.count,
            ]
        );


    // =====================================================
    // PAGINATION ITEMS
    // =====================================================

    const paginationItems =
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
    // RESULT RANGE
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
                window.setTimeout(
                    () => {

                        setDebouncedSearch(
                            searchTerm.trim()
                        );

                    },
                    SEARCH_DELAY
                );


            return () => {

                window.clearTimeout(
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
                            response
                        )
                    );


                    setPagination({

                        count:
                            safeNumber(
                                response?.count
                            ),

                        next:
                            response?.next
                            ??
                            null,

                        previous:
                            response?.previous
                            ??
                            null,

                    });


                    const responseTotalPages =
                        response?.count >
                        0

                            ? Math.ceil(
                                response.count /
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


            window.setTimeout(
                () => {

                    projectsSectionRef
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

        <main
            className="
                min-h-screen

                bg-[#080b10]

                px-4
                pb-20
                pt-24

                md:px-6
                md:pt-28
            "
        >

            <div
                className="
                    mx-auto

                    max-w-7xl
                "
            >

                {/* =================================================
                    HEADER
                ================================================== */}

                <ProjectsHeader
                    searchInputRef={
                        searchInputRef
                    }

                    searchTerm={
                        searchTerm
                    }

                    onSearchChange={
                        handleSearchChange
                    }

                    onClearSearch={
                        handleClearSearch
                    }
                />


                {/* =================================================
                    TOOLBAR
                ================================================== */}

                <ProjectsToolbar
                    sectionRef={
                        projectsSectionRef
                    }

                    isLoading={
                        project_isLoading
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

                    search={
                        debouncedSearch
                    }
                />


                {/* =================================================
                    ERROR
                ================================================== */}

                <ProjectsErrorState
                    error={
                        project_error
                    }

                    onRetry={
                        handleRetry
                    }
                />


                {/* =================================================
                    PROJECT GRID
                ================================================== */}

                <section
                    className="
                        mt-5

                        grid
                        gap-4

                        xl:grid-cols-2
                    "
                >

                    {project_isLoading &&
                    projectList.length ===
                    0 ? (

                        Array.from({
                            length:
                                PAGE_SIZE,
                        }).map(
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
                        )

                    ) : projectList.length >
                    0 ? (

                        projectList.map(
                            (
                                project,
                                index
                            ) => (

                                <ProjectsPageCard
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
                                    }
                                />

                            )
                        )

                    ) : (

                        <ProjectsEmptyState
                            hasSearch={
                                Boolean(
                                    debouncedSearch
                                )
                            }

                            onClearSearch={
                                handleClearSearch
                            }
                        />

                    )}

                </section>


                {/* =================================================
                    PAGINATION
                ================================================== */}

                <ProjectsPagination
                    currentPage={
                        currentPage
                    }

                    totalPages={
                        totalPages
                    }

                    items={
                        paginationItems
                    }

                    isLoading={
                        project_isLoading
                    }

                    onPageChange={
                        handlePageChange
                    }
                />

            </div>

        </main>
    );
};


export default Projects;