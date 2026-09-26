// src/components/my-problems/myProblemHelpers.js

import UserImage from "../../assests/userImage.jpeg";

import {
    BACKEND_URL,
} from "../../services/config";


// =========================================================
// CONFIG
// =========================================================

export const MY_PROBLEMS_PAGE_SIZE =
    6;


export const MY_PROBLEMS_SEARCH_DELAY =
    400;


export const DEFAULT_LANGUAGE_COLOR =
    "#6366F1";


// =========================================================
// SAFE NUMBER
// =========================================================

export const safeNumber = (
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
// COMPACT NUMBER
// =========================================================

export const formatCompactNumber = (
    value
) => {

    const number =
        safeNumber(
            value
        );


    if (
        number >=
        1_000_000
    ) {

        const result =
            number /
            1_000_000;


        return (
            `${result.toFixed(
                result >= 10
                    ? 0
                    : 1
            )}M`
        );
    }


    if (
        number >=
        1_000
    ) {

        const result =
            number /
            1_000;


        return (
            `${result.toFixed(
                result >= 10
                    ? 0
                    : 1
            )}K`
        );
    }


    return String(
        number
    );
};


// =========================================================
// ERROR MESSAGE
// =========================================================

export const getMyProblemsErrorMessage = (
    error
) => {

    const data =
        error?.serverData
        ||
        error?.response?.data;


    if (
        typeof data ===
        "string"
        &&
        data.trim()
    ) {

        return data;
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
        typeof data ===
        "object"
    ) {

        const first =
            Object.values(
                data
            )[0];


        if (
            Array.isArray(
                first
            )
            &&
            first.length >
            0
        ) {

            return String(
                first[0]
            );
        }


        if (
            typeof first ===
            "string"
        ) {

            return first;
        }
    }


    return (
        error?.message
        ||
        "Muammolaringizni yuklashda xatolik yuz berdi."
    );
};


// =========================================================
// USER IMAGE
// =========================================================

export const getMyProblemUserImage = (
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
        /^https?:\/\//i.test(
            value
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


    const base =
        String(
            BACKEND_URL
            ||
            ""
        ).replace(
            /\/+$/,
            ""
        );


    return (
        `${base}${
            value.startsWith(
                "/"
            )
                ? value
                : `/${value}`
        }`
    );
};


// =========================================================
// HEX
// =========================================================

export const isValidHexColor = (
    value
) => {

    return (
        typeof value ===
        "string"
        &&
        /^#[0-9A-Fa-f]{6}$/.test(
            value
        )
    );
};


// =========================================================
// LANGUAGE COLOR
// =========================================================

export const getLanguageColor = (
    language
) => {

    if (
        isValidHexColor(
            language?.color
        )
    ) {

        return language.color;
    }


    return DEFAULT_LANGUAGE_COLOR;
};


// =========================================================
// HEX + ALPHA
// =========================================================

export const withAlpha = (
    color,
    alpha
) => {

    const safeColor =
        isValidHexColor(
            color
        )
            ? color
            : DEFAULT_LANGUAGE_COLOR;


    return (
        `${safeColor}${alpha}`
    );
};


// =========================================================
// NORMALIZE LANGUAGES
// =========================================================

export const normalizeProblemLanguages = (
    languages
) => {

    if (
        Array.isArray(
            languages
        )
    ) {

        return languages
            .filter(
                Boolean
            );
    }


    if (
        languages
        &&
        typeof languages ===
        "object"
    ) {

        return [
            languages,
        ];
    }


    if (
        typeof languages ===
        "string"
        &&
        languages.trim()
    ) {

        return [
            {
                name:
                    languages.trim(),

                color:
                    DEFAULT_LANGUAGE_COLOR,
            },
        ];
    }


    return [];
};


// =========================================================
// DEADLINE
// =========================================================

export const getDeadlineInfo = (
    deadline
) => {

    if (
        !deadline
    ) {

        return null;
    }


    const deadlineDate =
        new Date(
            deadline
        );


    if (
        Number.isNaN(
            deadlineDate.getTime()
        )
    ) {

        return null;
    }


    const now =
        new Date();


    const diffMs =
        deadlineDate.getTime()
        -
        now.getTime();


    if (
        diffMs <=
        0
    ) {

        return {
            text:
                "Muddati tugagan",

            icon:
                "fas fa-circle-exclamation",

            className:
                (
                    "border-red-400/30 "
                    +
                    "bg-red-500/10 "
                    +
                    "text-red-300 "
                    +
                    "shadow-red-500/10"
                ),
        };
    }


    const diffMinutes =
        Math.floor(
            diffMs /
            (
                1000 *
                60
            )
        );


    const diffHours =
        Math.floor(
            diffMinutes /
            60
        );


    const diffDays =
        Math.floor(
            diffHours /
            24
        );


    if (
        diffDays >
        0
    ) {

        return {
            text:
                `${diffDays} kun qoldi`,

            icon:
                "fas fa-calendar-days",

            className:
                (
                    "border-yellow-400/30 "
                    +
                    "bg-yellow-500/10 "
                    +
                    "text-yellow-300 "
                    +
                    "shadow-yellow-500/10"
                ),
        };
    }


    if (
        diffHours >
        0
    ) {

        return {
            text:
                `${diffHours} soat qoldi`,

            icon:
                "fas fa-clock",

            className:
                (
                    "border-orange-400/30 "
                    +
                    "bg-orange-500/10 "
                    +
                    "text-orange-300 "
                    +
                    "shadow-orange-500/10"
                ),
        };
    }


    return {
        text:
            `${
                Math.max(
                    diffMinutes,
                    0
                )
            } daqiqa qoldi`,

        icon:
            "fas fa-fire",

        className:
            (
                "border-red-400/30 "
                +
                "bg-red-500/10 "
                +
                "text-red-300 "
                +
                "shadow-red-500/10"
            ),
    };
};


// =========================================================
// PAGINATION ITEMS
// =========================================================

export const getMyProblemsPaginationItems = (
    currentPage,
    totalPages
) => {

    if (
        totalPages <=
        6
    ) {

        return Array.from(
            {
                length:
                    totalPages,
            },
            (
                _,
                index
            ) =>
                index + 1
        );
    }


    const result = [
        1,
    ];


    if (
        currentPage >
        3
    ) {

        result.push(
            "left-ellipsis"
        );
    }


    const start =
        Math.max(
            2,
            currentPage - 1
        );


    const end =
        Math.min(
            totalPages - 1,
            currentPage + 1
        );


    for (
        let page = start;
        page <= end;
        page += 1
    ) {

        result.push(
            page
        );
    }


    if (
        currentPage <
        totalPages - 2
    ) {

        result.push(
            "right-ellipsis"
        );
    }


    result.push(
        totalPages
    );


    return result;
};