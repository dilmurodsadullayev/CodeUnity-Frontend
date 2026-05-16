import React, { useCallback, useEffect, useMemo, useState } from "react";
import FeedbackCard from "./FeedbackCard";
import FeedbackModal from "./FeedbackModal";

import {
    getFeedbackStart,
    getFeedbackSuccess,
    getFeedbackFailure,
    postFeedbackStart,
    postFeedbackSuccess,
    postFeedbackFailure,
    updateFeedbackStart,
    updateFeedbackSuccess,
    updateFeedbackFailure,
    deleteFeedbackStart,
    deleteFeedbackSuccess,
    deleteFeedbackFailure,
} from "../features/feedback";

import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import FeedbackService from "../services/feedback";

import {
    AlertTriangle,
    Bug,
    CheckCircle2,
    ChevronDown,
    CircleDashed,
    Filter,
    Lightbulb,
    Loader2,
    MessageSquarePlus,
    MessageSquareText,
    RefreshCcw,
    Search,
    ShieldCheck,
    Sparkles,
    Star,
    ThumbsUp,
    WandSparkles,
    X,
} from "lucide-react";

const STATUS_TABS = [
    {
        value: "all",
        label: "Barchasi",
        icon: MessageSquareText,
    },
    {
        value: "pending",
        label: "Kutilmoqda",
        icon: CircleDashed,
    },
    {
        value: "reviewed",
        label: "Ko‘rib chiqilgan",
        icon: ShieldCheck,
    },
    {
        value: "resolved",
        label: "Hal etilgan",
        icon: CheckCircle2,
    },
];

const getTypeMeta = (type) => {
    const map = {
        bug: {
            label: "Bug",
            icon: Bug,
            className: "border-red-400/30 bg-red-500/10 text-red-300",
        },
        suggestion: {
            label: "Taklif",
            icon: Lightbulb,
            className: "border-yellow-400/30 bg-yellow-500/10 text-yellow-300",
        },
        praise: {
            label: "Maqtov",
            icon: ThumbsUp,
            className: "border-emerald-400/30 bg-emerald-500/10 text-emerald-300",
        },
        other: {
            label: "Boshqa",
            icon: Star,
            className: "border-indigo-400/30 bg-indigo-500/10 text-indigo-300",
        },
    };

    return (
        map[type] || {
            label: "Noma’lum",
            icon: Star,
            className: "border-gray-500/30 bg-gray-500/10 text-gray-300",
        }
    );
};

const getStatusMeta = (status) => {
    const map = {
        pending: {
            label: "Kutilmoqda",
            className: "border-yellow-400/30 bg-yellow-500/10 text-yellow-300",
        },
        reviewed: {
            label: "Ko‘rib chiqilgan",
            className: "border-sky-400/30 bg-sky-500/10 text-sky-300",
        },
        resolved: {
            label: "Hal etilgan",
            className: "border-emerald-400/30 bg-emerald-500/10 text-emerald-300",
        },
    };

    return (
        map[status] || {
            label: "Noma’lum",
            className: "border-gray-500/30 bg-gray-500/10 text-gray-300",
        }
    );
};

