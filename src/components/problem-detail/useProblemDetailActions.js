// src/components/problem-detail/useProblemDetailActions.js

import {
    useCallback,
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

import {
    acceptSolutionFailure,
    acceptSolutionStart,
    acceptSolutionSuccess,

    deleteProblemStarFailure,
    deleteProblemStarStart,
    deleteProblemStarSuccess,

    postProblemStarFailure,
    postProblemStarStart,
    postProblemStarSuccess,
} from "../../features/problems/Problems";

import ProblemService
    from "../../services/problems";

import {
    siteToast,
} from "../ui/AuthToast";

import {
    getProblemDetailErrorMessage as getErrorMessage,
} from "./problemDetailHelpers";


// =========================================================
// IDENTIFIER
// =========================================================

const hasIdentifier = (
    value
) => {

    return (
        value !== null
        &&
        value !== undefined
        &&
        String(
            value
        ).trim() !==
            ""
    );
};


// =========================================================
// USE PROBLEM DETAIL ACTIONS
// =========================================================

const useProblemDetailActions = ({
    problemId,

    problemTitle,

    currentUser,

    isLoggedIn = false,

    isOwner = false,

    isSolved = false,

    hasStarredProblem = false,

    onSolutionAccepted,
}) => {

    const dispatch =
        useDispatch();


    const navigate =
        useNavigate();


    // =====================================================
    // REDUX LOADING
    // =====================================================

    const {
        starIsLoading,

        acceptSolutionIsLoading,
    } = useSelector(
        (
            state
        ) =>
            state.problem
    );


    // =====================================================
    // LOCAL UI STATE
    // =====================================================

    const [
        isDeleteModalOpen,
        setIsDeleteModalOpen,
    ] = useState(
        false
    );


    const [
        isDeleting,
        setIsDeleting,
    ] = useState(
        false
    );


    const [
        isAcceptModalOpen,
        setIsAcceptModalOpen,
    ] = useState(
        false
    );


    const [
        solutionToAccept,
        setSolutionToAccept,
    ] = useState(
        null
    );


    // =====================================================
    // IMMEDIATE REQUEST LOCKS
    //
    // Redux loading rerenderidan oldin ikki marta
    // bosib yuborish edge-case'ini yopadi.
    // =====================================================

    const starRequestRef =
        useRef(
            false
        );


    const deleteRequestRef =
        useRef(
            false
        );


    const acceptRequestRef =
        useRef(
            false
        );


    // =====================================================
    // NORMALIZED PROBLEM ID
    // =====================================================

    const normalizedProblemId =
        hasIdentifier(
            problemId
        )
            ? String(
                problemId
            ).trim()
            : "";


    // =====================================================
    // ADD STAR
    // =====================================================

    const handleStarClick =
        useCallback(
            async (
                targetProblemId = normalizedProblemId
            ) => {

                // =========================================
                // AUTH
                // =========================================

                if (
                    !isLoggedIn
                    ||
                    !currentUser
                ) {

                    siteToast.warning(
                        "Star berish uchun avval tizimga kiring.",
                        {
                            title:
                                "Kirish talab qilinadi",
                        }
                    );


                    return;
                }


                // =========================================
                // VALID ID
                // =========================================

                if (
                    !hasIdentifier(
                        targetProblemId
                    )
                ) {

                    siteToast.error(
                        "Muammo ID topilmadi.",
                        {
                            title:
                                "Star berilmadi",
                        }
                    );


                    return;
                }


                // =========================================
                // GUARDS
                // =========================================

                if (
                    hasStarredProblem
                    ||
                    starIsLoading
                    ||
                    starRequestRef.current
                ) {
                    return;
                }


                starRequestRef.current =
                    true;


                dispatch(
                    postProblemStarStart()
                );


                try {

                    const response =
                        await ProblemService
                            .addStar(
                                targetProblemId
                            );


                    dispatch(
                        postProblemStarSuccess(
                            response
                        )
                    );


                    siteToast.success(
                        "Muammoga star berildi.",
                        {
                            title:
                                "Star berildi",

                            duration:
                                2500,
                        }
                    );

                } catch (
                    error
                ) {

                    const message =
                        getErrorMessage(
                            error,
                            "Star berishda xatolik yuz berdi."
                        );


                    dispatch(
                        postProblemStarFailure(
                            message
                        )
                    );


                    console.error(
                        "Star qo‘shishda xatolik:",
                        error
                    );


                    siteToast.error(
                        message,
                        {
                            title:
                                "Star berilmadi",

                            duration:
                                4200,
                        }
                    );

                } finally {

                    starRequestRef.current =
                        false;
                }
            },
            [
                currentUser,
                dispatch,
                hasStarredProblem,
                isLoggedIn,
                normalizedProblemId,
                starIsLoading,
            ]
        );


    // =====================================================
    // REMOVE STAR
    // =====================================================

    const handleStarDeleteClick =
        useCallback(
            async (
                targetProblemId = normalizedProblemId
            ) => {

                if (
                    !hasIdentifier(
                        targetProblemId
                    )
                    ||
                    !hasStarredProblem
                    ||
                    starIsLoading
                    ||
                    starRequestRef.current
                ) {
                    return;
                }


                starRequestRef.current =
                    true;


                dispatch(
                    deleteProblemStarStart()
                );


                try {

                    const response =
                        await ProblemService
                            .removeStar(
                                targetProblemId
                            );


                    dispatch(
                        deleteProblemStarSuccess(
                            response
                        )
                    );


                    siteToast.info(
                        "Star olib tashlandi.",
                        {
                            title:
                                "Star bekor qilindi",

                            duration:
                                2300,
                        }
                    );

                } catch (
                    error
                ) {

                    const message =
                        getErrorMessage(
                            error,
                            "Starni olib tashlashda xatolik yuz berdi."
                        );


                    dispatch(
                        deleteProblemStarFailure(
                            message
                        )
                    );


                    console.error(
                        "Star olib tashlashda xatolik:",
                        error
                    );


                    siteToast.error(
                        message,
                        {
                            title:
                                "Star olib tashlanmadi",

                            duration:
                                4200,
                        }
                    );

                } finally {

                    starRequestRef.current =
                        false;
                }
            },
            [
                dispatch,
                hasStarredProblem,
                normalizedProblemId,
                starIsLoading,
            ]
        );


    // =====================================================
    // EDIT
    // =====================================================

    const handleEditProblem =
        useCallback(
            () => {

                if (
                    !isOwner
                    ||
                    isDeleting
                    ||
                    !normalizedProblemId
                ) {
                    return;
                }


                navigate(
                    `/problem/${normalizedProblemId}/edit`
                );

            },
            [
                isDeleting,
                isOwner,
                navigate,
                normalizedProblemId,
            ]
        );


    // =====================================================
    // OPEN DELETE MODAL
    // =====================================================

    const handleOpenDeleteModal =
        useCallback(
            () => {

                if (
                    !isOwner
                    ||
                    isDeleting
                    ||
                    deleteRequestRef.current
                ) {
                    return;
                }


                setIsDeleteModalOpen(
                    true
                );

            },
            [
                isDeleting,
                isOwner,
            ]
        );


    // =====================================================
    // CLOSE DELETE MODAL
    // =====================================================

    const handleCloseDeleteModal =
        useCallback(
            () => {

                if (
                    isDeleting
                    ||
                    deleteRequestRef.current
                ) {
                    return;
                }


                setIsDeleteModalOpen(
                    false
                );

            },
            [
                isDeleting,
            ]
        );


    // =====================================================
    // DELETE PROBLEM
    // =====================================================

    const handleConfirmDelete =
        useCallback(
            async () => {

                if (
                    !normalizedProblemId
                    ||
                    !isOwner
                    ||
                    isDeleting
                    ||
                    deleteRequestRef.current
                ) {
                    return;
                }


                deleteRequestRef.current =
                    true;


                setIsDeleting(
                    true
                );


                const title =
                    (
                        typeof problemTitle ===
                            "string"
                        &&
                        problemTitle.trim()
                    )
                        ? problemTitle.trim()
                        : "Muammo";


                const toastId =
                    siteToast.loading(
                        `"${title}" o‘chirilmoqda...`,
                        {
                            title:
                                "Muammo o‘chirilmoqda",
                        }
                    );


                try {

                    await ProblemService
                        .deleteProblem(
                            normalizedProblemId
                        );


                    setIsDeleteModalOpen(
                        false
                    );


                    siteToast.success(
                        `"${title}" muvaffaqiyatli o‘chirildi.`,
                        {
                            id:
                                toastId,

                            title:
                                "Muammo o‘chirildi",

                            duration:
                                3500,
                        }
                    );


                    navigate(
                        "/problems",
                        {
                            replace:
                                true,
                        }
                    );

                } catch (
                    error
                ) {

                    console.error(
                        "Muammoni o‘chirishda xatolik:",
                        error
                    );


                    siteToast.error(
                        getErrorMessage(
                            error,
                            "Muammoni o‘chirishda xatolik yuz berdi."
                        ),
                        {
                            id:
                                toastId,

                            title:
                                "Muammo o‘chirilmadi",

                            duration:
                                5000,
                        }
                    );

                } finally {

                    deleteRequestRef.current =
                        false;


                    setIsDeleting(
                        false
                    );
                }
            },
            [
                isDeleting,
                isOwner,
                navigate,
                normalizedProblemId,
                problemTitle,
            ]
        );


    // =====================================================
    // OPEN ACCEPT SOLUTION MODAL
    // =====================================================

    const handleAcceptSolution =
        useCallback(
            (
                solutionId
            ) => {

                // =========================================
                // OWNER
                // =========================================

                if (
                    !isOwner
                ) {

                    siteToast.warning(
                        "Faqat muammo egasi yechimni qabul qila oladi.",
                        {
                            title:
                                "Ruxsat yo‘q",
                        }
                    );


                    return;
                }


                // =========================================
                // SOLVED
                // =========================================

                if (
                    isSolved
                ) {

                    siteToast.info(
                        "Bu muammo allaqachon yechilgan.",
                        {
                            title:
                                "Muammo yechilgan",
                        }
                    );


                    return;
                }


                // =========================================
                // SOLUTION ID
                // =========================================

                if (
                    !hasIdentifier(
                        solutionId
                    )
                ) {

                    siteToast.error(
                        "Yechim ID topilmadi.",
                        {
                            title:
                                "Yechim tanlanmadi",
                        }
                    );


                    return;
                }


                // =========================================
                // PROCESSING
                // =========================================

                if (
                    acceptSolutionIsLoading
                    ||
                    acceptRequestRef.current
                ) {
                    return;
                }


                setSolutionToAccept(
                    solutionId
                );


                setIsAcceptModalOpen(
                    true
                );
            },
            [
                acceptSolutionIsLoading,
                isOwner,
                isSolved,
            ]
        );


    // =====================================================
    // CLOSE ACCEPT MODAL
    // =====================================================

    const handleCloseAcceptModal =
        useCallback(
            () => {

                if (
                    acceptSolutionIsLoading
                    ||
                    acceptRequestRef.current
                ) {
                    return;
                }


                setIsAcceptModalOpen(
                    false
                );


                setSolutionToAccept(
                    null
                );

            },
            [
                acceptSolutionIsLoading,
            ]
        );


    // =====================================================
    // CONFIRM ACCEPT SOLUTION
    // =====================================================

    const handleConfirmAcceptSolution =
        useCallback(
            async () => {

                if (
                    !normalizedProblemId
                    ||
                    !hasIdentifier(
                        solutionToAccept
                    )
                    ||
                    !isOwner
                    ||
                    isSolved
                    ||
                    acceptSolutionIsLoading
                    ||
                    acceptRequestRef.current
                ) {
                    return;
                }


                const acceptedSolutionId =
                    solutionToAccept;


                acceptRequestRef.current =
                    true;


                dispatch(
                    acceptSolutionStart()
                );


                const toastId =
                    siteToast.loading(
                        "Tanlangan yechim qabul qilinmoqda...",
                        {
                            title:
                                "Yechim tekshirilmoqda",
                        }
                    );


                let response;


                try {

                    response =
                        await ProblemService
                            .acceptSolution(
                                normalizedProblemId,
                                acceptedSolutionId
                            );


                    dispatch(
                        acceptSolutionSuccess(
                            response
                        )
                    );

                } catch (
                    error
                ) {

                    const message =
                        getErrorMessage(
                            error,
                            "Yechimni qabul qilishda xato yuz berdi."
                        );


                    dispatch(
                        acceptSolutionFailure(
                            message
                        )
                    );


                    console.error(
                        "Yechimni qabul qilishda xatolik:",
                        error
                    );


                    siteToast.error(
                        message,
                        {
                            id:
                                toastId,

                            title:
                                "Yechim qabul qilinmadi",

                            duration:
                                5000,
                        }
                    );


                    acceptRequestRef.current =
                        false;


                    return;
                }


                // =========================================
                // API SUCCESS
                // =========================================

                acceptRequestRef.current =
                    false;


                setIsAcceptModalOpen(
                    false
                );


                setSolutionToAccept(
                    null
                );


                siteToast.success(
                    "Yechim muvaffaqiyatli qabul qilindi.",
                    {
                        id:
                            toastId,

                        title:
                            "Muammo yechildi",

                        duration:
                            3500,
                    }
                );


                // =========================================
                // OPTIONAL CALLBACK
                //
                // Callback xatosi API successni
                // muvaffaqiyatsizga aylantirmaydi.
                // =========================================

                try {

                    await onSolutionAccepted?.(
                        response,
                        acceptedSolutionId
                    );

                } catch (
                    callbackError
                ) {

                    console.error(
                        "Accept solution callback xatosi:",
                        callbackError
                    );
                }
            },
            [
                acceptSolutionIsLoading,
                dispatch,
                isOwner,
                isSolved,
                normalizedProblemId,
                onSolutionAccepted,
                solutionToAccept,
            ]
        );


    // =====================================================
    // RETURN
    // =====================================================

    return {

        // Redux loading.
        starIsLoading,
        acceptSolutionIsLoading,


        // Delete.
        isDeleteModalOpen,
        isDeleting,

        handleEditProblem,

        handleOpenDeleteModal,
        handleCloseDeleteModal,
        handleConfirmDelete,


        // Star.
        handleStarClick,
        handleStarDeleteClick,


        // Accept solution.
        isAcceptModalOpen,
        solutionToAccept,

        handleAcceptSolution,
        handleCloseAcceptModal,
        handleConfirmAcceptSolution,
    };
};


export default useProblemDetailActions;