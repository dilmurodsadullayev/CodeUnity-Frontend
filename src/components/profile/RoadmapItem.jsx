import React from "react";
import { useSelector } from "react-redux";

import { formatPrettyDate } from "../../utils/formatDate";
import {
    getRoadmapColorClass,
    getRoadmapInnerColorClass,
} from "../../utils/colorUtils";

const getRoadmapStyle = (type) => {
    switch (type) {
        case "learning":
            return {
                icon: "fa-solid fa-graduation-cap",
                colorName: "indigo",
                label: "Learning",
            };

        case "experience":
            return {
                icon: "fa-solid fa-laptop-code",
                colorName: "teal",
                label: "Experience",
            };

        default:
            return {
                icon: "fa-solid fa-circle-info",
                colorName: "gray",
                label: "Roadmap",
            };
    }
};

const colorClassMap = {
    indigo: "text-indigo-400",
    teal: "text-teal-400",
    yellow: "text-yellow-400",
    blue: "text-blue-400",
    gray: "text-gray-400",
};

const badgeClassMap = {
    learning: "border-indigo-400/30 bg-indigo-500/10 text-indigo-300",
    experience: "border-teal-400/30 bg-teal-500/10 text-teal-300",
    default: "border-gray-500/30 bg-gray-500/10 text-gray-300",
};

const selectAuthUsername = (state) => state.auth.user?.username;

const RoadmapItem = ({
    event,
    index,
    isLikeLoading = false,
    onEdit,
    onDelete,
    onToggleLike,
}) => {
    const currentUsername = useSelector(selectAuthUsername);

    const isOwner =
        Boolean(currentUsername && event?.profile?.username) &&
        currentUsername === event.profile.username;

    const isAuthenticated = Boolean(currentUsername);

    const { icon: eventIcon, colorName, label } = getRoadmapStyle(event?.type);
    const iconColorClass = colorClassMap[colorName] || "text-gray-400";

    const finishedText =
        event?.finished_at_display && event.finished_at_display !== "Hali tugallanmagan"
            ? formatPrettyDate(event.finished_at)
            : event?.finished_at_display || "Hali tugallanmagan";

    const dateDisplay = `${formatPrettyDate(event?.started_at)} - ${finishedText}`;

    const likeCount = Number(event?.like_count || 0);
    const isLiked = Boolean(event?.is_liked);

    const badgeClass = badgeClassMap[event?.type] || badgeClassMap.default;

    const handleLikeClick = () => {
        if (!isAuthenticated) {
            alert("Roadmapni yoqtirish uchun avval tizimga kiring.");
            return;
        }

        if (isLikeLoading) return;

        onToggleLike(event);
    };

    return (
        <div
            className="relative mb-8 pl-12 last:mb-0 group"
            style={{ animationDelay: `${100 * (index + 1)}ms` }}
        >
            <div
                className={`absolute left-0 top-1.5 flex h-8 w-8 items-center justify-center rounded-full ${getRoadmapColorClass(
                    colorName
                )} ring-4 ring-gray-900 transition-all duration-300 group-hover:ring-indigo-500/40`}
            >
                <div
                    className={`h-4 w-4 rounded-full border-2 border-gray-900 ${getRoadmapInnerColorClass(
                        colorName
                    )}`}
                />
            </div>

            <article className="relative overflow-hidden rounded-3xl border border-gray-700/70 bg-gray-950/35 p-5 shadow-xl shadow-black/20 transition-all duration-300 hover:border-indigo-400/40 hover:bg-gray-900/70">
                <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-indigo-500/10 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative z-10">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex min-w-0 flex-1 items-start gap-4">
                            <div
                                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-gray-700 bg-gray-900/80 ${iconColorClass}`}
                            >
                                <i className={`${eventIcon} text-2xl`}></i>
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span
                                        className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wider ${badgeClass}`}
                                    >
                                        {event?.type_display || label}
                                    </span>

                                    <span className="text-xs font-bold text-gray-500">
                                        {dateDisplay}
                                    </span>
                                </div>

                                <h4 className="mt-3 text-xl font-black leading-tight text-white transition-colors group-hover:text-indigo-300">
                                    {event?.title || "Noma’lum roadmap"}
                                </h4>
                            </div>
                        </div>

                        {isOwner && (
                            <div className="flex shrink-0 gap-2 sm:opacity-0 sm:transition-opacity sm:duration-300 sm:group-hover:opacity-100">
                                <button
                                    type="button"
                                    onClick={() => onEdit(event)}
                                    className="flex h-10 w-10 items-center justify-center rounded-2xl border border-yellow-400/20 bg-yellow-500/10 text-yellow-300 transition hover:bg-yellow-500/20 active:scale-95"
                                    title="Tahrirlash"
                                >
                                    <i className="fa-solid fa-pen-to-square"></i>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => onDelete(event)}
                                    className="flex h-10 w-10 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10 text-red-300 transition hover:bg-red-500/20 active:scale-95"
                                    title="O‘chirish"
                                >
                                    <i className="fa-solid fa-trash-can"></i>
                                </button>
                            </div>
                        )}
                    </div>

                    {event?.description && (
                        <p className="mt-4 text-sm font-medium leading-7 text-gray-300">
                            {event.description}
                        </p>
                    )}

                    <div className="mt-5 flex flex-col gap-3 border-t border-gray-700/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-xs font-semibold text-gray-500">
                            {isLiked
                                ? "Siz bu roadmapni yoqtirgansiz"
                                : "Roadmap foydali bo‘lsa like bosing"}
                        </div>

                        <button
                            type="button"
                            onClick={handleLikeClick}
                            disabled={!isAuthenticated || isLikeLoading}
                            className={`group/like relative inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-black transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${
                                isLiked
                                    ? "border-pink-400/40 bg-pink-500/15 text-pink-200 shadow-lg shadow-pink-500/20"
                                    : "border-gray-700 bg-gray-900/70 text-gray-400 hover:border-pink-400/30 hover:bg-pink-500/10 hover:text-pink-200"
                            }`}
                            title={
                                isAuthenticated
                                    ? isLiked
                                        ? "Likedan olish"
                                        : "Yoqtirish"
                                    : "Yoqtirish uchun tizimga kiring"
                            }
                        >
                            {isLiked && (
                                <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-pink-400 shadow-[0_0_14px_rgba(244,114,182,0.9)]" />
                            )}

                            {isLikeLoading ? (
                                <i className="fa-solid fa-spinner fa-spin"></i>
                            ) : (
                                <i
                                    className={`fa-heart text-base ${
                                        isLiked
                                            ? "fa-solid text-pink-400"
                                            : "fa-regular text-gray-500 group-hover/like:text-pink-300"
                                    }`}
                                ></i>
                            )}

                            <span>{likeCount}</span>

                            <span className="hidden sm:inline">
                                {isLiked ? "Liked" : "Like"}
                            </span>
                        </button>
                    </div>
                </div>
            </article>
        </div>
    );
};

export default RoadmapItem;