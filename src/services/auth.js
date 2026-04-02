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
     * Social Login (Google yoki GitHub)
     * @param {string} provider - 'google' yoki 'github'
     * @param {string} code - Provayderdan qaytgan vaqtinchalik kod
     */
    async socialLogin(provider, code) {
        try {
            // Backendda ochgan endpointlarimiz: /api/auth/google/ va /api/auth/github/
            const response = await axios.post(`/users/auth/${provider}/`, { code });
            return response.data;
        } catch (error) {
            console.error(`${provider} login xatosi:`, error.response?.data || error.message);
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

    async userLogout() {
        try {
            // Serverda logout endpointi bo'lishi kerak. U JWTni bekor qilib, cookie'larni o'chiradi.
            const response = await axios.post("/users/logout/"); 
            return response.data;
        } catch (error) {
             console.error("Logout xatosi:", error.response?.data || error.message);
             // Xato bo'lsa ham frontendda holatni o'zgartirish kerak, chunki cookie o'chishi kerak
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