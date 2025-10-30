import axios from 'axios'

// To'liq URL o'rniga faqat yo'lni ishlatamiz.
// React proksi '/api' bilan boshlangan so'rovlarni "http://127.0.0.1:8000" ga yo'naltiradi.
axios.defaults.baseURL = "/api"
axios.defaults.withCredentials = true

export default axios