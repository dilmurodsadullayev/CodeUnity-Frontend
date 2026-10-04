import { createSlice } from "@reduxjs/toolkit";


// =========================================================
// CONSTANTS
// =========================================================

export const FEEDBACK_DEFAULT_PAGE_SIZE = 10;

const FEEDBACK_STAT_STATUS_KEYS = new Set([
    "pending",
    "in_progress",
    "approved",
    "rejected",
]);


// =========================================================
// SAFE HELPERS
// =========================================================

const safeArray = (value) => {
    return Array.isArray(value)
        ? value
        : [];
};


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


const safeNonNegativeInteger = (
    value,
    fallback = 0
) => {
    return Math.max(
        0,
        Math.trunc(
            safeNumber(
                value,
                fallback
            )
        )
    );
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


// =========================================================
// TOTAL PAGES
// =========================================================

const calculateTotalPages = (
    count,
    pageSize
) => {
    const safeCount =
        safeNonNegativeInteger(
            count,
            0
        );

    const safePageSize =
        safePositiveInteger(
            pageSize,
            FEEDBACK_DEFAULT_PAGE_SIZE
        );

    if (
        safeCount === 0
    ) {
        return 1;
    }

    return Math.max(
        1,
        Math.ceil(
            safeCount /
            safePageSize
        )
    );
};


// =========================================================
// NORMALIZE LIST RESPONSE
//
// Supports:
//
// [
//     ...
// ]
//
// or:
//
// {
//     count,
//     total_pages,
//     page,
//     page_size,
//     next,
//     previous,
//     results: [
//         ...
//     ]
// }
// =========================================================

const normalizeListResponse = (
    payload
) => {
    if (
        Array.isArray(
            payload
        )
    ) {
        const results =
            payload;

        const count =
            results.length;

        const pageSize =
            count > 0
                ? count
                : FEEDBACK_DEFAULT_PAGE_SIZE;

        return {
            results,
            count,

            page:
                1,

            pageSize,

            totalPages:
                1,

            next:
                null,

            previous:
                null,
        };
    }


    const source =
        payload
        &&
        typeof payload ===
            "object"
            ? payload
            : {};


    const results =
        safeArray(
            source.results
        );


    const count =
        safeNonNegativeInteger(
            source.count,
            results.length
        );


    const pageSize =
        safePositiveInteger(
            source.page_size,
            (
                results.length
                ||
                FEEDBACK_DEFAULT_PAGE_SIZE
            )
        );


    const calculatedTotalPages =
        calculateTotalPages(
            count,
            pageSize
        );


    const totalPages =
        safePositiveInteger(
            source.total_pages,
            calculatedTotalPages
        );


    const page =
        Math.min(
            safePositiveInteger(
                source.page,
                1
            ),
            totalPages
        );


    return {
        results,
        count,

        page,

        pageSize,

        totalPages,

        next:
            source.next
            ??
            null,

        previous:
            source.previous
            ??
            null,
    };
};


// =========================================================
// NORMALIZE FEEDBACK OBJECT
// =========================================================

const normalizeFeedbackPayload = (
    payload
) => {
    if (
        payload?.feedback
        &&
        typeof payload.feedback ===
            "object"
    ) {
        return payload.feedback;
    }


    if (
        payload
        &&
        typeof payload ===
            "object"
    ) {
        return payload;
    }


    return null;
};


// =========================================================
// NORMALIZE STATS
// =========================================================

const normalizeStats = (
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
            safeNonNegativeInteger(
                source.total
            ),

        pending:
            safeNonNegativeInteger(
                source.pending
            ),

        in_progress:
            safeNonNegativeInteger(
                source.in_progress
            ),

        approved:
            safeNonNegativeInteger(
                source.approved
            ),

        rejected:
            safeNonNegativeInteger(
                source.rejected
            ),

        earned_fcoin:
            safeNonNegativeInteger(
                source.earned_fcoin
            ),

        approved_bugs:
            safeNonNegativeInteger(
                source.approved_bugs
            ),
    };
};


