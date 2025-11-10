// CommentService.js
import axios from './api'

const ProjectService = {
    async getProjects() { // page va pageSize parametrlarni qabul qilamiz
        try {
            // URL ga page va page_size query parametrlarni qo'shamiz
            const { data } = await axios.get(`/projects/`, { withCredentials: true });
            console.log("Bu Project ni malumoti ", data);
            return data; // API javobining butunini qaytaramiz (count, next, previous, results)
        } catch (error) {
            console.error("Project olishda xato:", error.response || error.message);
            throw error; // Xatoni yuqoriga uzatish
        }
    },
    
}

export default ProjectService;