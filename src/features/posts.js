import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    post_isLoading: false,
    posts: [],
    post_error: null
}

export const postSlice  = createSlice({
    name: 'post',
    initialState,
    reducers: {
        getPostStart: state => {
            state.post_isLoading = true
        },
        getPostSuccess: (state, actions) => {
            state.post_isLoading = false
            state.posts = actions.payload
        },
        getPostFailure: (state, action) => {
            state.post_error = action.payload
        },
        // postCommentStart: state => {
        //     state.isLoading = true
        // },
        // postCommentSuccess: (state) => {
        //     state.isLoading = false
        // },
        // postCommentFailure: (state) => {
        //     state.isLoading = false
        //     state.error = 'Error'   
        // },
    }
})

export const {
    
    getPostStart,
    getPostSuccess,
    getPostFailure

    } = postSlice.actions
export default postSlice.reducer