// src/components/profile/profileHelpers.js

import UserImage from "../../assests/userImage.jpeg";

import {
    formatPrettyDate,
} from "../../utils/formatDate";


// =========================================================
// DEFAULT COVER
// =========================================================

export const DEFAULT_COVER =
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop";


// =========================================================
// FULL NAME
// =========================================================

export const getFullName = (
    firstName,
    lastName,
    username
) => {
    const name =
        `${firstName || ""} ${lastName || ""}`.trim();

    return (
        name
        ||
        username
        ||
        "No Name"
    );
};


// =========================================================
// URL
// =========================================================

export const formatUrl = (
    url
) => {
    if (
        !url
    ) {
        return null;
    }


    const value =
        String(
            url
        ).trim();


    if (
        !value
    ) {
        return null;
    }


    return (
        /^https?:\/\//i.test(
            value
        )
            ? value
            : `https://${value}`
    );
};


// =========================================================
// URL TEXT
// =========================================================

export const cleanUrlText = (
    url
) => {
    if (
        !url
    ) {
        return "Hali mavjud emas";
    }


    return String(
        url
    )
        .replace(
            /^https?:\/\//i,
            ""
        )
        .replace(
            /^www\./i,
            ""
        )
        .replace(
            /\/$/,
            ""
        );
};


// =========================================================
// GITHUB URL
// =========================================================

export const formatGithubUrl = (
    github
) => {
    if (
        !github
    ) {
        return null;
    }


    const value =
        String(
            github
        ).trim();


    if (
        !value
    ) {
        return null;
    }


    if (
        /^https?:\/\//i.test(
            value
        )
    ) {
        return value;
    }


    if (
        value.includes(
            "github.com"
        )
    ) {
        return (
            `https://${value}`
        );
    }


    return (
        `https://github.com/${value.replace(
            "@",
            ""
        )}`
    );
};


// =========================================================
// GITHUB TEXT
// =========================================================

export const normalizeGithubText = (
    github
) => {
    if (
        !github
    ) {
        return "Hali mavjud emas";
    }


    return String(
        github
    )
        .replace(
            /^https?:\/\//i,
            ""
        )
        .replace(
            /^www\./i,
            ""
        )
        .replace(
            /\/$/,
            ""
        );
};


// =========================================================
// SKILLS
// =========================================================

export const normalizeSkills = (
    skills
) => {
    if (
        !Array.isArray(
            skills
        )
    ) {
        return [];
    }


    return skills
        .map(
            (
                skill
            ) => {
                if (
                    typeof skill ===
                    "string"
                ) {
                    return skill;
                }


                return (
                    skill?.name
                    ||
                    skill?.title
                    ||
                    ""
                );
            }
        )
        .filter(
            Boolean
        );
};


// =========================================================
// SKILL LEVEL
// =========================================================

export const normalizeSkillLevel = (
    level
) => {
    if (
        !level
    ) {
        return null;
    }


    const lower =
        String(
            level
        )
            .trim()
            .toLowerCase();


    const map = {
        beginner:
            "Beginner",

        junior:
            "Junior",

        intermediate:
            "Intermediate",

        advanced:
            "Advanced",

        senior:
            "Senior",

        lead:
            "Lead / Tech Lead",

        expert:
            "Expert / Architect",
    };


    return (
        map[
            lower
        ]
        ||
        String(
            level
        )
    );
};


// =========================================================
// SKILL BADGE
// =========================================================

export const getSkillBadgeClass = (
    level
) => {
    const lower =
        String(
            level
            ||
            ""
        ).toLowerCase();


    if (
        lower.includes(
            "beginner"
        )
    ) {
        return (
            "border-blue-400/30 "
            +
            "bg-blue-500/10 "
            +
            "text-blue-300 "
            +
            "shadow-blue-500/10"
        );
    }


    if (
        lower.includes(
            "junior"
        )
    ) {
        return (
            "border-emerald-400/30 "
            +
            "bg-emerald-500/10 "
            +
            "text-emerald-300 "
            +
            "shadow-emerald-500/10"
        );
    }


    if (
        lower.includes(
            "intermediate"
        )
        ||
        lower.includes(
            "mid"
        )
    ) {
        return (
            "border-yellow-400/30 "
            +
            "bg-yellow-500/10 "
            +
            "text-yellow-300 "
            +
            "shadow-yellow-500/10"
        );
    }


    if (
        lower.includes(
            "senior"
        )
    ) {
        return (
            "border-red-400/30 "
            +
            "bg-red-500/10 "
            +
            "text-red-300 "
            +
            "shadow-red-500/10"
        );
    }


    if (
        lower.includes(
            "lead"
        )
    ) {
        return (
            "border-indigo-400/30 "
            +
            "bg-indigo-500/10 "
            +
            "text-indigo-300 "
            +
            "shadow-indigo-500/10"
        );
    }


    if (
        lower.includes(
            "expert"
        )
        ||
        lower.includes(
            "advanced"
        )
    ) {
        return (
            "border-purple-400/30 "
            +
            "bg-purple-500/10 "
            +
            "text-purple-300 "
            +
            "shadow-purple-500/10"
        );
    }


    return (
        "border-gray-500/30 "
        +
        "bg-gray-500/10 "
        +
        "text-gray-300 "
        +
        "shadow-gray-500/10"
    );
};


// =========================================================
// PROFILE VIEW MODEL
// =========================================================

export const buildProfileViewModel = ({
    profile,
    routeUsername,
    telegramProfile,
}) => {
    const skills =
        normalizeSkills(
            profile?.skills
        );


    return {
        profileImage:
            profile?.image
            ||
            UserImage,

        coverImage:
            profile?.cover_image
            ||
            DEFAULT_COVER,

        fullName:
            getFullName(
                profile?.first_name,
                profile?.last_name,
                profile?.username
            ),

        username:
            profile?.username
            ||
            routeUsername
            ||
            "",

        email:
            profile?.email
            ||
            null,

        position:
            profile?.position
            ||
            null,

        skillLevel:
            normalizeSkillLevel(
                profile?.skill_level
            ),

        rawSkillLevel:
            profile?.skill_level
            ||
            null,

        company:
            profile?.company
            ||
            null,

        rating:
            profile?.total_rating
            ??
            "0.00",

        fcoin:
            profile?.coins
            ??
            0,

        problemCount:
            profile?.problems_count
            ??
            0,

        solutionCount:
            profile?.solution_count
            ??
            0,

        projectsCount:
            profile?.projects_count
            ??
            0,

        location:
            profile?.address
            ||
            null,

        website:
            profile?.website_url
            ||
            null,

        github:
            profile?.github_url
            ||
            null,

        memberSince:
            formatPrettyDate(
                profile?.date_joined
            ),

        aboutMe:
            profile?.about_me
            ||
            "",

        skills,

        birthday:
            profile?.birthday
            ||
            profile?.birth_date
            ||
            null,

        telegramUsername:
            telegramProfile
                ?.telegram_username
            ||
            null,

        telegramLinked:
            Boolean(
                telegramProfile
                    ?.is_linked
            ),
    };
};