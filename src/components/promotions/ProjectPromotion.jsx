// src/components/promotions/ProjectPromotion.jsx

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
    Coins,
    Loader2,
    RefreshCw,
    Rocket,
    ShieldCheck,
    Sparkles,
} from "lucide-react";

import {
    clearProjectPromotion,
    getProjectPromotionFailure,
    getProjectPromotionStart,
    getProjectPromotionSuccess,
    purchasePromotionFailure,
    purchasePromotionStart,
    purchasePromotionSuccess,
    selectPromotionState,
} from "../../features/promotions";

import {
    signUserSuccess,
} from "../../features/auth/Auth";

import PromotionService from "../../services/promotion";

import {
    getPromotionDurationLabel,
    safePromotionPositiveNumber,
} from "../../utils/promotion";

import {
    siteToast,
} from "../ui/AuthToast";

import PurchaseConfirmationModal from "../ui/PurchaseConfirmationModal";

import PromotionActiveCard from "./PromotionActiveCard";
import PromotionHistory from "./PromotionHistory";
import PromotionPlanCard from "./PromotionPlanCard";
import PromotionQueue from "./PromotionQueue";


// =========================================================
// ERROR MESSAGE
// =========================================================

const getErrorMessage = (
    error,
    fallback = "Promotion bilan ishlashda xatolik yuz berdi."
) => {

    const data =
        error?.serverData
        ??
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
        data
        &&
        typeof data ===
            "object"
    ) {

        const firstValue =
            Object.values(
                data
            )[0];


        if (
            Array.isArray(
                firstValue
            )
            &&
            firstValue.length >
                0
        ) {

            return String(
                firstValue[0]
            );
        }


        if (
            typeof firstValue ===
                "string"
        ) {

            return firstValue;
        }
    }


    return (
        error?.message
        ||
        fallback
    );
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
// PROJECT PROMOTION
// =========================================================

