import axios from "./api";

const getErrorMessage = (error, fallback = "Kutilmagan xatolik yuz berdi.") => {
    if (error?.response?.data) {
        if (typeof error.response.data === "string") {
            return error.response.data;
        }

        if (error.response.data.detail) {
            return error.response.data.detail;
        }

        if (error.response.data.msg) {
            return error.response.data.msg;
        }

        return JSON.stringify(error.response.data);
    }

    return error?.message || fallback;
};

const UserService = {
    async getUsers(page = 1, pageSize = 10, search = "", ordering = "Reyting") {
        try {
            const params = new URLSearchParams();

            params.set("page", String(page));
            params.set("page_size", String(pageSize));
            params.set("ordering", ordering || "Reyting");

            if (search && search.trim()) {
                params.set("search", search.trim());
            }

            const { data } = await axios.get(`/users/?${params.toString()}`, {
                withCredentials: true,
            });

            return data;
        } catch (error) {
            console.error("Users olishda xato:", error.response || error.message);

            throw new Error(
                getErrorMessage(error, "Foydalanuvchilarni olishda xato yuz berdi.")
            );
        }
    },

    async getMonthlyBirthdayUsers({
        limit = 5,
        upcomingOnly = false,
        excludeMe = true,
    } = {}) {
        try {
            const params = new URLSearchParams();

            params.set("limit", String(limit));

            if (upcomingOnly) {
                params.set("upcoming_only", "1");
            }

            if (excludeMe) {
                params.set("exclude_me", "1");
            }

            const { data } = await axios.get(
                `/users/birthdays/month/?${params.toString()}`,
                {
                    withCredentials: true,
                }
            );

            return data;
        } catch (error) {
            console.error(
                "Birthday users olishda xato:",
                error.response || error.message
            );

            throw new Error(
                getErrorMessage(error, "Tug‘ilgan kunlarni olishda xato yuz berdi.")
            );
        }
    },
};

export default UserService;