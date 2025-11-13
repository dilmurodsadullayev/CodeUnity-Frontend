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


     // 👇 YANGI: Hamkorlik so'rovlari uchun state
    collaborationRequestIsLoading: false,
    collaborationRequests: [], // Yuborilgan yoki proyekt egasi uchun kelgan so'rovlar ro'yxati
    collaborationRequestError: null,
    isCollaborationActionLoading: false, // Yaratish, Qabul qilish, Rad etish, O'chirish uchun

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


        getCollaborationRequestsStart: state => {
            state.collaborationRequestIsLoading = true;
            state.collaborationRequestError = null;
        },
        getCollaborationRequestsSuccess: (state, action) => {
            state.collaborationRequestIsLoading = false;
            state.collaborationRequests = action.payload;
        },
        getCollaborationRequestsFailure: (state, action) => {
            state.collaborationRequestIsLoading = false;
            state.collaborationRequestError = action.payload;
        },

        collaborationActionStart: state => { // Yaratish/Yangilash/O'chirish uchun
            state.isCollaborationActionLoading = true;
            state.collaborationRequestError = null; // Eski xatoliklarni tozalaymiz
        },
        collaborationActionSuccess: (state, action) => {
            state.isCollaborationActionLoading = false;
            // Agar so'rov yaratilgan bo'lsa, uni ro'yxatga qo'shish (ixtiyoriy)
            // Agar yangilangan bo'lsa, ro'yxatni yangilash (ixtiyoriy)
            // Yangilash yoki o'chirishdan so'ng ro'yxatni qayta yuklash tavsiya etiladi.
        },
        collaborationActionFailure: (state, action) => {
            state.isCollaborationActionLoading = false;
            state.collaborationRequestError = action.payload;
        },

        getCollaboratorsStart: state => {
            state.collaboratorsIsLoading = true;
            state.collaboratorsError = null;
        },
        getCollaboratorsSuccess: (state, action) => {
            state.collaboratorsIsLoading = false;
            state.collaborators = action.payload; // Ma'lumotni yuklash
        },
        getCollaboratorsFailure: (state, action) => {
            state.collaboratorsIsLoading = false;
            state.collaboratorsError = action.payload;
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
    getProjectCommentFailure,


    // 👇 YANGI Actions
    getCollaborationRequestsStart,
    getCollaborationRequestsSuccess,
    getCollaborationRequestsFailure,
    collaborationActionStart,
    collaborationActionSuccess,
    collaborationActionFailure,

    getCollaboratorsStart,
    getCollaboratorsSuccess,
    getCollaboratorsFailure,



    } = projectSlice.actions
export default projectSlice.reducer