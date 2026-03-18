// CommentService.js
import axios from './api'

const ProjectService = {
    async getProjects(userId) { // page va pageSize parametrlarni qabul qilamiz
        try {
            // URL ga page va page_size query parametrlarni qo'shamiz
            const { data } = await axios.get(`/projects/${userId}/projects/`, { withCredentials: true });
            console.log("Bu Project ni malumoti ", data);
            return data; // API javobining butunini qaytaramiz (count, next, previous, results)
        } catch (error) {
            console.error("Project olishda xato:", error.response || error.message);
            throw error; // Xatoni yuqoriga uzatish
        }
    },
    async projectDetail(projectId) { // page va pageSize parametrlarni qabul qilamiz
        try {
            // URL ga page va page_size query parametrlarni qo'shamiz
            const { data } = await axios.get(`/projects/project/${projectId}/detail/`, { withCredentials: true });
            console.log("Bu Project Detail ni malumoti ", data);
            return data; // API javobining butunini qaytaramiz (count, next, previous, results)
        } catch (error) {
            console.error("Project Detail olishda xato:", error.response || error.message);
            throw error; // Xatoni yuqoriga uzatish
        }
    },
    

 
    async createProject(formDataWithImages) {
        try {
            const { data } = await axios.post('/projects/project/create/', formDataWithImages, { withCredentials: true })
            console.log("✅ formDataWithImages yuborildi:", data)
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

   async updateProject(projectId, formData) {
        try {
            // !!! AXIOS.POST O'RNIGA AXIOS.PATCH ISHLATILDI !!!
            // Tahrirlash uchun PATCH eng mos keladi, chunki u faqat qisman o'zgarishlarni yuboradi.
            const { data } = await axios.patch(`/projects/project/${projectId}/edit/`, formData, { 
                withCredentials: true,
                // FormData bilan ishlaganda Content-Type: multipart/form-data
                // bo'lishi kerak. Axios, odatda, uni avtomatik qo'yadi,
                // lekin bu yerda yuborish zarurati yo'q (server tomonda hal bo'ladi).
            });
            
            console.log("✅ Loyiha muvaffaqiyatli tahrirlandi:", data);
            return data;
            
        } catch (error) {
            if (error.response) {
                console.error("❌ Server xatosi:", error.response.data, error.response.status);
                // Agar backend xato xabarini yuborsa, uni qaytarish
                throw new Error(JSON.stringify(error.response.data)); 
            } else if (error.request) {
                console.error("❌ So‘rov yuborildi, lekin javob kelmadi:", error.request);
                throw new Error("Serverdan javob kelmadi. Tarmoq xatosi.");
            } else {
                console.error("❌ So‘rov sozlanishda xato:", error.message);
                throw new Error(error.message);
            }
        }
    },
    async deleteProject (projectId) {
        try {
            const { data } = await axios.delete(`/projects/project/${projectId}/edit/`, { withCredentials: true }) 
            console.log(data)
            return data
        } catch (error) {
            console.error("Project o'chirishda xato:", error.response || error.message);
            throw error;
        }
    },
    


   async getProjectComments(projectId) { // page va pageSize parametrlarni qabul qilamiz
        try {
            // URL ga page va page_size query parametrlarni qo'shamiz
            const { data } = await axios.get(`/projects/project/${projectId}/comments/`, { withCredentials: true });
            console.log("Bu Project Comments ni malumoti ", data);
            return data; // API javobining butunini qaytaramiz (count, next, previous, results)
        } catch (error) {
            console.error("Project Comments olishda xato:", error.response || error.message);
            throw error; // Xatoni yuqoriga uzatish
        }
    },

    async projectCommentCreate( projectId, commentData) {
        try {
            const { data } = await axios.post(`/projects/project/${projectId}/comments/`, commentData, { withCredentials: true })
            console.log("✅ Text yuborildi:", data)
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

    async projectCommentUpdate( projectId, commentId, commentData) {
        try {
            const { data } = await axios.patch(`/projects/project/${projectId}/comment/${commentId}/edit/`, commentData, { withCredentials: true })
            console.log("✅ CommentData yuborildi:", data)
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
    async projectCommentDelete (projectId, commentId) {
        try {
            const { data } = await axios.delete(`/projects/project/${projectId}/comment/${commentId}/edit/`, { withCredentials: true }) 
            console.log(data)
            return data
        } catch (error) {
            console.error("Comment o'chirishda xato:", error.response || error.message);
            throw error;
        }
    },


  
    async createCollaborationRequest(projectId, requestData) {
        try {
            const { data } = await axios.post(`/projects/project/${projectId}/collaboration-requests/`, requestData, { withCredentials: true });
            console.log("✅ Hamkorlik so'rovi yuborildi:", data);
            return data;
        } catch (error) {
            console.error("❌ Hamkorlik so'rovi yuborishda xato:", error.response?.data || error.message);
            throw error.response?.data || new Error(error.message);
        }
    },

    // 👇 YANGI: Hamkorlik so'rovlarini olish funksiyasi (GET)
    async getCollaborationRequests(projectId) {
        try {
            // Loyiha egasi uchun uning proyektiga kelgan so'rovlarni olib keladi
            const url = `/projects/project/${projectId}/collaboration-requests/`;
            const { data } = await axios.get(url, { withCredentials: true });
            console.log("✅ Hamkorlik so'rovlari yuklandi:", data);
            return data; // Bu so'rovlar ro'yxati bo'ladi
        } catch (error) {
            console.error("❌ Hamkorlik so'rovlarini yuklashda xato:", error.response?.data || error.message);
            throw error.response?.data || new Error(error.message);
        }
    },
    async getProjectCollaborators(projectId) {
        try {
            // Backendda yaratgan yangi URL
            const url = `/projects/project/${projectId}/collaborators/`; 
            const { data } = await axios.get(url, { withCredentials: true });
            console.log("✅ Loyiha hamkorlari yuklandi:", data);
            return data; 
        } catch (error) {
            console.error("❌ Loyiha hamkorlarini yuklashda xato:", error.response?.data || error.message);
            throw error.response?.data || new Error(error.message);
        }
    },


        // 👇 YANGI: So'rov statusini yangilash (Qabul qilish/Rad etish)
    async updateCollaborationRequest(requestId, newStatus) {
        try {
            const url = `/projects/project/collaboration-requests/${requestId}/`;
            // PUT orqali faqat statusni yuboramiz
            const { data } = await axios.put(url, { status: newStatus }, { withCredentials: true });
            console.log("✅ Hamkorlik so'rovi yangilandi:", data);
            return data;
        } catch (error) {
            console.error("❌ Hamkorlik so'rovini yangilashda xato:", error.response?.data || error.message);
            throw error.response?.data || new Error(error.message);
        }
    },

    // 👇 YANGI: So'rovni o'chirish
    async deleteCollaborationRequest(requestId) {
        try {
            const url = `/projects/project/collaboration-requests/${requestId}/`;
            await axios.delete(url, { withCredentials: true });
            console.log("✅ Hamkorlik so'rovi o'chirildi.");
            return true;
        } catch (error) {
            console.error("❌ Hamkorlik so'rovini o'chirishda xato:", error.response?.data || error.message);
            throw error.response?.data || new Error(error.message);
        }
    },
    async toggleProjectStar(projectId) {
        try {
           
            const { data } = await axios.post(`/projects/project/${projectId}/star_toggle/`, {}, { withCredentials: true });
            
            console.log(`✅ Loyiha Star holati yangilandi: ${data.is_starred_by_user ? 'Yoqildi' : 'O\'chirildi'}`, data);
            
            // Backenddan keladigan javobda: {detail, is_starred_by_user, stars_count} bo'ladi
            return data; 

        } catch (error) {
            if (error.response) {
                console.error("❌ Star/Unstar server xatosi:", error.response.data, error.response.status);
            } else {
                console.error("❌ Star/Unstar so‘rovda xato:", error.message);
            }
            throw error;
        }
    },

    async getAllProjects(params = {}) {
        try {
            // params ichida search, language, technology bo'lishi mumkin
            const { data } = await axios.get(`/projects/all/`, { 
                params: params, 
                withCredentials: true 
            });
            return data;
        } catch (error) {
            console.error("Global loyihalarni olishda xato:", error);
            throw error;
        }
    },

    // src/services/project.js ichiga qo'shing
    async boostProject(projectId, planId) {
        try {
            const { data } = await axios.post(`/projects/project/${projectId}/boost/`, 
                { plan_id: planId }, 
                { withCredentials: true }
            );
            return data;
        } catch (error) {
            console.error("Boost xatosi:", error.response?.data || error.message);
            throw error.response?.data || error;
        }
    },


    
    
}

export default ProjectService;