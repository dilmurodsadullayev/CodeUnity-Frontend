import { createSlice } from "@reduxjs/toolkit";


// =========================================================
// INITIAL STATE
// =========================================================

const initialState = {

    // =====================================================
    // PROJECT LIST
    // =====================================================

    project_isLoading: false,

    projects: [],

    project_error: null,


    // =====================================================
    // PROJECT PAGINATION
    // =====================================================

    projectCount: 0,

    projectNext: null,

    projectPrevious: null,


    // =====================================================
    // PROJECT DETAIL
    // =====================================================

    projectDetail: null,

    projectDetailIsLoading: false,

    projectDetailError: null,


    // =====================================================
    // PROJECT COMMENTS
    // =====================================================

    project_comment_isLoading: false,

    projectComments: [],

    project_comment_error: null,


    // =====================================================
    // COLLABORATION REQUESTS
    // =====================================================

    collaborationRequestIsLoading: false,

    collaborationRequests: [],

    collaborationRequestError: null,

    isCollaborationActionLoading: false,


    // =====================================================
    // PROJECT COLLABORATORS
    // =====================================================

    collaboratorsIsLoading: false,

    collaborators: [],

    collaboratorsError: null,


    // =====================================================
    // PROJECT STAR
    // =====================================================

    isProjectStarLoading: false,

    projectStarError: null,

};


// =========================================================
// HELPERS
// =========================================================

const safeNumber = (
    value,
    fallback = 0
) => {

    const number =
        Number(
            value
        );


    return Number.isFinite(
        number
    )
        ? number
        : fallback;
};


// =========================================================
// PROJECT SLICE
// =========================================================

