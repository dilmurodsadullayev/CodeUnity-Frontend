import React from "react";
import { FaStar, FaCoins, FaCode, FaUserAstronaut } from "react-icons/fa";
import { Link } from "react-router-dom";
import UserImage from "../assests/userImage.jpeg";

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000";

const getImageUrl = (image) => {
  if (!image) return UserImage;

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `${BACKEND_URL}${image}`;
};

const UserCard = ({ user, isLoading, index }) => {
  const getSkillColor = (skill) => {
    switch (skill?.toLowerCase()) {
      case "python":
        return "border-sky-400/20 bg-sky-400/10 text-sky-300";
      case "django":
        return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
      case "docker":
        return "border-blue-400/20 bg-blue-400/10 text-blue-300";
      case "fastapi":
        return "border-green-400/20 bg-green-400/10 text-green-300";
      case "js":
      case "javascript":
        return "border-yellow-400/20 bg-yellow-400/10 text-yellow-300";
      case "react":
        return "border-cyan-400/20 bg-cyan-400/10 text-cyan-300";
      case "tailwind":
        return "border-teal-400/20 bg-teal-400/10 text-teal-300";
      case "figma":
        return "border-pink-400/20 bg-pink-400/10 text-pink-300";
      case "node.js":
      case "node":
        return "border-lime-400/20 bg-lime-400/10 text-lime-300";
      case "mongodb":
        return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
      default:
        return "border-gray-400/20 bg-gray-400/10 text-gray-300";
    }
  };

  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b1020] p-5 shadow-2xl shadow-black/30 animate-pulse">
        <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-white/10" />

          <div className="flex-1">
            <div className="mb-3 h-5 w-32 rounded-full bg-white/10" />
            <div className="h-4 w-20 rounded-full bg-white/10" />
          </div>
        </div>

        <div className="my-5 grid grid-cols-2 gap-3">
          <div className="h-16 rounded-2xl bg-white/10" />
          <div className="h-16 rounded-2xl bg-white/10" />
        </div>

        <div className="mb-5 flex gap-2">
          <div className="h-7 w-16 rounded-full bg-white/10" />
          <div className="h-7 w-20 rounded-full bg-white/10" />
          <div className="h-7 w-14 rounded-full bg-white/10" />
        </div>

        <div className="h-11 rounded-2xl bg-white/10" />
      </div>
    );
  }

  const visibleSkills = user?.skills?.slice(0, 4) || [];
  const extraSkills = (user?.skills?.length || 0) - 4;

  const rating = Number(user?.total_rating || 0).toFixed(1);
  const coins = user?.coins || 0;
  const username = user?.username || "anonymous";
  const skillLevel = user?.skill_level || "developer";
  const avatar = getImageUrl(user?.image);

  return (
    <div className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-[#050816] p-[1px] shadow-2xl shadow-black/40 transition-all duration-300 hover:-translate-y-2 hover:border-cyan-400/40 hover:shadow-cyan-500/20">
      {/* Glow effects */}
      <div className="absolute -left-20 -top-20 h-44 w-44 rounded-full bg-cyan-500/15 blur-3xl transition duration-500 group-hover:bg-cyan-400/25" />
      <div className="absolute -bottom-20 -right-20 h-44 w-44 rounded-full bg-indigo-500/15 blur-3xl transition duration-500 group-hover:bg-indigo-400/25" />

      <div className="relative flex h-full flex-col rounded-3xl bg-gradient-to-br from-[#0b1020] via-[#080d18] to-[#111827] p-5">
        {/* Top terminal line */}
        <div className="mb-5 flex items-center justify-between">
          <div className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-gray-600">
            fsociety::user
          </div>

          <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 font-mono text-[10px] font-black text-cyan-300">
            #{String((index || 0) + 1).padStart(2, "0")}
          </div>
        </div>

        {/* User header */}
        <div className="mb-5 flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-2xl bg-cyan-400/30 blur-xl transition duration-500 group-hover:bg-cyan-400/50" />

            <img
              src={avatar}
              alt={username}
              className="relative h-16 w-16 rounded-2xl border border-cyan-400/30 object-cover shadow-xl shadow-cyan-500/10"
            />

            <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-[#0b1020] bg-lime-400 shadow-[0_0_14px_rgba(163,230,53,0.9)]" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate font-mono text-lg font-black text-white">
              @{username}
              <span className="ml-1 animate-pulse text-gray-500">_</span>
            </h3>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-emerald-300">
                {skillLevel}
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-bold text-gray-400">
                <FaUserAstronaut className="mr-1 inline text-gray-500" />
                Member
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-4">
            <div className="mb-2 flex items-center justify-between">
              <FaStar className="text-yellow-300" />
              <span className="font-mono text-[10px] font-black uppercase tracking-widest text-yellow-300/60">
                Rating
              </span>
            </div>

            <p className="text-2xl font-black text-white">{rating}</p>
            <p className="mt-1 text-xs text-gray-500">Umumiy reyting</p>
          </div>

          <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
            <div className="mb-2 flex items-center justify-between">
              <FaCoins className="text-amber-300" />
              <span className="font-mono text-[10px] font-black uppercase tracking-widest text-amber-300/60">
                FCoin
              </span>
            </div>

            <p className="text-2xl font-black text-white">{coins}</p>
            <p className="mt-1 text-xs text-gray-500">Platform coin</p>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-5 flex-1">
          <div className="mb-3 flex items-center gap-2">
            <FaCode className="text-cyan-300" />
            <p className="font-mono text-[11px] font-black uppercase tracking-[0.25em] text-gray-500">
              skills
            </p>
          </div>

          {visibleSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {visibleSkills.map((skill) => (
                <span
                  key={skill}
                  className={`rounded-full border px-3 py-1 text-xs font-black transition duration-300 hover:scale-105 ${getSkillColor(
                    skill
                  )}`}
                >
                  #{skill}
                </span>
              ))}

              {extraSkills > 0 && (
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-black text-gray-400">
                  +{extraSkills}
                </span>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-gray-500">
              Skills hali qo‘shilmagan.
            </div>
          )}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-4">
          <Link
            to={`/${username}/profile/`}
            className="group/btn flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-3 text-sm font-black uppercase tracking-wider text-white shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-cyan-500/40"
          >
            Profilni ko‘rish
            <span className="transition duration-300 group-hover/btn:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserCard;