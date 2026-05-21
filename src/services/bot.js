import axios from "./api";

const getErrorMessage = (error, fallback = "Kutilmagan xatolik yuz berdi.") => {
    if (error?.response?.data) {
        if (typeof error.response.data === "string") return error.response.data;
        if (error.response.data.detail) return error.response.data.detail;
        if (error.response.data.msg) return error.response.data.msg;
        return JSON.stringify(error.response.data);
    }

    return error?.message || fallback;
};

const BotService = {
    async getTelegramProfile() {
        try {
            const { data } = await axios.get("/bot/telegram-profile/", {
                withCredentials: true,
            });

            return data;
        } catch (error) {
            console.error("Telegram profile olishda xato:", error.response || error.message);

            throw new Error(
                getErrorMessage(error, "Telegram profilni olishda xato yuz berdi.")
            );
        }
    },
};

export default BotService;