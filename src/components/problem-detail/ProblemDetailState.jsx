// src/components/problem-detail/ProblemDetailState.jsx

import React from "react";

import {
    AlertTriangle,
    ArrowLeft,
    Clock3,
    Loader2,
    RefreshCw,
    Search,
    ShieldCheck,
    WifiOff,
} from "lucide-react";

import {
    Link,
} from "react-router-dom";

import {
    PROBLEM_DETAIL_ERROR_TYPES,
} from "./problemDetailHelpers";


// =========================================================
// STATE UI CONFIG
// =========================================================

const ERROR_UI = {

    [PROBLEM_DETAIL_ERROR_TYPES.NOT_FOUND]: {
        Icon:
            Search,

        iconClass:
            "text-cyan-300",

        iconBorder:
            "border-cyan-400/20",

        iconBackground:
            "bg-cyan-500/[0.08]",

        glow:
            "bg-cyan-500/[0.08]",

        codeClass:
            "text-cyan-400/70",

        codeBorder:
            "border-cyan-400/10",

        codeBackground:
            "bg-cyan-500/[0.035]",
    },


    [PROBLEM_DETAIL_ERROR_TYPES.FORBIDDEN]: {
        Icon:
            ShieldCheck,

        iconClass:
            "text-amber-300",

        iconBorder:
            "border-amber-400/20",

        iconBackground:
            "bg-amber-500/[0.08]",

        glow:
            "bg-amber-500/[0.08]",

        codeClass:
            "text-amber-400/70",

        codeBorder:
            "border-amber-400/10",

        codeBackground:
            "bg-amber-500/[0.035]",
    },


    [PROBLEM_DETAIL_ERROR_TYPES.UNAUTHORIZED]: {
        Icon:
            ShieldCheck,

        iconClass:
            "text-indigo-300",

        iconBorder:
            "border-indigo-400/20",

        iconBackground:
            "bg-indigo-500/[0.08]",

        glow:
            "bg-indigo-500/[0.08]",

        codeClass:
            "text-indigo-400/70",

        codeBorder:
            "border-indigo-400/10",

        codeBackground:
            "bg-indigo-500/[0.035]",
    },


    [PROBLEM_DETAIL_ERROR_TYPES.NETWORK]: {
        Icon:
            WifiOff,

        iconClass:
            "text-orange-300",

        iconBorder:
            "border-orange-400/20",

        iconBackground:
            "bg-orange-500/[0.08]",

        glow:
            "bg-orange-500/[0.08]",

        codeClass:
            "text-orange-400/70",

        codeBorder:
            "border-orange-400/10",

        codeBackground:
            "bg-orange-500/[0.035]",
    },


    [PROBLEM_DETAIL_ERROR_TYPES.TIMEOUT]: {
        Icon:
            Clock3,

        iconClass:
            "text-orange-300",

        iconBorder:
            "border-orange-400/20",

        iconBackground:
            "bg-orange-500/[0.08]",

        glow:
            "bg-orange-500/[0.08]",

        codeClass:
            "text-orange-400/70",

        codeBorder:
            "border-orange-400/10",

        codeBackground:
            "bg-orange-500/[0.035]",
    },


    [PROBLEM_DETAIL_ERROR_TYPES.RATE_LIMIT]: {
        Icon:
            Clock3,

        iconClass:
            "text-yellow-300",

        iconBorder:
            "border-yellow-400/20",

        iconBackground:
            "bg-yellow-500/[0.08]",

        glow:
            "bg-yellow-500/[0.08]",

        codeClass:
            "text-yellow-400/70",

        codeBorder:
            "border-yellow-400/10",

        codeBackground:
            "bg-yellow-500/[0.035]",
    },


    [PROBLEM_DETAIL_ERROR_TYPES.SERVER]: {
        Icon:
            AlertTriangle,

        iconClass:
            "text-red-300",

        iconBorder:
            "border-red-400/20",

        iconBackground:
            "bg-red-500/[0.08]",

        glow:
            "bg-red-500/[0.08]",

        codeClass:
            "text-red-400/70",

        codeBorder:
            "border-red-400/10",

        codeBackground:
            "bg-red-500/[0.035]",
    },


    [PROBLEM_DETAIL_ERROR_TYPES.UNKNOWN]: {
        Icon:
            AlertTriangle,

        iconClass:
            "text-red-300",

        iconBorder:
            "border-red-400/20",

        iconBackground:
            "bg-red-500/[0.08]",

        glow:
            "bg-red-500/[0.08]",

        codeClass:
            "text-red-400/70",

        codeBorder:
            "border-red-400/10",

        codeBackground:
            "bg-red-500/[0.035]",
    },
};


// =========================================================
// LOADING STATE
// =========================================================

