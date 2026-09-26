// src/utils/promotion.js


// =========================================================
// SAFE NUMBER
// =========================================================

export const safePromotionNumber = (
    value,
    fallback = 0
) => {

    const number =
        Number(
            value
        );


    return Number.isFinite(
        number
    )
        ? number
        : fallback;
};


// =========================================================
// NON NEGATIVE NUMBER
// =========================================================

export const safePromotionPositiveNumber = (
    value,
    fallback = 0
) => {

    return Math.max(
        0,
        safePromotionNumber(
            value,
            fallback
        )
    );
};


// =========================================================
// SAFE ARRAY
// =========================================================

export const safePromotionArray = (
    value
) => {

    if (
        Array.isArray(
            value
        )
    ) {
        return value;
    }


    if (
        Array.isArray(
            value?.results
        )
    ) {
        return value.results;
    }


    return [];
};


// =========================================================
// CLEAN STRING
// =========================================================

export const cleanPromotionText = (
    value,
    fallback = ""
) => {

    const text =
        String(
            value
            ??
            ""
        ).trim();


    return (
        text
        ||
        fallback
    );
};


// =========================================================
// NORMALIZE STATUS
// =========================================================

export const normalizePromotionStatus = (
    value
) => {

    const status =
        cleanPromotionText(
            value
        ).toLowerCase();


    if (
        status ===
        "active"
    ) {
        return "active";
    }


    if (
        status ===
        "scheduled"
    ) {
        return "scheduled";
    }


    if (
        status ===
        "expired"
    ) {
        return "expired";
    }


    if (
        status ===
        "cancelled"
        ||
        status ===
        "canceled"
    ) {
        return "cancelled";
    }


    return (
        status
        ||
        "unknown"
    );
};


// =========================================================
// VALID DATE
// =========================================================

