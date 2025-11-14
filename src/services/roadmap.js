// CommentService.js (Fayl nomi RoadmapService.js bo'lishi kerak)
import axios from './api' // Bu fayl (api.js) sizning axios instance'ingizni eksport qiladi deb faraz qilamiz

const RoadmapService = {
    // ------------------------------------
    // GET (List)
    // ------------------------------------
    async getRoadmap(username) {
        try {
            const { data } = await axios.get(`/users/${username}/roadmaps/`, { withCredentials: true });
            console.log("Bu Roadmap ni malumoti ", data);
            return data;
        } catch (error) {
            console.error("Roadmap olishda xato:", error.response || error.message);
            throw error;
        }
    },

    // ------------------------------------
    // POST (Create)
    // ------------------------------------
    async createRoadmap(username, roadmapData) {
        try {
            // POST so'rovi uchun body (roadmapData) ni yuboramiz
            const { data } = await axios.post(`/users/${username}/roadmaps/`, roadmapData, { withCredentials: true });
            return data; // Yaratilgan ob'ektni qaytarish
        } catch (error) {
            console.error("Roadmap yaratishda xato:", error.response || error.message);
            throw error;
        }
    },

    // ------------------------------------
    // PUT/PATCH (Update)
    // ------------------------------------
    async updateRoadmap(username, roadmapId, roadmapData) {
        try {
            // PATCH dan foydalanish tavsiya etiladi, chunki u faqat o'zgartirilgan maydonlarni yuboradi.
            // Agar to'liq PUT so'rovi kerak bo'lsa, methodni 'put'ga o'zgartiring.
            const { data } = await axios.patch(`/users/${username}/roadmaps/${roadmapId}/`, roadmapData, { withCredentials: true });
            return data; // Yangilangan ob'ektni qaytarish
        } catch (error) {
            console.error(`Roadmap (ID: ${roadmapId}) ni yangilashda xato:`, error.response || error.message);
            throw error;
        }
    },

    // ------------------------------------
    // DELETE
    // ------------------------------------
    async deleteRoadmap(username, roadmapId) {
        try {
            // DELETE so'rovi odatda 204 No Content qaytaradi, shuning uchun 'data' bo'lmasligi mumkin.
            await axios.delete(`/users/${username}/roadmaps/${roadmapId}/`, { withCredentials: true });
            return roadmapId; // O'chirilgan IDni qaytarish (slice'da foydalanish uchun qulay)
        } catch (error) {
            console.error(`Roadmap (ID: ${roadmapId}) ni o'chirishda xato:`, error.response || error.message);
            throw error;
        }
    },

    // LIKE/UNLIKE (Toggle)
    // ------------------------------------
    async toggleLikeRoadmap(roadmapId) {
        try {
            // DRF usulida alohida endpoint orqali POST so'rovi yuboriladi
            // '/api/roadmaps/{id}/like/' yoki shunga o'xshash endpointga POST
            const { data } = await axios.post(`users/roadmaps/${roadmapId}/like/`, {}, { withCredentials: true }); 
            // API qaytargan yangilangan Roadmap ob'ektini qaytarish muhim.
            return data; 
        } catch (error) {
            console.error(`Roadmap (ID: ${roadmapId}) ni yoqtirishda/yoqtirmaslikda xato:`, error.response || error.message);
            throw error;
        }
    },
}

export default RoadmapService