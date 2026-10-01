// src/components/problem-detail/ProblemDetailHeader.jsx

import React from "react";

import {
    Link,
} from "react-router-dom";

import {
    CheckCircle2,
    Clock3,
    Code2,
    Coins,
    Eye,
    Loader2,
    Pencil,
    Sparkles,
    Star,
    Trash2,
    XCircle,
    Zap,
} from "lucide-react";

import UserImage
    from "../../assests/userImage.jpeg";

import timeAgo
    from "../../utils/timeAgo";

import {
    getProblemDetailPriorityViewModel,
    hasProblemDetailStar,
    isProblemDetailRejected,
    isProblemDetailSolved,
    normalizeProblemDetailNumber,
    normalizeProblemDetailText,
} from "./problemDetailHelpers";


// =========================================================
// CONFIG
// =========================================================

const BACKEND_URL = (
    process.env.REACT_APP_BACKEND_URL
    ||
    "http://127.0.0.1:8000"
).replace(
    /\/+$/,
    ""
);


const DEFAULT_STACK_COLOR =
    "#64748B";


// =========================================================
// IMAGE URL
// =========================================================

const getImageUrl = (
    image
) => {

    const value =
        normalizeProblemDetailText(
            image
        );


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


    return `${BACKEND_URL}${
        value.startsWith(
            "/"
        )
            ? value
            : `/${value}`
    }`;
};


// =========================================================
// STACK COLOR
// =========================================================

const normalizeStackColor = (
    value
) => {

    if (
        typeof value !==
            "string"
    ) {

        return DEFAULT_STACK_COLOR;
    }


    const color =
        value.trim();


    if (
        /^#[0-9A-Fa-f]{6}$/.test(
            color
        )
    ) {

        return color;
    }


    if (
        /^#[0-9A-Fa-f]{3}$/.test(
            color
        )
    ) {

        const [
            r,
            g,
            b,
        ] = color
            .slice(
                1
            )
            .split(
                ""
            );


        return `#${r}${r}${g}${g}${b}${b}`;
    }


    return DEFAULT_STACK_COLOR;
};


// =========================================================
// COLOR WITH ALPHA
// =========================================================

const withAlpha = (
    color,
    alpha
) => {

    const safeColor =
        normalizeStackColor(
            color
        );


    const safeAlpha =
        /^[0-9A-Fa-f]{2}$/.test(
            String(
                alpha
            )
        )
            ? String(
                alpha
            )
            : "FF";


    return `${safeColor}${safeAlpha}`;
};


// =========================================================
// CREATED LABEL
// =========================================================

const getCreatedLabel = (
    value
) => {

    if (
        !value
    ) {

        return "";
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

        return "";
    }


    try {

        return timeAgo(
            value
        );

    } catch {

        return "";
    }
};


// =========================================================
// STACK TAG
// =========================================================

export const ProblemDetailStackTag = ({
    item,

    type = "language",
}) => {

    if (
        !item
    ) {

        return null;
    }


    // =====================================================
    // STRING FALLBACK
    //
    // "Python"
    //
    // yoki:
    //
    // {
    //     id: 1,
    //     name: "Python",
    //     color: "#3776AB",
    // }
    // =====================================================

    const normalizedItem =
        typeof item ===
            "string"
            ? {
                name:
                    item,
            }
            : item;


    if (
        !normalizedItem
        ||
        typeof normalizedItem !==
            "object"
    ) {

        return null;
    }


    const name =
        normalizeProblemDetailText(
            normalizedItem.name,
            "Noma’lum"
        );


    const color =
        normalizeStackColor(
            normalizedItem.color
        );


    return (

        <span
            title={
                name
            }

            className="
                group/tag

                inline-flex
                max-w-full
                items-center
                gap-2

                rounded-full

                border

                px-3
                py-1.5

                text-xs
                font-black

                transition-all
                duration-300

                hover:-translate-y-0.5
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
                        "14"
                    ),

                boxShadow:
                    `0 8px 22px ${
                        withAlpha(
                            color,
                            "0D"
                        )
                    }`,
            }}
        >

            <span
                aria-hidden="true"

                className="
                    h-2
                    w-2
                    shrink-0

                    rounded-full
                "

                style={{

                    backgroundColor:
                        color,

                    boxShadow:
                        `0 0 9px ${
                            withAlpha(
                                color,
                                "AA"
                            )
                        }`,
                }}
            />


            <span
                className="
                    truncate
                "
            >
                {name}
            </span>


            {type ===
                "technology"
                &&
                normalizedItem
                    ?.category && (

                <span
                    className="
                        hidden

                        rounded-full

                        border
                        border-white/[0.07]

                        bg-black/10

                        px-1.5
                        py-0.5

                        font-mono
                        text-[8px]
                        uppercase
                        tracking-wider

                        opacity-60

                        sm:inline
                    "
                >
                    {
                        normalizedItem
                            .category_display
                        ||
                        normalizedItem
                            .category
                    }
                </span>
            )}

        </span>
    );
};


