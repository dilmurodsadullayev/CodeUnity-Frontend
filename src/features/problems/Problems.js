// src/features/problems/Problems.js

import {
    createSlice,
} from "@reduxjs/toolkit";


// =========================================================
// INITIAL STATE
// =========================================================

const initialState = {

    // =====================================================
    // LEGACY GLOBAL LOADING
    //
    // Eski componentlar hali:
    //
    // state.problem.isLoading
    //
    // ishlatgani uchun saqlanadi.
    // =====================================================

    isLoading: false,

    pendingRequests: 0,


    // =====================================================
    // SEPARATE LOADING STATES
    // =====================================================

    listIsLoading: false,

    myProblemsIsLoading: false,

    popularIsLoading: false,

    detailIsLoading: false,

    createIsLoading: false,

    languagesIsLoading: false,

    technologiesIsLoading: false,

    starIsLoading: false,

    acceptSolutionIsLoading: false,

    similarIsLoading: false,


    // =====================================================
    // DATA
    // =====================================================

    popularProblems: [],

    problems: [],

    myProblems: [],

    similarProblems: [],

    languages: [],

    technologies: [],

    problemDetail: null,


    // =====================================================
    // GLOBAL PROBLEM PAGINATION
    // =====================================================

    count: 0,

    next: null,

    previous: null,


    // =====================================================
    // MY PROBLEM PAGINATION
    // =====================================================

    myProblemsCount: 0,

    myProblemsNext: null,

    myProblemsPrevious: null,


    // =====================================================
    // ERRORS
    // =====================================================

    error: null,

    listError: null,

    myProblemsError: null,

    popularError: null,

    detailError: null,

    createError: null,

    languagesError: null,

    technologiesError: null,

    starError: null,

    acceptSolutionError: null,

    similarError: null,
};


// =========================================================
// SAFE ARRAY
// =========================================================

const safeArray = (
    value
) => {

    return Array.isArray(
        value
    )
        ? value
        : [];
};


// =========================================================
// SAFE NUMBER
// =========================================================

const safeNumber = (
    value,
    fallback = 0
) => {

    const number =
        Number(
            value
        );


    if (
        !Number.isFinite(
            number
        )
    ) {
        return fallback;
    }


    return number;
};


// =========================================================
// NORMALIZE PAGINATED RESPONSE
// =========================================================

const normalizePaginatedPayload = (
    payload
) => {

    if (
        Array.isArray(
            payload
        )
    ) {

        return {
            results:
                payload,

            count:
                payload.length,

            next:
                null,

            previous:
                null,
        };
    }


    if (
        !payload
        ||
        typeof payload !==
            "object"
    ) {

        return {
            results: [],
            count: 0,
            next: null,
            previous: null,
        };
    }


    return {

        results:
            safeArray(
                payload.results
            ),

        count:
            safeNumber(
                payload.count,
                0
            ),

        next:
            payload.next
            ??
            null,

        previous:
            payload.previous
            ??
            null,
    };
};


// =========================================================
// REQUEST COUNTER
// =========================================================

const startRequest = (
    state
) => {

    state.pendingRequests =
        Math.max(
            0,
            safeNumber(
                state.pendingRequests
            )
        )
        +
        1;


    state.isLoading =
        true;
};


const finishRequest = (
    state
) => {

    state.pendingRequests =
        Math.max(
            0,

            safeNumber(
                state.pendingRequests
            )
            -
            1
        );


    state.isLoading =
        state.pendingRequests > 0;
};


// =========================================================
// GET ERROR MESSAGE
// =========================================================

