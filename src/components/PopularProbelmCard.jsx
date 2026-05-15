import React from "react";
import { limitText } from "../utils/limitText";

// Agar media rasmlar backenddan kelsa:
// .env ichida: REACT_APP_BACKEND_URL=http://127.0.0.1:8000
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000";

const getImageUrl = (image) => {
  if (!image) return null;

  // Agar rasm allaqachon full URL bo'lsa
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  // Agar /media/... ko'rinishida kelsa
  return `${BACKEND_URL}${image}`;
};

const formatDate = (date) => {
  if (!date) return "Yaqinda";

  return new Date(date).toLocaleDateString("uz-UZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const StatItem = ({ icon, value, label }) => {
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-gray-300 transition duration-300 hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-300">
      <span className="text-sm">{icon}</span>
      <span className="font-bold">{value ?? 0}</span>
      <span className="hidden sm:inline text-gray-500">{label}</span>
    </div>
  );
};

const PopularProblemCard = ({
  id,
  problem,
  description,
  star,
  response,
  views,
  user,
  language = [],
  isSolved = false,
  createdAt,
}) => {
  const fullName =
    user?.first_name || user?.last_name
      ? `${user?.first_name || ""} ${user?.last_name || ""}`.trim()
      : user?.username || "FSociety User";

  const userImage = getImageUrl(user?.image);

  const skillLevel = user?.skill_level || "developer";
  const coins = user?.coins ?? 0;

  return (
    <div className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-[#050816] p-[1px] shadow-2xl shadow-black/40 transition-all duration-300 hover:-translate-y-2 hover:border-cyan-400/40 hover:shadow-cyan-500/20">
      {/* Orqa glow effektlar */}
      <div className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl transition duration-500 group-hover:bg-cyan-400/30" />
      <div className="absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-fuchsia-500/20 blur-3xl transition duration-500 group-hover:bg-indigo-500/30" />

      <div className="relative flex h-full flex-col rounded-3xl bg-gradient-to-br from-[#08111f] via-[#0b1020] to-[#111827] p-5">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-cyan-300">
              FSociety
            </span>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-bold ${
                isSolved
                  ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                  : "border-orange-400/30 bg-orange-400/10 text-orange-300"
              }`}
            >
              {isSolved ? "✅ Solved" : "🔥 Open"}
            </span>
          </div>

          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-gray-400">
            #{id}
          </span>
        </div>

        {/* User */}
        <div className="mb-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
          <div className="relative">
            {userImage ? (
              <img
                src={userImage}
                alt={user?.username || "user"}
                className="h-12 w-12 rounded-2xl object-cover ring-2 ring-cyan-400/40"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 text-lg font-black text-white ring-2 ring-cyan-400/40">
                {fullName.charAt(0).toUpperCase()}
              </div>
            )}

            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-[#08111f] bg-emerald-500 text-[10px] text-white">
              ✓
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="truncate text-sm font-black text-white">
              {fullName}
            </h4>

            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-indigo-400/10 px-2 py-0.5 text-[11px] font-bold text-indigo-300">
                @{user?.username || "unknown"}
              </span>

              <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[11px] font-bold capitalize text-emerald-300">
                {skillLevel}
              </span>

              <span className="rounded-full bg-yellow-400/10 px-2 py-0.5 text-[11px] font-black text-yellow-300">
                🪙 {coins}
              </span>
            </div>
          </div>
        </div>

        {/* Problem title */}
        <h3 className="mb-3 cursor-pointer text-xl font-black leading-snug text-gray-100 transition duration-300 group-hover:text-cyan-300">
          {limitText(problem, 55)}
        </h3>

        {/* Description */}
        <p className="mb-5 flex-grow text-sm leading-6 text-gray-400">
          {limitText(description, 120)}
        </p>

        {/* Languages / tags */}
        <div className="mb-5 flex flex-wrap gap-2">
          {language && language.length > 0 ? (
            language.map((item, index) => (
              <span
                key={index}
                className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-bold text-sky-300 transition duration-300 hover:scale-105 hover:bg-sky-400/20"
              >
                {typeof item === "object"
                  ? item.name || item.title || `Lang ${item.id}`
                  : `Lang ${item}`}
              </span>
            ))
          ) : (
            <>
              <span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-bold text-sky-300">
                #Problem
              </span>
              <span className="rounded-full border border-purple-400/20 bg-purple-400/10 px-3 py-1 text-xs font-bold text-purple-300">
                #Solution
              </span>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto border-t border-white/10 pt-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">
              Joylangan: {formatDate(createdAt)}
            </span>

            <span className="rounded-full bg-white/[0.04] px-3 py-1 text-xs font-bold text-gray-400">
              Need solution?
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <StatItem icon="👁" value={views} label="views" />
              <StatItem icon="💬" value={response} label="answers" />
              <StatItem icon="⭐" value={star ?? 0} label="stars" />
            </div>

            <button className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-black text-cyan-300 transition duration-300 hover:bg-cyan-400 hover:text-[#050816]">
              View Problem →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularProblemCard;