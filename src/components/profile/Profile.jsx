import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import {
    getProfileFailure,
    getProfileStart,
    getProfileSuccess,
} from "../../features/profile";

import ProfileService from "../../services/profile";

import UserImage from "../../assests/userImage.jpeg";
import FCoinIcon from "../../assests/coin/fcoin.png";

import {
    formatPrettyDate,
    formatBirthday,
    getBirthdayStatus,
} from "../../utils/formatDate";

import { getTechColorClass } from "../../utils/colorUtils";

import EditProfileModal from "./EditProfileModal";
import ProfileProjects from "./ProfileProjects";
import ProfilePosts from "./ProfilePosts";
import ProfileRoadmap from "./ProfileRoadmap";
import ProfileBadges from "./ProfileBadges";

import CoverImageEditModal from "../CoverImageEditModal";

import {
    AlertCircle,
    Briefcase,
    Building2,
    Cake,
    CalendarDays,
    CheckCircle,
    ExternalLink,
    FolderKanban,
    Github,
    Globe,
    Image as ImageIcon,
    Link as LinkIcon,
    Loader2,
    Mail,
    MapPin,
    Pencil,
    ShieldCheck,
    Sparkles,
    Star,
    Terminal,
    UserRound,
    Users,
} from "lucide-react";
import BotService from "../../services/bot";

import {
    getTelegramProfileStart,
    getTelegramProfileSuccess,
    getTelegramProfileFailure,
} from "../../features/bot";

import { Bot, Send } from "lucide-react";

const DEFAULT_COVER =
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop";

const fullName = (firstName, lastName, username) => {
    const name = `${firstName || ""} ${lastName || ""}`.trim();
    return name || username || "No Name";
};

const formatUrl = (url) => {
    if (!url) return null;
    return url.startsWith("http") ? url : `https://${url}`;
};

