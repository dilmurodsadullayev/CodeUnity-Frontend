// src/components/problem-detail/ProblemDetailSolutions.jsx

import React from "react";

import {
    CheckCircle2,
    Pencil,
} from "lucide-react";

import ProblemResponse
    from "../ProblemResponse";

import ProblemResponseForm
    from "../ProblemResponseForm";


// =========================================================
// SAFE NUMBER
// =========================================================

const safeNumber = (
    value,
    fallback = 0
) => {

    const number =
        Number(
            value
        );


    if (
        !Number.isFinite(
            number
        )
    ) {
        return fallback;
    }


    return Math.max(
        0,
        number
    );
};


// =========================================================
// PROBLEM DETAIL SOLUTIONS
// =========================================================

const ProblemDetailSolutions = ({
    problemId,

    responseCount = 0,

    responsesRefreshKey = 0,

    problemLanguages = [],

    isOwner = false,

    isSolved = false,

    responsesSectionRef,
    responseFormRef,

    onWork,
    onSolutionCreated,
    onAcceptSolution,
}) => {

    // =====================================================
    // SAFE DATA
    // =====================================================

    const safeResponseCount =
        safeNumber(
            responseCount
        );


    const safeLanguages =
        Array.isArray(
            problemLanguages
        )
            ? problemLanguages
                .filter(
                    Boolean
                )
            : [];


    const hasProblemId =
        problemId !==
            null
        &&
        problemId !==
            undefined
        &&
        String(
            problemId
        ).trim() !==
            "";


    // =====================================================
    // JSX
    // =====================================================

    return (

        <>

            {/* =============================================
                RESPONSES
            ============================================== */}

            <section
                ref={
                    responsesSectionRef
                }

                aria-labelledby="problem-solutions-title"

                className="
                    mt-8
                    scroll-mt-28

                    overflow-hidden

                    rounded-[2rem]

                    border
                    border-white/10

                    bg-[#0d1117]

                    shadow-2xl
                    shadow-black/30
                "
            >

                {/* =========================================
                    HEADER
                ========================================== */}

                <div
                    className="
                        border-b
                        border-white/10

                        bg-[#0d1117]/95

                        px-5
                        py-5

                        backdrop-blur

                        md:px-7
                    "
                >

                    <div
                        className="
                            flex
                            flex-col
                            gap-4

                            md:flex-row
                            md:items-center
                            md:justify-between
                        "
                    >

                        <div>

                            <p
                                className="
                                    font-mono
                                    text-[11px]
                                    font-black
                                    uppercase
                                    tracking-[0.28em]
                                    text-gray-600
                                "
                            >
                                fsociety://solutions
                            </p>


                            <h2
                                id="problem-solutions-title"

                                className="
                                    mt-1

                                    flex
                                    flex-wrap
                                    items-center
                                    gap-2

                                    text-2xl
                                    font-black
                                    text-white
                                "
                            >
                                Yechimlar


                                <span
                                    aria-label={
                                        `${safeResponseCount} ta yechim`
                                    }

                                    className="
                                        inline-flex
                                        h-7
                                        min-w-7
                                        items-center
                                        justify-center

                                        rounded-full

                                        border
                                        border-cyan-400/20

                                        bg-cyan-400/10

                                        px-2

                                        text-xs
                                        text-cyan-300
                                    "
                                >
                                    {safeResponseCount}
                                </span>

                            </h2>


                            <p
                                className="
                                    mt-2

                                    text-sm
                                    leading-6
                                    text-gray-500
                                "
                            >
                                Community tomonidan yozilgan
                                barcha yechimlar.
                            </p>

                        </div>


                        {!isSolved && (

                            <button
                                type="button"

                                onClick={
                                    onWork
                                }

                                disabled={
                                    !hasProblemId
                                }

                                className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2

                                    rounded-xl

                                    border
                                    border-cyan-400/30

                                    bg-cyan-400/10

                                    px-5
                                    py-3

                                    text-sm
                                    font-black
                                    text-cyan-300

                                    transition-all
                                    duration-200

                                    hover:bg-cyan-400/20

                                    active:scale-[0.98]

                                    disabled:cursor-not-allowed
                                    disabled:opacity-40
                                "
                            >

                                <Pencil
                                    size={15}
                                    aria-hidden="true"
                                />

                                Yechim yozish

                            </button>
                        )}

                    </div>

                </div>


                {/* =========================================
                    RESPONSE LIST
                ========================================== */}

                <div
                    className="
                        max-h-[780px]

                        overflow-y-auto

                        px-4
                        py-5

                        md:px-6

                        lg:max-h-[850px]
                    "
                >

                    {hasProblemId ? (

                        <ProblemResponse
                            key={
                                `problem-responses-${problemId}-${responsesRefreshKey}`
                            }

                            id={
                                problemId
                            }

                            isOwner={
                                isOwner
                            }

                            isSolved={
                                isSolved
                            }

                            onAcceptSolution={
                                onAcceptSolution
                            }
                        />

                    ) : (

                        <div
                            className="
                                rounded-2xl

                                border
                                border-white/[0.06]

                                bg-white/[0.025]

                                p-5

                                text-center
                            "
                        >

                            <p
                                className="
                                    text-sm
                                    font-medium
                                    text-gray-600
                                "
                            >
                                Muammo identifikatori topilmadi.
                            </p>

                        </div>
                    )}

                </div>

            </section>


            {/* =============================================
                NEW SOLUTION FORM
            ============================================== */}

            {!isSolved ? (

                <section
                    ref={
                        responseFormRef
                    }

                    aria-labelledby="new-solution-title"

                    className="
                        mt-8
                        scroll-mt-28

                        overflow-hidden

                        rounded-[2rem]

                        border
                        border-cyan-400/20

                        bg-[#0d1117]

                        p-5

                        shadow-2xl
                        shadow-cyan-500/5

                        md:p-7
                    "
                >

                    <div
                        className="
                            mb-5
                        "
                    >

                        <p
                            className="
                                font-mono
                                text-[11px]
                                font-black
                                uppercase
                                tracking-[0.28em]
                                text-gray-600
                            "
                        >
                            fsociety://new-solution
                        </p>


                        <h2
                            id="new-solution-title"

                            className="
                                mt-1

                                text-2xl
                                font-black
                                text-white
                            "
                        >
                            O‘z yechimingizni yozing
                        </h2>


                        <p
                            className="
                                mt-2

                                text-sm
                                leading-6
                                text-gray-500
                            "
                        >
                            Kodingizni, tushuntirishingizni
                            va xatoni qanday tuzatganingizni
                            aniq yozing.
                        </p>

                    </div>


                    {hasProblemId ? (

                        <ProblemResponseForm
                            id={
                                problemId
                            }

                            problemLanguages={
                                safeLanguages
                            }

                            onSuccess={
                                onSolutionCreated
                            }
                        />

                    ) : (

                        <div
                            className="
                                rounded-2xl

                                border
                                border-white/[0.06]

                                bg-white/[0.025]

                                p-5

                                text-center
                            "
                        >

                            <p
                                className="
                                    text-sm
                                    font-medium
                                    text-gray-600
                                "
                            >
                                Yechim yuborish uchun muammo ID mavjud emas.
                            </p>

                        </div>
                    )}

                </section>

            ) : (

                // =========================================
                // SOLVED STATE
                // =========================================

                <section
                    aria-label="Muammo yechilgan"

                    className="
                        mt-8

                        rounded-[2rem]

                        border
                        border-green-400/20

                        bg-green-500/[0.07]

                        p-6

                        text-center
                    "
                >

                    <div
                        className="
                            mx-auto
                            mb-3

                            flex
                            h-14
                            w-14
                            items-center
                            justify-center

                            rounded-2xl

                            border
                            border-green-400/15

                            bg-green-500/10

                            text-green-300
                        "
                    >

                        <CheckCircle2
                            size={25}
                            aria-hidden="true"
                        />

                    </div>


                    <h3
                        className="
                            text-xl
                            font-black
                            text-white
                        "
                    >
                        Bu muammo yechilgan
                    </h3>


                    <p
                        className="
                            mx-auto
                            mt-2
                            max-w-lg

                            text-sm
                            leading-6
                            text-gray-400
                        "
                    >
                        Yangi yechim yozish yopilgan.
                        Mavjud yechimlarni yuqoridagi
                        blokda ko‘rishingiz mumkin.
                    </p>

                </section>
            )}

        </>
    );
};


export default React.memo(
    ProblemDetailSolutions
);