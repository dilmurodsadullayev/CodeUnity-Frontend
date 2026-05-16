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
    

    async getMonthlyBirthdayUsers({
        limit = 5,
        upcomingOnly = false,
        excludeMe = true,
            } = {}) {
        try {
        const params = new URLSearchParams({
            limit: limit,
        });

        if (upcomingOnly) {
            params.append("upcoming_only", "1");
        }

        if (excludeMe) {
            params.append("exclude_me", "1");
        }

        const { data } = await axios.get(
            `/users/birthdays/month/?${params.toString()}`,
            {
            withCredentials: true,
            }
        );

        console.log("Birthday users ma'lumoti:", data);

        return data;
        } catch (error) {
        console.error(
            "Birthday users olishda xato:",
            error.response || error.message
        );
        throw error;
        }
    },
}

export default UserService;