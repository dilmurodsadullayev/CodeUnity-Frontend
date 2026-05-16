// src/services/post.js
import axios from "./api";

const getErrorMessage = (error, fallback = "Kutilmagan xato yuz berdi.") => {
    if (error?.response?.data) {
        return JSON.stringify(error.response.data);
    }

    return error?.message || fallback;
};

const PostService = {
    // 1. POSTLAR RO'YXATINI OLISH
    async getPosts(username) {
        try {
            const { data } = await axios.get(`/users/${username}/posts/`, {
                withCredentials: true,
            });

            return data;
        } catch (error) {
            console.error("Post olishda xato:", error.response || error.message);
            throw new Error(getErrorMessage(error, "Postlarni olishda xato."));
        }
    },

    // 2. POST YARATISH
    async createPost(username, postData) {
        try {
            const { data } = await axios.post(`/users/post/create/`, postData, {
                withCredentials: true,
            });

            return data;
        } catch (error) {
            console.error("Post yaratishda xato:", error.response || error.message);
            throw new Error(getErrorMessage(error, "Post yaratishda xato."));
        }
    },

    // 3. POST DETALINI OLISH
    async getPostDetail(username, slug) {
        try {
            const { data } = await axios.get(`/users/${username}/post/${slug}/`, {
                withCredentials: true,
            });

            return data;
        } catch (error) {
            console.error(
                `Post Detail (${slug}) olishda xato:`,
                error.response || error.message
            );

            throw new Error(getErrorMessage(error, "Post detail olishda xato."));
        }
    },

    // 4. LIKE / UNLIKE
    async togglePostLike(postId) {
        try {
            // MUHIM:
            // Backend urls.py da:
            // path('post/<int:post_id>/like_toggle/', ...)
            // users app ostida turgani uchun endpoint: /users/post/<id>/like_toggle/
            const { data } = await axios.post(
                `/users/post/${postId}/like_toggle/`,
                {},
                { withCredentials: true }
            );

            return data;
        } catch (error) {
            console.error(
                "Like/Unlike qilishda xato:",
                error.response || error.message
            );

            throw new Error(getErrorMessage(error, "Like bosishda xato."));
        }
    },

    // 5. POST SHARH YARATISH
    async createPostComment(postId, commentData) {
        try {
            const { data } = await axios.post(
                `/users/post/${postId}/comments/`,
                commentData,
                { withCredentials: true }
            );

            return data;
        } catch (error) {
            console.error("Sharh yaratishda xato:", error.response || error.message);
            throw new Error(getErrorMessage(error, "Sharh yaratishda xato."));
        }
    },

    // 6. POST SHARHLARINI OLISH
    async getPostComments(postId) {
        try {
            const { data } = await axios.get(`/users/post/${postId}/comments/`, {
                withCredentials: true,
            });

            return data;
        } catch (error) {
            console.error(
                "Sharhlarni yuklashda xato:",
                error.response || error.message
            );

            throw new Error(getErrorMessage(error, "Sharhlarni olishda xato."));
        }
    },

    // 7. POSTNI TAHRIRLASH
    async updatePost(username, slug, postData) {
        try {
            const { data } = await axios.patch(
                `/users/${username}/post/${slug}/`,
                postData,
                { withCredentials: true }
            );

            return data;
        } catch (error) {
            console.error(
                "Postni tahrirlashda xato:",
                error.response || error.message
            );

            throw new Error(getErrorMessage(error, "Postni tahrirlashda xato."));
        }
    },

    // 8. POSTNI O'CHIRISH
    async deletePost(username, slug) {
        try {
            await axios.delete(`/users/${username}/post/${slug}/`, {
                withCredentials: true,
            });

            return true;
        } catch (error) {
            console.error("Postni o'chirishda xato:", error.response || error.message);
            throw new Error(getErrorMessage(error, "Postni o‘chirishda xato."));
        }
    },

    // 9. SHARHNI TAHRIRLASH
    async updatePostComment(commentId, commentData) {
        try {
            const { data } = await axios.patch(
                `/users/post/comment/${commentId}/edit/`,
                commentData,
                { withCredentials: true }
            );

            return data;
        } catch (error) {
            console.error(
                "Sharhni tahrirlashda xato:",
                error.response || error.message
            );

            throw new Error(getErrorMessage(error, "Sharhni tahrirlashda xato."));
        }
    },

    // 10. SHARHNI O'CHIRISH
    async deletePostComment(commentId) {
        try {
            await axios.delete(`/users/post/comment/${commentId}/edit/`, {
                withCredentials: true,
            });

            return true;
        } catch (error) {
            console.error("Sharhni o'chirishda xato:", error.response || error.message);
            throw new Error(getErrorMessage(error, "Sharhni o‘chirishda xato."));
        }
    },
};

export default PostService;