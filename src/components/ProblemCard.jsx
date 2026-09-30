// src/components/ProblemCard.jsx

import React, { memo, useMemo } from "react";
import { Link } from "react-router-dom";
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
import { limitText } from "../utils/limitText";
import timeAgo from "../utils/timeAgo";

const BACKEND_URL = (
    process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

const DEFAULT_STACK_COLOR = "#64748B";
const MAX_LANGUAGES = 2;
const MAX_TECHNOLOGIES = 3;

const safeNumber = (value) => {
    const number = Number(value);
    return Number.isFinite(number) ? Math.max(0, number) : 0;
};

const toBoolean = (value) => {
    if (typeof value === "boolean") return value;

    if (typeof value === "string") {
        const normalized = value.trim().toLowerCase();

        if (["true", "1", "yes", "on"].includes(normalized)) return true;
        if (["false", "0", "no", "off", ""].includes(normalized)) return false;
    }

    return Boolean(value);
};

const cleanText = (value, fallback = "") => {
    if (value === null || value === undefined) return fallback;

    return String(value).trim() || fallback;
};

const getImageUrl = (image) => {
    const value = cleanText(image);

    if (!value) return UserImage;

    if (
        value.startsWith("http://") ||
        value.startsWith("https://") ||
        value.startsWith("blob:") ||
        value.startsWith("data:")
    ) {
        return value;
    }

    return `${BACKEND_URL}${value.startsWith("/") ? value : `/${value}`}`;
};

const normalizeHexColor = (value) => {
    if (typeof value !== "string") return DEFAULT_STACK_COLOR;

    const color = value.trim();

    if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
        return color;
    }

    if (/^#[0-9A-Fa-f]{3}$/.test(color)) {
        const [r, g, b] = color.slice(1).split("");

        return `#${r}${r}${g}${g}${b}${b}`;
    }

    return DEFAULT_STACK_COLOR;
};

const withAlpha = (color, alpha) => {
    const safeColor = normalizeHexColor(color);

    const safeAlpha = /^[0-9A-Fa-f]{2}$/.test(String(alpha))
        ? String(alpha)
        : "FF";

    return `${safeColor}${safeAlpha}`;
};

const normalizeStack = (items) => {
    if (!Array.isArray(items)) {
        return [];
    }

    const normalized = items
        .map((item, index) => {
            if (typeof item === "string") {
                const name = cleanText(item);

                if (!name) {
                    return null;
                }

                return {
                    id: `string-${name}-${index}`,
                    name,
                    color: DEFAULT_STACK_COLOR,
                    iconKey: "",
                };
            }

            if (!item || typeof item !== "object") {
                return null;
            }

            const name = cleanText(
                item.name ??
                item.title
            );

            if (!name) {
                return null;
            }

            return {
                ...item,

                id:
                    item.id ??
                    `${name}-${index}`,

                name,

                color:
                    normalizeHexColor(
                        item.color
                    ),

                iconKey:
                    cleanText(
                        item.icon_key
                    ),
            };
        })
        .filter(Boolean);

    const seen = new Set();

    return normalized.filter((item) => {
        const key =
            item.id !== undefined &&
            item.id !== null
                ? `id:${item.id}`
                : `name:${item.name.toLowerCase()}`;

        if (seen.has(key)) {
            return false;
        }

        seen.add(key);

        return true;
    });
};

const getTimeAgoLabel = (value) => {
    if (!value) {
        return "Sana noma’lum";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Sana noma’lum";
    }

    return timeAgo(value);
};

const getDeadlineData = (deadline) => {
    if (!deadline) {
        return null;
    }

    const target = new Date(deadline);

    if (Number.isNaN(target.getTime())) {
        return null;
    }

    const diff =
        target.getTime() -
        Date.now();

    if (diff <= 0) {
        return {
            text: "Muddati tugagan",
            expired: true,
        };
    }

    const totalMinutes = Math.max(
        1,
        Math.ceil(
            diff /
            (
                1000 *
                60
            )
        )
    );

    const days = Math.floor(
        totalMinutes /
        (
            60 *
            24
        )
    );

    if (days > 0) {
        return {
            text: `${days} kun qoldi`,
            expired: false,
        };
    }

    const hours = Math.floor(
        totalMinutes /
        60
    );

    if (hours > 0) {
        return {
            text: `${hours} soat qoldi`,
            expired: false,
        };
    }

    return {
        text: `${totalMinutes} daqiqa qoldi`,
        expired: false,
    };
};

const StackBadge = ({
    item,
    type = "language",
}) => {
    const color =
        normalizeHexColor(
            item?.color
        );

    const Icon =
        type === "language"
            ? Code2
            : Tags;

    return (
        <span
            title={item?.name || ""}
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
                aria-hidden="true"
                className="
                    shrink-0
                    opacity-80
                "
            />

            <span className="truncate">
                {item?.name}
            </span>
        </span>
    );
};

