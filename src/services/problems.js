// CommentService.js
import axios from './api'

const ProblemService = {
    async getPopularProblemsList () {
        try {
            const { data } = await axios.get('/problems/popular-problems/', { withCredentials: true }) // Bu yerda global defaults.withCredentials allaqachon mavjud
            console.log("Bu api dan kelgan malumot ", data);
            return data
        } catch (error) {
            console.error("Problem olishda xato:", error.response || error.message);
            throw error; // Xatoni yuqoriga uzatish
        }
    },
    async getProblemsList (page=1) {
        try {
            const { data } = await axios.get(`/problems/?page=${page}`, { withCredentials: true }) // Bu yerda global defaults.withCredentials allaqachon mavjud
            return data
        } catch (error) {
            console.error("Problem olishda xato:", error.response || error.message);
            throw error; // Xatoni yuqoriga uzatish
        }
    },

    async getLanguagesList () {
        try {
            const { data } = await axios.get('/problems/languages/', { withCredentials: true }) // Bu yerda global defaults.withCredentials allaqachon mavjud
            console.log(data)
            return data
        } catch (error) {
            console.error("Languge olishda xato:", error.response || error.message);
            throw error; // Xatoni yuqoriga uzatish
        }
    },
    async postProblem(problemData) {
        try {
            const { data } = await axios.post('/problems/', problemData, { withCredentials: true })
            console.log("✅ Problem yuborildi:", data)
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

    async getProblemDetail (id) {
        try {
            const { data } = await axios.get(`/problems/problem/${id}`, { withCredentials: true }) // Bu yerda global defaults.withCredentials allaqachon mavjud
            console.log("Bu api dan kelgan malumot ", data);
            return data
        } catch (error) {
            console.error("Problem olishda xato:", error.response || error.message);
            throw error; // Xatoni yuqoriga uzatish
        }
    },

    // ⭐ Javobga star qo‘yish
    async addStar(problemId) {
        try {
            const { data } = await axios.post(
                `/problems/problem/${problemId}/star/`,
                {},
                { withCredentials: true }
            )
            console.log("✅ Star qo‘yildi:", data)
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

    // ❌ Star olib tashlash
    async removeStar(problemId) {
        try {
            const { data } = await axios.delete(
                `/problems/problem/${problemId}/star/`,
                { withCredentials: true }
            )
            console.log("✅ Star olib tashlandi:", data)
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
    async putProblem(id, problemData) {
        const { data } = await axios.put(`/problems/problem/${id}`, problemData, { withCredentials: true })
        try {
            console.log("✅ Problem yuborildi:", data)
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

    // deleteProblem: async (id) => { // YANGI: Muammoni o'chirish metodi
    //     const response = await axios.delete(`/problems/${id}`);
    //     return response.data;
    // },
    async deleteProblem (id) {
        try {
            const { data } = await axios.delete(`/problems/problem/${id}`, { withCredentials: true }) // Bu yerda global defaults.withCredentials allaqachon mavjud
            console.log(data)
            return data
        } catch (error) {
            console.error("Problemni o'chirishda xato:", error.response || error.message);
            throw error; // Xatoni yuqoriga uzatish
        }
    },


    async getProblemSearch(search = '', page = 1) { // page parametrini qo'shdim
        try {
            let url = `/problems/search/?page=${page}`; // Sahifalanish parametrini birinchi o'ringa qo'yamiz
            if (search) {
                url += `&q=${encodeURIComponent(search)}`; // Agar qidiruv so'zi bo'lsa, 'q' parametrini qo'shamiz
            }

            const { data } = await axios.get(url, { withCredentials: true });
            return data;
        } catch (error) {
            console.error("Qidiruvda xato:", error.response || error.message);
            throw error;
        }
    },

  
}

export default ProblemService;