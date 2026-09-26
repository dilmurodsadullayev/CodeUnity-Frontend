// src/components/ui/PurchaseConfirmationModal.jsx

import React, {
    useEffect,
    useId,
} from "react";

import {
    createPortal,
} from "react-dom";

import {
    AlertTriangle,
    Coins,
    Loader2,
    ShieldCheck,
    ShoppingCart,
    X,
} from "lucide-react";


// =========================================================
// SAFE NUMBER
// =========================================================

const safeNumber = (
    value,
    fallback = 0
) => {

    const number =
        Number(
            value
        );


    if (
        !Number.isFinite(
            number
        )
    ) {
        return fallback;
    }


    return Math.max(
        0,
        number
    );
};


// =========================================================
// PURCHASE CONFIRMATION MODAL
//
// Universal FCoin purchase confirmation.
//
// Misollar:
//
// Boost
// Badge
// Premium feature
// Mentor
// Challenge
// Boshqa FCoin xaridi
// =========================================================

const PurchaseConfirmationModal = ({

    isOpen,

    onClose,

    onConfirm,

    title =
        "Xaridni tasdiqlash",

    description =
        "Ushbu amal hisobingizdan FCoin yechadi.",

    itemName =
        "Xarid",

    price = 0,

    balance = 0,

    duration = null,

    confirmText =
        "Tasdiqlash",

    cancelText =
        "Bekor qilish",

    warningText = null,

    isProcessing = false,

}) => {

    // =====================================================
    // ACCESSIBILITY IDS
    // =====================================================

    const generatedId =
        useId();


    const titleId =
        `${generatedId}-title`;


    const descriptionId =
        `${generatedId}-description`;


    // =====================================================
    // SAFE VALUES
    // =====================================================

    const safePrice =
        safeNumber(
            price
        );


    const safeBalance =
        safeNumber(
            balance
        );


    const hasEnoughBalance =
        safeBalance >=
        safePrice;


    const missingBalance =
        Math.max(
            0,
            safePrice -
            safeBalance
        );


    const balanceAfter =
        Math.max(
            0,
            safeBalance -
            safePrice
        );


    // =====================================================
    // BODY LOCK + KEYBOARD
    // =====================================================

    useEffect(
        () => {

            if (
                !isOpen
            ) {
                return undefined;
            }


            // =============================================
            // BODY SCROLL
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
            // ESC
            // =============================================

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

                        event.preventDefault();

                        onClose?.();
                    }
                };


            window.addEventListener(
                "keydown",
                handleKeyDown
            );


            // =============================================
            // CLEANUP
            // =============================================

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
    // SSR SAFETY
    // =====================================================

    if (
        typeof document ===
        "undefined"
    ) {
        return null;
    }


    // =====================================================
    // CLOSE
    // =====================================================

    const handleClose =
        () => {

            if (
                isProcessing
            ) {
                return;
            }


            onClose?.();
        };


    // =====================================================
    // BACKDROP
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


            handleClose();
        };


    // =====================================================
    // CONFIRM
    // =====================================================

    const handleConfirm =
        () => {

            if (
                isProcessing
                ||
                !hasEnoughBalance
            ) {
                return;
            }


            onConfirm?.();
        };


    // =====================================================
    // MODAL
    // =====================================================

    const modalContent = (

        <div
            className="
                fixed
                inset-0
                z-[9999]
                flex
                items-center
                justify-center
                overflow-y-auto
                bg-black/80
                p-4
                backdrop-blur-md
            "

            role="presentation"

            onMouseDown={
                handleBackdropMouseDown
            }
        >

            <div
                role="dialog"

                aria-modal="true"

                aria-labelledby={
                    titleId
                }

                aria-describedby={
                    descriptionId
                }

                className="
                    relative
                    my-auto
                    w-full
                    max-w-md
                    overflow-hidden
                    rounded-[28px]
                    border
                    border-white/[0.08]
                    bg-[#0b1018]
                    shadow-[0_35px_120px_rgba(0,0,0,0.75)]
                "

                onMouseDown={(
                    event
                ) => {

                    event.stopPropagation();
                }}
            >

                {/* =================================================
                    BACKGROUND
                ================================================== */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        -right-24
                        -top-24
                        h-52
                        w-52
                        rounded-full
                        bg-indigo-500/15
                        blur-[90px]
                    "
                />


                <div
                    className="
                        pointer-events-none
                        absolute
                        -bottom-24
                        -left-24
                        h-52
                        w-52
                        rounded-full
                        bg-purple-500/10
                        blur-[90px]
                    "
                />


                {/* =================================================
                    HEADER
                ================================================== */}

                <header
                    className="
                        relative
                        z-10
                        flex
                        items-start
                        justify-between
                        gap-4
                        border-b
                        border-white/[0.06]
                        px-5
                        py-5
                    "
                >

                    <div
                        className="
                            flex
                            min-w-0
                            items-center
                            gap-4
                        "
                    >

                        <div
                            className="
                                grid
                                h-12
                                w-12
                                shrink-0
                                place-items-center
                                rounded-2xl
                                border
                                border-yellow-400/20
                                bg-yellow-500/[0.08]
                                text-yellow-300
                            "
                        >

                            <ShoppingCart
                                size={21}
                            />

                        </div>


                        <div
                            className="
                                min-w-0
                            "
                        >

                            <p
                                className="
                                    text-[9px]
                                    font-black
                                    uppercase
                                    tracking-[0.18em]
                                    text-yellow-400
                                "
                            >
                                FCoin transaction
                            </p>


                            <h2
                                id={
                                    titleId
                                }

                                className="
                                    mt-1
                                    break-words
                                    text-xl
                                    font-black
                                    text-white
                                "
                            >
                                {title}
                            </h2>

                        </div>

                    </div>


                    <button
                        type="button"

                        onClick={
                            handleClose
                        }

                        disabled={
                            isProcessing
                        }

                        aria-label="Modalni yopish"

                        title={
                            isProcessing
                                ? "Amal bajarilmoqda"
                                : "Yopish"
                        }

                        className="
                            grid
                            h-9
                            w-9
                            shrink-0
                            place-items-center
                            rounded-xl
                            border
                            border-white/[0.06]
                            bg-white/[0.025]
                            text-gray-500
                            transition

                            hover:border-white/[0.10]
                            hover:bg-white/[0.06]
                            hover:text-white

                            active:scale-[0.96]

                            disabled:cursor-not-allowed
                            disabled:opacity-40
                        "
                    >

                        <X
                            size={17}
                        />

                    </button>

                </header>


                {/* =================================================
                    BODY
                ================================================== */}

                <div
                    className="
                        relative
                        z-10
                        p-5
                    "
                >

                    {/* DESCRIPTION */}

                    <p
                        id={
                            descriptionId
                        }

                        className="
                            text-sm
                            font-medium
                            leading-7
                            text-gray-400
                        "
                    >
                        {description}
                    </p>


                    {/* =================================================
                        SELECTED ITEM
                    ================================================== */}

                    <div
                        className="
                            mt-5
                            rounded-2xl
                            border
                            border-white/[0.07]
                            bg-black/20
                            p-4
                        "
                    >

                        <p
                            className="
                                text-[9px]
                                font-black
                                uppercase
                                tracking-[0.16em]
                                text-gray-600
                            "
                        >
                            Tanlangan xizmat
                        </p>


                        <p
                            className="
                                mt-1
                                break-words
                                text-sm
                                font-black
                                text-white
                            "
                        >
                            {itemName}
                        </p>


                        {duration && (

                            <div
                                className="
                                    mt-2
                                    inline-flex
                                    items-center
                                    rounded-lg
                                    border
                                    border-indigo-400/15
                                    bg-indigo-500/[0.06]
                                    px-2.5
                                    py-1
                                    text-[9px]
                                    font-black
                                    text-indigo-300
                                "
                            >
                                Muddat: {duration}
                            </div>
                        )}

                    </div>


                    {/* =================================================
                        TRANSACTION
                    ================================================== */}

                    <div
                        className="
                            mt-4
                            grid
                            grid-cols-3
                            gap-2
                        "
                    >

                        {/* BALANCE */}

                        <div
                            className="
                                min-w-0
                                rounded-2xl
                                border
                                border-white/[0.06]
                                bg-white/[0.02]
                                p-3
                                text-center
                            "
                        >

                            <p
                                className="
                                    text-[8px]
                                    font-black
                                    uppercase
                                    tracking-wider
                                    text-gray-600
                                "
                            >
                                Balans
                            </p>


                            <div
                                className="
                                    mt-1
                                    flex
                                    items-center
                                    justify-center
                                    gap-1
                                "
                            >

                                <Coins
                                    size={11}
                                    className="
                                        shrink-0
                                        text-yellow-500
                                    "
                                />


                                <span
                                    className="
                                        truncate
                                        text-sm
                                        font-black
                                        text-white
                                    "
                                >
                                    {safeBalance}
                                </span>

                            </div>

                        </div>


                        {/* PRICE */}

                        <div
                            className="
                                min-w-0
                                rounded-2xl
                                border
                                border-yellow-400/15
                                bg-yellow-500/[0.05]
                                p-3
                                text-center
                            "
                        >

                            <p
                                className="
                                    text-[8px]
                                    font-black
                                    uppercase
                                    tracking-wider
                                    text-yellow-500/70
                                "
                            >
                                Narxi
                            </p>


                            <p
                                className="
                                    mt-1
                                    truncate
                                    text-sm
                                    font-black
                                    text-yellow-300
                                "
                            >
                                -{safePrice}
                            </p>

                        </div>


                        {/* AFTER */}

                        <div
                            className={`
                                min-w-0
                                rounded-2xl
                                border
                                p-3
                                text-center

                                ${
                                    hasEnoughBalance

                                        ? `
                                            border-emerald-400/15
                                            bg-emerald-500/[0.05]
                                        `

                                        : `
                                            border-red-400/15
                                            bg-red-500/[0.05]
                                        `
                                }
                            `}
                        >

                            <p
                                className={`
                                    text-[8px]
                                    font-black
                                    uppercase
                                    tracking-wider

                                    ${
                                        hasEnoughBalance
                                            ? "text-emerald-500/70"
                                            : "text-red-500/70"
                                    }
                                `}
                            >
                                Qoladi
                            </p>


                            <p
                                className={`
                                    mt-1
                                    truncate
                                    text-sm
                                    font-black

                                    ${
                                        hasEnoughBalance
                                            ? "text-emerald-300"
                                            : "text-red-300"
                                    }
                                `}
                            >
                                {hasEnoughBalance
                                    ? balanceAfter
                                    : 0}
                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        WARNING
                    ================================================== */}

                    <div
                        className={`
                            mt-4
                            flex
                            items-start
                            gap-3
                            rounded-2xl
                            border
                            p-4
                            text-xs
                            font-semibold
                            leading-6

                            ${
                                hasEnoughBalance

                                    ? `
                                        border-yellow-400/15
                                        bg-yellow-500/[0.05]
                                        text-yellow-100/75
                                    `

                                    : `
                                        border-red-400/20
                                        bg-red-500/[0.07]
                                        text-red-200
                                    `
                            }
                        `}
                    >

                        {hasEnoughBalance ? (

                            <ShieldCheck
                                size={17}
                                className="
                                    mt-0.5
                                    shrink-0
                                    text-yellow-300
                                "
                            />

                        ) : (

                            <AlertTriangle
                                size={17}
                                className="
                                    mt-0.5
                                    shrink-0
                                    text-red-300
                                "
                            />
                        )}


                        <span>

                            {hasEnoughBalance

                                ? (
                                    warningText
                                    ||
                                    `${safePrice} FCoin hisobingizdan yechiladi. Ushbu xaridni tasdiqlaysizmi?`
                                )

                                : (
                                    `Balansingiz yetarli emas. Ushbu xarid uchun yana ${missingBalance} FCoin kerak.`
                                )
                            }

                        </span>

                    </div>


                    {/* =================================================
                        PROCESSING
                    ================================================== */}

                    {isProcessing && (

                        <div
                            className="
                                mt-3
                                flex
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                border
                                border-indigo-400/10
                                bg-indigo-500/[0.04]
                                px-3
                                py-2.5
                                text-[9px]
                                font-semibold
                                text-indigo-300
                            "
                        >

                            <Loader2
                                size={13}
                                className="
                                    animate-spin
                                "
                            />

                            Server javobi kutilmoqda. Oynani yopmang.

                        </div>
                    )}

                </div>


                {/* =================================================
                    FOOTER
                ================================================== */}

                <footer
                    className="
                        relative
                        z-10
                        flex
                        flex-col-reverse
                        gap-2
                        border-t
                        border-white/[0.06]
                        px-5
                        py-4

                        sm:flex-row
                        sm:justify-end
                    "
                >

                    <button
                        type="button"

                        onClick={
                            handleClose
                        }

                        disabled={
                            isProcessing
                        }

                        className="
                            inline-flex
                            min-h-[42px]
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-white/[0.07]
                            bg-white/[0.025]
                            px-5
                            text-xs
                            font-black
                            text-gray-400
                            transition

                            hover:border-white/[0.10]
                            hover:bg-white/[0.05]
                            hover:text-white

                            active:scale-[0.98]

                            disabled:cursor-not-allowed
                            disabled:opacity-40
                        "
                    >
                        {cancelText}
                    </button>


                    <button
                        type="button"

                        onClick={
                            handleConfirm
                        }

                        disabled={
                            isProcessing
                            ||
                            !hasEnoughBalance
                        }

                        className="
                            inline-flex
                            min-h-[42px]
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-yellow-400/25
                            bg-yellow-400
                            px-5
                            text-xs
                            font-black
                            text-gray-950
                            shadow-lg
                            shadow-yellow-500/10
                            transition

                            hover:bg-yellow-300

                            active:scale-[0.98]

                            disabled:cursor-not-allowed
                            disabled:border-white/[0.05]
                            disabled:bg-gray-800
                            disabled:text-gray-600
                            disabled:shadow-none
                        "
                    >

                        {isProcessing ? (

                            <>
                                <Loader2
                                    size={16}
                                    className="
                                        animate-spin
                                    "
                                />

                                Amal bajarilmoqda...
                            </>

                        ) : (

                            <>
                                <Coins
                                    size={16}
                                />

                                {confirmText}
                            </>
                        )}

                    </button>

                </footer>

            </div>

        </div>
    );


    // =====================================================
    // PORTAL
    // =====================================================

    return createPortal(
        modalContent,
        document.body
    );
};


export default PurchaseConfirmationModal;