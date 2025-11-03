// CommentService.js (ProblemService.js deb qabul qilamiz)
import axios from './api'

const ProblemService = {
    async getPopularProblemsList () {
        try {
            const { data } = await axios.get('/problems/popular-problems/', { withCredentials: true }) 
            console.log("Bu api dan kelgan malumot ", data);
            return data
        } catch (error) {
            console.error("Problem olishda xato:", error.response || error.message);
            throw error;
        }
    },
    async getProblemsList (page=1) {
        try {
            const { data } = await axios.get(`/problems/?page=${page}`, { withCredentials: true }) 
            return data
        } catch (error) {
            console.error("Problem olishda xato:", error.response || error.message);
            throw error;
        }
    },

    async getLanguagesList () {
        try {
            const { data } = await axios.get('/problems/languages/', { withCredentials: true }) 
            console.log(data)
            return data
        } catch (error) {
            console.error("Languge olishda xato:", error.response || error.message);
            throw error;
        }
    },
    
    // ✅ Mening Muammolarim Ro'yxatini olish
    async getMyProblemsList (page=1) {
        try {
            const { data } = await axios.get(`/problems/my-problems/?page=${page}`, { withCredentials: true }) 
            return data
        } catch (error) {
            console.error("Mening Muammolarimni olishda xato:", error.response || error.message);
            throw error; 
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
            const { data } = await axios.get(`/problems/problem/${id}`, { withCredentials: true }) 
            console.log("Bu api dan kelgan malumot ", data);
            return data
        } catch (error) {
            console.error("Problem olishda xato:", error.response || error.message);
            throw error;
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

    async deleteProblem (id) {
        try {
            const { data } = await axios.delete(`/problems/problem/${id}`, { withCredentials: true }) 
            console.log(data)
            return data
        } catch (error) {
            console.error("Problemni o'chirishda xato:", error.response || error.message);
            throw error;
        }
    },

    // ✅ Barcha Muammolar uchun qidiruv
    async getProblemSearch(search = '', page = 1) {
        try {
            let url = `/problems/search/?page=${page}`;
            if (search) {
                url += `&q=${encodeURIComponent(search)}`;
            }

            const { data } = await axios.get(url, { withCredentials: true });
            return data;
        } catch (error) {
            console.error("Qidiruvda xato:", error.response || error.message);
            throw error;
        }
    },
    
    // ✅ YANGI QO'SHILDI: Mening Muammolarim orasidan qidirish
    async getMyProblemSearch(search = '', page = 1) { 
        try {
            // API manzilini my-problems uchun moslashtirish
            let url = `/problems/my-problems/search/?page=${page}`; 
            if (search) {
                url += `&q=${encodeURIComponent(search)}`; 
            }

            const { data } = await axios.get(url, { withCredentials: true });
            return data;
        } catch (error) {
            console.error("Mening Muammolarim orasidan qidiruvda xato:", error.response || error.message);
            throw error;
        }
    },

    // ⭐ YANGI: Yechimni qabul qilish metodi
    async acceptSolution(problemId, solutionId) {
        try {
            const { data } = await axios.post(
                `/problems/problem/${problemId}/accept-solution/`, // API endpoint tuzilishini taxmin qildik
                { solution_id: solutionId },
                { withCredentials: true }
            );
            console.log("✅ Yechim qabul qilindi:", data);
            // Serverdan yechim ID'sini qaytarish uchun
            return { ...data, solution_id: solutionId }; 
        } catch (error) {
            console.error("❌ Yechimni qabul qilishda xato:", error.response || error.message);
            throw error;
        }
    },
  
}

export default ProblemService;