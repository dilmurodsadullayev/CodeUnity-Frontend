// src/components/fcoin-history/FCoinHistoryState.jsx

import React from "react";

import {
    motion,
} from "framer-motion";

import {
    AlertTriangle,
    History,
    Loader2,
    RefreshCw,
    WalletCards,
} from "lucide-react";


// =========================================================
// SKELETON ITEM
// =========================================================

const SkeletonItem = ({
    index = 0,
}) => {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 10,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                duration: 0.25,
                delay: index * 0.04,
            }}
            className="
                relative
                overflow-hidden

                rounded-[24px]

                border
                border-white/[0.05]

                bg-[#0d1117]

                p-4

                sm:p-5
            "
        >
            <motion.div
                aria-hidden="true"
                initial={{
                    x: "-120%",
                }}
                animate={{
                    x: "220%",
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                    delay: index * 0.08,
                }}
                className="
                    pointer-events-none
                    absolute
                    inset-y-0

                    w-1/3

                    bg-gradient-to-r
                    from-transparent
                    via-white/[0.035]
                    to-transparent
                "
            />


            <div
                className="
                    relative
                    z-10

                    flex
                    flex-col

                    gap-4

                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >
                <div
                    className="
                        flex
                        min-w-0
                        flex-1

                        items-center

                        gap-4
                    "
                >
                    <div
                        className="
                            h-12
                            w-12

                            shrink-0

                            animate-pulse

                            rounded-2xl

                            bg-white/[0.05]

                            sm:h-14
                            sm:w-14
                        "
                    />


                    <div
                        className="
                            min-w-0
                            flex-1
                        "
                    >
                        <div
                            className="
                                h-5
                                w-24

                                animate-pulse

                                rounded-full

                                bg-white/[0.04]
                            "
                        />


                        <div
                            className="
                                mt-3

                                h-4
                                w-2/3

                                animate-pulse

                                rounded-lg

                                bg-white/[0.055]
                            "
                        />


                        <div
                            className="
                                mt-2

                                h-3
                                w-5/6

                                animate-pulse

                                rounded-lg

                                bg-white/[0.035]
                            "
                        />


                        <div
                            className="
                                mt-3

                                h-3
                                w-32

                                animate-pulse

                                rounded-lg

                                bg-white/[0.03]
                            "
                        />
                    </div>
                </div>


                <div
                    className="
                        flex
                        items-center

                        gap-3

                        border-t
                        border-white/[0.04]

                        pt-4

                        sm:border-l
                        sm:border-t-0

                        sm:pl-5
                        sm:pt-0
                    "
                >
                    <div
                        className="
                            h-9
                            w-9

                            animate-pulse

                            rounded-xl

                            bg-white/[0.04]
                        "
                    />


                    <div
                        className="
                            h-10
                            w-24

                            animate-pulse

                            rounded-xl

                            bg-white/[0.05]
                        "
                    />
                </div>
            </div>
        </motion.div>
    );
};


// =========================================================
// LOADING STATE
// =========================================================

const LoadingState = () => {
    return (
        <section
            className="
                space-y-3
            "
        >
            <div
                className="
                    mb-4

                    flex
                    items-center

                    gap-2
                "
            >
                <Loader2
                    size={16}
                    className="
                        animate-spin
                        text-indigo-300
                    "
                />


                <span
                    className="
                        font-mono

                        text-[10px]
                        font-black

                        uppercase

                        tracking-[0.15em]

                        text-gray-500
                    "
                >
                    Ledger yuklanmoqda
                </span>
            </div>


            {
                Array.from({
                    length: 5,
                }).map(
                    (
                        _,
                        index
                    ) => (
                        <SkeletonItem
                            key={
                                index
                            }
                            index={
                                index
                            }
                        />
                    )
                )
            }
        </section>
    );
};


// =========================================================
// FULL ERROR STATE
// =========================================================

