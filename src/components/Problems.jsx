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


import ProblemCard
    from "./ProblemCard";

import ProblemsHeader
    from "./problems-page/ProblemsHeader";

import ProblemsToolbar
    from "./problems-page/ProblemsToolbar";

import ProblemsResultsHeader
    from "./problems-page/ProblemsResultsHeader";

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
// SAFE COUNT
// =========================================================

const getSafeCount = (
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
        ||
        number < 0
    ) {
        return 0;
    }


    return number;
};


// =========================================================
// INVALID DRF PAGE
// =========================================================

const isInvalidPaginationError = (
    error
) => {

    const status =
        error?.response?.status
        ??
        error?.status
        ??
        null;


    if (
        status !== 404
    ) {
        return false;
    }


    const data =
        error?.serverData
        ??
        error?.response?.data;


    const detail =
        typeof data ===
            "string"
            ? data
            : data?.detail;


    if (
        typeof detail !==
        "string"
    ) {
        return false;
    }


    const normalized =
        detail
            .trim()
            .toLowerCase();


    return (
        normalized.includes(
            "invalid page"
        )
        ||
        normalized.includes(
            "page contains no results"
        )
    );
};


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
    // SAFE REDUX STATE
    // =====================================================

    const loading =
        typeof listIsLoading ===
            "boolean"
            ? listIsLoading
            : Boolean(
                isLoading
            );


    const currentError =
        listError
        ||
        null;


    const problemList =
        Array.isArray(
            problems
        )
            ? problems
            : [];


    const problemCount =
        getSafeCount(
            count
        );


    const hasProblemData =
        problemList.length > 0;


    // =====================================================
    // ROUTER QUERY
    // =====================================================

    const [
        searchParams,
        setSearchParams,
    ] = useSearchParams();


    // =====================================================
    // NORMALIZED QUERY STATE
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
    // CURRENT QUERY KEY
    //
    // Muhim:
    //
    // Oldingi hasLoadedProblemList boolean faqat
    // "biror request success bo‘lganmi?"ni bilardi.
    //
    // Lekin qaysi query success bo‘lganini bilmasdi.
    //
    // Misol:
    //
    // old query:
    // ?page=2
    //
    // keyin:
    // ?page=999
    //
    // Eski success state yangi query bilan aralashishi
    // mumkin edi.
    //
    // Endi har query unique keyga ega.
    // =====================================================

    const currentQueryKey =
        useMemo(
            () => {

                return JSON.stringify([
                    currentPage,
                    debouncedSearchTerm,
                    statusFilter,
                    urgentFilter,
                    languageFilter,
                    technologyFilter,
                    ordering,
                ]);

            },
            [
                currentPage,
                debouncedSearchTerm,
                languageFilter,
                ordering,
                statusFilter,
                technologyFilter,
                urgentFilter,
            ]
        );


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
    // LAST SUCCESSFUL QUERY
    //
    // Faqat API success bo‘lganda update bo‘ladi.
    // =====================================================

    const [
        lastSuccessfulQueryKey,
        setLastSuccessfulQueryKey,
    ] = useState(
        null
    );


    // =====================================================
    // CURRENT QUERY RESOLVED?
    // =====================================================

    const isCurrentQueryResolved =
        lastSuccessfulQueryKey ===
        currentQueryKey;


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
    // Refresh / Back / Forward.
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
                                // Input har harfda browser history
                                // yaratib yubormasin.
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
    // NORMALIZE INVALID QUERY
    //
    // Masalan:
    //
    // ?page=-5
    // ?status=hello
    // ?urgent=test
    // ?ordering=random
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
    //
    // Parallel requests.
    // =====================================================

    useEffect(
        () => {

            const controller =
                new AbortController();


            let mounted =
                true;


            const loadCatalog =
                async () => {

                    dispatch(
                        getLanguagesStart()
                    );


                    dispatch(
                        getTechnologiesStart()
                    );


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
                                    urgentFilter ===
                                        "all"
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
                    // REQUEST CANCELED
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
                    // IMPORTANT
                    //
                    // Faqat aynan shu query success bo‘ldi.
                    // =====================================

                    setLastSuccessfulQueryKey(
                        currentQueryKey
                    );

                } catch (
                    requestError
                ) {

                    // =====================================
                    // ABORT NORMAL FLOW
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


                    // =====================================
                    // INVALID DRF PAGE
                    //
                    // /problems?page=999
                    //
                    // DRF:
                    // 404 Invalid page.
                    //
                    // Generic error ko‘rsatmaymiz.
                    // =====================================

                    if (
                        currentPage > 1
                        &&
                        isInvalidPaginationError(
                            requestError
                        )
                    ) {

                        updateQueryParams(
                            {
                                page:
                                    1,
                            },
                            {
                                replace:
                                    true,
                            }
                        );


                        return;
                    }


                    // =====================================
                    // REAL API ERROR
                    // =====================================

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
                }

            },
            [
                currentPage,
                currentQueryKey,
                debouncedSearchTerm,
                dispatch,
                languageFilter,
                ordering,
                statusFilter,
                technologyFilter,
                updateQueryParams,
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
    // TOTAL PAGES
    // =====================================================

    const totalPages =
        useMemo(
            () => {

                return getProblemTotalPages({
                    count:
                        problemCount,

                    pageSize:
                        PROBLEMS_PAGE_SIZE,
                });

            },
            [
                problemCount,
            ]
        );


    // =====================================================
    // INVALID PAGE AFTER SUCCESS
    //
    // Bu fallback himoya.
    //
    // Agar backend kelajakda invalid page uchun
    // 404 emas:
    //
    // 200 + empty list
    //
    // qaytaradigan bo‘lsa ham ishlaydi.
    //
    // Muhim:
    // faqat currentQueryKey muvaffaqiyatli resolve
    // bo‘lgan bo‘lsa correction qilinadi.
    // =====================================================

    useEffect(
        () => {

            if (
                !isCurrentQueryResolved
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
            currentError,
            currentPage,
            isCurrentQueryResolved,
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
                count:
                    problemCount,

                page:
                    currentPage,

                pageSize:
                    PROBLEMS_PAGE_SIZE,
            });

        },
        [
            currentPage,
            problemCount,
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


                updateQueryParams({
                    search:
                        "",

                    page:
                        1,
                });

            },
            [
                updateQueryParams,
            ]
        );


    // =====================================================
    // RESET ALL
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
    // GENERIC FILTER UPDATE
    //
    // Old code:
    //
    // handleStatusChange
    // handleUrgentChange
    // handleLanguageChange
    // ...
    //
    // har biri bir xil query update kodi edi.
    //
    // Endi core logic bitta joyda.
    // =====================================================

    const updateFilter =
        useCallback(
            (
                key,
                value
            ) => {

                updateQueryParams({
                    [key]:
                        value,

                    page:
                        1,
                });

            },
            [
                updateQueryParams,
            ]
        );


    // =====================================================
    // FILTER HANDLERS
    // =====================================================

    const handleStatusChange =
        useCallback(
            (
                value
            ) => {

                updateFilter(
                    "status",
                    value
                );

            },
            [
                updateFilter,
            ]
        );


    const handleUrgentChange =
        useCallback(
            (
                value
            ) => {

                updateFilter(
                    "urgent",
                    value
                );

            },
            [
                updateFilter,
            ]
        );


    const handleLanguageChange =
        useCallback(
            (
                value
            ) => {

                updateFilter(
                    "language",
                    value
                );

            },
            [
                updateFilter,
            ]
        );


    const handleTechnologyChange =
        useCallback(
            (
                value
            ) => {

                updateFilter(
                    "technology",
                    value
                );

            },
            [
                updateFilter,
            ]
        );


    const handleOrderingChange =
        useCallback(
            (
                value
            ) => {

                updateFilter(
                    "ordering",
                    value
                );

            },
            [
                updateFilter,
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


                updateQueryParams({
                    page,
                });


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
    // UI STATES
    // =====================================================

    // Initial load yoki yangi queryda eski data yo‘q.
    const showInitialSkeleton =
        !currentError
        &&
        !hasProblemData
        &&
        (
            !isCurrentQueryResolved
            ||
            loading
        );


    // Empty state faqat aynan hozirgi query
    // muvaffaqiyatli tugaganidan keyin.
    const showEmptyState =
        isCurrentQueryResolved
        &&
        !loading
        &&
        !currentError
        &&
        !hasProblemData;


    const showPaginationArea =
        isCurrentQueryResolved
        &&
        !loading
        &&
        !currentError
        &&
        problemCount > 0;


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
                            debouncedSearchTerm
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

                <ProblemsResultsHeader
                    count={
                        problemCount
                    }

                    start={
                        resultStart
                    }

                    end={
                        resultEnd
                    }

                    isLoading={
                        loading
                    }

                    isResolved={
                        isCurrentQueryResolved
                    }
                />


                {/* =========================================
                    ERROR STATE
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
                    PROBLEMS GRID
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
                        SKELETON
                    ====================================== */}

                    {showInitialSkeleton &&
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
                    }


                    {/* =====================================
                        CARDS
                    ====================================== */}

                    {!showInitialSkeleton &&
                        problemList.map(
                            (
                                problem,
                                index
                            ) => (

                                <ProblemCard
                                    key={
                                        problem?.id
                                        ??
                                        `problem-${index}`
                                    }

                                    problem={
                                        problem
                                    }
                                />
                            )
                        )
                    }


                    {/* =====================================
                        EMPTY
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
                            problemCount
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