// FeedbackService.js
import axios from './api'; // './api' faylingizda axios instansi to'g'ri sozlangan deb hisoblaymiz

const FeedbackService = {
    // API'ning asosiy URL'ini saqlash, agar kerak bo'lsa
    // Hozirda sizning axios instansingizda allaqachon base URL bor deb taxmin qilaman
    // Shuning uchun bu yerda alohida BASEURL aniqlashga hojat yo'q
    // Agar './api' ichida base URL o'rnatilmagan bo'lsa, uni bu yerda yoki './api' da o'rnating.

    async getFeedbacks() {
        try {
            const { data } = await axios.get('/users/feedbacks/', { withCredentials: true });
            return data;
        } catch (error) {
            this._handleError(error, "Feedback'larni olishda");
            throw error; // Xatoni yuqoriga uzatish
        }
    },

    async postFeedback(feedbackData) {
        try {
            const { data } = await axios.post('/users/feedbacks/', feedbackData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Fayl yuklash uchun kerak
                },
                withCredentials: true,
            });
            console.log("✅ Feedback muvaffaqiyatli yuborildi:", data);
            return data;
        } catch (error) {
            this._handleError(error, "Feedback'ni yuborishda");
            throw error;
        }
    },

    async updateFeedback(feedbackId, feedbackData) {
        try {
            // PATCH so'rovi feedbackni ID bo'yicha yangilaydi
            const { data } = await axios.patch(`/users/feedback/${feedbackId}/edit/`, feedbackData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Fayl yuklash uchun kerak
                },
                withCredentials: true,
            });
            console.log(`✅ Feedback ID ${feedbackId} muvaffaqiyatli tahrirlandi:`, data);
            return data;
        } catch (error) {
            this._handleError(error, `Feedback ID ${feedbackId} ni tahrirlashda`);
            throw error;
        }
    },

    // Umumiy xato ishlov berish funksiyasi
    _handleError(error, context = "So'rovda") {
        if (error.response) {
            console.error(`❌ ${context} server xatosi:`, error.response.data, `Status: ${error.response.status}`);
            // Serverdan kelgan xabar bo'lsa, uni chiqarish
            throw new Error(error.response.data.detail || error.response.data.message || 'Serverdan xato javob keldi.');
        } else if (error.request) {
            console.error(`❌ ${context} so‘rov yuborildi, lekin javob kelmadi:`, error.request);
            throw new Error('Serverga ulanib bo‘lmadi. Internet aloqangizni tekshiring.');
        } else {
            console.error(`❌ ${context} so‘rov sozlanishda xato:`, error.message);
            throw new Error('So‘rovni tayyorlashda kutilmagan xato yuz berdi.');
        }
    },

    deleteFeedback: async (feedbackId) => {
        try {
            const response = await axios.delete(`/users/feedback/${feedbackId}/edit/`, { withCredentials: true });
            console.log("✅ Feedback o'chirildi:", response.data);
            return response.data;
        } catch (error) {
            // Umumiy xato ishlov berish funksiyasini chaqirish
            FeedbackService._handleError(error, `Feedback ID ${feedbackId} ni o'chirishda`);
            throw error;
        }
    }
};

export default FeedbackService;