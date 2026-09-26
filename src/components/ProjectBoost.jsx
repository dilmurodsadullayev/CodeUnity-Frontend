// src/components/ProjectBoost.jsx

import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    AlertTriangle,
    CheckCircle2,
    Clock3,
    Coins,
    Flame,
    Gem,
    Loader2,
    RefreshCw,
    Rocket,
    Zap,
} from "lucide-react";

import {
    boostProjectFailure,
    boostProjectStart,
    boostProjectSuccess,
    getBoostOptionsFailure,
    getBoostOptionsStart,
    getBoostOptionsSuccess,
} from "../features/projects";

import {
    signUserSuccess,
} from "../features/auth/Auth";

import ProjectService from "../services/project";

import {
    siteToast,
} from "./ui/AuthToast";

import PurchaseConfirmationModal from "./ui/PurchaseConfirmationModal";

import CountdownTimer from "../utils/countdowntimer";


// =========================================================
// PLAN UI
//
// Narx va muddat frontendda hardcode qilinmaydi.
// Ular backenddan keladi.
//
// Bu object faqat DESIGN uchun.
// =========================================================

const PLAN_UI = {
    basic: {
        icon: Rocket,

        border:
            "border-blue-400/30",

        background:
            "bg-blue-500/[0.06]",

        text:
            "text-blue-300",

        glow:
            "shadow-blue-500/20",

        popular:
            false,
    },

    premium: {
        icon: Gem,

        border:
            "border-purple-400/30",

        background:
            "bg-purple-500/[0.06]",

        text:
            "text-purple-300",

        glow:
            "shadow-purple-500/30",

        popular:
            true,
    },

    ultra: {
        icon: Flame,

        border:
            "border-orange-400/30",

        background:
            "bg-orange-500/[0.06]",

        text:
            "text-orange-300",

        glow:
            "shadow-orange-500/30",

        popular:
            false,
    },
};


// =========================================================
// DEFAULT PLAN UI
// =========================================================

const DEFAULT_PLAN_UI = {
    icon: Rocket,

    border:
        "border-indigo-400/30",

    background:
        "bg-indigo-500/[0.06]",

    text:
        "text-indigo-300",

    glow:
        "shadow-indigo-500/20",

    popular:
        false,
};


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
// ERROR MESSAGE
// =========================================================

const getErrorMessage = (
    error,
    fallback =
        "Boost qilishda xatolik yuz berdi."
) => {

    const data =
        error?.serverData
        ||
        error?.response?.data;


    if (
        typeof data ===
            "string"
        &&
        data.trim()
    ) {
        return data;
    }


    if (
        typeof data?.detail ===
            "string"
    ) {
        return data.detail;
    }


    if (
        Array.isArray(
            data?.detail
        )
        &&
        data.detail.length >
            0
    ) {
        return String(
            data.detail[0]
        );
    }


    if (
        typeof data?.message ===
            "string"
    ) {
        return data.message;
    }


    if (
        typeof data?.error ===
            "string"
    ) {
        return data.error;
    }


    if (
        error?.detail
    ) {
        return String(
            error.detail
        );
    }


    if (
        error?.message
    ) {
        return String(
            error.message
        );
    }


    return fallback;
};


// =========================================================
// CANCELED REQUEST
// =========================================================

const isCanceledRequest = (
    error
) => {

    return (
        error?.code ===
            "ERR_CANCELED"
        ||
        error?.name ===
            "CanceledError"
        ||
        error?.name ===
            "AbortError"
    );
};


// =========================================================
// DURATION LABEL
// =========================================================

const getDurationLabel = (
    days
) => {

    const value =
        safeNumber(
            days
        );


    if (
        value ===
        1
    ) {
        return "24 soat";
    }


    return `${value} kun`;
};


// =========================================================
// FORMAT DATE
// =========================================================

const formatDateTime = (
    value
) => {

    if (
        !value
    ) {
        return null;
    }


    const date =
        new Date(
            value
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return null;
    }


    return date.toLocaleString(
        "uz-UZ",
        {
            year:
                "numeric",

            month:
                "short",

            day:
                "2-digit",

            hour:
                "2-digit",

            minute:
                "2-digit",
        }
    );
};


// =========================================================
// PROJECT BOOST
// =========================================================

