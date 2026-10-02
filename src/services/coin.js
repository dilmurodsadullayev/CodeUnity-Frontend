// src/services/coin.js

import axios from "./api";


// =========================================================
// CONSTANTS
// =========================================================

const DEFAULT_PAGE = 1;

const DEFAULT_PAGE_SIZE = 15;

const MAX_PAGE_SIZE = 100;


// =========================================================
// SAFE NUMBER
// =========================================================

const safeNumber = (
    value,
    fallback = 0
) => {
    const number = Number(
        value
    );


    if (
        !Number.isFinite(
            number
        )
    ) {
        return fallback;
    }


    return number;
};


// =========================================================
// SAFE POSITIVE INTEGER
// =========================================================

const safePositiveInteger = (
    value,
    fallback = 1
) => {
    const number = Math.trunc(
        safeNumber(
            value,
            fallback
        )
    );


    if (
        number < 1
    ) {
        return fallback;
    }


    return number;
};


// =========================================================
// PAGE SIZE
// =========================================================

const normalizePageSize = (
    value
) => {
    const pageSize =
        safePositiveInteger(
            value,
            DEFAULT_PAGE_SIZE
        );


    return Math.min(
        pageSize,
        MAX_PAGE_SIZE
    );
};


// =========================================================
// ARRAY
// =========================================================

const normalizeArray = (
    value
) => {
    return Array.isArray(
        value
    )
        ? value
        : [];
};


// =========================================================
// STRING
// =========================================================