// =========================================================
// OWNER ACTIONS
// =========================================================

const OwnerActions = ({
    onEdit,

    onDelete,

    isDeleting = false,
}) => {

    return (

        <div
            className="
                inline-flex
                max-w-full
                items-center
                gap-1.5

                rounded-2xl

                border
                border-white/[0.07]

                bg-black/20

                p-1.5

                shadow-lg
                shadow-black/20

                backdrop-blur-xl
            "
        >

            <div
                className="
                    hidden
                    items-center
                    gap-2

                    px-3

                    font-mono
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.15em]
                    text-gray-600

                    lg:flex
                "
            >

                <Sparkles
                    size={13}

                    aria-hidden="true"

                    className="
                        text-cyan-400
                    "
                />

                Owner tools

            </div>


            <span
                aria-hidden="true"

                className="
                    hidden
                    h-6
                    w-px

                    bg-white/[0.07]

                    lg:block
                "
            />


            <button
                type="button"

                onClick={
                    onEdit
                }

                disabled={
                    isDeleting
                }

                aria-label="Muammoni tahrirlash"

                className="
                    inline-flex
                    min-h-[38px]
                    items-center
                    justify-center
                    gap-2

                    rounded-xl

                    border
                    border-transparent

                    px-3.5
                    py-2

                    text-xs
                    font-black
                    text-indigo-300

                    transition-all

                    hover:border-indigo-400/20
                    hover:bg-indigo-500/[0.08]
                    hover:text-indigo-200

                    active:scale-[0.96]

                    disabled:cursor-not-allowed
                    disabled:opacity-40
                "
            >

                <Pencil
                    size={15}
                    aria-hidden="true"
                />

                Tahrirlash

            </button>


            <button
                type="button"

                onClick={
                    onDelete
                }

                disabled={
                    isDeleting
                }

                aria-label="Muammoni o‘chirish"

                className="
                    inline-flex
                    min-h-[38px]
                    items-center
                    justify-center
                    gap-2

                    rounded-xl

                    border
                    border-transparent

                    px-3.5
                    py-2

                    text-xs
                    font-black
                    text-red-400

                    transition-all

                    hover:border-red-400/20
                    hover:bg-red-500/[0.08]
                    hover:text-red-300

                    active:scale-[0.96]

                    disabled:cursor-not-allowed
                    disabled:opacity-40
                "
            >

                {isDeleting ? (

                    <Loader2
                        size={15}

                        aria-hidden="true"

                        className="
                            animate-spin
                        "
                    />

                ) : (

                    <Trash2
                        size={15}
                        aria-hidden="true"
                    />
                )}


                {
                    isDeleting
                        ? "O‘chirilmoqda"
                        : "O‘chirish"
                }

            </button>

        </div>
    );
};


// =========================================================
// PROBLEM DETAIL HEADER
// =========================================================

