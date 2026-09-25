import {
    createSlice,
} from "@reduxjs/toolkit";


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
    //
    // /projects/all/
    //
    // {
    //     count,
    //     next,
    //     previous,
    //     results
    // }
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


    // =====================================================
    // PROJECT BOOST
    // =====================================================

    isBoosting: false,

    boostError: null,
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
            //
            // Qo‘llab-quvvatlaydi:
            //
            // 1)
            // [
            //    {...},
            //    {...}
            // ]
            //
            // 2)
            // {
            //    count: 20,
            //    next: "...",
            //    previous: null,
            //    results: [...]
            // }
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
                //
                // Profile projects endpoint uchun.
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
                // PAGINATED RESPONSE
                //
                // Global projects endpoint uchun.
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
                        Number(
                            payload.count
                            ??
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
            // ADD PROJECT TO LIST
            //
            // Project yaratgandan keyin local Redux state
            // yangilash kerak bo‘lsa ishlatish mumkin.
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
                            item.id
                            ===
                            project.id
                    );


                if (!exists) {

                    state.projects.unshift(
                        project
                    );

                    state.projectCount +=
                        1;
                }
            },


            // =================================================
            // UPDATE PROJECT IN LIST
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
                            item.id
                            ===
                            project.id
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
                    state.projectDetail.id
                    ===
                    project.id
                ) {

                    state.projectDetail = {

                        ...state.projectDetail,

                        ...project,
                    };
                }
            },


            // =================================================
            // DELETE PROJECT FROM LIST
            // =================================================

            deleteProjectSuccess: (
                state,
                action
            ) => {

                const projectId =
                    Number(
                        action.payload
                    );


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


                state.projectCount =
                    Math.max(
                        0,
                        state.projectCount -
                        1
                    );


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


            // =================================================
            // CLEAR PROJECT DETAIL
            // =================================================

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
            // COMMENT CREATE
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


                // Backend commentlarni
                // -created_at bo‘yicha qaytaradi.
                state.projectComments.unshift(
                    comment
                );


                if (
                    state.projectDetail
                ) {

                    const oldCount =
                        Number(
                            state.projectDetail
                                .comments_count
                            ??
                            0
                        );


                    state.projectDetail
                        .comments_count =
                        oldCount + 1;
                }
            },


            // =================================================
            // COMMENT UPDATE
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
                                item.id
                                ===
                                comment.id
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
            // COMMENT DELETE
            //
            // payload:
            //
            // commentId
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

                    const oldCount =
                        Number(
                            state.projectDetail
                                .comments_count
                            ??
                            0
                        );


                    state.projectDetail
                        .comments_count =
                        Math.max(
                            0,
                            oldCount - 1
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
            // ADD COLLABORATION REQUEST
            // =================================================

            addCollaborationRequestSuccess: (
                state,
                action
            ) => {

                state.isCollaborationActionLoading =
                    false;

                state.collaborationRequestError =
                    null;


                const collaborationRequest =
                    action.payload;


                if (
                    !collaborationRequest
                    ||
                    !collaborationRequest.id
                ) {
                    return;
                }


                const exists =
                    state.collaborationRequests
                        .some(
                            (
                                item
                            ) =>
                                item.id
                                ===
                                collaborationRequest.id
                        );


                if (!exists) {

                    state.collaborationRequests
                        .unshift(
                            collaborationRequest
                        );
                }
            },


            // =================================================
            // UPDATE COLLABORATION REQUEST
            //
            // accepted / rejected
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
                                item.id
                                ===
                                updatedRequest.id
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
            // DELETE COLLABORATION REQUEST
            //
            // payload:
            //
            // requestId
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


            // =================================================
            // STAR SUCCESS
            //
            // Backend:
            //
            // {
            //     detail,
            //     is_starred_by_user,
            //     stars_count
            // }
            //
            // action.payload:
            //
            // {
            //     projectId,
            //     is_starred_by_user,
            //     stars_count
            // }
            // =================================================

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
                    Number(
                        payload.stars_count
                        ??
                        0
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


                if (project) {

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
            // BOOST
            // =================================================

            boostProjectStart: (
                state
            ) => {

                state.isBoosting =
                    true;

                state.boostError =
                    null;
            },


            // =================================================
            // BOOST SUCCESS
            //
            // Backend:
            //
            // {
            //     detail,
            //     boost_expires_at,
            //     new_balance,
            //     project_id
            // }
            // =================================================

            boostProjectSuccess: (
                state,
                action
            ) => {

                state.isBoosting =
                    false;

                state.boostError =
                    null;


                const payload =
                    action.payload
                    ||
                    {};


                const projectId =
                    Number(
                        payload.project_id
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
                        .boost_expires_at =
                        payload
                            .boost_expires_at;


                    // ProjectDetailSerializer:
                    // is_boosted -> model field.
                    state.projectDetail
                        .is_boosted =
                        true;


                    // Model property.
                    state.projectDetail
                        .is_boosted_active =
                        true;
                }


                // =============================================
                // PROJECT LIST
                //
                // ProjectListSerializerda is_boosted
                // active boost qiymatini bildiradi.
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


                if (project) {

                    project.is_boosted =
                        true;

                    project.boost_expires_at =
                        payload
                            .boost_expires_at;
                }
            },


            boostProjectFailure: (
                state,
                action
            ) => {

                state.isBoosting =
                    false;

                state.boostError =
                    action.payload
                    ||
                    "Projectni boost qilishda xatolik yuz berdi.";
            },


            // =================================================
            // CLEAR PROJECT ERROR
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

                state.boostError =
                    null;
            },


            // =================================================
            // RESET PROJECT STORE
            // =================================================

            resetProjectState: () => {

                return {
                    ...initialState,
                };
            },
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
    // COLLABORATION REQUESTS
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
    // BOOST
    // =====================================================

    boostProjectStart,

    boostProjectSuccess,

    boostProjectFailure,


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