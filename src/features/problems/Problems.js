// src/features/problems/Problems.js

import {
    createSlice,
} from "@reduxjs/toolkit";


// =========================================================
// INITIAL STATE FACTORY
// =========================================================

const createInitialState = () => ({

    // =====================================================
    // LEGACY GLOBAL LOADING
    //
    // Eski componentlar uchun compatibility.
    //
    // pendingRequests endi haqiqiy HTTP request counter
    // emas.
    //
    // Active loading categorylar soni.
    //
    // Bu AbortController cancellation sabab counter
    // abadiy +1 bo‘lib qolish muammosini kamaytiradi.
    // =====================================================

    isLoading:
        false,

    pendingRequests:
        0,


    // =====================================================
    // SEPARATE LOADING
    // =====================================================

    listIsLoading:
        false,

    myProblemsIsLoading:
        false,

    popularIsLoading:
        false,

    detailIsLoading:
        false,

    createIsLoading:
        false,

    languagesIsLoading:
        false,

    technologiesIsLoading:
        false,

    starIsLoading:
        false,

    acceptSolutionIsLoading:
        false,

    similarIsLoading:
        false,


    // =====================================================
    // DATA
    // =====================================================

    popularProblems:
        [],

    problems:
        [],

    myProblems:
        [],

    similarProblems:
        [],

    languages:
        [],

    technologies:
        [],

    problemDetail:
        null,


    // =====================================================
    // GLOBAL PAGINATION
    // =====================================================

    count:
        0,

    next:
        null,

    previous:
        null,


    // =====================================================
    // MY PROBLEM PAGINATION
    // =====================================================

    myProblemsCount:
        0,

    myProblemsNext:
        null,

    myProblemsPrevious:
        null,


    // =====================================================
    // ERRORS
    // =====================================================

    error:
        null,

    listError:
        null,

    myProblemsError:
        null,

    popularError:
        null,

    detailError:
        null,

    createError:
        null,

    languagesError:
        null,

    technologiesError:
        null,

    starError:
        null,

    acceptSolutionError:
        null,

    similarError:
        null,
});


const initialState =
    createInitialState();


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


    return Number.isFinite(
        number
    )
        ? number
        : fallback;
};


// =========================================================
// NON NEGATIVE NUMBER
// =========================================================

const nonNegativeNumber = (
    value,
    fallback = 0
) => {

    return Math.max(

        0,

        safeNumber(
            value,
            fallback
        )
    );
};


// =========================================================
// NORMALIZE ERROR
// =========================================================

const normalizeError = (
    payload,
    fallback = "Xatolik yuz berdi."
) => {

    // =====================================================
    // STRING
    // =====================================================

    if (
        typeof payload ===
            "string"
        &&
        payload.trim()
    ) {

        return payload.trim();
    }


    if (
        !payload
    ) {

        return fallback;
    }


    // =====================================================
    // COMMON DRF KEYS
    // =====================================================

    const direct =
        payload?.detail
        ??
        payload?.message
        ??
        payload?.error;


    if (
        typeof direct ===
            "string"
        &&
        direct.trim()
    ) {

        return direct.trim();
    }


    // =====================================================
    // FIELD ERRORS
    // =====================================================

    if (
        typeof payload ===
            "object"
        &&
        !Array.isArray(
            payload
        )
    ) {

        for (
            const value
            of Object.values(
                payload
            )
        ) {

            if (
                typeof value ===
                    "string"
                &&
                value.trim()
            ) {

                return value.trim();
            }


            if (
                Array.isArray(
                    value
                )
                &&
                value.length > 0
                &&
                typeof value[0] ===
                    "string"
                &&
                value[0].trim()
            ) {

                return value[0].trim();
            }
        }
    }


    return fallback;
};


// =========================================================
// NORMALIZE PAGINATION
// =========================================================

