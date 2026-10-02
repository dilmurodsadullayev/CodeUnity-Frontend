// src/components/fcoin-history/FCoinHistoryItem.jsx

import React, {
    useMemo,
} from "react";

import {
    motion,
} from "framer-motion";

import {
    ArrowDownRight,
    ArrowUpRight,
    Bug,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Coins,
    Crown,
    Gift,
    Lightbulb,
    MessageCircle,
    MessageSquareText,
    Rocket,
    Route,
    ShieldCheck,
    Sparkles,
    Star,
    TerminalSquare,
    WalletCards,
} from "lucide-react";

import FCoinIcon from "../../assests/coin/fcoin.png";

import formatPrettyDate from "../../utils/formatPrettyDate";

import timeAgo from "../../utils/timeAgo";


import {
    formatCoinDate,
    getCoinAmountBadgeClass,
    getCoinDescription,
    getCoinDirection,
    getCoinDisplayAmount,
    getCoinSource,
    getCoinStatusLabel,
    getCoinTargetTitle,
    getCoinTitle,
    getCoinVisual,
} from "./coinHistoryHelpers";


// =========================================================
// SOURCE ICON
// =========================================================

const getSourceIcon = (
    source
) => {
    const iconMap = {
        // =================================================
        // PROBLEMS
        // =================================================

        problem_upload:
            TerminalSquare,

        problem_response:
            MessageSquareText,

        problem_response_star:
            Star,

        best_solution:
            Crown,

        problem_bounty:
            Coins,


        // =================================================
        // PROJECTS
        // =================================================

        project_upload:
            Rocket,

        project_star_giver:
            Star,

        project_star_owner:
            Star,


        // =================================================
        // POSTS / COMMENTS
        // =================================================

        post_upload:
            MessageSquareText,

        post_comment:
            MessageCircle,

        comment_admin_like:
            ShieldCheck,


        // =================================================
        // ROADMAP
        // =================================================

        roadmap_like:
            Route,


        // =================================================
        // FEEDBACK
        // =================================================

        feedback_approved:
            CheckCircle2,

        feedback_bug:
            Bug,

        feedback_suggestion:
            Lightbulb,

        feedback_praise:
            Sparkles,

        feedback_other:
            MessageSquareText,


        // =================================================
        // DAILY LOGIN
        // =================================================

        daily_login:
            CalendarDays,


        // =================================================
        // PROMOTION
        // =================================================

        promotion_purchase:
            Rocket,


        // =================================================
        // ADMIN
        // =================================================

        admin_coin_grant:
            Gift,
    };


    return (
        iconMap[
            source
        ]
        ||
        WalletCards
    );
};


// =========================================================
// ITEM
// =========================================================

