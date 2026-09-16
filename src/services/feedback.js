import axios from "./api";


// =========================================================
// FEEDBACK SERVICE
// =========================================================

const FeedbackService = {

    // =====================================================
    // PUBLIC FEEDBACK LIST
    // =====================================================

    async getFeedbacks() {
        try {
            const {
                data,
            } = await axios.get(
                "/feedback/",
                {
                    withCredentials: true,
                }
            );

            return data;

        } catch (error) {
            console.error(
                "Feedbacklarni olishda xato:",
                error.response?.data ||
                error.message
            );

            throw error;
        }
    },


    // =====================================================
    // CREATE FEEDBACK
    // =====================================================

    async createFeedback({
        feedbackType,
        title,
        message,
        screenshot = null,
    }) {
        try {

            const formData =
                new FormData();


            // ---------------------------------------------
            // REQUIRED
            // ---------------------------------------------

            formData.append(
                "feedback_type",
                feedbackType
            );

            formData.append(
                "title",
                title
            );

            formData.append(
                "message",
                message
            );


            // ---------------------------------------------
            // OPTIONAL SCREENSHOT
            // ---------------------------------------------

            if (screenshot) {
                formData.append(
                    "screenshot",
                    screenshot
                );
            }


            const {
                data,
            } = await axios.post(
                "/feedback/",
                formData,
                {
                    withCredentials: true,

                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },
                }
            );


            return data;

        } catch (error) {
            console.error(
                "Feedback yuborishda xato:",
                error.response?.data ||
                error.message
            );

            throw error;
        }
    },


    // =====================================================
    // MY FEEDBACKS
    // =====================================================

    async getMyFeedbacks({
        status = "",
        type = "",
    } = {}) {
        try {

            const params = {};


            if (status) {
                params.status =
                    status;
            }


            if (type) {
                params.type =
                    type;
            }


            const {
                data,
            } = await axios.get(
                "/feedback/mine/",
                {
                    params,

                    withCredentials: true,
                }
            );


            return data;

        } catch (error) {
            console.error(
                "Mening feedbacklarimni olishda xato:",
                error.response?.data ||
                error.message
            );

            throw error;
        }
    },


    // =====================================================
    // MY FEEDBACK STATS
    // =====================================================

    async getMyFeedbackStats() {
        try {
            const {
                data,
            } = await axios.get(
                "/feedback/mine/stats/",
                {
                    withCredentials: true,
                }
            );


            return data;

        } catch (error) {
            console.error(
                "Feedback statistikasini olishda xato:",
                error.response?.data ||
                error.message
            );

            throw error;
        }
    },


    // =====================================================
    // FEEDBACK DETAIL
    // =====================================================

    async getFeedbackDetail(
        feedbackId
    ) {
        try {
            const {
                data,
            } = await axios.get(
                `/feedback/${feedbackId}/`,
                {
                    withCredentials: true,
                }
            );


            return data;

        } catch (error) {
            console.error(
                "Feedback detailni olishda xato:",
                error.response?.data ||
                error.message
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
        }
    ) {
        try {

            const formData =
                new FormData();


            // ---------------------------------------------
            // OPTIONAL FIELDS
            // ---------------------------------------------

            if (
                feedbackType !== undefined
            ) {
                formData.append(
                    "feedback_type",
                    feedbackType
                );
            }


            if (
                title !== undefined
            ) {
                formData.append(
                    "title",
                    title
                );
            }


            if (
                message !== undefined
            ) {
                formData.append(
                    "message",
                    message
                );
            }


            if (
                screenshot instanceof File
            ) {
                formData.append(
                    "screenshot",
                    screenshot
                );
            }


            const {
                data,
            } = await axios.patch(
                `/feedback/${feedbackId}/`,
                formData,
                {
                    withCredentials: true,

                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },
                }
            );


            return data;

        } catch (error) {
            console.error(
                "Feedbackni yangilashda xato:",
                error.response?.data ||
                error.message
            );

            throw error;
        }
    },


    // =====================================================
    // DELETE FEEDBACK
    // =====================================================

    async deleteFeedback(
        feedbackId
    ) {
        try {

            await axios.delete(
                `/feedback/${feedbackId}/`,
                {
                    withCredentials: true,
                }
            );


            return true;

        } catch (error) {
            console.error(
                "Feedbackni o‘chirishda xato:",
                error.response?.data ||
                error.message
            );

            throw error;
        }
    },
};


export default FeedbackService;