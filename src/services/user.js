// CommentService.js
import axios from './api'

const UserService = {
    async getUsers(page = 1, pageSize = 8) { // page va pageSize parametrlarni qabul qilamiz
        try {
            // URL ga page va page_size query parametrlarni qo'shamiz
            const { data } = await axios.get(`/users/?page=${page}&page_size=${pageSize}`, { withCredentials: true });
            console.log("Bu Userni malumoti ", data.results);
            return data; // API javobining butunini qaytaramiz (count, next, previous, results)
        } catch (error) {
            console.error("Users olishda xato:", error.response || error.message);
            throw error; // Xatoni yuqoriga uzatish
        }
    },
    
}

export default UserService;