// src/components/notifications/NotificationPagination.jsx

import React from "react";
import { motion } from "framer-motion";

export const PER_PAGE_OPTIONS = [5, 10, 20];

const getPageNumbers = (currentPage, totalPages) => {
    if (totalPages <= 1) return [];

    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 4) {
        return [1, 2, 3, 4, 5, "...", totalPages];
    }

    if (currentPage >= totalPages - 3) {
        return [
            1,
            "...",
            totalPages - 4,
            totalPages - 3,
            totalPages - 2,
            totalPages - 1,
            totalPages,
        ];
    }

    return [
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages,
    ];
};

export const NotificationEmptyState = ({ filter, onShowAll }) => {
    const title =
        filter === "unread"
            ? "O‘qilmagan bildirishnoma yo‘q"
            : filter === "read"
              ? "O‘qilgan bildirishnoma yo‘q"
              : "Hali bildirishnomalar mavjud emas";

    const description =
        filter === "unread"
            ? "Hamma xabarlar o‘qilgan. Yangi xabar kelganda shu yerda ko‘rinadi."
            : filter === "read"
              ? "Siz hali hech qaysi bildirishnomani o‘qilgan deb belgilamagansiz."
              : "Problem, post, FCoin, badge yoki star bo‘yicha xabarlar shu yerda chiqadi.";

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-dashed border-gray-700 bg-gray-900/60 p-10 text-center shadow-2xl shadow-black/20"
        >
            <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full border border-gray-700 bg-gray-950/80 shadow-xl shadow-black/30">
                <i className="fa-solid fa-bell-slash text-5xl text-gray-700"></i>
            </div>

            <h3 className="text-2xl font-black text-white">{title}</h3>

            <p className="mx-auto mt-3 max-w-md text-sm font-semibold leading-7 text-gray-500">
                {description}
            </p>

            {filter !== "all" && (
                <button
                    type="button"
                    onClick={onShowAll}
                    className="mt-6 rounded-2xl border border-indigo-400/30 bg-indigo-500/10 px-5 py-3 text-sm font-black text-indigo-300 transition hover:bg-indigo-500/20"
                >
                    Barcha bildirishnomalarni ko‘rish
                </button>
            )}
        </motion.div>
    );
};

export const NotificationSkeletonCard = () => {
    return (
        <div className="relative overflow-hidden rounded-3xl border border-gray-800 bg-gray-900/70 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-5">
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />

            <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="relative shrink-0">
                    <div className="h-14 w-14 animate-pulse rounded-2xl bg-gray-800" />
                    <div className="absolute -bottom-2 -right-2 h-8 w-8 animate-pulse rounded-2xl border border-gray-700 bg-gray-800" />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                        <div className="h-6 w-20 animate-pulse rounded-full bg-gray-800" />
                        <div className="h-6 w-28 animate-pulse rounded-full bg-gray-800" />
                    </div>

                    <div className="space-y-2">
                        <div className="h-5 w-full animate-pulse rounded-full bg-gray-800" />
                        <div className="h-5 w-4/5 animate-pulse rounded-full bg-gray-800" />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                        <div className="h-7 w-24 animate-pulse rounded-full bg-gray-800" />
                        <div className="h-7 w-28 animate-pulse rounded-full bg-gray-800" />
                        <div className="h-7 w-20 animate-pulse rounded-full bg-gray-800" />
                    </div>
                </div>

                <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end">
                    <div className="h-8 w-24 animate-pulse rounded-full bg-gray-800" />
                    <div className="h-4 w-16 animate-pulse rounded-full bg-gray-800" />
                </div>
            </div>
        </div>
    );
};

export const NotificationLoadingState = ({ count = 10 }) => {
    const safeCount = Math.max(3, Math.min(Number(count) || 10, 20));

    return (
        <div className="space-y-4">
            <div className="mb-4 rounded-3xl border border-indigo-400/20 bg-indigo-500/10 p-4 text-center shadow-2xl shadow-black/20">
                <div className="inline-flex items-center gap-3 text-sm font-black text-indigo-300">
                    <span className="relative flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-indigo-400"></span>
                    </span>
                    Bildirishnomalar yuklanmoqda...
                </div>
            </div>

            {Array.from({ length: safeCount }).map((_, index) => (
                <NotificationSkeletonCard key={index} />
            ))}
        </div>
    );
};

const NotificationPagination = ({
    currentPage,
    totalPages,
    totalItems,
    perPage,
    startItem,
    endItem,
    onPageChange,
    onPerPageChange,
}) => {
    const pages = getPageNumbers(currentPage, totalPages);

    if (totalItems === 0) return null;

    return (
        <div className="mt-8 rounded-3xl border border-gray-800 bg-gray-900/70 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="text-center text-xs font-bold text-gray-500 lg:text-left">
                    <span className="text-indigo-300">{startItem}</span>
                    {" - "}
                    <span className="text-indigo-300">{endItem}</span>
                    {" / "}
                    <span className="text-white">{totalItems}</span>
                    {" ta notification ko‘rsatilmoqda"}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
                    <div className="flex items-center justify-center gap-2 rounded-2xl border border-gray-800 bg-gray-950/60 px-3 py-2">
                        <span className="text-xs font-black uppercase tracking-wider text-gray-500">
                            Sahifada
                        </span>

                        <select
                            value={perPage}
                            onChange={(event) =>
                                onPerPageChange(Number(event.target.value))
                            }
                            className="rounded-xl border border-gray-700 bg-gray-900 px-3 py-1.5 text-xs font-black text-white outline-none transition focus:border-indigo-500"
                        >
                            {PER_PAGE_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2">
                        <button
                            type="button"
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage <= 1}
                            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-700 bg-gray-950 text-indigo-300 transition hover:border-indigo-400/40 hover:bg-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-30"
                            title="Oldingi sahifa"
                        >
                            <i className="fa-solid fa-chevron-left"></i>
                        </button>

                        {pages.map((page, index) => (
                            <button
                                key={`${page}-${index}`}
                                type="button"
                                onClick={() => {
                                    if (typeof page === "number") {
                                        onPageChange(page);
                                    }
                                }}
                                className={`flex h-10 min-w-10 items-center justify-center rounded-2xl border px-3 text-sm font-black transition ${
                                    currentPage === page
                                        ? "border-transparent bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                                        : page === "..."
                                          ? "pointer-events-none border-transparent bg-transparent text-gray-600"
                                          : "border-gray-700 bg-gray-950 text-gray-500 hover:border-gray-600 hover:text-white"
                                }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            type="button"
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages}
                            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-700 bg-gray-950 text-indigo-300 transition hover:border-indigo-400/40 hover:bg-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-30"
                            title="Keyingi sahifa"
                        >
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationPagination;