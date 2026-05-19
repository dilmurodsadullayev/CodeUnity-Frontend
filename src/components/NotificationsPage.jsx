// src/components/NotificationsPage.jsx

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";

import {
    markNotificationAsRead,
    markAllNotificationsAsRead,
} from "../middleware/notificationMiddleware";

import NotificationCard from "./notifications/NotificationCard";

import NotificationPagination, {
    NotificationEmptyState,
    NotificationLoadingState,
} from "./notifications/NotificationPagination";

const FILTERS = [
    { key: "all", label: "Hammasi", icon: "fa-layer-group" },
    { key: "unread", label: "O‘qilmagan", icon: "fa-bell" },
    { key: "read", label: "O‘qilgan", icon: "fa-check-double" },
];

const NotificationsPage = () => {
    const dispatch = useDispatch();

    const {
        notifications = [],
        totalUnreadCount = 0,
        wsConnected,
        wsError,
        loading,
    } = useSelector((state) => state.notifications || {});

    const { user: currentUser } = useSelector((state) => state.auth || {});

    const [filter, setFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const safeNotifications = Array.isArray(notifications) ? notifications : [];

    const unreadCount = useMemo(() => {
        if (typeof totalUnreadCount === "number") {
            return totalUnreadCount;
        }

        return safeNotifications.filter((item) => !item.is_read).length;
    }, [safeNotifications, totalUnreadCount]);

    const readCount = Math.max(safeNotifications.length - unreadCount, 0);

    const filteredNotifications = useMemo(() => {
        return [...safeNotifications]
            .sort((a, b) => {
                return new Date(b.created_at || 0) - new Date(a.created_at || 0);
            })
            .filter((notification) => {
                if (filter === "unread") return !notification.is_read;
                if (filter === "read") return notification.is_read;
                return true;
            });
    }, [safeNotifications, filter]);

    const totalFiltered = filteredNotifications.length;
    const totalPages = Math.max(1, Math.ceil(totalFiltered / perPage));

    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;

    const paginatedNotifications = useMemo(() => {
        return filteredNotifications.slice(startIndex, endIndex);
    }, [filteredNotifications, startIndex, endIndex]);

    const startItem = totalFiltered === 0 ? 0 : startIndex + 1;
    const endItem = Math.min(endIndex, totalFiltered);

    const isInitialLoading = loading && safeNotifications.length === 0;
    const isSoftLoading = loading && safeNotifications.length > 0;

    useEffect(() => {
        setCurrentPage(1);
    }, [filter, perPage]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const markNotificationAsReadAction = (id) => {
        dispatch(markNotificationAsRead(id));
    };

    const markAllAsReadAction = () => {
        dispatch(markAllNotificationsAsRead());
    };

    const handlePageChange = (page) => {
        const nextPage = Math.min(Math.max(page, 1), totalPages);

        setCurrentPage(nextPage);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handlePerPageChange = (value) => {
        setPerPage(value);
        setCurrentPage(1);
    };

    const handleFilterChange = (value) => {
        setFilter(value);
        setCurrentPage(1);
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#05070a] px-4 py-10 text-white sm:px-6 lg:px-8">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.06)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(circle_at_top,black_0%,transparent_75%)]" />
            <div className="pointer-events-none absolute left-1/2 top-24 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-indigo-600/15 blur-[130px]" />
            <div className="pointer-events-none absolute -right-40 top-1/3 h-[360px] w-[360px] rounded-full bg-yellow-500/10 blur-[120px]" />
            <div className="pointer-events-none absolute -left-40 bottom-20 h-[360px] w-[360px] rounded-full bg-purple-500/10 blur-[120px]" />

            <div className="relative z-10 mx-auto max-w-5xl">
                <motion.header
                    initial={{ opacity: 0, y: -18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                    className="mb-8 text-center"
                >
                    <div className="mb-5 inline-flex items-center rounded-full border border-indigo-400/25 bg-indigo-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-indigo-300 shadow-lg shadow-indigo-500/10">
                        <span className="mr-2 h-2 w-2 rounded-full bg-indigo-400 shadow-[0_0_12px_rgba(129,140,248,0.9)]"></span>
                        Notification Center
                    </div>

                    <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                        Bildirishnomalar{" "}
                        <span className="bg-gradient-to-r from-indigo-300 via-purple-400 to-yellow-300 bg-clip-text text-transparent">
                            Markazi
                        </span>
                    </h1>

                    <p className="mx-auto mt-4 max-w-2xl text-sm font-semibold leading-7 text-gray-400 sm:text-base">
                        FCoin mukofotlari, problem, post, badge va boshqa muhim xabarlar shu yerda jamlanadi.
                    </p>
                </motion.header>

                <motion.section
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12, duration: 0.42 }}
                    className="mb-8 grid gap-4 md:grid-cols-3"
                >
                    <div className="rounded-3xl border border-gray-800 bg-gray-900/70 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
                        <p className="text-xs font-black uppercase tracking-widest text-gray-500">
                            Jami
                        </p>
                        <h3 className="mt-2 text-4xl font-black text-white">
                            {safeNotifications.length}
                        </h3>
                        <p className="mt-1 text-sm font-semibold text-gray-500">
                            barcha xabarlar
                        </p>
                    </div>

                    <div className="rounded-3xl border border-indigo-400/25 bg-indigo-500/10 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
                        <p className="text-xs font-black uppercase tracking-widest text-indigo-300">
                            Yangi
                        </p>
                        <h3 className="mt-2 text-4xl font-black text-indigo-200">
                            {unreadCount}
                        </h3>
                        <p className="mt-1 text-sm font-semibold text-indigo-300/70">
                            o‘qilmagan xabarlar
                        </p>
                    </div>

                    <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
                        <p className="text-xs font-black uppercase tracking-widest text-emerald-300">
                            O‘qilgan
                        </p>
                        <h3 className="mt-2 text-4xl font-black text-emerald-200">
                            {readCount}
                        </h3>
                        <p className="mt-1 text-sm font-semibold text-emerald-300/70">
                            ko‘rib chiqilgan
                        </p>
                    </div>
                </motion.section>

                <motion.section
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18, duration: 0.42 }}
                    className="mb-8 rounded-3xl border border-gray-800 bg-gray-900/70 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl"
                >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="grid grid-cols-3 gap-2 rounded-2xl border border-gray-800 bg-gray-950/60 p-1.5">
                            {FILTERS.map((item) => {
                                const isActive = filter === item.key;

                                const count =
                                    item.key === "all"
                                        ? safeNotifications.length
                                        : item.key === "unread"
                                          ? unreadCount
                                          : readCount;

                                return (
                                    <button
                                        key={item.key}
                                        type="button"
                                        onClick={() => handleFilterChange(item.key)}
                                        className={`rounded-xl px-3 py-2.5 text-xs font-black transition-all sm:text-sm ${
                                            isActive
                                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                                                : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                        }`}
                                    >
                                        <i className={`fa-solid ${item.icon} mr-1.5`}></i>
                                        {item.label}
                                        <span className="ml-1 opacity-70">
                                            ({count})
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <div
                                className={`rounded-2xl border px-4 py-2 text-xs font-black ${
                                    wsConnected
                                        ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-300"
                                        : "border-red-400/25 bg-red-500/10 text-red-300"
                                }`}
                            >
                                <i
                                    className={`fa-solid ${
                                        wsConnected ? "fa-wifi" : "fa-plug-circle-xmark"
                                    } mr-1.5`}
                                ></i>
                                {wsConnected ? "Real-time faol" : "Ulanish kutilmoqda"}
                            </div>

                            {unreadCount > 0 && (
                                <button
                                    type="button"
                                    onClick={markAllAsReadAction}
                                    className="rounded-2xl border border-purple-400/25 bg-purple-500/10 px-4 py-2 text-xs font-black text-purple-300 transition hover:bg-purple-500/20 hover:text-purple-200"
                                >
                                    <i className="fa-solid fa-check-double mr-1.5"></i>
                                    Hammasi o‘qildi
                                </button>
                            )}
                        </div>
                    </div>

                    {wsError && (
                        <p className="mt-3 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-xs font-bold text-red-300">
                            <i className="fa-solid fa-triangle-exclamation mr-1.5"></i>
                            {wsError}
                        </p>
                    )}
                </motion.section>

                <motion.section layout className="space-y-4">
                    {isInitialLoading ? (
                        <NotificationLoadingState count={perPage} />
                    ) : (
                        <>
                            {isSoftLoading && (
                                <div className="mb-4 rounded-2xl border border-indigo-400/20 bg-indigo-500/10 px-4 py-3 text-xs font-black text-indigo-300">
                                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                                    Bildirishnomalar yangilanmoqda...
                                </div>
                            )}

                            <AnimatePresence mode="popLayout">
                                {paginatedNotifications.length > 0 ? (
                                    paginatedNotifications.map((notification) => (
                                        <NotificationCard
                                            key={notification.id}
                                            notification={notification}
                                            currentUser={currentUser}
                                            onMarkRead={markNotificationAsReadAction}
                                        />
                                    ))
                                ) : (
                                    <NotificationEmptyState
                                        key="empty"
                                        filter={filter}
                                        onShowAll={() => handleFilterChange("all")}
                                    />
                                )}
                            </AnimatePresence>

                            <NotificationPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalItems={totalFiltered}
                                perPage={perPage}
                                startItem={startItem}
                                endItem={endItem}
                                onPageChange={handlePageChange}
                                onPerPageChange={handlePerPageChange}
                            />
                        </>
                    )}
                </motion.section>
            </div>
        </main>
    );
};

export default NotificationsPage;