import axios from "./api"

const AuthService = {
    /**
     * Tizimga kirish (Login) amalini bajaradi.
     * @param {object} credentials - { username, password }
     * @returns {object} - API javobi
     */
    async userLogin({ username, password }) {
        try {
            // Sizning backend URL'ingizga moslashtirildi: /auth/login/
            const response = await axios.post("/users/login/", {
                username,
                password,
            })
            // Response.data quyidagi strukturaga ega bo'lishi kerak: { msg: "...", user: { ... } }
            return response.data
        } catch (error) {
             console.error("Login xatosi:", error.response?.data || error.message);
             throw error;
        }
    },

    /**
     * Yangi foydalanuvchini ro'yxatdan o'tkazish (Register) amalini bajaradi.
     * @param {object} userData - { username, email, password, password2 }
     * @returns {object} - API javobi (avtomatik kirishdan so'ng)
     */
    async userRegister({ username, email, password, password2 }) {
        try {
            // Backend URL'ingizga moslashtirildi: /auth/register/
            const response = await axios.post("/users/register/", {
                username,
                email,
                password,
                password2,
            });
            // Response.data quyidagi strukturaga ega bo'lishi kerak: { msg: "...", user: { ... } }
            return response.data;
        } catch (error) {
            console.error("Register xatosi:", error.response?.data || error.message);
            // Validatsiya xatolarini yuqoriga uzatish
            throw error; 
        }
    },

    /**
     * Joriy foydalanuvchi ma'lumotlarini olish (AccessToken orqali)
     * @returns {object} - User ma'lumotlari
     */
    async getUser() {
        try {
            const { data } = await axios.get('/users/user/') // O'zingizning to'g'ri URL'ingizni tekshiring
            return data
        } catch (error) {
             console.error("User ma'lumotlarini olish xatosi:", error.response?.data || error.message);
             throw error;
        }
    },
    
    // getProfile funksiyasi sizning loyihangizga xos.
    async getProfile() {
        try {
            const { data } = await axios.get('/user/') // O'zingizning to'g'ri URL'ingizni tekshiring
            return data
        } catch (error) {
             console.error("Profil ma'lumotlarini olish xatosi:", error.response?.data || error.message);
             throw error;
        }
    },
    
}

export default AuthService