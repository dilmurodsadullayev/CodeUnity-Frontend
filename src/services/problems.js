// src/services/problems.js

import axios from "./api";


// =========================================================
// CONSTANTS
// =========================================================

export const PROBLEM_ORDERING = Object.freeze({
    NEWEST: "newest",
    OLDEST: "oldest",
    MOST_VIEWED: "most_viewed",
    MOST_STARRED: "most_starred",
    MOST_ANSWERED: "most_answered",
    HIGHEST_BOUNTY: "highest_bounty",
    DEADLINE: "deadline",
    URGENT_FIRST: "urgent_first",
});


const PROBLEM_ORDERING_VALUES =
    new Set(
        Object.values(
            PROBLEM_ORDERING
        )
    );


const DEFAULT_PAGE_SIZE = 6;

const MAX_PAGE_SIZE = 24;


// =========================================================
// REQUEST CANCEL
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
// POSITIVE INTEGER
// =========================================================

const toPositiveInteger = (
    value,
    fallback = 1,
    max = Number.MAX_SAFE_INTEGER
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


    return Math.min(
        number,
        max
    );
};


// =========================================================
// BOOLEAN PARAM
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
        typeof value ===
        "string"
    ) {

        const normalized =
            value
                .trim()
                .toLowerCase();


        if (
            normalized === "true"
            ||
            normalized === "1"
            ||
            normalized === "yes"
            ||
            normalized === "on"
        ) {
            return true;
        }


        if (
            normalized === "false"
            ||
            normalized === "0"
            ||
            normalized === "no"
            ||
            normalized === "off"
        ) {
            return false;
        }
    }


    if (
        value === 1
    ) {
        return true;
    }


    if (
        value === 0
    ) {
        return false;
    }


    return undefined;
};


// =========================================================
// NORMALIZE LIST OPTIONS
// =========================================================

