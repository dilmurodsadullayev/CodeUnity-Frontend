// src/components/fcoin-history/useCoinHistory.js

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import CoinService, {
    getCoinErrorMessage,
    isCoinRequestCanceled,
} from "../../services/coin";

import {
    getCoinFailure,
    getCoinStart,
    getCoinSuccess,
    selectCoinState,
    setCoinPage,
    setCoinPageSize,
} from "../../features/coins";

import {
    getCoinHistoryRange,
    getCoinPaginationPages,
    safeNumber,
} from "./coinHistoryHelpers";


// =========================================================
// PAGE SIZE OPTIONS
// =========================================================

export const COIN_PAGE_SIZE_OPTIONS = [
    10,
    15,
    25,
    50,
];


// =========================================================
// USE COIN HISTORY
// =========================================================

const useCoinHistory = () => {
    const dispatch =
        useDispatch();


    // =====================================================
    // STORE
    // =====================================================

    const coinState =
        useSelector(
            selectCoinState
        );


    const authUser =
        useSelector(
            (
                state
            ) => state?.auth?.user
        );


    const {
        coins,
        balance,
        isLoading,
        error,
        hasLoaded,

        count,
        currentPage,
        pageSize,
        totalPages,
        next,
        previous,
    } = coinState;


    // =====================================================
    // REQUEST CONTROLLER
    // =====================================================

    const requestControllerRef =
        useRef(
            null
        );


    // =====================================================
    // LOAD HISTORY
    // =====================================================

    const loadHistory =
        useCallback(
            async (
                page,
                size
            ) => {
                // =========================================
                // OLD REQUEST CANCEL
                // =========================================

                if (
                    requestControllerRef.current
                ) {
                    requestControllerRef
                        .current
                        .abort();
                }


                // =========================================
                // NEW REQUEST
                // =========================================

                const controller =
                    new AbortController();


                requestControllerRef.current =
                    controller;


                dispatch(
                    getCoinStart({
                        page,

                        pageSize:
                            size,
                    })
                );


                try {
                    const response =
                        await CoinService
                            .getCoins(
                                page,
                                size,
                                {
                                    signal:
                                        controller.signal,
                                }
                            );


                    // =====================================
                    // REQUEST ALREADY REPLACED
                    // =====================================

                    if (
                        requestControllerRef.current
                        !==
                        controller
                    ) {
                        return null;
                    }


                    dispatch(
                        getCoinSuccess(
                            response
                        )
                    );


                    return response;

                } catch (
                    requestError
                ) {
                    // =====================================
                    // ABORT IS NOT FAILURE
                    // =====================================

                    if (
                        isCoinRequestCanceled(
                            requestError
                        )
                    ) {
                        return null;
                    }


                    const message =
                        getCoinErrorMessage(
                            requestError
                        );


                    dispatch(
                        getCoinFailure(
                            message
                        )
                    );


                    return null;

                } finally {
                    if (
                        requestControllerRef.current
                        ===
                        controller
                    ) {
                        requestControllerRef.current =
                            null;
                    }
                }
            },
            [
                dispatch,
            ]
        );


    // =====================================================
    // INITIAL LOAD + PAGE CHANGE
    // =====================================================

    useEffect(
        () => {
            loadHistory(
                currentPage,
                pageSize
            );


            return () => {
                if (
                    requestControllerRef.current
                ) {
                    requestControllerRef
                        .current
                        .abort();
                }
            };
        },
        [
            currentPage,
            pageSize,
            loadHistory,
        ]
    );


    // =====================================================
    // PAGE CHANGE
    // =====================================================

    const handlePageChange =
        useCallback(
            (
                page
            ) => {
                const nextPage =
                    Math.trunc(
                        safeNumber(
                            page,
                            currentPage
                        )
                    );


                if (
                    isLoading
                    ||
                    nextPage < 1
                    ||
                    nextPage >
                        Math.max(
                            totalPages,
                            1
                        )
                    ||
                    nextPage ===
                        currentPage
                ) {
                    return;
                }


                dispatch(
                    setCoinPage(
                        nextPage
                    )
                );


                // Page tepasiga yumshoq scroll.
                // Komponent mavjud bo'lmasa window fallback.

                requestAnimationFrame(
                    () => {
                        const element =
                            document
                                .getElementById(
                                    "fcoin-history-list"
                                );


                        if (
                            element
                        ) {
                            element.scrollIntoView({
                                behavior:
                                    "smooth",

                                block:
                                    "start",
                            });


                            return;
                        }


                        window.scrollTo({
                            top:
                                0,

                            behavior:
                                "smooth",
                        });
                    }
                );
            },
            [
                currentPage,
                dispatch,
                isLoading,
                totalPages,
            ]
        );


    // =====================================================
    // PREVIOUS PAGE
    // =====================================================

    const handlePreviousPage =
        useCallback(
            () => {
                handlePageChange(
                    currentPage - 1
                );
            },
            [
                currentPage,
                handlePageChange,
            ]
        );


    // =====================================================
    // NEXT PAGE
    // =====================================================

    const handleNextPage =
        useCallback(
            () => {
                handlePageChange(
                    currentPage + 1
                );
            },
            [
                currentPage,
                handlePageChange,
            ]
        );


    // =====================================================
    // PAGE SIZE
    // =====================================================

    const handlePageSizeChange =
        useCallback(
            (
                value
            ) => {
                const nextSize =
                    Math.trunc(
                        safeNumber(
                            value,
                            pageSize
                        )
                    );


                if (
                    isLoading
                    ||
                    nextSize <= 0
                    ||
                    nextSize ===
                        pageSize
                ) {
                    return;
                }


                dispatch(
                    setCoinPageSize(
                        nextSize
                    )
                );
            },
            [
                dispatch,
                isLoading,
                pageSize,
            ]
        );


    // =====================================================
    // REFRESH
    // =====================================================

    const refresh =
        useCallback(
            () => {
                if (
                    isLoading
                ) {
                    return;
                }


                loadHistory(
                    currentPage,
                    pageSize
                );
            },
            [
                currentPage,
                isLoading,
                loadHistory,
                pageSize,
            ]
        );


    // =====================================================
    // DISPLAY BALANCE
    //
    // Backend history yuklangandan keyin backend balance
    // source-of-truth.
    //
    // Birinchi requestdan oldin auth user fallback.
    // =====================================================

    const displayBalance =
        useMemo(
            () => {
                if (
                    hasLoaded
                ) {
                    return safeNumber(
                        balance,
                        0
                    );
                }


                return safeNumber(
                    authUser?.coins
                    ??
                    balance,
                    0
                );
            },
            [
                authUser?.coins,
                balance,
                hasLoaded,
            ]
        );


    // =====================================================
    // USERNAME
    // =====================================================

    const username =
        useMemo(
            () => {
                return (
                    authUser?.username
                    ||
                    "FSociety"
                );
            },
            [
                authUser?.username,
            ]
        );


    // =====================================================
    // RANGE
    // =====================================================

    const range =
        useMemo(
            () => {
                return (
                    getCoinHistoryRange({
                        count,

                        currentPage,

                        pageSize,

                        currentItemsCount:
                            coins.length,
                    })
                );
            },
            [
                coins.length,
                count,
                currentPage,
                pageSize,
            ]
        );


    // =====================================================
    // PAGINATION PAGE LIST
    // =====================================================

    const paginationPages =
        useMemo(
            () => {
                return (
                    getCoinPaginationPages(
                        currentPage,
                        totalPages
                    )
                );
            },
            [
                currentPage,
                totalPages,
            ]
        );


    // =====================================================
    // FLAGS
    // =====================================================

    const hasTransactions =
        coins.length > 0;


    const isInitialLoading =
        isLoading
        &&
        !hasLoaded;


    const isRefreshing =
        isLoading
        &&
        hasLoaded;


    const canGoPrevious =
        !isLoading
        &&
        currentPage > 1
        &&
        Boolean(
            previous
            ||
            currentPage > 1
        );


    const canGoNext =
        !isLoading
        &&
        totalPages > 0
        &&
        currentPage < totalPages
        &&
        Boolean(
            next
            ||
            currentPage < totalPages
        );


    // =====================================================
    // RETURN
    // =====================================================

    return {
        // =================================================
        // USER
        // =================================================

        authUser,

        username,


        // =================================================
        // DATA
        // =================================================

        coins,

        balance:
            displayBalance,

        count,

        hasTransactions,


        // =================================================
        // REQUEST
        // =================================================

        isLoading,

        isInitialLoading,

        isRefreshing,

        hasLoaded,

        error,


        // =================================================
        // PAGINATION
        // =================================================

        currentPage,

        pageSize,

        totalPages,

        next,

        previous,

        range,

        paginationPages,

        pageSizeOptions:
            COIN_PAGE_SIZE_OPTIONS,

        canGoPrevious,

        canGoNext,


        // =================================================
        // ACTIONS
        // =================================================

        loadHistory,

        refresh,

        handlePageChange,

        handlePreviousPage,

        handleNextPage,

        handlePageSizeChange,
    };
};


// =========================================================
// EXPORT
// =========================================================

export default useCoinHistory;