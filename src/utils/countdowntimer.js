import React, {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    Clock3,
} from "lucide-react";


// =========================================================
// COLOR THEMES
// =========================================================

const TONES = {
    emerald: {
        text: "text-emerald-300",
        number: "text-emerald-200",
        unit: "text-emerald-400/45",
        label: "text-emerald-300/50",
        icon: "text-emerald-300",
        border: "border-emerald-400/10",
        background: "bg-emerald-500/[0.045]",
    },

    indigo: {
        text: "text-indigo-300",
        number: "text-indigo-200",
        unit: "text-indigo-400/45",
        label: "text-indigo-300/50",
        icon: "text-indigo-300",
        border: "border-indigo-400/10",
        background: "bg-indigo-500/[0.045]",
    },

    cyan: {
        text: "text-cyan-300",
        number: "text-cyan-200",
        unit: "text-cyan-400/45",
        label: "text-cyan-300/50",
        icon: "text-cyan-300",
        border: "border-cyan-400/10",
        background: "bg-cyan-500/[0.045]",
    },

    amber: {
        text: "text-amber-300",
        number: "text-amber-200",
        unit: "text-amber-400/45",
        label: "text-amber-300/50",
        icon: "text-amber-300",
        border: "border-amber-400/10",
        background: "bg-amber-500/[0.045]",
    },

    rose: {
        text: "text-rose-300",
        number: "text-rose-200",
        unit: "text-rose-400/45",
        label: "text-rose-300/50",
        icon: "text-rose-300",
        border: "border-rose-400/10",
        background: "bg-rose-500/[0.045]",
    },

    purple: {
        text: "text-purple-300",
        number: "text-purple-200",
        unit: "text-purple-400/45",
        label: "text-purple-300/50",
        icon: "text-purple-300",
        border: "border-purple-400/10",
        background: "bg-purple-500/[0.045]",
    },
};


// =========================================================
// SIZE THEMES
// =========================================================

const SIZES = {
    sm: {
        box:
            "min-w-[48px] px-2 py-2",

        gap:
            "gap-1.5",

        number:
            "text-sm",

        unit:
            "text-[7px]",

        label:
            "text-[8px]",

        icon:
            11,
    },

    md: {
        box:
            "min-w-[58px] px-2.5 py-2.5",

        gap:
            "gap-2",

        number:
            "text-base",

        unit:
            "text-[8px]",

        label:
            "text-[9px]",

        icon:
            12,
    },

    lg: {
        box:
            "min-w-[68px] px-3 py-3",

        gap:
            "gap-2.5",

        number:
            "text-lg",

        unit:
            "text-[9px]",

        label:
            "text-[10px]",

        icon:
            13,
    },
};


// =========================================================
// EMPTY TIME
// =========================================================

const EMPTY_TIME = {
    total: 0,

    days: 0,

    hours: 0,

    minutes: 0,

    seconds: 0,

    isValid: false,
};


// =========================================================
// GET TIME REMAINING
// =========================================================

export const getTimeRemaining = (
    targetDate
) => {

    if (
        !targetDate
    ) {
        return {
            ...EMPTY_TIME,
        };
    }


    const target =
        new Date(
            targetDate
        );


    if (
        Number.isNaN(
            target.getTime()
        )
    ) {
        return {
            ...EMPTY_TIME,
        };
    }


    const total =
        target.getTime()
        -
        Date.now();


    if (
        total <=
        0
    ) {
        return {
            total: 0,

            days: 0,

            hours: 0,

            minutes: 0,

            seconds: 0,

            isValid: true,
        };
    }


    const days =
        Math.floor(
            total
            /
            (
                1000
                *
                60
                *
                60
                *
                24
            )
        );


    const hours =
        Math.floor(
            (
                total
                /
                (
                    1000
                    *
                    60
                    *
                    60
                )
            )
            %
            24
        );


    const minutes =
        Math.floor(
            (
                total
                /
                (
                    1000
                    *
                    60
                )
            )
            %
            60
        );


    const seconds =
        Math.floor(
            (
                total
                /
                1000
            )
            %
            60
        );


    return {
        total,

        days,

        hours,

        minutes,

        seconds,

        isValid: true,
    };
};


// =========================================================
// TIME BLOCK
// =========================================================

