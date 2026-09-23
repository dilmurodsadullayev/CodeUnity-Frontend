// src/services/post.js

import axios from "./api";


// =========================================================
// ERROR HELPER
// =========================================================

const getErrorMessage = (
    error,
    fallback = "Kutilmagan xato yuz berdi."
) => {
    const data = error?.response?.data;

    if (typeof data === "string" && data.trim()) {
        return data;
    }

    if (data?.detail) {
        return data.detail;
    }

    if (data?.message) {
        return data.message;
    }

    if (data?.error) {
        return data.error;
    }

    if (data && typeof data === "object") {
        const firstKey = Object.keys(data)[0];

        if (firstKey) {
            const firstValue = data[firstKey];

            if (Array.isArray(firstValue) && firstValue.length > 0) {
                return String(firstValue[0]);
            }

            if (typeof firstValue === "string" && firstValue.trim()) {
                return firstValue;
            }
        }
    }

    return error?.message || fallback;
};


// =========================================================
// NORMALIZE POST PAGINATION RESPONSE
// =========================================================

const normalizePostsResponse = (data) => {
    if (Array.isArray(data)) {
        return {
            count: data.length,
            next: null,
            previous: null,
            results: data,
        };
    }

    return {
        count: Number(data?.count ?? 0),
        next: data?.next ?? null,
        previous: data?.previous ?? null,
        results: Array.isArray(data?.results) ? data.results : [],
    };
};


// =========================================================
// NORMALIZE COMMENTS RESPONSE
// =========================================================

const normalizeCommentsResponse = (data) => {
    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.results)) {
        return data.results;
    }

    return [];
};


// =========================================================
// POST SERVICE
// =========================================================

