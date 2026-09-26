// src/components/projects/projectHelpers.js

import {
    BACKEND_URL,
} from "../../services/config";


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
// ERROR
// =========================================================

export const getErrorMessage = (
    error
) => {

    const data =
        error?.response?.data
        ||
        error?.serverData;


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


    return (
        error?.message
        ||
        "Projectlarni yuklashda xatolik yuz berdi."
    );
};


// =========================================================
// CANCELED REQUEST
// =========================================================

export const isCanceledRequest = (
    error
) => {

    return (
        error?.code ===
        "ERR_CANCELED"

        ||

        error?.name ===
        "CanceledError"

        ||

        error?.name ===
        "AbortError"
    );
};


// =========================================================
// IMAGE URL
// =========================================================

export const getProjectImageUrl = (
    image
) => {

    if (
        !image
    ) {

        return null;
    }


    const value =
        String(
            image
        ).trim();


    if (
        !value
    ) {

        return null;
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
// PROMOTION
// =========================================================

export const isProjectPromoted = (
    project
) => {

    if (
        !project?.is_promoted
    ) {

        return false;
    }


    if (
        !project?.promotion_expires_at
    ) {

        return true;
    }


    const expires =
        new Date(
            project.promotion_expires_at
        ).getTime();


    if (
        Number.isNaN(
            expires
        )
    ) {

        return Boolean(
            project.is_promoted
        );
    }


    return (
        expires >
        Date.now()
    );
};


// =========================================================
// TEXT
// =========================================================

export const truncateText = (
    value,
    maxLength = 125
) => {

    const text =
        String(
            value
            ||
            ""
        ).trim();


    if (
        !text
    ) {

        return (
            "Loyiha haqida batafsil ma’lumot hali kiritilmagan."
        );
    }


    if (
        text.length <=
        maxLength
    ) {

        return text;
    }


    return (
        `${text.slice(
            0,
            maxLength
        ).trim()}...`
    );
};


// =========================================================
// DATE
// =========================================================

export const formatProjectDate = (
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


    return date.toLocaleDateString(
        "uz-UZ",
        {
            day:
                "2-digit",

            month:
                "short",

            year:
                "numeric",
        }
    );
};


// =========================================================
// STACK
// =========================================================

export const getProjectStack = (
    project
) => {

    const result =
        [];


    const addItem = (
        item
    ) => {

        const name =
            typeof item ===
            "string"

                ? item.trim()

                : String(
                    item?.name
                    ||
                    item?.title
                    ||
                    ""
                ).trim();


        if (
            !name
        ) {

            return;
        }


        const alreadyExists =
            result.some(
                (
                    current
                ) =>
                    current.toLowerCase()
                    ===
                    name.toLowerCase()
            );


        if (
            alreadyExists
        ) {

            return;
        }


        result.push(
            name
        );
    };


    addItem(
        project?.language_data
    );


    addItem(
        project?.technology_data
    );


    const languages =
        Array.isArray(
            project?.languages_data
        )
            ? project.languages_data
            : [];


    languages.forEach(
        addItem
    );


    const technologies =
        Array.isArray(
            project?.technologies_data
        )
            ? project.technologies_data
            : [];


    technologies.forEach(
        addItem
    );


    return result.slice(
        0,
        4
    );
};


// =========================================================
// PAGINATION
// =========================================================

export const getPaginationItems = (
    currentPage,
    totalPages
) => {

    if (
        totalPages <=
        7
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


    const pages = [
        1,
    ];


    if (
        currentPage >
        4
    ) {

        pages.push(
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

        pages.push(
            page
        );
    }


    if (
        currentPage <
        totalPages - 3
    ) {

        pages.push(
            "right-ellipsis"
        );
    }


    pages.push(
        totalPages
    );


    return pages;
};