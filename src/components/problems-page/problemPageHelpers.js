// src/components/problems-page/problemPageHelpers.js

import {
    PROBLEM_ORDERING,
} from "../../services/problems";


// =========================================================
// CONFIG
// =========================================================

export const PROBLEMS_PAGE_SIZE =
    6;


export const PROBLEMS_SEARCH_DEBOUNCE_MS =
    500;


// =========================================================
// STATUS OPTIONS
// =========================================================

export const PROBLEM_STATUS_OPTIONS = [
    {
        value: "all",
        label: "Barcha holatlar",
    },
    {
        value: "pending",
        label: "Jarayonda",
    },
    {
        value: "solved",
        label: "Yechilgan",
    },
    {
        value: "rejected",
        label: "Rad etilgan",
    },
];


// =========================================================
// URGENT OPTIONS
// =========================================================

export const PROBLEM_URGENT_OPTIONS = [
    {
        value: "all",
        label: "Barcha muammolar",
    },
    {
        value: "true",
        label: "Faqat tezkor",
    },
    {
        value: "false",
        label: "Oddiy muammolar",
    },
];


// =========================================================
// ORDERING OPTIONS
// =========================================================

export const PROBLEM_ORDERING_OPTIONS = [
    {
        value:
            PROBLEM_ORDERING.NEWEST,

        label:
            "Eng yangi",
    },
    {
        value:
            PROBLEM_ORDERING.OLDEST,

        label:
            "Eng eski",
    },
    {
        value:
            PROBLEM_ORDERING.MOST_VIEWED,

        label:
            "Eng ko‘p ko‘rilgan",
    },
    {
        value:
            PROBLEM_ORDERING.MOST_STARRED,

        label:
            "Eng ko‘p star",
    },
    {
        value:
            PROBLEM_ORDERING.MOST_ANSWERED,

        label:
            "Eng ko‘p javob",
    },
    {
        value:
            PROBLEM_ORDERING.HIGHEST_BOUNTY,

        label:
            "Eng katta FCoin",
    },
    {
        value:
            PROBLEM_ORDERING.DEADLINE,

        label:
            "Deadline bo‘yicha",
    },
    {
        value:
            PROBLEM_ORDERING.URGENT_FIRST,

        label:
            "Tezkorlar birinchi",
    },
];


// =========================================================
// QUERY KEYS
// =========================================================

export const PROBLEM_QUERY_KEYS =
    Object.freeze([
        "search",
        "status",
        "urgent",
        "language",
        "technology",
        "ordering",
        "page",
    ]);


// =========================================================
// OPTION SETS
// =========================================================

const STATUS_VALUES =
    new Set(
        PROBLEM_STATUS_OPTIONS.map(
            (
                item
            ) =>
                item.value
        )
    );


const URGENT_VALUES =
    new Set(
        PROBLEM_URGENT_OPTIONS.map(
            (
                item
            ) =>
                item.value
        )
    );


const ORDERING_VALUES =
    new Set(
        PROBLEM_ORDERING_OPTIONS.map(
            (
                item
            ) =>
                item.value
        )
    );


// =========================================================
// CLEAN QUERY TEXT
// =========================================================

export const cleanProblemQueryText = (
    value
) => {

    if (
        value === null
        ||
        value === undefined
    ) {
        return "";
    }


    return String(
        value
    ).trim();
};


// =========================================================
// PAGE
// =========================================================

export const getProblemPageFromQuery = (
    value
) => {

    const parsed =
        Number.parseInt(
            String(
                value ?? ""
            ),
            10
        );


    if (
        !Number.isInteger(
            parsed
        )
        ||
        parsed < 1
    ) {
        return 1;
    }


    return parsed;
};


// =========================================================
// STATUS
// =========================================================

export const getProblemStatusFromQuery = (
    searchParams
) => {

    const value =
        cleanProblemQueryText(
            searchParams?.get(
                "status"
            )
        ).toLowerCase();


    if (
        STATUS_VALUES.has(
            value
        )
    ) {
        return value;
    }


    return "all";
};