const LoadingState = () => {

    return (

        <main
            className="
                relative

                min-h-screen
                overflow-hidden

                bg-[#050816]

                px-4
                py-20

                text-white
            "
        >

            {/* =============================================
                BACKGROUND
            ============================================== */}

            <div
                className="
                    pointer-events-none
                    absolute
                    inset-0

                    bg-[linear-gradient(rgba(34,211,238,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.025)_1px,transparent_1px)]
                    bg-[size:60px_60px]

                    [mask-image:radial-gradient(circle_at_center,black_0%,transparent_72%)]
                "
            />


            <div
                className="
                    pointer-events-none

                    absolute
                    left-1/2
                    top-1/3

                    h-80
                    w-80

                    -translate-x-1/2
                    -translate-y-1/2

                    rounded-full

                    bg-cyan-500/[0.08]

                    blur-[110px]
                "
            />


            {/* =============================================
                CARD
            ============================================== */}

            <div
                className="
                    relative
                    z-10

                    mx-auto
                    max-w-2xl

                    overflow-hidden

                    rounded-[2rem]

                    border
                    border-white/[0.08]

                    bg-[#0d1117]/95

                    p-8

                    text-center

                    shadow-[0_30px_100px_rgba(0,0,0,0.45)]

                    backdrop-blur-xl

                    sm:p-10
                "
            >

                <div
                    className="
                        mx-auto

                        grid
                        h-16
                        w-16
                        place-items-center

                        rounded-[20px]

                        border
                        border-cyan-400/20

                        bg-cyan-500/[0.08]

                        text-cyan-300

                        shadow-lg
                        shadow-cyan-950/20
                    "
                >

                    <Loader2
                        size={27}

                        aria-hidden="true"

                        className="
                            animate-spin
                        "
                    />

                </div>


                <div
                    className="
                        mt-5

                        inline-flex
                        items-center
                        gap-2

                        rounded-full

                        border
                        border-cyan-400/10

                        bg-cyan-500/[0.035]

                        px-3
                        py-1

                        font-mono
                        text-[9px]
                        font-black
                        uppercase
                        tracking-[0.18em]
                        text-cyan-400/70
                    "
                >

                    <span
                        className="
                            h-1.5
                            w-1.5

                            animate-pulse

                            rounded-full

                            bg-cyan-400
                        "
                    />

                    problem.loading

                </div>


                <h1
                    className="
                        mt-4

                        text-2xl
                        font-black
                        tracking-tight
                        text-white

                        sm:text-3xl
                    "
                >
                    Muammo yuklanmoqda...
                </h1>


                <p
                    className="
                        mx-auto
                        mt-3
                        max-w-md

                        text-sm
                        font-medium
                        leading-6
                        text-gray-500
                    "
                >
                    Muammo tafsilotlari va tegishli
                    ma’lumotlar serverdan olinmoqda.
                </p>

            </div>

        </main>
    );
};


// =========================================================
// ERROR STATE
// =========================================================

const ErrorState = ({
    errorState,

    onRetry,

    isRetrying = false,

    backTo = "/problems",
}) => {

    const type =
        errorState?.type
        ??
        PROBLEM_DETAIL_ERROR_TYPES
            .UNKNOWN;


    const ui =
        ERROR_UI[type]
        ??
        ERROR_UI[
            PROBLEM_DETAIL_ERROR_TYPES
                .UNKNOWN
        ];


    const Icon =
        ui.Icon;


    const canRetry =
        Boolean(
            errorState?.canRetry
        );


    const showBack =
        errorState?.showBack !==
            false;


    return (

        <main
            className="
                relative

                min-h-screen
                overflow-hidden

                bg-[#050816]

                px-4
                py-24

                text-white
            "
        >

            {/* =============================================
                GRID BACKGROUND
            ============================================== */}

            <div
                className="
                    pointer-events-none

                    absolute
                    inset-0

                    bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)]
                    bg-[size:60px_60px]

                    [mask-image:radial-gradient(circle_at_center,black_0%,transparent_74%)]
                "
            />


            {/* =============================================
                GLOW
            ============================================== */}

            <div
                className={`
                    pointer-events-none

                    absolute
                    left-1/2
                    top-1/3

                    h-96
                    w-96

                    -translate-x-1/2
                    -translate-y-1/2

                    rounded-full

                    blur-[130px]

                    ${ui.glow}
                `}
            />


            {/* =============================================
                CARD
            ============================================== */}

            <div
                role="alert"

                className="
                    relative
                    z-10

                    mx-auto
                    max-w-2xl

                    overflow-hidden

                    rounded-[2rem]

                    border
                    border-white/[0.08]

                    bg-[#0d1117]/95

                    px-6
                    py-9

                    text-center

                    shadow-[0_35px_120px_rgba(0,0,0,0.5)]

                    backdrop-blur-xl

                    sm:px-10
                    sm:py-11
                "
            >

                {/* ICON */}

                <div
                    className={`
                        mx-auto

                        grid
                        h-16
                        w-16
                        place-items-center

                        rounded-[20px]

                        border

                        shadow-lg
                        shadow-black/20

                        ${ui.iconBorder}
                        ${ui.iconBackground}
                        ${ui.iconClass}
                    `}
                >

                    <Icon
                        size={27}
                        aria-hidden="true"
                    />

                </div>


                {/* CODE */}

                <div
                    className={`
                        mt-5

                        inline-flex
                        items-center
                        gap-2

                        rounded-full

                        border

                        px-3
                        py-1

                        font-mono
                        text-[9px]
                        font-black
                        uppercase
                        tracking-[0.18em]

                        ${ui.codeBorder}
                        ${ui.codeBackground}
                        ${ui.codeClass}
                    `}
                >

                    <span
                        className="
                            h-1.5
                            w-1.5

                            rounded-full

                            bg-current
                        "
                    />

                    {
                        errorState?.code
                        ??
                        "request.failed"
                    }

                    {errorState?.status && (

                        <>
                            <span
                                aria-hidden="true"
                                className="
                                    opacity-30
                                "
                            >
                                /
                            </span>

                            HTTP {
                                errorState.status
                            }
                        </>
                    )}

                </div>


                {/* TITLE */}

                <h1
                    className="
                        mt-4

                        text-2xl
                        font-black
                        tracking-tight
                        text-white

                        sm:text-3xl
                    "
                >
                    {
                        errorState?.title
                        ??
                        "Muammoni yuklab bo‘lmadi"
                    }
                </h1>


                {/* MESSAGE */}

                <p
                    className="
                        mx-auto
                        mt-3
                        max-w-lg

                        text-sm
                        font-medium
                        leading-6
                        text-gray-400
                    "
                >
                    {
                        errorState?.message
                        ??
                        "Muammo ma’lumotlarini yuklashda xatolik yuz berdi."
                    }
                </p>


                {/* TECHNICAL MESSAGE */}

                {errorState?.technicalMessage &&
                    errorState.technicalMessage !==
                        errorState.message && (

                    <div
                        className="
                            mx-auto
                            mt-5
                            max-w-lg

                            rounded-2xl

                            border
                            border-white/[0.06]

                            bg-black/20

                            px-4
                            py-3

                            text-left
                        "
                    >

                        <p
                            className="
                                font-mono
                                text-[9px]
                                font-black
                                uppercase
                                tracking-[0.16em]
                                text-gray-700
                            "
                        >
                            server response
                        </p>


                        <p
                            className="
                                mt-1.5

                                break-words

                                text-xs
                                font-medium
                                leading-5
                                text-gray-600
                            "
                        >
                            {
                                errorState
                                    .technicalMessage
                            }
                        </p>

                    </div>
                )}


                {/* ACTIONS */}

                <div
                    className="
                        mt-7

                        flex
                        flex-col
                        items-stretch
                        justify-center
                        gap-2.5

                        sm:flex-row
                    "
                >

                    {canRetry && (

                        <button
                            type="button"

                            onClick={
                                onRetry
                            }

                            disabled={
                                isRetrying
                            }

                            className="
                                inline-flex
                                min-h-[44px]
                                items-center
                                justify-center
                                gap-2

                                rounded-xl

                                border
                                border-cyan-400/20

                                bg-cyan-500/10

                                px-5
                                py-2.5

                                text-xs
                                font-black
                                text-cyan-300

                                transition-all
                                duration-200

                                hover:border-cyan-400/30
                                hover:bg-cyan-500/20

                                active:scale-[0.97]

                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >

                            {isRetrying ? (

                                <Loader2
                                    size={15}

                                    aria-hidden="true"

                                    className="
                                        animate-spin
                                    "
                                />

                            ) : (

                                <RefreshCw
                                    size={15}
                                    aria-hidden="true"
                                />
                            )}


                            {isRetrying
                                ? "Qayta yuklanmoqda..."
                                : "Qayta urinish"
                            }

                        </button>
                    )}


                    {showBack && (

                        <Link
                            to={
                                backTo
                            }

                            className="
                                inline-flex
                                min-h-[44px]
                                items-center
                                justify-center
                                gap-2

                                rounded-xl

                                border
                                border-white/[0.08]

                                bg-white/[0.035]

                                px-5
                                py-2.5

                                text-xs
                                font-black
                                text-gray-400

                                transition-all
                                duration-200

                                hover:border-white/[0.14]
                                hover:bg-white/[0.06]
                                hover:text-white

                                active:scale-[0.97]
                            "
                        >

                            <ArrowLeft
                                size={15}
                                aria-hidden="true"
                            />

                            Muammolarga qaytish

                        </Link>
                    )}

                </div>

            </div>

        </main>
    );
};


// =========================================================
// PROBLEM DETAIL STATE
// =========================================================

const ProblemDetailState = ({
    variant = "loading",

    errorState = null,

    onRetry,

    isRetrying = false,

    backTo = "/problems",
}) => {

    // =====================================================
    // LOADING
    // =====================================================

    if (
        variant ===
        "loading"
    ) {

        return (
            <LoadingState />
        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    return (

        <ErrorState
            errorState={
                errorState
            }

            onRetry={
                onRetry
            }

            isRetrying={
                isRetrying
            }

            backTo={
                backTo
            }
        />
    );
};


export default React.memo(
    ProblemDetailState
);