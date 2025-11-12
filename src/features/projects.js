import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    project_isLoading: false,
    projects: [],
    projectDetail: null,
    project_error: null,
    projectDetailIsLoading: false,
    projectDetailError: null,

    
    project_comment_isLoading: false,
    projectComments: [],
    project_comment_error: null,

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
            state.projectDetailIsLoading = true;
            state.projectDetailError = null;
        },
        getProjectDetailSuccess: (state, actions) => {
            state.projectDetailIsLoading = false;
            state.projectDetail = actions.payload;
            state.projectDetailError = null;
        },
        getProjectDetailFailure: (state, action) => {
            state.projectDetailIsLoading = false;
            state.projectDetailError = action.payload;
        },



        getProjectCommentStart: state => {
            state.project_comment_isLoading = true;
            state.project_comment_error = null;
        },
        getProjectCommentSuccess: (state, actions) => {
            state.project_comment_isLoading = false;
            state.projectComments = actions.payload;
            state.project_comment_error = null;
        },
        getProjectCommentFailure: (state, action) => {
            state.project_comment_isLoading = false;
            state.project_comment_error = action.payload;
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
    getProjectDetailFailure,

    getProjectCommentStart,
    getProjectCommentSuccess,
    getProjectCommentFailure

    } = projectSlice.actions
export default projectSlice.reducer