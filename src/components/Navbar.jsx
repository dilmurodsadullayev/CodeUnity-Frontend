import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import UserImage from "../assests/userImage.jpeg";
import FSocietyLogo from "../assests/logo/f_society.png";
import FCoinIcon from "../assests/coin/fcoin.png";

import NotificationDropdown from "./NotificationDropdown";
import MobileNavbarSidebar from "./MobileNavbarSidebar";
import { logoutUser } from "../features/auth/Auth";
import AuthService from "../services/auth";

const Navbar = () => {
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const baseUrl = window.location.origin;

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    {
      path: "/projects",
      iconClass: "fas fa-diagram-project",
      text: "Projects",
    },
    {
      path: "/feedback",
      iconClass: "fas fa-comments",
      text: "Feedback",
    },
    {
      path: "/problems",
      iconClass: "fas fa-puzzle-piece",
      text: "Problems",
    },
    {
      path: "/users",
      iconClass: "fas fa-users",
      text: "Users",
    },
    {
      path: "/fcoin",
      iconClass: "fas fa-coins",
      text: "F Coin",
    },
  ];

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.15,
      },
    },
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setOpenUserMenu(false);
      }

      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setOpenNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    setOpenUserMenu(false);
    setIsMobileMenuOpen(false);

    try {
      await AuthService.userLogout();
      dispatch(logoutUser());
      navigate("/login");
    } catch (error) {
      dispatch(logoutUser());
      navigate("/login");
    }
  };

  return (
    <>
      <header className="sticky left-0 right-0 top-0 z-50 border-b border-gray-800 bg-gray-950/90 backdrop-blur-xl">
        <div className="mx-auto w-full max-w-[1700px] px-3 sm:px-4 xl:px-8">
          <div className="flex h-[72px] items-center justify-between gap-2 sm:h-[82px] lg:gap-3">
            {/* LEFT: LOGO */}
            <Link
              to="/"
              className="group relative z-50 flex min-w-0 shrink-0 items-center gap-2 sm:gap-4 lg:min-w-[230px]"
            >
              <motion.img
                src={FSocietyLogo}
                alt="F.Society"
                className="h-10 w-auto shrink-0 object-contain transition-all duration-500 group-hover:rotate-[360deg] sm:h-14 md:h-[60px] lg:h-[64px]"
              />

              <div className="relative hidden h-12 w-[118px] shrink-0 items-center overflow-hidden min-[430px]:flex sm:h-14 sm:w-[155px] lg:w-[185px]">
                {/* NORMAL TEXT */}
                <span className="absolute left-0 top-1/2 -translate-y-1/2 whitespace-nowrap text-[21px] font-black leading-none tracking-tighter text-white transition-all duration-500 group-hover:-translate-y-[180%] group-hover:opacity-0 sm:text-[26px] lg:text-[30px]">
                  F<span className="text-indigo-500">Society</span>
                </span>

                {/* HOVER TEXT */}
                <span className="absolute left-0 top-1/2 translate-y-[90%] whitespace-nowrap text-[21px] font-black leading-none tracking-tighter text-indigo-400 opacity-0 transition-all duration-500 group-hover:-translate-y-1/2 group-hover:opacity-100 sm:text-[26px] lg:text-[30px]">
                  Fix <span className="text-white">Society</span>
                </span>
              </div>
            </Link>

            {/* CENTER: DESKTOP NAV */}
            <nav className="hidden items-center space-x-1 rounded-2xl border border-gray-700/30 bg-gray-800/40 p-1.5 lg:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 rounded-xl px-5 py-2.5 transition-all duration-300 ${
                    isActive(link.path)
                      ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                      : "text-gray-400 hover:bg-gray-700/50 hover:text-white"
                  }`}
                >
                  <i className={`${link.iconClass} text-sm`}></i>

                  <span className="text-sm font-black uppercase tracking-wider">
                    {link.text}
                  </span>
                </Link>
              ))}
            </nav>

            {/* RIGHT: ACTIONS */}
            <div className="flex min-w-0 shrink-0 items-center justify-end gap-1.5 sm:gap-3 md:gap-4">
              {isLoggedIn ? (
                <>
                  {/* FCOIN */}
                  <Link
                    to="/fcoin-history"
                    className="flex shrink-0 items-center gap-1 rounded-full border border-yellow-500/20 bg-gray-900/70 py-1 pl-1 pr-2 shadow-lg transition-all duration-300 hover:border-yellow-400/60 hover:bg-gray-800/80 sm:gap-2 sm:pr-4"
                  >
                    <motion.div
                      whileHover={{
                        scale: 1.1,
                        rotate: 8,
                      }}
                      className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-yellow-400/30 bg-yellow-500/10 shadow-[0_0_18px_rgba(234,179,8,0.35)] sm:h-10 sm:w-10"
                    >
                      <img
                        src={FCoinIcon}
                        alt="FCoin"
                        className="h-6 w-6 object-contain drop-shadow-[0_0_8px_rgba(234,179,8,0.8)] sm:h-7 sm:w-7"
                      />

                      <span className="absolute inset-0 -z-10 rounded-full bg-yellow-400/10 blur-md"></span>
                    </motion.div>

                    <span className="max-w-[48px] truncate text-sm font-black tracking-tight text-yellow-400 sm:max-w-[80px] sm:text-lg md:text-xl">
                      {user?.coins || 0}
                    </span>
                  </Link>

                  {/* NOTIFICATIONS */}
                  <NotificationDropdown
                    openNotifications={openNotifications}
                    setOpenNotifications={setOpenNotifications}
                    notificationsRef={notificationsRef}
                  />

                  {/* USER DROPDOWN */}
                  <div className="relative shrink-0" ref={userMenuRef}>
                    <button
                      onClick={() => setOpenUserMenu(!openUserMenu)}
                      className="group flex shrink-0 items-center rounded-full border border-gray-700 bg-gray-800/50 p-1 outline-none transition-all hover:border-indigo-500/60 hover:bg-gray-800 sm:gap-3 sm:py-1 sm:pl-1 sm:pr-4"
                    >
                      <img
                        src={user?.image ? `${baseUrl}${user.image}` : UserImage}
                        alt="User"
                        className="aspect-square h-9 w-9 shrink-0 rounded-full border-2 border-gray-700 object-cover shadow-xl transition-all group-hover:border-indigo-500 sm:h-10 sm:w-10 md:h-12 md:w-12"
                      />

                      {/* TELEFONDA USERNAME KO'RINMAYDI */}
                      <span className="hidden max-w-[110px] truncate text-sm font-bold text-white transition-colors group-hover:text-indigo-400 sm:block md:max-w-[130px]">
                        @{user?.username || "user"}
                      </span>

                      <i
                        className={`hidden text-xs text-gray-500 transition-transform duration-300 sm:block ${
                          openUserMenu ? "rotate-180" : ""
                        } fas fa-chevron-down`}
                      ></i>
                    </button>

                    <AnimatePresence>
                      {openUserMenu && (
                        <motion.div
                          className="absolute right-0 z-[70] mt-3 w-[270px] overflow-hidden rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl"
                          variants={dropdownVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          {/* USER INFO */}
                          <div className="border-b border-gray-700 bg-gray-800/50 p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  user?.image
                                    ? `${baseUrl}${user.image}`
                                    : UserImage
                                }
                                alt="User"
                                className="aspect-square h-12 w-12 shrink-0 rounded-full border-2 border-indigo-500/50 object-cover"
                              />

                              <div className="min-w-0">
                                <p className="truncate text-base font-black text-white">
                                  {user?.first_name
                                    ? `${user.first_name} ${
                                        user.last_name || ""
                                      }`
                                    : "FSociety User"}
                                </p>

                                <p className="truncate font-mono text-xs font-bold text-indigo-400">
                                  @{user?.username || "user"}
                                </p>
                              </div>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-2">
                              <div className="rounded-xl border border-white/10 bg-black/20 p-2">
                                <p className="text-[10px] font-bold uppercase text-gray-500">
                                  Level
                                </p>

                                <p className="truncate text-xs font-black text-cyan-300">
                                  {user?.skill_level || "developer"}
                                </p>
                              </div>

                              <div className="rounded-xl border border-white/10 bg-black/20 p-2">
                                <p className="text-[10px] font-bold uppercase text-gray-500">
                                  FCoin
                                </p>

                                <p className="truncate text-xs font-black text-yellow-300">
                                  {user?.coins || 0}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* DROPDOWN LINKS */}
                          <div className="p-2">
                            <Link
                              to={`/${user?.username || "user"}/profile`}
                              className="flex items-center rounded-xl p-3 text-gray-300 transition-all hover:bg-indigo-600 hover:text-white"
                              onClick={() => setOpenUserMenu(false)}
                            >
                              <i className="fas fa-user-circle mr-3 text-indigo-300"></i>
                              Profilim
                            </Link>

                            <Link
                              to="/my-problems"
                              className="flex items-center rounded-xl p-3 text-gray-300 transition-all hover:bg-indigo-600 hover:text-white"
                              onClick={() => setOpenUserMenu(false)}
                            >
                              <i className="fas fa-bug mr-3 text-cyan-300"></i>
                              Muammolarim
                            </Link>

                            <Link
                              to="/fcoin-history"
                              className="flex items-center rounded-xl p-3 text-gray-300 transition-all hover:bg-yellow-500/10 hover:text-yellow-300"
                              onClick={() => setOpenUserMenu(false)}
                            >
                              <i className="fas fa-coins mr-3 text-yellow-300"></i>
                              FCoin tarixi
                            </Link>

                            <button
                              onClick={handleLogout}
                              className="mt-2 flex w-full items-center rounded-xl border-t border-gray-800 p-3 text-red-400 transition-all hover:bg-red-500/20"
                            >
                              <i className="fas fa-sign-out-alt mr-3"></i>
                              Chiqish
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 sm:px-6"
                >
                  Kirish
                </Link>
              )}

              {/* MOBILE SIDEBAR BUTTON */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-lg text-cyan-300 transition-all hover:border-cyan-400/40 hover:bg-cyan-400/20 lg:hidden"
              >
                <i className="fas fa-bars-staggered"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileNavbarSidebar
        isOpen={isMobileMenuOpen}
        setIsOpen={setIsMobileMenuOpen}
        navLinks={navLinks}
        isActive={isActive}
        isLoggedIn={isLoggedIn}
        user={user}
        handleLogout={handleLogout}
      />
    </>
  );
};

export default Navbar;