import React from "react";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  {
    title: "Projects",
    path: "/projects",
    icon: "fa-diagram-project",
    description: "Loyihalar va portfolio",
  },
  {
    title: "Feedback",
    path: "/feedback",
    icon: "fa-comments",
    description: "Sayt uchun fikrlar",
  },
  {
    title: "Problems",
    path: "/problems",
    icon: "fa-puzzle-piece",
    description: "Bug va muammolar",
  },
  {
    title: "Users",
    path: "/users",
    icon: "fa-users",
    description: "Developerlar",
  },
  {
    title: "FCoin",
    path: "/fcoin-history",
    icon: "fa-coins",
    description: "Coin tarixi",
  },
];

const MobileSidebar = ({ isOpen, onClose, user, userImage, coinIcon }) => {
  const location = useLocation();

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-[100] h-screen w-[86%] max-w-[340px] overflow-hidden border-r border-white/10 bg-[#070b14]/95 shadow-2xl shadow-black/70 backdrop-blur-2xl transition-transform duration-300 lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Glow */}
        <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-cyan-500/10 blur-[90px]" />
        <div className="absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-indigo-500/10 blur-[90px]" />

        <div className="relative flex h-full flex-col">
          {/* Top */}
          <div className="border-b border-white/10 p-5">
            <div className="mb-5 flex items-center justify-between">
              <Link to="/" onClick={onClose} className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-lime-400/20 bg-lime-400/10 text-lime-300 shadow-lg shadow-lime-500/10">
                  <span className="font-mono text-sm font-black">FS</span>
                </div>

                <div>
                  <h2 className="text-xl font-black tracking-tight text-white">
                    F<span className="text-indigo-400">Society</span>
                  </h2>
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-gray-500">
                    fix society
                  </p>
                </div>
              </Link>

              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-gray-400 transition hover:border-red-400/30 hover:bg-red-400/10 hover:text-red-300"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* User mini profile */}
            {user ? (
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center gap-3">
                  {userImage ? (
                    <img
                      src={userImage}
                      alt={user?.username}
                      className="h-12 w-12 rounded-2xl object-cover ring-2 ring-cyan-400/30"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 text-lg font-black text-white">
                      {user?.username?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Xush kelibsiz</p>
                    <h3 className="truncate font-mono text-sm font-black text-white">
                      @{user?.username}
                      <span className="ml-1 animate-pulse text-gray-500">_</span>
                    </h3>

                    <div className="mt-1 flex items-center gap-2">
                      <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-300">
                        {user?.skill_level || "developer"}
                      </span>

                      <span className="flex items-center gap-1 text-[11px] font-black text-yellow-300">
                        {coinIcon && (
                          <img
                            src={coinIcon}
                            alt="FCoin"
                            className="h-4 w-4 object-contain"
                          />
                        )}
                        {user?.coins ?? 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-sm text-gray-400">
                  Hisobingizga kiring va FCoin yig‘ishni boshlang.
                </p>
              </div>
            )}
          </div>

          {/* Menu */}
          <nav className="flex-1 space-y-2 overflow-y-auto p-5">
            <p className="mb-3 font-mono text-[11px] font-black uppercase tracking-[0.3em] text-gray-600">
              navigation
            </p>

            {menuItems.map((item) => {
              const active = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`group flex items-center gap-4 rounded-3xl border p-4 transition duration-300 ${
                    active
                      ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300 shadow-lg shadow-cyan-500/10"
                      : "border-white/10 bg-white/[0.03] text-gray-400 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl transition ${
                      active
                        ? "bg-cyan-400/15 text-cyan-300"
                        : "bg-white/[0.04] text-gray-500 group-hover:text-white"
                    }`}
                  >
                    <i className={`fa-solid ${item.icon}`}></i>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-black uppercase tracking-wider">
                      {item.title}
                    </h4>
                    <p className="mt-0.5 truncate text-xs text-gray-500">
                      {item.description}
                    </p>
                  </div>

                  <i className="fa-solid fa-chevron-right text-xs opacity-40"></i>
                </Link>
              );
            })}
          </nav>

          {/* Bottom */}
          <div className="border-t border-white/10 p-5">
            {user ? (
              <Link
                to={`/${user?.username}/profile/`}
                onClick={onClose}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-indigo-400/30 bg-indigo-400/10 px-4 py-3 text-sm font-black text-indigo-300 transition hover:bg-indigo-400 hover:text-[#050816]"
              >
                <i className="fa-solid fa-user"></i>
                Profilga o‘tish
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={onClose}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center text-sm font-black text-white transition hover:bg-white/[0.08]"
                >
                  Kirish
                </Link>

                <Link
                  to="/register"
                  onClick={onClose}
                  className="rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-4 py-3 text-center text-sm font-black text-white shadow-lg shadow-cyan-500/20"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default MobileSidebar;