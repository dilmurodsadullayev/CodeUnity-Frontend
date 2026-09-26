// src/components/promotions/PromotionHistory.jsx

import React, {
    useMemo,
} from "react";

import {
    CalendarClock,
    CheckCircle2,
    Clock3,
    Coins,
    History,
    TimerOff,
    XCircle,
} from "lucide-react";

import {
    formatPromotionDateTime,
    getPromotionDurationLabel,
    safePromotionArray,
    safePromotionPositiveNumber,
} from "../../utils/promotion";


// =========================================================
// STATUS CONFIG
// =========================================================

const STATUS_CONFIG = {

    active: {
        label:
            "Active",

        className:
            "border-emerald-400/15 bg-emerald-400/[0.05] text-emerald-300",

        Icon:
            CheckCircle2,
    },


    scheduled: {
        label:
            "Scheduled",

        className:
            "border-indigo-400/15 bg-indigo-400/[0.05] text-indigo-300",

        Icon:
            Clock3,
    },


    expired: {
        label:
            "Expired",

        className:
            "border-gray-500/15 bg-gray-500/[0.04] text-gray-500",

        Icon:
            TimerOff,
    },


    cancelled: {
        label:
            "Cancelled",

        className:
            "border-red-400/15 bg-red-400/[0.05] text-red-300",

        Icon:
            XCircle,
    },

};


// =========================================================
// HISTORY ITEM
// =========================================================

const PromotionHistoryItem = ({
    campaign,
}) => {

    if (!campaign) {
        return null;
    }


    const status =
        campaign.effective_status
        ||
        "expired";


    const statusConfig =
        STATUS_CONFIG[
            status
        ]
        ??
        STATUS_CONFIG.expired;


    const {
        Icon,
    } = statusConfig;


    const price =
        safePromotionPositiveNumber(
            campaign.price_paid
        );


    const duration =
        getPromotionDurationLabel({
            durationHours:
                campaign.duration_hours,

            durationLabel:
                campaign.duration_label,
        });


    return (

        <article
            className="
                rounded-2xl
                border
                border-white/[0.055]
                bg-white/[0.018]
                p-4
            "
        >

            <div
                className="
                    flex
                    flex-col
                    gap-3

                    sm:flex-row
                    sm:items-start
                    sm:justify-between
                "
            >

                <div
                    className="
                        min-w-0
                    "
                >

                    <h4
                        className="
                            truncate
                            text-sm
                            font-black
                            text-gray-200
                        "
                    >
                        {
                            campaign.plan_name
                            ||
                            "Promotion"
                        }
                    </h4>


                    <p
                        className="
                            mt-1
                            font-mono
                            text-[8px]
                            font-bold
                            uppercase
                            tracking-[0.12em]
                            text-gray-700
                        "
                    >
                        {
                            campaign.public_id
                            ||
                            `campaign-${campaign.id ?? "?"}`
                        }
                    </p>

                </div>


                <span
                    className={`
                        inline-flex
                        w-fit
                        items-center
                        gap-1.5
                        rounded-full
                        border
                        px-2.5
                        py-1
                        text-[8px]
                        font-black
                        uppercase
                        tracking-[0.12em]

                        ${statusConfig.className}
                    `}
                >
                    <Icon
                        size={10}
                    />

                    {statusConfig.label}
                </span>

            </div>


            <div
                className="
                    mt-4
                    grid
                    gap-2

                    sm:grid-cols-2
                "
            >

                <div
                    className="
                        rounded-xl
                        border
                        border-white/[0.045]
                        bg-black/10
                        p-3
                    "
                >
                    <p
                        className="
                            text-[8px]
                            font-black
                            uppercase
                            tracking-[0.12em]
                            text-gray-700
                        "
                    >
                        Boshlangan
                    </p>

                    <p
                        className="
                            mt-1.5
                            text-[10px]
                            font-bold
                            text-gray-400
                        "
                    >
                        {
                            formatPromotionDateTime(
                                campaign.starts_at
                            )
                            ||
                            "—"
                        }
                    </p>
                </div>


                <div
                    className="
                        rounded-xl
                        border
                        border-white/[0.045]
                        bg-black/10
                        p-3
                    "
                >
                    <p
                        className="
                            text-[8px]
                            font-black
                            uppercase
                            tracking-[0.12em]
                            text-gray-700
                        "
                    >
                        Tugashi
                    </p>

                    <p
                        className="
                            mt-1.5
                            text-[10px]
                            font-bold
                            text-gray-400
                        "
                    >
                        {
                            formatPromotionDateTime(
                                campaign.expires_at
                            )
                            ||
                            "—"
                        }
                    </p>
                </div>

            </div>


            <div
                className="
                    mt-3
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
                        rounded-lg
                        border
                        border-yellow-400/10
                        bg-yellow-400/[0.035]
                        px-2.5
                        py-1.5
                        text-[9px]
                        font-bold
                        text-yellow-300
                    "
                >
                    <Coins
                        size={11}
                    />

                    {price} FCoin
                </span>


                <span
                    className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-lg
                        border
                        border-cyan-400/10
                        bg-cyan-400/[0.035]
                        px-2.5
                        py-1.5
                        text-[9px]
                        font-bold
                        text-cyan-300
                    "
                >
                    <CalendarClock
                        size={11}
                    />

                    {duration}
                </span>

            </div>


            {(
                status ===
                "cancelled"
                &&
                campaign.cancel_reason
            ) && (

                <div
                    className="
                        mt-3
                        rounded-xl
                        border
                        border-red-400/10
                        bg-red-400/[0.03]
                        px-3
                        py-2
                        text-[9px]
                        font-medium
                        leading-5
                        text-red-300/70
                    "
                >
                    {campaign.cancel_reason}
                </div>
            )}

        </article>
    );
};


