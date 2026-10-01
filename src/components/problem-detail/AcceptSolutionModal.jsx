// src/components/problem-detail/AcceptSolutionModal.jsx

import React, {
    useEffect,
    useRef,
} from "react";

import {
    AlertTriangle,
    Check,
    CheckCircle2,
    Loader2,
    ShieldCheck,
    X,
} from "lucide-react";


// =========================================================
// ACCEPT SOLUTION MODAL
// =========================================================

const AcceptSolutionModal = ({
    isOpen = false,

    onClose,
    onConfirm,

    isProcessing = false,
}) => {

    const closeButtonRef =
        useRef(
            null
        );


    // =====================================================
    // MODAL LIFECYCLE
    // =====================================================

    useEffect(
        () => {

            if (
                !isOpen
            ) {
                return undefined;
            }


            // =============================================
            // LOCK BODY SCROLL
            // =============================================

            const previousOverflow =
                document
                    .body
                    .style
                    .overflow;


            document
                .body
                .style
                .overflow =
                "hidden";


            // =============================================
            // INITIAL FOCUS
            // =============================================

            const focusTimer =
                window.setTimeout(
                    () => {

                        closeButtonRef
                            .current
                            ?.focus();
                    },
                    0
                );


            // =============================================
            // ESC
            // =============================================

            const handleKeyDown =
                (
                    event
                ) => {

                    if (
                        event.key !==
                            "Escape"
                    ) {
                        return;
                    }


                    if (
                        isProcessing
                    ) {
                        return;
                    }


                    onClose?.();
                };


            window.addEventListener(
                "keydown",
                handleKeyDown
            );


            // =============================================
            // CLEANUP
            // =============================================

            return () => {

                window.clearTimeout(
                    focusTimer
                );


                document
                    .body
                    .style
                    .overflow =
                    previousOverflow;


                window.removeEventListener(
                    "keydown",
                    handleKeyDown
                );
            };

        },
        [
            isOpen,
            isProcessing,
            onClose,
        ]
    );


    // =====================================================
    // CLOSED
    // =====================================================

    if (
        !isOpen
    ) {
        return null;
    }


    // =====================================================
    // BACKDROP CLOSE
    // =====================================================

    const handleBackdropMouseDown =
        (
            event
        ) => {

            if (
                event.target !==
                    event.currentTarget
            ) {
                return;
            }


            if (
                isProcessing
            ) {
                return;
            }


            onClose?.();
        };


    // =====================================================
    // CONFIRM
    // =====================================================

    const handleConfirm =
        () => {

            if (
                isProcessing
            ) {
                return;
            }


            onConfirm?.();
        };


    // =====================================================
    // JSX
    // =====================================================

    return (

        <div
            className="
                fixed
                inset-0
                z-[120]

                flex
                items-center
                justify-center

                overflow-y-auto

                bg-black/80

                p-4

                backdrop-blur-md
            "

            onMouseDown={
                handleBackdropMouseDown
            }
        >

            {/* =============================================
                BACKGROUND GLOW
            ============================================== */}

            <div
                aria-hidden="true"

                className="
                    pointer-events-none

                    fixed
                    left-1/2
                    top-1/2

                    h-[420px]
                    w-[420px]

                    -translate-x-1/2
                    -translate-y-1/2

                    rounded-full

                    bg-emerald-500/[0.08]

                    blur-[130px]
                "
            />


            {/* =============================================
                DIALOG
            ============================================== */}

            <div
                role="dialog"

                aria-modal="true"

                aria-labelledby="accept-solution-title"

                aria-describedby="accept-solution-description"

                className="
                    relative

                    w-full
                    max-w-md

                    overflow-hidden

                    rounded-[28px]

                    border
                    border-white/[0.08]

                    bg-[#0b1018]/95

                    shadow-[0_35px_110px_rgba(0,0,0,0.65)]

                    backdrop-blur-2xl
                "

                onMouseDown={(
                    event
                ) => {

                    event.stopPropagation();
                }}
            >

                {/* =========================================
                    DIALOG GLOW
                ========================================== */}

                <div
                    aria-hidden="true"

                    className="
                        pointer-events-none

                        absolute
                        -right-24
                        -top-24

                        h-56
                        w-56

                        rounded-full

                        bg-emerald-500/[0.10]

                        blur-[90px]
                    "
                />


                {/* =========================================
                    CLOSE
                ========================================== */}

                <button
                    ref={
                        closeButtonRef
                    }

                    type="button"

                    onClick={
                        onClose
                    }

                    disabled={
                        isProcessing
                    }

                    aria-label="Modalni yopish"

                    className="
                        absolute
                        right-4
                        top-4
                        z-20

                        grid
                        h-9
                        w-9
                        place-items-center

                        rounded-xl

                        border
                        border-white/[0.06]

                        bg-black/20

                        text-gray-600

                        outline-none

                        transition

                        hover:bg-white/[0.05]
                        hover:text-white

                        focus-visible:border-emerald-400/40
                        focus-visible:ring-2
                        focus-visible:ring-emerald-400/20

                        disabled:cursor-not-allowed
                        disabled:opacity-30
                    "
                >

                    <X
                        size={16}
                        aria-hidden="true"
                    />

                </button>


                {/* =========================================
                    CONTENT
                ========================================== */}

                <div
                    className="
                        relative
                        z-10

                        px-6
                        pb-6
                        pt-9

                        sm:px-7
                        sm:pb-7
                    "
                >

                    {/* =====================================
                        ICON
                    ====================================== */}

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
                            border-emerald-400/15

                            bg-emerald-500/[0.06]

                            text-emerald-300
                        "
                    >

                        <div
                            aria-hidden="true"

                            className="
                                absolute
                                inset-3

                                rounded-xl

                                bg-emerald-400/[0.10]

                                blur-xl
                            "
                        />


                        {isProcessing ? (

                            <Loader2
                                size={25}

                                aria-hidden="true"

                                className="
                                    relative
                                    z-10

                                    animate-spin
                                "
                            />

                        ) : (

                            <CheckCircle2
                                size={26}

                                aria-hidden="true"

                                className="
                                    relative
                                    z-10
                                "
                            />
                        )}

                    </div>


                    {/* =====================================
                        TEXT
                    ====================================== */}

                    <div
                        className="
                            mt-5

                            text-center
                        "
                    >

                        <div
                            className="
                                mb-2

                                inline-flex
                                items-center
                                gap-1.5

                                rounded-full

                                border
                                border-emerald-400/10

                                bg-emerald-500/[0.04]

                                px-2.5
                                py-1

                                text-[8px]
                                font-black
                                uppercase
                                tracking-[0.18em]
                                text-emerald-400
                            "
                        >

                            <ShieldCheck
                                size={11}
                                aria-hidden="true"
                            />

                            Accept solution

                        </div>


                        <h3
                            id="accept-solution-title"

                            className="
                                text-xl
                                font-black
                                tracking-tight
                                text-white

                                sm:text-2xl
                            "
                        >
                            {
                                isProcessing
                                    ? "Yechim qabul qilinmoqda..."
                                    : "Yechimni qabul qilasizmi?"
                            }
                        </h3>


                        <p
                            id="accept-solution-description"

                            className="
                                mx-auto
                                mt-3
                                max-w-sm

                                text-sm
                                font-medium
                                leading-6
                                text-gray-500
                            "
                        >
                            Ushbu javob muammoning{" "}

                            <span
                                className="
                                    font-black
                                    text-emerald-300
                                "
                            >
                                to‘g‘ri yechimi
                            </span>

                            {" "}sifatida belgilanadi.
                        </p>

                    </div>


                    {/* =====================================
                        WARNING
                    ====================================== */}

                    <div
                        className="
                            mt-5

                            flex
                            items-start
                            gap-3

                            rounded-2xl

                            border
                            border-amber-400/10

                            bg-amber-500/[0.035]

                            p-4
                        "
                    >

                        <AlertTriangle
                            size={16}

                            aria-hidden="true"

                            className="
                                mt-0.5
                                shrink-0
                                text-amber-300
                            "
                        />


                        <p
                            className="
                                text-[11px]
                                font-medium
                                leading-5
                                text-gray-600
                            "
                        >
                            Muammo yechilgan deb belgilangandan keyin
                            yangi yechim yuborish yopiladi.
                        </p>

                    </div>


                    {/* =====================================
                        ACTIONS
                    ====================================== */}

                    <div
                        className="
                            mt-6

                            grid
                            gap-2.5

                            sm:grid-cols-2
                        "
                    >

                        <button
                            type="button"

                            onClick={
                                onClose
                            }

                            disabled={
                                isProcessing
                            }

                            className="
                                inline-flex
                                min-h-[44px]
                                items-center
                                justify-center
                                gap-2

                                rounded-xl

                                border
                                border-white/[0.07]

                                bg-white/[0.025]

                                px-4
                                py-2.5

                                text-xs
                                font-black
                                text-gray-400

                                outline-none

                                transition

                                hover:bg-white/[0.05]
                                hover:text-white

                                focus-visible:border-white/20
                                focus-visible:ring-2
                                focus-visible:ring-white/10

                                disabled:cursor-not-allowed
                                disabled:opacity-40
                            "
                        >

                            <X
                                size={15}
                                aria-hidden="true"
                            />

                            Bekor qilish

                        </button>


                        <button
                            type="button"

                            onClick={
                                handleConfirm
                            }

                            disabled={
                                isProcessing
                            }

                            className="
                                inline-flex
                                min-h-[44px]
                                items-center
                                justify-center
                                gap-2

                                rounded-xl

                                border
                                border-emerald-400/20

                                bg-emerald-600

                                px-4
                                py-2.5

                                text-xs
                                font-black
                                text-white

                                shadow-lg
                                shadow-emerald-600/15

                                outline-none

                                transition

                                hover:bg-emerald-500

                                focus-visible:ring-2
                                focus-visible:ring-emerald-400/30

                                active:scale-[0.97]

                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >

                            {isProcessing ? (

                                <>
                                    <Loader2
                                        size={15}

                                        aria-hidden="true"

                                        className="
                                            animate-spin
                                        "
                                    />

                                    Qabul qilinmoqda...
                                </>

                            ) : (

                                <>
                                    <Check
                                        size={15}
                                        aria-hidden="true"
                                    />

                                    Ha, qabul qilish
                                </>
                            )}

                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};


export default React.memo(
    AcceptSolutionModal
);