const safeString = (
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
// OBJECT
// =========================================================

const safeObject = (
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

const normalizeDirection = (
    value,
    amount
) => {
    const direction =
        safeString(
            value
        )
            .trim()
            .toLowerCase();


    if (
        direction === "earned"
        ||
        direction === "earn"
        ||
        direction === "income"
        ||
        direction === "credit"
    ) {
        return "earned";
    }


    if (
        direction === "spent"
        ||
        direction === "spend"
        ||
        direction === "expense"
        ||
        direction === "debit"
    ) {
        return "spent";
    }


    return (
        Number(
            amount
        ) < 0
            ? "spent"
            : "earned"
    );
};


// =========================================================
// DISPLAY AMOUNT
// =========================================================

const normalizeDisplayAmount = (
    value,
    amount,
    direction
) => {
    const provided =
        safeString(
            value
        ).trim();


    if (
        provided
    ) {
        return provided;
    }


    const absoluteAmount =
        Math.abs(
            safeNumber(
                amount,
                0
            )
        );


    return (
        direction === "spent"
            ? `-${absoluteAmount}`
            : `+${absoluteAmount}`
    );
};


// =========================================================
// COIN ITEM
// =========================================================

export const normalizeCoinItem = (
    item
) => {
    const source =
        safeObject(
            item
        );


    const amount =
        safeNumber(
            source.amount,
            0
        );


    const absoluteAmount =
        Math.abs(
            safeNumber(
                source.absolute_amount,
                amount
            )
        );


    const direction =
        normalizeDirection(
            source.direction,
            amount
        );


    return {
        ...source,


        // =================================================
        // CORE
        // =================================================

        id:
            source.id
            ?? null,

        amount,

        absolute_amount:
            absoluteAmount,

        display_amount:
            normalizeDisplayAmount(
                source.display_amount,
                amount,
                direction
            ),

        direction,


        // =================================================
        // STATUS
        // =================================================

        status:
            safeString(
                source.status
            ),

        status_label:
            safeString(
                source.status_label,
                "FCoin"
            ),


        // =================================================
        // USER FRIENDLY TEXT
        // =================================================

        title:
            safeString(
                source.title,
                "FCoin tranzaksiya"
            ),

        description:
            safeString(
                source.description
            ),


        // =================================================
        // STRUCTURED DATA
        // =================================================

        target:
            safeObject(
                source.target
            ),

        metadata:
            safeObject(
                source.metadata
            ),


        // =================================================
        // AUDIT
        // =================================================

        event_key:
            source.event_key
            ?? null,

        reason:
            safeString(
                source.reason
            ),


        // =================================================
        // DATE
        // =================================================

        created_at:
            source.created_at
            ?? null,
    };
};


// =========================================================
// PAGINATED RESPONSE
// =========================================================

export const normalizeCoinHistoryResponse = (
    data,
    {
        requestedPage = DEFAULT_PAGE,
        requestedPageSize = DEFAULT_PAGE_SIZE,
    } = {}
) => {
    // =====================================================
    // LEGACY ARRAY SUPPORT
    // =====================================================

    if (
        Array.isArray(
            data
        )
    ) {
        const results =
            data.map(
                normalizeCoinItem
            );


        return {
            balance:
                null,

            count:
                results.length,

            page:
                1,

            page_size:
                normalizePageSize(
                    requestedPageSize
                ),

            total_pages:
                results.length
                    ? 1
                    : 0,

            next:
                null,

            previous:
                null,

            results,
        };
    }


    // =====================================================
    // NORMAL RESPONSE
    // =====================================================

    const response =
        safeObject(
            data
        );


    const results =
        normalizeArray(
            response.results
        ).map(
            normalizeCoinItem
        );


    const page =
        safePositiveInteger(
            response.page,
            safePositiveInteger(
                requestedPage,
                DEFAULT_PAGE
            )
        );


    const pageSize =
        normalizePageSize(
            response.page_size
            ??
            requestedPageSize
        );


    const count =
        Math.max(
            0,
            Math.trunc(
                safeNumber(
                    response.count,
                    results.length
                )
            )
        );


    const calculatedTotalPages =
        count > 0
            ? Math.ceil(
                count
                /
                pageSize
            )
            : 0;


    const totalPages =
        Math.max(
            0,
            Math.trunc(
                safeNumber(
                    response.total_pages,
                    calculatedTotalPages
                )
            )
        );


    return {
        balance:
            response.balance === null
            ||
            response.balance === undefined
                ? null
                : safeNumber(
                    response.balance,
                    0
                ),

        count,

        page,

        page_size:
            pageSize,

        total_pages:
            totalPages,

        next:
            response.next
            ?? null,

        previous:
            response.previous
            ?? null,

        results,
    };
};


// =========================================================
// CANCELED REQUEST
// =========================================================

export const isCoinRequestCanceled = (
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
// ERROR MESSAGE
// =========================================================

export const getCoinErrorMessage = (
    error,
    fallback = "FCoin tarixini yuklashda xatolik yuz berdi."
) => {
    if (
        isCoinRequestCanceled(
            error
        )
    ) {
        return "";
    }


    const data =
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
// COIN SERVICE
// =========================================================

const CoinService = {

    // =====================================================
    // GET COIN HISTORY
    //
    // GET:
    //
    // /api/coins/
    //
    // Axios baseURL /api bo'lgani uchun:
    //
    // /coins/
    //
    // Params:
    //
    // ?page=1
    // &page_size=15
    //
    // Response:
    //
    // {
    //     balance,
    //     count,
    //     page,
    //     page_size,
    //     total_pages,
    //     next,
    //     previous,
    //     results
    // }
    // =====================================================

    async getCoins(
        page = DEFAULT_PAGE,
        pageSize = DEFAULT_PAGE_SIZE,
        {
            signal = undefined,
        } = {}
    ) {
        const normalizedPage =
            safePositiveInteger(
                page,
                DEFAULT_PAGE
            );


        const normalizedPageSize =
            normalizePageSize(
                pageSize
            );


        try {
            const {
                data,
            } = await axios.get(
                "/coins/",
                {
                    params: {
                        page:
                            normalizedPage,

                        page_size:
                            normalizedPageSize,
                    },

                    signal,

                    withCredentials:
                        true,
                }
            );


            return (
                normalizeCoinHistoryResponse(
                    data,
                    {
                        requestedPage:
                            normalizedPage,

                        requestedPageSize:
                            normalizedPageSize,
                    }
                )
            );

        } catch (
            error
        ) {
            if (
                !isCoinRequestCanceled(
                    error
                )
            ) {
                console.error(
                    "FCoin tarixini olishda xato:",
                    error?.response?.data
                    ||
                    error?.response
                    ||
                    error?.message
                    ||
                    error
                );
            }


            throw error;
        }
    },
};


// =========================================================
// CONSTANT EXPORTS
// =========================================================

export {
    DEFAULT_PAGE,
    DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE,
};


// =========================================================
// DEFAULT EXPORT
// =========================================================

export default CoinService;