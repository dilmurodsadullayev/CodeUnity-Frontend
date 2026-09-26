// src/components/promotions/PromotionQueue.jsx

import React from "react";

import {
    CalendarClock,
    Clock3,
    Coins,
    Layers3,
    Rocket,
} from "lucide-react";

import {
    formatPromotionDateTime,
    getPromotionDurationLabel,
    safePromotionArray,
    safePromotionPositiveNumber,
} from "../../utils/promotion";


// =========================================================
// QUEUE ITEM
// =========================================================

const PromotionQueueItem = ({
    campaign,
    index,
}) => {

    if (!campaign) {
        return null;
    }


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
                relative
                overflow-hidden
                rounded-2xl
                border
                border-indigo-400/10
                bg-indigo-400/[0.025]
                p-4
            "
        >

            {/* DECORATION */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -right-10
                    -top-10
                    h-24
                    w-24
                    rounded-full
                    bg-indigo-400/[0.05]
                    blur-3xl
                "
            />


            {/* HEADER */}

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
                    className="
                        flex
                        min-w-0
                        items-center
                        gap-3
                    "
                >

                    <div
                        className="
                            grid
                            h-9
                            w-9
                            flex-shrink-0
                            place-items-center
                            rounded-xl
                            border
                            border-indigo-400/15
                            bg-indigo-400/[0.06]
                            text-indigo-300
                        "
                    >
                        <Rocket
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
                                truncate
                                text-sm
                                font-black
                                text-white
                            "
                        >
                            {
                                campaign.plan_name
                                ||
                                "Promotion"
                            }
                        </p>


                        <p
                            className="
                                mt-0.5
                                text-[9px]
                                font-bold
                                uppercase
                                tracking-[0.12em]
                                text-indigo-300/70
                            "
                        >
                            Navbat #{index + 1}
                        </p>

                    </div>

                </div>


                <span
                    className="
                        rounded-full
                        border
                        border-indigo-400/15
                        bg-indigo-400/[0.06]
                        px-2.5
                        py-1
                        text-[8px]
                        font-black
                        uppercase
                        tracking-[0.12em]
                        text-indigo-300
                    "
                >
                    Scheduled
                </span>

            </div>


            {/* TIME */}

            <div
                className="
                    relative
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
                        border-white/[0.05]
                        bg-black/10
                        p-3
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-1.5
                            text-gray-500
                        "
                    >
                        <Clock3
                            size={12}
                        />

                        <span
                            className="
                                text-[8px]
                                font-black
                                uppercase
                                tracking-[0.12em]
                            "
                        >
                            Boshlanadi
                        </span>
                    </div>


                    <p
                        className="
                            mt-1.5
                            text-[10px]
                            font-bold
                            text-gray-300
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
                        border-white/[0.05]
                        bg-black/10
                        p-3
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-1.5
                            text-gray-500
                        "
                    >
                        <CalendarClock
                            size={12}
                        />

                        <span
                            className="
                                text-[8px]
                                font-black
                                uppercase
                                tracking-[0.12em]
                            "
                        >
                            Tugaydi
                        </span>
                    </div>


                    <p
                        className="
                            mt-1.5
                            text-[10px]
                            font-bold
                            text-gray-300
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


            {/* FOOTER */}

            <div
                className="
                    relative
                    mt-3
                    flex
                    flex-wrap
                    items-center
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
                        bg-yellow-400/[0.04]
                        px-2.5
                        py-1.5
                        text-[9px]
                        font-black
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
                        bg-cyan-400/[0.04]
                        px-2.5
                        py-1.5
                        text-[9px]
                        font-black
                        text-cyan-300
                    "
                >
                    <Clock3
                        size={11}
                    />

                    {duration}
                </span>

            </div>

        </article>
    );
};


// =========================================================
// PROMOTION QUEUE
// =========================================================

const PromotionQueue = ({
    campaigns = [],
}) => {

    const queue =
        safePromotionArray(
            campaigns
        );


    if (
        queue.length ===
        0
    ) {

        return (

            <section
                className="
                    rounded-2xl
                    border
                    border-white/[0.055]
                    bg-white/[0.018]
                    p-5
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
                            h-9
                            w-9
                            place-items-center
                            rounded-xl
                            border
                            border-white/[0.06]
                            bg-white/[0.025]
                            text-gray-600
                        "
                    >
                        <Layers3
                            size={16}
                        />
                    </div>


                    <div>

                        <h3
                            className="
                                text-sm
                                font-black
                                text-gray-300
                            "
                        >
                            Promotion navbati
                        </h3>


                        <p
                            className="
                                mt-0.5
                                text-[10px]
                                font-medium
                                text-gray-600
                            "
                        >
                            Hozir navbatda boshqa promotion yo‘q.
                        </p>

                    </div>

                </div>

            </section>
        );
    }


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

            <div
                className="
                    mb-4
                    flex
                    items-center
                    justify-between
                    gap-3
                "
            >

                <div>

                    <p
                        className="
                            font-mono
                            text-[9px]
                            font-black
                            uppercase
                            tracking-[0.16em]
                            text-indigo-300/70
                        "
                    >
                        Scheduled campaigns
                    </p>


                    <h3
                        className="
                            mt-1
                            text-base
                            font-black
                            text-white
                        "
                    >
                        Promotion navbati
                    </h3>

                </div>


                <span
                    className="
                        rounded-full
                        border
                        border-indigo-400/15
                        bg-indigo-400/[0.05]
                        px-2.5
                        py-1
                        text-[9px]
                        font-black
                        text-indigo-300
                    "
                >
                    {queue.length}
                </span>

            </div>


            <div
                className="
                    grid
                    gap-3
                "
            >

                {queue.map(
                    (
                        campaign,
                        index
                    ) => (

                        <PromotionQueueItem

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

                            index={
                                index
                            }

                        />
                    )
                )}

            </div>

        </section>
    );
};


export default PromotionQueue;