// Post.js
import axios from './api' // axios instansiyangizni import qiladi

const PostService = {
    // 1. POSTLAR RO'YXATINI OLISH (Profile uchun)
    async getPosts(username) { 
        try {
            // GET /users/{username}/posts/
            const { data } = await axios.get(`/users/${username}/posts/`, { withCredentials: true });
            console.log("Bu Post ni malumoti ", data);
            return data; 
        } catch (error) {
            console.error("Post olishda xato:", error.response || error.message);
            throw error; 
        }
    },
    
    // 2. POST YARATISH (Create)
    async createPost(username, postData) { 
        try {
            console.log("Service'ga kelgan ma'lumot:", postData); 
            
            // Axios'ga ikkinchi argument sifatida aynan postData obyektini beramiz
            const { data } = await axios.post(`/users/post/create/`, postData); 
            
            return data;
        } catch (error) {
            if (error.response) {
                // Serverdan kelgan xatolikni (title: required kabi) konsolga chiqarish
                console.error("Serverdan qaytgan xato:", error.response.data);
                throw new Error(JSON.stringify(error.response.data));
            }
            throw new Error("Post yaratishda kutilmagan xato.");
        }
    },
    
    // 3. POST DETALINI OLISH (Detail)
    async getPostDetail(username, slug) {
         try {
            // GET /users/{username}/post/{slug}/
            const { data } = await axios.get(`/users/${username}/post/${slug}/`, { withCredentials: true });
            console.log("Bu Post Detail malumoti ", data);
            return data;
        } catch (error) {
            console.error(`Post Detail (${slug}) olishda xato:`, error.response || error.message);
            throw error;
        }
    },
    
    // 4. LIKE/UNLIKE ALMASHTIRISH (Toggle Like)
    async togglePostLike(postId) {
        try {
            // POST /posts/post/{id}/like_toggle/ (post_id orqali)
            const { data } = await axios.post(`/posts/post/${postId}/like_toggle/`, {}, { withCredentials: true });
            console.log(`✅ Post Like holati yangilandi: ${data.is_liked_by_user ? 'Yoqildi' : 'O\'chirildi'}`, data);
            return data; 
        } catch (error) {
            console.error("Like/Unlike qilishda xato:", error.response || error.message);
            throw error;
        }
    },
    
    // 5. POST SHARH YARATISH (Create Comment)
    async createPostComment(postId, commentData) {
        try {
            // POST /posts/post/{id}/comments/
            // Bizning backend view'imizda (PostCommentListCreateAPI) URL: /post/{id}/comments/ edi.
            const { data } = await axios.post(`/users/post/${postId}/comments/`, commentData, { withCredentials: true });
            console.log("✅ Post Sharh muvaffaqiyatli yaratildi:", data);
            return data;
        } catch (error) {
            console.error("Sharh yaratishda xato:", error.response || error.message);
            throw error;
        }
    },

    // 6. 🌟 YANGI: POST SHARHLARINI OLISH (List Comments)
    async getPostComments(postId) {
        try {
            // GET /posts/post/{id}/comments/
            const { data } = await axios.get(`/users/post/${postId}/comments/`, { withCredentials: true });
            console.log("✅ Post Sharhlari yuklandi:", data);
            return data;
        } catch (error) {
            console.error("Sharhlarni yuklashda xato:", error.response || error.message);
            throw error;
        }
    },
    
    // 7. POSTNI TAHRIRLASH (Update)
    async updatePost(username, slug, postData) {
        try {
            // PATCH /users/{username}/post/{slug}/
            const { data } = await axios.patch(`/users/${username}/post/${slug}/`, postData, { withCredentials: true });
            console.log("✅ Post muvaffaqiyatli tahrirlandi:", data);
            return data;
        } catch (error) {
            if (error.response) {
                console.error("❌ Server xatosi (Post tahrirlash):", error.response.data, error.response.status);
                throw new Error(JSON.stringify(error.response.data)); 
            } else {
                throw new Error("Postni tahrirlashda kutilmagan xato.");
            }
        }
    },
    
    // 8. POSTNI O'CHIRISH (Delete)
    async deletePost(username, slug) {
        try {
            // DELETE /users/{username}/post/{slug}/
            await axios.delete(`/users/${username}/post/${slug}/`, { withCredentials: true });
            console.log("✅ Post muvaffaqiyatli o'chirildi.");
            return true;
        } catch (error) {
            console.error("Postni o'chirishda xato:", error.response || error.message);
            throw error;
        }
    },

     // 🌟🌟🌟 YANGI: SHARHNI TAHRIRLASH (Update Comment)
    async updatePostComment(commentId, commentData) {
        try {
            // PATCH /posts/comment/{commentId}/edit/
            const { data } = await axios.patch(`/users/post/comment/${commentId}/edit/`, commentData, { withCredentials: true });
            console.log(`✅ Sharh (${commentId}) muvaffaqiyatli tahrirlandi.`, data);
            return data;
        } catch (error) {
            if (error.response) {
                console.error("❌ Server xatosi (Sharh tahrirlash):", error.response.data, error.response.status);
                throw new Error(JSON.stringify(error.response.data)); 
            } else {
                throw new Error("Sharhni tahrirlashda kutilmagan xato.");
            }
        }
    },
    
    // 🌟🌟🌟 YANGI: SHARHNI O'CHIRISH (Delete Comment)
    async deletePostComment(commentId) {
        try {
            // DELETE /posts/comment/{commentId}/edit/
            await axios.delete(`/users/post/comment/${commentId}/edit/`, { withCredentials: true });
            console.log(`✅ Sharh (${commentId}) muvaffaqiyatli o'chirildi.`);
            return true;
        } catch (error) {
            console.error("Sharhni o'chirishda xato:", error.response || error.message);
            throw error;
        }
    },
}

export default PostService;