const ProblemDetailHeader = ({
    problemDetail,

    problemLanguages = [],

    responseCount = 0,

    isOwner = false,

    isDeleting = false,

    onEdit,

    onDelete,
}) => {

    // =====================================================
    // STATUS
    //
    // Header endi statusni o‘zicha interpretatsiya
    // qilmaydi.
    // =====================================================

    const isSolved =
        isProblemDetailSolved(
            problemDetail
        );


    const isRejected =
        isProblemDetailRejected(
            problemDetail
        );


    // =====================================================
    // STAR
    //
    // Canonical:
    //
    // is_starred_by_user
    //
    // Legacy:
    //
    // star_by_user
    // =====================================================

    const starredByUser =
        hasProblemDetailStar(
            problemDetail
        );


    // =====================================================
    // PRIORITY
    //
    // MUHIM:
    //
    // Header va ProblemDetailPriority endi
    // aynan bitta canonical view-modeldan foydalanadi.
    //
    // is_urgent va offered_coins bu component ichida
    // qayta normalize qilinmaydi.
    // =====================================================

    const {
        isUrgent,

        offeredCoins,
    } = getProblemDetailPriorityViewModel(
        problemDetail
    );


    // =====================================================
    // COUNTS
    // =====================================================

    const views =
        normalizeProblemDetailNumber(
            problemDetail
                ?.total_views
        );


    const solutions =
        normalizeProblemDetailNumber(
            responseCount
        );


    // =====================================================
    // USER
    // =====================================================

    const username =
        normalizeProblemDetailText(
            problemDetail
                ?.user
                ?.username
        );


    const firstName =
        normalizeProblemDetailText(
            problemDetail
                ?.user
                ?.first_name
        );


    const lastName =
        normalizeProblemDetailText(
            problemDetail
                ?.user
                ?.last_name
        );


    const fullName =
        `${firstName} ${lastName}`
            .trim();


    const displayName =
        username
        ||
        fullName
        ||
        "Noma’lum foydalanuvchi";


    const avatar =
        getImageUrl(
            problemDetail
                ?.user
                ?.image
        );


    const createdLabel =
        getCreatedLabel(
            problemDetail
                ?.created_at
        );


    // =====================================================
    // STATUS UI
    // =====================================================

    const statusData =
        isRejected
            ? {

                label:
                    "Rad etilgan",

                Icon:
                    XCircle,

                className:
                    `
                        border-gray-400/25
                        bg-gray-500/10
                        text-gray-400
                    `,
            }

            : isSolved
                ? {

                    label:
                        "Yechilgan",

                    Icon:
                        CheckCircle2,

                    className:
                        `
                            border-green-400/30
                            bg-green-500/10
                            text-green-300
                        `,
                }

                : {

                    label:
                        "Yechilmagan",

                    Icon:
                        Clock3,

                    className:
                        `
                            border-red-400/30
                            bg-red-500/10
                            text-red-300
                        `,
                };


    const StatusIcon =
        statusData.Icon;


    // =====================================================
    // JSX
    // =====================================================

    return (

        <header>

            {/* =============================================
                STATUS BADGES
            ============================================== */}

            <div
                className="
                    mb-5

                    flex
                    flex-wrap
                    items-center
                    gap-2
                "
            >

                {/* =========================================
                    PROBLEM STATUS
                ========================================== */}

                <span
                    className={`
                        inline-flex
                        items-center
                        gap-2

                        rounded-full

                        border

                        px-4
                        py-2

                        text-xs
                        font-black
                        uppercase
                        tracking-[0.14em]

                        ${statusData.className}
                    `}
                >

                    <StatusIcon
                        size={14}
                        aria-hidden="true"
                    />

                    {
                        statusData.label
                    }

                </span>


                {/* =========================================
                    CURRENT USER STAR
                ========================================== */}

                {starredByUser && (

                    <span
                        className="
                            inline-flex
                            items-center
                            gap-2

                            rounded-full

                            border
                            border-yellow-400/30

                            bg-yellow-400/10

                            px-4
                            py-2

                            text-xs
                            font-black
                            uppercase
                            tracking-[0.14em]
                            text-yellow-300
                        "
                    >

                        <Star
                            size={13}

                            aria-hidden="true"

                            className="
                                fill-yellow-300
                            "
                        />

                        Siz star berdingiz

                    </span>
                )}


                {/* =========================================
                    URGENT
                ========================================== */}

                {isUrgent && (

                    <span
                        className="
                            inline-flex
                            items-center
                            gap-2

                            rounded-full

                            border
                            border-amber-400/30

                            bg-amber-500/10

                            px-4
                            py-2

                            text-xs
                            font-black
                            uppercase
                            tracking-[0.14em]
                            text-amber-300
                        "
                    >

                        <Zap
                            size={13}
                            aria-hidden="true"
                        />

                        Tezkor

                    </span>
                )}


                {/* =========================================
                    FCOIN BOUNTY
                ========================================== */}

                {offeredCoins > 0 && (

                    <span
                        className="
                            inline-flex
                            items-center
                            gap-2

                            rounded-full

                            border
                            border-yellow-400/30

                            bg-yellow-400/10

                            px-4
                            py-2

                            text-xs
                            font-black
                            uppercase
                            tracking-[0.14em]
                            text-yellow-300
                        "
                    >

                        <Coins
                            size={14}
                            aria-hidden="true"
                        />

                        {offeredCoins} FCoin

                    </span>
                )}

            </div>


            {/* =============================================
                LANGUAGES
            ============================================== */}

            <div
                className="
                    mb-4

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
                        gap-1.5

                        rounded-full

                        border
                        border-white/[0.06]

                        bg-white/[0.025]

                        px-2.5
                        py-1.5

                        font-mono
                        text-[9px]
                        font-black
                        uppercase
                        tracking-[0.16em]
                        text-gray-600
                    "
                >

                    <Code2
                        size={12}
                        aria-hidden="true"
                    />

                    Til

                </span>


                {Array.isArray(
                    problemLanguages
                )
                &&
                problemLanguages.length > 0 ? (

                    problemLanguages.map(
                        (
                            language,
                            index
                        ) => (

                            <ProblemDetailStackTag
                                key={
                                    language?.id
                                    ??
                                    language?.name
                                    ??
                                    (
                                        typeof language ===
                                            "string"
                                            ? language
                                            : `language-${index}`
                                    )
                                }

                                item={
                                    language
                                }

                                type="language"
                            />
                        )
                    )

                ) : (

                    <span
                        className="
                            rounded-full

                            border
                            border-white/[0.06]

                            bg-white/[0.025]

                            px-3
                            py-1.5

                            text-xs
                            font-bold
                            text-gray-600
                        "
                    >
                        Til belgilanmagan
                    </span>
                )}

            </div>


            {/* =============================================
                TITLE + OWNER
            ============================================== */}

            <div
                className="
                    mb-6

                    flex
                    flex-col
                    gap-5

                    xl:flex-row
                    xl:items-start
                    xl:justify-between
                "
            >

                <div
                    className="
                        min-w-0
                        flex-1
                    "
                >

                    <p
                        className="
                            mb-2

                            font-mono
                            text-[11px]
                            font-black
                            uppercase
                            tracking-[0.3em]
                            text-gray-600
                        "
                    >
                        fsociety://problem/
                        {
                            problemDetail?.id
                            ??
                            "unknown"
                        }
                    </p>


                    <h1
                        className="
                            break-words

                            text-3xl
                            font-black
                            leading-tight
                            text-white

                            md:text-4xl

                            lg:text-5xl
                        "
                    >
                        {
                            normalizeProblemDetailText(
                                problemDetail?.problem,
                                "Nomsiz muammo"
                            )
                        }
                    </h1>

                </div>


                {isOwner && (

                    <div
                        className="
                            shrink-0
                        "
                    >

                        <OwnerActions
                            onEdit={
                                onEdit
                            }

                            onDelete={
                                onDelete
                            }

                            isDeleting={
                                isDeleting
                            }
                        />

                    </div>
                )}

            </div>


            {/* =============================================
                AUTHOR
            ============================================== */}

            <div
                className="
                    mb-7

                    flex
                    flex-col
                    gap-4

                    rounded-3xl

                    border
                    border-white/10

                    bg-white/[0.035]

                    p-4

                    text-sm
                    text-gray-400

                    sm:flex-row
                    sm:items-center
                "
            >

                {/* =========================================
                    AVATAR
                ========================================== */}

                <img
                    src={
                        avatar
                    }

                    loading="lazy"

                    decoding="async"

                    onError={(
                        event
                    ) => {

                        event
                            .currentTarget
                            .onerror =
                            null;


                        event
                            .currentTarget
                            .src =
                            UserImage;
                    }}

                    className="
                        h-12
                        w-12
                        shrink-0

                        rounded-2xl

                        border
                        border-cyan-400/20

                        object-cover
                    "

                    alt={
                        `${displayName} avatar`
                    }
                />


                {/* =========================================
                    AUTHOR CONTENT
                ========================================== */}

                <div
                    className="
                        min-w-0
                        flex-1
                    "
                >

                    {username ? (

                        <Link
                            to={`/${username}/profile/`}

                            className="
                                block
                                truncate

                                text-base
                                font-black
                                text-white

                                transition

                                hover:text-cyan-300
                            "
                        >
                            @{username}
                        </Link>

                    ) : (

                        <p
                            className="
                                text-base
                                font-black
                                text-white
                            "
                        >
                            {
                                fullName
                                ||
                                "Noma’lum foydalanuvchi"
                            }
                        </p>
                    )}


                    {fullName
                        &&
                        username && (

                        <p
                            className="
                                mt-0.5
                                truncate

                                text-[11px]
                                font-semibold
                                text-gray-600
                            "
                        >
                            {fullName}
                        </p>
                    )}


                    {/* =====================================
                        META
                    ====================================== */}

                    <div
                        className="
                            mt-1

                            flex
                            flex-wrap
                            items-center
                            gap-x-3
                            gap-y-1

                            text-xs
                            font-bold
                            text-gray-500
                        "
                    >

                        {createdLabel && (

                            <span>
                                {createdLabel}
                                {" "}so‘ralgan
                            </span>
                        )}


                        {createdLabel && (

                            <span
                                aria-hidden="true"

                                className="
                                    hidden
                                    text-gray-700

                                    sm:inline
                                "
                            >
                                /
                            </span>
                        )}


                        <span
                            className="
                                inline-flex
                                items-center
                                gap-1
                            "
                        >

                            <Eye
                                size={12}
                                aria-hidden="true"
                            />

                            {views}

                            {" "}marta ko‘rilgan

                        </span>


                        <span
                            aria-hidden="true"

                            className="
                                hidden
                                text-gray-700

                                sm:inline
                            "
                        >
                            /
                        </span>


                        <span
                            className="
                                text-cyan-400
                            "
                        >
                            {solutions}
                            {" "}ta yechim
                        </span>

                    </div>

                </div>

            </div>

        </header>
    );
};


export default React.memo(
    ProblemDetailHeader
);