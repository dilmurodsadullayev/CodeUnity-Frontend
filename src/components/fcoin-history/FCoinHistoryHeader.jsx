// src/components/fcoin-history/FCoinHistoryHeader.jsx

import React from "react";

import {
    motion,
} from "framer-motion";

import {
    ArrowLeftRight,
    RefreshCw,
    ShieldCheck,
    WalletCards,
} from "lucide-react";

import FCoinIcon from "../../assests/coin/fcoin.png";


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
// HEADER
// =========================================================

const FCoinHistoryHeader = ({
    username = "FSociety",
    balance = 0,
    count = 0,

    isRefreshing = false,

    onRefresh,
}) => {
    const safeUsername =
        String(
            username
            ||
            "FSociety"
        );


    const handleRefresh = () => {
        if (
            isRefreshing
            ||
            typeof onRefresh !==
                "function"
        ) {
            return;
        }


        onRefresh();
    };


    return (
        <section
            className="
                relative
                overflow-hidden

                rounded-[30px]

                border
                border-white/[0.07]

                bg-[#0d1117]

                shadow-[0_30px_100px_rgba(0,0,0,0.45)]
            "
        >
            {/* =============================================
                BACKGROUND GLOWS
            ============================================== */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    -left-24
                    -top-24

                    h-72
                    w-72

                    rounded-full

                    bg-yellow-400/[0.07]

                    blur-[100px]
                "
            />


            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    -right-20
                    top-0

                    h-80
                    w-80

                    rounded-full

                    bg-indigo-500/[0.08]

                    blur-[110px]
                "
            />


            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    inset-x-0
                    bottom-0

                    h-px

                    bg-gradient-to-r
                    from-transparent
                    via-yellow-400/30
                    to-transparent
                "
            />


            {/* =============================================
                GRID DECORATION
            ============================================== */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    inset-0

                    opacity-[0.025]

                    [background-image:linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)]

                    [background-size:42px_42px]
                "
            />


            {/* =============================================
                CONTENT
            ============================================== */}

            <div
                className="
                    relative
                    z-10

                    p-5

                    sm:p-7
                    lg:p-9
                "
            >
                <div
                    className="
                        flex
                        flex-col

                        gap-7

                        xl:flex-row
                        xl:items-center
                        xl:justify-between
                    "
                >
                    {/* =====================================
                        LEFT
                    ====================================== */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 16,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.4,
                        }}
                        className="
                            min-w-0
                            flex-1
                        "
                    >
                        {/* =================================
                            EYEBROW
                        ================================== */}

                        <div
                            className="
                                mb-4

                                inline-flex
                                items-center

                                gap-2

                                rounded-full

                                border
                                border-yellow-400/20

                                bg-yellow-400/[0.07]

                                px-3
                                py-1.5

                                font-mono

                                text-[10px]
                                font-black

                                uppercase

                                tracking-[0.18em]

                                text-yellow-300
                            "
                        >
                            <ArrowLeftRight
                                size={14}
                            />

                            FCoin Ledger
                        </div>


                        {/* =================================
                            TITLE
                        ================================== */}

                        <h1
                            className="
                                max-w-4xl

                                text-3xl
                                font-black

                                tracking-tight

                                text-white

                                sm:text-4xl
                                lg:text-5xl
                            "
                        >
                            <span
                                className="
                                    text-yellow-300
                                "
                            >
                                {safeUsername}
                            </span>

                            {" "}

                            FCoin tarixi
                        </h1>


                        {/* =================================
                            DESCRIPTION
                        ================================== */}

                        <p
                            className="
                                mt-4

                                max-w-2xl

                                text-sm
                                font-medium

                                leading-7

                                text-gray-400

                                sm:text-[15px]
                            "
                        >
                            Platformadagi FCoin kirim va
                            chiqimlaringiz, mukofotlar,
                            promotion xarajatlari va boshqa
                            tranzaksiyalar shu yerda
                            saqlanadi.
                        </p>


                        {/* =================================
                            BADGES
                        ================================== */}

                        <div
                            className="
                                mt-5

                                flex
                                flex-wrap

                                gap-2
                            "
                        >
                            <span
                                className="
                                    inline-flex
                                    items-center

                                    gap-1.5

                                    rounded-full

                                    border
                                    border-emerald-400/15

                                    bg-emerald-500/[0.06]

                                    px-3
                                    py-1.5

                                    text-[10px]
                                    font-bold

                                    uppercase

                                    tracking-[0.14em]

                                    text-emerald-300
                                "
                            >
                                <ShieldCheck
                                    size={13}
                                />

                                Structured ledger
                            </span>


                            <span
                                className="
                                    inline-flex
                                    items-center

                                    gap-1.5

                                    rounded-full

                                    border
                                    border-indigo-400/15

                                    bg-indigo-500/[0.06]

                                    px-3
                                    py-1.5

                                    text-[10px]
                                    font-bold

                                    uppercase

                                    tracking-[0.14em]

                                    text-indigo-300
                                "
                            >
                                <WalletCards
                                    size={13}
                                />

                                {formatNumber(
                                    count
                                )}

                                {" "}
                                tranzaksiya
                            </span>
                        </div>
                    </motion.div>


                    {/* =====================================
                        RIGHT / BALANCE
                    ====================================== */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.96,
                            y: 12,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.4,
                            delay: 0.08,
                        }}
                        className="
                            w-full

                            xl:w-auto
                            xl:min-w-[360px]
                        "
                    >
                        <div
                            className="
                                relative
                                overflow-hidden

                                rounded-[26px]

                                border
                                border-yellow-400/[0.16]

                                bg-gradient-to-br
                                from-yellow-400/[0.08]
                                via-white/[0.025]
                                to-indigo-500/[0.06]

                                p-5

                                shadow-[0_20px_60px_rgba(0,0,0,0.35)]

                                sm:p-6
                            "
                        >
                            <div
                                aria-hidden="true"
                                className="
                                    pointer-events-none
                                    absolute
                                    -right-10
                                    -top-10

                                    h-32
                                    w-32

                                    rounded-full

                                    bg-yellow-400/[0.10]

                                    blur-3xl
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
                                        flex
                                        items-center
                                        justify-between

                                        gap-4
                                    "
                                >
                                    <div>
                                        <p
                                            className="
                                                font-mono

                                                text-[10px]
                                                font-black

                                                uppercase

                                                tracking-[0.18em]

                                                text-gray-500
                                            "
                                        >
                                            Current balance
                                        </p>


                                        <p
                                            className="
                                                mt-1

                                                text-xs
                                                font-semibold

                                                text-gray-400
                                            "
                                        >
                                            Joriy FCoin balans
                                        </p>
                                    </div>


                                    {/* =====================
                                        REFRESH
                                    ====================== */}

                                    <button
                                        type="button"
                                        onClick={
                                            handleRefresh
                                        }
                                        disabled={
                                            isRefreshing
                                        }
                                        aria-label="FCoin tarixini yangilash"
                                        title="Yangilash"
                                        className="
                                            inline-flex
                                            h-10
                                            w-10

                                            shrink-0

                                            items-center
                                            justify-center

                                            rounded-xl

                                            border
                                            border-white/[0.07]

                                            bg-black/20

                                            text-gray-400

                                            transition-all
                                            duration-200

                                            hover:border-yellow-400/20
                                            hover:bg-yellow-400/[0.07]
                                            hover:text-yellow-300

                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        "
                                    >
                                        <RefreshCw
                                            size={17}
                                            className={
                                                isRefreshing
                                                    ? "animate-spin"
                                                    : ""
                                            }
                                        />
                                    </button>
                                </div>


                                {/* =========================
                                    BALANCE
                                ========================== */}

                                <div
                                    className="
                                        mt-5

                                        flex
                                        items-end

                                        gap-3
                                    "
                                >
                                    <motion.img
                                        whileHover={{
                                            rotate: 8,
                                            scale: 1.08,
                                        }}
                                        transition={{
                                            type:
                                                "spring",

                                            stiffness:
                                                250,

                                            damping:
                                                16,
                                        }}
                                        src={
                                            FCoinIcon
                                        }
                                        alt="FCoin"
                                        className="
                                            h-14
                                            w-14

                                            shrink-0

                                            object-contain

                                            drop-shadow-[0_0_18px_rgba(250,204,21,0.35)]

                                            sm:h-16
                                            sm:w-16
                                        "
                                    />


                                    <div
                                        className="
                                            min-w-0
                                        "
                                    >
                                        <div
                                            className="
                                                flex
                                                flex-wrap
                                                items-baseline

                                                gap-x-2
                                            "
                                        >
                                            <span
                                                className="
                                                    text-4xl
                                                    font-black

                                                    tracking-[-0.06em]

                                                    text-white

                                                    sm:text-5xl
                                                "
                                            >
                                                {
                                                    formatNumber(
                                                        balance
                                                    )
                                                }
                                            </span>


                                            <span
                                                className="
                                                    font-mono

                                                    text-xs
                                                    font-black

                                                    uppercase

                                                    tracking-[0.14em]

                                                    text-yellow-300
                                                "
                                            >
                                                FCoin
                                            </span>
                                        </div>


                                        <p
                                            className="
                                                mt-1

                                                text-[11px]
                                                font-medium

                                                text-gray-500
                                            "
                                        >
                                            Backend ledger bilan
                                            sinxron balans
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};


// =========================================================
// EXPORT
// =========================================================

export default FCoinHistoryHeader;