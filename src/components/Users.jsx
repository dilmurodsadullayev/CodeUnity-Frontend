import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    FaChevronLeft,
    FaChevronRight,
    FaGhost,
    FaSearch,
    FaUsers,
} from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";

import UserCard from "./UserCard";
import UserService from "../services/user";

import {
    getUserFailure,
    getUserStart,
    getUserSuccess,
} from "../features/users";

const FILTERS = ["Reyting", "Yangi", "Faol"];
const USERS_PER_PAGE = 10;

const Users = () => {
    const dispatch = useDispatch();

    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("Reyting");
    const [currentPage, setCurrentPage] = useState(1);

    const {
        users,
        count,
        next,
        previous,
        isLoading,
        error,
    } = useSelector((state) => state.user);

    const usersList = Array.isArray(users) ? users : [];
    const totalUsersCount = Number(count || 0);
    const totalPages = Math.max(
        1,
        Math.ceil(totalUsersCount / USERS_PER_PAGE)
    );

    const fetchUsers = useCallback(
        async (page, search, ordering) => {
            dispatch(getUserStart());

            try {
                const response = await UserService.getUsers(
                    page,
                    USERS_PER_PAGE,
                    search,
                    ordering
                );

                dispatch(getUserSuccess(response));

                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });
            } catch (err) {
                dispatch(
                    getUserFailure(
                        err?.message ||
                            "Foydalanuvchilarni olishda xato yuz berdi."
                    )
                );
            }
        },
        [dispatch]
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers(currentPage, searchTerm, filter);
        }, 450);

        return () => clearTimeout(timer);
    }, [searchTerm, filter, currentPage, fetchUsers]);

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handlePreviousPage = () => {
        if (!previous || currentPage <= 1) return;

        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleNextPage = () => {
        if (!next || currentPage >= totalPages) return;

        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const pageNumbers = useMemo(() => {
        const pages = [];

        if (totalPages <= 1) return pages;

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i += 1) {
                pages.push(i);
            }

            return pages;
        }

        if (currentPage <= 4) {
            pages.push(1, 2, 3, 4, 5, "...", totalPages);
            return pages;
        }

        if (currentPage >= totalPages - 3) {
            pages.push(
                1,
                "...",
                totalPages - 4,
                totalPages - 3,
                totalPages - 2,
                totalPages - 1,
                totalPages
            );

            return pages;
        }

        pages.push(
            1,
            "...",
            currentPage - 1,
            currentPage,
            currentPage + 1,
            "...",
            totalPages
        );

        return pages;
    }, [currentPage, totalPages]);

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#05070a] px-3 py-10 text-white sm:px-4 sm:py-12">
            {/* BACKGROUND EFFECTS */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.06)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_76%)]" />
            <div className="pointer-events-none absolute left-1/2 top-24 h-[380px] w-[380px] -translate-x-1/2 rounded-full bg-indigo-600/15 blur-[120px]" />
            <div className="pointer-events-none absolute -right-40 top-[34%] h-[360px] w-[360px] rounded-full bg-pink-500/10 blur-[120px]" />
            <div className="pointer-events-none absolute -left-40 bottom-24 h-[360px] w-[360px] rounded-full bg-emerald-500/10 blur-[120px]" />

            <div className="relative z-10 mx-auto w-full max-w-[1500px]">
                {/* HERO */}
                <header className="mb-10 text-center sm:mb-12">
                    <div className="mb-5 inline-flex items-center rounded-full border border-indigo-500/25 bg-indigo-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-indigo-300 shadow-lg shadow-indigo-500/10 sm:text-sm">
                        <FaUsers className="mr-2" />
                        {totalUsersCount} ta hamjamiyat a’zosi
                    </div>

                    <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl md:text-7xl">
                        Bizning{" "}
                        <span className="bg-gradient-to-r from-indigo-300 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(129,140,248,0.25)]">
                            Hamjamiyat
                        </span>
                    </h1>

                    <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-7 text-gray-400 sm:text-base">
                        Bilim ulashuvchi va bir-birini qo‘llab-quvvatlovchi eng
                        faol dasturchilar bilan tanishing.
                    </p>
                </header>

                {/* SEARCH + FILTER */}
                <section className="mx-auto mb-12 max-w-4xl sm:mb-16">
                    <div className="relative overflow-hidden rounded-3xl border border-gray-700/70 bg-gray-900/70 p-3 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-4">
                        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />

                        <div className="relative z-10 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
                            <div className="relative">
                                <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500" />

                                <input
                                    type="text"
                                    placeholder="Ism, ko‘nikma yoki foydalanuvchi nomi..."
                                    className="w-full rounded-2xl border border-gray-700 bg-gray-950/60 py-3.5 pl-11 pr-4 text-sm font-semibold text-white outline-none transition placeholder:text-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-2 rounded-2xl border border-gray-700/50 bg-gray-950/50 p-1.5">
                                {FILTERS.map((item) => (
                                    <button
                                        key={item}
                                        type="button"
                                        onClick={() => handleFilterChange(item)}
                                        className={`rounded-xl px-4 py-2.5 text-xs font-black transition-all duration-300 sm:text-sm ${
                                            filter === item
                                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                                                : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                        }`}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="relative z-10 mt-3 flex flex-col gap-2 text-center text-xs font-semibold text-gray-500 sm:flex-row sm:items-center sm:justify-center">
                            <span>
                                Sahifa:{" "}
                                <b className="text-indigo-300">
                                    {currentPage}
                                </b>{" "}
                                / {totalPages}
                            </span>

                            <span className="hidden text-gray-700 sm:inline">
                                •
                            </span>

                            <span>
                                Bu sahifada:{" "}
                                <b className="text-indigo-300">
                                    {usersList.length}
                                </b>{" "}
                                / {USERS_PER_PAGE} ta user
                            </span>

                            {searchTerm && (
                                <>
                                    <span className="hidden text-gray-700 sm:inline">
                                        •
                                    </span>

                                    <span>
                                        Qidiruv natijasi:{" "}
                                        <b className="text-indigo-300">
                                            {totalUsersCount}
                                        </b>{" "}
                                        ta
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </section>

                {/* USERS GRID */}
                <section
                    className="grid w-full justify-center gap-x-6 gap-y-16 px-1 pt-10 sm:px-0"
                    style={{
                        gridTemplateColumns:
                            "repeat(auto-fill, minmax(270px, 270px))",
                    }}
                >
                    {isLoading ? (
                        Array.from({ length: USERS_PER_PAGE }).map((_, index) => (
                            <div key={`loading-${index}`} className="w-[270px]">
                                <UserCard isLoading={true} />
                            </div>
                        ))
                    ) : error ? (
                        <ErrorState
                            error={error}
                            onRetry={() =>
                                fetchUsers(currentPage, searchTerm, filter)
                            }
                        />
                    ) : usersList.length === 0 ? (
                        <EmptyState />
                    ) : (
                        usersList.map((profileUser, index) => (
                            <div
                                key={profileUser.id || index}
                                className="w-[270px]"
                            >
                                <UserCard
                                    user={profileUser}
                                    isLoading={false}
                                    index={index}
                                />
                            </div>
                        ))
                    )}
                </section>

                {/* PAGINATION */}
                {!isLoading && !error && totalUsersCount > USERS_PER_PAGE && (
                    <nav className="mt-16 flex flex-wrap items-center justify-center gap-2">
                        <button
                            type="button"
                            onClick={handlePreviousPage}
                            disabled={!previous || currentPage === 1}
                            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-700 bg-gray-900 text-indigo-300 transition-all hover:border-indigo-500 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-25"
                            title="Oldingi sahifa"
                        >
                            <FaChevronLeft />
                        </button>

                        <div className="flex flex-wrap items-center justify-center gap-1.5">
                            {pageNumbers.map((num, index) => (
                                <button
                                    key={`${num}-${index}`}
                                    type="button"
                                    onClick={() => {
                                        if (typeof num === "number") {
                                            setCurrentPage(num);
                                        }
                                    }}
                                    className={`flex h-11 w-11 items-center justify-center rounded-2xl border text-sm font-black transition-all ${
                                        currentPage === num
                                            ? "scale-105 border-transparent bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                                            : "border-gray-700 bg-gray-900 text-gray-500 hover:border-gray-600 hover:text-white"
                                    } ${
                                        num === "..."
                                            ? "pointer-events-none border-transparent bg-transparent"
                                            : ""
                                    }`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={handleNextPage}
                            disabled={!next || currentPage === totalPages}
                            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-700 bg-gray-900 text-indigo-300 transition-all hover:border-indigo-500 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-25"
                            title="Keyingi sahifa"
                        >
                            <FaChevronRight />
                        </button>
                    </nav>
                )}
            </div>
        </main>
    );
};

const ErrorState = ({ error, onRetry }) => {
    return (
        <div className="col-span-full w-full py-16 text-center">
            <div className="mx-auto max-w-xl rounded-3xl border border-red-500/30 bg-red-500/10 p-8 shadow-2xl shadow-black/30">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-red-400/25 bg-red-500/10 text-red-300">
                    <i className="fa-solid fa-triangle-exclamation text-4xl"></i>
                </div>

                <h3 className="text-2xl font-black text-white">
                    Xatolik yuz berdi
                </h3>

                <p className="mx-auto mt-3 max-w-md text-sm font-semibold leading-7 text-red-200/80">
                    {error}
                </p>

                <button
                    type="button"
                    onClick={onRetry}
                    className="mt-6 rounded-2xl border border-red-400/40 bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-500"
                >
                    Qayta urinish
                </button>
            </div>
        </div>
    );
};

const EmptyState = () => {
    return (
        <div className="col-span-full w-full py-20 text-center">
            <div className="mx-auto max-w-xl rounded-3xl border border-dashed border-gray-700/70 bg-gray-900/60 p-8 shadow-2xl shadow-black/30">
                <FaGhost className="mx-auto mb-6 text-6xl text-gray-700" />

                <h3 className="text-2xl font-black text-white">
                    Foydalanuvchi topilmadi
                </h3>

                <p className="mx-auto mt-3 max-w-md text-sm font-semibold leading-7 text-gray-500">
                    Qidiruv so‘zini o‘zgartirib ko‘ring yoki filterlarni yangilang.
                </p>
            </div>
        </div>
    );
};

export default Users;