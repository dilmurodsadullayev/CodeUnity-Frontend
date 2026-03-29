import axios from './api'

const BadgeService = {
    async getUserBadges(username) {
        try {
            const { data } = await axios.get(`/users/${username}/badges/`);
            return data; // API dan kelayotgan { username, total_badges, badges: [] }
        } catch (error) {
            console.error("Nishonlarni olishda xato:", error.response || error.message);
            throw error;
        }
    },
}

export default BadgeService;