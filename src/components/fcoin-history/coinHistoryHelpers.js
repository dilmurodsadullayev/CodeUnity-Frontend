// src/components/fcoin-history/coinHistoryHelpers.js


// =========================================================
// SAFE NUMBER
// =========================================================

export const safeNumber = (
    value,
    fallback = 0
) => {
    const number =
        Number(
            value
        );


    return (
        Number.isFinite(
            number
        )
            ? number
            : fallback
    );
};


// =========================================================
// SAFE STRING
// =========================================================

export const safeString = (
    value,
    fallback = ""
) => {
    if (
        value === null
        ||
        value === undefined
    ) {
        return fallback;
    }


    return String(
        value
    );
};


// =========================================================
// SAFE OBJECT
// =========================================================

export const safeObject = (
    value
) => {
    if (
        value
        &&
        typeof value === "object"
        &&
        !Array.isArray(
            value
        )
    ) {
        return value;
    }


    return {};
};


// =========================================================
// DIRECTION
// =========================================================

export const getCoinDirection = (
    item
) => {
    const direction =
        safeString(
            item?.direction
        )
            .trim()
            .toLowerCase();


    if (
        [
            "spent",
            "spend",
            "expense",
            "debit",
        ].includes(
            direction
        )
    ) {
        return "spent";
    }


    if (
        [
            "earned",
            "earn",
            "income",
            "credit",
        ].includes(
            direction
        )
    ) {
        return "earned";
    }


    return (
        safeNumber(
            item?.amount
        ) < 0
            ? "spent"
            : "earned"
    );
};


// =========================================================
// DISPLAY AMOUNT
// =========================================================

export const getCoinDisplayAmount = (
    item
) => {
    const backendValue =
        safeString(
            item?.display_amount
        ).trim();


    if (
        backendValue
    ) {
        return backendValue;
    }


    const absoluteAmount =
        Math.abs(
            safeNumber(
                item?.absolute_amount
                ??
                item?.amount,
                0
            )
        );


    return (
        getCoinDirection(
            item
        ) === "spent"
            ? `-${absoluteAmount}`
            : `+${absoluteAmount}`
    );
};


// =========================================================
// SOURCE
// =========================================================

export const getCoinSource = (
    item
) => {
    const metadata =
        safeObject(
            item?.metadata
        );


    const source =
        metadata?.source
        ||
        item?.status
        ||
        "other";


    return safeString(
        source,
        "other"
    )
        .trim()
        .toLowerCase();
};


// =========================================================
// SOURCE VISUALS
// =========================================================