const normalizeError = (
    payload,
    fallback = "Xatolik yuz berdi."
) => {

    if (
        typeof payload ===
            "string"
        &&
        payload.trim()
    ) {
        return payload;
    }


    if (
        payload?.detail
    ) {
        return String(
            payload.detail
        );
    }


    if (
        payload?.message
    ) {
        return String(
            payload.message
        );
    }


    if (
        payload?.error
    ) {
        return String(
            payload.error
        );
    }


    if (
        payload
        &&
        typeof payload ===
            "object"
    ) {

        const firstValue =
            Object.values(
                payload
            )[0];


        if (
            Array.isArray(
                firstValue
            )
            &&
            firstValue.length > 0
        ) {
            return String(
                firstValue[0]
            );
        }


        if (
            typeof firstValue ===
                "string"
        ) {
            return firstValue;
        }
    }


    return fallback;
};


// =========================================================
// UPDATE PROBLEM IN ARRAY
// =========================================================

const updateProblemInArray = (
    collection,
    problemId,
    patch
) => {

    if (
        !Array.isArray(
            collection
        )
        ||
        problemId == null
    ) {
        return;
    }


    const index =
        collection.findIndex(
            (
                item
            ) =>
                String(
                    item?.id
                )
                ===
                String(
                    problemId
                )
        );


    if (
        index ===
        -1
    ) {
        return;
    }


    collection[index] = {
        ...collection[index],
        ...patch,
    };
};


// =========================================================
// UPDATE PROBLEM EVERYWHERE
// =========================================================

const updateProblemEverywhere = (
    state,
    problemId,
    patch
) => {

    if (
        problemId ==
        null
    ) {
        return;
    }


    updateProblemInArray(
        state.problems,
        problemId,
        patch
    );


    updateProblemInArray(
        state.myProblems,
        problemId,
        patch
    );


    updateProblemInArray(
        state.popularProblems,
        problemId,
        patch
    );


    updateProblemInArray(
        state.similarProblems,
        problemId,
        patch
    );


    if (
        state.problemDetail
        &&
        String(
            state.problemDetail.id
        )
        ===
        String(
            problemId
        )
    ) {

        state.problemDetail = {
            ...state.problemDetail,
            ...patch,
        };
    }
};


// =========================================================
// GET TOTAL STAR COUNT FROM RESPONSE
// =========================================================

const getTotalStarsFromPayload = (
    payload
) => {

    const candidates = [

        payload?.stars,

        payload?.total_stars,

        payload?.stars_count,

        payload?.star_count,
    ];


    for (
        const value
        of
        candidates
    ) {

        const number =
            Number(
                value
            );


        if (
            Number.isFinite(
                number
            )
        ) {
            return Math.max(
                0,
                number
            );
        }
    }


    return null;
};


// =========================================================
// SLICE
// =========================================================