export const projectSlice =
    createSlice({

        name:
            "project",

        initialState,

        reducers: {


            // =================================================
            // PROJECT LIST
            // =================================================

            getProjectStart: (
                state
            ) => {

                state.project_isLoading =
                    true;

                state.project_error =
                    null;
            },


            // =================================================
            // PROJECT LIST SUCCESS
            // =================================================

            getProjectSuccess: (
                state,
                action
            ) => {

                state.project_isLoading =
                    false;

                state.project_error =
                    null;


                const payload =
                    action.payload;


                // =============================================
                // SIMPLE ARRAY
                // =============================================

                if (
                    Array.isArray(
                        payload
                    )
                ) {

                    state.projects =
                        payload;

                    state.projectCount =
                        payload.length;

                    state.projectNext =
                        null;

                    state.projectPrevious =
                        null;


                    return;
                }


                // =============================================
                // PAGINATION
                // =============================================

                if (
                    payload

                    &&

                    typeof payload ===
                        "object"

                    &&

                    Array.isArray(
                        payload.results
                    )
                ) {

                    state.projects =
                        payload.results;


                    state.projectCount =
                        safeNumber(

                            payload.count,

                            payload.results.length

                        );


                    state.projectNext =
                        payload.next
                        ??
                        null;


                    state.projectPrevious =
                        payload.previous
                        ??
                        null;


                    return;
                }


                // =============================================
                // FALLBACK
                // =============================================

                state.projects =
                    [];

                state.projectCount =
                    0;

                state.projectNext =
                    null;

                state.projectPrevious =
                    null;
            },


            getProjectFailure: (
                state,
                action
            ) => {

                state.project_isLoading =
                    false;


                state.project_error =
                    action.payload
                    ||
                    "Projectlarni olishda xatolik yuz berdi.";
            },


            // =================================================
            // ADD PROJECT
            // =================================================

            addProjectSuccess: (
                state,
                action
            ) => {

                const project =
                    action.payload;


                if (
                    !project
                    ||
                    !project.id
                ) {

                    return;
                }


                const exists =
                    state.projects.some(
                        (
                            item
                        ) =>

                            Number(
                                item.id
                            )

                            ===

                            Number(
                                project.id
                            )
                    );


                if (
                    !exists
                ) {

                    state.projects.unshift(
                        project
                    );


                    state.projectCount +=
                        1;
                }
            },


            // =================================================
            // UPDATE PROJECT
            // =================================================

            updateProjectSuccess: (
                state,
                action
            ) => {

                const project =
                    action.payload;


                if (
                    !project
                    ||
                    !project.id
                ) {

                    return;
                }


                const index =
                    state.projects.findIndex(
                        (
                            item
                        ) =>

                            Number(
                                item.id
                            )

                            ===

                            Number(
                                project.id
                            )
                    );


                if (
                    index !==
                    -1
                ) {

                    state.projects[
                        index
                    ] = {

                        ...state.projects[
                            index
                        ],

                        ...project,

                    };
                }


                if (
                    state.projectDetail

                    &&

                    Number(
                        state.projectDetail.id
                    )

                    ===

                    Number(
                        project.id
                    )
                ) {

                    state.projectDetail = {

                        ...state.projectDetail,

                        ...project,

                    };
                }
            },


            // =================================================
            // DELETE PROJECT
            // =================================================

            deleteProjectSuccess: (
                state,
                action
            ) => {

                const projectId =
                    Number(
                        action.payload
                    );


                const beforeLength =
                    state.projects.length;


                state.projects =
                    state.projects.filter(
                        (
                            project
                        ) =>

                            Number(
                                project.id
                            )

                            !==

                            projectId
                    );


                if (
                    state.projects.length
                    <
                    beforeLength
                ) {

                    state.projectCount =
                        Math.max(

                            0,

                            state.projectCount -
                            1

                        );
                }


                if (
                    state.projectDetail

                    &&

                    Number(
                        state.projectDetail.id
                    )

                    ===

                    projectId
                ) {

                    state.projectDetail =
                        null;
                }
            },


            // =================================================
            // PROJECT DETAIL
            // =================================================

            getProjectDetailStart: (
                state
            ) => {

                state.projectDetailIsLoading =
                    true;

                state.projectDetailError =
                    null;
            },


            getProjectDetailSuccess: (
                state,
                action
            ) => {

                state.projectDetailIsLoading =
                    false;


                state.projectDetail =
                    action.payload;


                state.projectDetailError =
                    null;
            },


            getProjectDetailFailure: (
                state,
                action
            ) => {

                state.projectDetailIsLoading =
                    false;


                state.projectDetailError =
                    action.payload
                    ||
                    "Project ma’lumotlarini olishda xatolik yuz berdi.";
            },


            clearProjectDetail: (
                state
            ) => {

                state.projectDetail =
                    null;


                state.projectDetailError =
                    null;


                state.projectDetailIsLoading =
                    false;
            },


            // =================================================
            // PROJECT COMMENTS
            // =================================================

            getProjectCommentStart: (
                state
            ) => {

                state.project_comment_isLoading =
                    true;


                state.project_comment_error =
                    null;
            },


            getProjectCommentSuccess: (
                state,
                action
            ) => {

                state.project_comment_isLoading =
                    false;


                state.projectComments =
                    Array.isArray(
                        action.payload
                    )

                        ? action.payload

                        : [];


                state.project_comment_error =
                    null;
            },


            getProjectCommentFailure: (
                state,
                action
            ) => {

                state.project_comment_isLoading =
                    false;


                state.project_comment_error =
                    action.payload
                    ||
                    "Commentlarni olishda xatolik yuz berdi.";
            },


            // =================================================
            // ADD COMMENT
            // =================================================

            addProjectCommentSuccess: (
                state,
                action
            ) => {

                const comment =
                    action.payload;


                if (
                    !comment
                    ||
                    !comment.id
                ) {

                    return;
                }


                state.projectComments.unshift(
                    comment
                );


                if (
                    state.projectDetail
                ) {

                    state.projectDetail
                        .comments_count =

                        safeNumber(
                            state.projectDetail
                                .comments_count
                        )

                        +

                        1;
                }
            },


            // =================================================
            // UPDATE COMMENT
            // =================================================

            updateProjectCommentSuccess: (
                state,
                action
            ) => {

                const comment =
                    action.payload;


                if (
                    !comment
                    ||
                    !comment.id
                ) {

                    return;
                }


                const index =
                    state.projectComments
                        .findIndex(
                            (
                                item
                            ) =>

                                Number(
                                    item.id
                                )

                                ===

                                Number(
                                    comment.id
                                )
                        );


                if (
                    index !==
                    -1
                ) {

                    state.projectComments[
                        index
                    ] = {

                        ...state.projectComments[
                            index
                        ],

                        ...comment,

                    };
                }
            },


            // =================================================
            // DELETE COMMENT
            // =================================================

            deleteProjectCommentSuccess: (
                state,
                action
            ) => {

                const commentId =
                    Number(
                        action.payload
                    );


                const oldLength =
                    state.projectComments
                        .length;


                state.projectComments =
                    state.projectComments
                        .filter(
                            (
                                comment
                            ) =>

                                Number(
                                    comment.id
                                )

                                !==

                                commentId
                        );


                const removed =

                    state.projectComments
                        .length

                    <

                    oldLength;


                if (
                    removed

                    &&

                    state.projectDetail
                ) {

                    state.projectDetail
                        .comments_count =

                        Math.max(

                            0,

                            safeNumber(
                                state.projectDetail
                                    .comments_count
                            )

                            -

                            1

                        );
                }
            },


            // =================================================
            // COLLABORATION REQUEST LIST
            // =================================================

            getCollaborationRequestsStart: (
                state
            ) => {

                state.collaborationRequestIsLoading =
                    true;


                state.collaborationRequestError =
                    null;
            },


            getCollaborationRequestsSuccess: (
                state,
                action
            ) => {

                state.collaborationRequestIsLoading =
                    false;


                state.collaborationRequests =
                    Array.isArray(
                        action.payload
                    )

                        ? action.payload

                        : [];


                state.collaborationRequestError =
                    null;
            },


            getCollaborationRequestsFailure: (
                state,
                action
            ) => {

                state.collaborationRequestIsLoading =
                    false;


                state.collaborationRequestError =
                    action.payload
                    ||
                    "Hamkorlik so‘rovlarini olishda xatolik yuz berdi.";
            },


            // =================================================
            // COLLABORATION ACTION
            // =================================================

            collaborationActionStart: (
                state
            ) => {

                state.isCollaborationActionLoading =
                    true;


                state.collaborationRequestError =
                    null;
            },


            collaborationActionSuccess: (
                state
            ) => {

                state.isCollaborationActionLoading =
                    false;


                state.collaborationRequestError =
                    null;
            },


            collaborationActionFailure: (
                state,
                action
            ) => {

                state.isCollaborationActionLoading =
                    false;


                state.collaborationRequestError =
                    action.payload
                    ||
                    "Hamkorlik amalida xatolik yuz berdi.";
            },


            // =================================================
            // ADD COLLAB REQUEST
            // =================================================

            addCollaborationRequestSuccess: (
                state,
                action
            ) => {

                state.isCollaborationActionLoading =
                    false;


                state.collaborationRequestError =
                    null;


                const request =
                    action.payload;


                if (
                    !request
                    ||
                    !request.id
                ) {

                    return;
                }


                const exists =
                    state.collaborationRequests
                        .some(
                            (
                                item
                            ) =>

                                Number(
                                    item.id
                                )

                                ===

                                Number(
                                    request.id
                                )
                        );


                if (
                    !exists
                ) {

                    state.collaborationRequests
                        .unshift(
                            request
                        );
                }
            },


            // =================================================
            // UPDATE COLLAB REQUEST
            // =================================================

            updateCollaborationRequestSuccess: (
                state,
                action
            ) => {

                state.isCollaborationActionLoading =
                    false;


                state.collaborationRequestError =
                    null;


                const updatedRequest =
                    action.payload;


                if (
                    !updatedRequest
                    ||
                    !updatedRequest.id
                ) {

                    return;
                }


                const index =
                    state.collaborationRequests
                        .findIndex(
                            (
                                item
                            ) =>

                                Number(
                                    item.id
                                )

                                ===

                                Number(
                                    updatedRequest.id
                                )
                        );


                if (
                    index !==
                    -1
                ) {

                    state.collaborationRequests[
                        index
                    ] = {

                        ...state.collaborationRequests[
                            index
                        ],

                        ...updatedRequest,

                    };
                }
            },


            // =================================================
            // DELETE COLLAB REQUEST
            // =================================================

            deleteCollaborationRequestSuccess: (
                state,
                action
            ) => {

                state.isCollaborationActionLoading =
                    false;


                state.collaborationRequestError =
                    null;


                const requestId =
                    Number(
                        action.payload
                    );


                state.collaborationRequests =
                    state.collaborationRequests
                        .filter(
                            (
                                item
                            ) =>

                                Number(
                                    item.id
                                )

                                !==

                                requestId
                        );
            },


            // =================================================
            // COLLABORATORS
            // =================================================

            getCollaboratorsStart: (
                state
            ) => {

                state.collaboratorsIsLoading =
                    true;


                state.collaboratorsError =
                    null;
            },


            getCollaboratorsSuccess: (
                state,
                action
            ) => {

                state.collaboratorsIsLoading =
                    false;


                state.collaborators =
                    Array.isArray(
                        action.payload
                    )

                        ? action.payload

                        : [];


                state.collaboratorsError =
                    null;
            },


            getCollaboratorsFailure: (
                state,
                action
            ) => {

                state.collaboratorsIsLoading =
                    false;


                state.collaboratorsError =
                    action.payload
                    ||
                    "Hamkorlarni olishda xatolik yuz berdi.";
            },


            // =================================================
            // PROJECT STAR
            // =================================================

            projectStarStart: (
                state
            ) => {

                state.isProjectStarLoading =
                    true;


                state.projectStarError =
                    null;
            },


            projectStarSuccess: (
                state,
                action
            ) => {

                state.isProjectStarLoading =
                    false;


                state.projectStarError =
                    null;


                const payload =
                    action.payload
                    ||
                    {};


                const projectId =
                    Number(

                        payload.projectId

                        ??

                        payload.project_id

                    );


                if (
                    !Number.isFinite(
                        projectId
                    )
                ) {

                    return;
                }


                const starsCount =
                    safeNumber(
                        payload.stars_count
                    );


                const isStarred =
                    Boolean(
                        payload
                            .is_starred_by_user
                    );


                // =============================================
                // DETAIL
                // =============================================

                if (
                    state.projectDetail

                    &&

                    Number(
                        state.projectDetail.id
                    )

                    ===

                    projectId
                ) {

                    state.projectDetail
                        .stars_count =
                        starsCount;


                    state.projectDetail
                        .is_starred_by_user =
                        isStarred;
                }


                // =============================================
                // LIST
                // =============================================

                const project =
                    state.projects.find(
                        (
                            item
                        ) =>

                            Number(
                                item.id
                            )

                            ===

                            projectId
                    );


                if (
                    project
                ) {

                    project.stars_count =
                        starsCount;


                    project.is_starred_by_user =
                        isStarred;
                }
            },


            projectStarFailure: (
                state,
                action
            ) => {

                state.isProjectStarLoading =
                    false;


                state.projectStarError =
                    action.payload
                    ||
                    "Projectga star berishda xatolik yuz berdi.";
            },


            // =================================================
            // CLEAR ERRORS
            // =================================================

            clearProjectError: (
                state
            ) => {

                state.project_error =
                    null;


                state.projectDetailError =
                    null;


                state.project_comment_error =
                    null;


                state.collaborationRequestError =
                    null;


                state.collaboratorsError =
                    null;


                state.projectStarError =
                    null;
            },


            // =================================================
            // RESET PROJECT STORE
            // =================================================

            resetProjectState:
                () => ({

                    ...initialState,

                }),

        },

    });


// =========================================================
// ACTIONS
// =========================================================

export const {

    // =====================================================
    // PROJECT LIST
    // =====================================================

    getProjectStart,

    getProjectSuccess,

    getProjectFailure,

    addProjectSuccess,

    updateProjectSuccess,

    deleteProjectSuccess,


    // =====================================================
    // PROJECT DETAIL
    // =====================================================

    getProjectDetailStart,

    getProjectDetailSuccess,

    getProjectDetailFailure,

    clearProjectDetail,


    // =====================================================
    // COMMENTS
    // =====================================================

    getProjectCommentStart,

    getProjectCommentSuccess,

    getProjectCommentFailure,

    addProjectCommentSuccess,

    updateProjectCommentSuccess,

    deleteProjectCommentSuccess,


    // =====================================================
    // COLLABORATION
    // =====================================================

    getCollaborationRequestsStart,

    getCollaborationRequestsSuccess,

    getCollaborationRequestsFailure,

    collaborationActionStart,

    collaborationActionSuccess,

    collaborationActionFailure,

    addCollaborationRequestSuccess,

    updateCollaborationRequestSuccess,

    deleteCollaborationRequestSuccess,


    // =====================================================
    // COLLABORATORS
    // =====================================================

    getCollaboratorsStart,

    getCollaboratorsSuccess,

    getCollaboratorsFailure,


    // =====================================================
    // STAR
    // =====================================================

    projectStarStart,

    projectStarSuccess,

    projectStarFailure,


    // =====================================================
    // UTILS
    // =====================================================

    clearProjectError,

    resetProjectState,

} = projectSlice.actions;


// =========================================================
// REDUCER
// =========================================================

export default projectSlice.reducer;