// src/components/feedback/useFeedbackPage.js

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    useNavigate,
} from "react-router-dom";

import FeedbackService, {
    getFeedbackServiceErrorMessage,
    isFeedbackRequestCanceled,
} from "../../services/feedback";

import {
    FEEDBACK_DEFAULT_PAGE_SIZE,
    clearMyFeedbackData,

    deleteFeedbackFailure,
    deleteFeedbackStart,
    deleteFeedbackSuccess,

    getFeedbackFailure,
    getFeedbackStart,
    getFeedbackSuccess,

    getFeedbackStatsFailure,
    getFeedbackStatsStart,
    getFeedbackStatsSuccess,

    getMyFeedbackFailure,
    getMyFeedbackStart,
    getMyFeedbackSuccess,

    postFeedbackSuccess,

    selectFeedbackState,

    updateFeedbackFailure,
    updateFeedbackStart,
    updateFeedbackSuccess,
} from "../../features/feedback";

import {
    siteToast,
} from "../ui/AuthToast";

import {
    FEEDBACK_STATUS_FILTERS,
    canModifyFeedback,
} from "./feedbackHelpers";


// =========================================================
// PAGINATION
// =========================================================

const createPaginationState = () => ({
    count: 0,
    page: 1,
    pageSize: FEEDBACK_DEFAULT_PAGE_SIZE,
    totalPages: 1,
    next: null,
    previous: null,
    hasNext: false,
    hasPrevious: false,
});


const toPositiveInteger = (
    value,
    fallback = null
) => {
    const number = Number(value);

    if (
        !Number.isInteger(number)
        ||
        number <= 0
    ) {
        return fallback;
    }

    return number;
};


const toNonNegativeInteger = (
    value,
    fallback = 0
) => {
    const number = Number(value);

    if (
        !Number.isFinite(number)
        ||
        number < 0
    ) {
        return fallback;
    }

    return Math.trunc(number);
};


const normalizePagination = (
    response,
    requestedPage = 1
) => {
    if (
        Array.isArray(response)
    ) {
        return {
            count: response.length,
            page: requestedPage,
            pageSize: FEEDBACK_DEFAULT_PAGE_SIZE,
            totalPages: 1,
            next: null,
            previous: null,
            hasNext: false,
            hasPrevious: false,
        };
    }

    const source =
        response
        &&
        typeof response === "object"
            ? response
            : {};

    const results =
        Array.isArray(
            source.results
        )
            ? source.results
            : [];

    const count =
        toNonNegativeInteger(
            source.count,
            results.length
        );

    const pageSize =
        toPositiveInteger(
            source.page_size,
            FEEDBACK_DEFAULT_PAGE_SIZE
        );

    const calculatedTotalPages =
        Math.max(
            1,
            Math.ceil(
                count / pageSize
            )
        );

    const totalPages =
        toPositiveInteger(
            source.total_pages,
            calculatedTotalPages
        );

    const page =
        Math.min(
            toPositiveInteger(
                source.page,
                requestedPage
            ),
            totalPages
        );

    const next =
        source.next
        ??
        null;

    const previous =
        source.previous
        ??
        null;

    return {
        count,
        page,
        pageSize,
        totalPages,
        next,
        previous,

        hasNext:
            Boolean(next)
            ||
            page < totalPages,

        hasPrevious:
            Boolean(previous)
            ||
            page > 1,
    };
};


// =========================================================
// VALIDATION
// =========================================================

const isValidFeedbackStatus = (
    value
) => {
    return FEEDBACK_STATUS_FILTERS.some(
        (
            item
        ) => item.value === value
    );
};


const getFeedbackId = (
    feedback
) => {
    const id =
        Number(
            feedback?.id
            ??
            feedback
        );

    if (
        !Number.isInteger(id)
        ||
        id <= 0
    ) {
        return null;
    }

    return id;
};


const getValidPage = (
    value
) => {
    return toPositiveInteger(
        value,
        null
    );
};


// =========================================================
// HOOK
// =========================================================

