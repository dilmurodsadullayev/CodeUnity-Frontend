// src/utils/getBirthdayStatus.js


// =========================================================
// GET BIRTHDAY STATUS
//
// Bugun
// Ertaga
// 5 kundan keyin
// Bu yil o‘tib ketgan
// =========================================================

const getBirthdayStatus = (
    birthday
) => {
    if (
        !birthday
    ) {
        return null;
    }


    const today =
        new Date();


    const birthDate =
        new Date(
            birthday
        );


    if (
        Number.isNaN(
            birthDate.getTime()
        )
    ) {
        return null;
    }


    // =====================================================
    // NORMALIZE TODAY
    // =====================================================

    const todayStart =
        new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );


    // =====================================================
    // BIRTHDAY THIS YEAR
    // =====================================================

    const birthdayThisYear =
        new Date(
            today.getFullYear(),
            birthDate.getMonth(),
            birthDate.getDate()
        );


    // =====================================================
    // DIFFERENCE
    // =====================================================

    const diffMs =
        birthdayThisYear.getTime()
        -
        todayStart.getTime();


    const diffDays =
        Math.round(
            diffMs
            /
            (
                1000
                *
                60
                *
                60
                *
                24
            )
        );


    if (
        diffDays === 0
    ) {
        return "Bugun";
    }


    if (
        diffDays === 1
    ) {
        return "Ertaga";
    }


    if (
        diffDays > 1
    ) {
        return (
            `${diffDays} kundan keyin`
        );
    }


    return "Bu yil o‘tib ketgan";
};


// =========================================================
// EXPORT
// =========================================================

export default getBirthdayStatus;