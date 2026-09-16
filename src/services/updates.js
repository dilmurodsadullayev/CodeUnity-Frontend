import axios from "./api";


// =========================================================
// UPDATE SERVICE
// =========================================================

const UpdateService = {

    // =====================================================
    // GET SITE UPDATES
    // =====================================================

    async getUpdates(
        limit = 6
    ) {
        try {
            const {
                data,
            } = await axios.get(
                "/updates/",
                {
                    params: {
                        limit,
                    },

                    withCredentials: true,
                }
            );


            return data;

        } catch (
            error
        ) {
            console.error(
                "Sayt yangiliklarini olishda xato:",
                error?.response?.data ||
                error?.message ||
                error
            );


            throw error;
        }
    },


    // =====================================================
    // LIKE / UNLIKE
    // =====================================================

    async toggleLike(
        updateId
    ) {
        try {
            const {
                data,
            } = await axios.post(
                `/updates/${updateId}/like/`,
                {},
                {
                    withCredentials: true,
                }
            );


            return data;

        } catch (
            error
        ) {
            console.error(
                "Update like qilishda xato:",
                error?.response?.data ||
                error?.message ||
                error
            );


            throw error;
        }
    },

};


export default UpdateService;