// src/features/promotions.js

import {
    createSlice,
} from "@reduxjs/toolkit";

import {
    normalizePromotionCampaign,
    normalizePromotionCampaigns,
    normalizePromotionPlans,
    safePromotionPositiveNumber,
} from "../utils/promotion";


// =========================================================
// INITIAL STATE
// =========================================================

const initialState = {

    // =====================================================
    // PUBLIC PLANS
    // =====================================================

    plans:
        [],

    plansCount:
        0,

    plansLoading:
        false,

    plansError:
        null,


    // =====================================================
    // CURRENT PROJECT PROMOTION
    // =====================================================

    projectId:
        null,

    balance:
        0,

    isPromoted:
        false,

    promotionExpiresAt:
        null,

    activeCampaign:
        null,

    queue:
        [],

    history:
        [],

    totalPurchases:
        0,

    totalSpent:
        0,

    manageLoading:
        false,

    manageError:
        null,


    // =====================================================
    // PURCHASE
    // =====================================================

    purchaseLoading:
        false,

    purchaseError:
        null,

    lastPurchase:
        null,


    // =====================================================
    // HOME SIDEBAR
    // =====================================================

    sidebarProjects:
        [],

    sidebarLoading:
        false,

    sidebarError:
        null,

};


// =========================================================
// SLICE
// =========================================================

