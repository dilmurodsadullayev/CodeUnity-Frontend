// src/services/promotion.js

import axios from "./api";

import {
    cleanPromotionText,
    normalizePromotionCampaign,
    normalizePromotionCampaigns,
    normalizePromotionPlans,
    safePromotionArray,
    safePromotionPositiveNumber,
} from "../utils/promotion";


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
// ERROR LOGGER
// =========================================================

const logPromotionError = (
    label,
    error
) => {

    if (
        isCanceledRequest(
            error
        )
    ) {
        return;
    }


    console.error(
        label,

        error?.response?.data
        ||
        error?.response
        ||
        error?.message
        ||
        error
    );
};


// =========================================================
// NORMALIZE PLANS RESPONSE
// =========================================================

const normalizePlansResponse = (
    data
) => {

    const plans =
        normalizePromotionPlans(
            data?.plans
            ??
            data
        );


    return {

        count:
            safePromotionPositiveNumber(
                data?.count,

                plans.length
            ),

        plans,

    };
};


// =========================================================
// NORMALIZE MANAGE RESPONSE
// =========================================================

const normalizeManageResponse = (
    projectId,
    data
) => {

    const plans =
        normalizePromotionPlans(
            data?.plans
        );


    const activeCampaign =
        normalizePromotionCampaign(
            data?.active_campaign
        );


    const queue =
        normalizePromotionCampaigns(
            data?.queue
        );


    const history =
        normalizePromotionCampaigns(
            data?.history
        );


    return {

        project_id:
            safePromotionPositiveNumber(
                data?.project_id
                ??
                projectId
            ),

        balance:
            safePromotionPositiveNumber(
                data?.balance
            ),

        is_promoted:
            Boolean(
                data?.is_promoted
            ),

        promotion_expires_at:
            data?.promotion_expires_at
            ??
            activeCampaign?.expires_at
            ??
            null,

        plans,

        active_campaign:
            activeCampaign,

        queue,

        history,

        total_purchases:
            safePromotionPositiveNumber(
                data?.total_purchases,

                history.length
            ),

        total_spent:
            safePromotionPositiveNumber(
                data?.total_spent
            ),

    };
};


// =========================================================
// NORMALIZE PUBLIC RESPONSE
// =========================================================

const normalizePublicResponse = (
    projectId,
    data
) => {

    const promotion =
        normalizePromotionCampaign(
            data?.promotion
        );


    return {

        project_id:
            safePromotionPositiveNumber(
                data?.project_id
                ??
                projectId
            ),

        is_promoted:
            Boolean(
                data?.is_promoted
            ),

        promotion,

        promotion_expires_at:
            data?.promotion_expires_at
            ??
            promotion?.expires_at
            ??
            null,

    };
};


// =========================================================
// NORMALIZE PURCHASE RESPONSE
// =========================================================

const normalizePurchaseResponse = (
    projectId,
    data
) => {

    const campaign =
        normalizePromotionCampaign(
            data?.campaign
        );


    return {

        detail:
            cleanPromotionText(
                data?.detail,
                "Promotion muvaffaqiyatli sotib olindi."
            ),

        project_id:
            safePromotionPositiveNumber(
                data?.project_id
                ??
                projectId
            ),

        project_name:
            cleanPromotionText(
                data?.project_name
            ),

        plan_id:
            cleanPromotionText(
                data?.plan_id
                ??
                data?.plan_code
            ),

        plan_code:
            cleanPromotionText(
                data?.plan_code
                ??
                data?.plan_id
            ),

        plan_name:
            cleanPromotionText(
                data?.plan_name
                ??
                campaign?.plan_name
            ),

        spent_coins:
            safePromotionPositiveNumber(
                data?.spent_coins
                ??
                campaign?.price_paid
            ),

        new_balance:
            safePromotionPositiveNumber(
                data?.new_balance
            ),

        is_promoted:
            Boolean(
                data?.is_promoted
            ),

        promotion_expires_at:
            data?.promotion_expires_at
            ??
            campaign?.expires_at
            ??
            null,

        campaign,

    };
};


// =========================================================
// NORMALIZE SIDEBAR PROJECTS
// =========================================================