const normalizePaginatedPayload = (
    payload
) => {

    // =====================================================
    // LEGACY ARRAY RESPONSE
    // =====================================================

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


    // =====================================================
    // INVALID PAYLOAD
    // =====================================================

    if (
        !payload
        ||
        typeof payload !==
            "object"
    ) {

        return {

            results:
                [],

            count:
                0,

            next:
                null,

            previous:
                null,
        };
    }


    const results =
        safeArray(
            payload.results
        );


    return {

        results,

        count:
            nonNegativeNumber(
                payload.count,
                results.length
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
// SAME ID
// =========================================================

const sameId = (
    left,
    right
) => {

    return (

        left !== null
        &&
        left !== undefined
        &&
        right !== null
        &&
        right !== undefined
        &&
        String(
            left
        ) ===
        String(
            right
        )
    );
};


// =========================================================
// LEGACY GLOBAL LOADING SYNC
//
// Old implementation:
//
// pendingRequests += 1
//
// Abort bo‘lsa Success/Failure kelmasligi mumkin edi.
// Natijada counter leak bo‘lardi.
//
// Endi active loading CATEGORY lar sanaladi.
// =========================================================

const GLOBAL_LOADING_KEYS = [

    "listIsLoading",

    "myProblemsIsLoading",

    "popularIsLoading",

    "detailIsLoading",

    "createIsLoading",

    "languagesIsLoading",

    "technologiesIsLoading",

    "starIsLoading",

    "acceptSolutionIsLoading",
];


const syncLegacyLoading = (
    state
) => {

    const activeCount =
        GLOBAL_LOADING_KEYS
            .reduce(
                (
                    total,
                    key
                ) => {

                    return (

                        total

                        +

                        (
                            state[key]
                                ? 1
                                : 0
                        )
                    );
                },

                0
            );


    state.pendingRequests =
        activeCount;


    state.isLoading =
        activeCount > 0;
};


// =========================================================
// SET LOADING
// =========================================================

const setLoading = (
    state,
    key,
    value
) => {

    state[key] =
        Boolean(
            value
        );


    syncLegacyLoading(
        state
    );
};


// =========================================================
// UPDATE PROBLEM IN ARRAY
// =========================================================

const updateProblemInArray = (
    collection,
    problemId,
    patchOrUpdater
) => {

    if (
        !Array.isArray(
            collection
        )
        ||
        problemId === null
        ||
        problemId === undefined
    ) {

        return false;
    }


    const index =
        collection.findIndex(
            (
                item
            ) => {

                return sameId(
                    item?.id,
                    problemId
                );
            }
        );


    if (
        index === -1
    ) {

        return false;
    }


    const current =
        collection[index];


    const patch =
        typeof patchOrUpdater ===
            "function"
            ? patchOrUpdater(
                current
            )
            : patchOrUpdater;


    if (
        !patch
        ||
        typeof patch !==
            "object"
    ) {

        return false;
    }


    collection[index] = {

        ...current,

        ...patch,
    };


    return true;
};


// =========================================================
// UPDATE PROBLEM EVERYWHERE
// =========================================================

const updateProblemEverywhere = (
    state,
    problemId,
    patchOrUpdater
) => {

    if (
        problemId === null
        ||
        problemId === undefined
    ) {

        return;
    }


    updateProblemInArray(
        state.problems,
        problemId,
        patchOrUpdater
    );


    updateProblemInArray(
        state.myProblems,
        problemId,
        patchOrUpdater
    );


    updateProblemInArray(
        state.popularProblems,
        problemId,
        patchOrUpdater
    );


    updateProblemInArray(
        state.similarProblems,
        problemId,
        patchOrUpdater
    );


    // =====================================================
    // DETAIL
    // =====================================================

    if (
        state.problemDetail
        &&
        sameId(
            state.problemDetail.id,
            problemId
        )
    ) {

        const patch =
            typeof patchOrUpdater ===
                "function"
                ? patchOrUpdater(
                    state.problemDetail
                )
                : patchOrUpdater;


        if (
            patch
            &&
            typeof patch ===
                "object"
        ) {

            state.problemDetail = {

                ...state.problemDetail,

                ...patch,
            };
        }
    }
};


// =========================================================
// PROBLEM ID FROM PAYLOAD
// =========================================================

const getProblemIdFromPayload = (
    payload,
    state
) => {

    return (

        payload?.problem_id

        ??

        payload?.problem?.id

        ??

        payload?.problem

        ??

        payload?.id

        ??

        state.problemDetail?.id

        ??

        null
    );
};


// =========================================================
// STAR COUNT FROM SERVER
// =========================================================

const getTotalStarsFromPayload = (
    payload
) => {

    const candidates = [

        payload?.star,

        payload?.stars,

        payload?.total_stars,

        payload?.stars_count,

        payload?.star_count,
    ];


    for (
        const value
        of candidates
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

                setLoading(
                    state,
                    "popularIsLoading",
                    true
                );


                state.popularError =
                    null;


                state.error =
                    null;
            },


            getPopularProblemSuccess: (
                state,
                action
            ) => {

                setLoading(
                    state,
                    "popularIsLoading",
                    false
                );


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

                setLoading(
                    state,
                    "popularIsLoading",
                    false
                );


                const error =
                    normalizeError(
                        action.payload,
                        "Mashhur muammolarni yuklashda xato yuz berdi."
                    );


                state.popularError =
                    error;


                state.error =
                    error;


                // Old data saqlanadi.
            },


            // =================================================
            // PROBLEM LIST
            // =================================================

            getProblemStart: (
                state
            ) => {

                setLoading(
                    state,
                    "listIsLoading",
                    true
                );


                state.listError =
                    null;


                state.error =
                    null;
            },


            getProblemSuccess: (
                state,
                action
            ) => {

                const payload =
                    normalizePaginatedPayload(
                        action.payload
                    );


                setLoading(
                    state,
                    "listIsLoading",
                    false
                );


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

                setLoading(
                    state,
                    "listIsLoading",
                    false
                );


                const error =
                    normalizeError(
                        action.payload,
                        "Muammolarni yuklashda xato yuz berdi."
                    );


                state.listError =
                    error;


                state.error =
                    error;


                // =========================================
                // MUHIM
                //
                // Oldingi valid listni o‘chirmaymiz.
                //
                // Shunda refresh/filter request yiqilsa:
                //
                // eski cardlar + compact error
                //
                // ko‘rinishi mumkin.
                // =========================================
            },


            // =================================================
            // MY PROBLEMS
            // =================================================

            getMyProblemStart: (
                state
            ) => {

                setLoading(
                    state,
                    "myProblemsIsLoading",
                    true
                );


                state.myProblemsError =
                    null;


                state.error =
                    null;
            },


            getMyProblemSuccess: (
                state,
                action
            ) => {

                const payload =
                    normalizePaginatedPayload(
                        action.payload
                    );


                setLoading(
                    state,
                    "myProblemsIsLoading",
                    false
                );


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


                state.error =
                    null;
            },


            getMyProblemFailure: (
                state,
                action
            ) => {

                setLoading(
                    state,
                    "myProblemsIsLoading",
                    false
                );


                const error =
                    normalizeError(
                        action.payload,
                        "Muammolaringizni yuklashda xato yuz berdi."
                    );


                state.myProblemsError =
                    error;


                state.error =
                    error;


                // Old list saqlanadi.
            },


            // =================================================
            // LANGUAGES
            // =================================================

            getLanguagesStart: (
                state
            ) => {

                setLoading(
                    state,
                    "languagesIsLoading",
                    true
                );


                state.languagesError =
                    null;
            },


            getLanguagesSuccess: (
                state,
                action
            ) => {

                setLoading(
                    state,
                    "languagesIsLoading",
                    false
                );


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

                setLoading(
                    state,
                    "languagesIsLoading",
                    false
                );


                state.languagesError =
                    normalizeError(
                        action.payload,
                        "Dasturlash tillarini yuklashda xato yuz berdi."
                    );


                // Old catalog saqlanadi.
            },


            // =================================================
            // TECHNOLOGIES
            // =================================================

            getTechnologiesStart: (
                state
            ) => {

                setLoading(
                    state,
                    "technologiesIsLoading",
                    true
                );


                state.technologiesError =
                    null;
            },


            getTechnologiesSuccess: (
                state,
                action
            ) => {

                setLoading(
                    state,
                    "technologiesIsLoading",
                    false
                );


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

                setLoading(
                    state,
                    "technologiesIsLoading",
                    false
                );


                state.technologiesError =
                    normalizeError(
                        action.payload,
                        "Texnologiyalarni yuklashda xato yuz berdi."
                    );


                // Old catalog saqlanadi.
            },


            // =================================================
            // CREATE PROBLEM
            // =================================================

            postProblemStart: (
                state
            ) => {

                setLoading(
                    state,
                    "createIsLoading",
                    true
                );


                state.createError =
                    null;


                state.error =
                    null;
            },


            postProblemSuccess: (
                state,
                action
            ) => {

                setLoading(
                    state,
                    "createIsLoading",
                    false
                );


                state.createError =
                    null;


                state.error =
                    null;


                const problem =
                    action.payload;


                // =========================================
                // Active paginated/filterlangan listga
                // ko‘r-ko‘rona unshift qilmaymiz.
                //
                // Aks holda:
                //
                // status=solved
                //
                // filter ichiga yangi pending problem
                // tushib qolishi mumkin.
                //
                // Detail cache sifatida saqlash xavfsiz.
                // =========================================

                if (
                    problem
                    &&
                    typeof problem ===
                        "object"
                    &&
                    problem.id !==
                        null
                    &&
                    problem.id !==
                        undefined
                ) {

                    state.problemDetail =
                        problem;
                }
            },


            postProblemFailure: (
                state,
                action
            ) => {

                setLoading(
                    state,
                    "createIsLoading",
                    false
                );


                const error =
                    normalizeError(
                        action.payload,
                        "Problem yaratishda xato yuz berdi."
                    );


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

                setLoading(
                    state,
                    "detailIsLoading",
                    true
                );


                state.detailError =
                    null;


                state.error =
                    null;


                // =========================================
                // Existing detail saqlanadi.
                //
                // Star / accept / refresh paytida
                // butun page yo‘qolib ketmasligi uchun.
                // =========================================
            },


            getProblemDetailSuccess: (
                state,
                action
            ) => {

                setLoading(
                    state,
                    "detailIsLoading",
                    false
                );


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

                setLoading(
                    state,
                    "detailIsLoading",
                    false
                );


                const error =
                    normalizeError(
                        action.payload,
                        "Problem ma’lumotlarini yuklashda xato yuz berdi."
                    );


                state.detailError =
                    error;


                state.error =
                    error;


                // =========================================
                // Old detailni o‘chirmaymiz.
                //
                // ProblemDetail component URL id bilan
                // current detail id ni tekshiradi.
                // =========================================
            },


            clearProblemDetail: (
                state
            ) => {

                state.problemDetail =
                    null;


                state.detailError =
                    null;


                state.error =
                    null;


                setLoading(
                    state,
                    "detailIsLoading",
                    false
                );
            },


            // =================================================
            // SILENT PROBLEM DETAIL REFRESH
            //
            // Background refresh uchun.
            //
            // Bu reducer:
            //
            // - detailIsLoading ga tegmaydi
            // - detailError ga tegmaydi
            // - global error ga tegmaydi
            // - global loadingga tegmaydi
            //
            // Yangi solution yaratilgandan keyin
            // statistics/countlarni yangilash uchun.
            // =================================================

            refreshProblemDetailSuccess: (
                state,
                action
            ) => {

                const payload =
                    action.payload;


                if (
                    !payload
                    ||
                    typeof payload !==
                        "object"
                    ||
                    Array.isArray(
                        payload
                    )
                ) {

                    return;
                }


                const currentProblemId =
                    state.problemDetail
                        ?.id;


                const incomingProblemId =
                    payload
                        ?.id;


                // =========================================
                // ROUTE SAFETY
                //
                // Eski background response boshqa
                // problem detailini overwrite qilmasin.
                // =========================================

                if (
                    currentProblemId !==
                        null
                    &&
                    currentProblemId !==
                        undefined
                    &&
                    incomingProblemId !==
                        null
                    &&
                    incomingProblemId !==
                        undefined
                    &&
                    !sameId(
                        currentProblemId,
                        incomingProblemId
                    )
                ) {

                    return;
                }


                state.problemDetail =
                    payload;
            },


            // =================================================
            // ADD STAR
            // =================================================

            postProblemStarStart: (
                state
            ) => {

                setLoading(
                    state,
                    "starIsLoading",
                    true
                );


                state.starError =
                    null;
            },


            postProblemStarSuccess: (
                state,
                action
            ) => {

                setLoading(
                    state,
                    "starIsLoading",
                    false
                );


                state.starError =
                    null;


                const payload =
                    action.payload
                    &&
                    typeof action.payload ===
                        "object"
                        ? action.payload
                        : {};


                const problemId =
                    getProblemIdFromPayload(
                        payload,
                        state
                    );


                const serverTotal =
                    getTotalStarsFromPayload(
                        payload
                    );


                updateProblemEverywhere(

                    state,

                    problemId,

                    (
                        current
                    ) => ({

                        star:
                            serverTotal

                            ??

                            (
                                nonNegativeNumber(
                                    current?.star,
                                    0
                                )

                                +

                                1
                            ),


                        // Current UI.

                        star_by_user:
                            true,


                        // Backend/legacy compatibility.

                        is_starred_by_user:
                            true,
                    })
                );
            },


            postProblemStarFailure: (
                state,
                action
            ) => {

                setLoading(
                    state,
                    "starIsLoading",
                    false
                );


                const error =
                    normalizeError(
                        action.payload,
                        "Star qo‘yishda xato yuz berdi."
                    );


                state.starError =
                    error;


                state.error =
                    error;
            },


            // =================================================
            // REMOVE STAR
            // =================================================

            deleteProblemStarStart: (
                state
            ) => {

                setLoading(
                    state,
                    "starIsLoading",
                    true
                );


                state.starError =
                    null;
            },


            deleteProblemStarSuccess: (
                state,
                action
            ) => {

                setLoading(
                    state,
                    "starIsLoading",
                    false
                );


                state.starError =
                    null;


                const payload =
                    action.payload
                    &&
                    typeof action.payload ===
                        "object"
                        ? action.payload
                        : {};


                const problemId =
                    getProblemIdFromPayload(
                        payload,
                        state
                    );


                const serverTotal =
                    getTotalStarsFromPayload(
                        payload
                    );


                updateProblemEverywhere(

                    state,

                    problemId,

                    (
                        current
                    ) => ({

                        star:
                            serverTotal

                            ??

                            Math.max(

                                0,

                                nonNegativeNumber(
                                    current?.star,
                                    0
                                )

                                -

                                1
                            ),


                        star_by_user:
                            false,


                        is_starred_by_user:
                            false,
                    })
                );
            },


            deleteProblemStarFailure: (
                state,
                action
            ) => {

                setLoading(
                    state,
                    "starIsLoading",
                    false
                );


                const error =
                    normalizeError(
                        action.payload,
                        "Starni olib tashlashda xato yuz berdi."
                    );


                state.starError =
                    error;


                state.error =
                    error;
            },


            // =================================================
            // ACCEPT SOLUTION
            // =================================================

            acceptSolutionStart: (
                state
            ) => {

                setLoading(
                    state,
                    "acceptSolutionIsLoading",
                    true
                );


                state.acceptSolutionError =
                    null;
            },


            acceptSolutionSuccess: (
                state,
                action
            ) => {

                setLoading(
                    state,
                    "acceptSolutionIsLoading",
                    false
                );


                state.acceptSolutionError =
                    null;


                const payload =
                    action.payload
                    &&
                    typeof action.payload ===
                        "object"
                        ? action.payload
                        : {};


                const problemId =
                    getProblemIdFromPayload(
                        payload,
                        state
                    );


                // =========================================
                // Backend full ProblemDetail qaytarmaydi.
                //
                // Shu sabab state.problemDetail =
                // action.payload QILMAYMIZ.
                //
                // Faqat patch.
                // =========================================

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


                const optionalKeys = [

                    "correct_answer_id",

                    "solution_id",

                    "bounty_reward",

                    "best_solution_reward",

                    "total_reward",
                ];


                optionalKeys.forEach(
                    (
                        key
                    ) => {

                        if (
                            payload[key] !==
                                null
                            &&
                            payload[key] !==
                                undefined
                        ) {

                            patch[key] =
                                payload[key];
                        }
                    }
                );


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

                setLoading(
                    state,
                    "acceptSolutionIsLoading",
                    false
                );


                const error =
                    normalizeError(
                        action.payload,
                        "Yechimni qabul qilishda xato yuz berdi."
                    );


                state.acceptSolutionError =
                    error;


                state.error =
                    error;
            },


            // =================================================
            // SIMILAR PROBLEMS
            //
            // Similar loading global isLoadingga
            // ataylab ta’sir qilmaydi.
            //
            // Aks holda SimilarProblems request detail
            // sahifani global loadingga qaytarishi mumkin.
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


                // Old similar data saqlanadi.
            },


            // =================================================
            // CLEAR PROBLEMS
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


                setLoading(
                    state,
                    "listIsLoading",
                    false
                );
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


                setLoading(
                    state,
                    "myProblemsIsLoading",
                    false
                );
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

            resetProblemState: () => {

                return createInitialState();
            },
        },
    });


