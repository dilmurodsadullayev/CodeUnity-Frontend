// src/components/Problems.jsx

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useSearchParams,
} from "react-router-dom";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    Loader2,
} from "lucide-react";


import ProblemCard
    from "./ProblemCard";

import ProblemsHeader
    from "./problems-page/ProblemsHeader";

import ProblemsToolbar
    from "./problems-page/ProblemsToolbar";

import ProblemCardSkeleton
    from "./problems-page/ProblemCardSkeleton";

import ProblemsErrorState
    from "./problems-page/ProblemsErrorState";

import ProblemsEmptyState
    from "./problems-page/ProblemsEmptyState";

import ProblemsPagination
    from "./problems-page/ProblemsPagination";


import {
    PROBLEMS_PAGE_SIZE,
    PROBLEMS_SEARCH_DEBOUNCE_MS,

    buildResetProblemSearchParams,
    buildUpdatedProblemSearchParams,

    getProblemErrorMessage,
    getProblemQueryCorrections,
    getProblemQueryState,
    getProblemResultRange,
    getProblemTotalPages,

    hasActiveProblemFilters,
} from "./problems-page/problemPageHelpers";


import {
    getProblemFailure,
    getProblemStart,
    getProblemSuccess,

    getLanguagesFailure,
    getLanguagesStart,
    getLanguagesSuccess,

    getTechnologiesFailure,
    getTechnologiesStart,
    getTechnologiesSuccess,
} from "../features/problems/Problems";


import ProblemService, {
    isProblemRequestCanceled,
} from "../services/problems";


import {
    siteToast,
} from "./ui/AuthToast";


// =========================================================
// PROBLEMS
// =========================================================

