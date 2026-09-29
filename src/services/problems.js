// src/services/problems.js

import axios from "./api";


// =========================================================
// ORDERING CONSTANTS
// =========================================================

export const PROBLEM_ORDERING = Object.freeze({

    NEWEST:
        "newest",

    OLDEST:
        "oldest",

    MOST_VIEWED:
        "most_viewed",

    MOST_STARRED:
        "most_starred",

    MOST_ANSWERED:
        "most_answered",

    HIGHEST_BOUNTY:
        "highest_bounty",

    DEADLINE:
        "deadline",

    URGENT_FIRST:
        "urgent_first",
});


// =========================================================
// REQUEST CANCEL HELPER
// =========================================================

export const isProblemRequestCanceled = (
    error
) => {

    return (
        error?.name ===
            "CanceledError"
        ||
        error?.name ===
            "AbortError"
        ||
        error?.code ===
            "ERR_CANCELED"
    );
};


// =========================================================
// ERROR LOGGER
// =========================================================

const logApiError = (
    title,
    error
) => {

    if (
        isProblemRequestCanceled(
            error
        )
    ) {
        return;
    }


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
            `❌ ${title}: server javob bermadi`
        );


        return;
    }


    console.error(
        `❌ ${title}:`,
        error?.message
        ||
        error
    );
};


// =========================================================
// POSITIVE INTEGER
// =========================================================

const toPositiveInteger = (
    value,
    fallback = 1
) => {

    const number =
        Number(
            value
        );


    if (
        !Number.isInteger(
            number
        )
        ||
        number < 1
    ) {
        return fallback;
    }


    return number;
};


// =========================================================
// CLEAN TEXT
// =========================================================

const cleanText = (
    value
) => {

    if (
        value === null
        ||
        value === undefined
    ) {
        return "";
    }


    return String(
        value
    ).trim();
};


// =========================================================
// NORMALIZE BOOLEAN
// =========================================================

const normalizeBooleanParam = (
    value
) => {

    if (
        value === true
        ||
        value === false
    ) {
        return value;
    }


    if (
        value === "true"
        ||
        value === "1"
        ||
        value === 1
    ) {
        return true;
    }


    if (
        value === "false"
        ||
        value === "0"
        ||
        value === 0
    ) {
        return false;
    }


    return undefined;
};


// =========================================================
// NORMALIZE OPTIONS
// =========================================================

const normalizeListOptions = (
    pageOrOptions = 1,
    extraOptions = {}
) => {

    if (
        pageOrOptions
        &&
        typeof pageOrOptions === "object"
        &&
        !Array.isArray(
            pageOrOptions
        )
    ) {

        return {
            ...pageOrOptions,
            ...extraOptions,
        };
    }


    return {

        ...extraOptions,

        page:
            toPositiveInteger(
                pageOrOptions,
                1
            ),
    };
};


// =========================================================
// BUILD LIST PARAMS
// =========================================================

const buildProblemListParams = (
    options = {}
) => {

    const params = {};


    // =====================================================
    // PAGE
    // =====================================================

    params.page =
        toPositiveInteger(
            options.page,
            1
        );


    // =====================================================
    // PAGE SIZE
    // =====================================================

    if (
        options.pageSize !== undefined
        ||
        options.page_size !== undefined
    ) {

        params.page_size =
            toPositiveInteger(
                options.pageSize
                ??
                options.page_size,
                6
            );
    }


    // =====================================================
    // SEARCH
    // =====================================================

    const search =
        cleanText(
            options.search
            ??
            options.q
        );


    if (
        search
    ) {

        params.search =
            search;
    }


    // =====================================================
    // STATUS
    // =====================================================

    const status =
        cleanText(
            options.status
        );


    if (
        status
        &&
        status !== "all"
    ) {

        params.status =
            status;
    }


    // =====================================================
    // URGENT
    // =====================================================

    const urgent =
        normalizeBooleanParam(
            options.urgent
            ??
            options.is_urgent
        );


    if (
        urgent !== undefined
    ) {

        params.urgent =
            urgent;
    }


    // =====================================================
    // SOLVED
    // =====================================================

    const solved =
        normalizeBooleanParam(
            options.solved
            ??
            options.is_solved
        );


    if (
        solved !== undefined
    ) {

        params.solved =
            solved;
    }


    // =====================================================
    // LANGUAGE
    // =====================================================

    const language =
        cleanText(
            options.language
        );


    if (
        language
    ) {

        params.language =
            language;
    }


    // =====================================================
    // TECHNOLOGY
    // =====================================================

    const technology =
        cleanText(
            options.technology
        );


    if (
        technology
    ) {

        params.technology =
            technology;
    }


    // =====================================================
    // ORDERING
    // =====================================================

    const ordering =
        cleanText(
            options.ordering
        );


    if (
        ordering
    ) {

        params.ordering =
            ordering;
    }


    return params;
};


// =========================================================
// REQUEST CONFIG
// =========================================================

const buildRequestConfig = ({
    params = undefined,
    signal = undefined,
} = {}) => {

    const config = {

        withCredentials:
            true,
    };


    if (
        params
    ) {

        config.params =
            params;
    }


    if (
        signal
    ) {

        config.signal =
            signal;
    }


    return config;
};


// =========================================================
// PROBLEM SERVICE
// =========================================================