const PostService = {
    // =====================================================
    // 1. USER POSTLARINI OLISH
    // GET /api/users/<username>/posts/?page=1&page_size=5
    // =====================================================

    async getPosts(
        username,
        page = 1,
        pageSize = 5
    ) {
        if (!username) {
            throw new Error("Username topilmadi.");
        }

        try {
            const { data } = await axios.get(
                `/users/${username}/posts/`,
                {
                    params: {
                        page,
                        page_size: pageSize,
                    },
                    withCredentials: true,
                }
            );

            return normalizePostsResponse(data);
        } catch (error) {
            console.error(
                "Postlarni olishda xato:",
                error?.response || error
            );

            throw new Error(
                getErrorMessage(
                    error,
                    "Postlarni olishda xato yuz berdi."
                )
            );
        }
    },


    // =====================================================
    // 2. POST YARATISH
    // POST /api/users/post/create/
    //
    // Ikkala eski/yangi chaqiruvni qo'llab-quvvatlaydi:
    // PostService.createPost(postData)
    // PostService.createPost(username, postData)
    // =====================================================

    async createPost(
        usernameOrPostData,
        maybePostData = null
    ) {
        const postData = maybePostData ?? usernameOrPostData;

        try {
            const { data } = await axios.post(
                "/users/post/create/",
                postData,
                {
                    withCredentials: true,
                }
            );

            return data;
        } catch (error) {
            console.error(
                "Post yaratishda xato:",
                error?.response || error
            );

            throw new Error(
                getErrorMessage(
                    error,
                    "Post yaratishda xato yuz berdi."
                )
            );
        }
    },


    // =====================================================
    // 3. POST DETAIL
    // GET /api/users/<username>/post/<slug>/
    // =====================================================

    async getPostDetail(username, slug) {
        if (!username || !slug) {
            throw new Error("Post ma'lumotlari yetarli emas.");
        }

        try {
            const { data } = await axios.get(
                `/users/${username}/post/${slug}/`,
                {
                    withCredentials: true,
                }
            );

            return data;
        } catch (error) {
            console.error(
                `Post detail (${slug}) olishda xato:`,
                error?.response || error
            );

            throw new Error(
                getErrorMessage(
                    error,
                    "Post detail olishda xato yuz berdi."
                )
            );
        }
    },


    // =====================================================
    // 4. POST LIKE / UNLIKE
    // POST /api/users/post/<post_id>/like_toggle/
    // =====================================================

    async togglePostLike(postId) {
        if (!postId) {
            throw new Error("Post ID topilmadi.");
        }

        try {
            const { data } = await axios.post(
                `/users/post/${postId}/like_toggle/`,
                {},
                {
                    withCredentials: true,
                }
            );

            const likesCount = Number(
                data?.likes_count ??
                data?.like_count ??
                0
            );

            return {
                ...data,
                is_liked_by_user: Boolean(
                    data?.is_liked_by_user ??
                    data?.is_liked
                ),
                likes_count: Number.isFinite(likesCount)
                    ? Math.max(0, likesCount)
                    : 0,
            };
        } catch (error) {
            console.error(
                "Post like/unlike qilishda xato:",
                error?.response || error
            );

            throw new Error(
                getErrorMessage(
                    error,
                    "Postga like bosishda xato yuz berdi."
                )
            );
        }
    },


    // =====================================================
    // 5. POST COMMENTLARINI OLISH
    // GET /api/users/post/<post_id>/comments/
    // =====================================================

    async getPostComments(postId) {
        if (!postId) {
            throw new Error("Post ID topilmadi.");
        }

        try {
            const { data } = await axios.get(
                `/users/post/${postId}/comments/`,
                {
                    withCredentials: true,
                }
            );

            return normalizeCommentsResponse(data);
        } catch (error) {
            console.error(
                "Sharhlarni olishda xato:",
                error?.response || error
            );

            throw new Error(
                getErrorMessage(
                    error,
                    "Sharhlarni olishda xato yuz berdi."
                )
            );
        }
    },


    // =====================================================
    // 6. POST COMMENT YARATISH
    // POST /api/users/post/<post_id>/comments/
    // =====================================================

    async createPostComment(postId, commentData) {
        if (!postId) {
            throw new Error("Post ID topilmadi.");
        }

        const message = String(
            commentData?.message ?? ""
        ).trim();

        if (!message) {
            throw new Error("Sharh matnini kiriting.");
        }

        if (message.length > 255) {
            throw new Error(
                "Sharh 255 ta belgidan oshmasligi kerak."
            );
        }

        try {
            const { data } = await axios.post(
                `/users/post/${postId}/comments/`,
                {
                    ...commentData,
                    message,
                },
                {
                    withCredentials: true,
                }
            );

            return data;
        } catch (error) {
            console.error(
                "Sharh yaratishda xato:",
                error?.response || error
            );

            throw new Error(
                getErrorMessage(
                    error,
                    "Sharh yaratishda xato yuz berdi."
                )
            );
        }
    },


    // =====================================================
    // 7. POST COMMENT TAHRIRLASH
    // PATCH /api/users/post/comment/<comment_id>/edit/
    // =====================================================

    async updatePostComment(commentId, commentData) {
        if (!commentId) {
            throw new Error("Comment ID topilmadi.");
        }

        const message = String(
            commentData?.message ?? ""
        ).trim();

        if (!message) {
            throw new Error(
                "Sharh matni bo'sh bo'lishi mumkin emas."
            );
        }

        if (message.length > 255) {
            throw new Error(
                "Sharh 255 ta belgidan oshmasligi kerak."
            );
        }

        try {
            const { data } = await axios.patch(
                `/users/post/comment/${commentId}/edit/`,
                {
                    ...commentData,
                    message,
                },
                {
                    withCredentials: true,
                }
            );

            return data;
        } catch (error) {
            console.error(
                "Sharhni tahrirlashda xato:",
                error?.response || error
            );

            throw new Error(
                getErrorMessage(
                    error,
                    "Sharhni tahrirlashda xato yuz berdi."
                )
            );
        }
    },


    // =====================================================
    // 8. POST COMMENT O'CHIRISH
    // DELETE /api/users/post/comment/<comment_id>/edit/
    // =====================================================

    async deletePostComment(commentId) {
        if (!commentId) {
            throw new Error("Comment ID topilmadi.");
        }

        try {
            const response = await axios.delete(
                `/users/post/comment/${commentId}/edit/`,
                {
                    withCredentials: true,
                }
            );

            return response?.data ?? {
                detail: "Sharh o'chirildi.",
            };
        } catch (error) {
            console.error(
                "Sharhni o'chirishda xato:",
                error?.response || error
            );

            throw new Error(
                getErrorMessage(
                    error,
                    "Sharhni o'chirishda xato yuz berdi."
                )
            );
        }
    },


    // =====================================================
    // 9. POST COMMENT LIKE / UNLIKE
    // POST /api/users/post/comment/<comment_id>/like_toggle/
    // =====================================================

    async togglePostCommentLike(commentId) {
        if (!commentId) {
            throw new Error("Comment ID topilmadi.");
        }

        try {
            const { data } = await axios.post(
                `/users/post/comment/${commentId}/like_toggle/`,
                {},
                {
                    withCredentials: true,
                }
            );

            const likesCount = Number(
                data?.likes_count ??
                data?.like_count ??
                0
            );

            return {
                ...data,
                comment_id: data?.comment_id ?? Number(commentId),
                is_liked_by_user: Boolean(
                    data?.is_liked_by_user ??
                    data?.is_liked
                ),
                likes_count: Number.isFinite(likesCount)
                    ? Math.max(0, likesCount)
                    : 0,
            };
        } catch (error) {
            console.error(
                "Comment like/unlike qilishda xato:",
                error?.response || error
            );

            throw new Error(
                getErrorMessage(
                    error,
                    "Sharhga like bosishda xato yuz berdi."
                )
            );
        }
    },


    // =====================================================
    // 10. POSTNI TAHRIRLASH
    // PATCH /api/users/<username>/post/<slug>/
    // =====================================================

    async updatePost(username, slug, postData) {
        if (!username || !slug) {
            throw new Error(
                "Post ma'lumotlari yetarli emas."
            );
        }

        try {
            const { data } = await axios.patch(
                `/users/${username}/post/${slug}/`,
                postData,
                {
                    withCredentials: true,
                }
            );

            return data;
        } catch (error) {
            console.error(
                "Postni tahrirlashda xato:",
                error?.response || error
            );

            throw new Error(
                getErrorMessage(
                    error,
                    "Postni tahrirlashda xato yuz berdi."
                )
            );
        }
    },


    // =====================================================
    // 11. POSTNI O'CHIRISH
    // DELETE /api/users/<username>/post/<slug>/
    // =====================================================

    async deletePost(username, slug) {
        if (!username || !slug) {
            throw new Error(
                "Post ma'lumotlari yetarli emas."
            );
        }

        try {
            const response = await axios.delete(
                `/users/${username}/post/${slug}/`,
                {
                    withCredentials: true,
                }
            );

            return response?.data ?? true;
        } catch (error) {
            console.error(
                "Postni o'chirishda xato:",
                error?.response || error
            );

            throw new Error(
                getErrorMessage(
                    error,
                    "Postni o'chirishda xato yuz berdi."
                )
            );
        }
    },
};


export default PostService;