const Problems = () => {

    // =====================================================
    // REDUX
    // =====================================================

    const dispatch =
        useDispatch();


    const {
        problems = [],
        count = 0,

        listIsLoading,
        isLoading,

        listError,

        languages = [],
        technologies = [],

        languagesIsLoading,
        technologiesIsLoading,
    } = useSelector(
        (
            state
        ) =>
            state.problem
    );


    // =====================================================
    // LOADING
    // =====================================================

    const loading =
        typeof listIsLoading ===
            "boolean"
            ? listIsLoading
            : Boolean(
                isLoading
            );


    // =====================================================
    // LIST ERROR
    // =====================================================

    const currentError =
        listError
        ||
        null;


    // =====================================================
    // ROUTER QUERY
    // =====================================================

    const [
        searchParams,
        setSearchParams,
    ] = useSearchParams();


    // =====================================================
    // QUERY STATE
    // =====================================================

    const queryState =
        useMemo(
            () => {

                return getProblemQueryState(
                    searchParams
                );

            },
            [
                searchParams,
            ]
        );


    const {
        page:
            currentPage,

        search:
            debouncedSearchTerm,

        status:
            statusFilter,

        urgent:
            urgentFilter,

        language:
            languageFilter,

        technology:
            technologyFilter,

        ordering,
    } = queryState;


    // =====================================================
    // SEARCH INPUT
    // =====================================================

    const [
        searchTerm,
        setSearchTerm,
    ] = useState(
        debouncedSearchTerm
    );


    // =====================================================
    // RETRY KEY
    // =====================================================

    const [
        retryKey,
        setRetryKey,
    ] = useState(
        0
    );


    // =====================================================
    // SUCCESSFUL LIST LOAD
    // =====================================================

    const [
        hasLoadedProblemList,
        setHasLoadedProblemList,
    ] = useState(
        false
    );


    // =====================================================
    // UPDATE QUERY
    // =====================================================

    const updateQueryParams =
        useCallback(
            (
                updates,
                {
                    replace = false,
                } = {}
            ) => {

                setSearchParams(
                    (
                        previousParams
                    ) => {

                        return buildUpdatedProblemSearchParams(
                            previousParams,
                            updates
                        );
                    },
                    {
                        replace,
                    }
                );

            },
            [
                setSearchParams,
            ]
        );


    // =====================================================
    // URL -> SEARCH INPUT
    //
    // Refresh / Browser Back / Browser Forward
    // =====================================================

    useEffect(
        () => {

            setSearchTerm(
                debouncedSearchTerm
            );

        },
        [
            debouncedSearchTerm,
        ]
    );


    // =====================================================
    // SEARCH DEBOUNCE
    // =====================================================

    useEffect(
        () => {

            const cleanSearch =
                searchTerm.trim();


            if (
                cleanSearch ===
                debouncedSearchTerm
            ) {
                return undefined;
            }


            const timer =
                window.setTimeout(
                    () => {

                        updateQueryParams(
                            {
                                search:
                                    cleanSearch,

                                page:
                                    1,
                            },
                            {
                                replace:
                                    true,
                            }
                        );

                    },
                    PROBLEMS_SEARCH_DEBOUNCE_MS
                );


            return () => {

                window.clearTimeout(
                    timer
                );
            };

        },
        [
            debouncedSearchTerm,
            searchTerm,
            updateQueryParams,
        ]
    );


    // =====================================================
    // NORMALIZE QUERY
    // =====================================================

    useEffect(
        () => {

            const corrections =
                getProblemQueryCorrections(
                    searchParams
                );


            if (
                Object.keys(
                    corrections
                ).length === 0
            ) {
                return;
            }


            updateQueryParams(
                corrections,
                {
                    replace:
                        true,
                }
            );

        },
        [
            searchParams,
            updateQueryParams,
        ]
    );


    // =====================================================
    // LOAD LANGUAGES + TECHNOLOGIES
    // =====================================================

    useEffect(
        () => {

            const controller =
                new AbortController();


            let mounted =
                true;


            const loadCatalog =
                async () => {

                    // =====================================
                    // START
                    // =====================================

                    dispatch(
                        getLanguagesStart()
                    );


                    dispatch(
                        getTechnologiesStart()
                    );


                    // =====================================
                    // PARALLEL
                    // =====================================

                    const [
                        languagesResult,
                        technologiesResult,
                    ] = await Promise.allSettled([

                        ProblemService
                            .getLanguagesList({
                                signal:
                                    controller.signal,
                            }),

                        ProblemService
                            .getTechnologiesList({
                                signal:
                                    controller.signal,
                            }),
                    ]);


                    // =====================================
                    // UNMOUNT / CANCEL
                    // =====================================

                    if (
                        !mounted
                        ||
                        controller.signal.aborted
                    ) {
                        return;
                    }


                    // =====================================
                    // LANGUAGES
                    // =====================================

                    if (
                        languagesResult.status ===
                        "fulfilled"
                    ) {

                        dispatch(
                            getLanguagesSuccess(
                                languagesResult.value
                            )
                        );

                    } else {

                        const requestError =
                            languagesResult.reason;


                        if (
                            !isProblemRequestCanceled(
                                requestError
                            )
                        ) {

                            const message =
                                getProblemErrorMessage(
                                    requestError,
                                    "Dasturlash tillarini yuklab bo‘lmadi."
                                );


                            dispatch(
                                getLanguagesFailure(
                                    message
                                )
                            );


                            siteToast.error(
                                message,
                                {
                                    title:
                                        "Tillar yuklanmadi",
                                }
                            );
                        }
                    }


                    // =====================================
                    // TECHNOLOGIES
                    // =====================================

                    if (
                        technologiesResult.status ===
                        "fulfilled"
                    ) {

                        dispatch(
                            getTechnologiesSuccess(
                                technologiesResult.value
                            )
                        );

                    } else {

                        const requestError =
                            technologiesResult.reason;


                        if (
                            !isProblemRequestCanceled(
                                requestError
                            )
                        ) {

                            const message =
                                getProblemErrorMessage(
                                    requestError,
                                    "Texnologiyalarni yuklab bo‘lmadi."
                                );


                            dispatch(
                                getTechnologiesFailure(
                                    message
                                )
                            );


                            siteToast.error(
                                message,
                                {
                                    title:
                                        "Texnologiyalar yuklanmadi",
                                }
                            );
                        }
                    }
                };


            loadCatalog();


            return () => {

                mounted =
                    false;


                controller.abort();
            };

        },
        [
            dispatch,
        ]
    );


    // =====================================================
    // GET PROBLEMS
    // =====================================================

    const getProblems =
        useCallback(
            async (
                signal
            ) => {

                // =========================================
                // CURRENT QUERY IS LOADING
                // =========================================

                setHasLoadedProblemList(
                    false
                );


                dispatch(
                    getProblemStart()
                );


                try {

                    const response =
                        await ProblemService
                            .getProblemsList({

                                page:
                                    currentPage,

                                pageSize:
                                    PROBLEMS_PAGE_SIZE,

                                search:
                                    debouncedSearchTerm,

                                status:
                                    statusFilter,

                                urgent:
                                    urgentFilter === "all"
                                        ? undefined
                                        : urgentFilter,

                                language:
                                    languageFilter,

                                technology:
                                    technologyFilter,

                                ordering,

                                signal,
                            });


                    // =====================================
                    // CANCELED AFTER RESPONSE
                    // =====================================

                    if (
                        signal?.aborted
                    ) {
                        return;
                    }


                    dispatch(
                        getProblemSuccess(
                            response
                        )
                    );


                    // =====================================
                    // SUCCESS
                    // =====================================

                    setHasLoadedProblemList(
                        true
                    );

                } catch (
                    requestError
                ) {

                    // =====================================
                    // CANCEL IS NORMAL
                    // =====================================

                    if (
                        isProblemRequestCanceled(
                            requestError
                        )
                        ||
                        signal?.aborted
                    ) {
                        return;
                    }


                    const message =
                        getProblemErrorMessage(
                            requestError,
                            "Muammolarni yuklashda xatolik yuz berdi."
                        );


                    dispatch(
                        getProblemFailure(
                            message
                        )
                    );


                    // Inline ProblemsErrorState
                    // xatoni ko‘rsatadi.
                }

            },
            [
                currentPage,
                debouncedSearchTerm,
                dispatch,
                languageFilter,
                ordering,
                statusFilter,
                technologyFilter,
                urgentFilter,
            ]
        );


    // =====================================================
    // QUERY CHANGE / RETRY -> FETCH
    // =====================================================

    useEffect(
        () => {

            const controller =
                new AbortController();


            getProblems(
                controller.signal
            );


            return () => {

                controller.abort();
            };

        },
        [
            getProblems,
            retryKey,
        ]
    );


    // =====================================================
    // SAFE PROBLEM LIST
    // =====================================================

    const problemList =
        Array.isArray(
            problems
        )
            ? problems
            : [];


    // =====================================================
    // HAS DATA
    // =====================================================

    const hasProblemData =
        problemList.length > 0;


    // =====================================================
    // TOTAL PAGES
    // =====================================================

    const totalPages =
        useMemo(
            () => {

                return getProblemTotalPages({
                    count,

                    pageSize:
                        PROBLEMS_PAGE_SIZE,
                });

            },
            [
                count,
            ]
        );


    // =====================================================
    // INVALID PAGE FIX
    //
    // Faqat successful response kelgandan keyin.
    // =====================================================

    useEffect(
        () => {

            if (
                !hasLoadedProblemList
                ||
                loading
                ||
                currentError
            ) {
                return;
            }


            if (
                currentPage <=
                totalPages
            ) {
                return;
            }


            updateQueryParams(
                {
                    page:
                        totalPages,
                },
                {
                    replace:
                        true,
                }
            );

        },
        [
            currentPage,
            currentError,
            hasLoadedProblemList,
            loading,
            totalPages,
            updateQueryParams,
        ]
    );


    // =====================================================
    // RESULT RANGE
    // =====================================================

    const {
        start:
            resultStart,

        end:
            resultEnd,
    } = useMemo(
        () => {

            return getProblemResultRange({
                count,

                page:
                    currentPage,

                pageSize:
                    PROBLEMS_PAGE_SIZE,
            });

        },
        [
            count,
            currentPage,
        ]
    );


    // =====================================================
    // ACTIVE FILTERS
    // =====================================================

    const hasActiveFilters =
        hasActiveProblemFilters({

            search:
                searchTerm,

            status:
                statusFilter,

            urgent:
                urgentFilter,

            language:
                languageFilter,

            technology:
                technologyFilter,

            ordering,
        });


    // =====================================================
    // CLEAR SEARCH
    // =====================================================

    const handleClearSearch =
        useCallback(
            () => {

                setSearchTerm(
                    ""
                );


                updateQueryParams(
                    {
                        search:
                            "",

                        page:
                            1,
                    }
                );

            },
            [
                updateQueryParams,
            ]
        );


    // =====================================================
    // RESET ALL FILTERS
    // =====================================================

    const handleResetFilters =
        useCallback(
            () => {

                setSearchTerm(
                    ""
                );


                setSearchParams(
                    (
                        previousParams
                    ) => {

                        return buildResetProblemSearchParams(
                            previousParams
                        );
                    }
                );

            },
            [
                setSearchParams,
            ]
        );


    // =====================================================
    // RETRY
    // =====================================================

    const handleRetry =
        useCallback(
            () => {

                if (
                    loading
                ) {
                    return;
                }


                setRetryKey(
                    (
                        previous
                    ) =>
                        previous + 1
                );

            },
            [
                loading,
            ]
        );


    // =====================================================
    // STATUS
    // =====================================================

    const handleStatusChange =
        useCallback(
            (
                value
            ) => {

                updateQueryParams(
                    {
                        status:
                            value,

                        page:
                            1,
                    }
                );

            },
            [
                updateQueryParams,
            ]
        );


    // =====================================================
    // URGENT
    // =====================================================

    const handleUrgentChange =
        useCallback(
            (
                value
            ) => {

                updateQueryParams(
                    {
                        urgent:
                            value,

                        page:
                            1,
                    }
                );

            },
            [
                updateQueryParams,
            ]
        );


    // =====================================================
    // LANGUAGE
    // =====================================================

    const handleLanguageChange =
        useCallback(
            (
                value
            ) => {

                updateQueryParams(
                    {
                        language:
                            value,

                        page:
                            1,
                    }
                );

            },
            [
                updateQueryParams,
            ]
        );


    // =====================================================
    // TECHNOLOGY
    // =====================================================

    const handleTechnologyChange =
        useCallback(
            (
                value
            ) => {

                updateQueryParams(
                    {
                        technology:
                            value,

                        page:
                            1,
                    }
                );

            },
            [
                updateQueryParams,
            ]
        );


    // =====================================================
    // ORDERING
    // =====================================================

    const handleOrderingChange =
        useCallback(
            (
                value
            ) => {

                updateQueryParams(
                    {
                        ordering:
                            value,

                        page:
                            1,
                    }
                );

            },
            [
                updateQueryParams,
            ]
        );


    // =====================================================
    // PAGE CHANGE
    // =====================================================

    const handlePageChange =
        useCallback(
            (
                page
            ) => {

                if (
                    loading
                    ||
                    page < 1
                    ||
                    page > totalPages
                    ||
                    page === currentPage
                ) {
                    return;
                }


                updateQueryParams(
                    {
                        page,
                    }
                );


                window.scrollTo({
                    top: 0,
                    behavior:
                        "smooth",
                });

            },
            [
                currentPage,
                loading,
                totalPages,
                updateQueryParams,
            ]
        );


    // =====================================================
    // INITIAL SKELETON
    // =====================================================

    const showInitialSkeleton =
        !currentError
        &&
        !hasProblemData
        &&
        (
            !hasLoadedProblemList
            ||
            loading
        );


    // =====================================================
    // EMPTY STATE
    // =====================================================

    const showEmptyState =
        hasLoadedProblemList
        &&
        !loading
        &&
        !currentError
        &&
        !hasProblemData;


    // =====================================================
    // PAGINATION AREA
    // =====================================================

    const showPaginationArea =
        hasLoadedProblemList
        &&
        !loading
        &&
        !currentError
        &&
        count > 0;


    // =====================================================
    // JSX
    // =====================================================

    return (

        <section
            id="problems-hero"

            className="
                min-h-screen

                bg-gradient-to-b
                from-gray-900
                to-black

                px-4
                py-20

                text-gray-100
            "
        >

            <div
                className="
                    container
                    mx-auto
                    max-w-7xl
                "
            >

                {/* =========================================
                    HEADER
                ========================================== */}

                <ProblemsHeader />


                {/* =========================================
                    TOOLBAR
                ========================================== */}

                <ProblemsToolbar
                    searchValue={
                        searchTerm
                    }

                    onSearchChange={
                        setSearchTerm
                    }

                    onSearchClear={
                        handleClearSearch
                    }

                    isSearching={
                        Boolean(
                            loading
                            &&
                            searchTerm.trim()
                        )
                    }


                    status={
                        statusFilter
                    }

                    urgent={
                        urgentFilter
                    }

                    language={
                        languageFilter
                    }

                    technology={
                        technologyFilter
                    }

                    ordering={
                        ordering
                    }


                    languages={
                        languages
                    }

                    technologies={
                        technologies
                    }

                    languagesIsLoading={
                        languagesIsLoading
                    }

                    technologiesIsLoading={
                        technologiesIsLoading
                    }


                    onStatusChange={
                        handleStatusChange
                    }

                    onUrgentChange={
                        handleUrgentChange
                    }

                    onLanguageChange={
                        handleLanguageChange
                    }

                    onTechnologyChange={
                        handleTechnologyChange
                    }

                    onOrderingChange={
                        handleOrderingChange
                    }


                    hasActiveFilters={
                        hasActiveFilters
                    }

                    onResetFilters={
                        handleResetFilters
                    }
                />


                {/* =========================================
                    RESULT HEADER
                ========================================== */}

                <div
                    className="
                        mb-6

                        flex
                        flex-col
                        gap-3

                        sm:flex-row
                        sm:items-end
                        sm:justify-between
                    "
                >

                    <div>

                        <p
                            className="
                                font-mono
                                text-[10px]
                                font-black
                                uppercase
                                tracking-[0.18em]
                                text-cyan-400/70
                            "
                        >
                            problem.registry
                        </p>


                        <h2
                            className="
                                mt-1

                                text-xl
                                font-black
                                text-white
                            "
                        >
                            Muammolar
                        </h2>

                    </div>


                    <div
                        className="
                            flex
                            items-center
                            gap-3

                            text-xs
                            font-bold
                            text-gray-600
                        "
                    >

                        {hasLoadedProblemList &&
                            count > 0 && (

                            <span>
                                {resultStart}
                                {" — "}
                                {resultEnd}
                                {" / "}
                                {count}
                            </span>
                        )}


                        {loading && (

                            <span
                                role="status"

                                className="
                                    inline-flex
                                    items-center
                                    gap-1.5

                                    text-cyan-400
                                "
                            >

                                <Loader2
                                    size={13}

                                    className="
                                        animate-spin
                                    "
                                />

                                yangilanmoqda

                            </span>
                        )}

                    </div>

                </div>


                {/* =========================================
                    ERROR
                ========================================== */}

                {currentError &&
                    !loading && (

                    <ProblemsErrorState
                        message={
                            currentError
                        }

                        onRetry={
                            handleRetry
                        }

                        isRetrying={
                            loading
                        }

                        hasData={
                            hasProblemData
                        }
                    />
                )}


                {/* =========================================
                    GRID
                ========================================== */}

                <div
                    aria-busy={
                        loading
                    }

                    className="
                        grid
                        gap-6

                        md:grid-cols-2

                        xl:grid-cols-3
                    "
                >

                    {/* =====================================
                        INITIAL SKELETON
                    ====================================== */}

                    {showInitialSkeleton && (

                        Array
                            .from({
                                length:
                                    PROBLEMS_PAGE_SIZE,
                            })
                            .map(
                                (
                                    _,
                                    index
                                ) => (

                                    <ProblemCardSkeleton
                                        key={
                                            `problem-skeleton-${index}`
                                        }
                                    />
                                )
                            )
                    )}


                    {/* =====================================
                        PROBLEM CARDS
                    ====================================== */}

                    {!showInitialSkeleton &&
                        problemList.map(
                            (
                                problem
                            ) => (

                                <ProblemCard
                                    key={
                                        problem.id
                                    }

                                    id={
                                        problem.id
                                    }

                                    username={
                                        problem
                                            .user
                                            ?.username
                                    }

                                    firstName={
                                        problem
                                            .user
                                            ?.first_name
                                    }

                                    lastName={
                                        problem
                                            .user
                                            ?.last_name
                                    }

                                    image={
                                        problem
                                            .user
                                            ?.image
                                    }

                                    name={
                                        problem
                                            .problem
                                    }

                                    views={
                                        problem
                                            .total_views
                                        ??
                                        0
                                    }

                                    languages={
                                        problem
                                            .language_data
                                        ??
                                        []
                                    }

                                    technologies={
                                        problem
                                            .technology_data
                                        ??
                                        []
                                    }

                                    createdAt={
                                        problem
                                            .created_at
                                    }

                                    star={
                                        problem
                                            .star
                                        ??
                                        0
                                    }

                                    responseCount={
                                        problem
                                            .response_count
                                        ??
                                        0
                                    }

                                    isSolved={
                                        problem
                                            .is_solved
                                    }

                                    status={
                                        problem
                                            .status
                                    }

                                    isUrgent={
                                        problem
                                            .is_urgent
                                    }

                                    deadline={
                                        problem
                                            .deadline
                                    }

                                    offeredCoins={
                                        problem
                                            .offered_coins
                                        ??
                                        0
                                    }
                                />
                            )
                        )
                    }


                    {/* =====================================
                        EMPTY STATE
                    ====================================== */}

                    {showEmptyState && (

                        <ProblemsEmptyState
                            hasActiveFilters={
                                hasActiveFilters
                            }

                            onResetFilters={
                                handleResetFilters
                            }
                        />
                    )}

                </div>


                {/* =========================================
                    PAGINATION
                ========================================== */}

                {showPaginationArea && (

                    <ProblemsPagination
                        currentPage={
                            currentPage
                        }

                        totalPages={
                            totalPages
                        }

                        count={
                            count
                        }

                        onPageChange={
                            handlePageChange
                        }

                        disabled={
                            loading
                        }
                    />
                )}

            </div>

        </section>
    );
};


export default Problems;