const Feedback = () => {
    const dispatch = useDispatch();

    const { feedbacks = [], isLoading, error } = useSelector(
        (state) => state.feedback || {}
    );

    const { isLoggedIn } = useSelector((state) => state.auth || {});

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [feedbackToEdit, setFeedbackToEdit] = useState(null);
    const [visibleItems, setVisibleItems] = useState(6);
    const [activeStatus, setActiveStatus] = useState("all");
    const [search, setSearch] = useState("");
    const [toast, setToast] = useState(null);

    const safeFeedbacks = Array.isArray(feedbacks) ? feedbacks : [];

    const getFeedbacks = useCallback(async () => {
        dispatch(getFeedbackStart());

        try {
            const response = await FeedbackService.getFeedbacks();
            dispatch(getFeedbackSuccess(response));
        } catch (err) {
            console.error("Fikrlarni olishda xatolik yuz berdi:", err);

            dispatch(
                getFeedbackFailure(
                    err?.message ||
                        "Fikr-mulohazalarni yuklashda xatolik yuz berdi."
                )
            );
        }
    }, [dispatch]);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setFeedbackToEdit(null);
    }, []);

    useEffect(() => {
        getFeedbacks();
    }, [getFeedbacks]);

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === "Escape") {
                closeModal();
            }
        };

        window.addEventListener("keydown", handleEsc);

        return () => {
            window.removeEventListener("keydown", handleEsc);
        };
    }, [closeModal]);

    useEffect(() => {
        setVisibleItems(6);
    }, [activeStatus, search]);

    const showToast = (type, message) => {
        setToast({ type, message });

        setTimeout(() => {
            setToast(null);
        }, 2600);
    };

    const stats = useMemo(() => {
        return {
            all: safeFeedbacks.length,
            pending: safeFeedbacks.filter((item) => item?.status === "pending")
                .length,
            reviewed: safeFeedbacks.filter((item) => item?.status === "reviewed")
                .length,
            resolved: safeFeedbacks.filter((item) => item?.status === "resolved")
                .length,
        };
    }, [safeFeedbacks]);

    const filteredFeedbacks = useMemo(() => {
        const query = search.trim().toLowerCase();

        return safeFeedbacks.filter((feedback) => {
            const matchesStatus =
                activeStatus === "all" || feedback?.status === activeStatus;

            const title = String(feedback?.title || "").toLowerCase();
            const message = String(feedback?.message || "").toLowerCase();
            const username = String(feedback?.user?.username || "").toLowerCase();
            const feedbackType = String(feedback?.feedback_type || "").toLowerCase();

            const matchesSearch =
                !query ||
                title.includes(query) ||
                message.includes(query) ||
                username.includes(query) ||
                feedbackType.includes(query);

            return matchesStatus && matchesSearch;
        });
    }, [safeFeedbacks, activeStatus, search]);

    const visibleFeedbacks = filteredFeedbacks.slice(0, visibleItems);
    const hasMore = filteredFeedbacks.length > visibleItems;

    const openCreateModal = () => {
        setFeedbackToEdit(null);
        setIsModalOpen(true);
    };

    const handleEditFeedback = (feedback) => {
        setFeedbackToEdit(feedback);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (feedbackData) => {
        if (feedbackToEdit) {
            dispatch(updateFeedbackStart());

            try {
                const response = await FeedbackService.updateFeedback(
                    feedbackToEdit.id,
                    feedbackData
                );

                dispatch(updateFeedbackSuccess(response));
                closeModal();
                showToast("success", "Fikr-mulohaza muvaffaqiyatli tahrirlandi.");
            } catch (err) {
                console.error("Fikr-mulohazani tahrirlashda xatolik:", err);

                const message =
                    err?.message ||
                    "Fikr-mulohazani tahrirlashda xatolik yuz berdi.";

                dispatch(updateFeedbackFailure(message));
                showToast("error", message);
            }

            return;
        }

        dispatch(postFeedbackStart());

        try {
            const response = await FeedbackService.postFeedback(feedbackData);

            dispatch(postFeedbackSuccess(response));
            closeModal();
            showToast("success", "Fikr-mulohazangiz muvaffaqiyatli yuborildi.");
        } catch (err) {
            console.error("Fikr-mulohazani yuborishda xatolik:", err);

            const message =
                err?.message || "Fikr-mulohazani yuborishda xatolik yuz berdi.";

            dispatch(postFeedbackFailure(message));
            showToast("error", message);
        }
    };

    const handleDeleteFeedbackSuccess = (deletedFeedbackId) => {
        dispatch(deleteFeedbackStart());

        try {
            dispatch(deleteFeedbackSuccess(deletedFeedbackId));
            showToast("success", "Fikr-mulohaza muvaffaqiyatli o‘chirildi.");
        } catch (err) {
            console.error("Redux state yangilashda xatolik:", err);

            const message =
                err?.message ||
                "O‘chirishdan keyin state yangilashda xatolik yuz berdi.";

            dispatch(deleteFeedbackFailure(message));
            showToast("error", message);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#05070a] text-white">
            {/* BACKGROUND EFFECTS */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.06)_1px,transparent_1px)] bg-[size:58px_58px] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_74%)]" />

            <div className="pointer-events-none absolute left-1/2 top-24 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-indigo-600/15 blur-[115px]" />
            <div className="pointer-events-none absolute -right-36 top-[38%] h-[360px] w-[360px] rounded-full bg-pink-500/10 blur-[110px]" />
            <div className="pointer-events-none absolute -left-36 bottom-24 h-[360px] w-[360px] rounded-full bg-emerald-500/10 blur-[110px]" />

            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}

            <main className="relative z-10">
                {/* HERO */}
                <section className="container mx-auto px-4 pb-10 pt-24 sm:pt-28 lg:pt-32">
                    <div className="mx-auto max-w-5xl text-center">
                        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/25 bg-indigo-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-indigo-300 shadow-lg shadow-indigo-500/10">
                            <WandSparkles size={16} />
                            FSociety Feedback Hub
                        </div>

                        <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-8xl">
                            Fikrlar{" "}
                            <span className="bg-gradient-to-br from-indigo-300 via-pink-500 to-yellow-300 bg-clip-text italic text-transparent drop-shadow-[0_0_24px_rgba(129,140,248,0.22)]">
                                markazi
                            </span>
                        </h1>

                        <p className="mx-auto mt-6 max-w-3xl text-sm font-medium leading-7 text-gray-400 sm:text-lg sm:leading-8">
                            Hamjamiyatimizning yuragi shu yerda uradi. Xatolik,
                            taklif, maqtov yoki yangi g‘oyangizni yuboring —
                            FSociety’ni birga kuchaytiramiz.
                        </p>

                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            {isLoggedIn ? (
                                <button
                                    type="button"
                                    onClick={openCreateModal}
                                    className="group inline-flex items-center justify-center gap-3 rounded-2xl border border-indigo-400/40 bg-indigo-600 px-6 py-3 text-sm font-black text-white shadow-2xl shadow-indigo-600/25 transition-all hover:-translate-y-0.5 hover:bg-indigo-500 active:scale-95"
                                >
                                    <MessageSquarePlus size={19} />
                                    Fikr qo‘shish
                                    <Sparkles
                                        size={16}
                                        className="transition-transform group-hover:rotate-12"
                                    />
                                </button>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="inline-flex items-center justify-center rounded-2xl border border-indigo-400/40 bg-indigo-600 px-6 py-3 text-sm font-black text-white shadow-2xl shadow-indigo-600/25 transition hover:bg-indigo-500"
                                    >
                                        Kirish
                                    </Link>

                                    <Link
                                        to="/register"
                                        className="inline-flex items-center justify-center rounded-2xl border border-gray-600/70 bg-gray-900/80 px-6 py-3 text-sm font-black text-white transition hover:bg-gray-800"
                                    >
                                        Ro‘yxatdan o‘tish
                                    </Link>
                                </>
                            )}

                            <button
                                type="button"
                                onClick={getFeedbacks}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-600/70 bg-gray-900/70 px-5 py-3 text-sm font-black text-gray-200 transition hover:bg-gray-800"
                            >
                                <RefreshCcw size={17} />
                                Yangilash
                            </button>
                        </div>
                    </div>

                    {/* STATS */}
                    <div className="mx-auto mt-12 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            title="Jami fikrlar"
                            value={stats.all}
                            icon={MessageSquareText}
                            gradient="from-indigo-500/15"
                        />

                        <StatCard
                            title="Kutilmoqda"
                            value={stats.pending}
                            icon={CircleDashed}
                            gradient="from-yellow-500/15"
                        />

                        <StatCard
                            title="Ko‘rib chiqilgan"
                            value={stats.reviewed}
                            icon={ShieldCheck}
                            gradient="from-sky-500/15"
                        />

                        <StatCard
                            title="Hal etilgan"
                            value={stats.resolved}
                            icon={CheckCircle2}
                            gradient="from-emerald-500/15"
                        />
                    </div>
                </section>

                {/* CONTROL PANEL */}
                <section className="container mx-auto px-4 pb-8">
                    <div className="mx-auto max-w-6xl overflow-hidden rounded-[28px] border border-gray-700/70 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.09),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.06),transparent_38%),rgba(17,24,39,0.64)] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.045)] backdrop-blur-xl sm:p-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="relative flex-1">
                                <Search
                                    size={18}
                                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                                />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Fikr, title, username yoki turi bo‘yicha qidirish..."
                                    className="w-full rounded-2xl border border-gray-700 bg-gray-950/60 py-3 pl-11 pr-4 text-sm font-semibold text-white outline-none transition placeholder:text-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                />
                            </div>

                            <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin] [scrollbar-color:rgba(99,102,241,0.45)_transparent] lg:pb-0">
                                {STATUS_TABS.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeStatus === tab.value;

                                    return (
                                        <button
                                            key={tab.value}
                                            type="button"
                                            onClick={() => setActiveStatus(tab.value)}
                                            className={`inline-flex shrink-0 items-center gap-2 rounded-2xl border px-4 py-3 text-xs font-black transition-all ${
                                                isActive
                                                    ? "border-indigo-400/50 bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                                                    : "border-gray-700 bg-gray-950/40 text-gray-400 hover:border-gray-600 hover:bg-gray-900 hover:text-white"
                                            }`}
                                        >
                                            <Icon size={16} />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mt-4 flex flex-col gap-3 border-t border-gray-800 pt-4 text-xs font-semibold text-gray-500 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-2">
                                <Filter size={15} className="text-indigo-300" />
                                <span>{filteredFeedbacks.length} ta natija topildi</span>
                            </div>

                            <span>
                                Ko‘rsatilmoqda: {visibleFeedbacks.length} /{" "}
                                {filteredFeedbacks.length}
                            </span>
                        </div>
                    </div>
                </section>

                {/* FEEDBACK LIST */}
                <section className="container mx-auto px-4 pb-20">
                    <div className="mx-auto max-w-6xl">
                        {isLoading && <FeedbackSkeleton />}

                        {!isLoading && error && (
                            <ErrorState message={error} onRetry={getFeedbacks} />
                        )}

                        {!isLoading && !error && filteredFeedbacks.length === 0 && (
                            <EmptyState
                                search={search}
                                activeStatus={activeStatus}
                                onCreate={openCreateModal}
                                isLoggedIn={isLoggedIn}
                            />
                        )}

                        {!isLoading && !error && filteredFeedbacks.length > 0 && (
                            <>
                                <div className="grid gap-6 lg:grid-cols-2">
                                    {visibleFeedbacks.map((feedback, index) => {
                                        const typeMeta = getTypeMeta(
                                            feedback?.feedback_type
                                        );
                                        const statusMeta = getStatusMeta(
                                            feedback?.status
                                        );
                                        const TypeIcon = typeMeta.icon;

                                        return (
                                            <div
                                                key={feedback?.id || index}
                                                className="rounded-[28px] border border-gray-700/70 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.09),transparent_38%),rgba(17,24,39,0.52)] p-3.5 shadow-[0_24px_70px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/40 hover:bg-gray-900/75"
                                            >
                                                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                                                    <div
                                                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-wider ${typeMeta.className}`}
                                                    >
                                                        <TypeIcon size={14} />
                                                        {typeMeta.label}
                                                    </div>

                                                    <div
                                                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-wider ${statusMeta.className}`}
                                                    >
                                                        {statusMeta.label}
                                                    </div>
                                                </div>

                                                <FeedbackCard
                                                    feedback={feedback}
                                                    onEdit={handleEditFeedback}
                                                    onDeleteSuccess={
                                                        handleDeleteFeedbackSuccess
                                                    }
                                                />
                                            </div>
                                        );
                                    })}
                                </div>

                                {hasMore && (
                                    <div className="mt-12 text-center">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setVisibleItems((prev) => prev + 6)
                                            }
                                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-600/70 bg-gray-900/80 px-6 py-3 text-sm font-black text-white shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-gray-800 active:scale-95"
                                        >
                                            Ko‘proq yuklash
                                            <ChevronDown size={18} />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </main>

            <FeedbackModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={handleModalSubmit}
                feedbackToEdit={feedbackToEdit}
            />
        </div>
    );
};

const StatCard = ({ title, value, icon: Icon, gradient = "from-indigo-500/15" }) => {
    return (
        <div
            className={`group relative overflow-hidden rounded-3xl border border-gray-700/70 bg-gradient-to-br ${gradient} to-transparent p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.045)] backdrop-blur-xl transition-all hover:-translate-y-1`}
        >
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/5 blur-2xl transition group-hover:bg-indigo-500/10" />

            <div className="relative z-10 flex items-center justify-between gap-4">
                <div>
                    <p className="text-xs font-black uppercase tracking-wider text-gray-500">
                        {title}
                    </p>

                    <p className="mt-2 text-4xl font-black text-white">{value}</p>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-3xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-300">
                    <Icon size={27} />
                </div>
            </div>
        </div>
    );
};

const FeedbackSkeleton = () => {
    return (
        <div className="grid gap-6 lg:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
                <div
                    key={item}
                    className="rounded-3xl border border-gray-700/70 bg-gray-900/60 p-5 shadow-2xl shadow-black/20"
                >
                    <div className="mb-4 flex items-center justify-between">
                        <div className="h-7 w-28 animate-pulse rounded-full bg-gray-800" />
                        <div className="h-7 w-32 animate-pulse rounded-full bg-gray-800" />
                    </div>

                    <div className="space-y-4">
                        <div className="h-6 w-3/4 animate-pulse rounded-xl bg-gray-800" />
                        <div className="h-4 w-full animate-pulse rounded-xl bg-gray-800" />
                        <div className="h-4 w-5/6 animate-pulse rounded-xl bg-gray-800" />
                        <div className="h-12 w-full animate-pulse rounded-2xl bg-gray-800" />
                    </div>
                </div>
            ))}
        </div>
    );
};