const TimeBlock = ({
    value,
    label,
    toneStyles,
    sizeStyles,
}) => {

    return (

        <div
            className={`
                flex
                flex-col
                items-center
                justify-center
                rounded-xl
                border
                bg-black/15
                text-center

                ${toneStyles.border}
                ${sizeStyles.box}
            `}
        >

            <span
                className={`
                    font-mono
                    font-black
                    leading-none

                    ${toneStyles.number}
                    ${sizeStyles.number}
                `}
            >
                {String(
                    value
                ).padStart(
                    2,
                    "0"
                )}
            </span>


            <span
                className={`
                    mt-1
                    font-black
                    uppercase
                    tracking-wider

                    ${toneStyles.unit}
                    ${sizeStyles.unit}
                `}
            >
                {label}
            </span>

        </div>
    );
};


// =========================================================
// INLINE VALUE
// =========================================================

const InlineValue = ({
    timeLeft,
    showSeconds,
}) => {

    return (
        <>
            {timeLeft.days > 0 && (
                <>
                    {timeLeft.days} kun{" "}
                </>
            )}


            {timeLeft.hours > 0 && (
                <>
                    {timeLeft.hours} soat{" "}
                </>
            )}


            {timeLeft.minutes > 0 && (
                <>
                    {timeLeft.minutes} daqiqa{" "}
                </>
            )}


            {showSeconds && (
                <>
                    {timeLeft.seconds} soniya
                </>
            )}
        </>
    );
};


// =========================================================
// COUNTDOWN TIMER
//
// variant:
//
// inline
// compact
// cards
//
// tone:
//
// emerald
// indigo
// cyan
// amber
// rose
// purple
//
// size:
//
// sm
// md
// lg
// =========================================================

