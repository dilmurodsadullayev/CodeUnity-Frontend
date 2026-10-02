// src/utils/formatPrettyDate.js


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
// FORMAT PRETTY DATE
//
// 2026-10-02T16:05:00
//
// ->
//
// 02 oktabr 2026, 16:05
// =========================================================

const formatPrettyDate = (
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


    const hours =
        String(
            date.getHours()
        ).padStart(
            2,
            "0"
        );


    const minutes =
        String(
            date.getMinutes()
        ).padStart(
            2,
            "0"
        );


    return (
        `${day} ${month} ${year}, ${hours}:${minutes}`
    );
};


// =========================================================
// EXPORT
// =========================================================

export default formatPrettyDate;