const SOURCE_VISUALS = {
    // =====================================================
    // PROBLEMS
    // =====================================================

    problem_upload: {
        label:
            "Problem",

        tone:
            "indigo",

        iconBox:
            "border-indigo-400/20 bg-indigo-500/10 text-indigo-300",

        badge:
            "border-indigo-400/20 bg-indigo-500/[0.07] text-indigo-300",

        glow:
            "from-indigo-500/[0.12]",
    },


    problem_response: {
        label:
            "Yechim",

        tone:
            "cyan",

        iconBox:
            "border-cyan-400/20 bg-cyan-500/10 text-cyan-300",

        badge:
            "border-cyan-400/20 bg-cyan-500/[0.07] text-cyan-300",

        glow:
            "from-cyan-500/[0.12]",
    },


    problem_response_star: {
        label:
            "Yechim star",

        tone:
            "yellow",

        iconBox:
            "border-yellow-400/20 bg-yellow-500/10 text-yellow-300",

        badge:
            "border-yellow-400/20 bg-yellow-500/[0.07] text-yellow-300",

        glow:
            "from-yellow-500/[0.12]",
    },


    best_solution: {
        label:
            "Eng yaxshi yechim",

        tone:
            "emerald",

        iconBox:
            "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",

        badge:
            "border-emerald-400/20 bg-emerald-500/[0.07] text-emerald-300",

        glow:
            "from-emerald-500/[0.12]",
    },


    problem_bounty: {
        label:
            "Problem bounty",

        tone:
            "orange",

        iconBox:
            "border-orange-400/20 bg-orange-500/10 text-orange-300",

        badge:
            "border-orange-400/20 bg-orange-500/[0.07] text-orange-300",

        glow:
            "from-orange-500/[0.12]",
    },


    problem_bounty_reserve: {
        label:
            "Bounty",

        tone:
            "orange",

        iconBox:
            "border-orange-400/20 bg-orange-500/10 text-orange-300",

        badge:
            "border-orange-400/20 bg-orange-500/[0.07] text-orange-300",

        glow:
            "from-orange-500/[0.12]",
    },


    problem_bounty_refund: {
        label:
            "Bounty refund",

        tone:
            "emerald",

        iconBox:
            "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",

        badge:
            "border-emerald-400/20 bg-emerald-500/[0.07] text-emerald-300",

        glow:
            "from-emerald-500/[0.12]",
    },


    problem_bounty_payout: {
        label:
            "Bounty reward",

        tone:
            "emerald",

        iconBox:
            "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",

        badge:
            "border-emerald-400/20 bg-emerald-500/[0.07] text-emerald-300",

        glow:
            "from-emerald-500/[0.12]",
    },


    // =====================================================
    // PROJECTS
    // =====================================================

    project_upload: {
        label:
            "Project",

        tone:
            "blue",

        iconBox:
            "border-blue-400/20 bg-blue-500/10 text-blue-300",

        badge:
            "border-blue-400/20 bg-blue-500/[0.07] text-blue-300",

        glow:
            "from-blue-500/[0.12]",
    },


    project_star_giver: {
        label:
            "Project star",

        tone:
            "yellow",

        iconBox:
            "border-yellow-400/20 bg-yellow-500/10 text-yellow-300",

        badge:
            "border-yellow-400/20 bg-yellow-500/[0.07] text-yellow-300",

        glow:
            "from-yellow-500/[0.12]",
    },


    project_star_owner: {
        label:
            "Project star",

        tone:
            "yellow",

        iconBox:
            "border-yellow-400/20 bg-yellow-500/10 text-yellow-300",

        badge:
            "border-yellow-400/20 bg-yellow-500/[0.07] text-yellow-300",

        glow:
            "from-yellow-500/[0.12]",
    },


    // =====================================================
    // POSTS / COMMENTS
    // =====================================================

    post_upload: {
        label:
            "Post",

        tone:
            "purple",

        iconBox:
            "border-purple-400/20 bg-purple-500/10 text-purple-300",

        badge:
            "border-purple-400/20 bg-purple-500/[0.07] text-purple-300",

        glow:
            "from-purple-500/[0.12]",
    },


    post_comment: {
        label:
            "Comment",

        tone:
            "sky",

        iconBox:
            "border-sky-400/20 bg-sky-500/10 text-sky-300",

        badge:
            "border-sky-400/20 bg-sky-500/[0.07] text-sky-300",

        glow:
            "from-sky-500/[0.12]",
    },


    comment_admin_like: {
        label:
            "Admin like",

        tone:
            "emerald",

        iconBox:
            "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",

        badge:
            "border-emerald-400/20 bg-emerald-500/[0.07] text-emerald-300",

        glow:
            "from-emerald-500/[0.12]",
    },


    // =====================================================
    // ROADMAP
    // =====================================================

    roadmap_like: {
        label:
            "Roadmap",

        tone:
            "pink",

        iconBox:
            "border-pink-400/20 bg-pink-500/10 text-pink-300",

        badge:
            "border-pink-400/20 bg-pink-500/[0.07] text-pink-300",

        glow:
            "from-pink-500/[0.12]",
    },


    // =====================================================
    // FEEDBACK
    // =====================================================

    feedback_approved: {
        label:
            "Feedback",

        tone:
            "violet",

        iconBox:
            "border-violet-400/20 bg-violet-500/10 text-violet-300",

        badge:
            "border-violet-400/20 bg-violet-500/[0.07] text-violet-300",

        glow:
            "from-violet-500/[0.12]",
    },


    feedback_bug: {
        label:
            "Bug",

        tone:
            "red",

        iconBox:
            "border-red-400/20 bg-red-500/10 text-red-300",

        badge:
            "border-red-400/20 bg-red-500/[0.07] text-red-300",

        glow:
            "from-red-500/[0.12]",
    },


    feedback_suggestion: {
        label:
            "Taklif",

        tone:
            "amber",

        iconBox:
            "border-amber-400/20 bg-amber-500/10 text-amber-300",

        badge:
            "border-amber-400/20 bg-amber-500/[0.07] text-amber-300",

        glow:
            "from-amber-500/[0.12]",
    },


    feedback_praise: {
        label:
            "Maqtov",

        tone:
            "emerald",

        iconBox:
            "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",

        badge:
            "border-emerald-400/20 bg-emerald-500/[0.07] text-emerald-300",

        glow:
            "from-emerald-500/[0.12]",
    },


    feedback_other: {
        label:
            "Feedback",

        tone:
            "indigo",

        iconBox:
            "border-indigo-400/20 bg-indigo-500/10 text-indigo-300",

        badge:
            "border-indigo-400/20 bg-indigo-500/[0.07] text-indigo-300",

        glow:
            "from-indigo-500/[0.12]",
    },


    // =====================================================
    // DAILY LOGIN
    // =====================================================

    daily_login: {
        label:
            "Daily Login",

        tone:
            "emerald",

        iconBox:
            "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",

        badge:
            "border-emerald-400/20 bg-emerald-500/[0.07] text-emerald-300",

        glow:
            "from-emerald-500/[0.12]",
    },


    // =====================================================
    // PROMOTION
    // =====================================================

    promotion_purchase: {
        label:
            "Promotion",

        tone:
            "orange",

        iconBox:
            "border-orange-400/20 bg-orange-500/10 text-orange-300",

        badge:
            "border-orange-400/20 bg-orange-500/[0.07] text-orange-300",

        glow:
            "from-orange-500/[0.12]",
    },


    // =====================================================
    // ADMIN
    // =====================================================

    admin_coin_grant: {
        label:
            "Admin reward",

        tone:
            "amber",

        iconBox:
            "border-amber-400/20 bg-amber-500/10 text-amber-300",

        badge:
            "border-amber-400/20 bg-amber-500/[0.07] text-amber-300",

        glow:
            "from-amber-500/[0.12]",
    },
};


