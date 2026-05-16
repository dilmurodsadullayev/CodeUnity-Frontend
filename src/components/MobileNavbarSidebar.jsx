import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import FSocietyLogo from "../assests/logo/f_society.png";

const MobileNavbarSidebar = ({
  isOpen,
  setIsOpen,
  navLinks,
  isActive,
  isLoggedIn,
  user,
  handleLogout,
}) => {
  const sidebarVariants = {
    hidden: {
      x: "-100%",
    },
    visible: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 28,
      },
    },
    exit: {
      x: "-100%",
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />

          <motion.aside
            className="fixed left-0 top-0 z-[90] flex h-screen w-[86%] max-w-[360px] flex-col overflow-y-auto border-r border-cyan-400/10 bg-[#080d18] shadow-2xl shadow-black lg:hidden"
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* HEADER */}
            <div className="relative border-b border-white/10 p-4">
              <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-cyan-500/20 blur-3xl" />
              <div className="absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-indigo-500/20 blur-3xl" />

              <div className="relative z-10 flex items-center justify-between gap-3">
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className="flex min-w-0 flex-1 items-center gap-3"
                >
                  <img
                    src={FSocietyLogo}
                    alt="FSociety"
                    className="h-10 w-10 shrink-0 object-contain"
                  />

                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-2xl font-black tracking-tight text-white">
                      F<span className="text-indigo-400">Society</span>
                    </h2>

                    <p className="truncate font-mono text-[10px] font-black uppercase tracking-[0.22em] text-cyan-300/70">
                      Fix Society
                    </p>
                  </div>
                </Link>

                <button
                  onClick={() => setIsOpen(false)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-gray-300 transition-all hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-300"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              {isLoggedIn && (
                <div className="relative z-10 mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-500">
                    Current user
                  </p>

                  <h3 className="mt-1 truncate text-lg font-black text-white">
                    @{user?.username || "user"}
                  </h3>

                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] font-black uppercase tracking-[0.14em] text-gray-500">
                    <span>
                      Level:{" "}
                      <span className="text-cyan-300">
                        {user?.skill_level || "developer"}
                      </span>
                    </span>

                    <span className="text-gray-700">/</span>

                    <span>
                      FCoin:{" "}
                      <span className="text-yellow-300">
                        {user?.coins ?? 0}
                      </span>
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* PAGES */}
            <nav className="flex-1 space-y-2 p-4">
              <p className="mb-3 px-2 text-[11px] font-black uppercase tracking-[0.25em] text-gray-600">
                Pages
              </p>

              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`group flex items-center gap-4 rounded-2xl border p-4 font-black transition-all ${
                    isActive(link.path)
                      ? "border-indigo-400/40 bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                      : "border-white/10 bg-white/[0.035] text-gray-400 hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-300"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                      isActive(link.path)
                        ? "bg-white/15 text-white"
                        : "bg-black/20 text-gray-500 group-hover:text-cyan-300"
                    }`}
                  >
                    <i className={`${link.iconClass} text-sm`}></i>
                  </span>

                  <span className="text-sm uppercase tracking-[0.12em]">
                    {link.text}
                  </span>

                  <i className="fas fa-chevron-right ml-auto text-xs opacity-40"></i>
                </Link>
              ))}
            </nav>

            {/* BOTTOM */}
            <div className="border-t border-white/10 p-4">
              {isLoggedIn ? (
                <div className="space-y-2">
                  <Link
                    to={`/${user?.username || "user"}/profile`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4 font-bold text-gray-300 transition-all hover:border-indigo-400/40 hover:bg-indigo-500/10 hover:text-indigo-300"
                  >
                    <i className="fas fa-user-circle text-indigo-300"></i>
                    Profilim
                  </Link>

                  <Link
                    to="/my-problems"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4 font-bold text-gray-300 transition-all hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-cyan-300"
                  >
                    <i className="fas fa-bug text-cyan-300"></i>
                    Muammolarim
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 font-bold text-red-300 transition-all hover:bg-red-500/20"
                  >
                    <i className="fas fa-sign-out-alt"></i>
                    Chiqish
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 p-4 font-black text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500"
                >
                  <i className="fas fa-right-to-bracket"></i>
                  Kirish
                </Link>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileNavbarSidebar;