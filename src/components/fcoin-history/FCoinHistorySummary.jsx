// src/components/fcoin-history/FCoinHistorySummary.jsx

import React from "react";

import {
    motion,
} from "framer-motion";

import {
    Database,
    Layers3,
    ListFilter,
    Rows3,
} from "lucide-react";


// =========================================================
// FORMAT NUMBER
// =========================================================

const formatNumber = (
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
    ) {
        return "0";
    }


    try {
        return (
            new Intl.NumberFormat(
                "uz-UZ"
            ).format(
                number
            )
        );

    } catch {
        return String(
            number
        );
    }
};


// =========================================================
// STAT CARD
// =========================================================

const SummaryCard = ({
    icon: Icon,
    label,
    value,
    description,
}) => {
    return (
        <motion.div
            whileHover={{
                y: -3,
            }}
            transition={{
                duration: 0.2,
            }}
            className="
                group

                relative
                overflow-hidden

                rounded-2xl

                border
                border-white/[0.06]

                bg-white/[0.025]

                p-4

                transition-all
                duration-200

                hover:border-indigo-400/[0.16]
                hover:bg-white/[0.04]
            "
        >
            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    -right-8
                    -top-8

                    h-20
                    w-20

                    rounded-full

                    bg-indigo-500/[0.08]

                    blur-2xl

                    opacity-0

                    transition-opacity

                    group-hover:opacity-100
                "
            />


            <div
                className="
                    relative
                    z-10

                    flex
                    items-start

                    gap-3
                "
            >
                <div
                    className="
                        flex
                        h-10
                        w-10

                        shrink-0

                        items-center
                        justify-center

                        rounded-xl

                        border
                        border-indigo-400/[0.14]

                        bg-indigo-500/[0.07]

                        text-indigo-300
                    "
                >
                    <Icon
                        size={17}
                    />
                </div>


                <div
                    className="
                        min-w-0
                        flex-1
                    "
                >
                    <p
                        className="
                            font-mono

                            text-[9px]
                            font-black

                            uppercase

                            tracking-[0.17em]

                            text-gray-600
                        "
                    >
                        {label}
                    </p>


                    <p
                        className="
                            mt-1

                            truncate

                            text-lg
                            font-black

                            text-white
                        "
                    >
                        {value}
                    </p>


                    {
                        description
                        &&
                        (
                            <p
                                className="
                                    mt-1

                                    text-[11px]
                                    font-medium

                                    leading-5

                                    text-gray-500
                                "
                            >
                                {description}
                            </p>
                        )
                    }
                </div>
            </div>
        </motion.div>
    );
};


// =========================================================
// SUMMARY
// =========================================================

