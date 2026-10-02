// src/features/coins.js

import {
    createSlice,
} from "@reduxjs/toolkit";


// =========================================================
// HELPERS
// =========================================================

const safeNumber = (
    value,
    fallback = 0
) => {
    const number = Number(
        value
    );


    return Number.isFinite(
        number
    )
        ? number
        : fallback;
};


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


    return number > 0
        ? number
        : fallback;
};


const safeArray = (
    value
) => {
    return Array.isArray(
        value
    )
        ? value
        : [];
};


const normalizeError = (
    value,
    fallback = "FCoin tarixini yuklashda xatolik yuz berdi."
) => {
    if (
        !value
    ) {
        return fallback;
    }


    if (
        typeof value === "string"
    ) {
        return value;
    }


    if (
        value?.message
    ) {
        return String(
            value.message
        );
    }


    return fallback;
};


// =========================================================
// INITIAL STATE
// =========================================================

const initialState = {

    // =====================================================
    // DATA
    // =====================================================

    coins: [],

    balance: 0,


    // =====================================================
    // REQUEST STATE
    // =====================================================

    isLoading: false,

    error: null,

    hasLoaded: false,


    // =====================================================
    // PAGINATION
    // =====================================================

    count: 0,

    currentPage: 1,

    pageSize: 15,

    totalPages: 0,

    next: null,

    previous: null,
};


// =========================================================
// COIN SLICE
// =========================================================

export const coinSlice =
    createSlice({

        name:
            "coin",

        initialState,

        reducers: {

            // =================================================
            // GET HISTORY START
            // =================================================

            getCoinStart: (
                state,
                action
            ) => {
                state.isLoading =
                    true;


                state.error =
                    null;


                const payload =
                    action.payload
                    ||
                    {};


                if (
                    payload.page !==
                    undefined
                ) {
                    state.currentPage =
                        safePositiveInteger(
                            payload.page,
                            state.currentPage
                        );
                }


                if (
                    payload.pageSize !==
                    undefined
                ) {
                    state.pageSize =
                        safePositiveInteger(
                            payload.pageSize,
                            state.pageSize
                        );
                }
            },


            // =================================================
            // GET HISTORY SUCCESS
            //
            // Expected normalized response:
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
            // =================================================

            getCoinSuccess: (
                state,
                action
            ) => {
                const payload =
                    action.payload
                    ||
                    {};


                state.isLoading =
                    false;


                state.error =
                    null;


                state.hasLoaded =
                    true;


                // =============================================
                // RESULTS
                // =============================================

                state.coins =
                    safeArray(
                        payload.results
                    );


                // =============================================
                // BALANCE
                // =============================================

                if (
                    payload.balance !==
                    null
                    &&
                    payload.balance !==
                    undefined
                ) {
                    state.balance =
                        safeNumber(
                            payload.balance,
                            state.balance
                        );
                }


                // =============================================
                // COUNT
                // =============================================

                state.count =
                    Math.max(
                        0,
                        Math.trunc(
                            safeNumber(
                                payload.count,
                                state.coins.length
                            )
                        )
                    );


                // =============================================
                // PAGE
                // =============================================

                state.currentPage =
                    safePositiveInteger(
                        payload.page,
                        state.currentPage
                    );


                // =============================================
                // PAGE SIZE
                // =============================================

                state.pageSize =
                    safePositiveInteger(
                        payload.page_size,
                        state.pageSize
                    );


                // =============================================
                // TOTAL PAGES
                // =============================================

                const fallbackTotalPages =
                    state.count > 0
                        ? Math.ceil(
                            state.count
                            /
                            state.pageSize
                        )
                        : 0;


                state.totalPages =
                    Math.max(
                        0,
                        Math.trunc(
                            safeNumber(
                                payload.total_pages,
                                fallbackTotalPages
                            )
                        )
                    );


                // =============================================
                // NAVIGATION
                // =============================================

                state.next =
                    payload.next
                    ??
                    null;


                state.previous =
                    payload.previous
                    ??
                    null;
            },


            // =================================================
            // GET HISTORY FAILURE
            // =================================================

            getCoinFailure: (
                state,
                action
            ) => {
                state.isLoading =
                    false;


                state.error =
                    normalizeError(
                        action.payload
                    );


                state.hasLoaded =
                    true;
            },


            // =================================================
            // SET BALANCE
            //
            // Boshqa actiondan keyin navbar/profile balance
            // bilan sync qilish kerak bo'lsa ishlatiladi.
            // =================================================

            setCoinBalance: (
                state,
                action
            ) => {
                state.balance =
                    safeNumber(
                        action.payload,
                        state.balance
                    );
            },


            // =================================================
            // SET PAGE
            // =================================================

            setCoinPage: (
                state,
                action
            ) => {
                state.currentPage =
                    safePositiveInteger(
                        action.payload,
                        state.currentPage
                    );
            },


            // =================================================
            // SET PAGE SIZE
            //
            // Page size o'zgarsa birinchi sahifaga qaytamiz.
            // =================================================

            setCoinPageSize: (
                state,
                action
            ) => {
                state.pageSize =
                    safePositiveInteger(
                        action.payload,
                        state.pageSize
                    );


                state.currentPage =
                    1;
            },


            // =================================================
            // CLEAR ERROR
            // =================================================

            clearCoinError: (
                state
            ) => {
                state.error =
                    null;
            },


            // =================================================
            // CLEAR HISTORY
            //
            // Balance saqlanadi.
            // =================================================

            clearCoinHistory: (
                state
            ) => {
                state.coins =
                    [];


                state.count =
                    0;


                state.currentPage =
                    1;


                state.totalPages =
                    0;


                state.next =
                    null;


                state.previous =
                    null;


                state.error =
                    null;


                state.hasLoaded =
                    false;


                state.isLoading =
                    false;
            },


            // =================================================
            // RESET ENTIRE COIN STATE
            // =================================================

            resetCoinState: () => {
                return {
                    ...initialState,
                };
            },
        },
    });


// =========================================================
// ACTIONS
// =========================================================

export const {
    getCoinStart,
    getCoinSuccess,
    getCoinFailure,

    setCoinBalance,

    setCoinPage,
    setCoinPageSize,

    clearCoinError,
    clearCoinHistory,

    resetCoinState,
} = coinSlice.actions;


// =========================================================
// SELECTORS
// =========================================================

export const selectCoinState = (
    state
) => {
    return (
        state?.coin
        ||
        initialState
    );
};


export const selectCoins = (
    state
) => {
    return (
        selectCoinState(
            state
        ).coins
    );
};


export const selectCoinBalance = (
    state
) => {
    return (
        selectCoinState(
            state
        ).balance
    );
};


export const selectCoinLoading = (
    state
) => {
    return (
        selectCoinState(
            state
        ).isLoading
    );
};


export const selectCoinError = (
    state
) => {
    return (
        selectCoinState(
            state
        ).error
    );
};


export const selectCoinPagination = (
    state
) => {
    const coin =
        selectCoinState(
            state
        );


    return {
        count:
            coin.count,

        currentPage:
            coin.currentPage,

        pageSize:
            coin.pageSize,

        totalPages:
            coin.totalPages,

        next:
            coin.next,

        previous:
            coin.previous,
    };
};


// =========================================================
// REDUCER
// =========================================================

export default coinSlice.reducer;