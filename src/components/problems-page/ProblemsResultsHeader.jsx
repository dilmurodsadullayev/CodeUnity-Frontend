// src/components/problems-page/ProblemsResultsHeader.jsx

import React from "react";

import {
    Loader2,
} from "lucide-react";


// =========================================================
// SAFE NUMBER
// =========================================================

const safeNumber = (
    value
) => {

    const number =
        Number(
            value
        );


    if (
        !Number.isFinite(
            number
        )
        ||
        number < 0
    ) {
        return 0;
    }


    return number;
};


// =========================================================
// PROBLEMS RESULTS HEADER
// =========================================================

const ProblemsResultsHeader = ({
    count = 0,

    start = 0,
    end = 0,

    isLoading = false,

    isResolved = false,
}) => {

    const safeCount =
        safeNumber(
            count
        );


    const safeStart =
        safeNumber(
            start
        );


    const safeEnd =
        safeNumber(
            end
        );


    return (

        <div
            className="
                mb-6

                flex
                flex-col
                gap-3

                sm:flex-row
                sm:items-end
                sm:justify-between
            "
        >

            {/* =============================================
                TITLE
            ============================================== */}

            <div>

                <p
                    className="
                        font-mono
                        text-[10px]
                        font-black
                        uppercase
                        tracking-[0.18em]
                        text-cyan-400/70
                    "
                >
                    problem.registry
                </p>


                <h2
                    className="
                        mt-1

                        text-xl
                        font-black
                        text-white
                    "
                >
                    Muammolar
                </h2>

            </div>


            {/* =============================================
                STATUS
            ============================================== */}

            <div
                aria-live="polite"

                className="
                    flex
                    min-h-[20px]
                    items-center
                    gap-3

                    text-xs
                    font-bold
                    text-gray-600
                "
            >

                {/* =========================================
                    CURRENT RESULT RANGE
                ========================================== */}

                {isResolved &&
                    safeCount > 0 && (

                    <span>
                        {safeStart}
                        {" — "}
                        {safeEnd}
                        {" / "}
                        {safeCount}
                    </span>
                )}


                {/* =========================================
                    EMPTY RESULT COUNT
                ========================================== */}

                {isResolved &&
                    safeCount === 0 &&
                    !isLoading && (

                    <span
                        className="
                            font-mono
                            text-[10px]
                            uppercase
                            tracking-[0.12em]
                            text-gray-700
                        "
                    >
                        0 records
                    </span>
                )}


                {/* =========================================
                    LOADING
                ========================================== */}

                {isLoading && (

                    <span
                        role="status"

                        className="
                            inline-flex
                            items-center
                            gap-1.5

                            text-cyan-400
                        "
                    >

                        <Loader2
                            size={13}

                            aria-hidden="true"

                            className="
                                animate-spin
                            "
                        />

                        yangilanmoqda

                    </span>
                )}

            </div>

        </div>
    );
};


export default React.memo(
    ProblemsResultsHeader
);