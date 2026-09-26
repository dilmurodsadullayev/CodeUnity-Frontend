// src/components/promotions/PromotionBadge.jsx

import React from "react";

import {
    Clock3,
    Rocket,
} from "lucide-react";

import CountdownTimer from "../../utils/countdowntimer";

import {
    getPromotionDate,
} from "../../utils/promotion";


// =========================================================
// PROMOTION BADGE
// =========================================================

const PromotionBadge = ({

    isPromoted = false,

    expiresAt = null,

    compact = false,

    showTimer = true,

    className = "",

}) => {

    // =====================================================
    // EXPIRES
    // =====================================================

    const expiresDate =
        getPromotionDate(
            expiresAt
        );


    const hasValidExpiry =
        Boolean(
            expiresDate
        );


    // =====================================================
    // HIDDEN
    // =====================================================

    if (!isPromoted) {
        return null;
    }


    // =====================================================
    // COMPACT
    // =====================================================

    if (compact) {

        return (

            <span
                className={`
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    border
                    border-emerald-400/20
                    bg-emerald-400/[0.07]
                    px-2.5
                    py-1
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.12em]
                    text-emerald-300
                    shadow-[0_0_18px_rgba(52,211,153,0.06)]

                    ${className}
                `}
            >

                <Rocket
                    size={11}
                    strokeWidth={2.2}
                />

                Promoted

            </span>
        );
    }


    // =====================================================
    // NORMAL
    // =====================================================

    return (

        <div
            className={`
                inline-flex
                flex-wrap
                items-center
                gap-2
                rounded-xl
                border
                border-emerald-400/15
                bg-emerald-400/[0.055]
                px-3
                py-2
                text-emerald-300

                ${className}
            `}
        >

            <div
                className="
                    inline-flex
                    items-center
                    gap-1.5
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.13em]
                "
            >

                <Rocket
                    size={13}
                    strokeWidth={2.2}
                />

                Promoted

            </div>


            {(
                showTimer
                &&
                hasValidExpiry
            ) && (

                <>

                    <span
                        className="
                            h-4
                            w-px
                            bg-emerald-300/15
                        "
                    />


                    <div
                        className="
                            inline-flex
                            items-center
                            gap-1.5
                            text-[10px]
                            font-bold
                            text-emerald-200/75
                        "
                    >

                        <Clock3
                            size={12}
                        />


                        <CountdownTimer

                            targetDate={
                                expiresAt
                            }

                            variant="compact"

                            tone="emerald"

                            size="sm"

                            showLabel={
                                false
                            }

                            showIcon={
                                false
                            }

                            expiredText="Tugagan"

                        />

                    </div>

                </>
            )}

        </div>
    );
};


export default PromotionBadge;