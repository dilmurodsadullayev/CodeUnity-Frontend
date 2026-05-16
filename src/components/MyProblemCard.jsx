// src/components/MyProblemCard.jsx

import React from "react";
import UserImage from "../assests/userImage.jpeg";
import { Link } from "react-router-dom";
import { limitText } from "../utils/limitText";
import timeAgo from "../utils/timeAgo";

const MyProblemCard = ({
  id,
  username,
  firstName,
  lastName,
  image,
  name,
  status,
  views,
  languages,
  createdAt,
  star,
  responseCount,
  deadline,
  isUrgent,
}) => {
  const getDeadlineText = (deadlineValue) => {
    if (!deadlineValue) return null;

    const now = new Date();
    const deadlineDate = new Date(deadlineValue);
    const diffMs = deadlineDate - now;

    if (diffMs < 0) {
      return {
        text: "Muddati tugagan",
        icon: "fas fa-circle-exclamation",
        className:
          "border-red-400/30 bg-red-500/10 text-red-300 shadow-red-500/10",
      };
    }

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return {
        text: `${diffDays} kun qoldi`,
        icon: "fas fa-calendar-days",
        className:
          "border-yellow-400/30 bg-yellow-500/10 text-yellow-300 shadow-yellow-500/10",
      };
    }

    if (diffHours > 0) {
      return {
        text: `${diffHours} soat qoldi`,
        icon: "fas fa-clock",
        className:
          "border-orange-400/30 bg-orange-500/10 text-orange-300 shadow-orange-500/10",
      };
    }

    return {
      text: `${Math.max(diffMinutes, 0)} daqiqa qoldi`,
      icon: "fas fa-fire",
      className:
        "border-red-400/30 bg-red-500/10 text-red-300 shadow-red-500/10",
    };
  };

  const deadlineInfo = getDeadlineText(deadline);

  const fullName =
    firstName || lastName
      ? `${firstName || ""} ${lastName || ""}`.trim()
      : username || "Unknown user";

  const getImageSrc = () => {
    if (!image) return UserImage;

    if (String(image).startsWith("http")) {
      return image;
    }

    return image;
  };

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
      <Link
        to={`/problem/${id}/detail`}
        className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0d1117] p-5 shadow-2xl shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-cyan-500/10"
      >
        {/* Glow effects */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl transition-all duration-300 group-hover:bg-cyan-500/20" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-44 w-44 rounded-full bg-indigo-500/10 blur-3xl transition-all duration-300 group-hover:bg-indigo-500/20" />

        <div className="relative z-10 flex h-full flex-col">
          {/* Top badges */}
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-cyan-300">
                <i className="fa-solid fa-terminal"></i>
                FSociety
              </span>

              {isUrgent && (
                <span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-yellow-300">
                  <i className="fas fa-bolt"></i>
                  Tezkor
                </span>
              )}
            </div>

            <span
              className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-black ${
                status
                  ? "border-green-400/30 bg-green-500/10 text-green-300"
                  : "border-red-400/30 bg-red-500/10 text-red-300"
              }`}
            >
              {status ? "Yechilgan" : "Yechilmagan"}
            </span>
          </div>

          {/* User */}
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3">
            <img
              src={getImageSrc()}
              alt="User avatar"
              className="h-12 w-12 shrink-0 rounded-2xl border border-cyan-400/20 object-cover transition-all duration-300 group-hover:border-cyan-400/50"
            />

            <div className="min-w-0 flex-1">
              <h4 className="truncate text-sm font-black text-white">
                {fullName}
              </h4>

              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold text-gray-500">
                <span className="truncate">@{username || "user"}</span>

                <span className="hidden text-gray-700 sm:inline">/</span>

                <span>{timeAgo(createdAt)}</span>
              </div>
            </div>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-gray-500 transition-all group-hover:border-cyan-400/30 group-hover:text-cyan-300">
              <i className="fas fa-code"></i>
            </div>
          </div>

          {/* Title */}
          <h3 className="mb-4 text-xl font-black leading-7 text-white transition-colors duration-300 group-hover:text-cyan-300">
            {limitText(name || "Nomsiz muammo", 75)}
          </h3>

          {/* Deadline */}
          {deadlineInfo && (
            <div
              className={`mb-4 inline-flex w-fit items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-black shadow-lg ${deadlineInfo.className}`}
            >
              <i className={deadlineInfo.icon}></i>
              <span>{deadlineInfo.text}</span>
            </div>
          )}

          {/* Languages */}
          <div className="mb-5 flex flex-wrap gap-2">
            {languages?.length > 0 ? (
              languages.map((language, index) => (
                <span
                  key={index}
                  className="rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-[11px] font-black text-indigo-300"
                >
                  {language?.name || language}
                </span>
              ))
            ) : (
              <span className="rounded-full border border-gray-700 bg-white/[0.035] px-3 py-1 text-[11px] font-bold text-gray-500">
                Til belgilanmagan
              </span>
            )}
          </div>

          <div className="flex-grow" />

          {/* Stats */}
          <div className="mt-2 grid grid-cols-3 gap-3 border-t border-white/10 pt-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3 text-center">
              <p className="text-base font-black text-cyan-300">
                {views || 0}
              </p>
              <p className="mt-1 text-[10px] font-black uppercase tracking-[0.14em] text-gray-500">
                Views
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3 text-center">
              <p className="text-base font-black text-yellow-300">
                {star || 0}
              </p>
              <p className="mt-1 text-[10px] font-black uppercase tracking-[0.14em] text-gray-500">
                Stars
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-center">
              <p className="text-base font-black text-cyan-300">
                {responseCount || 0}
              </p>
              <p className="mt-1 text-[10px] font-black uppercase tracking-[0.14em] text-gray-500">
                Answers
              </p>
            </div>
          </div>

          {/* Bottom action */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs font-bold text-gray-500">
              <i className="fas fa-shield-halved mr-1 text-cyan-300"></i>
              My problem archive
            </p>

            <span className="inline-flex items-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-black text-cyan-300 transition-all duration-300 group-hover:border-cyan-400/40 group-hover:bg-cyan-400/20">
              Batafsil
              <i className="fas fa-arrow-right transition-transform duration-300 group-hover:translate-x-1"></i>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MyProblemCard;