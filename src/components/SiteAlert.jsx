import React, { useEffect } from "react";

const alertStyles = {
  success: {
    border: "border-emerald-400/30",
    bg: "bg-emerald-400/10",
    glow: "shadow-emerald-500/20",
    iconBg: "bg-emerald-400/15",
    iconText: "text-emerald-300",
    title: "text-emerald-300",
    line: "bg-emerald-400",
    icon: "fa-check",
    code: "SUCCESS",
  },
  error: {
    border: "border-red-400/30",
    bg: "bg-red-400/10",
    glow: "shadow-red-500/20",
    iconBg: "bg-red-400/15",
    iconText: "text-red-300",
    title: "text-red-300",
    line: "bg-red-400",
    icon: "fa-triangle-exclamation",
    code: "ERROR",
  },
  warning: {
    border: "border-yellow-400/30",
    bg: "bg-yellow-400/10",
    glow: "shadow-yellow-500/20",
    iconBg: "bg-yellow-400/15",
    iconText: "text-yellow-300",
    title: "text-yellow-300",
    line: "bg-yellow-400",
    icon: "fa-bolt",
    code: "WARNING",
  },
  info: {
    border: "border-cyan-400/30",
    bg: "bg-cyan-400/10",
    glow: "shadow-cyan-500/20",
    iconBg: "bg-cyan-400/15",
    iconText: "text-cyan-300",
    title: "text-cyan-300",
    line: "bg-cyan-400",
    icon: "fa-terminal",
    code: "INFO",
  },
};

const SiteAlert = ({ alert, onClose }) => {
  const duration = alert?.duration || 3500;
  const type = alert?.type || "info";
  const style = alertStyles[type] || alertStyles.info;

  useEffect(() => {
    if (!alert) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [alert, duration, onClose]);

  if (!alert) return null;

  return (
    <>
      <style>
        {`
          @keyframes fsociety-alert-in {
            from {
              opacity: 0;
              transform: translateY(-14px) scale(0.96);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes fsociety-alert-progress {
            from {
              transform: scaleX(1);
            }
            to {
              transform: scaleX(0);
            }
          }
        `}
      </style>

      <div className="fixed right-4 top-24 z-[9999] w-[calc(100%-32px)] max-w-md sm:right-6">
        <div
          className={`
            relative overflow-hidden rounded-2xl border ${style.border}
            ${style.bg} shadow-2xl ${style.glow} backdrop-blur-xl
          `}
          style={{ animation: "fsociety-alert-in 260ms ease-out forwards" }}
        >
          {/* Glow */}
          <div className="absolute -right-14 -top-14 h-28 w-28 rounded-full bg-white/10 blur-3xl" />

          <div className="relative flex gap-4 p-4">
            {/* Icon */}
            <div
              className={`
                flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl
                ${style.iconBg} ${style.iconText}
              `}
            >
              <i className={`fa-solid ${style.icon} text-xl`}></i>
            </div>

            {/* Text */}
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span
                  className={`
                    font-mono text-[11px] font-black uppercase tracking-[0.25em]
                    ${style.title}
                  `}
                >
                  fsociety::{alert.code || style.code}
                </span>

                <span className="h-1 w-1 rounded-full bg-gray-500" />

                <span className="font-mono text-[11px] text-gray-500">
                  now
                </span>
              </div>

              <h3 className="text-base font-black text-white">
                {alert.title || "FSociety Alert"}
                <span className="ml-1 animate-pulse text-gray-500">_</span>
              </h3>

              {alert.message && (
                <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-gray-300">
                  {alert.message}
                </p>
              )}
            </div>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-gray-500 transition hover:bg-white/10 hover:text-white"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          {/* Progress bar */}
          <div className="h-1 w-full bg-white/10">
            <div
              className={`h-full origin-left ${style.line}`}
              style={{
                animation: `fsociety-alert-progress ${duration}ms linear forwards`,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SiteAlert;