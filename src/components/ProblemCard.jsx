// src/components/ProblemCard.jsx

import React, {
    memo,
    useMemo,
} from "react";

import {
    Link,
} from "react-router-dom";

import {
    ArrowRight,
    Bug,
    CheckCircle2,
    Clock3,
    Code2,
    Coins,
    Eye,
    MessageCircle,
    Star,
    Tags,
    XCircle,
    Zap,
} from "lucide-react";

import UserImage from "../assests/userImage.jpeg";

import {
    limitText,
} from "../utils/limitText";

import timeAgo from "../utils/timeAgo";


// =========================================================
// BACKEND
// =========================================================

const BACKEND_URL =
    (
        process.env.REACT_APP_BACKEND_URL
        ||
        "http://127.0.0.1:8000"
    ).replace(
        /\/+$/,
        ""
    );


// =========================================================
// CONFIG
// =========================================================

const DEFAULT_STACK_COLOR =
    "#64748B";


const MAX_LANGUAGES =
    2;


const MAX_TECHNOLOGIES =
    3;


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
        value.startsWith(
            "http://"
        )
        ||
        value.startsWith(
            "https://"
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


    return (
        `${BACKEND_URL}${
            value.startsWith("/")
                ? value
                : `/${value}`
        }`
    );
};


// =========================================================
// STACK COLOR
// =========================================================

const getStackColor = (
    item
) => {

    const color =
        item?.color;


    if (
        typeof color ===
            "string"
        &&
        /^#[0-9A-Fa-f]{6}$/.test(
            color
        )
    ) {

        return color;
    }


    return DEFAULT_STACK_COLOR;
};


// =========================================================
// HEX WITH ALPHA
// =========================================================

const withAlpha = (
    color,
    alpha
) => {

    const safeColor =
        (
            typeof color ===
                "string"
            &&
            /^#[0-9A-Fa-f]{6}$/.test(
                color
            )
        )
            ? color
            : DEFAULT_STACK_COLOR;


    return `${safeColor}${alpha}`;
};


// =========================================================
// NORMALIZE STACK
// =========================================================

const normalizeStack = (
    items
) => {

    if (
        !Array.isArray(
            items
        )
    ) {

        return [];
    }


    return items
        .filter(
            Boolean
        )
        .map(
            (
                item,
                index
            ) => {

                if (
                    typeof item ===
                    "string"
                ) {

                    return {
                        id:
                            `${item}-${index}`,

                        name:
                            item,

                        color:
                            DEFAULT_STACK_COLOR,
                    };
                }


                return {
                    ...item,

                    id:
                        item.id
                        ??
                        `${item.name || "stack"}-${index}`,

                    name:
                        item.name
                        ||
                        item.title
                        ||
                        "Unknown",

                    color:
                        getStackColor(
                            item
                        ),
                };
            }
        );
};


// =========================================================
// DEADLINE
// =========================================================

const getDeadlineData = (
    deadline
) => {

    if (
        !deadline
    ) {
        return null;
    }


    const target =
        new Date(
            deadline
        );


    if (
        Number.isNaN(
            target.getTime()
        )
    ) {
        return null;
    }


    const diff =
        target.getTime()
        -
        Date.now();


    if (
        diff <= 0
    ) {

        return {
            text:
                "Muddati tugagan",

            expired:
                true,
        };
    }


    const totalMinutes =
        Math.ceil(
            diff
            /
            (
                1000
                *
                60
            )
        );


    const days =
        Math.floor(
            totalMinutes
            /
            (
                60
                *
                24
            )
        );


    if (
        days > 0
    ) {

        return {
            text:
                `${days} kun qoldi`,

            expired:
                false,
        };
    }


    const hours =
        Math.floor(
            totalMinutes
            /
            60
        );


    if (
        hours > 0
    ) {

        return {
            text:
                `${hours} soat qoldi`,

            expired:
                false,
        };
    }


    return {
        text:
            `${Math.max(
                1,
                totalMinutes
            )} daqiqa qoldi`,

        expired:
            false,
    };
};


// =========================================================
// STACK BADGE
// =========================================================