const MoreBadge = ({
    items = [],
}) => {
    if (
        !Array.isArray(items) ||
        items.length === 0
    ) {
        return null;
    }

    const names = items
        .map(
            (item) =>
                item?.name
        )
        .filter(Boolean)
        .join(", ");

    return (
        <span
            title={
                names ||
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

const StatBadge = ({
    icon: Icon,
    value,
    iconClass,
    label,
}) => {
    const safeValue =
        safeNumber(
            value
        );

    return (
        <span
            title={`${label}: ${safeValue}`}
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
                aria-hidden="true"
                className={
                    iconClass
                }
            />

            {safeValue}
        </span>
    );
};

const ProblemCard = ({
    problem = null,

    // Legacy props.
    // Boshqa eski usage bo‘lsa buzilmasligi uchun.
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
    // BACKEND + LEGACY CONTRACT
    // =====================================================

    const problemUser =
        problem?.user &&
        typeof problem.user ===
            "object"
            ? problem.user
            : {};

    const resolvedId =
        problem?.id ??
        id;

    const resolvedUsername =
        cleanText(
            problemUser.username ??
            username,
            "unknown"
        );

    const resolvedFirstName =
        cleanText(
            problemUser.first_name ??
            problemUser.firstName ??
            firstName
        );

    const resolvedLastName =
        cleanText(
            problemUser.last_name ??
            problemUser.lastName ??
            lastName
        );

    const resolvedImage =
        problemUser.image ??
        image;

    const resolvedName =
        cleanText(
            problem?.problem ??
            problem?.name ??
            name,
            "Nomsiz muammo"
        );

    const resolvedViews =
        problem?.total_views ??
        problem?.views ??
        views ??
        0;

    const resolvedLanguages =
        problem?.language_data ??
        problem?.languages ??
        languages;

    const resolvedTechnologies =
        problem?.technology_data ??
        problem?.technologies ??
        technologies;

    const resolvedCreatedAt =
        problem?.created_at ??
        problem?.createdAt ??
        createdAt;

    const resolvedStar =
        problem?.star ??
        star ??
        0;

    const resolvedResponseCount =
        problem?.response_count ??
        problem?.responseCount ??
        responseCount ??
        0;

    const resolvedStatus =
        cleanText(
            problem?.status ??
            status,
            "pending"
        ).toLowerCase();

    const resolvedIsSolved =
        problem?.is_solved ??
        problem?.isSolved ??
        isSolved;

    const resolvedIsUrgent =
        problem?.is_urgent ??
        problem?.isUrgent ??
        isUrgent;

    const resolvedDeadline =
        problem?.deadline ??
        deadline;

    const resolvedOfferedCoins =
        problem?.offered_coins ??
        problem?.offeredCoins ??
        offeredCoins ??
        0;


    // =====================================================
    // USER
    // =====================================================

    const fullName =
        resolvedFirstName ||
        resolvedLastName
            ? `${resolvedFirstName} ${resolvedLastName}`.trim()
            : resolvedUsername !==
                "unknown"
                ? resolvedUsername
                : "Anonymous";

    const avatar =
        getImageUrl(
            resolvedImage
        );

    const createdLabel =
        getTimeAgoLabel(
            resolvedCreatedAt
        );


    // =====================================================
    // STACK
    // =====================================================

    const normalizedLanguages =
        useMemo(
            () =>
                normalizeStack(
                    resolvedLanguages
                ),
            [
                resolvedLanguages,
            ]
        );

    const normalizedTechnologies =
        useMemo(
            () =>
                normalizeStack(
                    resolvedTechnologies
                ),
            [
                resolvedTechnologies,
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

    const solved =
        toBoolean(
            resolvedIsSolved
        )
        ||
        resolvedStatus ===
            "solved";

    const rejected =
        resolvedStatus ===
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

                dot:
                    "bg-gray-500",
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

                    dot:
                        "bg-emerald-400",
                }

                : {
                    text:
                        "JARAYONDA",

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

                    dot:
                        "bg-red-400",
                };

    const StatusIcon =
        statusData.Icon;


    // =====================================================
    // PRIORITY META
    // =====================================================

    const deadlineData =
        getDeadlineData(
            resolvedDeadline
        );

    const bounty =
        safeNumber(
            resolvedOfferedCoins
        );

    const urgent =
        toBoolean(
            resolvedIsUrgent
        );

    const hasPriorityMeta =
        bounty > 0 ||
        Boolean(
            deadlineData
        );


    // =====================================================
    // ROUTE
    // =====================================================

    const hasValidId =
        resolvedId !== null &&
        resolvedId !== undefined &&
        cleanText(
            resolvedId
        ) !== "";

    const detailPath =
        hasValidId
            ? `/problem/${resolvedId}/detail`
            : null;

    const CardRoot =
        hasValidId
            ? Link
            : "div";

    const cardRootProps =
        hasValidId
            ? {
                to:
                    detailPath,

                "aria-label":
                    `${resolvedName} muammosi tafsilotlarini ko‘rish`,
            }

            : {
                "aria-disabled":
                    true,
            };


    // =====================================================
    // CTA
    // =====================================================

    const ctaText =
        rejected
            ? "Tafsilotni ko‘rish"
            : solved
                ? "Yechimni ko‘rish"
                : "Muammoni ko‘rish";


    // =====================================================
    // JSX
    // =====================================================

    return (
        <article
            className="
                animate-fade-in-up
                h-full
            "
        >
            <CardRoot
                {...cardRootProps}

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

                    ${statusData.border}

                    ${
                        hasValidId

                            ? `
                                hover:-translate-y-1.5
                                hover:shadow-cyan-500/10

                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-cyan-400/40
                                focus-visible:ring-offset-2
                                focus-visible:ring-offset-black
                            `

                            : `
                                cursor-default
                                opacity-80
                            `
                    }
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


                {/* =========================================
                    CARD BODY
                ========================================== */}

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
                                        `${fullName} avatar`
                                    }

                                    loading="lazy"

                                    decoding="async"

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

                                                : rejected

                                                    ? "border-gray-500/30"

                                                    : "border-cyan-400/25"
                                        }
                                    `}
                                />

                                <span
                                    aria-hidden="true"

                                    className={`
                                        absolute
                                        -right-1
                                        -top-1

                                        h-3.5
                                        w-3.5

                                        rounded-full

                                        border-2
                                        border-[#0b1020]

                                        ${statusData.dot}
                                    `}
                                />
                            </div>


                            <div
                                className="
                                    min-w-0
                                "
                            >
                                <h4
                                    title={
                                        fullName
                                    }

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
                                        @{resolvedUsername}
                                    </span>

                                    <span
                                        aria-hidden="true"
                                    >
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
                                            aria-hidden="true"
                                        />

                                        {createdLabel}
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
                                aria-hidden="true"
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
                                    aria-hidden="true"
                                />

                                problem ticket
                            </span>

                            {urgent && (
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
                                        aria-hidden="true"
                                    />

                                    Tezkor
                                </span>
                            )}
                        </div>


                        {hasValidId && (
                            <span
                                className="
                                    font-mono
                                    text-xs
                                    font-black
                                    text-gray-700
                                "
                            >
                                #{resolvedId}
                            </span>
                        )}
                    </div>


                    {/* =====================================
                        TITLE
                    ====================================== */}

                    <h3
                        title={
                            resolvedName
                        }

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
                            resolvedName,
                            80
                        )}
                    </h3>


                    {/* =====================================
                        PRIORITY META
                    ====================================== */}

                    {hasPriorityMeta && (
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
                                        aria-hidden="true"
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
                                        aria-hidden="true"
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
                                    aria-hidden="true"

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
                                {visibleLanguages.length > 0 ? (
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
                                        aria-hidden="true"

                                        className="
                                            text-indigo-400
                                        "
                                    />

                                    Taglar
                                </div>

                                {normalizedTechnologies.length > 0 && (
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
                                {visibleTechnologies.length > 0 ? (
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


                    {/* PUSH FOOTER */}

                    <div className="flex-1" />


                    {/* =====================================
                        FOOTER
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
                                        resolvedViews
                                    }

                                    label="Ko‘rishlar"

                                    iconClass="
                                        text-cyan-300
                                    "
                                />

                                <StatBadge
                                    icon={
                                        MessageCircle
                                    }

                                    value={
                                        resolvedResponseCount
                                    }

                                    label="Yechimlar"

                                    iconClass="
                                        text-indigo-300
                                    "
                                />

                                <StatBadge
                                    icon={
                                        Star
                                    }

                                    value={
                                        resolvedStar
                                    }

                                    label="Star"

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

                                    ${
                                        hasValidId
                                            ? "group-hover:translate-x-1"
                                            : ""
                                    }

                                    ${
                                        rejected

                                            ? `
                                                border-gray-400/20
                                                bg-gray-400/[0.07]
                                                text-gray-400
                                            `

                                            : solved

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
                                {
                                    hasValidId
                                        ? ctaText
                                        : "ID mavjud emas"
                                }

                                {hasValidId && (
                                    <ArrowRight
                                        size={14}
                                        aria-hidden="true"
                                    />
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            </CardRoot>
        </article>
    );
};

export default memo(
    ProblemCard
);