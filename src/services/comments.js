// CommentService.js
import axios from './api'

const CommentService = {
    async getComments () {
        try {
            const { data } = await axios.get('/users/comments/', { withCredentials: true }) // Bu yerda global defaults.withCredentials allaqachon mavjud
            console.log("Bu api dan kelgan malumot ", data);
            return data
        } catch (error) {
            console.error("Comments olishda xato:", error.response || error.message);
            throw error; // Xatoni yuqoriga uzatish
        }
    },
    async postComment(message) {
        const {data} = await axios.post('/users/comments/', {message})
        return data
    }
}

export default CommentService;