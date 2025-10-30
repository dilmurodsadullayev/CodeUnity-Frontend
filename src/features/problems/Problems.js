import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    popularProblems: [],
    problems: [], // Doim massiv bo'lishi kerak
    languages: [],
    problemDetail: null,
    count: 0, // Doim raqam bo'lishi kerak
    next: null,
    previous: null,
    error: null // Xato holatini saqlash uchun
};

export const problemSlice = createSlice({
    name: 'problem',
    initialState,
    reducers: {
        getPopularProblemStart: state => {
            state.isLoading = true;
            state.error = null;
        },
        getPopularProblemSuccess: (state, actions) => {
            state.isLoading = false;
            state.popularProblems = actions.payload;
            state.error = null;
        },
        getPopularProblemtFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },

        getProblemStart: state => {
            state.isLoading = true;
            state.error = null; // Yangi so'rov boshlanganda xatoni tozalash
        },
        getProblemSuccess: (state, actions) => {
            state.isLoading = false;
            // API javobi `results` va `count` kabi xususiyatlarga ega bo'lishi kutiladi
            state.problems = actions.payload.results || []; // Agar results bo'lmasa, bo'sh massivga o'rnatamiz
            state.count = actions.payload.count || 0;     // Agar count bo'lmasa, 0 ga o'rnatamiz
            state.next = actions.payload.next;
            state.previous = actions.payload.previous;
            state.error = null; // Muvaffaqiyatli bo'lsa xatoni tozalash
        },
        getProblemtFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.problems = []; // Xato bo'lganda ham problems ni bo'sh massivga o'rnatish
            state.count = 0;     // count ni ham 0 ga o'rnatish
        },

        getLanguagesStart: state => {
            state.isLoading = true;
            state.error = null;
        },
        getLanguagesSuccess: (state, actions) => {
            state.isLoading = false;
            state.languages = actions.payload;
            state.error = null;
        },
        getLanguagesFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },

        postProblemStart: state => {
            state.isLoading = true;
            state.error = null;
        },
        posProblemtSuccess: (state) => {
            state.isLoading = false;
            state.error = null;
        },
        postProblemFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload || 'Error posting problem';
        },

        getProblemDetailStart: state => {
            state.isLoading = true;
            state.error = null;
        },
        getProblemDetailSuccess: (state, actions) => {
            state.isLoading = false;
            state.problemDetail = actions.payload;
            state.error = null;
        },
        getProblemDetailFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },

        postProblemStarStart: state => {
            state.isLoading = true;
            state.error = null;
        },
        postProblemStarSuccess: (state, action) => {
            state.isLoading = false;
            if (state.problemDetail) {
                state.problemDetail.star = action.payload.star;
            }
            state.error = null;
        },
        postProblemStarFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload || 'Error adding star';
        },

        deleteProblemStarStart: state => {
            state.isLoading = true;
            state.error = null;
        },
        deleteProblemStarSuccess: (state, action) => {
            state.isLoading = false;
            if (state.problemDetail) {
                state.problemDetail.star = action.payload.star;
            }
            state.error = null;
        },
        deleteProblemStarFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload || 'Error removing star';
        },
    }
});

export const {
    getPopularProblemStart,
    getPopularProblemtFailure,
    getPopularProblemSuccess,
    getProblemStart,
    getProblemSuccess,
    getProblemtFailure,
    getLanguagesStart,
    getLanguagesSuccess,
    getLanguagesFailure,
    getProblemDetailStart,
    getProblemDetailSuccess,
    getProblemDetailFailure,

    postProblemStarStart,
    postProblemStarSuccess,
    postProblemStarFailure,

    deleteProblemStarStart,
    deleteProblemStarSuccess,
    deleteProblemStarFailure
} = problemSlice.actions;

export default problemSlice.reducer;