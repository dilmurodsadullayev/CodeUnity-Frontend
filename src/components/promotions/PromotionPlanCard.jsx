// src/components/promotions/PromotionPlanCard.jsx

import React from "react";

import {
    Check,
    Flame,
    Gem,
    Rocket,
    Sparkles,
} from "lucide-react";

import {
    getPromotionDurationLabel,
    safePromotionPositiveNumber,
} from "../../utils/promotion";


// =========================================================
// PLAN UI
//
// Faqat visual.
// Business data emas.
// =========================================================

const PLAN_UI = {

    basic: {

        Icon:
            Rocket,

        border:
            "border-cyan-400/20",

        selectedBorder:
            "border-cyan-300/60",

        background:
            "bg-cyan-400/[0.045]",

        selectedBackground:
            "bg-cyan-400/[0.09]",

        icon:
            "text-cyan-300",

        iconBackground:
            "bg-cyan-400/[0.08]",

        iconBorder:
            "border-cyan-400/15",

        glow:
            "shadow-cyan-500/10",

    },


    premium: {

        Icon:
            Gem,

        border:
            "border-indigo-400/20",

        selectedBorder:
            "border-indigo-300/60",

        background:
            "bg-indigo-400/[0.045]",

        selectedBackground:
            "bg-indigo-400/[0.09]",

        icon:
            "text-indigo-300",

        iconBackground:
            "bg-indigo-400/[0.08]",

        iconBorder:
            "border-indigo-400/15",

        glow:
            "shadow-indigo-500/10",

        popular:
            true,

    },


    ultra: {

        Icon:
            Flame,

        border:
            "border-orange-400/20",

        selectedBorder:
            "border-orange-300/60",

        background:
            "bg-orange-400/[0.045]",

        selectedBackground:
            "bg-orange-400/[0.09]",

        icon:
            "text-orange-300",

        iconBackground:
            "bg-orange-400/[0.08]",

        iconBorder:
            "border-orange-400/15",

        glow:
            "shadow-orange-500/10",

    },

};


// =========================================================
// DEFAULT UI
// =========================================================

const DEFAULT_UI = {

    Icon:
        Sparkles,

    border:
        "border-white/[0.07]",

    selectedBorder:
        "border-purple-300/50",

    background:
        "bg-white/[0.022]",

    selectedBackground:
        "bg-purple-400/[0.07]",

    icon:
        "text-purple-300",

    iconBackground:
        "bg-purple-400/[0.07]",

    iconBorder:
        "border-purple-400/15",

    glow:
        "shadow-purple-500/10",

    popular:
        false,

};


// =========================================================
// PROMOTION PLAN CARD
// =========================================================

