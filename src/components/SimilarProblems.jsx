// src/components/SimilarProblems.jsx

import React, {
    useCallback,
    useEffect,
    useMemo,
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
    ArrowRight,
    CheckCircle2,
    Clock3,
    Coins,
    Eye,
    Flame,
    FolderSearch2,
    Loader2,
    MessageCircle,
    RefreshCw,
    Search,
    Sparkles,
} from "lucide-react";

import {
    similarProblemsStart,
    similarProblemsSuccess,
    similarProblemsFailure,
} from "../features/problems/Problems";

import ProblemService from "../services/problems";

import timeAgo from "../utils/timeAgo";


// =========================================================
// CONFIG
// =========================================================

const MAX_SIMILAR_PROBLEMS = 5;


// =========================================================
// ERROR MESSAGE
// =========================================================

const getErrorMessage = (
    error,
    fallback = "O‘xshash muammolarni yuklashda xatolik yuz berdi."
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
        return String(
            error.message
        );
    }


    return fallback;
};


// =========================================================
// NORMALIZE RESPONSE
// =========================================================

const normalizeProblems = (
    response
) => {
    if (
        Array.isArray(
            response
        )
    ) {
        return response;
    }


    if (
        Array.isArray(
            response?.results
        )
    ) {
        return response.results;
    }


    if (
        Array.isArray(
            response?.data
        )
    ) {
        return response.data;
    }


    return [];
};


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
// LANGUAGES NORMALIZER
// =========================================================

const getProblemLanguages = (
    problem
) => {
    // =====================================================
    // PRIMARY
    // =====================================================

    if (
        Array.isArray(
            problem?.language_data
        )
    ) {
        return problem
            .language_data
            .filter(
                (
                    language
                ) =>
                    language
                    &&
                    (
                        typeof language ===
                        "string"
                        ||
                        typeof language ===
                        "object"
                    )
            );
    }


    // =====================================================
    // FALLBACK
    //
    // Agar language array ichida object/string bo‘lsa
    // ishlatamiz.
    //
    // Agar [1, 2, 3] bo‘lsa UI da chiqarmaymiz.
    // =====================================================

    if (
        Array.isArray(
            problem?.language
        )
    ) {
        return problem
            .language
            .filter(
                (
                    language
                ) =>
                    typeof language ===
                    "string"
                    ||
                    (
                        language
                        &&
                        typeof language ===
                        "object"
                    )
            );
    }


    return [];
};


// =========================================================
// LANGUAGE NAME
// =========================================================

const getLanguageName = (
    language
) => {
    if (
        typeof language ===
        "string"
    ) {
        return language;
    }


    return (
        language?.name
        ||
        language?.title
        ||
        ""
    );
};


// =========================================================
// RESPONSE COUNT
// =========================================================

const getResponseCount = (
    problem
) => {
    return safeNumber(
        problem?.total_responses
        ??
        problem?.response_count
        ??
        problem?.responses_count
        ??
        (
            Array.isArray(
                problem?.responses
            )
                ? problem.responses.length
                : 0
        )
    );
};


// =========================================================
// VIEW COUNT
// =========================================================

const getViewCount = (
    problem
) => {
    return safeNumber(
        problem?.total_views
        ??
        problem?.views_count
        ??
        problem?.view_count
        ??
        0
    );
};


// =========================================================
// SKELETON ITEM
// =========================================================