// =========================================================
// PROMOTION HISTORY
// =========================================================

const PromotionHistory = ({
    campaigns = [],
    totalSpent = 0,
    totalPurchases = 0,
}) => {

    const history =
        useMemo(
            () =>
                safePromotionArray(
                    campaigns
                ),
            [
                campaigns,
            ]
        );


    return (

        <section
            className="
                rounded-3xl
                border
                border-white/[0.06]
                bg-white/[0.02]
                p-5
            "
        >

            {/* HEADER */}

            <div
                className="
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
                        items-center
                        gap-3
                    "
                >

                    <div
                        className="
                            grid
                            h-10
                            w-10
                            place-items-center
                            rounded-xl
                            border
                            border-white/[0.06]
                            bg-white/[0.025]
                            text-gray-500
                        "
                    >
                        <History
                            size={17}
                        />
                    </div>


                    <div>

                        <p
                            className="
                                font-mono
                                text-[8px]
                                font-black
                                uppercase
                                tracking-[0.15em]
                                text-gray-700
                            "
                        >
                            Owner only
                        </p>


                        <h3
                            className="
                                mt-1
                                text-base
                                font-black
                                text-white
                            "
                        >
                            Promotion tarixi
                        </h3>

                    </div>

                </div>


                <div
                    className="
                        flex
                        gap-2
                    "
                >

                    <div
                        className="
                            rounded-xl
                            border
                            border-white/[0.05]
                            bg-black/10
                            px-3
                            py-2
                            text-right
                        "
                    >
                        <p
                            className="
                                text-[7px]
                                font-black
                                uppercase
                                tracking-[0.1em]
                                text-gray-700
                            "
                        >
                            Xaridlar
                        </p>

                        <p
                            className="
                                mt-0.5
                                text-xs
                                font-black
                                text-gray-300
                            "
                        >
                            {totalPurchases}
                        </p>
                    </div>


                    <div
                        className="
                            rounded-xl
                            border
                            border-yellow-400/10
                            bg-yellow-400/[0.025]
                            px-3
                            py-2
                            text-right
                        "
                    >
                        <p
                            className="
                                text-[7px]
                                font-black
                                uppercase
                                tracking-[0.1em]
                                text-gray-700
                            "
                        >
                            Sarflangan
                        </p>

                        <p
                            className="
                                mt-0.5
                                text-xs
                                font-black
                                text-yellow-300
                            "
                        >
                            {totalSpent} FCoin
                        </p>
                    </div>

                </div>

            </div>


            {/* CONTENT */}

            {history.length === 0 ? (

                <div
                    className="
                        mt-5
                        rounded-2xl
                        border
                        border-dashed
                        border-white/[0.06]
                        px-4
                        py-8
                        text-center
                    "
                >

                    <History
                        size={22}
                        className="
                            mx-auto
                            text-gray-800
                        "
                    />


                    <p
                        className="
                            mt-3
                            text-xs
                            font-bold
                            text-gray-600
                        "
                    >
                        Hali promotion xaridi mavjud emas.
                    </p>

                </div>

            ) : (

                <div
                    className="
                        mt-5
                        grid
                        gap-3
                    "
                >

                    {history.map(
                        (
                            campaign,
                            index
                        ) => (

                            <PromotionHistoryItem

                                key={
                                    campaign.public_id
                                    ??
                                    campaign.id
                                    ??
                                    index
                                }

                                campaign={
                                    campaign
                                }

                            />
                        )
                    )}

                </div>
            )}

        </section>
    );
};


export default PromotionHistory;