export const getPromotionDate = (
    value
) => {

    if (!value) {
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


    return date;
};


// =========================================================
// FORMAT DATE
// =========================================================

export const formatPromotionDateTime = (
    value
) => {

    const date =
        getPromotionDate(
            value
        );


    if (!date) {
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
// REMAINING MILLISECONDS
// =========================================================

export const getPromotionRemainingMs = (
    expiresAt
) => {

    const date =
        getPromotionDate(
            expiresAt
        );


    if (!date) {
        return 0;
    }


    return Math.max(
        0,
        date.getTime()
        -
        Date.now()
    );
};


// =========================================================
// REMAINING SECONDS
// =========================================================

export const getPromotionRemainingSeconds = (
    expiresAt
) => {

    return Math.floor(
        getPromotionRemainingMs(
            expiresAt
        )
        /
        1000
    );
};


// =========================================================
// ACTIVE BY DATE
// =========================================================

export const isPromotionActiveByDate = (
    {
        startsAt,
        expiresAt,
    } = {}
) => {

    const starts =
        getPromotionDate(
            startsAt
        );


    const expires =
        getPromotionDate(
            expiresAt
        );


    if (!expires) {
        return false;
    }


    const now =
        Date.now();


    if (
        starts
        &&
        starts.getTime() >
            now
    ) {
        return false;
    }


    return (
        expires.getTime() >
        now
    );
};


// =========================================================
// DURATION LABEL
// =========================================================

export const getPromotionDurationLabel = (
    {
        durationHours,
        days,
        durationLabel,
    } = {}
) => {

    if (
        cleanPromotionText(
            durationLabel
        )
    ) {

        return cleanPromotionText(
            durationLabel
        );
    }


    const hours =
        safePromotionPositiveNumber(
            durationHours
        );


    if (hours > 0) {

        if (
            hours %
            24
            ===
            0
        ) {

            const totalDays =
                hours /
                24;


            return (
                totalDays ===
                1
                    ? "1 kun"
                    : `${totalDays} kun`
            );
        }


        return (
            `${hours} soat`
        );
    }


    const totalDays =
        safePromotionPositiveNumber(
            days
        );


    if (
        totalDays > 0
    ) {

        return (
            totalDays ===
            1
                ? "1 kun"
                : `${totalDays} kun`
        );
    }


    return "—";
};


// =========================================================
// PLAN NORMALIZER
// =========================================================

export const normalizePromotionPlan = (
    plan
) => {

    if (
        !plan
        ||
        typeof plan !==
            "object"
    ) {
        return null;
    }


    const code =
        cleanPromotionText(
            plan.code
            ??
            plan.id
        );


    if (!code) {
        return null;
    }


    const durationHours =
        safePromotionPositiveNumber(
            plan.duration_hours
        );


    const days =
        safePromotionPositiveNumber(
            plan.days,

            durationHours > 0
                ? durationHours / 24
                : 0
        );


    return {

        id:
            cleanPromotionText(
                plan.id
                ??
                code
            ),

        code,

        name:
            cleanPromotionText(
                plan.name,
                code
            ),

        description:
            cleanPromotionText(
                plan.description
            ),

        price:
            safePromotionPositiveNumber(
                plan.price
            ),

        duration_hours:
            durationHours,

        days,

        duration_label:
            getPromotionDurationLabel({
                durationHours,
                days,
                durationLabel:
                    plan.duration_label,
            }),

        priority:
            safePromotionPositiveNumber(
                plan.priority
            ),

        placements:
            safePromotionArray(
                plan.placements
            ),

    };
};


// =========================================================
// CAMPAIGN NORMALIZER
// =========================================================

export const normalizePromotionCampaign = (
    campaign
) => {

    if (
        !campaign
        ||
        typeof campaign !==
            "object"
    ) {
        return null;
    }


    const effectiveStatus =
        normalizePromotionStatus(
            campaign.effective_status
            ??
            campaign.status
            ??
            campaign.state
        );


    const startsAt =
        campaign.starts_at
        ??
        null;


    const expiresAt =
        campaign.expires_at
        ??
        null;


    return {

        id:
            campaign.id
            ??
            null,

        public_id:
            campaign.public_id
            ??
            null,

        target_type:
            campaign.target_type
            ??
            campaign.target_model
            ??
            null,

        target_id:
            campaign.target_id
            ??
            campaign.object_id
            ??
            null,

        target_title:
            campaign.target_title
            ??
            campaign.target_title_snapshot
            ??
            "",

        plan_code:
            cleanPromotionText(
                campaign.plan_code
                ??
                campaign.plan_code_snapshot
            ),

        plan_name:
            cleanPromotionText(
                campaign.plan_name
                ??
                campaign.plan_name_snapshot
            ),

        price_paid:
            safePromotionPositiveNumber(
                campaign.price_paid
            ),

        duration_hours:
            safePromotionPositiveNumber(
                campaign.duration_hours
            ),

        duration_label:
            getPromotionDurationLabel({
                durationHours:
                    campaign.duration_hours,

                durationLabel:
                    campaign.duration_label,
            }),

        priority:
            safePromotionPositiveNumber(
                campaign.priority
            ),

        placements:
            safePromotionArray(
                campaign.placements
            ),

        starts_at:
            startsAt,

        expires_at:
            expiresAt,

        remaining_seconds:
            safePromotionPositiveNumber(
                campaign.remaining_seconds,

                getPromotionRemainingSeconds(
                    expiresAt
                )
            ),

        effective_status:
            effectiveStatus,

        state:
            cleanPromotionText(
                campaign.state
            ),

        is_active:
            campaign.is_active !==
            undefined
                ? Boolean(
                    campaign.is_active
                )
                : (
                    effectiveStatus ===
                    "active"
                    ||
                    isPromotionActiveByDate({
                        startsAt,
                        expiresAt,
                    })
                ),

        is_scheduled:
            campaign.is_scheduled !==
            undefined
                ? Boolean(
                    campaign.is_scheduled
                )
                : (
                    effectiveStatus ===
                    "scheduled"
                ),

        is_expired:
            campaign.is_expired !==
            undefined
                ? Boolean(
                    campaign.is_expired
                )
                : (
                    effectiveStatus ===
                    "expired"
                ),

        cancelled_at:
            campaign.cancelled_at
            ??
            null,

        cancel_reason:
            cleanPromotionText(
                campaign.cancel_reason
            ),

        created_at:
            campaign.created_at
            ??
            null,

    };
};


// =========================================================
// CAMPAIGN ARRAY
// =========================================================

export const normalizePromotionCampaigns = (
    campaigns
) => {

    return (
        safePromotionArray(
            campaigns
        )
        .map(
            normalizePromotionCampaign
        )
        .filter(
            Boolean
        )
    );
};


// =========================================================
// PLAN ARRAY
// =========================================================

export const normalizePromotionPlans = (
    plans
) => {

    return (
        safePromotionArray(
            plans
        )
        .map(
            normalizePromotionPlan
        )
        .filter(
            Boolean
        )
    );
};


// =========================================================
// PROJECT PROMOTED
// =========================================================

export const isProjectPromoted = (
    project
) => {

    if (!project) {
        return false;
    }


    if (
        project.is_promoted !==
        undefined
    ) {

        return Boolean(
            project.is_promoted
        );
    }


    return false;
};


// =========================================================
// PROJECT PROMOTION EXPIRES
// =========================================================

export const getProjectPromotionExpiresAt = (
    project
) => {

    return (
        project?.promotion_expires_at
        ??
        null
    );
};