const SimilarProblemSkeletonItem = ({
    index,
}) => {
    return (
        <div
            className="
                relative
                py-5
            "
        >

            <div
                className="
                    flex
                    items-start
                    gap-3.5
                "
            >

                {/* NUMBER */}

                <div
                    className="
                        h-8
                        w-8
                        shrink-0
                        animate-pulse
                        rounded-xl
                        bg-white/[0.05]
                    "
                />


                {/* BODY */}

                <div
                    className="
                        min-w-0
                        flex-1
                    "
                >

                    <div
                        className="
                            h-4
                            w-[92%]
                            animate-pulse
                            rounded-lg
                            bg-white/[0.065]
                        "
                    />


                    <div
                        className="
                            mt-2
                            h-4
                            w-[68%]
                            animate-pulse
                            rounded-lg
                            bg-white/[0.05]
                        "
                    />


                    <div
                        className="
                            mt-3
                            flex
                            gap-2
                        "
                    >
                        <div
                            className="
                                h-5
                                w-16
                                animate-pulse
                                rounded-full
                                bg-white/[0.04]
                            "
                        />

                        <div
                            className="
                                h-5
                                w-20
                                animate-pulse
                                rounded-full
                                bg-white/[0.04]
                            "
                        />
                    </div>


                    <div
                        className="
                            mt-3
                            flex
                            gap-3
                        "
                    >
                        <div
                            className="
                                h-3
                                w-10
                                animate-pulse
                                rounded
                                bg-white/[0.035]
                            "
                        />

                        <div
                            className="
                                h-3
                                w-10
                                animate-pulse
                                rounded
                                bg-white/[0.035]
                            "
                        />

                        <div
                            className="
                                h-3
                                w-16
                                animate-pulse
                                rounded
                                bg-white/[0.035]
                            "
                        />
                    </div>

                </div>

            </div>


            {index <
                MAX_SIMILAR_PROBLEMS - 1 && (
                <div
                    className="
                        absolute
                        bottom-0
                        left-11
                        right-0
                        h-px
                        bg-white/[0.055]
                    "
                />
            )}

        </div>
    );
};


// =========================================================
// SKELETON
// =========================================================

const SkeletonLoader = () => {
    return (
        <div>
            {Array.from({
                length:
                    MAX_SIMILAR_PROBLEMS,
            }).map(
                (
                    _,
                    index
                ) => (
                    <SimilarProblemSkeletonItem
                        key={
                            index
                        }
                        index={
                            index
                        }
                    />
                )
            )}
        </div>
    );
};


// =========================================================
// STATUS BADGE
// =========================================================

const StatusBadge = ({
    problem,
}) => {
    if (
        problem?.is_solved
    ) {
        return (
            <span
                className="
                    inline-flex
                    items-center
                    gap-1
                    rounded-full
                    border
                    border-emerald-400/15
                    bg-emerald-500/[0.06]
                    px-2
                    py-1
                    text-[8px]
                    font-black
                    uppercase
                    tracking-[0.10em]
                    text-emerald-300
                "
            >
                <CheckCircle2
                    size={10}
                />

                Yechilgan
            </span>
        );
    }


    return (
        <span
            className="
                inline-flex
                items-center
                gap-1
                rounded-full
                border
                border-red-400/15
                bg-red-500/[0.05]
                px-2
                py-1
                text-[8px]
                font-black
                uppercase
                tracking-[0.10em]
                text-red-300
            "
        >
            <span
                className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-red-400
                "
            />

            Ochiq
        </span>
    );
};


// =========================================================
// LANGUAGE BADGE
// =========================================================

const LanguageBadge = ({
    language,
}) => {
    const name =
        getLanguageName(
            language
        );


    if (
        !name
    ) {
        return null;
    }


    return (
        <span
            className="
                inline-flex
                max-w-[110px]
                items-center
                truncate
                rounded-full
                border
                border-indigo-400/15
                bg-indigo-500/[0.055]
                px-2
                py-1
                text-[8px]
                font-black
                text-indigo-300
            "
            title={
                name
            }
        >
            {name}
        </span>
    );
};


// =========================================================
// SIMILAR PROBLEM ITEM
// =========================================================

