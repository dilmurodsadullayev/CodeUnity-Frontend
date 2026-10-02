import axios from "./api";

// =========================================================
// ENDPOINTS
// =========================================================

const ENDPOINTS = {
    list: "/feedback/",
    mine: "/feedback/mine/",
    stats: "/feedback/mine/stats/",

    detail: (feedbackId) => (
        `/feedback/${feedbackId}/`
    ),
};

// =========================================================
// CANCELED REQUEST
// =========================================================

export const isFeedbackRequestCanceled = (
    error
) => {
    return (
        error?.code === "ERR_CANCELED"
        ||
        error?.name === "CanceledError"
        ||
        error?.name === "AbortError"
    );
};

// =========================================================
// ERROR MESSAGE
// =========================================================

export const getFeedbackServiceErrorMessage = (
    error,
    fallback = "Feedback bilan ishlashda xatolik yuz berdi."
) => {
    if (
        isFeedbackRequestCanceled(
            error
        )
    ) {
        return "";
    }

    const data =
        error?.serverData
        ||
        error?.response?.data;

    if (
        typeof data === "string"
        &&
        data.trim()
    ) {
        return data.trim();
    }

    if (
        typeof data?.detail === "string"
        &&
        data.detail.trim()
    ) {
        return data.detail.trim();
    }

    if (
        Array.isArray(
            data?.detail
        )
        &&
        data.detail.length > 0
    ) {
        return String(
            data.detail[0]
        );
    }

    if (
        data?.message
    ) {
        return String(
            data.message
        );
    }

    if (
        data?.error
    ) {
        return String(
            data.error
        );
    }

    if (
        data
        &&
        typeof data === "object"
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
            firstValue.length > 0
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
// VALID ID
// =========================================================

const normalizeFeedbackId = (
    feedbackId
) => {
    const id =
        Number(
            feedbackId
        );

    if (
        !Number.isInteger(
            id
        )
        ||
        id <= 0
    ) {
        throw new Error(
            "Feedback ID noto‘g‘ri."
        );
    }

    return id;
};

// =========================================================
// OPTIONAL POSITIVE INTEGER
// =========================================================

const normalizeOptionalPositiveInteger = (
    value,
    fieldName
) => {
    if (
        value === undefined
        ||
        value === null
        ||
        value === ""
    ) {
        return null;
    }

    const number =
        Number(
            value
        );

    if (
        !Number.isInteger(
            number
        )
        ||
        number <= 0
    ) {
        throw new Error(
            `${fieldName} musbat butun son bo‘lishi kerak.`
        );
    }

    return number;
};

// =========================================================
// OPTIONAL STRING
// =========================================================

const normalizeOptionalString = (
    value
) => {
    if (
        value === undefined
        ||
        value === null
    ) {
        return "";
    }

    return String(
        value
    ).trim();
};

// =========================================================
// PAGINATION PARAMS
// =========================================================

const appendPaginationParams = (
    params,
    {
        page,
        pageSize,
    }
) => {
    const normalizedPage =
        normalizeOptionalPositiveInteger(
            page,
            "page"
        );

    const normalizedPageSize =
        normalizeOptionalPositiveInteger(
            pageSize,
            "pageSize"
        );

    if (
        normalizedPage !== null
    ) {
        params.page =
            normalizedPage;
    }

    if (
        normalizedPageSize !== null
    ) {
        params.page_size =
            normalizedPageSize;
    }

    return params;
};

// =========================================================
// FILE
// =========================================================

const isFileObject = (
    value
) => {
    return (
        typeof File !==
            "undefined"
        &&
        value instanceof File
    );
};

// =========================================================
// STRING FIELD
// =========================================================

const appendStringField = (
    formData,
    key,
    value,
    {
        required = false,
    } = {}
) => {
    if (
        value === undefined
        ||
        value === null
    ) {
        if (
            required
        ) {
            throw new Error(
                `${key} maydoni majburiy.`
            );
        }

        return;
    }

    const normalized =
        String(
            value
        ).trim();

    if (
        required
        &&
        !normalized
    ) {
        throw new Error(
            `${key} maydoni bo‘sh bo‘lishi mumkin emas.`
        );
    }

    formData.append(
        key,
        normalized
    );
};

// =========================================================
// BUILD CREATE FORM DATA
// =========================================================

const buildCreateFormData = ({
    feedbackType,
    title,
    message,
    screenshot = null,
}) => {
    const formData =
        new FormData();

    appendStringField(
        formData,
        "feedback_type",
        feedbackType,
        {
            required: true,
        }
    );

    appendStringField(
        formData,
        "title",
        title,
        {
            required: true,
        }
    );

    appendStringField(
        formData,
        "message",
        message,
        {
            required: true,
        }
    );

    if (
        isFileObject(
            screenshot
        )
    ) {
        formData.append(
            "screenshot",
            screenshot
        );
    }

    return formData;
};

// =========================================================
// BUILD UPDATE FORM DATA
// =========================================================

const buildUpdateFormData = ({
    feedbackType,
    title,
    message,
    screenshot,
}) => {
    const formData =
        new FormData();

    appendStringField(
        formData,
        "feedback_type",
        feedbackType
    );

    appendStringField(
        formData,
        "title",
        title
    );

    appendStringField(
        formData,
        "message",
        message
    );

    if (
        isFileObject(
            screenshot
        )
    ) {
        formData.append(
            "screenshot",
            screenshot
        );
    }

    return formData;
};

// =========================================================
// LOG REQUEST ERROR
// =========================================================

const logFeedbackError = (
    label,
    error
) => {
    if (
        isFeedbackRequestCanceled(
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
// FEEDBACK SERVICE
// =========================================================

const FeedbackService = {
    // =====================================================
    // PUBLIC FEEDBACK LIST
    // =====================================================

    async getFeedbacks({
        page,
        pageSize,
        signal,
    } = {}) {
        const params = {};

        appendPaginationParams(
            params,
            {
                page,
                pageSize,
            }
        );

        try {
            const {
                data,
            } = await axios.get(
                ENDPOINTS.list,
                {
                    params,
                    signal,

                    withCredentials:
                        true,
                }
            );

            return data;
        } catch (
            error
        ) {
            logFeedbackError(
                "Feedbacklarni olishda xato:",
                error
            );

            throw error;
        }
    },

    // =====================================================
    // CREATE FEEDBACK
    // =====================================================

    async createFeedback(
        {
            feedbackType,
            title,
            message,
            screenshot = null,
        },
        {
            signal,
        } = {}
    ) {
        const formData =
            buildCreateFormData({
                feedbackType,
                title,
                message,
                screenshot,
            });

        try {
            const {
                data,
            } = await axios.post(
                ENDPOINTS.list,
                formData,
                {
                    signal,

                    withCredentials:
                        true,
                }
            );

            return data;
        } catch (
            error
        ) {
            logFeedbackError(
                "Feedback yuborishda xato:",
                error
            );

            throw error;
        }
    },

    // =====================================================
    // MY FEEDBACKS
    // =====================================================

    async getMyFeedbacks({
        status = "",
        feedbackType = "",

        // Temporary backward compatibility.
        type = "",

        page,
        pageSize,
        signal,
    } = {}) {
        const params = {};

        const normalizedStatus =
            normalizeOptionalString(
                status
            );

        const normalizedFeedbackType =
            normalizeOptionalString(
                feedbackType
                ||
                type
            );

        if (
            normalizedStatus
        ) {
            params.status =
                normalizedStatus;
        }

        if (
            normalizedFeedbackType
        ) {
            params.feedback_type =
                normalizedFeedbackType;
        }

        appendPaginationParams(
            params,
            {
                page,
                pageSize,
            }
        );

        try {
            const {
                data,
            } = await axios.get(
                ENDPOINTS.mine,
                {
                    params,
                    signal,

                    withCredentials:
                        true,
                }
            );

            return data;
        } catch (
            error
        ) {
            logFeedbackError(
                "Mening feedbacklarimni olishda xato:",
                error
            );

            throw error;
        }
    },

    // =====================================================
    // MY FEEDBACK STATS
    // =====================================================

    async getMyFeedbackStats({
        signal,
    } = {}) {
        try {
            const {
                data,
            } = await axios.get(
                ENDPOINTS.stats,
                {
                    signal,

                    withCredentials:
                        true,
                }
            );

            return data;
        } catch (
            error
        ) {
            logFeedbackError(
                "Feedback statistikasini olishda xato:",
                error
            );

            throw error;
        }
    },

    // =====================================================
    // FEEDBACK DETAIL
    // =====================================================

    async getFeedbackDetail(
        feedbackId,
        {
            signal,
        } = {}
    ) {
        const id =
            normalizeFeedbackId(
                feedbackId
            );

        try {
            const {
                data,
            } = await axios.get(
                ENDPOINTS.detail(
                    id
                ),
                {
                    signal,

                    withCredentials:
                        true,
                }
            );

            return data;
        } catch (
            error
        ) {
            logFeedbackError(
                "Feedback detailni olishda xato:",
                error
            );

            throw error;
        }
    },

    // =====================================================
    // UPDATE FEEDBACK
    // =====================================================

    async updateFeedback(
        feedbackId,
        {
            feedbackType,
            title,
            message,
            screenshot,
        },
        {
            signal,
        } = {}
    ) {
        const id =
            normalizeFeedbackId(
                feedbackId
            );

        const formData =
            buildUpdateFormData({
                feedbackType,
                title,
                message,
                screenshot,
            });

        try {
            const {
                data,
            } = await axios.patch(
                ENDPOINTS.detail(
                    id
                ),
                formData,
                {
                    signal,

                    withCredentials:
                        true,
                }
            );

            return data;
        } catch (
            error
        ) {
            logFeedbackError(
                "Feedbackni yangilashda xato:",
                error
            );

            throw error;
        }
    },

    // =====================================================
    // DELETE FEEDBACK
    // =====================================================

    async deleteFeedback(
        feedbackId,
        {
            signal,
        } = {}
    ) {
        const id =
            normalizeFeedbackId(
                feedbackId
            );

        try {
            await axios.delete(
                ENDPOINTS.detail(
                    id
                ),
                {
                    signal,

                    withCredentials:
                        true,
                }
            );

            return id;
        } catch (
            error
        ) {
            logFeedbackError(
                "Feedbackni o‘chirishda xato:",
                error
            );

            throw error;
        }
    },
};

// =========================================================
// EXPORT
// =========================================================

export default FeedbackService;