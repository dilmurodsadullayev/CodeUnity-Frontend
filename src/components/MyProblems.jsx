// src/components/MyProblems.jsx

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
    getMyProblemStart,
    getMyProblemSuccess,
    getMyProblemtFailure,
} from "../features/problems/Problems";

import ProblemService from "../services/problems";

import {
    siteToast,
} from "./ui/AuthToast";

import MyProblemCard from "./my-problems/MyProblemCard";

import MyProblemCardSkeleton from "./my-problems/MyProblemCardSkeleton";

import MyProblemsHeader from "./my-problems/MyProblemsHeader";

import MyProblemsSearch from "./my-problems/MyProblemsSearch";

import MyProblemsEmptyState from "./my-problems/MyProblemsEmptyState";

import MyProblemsErrorState from "./my-problems/MyProblemsErrorState";

import MyProblemsPagination from "./my-problems/MyProblemsPagination";

import {
    getMyProblemsErrorMessage,
    getMyProblemsPaginationItems,
    MY_PROBLEMS_PAGE_SIZE,
    MY_PROBLEMS_SEARCH_DELAY,
} from "./my-problems/myProblemHelpers";


// =========================================================
// SELECTOR
// =========================================================

const selectProblemState = (
    state
) => state.problem;


// =========================================================
// MY PROBLEMS
// =========================================================

