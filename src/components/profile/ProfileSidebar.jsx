// src/components/profile/ProfileSidebar.jsx

import React from "react";

import {
    Cake,
    ExternalLink,
    Github,
    Link as LinkIcon,
    Mail,
    MapPin,
    Send,
    Terminal,
    UserRound,
} from "lucide-react";

import {
    formatBirthday,
} from "../../utils/formatDate";

import {
    getTechColorClass,
} from "../../utils/colorUtils";

import ProfileBadges from "./ProfileBadges";

import {
    cleanUrlText,
    formatGithubUrl,
    formatUrl,
    normalizeGithubText,
} from "./profileHelpers";


// =========================================================
// EMPTY
// =========================================================

const EmptyValue = ({
    children = "Hali mavjud emas",
}) => {
    return (
        <span
            className="
                text-gray-500
            "
        >
            {children}
        </span>
    );
};


// =========================================================
// SIDEBAR ROW
// =========================================================

const SidebarRow = ({
    icon: Icon,
    label,
    children,
    iconClass = "text-indigo-300",
}) => {
    return (
        <li
            className="
                flex
                items-start

                gap-3

                rounded-xl

                border
                border-transparent

                p-2.5

                transition-all

                hover:border-gray-700/70
                hover:bg-gray-900/30
            "
        >
            <div
                className={`
                    mt-0.5

                    flex
                    h-8
                    w-8

                    shrink-0

                    items-center
                    justify-center

                    rounded-xl

                    bg-gray-900/60

                    ${iconClass}
                `}
            >
                <Icon
                    size={17}
                />
            </div>


            <div
                className="
                    min-w-0
                    flex-1
                "
            >
                <p
                    className="
                        text-xs
                        font-bold

                        uppercase

                        tracking-wider

                        text-gray-500
                    "
                >
                    {label}
                </p>


                <div
                    className="
                        mt-1

                        break-words

                        text-sm
                        font-semibold

                        text-gray-200
                    "
                >
                    {children}
                </div>
            </div>
        </li>
    );
};


// =========================================================
// SIDEBAR
// =========================================================

