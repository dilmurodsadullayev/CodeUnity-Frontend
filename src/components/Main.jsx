import React, {
    useCallback,
    useEffect,
    useMemo,
} from "react";

import {
    Link,
} from "react-router-dom";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    ArrowRight,
    Bug,
    CheckCircle2,
    Clock3,
    Code2,
    Coins,
    Eye,
    Gift,
    Handshake,
    MessageCircle,
    Plus,
    ShieldCheck,
    Sparkles,
    Star,
    Terminal,
    UserRound,
    Zap,
} from "lucide-react";

import CommentSection from "./CommentSection";
import PopularProbelmCard from "./PopularProbelmCard";
import HomeSidebar from "./HomeSidebar";
import SiteUpdates from "./SiteUpdates";

import ProblemService from "../services/problems";

import {
    getPopularProblemStart,
    getPopularProblemSuccess,
} from "../features/problems/Problems";

import FCoinIcon from "../assests/coin/fcoin.png";


// =========================================================
// HELPERS
// =========================================================

const formatCompactNumber = (
    value
) => {
    const number =
        Number(
            value ||
            0
        );

    if (
        Number.isNaN(
            number
        )
    ) {
        return "0";
    }

    if (
        number >=
        1_000_000
    ) {
        return `${(
            number /
            1_000_000
        ).toFixed(
            number >=
                10_000_000
                ? 0
                : 1
        )}M`;
    }

    if (
        number >=
        1_000
    ) {
        return `${(
            number /
            1_000
        ).toFixed(
            number >=
                10_000
                ? 0
                : 1
        )}K`;
    }

    return String(
        number
    );
};


const getProblemTitle = (
    problem
) => {
    return (
        problem?.problem ||
        problem?.title ||
        "Nomsiz muammo"
    );
};


const getProblemDescription = (
    problem
) => {
    return (
        problem?.description ||
        "Muammo tafsilotlarini ko‘rish uchun oching."
    );
};


// =========================================================
// HERO MINI STAT
// =========================================================

const HeroStat = ({
    Icon,
    label,
    value,
    accentClass,
}) => {
    return (
        <div
            className="
                flex
                min-w-0
                items-center
                gap-3
                rounded-2xl
                border
                border-white/[0.06]
                bg-white/[0.025]
                px-3.5
                py-3
            "
        >
            <div
                className={`
                    grid
                    h-9
                    w-9
                    flex-shrink-0
                    place-items-center
                    rounded-xl
                    border
                    border-white/[0.06]
                    bg-white/[0.025]
                    ${accentClass}
                `}
            >
                <Icon
                    size={16}
                    strokeWidth={2}
                />
            </div>

            <div
                className="
                    min-w-0
                "
            >
                <p
                    className="
                        truncate
                        text-[9px]
                        font-black
                        uppercase
                        tracking-[0.14em]
                        text-gray-600
                    "
                >
                    {
                        label
                    }
                </p>

                <p
                    className="
                        mt-0.5
                        truncate
                        text-sm
                        font-black
                        text-gray-200
                    "
                >
                    {
                        value
                    }
                </p>
            </div>
        </div>
    );
};


// =========================================================
// PROBLEM RADAR ITEM
// =========================================================

const ProblemRadarItem = ({
    problem,
    index,
}) => {
    const problemId =
        problem?.id;

    const content = (
        <div
            className="
                group/radar
                relative
                overflow-hidden
                rounded-2xl
                border
                border-white/[0.055]
                bg-white/[0.018]
                p-3.5
                transition-all
                duration-200
                hover:border-cyan-400/20
                hover:bg-cyan-400/[0.035]
            "
        >
            <span
                className="
                    pointer-events-none
                    absolute
                    left-0
                    top-0
                    h-full
                    w-px
                    bg-gradient-to-b
                    from-cyan-400/50
                    via-indigo-400/20
                    to-transparent
                    opacity-0
                    transition-opacity
                    duration-200
                    group-hover/radar:opacity-100
                "
            />

            <div
                className="
                    flex
                    items-start
                    gap-3
                "
            >
                <div
                    className="
                        mt-0.5
                        grid
                        h-8
                        w-8
                        flex-shrink-0
                        place-items-center
                        rounded-xl
                        border
                        border-cyan-400/10
                        bg-cyan-400/[0.05]
                        font-mono
                        text-[10px]
                        font-black
                        text-cyan-300
                    "
                >
                    {
                        String(
                            index +
                            1
                        ).padStart(
                            2,
                            "0"
                        )
                    }
                </div>

                <div
                    className="
                        min-w-0
                        flex-1
                    "
                >
                    <h4
                        className="
                            line-clamp-1
                            text-[13px]
                            font-bold
                            text-gray-200
                            transition-colors
                            group-hover/radar:text-white
                        "
                    >
                        {
                            getProblemTitle(
                                problem
                            )
                        }
                    </h4>

                    <p
                        className="
                            mt-1
                            line-clamp-1
                            text-[10px]
                            leading-5
                            text-gray-600
                        "
                    >
                        {
                            getProblemDescription(
                                problem
                            )
                        }
                    </p>

                    <div
                        className="
                            mt-2.5
                            flex
                            flex-wrap
                            items-center
                            gap-x-3
                            gap-y-1
                            text-[9px]
                            font-semibold
                            text-gray-600
                        "
                    >
                        <span
                            className="
                                inline-flex
                                items-center
                                gap-1
                            "
                        >
                            <Star
                                size={11}
                                strokeWidth={2}
                                className="
                                    text-yellow-300
                                "
                            />

                            {
                                formatCompactNumber(
                                    problem?.total_stars
                                )
                            }
                        </span>

                        <span
                            className="
                                inline-flex
                                items-center
                                gap-1
                            "
                        >
                            <MessageCircle
                                size={11}
                                strokeWidth={2}
                                className="
                                    text-indigo-300
                                "
                            />

                            {
                                formatCompactNumber(
                                    problem?.total_responses
                                )
                            }
                        </span>

                        <span
                            className="
                                inline-flex
                                items-center
                                gap-1
                            "
                        >
                            <Eye
                                size={11}
                                strokeWidth={2}
                                className="
                                    text-cyan-300
                                "
                            />

                            {
                                formatCompactNumber(
                                    problem?.total_views
                                )
                            }
                        </span>
                    </div>
                </div>

                <ArrowRight
                    size={15}
                    strokeWidth={2}
                    className="
                        mt-1
                        flex-shrink-0
                        text-gray-700
                        transition-all
                        duration-200
                        group-hover/radar:translate-x-0.5
                        group-hover/radar:text-cyan-300
                    "
                />
            </div>
        </div>
    );

    if (
        !problemId
    ) {
        return content;
    }

    return (
        <Link
            to={`/problem/${problemId}/detail`}
            className="
                block
            "
        >
            {
                content
            }
        </Link>
    );
};


