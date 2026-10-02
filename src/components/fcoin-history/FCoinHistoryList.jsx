// src/components/fcoin-history/FCoinHistoryList.jsx

import React from "react";

import {
    AnimatePresence,
    motion,
} from "framer-motion";

import {
    History,
    Loader2,
} from "lucide-react";

import FCoinHistoryItem from "./FCoinHistoryItem";

import {
    getCoinItemKey,
} from "./coinHistoryHelpers";


// =========================================================
// LIST
// =========================================================

const FCoinHistoryList = ({
    coins = [],
    isRefreshing = false,
}) => {
    const transactions =
        Array.isArray(
            coins
        )
            ? coins
            : [];


    // =====================================================
    // EMPTY
    //
    // To'liq empty/error/loading state keyingi
    // FCoinHistoryState.jsx ga o'tadi.
    //
    // Bu fallback faqat componentni standalone
    // xavfsiz qilish uchun.
    // =====================================================

    if (
        transactions.length === 0
    ) {
        return (
            <section
                id="fcoin-history-list"
                className="
                    scroll-mt-28

                    rounded-[26px]

                    border
                    border-dashed
                    border-white/[0.07]

                    bg-white/[0.015]

                    px-6
                    py-16

                    text-center
                "
            >
                <div
                    className="
                        mx-auto

                        flex
                        h-14
                        w-14

                        items-center
                        justify-center

                        rounded-2xl

                        border
                        border-white/[0.07]

                        bg-white/[0.025]

                        text-gray-600
                    "
                >
                    <History
                        size={23}
                    />
                </div>


                <p
                    className="
                        mt-4

                        text-sm
                        font-black

                        text-gray-400
                    "
                >
                    FCoin tranzaksiyalar topilmadi
                </p>


                <p
                    className="
                        mx-auto
                        mt-2

                        max-w-sm

                        text-xs
                        font-medium

                        leading-5

                        text-gray-600
                    "
                >
                    Yangi mukofot yoki FCoin xarajati
                    paydo bo‘lganda shu yerda ko‘rinadi.
                </p>
            </section>
        );
    }


    return (
        <section
            id="fcoin-history-list"
            className="
                relative

                scroll-mt-28
            "
        >
            {/* =============================================
                HEADER
            ============================================== */}

            <div
                className="
                    mb-4

                    flex
                    items-center
                    justify-between

                    gap-3
                "
            >
                <div
                    className="
                        flex
                        items-center

                        gap-2
                    "
                >
                    <div
                        className="
                            flex
                            h-8
                            w-8

                            items-center
                            justify-center

                            rounded-xl

                            border
                            border-white/[0.06]

                            bg-white/[0.025]

                            text-gray-500
                        "
                    >
                        <History
                            size={14}
                        />
                    </div>


                    <div>
                        <h2
                            className="
                                text-sm
                                font-black

                                text-white
                            "
                        >
                            Tranzaksiyalar
                        </h2>


                        <p
                            className="
                                mt-0.5

                                text-[10px]
                                font-medium

                                text-gray-600
                            "
                        >
                            Eng yangi yozuvlar birinchi
                        </p>
                    </div>
                </div>


                {/* =========================================
                    REFRESH STATUS
                ========================================== */}

                <AnimatePresence>
                    {
                        isRefreshing
                        &&
                        (
                            <motion.div
                                initial={{
                                    opacity:
                                        0,

                                    x:
                                        8,
                                }}
                                animate={{
                                    opacity:
                                        1,

                                    x:
                                        0,
                                }}
                                exit={{
                                    opacity:
                                        0,

                                    x:
                                        8,
                                }}
                                className="
                                    inline-flex
                                    items-center

                                    gap-1.5

                                    rounded-full

                                    border
                                    border-indigo-400/15

                                    bg-indigo-500/[0.06]

                                    px-2.5
                                    py-1.5

                                    font-mono

                                    text-[9px]
                                    font-black

                                    uppercase

                                    tracking-[0.12em]

                                    text-indigo-300
                                "
                            >
                                <Loader2
                                    size={12}
                                    className="
                                        animate-spin
                                    "
                                />

                                Updating
                            </motion.div>
                        )
                    }
                </AnimatePresence>
            </div>


            {/* =============================================
                REFRESH PROGRESS
            ============================================== */}

            <div
                className="
                    mb-3

                    h-px

                    overflow-hidden

                    rounded-full

                    bg-white/[0.025]
                "
            >
                {
                    isRefreshing
                    &&
                    (
                        <motion.div
                            initial={{
                                x:
                                    "-100%",
                            }}
                            animate={{
                                x:
                                    "350%",
                            }}
                            transition={{
                                duration:
                                    1.2,

                                repeat:
                                    Infinity,

                                ease:
                                    "linear",
                            }}
                            className="
                                h-full
                                w-1/4

                                bg-gradient-to-r
                                from-transparent
                                via-indigo-400/80
                                to-transparent
                            "
                        />
                    )
                }
            </div>


            {/* =============================================
                ITEMS
            ============================================== */}

            <div
                className="
                    grid
                    grid-cols-1

                    gap-3
                "
            >
                <AnimatePresence
                    initial={false}
                    mode="popLayout"
                >
                    {
                        transactions.map(
                            (
                                item,
                                index
                            ) => (
                                <motion.div
                                    key={
                                        getCoinItemKey(
                                            item,
                                            index
                                        )
                                    }
                                    layout
                                >
                                    <FCoinHistoryItem
                                        item={
                                            item
                                        }
                                        index={
                                            index
                                        }
                                    />
                                </motion.div>
                            )
                        )
                    }
                </AnimatePresence>
            </div>


            {/* =============================================
                BOTTOM DECORATION
            ============================================== */}

            <div
                aria-hidden="true"
                className="
                    mx-auto
                    mt-6

                    h-px
                    w-2/3

                    bg-gradient-to-r
                    from-transparent
                    via-white/[0.06]
                    to-transparent
                "
            />
        </section>
    );
};


// =========================================================
// EXPORT
// =========================================================

export default React.memo(
    FCoinHistoryList
);