// CommentService.js
import axios from './api'

const ProblemResponseService = {
    async getProblemResponse (problemId) {
        try {
            const { data } = await axios.get(`/problems/problem/${problemId}/responses`, { withCredentials: true }) // Bu yerda global defaults.withCredentials allaqachon mavjud
            return data
        } catch (error) {
            console.error("Problem Response olishda xato:", error.response || error.message);
            throw error; // Xatoni yuqoriga uzatish
        }
    },

    async postSolution(problemId, problemData) {
        try {
            const { data } = await axios.post(`/problems/problem/${problemId}/responses`, problemData, { withCredentials: true })
            console.log("✅ Solution yuborildi:", data)
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
    // ⭐ Javobga star qo‘yish
    async addStar(responseId) {
        try {
            const { data } = await axios.post(
                `/problems/responses/${responseId}/star/`,
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
    async removeStar(responseId) {
        try {
            const { data } = await axios.delete(
                `/problems/responses/${responseId}/star/`,
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

      getSolutionById: async (solutionId) => {
        try {
       
        const response = await axios.get(`/problems/solution/${solutionId}/edit`, { withCredentials: true });
        console.log("✅ Yechim olindi (getSolutionById):", response.data);
        return response.data;
        } catch (error) {
        if (error.response) {
            console.error(`❌ Server xatosi (getSolutionById ${solutionId}):`, error.response.data, error.response.status);
        } else if (error.request) {
            console.error(`❌ So‘rov yuborildi, lekin javob kelmadi (getSolutionById ${solutionId}):`, error.request);
        } else {
            console.error(`❌ So‘rov sozlanishda xato (getSolutionById ${solutionId}):`, error.message);
        }
        throw error;
        }
    },

    updateSolution: async (solutionId, updatedSolutionData) => {
        try {
        // Siz bergan URL: /problems/solution/${solutionId}/edit
        const { data } = await axios.put(`/problems/solution/${solutionId}/edit`, updatedSolutionData, { withCredentials: true });
        console.log("✅ Solution yangilandi:", data);
        return data;
        } catch (error) {
        if (error.response) {
            console.error("❌ Server xatosi (updateSolution):", error.response.data, error.response.status);
        } else if (error.request) {
            console.error("❌ So‘rov yuborildi, lekin javob kelmadi (updateSolution):", error.request);
        } else {
            console.error("❌ So‘rov sozlanishda xato (updateSolution):", error.message);
        }
        throw error;
        }
    },

    deleteSolution: async (solutionId) => {
        try {
        const response = await axios.delete(`/problems/solution/${solutionId}/edit`, { withCredentials: true }); // URLni moslashtiring
        console.log("✅ Solution o'chirildi:", response.data);
        return response.data;
        } catch (error) {
        if (error.response) {
            console.error(`❌ Server xatosi (deleteSolution ${solutionId}):`, error.response.data, error.response.status);
        } else if (error.request) {
            console.error(`❌ So‘rov yuborildi, lekin javob kelmadi (deleteSolution ${solutionId}):`, error.request);
        } else {
            console.error(`❌ So‘rov sozlanishda xato (deleteSolution ${solutionId}):`, error.message);
        }
        throw error;
        }
    },
    

  
}

export default ProblemResponseService;