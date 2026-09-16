import React, {
    useMemo,
} from "react";

import {
    Link,
} from "react-router-dom";

import {
    ArrowUpRight,
    Bug,
    CheckCircle2,
    CircleDot,
    Code2,
    Coins,
    Eye,
    MessageCircle,
    Star,
} from "lucide-react";

import {
    limitText,
} from "../utils/limitText";

import {
    getUserAvatarUrl,
    handleUserImageError,
} from "../utils/imageUtils";


// =========================================================
// HELPERS
// =========================================================

const formatNumber = (
    value
) => {
    const number =
        Number(
            value ??
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


const formatDate = (
    value
) => {
    if (!value) {
        return "Yaqinda";
    }

    const date =
        new Date(
            value
        );

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "Yaqinda";
    }

    return new Intl.DateTimeFormat(
        "uz-UZ",
        {
            day:
                "2-digit",

            month:
                "short",

            year:
                "numeric",
        }
    ).format(
        date
    );
};


const getFullName = (
    user
) => {
    const fullName =
        [
            user?.first_name,
            user?.last_name,
        ]
            .filter(
                Boolean
            )
            .join(
                " "
            )
            .trim();

    return (
        fullName ||
        user?.username ||
        "FSociety User"
    );
};


const getLevel = (
    user
) => {
    return (
        user?.level ||
        user?.skill_level ||
        "beginner"
    );
};


const getTagName = (
    item
) => {
    if (
        typeof item ===
        "string"
    ) {
        return item;
    }

    if (
        typeof item ===
        "number"
    ) {
        return `#${item}`;
    }

    return (
        item?.name ||
        item?.title ||
        item?.language ||
        item?.technology ||
        null
    );
};


// =========================================================
// LEVEL CONFIG
// =========================================================

const LEVEL_CONFIG = {

    beginner: {
        label:
            "Beginner",

        className:
            `
                border-emerald-400/15
                bg-emerald-400/[0.055]
                text-emerald-300
            `,
    },

    intermediate: {
        label:
            "Intermediate",

        className:
            `
                border-cyan-400/15
                bg-cyan-400/[0.055]
                text-cyan-300
            `,
    },

    advanced: {
        label:
            "Advanced",

        className:
            `
                border-indigo-400/15
                bg-indigo-400/[0.055]
                text-indigo-300
            `,
    },

    pro: {
        label:
            "Pro",

        className:
            `
                border-fuchsia-400/15
                bg-fuchsia-400/[0.055]
                text-fuchsia-300
            `,
    },

    legend: {
        label:
            "Legend",

        className:
            `
                border-yellow-400/20
                bg-yellow-400/[0.06]
                text-yellow-300
            `,
    },
};


// =========================================================
// STAT
// =========================================================

const StatItem = ({
    Icon,
    value,
    label,
    iconClassName = "",
}) => {
    return (
        <div
            className="
                inline-flex
                items-center
                gap-1.5

                text-[10px]
                font-semibold

                text-gray-600
            "
        >
            <Icon
                size={13}
                strokeWidth={2}
                className={
                    iconClassName
                }
            />

            <span
                className="
                    font-black
                    text-gray-400
                "
            >
                {
                    formatNumber(
                        value
                    )
                }
            </span>

            <span
                className="
                    hidden
                    xl:inline
                "
            >
                {
                    label
                }
            </span>
        </div>
    );
};


// =========================================================
// POPULAR PROBLEM CARD
// =========================================================

const PopularProbelmCard = ({
    id,

    problem,

    description,

    star = 0,

    response = 0,

    views = 0,

    user,

    language = [],

    technology = [],

    status,

    isSolved = false,

    createdAt,

    created_at,
}) => {

    // =====================================================
    // USER
    // =====================================================

    const fullName =
        getFullName(
            user
        );

    const username =
        user?.username ||
        "unknown";

    const avatarUrl =
        getUserAvatarUrl(
            user
        );

    const level =
        String(
            getLevel(
                user
            )
        ).toLowerCase();

    const levelConfig =
        LEVEL_CONFIG[
            level
        ] ||
        LEVEL_CONFIG.beginner;

    const coins =
        user?.coins ??
        user?.coin ??
        user?.total_coin ??
        0;


    // =====================================================
    // STATUS
    // =====================================================

    const solved =
        Boolean(
            isSolved ||
            status ===
                "solved"
        );


    // =====================================================
    // DATE
    // =====================================================

    const problemDate =
        createdAt ||
        created_at ||
        null;


    // =====================================================
    // TAGS
    // =====================================================

    const tags =
        useMemo(
            () => {

                const combined = [
                    ...(
                        Array.isArray(
                            language
                        )
                            ? language
                            : []
                    ),

                    ...(
                        Array.isArray(
                            technology
                        )
                            ? technology
                            : []
                    ),
                ];


                const names =
                    combined
                        .map(
                            getTagName
                        )
                        .filter(
                            Boolean
                        );


                return [
                    ...new Set(
                        names
                    ),
                ].slice(
                    0,
                    3
                );

            },
            [
                language,
                technology,
            ]
        );


    // =====================================================
    // URL
    // =====================================================

    const detailUrl =
        id
            ? `/problem/${id}/detail`
            : "/problems";


    // =====================================================
    // JSX
    // =====================================================

    return (
        <article
            className="
                group/card

                relative

                flex
                h-full
                min-h-[360px]

                flex-col

                overflow-hidden

                rounded-[26px]

                border
                border-white/[0.065]

                bg-[#0a0f19]

                transition-all
                duration-300

                hover:-translate-y-1

                hover:border-cyan-400/20

                hover:bg-[#0b111c]

                hover:shadow-[0_24px_70px_rgba(0,0,0,0.30)]
            "
        >

            {/* =================================================
                TOP ACCENT
            ================================================== */}

            <div
                className="
                    pointer-events-none

                    absolute
                    left-0
                    right-0
                    top-0

                    h-px

                    bg-gradient-to-r

                    from-cyan-400/60
                    via-indigo-400/25
                    to-transparent
                "
            />


            {/* =================================================
                BACKGROUND GLOW
            ================================================== */}

            <div
                className="
                    pointer-events-none

                    absolute

                    -right-20
                    -top-20

                    h-48
                    w-48

                    rounded-full

                    bg-indigo-500/[0.055]

                    blur-[70px]

                    transition-all
                    duration-500

                    group-hover/card:scale-125

                    group-hover/card:bg-cyan-500/[0.07]
                "
            />


            {/* =================================================
                CARD HEADER
            ================================================== */}

            <div
                className="
                    relative
                    z-10

                    flex
                    items-center
                    justify-between

                    gap-3

                    px-5
                    pt-5
                "
            >

                {/* LEFT */}

                <div
                    className="
                        flex
                        items-center

                        gap-2
                    "
                >

                    {/* PROBLEM TYPE */}

                    <div
                        className="
                            inline-flex
                            items-center

                            gap-1.5

                            rounded-full

                            border
                            border-cyan-400/15

                            bg-cyan-400/[0.05]

                            px-2.5
                            py-1

                            font-mono

                            text-[8px]
                            font-black

                            uppercase
                            tracking-[0.13em]

                            text-cyan-300
                        "
                    >

                        <Bug
                            size={11}
                            strokeWidth={2.2}
                        />

                        Problem

                    </div>


                    {/* STATUS */}

                    <div
                        className={`
                            inline-flex

                            items-center

                            gap-1.5

                            rounded-full

                            border

                            px-2.5
                            py-1

                            font-mono

                            text-[8px]
                            font-black

                            uppercase
                            tracking-[0.12em]

                            ${
                                solved

                                    ? `
                                        border-emerald-400/15
                                        bg-emerald-400/[0.05]
                                        text-emerald-300
                                    `

                                    : `
                                        border-orange-400/15
                                        bg-orange-400/[0.05]
                                        text-orange-300
                                    `
                            }
                        `}
                    >

                        {solved ? (

                            <CheckCircle2
                                size={10}
                                strokeWidth={2.3}
                            />

                        ) : (

                            <CircleDot
                                size={10}
                                strokeWidth={2.3}
                            />

                        )}


                        {
                            solved
                                ? "Solved"
                                : "Open"
                        }

                    </div>

                </div>


                {/* ID */}

                {id && (

                    <span
                        className="
                            font-mono

                            text-[9px]
                            font-bold

                            tracking-[0.12em]

                            text-gray-700
                        "
                    >
                        PRB_
                        {
                            String(
                                id
                            ).padStart(
                                3,
                                "0"
                            )
                        }
                    </span>

                )}

            </div>


            {/* =================================================
                AUTHOR
            ================================================== */}

            <div
                className="
                    relative
                    z-10

                    mt-5

                    flex
                    items-center
                    justify-between

                    gap-4

                    px-5
                "
            >

                {/* USER */}

                <div
                    className="
                        flex
                        min-w-0

                        items-center

                        gap-3
                    "
                >

                    {/* AVATAR */}

                    <div
                        className="
                            relative

                            flex-shrink-0
                        "
                    >

                        <img
                            src={
                                avatarUrl
                            }

                            alt={
                                username
                            }

                            onError={
                                handleUserImageError
                            }

                            className="
                                h-10
                                w-10

                                rounded-xl

                                border
                                border-white/10

                                object-cover

                                ring-1
                                ring-cyan-400/15
                            "
                        />


                        <span
                            className="
                                absolute

                                -bottom-0.5
                                -right-0.5

                                flex

                                h-3.5
                                w-3.5

                                items-center
                                justify-center

                                rounded-full

                                border-2
                                border-[#0a0f19]

                                bg-emerald-400
                            "
                        >

                            <span
                                className="
                                    h-1
                                    w-1

                                    rounded-full

                                    bg-[#07100d]
                                "
                            />

                        </span>

                    </div>


                    {/* USER INFO */}

                    <div
                        className="
                            min-w-0
                        "
                    >

                        <p
                            className="
                                truncate

                                text-[12px]
                                font-black

                                text-gray-200
                            "
                        >
                            {
                                fullName
                            }
                        </p>


                        <div
                            className="
                                mt-1

                                flex
                                items-center

                                gap-2
                            "
                        >

                            <span
                                className="
                                    max-w-[90px]

                                    truncate

                                    font-mono

                                    text-[9px]
                                    font-semibold

                                    text-indigo-300
                                "
                            >
                                @
                                {
                                    username
                                }
                            </span>


                            <span
                                className={`
                                    rounded-full

                                    border

                                    px-1.5
                                    py-0.5

                                    text-[7px]
                                    font-black

                                    uppercase
                                    tracking-[0.08em]

                                    ${levelConfig.className}
                                `}
                            >
                                {
                                    levelConfig.label
                                }
                            </span>

                        </div>

                    </div>

                </div>


                {/* COIN */}

                <div
                    className="
                        inline-flex

                        flex-shrink-0

                        items-center

                        gap-1.5

                        rounded-lg

                        border
                        border-yellow-400/10

                        bg-yellow-400/[0.035]

                        px-2
                        py-1.5
                    "
                >

                    <Coins
                        size={12}
                        strokeWidth={2}

                        className="
                            text-yellow-300
                        "
                    />


                    <span
                        className="
                            font-mono

                            text-[9px]
                            font-black

                            text-yellow-200
                        "
                    >
                        {
                            formatNumber(
                                coins
                            )
                        }
                    </span>

                </div>

            </div>


            {/* =================================================
                PROBLEM CONTENT
            ================================================== */}

            <div
                className="
                    relative
                    z-10

                    flex
                    flex-1
                    flex-col

                    px-5
                    pb-5
                "
            >

                {/* TITLE */}

                <Link
                    to={
                        detailUrl
                    }

                    className="
                        group/title

                        mt-6

                        block
                    "
                >

                    <h3
                        className="
                            line-clamp-2

                            min-h-[52px]

                            text-[18px]
                            font-black
                            leading-[1.45]

                            tracking-[-0.025em]

                            text-gray-100

                            transition-colors
                            duration-200

                            group-hover/title:text-cyan-200
                        "
                    >
                        {
                            limitText(
                                problem ||
                                "Nomsiz muammo",
                                85
                            )
                        }
                    </h3>

                </Link>


                {/* DESCRIPTION */}

                <p
                    className="
                        mt-3

                        line-clamp-2

                        min-h-[44px]

                        text-[12px]
                        leading-[1.8]

                        text-gray-500
                    "
                >
                    {
                        limitText(
                            description ||
                            "Muammo haqida qo‘shimcha tavsif mavjud emas.",
                            130
                        )
                    }
                </p>


                {/* =================================================
                    TAGS
                ================================================== */}

                <div
                    className="
                        mt-5

                        flex
                        min-h-[27px]

                        flex-wrap

                        items-center

                        gap-1.5
                    "
                >

                    {tags.length > 0 ? (

                        tags.map(
                            (
                                tag,
                                index
                            ) => (

                                <span
                                    key={
                                        `${tag}-${index}`
                                    }

                                    className="
                                        inline-flex

                                        items-center

                                        gap-1.5

                                        rounded-lg

                                        border
                                        border-white/[0.06]

                                        bg-white/[0.025]

                                        px-2
                                        py-1

                                        font-mono

                                        text-[8px]
                                        font-bold

                                        text-gray-500

                                        transition-all
                                        duration-200

                                        hover:border-cyan-400/15

                                        hover:bg-cyan-400/[0.04]

                                        hover:text-cyan-300
                                    "
                                >

                                    <Code2
                                        size={10}
                                        strokeWidth={2}
                                    />


                                    {
                                        tag
                                    }

                                </span>

                            )
                        )

                    ) : (

                        <>

                            <span
                                className="
                                    rounded-lg

                                    border
                                    border-cyan-400/10

                                    bg-cyan-400/[0.035]

                                    px-2
                                    py-1

                                    font-mono

                                    text-[8px]
                                    font-bold

                                    text-cyan-400/70
                                "
                            >
                                #problem
                            </span>


                            <span
                                className="
                                    rounded-lg

                                    border
                                    border-indigo-400/10

                                    bg-indigo-400/[0.035]

                                    px-2
                                    py-1

                                    font-mono

                                    text-[8px]
                                    font-bold

                                    text-indigo-400/70
                                "
                            >
                                #solution
                            </span>

                        </>

                    )}

                </div>


                {/* =================================================
                    DIVIDER
                ================================================== */}

                <div
                    className="
                        mt-5

                        h-px

                        w-full

                        bg-gradient-to-r

                        from-white/[0.07]
                        via-white/[0.035]
                        to-transparent
                    "
                />


                {/* =================================================
                    DATE
                ================================================== */}

                <div
                    className="
                        mt-3

                        flex
                        items-center
                        justify-between

                        gap-3
                    "
                >

                    <span
                        className="
                            font-mono

                            text-[8px]
                            font-medium

                            uppercase
                            tracking-[0.08em]

                            text-gray-700
                        "
                    >
                        Joylangan:{" "}

                        <span
                            className="
                                text-gray-600
                            "
                        >
                            {
                                formatDate(
                                    problemDate
                                )
                            }
                        </span>
                    </span>


                    {!solved && (

                        <span
                            className="
                                inline-flex

                                items-center

                                gap-1.5

                                text-[8px]
                                font-bold

                                uppercase
                                tracking-[0.08em]

                                text-orange-300/60
                            "
                        >

                            <CircleDot
                                size={9}
                            />

                            Yechim kutilmoqda

                        </span>

                    )}

                </div>


                {/* =================================================
                    FOOTER
                ================================================== */}

                <div
                    className="
                        mt-auto
                        pt-5
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

                        {/* STATS */}

                        <div
                            className="
                                flex
                                flex-wrap
                                items-center

                                gap-x-4
                                gap-y-2
                            "
                        >

                            <StatItem
                                Icon={
                                    Eye
                                }

                                value={
                                    views
                                }

                                label="views"

                                iconClassName="
                                    text-cyan-300
                                "
                            />


                            <StatItem
                                Icon={
                                    MessageCircle
                                }

                                value={
                                    response
                                }

                                label="answers"

                                iconClassName="
                                    text-indigo-300
                                "
                            />


                            <StatItem
                                Icon={
                                    Star
                                }

                                value={
                                    star
                                }

                                label="stars"

                                iconClassName="
                                    text-yellow-300
                                "
                            />

                        </div>


                        {/* VIEW BUTTON */}

                        <Link
                            to={
                                detailUrl
                            }

                            aria-label="Muammoni ko‘rish"

                            className="
                                group/open

                                inline-flex

                                h-9

                                flex-shrink-0

                                items-center
                                justify-center

                                gap-2

                                rounded-xl

                                border
                                border-cyan-400/15

                                bg-cyan-400/[0.045]

                                px-3

                                text-[9px]
                                font-black

                                uppercase
                                tracking-[0.08em]

                                text-cyan-300

                                transition-all
                                duration-200

                                hover:border-cyan-400/25

                                hover:bg-cyan-400/[0.09]

                                hover:text-cyan-200
                            "
                        >

                            Ko‘rish

                            <ArrowUpRight
                                size={13}
                                strokeWidth={2.2}

                                className="
                                    transition-transform
                                    duration-200

                                    group-hover/open:-translate-y-0.5
                                    group-hover/open:translate-x-0.5
                                "
                            />

                        </Link>

                    </div>

                </div>

            </div>

        </article>
    );
};


export default PopularProbelmCard;