import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // === POSTLAR RO'YXATI UCHUN STATE ===
    post_isLoading: false, 
    posts: [],
    post_error: null,      
    
    // === YANGI POST YARATISH UCHUN ALOHIDA STATE ===
    create_isLoading: false, 
    create_error: null,      
    
    // === POST DETAL UCHUN ALOHIDA STATE ===
    postDetail: null,
    detail_isLoading: false,
    detail_error: null,
    
    // === POST SHARHLARI UCHUN ALOHIDA STATE ===
    comments: [], 
    comments_isLoading: false, 
    comments_error: null,      
};

export const postSlice  = createSlice({
    name: 'post',
    initialState,
    reducers: {
        // === POSTLAR RO'YXATINI YUKLASH REDUCERLARI ===
        getPostStart: state => {
            state.post_isLoading = true;
            state.post_error = null;
        },
        getPostSuccess: (state, actions) => {
            state.post_isLoading = false;
            state.posts = actions.payload;
            state.post_error = null;
        },
        getPostFailure: (state, action) => {
            state.post_isLoading = false;
            state.post_error = action.payload;
        },
        
        // === POST YARATISH REDUCERLARI ===
        createPostStart: state => {
            state.create_isLoading = true;
            state.create_error = null;
        },
        createPostSuccess: (state, actions) => {
            state.create_isLoading = false;
            state.create_error = null;
            state.posts = [actions.payload, ...state.posts]; 
        },
        createPostFailure: (state, action) => {
            state.create_isLoading = false;
            state.create_error = action.payload;
        },
        
        // === POST DETAL REDUCERLARI ===
        getPostDetailStart: state => {
            state.detail_isLoading = true;
            state.detail_error = null;
            state.postDetail = null;
        },
        getPostDetailSuccess: (state, actions) => {
            state.detail_isLoading = false;
            state.postDetail = actions.payload;
            state.detail_error = null;
            state.comments = []; 
        },
        getPostDetailFailure: (state, action) => {
            state.detail_isLoading = false;
            state.detail_error = action.payload;
        },
        
        // POST LIKE/UNLIKE UCHUN REDUCER 
        togglePostLikeSuccess: (state, action) => {
            if (state.postDetail) {
                state.postDetail.is_liked_by_user = action.payload.is_liked_by_user;
                state.postDetail.likes_count = action.payload.likes_count;
            }
        },
        
        // === SHARHLARNI YUKLASH REDUCERLARI ===
        getCommentsStart: state => {
            state.comments_isLoading = true;
            state.comments_error = null;
        },
        getCommentsSuccess: (state, actions) => {
            state.comments_isLoading = false;
            state.comments = actions.payload;
            state.comments_error = null;
        },
        getCommentsFailure: (state, action) => {
            state.comments_isLoading = false;
            state.comments_error = action.payload;
        },
        
        // === SHARH YARATISH REDUCERLARI ===
        addCommentSuccess: (state, action) => {
            state.comments = [action.payload, ...state.comments]; 
            if (state.postDetail) {
                state.postDetail.comments_count += 1; 
            }
        },
        addCommentFailure: (state, action) => {
            console.error("Sharh yuborishda Redux xatosi:", action.payload); 
        },
        
        // 🌟🌟🌟 YANGI: SHARHNI TAHRIRLASH REDUCERLARI 🌟🌟🌟
        updateCommentSuccess: (state, action) => {
            const updatedComment = action.payload;
            // Sharhlar ro'yxatida eski sharhni yangisi bilan almashtirish
            state.comments = state.comments.map(comment =>
                comment.id === updatedComment.id ? updatedComment : comment
            );
            // Eslatma: Agar ichki javoblar (replies) bo'lsa, bu yerda rekursiv update logic kerak bo'ladi.
        },
        updateCommentFailure: (state, action) => {
            console.error("Sharhni tahrirlashda Redux xatosi:", action.payload);
        },
        
        // 🌟🌟🌟 YANGI: SHARHNI O'CHIRISH REDUCERLARI 🌟🌟🌟
        deleteCommentSuccess: (state, action) => {
            const deletedCommentId = action.payload;
            // Sharhlar ro'yxatidan o'chirish
            state.comments = state.comments.filter(comment => 
                comment.id !== deletedCommentId
            );
            
            // Post Detail'dagi sharhlar sonini 1 taga kamaytirish
            if (state.postDetail && state.postDetail.comments_count > 0) {
                state.postDetail.comments_count -= 1; 
            }
        },
        deleteCommentFailure: (state, action) => {
            console.error("Sharhni o'chirishda Redux xatosi:", action.payload);
        },
    }
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
    togglePostLikeSuccess,
    
    getCommentsStart,
    getCommentsSuccess,
    getCommentsFailure,
    addCommentSuccess,
    addCommentFailure,

    // 🌟 YANGI COMMENT ACTIONLAR
    updateCommentSuccess,
    updateCommentFailure,
    deleteCommentSuccess,
    deleteCommentFailure

    } = postSlice.actions
    
export default postSlice.reducer