// =========================================================
// ERROR
// =========================================================

const normalizeError = (
    value,
    fallback =
        "Feedback bilan ishlashda xatolik yuz berdi."
) => {
    if (
        typeof value ===
            "string"
        &&
        value.trim()
    ) {
        return value.trim();
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
// STATUS STAT HELPERS
// =========================================================

const normalizeFeedbackStatus = (
    feedback
) => {
    const status =
        String(
            feedback?.status
            ??
            ""
        )
            .trim()
            .toLowerCase();


    return (
        FEEDBACK_STAT_STATUS_KEYS.has(
            status
        )
            ? status
            : null
    );
};


const incrementStatusStat = (
    stats,
    status
) => {
    if (
        !status
        ||
        !FEEDBACK_STAT_STATUS_KEYS.has(
            status
        )
    ) {
        return;
    }


    stats[
        status
    ] =
        safeNonNegativeInteger(
            stats[
                status
            ]
        )
        +
        1;
};


const decrementStatusStat = (
    stats,
    status
) => {
    if (
        !status
        ||
        !FEEDBACK_STAT_STATUS_KEYS.has(
            status
        )
    ) {
        return;
    }


    stats[
        status
    ] =
        Math.max(
            0,

            safeNonNegativeInteger(
                stats[
                    status
                ]
            )
            -
            1
        );
};


// =========================================================
// INITIAL STATS
// =========================================================

const initialStats = {
    total:
        0,

    pending:
        0,

    in_progress:
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
// INITIAL STATE
// =========================================================

const initialState = {
    // =====================================================
    // PUBLIC
    // =====================================================

    feedbacks:
        [],

    count:
        0,

    page:
        1,

    pageSize:
        FEEDBACK_DEFAULT_PAGE_SIZE,

    totalPages:
        1,

    next:
        null,

    previous:
        null,


    // =====================================================
    // CURRENT USER
    // =====================================================

    myFeedbacks:
        [],

    myCount:
        0,

    myPage:
        1,

    myPageSize:
        FEEDBACK_DEFAULT_PAGE_SIZE,

    myTotalPages:
        1,

    myNext:
        null,

    myPrevious:
        null,


    // =====================================================
    // STATS
    // =====================================================

    stats: {
        ...initialStats,
    },


    // =====================================================
    // LOADING
    // =====================================================

    isLoading:
        false,

    isMyLoading:
        false,

    isStatsLoading:
        false,

    isCreating:
        false,

    isUpdating:
        false,

    isDeleting:
        false,


    // =====================================================
    // MUTATION
    // =====================================================

    updatingId:
        null,

    deletingId:
        null,


    // =====================================================
    // ERROR
    // =====================================================

    error:
        null,

    myError:
        null,

    statsError:
        null,

    mutationError:
        null,


    // =====================================================
    // META
    // =====================================================

    hasLoaded:
        false,

    hasMyLoaded:
        false,

    hasStatsLoaded:
        false,
};


// =========================================================
// SLICE
// =========================================================

export const FeedbackSlice =
    createSlice({
        name:
            "feedback",

        initialState,

        reducers: {

            // =================================================
            // PUBLIC LIST
            // =================================================

            getFeedbackStart: (
                state
            ) => {
                state.isLoading =
                    true;

                state.error =
                    null;
            },


            getFeedbackSuccess: (
                state,
                action
            ) => {
                const normalized =
                    normalizeListResponse(
                        action.payload
                    );


                state.isLoading =
                    false;

                state.hasLoaded =
                    true;


                state.feedbacks =
                    normalized.results;

                state.count =
                    normalized.count;

                state.page =
                    normalized.page;

                state.pageSize =
                    normalized.pageSize;

                state.totalPages =
                    normalized.totalPages;

                state.next =
                    normalized.next;

                state.previous =
                    normalized.previous;


                state.error =
                    null;
            },


            getFeedbackFailure: (
                state,
                action
            ) => {
                state.isLoading =
                    false;

                state.hasLoaded =
                    true;


                state.error =
                    normalizeError(
                        action.payload,

                        "Feedbacklarni yuklashda xatolik yuz berdi."
                    );
            },


            // =================================================
            // MY FEEDBACKS
            // =================================================

            getMyFeedbackStart: (
                state
            ) => {
                state.isMyLoading =
                    true;

                state.myError =
                    null;
            },


            getMyFeedbackSuccess: (
                state,
                action
            ) => {
                const normalized =
                    normalizeListResponse(
                        action.payload
                    );


                state.isMyLoading =
                    false;

                state.hasMyLoaded =
                    true;


                state.myFeedbacks =
                    normalized.results;

                state.myCount =
                    normalized.count;

                state.myPage =
                    normalized.page;

                state.myPageSize =
                    normalized.pageSize;

                state.myTotalPages =
                    normalized.totalPages;

                state.myNext =
                    normalized.next;

                state.myPrevious =
                    normalized.previous;


                state.myError =
                    null;
            },


            getMyFeedbackFailure: (
                state,
                action
            ) => {
                state.isMyLoading =
                    false;

                state.hasMyLoaded =
                    true;


                state.myError =
                    normalizeError(
                        action.payload,

                        "Feedbacklaringizni yuklashda xatolik yuz berdi."
                    );
            },


            // =================================================
            // STATS
            // =================================================

            getFeedbackStatsStart: (
                state
            ) => {
                state.isStatsLoading =
                    true;

                state.statsError =
                    null;
            },


            getFeedbackStatsSuccess: (
                state,
                action
            ) => {
                state.isStatsLoading =
                    false;

                state.hasStatsLoaded =
                    true;


                state.stats =
                    normalizeStats(
                        action.payload
                    );


                state.statsError =
                    null;
            },


            getFeedbackStatsFailure: (
                state,
                action
            ) => {
                state.isStatsLoading =
                    false;

                state.hasStatsLoaded =
                    true;


                state.statsError =
                    normalizeError(
                        action.payload,

                        "Feedback statistikasini yuklashda xatolik yuz berdi."
                    );
            },


            // =================================================
            // CREATE
            // =================================================

            postFeedbackStart: (
                state
            ) => {
                state.isCreating =
                    true;

                state.mutationError =
                    null;
            },


            postFeedbackSuccess: (
                state,
                action
            ) => {
                state.isCreating =
                    false;

                state.mutationError =
                    null;


                const feedback =
                    normalizeFeedbackPayload(
                        action.payload
                    );


                if (
                    !feedback
                    ||
                    feedback.id ===
                        undefined
                    ||
                    feedback.id ===
                        null
                ) {
                    return;
                }


                // =============================================
                // CURRENT USER LIST
                // =============================================

                const exists =
                    state.myFeedbacks.some(
                        (
                            item
                        ) => (
                            item?.id ===
                            feedback.id
                        )
                    );


                if (
                    exists
                ) {
                    return;
                }


                state.myFeedbacks.unshift(
                    feedback
                );


                if (
                    state.myFeedbacks.length >
                    state.myPageSize
                ) {
                    state.myFeedbacks =
                        state.myFeedbacks.slice(
                            0,
                            state.myPageSize
                        );
                }


                state.myCount +=
                    1;


                state.myTotalPages =
                    calculateTotalPages(
                        state.myCount,
                        state.myPageSize
                    );


                // =============================================
                // STATS OPTIMISTIC UPDATE
                // =============================================

                state.stats.total =
                    safeNonNegativeInteger(
                        state.stats.total
                    )
                    +
                    1;


                const status =
                    normalizeFeedbackStatus(
                        feedback
                    )
                    ??
                    "pending";


                incrementStatusStat(
                    state.stats,
                    status
                );
            },


            postFeedbackFailure: (
                state,
                action
            ) => {
                state.isCreating =
                    false;


                state.mutationError =
                    normalizeError(
                        action.payload,

                        "Feedback yuborishda xatolik yuz berdi."
                    );
            },


            // =================================================
            // UPDATE
            // =================================================

            updateFeedbackStart: (
                state,
                action
            ) => {
                state.isUpdating =
                    true;

                state.updatingId =
                    action.payload
                    ??
                    null;

                state.mutationError =
                    null;
            },


            updateFeedbackSuccess: (
                state,
                action
            ) => {
                state.isUpdating =
                    false;

                state.updatingId =
                    null;

                state.mutationError =
                    null;


                const feedback =
                    normalizeFeedbackPayload(
                        action.payload
                    );


                if (
                    !feedback
                    ||
                    feedback.id ===
                        undefined
                    ||
                    feedback.id ===
                        null
                ) {
                    return;
                }


                // =============================================
                // MY LIST
                // =============================================

                const myIndex =
                    state.myFeedbacks.findIndex(
                        (
                            item
                        ) => (
                            item?.id ===
                            feedback.id
                        )
                    );


                if (
                    myIndex !==
                    -1
                ) {
                    state.myFeedbacks[
                        myIndex
                    ] =
                        feedback;
                }


                // =============================================
                // PUBLIC LIST
                // =============================================

                const publicIndex =
                    state.feedbacks.findIndex(
                        (
                            item
                        ) => (
                            item?.id ===
                            feedback.id
                        )
                    );


                if (
                    publicIndex !==
                    -1
                ) {
                    state.feedbacks[
                        publicIndex
                    ] =
                        feedback;
                }
            },


            updateFeedbackFailure: (
                state,
                action
            ) => {
                state.isUpdating =
                    false;

                state.updatingId =
                    null;


                state.mutationError =
                    normalizeError(
                        action.payload,

                        "Feedbackni yangilashda xatolik yuz berdi."
                    );
            },


            // =================================================
            // DELETE
            // =================================================

            deleteFeedbackStart: (
                state,
                action
            ) => {
                state.isDeleting =
                    true;

                state.deletingId =
                    action.payload
                    ??
                    null;

                state.mutationError =
                    null;
            },


            deleteFeedbackSuccess: (
                state,
                action
            ) => {
                state.isDeleting =
                    false;

                state.deletingId =
                    null;

                state.mutationError =
                    null;


                const feedbackId =
                    action.payload;


                if (
                    feedbackId ===
                    undefined
                    ||
                    feedbackId ===
                    null
                ) {
                    return;
                }


                // =============================================
                // MY LIST
                // =============================================

                const deletedMyFeedback =
                    state.myFeedbacks.find(
                        (
                            item
                        ) => (
                            item?.id ===
                            feedbackId
                        )
                    );


                if (
                    deletedMyFeedback
                ) {
                    state.myFeedbacks =
                        state.myFeedbacks.filter(
                            (
                                item
                            ) => (
                                item?.id !==
                                feedbackId
                            )
                        );


                    state.myCount =
                        Math.max(
                            0,

                            state.myCount -
                            1
                        );


                    state.myTotalPages =
                        calculateTotalPages(
                            state.myCount,
                            state.myPageSize
                        );


                    state.myPage =
                        Math.min(
                            state.myPage,
                            state.myTotalPages
                        );


                    // =========================================
                    // STATS
                    // =========================================

                    state.stats.total =
                        Math.max(
                            0,

                            safeNonNegativeInteger(
                                state.stats.total
                            )
                            -
                            1
                        );


                    decrementStatusStat(
                        state.stats,

                        normalizeFeedbackStatus(
                            deletedMyFeedback
                        )
                    );
                }


                // =============================================
                // PUBLIC LIST
                // =============================================

                const deletedPublicFeedback =
                    state.feedbacks.find(
                        (
                            item
                        ) => (
                            item?.id ===
                            feedbackId
                        )
                    );


                if (
                    deletedPublicFeedback
                ) {
                    state.feedbacks =
                        state.feedbacks.filter(
                            (
                                item
                            ) => (
                                item?.id !==
                                feedbackId
                            )
                        );


                    state.count =
                        Math.max(
                            0,

                            state.count -
                            1
                        );


                    state.totalPages =
                        calculateTotalPages(
                            state.count,
                            state.pageSize
                        );


                    state.page =
                        Math.min(
                            state.page,
                            state.totalPages
                        );
                }
            },


            deleteFeedbackFailure: (
                state,
                action
            ) => {
                state.isDeleting =
                    false;

                state.deletingId =
                    null;


                state.mutationError =
                    normalizeError(
                        action.payload,

                        "Feedbackni o‘chirishda xatolik yuz berdi."
                    );
            },


            // =================================================
            // REPLACE ONE FEEDBACK
            //
            // WebSocket/admin refresh yoki boshqa flow uchun.
            // =================================================

            replaceFeedback: (
                state,
                action
            ) => {
                const feedback =
                    normalizeFeedbackPayload(
                        action.payload
                    );


                if (
                    !feedback
                    ||
                    feedback.id ===
                        undefined
                    ||
                    feedback.id ===
                        null
                ) {
                    return;
                }


                // =============================================
                // MY LIST
                // =============================================

                const myIndex =
                    state.myFeedbacks.findIndex(
                        (
                            item
                        ) => (
                            item?.id ===
                            feedback.id
                        )
                    );


                if (
                    myIndex !==
                    -1
                ) {
                    const previousFeedback =
                        state.myFeedbacks[
                            myIndex
                        ];


                    const previousStatus =
                        normalizeFeedbackStatus(
                            previousFeedback
                        );


                    const nextStatus =
                        normalizeFeedbackStatus(
                            feedback
                        );


                    state.myFeedbacks[
                        myIndex
                    ] =
                        feedback;


                    if (
                        previousStatus !==
                        nextStatus
                    ) {
                        decrementStatusStat(
                            state.stats,
                            previousStatus
                        );


                        incrementStatusStat(
                            state.stats,
                            nextStatus
                        );
                    }
                }


                // =============================================
                // PUBLIC LIST
                //
                // Public API faqat approved feedbacklarni
                // qaytaradi.
                //
                // Existing item statusi approved bo‘lmay
                // qolsa public listdan chiqariladi.
                //
                // Yangi approved feedbackni listga qo‘shish
                // server pagination/order bilan refresh orqali
                // bajariladi.
                // =============================================

                const publicIndex =
                    state.feedbacks.findIndex(
                        (
                            item
                        ) => (
                            item?.id ===
                            feedback.id
                        )
                    );


                if (
                    publicIndex !==
                    -1
                ) {
                    if (
                        feedback.status ===
                        "approved"
                    ) {
                        state.feedbacks[
                            publicIndex
                        ] =
                            feedback;
                    } else {
                        state.feedbacks.splice(
                            publicIndex,
                            1
                        );


                        state.count =
                            Math.max(
                                0,

                                state.count -
                                1
                            );


                        state.totalPages =
                            calculateTotalPages(
                                state.count,
                                state.pageSize
                            );


                        state.page =
                            Math.min(
                                state.page,
                                state.totalPages
                            );
                    }
                }
            },


            // =================================================
            // SET STATS
            // =================================================

            setFeedbackStats: (
                state,
                action
            ) => {
                state.stats =
                    normalizeStats(
                        action.payload
                    );
            },


            // =================================================
            // CLEAR ERRORS
            // =================================================

            clearFeedbackError: (
                state
            ) => {
                state.error =
                    null;

                state.myError =
                    null;

                state.statsError =
                    null;

                state.mutationError =
                    null;
            },


            // =================================================
            // CLEAR MY DATA
            //
            // Logout paytida ishlatiladi.
            // =================================================

            clearMyFeedbackData: (
                state
            ) => {
                state.myFeedbacks =
                    [];

                state.myCount =
                    0;

                state.myPage =
                    1;

                state.myPageSize =
                    FEEDBACK_DEFAULT_PAGE_SIZE;

                state.myTotalPages =
                    1;

                state.myNext =
                    null;

                state.myPrevious =
                    null;


                state.stats = {
                    ...initialStats,
                };


                state.isMyLoading =
                    false;

                state.isStatsLoading =
                    false;

                state.isCreating =
                    false;

                state.isUpdating =
                    false;

                state.isDeleting =
                    false;


                state.updatingId =
                    null;

                state.deletingId =
                    null;


                state.hasMyLoaded =
                    false;

                state.hasStatsLoaded =
                    false;


                state.myError =
                    null;

                state.statsError =
                    null;

                state.mutationError =
                    null;
            },


            // =================================================
            // RESET
            // =================================================

            resetFeedbackState: () => {
                return {
                    ...initialState,

                    feedbacks:
                        [],

                    myFeedbacks:
                        [],

                    stats: {
                        ...initialStats,
                    },
                };
            },
        },
    });


// =========================================================
// ACTIONS
// =========================================================

export const {
    getFeedbackStart,
    getFeedbackSuccess,
    getFeedbackFailure,

    getMyFeedbackStart,
    getMyFeedbackSuccess,
    getMyFeedbackFailure,

    getFeedbackStatsStart,
    getFeedbackStatsSuccess,
    getFeedbackStatsFailure,

    postFeedbackStart,
    postFeedbackSuccess,
    postFeedbackFailure,

    updateFeedbackStart,
    updateFeedbackSuccess,
    updateFeedbackFailure,

    deleteFeedbackStart,
    deleteFeedbackSuccess,
    deleteFeedbackFailure,

    replaceFeedback,

    setFeedbackStats,

    clearFeedbackError,
    clearMyFeedbackData,

    resetFeedbackState,
} = FeedbackSlice.actions;


// =========================================================
// SELECTORS
// =========================================================

export const selectFeedbackState = (
    state
) => {
    return (
        state?.feedback
        ||
        initialState
    );
};


// =========================================================
// PUBLIC
// =========================================================

export const selectFeedbacks = (
    state
) => {
    return (
        selectFeedbackState(
            state
        ).feedbacks
    );
};


export const selectFeedbackLoading = (
    state
) => {
    return (
        selectFeedbackState(
            state
        ).isLoading
    );
};


export const selectFeedbackError = (
    state
) => {
    return (
        selectFeedbackState(
            state
        ).error
    );
};


export const selectFeedbackPagination = (
    state
) => {
    const feedback =
        selectFeedbackState(
            state
        );


    return {
        count:
            feedback.count,

        page:
            feedback.page,

        pageSize:
            feedback.pageSize,

        totalPages:
            feedback.totalPages,

        next:
            feedback.next,

        previous:
            feedback.previous,
    };
};


// =========================================================
// MY FEEDBACK
// =========================================================

export const selectMyFeedbacks = (
    state
) => {
    return (
        selectFeedbackState(
            state
        ).myFeedbacks
    );
};


export const selectMyFeedbackLoading = (
    state
) => {
    return (
        selectFeedbackState(
            state
        ).isMyLoading
    );
};


export const selectMyFeedbackPagination = (
    state
) => {
    const feedback =
        selectFeedbackState(
            state
        );


    return {
        count:
            feedback.myCount,

        page:
            feedback.myPage,

        pageSize:
            feedback.myPageSize,

        totalPages:
            feedback.myTotalPages,

        next:
            feedback.myNext,

        previous:
            feedback.myPrevious,
    };
};


// =========================================================
// STATS
// =========================================================

export const selectFeedbackStats = (
    state
) => {
    return (
        selectFeedbackState(
            state
        ).stats
    );
};


export const selectFeedbackStatsLoading = (
    state
) => {
    return (
        selectFeedbackState(
            state
        ).isStatsLoading
    );
};


// =========================================================
// MUTATION STATE
// =========================================================

export const selectFeedbackMutationState = (
    state
) => {
    const feedback =
        selectFeedbackState(
            state
        );


    return {
        isCreating:
            feedback.isCreating,

        isUpdating:
            feedback.isUpdating,

        isDeleting:
            feedback.isDeleting,

        updatingId:
            feedback.updatingId,

        deletingId:
            feedback.deletingId,

        error:
            feedback.mutationError,
    };
};


// =========================================================
// DEFAULT REDUCER
// =========================================================

export default FeedbackSlice.reducer;