// =========================================================
// ACTIONS
// =========================================================

export const {

    // Popular.

    getPopularProblemStart,

    getPopularProblemSuccess,

    getPopularProblemFailure,


    // Problems.

    getProblemStart,

    getProblemSuccess,

    getProblemFailure,


    // My problems.

    getMyProblemStart,

    getMyProblemSuccess,

    getMyProblemFailure,


    // Languages.

    getLanguagesStart,

    getLanguagesSuccess,

    getLanguagesFailure,


    // Technologies.

    getTechnologiesStart,

    getTechnologiesSuccess,

    getTechnologiesFailure,


    // Create.

    postProblemStart,

    postProblemSuccess,

    postProblemFailure,


    // Detail.

    getProblemDetailStart,

    getProblemDetailSuccess,

    getProblemDetailFailure,

    refreshProblemDetailSuccess,

    clearProblemDetail,


    // Problem star.

    postProblemStarStart,

    postProblemStarSuccess,

    postProblemStarFailure,

    deleteProblemStarStart,

    deleteProblemStarSuccess,

    deleteProblemStarFailure,


    // Accept solution.

    acceptSolutionStart,

    acceptSolutionSuccess,

    acceptSolutionFailure,


    // Similar.

    similarProblemsStart,

    similarProblemsSuccess,

    similarProblemsFailure,


    // Clear/reset.

    clearProblems,

    clearMyProblems,

    clearSimilarProblems,

    clearProblemErrors,

    resetProblemState,

} = problemSlice.actions;