const FCoinHistoryItem = ({
    item,
    index = 0,
}) => {
    // =====================================================
    // DATA
    // =====================================================

    const direction =
        getCoinDirection(
            item
        );


    const source =
        getCoinSource(
            item
        );


    const visual =
        getCoinVisual(
            item
        );


    const title =
        getCoinTitle(
            item
        );


    const description =
        getCoinDescription(
            item
        );


    const statusLabel =
        getCoinStatusLabel(
            item
        );


    const targetTitle =
        getCoinTargetTitle(
            item
        );


    const displayAmount =
        getCoinDisplayAmount(
            item
        );


    // =====================================================
    // DATE
    // =====================================================

    const formattedDate =
    item?.created_at
        ? formatPrettyDate(
            item.created_at
        )
        : "";

    const relativeDate =
        item?.created_at
            ? timeAgo(
                item.created_at
            )
            : "";


    // =====================================================
    // ICON
    // =====================================================

    const SourceIcon =
        useMemo(
            () => {
                return (
                    getSourceIcon(
                        source
                    )
                );
            },
            [
                source,
            ]
        );


    const DirectionIcon =
        direction === "spent"
            ? ArrowDownRight
            : ArrowUpRight;


    // =====================================================
    // ACCESSIBILITY
    // =====================================================

    const ariaLabel =
        `${title}. ${displayAmount} FCoin`;


    return (
        <motion.article
            initial={{
                opacity: 0,
                y: 16,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                duration: 0.32,

                delay:
                    Math.min(
                        index * 0.035,
                        0.25
                    ),
            }}
            whileHover={{
                y: -2,
            }}
            aria-label={
                ariaLabel
            }
            className="
                group

                relative
                overflow-hidden

                rounded-[24px]

                border
                border-white/[0.065]

                bg-[#0d1117]

                p-4

                shadow-[0_15px_50px_rgba(0,0,0,0.24)]

                transition-colors
                duration-200

                hover:border-white/[0.12]
                hover:bg-[#10161d]

                sm:p-5
            "
        >
            {/* =============================================
                SOURCE GLOW
            ============================================== */}

            <div
                aria-hidden="true"
                className={`
                    pointer-events-none

                    absolute
                    inset-0

                    bg-gradient-to-r

                    ${visual.glow}

                    via-transparent
                    to-transparent

                    opacity-60

                    transition-opacity
                    duration-300

                    group-hover:opacity-100
                `}
            />


            {/* =============================================
                LEFT ACCENT
            ============================================== */}

            <div
                aria-hidden="true"
                className={`
                    absolute
                    bottom-4
                    left-0
                    top-4

                    w-[2px]

                    rounded-full

                    ${
                        direction === "spent"
                            ? "bg-rose-400/60"
                            : "bg-emerald-400/60"
                    }
                `}
            />


            {/* =============================================
                CONTENT
            ============================================== */}

            <div
                className="
                    relative
                    z-10

                    flex
                    flex-col

                    gap-4

                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >
                {/* =========================================
                    LEFT
                ========================================== */}

                <div
                    className="
                        flex
                        min-w-0

                        items-start

                        gap-3.5

                        sm:items-center
                    "
                >
                    {/* =====================================
                        ICON
                    ====================================== */}

                    <div
                        className={`
                            relative

                            flex
                            h-12
                            w-12

                            shrink-0

                            items-center
                            justify-center

                            rounded-2xl

                            border

                            ${visual.iconBox}

                            sm:h-14
                            sm:w-14
                        `}
                    >
                        <SourceIcon
                            size={21}
                            strokeWidth={2}
                        />


                        <span
                            className="
                                absolute
                                -bottom-1
                                -right-1

                                flex
                                h-5
                                w-5

                                items-center
                                justify-center

                                rounded-full

                                border
                                border-[#0d1117]

                                bg-[#161b22]

                                shadow-lg
                            "
                        >
                            <img
                                src={
                                    FCoinIcon
                                }
                                alt=""
                                aria-hidden="true"
                                className="
                                    h-3.5
                                    w-3.5

                                    object-contain
                                "
                            />
                        </span>
                    </div>


                    {/* =====================================
                        TEXT
                    ====================================== */}

                    <div
                        className="
                            min-w-0
                            flex-1
                        "
                    >
                        {/* =================================
                            BADGES
                        ================================== */}

                        <div
                            className="
                                mb-2

                                flex
                                flex-wrap

                                items-center

                                gap-1.5
                            "
                        >
                            <span
                                className={`
                                    inline-flex
                                    items-center

                                    rounded-full

                                    border

                                    px-2.5
                                    py-1

                                    font-mono

                                    text-[9px]
                                    font-black

                                    uppercase

                                    tracking-[0.13em]

                                    ${visual.badge}
                                `}
                            >
                                {
                                    visual.label
                                }
                            </span>


                            {
                                statusLabel
                                &&
                                statusLabel !==
                                    visual.label
                                &&
                                (
                                    <span
                                        className="
                                            inline-flex
                                            items-center

                                            rounded-full

                                            border
                                            border-white/[0.06]

                                            bg-white/[0.025]

                                            px-2.5
                                            py-1

                                            font-mono

                                            text-[9px]
                                            font-bold

                                            uppercase

                                            tracking-[0.12em]

                                            text-gray-500
                                        "
                                    >
                                        {
                                            statusLabel
                                        }
                                    </span>
                                )
                            }
                        </div>


                        {/* =================================
                            TITLE
                        ================================== */}

                        <h3
                            className="
                                truncate

                                text-sm
                                font-black

                                leading-6

                                text-white

                                sm:text-[15px]
                            "
                            title={
                                title
                            }
                        >
                            {
                                title
                            }
                        </h3>


                        {/* =================================
                            DESCRIPTION
                        ================================== */}

                        {
                            description
                            &&
                            (
                                <p
                                    className="
                                        mt-1

                                        line-clamp-2

                                        max-w-2xl

                                        text-xs
                                        font-medium

                                        leading-5

                                        text-gray-500

                                        sm:text-[13px]
                                    "
                                >
                                    {
                                        description
                                    }
                                </p>
                            )
                        }


                        {/* =================================
                            META
                        ================================== */}

                        <div
                            className="
                                mt-2.5

                                flex
                                flex-wrap

                                items-center

                                gap-x-3
                                gap-y-1.5

                                text-[10px]
                                font-semibold

                                text-gray-600
                            "
                        >
                            {/* =============================
                                TARGET
                            ============================== */}

                            {
                                targetTitle
                                &&
                                (
                                    <span
                                        className="
                                            inline-flex
                                            min-w-0

                                            items-center

                                            gap-1.5
                                        "
                                    >
                                        <TerminalSquare
                                            size={12}
                                            className="
                                                shrink-0
                                                text-gray-700
                                            "
                                        />

                                        <span
                                            className="
                                                max-w-[220px]
                                                truncate
                                            "
                                            title={
                                                targetTitle
                                            }
                                        >
                                            {
                                                targetTitle
                                            }
                                        </span>
                                    </span>
                                )
                            }


                            {/* =============================
                                RELATIVE TIME
                            ============================== */}

                            {
                                relativeDate
                                &&
                                (
                                    <span
                                        className="
                                            inline-flex
                                            items-center

                                            gap-1.5

                                            text-gray-500
                                        "
                                        title={
                                            formattedDate
                                        }
                                    >
                                        <Clock3
                                            size={12}
                                            className="
                                                text-indigo-400/70
                                            "
                                        />

                                        {
                                            relativeDate
                                        }
                                    </span>
                                )
                            }


                            {/* =============================
                                FULL DATE
                            ============================== */}

                            {
                                formattedDate
                                &&
                                (
                                    <span
                                        className="
                                            hidden

                                            items-center

                                            gap-1.5

                                            text-gray-700

                                            lg:inline-flex
                                        "
                                    >
                                        <CalendarDays
                                            size={12}
                                        />

                                        {
                                            formattedDate
                                        }
                                    </span>
                                )
                            }
                        </div>
                    </div>
                </div>


                {/* =========================================
                    RIGHT / AMOUNT
                ========================================== */}

                <div
                    className="
                        flex
                        shrink-0

                        items-center
                        justify-between

                        gap-3

                        border-t
                        border-white/[0.05]

                        pt-4

                        sm:border-l
                        sm:border-t-0

                        sm:pl-5
                        sm:pt-0
                    "
                >
                    {/* =====================================
                        DIRECTION
                    ====================================== */}

                    <div
                        className={`
                            flex
                            h-9
                            w-9

                            shrink-0

                            items-center
                            justify-center

                            rounded-xl

                            border

                            ${
                                direction === "spent"
                                    ? (
                                        "border-rose-400/15 "
                                        +
                                        "bg-rose-500/[0.06] "
                                        +
                                        "text-rose-300"
                                    )
                                    : (
                                        "border-emerald-400/15 "
                                        +
                                        "bg-emerald-500/[0.06] "
                                        +
                                        "text-emerald-300"
                                    )
                            }
                        `}
                    >
                        <DirectionIcon
                            size={16}
                            strokeWidth={2.3}
                        />
                    </div>


                    {/* =====================================
                        AMOUNT
                    ====================================== */}

                    <div
                        className="
                            text-right
                        "
                    >
                        <div
                            className={`
                                inline-flex
                                items-center

                                gap-2

                                rounded-xl

                                border

                                px-3
                                py-2

                                ${getCoinAmountBadgeClass(
                                    item
                                )}
                            `}
                        >
                            <span
                                className="
                                    font-mono

                                    text-base
                                    font-black

                                    tracking-tight

                                    sm:text-lg
                                "
                            >
                                {
                                    displayAmount
                                }
                            </span>


                            <img
                                src={
                                    FCoinIcon
                                }
                                alt="FCoin"
                                className="
                                    h-5
                                    w-5

                                    object-contain

                                    drop-shadow-[0_0_6px_rgba(250,204,21,0.25)]
                                "
                            />
                        </div>


                        <p
                            className="
                                mt-1.5

                                font-mono

                                text-[8px]
                                font-black

                                uppercase

                                tracking-[0.15em]

                                text-gray-700
                            "
                        >
                            {
                                direction === "spent"
                                    ? "Spent"
                                    : "Earned"
                            }
                        </p>
                    </div>
                </div>
            </div>
        </motion.article>
    );
};


// =========================================================
// EXPORT
// =========================================================

export default React.memo(
    FCoinHistoryItem
);