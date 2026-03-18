// api.js
import axios from 'axios'

const instance = axios.create({
    baseURL: "/api",
    withCredentials: true, // Cookie-larni yuborish uchun
    
    // CSRF sozlamalari:
    xsrfCookieName: 'csrftoken', // Django tomonidan o'rnatilgan cookie nomi
    xsrfHeaderName: 'X-CSRFToken', // Django kutayotgan Header nomi
});

export default instance;