const StackBadge = ({
    item,
    type = "language",
}) => {

    const color =
        getStackColor(
            item
        );


    const Icon =
        type ===
        "language"
            ? Code2
            : Tags;


    return (
        <span
            title={
                item?.name
                ||
                ""
            }
            className="
                inline-flex
                max-w-full
                items-center
                gap-1.5
                rounded-full
                border

                px-2.5
                py-1

                text-[10px]
                font-black

                transition-all
                duration-300

                hover:-translate-y-[1px]
            "
            style={{
                color,

                borderColor:
                    withAlpha(
                        color,
                        "45"
                    ),

                backgroundColor:
                    withAlpha(
                        color,
                        "16"
                    ),

                boxShadow:
                    `0 0 12px ${
                        withAlpha(
                            color,
                            "0D"
                        )
                    }`,
            }}
        >
            <Icon
                size={11}
                className="
                    shrink-0
                    opacity-80
                "
            />

            <span
                className="
                    truncate
                "
            >
                {item?.name}
            </span>
        </span>
    );
};


// =========================================================
// MORE BADGE
// =========================================================

const MoreBadge = ({
    items = [],
}) => {

    if (
        items.length <=
        0
    ) {
        return null;
    }


    const names =
        items
            .map(
                (
                    item
                ) =>
                    item?.name
            )
            .filter(
                Boolean
            )
            .join(
                ", "
            );


    return (
        <span
            title={
                names
                ||
                `${items.length} ta qo‘shimcha`
            }
            className="
                inline-flex
                items-center
                justify-center
                rounded-full

                border
                border-white/10

                bg-white/[0.04]

                px-2.5
                py-1

                text-[10px]
                font-black
                text-gray-500

                transition-all

                hover:border-white/20
                hover:bg-white/[0.07]
                hover:text-white
            "
        >
            +{items.length}
        </span>
    );
};


// =========================================================
// STAT
// =========================================================

const StatBadge = ({
    icon: Icon,
    value,
    iconClass,
}) => {

    return (
        <span
            className="
                inline-flex
                items-center
                gap-1.5
                rounded-full

                border
                border-white/10

                bg-white/[0.04]

                px-3
                py-1.5

                text-xs
                font-semibold
                text-gray-400
            "
        >
            <Icon
                size={13}
                className={
                    iconClass
                }
            />

            {safeNumber(
                value
            )}
        </span>
    );
};


// =========================================================
// PROBLEM CARD
// =========================================================

