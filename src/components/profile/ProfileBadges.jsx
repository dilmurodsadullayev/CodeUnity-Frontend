import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";

import {
    Award,
    Calendar,
    Crown,
    Gem,
    Medal,
    ShieldCheck,
    Sparkles,
    Trophy,
} from "lucide-react";

import {
    getBadgesStart,
    getBadgesSuccess,
    getBadgesFailure,
} from "../../features/badge";

import BadgeService from "../../services/badge";
import { formatPrettyDate } from "../../utils/formatDate";

const getBadgeImage = (image) => {
    if (!image) return null;
    if (typeof image === "string" && image.startsWith("http")) return image;

    return `${window.location.origin}${image}`;
};

const getBadgeTone = (index) => {
    const tones = [
        {
            icon: Crown,
            border: "border-yellow-400/30",
            hoverBorder: "hover:border-yellow-400/50",
            bg: "bg-yellow-500/10",
            text: "text-yellow-300",
            glow: "bg-yellow-500/20",
            ring: "ring-yellow-400/20",
            progress: "bg-yellow-400",
        },
        {
            icon: Trophy,
            border: "border-indigo-400/30",
            hoverBorder: "hover:border-indigo-400/50",
            bg: "bg-indigo-500/10",
            text: "text-indigo-300",
            glow: "bg-indigo-500/20",
            ring: "ring-indigo-400/20",
            progress: "bg-indigo-400",
        },
        {
            icon: Gem,
            border: "border-purple-400/30",
            hoverBorder: "hover:border-purple-400/50",
            bg: "bg-purple-500/10",
            text: "text-purple-300",
            glow: "bg-purple-500/20",
            ring: "ring-purple-400/20",
            progress: "bg-purple-400",
        },
        {
            icon: Medal,
            border: "border-emerald-400/30",
            hoverBorder: "hover:border-emerald-400/50",
            bg: "bg-emerald-500/10",
            text: "text-emerald-300",
            glow: "bg-emerald-500/20",
            ring: "ring-emerald-400/20",
            progress: "bg-emerald-400",
        },
    ];

    return tones[index % tones.length];
};

const ProfileBadges = ({ username }) => {
    const dispatch = useDispatch();

    const { userBadges, isLoading, error } = useSelector(
        (state) => state.badge || {}
    );

    const safeBadges = Array.isArray(userBadges) ? userBadges : [];

    useEffect(() => {
        const fetchBadges = async () => {
            dispatch(getBadgesStart());

            try {
                const response = await BadgeService.getUserBadges(username);
                dispatch(getBadgesSuccess(response));
            } catch (err) {
                dispatch(
                    getBadgesFailure(
                        err?.message || "Nishonlarni yuklashda xato yuz berdi."
                    )
                );
            }
        };

        if (username) fetchBadges();
    }, [username, dispatch]);

    if (isLoading) {
        return <BadgesSkeleton />;
    }

    return (
        <section className="relative overflow-hidden rounded-3xl border border-gray-700/70 bg-gray-900/70 p-5 shadow-2xl shadow-black/30">
            <div className="pointer-events-none absolute -right-24 -top-24 h-52 w-52 rounded-full bg-yellow-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-52 w-52 rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="relative z-10 mb-6 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-yellow-400/25 bg-yellow-500/10 text-yellow-300 shadow-lg shadow-yellow-500/10">
                        <Award size={24} />
                    </div>

                    <div className="min-w-0">
                        <h3 className="text-xl font-black text-white">
                            Nishonlar
                        </h3>
                        <p className="text-xs font-semibold leading-5 text-gray-500">
                            Yutuqlar, faoliyat va community belgisi
                        </p>
                    </div>
                </div>

                <span className="shrink-0 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-indigo-300">
                    {safeBadges.length} ta
                </span>
            </div>

            {error && (
                <div className="relative z-10 mb-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-semibold text-red-300">
                    <i className="fa-solid fa-triangle-exclamation mr-2"></i>
                    {error}
                </div>
            )}

            {safeBadges.length > 0 ? (
                <div className="relative z-10 space-y-4">
                    {safeBadges.map((item, index) => (
                        <BadgeCard
                            key={item?.id || index}
                            item={item}
                            index={index}
                        />
                    ))}
                </div>
            ) : (
                <EmptyBadges />
            )}
        </section>
    );
};