export const problemSlice =
    createSlice({

        name:
            "problem",

        initialState,

        reducers: {

            // =================================================
            // POPULAR PROBLEMS
            // =================================================

            getPopularProblemStart: (
                state
            ) => {

                startRequest(
                    state
                );


                state.popularIsLoading =
                    true;

                state.popularError =
                    null;
            },


            getPopularProblemSuccess: (
                state,
                action
            ) => {

                finishRequest(
                    state
                );


                state.popularIsLoading =
                    false;


                state.popularProblems =
                    safeArray(
                        action.payload
                    );


                state.popularError =
                    null;
            },


            getPopularProblemFailure: (
                state,
                action
            ) => {

                finishRequest(
                    state
                );


                state.popularIsLoading =
                    false;


                state.popularError =
                    normalizeError(
                        action.payload,
                        "Mashhur muammolarni yuklashda xato yuz berdi."
                    );
            },


            // =================================================
            // PROBLEMS LIST
            // =================================================

            getProblemStart: (
                state
            ) => {

                startRequest(
                    state
                );


                state.listIsLoading =
                    true;

                state.listError =
                    null;

                state.error =
                    null;
            },


            getProblemSuccess: (
                state,
                action
            ) => {

                finishRequest(
                    state
                );


                const payload =
                    normalizePaginatedPayload(
                        action.payload
                    );


                state.listIsLoading =
                    false;


                state.problems =
                    payload.results;

                state.count =
                    payload.count;

                state.next =
                    payload.next;

                state.previous =
                    payload.previous;


                state.listError =
                    null;

                state.error =
                    null;
            },


            getProblemFailure: (
                state,
                action
            ) => {

                finishRequest(
                    state
                );


                const error =
                    normalizeError(
                        action.payload,
                        "Muammolarni yuklashda xato yuz berdi."
                    );


                state.listIsLoading =
                    false;


                state.listError =
                    error;

                state.error =
                    error;


                state.problems =
                    [];

                state.count =
                    0;

                state.next =
                    null;

                state.previous =
                    null;
            },


            // =================================================
            // MY PROBLEMS
            // =================================================

            getMyProblemStart: (
                state
            ) => {

                startRequest(
                    state
                );


                state.myProblemsIsLoading =
                    true;

                state.myProblemsError =
                    null;
            },


            getMyProblemSuccess: (
                state,
                action
            ) => {

                finishRequest(
                    state
                );


                const payload =
                    normalizePaginatedPayload(
                        action.payload
                    );


                state.myProblemsIsLoading =
                    false;


                state.myProblems =
                    payload.results;

                state.myProblemsCount =
                    payload.count;

                state.myProblemsNext =
                    payload.next;

                state.myProblemsPrevious =
                    payload.previous;


                state.myProblemsError =
                    null;
            },


            getMyProblemFailure: (
                state,
                action
            ) => {

                finishRequest(
                    state
                );


                state.myProblemsIsLoading =
                    false;


                state.myProblemsError =
                    normalizeError(
                        action.payload,
                        "Muammolaringizni yuklashda xato yuz berdi."
                    );


                state.myProblems =
                    [];

                state.myProblemsCount =
                    0;

                state.myProblemsNext =
                    null;

                state.myProblemsPrevious =
                    null;
            },


            // =================================================
            // LANGUAGES
            // =================================================

            getLanguagesStart: (
                state
            ) => {

                startRequest(
                    state
                );


                state.languagesIsLoading =
                    true;

                state.languagesError =
                    null;
            },


            getLanguagesSuccess: (
                state,
                action
            ) => {

                finishRequest(
                    state
                );


                state.languagesIsLoading =
                    false;


                state.languages =
                    safeArray(
                        action.payload
                    );


                state.languagesError =
                    null;
            },


            getLanguagesFailure: (
                state,
                action
            ) => {

                finishRequest(
                    state
                );


                state.languagesIsLoading =
                    false;


                state.languagesError =
                    normalizeError(
                        action.payload,
                        "Dasturlash tillarini yuklashda xato yuz berdi."
                    );
            },


            // =================================================
            // TECHNOLOGIES
            // =================================================

            getTechnologiesStart: (
                state
            ) => {

                startRequest(
                    state
                );


                state.technologiesIsLoading =
                    true;

                state.technologiesError =
                    null;
            },


            getTechnologiesSuccess: (
                state,
                action
            ) => {

                finishRequest(
                    state
                );


                state.technologiesIsLoading =
                    false;


                state.technologies =
                    safeArray(
                        action.payload
                    );


                state.technologiesError =
                    null;
            },


            getTechnologiesFailure: (
                state,
                action
            ) => {

                finishRequest(
                    state
                );


                state.technologiesIsLoading =
                    false;


                state.technologiesError =
                    normalizeError(
                        action.payload,
                        "Texnologiyalarni yuklashda xato yuz berdi."
                    );
            },


            // =================================================
            // CREATE PROBLEM
            // =================================================

            postProblemStart: (
                state
            ) => {

                startRequest(
                    state
                );


                state.createIsLoading =
                    true;

                state.createError =
                    null;

                state.error =
                    null;
            },


            postProblemSuccess: (
                state,
                action
            ) => {

                finishRequest(
                    state
                );


                state.createIsLoading =
                    false;

                state.createError =
                    null;

                state.error =
                    null;


                const problem =
                    action.payload;


                if (
                    problem?.id
                ) {

                    const alreadyExists =
                        state.problems.some(
                            (
                                item
                            ) =>
                                String(
                                    item?.id
                                )
                                ===
                                String(
                                    problem.id
                                )
                        );


                    if (
                        !alreadyExists
                    ) {

                        state.problems.unshift(
                            problem
                        );


                        state.count =
                            Math.max(
                                0,
                                safeNumber(
                                    state.count
                                )
                            )
                            +
                            1;
                    }
                }
            },


            postProblemFailure: (
                state,
                action
            ) => {

                finishRequest(
                    state
                );


                const error =
                    normalizeError(
                        action.payload,
                        "Problem yaratishda xato yuz berdi."
                    );


                state.createIsLoading =
                    false;

                state.createError =
                    error;

                state.error =
                    error;
            },


            // =================================================
            // PROBLEM DETAIL
            // =================================================

            getProblemDetailStart: (
                state
            ) => {

                startRequest(
                    state
                );


                state.detailIsLoading =
                    true;

                state.detailError =
                    null;

                state.error =
                    null;
            },


            getProblemDetailSuccess: (
                state,
                action
            ) => {

                finishRequest(
                    state
                );


                state.detailIsLoading =
                    false;


                state.problemDetail =
                    action.payload
                    ??
                    null;


                state.detailError =
                    null;

                state.error =
                    null;
            },


            getProblemDetailFailure: (
                state,
                action
            ) => {

                finishRequest(
                    state
                );


                const error =
                    normalizeError(
                        action.payload,
                        "Problem ma’lumotlarini yuklashda xato yuz berdi."
                    );


                state.detailIsLoading =
                    false;

                state.detailError =
                    error;

                state.error =
                    error;
            },


            clearProblemDetail: (
                state
            ) => {

                state.problemDetail =
                    null;

                state.detailError =
                    null;
            },


            // =================================================
            // ADD PROBLEM STAR
            // =================================================

            postProblemStarStart: (
                state
            ) => {

                startRequest(
                    state
                );


                state.starIsLoading =
                    true;

                state.starError =
                    null;
            },


            postProblemStarSuccess: (
                state,
                action
            ) => {

                finishRequest(
                    state
                );


                state.starIsLoading =
                    false;

                state.starError =
                    null;


                const payload =
                    action.payload
                    ||
                    {};


                const problemId =
                    payload.problem_id
                    ??
                    payload.problem
                    ??
                    state.problemDetail?.id;


                const currentStars =
                    safeNumber(
                        state.problemDetail?.star,
                        0
                    );


                const serverTotal =
                    getTotalStarsFromPayload(
                        payload
                    );


                const nextStars =
                    serverTotal
                    ??
                    (
                        currentStars
                        +
                        1
                    );


                updateProblemEverywhere(
                    state,
                    problemId,
                    {
                        star:
                            nextStars,

                        is_starred_by_user:
                            true,
                    }
                );
            },


            postProblemStarFailure: (
                state,
                action
            ) => {

                finishRequest(
                    state
                );


                state.starIsLoading =
                    false;


                state.starError =
                    normalizeError(
                        action.payload,
                        "Star qo‘yishda xato yuz berdi."
                    );
            },


            // =================================================
            // REMOVE PROBLEM STAR
            // =================================================

            deleteProblemStarStart: (
                state
            ) => {

                startRequest(
                    state
                );


                state.starIsLoading =
                    true;

                state.starError =
                    null;
            },


            deleteProblemStarSuccess: (
                state,
                action
            ) => {

                finishRequest(
                    state
                );


                state.starIsLoading =
                    false;

                state.starError =
                    null;


                const payload =
                    action.payload
                    ||
                    {};


                const problemId =
                    payload.problem_id
                    ??
                    payload.problem
                    ??
                    state.problemDetail?.id;


                const currentStars =
                    safeNumber(
                        state.problemDetail?.star,
                        0
                    );


                const serverTotal =
                    getTotalStarsFromPayload(
                        payload
                    );


                const nextStars =
                    serverTotal
                    ??
                    Math.max(
                        0,
                        currentStars - 1
                    );


                updateProblemEverywhere(
                    state,
                    problemId,
                    {
                        star:
                            nextStars,

                        is_starred_by_user:
                            false,
                    }
                );
            },


            deleteProblemStarFailure: (
                state,
                action
            ) => {

                finishRequest(
                    state
                );


                state.starIsLoading =
                    false;


                state.starError =
                    normalizeError(
                        action.payload,
                        "Starni olib tashlashda xato yuz berdi."
                    );
            },


            // =================================================
            // ACCEPT SOLUTION
            // =================================================

            acceptSolutionStart: (
                state
            ) => {

                startRequest(
                    state
                );


                state.acceptSolutionIsLoading =
                    true;

                state.acceptSolutionError =
                    null;
            },


            acceptSolutionSuccess: (
                state,
                action
            ) => {

                finishRequest(
                    state
                );


                state.acceptSolutionIsLoading =
                    false;

                state.acceptSolutionError =
                    null;


                const payload =
                    action.payload
                    ||
                    {};


                const problemId =
                    payload.problem_id
                    ??
                    state.problemDetail?.id;


                // Backend hozir full ProblemDetail emas,
                // accept natijasini qaytaradi.
                //
                // Shuning uchun problemDetail'ni
                // butunlay almashtirmaymiz.

                const patch = {

                    is_solved:
                        payload.is_solved
                        ??
                        true,

                    status:
                        payload.status
                        ??
                        "solved",
                };


                if (
                    payload.correct_answer_id
                    !=
                    null
                ) {

                    patch.correct_answer_id =
                        payload.correct_answer_id;
                }


                if (
                    payload.solution_id
                    !=
                    null
                ) {

                    patch.solution_id =
                        payload.solution_id;
                }


                if (
                    payload.bounty_reward
                    !=
                    null
                ) {

                    patch.bounty_reward =
                        payload.bounty_reward;
                }


                if (
                    payload.best_solution_reward
                    !=
                    null
                ) {

                    patch.best_solution_reward =
                        payload.best_solution_reward;
                }


                if (
                    payload.total_reward
                    !=
                    null
                ) {

                    patch.total_reward =
                        payload.total_reward;
                }


                updateProblemEverywhere(
                    state,
                    problemId,
                    patch
                );
            },


            acceptSolutionFailure: (
                state,
                action
            ) => {

                finishRequest(
                    state
                );


                state.acceptSolutionIsLoading =
                    false;


                state.acceptSolutionError =
                    normalizeError(
                        action.payload,
                        "Yechimni qabul qilishda xato yuz berdi."
                    );
            },


            // =================================================
            // SIMILAR PROBLEMS
            //
            // Bu request global loaderni o'zgartirmaydi.
            // ProblemDetail ichidagi asosiy contentni
            // qayta loading qilib yubormaslik uchun.
            // =================================================

            similarProblemsStart: (
                state
            ) => {

                state.similarIsLoading =
                    true;

                state.similarError =
                    null;
            },


            similarProblemsSuccess: (
                state,
                action
            ) => {

                state.similarIsLoading =
                    false;


                state.similarProblems =
                    safeArray(
                        action.payload
                    );


                state.similarError =
                    null;
            },


            similarProblemsFailure: (
                state,
                action
            ) => {

                state.similarIsLoading =
                    false;


                state.similarError =
                    normalizeError(
                        action.payload,
                        "O‘xshash muammolarni yuklashda xato yuz berdi."
                    );


                state.similarProblems =
                    [];
            },


            // =================================================
            // CLEAR LIST
            // =================================================

            clearProblems: (
                state
            ) => {

                state.problems =
                    [];

                state.count =
                    0;

                state.next =
                    null;

                state.previous =
                    null;

                state.listError =
                    null;
            },


            // =================================================
            // CLEAR MY PROBLEMS
            // =================================================

            clearMyProblems: (
                state
            ) => {

                state.myProblems =
                    [];

                state.myProblemsCount =
                    0;

                state.myProblemsNext =
                    null;

                state.myProblemsPrevious =
                    null;

                state.myProblemsError =
                    null;
            },


            // =================================================
            // CLEAR SIMILAR
            // =================================================

            clearSimilarProblems: (
                state
            ) => {

                state.similarProblems =
                    [];

                state.similarError =
                    null;

                state.similarIsLoading =
                    false;
            },


            // =================================================
            // CLEAR ERRORS
            // =================================================

            clearProblemErrors: (
                state
            ) => {

                state.error =
                    null;

                state.listError =
                    null;

                state.myProblemsError =
                    null;

                state.popularError =
                    null;

                state.detailError =
                    null;

                state.createError =
                    null;

                state.languagesError =
                    null;

                state.technologiesError =
                    null;

                state.starError =
                    null;

                state.acceptSolutionError =
                    null;

                state.similarError =
                    null;
            },


            // =================================================
            // RESET
            // =================================================

            resetProblemState: () =>
                initialState,
        },
    });


