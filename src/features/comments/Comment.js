import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    comments: [],
    error: null
}

export const commentSlice  = createSlice({
    name: 'comment',
    initialState,
    reducers: {
        getCommentStart: state => {
            state.isLoading = true
        },
        getCommentSuccess: (state, actions) => {
            state.isLoading = false
            state.comments = actions.payload
        },
        getCommentFailure: (state, action) => {
            state.error = action.payload
        },
        postCommentStart: state => {
            state.isLoading = true
        },
        postCommentSuccess: (state, action) => {
            state.isLoading = false;
            // Yangi kommentni ro'yxatning boshiga qo'shish (unshift) 
            // yoki oxiriga qo'shish (push)
            state.comments.unshift(action.payload); 
        },
        postCommentFailure: (state) => {
            state.isLoading = false
            state.error = 'Error'   
        },
    }
})

export const {getCommentStart,getCommentFailure, getCommentSuccess, postCommentFailure, postCommentStart, postCommentSuccess} = commentSlice.actions
export default commentSlice.reducer