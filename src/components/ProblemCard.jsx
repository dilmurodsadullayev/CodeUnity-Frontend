import React from "react";
import UserImage from "../assests/userImage.jpeg";
import { Link } from "react-router-dom";
import { limitText } from "../utils/limitText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faHourglassHalf,
  faEye,
  faCommentAlt,
  faStar,
  faArrowRight,
  faCode,
  faBug,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import timeAgo from "../utils/timeAgo";

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000";

const getImageUrl = (image) => {
  if (!image) return UserImage;

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `${BACKEND_URL}${image}`;
};

const ProblemCard = ({
  id,
  username,
  firstName,
  lastName,
  image,
  name,
  views,
  languages,
  createdAt,
  star,
  responseCount,
  isSolved,
}) => {
  const fullName =
    firstName || lastName
      ? `${firstName || ""} ${lastName || ""}`.trim()
      : username || "Anonymous";

  const avatar = getImageUrl(image);

  const statusData = isSolved
    ? {
        text: "YECHILGAN",
        icon: faCheckCircle,
        border: "border-emerald-400/30",
        bg: "bg-emerald-400/10",
        textColor: "text-emerald-300",
        glow: "shadow-emerald-500/10",
        line: "from-emerald-400 via-cyan-400 to-transparent",
      }
    : {
        text: "YECHILMAGAN",
        icon: faHourglassHalf,
        border: "border-red-400/30",
        bg: "bg-red-400/10",
        textColor: "text-red-300",
        glow: "shadow-red-500/10",
        line: "from-red-400 via-orange-400 to-transparent",
      };

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: "0.25s" }}>
      <Link
        to={`/problem/${id}/detail`}
        className={`
          group relative block h-full overflow-hidden rounded-3xl border bg-[#050816] p-[1px]
          shadow-2xl shadow-black/30 transition-all duration-300
          hover:-translate-y-1.5 hover:shadow-cyan-500/10
          ${statusData.border} ${statusData.glow}
        `}
      >
        {/* Glow background */}
        <div className="absolute -left-24 -top-24 h-52 w-52 rounded-full bg-cyan-500/10 blur-3xl transition duration-500 group-hover:bg-cyan-400/20" />
        <div className="absolute -bottom-24 -right-24 h-52 w-52 rounded-full bg-indigo-500/10 blur-3xl transition duration-500 group-hover:bg-indigo-400/20" />

        {/* Status line */}
        <div
          className={`absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r ${statusData.line}`}
        />

        <div className="relative flex h-full flex-col rounded-3xl bg-gradient-to-br from-[#0b1020] via-[#080d18] to-[#0d1117] p-5">
          {/* Top */}
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative shrink-0">
                <img
                  src={avatar}
                  alt={username || "user"}
                  className={`
                    h-11 w-11 rounded-2xl border object-cover shadow-lg
                    ${isSolved ? "border-emerald-400/40" : "border-red-400/30"}
                  `}
                />

                <span
                  className={`
                    absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-[#0b1020]
                    ${isSolved ? "bg-emerald-400" : "bg-red-400"}
                  `}
                />
              </div>

              <div className="min-w-0">
                <h4 className="truncate text-sm font-black text-white">
                  {fullName}
                </h4>

                <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                  <span className="truncate font-mono">
                    @{username || "unknown"}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faClock} />
                    {timeAgo(createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Status */}
            <span
              className={`
                shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-black uppercase tracking-wider
                ${statusData.border} ${statusData.bg} ${statusData.textColor}
              `}
            >
              <FontAwesomeIcon icon={statusData.icon} className="mr-1.5" />
              {statusData.text}
            </span>
          </div>

          {/* Ticket label */}
          <div className="mb-3 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-cyan-300">
              <FontAwesomeIcon icon={faBug} />
              problem ticket
            </div>

            <span className="font-mono text-xs font-black text-gray-600">
              #{id}
            </span>
          </div>

          {/* Title */}
          <h3 className="mb-5 text-xl font-black leading-snug text-white transition duration-300 group-hover:text-cyan-300">
            {limitText(name || "Nomsiz muammo", 80)}
          </h3>

          {/* Languages */}
          <div className="mb-5 flex min-h-[32px] flex-wrap gap-2">
            {languages && languages.length > 0 ? (
              languages.map((language, index) => {
                const langName =
                  typeof language === "object"
                    ? language.name || language.title || `Lang ${language.id}`
                    : language;

                return (
                  <span
                    key={language?.id || language?.name || index}
                    className={`
                      rounded-full border px-3 py-1 text-xs font-bold transition duration-300 hover:scale-105
                      ${
                        isSolved
                          ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                          : "border-orange-400/20 bg-orange-400/10 text-orange-300"
                      }
                    `}
                  >
                    <FontAwesomeIcon icon={faCode} className="mr-1.5" />
                    {langName}
                  </span>
                );
              })
            ) : (
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold text-gray-400">
                <FontAwesomeIcon icon={faCode} className="mr-1.5" />
                No language
              </span>
            )}
          </div>

          {/* Bottom */}
          <div className="mt-auto border-t border-white/10 pt-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Stats */}
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-semibold text-gray-400">
                  <FontAwesomeIcon
                    icon={faEye}
                    className="mr-1.5 text-cyan-300"
                  />
                  {views || 0}
                </span>

                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-semibold text-gray-400">
                  <FontAwesomeIcon
                    icon={faCommentAlt}
                    className="mr-1.5 text-indigo-300"
                  />
                  {responseCount || 0}
                </span>

                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-semibold text-gray-400">
                  <FontAwesomeIcon
                    icon={faStar}
                    className="mr-1.5 text-yellow-300"
                  />
                  {star || 0}
                </span>
              </div>

              {/* CTA */}
              <span
                className={`
                  inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-2 text-xs font-black uppercase tracking-wider
                  transition duration-300 group-hover:translate-x-1
                  ${
                    isSolved
                      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300 group-hover:bg-emerald-400 group-hover:text-[#050816]"
                      : "border-cyan-400/20 bg-cyan-400/10 text-cyan-300 group-hover:bg-cyan-400 group-hover:text-[#050816]"
                  }
                `}
              >
                Yechimni ko‘rish
                <FontAwesomeIcon icon={faArrowRight} />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProblemCard;