// src/components/feedback/feedbackHelpers.js

import {
    CheckCircle2,
    CircleHelp,
    Clock3,
    Wrench,
    XCircle,
} from "lucide-react";


// =========================================================
// STATUS FILTERS
// =========================================================

export const FEEDBACK_STATUS_FILTERS = [
    {
        value: "all",
        label: "Barchasi",
    },
    {
        value: "pending",
        label: "Kutilmoqda",
    },
    {
        value: "in_progress",
        label: "Ishlanmoqda",
    },
    {
        value: "approved",
        label: "Tasdiqlangan",
    },
    {
        value: "rejected",
        label: "Rad etilgan",
    },
];


// =========================================================
// STATUS CONFIG
// =========================================================

export const FEEDBACK_STATUS_CONFIG = {
    pending: {
        value: "pending",

        label: "Kutilmoqda",

        shortLabel: "Pending",

        description:
            "Admin ko‘rib chiqishini kutmoqda.",

        Icon: Clock3,

        className:
            "border-amber-400/20 "
            +
            "bg-amber-500/[0.07] "
            +
            "text-amber-300",
    },

    in_progress: {
        value: "in_progress",

        label: "Ishlanmoqda",

        shortLabel: "In progress",

        description:
            "Admin feedback ustida ishlamoqda.",

        Icon: Wrench,

        className:
            "border-blue-400/20 "
            +
            "bg-blue-500/[0.07] "
            +
            "text-blue-300",
    },

    approved: {
        value: "approved",

        label: "Tasdiqlangan",

        shortLabel: "Approved",

        description:
            "Feedback admin tomonidan tasdiqlangan.",

        Icon: CheckCircle2,

        className:
            "border-emerald-400/20 "
            +
            "bg-emerald-500/[0.07] "
            +
            "text-emerald-300",
    },

    rejected: {
        value: "rejected",

        label: "Rad etilgan",

        shortLabel: "Rejected",

        description:
            "Feedback admin tomonidan rad etilgan.",

        Icon: XCircle,

        className:
            "border-red-400/20 "
            +
            "bg-red-500/[0.07] "
            +
            "text-red-300",
    },
};


// =========================================================
// FALLBACK STATUS
// =========================================================

const FALLBACK_STATUS_CONFIG = {
    value: "unknown",

    label: "Noma’lum",

    shortLabel: "Unknown",

    description:
        "Feedback holati aniqlanmadi.",

    Icon: CircleHelp,

    className:
        "border-gray-400/20 "
        +
        "bg-gray-500/[0.07] "
        +
        "text-gray-400",
};


// =========================================================
// SAFE NUMBER
// =========================================================

const toSafeNumber = (
    value,
    fallback = 0
) => {
    const number =
        Number(
            value
        );

    return Number.isFinite(
        number
    )
        ? number
        : fallback;
};


// =========================================================
// SAFE NON-NEGATIVE INTEGER
// =========================================================

const toSafeCount = (
    value
) => {
    return Math.max(
        0,
        Math.trunc(
            toSafeNumber(
                value,
                0
            )
        )
    );
};


// =========================================================
// GET STATUS CONFIG
// =========================================================

export const getFeedbackStatusConfig = (
    status
) => {
    const normalizedStatus =
        String(
            status
            ??
            ""
        )
            .trim()
            .toLowerCase();

    return (
        FEEDBACK_STATUS_CONFIG[
            normalizedStatus
        ]
        ||
        FALLBACK_STATUS_CONFIG
    );
};


// =========================================================
// VALID STATUS
// =========================================================

export const isValidFeedbackStatus = (
    status
) => {
    if (
        status ===
        "all"
    ) {
        return true;
    }

    return Boolean(
        FEEDBACK_STATUS_CONFIG[
            String(
                status
                ??
                ""
            )
                .trim()
                .toLowerCase()
        ]
    );
};


// =========================================================
// STATUS HELPERS
// =========================================================

export const isFeedbackPending = (
    feedback
) => {
    return (
        feedback?.status ===
        "pending"
    );
};


export const isFeedbackInProgress = (
    feedback
) => {
    return (
        feedback?.status ===
        "in_progress"
    );
};


export const isFeedbackApproved = (
    feedback
) => {
    return (
        feedback?.status ===
        "approved"
    );
};


export const isFeedbackRejected = (
    feedback
) => {
    return (
        feedback?.status ===
        "rejected"
    );
};


export const isFeedbackFinal = (
    feedback
) => {
    return (
        isFeedbackApproved(
            feedback
        )
        ||
        isFeedbackRejected(
            feedback
        )
    );
};


// =========================================================
// CAN USER MODIFY
// =========================================================

export const canModifyFeedback = (
    feedback
) => {
    if (
        !feedback
        ||
        typeof feedback !==
            "object"
    ) {
        return false;
    }

    // =====================================================
    // BACKEND SOURCE OF TRUTH
    // =====================================================

    if (
        typeof feedback
            .can_user_modify ===
        "boolean"
    ) {
        return (
            feedback
                .can_user_modify
        );
    }

    // =====================================================
    // FRONTEND FALLBACK
    //
    // Faqat PENDING edit/delete qilinadi.
    //
    // IN_PROGRESS boshlangan zahoti edit/delete yo‘q.
    // =====================================================

    return isFeedbackPending(
        feedback
    );
};


// =========================================================
// REWARD
// =========================================================

