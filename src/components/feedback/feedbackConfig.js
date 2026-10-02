// src/components/feedback/feedbackConfig.js

import {
    Bug,
    Heart,
    Lightbulb,
    MessageSquareText,
} from "lucide-react";


// =========================================================
// FILE CONFIG
// =========================================================

export const FEEDBACK_MAX_FILE_SIZE =
    5 * 1024 * 1024;


export const FEEDBACK_ALLOWED_FILE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
];


export const FEEDBACK_ACCEPT =
    FEEDBACK_ALLOWED_FILE_TYPES.join(
        ","
    );


// =========================================================
// FORM CONFIG
// =========================================================

export const FEEDBACK_DEFAULT_TYPE =
    "suggestion";


export const FEEDBACK_TITLE_MIN_LENGTH =
    4;


export const FEEDBACK_TITLE_MAX_LENGTH =
    150;


export const FEEDBACK_MESSAGE_MIN_LENGTH =
    10;


// =========================================================
// FEEDBACK TYPES
//
// Backend FCoin reward contract:
//
// bug        -> 40
// suggestion -> 25
// praise     -> 10
// other      -> 10
// =========================================================

export const FEEDBACK_TYPES = [
    {
        value:
            "bug",

        label:
            "Bug",

        shortLabel:
            "Bug",

        description:
            "Saytda xato yoki noto‘g‘ri ishlayotgan joy topdingiz.",

        reward:
            40,

        Icon:
            Bug,

        activeClass:
            "border-red-400/40 bg-red-500/[0.10] text-red-300",

        inactiveHoverClass:
            "hover:border-red-400/20 hover:bg-red-500/[0.04]",

        iconClass:
            "border-red-400/15 bg-red-500/10 text-red-300",

        rewardClass:
            "border-red-400/15 bg-red-500/[0.06] text-red-300",

        glowClass:
            "bg-red-500/10",
    },


    {
        value:
            "suggestion",

        label:
            "Taklif",

        shortLabel:
            "Taklif",

        description:
            "Platformani yaxshilash uchun yangi g‘oyangiz bor.",

        reward:
            25,

        Icon:
            Lightbulb,

        activeClass:
            "border-amber-400/40 bg-amber-500/[0.10] text-amber-300",

        inactiveHoverClass:
            "hover:border-amber-400/20 hover:bg-amber-500/[0.04]",

        iconClass:
            "border-amber-400/15 bg-amber-500/10 text-amber-300",

        rewardClass:
            "border-amber-400/15 bg-amber-500/[0.06] text-amber-300",

        glowClass:
            "bg-amber-500/10",
    },


    {
        value:
            "praise",

        label:
            "Maqtov",

        shortLabel:
            "Maqtov",

        description:
            "Yoqtirgan jihatingiz yoki ijobiy fikringizni yuboring.",

        reward:
            10,

        Icon:
            Heart,

        activeClass:
            "border-emerald-400/40 bg-emerald-500/[0.10] text-emerald-300",

        inactiveHoverClass:
            "hover:border-emerald-400/20 hover:bg-emerald-500/[0.04]",

        iconClass:
            "border-emerald-400/15 bg-emerald-500/10 text-emerald-300",

        rewardClass:
            "border-emerald-400/15 bg-emerald-500/[0.06] text-emerald-300",

        glowClass:
            "bg-emerald-500/10",
    },


    {
        value:
            "other",

        label:
            "Boshqa",

        shortLabel:
            "Boshqa",

        description:
            "Yuqoridagi turlarga kirmaydigan fikr yoki xabar.",

        reward:
            10,

        Icon:
            MessageSquareText,

        activeClass:
            "border-indigo-400/40 bg-indigo-500/[0.10] text-indigo-300",

        inactiveHoverClass:
            "hover:border-indigo-400/20 hover:bg-indigo-500/[0.04]",

        iconClass:
            "border-indigo-400/15 bg-indigo-500/10 text-indigo-300",

        rewardClass:
            "border-indigo-400/15 bg-indigo-500/[0.06] text-indigo-300",

        glowClass:
            "bg-indigo-500/10",
    },
];


// =========================================================
// GET TYPE CONFIG
// =========================================================

export const getFeedbackTypeConfig = (
    value
) => {
    return (
        FEEDBACK_TYPES.find(
            (
                item
            ) => (
                item.value ===
                value
            )
        )
        ||
        FEEDBACK_TYPES.find(
            (
                item
            ) => (
                item.value ===
                FEEDBACK_DEFAULT_TYPE
            )
        )
        ||
        FEEDBACK_TYPES[0]
    );
};


// =========================================================
// GET REWARD
// =========================================================

export const getFeedbackReward = (
    value
) => {
    return (
        Number(
            getFeedbackTypeConfig(
                value
            )?.reward
        )
        ||
        0
    );
};


// =========================================================
// FILE SIZE
// =========================================================

export const formatFeedbackFileSize = (
    bytes
) => {
    const size =
        Number(
            bytes
        );


    if (
        !Number.isFinite(
            size
        )
        ||
        size <= 0
    ) {
        return "0 MB";
    }


    return (
        `${
            (
                size
                /
                1024
                /
                1024
            ).toFixed(
                2
            )
        } MB`
    );
};