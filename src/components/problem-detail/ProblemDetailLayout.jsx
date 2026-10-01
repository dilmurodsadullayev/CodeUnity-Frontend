// src/components/problem-detail/ProblemDetailLayout.jsx

import React from "react";

import SimilarProblems
    from "../SimilarProblems";

import DeleteConfirmationModal
    from "../DeleteConfirmationModal";

import ProblemDetailHeader
    from "./ProblemDetailHeader";

import ProblemDetailPriority
    from "./ProblemDetailPriority";

import ProblemDetailContent
    from "./ProblemDetailContent";

import ProblemDetailSolutions
    from "./ProblemDetailSolutions";

import AcceptSolutionModal
    from "./AcceptSolutionModal";


// =========================================================
// PROBLEM DETAIL LAYOUT
// =========================================================

const ProblemDetailLayout = ({
    // =====================================================
    // PROBLEM
    // =====================================================

    problemId,

    problemDetail,

    problemLanguages = [],

    problemTechnologies = [],

    responseCount = 0,

    responsesRefreshKey = 0,


    // =====================================================
    // DERIVED STATE
    // =====================================================

    isOwner = false,

    isSolved = false,

    hasStarredProblem = false,


    // =====================================================
    // LOADING
    // =====================================================

    starIsLoading = false,

    isDeleting = false,

    acceptSolutionIsLoading = false,


    // =====================================================
    // MODALS
    // =====================================================

    isDeleteModalOpen = false,

    isAcceptModalOpen = false,


    // =====================================================
    // REFS
    // =====================================================

    responsesSectionRef,

    responseFormRef,


    // =====================================================
    // OWNER ACTIONS
    // =====================================================

    onEdit,

    onOpenDelete,

    onCloseDelete,

    onConfirmDelete,


    // =====================================================
    // STAR ACTIONS
    // =====================================================

    onAddStar,

    onRemoveStar,


    // =====================================================
    // SOLUTION ACTIONS
    // =====================================================

    onWork,

    onSolutionCreated,

    onAcceptSolution,

    onCloseAccept,

    onConfirmAccept,
}) => {

    // =====================================================
    // JSX
    // =====================================================

    return (

        <>

            <main
                className="
                    relative

                    min-h-screen
                    overflow-hidden

                    bg-[#050816]

                    px-4
                    py-8

                    text-white

                    lg:py-12
                "
            >

                {/* =========================================
                    GRID BACKGROUND
                ========================================== */}

                <div
                    aria-hidden="true"

                    className="
                        pointer-events-none
                        absolute
                        inset-0

                        bg-[linear-gradient(rgba(34,211,238,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.025)_1px,transparent_1px)]
                        bg-[size:60px_60px]

                        [mask-image:radial-gradient(circle_at_center,black_0%,transparent_76%)]
                    "
                />


                {/* =========================================
                    BACKGROUND GLOW — CYAN
                ========================================== */}

                <div
                    aria-hidden="true"

                    className="
                        pointer-events-none

                        absolute
                        -left-40
                        top-24

                        h-[420px]
                        w-[420px]

                        rounded-full

                        bg-cyan-500/[0.06]

                        blur-[130px]
                    "
                />


                {/* =========================================
                    BACKGROUND GLOW — INDIGO
                ========================================== */}

                <div
                    aria-hidden="true"

                    className="
                        pointer-events-none

                        absolute
                        -right-40
                        top-[30%]

                        h-[420px]
                        w-[420px]

                        rounded-full

                        bg-indigo-500/[0.08]

                        blur-[130px]
                    "
                />


                {/* =========================================
                    PAGE CONTAINER
                ========================================== */}

                <div
                    className="
                        relative
                        z-10

                        mx-auto

                        w-full
                        max-w-[1500px]
                    "
                >

                    <div
                        className="
                            grid
                            gap-8

                            lg:grid-cols-12
                            lg:gap-10
                        "
                    >

                        {/* =================================
                            MAIN COLUMN
                        ================================== */}

                        <div
                            className="
                                min-w-0

                                lg:col-span-8
                            "
                        >

                            {/* =============================
                                PROBLEM CARD
                            ============================== */}

                            <section
                                aria-label="Muammo tafsilotlari"

                                className="
                                    relative
                                    overflow-hidden

                                    rounded-[2rem]

                                    border
                                    border-white/10

                                    bg-[#0d1117]

                                    p-5

                                    shadow-2xl
                                    shadow-black/30

                                    md:p-7

                                    lg:p-8
                                "
                            >

                                {/* =========================
                                    CARD CYAN GLOW
                                ========================== */}

                                <div
                                    aria-hidden="true"

                                    className="
                                        pointer-events-none

                                        absolute
                                        -right-24
                                        -top-24

                                        h-72
                                        w-72

                                        rounded-full

                                        bg-cyan-500/10

                                        blur-[100px]
                                    "
                                />


                                {/* =========================
                                    CARD INDIGO GLOW
                                ========================== */}

                                <div
                                    aria-hidden="true"

                                    className="
                                        pointer-events-none

                                        absolute
                                        -bottom-28
                                        -left-28

                                        h-72
                                        w-72

                                        rounded-full

                                        bg-indigo-500/10

                                        blur-[100px]
                                    "
                                />


                                {/* =========================
                                    CARD CONTENT
                                ========================== */}

                                <div
                                    className="
                                        relative
                                        z-10
                                    "
                                >

                                    {/* =================================
                                        HEADER
                                    ================================== */}

                                    <ProblemDetailHeader
                                        problemDetail={
                                            problemDetail
                                        }

                                        problemLanguages={
                                            problemLanguages
                                        }

                                        responseCount={
                                            responseCount
                                        }

                                        isOwner={
                                            isOwner
                                        }

                                        isDeleting={
                                            isDeleting
                                        }

                                        onEdit={
                                            onEdit
                                        }

                                        onDelete={
                                            onOpenDelete
                                        }
                                    />


                                    {/* =================================
                                        PRIORITY
                                    ================================== */}

                                    <ProblemDetailPriority
                                        problemDetail={
                                            problemDetail
                                        }

                                        isSolved={
                                            isSolved
                                        }

                                        onWork={
                                            onWork
                                        }
                                    />


                                    {/* =================================
                                        MAIN PROBLEM CONTENT
                                    ================================== */}

                                    <ProblemDetailContent
                                        problemDetail={
                                            problemDetail
                                        }

                                        problemTechnologies={
                                            problemTechnologies
                                        }

                                        hasStarredProblem={
                                            hasStarredProblem
                                        }

                                        isStarLoading={
                                            starIsLoading
                                        }

                                        onAddStar={
                                            onAddStar
                                        }

                                        onRemoveStar={
                                            onRemoveStar
                                        }
                                    />

                                </div>

                            </section>


                            {/* =============================
                                SOLUTIONS
                            ============================== */}

                            <ProblemDetailSolutions
                                problemId={
                                    problemId
                                }

                                responseCount={
                                    responseCount
                                }

                                responsesRefreshKey={
                                    responsesRefreshKey
                                }

                                problemLanguages={
                                    problemLanguages
                                }

                                isOwner={
                                    isOwner
                                }

                                isSolved={
                                    isSolved
                                }

                                responsesSectionRef={
                                    responsesSectionRef
                                }

                                responseFormRef={
                                    responseFormRef
                                }

                                onWork={
                                    onWork
                                }

                                onSolutionCreated={
                                    onSolutionCreated
                                }

                                onAcceptSolution={
                                    onAcceptSolution
                                }
                            />

                        </div>


                        {/* =================================
                            RIGHT SIDEBAR
                        ================================== */}

                        <aside
                            aria-label="O‘xshash muammolar"

                            className="
                                min-w-0

                                lg:col-span-4
                            "
                        >

                            <div
                                className="
                                    lg:sticky
                                    lg:top-28
                                "
                            >

                                <SimilarProblems
                                    problemId={
                                        problemId
                                    }
                                />

                            </div>

                        </aside>

                    </div>

                </div>

            </main>


            {/* =============================================
                DELETE MODAL
            ============================================== */}

            {isOwner && (

                <DeleteConfirmationModal
                    isOpen={
                        isDeleteModalOpen
                    }

                    onClose={
                        onCloseDelete
                    }

                    onConfirm={
                        onConfirmDelete
                    }

                    itemTitle={
                        problemDetail
                            ?.problem
                        ||
                        "Muammo"
                    }

                    isProcessing={
                        isDeleting
                    }
                />
            )}


            {/* =============================================
                ACCEPT SOLUTION MODAL
            ============================================== */}

            <AcceptSolutionModal
                isOpen={
                    isAcceptModalOpen
                }

                onClose={
                    onCloseAccept
                }

                onConfirm={
                    onConfirmAccept
                }

                isProcessing={
                    acceptSolutionIsLoading
                }
            />

        </>
    );
};


export default React.memo(
    ProblemDetailLayout
);