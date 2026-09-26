// src/services/project.js

import axios from "./api";


// =========================================================
// HELPERS
// =========================================================

const isCanceledRequest = (
    error
) => {

    return (

        error?.code ===
            "ERR_CANCELED"

        ||

        error?.name ===
            "CanceledError"

    );
};


// =========================================================
// ERROR LOGGER
// =========================================================

const logServiceError = (
    label,
    error
) => {

    if (
        isCanceledRequest(
            error
        )
    ) {

        return;
    }


    console.error(

        label,

        error?.response?.data

        ||

        error?.response

        ||

        error?.message

        ||

        error

    );
};


// =========================================================
// NORMALIZE ARRAY
// =========================================================

const normalizeArray = (
    data
) => {

    if (
        Array.isArray(
            data
        )
    ) {

        return data;
    }


    if (
        Array.isArray(
            data?.results
        )
    ) {

        return data.results;
    }


    return [];
};


// =========================================================
// NORMALIZE PAGINATION
// =========================================================

const normalizePagination = (
    data
) => {

    if (
        Array.isArray(
            data
        )
    ) {

        return {

            count:
                data.length,

            next:
                null,

            previous:
                null,

            results:
                data,

        };
    }


    const results =
        Array.isArray(
            data?.results
        )

            ? data.results

            : [];


    return {

        count:
            Number(

                data?.count

                ??

                results.length

            ),

        next:
            data?.next
            ??
            null,

        previous:
            data?.previous
            ??
            null,

        results,

    };
};


// =========================================================
// CLEAN TEXT
// =========================================================

const cleanText = (
    value
) => {

    return String(

        value

        ??

        ""

    ).trim();
};


// =========================================================
// PROJECT SERVICE
// =========================================================