const normalizeSidebarProjects = (
    data
) => {

    if (
        Array.isArray(
            data
        )
    ) {
        return data;
    }


    if (
        Array.isArray(
            data?.projects
        )
    ) {
        return data.projects;
    }


    if (
        Array.isArray(
            data?.results
        )
    ) {
        return data.results;
    }


    return [];
};


// =========================================================
// PROMOTION SERVICE
// =========================================================

const PromotionService = {


    // =====================================================
    // PUBLIC PLANS
    //
    // GET:
    // /promotions/plans/
    // =====================================================

    async getPlans(
        {
            signal = undefined,
        } = {}
    ) {

        try {

            const {
                data,
            } = await axios.get(

                "/promotions/plans/",

                {
                    signal,

                    withCredentials:
                        true,
                }
            );


            return (
                normalizePlansResponse(
                    data
                )
            );


        } catch (
            error
        ) {

            logPromotionError(
                "Promotion planlarni olishda xato:",

                error
            );


            throw error;
        }
    },


    // =====================================================
    // PUBLIC PROJECT PROMOTION STATUS
    //
    // GET:
    // /promotions/projects/<id>/
    // =====================================================

    async getProjectPromotion(
        projectId,
        {
            signal = undefined,
        } = {}
    ) {

        try {

            const {
                data,
            } = await axios.get(

                `/promotions/projects/${projectId}/`,

                {
                    signal,

                    withCredentials:
                        true,
                }
            );


            return (
                normalizePublicResponse(
                    projectId,
                    data
                )
            );


        } catch (
            error
        ) {

            logPromotionError(
                "Project promotion statusini olishda xato:",

                error
            );


            throw error;
        }
    },


    // =====================================================
    // OWNER PROMOTION MANAGE
    //
    // GET:
    // /promotions/projects/<id>/manage/
    //
    // Returns:
    //
    // plans
    // balance
    // active_campaign
    // queue
    // history
    // total_purchases
    // total_spent
    // =====================================================

    async getProjectPromotionManage(
        projectId,
        {
            signal = undefined,
        } = {}
    ) {

        try {

            const {
                data,
            } = await axios.get(

                `/promotions/projects/${projectId}/manage/`,

                {
                    signal,

                    withCredentials:
                        true,
                }
            );


            return (
                normalizeManageResponse(
                    projectId,
                    data
                )
            );


        } catch (
            error
        ) {

            logPromotionError(
                "Project promotion boshqaruv ma’lumotlarini olishda xato:",

                error
            );


            throw error;
        }
    },


    // =====================================================
    // PURCHASE
    //
    // POST:
    // /promotions/projects/<id>/purchase/
    //
    // {
    //     plan_code: "premium"
    // }
    // =====================================================

    async purchaseProjectPromotion(
        projectId,
        planCode
    ) {

        const normalizedPlanCode =
            cleanPromotionText(
                planCode
            );


        if (!normalizedPlanCode) {

            throw new Error(
                "Promotion plani tanlanmagan."
            );
        }


        try {

            const {
                data,
            } = await axios.post(

                `/promotions/projects/${projectId}/purchase/`,

                {
                    plan_code:
                        normalizedPlanCode,
                },

                {
                    withCredentials:
                        true,
                }
            );


            return (
                normalizePurchaseResponse(
                    projectId,
                    data
                )
            );


        } catch (
            error
        ) {

            logPromotionError(
                "Project promotion sotib olishda xato:",

                error
            );


            throw error;
        }
    },


    // =====================================================
    // HOME SIDEBAR PROMOTED PROJECTS
    //
    // GET:
    // /promotions/projects/sidebar/?limit=5
    // =====================================================

    async getHomeSidebarProjects(
        {
            limit = 5,
            signal = undefined,
        } = {}
    ) {

        try {

            const safeLimit =
                Math.min(
                    10,

                    Math.max(
                        1,

                        safePromotionPositiveNumber(
                            limit,
                            5
                        )
                    )
                );


            const {
                data,
            } = await axios.get(

                "/promotions/projects/sidebar/",

                {
                    params: {
                        limit:
                            safeLimit,
                    },

                    signal,

                    withCredentials:
                        true,
                }
            );


            return (
                normalizeSidebarProjects(
                    data
                )
            );


        } catch (
            error
        ) {

            logPromotionError(
                "Home promotion projectlarini olishda xato:",

                error
            );


            throw error;
        }
    },

};


export default PromotionService;