// =========================================================
// DEFAULT EARNED
// =========================================================

const DEFAULT_EARNED_VISUAL = {
    label:
        "FCoin reward",

    tone:
        "emerald",

    iconBox:
        "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",

    badge:
        "border-emerald-400/20 bg-emerald-500/[0.07] text-emerald-300",

    glow:
        "from-emerald-500/[0.10]",
};


// =========================================================
// DEFAULT SPENT
// =========================================================

const DEFAULT_SPENT_VISUAL = {
    label:
        "FCoin sarfi",

    tone:
        "rose",

    iconBox:
        "border-rose-400/20 bg-rose-500/10 text-rose-300",

    badge:
        "border-rose-400/20 bg-rose-500/[0.07] text-rose-300",

    glow:
        "from-rose-500/[0.10]",
};


// =========================================================
// GET VISUAL
// =========================================================

export const getCoinVisual = (
    item
) => {
    const source =
        getCoinSource(
            item
        );


    const configured =
        SOURCE_VISUALS[
            source
        ];


    if (
        configured
    ) {
        return {
            source,
            ...configured,
        };
    }


    return {
        source,

        ...(
            getCoinDirection(
                item
            ) === "spent"
                ? DEFAULT_SPENT_VISUAL
                : DEFAULT_EARNED_VISUAL
        ),
    };
};


// =========================================================
// TITLE
// =========================================================

export const getCoinTitle = (
    item
) => {
    const title =
        safeString(
            item?.title
        ).trim();


    if (
        title
    ) {
        return title;
    }


    return (
        getCoinVisual(
            item
        ).label
    );
};


// =========================================================
// DESCRIPTION
//
// Yangi backend:
// description -> source of truth.
//
// reason faqat legacy fallback.
// Technical reason hech qachon userga chiqarilmaydi.
// =========================================================

export const getCoinDescription = (
    item
) => {
    const description =
        safeString(
            item?.description
        ).trim();


    if (
        description
    ) {
        return description;
    }


    const legacyReason =
        safeString(
            item?.reason
        ).trim();


    const looksTechnical =
        legacyReason.includes(
            "|"
        )
        ||
        legacyReason.includes(
            "_id="
        )
        ||
        legacyReason.includes(
            "problem_id="
        )
        ||
        legacyReason.includes(
            "project_id="
        )
        ||
        legacyReason.includes(
            "response_id="
        )
        ||
        legacyReason.includes(
            "solution_id="
        )
        ||
        legacyReason.includes(
            "campaign="
        )
        ||
        legacyReason.includes(
            "target="
        );


    if (
        legacyReason
        &&
        !looksTechnical
    ) {
        return legacyReason;
    }


    return (
        getCoinDirection(
            item
        ) === "spent"
            ? "FCoin balansidan sarflandi."
            : "FCoin balansiga qo‘shildi."
    );
};


// =========================================================
// STATUS LABEL
// =========================================================

