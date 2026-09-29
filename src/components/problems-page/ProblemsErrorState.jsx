// src/components/problems-page/ProblemsErrorState.jsx

import React from "react";

import {
    AlertTriangle,
    Loader2,
    RefreshCw,
} from "lucide-react";


// =========================================================
// PROBLEMS ERROR STATE
// =========================================================

const ProblemsErrorState = ({
    message = "Muammolarni yuklashda xatolik yuz berdi.",
    onRetry,
    isRetrying = false,
    hasData = false,
}) => {

    // =====================================================
    // STALE DATA ERROR
    //
    // Oldingi list mavjud.
    // Yangi request ishlamadi.
    //
    // Cardlarni yo‘qotmaymiz.
    // Compact warning ko‘rsatamiz.
    // =====================================================

    if (
        hasData
    ) {

        return (

            <div
                role="alert"

                className="
                    mb-6

                    overflow-hidden

                    rounded-2xl

                    border
                    border-amber-400/15

                    bg-amber-500/[0.045]

                    shadow-lg
                    shadow-black/10
                "
            >

                <div
                    className="
                        flex
                        flex-col
                        gap-4

                        p-4

                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >

                    {/* =====================================
                        MESSAGE
                    ====================================== */}

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
                                grid
                                h-9
                                w-9
                                shrink-0
                                place-items-center

                                rounded-xl

                                border
                                border-amber-400/15

                                bg-amber-500/[0.08]

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
                                    text-sm
                                    font-black
                                    text-amber-200
                                "
                            >
                                Ma’lumotlarni yangilab bo‘lmadi
                            </p>


                            <p
                                className="
                                    mt-1

                                    break-words

                                    text-xs
                                    font-medium
                                    leading-5
                                    text-amber-100/45
                                "
                            >
                                {message}
                            </p>


                            <p
                                className="
                                    mt-1

                                    text-[10px]
                                    font-bold
                                    text-gray-700
                                "
                            >
                                Oldingi yuklangan natijalar
                                vaqtincha ko‘rsatilmoqda.
                            </p>

                        </div>

                    </div>


                    {/* =====================================
                        RETRY
                    ====================================== */}

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
                            min-h-[40px]
                            shrink-0
                            items-center
                            justify-center
                            gap-2

                            rounded-xl

                            border
                            border-amber-400/15

                            bg-amber-500/[0.07]

                            px-4
                            py-2

                            text-xs
                            font-black
                            text-amber-200

                            transition-all
                            duration-200

                            hover:border-amber-400/25
                            hover:bg-amber-500/[0.12]

                            active:scale-[0.97]

                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >

                        {isRetrying ? (

                            <Loader2
                                size={14}

                                className="
                                    animate-spin
                                "
                            />

                        ) : (

                            <RefreshCw
                                size={14}
                            />
                        )}


                        {isRetrying
                            ? "Yangilanmoqda..."
                            : "Qayta urinish"
                        }

                    </button>

                </div>

            </div>
        );
    }


    // =====================================================
    // FULL ERROR STATE
    //
    // Hech qanday data yo‘q.
    // =====================================================

    return (

        <div
            role="alert"

            className="
                mb-8

                overflow-hidden

                rounded-[28px]

                border
                border-red-400/20

                bg-[#0b0f18]

                shadow-2xl
                shadow-black/20
            "
        >

            <div
                className="
                    relative

                    px-6
                    py-10

                    text-center

                    sm:px-8
                "
            >

                {/* =========================================
                    GLOW
                ========================================== */}

                <div
                    className="
                        pointer-events-none

                        absolute
                        left-1/2
                        top-0

                        h-48
                        w-72

                        -translate-x-1/2
                        -translate-y-1/2

                        rounded-full

                        bg-red-500/[0.08]

                        blur-[80px]
                    "
                />


                {/* =========================================
                    ICON
                ========================================== */}

                <div
                    className="
                        relative

                        mx-auto

                        grid
                        h-16
                        w-16
                        place-items-center

                        rounded-[20px]

                        border
                        border-red-400/20

                        bg-red-500/[0.07]

                        text-red-300

                        shadow-lg
                        shadow-red-950/20
                    "
                >

                    <AlertTriangle
                        size={27}
                    />

                </div>


                {/* =========================================
                    CODE
                ========================================== */}

                <div
                    className="
                        relative

                        mt-5

                        inline-flex
                        items-center
                        gap-2

                        rounded-full

                        border
                        border-red-400/10

                        bg-red-500/[0.035]

                        px-3
                        py-1

                        font-mono
                        text-[9px]
                        font-black
                        uppercase
                        tracking-[0.18em]
                        text-red-400/70
                    "
                >

                    <span
                        className="
                            h-1.5
                            w-1.5

                            rounded-full

                            bg-red-400
                        "
                    />

                    request.failed

                </div>


                {/* =========================================
                    TITLE
                ========================================== */}

                <h3
                    className="
                        relative

                        mt-4

                        text-2xl
                        font-black
                        tracking-tight
                        text-white
                    "
                >
                    Muammolarni yuklab bo‘lmadi
                </h3>


                {/* =========================================
                    MESSAGE
                ========================================== */}

                <p
                    className="
                        relative

                        mx-auto
                        mt-3
                        max-w-lg

                        break-words

                        text-sm
                        font-medium
                        leading-6
                        text-red-200/55
                    "
                >
                    {message}
                </p>


                {/* =========================================
                    HELP
                ========================================== */}

                <p
                    className="
                        relative

                        mx-auto
                        mt-2
                        max-w-md

                        text-xs
                        leading-5
                        text-gray-700
                    "
                >
                    Internet aloqasini tekshirib,
                    qayta urinib ko‘ring.
                </p>


                {/* =========================================
                    RETRY
                ========================================== */}

                <button
                    type="button"

                    onClick={
                        onRetry
                    }

                    disabled={
                        isRetrying
                    }

                    className="
                        relative

                        mt-6

                        inline-flex
                        min-h-[44px]
                        items-center
                        justify-center
                        gap-2

                        rounded-xl

                        border
                        border-red-400/20

                        bg-red-600

                        px-5
                        py-2.5

                        text-xs
                        font-black
                        text-white

                        shadow-lg
                        shadow-red-950/20

                        transition-all
                        duration-200

                        hover:bg-red-500

                        active:scale-[0.97]

                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >

                    {isRetrying ? (

                        <Loader2
                            size={15}

                            className="
                                animate-spin
                            "
                        />

                    ) : (

                        <RefreshCw
                            size={15}
                        />
                    )}


                    {isRetrying
                        ? "Qayta yuklanmoqda..."
                        : "Qayta urinish"
                    }

                </button>

            </div>

        </div>
    );
};


export default React.memo(
    ProblemsErrorState
);