const ErrorState = ({ message, onRetry }) => {
    return (
        <div className="mx-auto max-w-2xl rounded-[32px] border border-red-500/30 bg-red-500/10 p-8 text-center shadow-2xl shadow-black/30">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-red-400/25 bg-red-500/10 text-red-300">
                <AlertTriangle size={42} />
            </div>

            <h3 className="text-2xl font-black text-white">Fikrlar yuklanmadi</h3>

            <p className="mx-auto mt-3 max-w-xl text-sm font-semibold leading-7 text-red-200/80">
                {message}
            </p>

            <button
                type="button"
                onClick={onRetry}
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-500"
            >
                <RefreshCcw size={17} />
                Qayta urinish
            </button>
        </div>
    );
};

const EmptyState = ({ search, activeStatus, onCreate, isLoggedIn }) => {
    const hasFilter = search.trim() || activeStatus !== "all";

    return (
        <div className="mx-auto max-w-2xl rounded-[32px] border border-gray-700/70 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.09),transparent_35%),rgba(17,24,39,0.64)] p-8 text-center shadow-2xl shadow-black/30 backdrop-blur-xl">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-gray-700 bg-gray-950/60 text-gray-500">
                <MessageSquareText size={42} />
            </div>

            <h3 className="text-2xl font-black text-white">
                {hasFilter
                    ? "Bu filter bo‘yicha fikr topilmadi"
                    : "Hozircha fikr-mulohaza mavjud emas"}
            </h3>

            <p className="mx-auto mt-3 max-w-xl text-sm font-semibold leading-7 text-gray-500">
                {hasFilter
                    ? "Qidiruv matnini yoki status filterini o‘zgartirib ko‘ring."
                    : "Birinchi bo‘lib taklif, xato yoki maqtovingizni yuboring."}
            </p>

            {isLoggedIn && (
                <button
                    type="button"
                    onClick={onCreate}
                    className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white transition hover:bg-indigo-500"
                >
                    <MessageSquarePlus size={17} />
                    Fikr qo‘shish
                </button>
            )}
        </div>
    );
};

const Toast = ({ type, message, onClose }) => {
    const isSuccess = type === "success";

    return (
        <div
            className={`fixed right-4 top-24 z-[70] flex w-[calc(100%-2rem)] max-w-md items-start gap-3 rounded-2xl border p-4 shadow-2xl backdrop-blur-xl sm:right-6 ${
                isSuccess
                    ? "border-emerald-400/30 bg-emerald-950/80 text-emerald-200"
                    : "border-red-400/30 bg-red-950/80 text-red-200"
            }`}
        >
            <div
                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    isSuccess
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "bg-red-500/15 text-red-300"
                }`}
            >
                {isSuccess ? <CheckCircle2 size={19} /> : <AlertTriangle size={19} />}
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-sm font-black">
                    {isSuccess ? "Muvaffaqiyatli" : "Xatolik"}
                </p>
                <p className="mt-1 text-sm font-semibold opacity-90">{message}</p>
            </div>

            <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1 opacity-70 transition hover:bg-white/10 hover:opacity-100"
            >
                <X size={18} />
            </button>
        </div>
    );
};

export default Feedback;