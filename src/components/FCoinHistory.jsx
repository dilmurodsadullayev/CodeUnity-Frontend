// src/components/FCoinHistory.jsx

import React from "react";

import FCoinHistoryHeader from "./fcoin-history/FCoinHistoryHeader";
import FCoinHistorySummary from "./fcoin-history/FCoinHistorySummary";
import FCoinHistoryList from "./fcoin-history/FCoinHistoryList";
import FCoinHistoryState from "./fcoin-history/FCoinHistoryState";
import FCoinHistoryPagination from "./fcoin-history/FCoinHistoryPagination";

import useCoinHistory from "./fcoin-history/useCoinHistory";


// =========================================================
// FCOIN HISTORY
// =========================================================

const FCoinHistory = () => {
    const {
        // =================================================
        // USER
        // =================================================

        username,


        // =================================================
        // DATA
        // =================================================

        coins,

        balance,

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

        range,

        paginationPages,

        pageSizeOptions,

        canGoPrevious,

        canGoNext,


        // =================================================
        // ACTIONS
        // =================================================

        refresh,

        handlePageChange,

        handlePreviousPage,

        handleNextPage,

        handlePageSizeChange,

    } = useCoinHistory();


    // =====================================================
    // SHOW SUMMARY
    //
    // Initial skeleton paytida summarydagi 0 qiymatlar
    // ko'rinib miltillamasligi uchun.
    // =====================================================

    const showSummary =
        hasLoaded
        ||
        hasTransactions;


    // =====================================================
    // SHOW LIST
    // =====================================================

    const showList =
        !isInitialLoading
        &&
        hasTransactions;


    // =====================================================
    // SHOW PAGINATION
    // =====================================================

    const showPagination =
        showList
        &&
        totalPages > 1;


    return (
        <main
            className="
                relative

                min-h-screen

                overflow-hidden

                bg-[#070a0f]

                px-4
                pb-16
                pt-24

                sm:px-6
                sm:pb-20
                sm:pt-28

                lg:px-8
            "
        >
            {/* =============================================
                PAGE BACKGROUND
            ============================================== */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none

                    absolute
                    inset-0

                    overflow-hidden
                "
            >
                <div
                    className="
                        absolute
                        -left-32
                        top-24

                        h-[420px]
                        w-[420px]

                        rounded-full

                        bg-indigo-600/[0.05]

                        blur-[130px]
                    "
                />


                <div
                    className="
                        absolute
                        -right-40
                        top-[420px]

                        h-[460px]
                        w-[460px]

                        rounded-full

                        bg-yellow-400/[0.035]

                        blur-[140px]
                    "
                />


                <div
                    className="
                        absolute
                        bottom-0
                        left-1/3

                        h-[340px]
                        w-[340px]

                        rounded-full

                        bg-cyan-500/[0.025]

                        blur-[120px]
                    "
                />


                <div
                    className="
                        absolute
                        inset-0

                        opacity-[0.015]

                        [background-image:linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)]

                        [background-size:54px_54px]
                    "
                />
            </div>


            {/* =============================================
                CONTENT
            ============================================== */}

            <div
                className="
                    relative
                    z-10

                    mx-auto

                    w-full
                    max-w-6xl
                "
            >
                {/* =========================================
                    HEADER
                ========================================== */}

                <FCoinHistoryHeader
                    username={
                        username
                    }
                    balance={
                        balance
                    }
                    count={
                        count
                    }
                    isRefreshing={
                        isRefreshing
                    }
                    onRefresh={
                        refresh
                    }
                />


                {/* =========================================
                    SUMMARY
                ========================================== */}

                {
                    showSummary
                    &&
                    (
                        <FCoinHistorySummary
                            count={
                                count
                            }
                            currentPage={
                                currentPage
                            }
                            totalPages={
                                totalPages
                            }
                            pageSize={
                                pageSize
                            }
                            range={
                                range
                            }
                            pageSizeOptions={
                                pageSizeOptions
                            }
                            isLoading={
                                isLoading
                            }
                            onPageSizeChange={
                                handlePageSizeChange
                            }
                        />
                    )
                }


                {/* =========================================
                    HISTORY BODY
                ========================================== */}

                <section
                    className="
                        mt-6
                    "
                >
                    {/* =====================================
                        LOADING / ERROR / EMPTY
                    ====================================== */}

                    <FCoinHistoryState
                        isInitialLoading={
                            isInitialLoading
                        }
                        isLoading={
                            isLoading
                        }
                        error={
                            error
                        }
                        hasLoaded={
                            hasLoaded
                        }
                        hasTransactions={
                            hasTransactions
                        }
                        onRetry={
                            refresh
                        }
                    />


                    {/* =====================================
                        TRANSACTION LIST
                    ====================================== */}

                    {
                        showList
                        &&
                        (
                            <FCoinHistoryList
                                coins={
                                    coins
                                }
                                isRefreshing={
                                    isRefreshing
                                }
                            />
                        )
                    }


                    {/* =====================================
                        PAGINATION
                    ====================================== */}

                    {
                        showPagination
                        &&
                        (
                            <FCoinHistoryPagination
                                currentPage={
                                    currentPage
                                }
                                totalPages={
                                    totalPages
                                }
                                paginationPages={
                                    paginationPages
                                }
                                canGoPrevious={
                                    canGoPrevious
                                }
                                canGoNext={
                                    canGoNext
                                }
                                isLoading={
                                    isLoading
                                }
                                onPageChange={
                                    handlePageChange
                                }
                                onPrevious={
                                    handlePreviousPage
                                }
                                onNext={
                                    handleNextPage
                                }
                            />
                        )
                    }
                </section>


                {/* =========================================
                    FOOTER NOTE
                ========================================== */}

                <div
                    className="
                        mt-10

                        border-t
                        border-white/[0.04]

                        pt-5

                        text-center
                    "
                >
                    <p
                        className="
                            font-mono

                            text-[9px]
                            font-bold

                            uppercase

                            tracking-[0.17em]

                            text-gray-700
                        "
                    >
                        FSociety FCoin Ledger
                        {" • "}
                        Structured transaction history
                    </p>
                </div>
            </div>
        </main>
    );
};


// =========================================================
// EXPORT
// =========================================================

export default FCoinHistory;