const normalizeListOptions = (
    pageOrOptions = 1,
    extraOptions = {}
) => {

    if (
        pageOrOptions
        &&
        typeof pageOrOptions ===
            "object"
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
// NORMALIZE GENERIC OPTIONS
// =========================================================

const normalizeOptions = (
    options
) => {

    if (
        options
        &&
        typeof options ===
            "object"
        &&
        !Array.isArray(
            options
        )
    ) {
        return options;
    }


    return {};
};


// =========================================================
// RESOURCE ID
// =========================================================

const getResourceId = (
    value,
    label = "ID"
) => {

    const id =
        cleanText(
            value
        );


    if (
        !id
    ) {

        throw new TypeError(
            `${label} mavjud emas.`
        );
    }


    return encodeURIComponent(
        id
    );
};


// =========================================================
// SAFE OBJECT
// =========================================================

const toObject = (
    value
) => {

    if (
        value
        &&
        typeof value ===
            "object"
        &&
        !Array.isArray(
            value
        )
    ) {
        return value;
    }


    return {};
};


// =========================================================
// BUILD PROBLEM LIST PARAMS
// =========================================================

const buildProblemListParams = (
    options = {}
) => {

    const params = {

        page:
            toPositiveInteger(
                options.page,
                1
            ),
    };


    // =====================================================
    // PAGE SIZE
    // =====================================================

    if (
        options.pageSize !==
            undefined
        ||
        options.page_size !==
            undefined
    ) {

        params.page_size =
            toPositiveInteger(
                options.pageSize
                ??
                options.page_size,

                DEFAULT_PAGE_SIZE,

                MAX_PAGE_SIZE
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
        status !==
            "all"
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
        urgent !==
            undefined
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
        solved !==
            undefined
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
        &&
        PROBLEM_ORDERING_VALUES
            .has(
                ordering
            )
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

        const safeOptions =
            normalizeOptions(
                options
            );


        try {

            const {
                data,
            } = await axios.get(

                "/problems/popular-problems/",

                buildRequestConfig({

                    signal:
                        safeOptions.signal,
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

        const safeOptions =
            normalizeOptions(
                options
            );


        try {

            const {
                data,
            } = await axios.get(

                "/problems/languages/",

                buildRequestConfig({

                    signal:
                        safeOptions.signal,
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

        const safeOptions =
            normalizeOptions(
                options
            );


        try {

            const {
                data,
            } = await axios.get(

                "/problems/technologies/",

                buildRequestConfig({

                    signal:
                        safeOptions.signal,
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
        problemData,
        options = {}
    ) {

        const safeOptions =
            normalizeOptions(
                options
            );


        try {

            const {
                data,
            } = await axios.post(

                "/problems/",

                problemData,

                buildRequestConfig({

                    signal:
                        safeOptions.signal,
                })
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

        const safeId =
            getResourceId(
                id,
                "Problem ID"
            );


        const safeOptions =
            normalizeOptions(
                options
            );


        try {

            const {
                data,
            } = await axios.get(

                `/problems/problem/${safeId}`,

                buildRequestConfig({

                    signal:
                        safeOptions.signal,
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
        problemData,
        options = {}
    ) {

        const safeId =
            getResourceId(
                id,
                "Problem ID"
            );


        const safeOptions =
            normalizeOptions(
                options
            );


        try {

            const {
                data,
            } = await axios.put(

                `/problems/problem/${safeId}`,

                problemData,

                buildRequestConfig({

                    signal:
                        safeOptions.signal,
                })
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
        problemData,
        options = {}
    ) {

        const safeId =
            getResourceId(
                id,
                "Problem ID"
            );


        const safeOptions =
            normalizeOptions(
                options
            );


        try {

            const {
                data,
            } = await axios.patch(

                `/problems/problem/${safeId}`,

                problemData,

                buildRequestConfig({

                    signal:
                        safeOptions.signal,
                })
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
        id,
        options = {}
    ) {

        const safeId =
            getResourceId(
                id,
                "Problem ID"
            );


        const safeOptions =
            normalizeOptions(
                options
            );


        try {

            const {
                data,
            } = await axios.delete(

                `/problems/problem/${safeId}`,

                buildRequestConfig({

                    signal:
                        safeOptions.signal,
                })
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
    // ADD STAR
    // =====================================================

    async addStar(
        problemId,
        options = {}
    ) {

        const safeId =
            getResourceId(
                problemId,
                "Problem ID"
            );


        const safeOptions =
            normalizeOptions(
                options
            );


        try {

            const {
                data,
            } = await axios.post(

                `/problems/problem/${safeId}/star/`,

                {},

                buildRequestConfig({

                    signal:
                        safeOptions.signal,
                })
            );


            return {

                ...toObject(
                    data
                ),

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
    // GET STAR COUNT
    // =====================================================

    async getStarCount(
        problemId,
        options = {}
    ) {

        const safeId =
            getResourceId(
                problemId,
                "Problem ID"
            );


        const safeOptions =
            normalizeOptions(
                options
            );


        try {

            const {
                data,
            } = await axios.get(

                `/problems/problem/${safeId}/star/`,

                buildRequestConfig({

                    signal:
                        safeOptions.signal,
                })
            );


            return {

                ...toObject(
                    data
                ),

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
    // REMOVE STAR
    // =====================================================

    async removeStar(
        problemId,
        options = {}
    ) {

        const safeId =
            getResourceId(
                problemId,
                "Problem ID"
            );


        const safeOptions =
            normalizeOptions(
                options
            );


        try {

            const {
                data,
            } = await axios.delete(

                `/problems/problem/${safeId}/star/`,

                buildRequestConfig({

                    signal:
                        safeOptions.signal,
                })
            );


            return {

                ...toObject(
                    data
                ),

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
    //
    // Unified:
    // /problems/?search=...
    // =====================================================

    async getProblemSearch(
        search = "",
        page = 1,
        options = {}
    ) {

        return this.getProblemsList({

            ...normalizeOptions(
                options
            ),

            page:
                toPositiveInteger(
                    page,
                    1
                ),

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

            ...normalizeOptions(
                options
            ),

            page:
                toPositiveInteger(
                    page,
                    1
                ),

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
        solutionId,
        options = {}
    ) {

        const safeProblemId =
            getResourceId(
                problemId,
                "Problem ID"
            );


        const safeSolutionId =
            cleanText(
                solutionId
            );


        if (
            !safeSolutionId
        ) {

            throw new TypeError(
                "Solution ID mavjud emas."
            );
        }


        const safeOptions =
            normalizeOptions(
                options
            );


        try {

            const {
                data,
            } = await axios.post(

                `/problems/problem/${safeProblemId}/accept-solution/`,

                {
                    solution_id:
                        solutionId,
                },

                buildRequestConfig({

                    signal:
                        safeOptions.signal,
                })
            );


            return {

                ...toObject(
                    data
                ),

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

        const safeId =
            getResourceId(
                problemId,
                "Problem ID"
            );


        const safeOptions =
            normalizeOptions(
                options
            );


        try {

            const {
                data,
            } = await axios.get(

                `/problems/problem/${safeId}/similar/`,

                buildRequestConfig({

                    signal:
                        safeOptions.signal,
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