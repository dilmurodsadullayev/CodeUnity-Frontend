// src/components/DeleteConfirmationModal.jsx

import React, {
    useEffect,
} from "react";

import {
    AlertTriangle,
    Loader2,
    ShieldAlert,
    Trash2,
    X,
} from "lucide-react";


// =========================================================
// DELETE CONFIRMATION MODAL
// =========================================================

const DeleteConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    itemTitle = "ushbu elementni",
    isProcessing = false,
}) => {

    // =====================================================
    // BODY SCROLL LOCK + ESC
    // =====================================================

    useEffect(
        () => {
            if (
                !isOpen
            ) {
                return undefined;
            }


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


            const handleKeyDown =
                (
                    event
                ) => {
                    if (
                        event.key ===
                        "Escape"
                        &&
                        !isProcessing
                    ) {
                        onClose?.();
                    }
                };


            window.addEventListener(
                "keydown",
                handleKeyDown
            );


            return () => {
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
    // BACKDROP CLICK
    // =====================================================

    const handleBackdropClick =
        (
            event
        ) => {
            if (
                event.target ===
                event.currentTarget
                &&
                !isProcessing
            ) {
                onClose?.();
            }
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
                handleBackdropClick
            }
        >

            {/* =================================================
                BACKGROUND GLOW
            ================================================== */}

            <div
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
                    bg-red-600/[0.08]
                    blur-[130px]
                "
            />


            {/* =================================================
                MODAL
            ================================================== */}

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-modal-title"
                aria-describedby="delete-modal-description"
                onMouseDown={(
                    event
                ) =>
                    event
                        .stopPropagation()
                }
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
            >

                {/* =================================================
                    DECORATIVE GLOWS
                ================================================== */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        -right-24
                        -top-24
                        h-56
                        w-56
                        rounded-full
                        bg-red-500/[0.10]
                        blur-[90px]
                    "
                />


                <div
                    className="
                        pointer-events-none
                        absolute
                        -bottom-24
                        -left-24
                        h-48
                        w-48
                        rounded-full
                        bg-orange-500/[0.05]
                        blur-[80px]
                    "
                />


                {/* =================================================
                    CLOSE
                ================================================== */}

                <button
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
                        transition-all

                        hover:border-white/[0.10]
                        hover:bg-white/[0.05]
                        hover:text-white

                        active:scale-[0.94]

                        disabled:cursor-not-allowed
                        disabled:opacity-30
                    "
                >
                    <X
                        size={16}
                    />
                </button>


                {/* =================================================
                    CONTENT
                ================================================== */}

                <div
                    className="
                        relative
                        z-10
                        px-6
                        pb-6
                        pt-8

                        sm:px-7
                        sm:pb-7
                        sm:pt-9
                    "
                >

                    {/* =================================================
                        ICON
                    ================================================== */}

                    <div
                        className="
                            relative
                            mx-auto
                            flex
                            h-16
                            w-16
                            items-center
                            justify-center
                        "
                    >

                        {/* OUTER RING */}

                        <div
                            className="
                                absolute
                                inset-0
                                rounded-[20px]
                                border
                                border-red-400/15
                                bg-red-500/[0.05]
                            "
                        />


                        {/* GLOW */}

                        <div
                            className="
                                absolute
                                inset-2
                                rounded-2xl
                                bg-red-500/[0.08]
                                blur-lg
                            "
                        />


                        {/* ICON */}

                        <div
                            className="
                                relative
                                z-10
                                grid
                                h-12
                                w-12
                                place-items-center
                                rounded-2xl
                                border
                                border-red-400/20
                                bg-red-500/[0.08]
                                text-red-300
                            "
                        >
                            {isProcessing ? (
                                <Loader2
                                    size={23}
                                    className="
                                        animate-spin
                                    "
                                />
                            ) : (
                                <Trash2
                                    size={22}
                                />
                            )}
                        </div>

                    </div>


                    {/* =================================================
                        TITLE
                    ================================================== */}

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
                                border-red-400/10
                                bg-red-500/[0.04]
                                px-2.5
                                py-1
                                text-[8px]
                                font-black
                                uppercase
                                tracking-[0.18em]
                                text-red-400
                            "
                        >
                            <ShieldAlert
                                size={11}
                            />

                            Destructive action
                        </div>


                        <h3
                            id="delete-modal-title"
                            className="
                                text-xl
                                font-black
                                tracking-tight
                                text-white

                                sm:text-2xl
                            "
                        >
                            {isProcessing
                                ? "O‘chirilmoqda..."
                                : "O‘chirishni tasdiqlaysizmi?"}
                        </h3>


                        <p
                            id="delete-modal-description"
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
                            Haqiqatan ham{" "}

                            <span
                                className="
                                    break-words
                                    font-black
                                    text-gray-200
                                "
                            >
                                “{itemTitle}”
                            </span>

                            {" "}
                            ni o‘chirmoqchimisiz?
                        </p>

                    </div>


                    {/* =================================================
                        WARNING BOX
                    ================================================== */}

                    <div
                        className="
                            mt-5
                            flex
                            items-start
                            gap-3
                            rounded-2xl
                            border
                            border-red-400/10
                            bg-red-500/[0.035]
                            p-4
                        "
                    >

                        <div
                            className="
                                mt-0.5
                                grid
                                h-8
                                w-8
                                shrink-0
                                place-items-center
                                rounded-xl
                                border
                                border-red-400/10
                                bg-red-500/[0.06]
                                text-red-300
                            "
                        >
                            <AlertTriangle
                                size={15}
                            />
                        </div>


                        <div>

                            <p
                                className="
                                    text-[10px]
                                    font-black
                                    uppercase
                                    tracking-[0.12em]
                                    text-red-300
                                "
                            >
                                Diqqat
                            </p>


                            <p
                                className="
                                    mt-1
                                    text-[11px]
                                    font-medium
                                    leading-5
                                    text-gray-600
                                "
                            >
                                Bu amalni keyinchalik bekor qilib bo‘lmaydi.
                                O‘chirilgan ma’lumot qayta tiklanmasligi mumkin.
                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        ACTIONS
                    ================================================== */}

                    <div
                        className="
                            mt-6
                            grid
                            gap-2.5

                            sm:grid-cols-2
                        "
                    >

                        {/* CANCEL */}

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
                                transition-all

                                hover:border-white/[0.12]
                                hover:bg-white/[0.05]
                                hover:text-white

                                active:scale-[0.97]

                                disabled:cursor-not-allowed
                                disabled:opacity-40
                            "
                        >
                            <X
                                size={15}
                            />

                            Bekor qilish
                        </button>


                        {/* DELETE */}

                        <button
                            type="button"
                            onClick={
                                handleConfirm
                            }
                            disabled={
                                isProcessing
                            }
                            className="
                                group
                                relative
                                inline-flex
                                min-h-[44px]
                                items-center
                                justify-center
                                gap-2
                                overflow-hidden
                                rounded-xl
                                border
                                border-red-400/20
                                bg-red-600
                                px-4
                                py-2.5
                                text-xs
                                font-black
                                text-white
                                shadow-lg
                                shadow-red-600/15
                                transition-all
                                duration-200

                                hover:-translate-y-0.5
                                hover:bg-red-500
                                hover:shadow-red-500/25

                                active:translate-y-0
                                active:scale-[0.97]

                                disabled:cursor-not-allowed
                                disabled:bg-red-700/40
                                disabled:text-red-200/50
                                disabled:shadow-none
                                disabled:hover:translate-y-0
                            "
                        >

                            {/* SHINE */}

                            {!isProcessing && (
                                <span
                                    className="
                                        pointer-events-none
                                        absolute
                                        inset-y-0
                                        -left-14
                                        w-10
                                        rotate-12
                                        bg-white/[0.10]
                                        blur-md
                                        transition-all
                                        duration-700

                                        group-hover:left-[120%]
                                    "
                                />
                            )}


                            <span
                                className="
                                    relative
                                    z-10
                                    inline-flex
                                    items-center
                                    gap-2
                                "
                            >

                                {isProcessing ? (
                                    <>
                                        <Loader2
                                            size={15}
                                            className="
                                                animate-spin
                                            "
                                        />

                                        O‘chirilmoqda...
                                    </>
                                ) : (
                                    <>
                                        <Trash2
                                            size={15}
                                        />

                                        Ha, o‘chirish
                                    </>
                                )}

                            </span>

                        </button>

                    </div>

                </div>


                {/* =================================================
                    BOTTOM ACCENT
                ================================================== */}

                <div
                    className="
                        h-px
                        w-full
                        bg-gradient-to-r
                        from-transparent
                        via-red-400/25
                        to-transparent
                    "
                />

            </div>

        </div>
    );
};


export default DeleteConfirmationModal;