// CommentService.js
import axios from './api'

const UserService = {
    async getUsers(page = 1, pageSize = 8, search = '', ordering = 'Reyting') {
        try {
            // Parametrlarni yig'amiz
            const params = new URLSearchParams({
                page: page,
                page_size: pageSize,
                ordering: ordering
            });
            
            if (search) params.append('search', search);

            const { data } = await axios.get(`/users/?${params.toString()}`, { withCredentials: true });
            console.log(data)
            return data; 
        } catch (error) {
            console.error("Users olishda xato:", error.response || error.message);
            throw error;
        }
    },
    
}

export default UserService;