// =========================================================
// PROBLEM RADAR SKELETON
// =========================================================

const ProblemRadarSkeleton = () => {
    return (
        <div
            className="
                space-y-2.5
            "
        >
            {[...Array(3)].map(
                (
                    _,
                    index
                ) => (
                    <div
                        key={
                            index
                        }
                        className="
                            animate-pulse
                            rounded-2xl
                            border
                            border-white/[0.05]
                            bg-white/[0.018]
                            p-3.5
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
                                    h-8
                                    w-8
                                    rounded-xl
                                    bg-white/[0.05]
                                "
                            />

                            <div
                                className="
                                    flex-1
                                "
                            >
                                <div
                                    className="
                                        h-3.5
                                        w-3/4
                                        rounded-full
                                        bg-white/[0.055]
                                    "
                                />

                                <div
                                    className="
                                        mt-2
                                        h-2.5
                                        w-1/2
                                        rounded-full
                                        bg-white/[0.035]
                                    "
                                />
                            </div>
                        </div>
                    </div>
                )
            )}
        </div>
    );
};


// =========================================================
// REWARD STEP
// =========================================================

const RewardStep = ({
    number,
    Icon,
    title,
    description,
    accentClass,
    children,
}) => {
    return (
        <div
            className="
                group/step
                relative
                overflow-hidden
                rounded-3xl
                border
                border-white/[0.06]
                bg-white/[0.022]
                p-5
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-white/[0.11]
                hover:bg-white/[0.035]
            "
        >
            <span
                className="
                    pointer-events-none
                    absolute
                    -right-12
                    -top-12
                    h-28
                    w-28
                    rounded-full
                    bg-white/[0.025]
                    blur-3xl
                    transition-transform
                    duration-500
                    group-hover/step:scale-150
                "
            />

            <div
                className="
                    relative
                    flex
                    items-start
                    justify-between
                    gap-4
                "
            >
                <div
                    className={`
                        grid
                        h-11
                        w-11
                        place-items-center
                        rounded-2xl
                        border
                        border-white/[0.07]
                        bg-white/[0.03]
                        ${accentClass}
                    `}
                >
                    {
                        children ||
                        (
                            <Icon
                                size={20}
                                strokeWidth={1.9}
                            />
                        )
                    }
                </div>

                <span
                    className="
                        font-mono
                        text-[9px]
                        font-black
                        tracking-[0.18em]
                        text-gray-700
                    "
                >
                    {
                        number
                    }
                </span>
            </div>

            <h3
                className="
                    relative
                    mt-5
                    text-lg
                    font-black
                    text-white
                "
            >
                {
                    title
                }
            </h3>

            <p
                className="
                    relative
                    mt-2
                    text-sm
                    leading-6
                    text-gray-500
                "
            >
                {
                    description
                }
            </p>
        </div>
    );
};


// =========================================================
// MAIN
// =========================================================