const ProblemService = {

    // =====================================================
    // POPULAR PROBLEMS
    // =====================================================

    async getPopularProblemsList(
        options = {}
    ) {

        try {

            const {
                data,
            } = await axios.get(

                "/problems/popular-problems/",

                buildRequestConfig({
                    signal:
                        options?.signal,
                })
            );


            return Array.isArray(
                data
            )
                ? data
                : [];

        } catch (
            error
        ) {

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
        pageOrOptions = 1,
        extraOptions = {}
    ) {

        const options =
            normalizeListOptions(
                pageOrOptions,
                extraOptions
            );


        try {

            const {
                data,
            } = await axios.get(

                "/problems/",

                buildRequestConfig({

                    params:
                        buildProblemListParams(
                            options
                        ),

                    signal:
                        options.signal,
                })
            );


            return data;

        } catch (
            error
        ) {

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

    async getLanguagesList(
        options = {}
    ) {

        try {

            const {
                data,
            } = await axios.get(

                "/problems/languages/",

                buildRequestConfig({
                    signal:
                        options?.signal,
                })
            );


            return Array.isArray(
                data
            )
                ? data
                : [];

        } catch (
            error
        ) {

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

    async getTechnologiesList(
        options = {}
    ) {

        try {

            const {
                data,
            } = await axios.get(

                "/problems/technologies/",

                buildRequestConfig({
                    signal:
                        options?.signal,
                })
            );


            return Array.isArray(
                data
            )
                ? data
                : [];

        } catch (
            error
        ) {

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
        pageOrOptions = 1,
        extraOptions = {}
    ) {

        const options =
            normalizeListOptions(
                pageOrOptions,
                extraOptions
            );


        try {

            const {
                data,
            } = await axios.get(

                "/problems/my-problems/",

                buildRequestConfig({

                    params:
                        buildProblemListParams(
                            options
                        ),

                    signal:
                        options.signal,
                })
            );


            return data;

        } catch (
            error
        ) {

            logApiError(
                "Mening problemlarni olishda xato",
                error
            );


            throw error;
        }
    },


    // =====================================================
    // CREATE PROBLEM
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
                    withCredentials:
                        true,
                }
            );


            return data;

        } catch (
            error
        ) {

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
        id,
        options = {}
    ) {

        try {

            const {
                data,
            } = await axios.get(

                `/problems/problem/${id}`,

                buildRequestConfig({
                    signal:
                        options?.signal,
                })
            );


            return data;

        } catch (
            error
        ) {

            logApiError(
                "Problem detailni olishda xato",
                error
            );


            throw error;
        }
    },


    // =====================================================
    // UPDATE PROBLEM — PUT
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
                    withCredentials:
                        true,
                }
            );


            return data;

        } catch (
            error
        ) {

            logApiError(
                "Problemni yangilashda xato",
                error
            );


            throw error;
        }
    },


    // =====================================================
    // UPDATE PROBLEM — PATCH
    // =====================================================

    async patchProblem(
        id,
        problemData
    ) {

        try {

            const {
                data,
            } = await axios.patch(

                `/problems/problem/${id}`,

                problemData,

                {
                    withCredentials:
                        true,
                }
            );


            return data;

        } catch (
            error
        ) {

            logApiError(
                "Problemni qisman yangilashda xato",
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
                    withCredentials:
                        true,
                }
            );


            return data;

        } catch (
            error
        ) {

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
                    withCredentials:
                        true,
                }
            );


            return {
                ...data,
                problem_id:
                    problemId,
            };

        } catch (
            error
        ) {

            logApiError(
                "Problemga star qo‘yishda xato",
                error
            );


            throw error;
        }
    },


    // =====================================================
    // GET PROBLEM STAR COUNT
    // =====================================================

    async getStarCount(
        problemId,
        options = {}
    ) {

        try {

            const {
                data,
            } = await axios.get(

                `/problems/problem/${problemId}/star/`,

                buildRequestConfig({
                    signal:
                        options?.signal,
                })
            );


            return {
                ...data,
                problem_id:
                    problemId,
            };

        } catch (
            error
        ) {

            logApiError(
                "Problem star sonini olishda xato",
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
                    withCredentials:
                        true,
                }
            );


            return {
                ...data,
                problem_id:
                    problemId,
            };

        } catch (
            error
        ) {

            logApiError(
                "Problemdan star olib tashlashda xato",
                error
            );


            throw error;
        }
    },


    // =====================================================
    // LEGACY SEARCH
    //
    // /problems/search/ endpoint ishlatilmaydi.
    // Unified /problems/?search=... ishlaydi.
    // =====================================================

    async getProblemSearch(
        search = "",
        page = 1,
        options = {}
    ) {

        return this.getProblemsList({

            ...options,

            page,

            search:
                cleanText(
                    search
                ),
        });
    },


    // =====================================================
    // MY PROBLEM SEARCH — LEGACY
    // =====================================================

    async getMyProblemSearch(
        search = "",
        page = 1,
        options = {}
    ) {

        return this.getMyProblemsList({

            ...options,

            page,

            search:
                cleanText(
                    search
                ),
        });
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
                    withCredentials:
                        true,
                }
            );


            return {

                ...data,

                problem_id:
                    problemId,

                solution_id:
                    solutionId,
            };

        } catch (
            error
        ) {

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
        problemId,
        options = {}
    ) {

        try {

            const {
                data,
            } = await axios.get(

                `/problems/problem/${problemId}/similar/`,

                buildRequestConfig({
                    signal:
                        options?.signal,
                })
            );


            return Array.isArray(
                data
            )
                ? data
                : [];

        } catch (
            error
        ) {

            logApiError(
                "O‘xshash problemlarni olishda xato",
                error
            );


            throw error;
        }
    },
};


export default ProblemService;