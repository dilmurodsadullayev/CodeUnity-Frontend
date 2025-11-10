// CommentService.js
import axios from './api'

const ProfileService = {
    async getProfile() { // page va pageSize parametrlarni qabul qilamiz
        try {
            // URL ga page va page_size query parametrlarni qo'shamiz
            const { data } = await axios.get(`/users/profile/`, { withCredentials: true });
            console.log("Bu Profile ni malumoti ", data.results);
            return data; // API javobining butunini qaytaramiz (count, next, previous, results)
        } catch (error) {
            console.error("Profile olishda xato:", error.response || error.message);
            throw error; // Xatoni yuqoriga uzatish
        }
    },

    async updateProfile(dataToSend) {
    try {
        const { data } = await axios.patch(`/users/profile/`, dataToSend, { withCredentials: true })
        
        // Eslatma: Backend URL'ni `/users/profile/update/` ga o'zgartirdim, 
        // chunki siz ProfileUpdateAPI uchun shunday URL belgilagandingiz.
        
        console.log("✅ ProfileData yuborildi:", data)
        return data
        } catch (error) {
            if (error.response) {
                // DRF xatolarini to'g'riroq chiqarish
                console.error("❌ Server xatosi (Data/Status):", error.response.data, error.response.status)
                // Error'ni tashlashdan oldin xato ma'lumotini to'g'ridan-to'g'ri ulash
                const detailError = error.response.data?.detail || JSON.stringify(error.response.data) || "Serverdan noma'lum xato";
                throw new Error(detailError);
            } else if (error.request) {
                console.error("❌ So‘rov yuborildi, lekin javob kelmadi:", error.request)
                throw new Error("Server bilan bog'lanishda xato. Internet aloqasini tekshiring.");
            } else {
                console.error("❌ So‘rov sozlanishda xato:", error.message)
                throw new Error(`So‘rovni tayyorlashda xato: ${error.message}`);
            }
        }
    },


    async updateCoverImage(formData) {
        try {
            // FormData bilan ishlashda content-type: multipart/form-data bo'ladi.
            // Axios uni avtomatik tarzda qo'shishi uchun, 
            // siz o'zingiz qo'lda "Content-Type: undefined" kabi narsani o'rnatmasligingiz kerak.
            const { data } = await axios.patch(`/users/profile/cover-image/update/`, formData, { 
                withCredentials: true,
                headers: {
                    // Bu yerda o'rnatish shart emas, chunki FormData ishlatilyapti.
                    // 'Content-Type': 'multipart/form-data'
                }
            });
            console.log("✅ Cover Image yuborildi:", data);
            return data;
                } catch (error) {
                    // ... Oldingi xato qaytarish mantiqini qo'shing
                    if (error.response) {
                        const detailError = error.response.data?.detail || JSON.stringify(error.response.data) || "Serverdan noma'lum xato";
                        throw new Error(detailError);
                    } else {
                        throw new Error("Fon rasmini yangilashda kutilmagan xato.");
                    }
                }
            }
};

    


export default ProfileService;