const Main = () => {
    const dispatch =
        useDispatch();

    // =====================================================
    // REDUX
    // =====================================================

    const {
        isLoggedIn,
        user,
    } = useSelector(
        (state) =>
            state.auth
    );

    const {
        popularProblems,
        isLoading,
    } = useSelector(
        (state) =>
            state.problem
    );

    // =====================================================
    // SAFE PROBLEM DATA
    // =====================================================

    const safePopularProblems =
        useMemo(
            () =>
                Array.isArray(
                    popularProblems
                )
                    ? popularProblems
                    : [],
            [
                popularProblems,
            ]
        );

    const radarProblems =
        useMemo(
            () =>
                safePopularProblems.slice(
                    0,
                    3
                ),
            [
                safePopularProblems,
            ]
        );

    // =====================================================
    // FETCH POPULAR PROBLEMS
    // =====================================================

    const getPopularProblems =
        useCallback(
            async () => {
                dispatch(
                    getPopularProblemStart()
                );

                try {
                    const response =
                        await ProblemService
                            .getPopularProblemsList();

                    dispatch(
                        getPopularProblemSuccess(
                            response
                        )
                    );
                } catch (
                    error
                ) {
                    console.error(
                        "Popular problems olishda xato:",
                        error
                    );
                }
            },
            [
                dispatch,
            ]
        );

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(
        () => {
            getPopularProblems();
        },
        [
            getPopularProblems,
        ]
    );

    // =====================================================
    // JSX
    // =====================================================

    return (
        <main
            className="
                min-h-screen
                bg-[#050816]
                text-white
            "
        >
            <div
                className="
                    mx-auto
                    grid
                    w-full
                    max-w-[1540px]
                    gap-5
                    px-4
                    py-5
                    sm:px-6
                    xl:px-8
                    lg:grid-cols-[300px_minmax(0,1fr)]
                    xl:grid-cols-[310px_minmax(0,1fr)]
                "
            >
                {/* =================================================
                    LEFT SIDEBAR
                ================================================== */}

                <HomeSidebar
                    isLoggedIn={
                        isLoggedIn
                    }
                    user={
                        user
                    }
                />

                {/* =================================================
                    MAIN CONTENT
                ================================================== */}

                <div
                    className="
                        min-w-0
                        overflow-hidden
                        rounded-[30px]
                        border
                        border-white/[0.055]
                        bg-[#070b12]
                        shadow-[0_28px_100px_rgba(0,0,0,0.22)]
                    "
                >
                    {/* =================================================
                        HERO
                    ================================================== */}

                    <section
                        className="
                            relative
                            overflow-hidden
                            border-b
                            border-white/[0.055]
                            px-4
                            py-10
                            sm:px-6
                            lg:px-8
                            lg:py-12
                            xl:px-10
                        "
                    >
                        {/* BACKGROUND GRID */}

                        <div
                            className="
                                pointer-events-none
                                absolute
                                inset-0
                                opacity-[0.018]
                                [background-image:linear-gradient(rgba(255,255,255,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.35)_1px,transparent_1px)]
                                [background-size:38px_38px]
                            "
                        />

                        {/* GLOWS */}

                        <div
                            className="
                                pointer-events-none
                                absolute
                                -left-20
                                -top-24
                                h-80
                                w-80
                                rounded-full
                                bg-cyan-500/[0.08]
                                blur-[110px]
                            "
                        />

                        <div
                            className="
                                pointer-events-none
                                absolute
                                right-0
                                top-0
                                h-96
                                w-96
                                rounded-full
                                bg-indigo-500/[0.10]
                                blur-[120px]
                            "
                        />

                        <div
                            className="
                                relative
                                z-10
                                grid
                                items-center
                                gap-10
                                xl:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)]
                            "
                        >
                            {/* =========================================
                                HERO LEFT
                            ========================================== */}

                            <div
                                className="
                                    min-w-0
                                "
                            >
                                {/* STATUS BAR */}

                                <div
                                    className="
                                        flex
                                        flex-wrap
                                        items-center
                                        gap-2
                                    "
                                >
                                    <span
                                        className="
                                            inline-flex
                                            items-center
                                            gap-2
                                            rounded-full
                                            border
                                            border-cyan-400/20
                                            bg-cyan-400/[0.065]
                                            px-3
                                            py-1.5
                                            font-mono
                                            text-[9px]
                                            font-black
                                            uppercase
                                            tracking-[0.16em]
                                            text-cyan-300
                                        "
                                    >
                                        <Terminal
                                            size={13}
                                            strokeWidth={2}
                                        />

                                        fsociety://build_together
                                    </span>

                                    <span
                                        className="
                                            inline-flex
                                            items-center
                                            gap-2
                                            rounded-full
                                            border
                                            border-emerald-400/10
                                            bg-emerald-400/[0.03]
                                            px-3
                                            py-1.5
                                            font-mono
                                            text-[9px]
                                            font-bold
                                            uppercase
                                            tracking-[0.12em]
                                            text-emerald-300
                                        "
                                    >
                                        <span
                                            className="
                                                relative
                                                flex
                                                h-1.5
                                                w-1.5
                                            "
                                        >
                                            <span
                                                className="
                                                    absolute
                                                    inline-flex
                                                    h-full
                                                    w-full
                                                    animate-ping
                                                    rounded-full
                                                    bg-emerald-400
                                                    opacity-50
                                                "
                                            />

                                            <span
                                                className="
                                                    relative
                                                    inline-flex
                                                    h-1.5
                                                    w-1.5
                                                    rounded-full
                                                    bg-emerald-400
                                                "
                                            />
                                        </span>

                                        community live
                                    </span>
                                </div>

                                {/* TITLE */}

                                <h1
                                    className="
                                        mt-7
                                        max-w-4xl
                                        text-[42px]
                                        font-black
                                        leading-[0.98]
                                        tracking-[-0.055em]
                                        text-white
                                        sm:text-5xl
                                        lg:text-[58px]
                                        xl:text-[64px]
                                    "
                                >
                                    Muammoni{" "}

                                    <span
                                        className="
                                            bg-gradient-to-r
                                            from-cyan-300
                                            via-indigo-300
                                            to-fuchsia-300
                                            bg-clip-text
                                            text-transparent
                                        "
                                    >
                                        yechimga
                                    </span>

                                    <br />

                                    aylantiring.
                                </h1>

                                {/* DESCRIPTION */}

                                <p
                                    className="
                                        mt-6
                                        max-w-2xl
                                        text-sm
                                        leading-7
                                        text-gray-500
                                        sm:text-[15px]
                                    "
                                >
                                    Xatoni yolg‘iz yechmang.
                                    Savolingizni joylang,
                                    developerlar bilan fikr
                                    almashing, foydali yechim
                                    yozing va har bir hissangiz
                                    bilan F.Society ichida
                                    kuchliroq profil yarating.
                                </p>

                                {/* ACTIONS */}

                                <div
                                    className="
                                        mt-7
                                        flex
                                        flex-col
                                        gap-3
                                        sm:flex-row
                                    "
                                >
                                    <Link
                                        to="/problem-create"
                                        className="
                                            group/create
                                            inline-flex
                                            min-h-[48px]
                                            items-center
                                            justify-center
                                            gap-2.5
                                            rounded-2xl
                                            border
                                            border-cyan-300/20
                                            bg-gradient-to-r
                                            from-cyan-500
                                            to-indigo-600
                                            px-5
                                            text-sm
                                            font-black
                                            text-white
                                            shadow-[0_12px_35px_rgba(34,211,238,0.15)]
                                            transition-all
                                            duration-300
                                            hover:-translate-y-0.5
                                            hover:shadow-[0_16px_45px_rgba(99,102,241,0.22)]
                                        "
                                    >
                                        <Plus
                                            size={17}
                                            strokeWidth={2.4}
                                        />

                                        Savol berish

                                        <ArrowRight
                                            size={15}
                                            strokeWidth={2.2}
                                            className="
                                                transition-transform
                                                duration-200
                                                group-hover/create:translate-x-0.5
                                            "
                                        />
                                    </Link>

                                    <Link
                                        to="/problems"
                                        className="
                                            group/problems
                                            inline-flex
                                            min-h-[48px]
                                            items-center
                                            justify-center
                                            gap-2.5
                                            rounded-2xl
                                            border
                                            border-white/[0.075]
                                            bg-white/[0.028]
                                            px-5
                                            text-sm
                                            font-black
                                            text-gray-300
                                            transition-all
                                            duration-300
                                            hover:-translate-y-0.5
                                            hover:border-indigo-400/20
                                            hover:bg-indigo-400/[0.055]
                                            hover:text-white
                                        "
                                    >
                                        <Bug
                                            size={17}
                                            strokeWidth={2.2}
                                        />

                                        Muammolarni ko‘rish
                                    </Link>
                                </div>

                                {/* HERO STATS */}

                                <div
                                    className="
                                        mt-8
                                        grid
                                        gap-2.5
                                        sm:grid-cols-3
                                    "
                                >
                                    <HeroStat
                                        Icon={
                                            Bug
                                        }
                                        label="Trending"
                                        value={`${safePopularProblems.length} ta muammo`}
                                        accentClass="text-cyan-300"
                                    />

                                    <HeroStat
                                        Icon={
                                            Coins
                                        }
                                        label="Sizning FCoin"
                                        value={
                                            isLoggedIn
                                                ? `${user?.coins ?? 0} FCoin`
                                                : "Login kerak"
                                        }
                                        accentClass="text-yellow-300"
                                    />

                                    <HeroStat
                                        Icon={
                                            Zap
                                        }
                                        label="Platforma"
                                        value="Real-time"
                                        accentClass="text-indigo-300"
                                    />
                                </div>
                            </div>

                            {/* =========================================
                                PROBLEM RADAR
                            ========================================== */}

                            <div
                                className="
                                    relative
                                "
                            >
                                <div
                                    className="
                                        pointer-events-none
                                        absolute
                                        -inset-10
                                        rounded-full
                                        bg-cyan-500/[0.035]
                                        blur-3xl
                                    "
                                />

                                <div
                                    className="
                                        relative
                                        overflow-hidden
                                        rounded-[26px]
                                        border
                                        border-white/[0.07]
                                        bg-[#0b1018]/95
                                        p-3
                                        shadow-[0_30px_90px_rgba(0,0,0,0.30)]
                                        backdrop-blur-xl
                                    "
                                >
                                    {/* RADAR HEADER */}

                                    <div
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                            gap-4
                                            border-b
                                            border-white/[0.055]
                                            px-2
                                            pb-3
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
                                                    bg-cyan-400/[0.06]
                                                    text-cyan-300
                                                "
                                            >
                                                <Code2
                                                    size={17}
                                                    strokeWidth={2}
                                                />
                                            </div>

                                            <div>
                                                <p
                                                    className="
                                                        font-mono
                                                        text-[8px]
                                                        font-black
                                                        uppercase
                                                        tracking-[0.16em]
                                                        text-gray-600
                                                    "
                                                >
                                                    Live problem radar
                                                </p>

                                                <h3
                                                    className="
                                                        mt-0.5
                                                        text-sm
                                                        font-black
                                                        text-gray-200
                                                    "
                                                >
                                                    Hozir trendda
                                                </h3>
                                            </div>
                                        </div>

                                        <span
                                            className="
                                                inline-flex
                                                items-center
                                                gap-1.5
                                                rounded-full
                                                border
                                                border-emerald-400/10
                                                bg-emerald-400/[0.03]
                                                px-2.5
                                                py-1
                                                font-mono
                                                text-[8px]
                                                font-bold
                                                uppercase
                                                tracking-[0.12em]
                                                text-emerald-300
                                            "
                                        >
                                            <span
                                                className="
                                                    h-1.5
                                                    w-1.5
                                                    rounded-full
                                                    bg-emerald-400
                                                "
                                            />

                                            live
                                        </span>
                                    </div>

                                    {/* RADAR BODY */}

                                    <div
                                        className="
                                            mt-3
                                        "
                                    >
                                        {isLoading ? (
                                            <ProblemRadarSkeleton />
                                        ) : radarProblems.length > 0 ? (
                                            <div
                                                className="
                                                    space-y-2.5
                                                "
                                            >
                                                {radarProblems.map(
                                                    (
                                                        problem,
                                                        index
                                                    ) => (
                                                        <ProblemRadarItem
                                                            key={
                                                                problem?.id ??
                                                                index
                                                            }
                                                            problem={
                                                                problem
                                                            }
                                                            index={
                                                                index
                                                            }
                                                        />
                                                    )
                                                )}
                                            </div>
                                        ) : (
                                            <div
                                                className="
                                                    rounded-2xl
                                                    border
                                                    border-dashed
                                                    border-white/[0.07]
                                                    bg-white/[0.018]
                                                    px-5
                                                    py-9
                                                    text-center
                                                "
                                            >
                                                <Bug
                                                    size={22}
                                                    strokeWidth={1.8}
                                                    className="
                                                        mx-auto
                                                        text-gray-700
                                                    "
                                                />

                                                <p
                                                    className="
                                                        mt-3
                                                        text-xs
                                                        font-bold
                                                        text-gray-500
                                                    "
                                                >
                                                    Hozircha trenddagi
                                                    muammo yo‘q
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* RADAR FOOTER */}

                                    <div
                                        className="
                                            mt-3
                                            flex
                                            items-center
                                            justify-between
                                            gap-3
                                            border-t
                                            border-white/[0.05]
                                            px-2
                                            pt-3
                                        "
                                    >
                                        <p
                                            className="
                                                font-mono
                                                text-[8px]
                                                uppercase
                                                tracking-[0.14em]
                                                text-gray-700
                                            "
                                        >
                                            signal://community_activity
                                        </p>

                                        <Link
                                            to="/problems"
                                            className="
                                                group/radar-link
                                                inline-flex
                                                items-center
                                                gap-1.5
                                                text-[10px]
                                                font-bold
                                                text-cyan-300
                                            "
                                        >
                                            Barchasi

                                            <ArrowRight
                                                size={12}
                                                strokeWidth={2}
                                                className="
                                                    transition-transform
                                                    group-hover/radar-link:translate-x-0.5
                                                "
                                            />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* =================================================
                        TRENDING PROBLEMS
                    ================================================== */}

                    <section
                        id="problems"
                        className="
                            relative
                            border-b
                            border-white/[0.055]
                            bg-[#0a0f16]
                            px-4
                            py-16
                            sm:px-6
                            lg:px-8
                            lg:py-20
                            xl:px-10
                        "
                    >
                        <div
                            className="
                                pointer-events-none
                                absolute
                                right-0
                                top-0
                                h-72
                                w-72
                                rounded-full
                                bg-indigo-500/[0.04]
                                blur-[100px]
                            "
                        />

                        {/* SECTION HEADER */}

                        <div
                            className="
                                relative
                                flex
                                flex-col
                                gap-5
                                sm:flex-row
                                sm:items-end
                                sm:justify-between
                            "
                        >
                            <div>
                                <div
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-full
                                        border
                                        border-orange-400/15
                                        bg-orange-400/[0.05]
                                        px-3
                                        py-1.5
                                        font-mono
                                        text-[9px]
                                        font-black
                                        uppercase
                                        tracking-[0.16em]
                                        text-orange-300
                                    "
                                >
                                    <Zap
                                        size={13}
                                        strokeWidth={2}
                                    />

                                    community://trending
                                </div>

                                <h2
                                    className="
                                        mt-4
                                        text-3xl
                                        font-black
                                        tracking-[-0.035em]
                                        text-white
                                        sm:text-4xl
                                    "
                                >
                                    Qaynoq{" "}

                                    <span
                                        className="
                                            text-cyan-300
                                        "
                                    >
                                        Muammolar
                                    </span>
                                </h2>

                                <p
                                    className="
                                        mt-3
                                        max-w-xl
                                        text-sm
                                        leading-6
                                        text-gray-500
                                    "
                                >
                                    Jamiyat eng ko‘p ko‘rayotgan,
                                    muhokama qilayotgan va yechim
                                    izlayotgan muammolar.
                                </p>
                            </div>

                            <Link
                                to="/problems"
                                className="
                                    group/all
                                    inline-flex
                                    w-fit
                                    items-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-white/[0.065]
                                    bg-white/[0.025]
                                    px-4
                                    py-2.5
                                    text-[11px]
                                    font-bold
                                    text-gray-400
                                    transition-all
                                    duration-200
                                    hover:border-cyan-400/15
                                    hover:bg-cyan-400/[0.045]
                                    hover:text-cyan-300
                                "
                            >
                                Barcha muammolar

                                <ArrowRight
                                    size={13}
                                    strokeWidth={2}
                                    className="
                                        transition-transform
                                        group-hover/all:translate-x-0.5
                                    "
                                />
                            </Link>
                        </div>

                        {/* PROBLEMS */}

                        <div
                            className="
                                relative
                                mt-9
                                grid
                                gap-5
                                md:grid-cols-2
                                xl:grid-cols-3
                            "
                        >
                            {isLoading ? (
                                [...Array(3)].map(
                                    (
                                        _,
                                        index
                                    ) => (
                                        <div
                                            key={
                                                index
                                            }
                                            className="
                                                animate-pulse
                                                rounded-3xl
                                                border
                                                border-white/[0.055]
                                                bg-white/[0.02]
                                                p-5
                                            "
                                        >
                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    justify-between
                                                    gap-3
                                                "
                                            >
                                                <div
                                                    className="
                                                        h-5
                                                        w-24
                                                        rounded-full
                                                        bg-white/[0.055]
                                                    "
                                                />

                                                <div
                                                    className="
                                                        h-7
                                                        w-7
                                                        rounded-lg
                                                        bg-white/[0.04]
                                                    "
                                                />
                                            </div>

                                            <div
                                                className="
                                                    mt-5
                                                    h-5
                                                    w-4/5
                                                    rounded-lg
                                                    bg-white/[0.055]
                                                "
                                            />

                                            <div
                                                className="
                                                    mt-3
                                                    h-3
                                                    w-full
                                                    rounded-full
                                                    bg-white/[0.035]
                                                "
                                            />

                                            <div
                                                className="
                                                    mt-2
                                                    h-3
                                                    w-3/4
                                                    rounded-full
                                                    bg-white/[0.035]
                                                "
                                            />

                                            <div
                                                className="
                                                    mt-8
                                                    h-9
                                                    rounded-xl
                                                    bg-white/[0.03]
                                                "
                                            />
                                        </div>
                                    )
                                )
                            ) : safePopularProblems.length > 0 ? (
                                safePopularProblems.map(
                                    (
                                        problem
                                    ) => (
                                        <PopularProbelmCard
                                              key={
                                                  problem.id
                                              }

                                              id={
                                                  problem.id
                                              }

                                              user={
                                                  problem.user
                                              }

                                              problem={
                                                  problem.problem
                                              }

                                              description={
                                                  problem.description
                                              }

                                              star={
                                                  problem.total_stars
                                              }

                                              response={
                                                  problem.total_responses
                                              }

                                              views={
                                                  problem.total_views
                                              }

                                              language={
                                                  problem.language ||
                                                  problem.languages ||
                                                  []
                                              }

                                              technology={
                                                  problem.technology ||
                                                  problem.technologies ||
                                                  []
                                              }

                                              status={
                                                  problem.status
                                              }

                                              createdAt={
                                                  problem.created_at
                                              }
                                          />
                                    )
                                )
                            ) : (
                                <div
                                    className="
                                        col-span-full
                                        rounded-3xl
                                        border
                                        border-dashed
                                        border-white/[0.07]
                                        bg-white/[0.018]
                                        px-6
                                        py-12
                                        text-center
                                    "
                                >
                                    <Bug
                                        size={26}
                                        strokeWidth={1.8}
                                        className="
                                            mx-auto
                                            text-gray-700
                                        "
                                    />

                                    <h3
                                        className="
                                            mt-4
                                            text-sm
                                            font-black
                                            text-gray-300
                                        "
                                    >
                                        Hozircha qaynoq muammo yo‘q
                                    </h3>

                                    <p
                                        className="
                                            mt-2
                                            text-xs
                                            text-gray-600
                                        "
                                    >
                                        Birinchi muammoni siz joylashingiz mumkin.
                                    </p>

                                    <Link
                                        to="/problem-create"
                                        className="
                                            mt-5
                                            inline-flex
                                            items-center
                                            gap-2
                                            rounded-xl
                                            border
                                            border-cyan-400/15
                                            bg-cyan-400/[0.05]
                                            px-4
                                            py-2.5
                                            text-xs
                                            font-bold
                                            text-cyan-300
                                        "
                                    >
                                        <Plus
                                            size={14}
                                        />

                                        Muammo joylash
                                    </Link>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* =================================================
                        SITE UPDATES
                    ================================================== */}

                    <SiteUpdates />

                    {/* =================================================
                        REWARD SYSTEM
                    ================================================== */}

                    <section
                        id="about"
                        className="
                            relative
                            overflow-hidden
                            border-b
                            border-white/[0.055]
                            bg-[#070b12]
                            px-4
                            py-16
                            sm:px-6
                            lg:px-8
                            lg:py-20
                            xl:px-10
                        "
                    >
                        <div
                            className="
                                pointer-events-none
                                absolute
                                left-1/2
                                top-0
                                h-72
                                w-[520px]
                                -translate-x-1/2
                                -translate-y-1/2
                                rounded-full
                                bg-indigo-500/[0.06]
                                blur-[110px]
                            "
                        />

                        <div
                            className="
                                relative
                            "
                        >
                            {/* HEADER */}

                            <div
                                className="
                                    mx-auto
                                    max-w-3xl
                                    text-center
                                "
                            >
                                <div
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-full
                                        border
                                        border-cyan-400/15
                                        bg-cyan-400/[0.05]
                                        px-3
                                        py-1.5
                                        font-mono
                                        text-[9px]
                                        font-black
                                        uppercase
                                        tracking-[0.16em]
                                        text-cyan-300
                                    "
                                >
                                    <Zap
                                        size={13}
                                        strokeWidth={2}
                                    />

                                    fsociety://reward_loop
                                </div>

                                <h2
                                    className="
                                        mt-4
                                        text-3xl
                                        font-black
                                        tracking-[-0.035em]
                                        text-white
                                        sm:text-4xl
                                    "
                                >
                                    Bilim ulashing.{" "}

                                    <span
                                        className="
                                            bg-gradient-to-r
                                            from-cyan-300
                                            via-indigo-300
                                            to-yellow-300
                                            bg-clip-text
                                            text-transparent
                                        "
                                    >
                                        Qiymat yarating.
                                    </span>
                                </h2>

                                <p
                                    className="
                                        mx-auto
                                        mt-3
                                        max-w-2xl
                                        text-sm
                                        leading-6
                                        text-gray-500
                                    "
                                >
                                    F.Society’da foydali harakat
                                    shunchaki “activity” emas —
                                    u reputation, FCoin va profil
                                    kuchiga aylanadi.
                                </p>
                            </div>

                            {/* STEPS */}

                            <div
                                className="
                                    mt-9
                                    grid
                                    gap-4
                                    md:grid-cols-3
                                "
                            >
                                <RewardStep
                                    number="01"
                                    Icon={
                                        Handshake
                                    }
                                    title="Yordam bering"
                                    description="Savollarga javob yozing, yechim ulashing va boshqa developerga muammoni yopishga yordam bering."
                                    accentClass="text-cyan-300"
                                />

                                <RewardStep
                                    number="02"
                                    Icon={
                                        Coins
                                    }
                                    title="FCoin yig‘ing"
                                    description="Foydali javoblar, faoliyat va platformadagi hissangiz orqali FCoin hamda reyting oling."
                                    accentClass="text-yellow-300"
                                >
                                    <img
                                        src={
                                            FCoinIcon
                                        }
                                        alt="FCoin"
                                        className="
                                            h-7
                                            w-7
                                            object-contain
                                            drop-shadow-[0_0_12px_rgba(234,179,8,0.5)]
                                        "
                                    />
                                </RewardStep>

                                <RewardStep
                                    number="03"
                                    Icon={
                                        Gift
                                    }
                                    title="Profilni kuchaytiring"
                                    description="Badge, reyting, portfolio va jamiyatdagi faollik orqali developer profilingizni ajratib ko‘rsating."
                                    accentClass="text-fuchsia-300"
                                />
                            </div>

                            {/* TRUST STRIP */}

                            <div
                                className="
                                    mt-5
                                    grid
                                    gap-2.5
                                    rounded-3xl
                                    border
                                    border-white/[0.055]
                                    bg-white/[0.018]
                                    p-3
                                    sm:grid-cols-3
                                "
                            >
                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                        rounded-2xl
                                        px-3
                                        py-2.5
                                    "
                                >
                                    <CheckCircle2
                                        size={17}
                                        strokeWidth={2}
                                        className="
                                            text-emerald-300
                                        "
                                    />

                                    <div>
                                        <p
                                            className="
                                                text-[10px]
                                                font-black
                                                uppercase
                                                tracking-[0.12em]
                                                text-gray-500
                                            "
                                        >
                                            Real contribution
                                        </p>

                                        <p
                                            className="
                                                mt-0.5
                                                text-xs
                                                font-semibold
                                                text-gray-300
                                            "
                                        >
                                            Foydali ish qadrlanadi
                                        </p>
                                    </div>
                                </div>

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                        rounded-2xl
                                        px-3
                                        py-2.5
                                    "
                                >
                                    <ShieldCheck
                                        size={17}
                                        strokeWidth={2}
                                        className="
                                            text-indigo-300
                                        "
                                    />

                                    <div>
                                        <p
                                            className="
                                                text-[10px]
                                                font-black
                                                uppercase
                                                tracking-[0.12em]
                                                text-gray-500
                                            "
                                        >
                                            Reputation
                                        </p>

                                        <p
                                            className="
                                                mt-0.5
                                                text-xs
                                                font-semibold
                                                text-gray-300
                                            "
                                        >
                                            Profil kuchayib boradi
                                        </p>
                                    </div>
                                </div>

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                        rounded-2xl
                                        px-3
                                        py-2.5
                                    "
                                >
                                    <Clock3
                                        size={17}
                                        strokeWidth={2}
                                        className="
                                            text-cyan-300
                                        "
                                    />

                                    <div>
                                        <p
                                            className="
                                                text-[10px]
                                                font-black
                                                uppercase
                                                tracking-[0.12em]
                                                text-gray-500
                                            "
                                        >
                                            Real-time
                                        </p>

                                        <p
                                            className="
                                                mt-0.5
                                                text-xs
                                                font-semibold
                                                text-gray-300
                                            "
                                        >
                                            Yangilanishlar darhol
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* =================================================
                        CTA
                    ================================================== */}

                    <section
                        className="
                            relative
                            overflow-hidden
                            border-b
                            border-white/[0.055]
                            bg-[#090d14]
                            px-4
                            py-14
                            sm:px-6
                            lg:px-8
                            xl:px-10
                        "
                    >
                        <div
                            className="
                                pointer-events-none
                                absolute
                                -bottom-24
                                right-0
                                h-80
                                w-80
                                rounded-full
                                bg-fuchsia-500/[0.055]
                                blur-[110px]
                            "
                        />

                        <div
                            className="
                                relative
                                overflow-hidden
                                rounded-[28px]
                                border
                                border-indigo-400/15
                                bg-gradient-to-br
                                from-indigo-500/[0.09]
                                via-white/[0.025]
                                to-cyan-500/[0.05]
                                p-6
                                sm:p-8
                                lg:p-10
                            "
                        >
                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    inset-0
                                    opacity-[0.025]
                                    [background-image:linear-gradient(rgba(255,255,255,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.35)_1px,transparent_1px)]
                                    [background-size:28px_28px]
                                "
                            />

                            <div
                                className="
                                    relative
                                    grid
                                    gap-8
                                    lg:grid-cols-[minmax(0,1fr)_auto]
                                    lg:items-center
                                "
                            >
                                <div>
                                    <div
                                        className="
                                            inline-flex
                                            items-center
                                            gap-2
                                            rounded-full
                                            border
                                            border-indigo-400/20
                                            bg-indigo-400/[0.06]
                                            px-3
                                            py-1.5
                                            font-mono
                                            text-[9px]
                                            font-black
                                            uppercase
                                            tracking-[0.15em]
                                            text-indigo-300
                                        "
                                    >
                                        <Sparkles
                                            size={13}
                                            strokeWidth={2}
                                        />

                                        next://your_contribution
                                    </div>

                                    <h2
                                        className="
                                            mt-4
                                            max-w-3xl
                                            text-3xl
                                            font-black
                                            tracking-[-0.04em]
                                            text-white
                                            sm:text-4xl
                                        "
                                    >
                                        Keyingi kuchli yechim{" "}

                                        <span
                                            className="
                                                text-indigo-300
                                            "
                                        >
                                            sizniki bo‘lishi mumkin.
                                        </span>
                                    </h2>

                                    <p
                                        className="
                                            mt-3
                                            max-w-2xl
                                            text-sm
                                            leading-6
                                            text-gray-500
                                        "
                                    >
                                        Savol bering, yechim yozing,
                                        portfolio yarating va
                                        F.Society jamiyatida o‘z
                                        developer izingizni qoldiring.
                                    </p>
                                </div>

                                <div
                                    className="
                                        flex
                                        flex-col
                                        gap-3
                                        sm:flex-row
                                        lg:flex-col
                                    "
                                >
                                    {!isLoggedIn ? (
                                        <Link
                                            to="/register"
                                            className="
                                                group/register
                                                inline-flex
                                                min-h-[48px]
                                                items-center
                                                justify-center
                                                gap-2.5
                                                rounded-2xl
                                                bg-white
                                                px-5
                                                text-sm
                                                font-black
                                                text-[#111827]
                                                transition-all
                                                duration-300
                                                hover:-translate-y-0.5
                                                hover:bg-gray-100
                                            "
                                        >
                                            <UserRound
                                                size={17}
                                                strokeWidth={2.2}
                                            />

                                            Hisob ochish

                                            <ArrowRight
                                                size={14}
                                                className="
                                                    transition-transform
                                                    group-hover/register:translate-x-0.5
                                                "
                                            />
                                        </Link>
                                    ) : (
                                        <Link
                                            to="/problem-create"
                                            className="
                                                group/create2
                                                inline-flex
                                                min-h-[48px]
                                                items-center
                                                justify-center
                                                gap-2.5
                                                rounded-2xl
                                                bg-white
                                                px-5
                                                text-sm
                                                font-black
                                                text-[#111827]
                                                transition-all
                                                duration-300
                                                hover:-translate-y-0.5
                                                hover:bg-gray-100
                                            "
                                        >
                                            <Plus
                                                size={17}
                                                strokeWidth={2.2}
                                            />

                                            Muammo joylash

                                            <ArrowRight
                                                size={14}
                                                className="
                                                    transition-transform
                                                    group-hover/create2:translate-x-0.5
                                                "
                                            />
                                        </Link>
                                    )}

                                    <Link
                                        to="/users"
                                        className="
                                            inline-flex
                                            min-h-[48px]
                                            items-center
                                            justify-center
                                            gap-2.5
                                            rounded-2xl
                                            border
                                            border-white/[0.08]
                                            bg-white/[0.025]
                                            px-5
                                            text-sm
                                            font-bold
                                            text-gray-300
                                            transition-all
                                            duration-200
                                            hover:border-cyan-400/15
                                            hover:bg-cyan-400/[0.045]
                                            hover:text-white
                                        "
                                    >
                                        <UserRound
                                            size={17}
                                            strokeWidth={2}
                                        />

                                        Community
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* =================================================
                        COMMENTS
                    ================================================== */}

                    <section
                        className="
                            bg-[#070b12]
                            px-4
                            py-14
                            sm:px-6
                            lg:px-8
                            xl:px-10
                        "
                    >
                        <div
                            className="
                                mb-7
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
                                        text-[9px]
                                        font-black
                                        uppercase
                                        tracking-[0.16em]
                                        text-gray-600
                                    "
                                >
                                    community://voice
                                </p>

                                <h2
                                    className="
                                        mt-2
                                        text-2xl
                                        font-black
                                        tracking-[-0.03em]
                                        text-white
                                        sm:text-3xl
                                    "
                                >
                                    Jamiyat nima deyapti?
                                </h2>
                            </div>

                            <div
                                className="
                                    inline-flex
                                    w-fit
                                    items-center
                                    gap-2
                                    rounded-full
                                    border
                                    border-white/[0.06]
                                    bg-white/[0.02]
                                    px-3
                                    py-1.5
                                    text-[9px]
                                    font-bold
                                    uppercase
                                    tracking-[0.12em]
                                    text-gray-600
                                "
                            >
                                <MessageCircle
                                    size={12}
                                />

                                feedback loop
                            </div>
                        </div>

                        <CommentSection />
                    </section>
                </div>
            </div>
        </main>
    );
};


export default Main;