const ProfileSidebar = ({
    currentUser,
    birthdayStatus,
    username,
}) => {
    const websiteHref =
        formatUrl(
            currentUser.website
        );


    const githubHref =
        formatGithubUrl(
            currentUser.github
        );


    return (
        <aside
            className="
                space-y-6
            "
        >
            {/* =============================================
                INFO
            ============================================== */}

            <section
                className="
                    rounded-3xl

                    border
                    border-gray-700/70

                    bg-gray-900/70

                    p-5

                    shadow-xl
                    shadow-black/30
                "
            >
                <div
                    className="
                        mb-5

                        flex
                        items-center

                        gap-3
                    "
                >
                    <div
                        className="
                            flex
                            h-11
                            w-11

                            items-center
                            justify-center

                            rounded-2xl

                            border
                            border-indigo-400/20

                            bg-indigo-500/10

                            text-indigo-300
                        "
                    >
                        <UserRound
                            size={22}
                        />
                    </div>


                    <div>
                        <h3
                            className="
                                text-xl
                                font-black

                                text-white
                            "
                        >
                            Ma’lumotlar
                        </h3>


                        <p
                            className="
                                text-xs
                                font-semibold

                                text-gray-500
                            "
                        >
                            Shaxsiy va professional profil
                        </p>
                    </div>
                </div>


                <ul
                    className="
                        space-y-1
                    "
                >
                    <SidebarRow
                        icon={
                            UserRound
                        }
                        label="To‘liq ism"
                    >
                        {
                            currentUser.fullName
                        }
                    </SidebarRow>


                    <SidebarRow
                        icon={
                            Cake
                        }
                        label="Tug‘ilgan sana"
                        iconClass="text-pink-300"
                    >
                        <div
                            className="
                                flex
                                flex-wrap

                                items-center

                                gap-2
                            "
                        >
                            {
                                currentUser.birthday
                                    ? (
                                        <span>
                                            {
                                                formatBirthday(
                                                    currentUser.birthday
                                                )
                                            }
                                        </span>
                                    )
                                    : (
                                        <EmptyValue />
                                    )
                            }


                            {
                                birthdayStatus
                                &&
                                (
                                    <span
                                        className="
                                            rounded-full

                                            border
                                            border-pink-400/30

                                            bg-pink-500/10

                                            px-2
                                            py-0.5

                                            text-[10px]
                                            font-black

                                            uppercase

                                            text-pink-300
                                        "
                                    >
                                        {
                                            birthdayStatus
                                        }
                                    </span>
                                )
                            }
                        </div>
                    </SidebarRow>


                    <SidebarRow
                        icon={
                            MapPin
                        }
                        label="Manzil"
                        iconClass="text-emerald-300"
                    >
                        {
                            currentUser.location
                            ||
                            <EmptyValue />
                        }
                    </SidebarRow>


                    <SidebarRow
                        icon={
                            Mail
                        }
                        label="Email"
                        iconClass="text-sky-300"
                    >
                        {
                            currentUser.email
                            ||
                            <EmptyValue />
                        }
                    </SidebarRow>


                    <SidebarRow
                        icon={
                            LinkIcon
                        }
                        label="Veb-sayt"
                    >
                        {
                            websiteHref
                                ? (
                                    <a
                                        href={
                                            websiteHref
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="
                                            inline-flex
                                            max-w-full

                                            items-center

                                            gap-1

                                            text-indigo-300

                                            hover:text-indigo-200
                                            hover:underline
                                        "
                                    >
                                        <span
                                            className="
                                                truncate
                                            "
                                        >
                                            {
                                                cleanUrlText(
                                                    currentUser.website
                                                )
                                            }
                                        </span>

                                        <ExternalLink
                                            size={13}
                                        />
                                    </a>
                                )
                                : (
                                    <EmptyValue />
                                )
                        }
                    </SidebarRow>


                    <SidebarRow
                        icon={
                            Github
                        }
                        label="GitHub"
                        iconClass="text-purple-300"
                    >
                        {
                            githubHref
                                ? (
                                    <a
                                        href={
                                            githubHref
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="
                                            inline-flex
                                            max-w-full

                                            items-center

                                            gap-1

                                            text-indigo-300

                                            hover:text-indigo-200
                                            hover:underline
                                        "
                                    >
                                        <span
                                            className="
                                                truncate
                                            "
                                        >
                                            {
                                                normalizeGithubText(
                                                    currentUser.github
                                                )
                                            }
                                        </span>

                                        <ExternalLink
                                            size={13}
                                        />
                                    </a>
                                )
                                : (
                                    <EmptyValue />
                                )
                        }
                    </SidebarRow>


                    <SidebarRow
                        icon={
                            Send
                        }
                        label="Telegram Bot"
                        iconClass={
                            currentUser.telegramLinked
                                ? "text-emerald-300"
                                : "text-gray-400"
                        }
                    >
                        {
                            currentUser.telegramLinked
                                ? (
                                    <div
                                        className="
                                            flex
                                            items-center

                                            gap-2
                                        "
                                    >
                                        <span
                                            className="
                                                relative

                                                flex
                                                h-2.5
                                                w-2.5
                                            "
                                        >
                                            <span
                                                className="
                                                    absolute
                                                    inline-flex

                                                    h-full
                                                    w-full

                                                    animate-ping

                                                    rounded-full

                                                    bg-emerald-400

                                                    opacity-75
                                                "
                                            />

                                            <span
                                                className="
                                                    relative
                                                    inline-flex

                                                    h-2.5
                                                    w-2.5

                                                    rounded-full

                                                    bg-emerald-400
                                                "
                                            />
                                        </span>


                                        <span
                                            className="
                                                font-black

                                                text-emerald-300
                                            "
                                        >
                                            {
                                                currentUser.telegramUsername
                                                    ? `@${currentUser.telegramUsername}`
                                                    : "Telegram Connected"
                                            }
                                        </span>
                                    </div>
                                )
                                : (
                                    <span
                                        className="
                                            text-gray-500
                                        "
                                    >
                                        Bot ulanmagan
                                    </span>
                                )
                        }
                    </SidebarRow>
                </ul>


                {/* =========================================
                    ABOUT
                ========================================== */}

                <div
                    className="
                        relative
                        mt-5

                        overflow-hidden

                        rounded-2xl

                        border
                        border-gray-700/70

                        bg-gray-950/40

                        p-5
                    "
                >
                    <div
                        className="
                            pointer-events-none

                            absolute
                            -left-10
                            -top-10

                            h-32
                            w-32

                            rounded-full

                            bg-indigo-500/10

                            blur-3xl
                        "
                    />


                    <h3
                        className="
                            relative
                            z-10

                            mb-3

                            flex
                            items-center

                            gap-3

                            text-lg
                            font-black

                            text-white
                        "
                    >
                        <Terminal
                            size={20}
                            className="
                                text-indigo-300
                            "
                        />

                        Men haqimda
                    </h3>


                    <p
                        className="
                            relative
                            z-10

                            text-sm
                            font-medium

                            leading-7

                            text-gray-300
                        "
                    >
                        {
                            currentUser.aboutMe
                                ?.trim()
                                ? currentUser.aboutMe
                                : (
                                    <EmptyValue>
                                        Foydalanuvchi hali o‘zi haqida yozmagan.
                                    </EmptyValue>
                                )
                        }
                    </p>
                </div>
            </section>


            {/* =============================================
                SKILLS
            ============================================== */}

            <section
                className="
                    rounded-3xl

                    border
                    border-gray-700/70

                    bg-gray-900/70

                    p-5

                    shadow-xl
                    shadow-black/30
                "
            >
                <div
                    className="
                        mb-5

                        flex
                        items-center
                        justify-between

                        gap-3
                    "
                >
                    <div>
                        <h3
                            className="
                                text-xl
                                font-black

                                text-white
                            "
                        >
                            Ko‘nikmalar
                        </h3>


                        <p
                            className="
                                text-xs
                                font-semibold

                                text-gray-500
                            "
                        >
                            Texnologiyalar va stack
                        </p>
                    </div>


                    <span
                        className="
                            rounded-full

                            border
                            border-indigo-400/30

                            bg-indigo-500/10

                            px-3
                            py-1

                            text-xs
                            font-black

                            text-indigo-300
                        "
                    >
                        {
                            currentUser.skills.length
                        }

                        {" "}ta
                    </span>
                </div>


                {
                    currentUser.skills.length >
                    0
                        ? (
                            <div
                                className="
                                    flex
                                    flex-wrap

                                    gap-2
                                "
                            >
                                {
                                    currentUser.skills.map(
                                        (
                                            skill,
                                            index
                                        ) => {
                                            const key =
                                                String(
                                                    skill
                                                )
                                                    .toLowerCase()
                                                    .split(
                                                        " "
                                                    )[0];


                                            return (
                                                <span
                                                    key={
                                                        `${skill}-${index}`
                                                    }
                                                    className={`
                                                        rounded-full

                                                        px-3
                                                        py-1.5

                                                        text-xs
                                                        font-black

                                                        ${getTechColorClass(
                                                            key
                                                        )}
                                                    `}
                                                >
                                                    {
                                                        skill
                                                    }
                                                </span>
                                            );
                                        }
                                    )
                                }
                            </div>
                        )
                        : (
                            <div
                                className="
                                    rounded-2xl

                                    border
                                    border-dashed
                                    border-gray-700

                                    bg-gray-950/30

                                    p-5

                                    text-center
                                "
                            >
                                <p
                                    className="
                                        font-bold
                                        text-gray-500
                                    "
                                >
                                    Hali ko‘nikmalar qo‘shilmagan
                                </p>
                            </div>
                        )
                }
            </section>


            {/* =============================================
                BADGES
            ============================================== */}

            <ProfileBadges
                username={
                    username
                }
            />
        </aside>
    );
};


export default ProfileSidebar;