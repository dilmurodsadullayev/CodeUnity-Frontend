import axios from './api'

const CoinService = {
    // page va pageSize parametrlarni qabul qilamiz
    async getCoins(page = 1, pageSize = 15) { 
        try {
            // URL ga page va page_size query parametrlarni qo'shamiz
            const { data } = await axios.get(
                `/coins/`, 
                { 
                    params: { // Query parametrlarni params orqali uzatish
                        page: page,
                        page_size: pageSize
                    },
                    withCredentials: true 
                }
            );
            console.log("Bu Coin malumoti ", data);
            return data; // API javobining butunini qaytaramiz (count, next, previous, results)
        } catch (error) {
            console.error("Coin olishda xato:", error.response || error.message);
            throw error; // Xatoni yuqoriga uzatish
        }
    },
    
}

export default CoinService;