const cleanUrlText = (url) => {
    if (!url) return "Hali mavjud emas";

    return String(url)
        .replace(/^https?:\/\//, "")
        .replace(/^www\./, "")
        .replace(/\/$/, "");
};

const formatGithubUrl = (github) => {
    if (!github) return null;

    const value = String(github).trim();

    if (value.startsWith("http")) return value;
    if (value.includes("github.com")) return `https://${value}`;

    return `https://github.com/${value.replace("@", "")}`;
};

const normalizeGithubText = (github) => {
    if (!github) return "Hali mavjud emas";

    return String(github)
        .replace(/^https?:\/\//, "")
        .replace(/^www\./, "")
        .replace(/\/$/, "");
};

const normalizeSkills = (skills) => {
    if (!Array.isArray(skills)) return [];

    return skills
        .map((skill) => {
            if (typeof skill === "string") return skill;
            return skill?.name || skill?.title || "";
        })
        .filter(Boolean);
};

const normalizeSkillLevel = (level) => {
    if (!level) return null;

    const lower = String(level).toLowerCase();

    const map = {
        beginner: "Beginner",
        junior: "Junior",
        intermediate: "Intermediate",
        advanced: "Advanced",
        senior: "Senior",
        lead: "Lead / Tech Lead",
        expert: "Expert / Architect",
    };

    return map[lower] || String(level);
};

const getSkillBadgeClass = (level) => {
    const lower = String(level || "").toLowerCase();

    if (lower.includes("beginner")) {
        return "border-blue-400/30 bg-blue-500/10 text-blue-300 shadow-blue-500/10";
    }

    if (lower.includes("junior")) {
        return "border-emerald-400/30 bg-emerald-500/10 text-emerald-300 shadow-emerald-500/10";
    }

    if (lower.includes("intermediate") || lower.includes("mid")) {
        return "border-yellow-400/30 bg-yellow-500/10 text-yellow-300 shadow-yellow-500/10";
    }

    if (lower.includes("senior")) {
        return "border-red-400/30 bg-red-500/10 text-red-300 shadow-red-500/10";
    }

    if (lower.includes("lead")) {
        return "border-indigo-400/30 bg-indigo-500/10 text-indigo-300 shadow-indigo-500/10";
    }

    if (lower.includes("expert") || lower.includes("advanced")) {
        return "border-purple-400/30 bg-purple-500/10 text-purple-300 shadow-purple-500/10";
    }

    return "border-gray-500/30 bg-gray-500/10 text-gray-300 shadow-gray-500/10";
};

const EmptyValue = ({ children = "Hali mavjud emas" }) => (
    <span className="text-gray-500">{children}</span>
);

const ActionButton = ({ children, onClick, variant = "gray", className = "" }) => {
    const variants = {
        gray: "border-gray-600/70 bg-gray-700/80 text-white hover:bg-gray-600",
        pink: "border-pink-500/60 bg-pink-600 text-white hover:bg-pink-500 shadow-pink-600/20",
        indigo: "border-indigo-500/60 bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-600/20",
    };

    return (
        <button
            type="button"
            onClick={onClick}
            className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-black transition-all duration-300 shadow-lg active:scale-95 ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
};

const InfoPill = ({ icon: Icon, label, value, href }) => {
    const content = (
        <div className="group flex min-h-[78px] items-center gap-4 rounded-2xl border border-gray-700/70 bg-gray-900/35 p-4 transition-all duration-300 hover:border-indigo-500/50 hover:bg-gray-800/70">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-300 shadow-lg shadow-indigo-500/10">
                <Icon size={21} />
            </div>

            <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    {label}
                </p>

                <p className="mt-1 flex items-center gap-1.5 truncate text-sm font-black text-gray-100">
                    {value ? value : <EmptyValue />}
                    {href && <ExternalLink size={13} className="text-gray-500" />}
                </p>
            </div>
        </div>
    );

    if (!href) return content;

    return (
        <a href={href} target="_blank" rel="noopener noreferrer">
            {content}
        </a>
    );
};

const StatCard = ({ icon: Icon, image, label, value, tone = "indigo" }) => {
    const toneClass = {
        yellow: "text-yellow-300 bg-yellow-500/10 border-yellow-400/20",
        red: "text-red-300 bg-red-500/10 border-red-400/20",
        blue: "text-sky-300 bg-sky-500/10 border-sky-400/20",
        purple: "text-purple-300 bg-purple-500/10 border-purple-400/20",
        indigo: "text-indigo-300 bg-indigo-500/10 border-indigo-400/20",
    };

    return (
        <div className="group relative overflow-hidden border-r border-b border-gray-700/60 bg-gray-900/35 p-4 text-center transition-all duration-300 hover:bg-gray-800/70 md:border-b-0 last:border-r-0">
            <div className="absolute inset-x-0 -top-20 mx-auto h-24 w-24 rounded-full bg-indigo-500/10 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative z-10 mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-2xl border bg-gray-950/40 shadow-inner shadow-black/40">
                {image ? (
                    <img src={image} alt={label} className="h-6 w-6 object-contain" />
                ) : (
                    <Icon
                        size={21}
                        className={toneClass[tone] || toneClass.indigo}
                    />
                )}
            </div>

            <p className="relative z-10 text-xs font-bold text-gray-400">
                {label}
            </p>

            <p className="relative z-10 mt-1 text-2xl font-black tracking-tight text-white">
                {value ?? 0}
            </p>
        </div>
    );
};

const SidebarRow = ({ icon: Icon, label, children, iconClass = "text-indigo-300" }) => (
    <li className="flex items-start gap-3 rounded-xl border border-transparent p-2.5 transition-all duration-300 hover:border-gray-700/70 hover:bg-gray-900/30">
        <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gray-900/60 ${iconClass}`}>
            <Icon size={17} />
        </div>

        <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                {label}
            </p>
            <div className="mt-1 break-words text-sm font-semibold text-gray-200">
                {children}
            </div>
        </div>
    </li>
);

const ProfileSkeleton = () => (
    <main className="container mx-auto p-3 sm:p-4 md:p-6">
        <div className="overflow-hidden rounded-3xl border border-gray-800 bg-gray-900/60">
            <div className="h-44 animate-pulse bg-gray-800 md:h-64" />

            <div className="p-4 sm:p-6">
                <div className="flex items-start gap-4">
                    <div className="h-24 w-24 shrink-0 animate-pulse rounded-full bg-gray-800 sm:h-32 sm:w-32" />

                    <div className="flex-1 space-y-4 pt-3">
                        <div className="h-6 w-48 animate-pulse rounded-xl bg-gray-800 sm:w-64" />
                        <div className="h-4 w-full max-w-md animate-pulse rounded-xl bg-gray-800" />
                    </div>
                </div>
            </div>
        </div>
    </main>
);

const Profile = () => {
    const dispatch = useDispatch();
    const { username } = useParams();

    const { profile, isLoading, error } = useSelector((state) => state.profile);
    const { user } = useSelector((state) => state.auth);
    const {
        isLoading: botLoading,
        telegramProfile,
    } = useSelector((state) => state.bot);

    const isTelegramLinked = Boolean(telegramProfile?.is_linked);


    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("projects");

    const isOwner =
        Boolean(user?.username && username) &&
        user.username.toLowerCase() === username.toLowerCase();

    const getProfile = useCallback(async () => {
        if (!username) return;

        dispatch(getProfileStart());

        try {
            const response = await ProfileService.getProfile(username);
            dispatch(getProfileSuccess(response));
        } catch (err) {
            console.error("Profile olishda xato:", err);
            dispatch(getProfileFailure(err.message || "Profile olishda xato yuz berdi"));
        }
    }, [dispatch, username]);

    const getTelegramBotStatus = useCallback(async () => {
        if (!isOwner) return;

        dispatch(getTelegramProfileStart());

        try {
            const response = await BotService.getTelegramProfile();
            dispatch(getTelegramProfileSuccess(response));
        } catch (err) {
            console.error("Telegram bot status olishda xato:", err);
            dispatch(getTelegramProfileFailure(err.message));
        }
    }, [dispatch, isOwner]);

    const handleConnectTelegramBot = async () => {
        dispatch(getTelegramProfileStart());

        try {
            const response = await BotService.getTelegramProfile();

            dispatch(getTelegramProfileSuccess(response));

            const profileData = response?.data || response;

            if (profileData?.is_linked) {
                alert("Telegram bot allaqachon ulangan ✅");
                return;
            }

            const linkCode = profileData?.link_code;

            if (!linkCode) {
                alert("Telegram ulash kodi topilmadi.");
                return;
            }

            const botUsername = "FixSocietybot";
            const telegramUrl = `https://t.me/${botUsername}?start=${linkCode}`;

            window.open(telegramUrl, "_blank", "noopener,noreferrer");
        } catch (err) {
            console.error("Telegram bot ulashda xato:", err);
            dispatch(getTelegramProfileFailure(err.message));
            alert(err.message || "Telegram botni ulashda xato yuz berdi.");
        }
    };

    useEffect(() => {
        getProfile();
    }, [getProfile]);

    useEffect(() => {
        getTelegramBotStatus();
    }, [getTelegramBotStatus]);


    const currentUser = useMemo(() => {
        const skills = normalizeSkills(profile?.skills);

        return {
            profileImage: profile?.image || UserImage,
            coverImage: profile?.cover_image || DEFAULT_COVER,
            fullName: fullName(profile?.first_name, profile?.last_name, profile?.username),
            username: profile?.username || username,
            email: profile?.email,
            position: profile?.position,
            skillLevel: normalizeSkillLevel(profile?.skill_level),
            rawSkillLevel: profile?.skill_level,
            company: profile?.company,
            rating: profile?.total_rating ?? "0.00",
            fcoin: profile?.coins ?? 0,
            problemCount: profile?.problems_count ?? 0,
            solutionCount: profile?.solution_count ?? 0,
            projectsCount: profile?.projects_count ?? 0,
            location: profile?.address,
            website: profile?.website_url,
            github: profile?.github_url,
            memberSince: formatPrettyDate(profile?.date_joined),
            aboutMe: profile?.about_me,
            skills,
            birthday: profile?.birthday || profile?.birth_date,
            telegramUsername: telegramProfile?.telegram_username || null,
            telegramLinked: telegramProfile?.is_linked || false,
        };
    }, [profile, username]);

    const birthdayStatus = getBirthdayStatus(currentUser.birthday);

    const websiteHref = formatUrl(currentUser.website);
    const githubHref = formatGithubUrl(currentUser.github);

    if (isLoading && !profile) {
        return <ProfileSkeleton />;
    }

    if (error && !profile) {
        return (
            <main className="container mx-auto p-3 sm:p-4 md:p-6">
                <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center">
                    <AlertCircle className="mx-auto mb-4 text-red-300" size={46} />

                    <h2 className="text-2xl font-black text-white">
                        Profil yuklanmadi
                    </h2>

                    <p className="mt-2 text-red-200">{error}</p>

                    <button
                        type="button"
                        onClick={getProfile}
                        className="mt-5 rounded-xl bg-red-600 px-5 py-2.5 font-black text-white transition hover:bg-red-500"
                    >
                        Qayta urinish
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="container mx-auto p-3 sm:p-4 md:p-6 fade-in">
            <section className="overflow-hidden rounded-3xl border border-gray-700/70 bg-gray-900/70 shadow-2xl shadow-black/40">
                {/* COVER */}
                <div
                    className="relative h-44 bg-cover bg-center sm:h-52 md:h-72"
                    style={{ backgroundImage: `url("${currentUser.coverImage}")` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-gray-900" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.18),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(236,72,153,0.12),transparent_35%)]" />

                    {isOwner && (
                        <button
                            type="button"
                            onClick={() => setIsCoverModalOpen(true)}
                            className="absolute right-3 top-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-black/45 text-white backdrop-blur-md transition hover:bg-black/65 sm:right-4 sm:top-4 sm:w-auto sm:px-4"
                        >
                            <ImageIcon size={17} />
                            <span className="ml-2 hidden text-sm font-black sm:inline">
                                Fon rasmi
                            </span>
                        </button>
                    )}
                </div>

                {/* HEADER - FACEBOOK STYLE RESPONSIVE */}
                <div className="relative px-4 pb-5 sm:px-6">
                    <div className="-mt-12 flex items-end gap-3 sm:-mt-16 sm:gap-5 lg:items-end lg:justify-between">
                        {/* LEFT USER BLOCK */}
                        <div className="flex min-w-0 flex-1 items-end gap-3 sm:gap-5">
                            <div className="relative shrink-0">
                                <div className="absolute inset-0 rounded-full bg-indigo-500/30 blur-2xl" />

                                <img
                                    src={currentUser.profileImage}
                                    alt="Profil rasmi"
                                    className="relative h-24 w-24 rounded-full border-4 border-gray-900 object-cover shadow-2xl shadow-black/50 sm:h-32 sm:w-32"
                                />

                                <span className="absolute bottom-3 right-1.5 h-4 w-4 rounded-full border-2 border-gray-900 bg-emerald-400 shadow-lg shadow-emerald-400/30 sm:bottom-4 sm:right-2" />
                            </div>

                            <div className="min-w-0 pb-1 text-left">
                                <div className="flex min-w-0 flex-col items-start gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                                    <h1 className="max-w-full truncate text-2xl font-black tracking-tight text-white sm:text-3xl md:text-4xl">
                                        {currentUser.fullName}
                                    </h1>

                                    {currentUser.skillLevel && (
                                        <span
                                            className={`inline-flex max-w-full items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-black shadow-lg sm:text-xs ${getSkillBadgeClass(
                                                currentUser.rawSkillLevel
                                            )}`}
                                        >
                                            <Sparkles size={14} />
                                            <span className="truncate">
                                                {currentUser.skillLevel}
                                            </span>
                                        </span>
                                    )}
                                </div>

                                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-semibold text-gray-400 sm:mt-3 sm:text-sm">
                                    <span className="inline-flex items-center gap-1.5">
                                        <Briefcase size={15} className="text-indigo-300" />
                                        <span className="max-w-[130px] truncate sm:max-w-none">
                                            {currentUser.position || "Lavozim kiritilmagan"}
                                        </span>
                                    </span>

                                    <span className="hidden h-1 w-1 rounded-full bg-gray-600 sm:inline-block" />

                                    <span className="inline-flex items-center gap-1.5">
                                        <ShieldCheck size={15} className="text-emerald-300" />
                                        <span className="max-w-[130px] truncate sm:max-w-none">
                                            {currentUser.company || "Kompaniya kiritilmagan"}
                                        </span>
                                    </span>

                                    <span className="hidden h-1 w-1 rounded-full bg-gray-600 sm:inline-block" />

                                    <span className="inline-flex items-center gap-1.5">
                                        <MapPin size={15} className="text-pink-300" />
                                        <span className="max-w-[130px] truncate sm:max-w-none">
                                            {currentUser.location || "Manzil kiritilmagan"}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* DESKTOP ACTIONS */}
                        <div className="hidden shrink-0 flex-wrap items-center justify-end gap-2 lg:flex">
                           {isOwner && (
                                <ActionButton
                                    variant={isTelegramLinked ? "indigo" : "gray"}
                                    onClick={handleConnectTelegramBot}
                                    className={`
                                        relative overflow-hidden
                                        ${botLoading ? "opacity-70 pointer-events-none" : ""}
                                        ${
                                            isTelegramLinked
                                                ? "border-emerald-400/60 bg-emerald-600/20 text-emerald-200 shadow-emerald-500/40 ring-1 ring-emerald-400/30"
                                                : ""
                                        }
                                    `}
                                >
                                    {isTelegramLinked && (
                                        <>
                                            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/80 animate-pulse" />
                                            <span className="absolute inset-0 bg-emerald-400/5" />
                                        </>
                                    )}

                                    {botLoading ? (
                                        <Loader2 size={17} className="animate-spin" />
                                    ) : isTelegramLinked ? (
                                        <CheckCircle size={17} />
                                    ) : (
                                        <Bot size={17} />
                                    )}

                                    {isTelegramLinked ? "Bot ulangan" : "Botni ulash"}
                                </ActionButton>
                            )}
                            {isOwner && (
                                <>
                                    <ActionButton
                                        variant="gray"
                                        onClick={() => setIsCoverModalOpen(true)}
                                    >
                                        <ImageIcon size={17} />
                                        Fon rasmi
                                    </ActionButton>

                                    <ActionButton
                                        variant="pink"
                                        onClick={() => setIsEditModalOpen(true)}
                                    >
                                        <Pencil size={17} />
                                        Tahrirlash
                                    </ActionButton>
                                </>
                            )}
                        </div>
                    </div>

                    {/* MOBILE / TABLET ACTIONS */}
                    <div className={`mt-5 grid gap-2 ${isOwner ? "grid-cols-3" : "grid-cols-1"} lg:hidden`}>
                       {isOwner && (
                            <ActionButton
                                variant={isTelegramLinked ? "indigo" : "gray"}
                                onClick={handleConnectTelegramBot}
                                className={`
                                    relative w-full overflow-hidden px-2
                                    ${botLoading ? "opacity-70 pointer-events-none" : ""}
                                    ${
                                        isTelegramLinked
                                            ? "border-emerald-400/60 bg-emerald-600/20 text-emerald-200 shadow-emerald-500/40 ring-1 ring-emerald-400/30"
                                            : ""
                                    }
                                `}
                            >
                                {isTelegramLinked && (
                                    <>
                                        <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/80 animate-pulse" />
                                        <span className="absolute inset-0 bg-emerald-400/5" />
                                    </>
                                )}

                                {botLoading ? (
                                    <Loader2 size={17} className="animate-spin" />
                                ) : isTelegramLinked ? (
                                    <CheckCircle size={17} />
                                ) : (
                                    <Bot size={17} />
                                )}

                                <span className="truncate">
                                    {isTelegramLinked ? "Ulangan" : "Bot"}
                                </span>
                            </ActionButton>
                        )}

                        {isOwner && (
                            <>
                                <ActionButton
                                    variant="gray"
                                    onClick={() => setIsCoverModalOpen(true)}
                                    className="w-full px-2"
                                >
                                    <ImageIcon size={17} />
                                    <span className="truncate">Fon</span>
                                </ActionButton>

                                <ActionButton
                                    variant="pink"
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="w-full px-2"
                                >
                                    <Pencil size={17} />
                                    <span className="truncate">Edit</span>
                                </ActionButton>
                            </>
                        )}
                    </div>

                    {/* PROFESSIONAL INFO ROW */}
                    <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                        <InfoPill
                            icon={Briefcase}
                            label="Lavozim"
                            value={currentUser.position}
                        />

                        <InfoPill
                            icon={Building2}
                            label="Kompaniya"
                            value={currentUser.company}
                        />

                        <InfoPill
                            icon={CalendarDays}
                            label="A’zolik sanasi"
                            value={currentUser.memberSince}
                        />

                        <InfoPill
                            icon={Globe}
                            label="Veb-sayt"
                            value={currentUser.website ? cleanUrlText(currentUser.website) : null}
                            href={websiteHref}
                        />

                        <InfoPill
                            icon={Github}
                            label="GitHub"
                            value={currentUser.github ? normalizeGithubText(currentUser.github) : null}
                            href={githubHref}
                        />
                    </div>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 overflow-hidden border-t border-gray-700/70 bg-gray-950/30 md:grid-cols-5">
                    <StatCard
                        icon={Star}
                        label="Reyting"
                        value={currentUser.rating}
                        tone="yellow"
                    />

                    <StatCard
                        image={FCoinIcon}
                        label="F Coin"
                        value={currentUser.fcoin}
                        tone="yellow"
                    />

                    <StatCard
                        icon={AlertCircle}
                        label="Muammolar"
                        value={currentUser.problemCount}
                        tone="red"
                    />

                    <StatCard
                        icon={CheckCircle}
                        label="Yechimlar"
                        value={currentUser.solutionCount}
                        tone="blue"
                    />

                    <StatCard
                        icon={FolderKanban}
                        label="Loyihalar"
                        value={currentUser.projectsCount}
                        tone="purple"
                    />
                </div>
            </section>

            {/* CONTENT */}
            <div className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
                <aside className="space-y-6">
                    {/* INFO CARD */}
                    <section className="rounded-3xl border border-gray-700/70 bg-gray-900/70 p-5 shadow-xl shadow-black/30">
                        <div className="mb-5 flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-300">
                                <UserRound size={22} />
                            </div>

                            <div>
                                <h3 className="text-xl font-black text-white">
                                    Ma’lumotlar
                                </h3>

                                <p className="text-xs font-semibold text-gray-500">
                                    Shaxsiy va professional profil
                                </p>
                            </div>
                        </div>

                        <ul className="space-y-1">
                            <SidebarRow icon={UserRound} label="To‘liq ism">
                                {currentUser.fullName}
                            </SidebarRow>

                            <SidebarRow icon={Cake} label="Tug‘ilgan sana" iconClass="text-pink-300">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span>{formatBirthday(currentUser.birthday)}</span>

                                    {birthdayStatus && (
                                        <span className="rounded-full border border-pink-400/30 bg-pink-500/10 px-2 py-0.5 text-[10px] font-black uppercase text-pink-300">
                                            {birthdayStatus}
                                        </span>
                                    )}
                                </div>
                            </SidebarRow>

                            <SidebarRow icon={MapPin} label="Manzil" iconClass="text-emerald-300">
                                {currentUser.location || <EmptyValue />}
                            </SidebarRow>

                            <SidebarRow icon={Mail} label="Email" iconClass="text-sky-300">
                                {currentUser.email || <EmptyValue />}
                            </SidebarRow>

                            <SidebarRow icon={LinkIcon} label="Veb-sayt" iconClass="text-indigo-300">
                                {websiteHref ? (
                                    <a
                                        href={websiteHref}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex max-w-full items-center gap-1 text-indigo-300 hover:text-indigo-200 hover:underline"
                                    >
                                        <span className="truncate">
                                            {cleanUrlText(currentUser.website)}
                                        </span>
                                        <ExternalLink size={13} />
                                    </a>
                                ) : (
                                    <EmptyValue />
                                )}
                            </SidebarRow>

                            <SidebarRow icon={Github} label="GitHub" iconClass="text-purple-300">
                                {githubHref ? (
                                    <a
                                        href={githubHref}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex max-w-full items-center gap-1 text-indigo-300 hover:text-indigo-200 hover:underline"
                                    >
                                        <span className="truncate">
                                            {normalizeGithubText(currentUser.github)}
                                        </span>
                                        <ExternalLink size={13} />
                                    </a>
                                ) : (
                                    <EmptyValue />
                                )}
                            </SidebarRow>
                            <SidebarRow
                                icon={Send}
                                label="Telegram Bot"
                                iconClass={
                                    currentUser.telegramLinked
                                        ? "text-emerald-300"
                                        : "text-gray-400"
                                }
                            >
                                {currentUser.telegramLinked ? (
                                    <div className="flex items-center gap-2">
                                        <span className="relative flex h-2.5 w-2.5">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                                        </span>

                                        <span className="font-black text-emerald-300">
                                            {currentUser.telegramUsername
                                                ? `@${currentUser.telegramUsername}`
                                                : "Telegram Connected"}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-gray-500">
                                        Bot ulanmagan
                                    </span>
                                )}
                            </SidebarRow>
                        </ul>

                        <div className="relative mt-5 overflow-hidden rounded-2xl border border-gray-700/70 bg-gray-950/40 p-5">
                            <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl" />

                            <h3 className="relative z-10 mb-3 flex items-center gap-3 text-lg font-black text-white">
                                <Terminal size={20} className="text-indigo-300" />
                                Men haqimda
                            </h3>

                            <p className="relative z-10 text-sm font-medium leading-7 text-gray-300">
                                {currentUser.aboutMe?.trim() ? (
                                    currentUser.aboutMe
                                ) : (
                                    <EmptyValue>
                                        Foydalanuvchi hali o‘zi haqida yozmagan.
                                    </EmptyValue>
                                )}
                            </p>
                        </div>
                    </section>

                    {/* SKILLS */}
                    <section className="rounded-3xl border border-gray-700/70 bg-gray-900/70 p-5 shadow-xl shadow-black/30">
                        <div className="mb-5 flex items-center justify-between gap-3">
                            <div>
                                <h3 className="text-xl font-black text-white">
                                    Ko‘nikmalar
                                </h3>

                                <p className="text-xs font-semibold text-gray-500">
                                    Texnologiyalar va stack
                                </p>
                            </div>

                            <span className="rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-xs font-black text-indigo-300">
                                {currentUser.skills.length} ta
                            </span>
                        </div>

                        {currentUser.skills.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {currentUser.skills.map((skill, index) => {
                                    const key = String(skill).toLowerCase().split(" ")[0];

                                    return (
                                        <span
                                            key={`${skill}-${index}`}
                                            className={`${getTechColorClass(
                                                key
                                            )} rounded-full px-3 py-1.5 text-xs font-black`}
                                        >
                                            {skill}
                                        </span>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-gray-700 bg-gray-950/30 p-5 text-center">
                                <p className="font-bold text-gray-500">
                                    Hali ko‘nikmalar qo‘shilmagan
                                </p>
                            </div>
                        )}
                    </section>

                    <ProfileBadges username={username} />
                </aside>

                {/* RIGHT CONTENT */}
                <section className="min-w-0">
                    <div className="mb-5 flex flex-col gap-4 border-b border-gray-700/70 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 overflow-x-auto">
                            <button
                                type="button"
                                onClick={() => setActiveTab("projects")}
                                className={`whitespace-nowrap border-b-2 px-5 py-4 text-sm font-black transition-all ${
                                    activeTab === "projects"
                                        ? "border-indigo-400 text-white"
                                        : "border-transparent text-gray-400 hover:text-white"
                                }`}
                            >
                                Loyihalar
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab("posts")}
                                className={`whitespace-nowrap border-b-2 px-5 py-4 text-sm font-black transition-all ${
                                    activeTab === "posts"
                                        ? "border-indigo-400 text-white"
                                        : "border-transparent text-gray-400 hover:text-white"
                                }`}
                            >
                                Postlar / Javoblar
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab("roadmap")}
                                className={`whitespace-nowrap border-b-2 px-5 py-4 text-sm font-black transition-all ${
                                    activeTab === "roadmap"
                                        ? "border-indigo-400 text-white"
                                        : "border-transparent text-gray-400 hover:text-white"
                                }`}
                            >
                                Yo‘l xaritasi
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {activeTab === "projects" && <ProfileProjects username={username} />}
                        {activeTab === "posts" && <ProfilePosts username={username} />}
                        {activeTab === "roadmap" && <ProfileRoadmap username={username} />}
                    </div>
                </section>
            </div>

            {/* MODALS */}
            <EditProfileModal
                profileData={profile}
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    getProfile();
                }}
            />

            <CoverImageEditModal
                isOpen={isCoverModalOpen}
                onClose={() => {
                    setIsCoverModalOpen(false);
                    getProfile();
                }}
                currentCoverImage={currentUser.coverImage}
            />

            {isLoading && profile && (
                <div className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-3 rounded-2xl border border-indigo-400/20 bg-gray-900/95 px-4 py-3 text-sm font-black text-indigo-200 shadow-2xl backdrop-blur-md">
                    <Loader2 className="animate-spin" size={18} />
                    Profil yangilanmoqda...
                </div>
            )}
        </main>
    );
};

export default Profile;