export const getCoinStatusLabel = (
    item
) => {
    const label =
        safeString(
            item?.status_label
        ).trim();


    if (
        label
    ) {
        return label;
    }


    return (
        getCoinVisual(
            item
        ).label
    );
};


// =========================================================
// ITEM KEY
// =========================================================

export const getCoinItemKey = (
    item,
    index = 0
) => {
    if (
        item?.event_key
    ) {
        return String(
            item.event_key
        );
    }


    if (
        item?.id !== null
        &&
        item?.id !== undefined
    ) {
        return (
            `coin-${item.id}`
        );
    }


    return (
        `coin-fallback-${index}`
    );
};


// =========================================================
// TARGET TITLE
// =========================================================

export const getCoinTargetTitle = (
    item
) => {
    const target =
        safeObject(
            item?.target
        );


    const metadata =
        safeObject(
            item?.metadata
        );


    const candidates = [
        target?.title,
        target?.name,
        target?.label,

        metadata?.target_title,
        metadata?.project_name,
        metadata?.problem_title,
        metadata?.post_title,
        metadata?.feedback_title,
        metadata?.roadmap_title,
    ];


    const found =
        candidates.find(
            (
                value
            ) => {
                return Boolean(
                    safeString(
                        value
                    ).trim()
                );
            }
        );


    return safeString(
        found
    ).trim();
};


// =========================================================
// HISTORY RANGE
// =========================================================

export const getCoinHistoryRange = (
    {
        count,
        currentPage,
        pageSize,
        currentItemsCount,
    }
) => {
    const normalizedCount =
        Math.max(
            0,
            Math.trunc(
                safeNumber(
                    count,
                    0
                )
            )
        );


    const normalizedPage =
        Math.max(
            1,
            Math.trunc(
                safeNumber(
                    currentPage,
                    1
                )
            )
        );


    const normalizedPageSize =
        Math.max(
            1,
            Math.trunc(
                safeNumber(
                    pageSize,
                    15
                )
            )
        );


    const itemCount =
        Math.max(
            0,
            Math.trunc(
                safeNumber(
                    currentItemsCount,
                    0
                )
            )
        );


    if (
        normalizedCount === 0
        ||
        itemCount === 0
    ) {
        return {
            from:
                0,

            to:
                0,

            count:
                normalizedCount,
        };
    }


    const from =
        (
            (
                normalizedPage
                -
                1
            )
            *
            normalizedPageSize
        )
        +
        1;


    const to =
        Math.min(
            (
                from
                +
                itemCount
                -
                1
            ),
            normalizedCount
        );


    return {
        from,

        to,

        count:
            normalizedCount,
    };
};


// =========================================================
// PAGINATION PAGES
// =========================================================

export const getCoinPaginationPages = (
    currentPage,
    totalPages
) => {
    const current =
        Math.max(
            1,
            Math.trunc(
                safeNumber(
                    currentPage,
                    1
                )
            )
        );


    const total =
        Math.max(
            0,
            Math.trunc(
                safeNumber(
                    totalPages,
                    0
                )
            )
        );


    if (
        total === 0
    ) {
        return [];
    }


    if (
        total <= 7
    ) {
        return Array.from(
            {
                length:
                    total,
            },
            (
                _,
                index
            ) => (
                index + 1
            )
        );
    }


    const pages = [
        1,
    ];


    const start =
        Math.max(
            2,
            current - 1
        );


    const end =
        Math.min(
            total - 1,
            current + 1
        );


    if (
        start > 2
    ) {
        pages.push(
            "start-ellipsis"
        );
    }


    for (
        let page = start;
        page <= end;
        page += 1
    ) {
        pages.push(
            page
        );
    }


    if (
        end < total - 1
    ) {
        pages.push(
            "end-ellipsis"
        );
    }


    pages.push(
        total
    );


    return pages;
};


// =========================================================
// AMOUNT TEXT CLASS
// =========================================================

export const getCoinAmountClass = (
    item
) => {
    return (
        getCoinDirection(
            item
        ) === "spent"
            ? "text-rose-300"
            : "text-emerald-300"
    );
};


// =========================================================
// AMOUNT BADGE CLASS
// =========================================================

export const getCoinAmountBadgeClass = (
    item
) => {
    return (
        getCoinDirection(
            item
        ) === "spent"
            ? (
                "border-rose-400/20 "
                +
                "bg-rose-500/[0.08] "
                +
                "text-rose-300"
            )
            : (
                "border-emerald-400/20 "
                +
                "bg-emerald-500/[0.08] "
                +
                "text-emerald-300"
            )
    );
};