export const promotionSlice =
    createSlice({

        name:
            "promotion",

        initialState,

        reducers: {


            // =================================================
            // PLANS START
            // =================================================

            getPromotionPlansStart: (
                state
            ) => {

                state.plansLoading =
                    true;

                state.plansError =
                    null;
            },


            // =================================================
            // PLANS SUCCESS
            // =================================================

            getPromotionPlansSuccess: (
                state,
                action
            ) => {

                state.plansLoading =
                    false;

                state.plansError =
                    null;


                const payload =
                    action.payload
                    ??
                    {};


                const plans =
                    normalizePromotionPlans(

                        payload.plans
                        ??
                        payload
                    );


                state.plans =
                    plans;


                state.plansCount =
                    safePromotionPositiveNumber(
                        payload.count,

                        plans.length
                    );
            },


            // =================================================
            // PLANS FAILURE
            // =================================================

            getPromotionPlansFailure: (
                state,
                action
            ) => {

                state.plansLoading =
                    false;

                state.plansError =
                    action.payload
                    ||
                    "Promotion planlarni olishda xatolik yuz berdi.";
            },


            // =================================================
            // PROJECT MANAGE START
            // =================================================

            getProjectPromotionStart: (
                state
            ) => {

                state.manageLoading =
                    true;

                state.manageError =
                    null;
            },


            // =================================================
            // PROJECT MANAGE SUCCESS
            // =================================================

            getProjectPromotionSuccess: (
                state,
                action
            ) => {

                state.manageLoading =
                    false;

                state.manageError =
                    null;


                const payload =
                    action.payload
                    ??
                    {};


                // ---------------------------------------------
                // PROJECT
                // ---------------------------------------------

                state.projectId =
                    payload.project_id
                    ??
                    state.projectId;


                // ---------------------------------------------
                // BALANCE
                // ---------------------------------------------

                state.balance =
                    safePromotionPositiveNumber(
                        payload.balance
                    );


                // ---------------------------------------------
                // PROMOTION STATUS
                // ---------------------------------------------

                state.isPromoted =
                    Boolean(
                        payload.is_promoted
                    );


                state.promotionExpiresAt =
                    payload
                        .promotion_expires_at
                    ??
                    null;


                // ---------------------------------------------
                // PLANS
                //
                // Manage endpoint plans qaytarsa public plans
                // state ham sync qilinadi.
                // ---------------------------------------------

                if (
                    Array.isArray(
                        payload.plans
                    )
                ) {

                    state.plans =
                        normalizePromotionPlans(
                            payload.plans
                        );


                    state.plansCount =
                        state.plans.length;
                }


                // ---------------------------------------------
                // ACTIVE CAMPAIGN
                // ---------------------------------------------

                state.activeCampaign =
                    normalizePromotionCampaign(
                        payload.active_campaign
                    );


                // ---------------------------------------------
                // QUEUE
                // ---------------------------------------------

                state.queue =
                    normalizePromotionCampaigns(
                        payload.queue
                    );


                // ---------------------------------------------
                // HISTORY
                // ---------------------------------------------

                state.history =
                    normalizePromotionCampaigns(
                        payload.history
                    );


                // ---------------------------------------------
                // TOTAL
                // ---------------------------------------------

                state.totalPurchases =
                    safePromotionPositiveNumber(
                        payload.total_purchases,

                        state.history.length
                    );


                state.totalSpent =
                    safePromotionPositiveNumber(
                        payload.total_spent
                    );
            },


            // =================================================
            // PROJECT MANAGE FAILURE
            // =================================================

            getProjectPromotionFailure: (
                state,
                action
            ) => {

                state.manageLoading =
                    false;

                state.manageError =
                    action.payload
                    ||
                    "Promotion ma’lumotlarini olishda xatolik yuz berdi.";
            },


            // =================================================
            // PURCHASE START
            // =================================================

            purchasePromotionStart: (
                state
            ) => {

                state.purchaseLoading =
                    true;

                state.purchaseError =
                    null;

                state.lastPurchase =
                    null;
            },


            // =================================================
            // PURCHASE SUCCESS
            // =================================================

            purchasePromotionSuccess: (
                state,
                action
            ) => {

                state.purchaseLoading =
                    false;

                state.purchaseError =
                    null;


                const payload =
                    action.payload
                    ??
                    {};


                state.lastPurchase =
                    payload;


                // ---------------------------------------------
                // PROJECT ID
                // ---------------------------------------------

                if (
                    payload.project_id !==
                    undefined
                ) {

                    state.projectId =
                        payload.project_id;
                }


                // ---------------------------------------------
                // BALANCE
                // ---------------------------------------------

                if (
                    payload.new_balance !==
                    undefined
                ) {

                    state.balance =
                        safePromotionPositiveNumber(
                            payload.new_balance
                        );
                }


                // ---------------------------------------------
                // PUBLIC STATE
                // ---------------------------------------------

                if (
                    payload.is_promoted !==
                    undefined
                ) {

                    state.isPromoted =
                        Boolean(
                            payload.is_promoted
                        );
                }


                if (
                    payload.promotion_expires_at !==
                    undefined
                ) {

                    state.promotionExpiresAt =
                        payload
                            .promotion_expires_at
                        ??
                        null;
                }


                // ---------------------------------------------
                // NEW CAMPAIGN
                // ---------------------------------------------

                const campaign =
                    normalizePromotionCampaign(
                        payload.campaign
                    );


                if (!campaign) {
                    return;
                }


                // ---------------------------------------------
                // ACTIVE
                // ---------------------------------------------

                if (
                    campaign.effective_status ===
                    "active"
                ) {

                    state.activeCampaign =
                        campaign;
                }


                // ---------------------------------------------
                // SCHEDULED
                // ---------------------------------------------

                if (
                    campaign.effective_status ===
                    "scheduled"
                ) {

                    const alreadyExists =
                        state.queue.some(
                            (
                                item
                            ) =>
                                String(
                                    item.public_id
                                    ??
                                    item.id
                                )
                                ===
                                String(
                                    campaign.public_id
                                    ??
                                    campaign.id
                                )
                        );


                    if (
                        !alreadyExists
                    ) {

                        state.queue.push(
                            campaign
                        );


                        state.queue.sort(
                            (
                                a,
                                b
                            ) => {

                                const aTime =
                                    new Date(
                                        a.starts_at
                                        ??
                                        0
                                    ).getTime();


                                const bTime =
                                    new Date(
                                        b.starts_at
                                        ??
                                        0
                                    ).getTime();


                                return (
                                    aTime -
                                    bTime
                                );
                            }
                        );
                    }
                }


                // ---------------------------------------------
                // HISTORY
                // ---------------------------------------------

                const historyExists =
                    state.history.some(
                        (
                            item
                        ) =>
                            String(
                                item.public_id
                                ??
                                item.id
                            )
                            ===
                            String(
                                campaign.public_id
                                ??
                                campaign.id
                            )
                    );


                if (
                    !historyExists
                ) {

                    state.history.unshift(
                        campaign
                    );


                    state.totalPurchases =
                        state.history.length;


                    state.totalSpent =
                        Math.max(
                            0,

                            state.totalSpent
                            +
                            safePromotionPositiveNumber(
                                campaign.price_paid
                            )
                        );
                }
            },


            // =================================================
            // PURCHASE FAILURE
            // =================================================

            purchasePromotionFailure: (
                state,
                action
            ) => {

                state.purchaseLoading =
                    false;

                state.purchaseError =
                    action.payload
                    ||
                    "Promotion sotib olishda xatolik yuz berdi.";
            },


            // =================================================
            // CLEAR LAST PURCHASE
            // =================================================

            clearPromotionPurchase: (
                state
            ) => {

                state.purchaseError =
                    null;

                state.lastPurchase =
                    null;
            },


            // =================================================
            // SIDEBAR START
            // =================================================

            getSidebarPromotionsStart: (
                state
            ) => {

                state.sidebarLoading =
                    true;

                state.sidebarError =
                    null;
            },


            // =================================================
            // SIDEBAR SUCCESS
            // =================================================

            getSidebarPromotionsSuccess: (
                state,
                action
            ) => {

                state.sidebarLoading =
                    false;

                state.sidebarError =
                    null;


                state.sidebarProjects =
                    Array.isArray(
                        action.payload
                    )
                        ? action.payload
                        : [];
            },


            // =================================================
            // SIDEBAR FAILURE
            // =================================================

            getSidebarPromotionsFailure: (
                state,
                action
            ) => {

                state.sidebarLoading =
                    false;

                state.sidebarError =
                    action.payload
                    ||
                    "Reklama loyihalarini olishda xatolik yuz berdi.";
            },


            // =================================================
            // CLEAR CURRENT PROJECT
            // =================================================

            clearProjectPromotion: (
                state
            ) => {

                state.projectId =
                    null;

                state.balance =
                    0;

                state.isPromoted =
                    false;

                state.promotionExpiresAt =
                    null;

                state.activeCampaign =
                    null;

                state.queue =
                    [];

                state.history =
                    [];

                state.totalPurchases =
                    0;

                state.totalSpent =
                    0;

                state.manageLoading =
                    false;

                state.manageError =
                    null;

                state.purchaseLoading =
                    false;

                state.purchaseError =
                    null;

                state.lastPurchase =
                    null;
            },


            // =================================================
            // CLEAR ERRORS
            // =================================================

            clearPromotionErrors: (
                state
            ) => {

                state.plansError =
                    null;

                state.manageError =
                    null;

                state.purchaseError =
                    null;

                state.sidebarError =
                    null;
            },


            // =================================================
            // RESET ALL
            // =================================================

            resetPromotionState: () => {

                return {
                    ...initialState,
                };
            },

        },

    });