const ProjectService = {


    // =====================================================
    // PROFILE PROJECTS
    //
    // GET:
    //
    // /projects/<username>/projects/
    // =====================================================

    async getProjects(
        username,
        {
            signal = undefined,
        } = {}
    ) {

        try {

            const {
                data,
            } = await axios.get(

                `/projects/${username}/projects/`,

                {
                    signal,

                    withCredentials:
                        true,
                }
            );


            return normalizeArray(
                data
            );


        } catch (
            error
        ) {

            logServiceError(
                "Profile projectlarni olishda xato:",
                error
            );


            throw error;
        }
    },


    // =====================================================
    // PROJECT DETAIL
    //
    // GET:
    //
    // /projects/project/<id>/detail/
    // =====================================================

    async projectDetail(
        projectId,
        {
            signal = undefined,
        } = {}
    ) {

        try {

            const {
                data,
            } = await axios.get(

                `/projects/project/${projectId}/detail/`,

                {
                    signal,

                    withCredentials:
                        true,
                }
            );


            return data;


        } catch (
            error
        ) {

            logServiceError(
                "Project detail olishda xato:",
                error
            );


            throw error;
        }
    },


    // =====================================================
    // CREATE PROJECT
    //
    // POST:
    //
    // /projects/project/create/
    // =====================================================

    async createProject(
        projectData
    ) {

        try {

            const {
                data,
            } = await axios.post(

                "/projects/project/create/",

                projectData,

                {
                    withCredentials:
                        true,
                }
            );


            return data;


        } catch (
            error
        ) {

            logServiceError(
                "Project yaratishda xato:",
                error
            );


            throw error;
        }
    },


    // =====================================================
    // UPDATE PROJECT
    //
    // PATCH:
    //
    // /projects/project/<id>/edit/
    // =====================================================

    async updateProject(
        projectId,
        projectData
    ) {

        try {

            const {
                data,
            } = await axios.patch(

                `/projects/project/${projectId}/edit/`,

                projectData,

                {
                    withCredentials:
                        true,
                }
            );


            return data;


        } catch (
            error
        ) {

            logServiceError(
                "Project tahrirlashda xato:",
                error
            );


            throw error;
        }
    },


    // =====================================================
    // DELETE PROJECT
    //
    // DELETE:
    //
    // /projects/project/<id>/edit/
    // =====================================================

    async deleteProject(
        projectId
    ) {

        try {

            await axios.delete(

                `/projects/project/${projectId}/edit/`,

                {
                    withCredentials:
                        true,
                }
            );


            return true;


        } catch (
            error
        ) {

            logServiceError(
                "Project o‘chirishda xato:",
                error
            );


            throw error;
        }
    },


    // =====================================================
    // LANGUAGES
    //
    // GET:
    //
    // /problems/languages/
    // =====================================================

    async getLanguagesList(
        {
            signal = undefined,
        } = {}
    ) {

        try {

            const {
                data,
            } = await axios.get(

                "/problems/languages/",

                {
                    signal,

                    withCredentials:
                        true,
                }
            );


            return normalizeArray(
                data
            );


        } catch (
            error
        ) {

            logServiceError(
                "Project uchun dasturlash tillarini olishda xato:",
                error
            );


            throw error;
        }
    },


    // =====================================================
    // TECHNOLOGIES
    //
    // GET:
    //
    // /problems/technologies/
    // =====================================================

    async getTechnologiesList(
        {
            signal = undefined,
        } = {}
    ) {

        try {

            const {
                data,
            } = await axios.get(

                "/problems/technologies/",

                {
                    signal,

                    withCredentials:
                        true,
                }
            );


            return normalizeArray(
                data
            );


        } catch (
            error
        ) {

            logServiceError(
                "Project uchun texnologiyalarni olishda xato:",
                error
            );


            throw error;
        }
    },


    // =====================================================
    // STACK CATALOG
    //
    // Language + Technology
    // =====================================================

    async getStackCatalog(
        {
            signal = undefined,
        } = {}
    ) {

        try {

            const [
                languagesResponse,
                technologiesResponse,
            ] = await Promise.all([

                axios.get(

                    "/problems/languages/",

                    {
                        signal,

                        withCredentials:
                            true,
                    }
                ),

                axios.get(

                    "/problems/technologies/",

                    {
                        signal,

                        withCredentials:
                            true,
                    }
                ),

            ]);


            return {

                languages:
                    normalizeArray(
                        languagesResponse.data
                    ),

                technologies:
                    normalizeArray(
                        technologiesResponse.data
                    ),

            };


        } catch (
            error
        ) {

            logServiceError(
                "Project stack katalogini olishda xato:",
                error
            );


            throw error;
        }
    },


    // =====================================================
    // PROJECT COMMENTS
    //
    // GET:
    //
    // /projects/project/<id>/comments/
    // =====================================================

    async getProjectComments(
        projectId,
        {
            signal = undefined,
        } = {}
    ) {

        try {

            const {
                data,
            } = await axios.get(

                `/projects/project/${projectId}/comments/`,

                {
                    signal,

                    withCredentials:
                        true,
                }
            );


            return normalizeArray(
                data
            );


        } catch (
            error
        ) {

            logServiceError(
                "Project commentlarni olishda xato:",
                error
            );


            throw error;
        }
    },


    // =====================================================
    // CREATE COMMENT
    // =====================================================

    async projectCommentCreate(
        projectId,
        commentData
    ) {

        try {

            const {
                data,
            } = await axios.post(

                `/projects/project/${projectId}/comments/`,

                commentData,

                {
                    withCredentials:
                        true,
                }
            );


            return data;


        } catch (
            error
        ) {

            logServiceError(
                "Project comment yaratishda xato:",
                error
            );


            throw error;
        }
    },


    // =====================================================
    // UPDATE COMMENT
    // =====================================================

    async projectCommentUpdate(
        projectId,
        commentId,
        commentData
    ) {

        try {

            const {
                data,
            } = await axios.patch(

                `/projects/project/${projectId}/comment/${commentId}/edit/`,

                commentData,

                {
                    withCredentials:
                        true,
                }
            );


            return data;


        } catch (
            error
        ) {

            logServiceError(
                "Project comment tahrirlashda xato:",
                error
            );


            throw error;
        }
    },


    // =====================================================
    // DELETE COMMENT
    // =====================================================

    async projectCommentDelete(
        projectId,
        commentId
    ) {

        try {

            await axios.delete(

                `/projects/project/${projectId}/comment/${commentId}/edit/`,

                {
                    withCredentials:
                        true,
                }
            );


            return true;


        } catch (
            error
        ) {

            logServiceError(
                "Project comment o‘chirishda xato:",
                error
            );


            throw error;
        }
    },


    // =====================================================
    // CREATE COLLABORATION REQUEST
    // =====================================================

    async createCollaborationRequest(
        projectId,
        requestData
    ) {

        try {

            const {
                data,
            } = await axios.post(

                `/projects/project/${projectId}/collaboration-requests/`,

                requestData,

                {
                    withCredentials:
                        true,
                }
            );


            return data;


        } catch (
            error
        ) {

            logServiceError(
                "Hamkorlik so‘rovini yuborishda xato:",
                error
            );


            throw error;
        }
    },


    // =====================================================
    // COLLABORATION REQUEST LIST
    // =====================================================

    async getCollaborationRequests(
        projectId,
        {
            signal = undefined,
        } = {}
    ) {

        try {

            const {
                data,
            } = await axios.get(

                `/projects/project/${projectId}/collaboration-requests/`,

                {
                    signal,

                    withCredentials:
                        true,
                }
            );


            return normalizeArray(
                data
            );


        } catch (
            error
        ) {

            logServiceError(
                "Hamkorlik so‘rovlarini olishda xato:",
                error
            );


            throw error;
        }
    },


    // =====================================================
    // PROJECT COLLABORATORS
    // =====================================================

    async getProjectCollaborators(
        projectId,
        {
            signal = undefined,
        } = {}
    ) {

        try {

            const {
                data,
            } = await axios.get(

                `/projects/project/${projectId}/collaborators/`,

                {
                    signal,

                    withCredentials:
                        true,
                }
            );


            return normalizeArray(
                data
            );


        } catch (
            error
        ) {

            logServiceError(
                "Project hamkorlarini olishda xato:",
                error
            );


            throw error;
        }
    },


    // =====================================================
    // UPDATE COLLABORATION REQUEST
    // =====================================================

    async updateCollaborationRequest(
        requestId,
        newStatus
    ) {

        try {

            const {
                data,
            } = await axios.put(

                `/projects/project/collaboration-requests/${requestId}/`,

                {
                    status:
                        newStatus,
                },

                {
                    withCredentials:
                        true,
                }
            );


            return data;


        } catch (
            error
        ) {

            logServiceError(
                "Hamkorlik so‘rovini yangilashda xato:",
                error
            );


            throw error;
        }
    },


    // =====================================================
    // DELETE COLLABORATION REQUEST
    // =====================================================

    async deleteCollaborationRequest(
        requestId
    ) {

        try {

            await axios.delete(

                `/projects/project/collaboration-requests/${requestId}/`,

                {
                    withCredentials:
                        true,
                }
            );


            return true;


        } catch (
            error
        ) {

            logServiceError(
                "Hamkorlik so‘rovini o‘chirishda xato:",
                error
            );


            throw error;
        }
    },


    // =====================================================
    // PROJECT STAR
    // =====================================================

    async toggleProjectStar(
        projectId
    ) {

        try {

            const {
                data,
            } = await axios.post(

                `/projects/project/${projectId}/star_toggle/`,

                {},

                {
                    withCredentials:
                        true,
                }
            );


            return data;


        } catch (
            error
        ) {

            logServiceError(
                "Project star toggle xato:",
                error
            );


            throw error;
        }
    },


    // =====================================================
    // GLOBAL PROJECTS
    //
    // GET:
    //
    // /projects/all/
    //
    // ?page=1
    // &page_size=6
    // &search=django
    // =====================================================

    async getAllProjects(
        {
            page = 1,

            pageSize = 6,

            search = "",

            signal = undefined,

            ...filters
        } = {}
    ) {

        try {

            const params = {

                ...filters,

                page,

                page_size:
                    pageSize,

            };


            const searchValue =
                cleanText(
                    search
                );


            if (
                searchValue
            ) {

                params.search =
                    searchValue;
            }


            const {
                data,
            } = await axios.get(

                "/projects/all/",

                {
                    params,

                    signal,

                    withCredentials:
                        true,
                }
            );


            return normalizePagination(
                data
            );


        } catch (
            error
        ) {

            logServiceError(
                "Global projectlarni olishda xato:",
                error
            );


            throw error;
        }
    },

};


export default ProjectService;