// =========================================================
// LEGACY COMPATIBILITY
//
// Hozirgi eski componentlar birdan buzilmasligi uchun.
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
) => {

    return state.problem;
};


export const selectProblems = (
    state
) => {

    return state.problem.problems;
};


export const selectProblemDetail = (
    state
) => {

    return state.problem.problemDetail;
};


export const selectProblemLanguages = (
    state
) => {

    return state.problem.languages;
};


export const selectProblemTechnologies = (
    state
) => {

    return state.problem.technologies;
};


export const selectSimilarProblems = (
    state
) => {

    return state.problem.similarProblems;
};


// =========================================================
// LIST META SELECTOR
// =========================================================

export const selectProblemListMeta = (
    state
) => {

    return {

        count:
            state.problem.count,

        next:
            state.problem.next,

        previous:
            state.problem.previous,
    };
};


// =========================================================
// LOADING SELECTOR
// =========================================================

export const selectProblemLoading = (
    state
) => {

    const problem =
        state.problem;


    return {

        isLoading:
            problem.isLoading,

        listIsLoading:
            problem.listIsLoading,

        myProblemsIsLoading:
            problem.myProblemsIsLoading,

        popularIsLoading:
            problem.popularIsLoading,

        detailIsLoading:
            problem.detailIsLoading,

        createIsLoading:
            problem.createIsLoading,

        languagesIsLoading:
            problem.languagesIsLoading,

        technologiesIsLoading:
            problem.technologiesIsLoading,

        starIsLoading:
            problem.starIsLoading,

        acceptSolutionIsLoading:
            problem.acceptSolutionIsLoading,

        similarIsLoading:
            problem.similarIsLoading,
    };
};


export default problemSlice.reducer;