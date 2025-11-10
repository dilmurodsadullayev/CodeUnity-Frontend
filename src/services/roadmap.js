// CommentService.js
import axios from './api'

const RoadmapService = {
    async getRoadmap() { // page va pageSize parametrlarni qabul qilamiz
        try {
            // URL ga page va page_size query parametrlarni qo'shamiz
            const { data } = await axios.get(`/users/roadmap/`, { withCredentials: true });
            console.log("Bu Roadmap ni malumoti ", data);
            return data; // API javobining butunini qaytaramiz (count, next, previous, results)
        } catch (error) {
            console.error("Roadmap olishda xato:", error.response || error.message);
            throw error; // Xatoni yuqoriga uzatish
        }
    },
    
}

export default RoadmapService