// =========================================================
// ACTIONS
// =========================================================

export const {

    // Popular
    getPopularProblemStart,
    getPopularProblemSuccess,
    getPopularProblemFailure,


    // Problems
    getProblemStart,
    getProblemSuccess,
    getProblemFailure,


    // My problems
    getMyProblemStart,
    getMyProblemSuccess,
    getMyProblemFailure,


    // Languages
    getLanguagesStart,
    getLanguagesSuccess,
    getLanguagesFailure,


    // Technologies
    getTechnologiesStart,
    getTechnologiesSuccess,
    getTechnologiesFailure,


    // Create
    postProblemStart,
    postProblemSuccess,
    postProblemFailure,


    // Detail
    getProblemDetailStart,
    getProblemDetailSuccess,
    getProblemDetailFailure,
    clearProblemDetail,


    // Problem star
    postProblemStarStart,
    postProblemStarSuccess,
    postProblemStarFailure,

    deleteProblemStarStart,
    deleteProblemStarSuccess,
    deleteProblemStarFailure,


    // Accept solution
    acceptSolutionStart,
    acceptSolutionSuccess,
    acceptSolutionFailure,


    // Similar
    similarProblemsStart,
    similarProblemsSuccess,
    similarProblemsFailure,


    // Clear/reset
    clearProblems,
    clearMyProblems,
    clearSimilarProblems,
    clearProblemErrors,
    resetProblemState,

} = problemSlice.actions;


// =========================================================
// LEGACY COMPATIBILITY ALIASES
//
// Hozirgi componentlarni birdan sindirib yubormaslik uchun.
// Keyinchalik importlarni tozalab, bularni olib tashlaymiz.
// =========================================================

export const getPopularProblemtFailure =
    getPopularProblemFailure;


export const getProblemtFailure =
    getProblemFailure;


export const getMyProblemtFailure =
    getMyProblemFailure;


export const posProblemtSuccess =
    postProblemSuccess;


// =========================================================
// SELECTORS
// =========================================================

export const selectProblemState = (
    state
) => state.problem;


export const selectProblems = (
    state
) =>
    state.problem.problems;


export const selectProblemDetail = (
    state
) =>
    state.problem.problemDetail;


export const selectProblemLanguages = (
    state
) =>
    state.problem.languages;


export const selectProblemTechnologies = (
    state
) =>
    state.problem.technologies;


export const selectSimilarProblems = (
    state
) =>
    state.problem.similarProblems;


export default problemSlice.reducer;