// =========================================================
// ACTIONS
// =========================================================

export const {

    getPromotionPlansStart,

    getPromotionPlansSuccess,

    getPromotionPlansFailure,


    getProjectPromotionStart,

    getProjectPromotionSuccess,

    getProjectPromotionFailure,


    purchasePromotionStart,

    purchasePromotionSuccess,

    purchasePromotionFailure,


    getSidebarPromotionsStart,

    getSidebarPromotionsSuccess,

    getSidebarPromotionsFailure,


    clearPromotionPurchase,

    clearProjectPromotion,

    clearPromotionErrors,

    resetPromotionState,

} = promotionSlice.actions;


// =========================================================
// SELECTORS
// =========================================================

export const selectPromotionState = (
    state
) => {

    return (
        state.promotion
        ??
        initialState
    );
};


export const selectPromotionPlans = (
    state
) => {

    return (
        state.promotion?.plans
        ??
        []
    );
};


export const selectActivePromotionCampaign = (
    state
) => {

    return (
        state.promotion
            ?.activeCampaign
        ??
        null
    );
};


export const selectPromotionQueue = (
    state
) => {

    return (
        state.promotion?.queue
        ??
        []
    );
};


export const selectPromotionHistory = (
    state
) => {

    return (
        state.promotion?.history
        ??
        []
    );
};


export const selectSidebarPromotions = (
    state
) => {

    return (
        state.promotion
            ?.sidebarProjects
        ??
        []
    );
};


// =========================================================
// REDUCER
// =========================================================

export default (
    promotionSlice.reducer
);