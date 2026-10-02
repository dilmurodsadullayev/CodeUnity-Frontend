// src/utils/formatBirthday.js


const MONTHS = [
    "yanvar",
    "fevral",
    "mart",
    "aprel",
    "may",
    "iyun",
    "iyul",
    "avgust",
    "sentabr",
    "oktabr",
    "noyabr",
    "dekabr",
];


// =========================================================
// FORMAT BIRTHDAY
//
// 2004-06-23
//
// ->
//
// 23 iyun 2004
// =========================================================

const formatBirthday = (
    isoString
) => {
    if (
        !isoString
    ) {
        return "";
    }


    const date =
        new Date(
            isoString
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "";
    }


    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );


    const month =
        MONTHS[
            date.getMonth()
        ];


    const year =
        date.getFullYear();


    return (
        `${day} ${month} ${year}`
    );
};


// =========================================================
// EXPORT
// =========================================================

export default formatBirthday;