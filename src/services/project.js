// CommentService.js
import axios from './api'

const ProjectService = {
    async getProjects(userId) { // page va pageSize parametrlarni qabul qilamiz
        try {
            // URL ga page va page_size query parametrlarni qo'shamiz
            const { data } = await axios.get(`/projects/${userId}/projects/`, { withCredentials: true });
            console.log("Bu Project ni malumoti ", data);
            return data; // API javobining butunini qaytaramiz (count, next, previous, results)
        } catch (error) {
            console.error("Project olishda xato:", error.response || error.message);
            throw error; // Xatoni yuqoriga uzatish
        }
    },
     async projectDetail(projectId) { // page va pageSize parametrlarni qabul qilamiz
        try {
            // URL ga page va page_size query parametrlarni qo'shamiz
            const { data } = await axios.get(`/projects/project/${projectId}/detail/`, { withCredentials: true });
            console.log("Bu Project Detail ni malumoti ", data);
            return data; // API javobining butunini qaytaramiz (count, next, previous, results)
        } catch (error) {
            console.error("Project Detail olishda xato:", error.response || error.message);
            throw error; // Xatoni yuqoriga uzatish
        }
    },
    

 
    async createProject(formDataWithImages) {
        try {
            const { data } = await axios.post('/projects/project/create/', formDataWithImages, { withCredentials: true })
            console.log("✅ formDataWithImages yuborildi:", data)
            return data
        } catch (error) {
            if (error.response) {
                console.error("❌ Server xatosi:", error.response.data, error.response.status)
            } else if (error.request) {
                console.error("❌ So‘rov yuborildi, lekin javob kelmadi:", error.request)
            } else {
                console.error("❌ So‘rov sozlanishda xato:", error.message)
            }
            throw error
        }
    },
}

export default ProjectService;