const FCoinHistorySummary = ({
    count = 0,

    currentPage = 1,
    totalPages = 0,

    pageSize = 15,

    range = {
        from: 0,
        to: 0,
        count: 0,
    },

    pageSizeOptions = [
        10,
        15,
        25,
        50,
    ],

    isLoading = false,

    onPageSizeChange,
}) => {
    const safeCount =
        Math.max(
            0,
            Number(
                count
            )
            ||
            0
        );


    const safeCurrentPage =
        Math.max(
            1,
            Number(
                currentPage
            )
            ||
            1
        );


    const safeTotalPages =
        Math.max(
            0,
            Number(
                totalPages
            )
            ||
            0
        );


    const safePageSize =
        Math.max(
            1,
            Number(
                pageSize
            )
            ||
            15
        );


    const safeRange =
        range
        &&
        typeof range === "object"
            ? range
            : {
                from: 0,
                to: 0,
                count: safeCount,
            };


    const handlePageSize = (
        event
    ) => {
        if (
            typeof onPageSizeChange !==
            "function"
        ) {
            return;
        }


        onPageSizeChange(
            event.target.value
        );
    };


    return (
        <section
            className="
                mt-5

                rounded-[26px]

                border
                border-white/[0.06]

                bg-[#0d1117]/80

                p-4

                shadow-[0_20px_70px_rgba(0,0,0,0.25)]

                backdrop-blur-xl

                sm:p-5
            "
        >
            {/* =============================================
                TOP
            ============================================== */}

            <div
                className="
                    mb-4

                    flex
                    flex-col

                    gap-3

                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >
                <div>
                    <div
                        className="
                            flex
                            items-center

                            gap-2
                        "
                    >
                        <ListFilter
                            size={16}
                            className="
                                text-indigo-300
                            "
                        />

                        <h2
                            className="
                                text-sm
                                font-black

                                text-white
                            "
                        >
                            Ledger overview
                        </h2>
                    </div>


                    <p
                        className="
                            mt-1

                            text-[11px]
                            font-medium

                            text-gray-500
                        "
                    >
                        Tranzaksiyalar va pagination
                        holati
                    </p>
                </div>


                {/* =========================================
                    PAGE SIZE
                ========================================== */}

                <label
                    className="
                        flex
                        items-center

                        gap-2

                        text-xs
                        font-semibold

                        text-gray-500
                    "
                >
                    <Rows3
                        size={15}
                    />

                    Sahifada

                    <select
                        value={
                            safePageSize
                        }
                        onChange={
                            handlePageSize
                        }
                        disabled={
                            isLoading
                        }
                        className="
                            rounded-xl

                            border
                            border-white/[0.08]

                            bg-[#111820]

                            px-3
                            py-2

                            text-xs
                            font-black

                            text-gray-200

                            outline-none

                            transition

                            focus:border-indigo-400/40
                            focus:ring-2
                            focus:ring-indigo-500/10

                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        {
                            pageSizeOptions.map(
                                (
                                    option
                                ) => (
                                    <option
                                        key={
                                            option
                                        }
                                        value={
                                            option
                                        }
                                    >
                                        {
                                            option
                                        }
                                    </option>
                                )
                            )
                        }
                    </select>
                </label>
            </div>


            {/* =============================================
                CARDS
            ============================================== */}

            <div
                className="
                    grid

                    gap-3

                    sm:grid-cols-2
                    xl:grid-cols-3
                "
            >
                <SummaryCard
                    icon={
                        Database
                    }
                    label="Total records"
                    value={
                        formatNumber(
                            safeCount
                        )
                    }
                    description="Barcha FCoin tranzaksiyalar"
                />


                <SummaryCard
                    icon={
                        Layers3
                    }
                    label="Current page"
                    value={
                        safeTotalPages > 0
                            ? (
                                `${safeCurrentPage} / ${safeTotalPages}`
                            )
                            : "0 / 0"
                    }
                    description="Joriy pagination holati"
                />


                <SummaryCard
                    icon={
                        Rows3
                    }
                    label="Visible records"
                    value={
                        safeRange.from > 0
                        &&
                        safeRange.to > 0
                            ? (
                                `${formatNumber(
                                    safeRange.from
                                )}–${formatNumber(
                                    safeRange.to
                                )}`
                            )
                            : "0"
                    }
                    description={
                        safeCount > 0
                            ? (
                                `${formatNumber(
                                    safeCount
                                )} ta yozuv ichidan`
                            )
                            : "Hozircha yozuv yo‘q"
                    }
                />
            </div>


            {/* =============================================
                LOADING LINE
            ============================================== */}

            <div
                className="
                    mt-4

                    h-0.5

                    overflow-hidden

                    rounded-full

                    bg-white/[0.03]
                "
            >
                {
                    isLoading
                    &&
                    (
                        <motion.div
                            initial={{
                                x: "-100%",
                            }}
                            animate={{
                                x: "300%",
                            }}
                            transition={{
                                repeat:
                                    Infinity,

                                duration:
                                    1.4,

                                ease:
                                    "linear",
                            }}
                            className="
                                h-full
                                w-1/3

                                rounded-full

                                bg-gradient-to-r
                                from-transparent
                                via-indigo-400
                                to-transparent
                            "
                        />
                    )
                }
            </div>
        </section>
    );
};


// =========================================================
// EXPORT
// =========================================================

export default FCoinHistorySummary;