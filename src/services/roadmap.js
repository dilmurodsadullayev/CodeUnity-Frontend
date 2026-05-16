import axios from "./api";

const getErrorMessage = (error, fallback = "Kutilmagan xato yuz berdi.") => {
    if (error?.response?.data) {
        return JSON.stringify(error.response.data);
    }

    return error?.message || fallback;
};

const RoadmapService = {
    // =========================
    // GET ROADMAPS
    // =========================
    async getRoadmap(username) {
        try {
            const { data } = await axios.get(`/users/${username}/roadmaps/`, {
                withCredentials: true,
            });

            return data;
        } catch (error) {
            console.error(
                "Roadmap olishda xato:",
                error.response || error.message
            );

            throw new Error(
                getErrorMessage(error, "Roadmaplarni olishda xato yuz berdi.")
            );
        }
    },

    // Alias: agar boshqa joyda getRoadmaps deb chaqirilgan bo‘lsa ham ishlaydi
    async getRoadmaps(username) {
        return this.getRoadmap(username);
    },

    // =========================
    // CREATE ROADMAP
    // =========================
    async createRoadmap(username, roadmapData) {
        try {
            const { data } = await axios.post(
                `/users/${username}/roadmaps/`,
                roadmapData,
                {
                    withCredentials: true,
                }
            );

            return data;
        } catch (error) {
            console.error(
                "Roadmap yaratishda xato:",
                error.response || error.message
            );

            throw new Error(
                getErrorMessage(error, "Roadmap yaratishda xato yuz berdi.")
            );
        }
    },

    // =========================
    // UPDATE ROADMAP
    // =========================
    async updateRoadmap(username, roadmapId, roadmapData) {
        try {
            const { data } = await axios.patch(
                `/users/${username}/roadmaps/${roadmapId}/`,
                roadmapData,
                {
                    withCredentials: true,
                }
            );

            return data;
        } catch (error) {
            console.error(
                `Roadmap ID ${roadmapId} tahrirlashda xato:`,
                error.response || error.message
            );

            throw new Error(
                getErrorMessage(error, "Roadmap tahrirlashda xato yuz berdi.")
            );
        }
    },

    // =========================
    // DELETE ROADMAP
    // =========================
    async deleteRoadmap(username, roadmapId) {
        try {
            await axios.delete(`/users/${username}/roadmaps/${roadmapId}/`, {
                withCredentials: true,
            });

            return roadmapId;
        } catch (error) {
            console.error(
                `Roadmap ID ${roadmapId} o‘chirishda xato:`,
                error.response || error.message
            );

            throw new Error(
                getErrorMessage(error, "Roadmap o‘chirishda xato yuz berdi.")
            );
        }
    },

    // =========================
    // LIKE / UNLIKE ROADMAP
    // =========================
    async toggleLikeRoadmap(roadmapId) {
        try {
            // MUHIM:
            // urls.py:
            // path('roadmaps/<int:pk>/like/', RoadmapLikeToggleAPI.as_view())
            //
            // users app /api/users/ ostida bo‘lsa:
            // /users/roadmaps/<id>/like/
            const { data } = await axios.post(
                `/users/roadmaps/${roadmapId}/like/`,
                {},
                {
                    withCredentials: true,
                }
            );

            return data;
        } catch (error) {
            console.error(
                `Roadmap ID ${roadmapId} like/unlike xato:`,
                error.response || error.message
            );

            throw new Error(
                getErrorMessage(error, "Roadmap like bosishda xato yuz berdi.")
            );
        }
    },
};

export default RoadmapService;