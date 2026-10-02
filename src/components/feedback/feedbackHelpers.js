// src/components/feedback/feedbackHelpers.js

import {
    CheckCircle2,
    Clock3,
    XCircle,
} from "lucide-react";


// =========================================================
// STATUS FILTERS
// =========================================================

export const FEEDBACK_STATUS_FILTERS = [
    {
        value:
            "all",

        label:
            "Barchasi",
    },

    {
        value:
            "pending",

        label:
            "Pending",
    },

    {
        value:
            "approved",

        label:
            "Approved",
    },

    {
        value:
            "rejected",

        label:
            "Rejected",
    },
];


// =========================================================
// STATUS CONFIG
// =========================================================

export const FEEDBACK_STATUS_CONFIG = {
    pending: {
        label:
            "Pending",

        Icon:
            Clock3,

        className:
            "border-amber-400/20 bg-amber-500/[0.07] text-amber-300",
    },

    approved: {
        label:
            "Approved",

        Icon:
            CheckCircle2,

        className:
            "border-emerald-400/20 bg-emerald-500/[0.07] text-emerald-300",
    },

    rejected: {
        label:
            "Rejected",

        Icon:
            XCircle,

        className:
            "border-red-400/20 bg-red-500/[0.07] text-red-300",
    },
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
            ||
            "pending"
        )
            .trim()
            .toLowerCase();


    return (
        FEEDBACK_STATUS_CONFIG[
            normalizedStatus
        ]
        ||
        FEEDBACK_STATUS_CONFIG.pending
    );
};


// =========================================================
// API ERROR
// =========================================================

export const getFeedbackErrorMessage = (
    error,
    fallback = "Feedback ma’lumotlarini olishda xatolik yuz berdi."
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
        return data.trim();
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
            firstValue.length > 0
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
// NORMALIZE FEEDBACK LIST
//
// Quyidagilarni qo'llaydi:
//
// [
//     ...
// ]
//
// yoki
//
// {
//     results: [
//         ...
//     ]
// }
// =========================================================

export const normalizeFeedbackList = (
    data
) => {
    if (
        Array.isArray(
            data
        )
    ) {
        return data;
    }


    if (
        Array.isArray(
            data?.results
        )
    ) {
        return data.results;
    }


    return [];
};


// =========================================================
// SAFE NUMBER
// =========================================================

export const safeFeedbackNumber = (
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
// DEFAULT STATS
// =========================================================

export const DEFAULT_FEEDBACK_STATS = {
    total:
        0,

    pending:
        0,

    approved:
        0,

    rejected:
        0,

    earned_fcoin:
        0,

    approved_bugs:
        0,
};


// =========================================================
// NORMALIZE STATS
// =========================================================

export const normalizeFeedbackStats = (
    data
) => {
    const source =
        data
        &&
        typeof data === "object"
            ? data
            : {};


    return {
        total:
            Math.max(
                0,
                safeFeedbackNumber(
                    source.total
                )
            ),

        pending:
            Math.max(
                0,
                safeFeedbackNumber(
                    source.pending
                )
            ),

        approved:
            Math.max(
                0,
                safeFeedbackNumber(
                    source.approved
                )
            ),

        rejected:
            Math.max(
                0,
                safeFeedbackNumber(
                    source.rejected
                )
            ),

        earned_fcoin:
            Math.max(
                0,
                safeFeedbackNumber(
                    source.earned_fcoin
                )
            ),

        approved_bugs:
            Math.max(
                0,
                safeFeedbackNumber(
                    source.approved_bugs
                )
            ),
    };
};


// =========================================================
// SCREENSHOT
// =========================================================

export const getFeedbackScreenshot = (
    feedback
) => {
    const value =
        feedback?.screenshot_url
        ||
        feedback?.screenshot;


    if (
        !value
    ) {
        return null;
    }


    const screenshot =
        String(
            value
        ).trim();


    return (
        screenshot
        ||
        null
    );
};


// =========================================================
// USERNAME
// =========================================================

export const getFeedbackUsername = (
    feedback
) => {
    return (
        feedback?.user?.username
        ||
        feedback?.username
        ||
        "user"
    );
};


// =========================================================
// REWARDED
// =========================================================

export const isFeedbackRewarded = (
    feedback
) => {
    if (
        feedback?.is_rewarded ===
        true
    ) {
        return true;
    }


    if (
        feedback?.rewarded_at
    ) {
        return true;
    }


    return (
        safeFeedbackNumber(
            feedback?.reward_amount
        ) > 0
    );
};


// =========================================================
// REWARD AMOUNT
// =========================================================

export const getFeedbackRewardAmount = (
    feedback
) => {
    return Math.max(
        0,
        safeFeedbackNumber(
            feedback?.reward_amount
        )
    );
};


// =========================================================
// CAN MODIFY
// =========================================================

export const canModifyFeedback = (
    feedback
) => {
    return Boolean(
        feedback?.can_user_modify
    );
};