const useFeedbackPage = () => {
    const dispatch =
        useDispatch();

    const navigate =
        useNavigate();

    // =====================================================
    // AUTH
    // =====================================================

    const isLoggedIn =
        useSelector(
            (
                state
            ) => Boolean(
                state
                    ?.auth
                    ?.isLoggedIn
            )
        );

    // =====================================================
    // REDUX
    // =====================================================

    const feedbackState =
        useSelector(
            selectFeedbackState
        );

    const {
        // Public
        feedbacks:
            publicFeedbacks,

        count:
            publicCountFromRedux,

        isLoading:
            isPublicLoading,

        error:
            publicError,

        hasLoaded:
            hasPublicLoaded,

        // My
        myFeedbacks,

        myCount:
            myCountFromRedux,

        isMyLoading,

        myError,

        hasMyLoaded,

        // Stats
        stats,

        isStatsLoading,

        statsError,

        hasStatsLoaded,

        // Mutations
        isUpdating,
        isDeleting,

        updatingId,
        deletingId,

        mutationError,
    } = feedbackState;

    // =====================================================
    // PAGINATION STATE
    // =====================================================

    const [
        publicPagination,
        setPublicPagination,
    ] = useState(
        createPaginationState
    );

    const [
        myPagination,
        setMyPagination,
    ] = useState(
        createPaginationState
    );

    // =====================================================
    // FILTER
    // =====================================================

    const [
        activeStatus,
        setActiveStatusState,
    ] = useState(
        "all"
    );

    // =====================================================
    // CREATE MODAL
    // =====================================================

    const [
        isCreateModalOpen,
        setIsCreateModalOpen,
    ] = useState(
        false
    );

    // =====================================================
    // EDIT MODAL
    // =====================================================

    const [
        editingFeedback,
        setEditingFeedback,
    ] = useState(
        null
    );

    const isEditModalOpen =
        Boolean(
            editingFeedback
        );

    // =====================================================
    // MANUAL REFRESH
    // =====================================================

    const [
        isRefreshing,
        setIsRefreshing,
    ] = useState(
        false
    );

    // =====================================================
    // REQUEST CONTROLLERS
    // =====================================================

    const publicControllerRef =
        useRef(null);

    const myControllerRef =
        useRef(null);

    const statsControllerRef =
        useRef(null);

    // =====================================================
    // ABORT HELPERS
    // =====================================================

    const abortPublicRequest =
        useCallback(
            () => {
                if (
                    publicControllerRef.current
                ) {
                    publicControllerRef
                        .current
                        .abort();

                    publicControllerRef.current =
                        null;
                }
            },
            []
        );


    const abortMyRequest =
        useCallback(
            () => {
                if (
                    myControllerRef.current
                ) {
                    myControllerRef
                        .current
                        .abort();

                    myControllerRef.current =
                        null;
                }
            },
            []
        );


    const abortStatsRequest =
        useCallback(
            () => {
                if (
                    statsControllerRef.current
                ) {
                    statsControllerRef
                        .current
                        .abort();

                    statsControllerRef.current =
                        null;
                }
            },
            []
        );

    // =====================================================
    // LOAD PUBLIC
    // =====================================================

    const loadPublicFeedbacks =
        useCallback(
            async (
                pageOverride = 1
            ) => {
                const requestedPage =
                    getValidPage(
                        pageOverride
                    );

                if (
                    !requestedPage
                ) {
                    return false;
                }

                abortPublicRequest();

                const controller =
                    new AbortController();

                publicControllerRef.current =
                    controller;

                dispatch(
                    getFeedbackStart()
                );

                try {
                    const response =
                        await FeedbackService
                            .getFeedbacks({
                                page:
                                    requestedPage,

                                pageSize:
                                    FEEDBACK_DEFAULT_PAGE_SIZE,

                                signal:
                                    controller.signal,
                            });

                    // Request stale bo‘lib qolgan.
                    if (
                        publicControllerRef.current
                        !==
                        controller
                    ) {
                        return false;
                    }

                    dispatch(
                        getFeedbackSuccess(
                            response
                        )
                    );

                    setPublicPagination(
                        normalizePagination(
                            response,
                            requestedPage
                        )
                    );

                    return true;
                } catch (
                    error
                ) {
                    if (
                        isFeedbackRequestCanceled(
                            error
                        )
                    ) {
                        return false;
                    }

                    dispatch(
                        getFeedbackFailure(
                            getFeedbackServiceErrorMessage(
                                error,
                                "Tasdiqlangan feedbacklarni yuklashda xatolik yuz berdi."
                            )
                        )
                    );

                    return false;
                } finally {
                    if (
                        publicControllerRef.current
                        ===
                        controller
                    ) {
                        publicControllerRef.current =
                            null;
                    }
                }
            },
            [
                abortPublicRequest,
                dispatch,
            ]
        );

    // =====================================================
    // LOAD MY FEEDBACKS
    // =====================================================

    const loadMyFeedbacks =
        useCallback(
            async ({
                status = "all",
                page = 1,
            } = {}) => {
                if (
                    !isLoggedIn
                ) {
                    return false;
                }

                const requestedPage =
                    getValidPage(
                        page
                    );

                if (
                    !requestedPage
                ) {
                    return false;
                }

                const normalizedStatus =
                    isValidFeedbackStatus(
                        status
                    )
                        ? status
                        : "all";

                abortMyRequest();

                const controller =
                    new AbortController();

                myControllerRef.current =
                    controller;

                dispatch(
                    getMyFeedbackStart()
                );

                try {
                    const response =
                        await FeedbackService
                            .getMyFeedbacks({
                                status:
                                    normalizedStatus ===
                                    "all"
                                        ? ""
                                        : normalizedStatus,

                                page:
                                    requestedPage,

                                pageSize:
                                    FEEDBACK_DEFAULT_PAGE_SIZE,

                                signal:
                                    controller.signal,
                            });

                    if (
                        myControllerRef.current
                        !==
                        controller
                    ) {
                        return false;
                    }

                    dispatch(
                        getMyFeedbackSuccess(
                            response
                        )
                    );

                    setMyPagination(
                        normalizePagination(
                            response,
                            requestedPage
                        )
                    );

                    return true;
                } catch (
                    error
                ) {
                    if (
                        isFeedbackRequestCanceled(
                            error
                        )
                    ) {
                        return false;
                    }

                    dispatch(
                        getMyFeedbackFailure(
                            getFeedbackServiceErrorMessage(
                                error,
                                "Feedbacklaringizni yuklashda xatolik yuz berdi."
                            )
                        )
                    );

                    return false;
                } finally {
                    if (
                        myControllerRef.current
                        ===
                        controller
                    ) {
                        myControllerRef.current =
                            null;
                    }
                }
            },
            [
                abortMyRequest,
                dispatch,
                isLoggedIn,
            ]
        );

    // =====================================================
    // LOAD STATS
    // =====================================================

    const loadStats =
        useCallback(
            async () => {
                if (
                    !isLoggedIn
                ) {
                    return false;
                }

                abortStatsRequest();

                const controller =
                    new AbortController();

                statsControllerRef.current =
                    controller;

                dispatch(
                    getFeedbackStatsStart()
                );

                try {
                    const response =
                        await FeedbackService
                            .getMyFeedbackStats({
                                signal:
                                    controller.signal,
                            });

                    if (
                        statsControllerRef.current
                        !==
                        controller
                    ) {
                        return false;
                    }

                    dispatch(
                        getFeedbackStatsSuccess(
                            response
                        )
                    );

                    return true;
                } catch (
                    error
                ) {
                    if (
                        isFeedbackRequestCanceled(
                            error
                        )
                    ) {
                        return false;
                    }

                    dispatch(
                        getFeedbackStatsFailure(
                            getFeedbackServiceErrorMessage(
                                error,
                                "Feedback statistikasini yuklashda xatolik yuz berdi."
                            )
                        )
                    );

                    return false;
                } finally {
                    if (
                        statsControllerRef.current
                        ===
                        controller
                    ) {
                        statsControllerRef.current =
                            null;
                    }
                }
            },
            [
                abortStatsRequest,
                dispatch,
                isLoggedIn,
            ]
        );

    // =====================================================
    // INITIAL PUBLIC
    // =====================================================

    useEffect(
        () => {
            loadPublicFeedbacks(
                1
            );

            return () => {
                abortPublicRequest();
            };
        },
        [
            abortPublicRequest,
            loadPublicFeedbacks,
        ]
    );

    // =====================================================
    // MY FILTER / AUTH
    // =====================================================

    useEffect(
        () => {
            if (
                !isLoggedIn
            ) {
                abortMyRequest();

                dispatch(
                    clearMyFeedbackData()
                );

                setMyPagination(
                    createPaginationState()
                );

                setActiveStatusState(
                    "all"
                );

                setEditingFeedback(
                    null
                );

                setIsCreateModalOpen(
                    false
                );

                return undefined;
            }

            loadMyFeedbacks({
                status:
                    activeStatus,

                page:
                    1,
            });

            return () => {
                abortMyRequest();
            };
        },
        [
            abortMyRequest,
            activeStatus,
            dispatch,
            isLoggedIn,
            loadMyFeedbacks,
        ]
    );

    // =====================================================
    // STATS
    // =====================================================

    useEffect(
        () => {
            if (
                !isLoggedIn
            ) {
                abortStatsRequest();

                return undefined;
            }

            loadStats();

            return () => {
                abortStatsRequest();
            };
        },
        [
            abortStatsRequest,
            isLoggedIn,
            loadStats,
        ]
    );

    // =====================================================
    // FILTER CHANGE
    // =====================================================

    const setActiveStatus =
        useCallback(
            (
                nextStatus
            ) => {
                if (
                    !isValidFeedbackStatus(
                        nextStatus
                    )
                ) {
                    return;
                }

                if (
                    nextStatus ===
                    activeStatus
                ) {
                    return;
                }

                setActiveStatusState(
                    nextStatus
                );
            },
            [
                activeStatus,
            ]
        );

    // =====================================================
    // PUBLIC PAGE
    // =====================================================

    const handlePublicPageChange =
        useCallback(
            async (
                nextPage
            ) => {
                const page =
                    getValidPage(
                        nextPage
                    );

                if (
                    !page
                    ||
                    page >
                    publicPagination.totalPages
                    ||
                    page ===
                    publicPagination.page
                    ||
                    isPublicLoading
                ) {
                    return false;
                }

                return loadPublicFeedbacks(
                    page
                );
            },
            [
                isPublicLoading,
                loadPublicFeedbacks,
                publicPagination.page,
                publicPagination.totalPages,
            ]
        );

    // =====================================================
    // MY PAGE
    // =====================================================

    const handleMyPageChange =
        useCallback(
            async (
                nextPage
            ) => {
                if (
                    !isLoggedIn
                ) {
                    return false;
                }

                const page =
                    getValidPage(
                        nextPage
                    );

                if (
                    !page
                    ||
                    page >
                    myPagination.totalPages
                    ||
                    page ===
                    myPagination.page
                    ||
                    isMyLoading
                ) {
                    return false;
                }

                return loadMyFeedbacks({
                    status:
                        activeStatus,

                    page,
                });
            },
            [
                activeStatus,
                isLoggedIn,
                isMyLoading,
                loadMyFeedbacks,
                myPagination.page,
                myPagination.totalPages,
            ]
        );

    // =====================================================
    // REFRESH
    // =====================================================

    const handleRefresh =
        useCallback(
            async () => {
                if (
                    isRefreshing
                ) {
                    return false;
                }

                setIsRefreshing(
                    true
                );

                try {
                    const requests = [
                        loadPublicFeedbacks(
                            publicPagination.page
                        ),
                    ];

                    if (
                        isLoggedIn
                    ) {
                        requests.push(
                            loadMyFeedbacks({
                                status:
                                    activeStatus,

                                page:
                                    myPagination.page,
                            })
                        );

                        requests.push(
                            loadStats()
                        );
                    }

                    const results =
                        await Promise.all(
                            requests
                        );

                    return results.every(
                        Boolean
                    );
                } finally {
                    setIsRefreshing(
                        false
                    );
                }
            },
            [
                activeStatus,
                isLoggedIn,
                isRefreshing,
                loadMyFeedbacks,
                loadPublicFeedbacks,
                loadStats,
                myPagination.page,
                publicPagination.page,
            ]
        );

    // =====================================================
    // CREATED
    // =====================================================

    const handleCreated =
        useCallback(
            async (
                createdFeedback
            ) => {
                if (
                    createdFeedback
                ) {
                    dispatch(
                        postFeedbackSuccess(
                            createdFeedback
                        )
                    );
                }

                if (
                    !isLoggedIn
                ) {
                    return;
                }

                // Yangi feedback pending bo‘ladi.
                // "all" ga qaytib 1-sahifani ko‘rsatamiz.
                if (
                    activeStatus !==
                    "all"
                ) {
                    setActiveStatusState(
                        "all"
                    );

                    await loadStats();

                    return;
                }

                await Promise.all([
                    loadMyFeedbacks({
                        status:
                            "all",

                        page:
                            1,
                    }),

                    loadStats(),
                ]);
            },
            [
                activeStatus,
                dispatch,
                isLoggedIn,
                loadMyFeedbacks,
                loadStats,
            ]
        );

    // =====================================================
    // CREATE MODAL
    // =====================================================

    const handleOpenCreate =
        useCallback(
            () => {
                if (
                    !isLoggedIn
                ) {
                    navigate(
                        "/login"
                    );

                    return;
                }

                setIsCreateModalOpen(
                    true
                );
            },
            [
                isLoggedIn,
                navigate,
            ]
        );


    const handleCloseCreate =
        useCallback(
            () => {
                setIsCreateModalOpen(
                    false
                );
            },
            []
        );

    // =====================================================
    // EDIT MODAL
    // =====================================================

    const handleOpenEdit =
        useCallback(
            (
                feedback
            ) => {
                if (
                    !isLoggedIn
                ) {
                    navigate(
                        "/login"
                    );

                    return;
                }

                if (
                    !feedback
                    ||
                    !canModifyFeedback(
                        feedback
                    )
                ) {
                    siteToast.warning(
                        "Bu feedbackni tahrirlash mumkin emas."
                    );

                    return;
                }

                setEditingFeedback(
                    feedback
                );
            },
            [
                isLoggedIn,
                navigate,
            ]
        );


    const handleCloseEdit =
        useCallback(
            () => {
                if (
                    isUpdating
                ) {
                    return;
                }

                setEditingFeedback(
                    null
                );
            },
            [
                isUpdating,
            ]
        );

    // =====================================================
    // UPDATE
    // =====================================================

    const handleUpdateFeedback =
        useCallback(
            async (
                feedbackId,
                values
            ) => {
                const id =
                    getFeedbackId(
                        feedbackId
                    );

                if (
                    !id
                ) {
                    siteToast.error(
                        "Feedback ID noto‘g‘ri."
                    );

                    return false;
                }

                if (
                    isUpdating
                    ||
                    isDeleting
                ) {
                    return false;
                }

                const editingId =
                    getFeedbackId(
                        editingFeedback
                    );

                if (
                    !editingFeedback
                    ||
                    editingId !== id
                    ||
                    !canModifyFeedback(
                        editingFeedback
                    )
                ) {
                    siteToast.warning(
                        "Bu feedbackni tahrirlash mumkin emas."
                    );

                    return false;
                }

                dispatch(
                    updateFeedbackStart(
                        id
                    )
                );

                const toastId =
                    siteToast.loading(
                        "Feedback yangilanmoqda..."
                    );

                try {
                    const response =
                        await FeedbackService
                            .updateFeedback(
                                id,
                                values
                            );

                    const updatedFeedback =
                        response?.feedback
                        ||
                        response;

                    dispatch(
                        updateFeedbackSuccess(
                            updatedFeedback
                        )
                    );

                    setEditingFeedback(
                        null
                    );

                    siteToast.update(
                        toastId,
                        "success",
                        "Feedback muvaffaqiyatli yangilandi."
                    );

                    await Promise.all([
                        loadMyFeedbacks({
                            status:
                                activeStatus,

                            page:
                                myPagination.page,
                        }),

                        loadStats(),
                    ]);

                    return true;
                } catch (
                    error
                ) {
                    if (
                        isFeedbackRequestCanceled(
                            error
                        )
                    ) {
                        siteToast.update(
                            toastId,
                            "info",
                            "Feedbackni yangilash bekor qilindi."
                        );

                        return false;
                    }

                    const message =
                        getFeedbackServiceErrorMessage(
                            error,
                            "Feedbackni yangilashda xatolik yuz berdi."
                        );

                    dispatch(
                        updateFeedbackFailure(
                            message
                        )
                    );

                    siteToast.update(
                        toastId,
                        "error",
                        message
                    );

                    return false;
                }
            },
            [
                activeStatus,
                dispatch,
                editingFeedback,
                isDeleting,
                isUpdating,
                loadMyFeedbacks,
                loadStats,
                myPagination.page,
            ]
        );

    // =====================================================
    // DELETE
    // =====================================================

    const handleDeleteFeedback =
        useCallback(
            async (
                feedback
            ) => {
                const id =
                    getFeedbackId(
                        feedback
                    );

                if (
                    !id
                ) {
                    siteToast.error(
                        "Feedback ID noto‘g‘ri."
                    );

                    return false;
                }

                if (
                    !canModifyFeedback(
                        feedback
                    )
                ) {
                    siteToast.warning(
                        "Bu feedbackni o‘chirish mumkin emas."
                    );

                    return false;
                }

                if (
                    isDeleting
                    ||
                    isUpdating
                ) {
                    return false;
                }

                const isLastItemOnCurrentPage =
                    myPagination.page > 1
                    &&
                    myFeedbacks.length === 1
                    &&
                    Number(
                        myFeedbacks[0]?.id
                    ) === id;

                const pageAfterDelete =
                    isLastItemOnCurrentPage
                        ? myPagination.page - 1
                        : myPagination.page;

                dispatch(
                    deleteFeedbackStart(
                        id
                    )
                );

                const toastId =
                    siteToast.loading(
                        "Feedback o‘chirilmoqda..."
                    );

                try {
                    const deletedId =
                        await FeedbackService
                            .deleteFeedback(
                                id
                            );

                    dispatch(
                        deleteFeedbackSuccess(
                            deletedId
                        )
                    );

                    siteToast.update(
                        toastId,
                        "success",
                        "Feedback muvaffaqiyatli o‘chirildi."
                    );

                    await Promise.all([
                        loadMyFeedbacks({
                            status:
                                activeStatus,

                            page:
                                pageAfterDelete,
                        }),

                        loadStats(),
                    ]);

                    return true;
                } catch (
                    error
                ) {
                    if (
                        isFeedbackRequestCanceled(
                            error
                        )
                    ) {
                        siteToast.update(
                            toastId,
                            "info",
                            "Feedbackni o‘chirish bekor qilindi."
                        );

                        return false;
                    }

                    const message =
                        getFeedbackServiceErrorMessage(
                            error,
                            "Feedbackni o‘chirishda xatolik yuz berdi."
                        );

                    dispatch(
                        deleteFeedbackFailure(
                            message
                        )
                    );

                    siteToast.update(
                        toastId,
                        "error",
                        message
                    );

                    return false;
                }
            },
            [
                activeStatus,
                dispatch,
                isDeleting,
                isUpdating,
                loadMyFeedbacks,
                loadStats,
                myFeedbacks,
                myPagination.page,
            ]
        );

    // =====================================================
    // COMBINED ERROR
    // =====================================================

    const error =
        useMemo(
            () => {
                return (
                    publicError
                    ||
                    (
                        isLoggedIn
                            ? (
                                myError
                                ||
                                statsError
                                ||
                                mutationError
                            )
                            : null
                    )
                    ||
                    null
                );
            },
            [
                isLoggedIn,
                mutationError,
                myError,
                publicError,
                statsError,
            ]
        );

    // =====================================================
    // LOADING FLAGS
    // =====================================================

    const isInitialLoading =
        isPublicLoading
        &&
        !hasPublicLoaded;


    const isMyInitialLoading =
        isLoggedIn
        &&
        isMyLoading
        &&
        !hasMyLoaded;


    const isStatsInitialLoading =
        isLoggedIn
        &&
        isStatsLoading
        &&
        !hasStatsLoaded;


    const isAnyLoading =
        isPublicLoading
        ||
        isMyLoading
        ||
        isStatsLoading
        ||
        isUpdating
        ||
        isDeleting;

    // =====================================================
    // COUNTS
    // =====================================================

    const publicCount =
        Math.max(
            publicPagination.count,
            Number(
                publicCountFromRedux
            ) || 0
        );


    const myCount =
        Math.max(
            myPagination.count,
            Number(
                myCountFromRedux
            ) || 0
        );

    // =====================================================
    // RETURN
    // =====================================================

    return {
        // Auth
        isLoggedIn,

        // Public
        publicFeedbacks,
        publicCount,
        publicPagination,
        isPublicLoading,
        hasPublicLoaded,
        handlePublicPageChange,

        // My
        myFeedbacks,
        myCount,
        myPagination,
        isMyLoading,
        hasMyLoaded,
        handleMyPageChange,

        // Stats
        stats,
        isStatsLoading,
        hasStatsLoaded,

        // Filter
        activeStatus,
        statusFilters:
            FEEDBACK_STATUS_FILTERS,
        setActiveStatus,

        // Create
        isCreateModalOpen,
        handleOpenCreate,
        handleCloseCreate,
        handleCreated,

        // Edit
        editingFeedback,
        isEditModalOpen,
        isUpdating,
        updatingId,
        handleOpenEdit,
        handleCloseEdit,
        handleUpdateFeedback,

        // Delete
        isDeleting,
        deletingId,
        handleDeleteFeedback,

        // Request
        isRefreshing,
        isInitialLoading,
        isMyInitialLoading,
        isStatsInitialLoading,
        isAnyLoading,
        error,

        // Loaders / actions
        handleRefresh,
        loadPublicFeedbacks,
        loadMyFeedbacks,
        loadStats,
    };
};

export default useFeedbackPage;