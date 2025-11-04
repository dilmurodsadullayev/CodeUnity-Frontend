// timeAgo.js

function timeAgo(createdAt) {
    const now = new Date();
    const created = new Date(createdAt);

    const diffMs = now - created;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffMonths / 12);

    if (diffYears > 0) {
        return diffYears === 1 ? "1 yil oldin" : `${diffYears} yil oldin`;
    } else if (diffMonths > 0) {
        return diffMonths === 1 ? "1 oy oldin" : `${diffMonths} oy oldin`;
    } else if (diffDays > 0) {
        return diffDays === 1 ? "1 kun oldin" : `${diffDays} kun oldin`;
    } else if (diffHours > 0) {
        return diffHours === 1 ? "1 soat oldin" : `${diffHours} soat oldin`;
    } else if (diffMinutes > 0) {
        return diffMinutes === 1 ? "1 daqiqa oldin" : `${diffMinutes} daqiqa oldin`;
    } else {
        return "hozirgina";
    }
}

// Export qilish
export default timeAgo;