const ProjectPromotion = ({

    projectId,

    projectName =
        "Project",

    userCoins = 0,

    onPromotionChange = null,

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
    // PROMOTION REDUX
    // =====================================================

    const {

        projectId:
            loadedProjectId,

        balance,

        plans,

        activeCampaign,

        queue,

        history,

        totalPurchases,

        totalSpent,

        manageLoading,

        manageError,

        purchaseLoading,

        purchaseError,

    } = useSelector(
        selectPromotionState
    );


    // =====================================================
    // LOCAL STATE
    // =====================================================

    const [
        selectedPlanCode,
        setSelectedPlanCode,
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
    // CURRENT PROJECT STATE
    // =====================================================

    const isLoadedForCurrentProject =

        String(
            loadedProjectId
            ??
            ""
        )

        ===

        String(
            projectId
            ??
            ""
        );


    // =====================================================
    // BALANCE
    // =====================================================

    const currentBalance =

        isLoadedForCurrentProject

            ? safePromotionPositiveNumber(
                balance
            )

            : safePromotionPositiveNumber(
                user?.coins
                ??
                userCoins
            );


    // =====================================================
    // PLANS
    // =====================================================

    const safePlans =

        useMemo(
            () => {

                return Array.isArray(
                    plans
                )

                    ? plans

                    : [];

            },
            [
                plans,
            ]
        );


    // =====================================================
    // DEFAULT SELECTED PLAN
    // =====================================================

    useEffect(
        () => {

            if (
                safePlans.length ===
                0
            ) {

                setSelectedPlanCode(
                    null
                );


                return;
            }


            const exists =

                safePlans.some(
                    (
                        plan
                    ) => {

                        return (

                            String(
                                plan.code
                                ??
                                plan.id
                            )

                            ===

                            String(
                                selectedPlanCode
                            )
                        );
                    }
                );


            if (
                exists
            ) {

                return;
            }


            const premium =

                safePlans.find(
                    (
                        plan
                    ) => {

                        return (

                            String(
                                plan.code
                                ??
                                plan.id
                            )

                            ===

                            "premium"
                        );
                    }
                );


            setSelectedPlanCode(

                premium?.code

                ??

                premium?.id

                ??

                safePlans[0]?.code

                ??

                safePlans[0]?.id

                ??

                null
            );

        },
        [
            safePlans,
            selectedPlanCode,
        ]
    );


    // =====================================================
    // SELECTED PLAN
    // =====================================================

    const selectedPlan =

        useMemo(
            () => {

                if (
                    !selectedPlanCode
                ) {

                    return null;
                }


                return (

                    safePlans.find(
                        (
                            plan
                        ) => {

                            return (

                                String(
                                    plan.code
                                    ??
                                    plan.id
                                )

                                ===

                                String(
                                    selectedPlanCode
                                )
                            );
                        }
                    )

                    ??

                    null
                );

            },
            [
                safePlans,
                selectedPlanCode,
            ]
        );


    const selectedPrice =

        safePromotionPositiveNumber(
            selectedPlan
                ?.price
        );


    const hasEnoughCoins =

        Boolean(
            selectedPlan
        )

        &&

        currentBalance >=
            selectedPrice;


    // =====================================================
    // LOAD PROMOTION DATA
    // =====================================================

    const loadPromotionData =

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
                    getProjectPromotionStart()
                );


                try {

                    const response =

                        await PromotionService
                            .getProjectPromotionManage(

                                projectId,

                                {
                                    signal,
                                }
                            );


                    dispatch(
                        getProjectPromotionSuccess(
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

                            "Promotion ma’lumotlarini yuklab bo‘lmadi."
                        );


                    dispatch(
                        getProjectPromotionFailure(
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
                                    "Promotion yuklanmadi",

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
    // INITIAL LOAD
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


            loadPromotionData({
                signal:
                    controller.signal,

                silent:
                    true,
            });


            return () => {

                controller.abort();


                dispatch(
                    clearProjectPromotion()
                );
            };

        },
        [
            dispatch,
            projectId,
            loadPromotionData,
        ]
    );


    // =====================================================
    // SELECT PLAN
    // =====================================================

    const handleSelectPlan =
        (
            plan
        ) => {

            if (
                purchaseLoading
                ||
                manageLoading
            ) {

                return;
            }


            setSelectedPlanCode(

                plan?.code

                ??

                plan?.id

                ??

                null
            );


            setSuccessMessage(
                ""
            );
        };


    // =====================================================
    // OPEN PURCHASE MODAL
    // =====================================================

    const handlePurchaseRequest =
        () => {

            setSuccessMessage(
                ""
            );


            if (
                !projectId
            ) {

                siteToast.error(
                    "Project ID topilmadi.",
                    {
                        title:
                            "Promotion boshlanmadi",
                    }
                );


                return;
            }


            if (
                manageLoading
            ) {

                siteToast.info(
                    "Promotion ma’lumotlari hali yuklanmoqda.",
                    {
                        title:
                            "Biroz kuting",
                    }
                );


                return;
            }


            if (
                !selectedPlan
            ) {

                siteToast.warning(
                    "Avval promotion rejasini tanlang.",
                    {
                        title:
                            "Reja tanlanmagan",
                    }
                );


                return;
            }


            if (
                !hasEnoughCoins
            ) {

                const missing =

                    Math.max(
                        0,

                        selectedPrice -
                            currentBalance
                    );


                siteToast.warning(
                    `Balansingiz yetarli emas. Yana ${missing} FCoin kerak.`,
                    {
                        title:
                            "FCoin yetarli emas",

                        duration:
                            4500,
                    }
                );


                return;
            }


            setIsConfirmOpen(
                true
            );
        };


    // =====================================================
    // CLOSE MODAL
    // =====================================================

    const handleCloseConfirmation =
        () => {

            if (
                purchaseLoading
            ) {

                return;
            }


            setIsConfirmOpen(
                false
            );
        };


    // =====================================================
    // PURCHASE
    // =====================================================

    const handleConfirmPurchase =
        async () => {

            if (
                purchaseLoading

                ||

                !projectId

                ||

                !selectedPlan
            ) {

                return;
            }


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
                            "Promotion sotib olinmadi",
                    }
                );


                return;
            }


            dispatch(
                purchasePromotionStart()
            );


            setSuccessMessage(
                ""
            );


            const toastId =

                siteToast.loading(
                    `"${projectName}" uchun promotion xarid qilinmoqda...`,
                    {
                        title:
                            `${selectedPlan.name} xarid qilinmoqda`,
                    }
                );


            try {

                const response =

                    await PromotionService
                        .purchaseProjectPromotion(

                            projectId,

                            selectedPlan.code
                            ??
                            selectedPlan.id
                        );


                // =========================================
                // PROMOTION REDUX
                // =========================================

                dispatch(
                    purchasePromotionSuccess(
                        response
                    )
                );


                // =========================================
                // AUTH BALANCE
                // =========================================

                if (
                    user

                    &&

                    response
                        ?.new_balance
                    !==
                    undefined
                ) {

                    dispatch(
                        signUserSuccess({

                            ...user,

                            coins:
                                safePromotionPositiveNumber(
                                    response
                                        .new_balance
                                ),
                        })
                    );
                }


                // =========================================
                // CLOSE MODAL
                // =========================================

                setIsConfirmOpen(
                    false
                );


                // =========================================
                // SUCCESS
                // =========================================

                const message =

                    response?.detail

                    ||

                    `${selectedPlan.name} muvaffaqiyatli sotib olindi.`;


                setSuccessMessage(
                    message
                );


                siteToast.success(
                    message,
                    {
                        id:
                            toastId,

                        title:
                            "Promotion xarid qilindi",

                        duration:
                            4200,
                    }
                );


                // =========================================
                // RELOAD PROMOTION
                // =========================================

                await loadPromotionData({
                    silent:
                        true,
                });


                // =========================================
                // RELOAD PROJECT DETAIL
                //
                // Headerdagi is_promoted ham darhol
                // yangilanadi.
                // =========================================

                if (
                    typeof onPromotionChange ===
                        "function"
                ) {

                    await onPromotionChange();
                }


            } catch (
                error
            ) {

                const message =

                    getErrorMessage(
                        error,

                        "Promotion sotib olishda xatolik yuz berdi."
                    );


                dispatch(
                    purchasePromotionFailure(
                        message
                    )
                );


                setIsConfirmOpen(
                    false
                );


                siteToast.error(
                    message,
                    {
                        id:
                            toastId,

                        title:
                            "Promotion xarid qilinmadi",

                        duration:
                            5000,
                    }
                );


                // =========================================
                // SERVER STATE BILAN RE-SYNC
                // =========================================

                await loadPromotionData({
                    silent:
                        true,
                });
            }
        };


    // =====================================================
    // REFRESH
    // =====================================================

    const handleRefresh =
        async () => {

            if (
                manageLoading
                ||
                purchaseLoading
            ) {

                return;
            }


            const toastId =

                siteToast.loading(
                    "Promotion ma’lumotlari yangilanmoqda...",
                    {
                        title:
                            "Yangilanmoqda",
                    }
                );


            const success =

                await loadPromotionData({
                    silent:
                        true,
                });


            if (
                success
            ) {

                siteToast.success(
                    "Promotion ma’lumotlari yangilandi.",
                    {
                        id:
                            toastId,

                        title:
                            "Yangilandi",

                        duration:
                            2000,
                    }
                );


            } else {

                siteToast.error(
                    "Promotion ma’lumotlarini yangilab bo‘lmadi.",
                    {
                        id:
                            toastId,

                        title:
                            "Xatolik",
                    }
                );
            }
        };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <>

            {/* =================================================
                MAIN PROMOTION PANEL
            ================================================== */}

            <section
                className="
                    relative
                    overflow-hidden
                    rounded-3xl
                    border
                    border-white/[0.07]
                    bg-[#0b1018]
                    p-5
                    shadow-[0_25px_80px_rgba(0,0,0,0.24)]
                "
            >

                {/* GLOW */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        -right-24
                        -top-24
                        h-52
                        w-52
                        rounded-full
                        bg-purple-500/[0.07]
                        blur-[90px]
                    "
                />


                <div
                    className="
                        relative
                        z-10
                    "
                >

                    {/* =========================================
                        HEADER
                    ========================================== */}

                    <div
                        className="
                            flex
                            flex-col
                            gap-4

                            sm:flex-row
                            sm:items-start
                            sm:justify-between
                        "
                    >

                        <div
                            className="
                                flex
                                items-start
                                gap-3
                            "
                        >

                            <div
                                className="
                                    grid
                                    h-11
                                    w-11
                                    flex-shrink-0
                                    place-items-center
                                    rounded-2xl
                                    border
                                    border-purple-400/15
                                    bg-purple-400/[0.07]
                                    text-purple-300
                                "
                            >

                                <Rocket
                                    size={20}
                                />

                            </div>


                            <div>

                                <p
                                    className="
                                        font-mono
                                        text-[9px]
                                        font-black
                                        uppercase
                                        tracking-[0.18em]
                                        text-purple-300/70
                                    "
                                >
                                    fsociety://promotion
                                </p>


                                <h2
                                    className="
                                        mt-1
                                        text-lg
                                        font-black
                                        text-white
                                    "
                                >
                                    Project promotion
                                </h2>


                                <p
                                    className="
                                        mt-1
                                        max-w-lg
                                        text-[10px]
                                        font-medium
                                        leading-5
                                        text-gray-600
                                    "
                                >
                                    Loyihangizni Projects sahifasi
                                    va Home reklama joylarida
                                    yuqoriga olib chiqing.
                                </p>

                            </div>

                        </div>


                        {/* BALANCE + REFRESH */}

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                            "
                        >

                            <div
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-yellow-400/10
                                    bg-yellow-400/[0.04]
                                    px-3
                                    py-2
                                "
                            >

                                <Coins
                                    size={14}
                                    className="
                                        text-yellow-300
                                    "
                                />


                                <span
                                    className="
                                        text-xs
                                        font-black
                                        text-yellow-300
                                    "
                                >
                                    {currentBalance}
                                </span>


                                <span
                                    className="
                                        text-[8px]
                                        font-black
                                        uppercase
                                        tracking-[0.1em]
                                        text-yellow-200/40
                                    "
                                >
                                    FCoin
                                </span>

                            </div>


                            <button
                                type="button"

                                onClick={
                                    handleRefresh
                                }

                                disabled={
                                    manageLoading
                                    ||
                                    purchaseLoading
                                }

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
                                    transition

                                    hover:bg-white/[0.05]
                                    hover:text-gray-300

                                    disabled:cursor-not-allowed
                                    disabled:opacity-40
                                "
                            >

                                <RefreshCw
                                    size={14}

                                    className={
                                        manageLoading
                                            ? "animate-spin"
                                            : ""
                                    }
                                />

                            </button>

                        </div>

                    </div>


                    {/* =========================================
                        ERRORS
                    ========================================== */}

                    {(
                        manageError
                        ||
                        purchaseError
                    ) && (

                        <div
                            className="
                                mt-4
                                flex
                                items-start
                                gap-2
                                rounded-xl
                                border
                                border-red-400/15
                                bg-red-400/[0.045]
                                p-3
                                text-[10px]
                                font-semibold
                                leading-5
                                text-red-300
                            "
                        >

                            <AlertTriangle
                                size={14}
                                className="
                                    mt-0.5
                                    flex-shrink-0
                                "
                            />


                            {
                                purchaseError
                                ||
                                manageError
                            }

                        </div>
                    )}


                    {/* =========================================
                        SUCCESS
                    ========================================== */}

                    {successMessage && (

                        <div
                            className="
                                mt-4
                                flex
                                items-start
                                gap-2
                                rounded-xl
                                border
                                border-emerald-400/15
                                bg-emerald-400/[0.04]
                                p-3
                                text-[10px]
                                font-semibold
                                leading-5
                                text-emerald-300
                            "
                        >

                            <CheckCircle2
                                size={14}
                                className="
                                    mt-0.5
                                    flex-shrink-0
                                "
                            />


                            {successMessage}

                        </div>
                    )}


                    {/* =========================================
                        INITIAL LOADING
                    ========================================== */}

                    {(
                        manageLoading

                        &&

                        !isLoadedForCurrentProject

                    ) ? (

                        <div
                            className="
                                flex
                                min-h-[220px]
                                items-center
                                justify-center
                            "
                        >

                            <div
                                className="
                                    text-center
                                "
                            >

                                <Loader2
                                    size={24}
                                    className="
                                        mx-auto
                                        animate-spin
                                        text-purple-300
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
                                    Promotion ma’lumotlari
                                    yuklanmoqda...
                                </p>

                            </div>

                        </div>

                    ) : (

                        <>

                            {/* =================================
                                ACTIVE CAMPAIGN
                            ================================== */}

                            {activeCampaign ? (

                                <div
                                    className="
                                        mt-5
                                    "
                                >

                                    <PromotionActiveCard
                                        campaign={
                                            activeCampaign
                                        }

                                        onRefresh={
                                            handleRefresh
                                        }

                                        isRefreshing={
                                            manageLoading
                                        }
                                    />

                                </div>

                            ) : (

                                <div
                                    className="
                                        mt-5
                                        flex
                                        items-start
                                        gap-3
                                        rounded-2xl
                                        border
                                        border-dashed
                                        border-white/[0.065]
                                        bg-white/[0.015]
                                        p-4
                                    "
                                >

                                    <ShieldCheck
                                        size={17}
                                        className="
                                            mt-0.5
                                            flex-shrink-0
                                            text-gray-700
                                        "
                                    />


                                    <div>

                                        <p
                                            className="
                                                text-xs
                                                font-black
                                                text-gray-400
                                            "
                                        >
                                            Aktiv promotion yo‘q
                                        </p>


                                        <p
                                            className="
                                                mt-1
                                                text-[9px]
                                                font-medium
                                                leading-5
                                                text-gray-700
                                            "
                                        >
                                            Pastdagi rejalardan
                                            birini tanlab reklama
                                            kampaniyasini
                                            boshlashingiz mumkin.
                                        </p>

                                    </div>

                                </div>
                            )}


                            {/* =================================
                                PLANS
                            ================================== */}

                            <div
                                className="
                                    mt-6
                                "
                            >

                                <div
                                    className="
                                        mb-3
                                        flex
                                        items-center
                                        gap-2
                                    "
                                >

                                    <Sparkles
                                        size={14}
                                        className="
                                            text-purple-300
                                        "
                                    />


                                    <h3
                                        className="
                                            text-xs
                                            font-black
                                            uppercase
                                            tracking-[0.12em]
                                            text-gray-400
                                        "
                                    >
                                        Promotion rejalari
                                    </h3>

                                </div>


                                {safePlans.length ===
                                0 ? (

                                    <div
                                        className="
                                            rounded-2xl
                                            border
                                            border-dashed
                                            border-white/[0.06]
                                            p-6
                                            text-center
                                            text-[10px]
                                            font-semibold
                                            text-gray-700
                                        "
                                    >
                                        Aktiv promotion rejasi
                                        topilmadi.
                                    </div>

                                ) : (

                                    <div
                                        className="
                                            grid
                                            gap-3
                                        "
                                    >

                                        {safePlans.map(
                                            (
                                                plan
                                            ) => {

                                                const planCode =

                                                    plan.code

                                                    ??

                                                    plan.id;


                                                return (

                                                    <PromotionPlanCard
                                                        key={
                                                            planCode
                                                        }

                                                        plan={
                                                            plan
                                                        }

                                                        selected={
                                                            String(
                                                                selectedPlanCode
                                                            )

                                                            ===

                                                            String(
                                                                planCode
                                                            )
                                                        }

                                                        balance={
                                                            currentBalance
                                                        }

                                                        disabled={
                                                            purchaseLoading
                                                        }

                                                        onSelect={
                                                            handleSelectPlan
                                                        }
                                                    />
                                                );
                                            }
                                        )}

                                    </div>
                                )}

                            </div>


                            {/* =================================
                                PURCHASE BUTTON
                            ================================== */}

                            <button
                                type="button"

                                onClick={
                                    handlePurchaseRequest
                                }

                                disabled={
                                    purchaseLoading
                                    ||
                                    manageLoading
                                    ||
                                    !selectedPlan
                                }

                                className="
                                    mt-4
                                    inline-flex
                                    min-h-[46px]
                                    w-full
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-purple-400/20
                                    bg-purple-600
                                    px-5
                                    text-xs
                                    font-black
                                    text-white
                                    transition-all

                                    hover:bg-purple-500

                                    active:scale-[0.99]

                                    disabled:cursor-not-allowed
                                    disabled:bg-gray-900
                                    disabled:text-gray-700
                                "
                            >

                                {purchaseLoading ? (

                                    <>

                                        <Loader2
                                            size={15}
                                            className="
                                                animate-spin
                                            "
                                        />

                                        Xarid qilinmoqda...

                                    </>

                                ) : (

                                    <>

                                        <Rocket
                                            size={15}
                                        />

                                        Promotion sotib olish


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

                        </>
                    )}

                </div>

            </section>


            {/* =================================================
                QUEUE
            ================================================== */}

            <div
                className="
                    mt-4
                "
            >

                <PromotionQueue
                    campaigns={
                        queue
                    }
                />

            </div>


            {/* =================================================
                HISTORY
            ================================================== */}

            <div
                className="
                    mt-4
                "
            >

                <PromotionHistory
                    campaigns={
                        history
                    }

                    totalPurchases={
                        totalPurchases
                    }

                    totalSpent={
                        totalSpent
                    }
                />

            </div>


            {/* =================================================
                PURCHASE CONFIRMATION
            ================================================== */}

            <PurchaseConfirmationModal
                isOpen={
                    isConfirmOpen
                }

                onClose={
                    handleCloseConfirmation
                }

                onConfirm={
                    handleConfirmPurchase
                }

                isProcessing={
                    purchaseLoading
                }

                title={
                    "Promotion xaridini tasdiqlaysizmi?"
                }

                description={
                    `"${projectName}" loyihasi uchun tanlangan promotion rejasini sotib olmoqchisiz.`
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

                        ? getPromotionDurationLabel({

                            durationHours:
                                selectedPlan
                                    .duration_hours,

                            days:
                                selectedPlan
                                    .days,

                            durationLabel:
                                selectedPlan
                                    .duration_label,
                        })

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
                            `Tasdiqlaganingizdan so‘ng ${selectedPrice} FCoin balansingizdan yechiladi. Agar aktiv promotion mavjud bo‘lsa, yangi xarid uning ortidan navbatga qo‘shiladi.`
                        )

                        : null
                }
            />

        </>
    );
};


export default ProjectPromotion;