// src/components/problems-page/ProblemsSort.jsx

import React from "react";

import {
    ArrowDownAZ,
} from "lucide-react";

import {
    PROBLEM_ORDERING_OPTIONS,
} from "./problemPageHelpers";


// =========================================================
// PROBLEMS SORT
// =========================================================

const ProblemsSort = ({
    value = "newest",
    onChange,
    disabled = false,
}) => {

    // =====================================================
    // SAFE OPTIONS
    // =====================================================

    const options =
        Array.isArray(
            PROBLEM_ORDERING_OPTIONS
        )
            ? PROBLEM_ORDERING_OPTIONS
            : [];


    // =====================================================
    // SAFE VALUE
    // =====================================================

    const valueExists =
        options.some(
            (
                item
            ) =>
                item?.value === value
        );


    const safeValue =
        valueExists
            ? value
            : (
                options[0]?.value
                ||
                "newest"
            );


    // =====================================================
    // JSX
    // =====================================================

    return (

        <label
            className="
                block
                min-w-0
            "
        >

            {/* =============================================
                LABEL
            ============================================== */}

            <div
                className="
                    mb-1.5

                    flex
                    min-h-[16px]
                    items-center
                    justify-between
                    gap-2
                "
            >

                <span
                    className="
                        block

                        text-[10px]
                        font-black
                        uppercase
                        tracking-[0.16em]
                        text-gray-600
                    "
                >
                    Saralash
                </span>


                <ArrowDownAZ
                    size={12}

                    className="
                        text-indigo-400/50
                    "
                />

            </div>


            {/* =============================================
                SELECT
            ============================================== */}

            <select
                value={
                    safeValue
                }

                disabled={
                    disabled
                }

                aria-label="Muammolarni saralash"

                onChange={(
                    event
                ) => {

                    onChange?.(
                        event.target.value
                    );
                }}

                className="
                    h-11
                    w-full

                    cursor-pointer

                    rounded-xl

                    border
                    border-white/[0.08]

                    bg-[#0a0f18]

                    px-3

                    text-xs
                    font-bold
                    text-gray-300

                    outline-none

                    transition-all
                    duration-200

                    hover:border-indigo-400/20

                    focus:border-indigo-400/30

                    focus:ring-4
                    focus:ring-indigo-500/[0.06]

                    disabled:cursor-not-allowed
                    disabled:opacity-40
                "
            >

                {options.map(
                    (
                        item
                    ) => {

                        if (
                            !item?.value
                        ) {
                            return null;
                        }


                        return (

                            <option
                                key={
                                    item.value
                                }

                                value={
                                    item.value
                                }
                            >
                                {
                                    item.label
                                    ||
                                    item.value
                                }
                            </option>
                        );
                    }
                )}

            </select>

        </label>
    );
};


export default React.memo(
    ProblemsSort
);