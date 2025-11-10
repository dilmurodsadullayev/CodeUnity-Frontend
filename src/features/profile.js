import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    profile: null,
    error: null
}

export const profileSlice  = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        getProfileStart: state => {
            state.isLoading = true
        },
        getProfileSuccess: (state, actions) => {
            state.isLoading = false
            state.profile = actions.payload
        },
        getProfileFailure: (state, action) => {
            state.error = action.payload
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
    
    getProfileStart,
    getProfileSuccess,
    getProfileFailure

    } = profileSlice.actions
export default profileSlice.reducer