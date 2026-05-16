// api.js
import axios from 'axios'
import { API_URL } from "../services/config";

const instance = axios.create({
    // baseURL: "/api",
    baseURL: API_URL,
    
    withCredentials: true, // Cookie-larni yuborish uchun
    
    // CSRF sozlamalari:
    xsrfCookieName: 'csrftoken', // Django tomonidan o'rnatilgan cookie nomi
    xsrfHeaderName: 'X-CSRFToken', // Django kutayotgan Header nomi
});

export default instance;