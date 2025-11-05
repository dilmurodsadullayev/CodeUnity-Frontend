import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // isLoading umumiy yuklanish holati uchun saqlanadi, lekin uni kamroq ishlatishga harakat qilamiz
    isLoading: false, 
    
    // ✅ YANGI: SimilarProblems uchun alohida yuklanish holati
    similarIsLoading: false, 
    similarError: null,

    popularProblems: [],
    problems: [],
    similarProblems : [],
    
    myProblems: [],
    myProblemsCount: 0,

    languages: [],
    problemDetail: null,
    count: 0,
    next: null,
    previous: null,
    error: null // Umumiy xato holatini saqlash uchun
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


        getMyProblemStart: state => {
            state.isLoading = true;
            state.error = null; // Yangi so'rov boshlanganda xatoni tozalash
        },
        getMyProblemSuccess: (state, actions) => {
            state.isLoading = false;
            // ✅ TO'G'RI: myProblems va myProblemsCount ni yangilash
            state.myProblems = actions.payload.results || [];
            state.myProblemsCount = actions.payload.count || 0; 
            state.next = actions.payload.next;
            state.previous = actions.payload.previous;
            state.error = null;
        },
        getMyProblemtFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            // ✅ TO'G'RI: myProblems va myProblemsCount ni tozalash
            state.myProblems = []; 
            state.myProblemsCount = 0;     
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


          // ⭐ YANGI: Yechimni qabul qilish uchun action'lar
        acceptSolutionStart: state => {
            state.isLoading = true;
            state.error = null;
        },
        acceptSolutionSuccess: (state, action) => {
                state.isLoading = false;
                // ⭐ Yangilangan problemDetail ni to'liq qabul qilish va saqlash
                // Taxmin: Server butun yangilangan ProblemDetail obyektini qaytaradi
                state.problemDetail = action.payload; 
                state.error = null;
            },
        acceptSolutionFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload || 'Yechimni qabul qilishda xato yuz berdi';
        },

       // ⭐ similarProblemsStart/Success/Failure da o'zgarish:
        similarProblemsStart: state => {
            state.similarIsLoading = true; // ✅ Faqat o'zining isLoading'ini o'zgartiradi
            state.similarError = null;
        },
        similarProblemsSuccess: (state, action) => {
            state.similarIsLoading = false; // ✅ Faqat o'zining isLoading'ini o'zgartiradi
            state.similarProblems = action.payload; 
            state.similarError = null;
        },
        similarProblemsFailure: (state, action) => {
            state.similarIsLoading = false; // ✅ Faqat o'zining isLoading'ini o'zgartiradi
            state.similarError = action.payload || "O'xshash muammoni yuklashda xato yuz berdi";
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

    getMyProblemStart,
    getMyProblemSuccess,
    getMyProblemtFailure,

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
    deleteProblemStarFailure,


    // ⭐ YANGI EXPORT
    acceptSolutionStart, 
    acceptSolutionSuccess, 
    acceptSolutionFailure,

    // SimilarProblems
    similarProblemsStart,
    similarProblemsSuccess,
    similarProblemsFailure

} = problemSlice.actions;

export default problemSlice.reducer;