const CountdownTimer = ({

    targetDate,

    variant =
        "inline",

    tone =
        "indigo",

    size =
        "md",

    label =
        "Qolgan vaqt",

    showLabel =
        false,

    showIcon =
        true,

    showSeconds =
        true,

    expiredText =
        "Muddati tugagan",

    invalidText =
        "Muddat aniqlanmadi",

    onExpire =
        null,

    className =
        "",

}) => {

    const toneStyles =
        TONES[
            tone
        ]
        ||
        TONES.indigo;


    const sizeStyles =
        SIZES[
            size
        ]
        ||
        SIZES.md;


    const [
        timeLeft,
        setTimeLeft,
    ] = useState(
        () =>
            getTimeRemaining(
                targetDate
            )
    );


    // =====================================================
    // CALLBACK REF
    //
    // Parent har renderda yangi function yuborsa ham
    // interval qayta yaratilmaydi.
    // =====================================================

    const onExpireRef =
        useRef(
            onExpire
        );


    useEffect(
        () => {

            onExpireRef.current =
                onExpire;

        },
        [
            onExpire,
        ]
    );


    // =====================================================
    // EXPIRE GUARD
    // =====================================================

    const expireCalledRef =
        useRef(
            false
        );


    // =====================================================
    // TIMER
    // =====================================================

    useEffect(
        () => {

            expireCalledRef.current =
                false;


            let intervalId =
                null;


            const updateTimer =
                () => {

                    const remaining =
                        getTimeRemaining(
                            targetDate
                        );


                    setTimeLeft(
                        remaining
                    );


                    if (
                        remaining.isValid
                        &&
                        remaining.total <=
                            0
                    ) {

                        if (
                            intervalId
                            !==
                            null
                        ) {

                            window.clearInterval(
                                intervalId
                            );


                            intervalId =
                                null;
                        }


                        if (
                            !expireCalledRef.current
                        ) {

                            expireCalledRef.current =
                                true;


                            if (
                                typeof onExpireRef.current
                                ===
                                "function"
                            ) {

                                onExpireRef
                                    .current();
                            }
                        }
                    }
                };


            // Birinchi renderdayoq aniq qiymat.
            updateTimer();


            const remaining =
                getTimeRemaining(
                    targetDate
                );


            if (
                remaining.isValid
                &&
                remaining.total >
                    0
            ) {

                intervalId =
                    window.setInterval(
                        updateTimer,
                        1000
                    );
            }


            return () => {

                if (
                    intervalId
                    !==
                    null
                ) {

                    window.clearInterval(
                        intervalId
                    );
                }
            };

        },
        [
            targetDate,
        ]
    );


    // =====================================================
    // INVALID DATE
    // =====================================================

    if (
        !timeLeft.isValid
    ) {

        return (

            <span
                className={`
                    inline-flex
                    items-center
                    gap-1.5
                    text-[10px]
                    font-semibold
                    text-gray-500

                    ${className}
                `}
            >

                {showIcon && (
                    <Clock3
                        size={12}
                    />
                )}


                {invalidText}

            </span>
        );
    }


    // =====================================================
    // EXPIRED
    // =====================================================

    if (
        timeLeft.total <=
        0
    ) {

        return (

            <span
                className={`
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-xl
                    border
                    border-red-400/15
                    bg-red-500/[0.06]
                    px-2.5
                    py-1.5
                    text-[10px]
                    font-black
                    text-red-300

                    ${className}
                `}
            >

                {showIcon && (
                    <Clock3
                        size={12}
                    />
                )}


                {expiredText}

            </span>
        );
    }


    // =====================================================
    // INLINE
    //
    // DEFAULT
    //
    // Oldingi joylarda:
    //
    // <CountdownTimer targetDate={date} />
    //
    // dizaynni buzmaydi.
    // =====================================================

    if (
        variant ===
        "inline"
    ) {

        return (

            <span
                className={`
                    inline-flex
                    items-center
                    gap-1.5
                    font-medium

                    ${toneStyles.text}
                    ${className}
                `}
            >

                {showIcon && (
                    <Clock3
                        size={
                            sizeStyles.icon
                        }
                        className="
                            shrink-0
                        "
                    />
                )}


                <span>
                    <InlineValue
                        timeLeft={
                            timeLeft
                        }

                        showSeconds={
                            showSeconds
                        }
                    />
                </span>

            </span>
        );
    }


    // =====================================================
    // COMPACT
    // =====================================================

    if (
        variant ===
        "compact"
    ) {

        return (

            <span
                className={`
                    inline-flex
                    max-w-full
                    items-center
                    gap-1.5
                    rounded-xl
                    border
                    px-2.5
                    py-1.5
                    font-mono
                    text-[9px]
                    font-black

                    ${toneStyles.border}
                    ${toneStyles.background}
                    ${toneStyles.text}

                    ${className}
                `}
            >

                {showIcon && (
                    <Clock3
                        size={11}
                        className="
                            shrink-0
                        "
                    />
                )}


                <span
                    className="
                        truncate
                    "
                >

                    {timeLeft.days > 0 && (
                        <>
                            {timeLeft.days}k{" "}
                        </>
                    )}


                    {String(
                        timeLeft.hours
                    ).padStart(
                        2,
                        "0"
                    )}
                    s{" "}


                    {String(
                        timeLeft.minutes
                    ).padStart(
                        2,
                        "0"
                    )}
                    d


                    {showSeconds && (
                        <>
                            {" "}

                            {String(
                                timeLeft.seconds
                            ).padStart(
                                2,
                                "0"
                            )}

                            son
                        </>
                    )}

                </span>

            </span>
        );
    }


    // =====================================================
    // CARDS
    // =====================================================

    return (

        <div
            className={`
                max-w-full

                ${className}
            `}
        >

            {showLabel && (

                <div
                    className={`
                        mb-2
                        flex
                        items-center
                        gap-1.5
                        font-black
                        uppercase
                        tracking-[0.14em]

                        ${toneStyles.label}
                        ${sizeStyles.label}
                    `}
                >

                    {showIcon && (
                        <Clock3
                            size={
                                sizeStyles.icon
                            }
                            className="
                                shrink-0
                            "
                        />
                    )}


                    {label}

                </div>
            )}


            <div
                className={`
                    flex
                    max-w-full
                    flex-wrap
                    items-center

                    ${sizeStyles.gap}
                `}
            >

                <TimeBlock
                    value={
                        timeLeft.days
                    }

                    label="kun"

                    toneStyles={
                        toneStyles
                    }

                    sizeStyles={
                        sizeStyles
                    }
                />


                <TimeBlock
                    value={
                        timeLeft.hours
                    }

                    label="soat"

                    toneStyles={
                        toneStyles
                    }

                    sizeStyles={
                        sizeStyles
                    }
                />


                <TimeBlock
                    value={
                        timeLeft.minutes
                    }

                    label="daqiqa"

                    toneStyles={
                        toneStyles
                    }

                    sizeStyles={
                        sizeStyles
                    }
                />


                {showSeconds && (
                    <TimeBlock
                        value={
                            timeLeft.seconds
                        }

                        label="soniya"

                        toneStyles={
                            toneStyles
                        }

                        sizeStyles={
                            sizeStyles
                        }
                    />
                )}

            </div>

        </div>
    );
};


export default CountdownTimer;