const ProblemCard = ({
    id,

    username,
    firstName,
    lastName,
    image,

    name,

    views,

    languages = [],
    technologies = [],

    createdAt,

    star,
    responseCount,

    isSolved = false,
    status = "pending",

    isUrgent = false,
    deadline = null,
    offeredCoins = 0,
}) => {

    // =====================================================
    // USER
    // =====================================================

    const fullName =
        (
            firstName
            ||
            lastName
        )
            ? `${firstName || ""} ${
                lastName || ""
            }`.trim()
            : username
            ||
            "Anonymous";


    const avatar =
        getImageUrl(
            image
        );


    // =====================================================
    // STACK
    // =====================================================

    const normalizedLanguages =
        useMemo(
            () =>
                normalizeStack(
                    languages
                ),
            [
                languages,
            ]
        );


    const normalizedTechnologies =
        useMemo(
            () =>
                normalizeStack(
                    technologies
                ),
            [
                technologies,
            ]
        );


    const visibleLanguages =
        normalizedLanguages.slice(
            0,
            MAX_LANGUAGES
        );


    const hiddenLanguages =
        normalizedLanguages.slice(
            MAX_LANGUAGES
        );


    const visibleTechnologies =
        normalizedTechnologies.slice(
            0,
            MAX_TECHNOLOGIES
        );


    const hiddenTechnologies =
        normalizedTechnologies.slice(
            MAX_TECHNOLOGIES
        );


    // =====================================================
    // STATUS
    // =====================================================

    const normalizedStatus =
        String(
            status
            ||
            ""
        ).toLowerCase();


    const solved =
        Boolean(
            isSolved
        )
        ||
        normalizedStatus ===
            "solved";


    const rejected =
        normalizedStatus ===
        "rejected";


    const statusData =
        rejected
            ? {
                text:
                    "RAD ETILGAN",

                Icon:
                    XCircle,

                border:
                    "border-gray-500/30",

                bg:
                    "bg-gray-500/10",

                textColor:
                    "text-gray-400",

                line:
                    "from-gray-500 via-red-400/60 to-transparent",
            }

            : solved
                ? {
                    text:
                        "YECHILGAN",

                    Icon:
                        CheckCircle2,

                    border:
                        "border-emerald-400/30",

                    bg:
                        "bg-emerald-400/10",

                    textColor:
                        "text-emerald-300",

                    line:
                        "from-emerald-400 via-cyan-400 to-transparent",
                }

                : {
                    text:
                        "YECHILMAGAN",

                    Icon:
                        Clock3,

                    border:
                        "border-red-400/30",

                    bg:
                        "bg-red-400/10",

                    textColor:
                        "text-red-300",

                    line:
                        "from-red-400 via-orange-400 to-transparent",
                };


    const StatusIcon =
        statusData.Icon;


    // =====================================================
    // DEADLINE
    // =====================================================

    const deadlineData =
        getDeadlineData(
            deadline
        );


    // =====================================================
    // BOUNTY
    // =====================================================

    const bounty =
        safeNumber(
            offeredCoins
        );


    // =====================================================
    // RENDER
    // =====================================================

    return (
        <article
            className="
                animate-fade-in-up
                h-full
            "
        >
            <Link
                to={
                    `/problem/${id}/detail`
                }
                className={`
                    group
                    relative
                    block
                    h-full
                    overflow-hidden
                    rounded-3xl
                    border

                    bg-[#050816]

                    p-[1px]

                    shadow-2xl
                    shadow-black/30

                    transition-all
                    duration-300

                    hover:-translate-y-1.5
                    hover:shadow-cyan-500/10

                    ${statusData.border}
                `}
            >

                {/* =========================================
                    BACKGROUND GLOW
                ========================================== */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        -left-24
                        -top-24
                        h-52
                        w-52
                        rounded-full
                        bg-cyan-500/10
                        blur-3xl

                        transition-all
                        duration-500

                        group-hover:bg-cyan-400/20
                    "
                />


                <div
                    className="
                        pointer-events-none
                        absolute
                        -bottom-24
                        -right-24
                        h-52
                        w-52
                        rounded-full
                        bg-indigo-500/10
                        blur-3xl

                        transition-all
                        duration-500

                        group-hover:bg-indigo-400/20
                    "
                />


                {/* =========================================
                    STATUS LINE
                ========================================== */}

                <div
                    className={`
                        absolute
                        left-0
                        top-0
                        h-[2px]
                        w-full
                        bg-gradient-to-r

                        ${statusData.line}
                    `}
                />


                <div
                    className="
                        relative
                        flex
                        h-full
                        flex-col

                        rounded-3xl

                        bg-gradient-to-br
                        from-[#0b1020]
                        via-[#080d18]
                        to-[#0d1117]

                        p-5
                    "
                >

                    {/* =====================================
                        USER + STATUS
                    ====================================== */}

                    <div
                        className="
                            mb-5
                            flex
                            items-start
                            justify-between
                            gap-3
                        "
                    >
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
                                <img
                                    src={
                                        avatar
                                    }

                                    alt={
                                        username
                                        ||
                                        "user"
                                    }

                                    onError={(
                                        event
                                    ) => {

                                        event.currentTarget.onerror =
                                            null;

                                        event.currentTarget.src =
                                            UserImage;
                                    }}

                                    className={`
                                        h-11
                                        w-11
                                        rounded-2xl
                                        border
                                        object-cover
                                        shadow-lg

                                        ${
                                            solved
                                                ? "border-emerald-400/40"
                                                : "border-cyan-400/25"
                                        }
                                    `}
                                />


                                <span
                                    className={`
                                        absolute
                                        -right-1
                                        -top-1
                                        h-3.5
                                        w-3.5
                                        rounded-full
                                        border-2
                                        border-[#0b1020]

                                        ${
                                            solved
                                                ? "bg-emerald-400"
                                                : rejected
                                                    ? "bg-gray-500"
                                                    : "bg-red-400"
                                        }
                                    `}
                                />
                            </div>


                            <div
                                className="
                                    min-w-0
                                "
                            >
                                <h4
                                    className="
                                        truncate
                                        text-sm
                                        font-black
                                        text-white
                                    "
                                >
                                    {fullName}
                                </h4>


                                <div
                                    className="
                                        mt-1
                                        flex
                                        min-w-0
                                        items-center
                                        gap-2

                                        text-xs
                                        text-gray-600
                                    "
                                >
                                    <span
                                        className="
                                            max-w-[110px]
                                            truncate
                                            font-mono
                                        "
                                    >
                                        @{username || "unknown"}
                                    </span>


                                    <span>
                                        •
                                    </span>


                                    <span
                                        className="
                                            inline-flex
                                            shrink-0
                                            items-center
                                            gap-1
                                        "
                                    >
                                        <Clock3
                                            size={11}
                                        />

                                        {timeAgo(
                                            createdAt
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>


                        <span
                            className={`
                                inline-flex
                                shrink-0
                                items-center
                                gap-1.5
                                rounded-full
                                border
                                px-2.5
                                py-1.5

                                text-[9px]
                                font-black
                                uppercase
                                tracking-wider

                                ${statusData.border}
                                ${statusData.bg}
                                ${statusData.textColor}
                            `}
                        >
                            <StatusIcon
                                size={11}
                            />

                            <span
                                className="
                                    hidden
                                    sm:inline
                                "
                            >
                                {
                                    statusData.text
                                }
                            </span>
                        </span>
                    </div>


                    {/* =====================================
                        LABELS
                    ====================================== */}

                    <div
                        className="
                            mb-3
                            flex
                            flex-wrap
                            items-center
                            justify-between
                            gap-2
                        "
                    >
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
                                    bg-cyan-400/10
                                    px-3
                                    py-1

                                    text-[10px]
                                    font-black
                                    uppercase
                                    tracking-[0.16em]
                                    text-cyan-300
                                "
                            >
                                <Bug
                                    size={11}
                                />

                                problem ticket
                            </span>


                            {isUrgent && (

                                <span
                                    className="
                                        inline-flex
                                        items-center
                                        gap-1.5
                                        rounded-full
                                        border
                                        border-orange-400/25
                                        bg-orange-500/10
                                        px-2.5
                                        py-1

                                        text-[10px]
                                        font-black
                                        uppercase
                                        tracking-wider
                                        text-orange-300
                                    "
                                >
                                    <Zap
                                        size={11}
                                    />

                                    Tezkor
                                </span>
                            )}
                        </div>


                        <span
                            className="
                                font-mono
                                text-xs
                                font-black
                                text-gray-700
                            "
                        >
                            #{id}
                        </span>
                    </div>


                    {/* =====================================
                        TITLE
                    ====================================== */}

                    <h3
                        className="
                            mb-4
                            text-xl
                            font-black
                            leading-snug
                            text-white

                            transition-colors
                            duration-300

                            group-hover:text-cyan-300
                        "
                    >
                        {limitText(
                            name
                            ||
                            "Nomsiz muammo",
                            80
                        )}
                    </h3>


                    {/* =====================================
                        URGENT META
                    ====================================== */}

                    {isUrgent && (
                        <div
                            className="
                                mb-5
                                flex
                                flex-wrap
                                gap-2
                            "
                        >
                            {bounty > 0 && (

                                <span
                                    className="
                                        inline-flex
                                        items-center
                                        gap-1.5
                                        rounded-xl
                                        border
                                        border-yellow-400/20
                                        bg-yellow-500/[0.08]
                                        px-2.5
                                        py-1.5

                                        text-[10px]
                                        font-black
                                        text-yellow-300
                                    "
                                >
                                    <Coins
                                        size={12}
                                    />

                                    {bounty} FCoin
                                </span>
                            )}


                            {deadlineData && (

                                <span
                                    className={`
                                        inline-flex
                                        items-center
                                        gap-1.5
                                        rounded-xl
                                        border
                                        px-2.5
                                        py-1.5

                                        text-[10px]
                                        font-black

                                        ${
                                            deadlineData.expired

                                                ? `
                                                    border-red-400/20
                                                    bg-red-500/[0.08]
                                                    text-red-300
                                                `

                                                : `
                                                    border-orange-400/20
                                                    bg-orange-500/[0.07]
                                                    text-orange-300
                                                `
                                        }
                                    `}
                                >
                                    <Clock3
                                        size={12}
                                    />

                                    {
                                        deadlineData.text
                                    }
                                </span>
                            )}
                        </div>
                    )}


                    {/* =====================================
                        STACK
                    ====================================== */}

                    <div
                        className="
                            mb-5
                            space-y-4
                        "
                    >

                        {/* LANGUAGES */}

                        <div>
                            <div
                                className="
                                    mb-2
                                    flex
                                    items-center
                                    gap-2

                                    font-mono
                                    text-[9px]
                                    font-black
                                    uppercase
                                    tracking-[0.16em]
                                    text-gray-700
                                "
                            >
                                <Code2
                                    size={11}
                                    className="
                                        text-cyan-500
                                    "
                                />

                                Til
                            </div>


                            <div
                                className="
                                    flex
                                    min-h-[28px]
                                    flex-wrap
                                    items-center
                                    gap-1.5
                                "
                            >
                                {visibleLanguages.length >
                                    0 ? (

                                    <>
                                        {visibleLanguages.map(
                                            (
                                                language
                                            ) => (

                                                <StackBadge
                                                    key={
                                                        `language-${language.id}`
                                                    }
                                                    item={
                                                        language
                                                    }
                                                    type="language"
                                                />
                                            )
                                        )}


                                        <MoreBadge
                                            items={
                                                hiddenLanguages
                                            }
                                        />
                                    </>

                                ) : (

                                    <span
                                        className="
                                            rounded-full
                                            border
                                            border-white/10
                                            bg-white/[0.04]
                                            px-3
                                            py-1

                                            text-[10px]
                                            font-bold
                                            text-gray-600
                                        "
                                    >
                                        Til belgilanmagan
                                    </span>
                                )}
                            </div>
                        </div>


                        {/* TECHNOLOGIES */}

                        <div>
                            <div
                                className="
                                    mb-2
                                    flex
                                    items-center
                                    justify-between
                                    gap-3
                                "
                            >
                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2

                                        font-mono
                                        text-[9px]
                                        font-black
                                        uppercase
                                        tracking-[0.16em]
                                        text-gray-700
                                    "
                                >
                                    <Tags
                                        size={11}
                                        className="
                                            text-indigo-400
                                        "
                                    />

                                    Taglar
                                </div>


                                {normalizedTechnologies.length >
                                    0 && (

                                    <span
                                        className="
                                            font-mono
                                            text-[9px]
                                            font-black
                                            text-gray-800
                                        "
                                    >
                                        {
                                            normalizedTechnologies.length
                                        }
                                    </span>
                                )}
                            </div>


                            <div
                                className="
                                    flex
                                    min-h-[28px]
                                    flex-wrap
                                    items-center
                                    gap-1.5
                                "
                            >
                                {visibleTechnologies.length >
                                    0 ? (

                                    <>
                                        {visibleTechnologies.map(
                                            (
                                                technology
                                            ) => (

                                                <StackBadge
                                                    key={
                                                        `technology-${technology.id}`
                                                    }
                                                    item={
                                                        technology
                                                    }
                                                    type="technology"
                                                />
                                            )
                                        )}


                                        <MoreBadge
                                            items={
                                                hiddenTechnologies
                                            }
                                        />
                                    </>

                                ) : (

                                    <span
                                        className="
                                            rounded-full
                                            border
                                            border-white/10
                                            bg-white/[0.04]
                                            px-3
                                            py-1

                                            text-[10px]
                                            font-bold
                                            text-gray-600
                                        "
                                    >
                                        Tag yo‘q
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>


                    {/* =====================================
                        PUSH BOTTOM
                    ====================================== */}

                    <div
                        className="
                            flex-1
                        "
                    />


                    {/* =====================================
                        BOTTOM
                    ====================================== */}

                    <div
                        className="
                            border-t
                            border-white/10
                            pt-4
                        "
                    >
                        <div
                            className="
                                flex
                                flex-col
                                gap-4

                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                            "
                        >

                            {/* STATS */}

                            <div
                                className="
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-2
                                "
                            >
                                <StatBadge
                                    icon={
                                        Eye
                                    }
                                    value={
                                        views
                                    }
                                    iconClass="
                                        text-cyan-300
                                    "
                                />


                                <StatBadge
                                    icon={
                                        MessageCircle
                                    }
                                    value={
                                        responseCount
                                    }
                                    iconClass="
                                        text-indigo-300
                                    "
                                />


                                <StatBadge
                                    icon={
                                        Star
                                    }
                                    value={
                                        star
                                    }
                                    iconClass="
                                        text-yellow-300
                                    "
                                />
                            </div>


                            {/* CTA */}

                            <span
                                className={`
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-2xl
                                    border

                                    px-4
                                    py-2

                                    text-xs
                                    font-black
                                    uppercase
                                    tracking-wider

                                    transition-all
                                    duration-300

                                    group-hover:translate-x-1

                                    ${
                                        solved

                                            ? `
                                                border-emerald-400/20
                                                bg-emerald-400/10
                                                text-emerald-300

                                                group-hover:bg-emerald-400
                                                group-hover:text-[#050816]
                                            `

                                            : `
                                                border-cyan-400/20
                                                bg-cyan-400/10
                                                text-cyan-300

                                                group-hover:bg-cyan-400
                                                group-hover:text-[#050816]
                                            `
                                    }
                                `}
                            >
                                Yechimni ko‘rish

                                <ArrowRight
                                    size={14}
                                />
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </article>
    );
};


export default memo(
    ProblemCard
);