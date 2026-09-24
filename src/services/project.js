// src/services/project.js

import axios from "./api";


// =========================================================
// HELPERS
// =========================================================

const isCanceledRequest = (error) => {
    return (
        error?.code === "ERR_CANCELED" ||
        error?.name === "CanceledError"
    );
};


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
        error?.response?.data ||
        error?.response ||
        error?.message ||
        error
    );
};


const normalizePagination = (
    data
) => {
    // Eski backend array qaytarsa ham
    // frontend buzilib ketmasin.
    if (
        Array.isArray(
            data
        )
    ) {
        return {
            count: data.length,
            next: null,
            previous: null,
            results: data,
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
                data?.count ??
                results.length
            ),

        next:
            data?.next ??
            null,

        previous:
            data?.previous ??
            null,

        results,
    };
};


// =========================================================
// PROJECT SERVICE
// =========================================================

const ProjectService = {

    // =====================================================
    // PROFILE PROJECTS
    //
    // Bu hozircha backendda oddiy array qaytaradi.
    // =====================================================

    async getProjects(
        username
    ) {
        try {
            const {
                data,
            } = await axios.get(
                `/projects/${username}/projects/`,
                {
                    withCredentials: true,
                }
            );


            return data;

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
    // =====================================================

    async projectDetail(
        projectId
    ) {
        try {
            const {
                data,
            } = await axios.get(
                `/projects/project/${projectId}/detail/`,
                {
                    withCredentials: true,
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
    // =====================================================

    async createProject(
        formData
    ) {
        try {
            const {
                data,
            } = await axios.post(
                "/projects/project/create/",
                formData,
                {
                    withCredentials: true,
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
    // =====================================================

    async updateProject(
        projectId,
        formData
    ) {
        try {
            const {
                data,
            } = await axios.patch(
                `/projects/project/${projectId}/edit/`,
                formData,
                {
                    withCredentials: true,
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

            /*
                Oldin:
                throw new Error(JSON.stringify(...))

                qilinayotgan edi.

                Bu global toast/error parserni buzishi mumkin.

                Endi original Axios error yuqoriga chiqadi.
            */
            throw error;
        }
    },


    // =====================================================
    // DELETE PROJECT
    // =====================================================

    async deleteProject(
        projectId
    ) {
        try {
            await axios.delete(
                `/projects/project/${projectId}/edit/`,
                {
                    withCredentials: true,
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
    // PROJECT COMMENTS
    // =====================================================

    async getProjectComments(
        projectId
    ) {
        try {
            const {
                data,
            } = await axios.get(
                `/projects/project/${projectId}/comments/`,
                {
                    withCredentials: true,
                }
            );


            return data;

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
                    withCredentials: true,
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
                    withCredentials: true,
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
                    withCredentials: true,
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
                    withCredentials: true,
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
    // COLLABORATION REQUESTS
    // =====================================================

    async getCollaborationRequests(
        projectId
    ) {
        try {
            const {
                data,
            } = await axios.get(
                `/projects/project/${projectId}/collaboration-requests/`,
                {
                    withCredentials: true,
                }
            );


            return data;

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
        projectId
    ) {
        try {
            const {
                data,
            } = await axios.get(
                `/projects/project/${projectId}/collaborators/`,
                {
                    withCredentials: true,
                }
            );


            return data;

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
                    withCredentials: true,
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
                    withCredentials: true,
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
                    withCredentials: true,
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
    // GLOBAL /projects SAHIFASI UCHUN
    //
    // Backend:
    //
    // /projects/all/
    // ?page=1
    // &page_size=6
    // &search=django
    //
    // Response:
    //
    // {
    //     count,
    //     next,
    //     previous,
    //     results
    // }
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


            const cleanSearch =
                String(
                    search || ""
                ).trim();


            if (
                cleanSearch
            ) {
                params.search =
                    cleanSearch;
            }


            const {
                data,
            } = await axios.get(
                "/projects/all/",
                {
                    params,

                    signal,

                    withCredentials: true,
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
                    withCredentials: true,
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