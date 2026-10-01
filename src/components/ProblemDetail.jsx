// src/components/ProblemDetail.jsx

import React, {
    useMemo,
} from "react";

import {
    useSelector,
} from "react-redux";

import {
    useParams,
} from "react-router-dom";

import ProblemDetailState
    from "./problem-detail/ProblemDetailState";

import ProblemDetailLayout
    from "./problem-detail/ProblemDetailLayout";

import useProblemDetail
    from "./problem-detail/useProblemDetail";

import useProblemDetailActions
    from "./problem-detail/useProblemDetailActions";

import useProblemDetailSolutions
    from "./problem-detail/useProblemDetailSolutions";

import {
    getProblemDetailViewModel,
} from "./problem-detail/problemDetailHelpers";


// =========================================================
// PROBLEM DETAIL
// =========================================================

const ProblemDetail = () => {

    // =====================================================
    // ROUTER
    // =====================================================

    const {
        id,
    } = useParams();


    // =====================================================
    // DETAIL REQUEST LIFECYCLE
    //
    // GET
    // AbortController
    // typed error
    // retry
    // cleanup
    // background refresh
    // current-route protection
    // =====================================================

    const {
        problemDetail,

        detailLoading,

        hasCurrentProblemDetail,

        currentDetailError,

        retryProblemDetail,

        refreshProblemDetail,
    } = useProblemDetail({
        problemId:
            id,
    });


    // =====================================================
    // AUTH
    // =====================================================

    const {
        user,
        isLoggedIn,
    } = useSelector(
        (
            state
        ) =>
            state.auth
    );


    // =====================================================
    // VIEW MODEL
    //
    // Business-data normalization helper ichida:
    //
    // solved
    // rejected
    // starred
    // owner
    // responseCount
    // languages
    // technologies
    // =====================================================

    const detailView =
        useMemo(
            () => {

                return getProblemDetailViewModel(
                    problemDetail,
                    user
                );

            },
            [
                problemDetail,
                user,
            ]
        );


    const {
        isSolved:
            isProblemSolved,

        hasStarred:
            hasStarredProblem,

        isOwner,

        responseCount,

        languages:
            problemLanguages,

        technologies:
            problemTechnologies,
    } = detailView;


    // =====================================================
    // SOLUTION FLOW
    //
    // refs
    // response refresh key
    // write-solution scroll
    // new solution refresh
    // accepted solution refresh
    // =====================================================

    const {
        responseFormRef,

        responsesSectionRef,

        responsesRefreshKey,

        handleWorkClick,

        handleSolutionCreated,

        handleSolutionAccepted,
    } = useProblemDetailSolutions({

        isSolved:
            isProblemSolved,

        refreshProblemDetail,
    });


    // =====================================================
    // MUTATION ACTIONS
    //
    // STAR
    // UNSTAR
    // EDIT
    // DELETE
    // ACCEPT SOLUTION
    // =====================================================

    const {
        starIsLoading,

        acceptSolutionIsLoading,

        isDeleteModalOpen,
        isDeleting,

        isAcceptModalOpen,

        handleStarClick,
        handleStarDeleteClick,

        handleEditProblem,

        handleOpenDeleteModal,
        handleCloseDeleteModal,
        handleConfirmDelete,

        handleAcceptSolution,
        handleCloseAcceptModal,
        handleConfirmAcceptSolution,
    } = useProblemDetailActions({

        problemId:
            id,

        problemTitle:
            problemDetail
                ?.problem,

        currentUser:
            user,

        isLoggedIn,

        isOwner,

        isSolved:
            isProblemSolved,

        hasStarredProblem,

        onSolutionAccepted:
            handleSolutionAccepted,
    });


    // =====================================================
    // LOADING
    //
    // Current route uchun detail hali yo‘q.
    // =====================================================

    if (
        detailLoading
        &&
        !hasCurrentProblemDetail
        &&
        !currentDetailError
    ) {

        return (

            <ProblemDetailState
                variant="loading"
            />
        );
    }


    // =====================================================
    // ERROR
    //
    // Error faqat current routega tegishli bo‘lsa
    // page error sifatida ko‘rsatiladi.
    // =====================================================

    if (
        currentDetailError
        &&
        !hasCurrentProblemDetail
    ) {

        return (

            <ProblemDetailState
                variant="error"

                errorState={
                    currentDetailError
                }

                onRetry={
                    retryProblemDetail
                }

                isRetrying={
                    detailLoading
                }

                backTo="/problems"
            />
        );
    }


    // =====================================================
    // STALE DETAIL PROTECTION
    //
    // Masalan:
    //
    // /problem/1/detail
    //        ↓
    // /problem/2/detail
    //
    // Reduxda 1-detail bir lahza turgan bo‘lsa,
    // 2-route ichida 1-detail render qilinmaydi.
    // =====================================================

    if (
        !hasCurrentProblemDetail
    ) {

        return (

            <ProblemDetailState
                variant="loading"
            />
        );
    }


    // =====================================================
    // LAYOUT
    // =====================================================

    return (

        <ProblemDetailLayout
            // =============================================
            // PROBLEM
            // =============================================

            problemId={
                id
            }

            problemDetail={
                problemDetail
            }

            problemLanguages={
                problemLanguages
            }

            problemTechnologies={
                problemTechnologies
            }

            responseCount={
                responseCount
            }

            responsesRefreshKey={
                responsesRefreshKey
            }


            // =============================================
            // DERIVED STATE
            // =============================================

            isOwner={
                isOwner
            }

            isSolved={
                isProblemSolved
            }

            hasStarredProblem={
                hasStarredProblem
            }


            // =============================================
            // MUTATION LOADING
            // =============================================

            starIsLoading={
                starIsLoading
            }

            isDeleting={
                isDeleting
            }

            acceptSolutionIsLoading={
                acceptSolutionIsLoading
            }


            // =============================================
            // MODALS
            // =============================================

            isDeleteModalOpen={
                isDeleteModalOpen
            }

            isAcceptModalOpen={
                isAcceptModalOpen
            }


            // =============================================
            // SOLUTION REFS
            // =============================================

            responsesSectionRef={
                responsesSectionRef
            }

            responseFormRef={
                responseFormRef
            }


            // =============================================
            // OWNER ACTIONS
            // =============================================

            onEdit={
                handleEditProblem
            }

            onOpenDelete={
                handleOpenDeleteModal
            }

            onCloseDelete={
                handleCloseDeleteModal
            }

            onConfirmDelete={
                handleConfirmDelete
            }


            // =============================================
            // STAR ACTIONS
            // =============================================

            onAddStar={
                handleStarClick
            }

            onRemoveStar={
                handleStarDeleteClick
            }


            // =============================================
            // SOLUTION ACTIONS
            // =============================================

            onWork={
                handleWorkClick
            }

            onSolutionCreated={
                handleSolutionCreated
            }

            onAcceptSolution={
                handleAcceptSolution
            }

            onCloseAccept={
                handleCloseAcceptModal
            }

            onConfirmAccept={
                handleConfirmAcceptSolution
            }
        />
    );
};


export default ProblemDetail;