const BadgeCard = ({ item, index }) => {
    const badge = item?.badge || {};
    const tone = getBadgeTone(index);
    const ToneIcon = tone.icon;
    const badgeImage = getBadgeImage(badge?.image);

    return (
        <motion.article
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07, duration: 0.35 }}
            whileHover={{ y: -2 }}
            className={`group relative overflow-hidden rounded-3xl border border-gray-700/70 bg-gray-950/35 shadow-xl shadow-black/20 transition-all duration-300 ${tone.hoverBorder} hover:bg-gray-900/80`}
        >
            <div
                className={`pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full ${tone.glow} opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100`}
            />

            <div className="relative z-10 p-4">
                <div className="flex items-start gap-4">
                    {/* IMAGE */}
                    <div
                        className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border ${tone.border} bg-gray-900 ring-4 ${tone.ring} sm:h-24 sm:w-24`}
                    >
                        {badgeImage ? (
                            <img
                                src={badgeImage}
                                alt={badge?.name || "Badge"}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                }}
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center">
                                <ToneIcon className={tone.text} size={38} />
                            </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-transparent to-white/5" />

                        <div
                            className={`absolute bottom-1.5 left-1.5 flex h-7 w-7 items-center justify-center rounded-xl border ${tone.border} ${tone.bg} ${tone.text} backdrop-blur-md`}
                        >
                            <ToneIcon size={15} />
                        </div>
                    </div>

                    {/* CONTENT */}
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2">
                            <h4 className="break-words text-base font-black leading-snug text-white transition-colors group-hover:text-indigo-300 sm:text-lg">
                                {badge?.name || "Noma’lum nishon"}
                            </h4>

                            <div className="flex flex-wrap items-center gap-2">
                                <span
                                    className={`w-fit rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${tone.border} ${tone.bg} ${tone.text}`}
                                >
                                    Achievement
                                </span>

                                <span className="inline-flex w-fit items-center gap-1.5 rounded-xl border border-gray-700/70 bg-gray-900/70 px-2.5 py-1 text-[11px] font-bold leading-4 text-gray-300">
                                    <Calendar size={12} className="shrink-0 text-indigo-300" />
                                    <span className="normal-case">
                                        {formatPrettyDate(item?.awarded_at)}
                                    </span>
                                </span>
                            </div>
                        </div>

                        <p className="mt-3 break-words text-sm font-medium leading-6 text-gray-400">
                            {badge?.description ||
                                "Ushbu yutuq haqida ma’lumot mavjud emas."}
                        </p>
                    </div>
                </div>

                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-gray-800">
                    <div
                        className={`h-full rounded-full ${tone.progress} opacity-70 shadow-lg`}
                        style={{ width: `${Math.min(100, 45 + index * 12)}%` }}
                    />
                </div>
            </div>

            <div
                className={`absolute inset-y-0 right-0 w-1 ${tone.bg} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
            />
        </motion.article>
    );
};

const BadgesSkeleton = () => {
    return (
        <section className="relative overflow-hidden rounded-3xl border border-gray-700/70 bg-gray-900/70 p-5 shadow-2xl shadow-black/30">
            <div className="mb-6 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 animate-pulse rounded-2xl bg-gray-800" />

                    <div className="space-y-2">
                        <div className="h-5 w-32 animate-pulse rounded-xl bg-gray-800" />
                        <div className="h-3 w-44 animate-pulse rounded-xl bg-gray-800" />
                    </div>
                </div>

                <div className="h-7 w-14 animate-pulse rounded-full bg-gray-800" />
            </div>

            <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                    <div
                        key={item}
                        className="rounded-3xl border border-gray-700/70 bg-gray-950/35 p-4"
                    >
                        <div className="flex gap-4">
                            <div className="h-20 w-20 shrink-0 animate-pulse rounded-2xl bg-gray-800 sm:h-24 sm:w-24" />

                            <div className="min-w-0 flex-1 space-y-3">
                                <div className="h-5 w-2/3 animate-pulse rounded-xl bg-gray-800" />
                                <div className="h-6 w-36 animate-pulse rounded-xl bg-gray-800" />
                                <div className="h-3 w-full animate-pulse rounded-xl bg-gray-800" />
                                <div className="h-3 w-4/5 animate-pulse rounded-xl bg-gray-800" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

const EmptyBadges = () => {
    return (
        <div className="relative z-10 overflow-hidden rounded-3xl border-2 border-dashed border-gray-700/70 bg-gray-950/30 px-5 py-12 text-center">
            <div className="pointer-events-none absolute left-1/2 top-0 h-36 w-36 -translate-x-1/2 rounded-full bg-yellow-500/10 blur-3xl" />

            <div className="relative z-10">
                <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full border border-gray-700 bg-gray-900/80 shadow-xl shadow-black/30">
                    <ShieldCheck className="text-gray-600" size={52} />
                </div>

                <h4 className="text-xl font-black text-white">
                    Hali nishonlar mavjud emas
                </h4>

                <p className="mx-auto mt-2 max-w-sm text-sm font-semibold leading-6 text-gray-500">
                    Faol bo‘ling, post yozing, muammolarga yechim bering va ilk
                    nishoningizni qo‘lga kiriting.
                </p>

                <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-xs font-black uppercase tracking-wider text-indigo-300">
                    <Sparkles size={14} />
                    Keep grinding
                </div>
            </div>
        </div>
    );
};

export default ProfileBadges;