const PromotionPlanCard = ({

    plan,

    selected = false,

    disabled = false,

    balance = 0,

    onSelect = () => {},

}) => {

    if (!plan) {
        return null;
    }


    // =====================================================
    // DATA
    // =====================================================

    const planCode =
        String(
            plan.code
            ??
            plan.id
            ??
            ""
        );


    const ui =
        PLAN_UI[
            planCode
        ]
        ??
        DEFAULT_UI;


    const {
        Icon,
    } = ui;


    const price =
        safePromotionPositiveNumber(
            plan.price
        );


    const currentBalance =
        safePromotionPositiveNumber(
            balance
        );


    const hasEnoughCoins =
        currentBalance >=
        price;


    const duration =
        getPromotionDurationLabel({

            durationHours:
                plan.duration_hours,

            days:
                plan.days,

            durationLabel:
                plan.duration_label,

        });


    // =====================================================
    // CLICK
    // =====================================================

    const handleClick = () => {

        if (disabled) {
            return;
        }


        onSelect(
            plan
        );
    };


    // =====================================================
    // JSX
    // =====================================================

    return (

        <button
            type="button"

            onClick={
                handleClick
            }

            disabled={
                disabled
            }

            className={`
                group/plan
                relative
                w-full
                overflow-hidden
                rounded-2xl
                border
                p-4
                text-left
                shadow-lg
                transition-all
                duration-300

                ${
                    selected
                        ? ui.selectedBorder
                        : ui.border
                }

                ${
                    selected
                        ? ui.selectedBackground
                        : ui.background
                }

                ${
                    selected
                        ? ui.glow
                        : ""
                }

                ${
                    disabled
                        ? "cursor-not-allowed opacity-50"
                        : "hover:-translate-y-0.5 hover:bg-white/[0.04]"
                }
            `}
        >

            {/* =============================================
                GLOW
            ============================================== */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -right-14
                    -top-14
                    h-32
                    w-32
                    rounded-full
                    bg-white/[0.025]
                    blur-3xl
                    transition-transform
                    duration-500
                    group-hover/plan:scale-150
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
                    gap-3
                "
            >

                <div
                    className={`
                        grid
                        h-10
                        w-10
                        place-items-center
                        rounded-xl
                        border

                        ${ui.iconBorder}
                        ${ui.iconBackground}
                        ${ui.icon}
                    `}
                >

                    <Icon
                        size={18}
                        strokeWidth={2}
                    />

                </div>


                <div
                    className="
                        flex
                        items-center
                        gap-2
                    "
                >

                    {ui.popular && (

                        <span
                            className="
                                rounded-full
                                border
                                border-indigo-300/15
                                bg-indigo-400/[0.06]
                                px-2
                                py-1
                                text-[8px]
                                font-black
                                uppercase
                                tracking-[0.12em]
                                text-indigo-300
                            "
                        >
                            Popular
                        </span>
                    )}


                    <div
                        className={`
                            grid
                            h-6
                            w-6
                            place-items-center
                            rounded-full
                            border
                            transition-all

                            ${
                                selected

                                    ? (
                                        "border-emerald-300/40 "
                                        +
                                        "bg-emerald-400/15 "
                                        +
                                        "text-emerald-300"
                                    )

                                    : (
                                        "border-white/[0.08] "
                                        +
                                        "bg-white/[0.02] "
                                        +
                                        "text-transparent"
                                    )
                            }
                        `}
                    >

                        <Check
                            size={12}
                            strokeWidth={3}
                        />

                    </div>

                </div>

            </div>


            {/* =============================================
                PLAN NAME
            ============================================== */}

            <h3
                className="
                    relative
                    mt-4
                    text-base
                    font-black
                    text-white
                "
            >
                {plan.name}
            </h3>


            {/* =============================================
                DESCRIPTION
            ============================================== */}

            {plan.description && (

                <p
                    className="
                        relative
                        mt-1.5
                        line-clamp-2
                        text-[11px]
                        leading-5
                        text-gray-500
                    "
                >
                    {plan.description}
                </p>
            )}


            {/* =============================================
                FOOTER
            ============================================== */}

            <div
                className="
                    relative
                    mt-4
                    flex
                    items-end
                    justify-between
                    gap-3
                "
            >

                <div>

                    <p
                        className="
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-[0.12em]
                            text-gray-600
                        "
                    >
                        Davomiylik
                    </p>


                    <p
                        className="
                            mt-1
                            text-xs
                            font-black
                            text-gray-300
                        "
                    >
                        {duration}
                    </p>

                </div>


                <div
                    className="
                        text-right
                    "
                >

                    <p
                        className="
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-[0.12em]
                            text-gray-600
                        "
                    >
                        Narxi
                    </p>


                    <p
                        className={`
                            mt-1
                            text-sm
                            font-black

                            ${
                                hasEnoughCoins
                                    ? "text-yellow-300"
                                    : "text-red-300"
                            }
                        `}
                    >
                        {price} FCoin
                    </p>

                </div>

            </div>


            {!hasEnoughCoins && (

                <div
                    className="
                        relative
                        mt-3
                        rounded-xl
                        border
                        border-red-400/10
                        bg-red-400/[0.035]
                        px-3
                        py-2
                        text-[9px]
                        font-bold
                        text-red-300/80
                    "
                >
                    Balans yetarli emas
                </div>
            )}

        </button>
    );
};


export default PromotionPlanCard;