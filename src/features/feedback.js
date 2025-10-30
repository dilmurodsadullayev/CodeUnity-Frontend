import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    feedbacks: [], // Doim massiv bo'lishi kerak
    languages: [], // Agar bu slice'da ishlatilmasa, olib tashlashingiz mumkin
    userDetail: null, // Agar bu slice'da ishlatilmasa, olib tashlashingiz mumkin
    count: 0,
    next: null,
    previous: null,
    error: null // Xato holatini saqlash uchun
};

export const FeedbackSlice = createSlice({
    name: 'feedback',
    initialState,
    reducers: {
        getFeedbackStart: state => {
            state.isLoading = true;
            state.error = null; // Yangi so'rov boshlanganda xatoni tozalash
        },
        getFeedbackSuccess: (state, action) => {
            state.isLoading = false;
            // Agar API'dan kelgan ma'lumotlar to'g'ridan-to'g'ri massiv bo'lsa, payloadni o'zini ishlating.
            // Agar `results` propertysi ichida kelayotgan bo'lsa, `action.payload.results` qiling.
            state.feedbacks = action.payload.results || action.payload || [];
            state.count = action.payload.count !== undefined ? action.payload.count : state.feedbacks.length;
            state.next = action.payload.next !== undefined ? action.payload.next : null;
            state.previous = action.payload.previous !== undefined ? action.payload.previous : null;
            state.error = null; // Muvaffaqiyatli bo'lsa xatoni tozalash
        },
        getFeedbackFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.feedbacks = []; // Xato bo'lganda ham feedbacks ni bo'sh massivga o'rnatish
            state.count = 0;     // count ni ham 0 ga o'rnatish
            state.next = null;
            state.previous = null;
        },

        postFeedbackStart: state => {
            state.isLoading = true;
            state.error = null;
        },
        postFeedbackSuccess: (state, action) => {
            state.isLoading = false;
            // Yangi yaratilgan feedbackni massivning boshiga qo'shamiz
            state.feedbacks.unshift(action.payload);
            state.count += 1; // Countni oshiramiz
            state.error = null;
        },
        postFeedbackFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload || 'Error posting Feedback';
        },

        // ---------- Yangilash (Update) uchun Reducers ----------
        updateFeedbackStart: state => {
            state.isLoading = true;
            state.error = null;
        },
        updateFeedbackSuccess: (state, action) => {
            state.isLoading = false;
            // action.payload mavjudligini tekshirish
            if (action.payload && action.payload.id !== undefined) {
                const index = state.feedbacks.findIndex(
                    feedback => feedback.id === action.payload.id
                );
                if (index !== -1) {
                    state.feedbacks[index] = action.payload;
                }
            } else {
                console.warn("updateFeedbackSuccess: payloadda feedback obyekti yoki ID topilmadi.", action.payload);
                // Xato yuz berganini bildirishingiz yoki boshqa logikani qo'shishingiz mumkin
            }
            state.error = null;
        },
        updateFeedbackFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload || 'Error updating Feedback';
        },
        // ----------------------------------------------------

        // ---------- O'chirish (Delete) uchun Reducers ----------
        deleteFeedbackStart: state => {
            state.isLoading = true;
            state.error = null;
        },
        deleteFeedbackSuccess: (state, action) => {
            state.isLoading = false;
            // action.payload bu yerda o'chirilgan feedbackning ID'si bo'lishi kutiladi
            state.feedbacks = state.feedbacks.filter(
                feedback => feedback.id !== action.payload
            );
            state.count -= 1; // Countni kamaytiramiz
            state.error = null;
        },
        deleteFeedbackFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload || 'Error deleting Feedback';
        },
        // ----------------------------------------------------
    }
});

export const {
    getFeedbackStart,
    getFeedbackSuccess,
    getFeedbackFailure,
    postFeedbackStart,
    postFeedbackSuccess,
    postFeedbackFailure,
    updateFeedbackStart,
    updateFeedbackSuccess,
    updateFeedbackFailure,
    deleteFeedbackStart,   // Yangi action'lar
    deleteFeedbackSuccess, // Yangi action'lar
    deleteFeedbackFailure, // Yangi action'lar
} = FeedbackSlice.actions;

export default FeedbackSlice.reducer;