// src/components/promotions/PromotionActiveCard.jsx

import React from "react";

import {
    CalendarClock,
    Coins,
    RefreshCw,
    Rocket,
    ShieldCheck,
    Zap,
} from "lucide-react";

import CountdownTimer from "../../utils/countdowntimer";

import {
    formatPromotionDateTime,
    getPromotionDurationLabel,
    safePromotionPositiveNumber,
} from "../../utils/promotion";


// =========================================================
// ACTIVE PROMOTION CARD
// =========================================================

const PromotionActiveCard = ({

    campaign,

    promotionExpiresAt = null,

    onRefresh = null,

    isRefreshing = false,

}) => {

    if (!campaign) {
        return null;
    }


    // =====================================================
    // DATA
    // =====================================================

    const expiresAt =
        promotionExpiresAt
        ??
        campaign.expires_at
        ??
        null;


    const startsAt =
        campaign.starts_at
        ??
        null;


    const duration =
        getPromotionDurationLabel({

            durationHours:
                campaign.duration_hours,

            durationLabel:
                campaign.duration_label,

        });


    const price =
        safePromotionPositiveNumber(
            campaign.price_paid
        );


    const priority =
        safePromotionPositiveNumber(
            campaign.priority
        );


    // =====================================================
    // JSX
    // =====================================================

    return (

        <section
            className="
                relative
                overflow-hidden
                rounded-3xl
                border
                border-emerald-400/15
                bg-gradient-to-br
                from-emerald-500/[0.065]
                via-[#0b1018]
                to-cyan-500/[0.035]
                p-5
                shadow-[0_20px_70px_rgba(16,185,129,0.06)]
            "
        >

            {/* =============================================
                DECORATION
            ============================================== */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -right-16
                    -top-16
                    h-44
                    w-44
                    rounded-full
                    bg-emerald-400/[0.06]
                    blur-3xl
                "
            />


            {/* =============================================
                HEADER
            ============================================== */}

            <div
                className="
                    relative
                    flex
                    items-start
                    justify-between
                    gap-4
                "
            >

                <div
                    className="
                        flex
                        items-start
                        gap-3
                    "
                >

                    <div
                        className="
                            grid
                            h-11
                            w-11
                            flex-shrink-0
                            place-items-center
                            rounded-2xl
                            border
                            border-emerald-400/15
                            bg-emerald-400/[0.07]
                            text-emerald-300
                        "
                    >

                        <Rocket
                            size={20}
                            strokeWidth={2}
                        />

                    </div>


                    <div>

                        <div
                            className="
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-full
                                border
                                border-emerald-400/15
                                bg-emerald-400/[0.05]
                                px-2.5
                                py-1
                                text-[8px]
                                font-black
                                uppercase
                                tracking-[0.14em]
                                text-emerald-300
                            "
                        >

                            <ShieldCheck
                                size={10}
                            />

                            Active promotion

                        </div>


                        <h3
                            className="
                                mt-2
                                text-lg
                                font-black
                                text-white
                            "
                        >
                            {
                                campaign.plan_name
                                ||
                                "Promotion"
                            }
                        </h3>

                    </div>

                </div>


                {onRefresh && (

                    <button
                        type="button"

                        onClick={
                            onRefresh
                        }

                        disabled={
                            isRefreshing
                        }

                        className="
                            grid
                            h-9
                            w-9
                            place-items-center
                            rounded-xl
                            border
                            border-white/[0.07]
                            bg-white/[0.025]
                            text-gray-500
                            transition

                            hover:border-emerald-400/15
                            hover:bg-emerald-400/[0.045]
                            hover:text-emerald-300

                            disabled:cursor-not-allowed
                            disabled:opacity-40
                        "
                    >

                        <RefreshCw
                            size={14}

                            className={
                                isRefreshing
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                    </button>
                )}

            </div>


            {/* =============================================
                TIMER
            ============================================== */}

            {expiresAt && (

                <div
                    className="
                        relative
                        mt-5
                        rounded-2xl
                        border
                        border-emerald-400/10
                        bg-black/10
                        p-4
                    "
                >

                    <p
                        className="
                            mb-3
                            font-mono
                            text-[9px]
                            font-black
                            uppercase
                            tracking-[0.15em]
                            text-emerald-300/70
                        "
                    >
                        Reklama tugashigacha
                    </p>


                    <CountdownTimer

                        targetDate={
                            expiresAt
                        }

                        variant="cards"

                        tone="emerald"

                        size="sm"

                        showLabel={
                            false
                        }

                        showIcon={
                            false
                        }

                        expiredText="Promotion tugagan"

                    />

                </div>
            )}


            {/* =============================================
                INFO GRID
            ============================================== */}

            <div
                className="
                    relative
                    mt-4
                    grid
                    gap-2
                    sm:grid-cols-2
                "
            >

                {/* PRICE */}

                <div
                    className="
                        rounded-2xl
                        border
                        border-white/[0.055]
                        bg-white/[0.02]
                        p-3.5
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            text-yellow-300
                        "
                    >

                        <Coins
                            size={14}
                        />

                        <span
                            className="
                                text-[9px]
                                font-black
                                uppercase
                                tracking-[0.12em]
                            "
                        >
                            Sarflandi
                        </span>

                    </div>


                    <p
                        className="
                            mt-2
                            text-sm
                            font-black
                            text-white
                        "
                    >
                        {price} FCoin
                    </p>

                </div>


                {/* DURATION */}

                <div
                    className="
                        rounded-2xl
                        border
                        border-white/[0.055]
                        bg-white/[0.02]
                        p-3.5
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            text-cyan-300
                        "
                    >

                        <CalendarClock
                            size={14}
                        />

                        <span
                            className="
                                text-[9px]
                                font-black
                                uppercase
                                tracking-[0.12em]
                            "
                        >
                            Davomiylik
                        </span>

                    </div>


                    <p
                        className="
                            mt-2
                            text-sm
                            font-black
                            text-white
                        "
                    >
                        {duration}
                    </p>

                </div>


                {/* PRIORITY */}

                <div
                    className="
                        rounded-2xl
                        border
                        border-white/[0.055]
                        bg-white/[0.02]
                        p-3.5
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            text-indigo-300
                        "
                    >

                        <Zap
                            size={14}
                        />

                        <span
                            className="
                                text-[9px]
                                font-black
                                uppercase
                                tracking-[0.12em]
                            "
                        >
                            Priority
                        </span>

                    </div>


                    <p
                        className="
                            mt-2
                            text-sm
                            font-black
                            text-white
                        "
                    >
                        {priority}
                    </p>

                </div>


                {/* START */}

                <div
                    className="
                        rounded-2xl
                        border
                        border-white/[0.055]
                        bg-white/[0.02]
                        p-3.5
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            text-gray-400
                        "
                    >

                        <CalendarClock
                            size={14}
                        />

                        <span
                            className="
                                text-[9px]
                                font-black
                                uppercase
                                tracking-[0.12em]
                            "
                        >
                            Boshlangan
                        </span>

                    </div>


                    <p
                        className="
                            mt-2
                            text-[11px]
                            font-bold
                            text-gray-300
                        "
                    >
                        {
                            formatPromotionDateTime(
                                startsAt
                            )
                            ||
                            "—"
                        }
                    </p>

                </div>

            </div>

        </section>
    );
};


export default PromotionActiveCard;