const ProjectBoost = ({
    projectId,
    userCoins = 0,
    projectName = "Project",
}) => {

    const dispatch =
        useDispatch();


    // =====================================================
    // AUTH
    // =====================================================

    const {
        user,
    } = useSelector(
        (
            state
        ) =>
            state.auth
    );


    // =====================================================
    // PROJECT BOOST REDUX
    // =====================================================

    const {
        boostOptionsIsLoading,
        boostOptionsError,

        boostPlans,
        boostBalance,

        boostDailyLimit,
        boostDailyUsed,
        boostDailyRemaining,

        boostIsActive,
        boostExpiresAt,

        isBoosting,
        boostError,
    } = useSelector(
        (
            state
        ) =>
            state.project
    );


    // =====================================================
    // LOCAL UI STATE
    // =====================================================

    const [
        selectedPlanId,
        setSelectedPlanId,
    ] = useState(
        null
    );


    const [
        isConfirmOpen,
        setIsConfirmOpen,
    ] = useState(
        false
    );


    const [
        successMessage,
        setSuccessMessage,
    ] = useState(
        ""
    );


    // =====================================================
    // SAFE PLANS
    // =====================================================

    const plans =
        useMemo(
            () => {

                return Array.isArray(
                    boostPlans
                )
                    ? boostPlans
                    : [];

            },
            [
                boostPlans,
            ]
        );


    // =====================================================
    // CURRENT BALANCE
    // =====================================================

    const currentBalance =
        safeNumber(
            boostBalance
            ??
            user?.coins
            ??
            userCoins
        );


    // =====================================================
    // DAILY LIMIT INFO
    // =====================================================

    const dailyLimit =
        safeNumber(
            boostDailyLimit
        );


    const dailyUsed =
        safeNumber(
            boostDailyUsed
        );


    const dailyRemaining =
        safeNumber(
            boostDailyRemaining
        );


    // =====================================================
    // DEFAULT SELECTED PLAN
    //
    // Premium mavjud bo'lsa default premium.
    // Bo'lmasa birinchi plan.
    // =====================================================

    useEffect(
        () => {

            if (
                plans.length ===
                0
            ) {

                setSelectedPlanId(
                    null
                );

                return;
            }


            const selectedExists =
                plans.some(
                    (
                        plan
                    ) =>
                        String(
                            plan.id
                        )
                        ===
                        String(
                            selectedPlanId
                        )
                );


            if (
                selectedExists
            ) {
                return;
            }


            const premiumPlan =
                plans.find(
                    (
                        plan
                    ) =>
                        String(
                            plan.id
                        )
                        ===
                        "premium"
                );


            setSelectedPlanId(
                premiumPlan?.id
                ??
                plans[0]?.id
                ??
                null
            );

        },
        [
            plans,
            selectedPlanId,
        ]
    );


    // =====================================================
    // SELECTED PLAN
    // =====================================================

    const selectedPlan =
        useMemo(
            () => {

                if (
                    !selectedPlanId
                ) {
                    return null;
                }


                return (
                    plans.find(
                        (
                            plan
                        ) =>
                            String(
                                plan.id
                            )
                            ===
                            String(
                                selectedPlanId
                            )
                    )
                    ||
                    null
                );

            },
            [
                plans,
                selectedPlanId,
            ]
        );


    // =====================================================
    // SELECTED PRICE
    // =====================================================

    const selectedPrice =
        safeNumber(
            selectedPlan?.price
        );


    // =====================================================
    // ENOUGH COINS
    // =====================================================

    const hasEnoughCoins =
        Boolean(
            selectedPlan
        )
        &&
        currentBalance >=
        selectedPrice;


    // =====================================================
    // DAILY LIMIT REACHED
    // =====================================================

    const isDailyLimitReached =
        dailyLimit >
            0
        &&
        dailyRemaining <=
            0;


    // =====================================================
    // BOOST EXACT DATE
    // =====================================================

    const formattedExpiresAt =
        formatDateTime(
            boostExpiresAt
        );


    // =====================================================
    // LOAD BOOST OPTIONS
    //
    // GET:
    //
    // /projects/project/:id/boost/
    // =====================================================

    const loadBoostOptions =
        useCallback(
            async (
                {
                    signal = undefined,
                    silent = false,
                } = {}
            ) => {

                if (
                    !projectId
                ) {
                    return false;
                }


                dispatch(
                    getBoostOptionsStart()
                );


                try {

                    const response =
                        await ProjectService
                            .getBoostOptions(
                                projectId,
                                {
                                    signal,
                                }
                            );


                    dispatch(
                        getBoostOptionsSuccess(
                            response
                        )
                    );


                    return true;


                } catch (
                    error
                ) {

                    if (
                        isCanceledRequest(
                            error
                        )
                    ) {
                        return false;
                    }


                    const message =
                        getErrorMessage(
                            error,
                            "Boost ma’lumotlarini yuklab bo‘lmadi."
                        );


                    console.error(
                        "Boost options olishda xato:",
                        error
                    );


                    dispatch(
                        getBoostOptionsFailure(
                            message
                        )
                    );


                    if (
                        !silent
                    ) {

                        siteToast.error(
                            message,
                            {
                                title:
                                    "Boost ma’lumotlari yuklanmadi",

                                duration:
                                    4500,
                            }
                        );
                    }


                    return false;
                }
            },
            [
                dispatch,
                projectId,
            ]
        );


    // =====================================================
    // INITIAL BOOST LOAD
    // =====================================================

    useEffect(
        () => {

            if (
                !projectId
            ) {
                return undefined;
            }


            const controller =
                new AbortController();


            loadBoostOptions({
                signal:
                    controller.signal,

                silent:
                    true,
            });


            return () => {

                controller.abort();
            };

        },
        [
            projectId,
            loadBoostOptions,
        ]
    );


    // =====================================================
    // COUNTDOWN EXPIRED
    //
    // Timer 0 ga yetganda backenddan boost state
    // qayta olinadi.
    // =====================================================

    const handleBoostExpired =
        useCallback(
            async () => {

                if (
                    !projectId
                ) {
                    return;
                }


                await loadBoostOptions({
                    silent:
                        true,
                });

            },
            [
                projectId,
                loadBoostOptions,
            ]
        );


    // =====================================================
    // SELECT PLAN
    // =====================================================

    const handleSelectPlan =
        (
            planId
        ) => {

            if (
                isBoosting
                ||
                boostOptionsIsLoading
            ) {
                return;
            }


            setSelectedPlanId(
                planId
            );


            setSuccessMessage(
                ""
            );
        };


    // =====================================================
    // BOOST REQUEST
    //
    // Hali backend POST yubormaydi.
    //
    // Faqat tekshiradi va confirm modalni ochadi.
    // =====================================================

    const handleBoostRequest =
        () => {

            setSuccessMessage(
                ""
            );


            // =============================================
            // PROJECT ID
            // =============================================

            if (
                !projectId
            ) {

                siteToast.error(
                    "Project ID topilmadi.",
                    {
                        title:
                            "Boost qilib bo‘lmadi",
                    }
                );


                return;
            }


            // =============================================
            // LOADING
            // =============================================

            if (
                boostOptionsIsLoading
            ) {

                siteToast.info(
                    "Boost ma’lumotlari hali yuklanmoqda.",
                    {
                        title:
                            "Biroz kuting",
                    }
                );


                return;
            }


            // =============================================
            // OPTIONS ERROR
            // =============================================

            if (
                boostOptionsError
            ) {

                siteToast.warning(
                    "Boost ma’lumotlarini avval qayta yuklang.",
                    {
                        title:
                            "Ma’lumot mavjud emas",
                    }
                );


                return;
            }


            // =============================================
            // PLAN
            // =============================================

            if (
                !selectedPlan
            ) {

                siteToast.warning(
                    "Avval boost rejasini tanlang.",
                    {
                        title:
                            "Reja tanlanmagan",
                    }
                );


                return;
            }


            // =============================================
            // DAILY LIMIT
            // =============================================

            if (
                isDailyLimitReached
            ) {

                siteToast.warning(
                    `Bugungi ${dailyLimit} ta boost limitingiz tugagan. Ertaga qayta urinib ko‘ring.`,
                    {
                        title:
                            "Kunlik limit tugadi",

                        duration:
                            5000,
                    }
                );


                return;
            }


            // =============================================
            // BALANCE
            // =============================================

            if (
                !hasEnoughCoins
            ) {

                const needed =
                    Math.max(
                        0,
                        selectedPrice -
                        currentBalance
                    );


                siteToast.warning(
                    `Balansingiz yetarli emas. Yana ${needed} FCoin kerak.`,
                    {
                        title:
                            "FCoin yetarli emas",

                        duration:
                            5000,
                    }
                );


                return;
            }


            // =============================================
            // OPEN CONFIRMATION
            // =============================================

            setIsConfirmOpen(
                true
            );
        };


    // =====================================================
    // CLOSE CONFIRMATION
    // =====================================================

    const handleCloseConfirmation =
        () => {

            if (
                isBoosting
            ) {
                return;
            }


            setIsConfirmOpen(
                false
            );
        };


    // =====================================================
    // CONFIRM BOOST
    //
    // POST:
    //
    // /projects/project/:id/boost/
    // =====================================================

    const handleConfirmBoost =
        async () => {

            if (
                isBoosting
                ||
                !projectId
                ||
                !selectedPlan
            ) {
                return;
            }


            // =============================================
            // FRONTEND FINAL DAILY CHECK
            // =============================================

            if (
                isDailyLimitReached
            ) {

                setIsConfirmOpen(
                    false
                );


                siteToast.warning(
                    "Bugungi boost limitingiz tugagan.",
                    {
                        title:
                            "Boost amalga oshmadi",
                    }
                );


                return;
            }


            // =============================================
            // FRONTEND FINAL BALANCE CHECK
            // =============================================

            if (
                !hasEnoughCoins
            ) {

                setIsConfirmOpen(
                    false
                );


                siteToast.warning(
                    "FCoin balansingiz yetarli emas.",
                    {
                        title:
                            "Boost amalga oshmadi",
                    }
                );


                return;
            }


            // =============================================
            // REDUX START
            // =============================================

            dispatch(
                boostProjectStart()
            );


            setSuccessMessage(
                ""
            );


            // =============================================
            // LOADING TOAST
            // =============================================

            const toastId =
                siteToast.loading(
                    `"${projectName}" loyihasi boost qilinmoqda...`,
                    {
                        title:
                            `${selectedPlan.name} faollashtirilmoqda`,
                    }
                );


            try {

                // =========================================
                // BACKEND POST
                // =========================================

                const response =
                    await ProjectService
                        .boostProject(
                            projectId,
                            selectedPlan.id
                        );


                // =========================================
                // PROJECT REDUX
                // =========================================

                dispatch(
                    boostProjectSuccess(
                        response
                    )
                );


                // =========================================
                // AUTH BALANCE UPDATE
                //
                // Navbar / Profile FCoin ham reloadsiz
                // yangilanadi.
                // =========================================

                if (
                    user
                    &&
                    response?.new_balance !==
                        undefined
                ) {

                    dispatch(
                        signUserSuccess({
                            ...user,

                            coins:
                                safeNumber(
                                    response
                                        .new_balance
                                ),
                        })
                    );
                }


                // =========================================
                // CLOSE CONFIRM MODAL
                // =========================================

                setIsConfirmOpen(
                    false
                );


                // =========================================
                // SUCCESS MESSAGE
                // =========================================

                const responseMessage =
                    response?.detail
                    ||
                    `${selectedPlan.name} muvaffaqiyatli faollashtirildi.`;


                setSuccessMessage(
                    responseMessage
                );


                // =========================================
                // SUCCESS TOAST
                // =========================================

                siteToast.success(
                    responseMessage,
                    {
                        id:
                            toastId,

                        title:
                            "Boost faollashtirildi",

                        duration:
                            4200,
                    }
                );


            } catch (
                error
            ) {

                const message =
                    getErrorMessage(
                        error
                    );


                console.error(
                    "Project boost xatosi:",
                    error
                );


                // =========================================
                // REDUX FAILURE
                // =========================================

                dispatch(
                    boostProjectFailure(
                        message
                    )
                );


                // =========================================
                // SERVER STATE RE-SYNC
                //
                // Balance/limit backendda o'zgargan
                // bo'lishi mumkin.
                // =========================================

                await loadBoostOptions({
                    silent:
                        true,
                });


                setIsConfirmOpen(
                    false
                );


                // =========================================
                // ERROR TOAST
                // =========================================

                siteToast.error(
                    message,
                    {
                        id:
                            toastId,

                        title:
                            "Boost amalga oshmadi",

                        duration:
                            5000,
                    }
                );
            }
        };


    // =====================================================
    // MANUAL REFRESH
    // =====================================================

    const handleRefresh =
        async () => {

            if (
                isBoosting
                ||
                boostOptionsIsLoading
            ) {
                return;
            }


            const toastId =
                siteToast.loading(
                    "Boost ma’lumotlari yangilanmoqda...",
                    {
                        title:
                            "Yangilanmoqda",
                    }
                );


            const success =
                await loadBoostOptions({
                    silent:
                        true,
                });


            if (
                success
            ) {

                siteToast.success(
                    "Boost ma’lumotlari yangilandi.",
                    {
                        id:
                            toastId,

                        title:
                            "Yangilandi",

                        duration:
                            2200,
                    }
                );


            } else {

                siteToast.error(
                    "Boost ma’lumotlarini yangilab bo‘lmadi.",
                    {
                        id:
                            toastId,

                        title:
                            "Xatolik",

                        duration:
                            4000,
                    }
                );
            }
        };


    // =====================================================
    // VISIBLE ERROR
    // =====================================================

    const visibleError =
        boostOptionsError
        ||
        boostError
        ||
        "";


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <>

            <section
                className="
                    relative
                    overflow-hidden
                    rounded-3xl
                    border
                    border-white/[0.07]
                    bg-white/[0.025]
                    p-5
                    shadow-xl
                    shadow-black/15
                "
            >

                {/* =================================================
                    BACKGROUND GLOW
                ================================================== */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        -right-20
                        -top-20
                        h-44
                        w-44
                        rounded-full
                        bg-yellow-500/[0.08]
                        blur-[80px]
                    "
                />


                <div
                    className="
                        pointer-events-none
                        absolute
                        -bottom-24
                        -left-20
                        h-44
                        w-44
                        rounded-full
                        bg-indigo-500/[0.05]
                        blur-[80px]
                    "
                />


                <div
                    className="
                        relative
                        z-10
                    "
                >

                    {/* =================================================
                        HEADER
                    ================================================== */}

                    <div
                        className="
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
                                    h-10
                                    w-10
                                    shrink-0
                                    place-items-center
                                    rounded-xl
                                    border
                                    border-yellow-400/20
                                    bg-yellow-500/[0.07]
                                    text-yellow-300
                                "
                            >

                                <Zap
                                    size={18}
                                />

                            </div>


                            <div
                                className="
                                    min-w-0
                                "
                            >

                                <h3
                                    className="
                                        text-sm
                                        font-black
                                        text-white
                                    "
                                >
                                    Loyihani quvvatlantirish
                                </h3>


                                <p
                                    className="
                                        mt-0.5
                                        text-[9px]
                                        font-semibold
                                        uppercase
                                        tracking-wider
                                        text-gray-700
                                    "
                                >
                                    Project Boost
                                </p>

                            </div>

                        </div>


                        {/* =========================================
                            BALANCE
                        ========================================== */}

                        <div
                            className="
                                shrink-0
                                rounded-xl
                                border
                                border-yellow-400/15
                                bg-yellow-500/[0.05]
                                px-3
                                py-2
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
                                    mt-0.5
                                    flex
                                    items-center
                                    justify-end
                                    gap-1.5
                                "
                            >

                                <Coins
                                    size={14}
                                    className="
                                        text-yellow-400
                                    "
                                />


                                <span
                                    className="
                                        text-sm
                                        font-black
                                        text-white
                                    "
                                >
                                    {currentBalance}
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        ACTIVE BOOST
                    ================================================== */}

                    {boostIsActive
                        &&
                        boostExpiresAt && (

                        <div
                            className="
                                mt-4
                                rounded-2xl
                                border
                                border-emerald-400/15
                                bg-emerald-500/[0.05]
                                p-3.5
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-start
                                    gap-3
                                "
                            >

                                <CheckCircle2
                                    size={17}
                                    className="
                                        mt-0.5
                                        shrink-0
                                        text-emerald-300
                                    "
                                />


                                <div
                                    className="
                                        min-w-0
                                        flex-1
                                    "
                                >

                                    {/* =============================
                                        ACTIVE HEADER
                                    ============================== */}

                                    <div
                                        className="
                                            flex
                                            flex-wrap
                                            items-center
                                            justify-between
                                            gap-2
                                        "
                                    >

                                        <div>

                                            <p
                                                className="
                                                    text-xs
                                                    font-black
                                                    text-emerald-200
                                                "
                                            >
                                                Boost faol
                                            </p>


                                            <p
                                                className="
                                                    mt-0.5
                                                    text-[8px]
                                                    font-black
                                                    uppercase
                                                    tracking-[0.14em]
                                                    text-emerald-400/40
                                                "
                                            >
                                                Qolgan vaqt
                                            </p>

                                        </div>


                                        <span
                                            className="
                                                inline-flex
                                                items-center
                                                gap-1
                                                rounded-lg
                                                border
                                                border-emerald-400/10
                                                bg-black/15
                                                px-2
                                                py-1
                                                text-[8px]
                                                font-black
                                                text-emerald-300/60
                                            "
                                        >

                                            <Clock3
                                                size={10}
                                            />

                                            LIVE

                                        </span>

                                    </div>


                                    {/* =============================
                                        UNIVERSAL COUNTDOWN
                                    ============================== */}

                                    <div
                                        className="
                                            mt-3
                                        "
                                    >

                                        <CountdownTimer
                                            targetDate={
                                                boostExpiresAt
                                            }

                                            variant="cards"

                                            tone="emerald"

                                            size="sm"

                                            showLabel={
                                                false
                                            }

                                            showIcon={
                                                false
                                            }

                                            expiredText="Boost muddati tugagan"

                                            onExpire={
                                                handleBoostExpired
                                            }
                                        />

                                    </div>


                                    {/* =============================
                                        EXACT DATE
                                    ============================== */}

                                    {formattedExpiresAt && (

                                        <p
                                            className="
                                                mt-2.5
                                                flex
                                                items-center
                                                gap-1.5
                                                text-[9px]
                                                font-semibold
                                                text-emerald-300/50
                                            "
                                        >

                                            <Clock3
                                                size={11}
                                                className="
                                                    shrink-0
                                                "
                                            />


                                            {formattedExpiresAt} da tugaydi

                                        </p>
                                    )}


                                    {/* =============================
                                        INFO
                                    ============================== */}

                                    <p
                                        className="
                                            mt-1.5
                                            text-[9px]
                                            font-medium
                                            leading-5
                                            text-emerald-300/40
                                        "
                                    >
                                        Yana boost sotib olsangiz muddat mavjud vaqt ustiga qo‘shiladi.
                                    </p>

                                </div>

                            </div>

                        </div>
                    )}


                    {/* =================================================
                        DAILY LIMIT
                    ================================================== */}

                    <div
                        className={`
                            mt-4
                            flex
                            items-center
                            justify-between
                            gap-3
                            rounded-2xl
                            border
                            px-3.5
                            py-3

                            ${
                                isDailyLimitReached

                                    ? `
                                        border-red-400/15
                                        bg-red-500/[0.04]
                                    `

                                    : `
                                        border-white/[0.06]
                                        bg-black/20
                                    `
                            }
                        `}
                    >

                        <div
                            className="
                                flex
                                min-w-0
                                items-center
                                gap-2
                            "
                        >

                            <Clock3
                                size={14}

                                className={
                                    isDailyLimitReached
                                        ? "text-red-300"
                                        : "text-indigo-300"
                                }
                            />


                            <div>

                                <p
                                    className="
                                        text-[10px]
                                        font-bold
                                        text-gray-500
                                    "
                                >
                                    Bugungi boostlar
                                </p>


                                {dailyLimit > 0 && (

                                    <p
                                        className="
                                            mt-0.5
                                            text-[8px]
                                            font-semibold
                                            text-gray-700
                                        "
                                    >
                                        {dailyRemaining} ta imkoniyat qoldi
                                    </p>
                                )}

                            </div>

                        </div>


                        <span
                            className={`
                                shrink-0
                                rounded-lg
                                border
                                px-2
                                py-1
                                font-mono
                                text-[10px]
                                font-black

                                ${
                                    isDailyLimitReached

                                        ? `
                                            border-red-400/15
                                            bg-red-500/[0.06]
                                            text-red-300
                                        `

                                        : `
                                            border-white/[0.06]
                                            bg-white/[0.025]
                                            text-gray-300
                                        `
                                }
                            `}
                        >
                            {dailyUsed}
                            /
                            {dailyLimit}
                        </span>

                    </div>


                    {/* =================================================
                        ERROR
                    ================================================== */}

                    {visibleError && (

                        <div
                            className="
                                mt-4
                                flex
                                items-start
                                gap-2
                                rounded-xl
                                border
                                border-red-400/20
                                bg-red-500/[0.06]
                                p-3
                                text-[10px]
                                font-semibold
                                leading-5
                                text-red-300
                            "
                        >

                            <AlertTriangle
                                size={15}
                                className="
                                    mt-0.5
                                    shrink-0
                                "
                            />


                            <span>
                                {visibleError}
                            </span>

                        </div>
                    )}


                    {/* =================================================
                        SUCCESS
                    ================================================== */}

                    {successMessage && (

                        <div
                            className="
                                mt-4
                                flex
                                items-start
                                gap-2
                                rounded-xl
                                border
                                border-emerald-400/20
                                bg-emerald-500/[0.06]
                                p-3
                                text-[10px]
                                font-semibold
                                leading-5
                                text-emerald-300
                            "
                        >

                            <CheckCircle2
                                size={15}
                                className="
                                    mt-0.5
                                    shrink-0
                                "
                            />


                            <span>
                                {successMessage}
                            </span>

                        </div>
                    )}


                    {/* =================================================
                        BOOST OPTIONS LOADING
                    ================================================== */}

                    {boostOptionsIsLoading
                        &&
                        plans.length ===
                            0 ? (

                        <div
                            className="
                                mt-5
                                flex
                                min-h-[190px]
                                items-center
                                justify-center
                                rounded-2xl
                                border
                                border-white/[0.05]
                                bg-black/10
                            "
                        >

                            <div
                                className="
                                    text-center
                                "
                            >

                                <Loader2
                                    size={25}
                                    className="
                                        mx-auto
                                        animate-spin
                                        text-indigo-300
                                    "
                                />


                                <p
                                    className="
                                        mt-3
                                        text-[10px]
                                        font-semibold
                                        text-gray-600
                                    "
                                >
                                    Boost rejalari yuklanmoqda...
                                </p>

                            </div>

                        </div>

                    ) : (

                        <>

                            {/* =========================================
                                BOOST PLANS
                            ========================================== */}

                            {plans.length > 0 ? (

                                <div
                                    className="
                                        mt-5
                                        grid
                                        gap-3
                                    "
                                >

                                    {plans.map(
                                        (
                                            plan
                                        ) => {

                                            const active =
                                                String(
                                                    selectedPlanId
                                                )
                                                ===
                                                String(
                                                    plan.id
                                                );


                                            const ui =
                                                PLAN_UI[
                                                    plan.id
                                                ]
                                                ||
                                                DEFAULT_PLAN_UI;


                                            const Icon =
                                                ui.icon;


                                            const planPrice =
                                                safeNumber(
                                                    plan.price
                                                );


                                            const enough =
                                                currentBalance >=
                                                planPrice;


                                            return (

                                                <button
                                                    key={
                                                        plan.id
                                                    }

                                                    type="button"

                                                    onClick={() =>
                                                        handleSelectPlan(
                                                            plan.id
                                                        )
                                                    }

                                                    disabled={
                                                        isBoosting
                                                        ||
                                                        boostOptionsIsLoading
                                                    }

                                                    className={`
                                                        relative
                                                        overflow-hidden
                                                        rounded-2xl
                                                        border
                                                        p-4
                                                        text-left
                                                        transition-all
                                                        duration-300

                                                        ${
                                                            active

                                                                ? `
                                                                    ${ui.border}
                                                                    ${ui.background}
                                                                    ${ui.glow}
                                                                    shadow-lg
                                                                `

                                                                : `
                                                                    border-white/[0.06]
                                                                    bg-white/[0.018]

                                                                    hover:border-white/[0.12]
                                                                    hover:bg-white/[0.035]
                                                                `
                                                        }

                                                        disabled:cursor-not-allowed
                                                        disabled:opacity-50
                                                    `}
                                                >

                                                    {/* =====================
                                                        POPULAR
                                                    ====================== */}

                                                    {ui.popular && (

                                                        <span
                                                            className="
                                                                absolute
                                                                right-3
                                                                top-3
                                                                rounded-full
                                                                border
                                                                border-purple-400/20
                                                                bg-purple-500/[0.08]
                                                                px-2
                                                                py-1
                                                                text-[8px]
                                                                font-black
                                                                uppercase
                                                                tracking-wider
                                                                text-purple-300
                                                            "
                                                        >
                                                            Mashhur
                                                        </span>
                                                    )}


                                                    <div
                                                        className="
                                                            flex
                                                            items-start
                                                            gap-3
                                                        "
                                                    >

                                                        {/* =================
                                                            PLAN ICON
                                                        ================== */}

                                                        <div
                                                            className={`
                                                                grid
                                                                h-10
                                                                w-10
                                                                shrink-0
                                                                place-items-center
                                                                rounded-xl
                                                                border
                                                                border-white/[0.07]
                                                                bg-black/20

                                                                ${ui.text}
                                                            `}
                                                        >

                                                            <Icon
                                                                size={18}
                                                            />

                                                        </div>


                                                        {/* =================
                                                            PLAN INFO
                                                        ================== */}

                                                        <div
                                                            className="
                                                                min-w-0
                                                                flex-1
                                                            "
                                                        >

                                                            <h4
                                                                className="
                                                                    pr-16
                                                                    text-xs
                                                                    font-black
                                                                    text-white
                                                                "
                                                            >
                                                                {plan.name}
                                                            </h4>


                                                            <div
                                                                className="
                                                                    mt-2
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
                                                                        gap-1
                                                                        text-lg
                                                                        font-black
                                                                        text-white
                                                                    "
                                                                >

                                                                    <Coins
                                                                        size={14}
                                                                        className="
                                                                            text-yellow-400
                                                                        "
                                                                    />


                                                                    {planPrice}

                                                                </span>


                                                                <span
                                                                    className="
                                                                        text-[9px]
                                                                        font-bold
                                                                        text-gray-600
                                                                    "
                                                                >
                                                                    FCoin
                                                                </span>

                                                            </div>


                                                            <p
                                                                className="
                                                                    mt-1.5
                                                                    flex
                                                                    items-center
                                                                    gap-1.5
                                                                    text-[9px]
                                                                    font-semibold
                                                                    text-gray-500
                                                                "
                                                            >

                                                                <Clock3
                                                                    size={12}
                                                                />


                                                                {getDurationLabel(
                                                                    plan.days
                                                                )}

                                                            </p>


                                                            {!enough && (

                                                                <p
                                                                    className="
                                                                        mt-2
                                                                        flex
                                                                        items-center
                                                                        gap-1
                                                                        text-[9px]
                                                                        font-black
                                                                        text-red-400
                                                                    "
                                                                >

                                                                    <AlertTriangle
                                                                        size={10}
                                                                    />

                                                                    FCoin yetarli emas

                                                                </p>
                                                            )}

                                                        </div>


                                                        {/* =================
                                                            SELECTED
                                                        ================== */}

                                                        {active && (

                                                            <CheckCircle2
                                                                size={18}
                                                                className="
                                                                    mt-auto
                                                                    shrink-0
                                                                    text-emerald-300
                                                                "
                                                            />
                                                        )}

                                                    </div>

                                                </button>
                                            );
                                        }
                                    )}

                                </div>

                            ) : (

                                <div
                                    className="
                                        mt-5
                                        rounded-2xl
                                        border
                                        border-dashed
                                        border-white/[0.07]
                                        bg-black/10
                                        p-5
                                        text-center
                                    "
                                >

                                    <AlertTriangle
                                        size={24}
                                        className="
                                            mx-auto
                                            text-gray-700
                                        "
                                    />


                                    <p
                                        className="
                                            mt-3
                                            text-xs
                                            font-black
                                            text-gray-500
                                        "
                                    >
                                        Boost rejalari mavjud emas
                                    </p>


                                    <p
                                        className="
                                            mt-1
                                            text-[9px]
                                            font-semibold
                                            leading-5
                                            text-gray-700
                                        "
                                    >
                                        Backenddan boost rejalari olinmadi.
                                    </p>

                                </div>
                            )}


                            {/* =========================================
                                BOOST BUTTON
                            ========================================== */}

                            <button
                                type="button"

                                onClick={
                                    handleBoostRequest
                                }

                                disabled={
                                    isBoosting
                                    ||
                                    boostOptionsIsLoading
                                    ||
                                    plans.length ===
                                        0
                                    ||
                                    !selectedPlan
                                    ||
                                    isDailyLimitReached
                                }

                                className="
                                    mt-5
                                    inline-flex
                                    min-h-[48px]
                                    w-full
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-2xl
                                    border
                                    border-indigo-400/25
                                    bg-indigo-600
                                    px-5
                                    text-sm
                                    font-black
                                    text-white
                                    shadow-lg
                                    shadow-indigo-600/20
                                    transition-all

                                    hover:bg-indigo-500

                                    active:scale-[0.98]

                                    disabled:cursor-not-allowed
                                    disabled:border-white/[0.05]
                                    disabled:bg-gray-800
                                    disabled:text-gray-600
                                    disabled:shadow-none
                                "
                            >

                                {isBoosting ? (

                                    <>
                                        <Loader2
                                            size={17}
                                            className="
                                                animate-spin
                                            "
                                        />

                                        Boost qilinmoqda...
                                    </>

                                ) : isDailyLimitReached ? (

                                    <>
                                        <Clock3
                                            size={17}
                                        />

                                        BUGUNGI LIMIT TUGADI
                                    </>

                                ) : (

                                    <>
                                        <Zap
                                            size={17}
                                        />

                                        BOOST QILISH


                                        {selectedPlan && (

                                            <span
                                                className="
                                                    rounded-full
                                                    bg-black/20
                                                    px-2
                                                    py-0.5
                                                    text-[9px]
                                                "
                                            >
                                                {selectedPrice} FCoin
                                            </span>
                                        )}
                                    </>
                                )}

                            </button>


                            {/* =========================================
                                BALANCE WARNING
                            ========================================== */}

                            {selectedPlan
                                &&
                                !hasEnoughCoins
                                &&
                                !isDailyLimitReached && (

                                <p
                                    className="
                                        mt-2
                                        text-center
                                        text-[9px]
                                        font-semibold
                                        text-red-400/70
                                    "
                                >
                                    Bu boost uchun yana{" "}

                                    {Math.max(
                                        0,
                                        selectedPrice -
                                        currentBalance
                                    )}{" "}

                                    FCoin kerak.
                                </p>
                            )}


                            {/* =========================================
                                REFRESH
                            ========================================== */}

                            <button
                                type="button"

                                onClick={
                                    handleRefresh
                                }

                                disabled={
                                    isBoosting
                                    ||
                                    boostOptionsIsLoading
                                }

                                className="
                                    mt-2
                                    inline-flex
                                    w-full
                                    items-center
                                    justify-center
                                    gap-2
                                    py-2
                                    text-[9px]
                                    font-bold
                                    text-gray-700
                                    transition

                                    hover:text-gray-500

                                    disabled:cursor-not-allowed
                                    disabled:opacity-40
                                "
                            >

                                <RefreshCw
                                    size={12}

                                    className={
                                        boostOptionsIsLoading
                                            ? "animate-spin"
                                            : ""
                                    }
                                />

                                Ma’lumotlarni yangilash

                            </button>

                        </>
                    )}

                </div>

            </section>


            {/* =================================================
                PURCHASE CONFIRMATION MODAL
            ================================================== */}

            <PurchaseConfirmationModal
                isOpen={
                    isConfirmOpen
                }

                onClose={
                    handleCloseConfirmation
                }

                onConfirm={
                    handleConfirmBoost
                }

                isProcessing={
                    isBoosting
                }

                title="Boostni tasdiqlaysizmi?"

                description={
                    `"${projectName}" loyihasi uchun tanlangan boost rejasini sotib olmoqchisiz.`
                }

                itemName={
                    selectedPlan
                        ? `${selectedPlan.name} — ${projectName}`
                        : projectName
                }

                price={
                    selectedPrice
                }

                balance={
                    currentBalance
                }

                duration={
                    selectedPlan
                        ? getDurationLabel(
                            selectedPlan.days
                        )
                        : null
                }

                confirmText={
                    selectedPlan
                        ? `${selectedPrice} FCoin sarflash`
                        : "Tasdiqlash"
                }

                warningText={
                    selectedPlan

                        ? (
                            `Tasdiqlaganingizdan so‘ng ${selectedPrice} FCoin balansingizdan yechiladi. Bu boost xaridini davom ettirmoqchimisiz?`
                        )

                        : null
                }
            />

        </>
    );
};


export default ProjectBoost;