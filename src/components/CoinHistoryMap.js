// src/constants/CoinHistoryMap.js

import { 
    faPenNib, 
    faCrown, 
    faStar, 
    faQuestionCircle, 
    faCalendarDay, 
    faRocket, 
    faGift, 
    faCheckCircle, 
    faBolt, 
    faThumbsUp, 
    faCommentDots, 
    faShoppingCart, 
    faEllipsisH,
    faTrophy, // Bonus: Musobaqa uchun
    faDollarSign, // Bonus: Umuiy coin
} from '@fortawesome/free-solid-svg-icons';

export const COIN_STATUS_MAP = {
    // Topilgan (Earned)
    problem_response: { icon: faPenNib, text: "Javob yozish", type: 'earn', color: 'text-green-400' },
    best_solution: { icon: faCrown, text: "Eng Yaxshi Yechim deb topildi", type: 'earn', color: 'text-yellow-400' },
    problem_response_answer: { icon: faStar, text: "Olingan yulduzcha (⭐)", type: 'earn', color: 'text-green-400' },
    problem_upload: { icon: faQuestionCircle, text: "Savol berish", type: 'earn', color: 'text-green-400' },
    daily_login: { icon: faCalendarDay, text: "Har kuni kirish bonusi (Daily Bonus)", type: 'earn', color: 'text-green-400' },
    project_upload: { icon: faRocket, text: "Yangi loyiha yuklandi", type: 'earn', color: 'text-green-400' },
    earned: { icon: faGift, text: "Boshqalardan sovg'a/Tip olindi", type: 'earn', color: 'text-green-400' },
    problem_solved: { icon: faCheckCircle, text: "Problem yechildi", type: 'earn', color: 'text-green-400' },
    fast_solution: { icon: faBolt, text: "Tezkor yechim uchun", type: 'earn', color: 'text-green-400' },
    post_like: { icon: faThumbsUp, text: "Postga like berildi", type: 'earn', color: 'text-green-400' },
    comment: { icon: faCommentDots, text: "Problemga comment yozish", type: 'earn', color: 'text-green-400' },
    
    // Sarflangan (Spent)
    spent: { icon: faShoppingCart, text: "Xarid qilingan narsa", type: 'spend', color: 'text-purple-400' },
    other: { icon: faEllipsisH, text: "Boshqa operatsiya", type: 'spend', color: 'text-gray-400' }, 
};

// Qo'shimcha ikonka (masalan, umumiy coin balansi uchun)
export const UTILITY_ICONS = {
    COIN_BALANCE: faDollarSign, 
    TROPHY: faTrophy,
};