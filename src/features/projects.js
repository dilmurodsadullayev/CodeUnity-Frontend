import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    project_isLoading: false,
    projects: [],
    project_error: null
}

export const projectSlice  = createSlice({
    name: 'project',
    initialState,
    reducers: {
        getProjectStart: state => {
            state.project_isLoading = true
        },
        getProjectSuccess: (state, actions) => {
            state.project_isLoading = false
            state.projects = actions.payload
        },
        getProjectFailure: (state, action) => {
            state.project_error = action.payload
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
    
    getProjectStart,
    getProjectSuccess,
    getProjectFailure

    } = projectSlice.actions
export default projectSlice.reducer