export const getFeedbackRewardAmount = (
    feedback
) => {
    const amount =
        toSafeNumber(
            feedback
                ?.reward_amount,
            0
        );

    return Math.max(
        0,
        Math.trunc(
            amount
        )
    );
};


export const isFeedbackRewarded = (
    feedback
) => {
    if (
        !feedback
    ) {
        return false;
    }

    return Boolean(
        feedback.rewarded_at
    )
    ||
    getFeedbackRewardAmount(
        feedback
    ) > 0;
};


// =========================================================
// SCREENSHOT
// =========================================================

export const getFeedbackScreenshot = (
    feedback
) => {
    if (
        !feedback
        ||
        typeof feedback !==
            "object"
    ) {
        return null;
    }

    const value =
        feedback.screenshot_url
        ??
        feedback.screenshot
        ??
        null;

    if (
        !value
    ) {
        return null;
    }

    if (
        typeof value ===
        "string"
    ) {
        const trimmed =
            value.trim();

        return (
            trimmed
            ||
            null
        );
    }

    if (
        typeof value ===
        "object"
    ) {
        const url =
            value.url
            ??
            value.src
            ??
            null;

        if (
            typeof url ===
            "string"
        ) {
            const trimmed =
                url.trim();

            return (
                trimmed
                ||
                null
            );
        }
    }

    return null;
};


// =========================================================
// USERNAME
// =========================================================

export const getFeedbackUsername = (
    feedback
) => {
    if (
        !feedback
        ||
        typeof feedback !==
            "object"
    ) {
        return "unknown";
    }

    const username =
        feedback
            ?.user
            ?.username
        ??
        feedback
            ?.username
        ??
        feedback
            ?.user_username
        ??
        "unknown";

    const normalized =
        String(
            username
        ).trim();

    return (
        normalized
        ||
        "unknown"
    );
};


// =========================================================
// NORMALIZE LIST
// =========================================================

export const normalizeFeedbackList = (
    payload
) => {
    if (
        Array.isArray(
            payload
        )
    ) {
        return payload;
    }

    if (
        Array.isArray(
            payload?.results
        )
    ) {
        return payload.results;
    }

    if (
        Array.isArray(
            payload?.data
        )
    ) {
        return payload.data;
    }

    if (
        Array.isArray(
            payload?.data?.results
        )
    ) {
        return payload
            .data
            .results;
    }

    return [];
};


// =========================================================
// NORMALIZE STATS
// =========================================================

export const normalizeFeedbackStats = (
    payload
) => {
    const source =
        payload
        &&
        typeof payload ===
            "object"
            ? payload
            : {};

    return {
        total:
            toSafeCount(
                source.total
            ),

        pending:
            toSafeCount(
                source.pending
            ),

        in_progress:
            toSafeCount(
                source.in_progress
            ),

        approved:
            toSafeCount(
                source.approved
            ),

        rejected:
            toSafeCount(
                source.rejected
            ),

        earned_fcoin:
            toSafeCount(
                source.earned_fcoin
            ),

        approved_bugs:
            toSafeCount(
                source.approved_bugs
            ),
    };
};


// =========================================================
// DRF ERROR VALUE
// =========================================================

const getFirstErrorValue = (
    value
) => {
    if (
        value ===
        null
        ||
        value ===
        undefined
    ) {
        return null;
    }

    if (
        typeof value ===
        "string"
    ) {
        const text =
            value.trim();

        return (
            text
            ||
            null
        );
    }

    if (
        Array.isArray(
            value
        )
    ) {
        for (
            const item
            of value
        ) {
            const message =
                getFirstErrorValue(
                    item
                );

            if (
                message
            ) {
                return message;
            }
        }

        return null;
    }

    if (
        typeof value ===
        "object"
    ) {
        for (
            const item
            of Object.values(
                value
            )
        ) {
            const message =
                getFirstErrorValue(
                    item
                );

            if (
                message
            ) {
                return message;
            }
        }
    }

    return null;
};


// =========================================================
// ERROR MESSAGE
// =========================================================

export const getFeedbackErrorMessage = (
    error,
    fallback = "Feedback bilan ishlashda xatolik yuz berdi."
) => {
    if (
        !error
    ) {
        return fallback;
    }

    const serverData =
        error?.serverData
        ??
        error?.response?.data
        ??
        null;

    // =====================================================
    // COMMON DRF KEYS
    // =====================================================

    const commonMessage =
        serverData?.detail
        ??
        serverData?.message
        ??
        serverData?.error
        ??
        null;

    const normalizedCommon =
        getFirstErrorValue(
            commonMessage
        );

    if (
        normalizedCommon
    ) {
        return normalizedCommon;
    }

    // =====================================================
    // FIELD ERRORS
    // =====================================================

    const fieldMessage =
        getFirstErrorValue(
            serverData
        );

    if (
        fieldMessage
    ) {
        return fieldMessage;
    }

    // =====================================================
    // GENERIC ERROR
    // =====================================================

    if (
        typeof error?.message ===
            "string"
        &&
        error.message.trim()
    ) {
        return (
            error.message.trim()
        );
    }

    return fallback;
};


// =========================================================
// STATUS FILTER LABEL
// =========================================================

export const getFeedbackStatusFilterLabel = (
    status
) => {
    if (
        status ===
        "all"
    ) {
        return "Barchasi";
    }

    return (
        getFeedbackStatusConfig(
            status
        ).label
    );
};