const MyProblems = () => {

    const dispatch =
        useDispatch();


    const {
        myProblems,

        isLoading,

        myProblemsCount,

        error,
    } = useSelector(
        selectProblemState
    );


    // =====================================================
    // REFS
    // =====================================================

    const problemsGridRef =
        useRef(
            null
        );


    const latestRequestRef =
        useRef(
            0
        );


    // =====================================================
    // STATE
    // =====================================================

    const [
        currentPage,
        setCurrentPage,
    ] = useState(
        1
    );


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
    // SAFE DATA
    // =====================================================

    const problemList =
        useMemo(
            () => {

                return Array.isArray(
                    myProblems
                )
                    ? myProblems
                    : [];

            },
            [
                myProblems,
            ]
        );


    // =====================================================
    // TOTAL PAGES
    // =====================================================

    const totalPages =
        useMemo(
            () => {

                const count =
                    Number(
                        myProblemsCount
                        ||
                        0
                    );


                if (
                    !Number.isFinite(
                        count
                    )
                    ||
                    count <=
                    0
                ) {

                    return 0;
                }


                return Math.ceil(
                    count /
                    MY_PROBLEMS_PAGE_SIZE
                );

            },
            [
                myProblemsCount,
            ]
        );


    // =====================================================
    // PAGINATION
    // =====================================================

    const pageItems =
        useMemo(
            () => {

                return getMyProblemsPaginationItems(
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
    // SEARCH DEBOUNCE
    //
    // Oldingi kod har harf bosilganda APIga ketardi.
    // Endi user yozishni to'xtatgandan keyin request boradi.
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
                    MY_PROBLEMS_SEARCH_DELAY
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
    // FETCH
    // =====================================================

    const getMyProblems =
        useCallback(
            async (
                page = 1,
                term = ""
            ) => {

                const requestId =
                    latestRequestRef.current
                    +
                    1;


                latestRequestRef.current =
                    requestId;


                dispatch(
                    getMyProblemStart()
                );


                try {

                    let response;


                    if (
                        term.trim()
                    ) {

                        response =
                            await ProblemService
                                .getMyProblemSearch(
                                    term.trim(),
                                    page
                                );

                    } else {

                        response =
                            await ProblemService
                                .getMyProblemsList(
                                    page
                                );
                    }


                    // Eski request yangi requestdan
                    // keyin qaytsa Reduxni buzmasin.

                    if (
                        latestRequestRef.current !==
                        requestId
                    ) {

                        return;
                    }


                    dispatch(
                        getMyProblemSuccess(
                            response
                        )
                    );


                } catch (
                    requestError
                ) {

                    if (
                        latestRequestRef.current !==
                        requestId
                    ) {

                        return;
                    }


                    const unauthorized =
                        requestError
                            ?.response
                            ?.status
                        ===
                        401;


                    const message =
                        unauthorized

                            ? (
                                "Bu shaxsiy sahifa. "
                                +
                                "Davom etish uchun avval "
                                +
                                "tizimga kiring."
                            )

                            : getMyProblemsErrorMessage(
                                requestError
                            );


                    dispatch(
                        getMyProblemtFailure(
                            message
                        )
                    );


                    // =========================================
                    // UNIVERSAL TOAST
                    // =========================================

                    if (
                        unauthorized
                    ) {

                        siteToast.warning(
                            message,
                            {
                                id:
                                    "my-problems-auth-error",

                                title:
                                    "Kirish talab qilinadi",
                            }
                        );

                    } else {

                        siteToast.error(
                            message,
                            {
                                id:
                                    "my-problems-load-error",

                                title:
                                    "Muammolar yuklanmadi",
                            }
                        );
                    }
                }
            },
            [
                dispatch,
            ]
        );


    // =====================================================
    // LOAD
    // =====================================================

    useEffect(
        () => {

            getMyProblems(
                currentPage,
                debouncedSearch
            );

        },
        [
            currentPage,
            debouncedSearch,
            getMyProblems,
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


            if (
                currentPage !==
                1
            ) {

                setCurrentPage(
                    1
                );
            }
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

                isLoading
            ) {

                return;
            }


            setCurrentPage(
                page
            );


            window.setTimeout(
                () => {

                    problemsGridRef
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

            getMyProblems(
                currentPage,
                debouncedSearch
            );
        };


    // =====================================================
    // JSX
    // =====================================================

    return (

        <section
            id="my-problems-hero"

            className="
                relative

                min-h-screen

                overflow-hidden

                bg-[#080b10]

                px-4
                pb-20
                pt-28

                text-gray-100

                md:px-6
            "
        >

            {/* =================================================
                BACKGROUND
            ================================================== */}

            <div
                className="
                    pointer-events-none

                    absolute
                    left-[-10%]
                    top-[5%]

                    h-[360px]
                    w-[360px]

                    rounded-full

                    bg-purple-600/[0.07]

                    blur-[120px]
                "
            />


            <div
                className="
                    pointer-events-none

                    absolute
                    right-[-10%]
                    top-[30%]

                    h-[340px]
                    w-[340px]

                    rounded-full

                    bg-cyan-500/[0.05]

                    blur-[120px]
                "
            />


            {/* =================================================
                CONTENT
            ================================================== */}

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

                <MyProblemsHeader
                    totalCount={
                        myProblemsCount
                        ||
                        0
                    }
                />


                {/* =================================================
                    SEARCH
                ================================================== */}

                <MyProblemsSearch
                    value={
                        searchTerm
                    }

                    onChange={
                        handleSearchChange
                    }

                    onClear={
                        handleClearSearch
                    }

                    isLoading={
                        isLoading
                    }
                />


                {/* =================================================
                    ERROR
                ================================================== */}

                <MyProblemsErrorState
                    error={
                        error
                    }

                    onRetry={
                        handleRetry
                    }

                    isLoading={
                        isLoading
                    }
                />


                {/* =================================================
                    RESULTS INFO
                ================================================== */}

                <div
                    ref={
                        problemsGridRef
                    }

                    className="
                        mb-5

                        flex
                        scroll-mt-28
                        items-center
                        justify-between

                        gap-3
                    "
                >

                    <div>

                        <p
                            className="
                                font-mono

                                text-[10px]
                                font-black

                                uppercase
                                tracking-[0.16em]

                                text-gray-600
                            "
                        >
                            fsociety://my_problems
                        </p>


                        <p
                            className="
                                mt-1

                                text-xs
                                font-bold

                                text-gray-500
                            "
                        >
                            {
                                debouncedSearch

                                    ? (
                                        `"${debouncedSearch}" bo‘yicha natijalar`
                                    )

                                    : (
                                        `${
                                            myProblemsCount
                                            ||
                                            0
                                        } ta muammo`
                                    )
                            }
                        </p>

                    </div>


                    {totalPages >
                    0 && (

                        <span
                            className="
                                rounded-full

                                border
                                border-white/[0.07]

                                bg-white/[0.025]

                                px-3
                                py-1.5

                                font-mono

                                text-[9px]
                                font-black

                                text-gray-600
                            "
                        >
                            PAGE {currentPage}/{totalPages}
                        </span>

                    )}

                </div>


                {/* =================================================
                    GRID
                ================================================== */}

                <div
                    className="
                        grid

                        gap-6

                        md:grid-cols-2

                        xl:grid-cols-3
                    "
                >

                    {isLoading &&
                    problemList.length ===
                    0 ? (

                        Array.from({
                            length:
                                MY_PROBLEMS_PAGE_SIZE,
                        }).map(
                            (
                                _,
                                index
                            ) => (

                                <MyProblemCardSkeleton
                                    key={
                                        index
                                    }
                                />

                            )
                        )

                    ) : problemList.length >
                    0 ? (

                        problemList.map(
                            (
                                problem
                            ) => (

                                <MyProblemCard
                                    key={
                                        problem.id
                                    }

                                    id={
                                        problem.id
                                    }

                                    username={
                                        problem
                                            ?.user
                                            ?.username
                                    }

                                    firstName={
                                        problem
                                            ?.user
                                            ?.first_name
                                    }

                                    lastName={
                                        problem
                                            ?.user
                                            ?.last_name
                                    }

                                    image={
                                        problem
                                            ?.user
                                            ?.image
                                    }

                                    name={
                                        problem
                                            ?.problem
                                    }

                                    status={
                                        Boolean(
                                            problem
                                                ?.is_solved
                                        )
                                    }

                                    views={
                                        problem
                                            ?.total_views
                                        ??
                                        problem
                                            ?.views_count
                                        ??
                                        0
                                    }

                                    languages={
                                        problem
                                            ?.languages_data

                                        ??

                                        problem
                                            ?.language_data

                                        ??

                                        []
                                    }

                                    createdAt={
                                        problem
                                            ?.created_at
                                    }

                                    star={
                                        problem
                                            ?.star
                                        ??
                                        problem
                                            ?.total_stars
                                        ??
                                        0
                                    }

                                    responseCount={
                                        problem
                                            ?.response_count
                                        ??
                                        problem
                                            ?.total_responses
                                        ??
                                        0
                                    }

                                    deadline={
                                        problem
                                            ?.deadline
                                    }

                                    isUrgent={
                                        Boolean(
                                            problem
                                                ?.is_urgent
                                        )
                                    }
                                />

                            )
                        )

                    ) : (

                        <MyProblemsEmptyState
                            searchTerm={
                                debouncedSearch
                            }

                            onClearSearch={
                                handleClearSearch
                            }
                        />

                    )}

                </div>


                {/* =================================================
                    PAGINATION
                ================================================== */}

                <MyProblemsPagination
                    currentPage={
                        currentPage
                    }

                    totalPages={
                        totalPages
                    }

                    items={
                        pageItems
                    }

                    onPageChange={
                        handlePageChange
                    }

                    isLoading={
                        isLoading
                    }
                />

            </div>

        </section>
    );
};


export default MyProblems;