const ErrorState = ({
    error,
    onRetry,
    isLoading = false,
}) => {
    return (
        <motion.section
            initial={{
                opacity: 0,
                y: 14,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            className="
                relative
                overflow-hidden

                rounded-[28px]

                border
                border-red-400/[0.12]

                bg-red-500/[0.035]

                px-6
                py-12

                text-center
            "
        >
            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute

                    left-1/2
                    top-0

                    h-32
                    w-64

                    -translate-x-1/2

                    rounded-full

                    bg-red-500/[0.08]

                    blur-[70px]
                "
            />


            <div
                className="
                    relative
                    z-10
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
                        border-red-400/[0.14]

                        bg-red-500/[0.07]

                        text-red-300
                    "
                >
                    <AlertTriangle
                        size={24}
                    />
                </div>


                <h3
                    className="
                        mt-5

                        text-lg
                        font-black

                        text-white
                    "
                >
                    FCoin tarixi yuklanmadi
                </h3>


                <p
                    className="
                        mx-auto
                        mt-2

                        max-w-lg

                        text-sm
                        font-medium

                        leading-6

                        text-gray-500
                    "
                >
                    {
                        error
                        ||
                        "Server bilan bog‘lanishda xatolik yuz berdi."
                    }
                </p>


                {
                    typeof onRetry ===
                        "function"
                    &&
                    (
                        <button
                            type="button"
                            onClick={
                                onRetry
                            }
                            disabled={
                                isLoading
                            }
                            className="
                                mt-6

                                inline-flex
                                items-center
                                justify-center

                                gap-2

                                rounded-xl

                                border
                                border-red-400/20

                                bg-red-500/[0.08]

                                px-4
                                py-2.5

                                text-xs
                                font-black

                                text-red-200

                                transition-all

                                hover:border-red-400/30
                                hover:bg-red-500/[0.13]

                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            <RefreshCw
                                size={15}
                                className={
                                    isLoading
                                        ? "animate-spin"
                                        : ""
                                }
                            />

                            Qayta urinish
                        </button>
                    )
                }
            </div>
        </motion.section>
    );
};


// =========================================================
// REFRESH ERROR
//
// Eski ma'lumot mavjud bo'lsa,
// refresh error sabab listni yashirmaymiz.
// =========================================================

const RefreshErrorState = ({
    error,
    onRetry,
    isLoading = false,
}) => {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: -6,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            className="
                mb-4

                flex
                flex-col

                gap-3

                rounded-2xl

                border
                border-amber-400/[0.12]

                bg-amber-500/[0.04]

                p-4

                sm:flex-row
                sm:items-center
                sm:justify-between
            "
        >
            <div
                className="
                    flex
                    min-w-0

                    items-start

                    gap-3
                "
            >
                <div
                    className="
                        flex
                        h-9
                        w-9

                        shrink-0

                        items-center
                        justify-center

                        rounded-xl

                        border
                        border-amber-400/15

                        bg-amber-500/[0.07]

                        text-amber-300
                    "
                >
                    <AlertTriangle
                        size={16}
                    />
                </div>


                <div
                    className="
                        min-w-0
                    "
                >
                    <p
                        className="
                            text-xs
                            font-black

                            text-amber-200
                        "
                    >
                        Yangilashda xatolik
                    </p>


                    <p
                        className="
                            mt-1

                            line-clamp-2

                            text-[11px]
                            font-medium

                            leading-5

                            text-gray-500
                        "
                    >
                        {
                            error
                        }
                    </p>
                </div>
            </div>


            {
                typeof onRetry ===
                    "function"
                &&
                (
                    <button
                        type="button"
                        onClick={
                            onRetry
                        }
                        disabled={
                            isLoading
                        }
                        className="
                            inline-flex
                            shrink-0

                            items-center
                            justify-center

                            gap-1.5

                            rounded-xl

                            border
                            border-amber-400/15

                            bg-amber-500/[0.06]

                            px-3
                            py-2

                            text-[10px]
                            font-black

                            text-amber-200

                            transition

                            hover:bg-amber-500/[0.10]

                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        <RefreshCw
                            size={13}
                            className={
                                isLoading
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        Yangilash
                    </button>
                )
            }
        </motion.div>
    );
};


// =========================================================
// EMPTY STATE
// =========================================================

const EmptyState = () => {
    return (
        <motion.section
            initial={{
                opacity: 0,
                y: 14,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            className="
                relative
                overflow-hidden

                rounded-[28px]

                border
                border-dashed
                border-white/[0.08]

                bg-white/[0.015]

                px-6
                py-16

                text-center
            "
        >
            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute

                    left-1/2
                    top-0

                    h-40
                    w-72

                    -translate-x-1/2

                    rounded-full

                    bg-indigo-500/[0.05]

                    blur-[80px]
                "
            />


            <div
                className="
                    relative
                    z-10
                "
            >
                <div
                    className="
                        mx-auto

                        flex
                        h-16
                        w-16

                        items-center
                        justify-center

                        rounded-[22px]

                        border
                        border-white/[0.07]

                        bg-white/[0.025]

                        text-gray-600
                    "
                >
                    <History
                        size={26}
                    />
                </div>


                <h3
                    className="
                        mt-5

                        text-lg
                        font-black

                        text-white
                    "
                >
                    Hali tranzaksiyalar yo‘q
                </h3>


                <p
                    className="
                        mx-auto
                        mt-2

                        max-w-md

                        text-sm
                        font-medium

                        leading-6

                        text-gray-500
                    "
                >
                    Problem, project, feedback,
                    daily login yoki boshqa
                    faoliyatlardan FCoin olganingizda
                    history shu yerda ko‘rinadi.
                </p>


                <div
                    className="
                        mx-auto
                        mt-6

                        inline-flex
                        items-center

                        gap-2

                        rounded-full

                        border
                        border-yellow-400/[0.12]

                        bg-yellow-400/[0.05]

                        px-3
                        py-1.5

                        text-[10px]
                        font-black

                        uppercase

                        tracking-[0.14em]

                        text-yellow-300
                    "
                >
                    <WalletCards
                        size={13}
                    />

                    FCoin ledger
                </div>
            </div>
        </motion.section>
    );
};


// =========================================================
// MAIN STATE
// =========================================================

const FCoinHistoryState = ({
    isInitialLoading = false,
    isLoading = false,

    error = null,

    hasLoaded = false,
    hasTransactions = false,

    onRetry,
}) => {
    // =====================================================
    // INITIAL LOAD
    // =====================================================

    if (
        isInitialLoading
    ) {
        return (
            <LoadingState />
        );
    }


    // =====================================================
    // REFRESH ERROR
    //
    // Old data bor — uni yo'qotmaymiz.
    // =====================================================

    if (
        error
        &&
        hasTransactions
    ) {
        return (
            <RefreshErrorState
                error={
                    error
                }
                onRetry={
                    onRetry
                }
                isLoading={
                    isLoading
                }
            />
        );
    }


    // =====================================================
    // FULL ERROR
    // =====================================================

    if (
        error
    ) {
        return (
            <ErrorState
                error={
                    error
                }
                onRetry={
                    onRetry
                }
                isLoading={
                    isLoading
                }
            />
        );
    }


    // =====================================================
    // EMPTY
    // =====================================================

    if (
        hasLoaded
        &&
        !hasTransactions
    ) {
        return (
            <EmptyState />
        );
    }


    return null;
};


// =========================================================
// EXPORT
// =========================================================

export default FCoinHistoryState;