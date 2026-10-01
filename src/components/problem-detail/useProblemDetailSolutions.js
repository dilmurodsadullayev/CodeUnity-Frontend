// src/components/problem-detail/useProblemDetailSolutions.js

import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import {
    siteToast,
} from "../ui/AuthToast";


// =========================================================
// USE PROBLEM DETAIL SOLUTIONS
// =========================================================

const useProblemDetailSolutions = ({
    isSolved = false,

    refreshProblemDetail,
}) => {

    // =====================================================
    // REFS
    // =====================================================

    const responseFormRef =
        useRef(
            null
        );


    const responsesSectionRef =
        useRef(
            null
        );


    const mountedRef =
        useRef(
            true
        );


    const animationFrameIdsRef =
        useRef(
            new Set()
        );


    // =====================================================
    // RESPONSE REFRESH KEY
    // =====================================================

    const [
        responsesRefreshKey,
        setResponsesRefreshKey,
    ] = useState(
        0
    );


    // =====================================================
    // COMPONENT LIFECYCLE
    //
    // Pending requestAnimationFrame callbacklar
    // component unmount bo‘lganda bekor qilinadi.
    // =====================================================

    useEffect(
        () => {

            mountedRef.current =
                true;


            return () => {

                mountedRef.current =
                    false;


                animationFrameIdsRef
                    .current
                    .forEach(
                        (
                            frameId
                        ) => {

                            window.cancelAnimationFrame(
                                frameId
                            );
                        }
                    );


                animationFrameIdsRef
                    .current
                    .clear();
            };

        },
        []
    );


    // =====================================================
    // SCROLL AFTER RENDER
    //
    // Ikki marta RAF:
    //
    // state update
    //      ↓
    // React render
    //      ↓
    // DOM paint
    //      ↓
    // scroll
    //
    // Yangi response render bo‘lishiga vaqt beradi.
    // =====================================================

    const scrollAfterRender =
        useCallback(
            (
                targetRef
            ) => {

                if (
                    typeof window ===
                        "undefined"
                    ||
                    !targetRef
                ) {
                    return;
                }


                let firstFrameId =
                    null;


                let secondFrameId =
                    null;


                firstFrameId =
                    window.requestAnimationFrame(
                        () => {

                            animationFrameIdsRef
                                .current
                                .delete(
                                    firstFrameId
                                );


                            if (
                                !mountedRef.current
                            ) {
                                return;
                            }


                            secondFrameId =
                                window.requestAnimationFrame(
                                    () => {

                                        animationFrameIdsRef
                                            .current
                                            .delete(
                                                secondFrameId
                                            );


                                        if (
                                            !mountedRef.current
                                        ) {
                                            return;
                                        }


                                        targetRef
                                            .current
                                            ?.scrollIntoView({
                                                behavior:
                                                    "smooth",

                                                block:
                                                    "start",
                                            });
                                    }
                                );


                            animationFrameIdsRef
                                .current
                                .add(
                                    secondFrameId
                                );
                        }
                    );


                animationFrameIdsRef
                    .current
                    .add(
                        firstFrameId
                    );
            },
            []
        );


    // =====================================================
    // REFRESH RESPONSE LIST
    // =====================================================

    const refreshResponses =
        useCallback(
            () => {

                if (
                    !mountedRef.current
                ) {
                    return;
                }


                setResponsesRefreshKey(
                    (
                        previous
                    ) =>
                        previous + 1
                );

            },
            []
        );


    // =====================================================
    // SOLUTION ACCEPTED
    //
    // Accept API useProblemDetailActions ichida.
    // Bu callback faqat response listni yangilaydi.
    // =====================================================

    const handleSolutionAccepted =
        useCallback(
            () => {

                refreshResponses();

            },
            [
                refreshResponses,
            ]
        );


    // =====================================================
    // NEW SOLUTION CREATED
    //
    // Flow:
    //
    // 1. detail background refresh
    // 2. response list refresh
    // 3. responses sectionga scroll
    //
    // Detail refresh yiqilsa ham yangi solution
    // serverda saqlangan bo‘lishi mumkin.
    // =====================================================

    const handleSolutionCreated =
        useCallback(
            async (
                createdSolution
            ) => {

                let refreshFailed =
                    false;


                try {

                    if (
                        typeof refreshProblemDetail ===
                            "function"
                    ) {

                        await refreshProblemDetail({
                            updatePageError:
                                false,
                        });
                    }

                } catch (
                    error
                ) {

                    refreshFailed =
                        true;


                    console.error(
                        "Yechim yuborilgandan keyin detailni yangilashda xatolik:",
                        error
                    );
                }


                // =========================================
                // COMPONENT ALREADY UNMOUNTED
                // =========================================

                if (
                    !mountedRef.current
                ) {

                    return createdSolution;
                }


                // =========================================
                // RESPONSE LIST
                // =========================================

                refreshResponses();


                // =========================================
                // SCROLL TO RESPONSES
                // =========================================

                scrollAfterRender(
                    responsesSectionRef
                );


                // =========================================
                // PARTIAL SUCCESS WARNING
                // =========================================

                if (
                    refreshFailed
                ) {

                    siteToast.warning(
                        "Yechim saqlandi, lekin sahifa ma’lumotlarini to‘liq yangilab bo‘lmadi.",
                        {
                            title:
                                "Yechim saqlandi",

                            duration:
                                4000,
                        }
                    );
                }


                return createdSolution;

            },
            [
                refreshProblemDetail,
                refreshResponses,
                scrollAfterRender,
            ]
        );


    // =====================================================
    // WORK / WRITE SOLUTION
    //
    // "Men ishlayman"
    // va
    // "Yechim yozish"
    //
    // bir xil flow ishlatadi.
    // =====================================================

    const handleWorkClick =
        useCallback(
            () => {

                if (
                    isSolved
                ) {

                    siteToast.info(
                        "Bu muammo allaqachon yechilgan.",
                        {
                            title:
                                "Muammo yopilgan",
                        }
                    );


                    return;
                }


                scrollAfterRender(
                    responseFormRef
                );

            },
            [
                isSolved,
                scrollAfterRender,
            ]
        );


    // =====================================================
    // RETURN
    // =====================================================

    return {

        // Refs.
        responseFormRef,
        responsesSectionRef,


        // Response list refresh.
        responsesRefreshKey,

        refreshResponses,


        // Flows.
        handleWorkClick,
        handleSolutionCreated,
        handleSolutionAccepted,
    };
};


export default useProblemDetailSolutions;