const SimilarProblemItem = ({
    problem,
    index,
    isLast,
}) => {
    const languagesList =
        getProblemLanguages(
            problem
        );


    const responseCount =
        getResponseCount(
            problem
        );


    const viewsCount =
        getViewCount(
            problem
        );


    const offeredCoins =
        safeNumber(
            problem
                ?.offered_coins
        );


    const hasCreatedAt =
        Boolean(
            problem
                ?.created_at
        );


    return (
        <div
            className="
                group
                relative
            "
        >

            <Link
                to={`/problems/${problem.id}`}
                className="
                    relative
                    flex
                    items-start
                    gap-3.5
                    py-5
                "
            >

                {/* =================================================
                    NUMBER
                ================================================== */}

                <div
                    className="
                        mt-0.5
                        grid
                        h-8
                        w-8
                        shrink-0
                        place-items-center
                        rounded-xl
                        border
                        border-white/[0.06]
                        bg-white/[0.02]
                        font-mono
                        text-[9px]
                        font-black
                        text-gray-700
                        transition-all
                        duration-200

                        group-hover:border-indigo-400/20
                        group-hover:bg-indigo-500/[0.06]
                        group-hover:text-indigo-300
                    "
                >
                    {String(
                        index + 1
                    ).padStart(
                        2,
                        "0"
                    )}
                </div>


                {/* =================================================
                    CONTENT
                ================================================== */}

                <div
                    className="
                        min-w-0
                        flex-1
                    "
                >

                    {/* =============================================
                        TITLE
                    ============================================== */}

                    <div
                        className="
                            flex
                            items-start
                            justify-between
                            gap-3
                        "
                    >

                        <h4
                            className="
                                line-clamp-2
                                min-w-0
                                flex-1
                                text-sm
                                font-black
                                leading-6
                                text-gray-300
                                transition-colors

                                group-hover:text-white
                            "
                        >
                            {
                                problem?.problem
                                ||
                                problem?.title
                                ||
                                "Nomsiz muammo"
                            }
                        </h4>


                        <ArrowRight
                            size={15}
                            className="
                                mt-1
                                shrink-0
                                -translate-x-1
                                text-gray-800
                                opacity-0
                                transition-all
                                duration-200

                                group-hover:translate-x-0
                                group-hover:text-indigo-400
                                group-hover:opacity-100
                            "
                        />

                    </div>


                    {/* =============================================
                        BADGES
                    ============================================== */}

                    <div
                        className="
                            mt-2.5
                            flex
                            flex-wrap
                            items-center
                            gap-1.5
                        "
                    >

                        <StatusBadge
                            problem={
                                problem
                            }
                        />


                        {problem
                            ?.is_urgent && (
                            <span
                                className="
                                    inline-flex
                                    items-center
                                    gap-1
                                    rounded-full
                                    border
                                    border-amber-400/15
                                    bg-amber-500/[0.055]
                                    px-2
                                    py-1
                                    text-[8px]
                                    font-black
                                    uppercase
                                    tracking-[0.10em]
                                    text-amber-300
                                "
                            >
                                <Flame
                                    size={10}
                                />

                                Tezkor
                            </span>
                        )}


                        {languagesList
                            .slice(
                                0,
                                2
                            )
                            .map(
                                (
                                    language,
                                    languageIndex
                                ) => (
                                    <LanguageBadge
                                        key={
                                            language?.id
                                            ||
                                            getLanguageName(
                                                language
                                            )
                                            ||
                                            languageIndex
                                        }
                                        language={
                                            language
                                        }
                                    />
                                )
                            )}


                        {languagesList.length >
                        2 && (
                            <span
                                className="
                                    rounded-full
                                    border
                                    border-white/[0.06]
                                    bg-white/[0.02]
                                    px-2
                                    py-1
                                    text-[8px]
                                    font-black
                                    text-gray-600
                                "
                            >
                                +
                                {
                                    languagesList.length -
                                    2
                                }
                            </span>
                        )}

                    </div>


                    {/* =============================================
                        METADATA
                    ============================================== */}

                    <div
                        className="
                            mt-3
                            flex
                            flex-wrap
                            items-center
                            gap-x-3
                            gap-y-1.5
                            text-[9px]
                            font-bold
                            text-gray-700
                        "
                    >

                        {offeredCoins >
                        0 && (
                            <span
                                className="
                                    inline-flex
                                    items-center
                                    gap-1
                                    text-yellow-500/80
                                "
                            >
                                <Coins
                                    size={11}
                                />

                                {
                                    offeredCoins
                                }
                                {" "}
                                FCoin
                            </span>
                        )}


                        {responseCount >
                        0 && (
                            <span
                                className="
                                    inline-flex
                                    items-center
                                    gap-1
                                "
                            >
                                <MessageCircle
                                    size={11}
                                />

                                {
                                    responseCount
                                }
                            </span>
                        )}


                        {viewsCount >
                        0 && (
                            <span
                                className="
                                    inline-flex
                                    items-center
                                    gap-1
                                "
                            >
                                <Eye
                                    size={11}
                                />

                                {
                                    viewsCount
                                }
                            </span>
                        )}


                        {hasCreatedAt && (
                            <span
                                className="
                                    inline-flex
                                    items-center
                                    gap-1
                                "
                            >
                                <Clock3
                                    size={11}
                                />

                                {timeAgo(
                                    problem
                                        .created_at
                                )}
                            </span>
                        )}

                    </div>

                </div>


                {/* =================================================
                    HOVER BACKGROUND
                ================================================== */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        inset-x-[-12px]
                        inset-y-1
                        -z-10
                        rounded-2xl
                        border
                        border-transparent
                        bg-transparent
                        transition-all
                        duration-200

                        group-hover:border-white/[0.045]
                        group-hover:bg-white/[0.018]
                    "
                />

            </Link>


            {/* =================================================
                DIVIDER
            ================================================== */}

            {!isLast && (
                <div
                    className="
                        ml-11
                        h-px
                        bg-gradient-to-r
                        from-white/[0.06]
                        via-white/[0.035]
                        to-transparent
                    "
                />
            )}

        </div>
    );
};


// =========================================================
// SIMILAR PROBLEMS
// =========================================================

const SimilarProblems = ({
    problemId,
}) => {
    const dispatch =
        useDispatch();


    // =====================================================
    // REDUX
    // =====================================================

    const {
        similarProblems,
        similarIsLoading,
        similarError,
    } = useSelector(
        (
            state
        ) =>
            state.problem
    );


    // =====================================================
    // NORMALIZED PROBLEMS
    // =====================================================

    const problems =
        useMemo(
            () => {
                const normalized =
                    Array.isArray(
                        similarProblems
                    )
                        ? similarProblems
                        : normalizeProblems(
                            similarProblems
                        );


                /*
                    Hozir ko‘rilayotgan problem
                    qaytib kelgan bo‘lsa uni chiqarib tashlaymiz.
                */

                return normalized
                    .filter(
                        (
                            problem
                        ) =>
                            Number(
                                problem?.id
                            )
                            !==
                            Number(
                                problemId
                            )
                    )
                    .slice(
                        0,
                        MAX_SIMILAR_PROBLEMS
                    );
            },
            [
                similarProblems,
                problemId,
            ]
        );


    // =====================================================
    // FETCH
    // =====================================================

    const getSimilarProblems =
        useCallback(
            async () => {
                if (
                    !problemId
                ) {
                    return;
                }


                dispatch(
                    similarProblemsStart()
                );


                try {
                    const response =
                        await ProblemService
                            .getSimilarProblems(
                                problemId
                            );


                    dispatch(
                        similarProblemsSuccess(
                            normalizeProblems(
                                response
                            )
                        )
                    );

                } catch (
                    error
                ) {
                    console.error(
                        "O‘xshash muammolarni yuklashda xatolik:",
                        error
                    );


                    dispatch(
                        similarProblemsFailure(
                            getErrorMessage(
                                error
                            )
                        )
                    );
                }
            },
            [
                dispatch,
                problemId,
            ]
        );


    // =====================================================
    // LOAD
    // =====================================================

    useEffect(
        () => {
            getSimilarProblems();
        },
        [
            getSimilarProblems,
        ]
    );


    // =====================================================
    // JSX
    // =====================================================

    return (
        <section
            className="
                relative
                overflow-hidden
                rounded-[26px]
                border
                border-white/[0.07]
                bg-[#0b1018]/90
                shadow-[0_25px_70px_rgba(0,0,0,0.25)]
                backdrop-blur-xl
            "
        >

            {/* =================================================
                GLOW
            ================================================== */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -right-24
                    -top-24
                    h-52
                    w-52
                    rounded-full
                    bg-indigo-500/[0.08]
                    blur-[80px]
                "
            />


            {/* =================================================
                HEADER
            ================================================== */}

            <header
                className="
                    relative
                    z-10
                    border-b
                    border-white/[0.06]
                    px-5
                    py-5

                    sm:px-6
                "
            >

                <div
                    className="
                        flex
                        items-start
                        justify-between
                        gap-4
                    "
                >

                    {/* =========================================
                        LEFT
                    ========================================== */}

                    <div
                        className="
                            min-w-0
                        "
                    >

                        <div
                            className="
                                mb-2
                                inline-flex
                                items-center
                                gap-2
                                text-[8px]
                                font-black
                                uppercase
                                tracking-[0.20em]
                                text-indigo-400
                            "
                        >
                            <Sparkles
                                size={11}
                            />

                            Related problems
                        </div>


                        <div
                            className="
                                flex
                                flex-wrap
                                items-center
                                gap-2.5
                            "
                        >

                            <h3
                                className="
                                    text-lg
                                    font-black
                                    tracking-tight
                                    text-white

                                    sm:text-xl
                                "
                            >
                                Shu kabi muammolar
                            </h3>


                            {!similarIsLoading
                                &&
                                !similarError
                                &&
                                problems.length >
                                0 && (
                                    <span
                                        className="
                                            inline-flex
                                            h-6
                                            min-w-6
                                            items-center
                                            justify-center
                                            rounded-full
                                            border
                                            border-indigo-400/15
                                            bg-indigo-500/[0.06]
                                            px-1.5
                                            text-[9px]
                                            font-black
                                            text-indigo-300
                                        "
                                    >
                                        {
                                            problems.length
                                        }
                                    </span>
                                )
                            }

                        </div>


                        <p
                            className="
                                mt-2
                                max-w-sm
                                text-[10px]
                                font-medium
                                leading-5
                                text-gray-600
                            "
                        >
                            Siz ko‘rayotgan savolga yaqin mavzular va avvalgi yechimlar.
                        </p>

                    </div>


                    {/* =========================================
                        ICON
                    ========================================== */}

                    <div
                        className="
                            grid
                            h-10
                            w-10
                            shrink-0
                            place-items-center
                            rounded-xl
                            border
                            border-indigo-400/15
                            bg-indigo-500/[0.055]
                            text-indigo-300
                        "
                    >
                        {similarIsLoading ? (
                            <Loader2
                                size={17}
                                className="
                                    animate-spin
                                "
                            />
                        ) : (
                            <FolderSearch2
                                size={18}
                            />
                        )}
                    </div>

                </div>

            </header>


            {/* =================================================
                CONTENT
            ================================================== */}

            <div
                className="
                    relative
                    z-10
                    px-5

                    sm:px-6
                "
            >

                {/* =================================================
                    LOADING
                ================================================== */}

                {similarIsLoading && (
                    <SkeletonLoader />
                )}


                {/* =================================================
                    ERROR
                ================================================== */}

                {!similarIsLoading
                    &&
                    similarError && (
                        <div
                            className="
                                py-7
                            "
                        >

                            <div
                                className="
                                    rounded-2xl
                                    border
                                    border-red-400/15
                                    bg-red-500/[0.045]
                                    p-4
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-start
                                        gap-3
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
                                            border-red-400/15
                                            bg-red-500/[0.07]
                                            text-red-300
                                        "
                                    >
                                        <AlertTriangle
                                            size={16}
                                        />
                                    </div>


                                    <div
                                        className="
                                            min-w-0
                                        "
                                    >

                                        <p
                                            className="
                                                text-xs
                                                font-black
                                                text-red-200
                                            "
                                        >
                                            O‘xshash muammolar yuklanmadi
                                        </p>


                                        <p
                                            className="
                                                mt-1.5
                                                break-words
                                                text-[10px]
                                                font-medium
                                                leading-5
                                                text-red-200/60
                                            "
                                        >
                                            {
                                                similarError
                                            }
                                        </p>

                                    </div>

                                </div>


                                <button
                                    type="button"
                                    onClick={
                                        getSimilarProblems
                                    }
                                    className="
                                        mt-4
                                        inline-flex
                                        min-h-[36px]
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        border
                                        border-red-400/15
                                        bg-red-500/[0.06]
                                        px-3.5
                                        py-2
                                        text-[10px]
                                        font-black
                                        text-red-200
                                        transition-all

                                        hover:border-red-400/25
                                        hover:bg-red-500/[0.10]

                                        active:scale-[0.97]
                                    "
                                >
                                    <RefreshCw
                                        size={13}
                                    />

                                    Qayta urinish
                                </button>

                            </div>

                        </div>
                    )
                }


                {/* =================================================
                    RESULTS
                ================================================== */}

                {!similarIsLoading
                    &&
                    !similarError
                    &&
                    problems.length >
                    0 && (
                        <div>
                            {problems.map(
                                (
                                    problem,
                                    index
                                ) => (
                                    <SimilarProblemItem
                                        key={
                                            problem.id
                                        }
                                        problem={
                                            problem
                                        }
                                        index={
                                            index
                                        }
                                        isLast={
                                            index ===
                                            problems.length -
                                            1
                                        }
                                    />
                                )
                            )}
                        </div>
                    )
                }


                {/* =================================================
                    EMPTY
                ================================================== */}

                {!similarIsLoading
                    &&
                    !similarError
                    &&
                    problems.length ===
                    0 && (
                        <div
                            className="
                                py-9
                                text-center
                            "
                        >

                            <div
                                className="
                                    mx-auto
                                    grid
                                    h-14
                                    w-14
                                    place-items-center
                                    rounded-2xl
                                    border
                                    border-white/[0.06]
                                    bg-white/[0.02]
                                    text-gray-700
                                "
                            >
                                <Search
                                    size={23}
                                />
                            </div>


                            <h4
                                className="
                                    mt-4
                                    text-sm
                                    font-black
                                    text-gray-300
                                "
                            >
                                O‘xshash muammo topilmadi
                            </h4>


                            <p
                                className="
                                    mx-auto
                                    mt-2
                                    max-w-[270px]
                                    text-[10px]
                                    font-medium
                                    leading-5
                                    text-gray-700
                                "
                            >
                                Bu savol platformadagi kam uchraydigan yoki yangi mavzulardan biri bo‘lishi mumkin.
                            </p>


                            <Link
                                to="/problems"
                                className="
                                    mt-5
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-indigo-400/15
                                    bg-indigo-500/[0.055]
                                    px-4
                                    py-2.5
                                    text-[10px]
                                    font-black
                                    text-indigo-300
                                    transition-all

                                    hover:border-indigo-400/25
                                    hover:bg-indigo-500/[0.10]
                                    hover:text-indigo-200
                                "
                            >
                                Barcha muammolar

                                <ArrowRight
                                    size={13}
                                />
                            </Link>

                        </div>
                    )
                }

            </div>


            {/* =================================================
                FOOTER
            ================================================== */}

            {!similarIsLoading
                &&
                !similarError
                &&
                problems.length >
                0 && (
                    <footer
                        className="
                            relative
                            z-10
                            border-t
                            border-white/[0.06]
                            bg-black/[0.08]
                            p-3
                        "
                    >

                        <Link
                            to="/problems"
                            className="
                                group
                                flex
                                w-full
                                items-center
                                justify-between
                                gap-3
                                rounded-xl
                                px-3
                                py-2.5
                                text-[10px]
                                font-black
                                text-gray-600
                                transition-all

                                hover:bg-white/[0.025]
                                hover:text-indigo-300
                            "
                        >

                            <span>
                                Barcha muammolarni ko‘rish
                            </span>


                            <ArrowRight
                                size={14}
                                className="
                                    transition-transform
                                    duration-200

                                    group-hover:translate-x-1
                                "
                            />

                        </Link>

                    </footer>
                )
            }

        </section>
    );
};


export default React.memo(
    SimilarProblems
);