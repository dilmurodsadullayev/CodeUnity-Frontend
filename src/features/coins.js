import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    coins: [], 
    count: 0, 
    next: null,
    previous: null,
    error: null,
    // Paginatsiya uchun yangi maydonlar:
    currentPage: 1,  // Hozirgi sahifa raqami
    pageSize: 15,    // Har bir sahifadagi elementlar soni
};

export const CoinSlice = createSlice({
    name: 'coin',
    initialState,
    reducers: {
        
        // ... (getCoinStart o'zgarishsiz)
        getCoinStart: (state, action) => { // Bu yerga page va pageSize ni olishimiz mumkin
            state.isLoading = true;
            state.error = null; 
            // Agar so'rov boshlanganda page berilsa, uni state ga yozamiz
            if (action.payload && action.payload.page) {
                state.currentPage = action.payload.page;
            }
            if (action.payload && action.payload.pageSize) {
                state.pageSize = action.payload.pageSize;
            }
        },

        getCoinSuccess: (state, actions) => {
            const payload = actions.payload;
            state.isLoading = false;
            
            // Paginatsiyalangan javobni kutamiz: { count: N, next: '...', previous: '...', results: [...] }
            if (payload && Array.isArray(payload.results)) {
                state.coins = payload.results;
                state.count = payload.count || 0;
                state.next = payload.next;
                state.previous = payload.previous;
                // currentPage ni CoinService'ga yuborganimiz sababli, 
                // bu yerda uni API javobidan olish shart emas, chunki u getCoinStart'da yozilgan.
            } 
            // Agar API paginatsiya qilmasa (masalan, eski CoinHistoryAPI kabi sof massiv [{}, {}])
            else if (Array.isArray(payload)) {
                state.coins = payload;
                state.count = payload.length; 
                state.next = null;
                state.previous = null;
                state.currentPage = 1; // Massiv bo'lsa, bitta sahifa deb hisoblaymiz
            }
            
            state.error = null; 
        },

        // ... (getCoinFailure o'zgarishsiz)
        getCoinFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.coins = []; 
            state.count = 0;     
        },
    }
});

export const {
    getCoinStart,
    getCoinSuccess,
    getCoinFailure

} = CoinSlice.actions;

export default CoinSlice.reducer;