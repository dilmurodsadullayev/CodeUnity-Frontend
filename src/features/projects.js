import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    project_isLoading: false,
    projects: [],
    projectDetail: null,
    project_error: null,
    projectDetailIsLoading: false,
    projectDetailError: null
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

        getProjectDetailStart: state => {
            state.projectDetailError = true;
            state.projectDetailError = null;
        },
        getProjectDetailSuccess: (state, actions) => {
            state.projectDetailError = false;
            state.projectDetail = actions.payload;
            state.projectDetailError = null;
        },
        getProjectDetailFailure: (state, action) => {
            state.projectDetailError = false;
            state.projectDetailError = action.payload;
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
    getProjectFailure,

    getProjectDetailStart,
    getProjectDetailSuccess,
    getProjectDetailFailure

    } = projectSlice.actions
export default projectSlice.reducer