// =========================================================
// URGENT
// =========================================================

export const getProblemUrgentFromQuery = (
    searchParams
) => {

    const value =
        cleanProblemQueryText(
            searchParams?.get(
                "urgent"
            )
        ).toLowerCase();


    if (
        URGENT_VALUES.has(
            value
        )
    ) {
        return value;
    }


    return "all";
};


// =========================================================
// ORDERING
// =========================================================

export const getProblemOrderingFromQuery = (
    searchParams
) => {

    const value =
        cleanProblemQueryText(
            searchParams?.get(
                "ordering"
            )
        ).toLowerCase();


    if (
        ORDERING_VALUES.has(
            value
        )
    ) {
        return value;
    }


    return PROBLEM_ORDERING.NEWEST;
};


// =========================================================
// LANGUAGE
// =========================================================

export const getProblemLanguageFromQuery = (
    searchParams
) => {

    return cleanProblemQueryText(
        searchParams?.get(
            "language"
        )
    );
};


// =========================================================
// TECHNOLOGY
// =========================================================

export const getProblemTechnologyFromQuery = (
    searchParams
) => {

    return cleanProblemQueryText(
        searchParams?.get(
            "technology"
        )
    );
};


// =========================================================
// SEARCH
// =========================================================

export const getProblemSearchFromQuery = (
    searchParams
) => {

    return cleanProblemQueryText(
        searchParams?.get(
            "search"
        )
    );
};


// =========================================================
// FULL QUERY STATE
// =========================================================

export const getProblemQueryState = (
    searchParams
) => {

    return {

        page:
            getProblemPageFromQuery(
                searchParams?.get(
                    "page"
                )
            ),

        search:
            getProblemSearchFromQuery(
                searchParams
            ),

        status:
            getProblemStatusFromQuery(
                searchParams
            ),

        urgent:
            getProblemUrgentFromQuery(
                searchParams
            ),

        language:
            getProblemLanguageFromQuery(
                searchParams
            ),

        technology:
            getProblemTechnologyFromQuery(
                searchParams
            ),

        ordering:
            getProblemOrderingFromQuery(
                searchParams
            ),
    };
};


// =========================================================
// DEFAULT QUERY VALUE
// =========================================================

const isDefaultProblemQueryValue = (
    key,
    value
) => {

    const cleanValue =
        cleanProblemQueryText(
            value
        );


    if (
        !cleanValue
    ) {
        return true;
    }


    if (
        key === "status"
        &&
        cleanValue === "all"
    ) {
        return true;
    }


    if (
        key === "urgent"
        &&
        cleanValue === "all"
    ) {
        return true;
    }


    if (
        key === "ordering"
        &&
        cleanValue ===
            PROBLEM_ORDERING.NEWEST
    ) {
        return true;
    }


    if (
        key === "page"
        &&
        cleanValue === "1"
    ) {
        return true;
    }


    return false;
};


// =========================================================
// SET QUERY VALUE
// =========================================================

export const setProblemQueryValue = (
    searchParams,
    key,
    value
) => {

    if (
        !searchParams
    ) {
        return;
    }


    if (
        isDefaultProblemQueryValue(
            key,
            value
        )
    ) {

        searchParams.delete(
            key
        );


        return;
    }


    searchParams.set(
        key,
        cleanProblemQueryText(
            value
        )
    );
};


// =========================================================
// UPDATE QUERY PARAMS
// =========================================================

export const buildUpdatedProblemSearchParams = (
    previousParams,
    updates = {}
) => {

    const nextParams =
        new URLSearchParams(
            previousParams
        );


    Object.entries(
        updates
    ).forEach(
        ([
            key,
            value,
        ]) => {

            setProblemQueryValue(
                nextParams,
                key,
                value
            );
        }
    );


    return nextParams;
};


// =========================================================
// RESET QUERY PARAMS
// =========================================================

export const buildResetProblemSearchParams = (
    previousParams
) => {

    const nextParams =
        new URLSearchParams(
            previousParams
        );


    PROBLEM_QUERY_KEYS.forEach(
        (
            key
        ) => {

            nextParams.delete(
                key
            );
        }
    );


    return nextParams;
};


