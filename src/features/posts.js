import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // POSTLAR RO'YXATI
    post_isLoading: false,
    posts: [],
    post_error: null,

    // POST YARATISH
    create_isLoading: false,
    create_error: null,

    // POST DETAIL
    postDetail: null,
    detail_isLoading: false,
    detail_error: null,

    // LIKE
    like_isLoading: false,
    like_error: null,

    // POST SHARHLARI
    comments: [],
    comments_isLoading: false,
    comments_error: null,
};

export const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        // POSTLAR RO'YXATINI YUKLASH
        getPostStart: (state) => {
            state.post_isLoading = true;
            state.post_error = null;
        },

        getPostSuccess: (state, action) => {
            state.post_isLoading = false;
            state.posts = Array.isArray(action.payload) ? action.payload : [];
            state.post_error = null;
        },

        getPostFailure: (state, action) => {
            state.post_isLoading = false;
            state.post_error = action.payload || "Postlarni olishda xato yuz berdi.";
        },

        // POST YARATISH
        createPostStart: (state) => {
            state.create_isLoading = true;
            state.create_error = null;
        },

        createPostSuccess: (state, action) => {
            state.create_isLoading = false;
            state.create_error = null;

            const currentPosts = Array.isArray(state.posts) ? state.posts : [];
            state.posts = [action.payload, ...currentPosts].filter(Boolean);
        },

        createPostFailure: (state, action) => {
            state.create_isLoading = false;
            state.create_error = action.payload || "Post yaratishda xato yuz berdi.";
        },

        // POST DETAIL
        getPostDetailStart: (state) => {
            state.detail_isLoading = true;
            state.detail_error = null;
            state.postDetail = null;

            // Bu yerda tozalansa bo'ladi, chunki yangi detail yuklanyapti
            state.comments = [];
            state.comments_error = null;
        },

        getPostDetailSuccess: (state, action) => {
            state.detail_isLoading = false;
            state.postDetail = action.payload;
            state.detail_error = null;

            // MUHIM:
            // Bu yerda comments = [] qilmaymiz.
            // Aks holda like bosganda detail update bo'lsa commentlar o'chib ko'rinadi.
        },

        getPostDetailFailure: (state, action) => {
            state.detail_isLoading = false;
            state.detail_error = action.payload || "Post detail olishda xato yuz berdi.";
        },

        // LIKE / UNLIKE
        togglePostLikeStart: (state) => {
            state.like_isLoading = true;
            state.like_error = null;
        },

        togglePostLikeSuccess: (state, action) => {
            state.like_isLoading = false;
            state.like_error = null;

            if (state.postDetail) {
                state.postDetail.is_liked_by_user = Boolean(
                    action.payload?.is_liked_by_user
                );

                state.postDetail.likes_count = action.payload?.likes_count ?? 0;
            }

            // Profile postlar ro'yxatida ham shu post bo'lsa yangilab qo'yamiz
            const postId = state.postDetail?.id || action.payload?.post_id;

            if (postId && Array.isArray(state.posts)) {
                state.posts = state.posts.map((post) => {
                    if (post.id !== postId) return post;

                    return {
                        ...post,
                        is_liked_by_user: Boolean(action.payload?.is_liked_by_user),
                        likes_count: action.payload?.likes_count ?? post.likes_count,
                    };
                });
            }
        },

        togglePostLikeFailure: (state, action) => {
            state.like_isLoading = false;
            state.like_error = action.payload || "Like bosishda xato yuz berdi.";
        },

        // OPTIMISTIC DETAIL UPDATE
        updatePostDetailLocal: (state, action) => {
            if (state.postDetail) {
                state.postDetail = {
                    ...state.postDetail,
                    ...action.payload,
                };
            }
        },

        // SHARHLARNI YUKLASH
        getCommentsStart: (state) => {
            state.comments_isLoading = true;
            state.comments_error = null;
        },

        getCommentsSuccess: (state, action) => {
            state.comments_isLoading = false;
            state.comments = Array.isArray(action.payload) ? action.payload : [];
            state.comments_error = null;
        },

        getCommentsFailure: (state, action) => {
            state.comments_isLoading = false;
            state.comments_error =
                action.payload || "Sharhlarni yuklashda xato yuz berdi.";
        },

        // SHARH YARATISH
        addCommentSuccess: (state, action) => {
            const currentComments = Array.isArray(state.comments)
                ? state.comments
                : [];

            state.comments = [action.payload, ...currentComments].filter(Boolean);

            if (state.postDetail) {
                state.postDetail.comments_count =
                    Number(state.postDetail.comments_count || 0) + 1;
            }
        },

        addCommentFailure: (state, action) => {
            state.comments_error =
                action.payload || "Sharh yuborishda xato yuz berdi.";
        },

        // SHARH TAHRIRLASH
        updateCommentSuccess: (state, action) => {
            const updatedComment = action.payload;

            if (!updatedComment?.id) return;

            state.comments = state.comments.map((comment) =>
                comment.id === updatedComment.id ? updatedComment : comment
            );
        },

        updateCommentFailure: (state, action) => {
            state.comments_error =
                action.payload || "Sharhni tahrirlashda xato yuz berdi.";
        },

        // SHARH O'CHIRISH
        deleteCommentSuccess: (state, action) => {
            const deletedCommentId = action.payload;

            state.comments = state.comments.filter(
                (comment) => comment.id !== deletedCommentId
            );

            if (
                state.postDetail &&
                Number(state.postDetail.comments_count || 0) > 0
            ) {
                state.postDetail.comments_count =
                    Number(state.postDetail.comments_count || 0) - 1;
            }
        },

        deleteCommentFailure: (state, action) => {
            state.comments_error =
                action.payload || "Sharhni o‘chirishda xato yuz berdi.";
        },

        clearPostErrors: (state) => {
            state.post_error = null;
            state.create_error = null;
            state.detail_error = null;
            state.like_error = null;
            state.comments_error = null;
        },
    },
});

export const {
    getPostStart,
    getPostSuccess,
    getPostFailure,

    createPostStart,
    createPostSuccess,
    createPostFailure,

    getPostDetailStart,
    getPostDetailSuccess,
    getPostDetailFailure,

    togglePostLikeStart,
    togglePostLikeSuccess,
    togglePostLikeFailure,
    updatePostDetailLocal,

    getCommentsStart,
    getCommentsSuccess,
    getCommentsFailure,

    addCommentSuccess,
    addCommentFailure,

    updateCommentSuccess,
    updateCommentFailure,

    deleteCommentSuccess,
    deleteCommentFailure,

    clearPostErrors,
} = postSlice.actions;

export default postSlice.reducer;