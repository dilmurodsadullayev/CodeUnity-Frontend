// src/services/problems.js

import axios from "./api";


// =========================================================
// ERROR LOGGER
// =========================================================

const logApiError = (
    title,
    error
) => {
    if (
        error?.response
    ) {
        console.error(
            `❌ ${title}:`,
            error.response.data,
            error.response.status
        );

        return;
    }


    if (
        error?.request
    ) {
        console.error(
            `❌ ${title}: server javob bermadi`,
            error.request
        );

        return;
    }


    console.error(
        `❌ ${title}:`,
        error?.message || error
    );
};


// =========================================================
// PROBLEM SERVICE
// =========================================================

const ProblemService = {

    // =====================================================
    // POPULAR PROBLEMS
    // =====================================================

    async getPopularProblemsList() {
        try {
            const {
                data,
            } = await axios.get(
                "/problems/popular-problems/",
                {
                    withCredentials: true,
                }
            );

            return data;

        } catch (error) {
            logApiError(
                "Popular problemlarni olishda xato",
                error
            );

            throw error;
        }
    },


    // =====================================================
    // ALL PROBLEMS
    // =====================================================

    async getProblemsList(
        page = 1
    ) {
        try {
            const {
                data,
            } = await axios.get(
                "/problems/",
                {
                    params: {
                        page,
                    },

                    withCredentials: true,
                }
            );

            return data;

        } catch (error) {
            logApiError(
                "Problemlarni olishda xato",
                error
            );

            throw error;
        }
    },


    // =====================================================
    // LANGUAGES
    // =====================================================

    async getLanguagesList() {
        try {
            const {
                data,
            } = await axios.get(
                "/problems/languages/",
                {
                    withCredentials: true,
                }
            );

            return Array.isArray(data)
                ? data
                : [];

        } catch (error) {
            logApiError(
                "Dasturlash tillarini olishda xato",
                error
            );

            throw error;
        }
    },


    // =====================================================
    // TECHNOLOGIES
    // =====================================================

    async getTechnologiesList() {
        try {
            const {
                data,
            } = await axios.get(
                "/problems/technologies/",
                {
                    withCredentials: true,
                }
            );

            return Array.isArray(data)
                ? data
                : [];

        } catch (error) {
            logApiError(
                "Texnologiyalarni olishda xato",
                error
            );

            throw error;
        }
    },


    // =====================================================
    // MY PROBLEMS
    // =====================================================

    async getMyProblemsList(
        page = 1
    ) {
        try {
            const {
                data,
            } = await axios.get(
                "/problems/my-problems/",
                {
                    params: {
                        page,
                    },

                    withCredentials: true,
                }
            );

            return data;

        } catch (error) {
            logApiError(
                "Mening problemlarni olishda xato",
                error
            );

            throw error;
        }
    },


    // =====================================================
    // CREATE PROBLEM
    //
    // YANGI PAYLOAD:
    //
    // {
    //     problem: "...",
    //     description: "...",
    //     code: "...",
    //     languages: [1, 2],
    //     technologies: [3, 5],
    //     is_urgent: false,
    //     deadline: null,
    //     offered_coins: 0
    // }
    // =====================================================

    async postProblem(
        problemData
    ) {
        try {
            const {
                data,
            } = await axios.post(
                "/problems/",
                problemData,
                {
                    withCredentials: true,
                }
            );

            console.log(
                "✅ Problem yaratildi:",
                data
            );

            return data;

        } catch (error) {
            logApiError(
                "Problem yaratishda xato",
                error
            );

            throw error;
        }
    },


    // =====================================================
    // PROBLEM DETAIL
    // =====================================================

    async getProblemDetail(
        id
    ) {
        try {
            const {
                data,
            } = await axios.get(
                `/problems/problem/${id}`,
                {
                    withCredentials: true,
                }
            );

            return data;

        } catch (error) {
            logApiError(
                "Problem detailni olishda xato",
                error
            );

            throw error;
        }
    },


    // =====================================================
    // UPDATE PROBLEM
    // =====================================================

    async putProblem(
        id,
        problemData
    ) {
        try {
            const {
                data,
            } = await axios.put(
                `/problems/problem/${id}`,
                problemData,
                {
                    withCredentials: true,
                }
            );

            console.log(
                "✅ Problem yangilandi:",
                data
            );

            return data;

        } catch (error) {
            logApiError(
                "Problemni yangilashda xato",
                error
            );

            throw error;
        }
    },


    // =====================================================
    // DELETE PROBLEM
    // =====================================================

    async deleteProblem(
        id
    ) {
        try {
            const {
                data,
            } = await axios.delete(
                `/problems/problem/${id}`,
                {
                    withCredentials: true,
                }
            );

            return data;

        } catch (error) {
            logApiError(
                "Problemni o‘chirishda xato",
                error
            );

            throw error;
        }
    },


    // =====================================================
    // PROBLEM STAR
    // =====================================================

    async addStar(
        problemId
    ) {
        try {
            const {
                data,
            } = await axios.post(
                `/problems/problem/${problemId}/star/`,
                {},
                {
                    withCredentials: true,
                }
            );

            return data;

        } catch (error) {
            logApiError(
                "Problemga star qo‘yishda xato",
                error
            );

            throw error;
        }
    },


    // =====================================================
    // REMOVE PROBLEM STAR
    // =====================================================

    async removeStar(
        problemId
    ) {
        try {
            const {
                data,
            } = await axios.delete(
                `/problems/problem/${problemId}/star/`,
                {
                    withCredentials: true,
                }
            );

            return data;

        } catch (error) {
            logApiError(
                "Problemdan star olib tashlashda xato",
                error
            );

            throw error;
        }
    },


    // =====================================================
    // SEARCH
    //
    // Backend endi:
    //
    // problem
    // description
    // username
    // languages__name
    // technologies__name
    //
    // bo‘yicha qidiradi.
    // =====================================================

    async getProblemSearch(
        search = "",
        page = 1
    ) {
        try {
            const {
                data,
            } = await axios.get(
                "/problems/search/",
                {
                    params: {
                        page,

                        ...(search.trim()
                            ? {
                                q: search.trim(),
                            }
                            : {}),
                    },

                    withCredentials: true,
                }
            );

            return data;

        } catch (error) {
            logApiError(
                "Problem qidirishda xato",
                error
            );

            throw error;
        }
    },


    // =====================================================
    // MY PROBLEM SEARCH
    //
    // Hozircha MyProblemsAPI alohida search endpointga
    // ega emas.
    //
    // Frontend buzilib ketmasligi uchun method qoldi,
    // lekin backendda q paramni MyProblemsAPI ga
    // qo‘shganimizdan keyin shu URL ishlaydi.
    // =====================================================

    async getMyProblemSearch(
        search = "",
        page = 1
    ) {
        try {
            const {
                data,
            } = await axios.get(
                "/problems/my-problems/",
                {
                    params: {
                        page,

                        ...(search.trim()
                            ? {
                                q: search.trim(),
                            }
                            : {}),
                    },

                    withCredentials: true,
                }
            );

            return data;

        } catch (error) {
            logApiError(
                "Mening problemlarni qidirishda xato",
                error
            );

            throw error;
        }
    },


    // =====================================================
    // ACCEPT SOLUTION
    // =====================================================

    async acceptSolution(
        problemId,
        solutionId
    ) {
        try {
            const {
                data,
            } = await axios.post(
                `/problems/problem/${problemId}/accept-solution/`,
                {
                    solution_id:
                        solutionId,
                },
                {
                    withCredentials: true,
                }
            );

            return {
                ...data,

                solution_id:
                    solutionId,
            };

        } catch (error) {
            logApiError(
                "Yechimni qabul qilishda xato",
                error
            );

            throw error;
        }
    },


    // =====================================================
    // SIMILAR PROBLEMS
    // =====================================================

    async getSimilarProblems(
        problemId
    ) {
        try {
            const {
                data,
            } = await axios.get(
                `/problems/problem/${problemId}/similar/`,
                {
                    withCredentials: true,
                }
            );

            return Array.isArray(data)
                ? data
                : [];

        } catch (error) {
            logApiError(
                "O‘xshash problemlarni olishda xato",
                error
            );

            throw error;
        }
    },
};


export default ProblemService;