// =========================================================
// QUERY VALIDATION
// =========================================================

export const getProblemQueryCorrections = (
    searchParams
) => {

    const updates = {};


    const rawStatus =
        cleanProblemQueryText(
            searchParams?.get(
                "status"
            )
        ).toLowerCase();


    const rawUrgent =
        cleanProblemQueryText(
            searchParams?.get(
                "urgent"
            )
        ).toLowerCase();


    const rawOrdering =
        cleanProblemQueryText(
            searchParams?.get(
                "ordering"
            )
        ).toLowerCase();


    const rawPage =
        cleanProblemQueryText(
            searchParams?.get(
                "page"
            )
        );


    // =====================================================
    // STATUS
    // =====================================================

    if (
        rawStatus
        &&
        !STATUS_VALUES.has(
            rawStatus
        )
    ) {
        updates.status =
            "all";
    }


    // =====================================================
    // URGENT
    // =====================================================

    if (
        rawUrgent
        &&
        !URGENT_VALUES.has(
            rawUrgent
        )
    ) {
        updates.urgent =
            "all";
    }


    // =====================================================
    // ORDERING
    // =====================================================

    if (
        rawOrdering
        &&
        !ORDERING_VALUES.has(
            rawOrdering
        )
    ) {
        updates.ordering =
            PROBLEM_ORDERING.NEWEST;
    }


    // =====================================================
    // PAGE
    // =====================================================

    if (
        rawPage
    ) {

        const normalizedPage =
            getProblemPageFromQuery(
                rawPage
            );


        if (
            String(
                normalizedPage
            ) !== rawPage
        ) {
            updates.page =
                normalizedPage;
        }
    }


    return updates;
};


// =========================================================
// ACTIVE FILTERS
// =========================================================

export const hasActiveProblemFilters = ({
    search = "",
    status = "all",
    urgent = "all",
    language = "",
    technology = "",
    ordering = PROBLEM_ORDERING.NEWEST,
} = {}) => {

    return (
        Boolean(
            cleanProblemQueryText(
                search
            )
        )
        ||
        status !== "all"
        ||
        urgent !== "all"
        ||
        Boolean(
            cleanProblemQueryText(
                language
            )
        )
        ||
        Boolean(
            cleanProblemQueryText(
                technology
            )
        )
        ||
        ordering !==
            PROBLEM_ORDERING.NEWEST
    );
};


// =========================================================
// RESULT RANGE
// =========================================================

export const getProblemResultRange = ({
    count = 0,
    page = 1,
    pageSize = PROBLEMS_PAGE_SIZE,
} = {}) => {

    const safeCount =
        Math.max(
            0,
            Number(
                count
            )
            ||
            0
        );


    const safePage =
        getProblemPageFromQuery(
            page
        );


    const safePageSize =
        Math.max(
            1,
            Number(
                pageSize
            )
            ||
            PROBLEMS_PAGE_SIZE
        );


    if (
        safeCount === 0
    ) {

        return {
            start: 0,
            end: 0,
        };
    }


    const start =
        (
            (
                safePage - 1
            )
            *
            safePageSize
        )
        +
        1;


    const end =
        Math.min(
            safePage
            *
            safePageSize,

            safeCount
        );


    return {
        start,
        end,
    };
};


// =========================================================
// TOTAL PAGES
// =========================================================

export const getProblemTotalPages = ({
    count = 0,
    pageSize = PROBLEMS_PAGE_SIZE,
} = {}) => {

    const safeCount =
        Math.max(
            0,
            Number(
                count
            )
            ||
            0
        );


    const safePageSize =
        Math.max(
            1,
            Number(
                pageSize
            )
            ||
            PROBLEMS_PAGE_SIZE
        );


    return Math.max(
        1,
        Math.ceil(
            safeCount
            /
            safePageSize
        )
    );
};


// =========================================================
// ERROR MESSAGE
// =========================================================

export const getProblemErrorMessage = (
    error,
    fallback = "Xatolik yuz berdi."
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