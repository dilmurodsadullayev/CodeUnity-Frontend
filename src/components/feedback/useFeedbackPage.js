// src/components/feedback/useFeedbackPage.js

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

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
import { siteToast } from "../ui/AuthToast";
import {
    FEEDBACK_STATUS_FILTERS,
    canModifyFeedback,
} from "./feedbackHelpers";

// =========================================================
// VALID STATUS
// =========================================================

const isValidFeedbackStatus = (value) => {
    return FEEDBACK_STATUS_FILTERS.some(
        (item) => item.value === value
    );
};

// =========================================================
// VALID FEEDBACK ID
// =========================================================

const getFeedbackId = (feedback) => {
    const id = Number(
        feedback?.id ?? feedback
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

// =========================================================
// VALID PAGE
// =========================================================

const getValidPage = (value) => {
    const page = Number(value);

    if (
        !Number.isInteger(page)
        ||
        page <= 0
    ) {
        return null;
    }

    return page;
};

// =========================================================
// SAFE TOTAL PAGES
// =========================================================

const getSafeTotalPages = (value) => {
    const totalPages = Number(value);

    if (
        !Number.isInteger(totalPages)
        ||
        totalPages <= 0
    ) {
        return 1;
    }

    return totalPages;
};

// =========================================================
// USE FEEDBACK PAGE
// =========================================================

const useFeedbackPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // =====================================================
    // AUTH
    // =====================================================

    const isLoggedIn = useSelector((state) =>
        Boolean(state?.auth?.isLoggedIn)
    );

    // =====================================================
    // REDUX
    // =====================================================

    const feedbackState = useSelector(
        selectFeedbackState
    );

    const {
        // Public
        feedbacks: publicFeedbacks,
        count: publicCount,
        page: publicPage,
        pageSize: publicPageSize,
        totalPages: publicTotalPages,
        next: publicNext,
        previous: publicPrevious,
        isLoading: isPublicLoading,
        error: publicError,
        hasLoaded: hasPublicLoaded,

        // My feedbacks
        myFeedbacks,
        myCount,
        myPage,
        myPageSize,
        myTotalPages,
        myNext,
        myPrevious,
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
    // FILTER
    // =====================================================

    const [
        activeStatus,
        setActiveStatusState,
    ] = useState("all");

    // =====================================================
    // CREATE MODAL
    // =====================================================

    const [
        isCreateModalOpen,
        setIsCreateModalOpen,
    ] = useState(false);

    // =====================================================
    // EDIT MODAL
    // =====================================================

    const [
        editingFeedback,
        setEditingFeedback,
    ] = useState(null);

    const isEditModalOpen =
        Boolean(editingFeedback);

    // =====================================================
    // REFRESH
    // =====================================================

    const [
        isRefreshing,
        setIsRefreshing,
    ] = useState(false);

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
                    publicControllerRef.current.abort();
                    publicControllerRef.current = null;
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
                    myControllerRef.current.abort();
                    myControllerRef.current = null;
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
                    statsControllerRef.current.abort();
                    statsControllerRef.current = null;
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
    //
    // Backward compatible:
    //
    // loadMyFeedbacks("pending")
    // loadMyFeedbacks("pending", 2)
    // loadMyFeedbacks({ status: "pending", page: 2 })
    // =====================================================

    const loadMyFeedbacks =
        useCallback(
            async (
                statusOrOptions = "all",
                pageOverride = 1
            ) => {
                if (
                    !isLoggedIn
                ) {
                    return false;
                }

                const isOptionsObject =
                    statusOrOptions
                    &&
                    typeof statusOrOptions ===
                        "object"
                    &&
                    !Array.isArray(
                        statusOrOptions
                    );

                const requestedStatus =
                    isOptionsObject
                        ? (
                            statusOrOptions.status
                            ??
                            "all"
                        )
                        : statusOrOptions;

                const requestedPage =
                    getValidPage(
                        isOptionsObject
                            ? (
                                statusOrOptions.page
                                ??
                                1
                            )
                            : pageOverride
                    );

                if (
                    !requestedPage
                ) {
                    return false;
                }

                const normalizedStatus =
                    isValidFeedbackStatus(
                        requestedStatus
                    )
                        ? requestedStatus
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
            loadPublicFeedbacks(1);

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
    // MY FILTER
    //
    // Status o'zgarsa har doim 1-sahifadan boshlaymiz.
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
    // STATUS
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
    // PUBLIC PAGE CHANGE
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

                const totalPages =
                    getSafeTotalPages(
                        publicTotalPages
                    );

                if (
                    !page
                    ||
                    page > totalPages
                    ||
                    page === publicPage
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
                publicPage,
                publicTotalPages,
            ]
        );

    // =====================================================
    // MY PAGE CHANGE
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

                const totalPages =
                    getSafeTotalPages(
                        myTotalPages
                    );

                if (
                    !page
                    ||
                    page > totalPages
                    ||
                    page === myPage
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
                myPage,
                myTotalPages,
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
                    return;
                }

                setIsRefreshing(
                    true
                );

                try {
                    const requests = [
                        loadPublicFeedbacks(
                            publicPage || 1
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
                                    myPage || 1,
                            })
                        );

                        requests.push(
                            loadStats()
                        );
                    }

                    await Promise.all(
                        requests
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
                myPage,
                publicPage,
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

                if (
                    activeStatus !==
                    "all"
                ) {
                    // activeStatus o'zgarishi MY FILTER effect orqali
                    // 1-sahifani qayta yuklaydi.
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
    // OPEN CREATE
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

    // =====================================================
    // CLOSE CREATE
    // =====================================================

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
    // OPEN EDIT
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

    // =====================================================
    // CLOSE EDIT
    // =====================================================

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
                ) {
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

                    siteToast.update(
                        toastId,
                        "success",
                        "Feedback muvaffaqiyatli yangilandi."
                    );

                    setEditingFeedback(
                        null
                    );

                    await Promise.all([
                        loadMyFeedbacks({
                            status:
                                activeStatus,

                            page:
                                myPage || 1,
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
                isUpdating,
                loadMyFeedbacks,
                loadStats,
                myPage,
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
                ) {
                    return false;
                }

                const isCurrentPageLastItem =
                    myPage > 1
                    &&
                    myFeedbacks.length === 1
                    &&
                    Number(
                        myFeedbacks[0]?.id
                    ) === id;

                const pageAfterDelete =
                    isCurrentPageLastItem
                        ? myPage - 1
                        : myPage;

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
                loadMyFeedbacks,
                loadStats,
                myFeedbacks,
                myPage,
            ]
        );

    // =====================================================
    // PAGINATION META
    // =====================================================

    const publicPagination =
        useMemo(
            () => {
                const totalPages =
                    getSafeTotalPages(
                        publicTotalPages
                    );

                const page =
                    Math.min(
                        getValidPage(
                            publicPage
                        ) || 1,
                        totalPages
                    );

                return {
                    count:
                        Math.max(
                            0,
                            Number(
                                publicCount
                            ) || 0
                        ),

                    page,

                    pageSize:
                        getValidPage(
                            publicPageSize
                        )
                        ||
                        FEEDBACK_DEFAULT_PAGE_SIZE,

                    totalPages,

                    hasPrevious:
                        Boolean(
                            publicPrevious
                        )
                        ||
                        page > 1,

                    hasNext:
                        Boolean(
                            publicNext
                        )
                        ||
                        page < totalPages,
                };
            },
            [
                publicCount,
                publicNext,
                publicPage,
                publicPageSize,
                publicPrevious,
                publicTotalPages,
            ]
        );

    const myPagination =
        useMemo(
            () => {
                const totalPages =
                    getSafeTotalPages(
                        myTotalPages
                    );

                const page =
                    Math.min(
                        getValidPage(
                            myPage
                        ) || 1,
                        totalPages
                    );

                return {
                    count:
                        Math.max(
                            0,
                            Number(
                                myCount
                            ) || 0
                        ),

                    page,

                    pageSize:
                        getValidPage(
                            myPageSize
                        )
                        ||
                        FEEDBACK_DEFAULT_PAGE_SIZE,

                    totalPages,

                    hasPrevious:
                        Boolean(
                            myPrevious
                        )
                        ||
                        page > 1,

                    hasNext:
                        Boolean(
                            myNext
                        )
                        ||
                        page < totalPages,
                };
            },
            [
                myCount,
                myNext,
                myPage,
                myPageSize,
                myPrevious,
                myTotalPages,
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
    // RETURN
    // =====================================================

    return {
        // Auth
        isLoggedIn,

        // Public
        publicFeedbacks,
        publicCount,
        publicPage,
        publicPageSize,
        publicTotalPages,
        publicNext,
        publicPrevious,
        publicPagination,
        isPublicLoading,
        hasPublicLoaded,
        handlePublicPageChange,

        // My
        myFeedbacks,
        myCount,
        myPage,
        myPageSize,
        myTotalPages,
        myNext,
        myPrevious,
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

        // Actions
        handleRefresh,
        loadPublicFeedbacks,
        loadMyFeedbacks,
        loadStats,
    };
};

export default useFeedbackPage;