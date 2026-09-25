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

    // =====================================================
    // Backend oddiy array qaytarsa ham
    // frontend buzilmaydi.
    // =====================================================

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
// CLEAN SEARCH
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
    //
    // Backend oddiy array qaytarishi mumkin.
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
    //
    // JSON ham FormData ham qabul qilishi mumkin.
    //
    // Yangi stack:
    //
    // languages: [1, 2]
    // technologies: [3, 4, 5]
    //
    // Agar FormData bo‘lsa:
    //
    // formData.append("languages", 1)
    // formData.append("languages", 2)
    //
    // formData.append("technologies", 3)
    // ...
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
    //
    // PATCH ishlatamiz:
    // partial update uchun qulayroq.
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


            // Original Axios errorni
            // componentga chiqaramiz.
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
    // Markaziy katalog Problems app ichida.
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
    // Language + Technology ni bir vaqtda oladi.
    //
    // Project Create/Edit sahifada juda qulay:
    //
    // const {
    //     languages,
    //     technologies
    // } = await ProjectService.getStackCatalog()
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
    //
    // POST:
    //
    // /projects/project/<id>/comments/
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
    //
    // PATCH:
    //
    // /projects/project/<projectId>/comment/<commentId>/edit/
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
    //
    // DELETE:
    //
    // /projects/project/<projectId>/comment/<commentId>/edit/
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
    //
    // POST:
    //
    // /projects/project/<id>/collaboration-requests/
    //
    // body:
    //
    // {
    //     role: "backend",
    //     message: "..."
    // }
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
    //
    // GET:
    //
    // /projects/project/<id>/collaboration-requests/
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
    //
    // GET:
    //
    // /projects/project/<id>/collaborators/
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
    //
    // PUT:
    //
    // /projects/project/collaboration-requests/<id>/
    //
    // newStatus:
    //
    // accepted
    // rejected
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
    //
    // DELETE:
    //
    // /projects/project/collaboration-requests/<id>/
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
    // PROJECT STAR TOGGLE
    //
    // POST:
    //
    // /projects/project/<id>/star_toggle/
    //
    // Backend:
    //
    // {
    //     detail,
    //     is_starred_by_user,
    //     stars_count
    // }
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
    // ALL PROJECTS
    //
    // GLOBAL PROJECTS PAGE
    //
    // GET:
    //
    // /projects/all/
    //
    // ?page=1
    // &page_size=6
    // &search=django
    //
    // Backend response:
    //
    // {
    //     count,
    //     next,
    //     previous,
    //     results
    // }
    //
    // Search backendda:
    //
    // name
    // main_features
    // description
    // username
    // language
    // technology
    // languages
    // technologies
    //
    // bo‘yicha ishlaydi.
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


    // =====================================================
    // BOOST PROJECT
    //
    // POST:
    //
    // /projects/project/<id>/boost/
    //
    // body:
    //
    // {
    //     plan_id: "basic"
    // }
    //
    // plan:
    //
    // basic
    // premium
    // ultra
    //
    // Backend response:
    //
    // {
    //     detail,
    //     boost_expires_at,
    //     new_balance,
    //     project_id
    // }
    // =====================================================

    async boostProject(
        projectId,
        planId
    ) {

        try {

            const {
                data,
            } = await axios.post(

                `/projects/project/${projectId}/boost/`,

                {
                    plan_id:
                        planId,
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
                "Project boost qilishda xato:",
                error
            );


            throw error;
        }
    },
};


export default ProjectService;