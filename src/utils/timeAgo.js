// src/utils/timeAgo.js


// =========================================================
// TIME AGO
// =========================================================

const timeAgo = (
    createdAt
) => {
    if (
        !createdAt
    ) {
        return "";
    }


    const now =
        new Date();


    const created =
        new Date(
            createdAt
        );


    // =====================================================
    // INVALID DATE
    // =====================================================

    if (
        Number.isNaN(
            created.getTime()
        )
    ) {
        return "";
    }


    // =====================================================
    // DIFFERENCE
    // =====================================================

    const diffMs =
        now.getTime()
        -
        created.getTime();


    // Backend/server time ozgina oldinda bo'lsa
    // "-1 daqiqa oldin" kabi noto'g'ri natija chiqmasin.

    if (
        diffMs <= 0
    ) {
        return "hozirgina";
    }


    const diffSeconds =
        Math.floor(
            diffMs / 1000
        );


    const diffMinutes =
        Math.floor(
            diffSeconds / 60
        );


    const diffHours =
        Math.floor(
            diffMinutes / 60
        );


    const diffDays =
        Math.floor(
            diffHours / 24
        );


    const diffMonths =
        Math.floor(
            diffDays / 30
        );


    const diffYears =
        Math.floor(
            diffDays / 365
        );


    // =====================================================
    // YEARS
    // =====================================================

    if (
        diffYears > 0
    ) {
        return (
            diffYears === 1
                ? "1 yil oldin"
                : `${diffYears} yil oldin`
        );
    }


    // =====================================================
    // MONTHS
    // =====================================================

    if (
        diffMonths > 0
    ) {
        return (
            diffMonths === 1
                ? "1 oy oldin"
                : `${diffMonths} oy oldin`
        );
    }


    // =====================================================
    // DAYS
    // =====================================================

    if (
        diffDays > 0
    ) {
        return (
            diffDays === 1
                ? "1 kun oldin"
                : `${diffDays} kun oldin`
        );
    }


    // =====================================================
    // HOURS
    // =====================================================

    if (
        diffHours > 0
    ) {
        return (
            diffHours === 1
                ? "1 soat oldin"
                : `${diffHours} soat oldin`
        );
    }


    // =====================================================
    // MINUTES
    // =====================================================

    if (
        diffMinutes > 0
    ) {
        return (
            diffMinutes === 1
                ? "1 daqiqa oldin"
                : `${diffMinutes} daqiqa oldin`
        );
    }


    // =====================================================
    // SECONDS
    // =====================================================

    if (
        diffSeconds >= 10
    ) {
        return (
            `${diffSeconds} soniya oldin`
        );
    }


    return "hozirgina";
};


// =========================================================
// EXPORT
// =========================================================

export default timeAgo;