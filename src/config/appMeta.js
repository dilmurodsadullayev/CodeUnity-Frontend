// src/config/appMeta.js


// =========================================================
// HELPERS
// =========================================================

const normalizeVersion = (
    value
) => {
    const version =
        String(
            value ||
            ""
        ).trim();


    if (!version) {
        return "v1.0.0";
    }


    return version
        .toLowerCase()
        .startsWith("v")
            ? version
            : `v${version}`;
};


// =========================================================
// APPLICATION
// =========================================================

export const APP_NAME =
    process.env.REACT_APP_NAME ||
    "F.Society";


export const APP_FULL_NAME =
    process.env.REACT_APP_FULL_NAME ||
    "Fix Society";


export const APP_DESCRIPTION =
    process.env.REACT_APP_DESCRIPTION ||
    (
        "Developerlar muammolarni birgalikda yechadigan, "
        + "tajriba ulashadigan, portfolio quradigan va "
        + "jamiyatdagi hissasi orqali rivojlanadigan platforma."
    );


// =========================================================
// LOGO
// =========================================================
//
// public/f_society.png
//
// public papkasidagi faylga React'da:
// /f_society.png
//
// ko'rinishida murojaat qilinadi.
// =========================================================

export const APP_LOGO =
    process.env.REACT_APP_LOGO ||
    "/f_society.png";


// =========================================================
// VERSION
// =========================================================

export const APP_VERSION =
    normalizeVersion(
        process.env.REACT_APP_VERSION
    );


export const RELEASE_CHANNEL =
    String(
        process.env.REACT_APP_RELEASE_CHANNEL ||
        "beta"
    )
        .trim()
        .toLowerCase();


// =========================================================
// PROJECT DATE
// =========================================================

export const APP_CREATED_YEAR =
    Number(
        process.env.REACT_APP_CREATED_YEAR ||
        2025
    );


// =========================================================
// DEVELOPER
// =========================================================

export const DEVELOPER_NAME =
    process.env.REACT_APP_DEVELOPER_NAME ||
    "DimoDev";


export const DEVELOPER_URL =
    process.env.REACT_APP_DEVELOPER_URL ||
    "";


// =========================================================
// SOCIAL LINKS
// =========================================================

export const GITHUB_URL =
    process.env.REACT_APP_GITHUB_URL ||
    "https://github.com/dilmurodsadullayev/CodeUnity-Frontend";


export const TELEGRAM_URL =
    process.env.REACT_APP_TELEGRAM_URL ||
    "https://t.me/FixSocietybot";


export const LINKEDIN_URL =
    process.env.REACT_APP_LINKEDIN_URL ||
    "";


// =========================================================
// POWERED BY
// =========================================================

export const POWERED_BY = [
    {
        key:
            "react",

        name:
            "React",

        url:
            "https://react.dev/",
    },

    {
        key:
            "django",

        name:
            "Django",

        url:
            "https://www.djangoproject.com/",
    },

    {
        key:
            "tailwind",

        name:
            "Tailwind CSS",

        url:
            "https://tailwindcss.com/",
    },
];