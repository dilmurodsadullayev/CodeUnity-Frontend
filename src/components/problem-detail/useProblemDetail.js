// src/components/problem-detail/useProblemDetail.js

import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    clearProblemDetail,

    getProblemDetailFailure,
    getProblemDetailStart,
    getProblemDetailSuccess,

    refreshProblemDetailSuccess,
} from "../../features/problems/Problems";

import ProblemService
    from "../../services/problems";

import {
    getMissingProblemDetailState,
    getProblemDetailErrorState,
    isCurrentProblemDetail,
    isProblemDetailRequestCanceled,
} from "./problemDetailHelpers";


// =========================================================
// REQUEST MODES
// =========================================================

const REQUEST_MODE = {

    FOREGROUND:
        "foreground",

    BACKGROUND:
        "background",
};


// =========================================================
// USE PROBLEM DETAIL
// =========================================================

const useProblemDetail = ({
    problemId,
}) => {

    const dispatch =
        useDispatch();


    // =====================================================
    // REDUX
    // =====================================================

    const {
        problemDetail,

        detailIsLoading,

        isLoading,
    } = useSelector(
        (
            state
        ) =>
            state.problem
    );


    // =====================================================
    // LOCAL PAGE ERROR
    // =====================================================

    const [
        detailError,
        setDetailError,
    ] = useState(
        null
    );


    // =====================================================
    // RETRY KEY
    // =====================================================

    const [
        retryKey,
        setRetryKey,
    ] = useState(
        0
    );


    // =====================================================
    // REQUEST REFS
    // =====================================================

    const activeRequestRef =
        useRef(
            null
        );


    const requestSequenceRef =
        useRef(
            0
        );


    // =====================================================
    // LATEST DETAIL REF
    //
    // Canceled foreground request Redux counter'ini
    // balanslash uchun cached detail kerak bo‘ladi.
    // =====================================================

    const latestProblemDetailRef =
        useRef(
            problemDetail
        );


    latestProblemDetailRef.current =
        problemDetail;


    // =====================================================
    // NORMALIZED ID
    // =====================================================

    const normalizedProblemId =
        problemId ===
            null
        ||
        problemId ===
            undefined
            ? ""
            : String(
                problemId
            ).trim();


    // =====================================================
    // LOADING
    //
    // detailIsLoading yangi canonical loading.
    // Legacy isLoading fallback sifatida qoladi.
    // =====================================================

    const detailLoading =
        typeof detailIsLoading ===
            "boolean"
            ? detailIsLoading

            : Boolean(
                isLoading
            );


    // =====================================================
    // CURRENT ROUTE DETAIL
    // =====================================================

    const hasCurrentProblemDetail =
        isCurrentProblemDetail(
            problemDetail,
            normalizedProblemId
        );


    // =====================================================
    // CURRENT ROUTE ERROR
    // =====================================================

    const currentDetailError =
        detailError?.problemId ===
            normalizedProblemId
            ? detailError
            : null;


    // =====================================================
    // SETTLE CANCELED REQUEST
    //
    // Foreground:
    //
    // getProblemDetailStart()
    //     ↓
    // startRequest()
    //     ↓
    // pendingRequests + 1
    //
    // Shu request abort bo‘lsa uni terminal action
    // bilan balanslash shart.
    //
    // Background request esa Redux request counterga
    // umuman kirmaydi.
    // =====================================================

    const settleCanceledRequest =
        useCallback(
            (
                request
            ) => {

                if (
                    !request
                    ||
                    request.settled
                ) {
                    return;
                }


                request.settled =
                    true;


                // =========================================
                // BACKGROUND
                //
                // Redux request lifecycle boshlanmagan.
                // Demak terminal Redux action ham kerak emas.
                // =========================================

                if (
                    request.mode ===
                        REQUEST_MODE.BACKGROUND
                ) {

                    return;
                }


                // =========================================
                // FOREGROUND
                //
                // startRequest() balanslanadi.
                //
                // Existing detailni qayta yozamiz,
                // shuning uchun cached sahifa yo‘qolmaydi.
                // =========================================

                dispatch(
                    getProblemDetailSuccess(
                        latestProblemDetailRef
                            .current
                        ??
                        null
                    )
                );
            },
            [
                dispatch,
            ]
        );


    // =====================================================
    // CANCEL ACTIVE REQUEST
    // =====================================================

    const cancelActiveRequest =
        useCallback(
            () => {

                const request =
                    activeRequestRef.current;


                if (
                    !request
                ) {
                    return;
                }


                activeRequestRef.current =
                    null;


                // Redux lifecycle kerak bo‘lsa
                // avval settle qilamiz.
                settleCanceledRequest(
                    request
                );


                // Keyin network request abort.
                request
                    .controller
                    .abort();
            },
            [
                settleCanceledRequest,
            ]
        );


    // =====================================================
    // REQUEST PROBLEM DETAIL
    // =====================================================

    const requestProblemDetail =
        useCallback(
            async ({
                mode =
                    REQUEST_MODE.FOREGROUND,

                updatePageError =
                    true,
            } = {}) => {

                // =========================================
                // NORMALIZE MODE
                // =========================================

                const requestMode =
                    mode ===
                        REQUEST_MODE.BACKGROUND
                        ? REQUEST_MODE.BACKGROUND
                        : REQUEST_MODE.FOREGROUND;


                const isBackground =
                    requestMode ===
                    REQUEST_MODE.BACKGROUND;


                // =========================================
                // CANCEL OLD REQUEST
                //
                // Bir vaqtning o‘zida bitta detail GET.
                // =========================================

                cancelActiveRequest();


                // =========================================
                // MISSING ID
                // =========================================

                if (
                    !normalizedProblemId
                ) {

                    // Background refreshda page error
                    // yaratmaymiz.
                    if (
                        isBackground
                    ) {

                        return null;
                    }


                    const errorState = {
                        ...getMissingProblemDetailState(),

                        problemId:
                            normalizedProblemId,
                    };


                    if (
                        updatePageError
                    ) {

                        setDetailError(
                            errorState
                        );
                    }


                    return null;
                }


                // =========================================
                // CLEAR OLD PAGE ERROR
                //
                // Faqat foreground.
                // =========================================

                if (
                    !isBackground
                    &&
                    updatePageError
                ) {

                    setDetailError(
                        null
                    );
                }


                // =========================================
                // CREATE REQUEST
                // =========================================

                const controller =
                    new AbortController();


                const request = {

                    id:
                        requestSequenceRef.current
                        +
                        1,

                    problemId:
                        normalizedProblemId,

                    mode:
                        requestMode,

                    controller,

                    settled:
                        false,
                };


                requestSequenceRef.current =
                    request.id;


                activeRequestRef.current =
                    request;


                // =========================================
                // FOREGROUND REDUX START
                //
                // Background refresh ataylab
                // Redux loading/error lifecyclega kirmaydi.
                // =========================================

                if (
                    !isBackground
                ) {

                    dispatch(
                        getProblemDetailStart()
                    );
                }


                try {

                    // =====================================
                    // API
                    // =====================================

                    const response =
                        await ProblemService
                            .getProblemDetail(
                                normalizedProblemId,
                                {
                                    signal:
                                        controller.signal,
                                }
                            );


                    // =====================================
                    // STILL ACTIVE?
                    // =====================================

                    const isCurrentRequest =
                        activeRequestRef
                            .current
                            ?.id
                        ===
                        request.id;


                    if (
                        controller
                            .signal
                            .aborted
                        ||
                        !isCurrentRequest
                        ||
                        request.settled
                    ) {

                        return null;
                    }


                    // =====================================
                    // SETTLED
                    // =====================================

                    request.settled =
                        true;


                    activeRequestRef.current =
                        null;


                    // =====================================
                    // BACKGROUND SUCCESS
                    //
                    // Cache update qiladi.
                    //
                    // Lekin:
                    // - detailIsLoading
                    // - detailError
                    // - global error
                    // - pendingRequests
                    //
                    // tegilmaydi.
                    // =====================================

                    if (
                        isBackground
                    ) {

                        dispatch(
                            refreshProblemDetailSuccess(
                                response
                            )
                        );


                        return response;
                    }


                    // =====================================
                    // FOREGROUND SUCCESS
                    // =====================================

                    dispatch(
                        getProblemDetailSuccess(
                            response
                        )
                    );


                    if (
                        updatePageError
                    ) {

                        setDetailError(
                            null
                        );
                    }


                    return response;

                } catch (
                    error
                ) {

                    // =====================================
                    // CANCEL?
                    // =====================================

                    const isCanceled =
                        isProblemDetailRequestCanceled(
                            error
                        )
                        ||
                        controller
                            .signal
                            .aborted;


                    const isCurrentRequest =
                        activeRequestRef
                            .current
                            ?.id
                        ===
                        request.id;


                    // =====================================
                    // CANCELED
                    // =====================================

                    if (
                        isCanceled
                    ) {

                        if (
                            isCurrentRequest
                            &&
                            !request.settled
                        ) {

                            activeRequestRef.current =
                                null;


                            settleCanceledRequest(
                                request
                            );
                        }


                        return null;
                    }


                    // =====================================
                    // STALE REQUEST
                    //
                    // Yangi request boshlanganidan keyin
                    // eski response/error kelgan.
                    // =====================================

                    if (
                        !isCurrentRequest
                        ||
                        request.settled
                    ) {

                        return null;
                    }


                    // =====================================
                    // SETTLED
                    // =====================================

                    request.settled =
                        true;


                    activeRequestRef.current =
                        null;


                    // =====================================
                    // BACKGROUND FAILURE
                    //
                    // Reduxga failure YOZILMAYDI.
                    //
                    // Error callerga throw qilinadi,
                    // useProblemDetailSolutions esa
                    // "solution saqlandi, detail refresh
                    // bo‘lmadi" warningini ko‘rsatadi.
                    // =====================================

                    if (
                        isBackground
                    ) {

                        throw error;
                    }


                    // =====================================
                    // FOREGROUND TYPED ERROR
                    // =====================================

                    const errorState = {
                        ...getProblemDetailErrorState(
                            error
                        ),

                        problemId:
                            normalizedProblemId,
                    };


                    if (
                        updatePageError
                    ) {

                        setDetailError(
                            errorState
                        );
                    }


                    dispatch(
                        getProblemDetailFailure(
                            errorState.message
                        )
                    );


                    throw error;
                }
            },
            [
                cancelActiveRequest,
                dispatch,
                normalizedProblemId,
                settleCanceledRequest,
            ]
        );


    // =====================================================
    // INITIAL LOAD / ROUTE CHANGE / RETRY
    //
    // Har doim FOREGROUND.
    // =====================================================

    useEffect(
        () => {

            requestProblemDetail({

                mode:
                    REQUEST_MODE.FOREGROUND,

                updatePageError:
                    true,
            })
                .catch(
                    () => {

                        // Typed error requestProblemDetail
                        // ichida boshqarildi.
                    }
                );


            return () => {

                // =========================================
                // ROUTE CHANGE
                //
                // /problem/1
                //      ↓
                // /problem/2
                // =========================================

                cancelActiveRequest();
            };

        },
        [
            requestProblemDetail,
            retryKey,
            cancelActiveRequest,
        ]
    );


    // =====================================================
    // UNMOUNT CLEANUP
    // =====================================================

    useEffect(
        () => {

            return () => {

                cancelActiveRequest();


                dispatch(
                    clearProblemDetail()
                );
            };

        },
        [
            cancelActiveRequest,
            dispatch,
        ]
    );


    // =====================================================
    // RETRY
    // =====================================================

    const retryProblemDetail =
        useCallback(
            () => {

                if (
                    detailLoading
                ) {

                    return;
                }


                setRetryKey(
                    (
                        previous
                    ) =>
                        previous + 1
                );

            },
            [
                detailLoading,
            ]
        );


    // =====================================================
    // SILENT BACKGROUND REFRESH
    //
    // Masalan:
    //
    // POST solution success
    //          ↓
    // detail statistics refresh
    //
    // Failure:
    // - current detail saqlanadi
    // - Redux detailError o‘zgarmaydi
    // - Redux global error o‘zgarmaydi
    // - detailIsLoading false qoladi
    // - error callerga qaytadi
    // =====================================================

    const refreshProblemDetail =
        useCallback(
            async () => {

                return requestProblemDetail({

                    mode:
                        REQUEST_MODE.BACKGROUND,

                    updatePageError:
                        false,
                });

            },
            [
                requestProblemDetail,
            ]
        );


    // =====================================================
    // RETURN
    // =====================================================

    return {

        problemDetail,

        detailLoading,

        hasCurrentProblemDetail,

        currentDetailError,

        retryProblemDetail,

        refreshProblemDetail,
    };
};


export default useProblemDetail;