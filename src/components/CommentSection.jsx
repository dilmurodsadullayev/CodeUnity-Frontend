import React, { useCallback, useEffect, useState } from "react";
import CommentForm from "./CommentForm";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
    getCommentStart,
    getCommentSuccess,
} from "../features/comments/Comment";

import CommentService from "../services/comments";
import UserImage from "../assests/userImage.jpeg";

import {
    Eye,
    Lock,
    Loader2,
    MessageCircle,
    ShieldAlert,
    Sparkles,
    UserRound,
} from "lucide-react";

const getImageUrl = (image) => {
    if (!image) return UserImage;

    if (typeof image === "string" && image.startsWith("http")) {
        return image;
    }

    return `${window.location.origin}${image}`;
};

const timeAgo = (createdAt) => {
    if (!createdAt) return "hozirgina";

    const now = new Date();
    const created = new Date(createdAt);

    const diffMs = now - created;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffYears > 0) {
        return diffYears === 1 ? "1 yil oldin" : `${diffYears} yil oldin`;
    }

    if (diffMonths > 0) {
        return diffMonths === 1 ? "1 oy oldin" : `${diffMonths} oy oldin`;
    }

    if (diffDays > 0) {
        return diffDays === 1 ? "1 kun oldin" : `${diffDays} kun oldin`;
    }

    if (diffHours > 0) {
        return diffHours === 1 ? "1 soat oldin" : `${diffHours} soat oldin`;
    }

    if (diffMinutes > 0) {
        return diffMinutes === 1
            ? "1 daqiqa oldin"
            : `${diffMinutes} daqiqa oldin`;
    }

    return "hozirgina";
};

const CommentSection = () => {
    const dispatch = useDispatch();

    const { isLoggedIn } = useSelector((state) => state.auth);
    const { comments, isLoading } = useSelector((state) => state.comment);

    const [error, setError] = useState(null);

    const safeComments = Array.isArray(comments) ? comments : [];

    const getComments = useCallback(async () => {
        dispatch(getCommentStart());
        setError(null);

        try {
            const response = await CommentService.getComments();
            dispatch(getCommentSuccess(response));
        } catch (err) {
            console.error("Commentlarni olishda xato:", err);
            setError(
                err?.message ||
                    "Fikrlarni yuklashda xato yuz berdi. Birozdan keyin qayta urinib ko‘ring."
            );
        }
    }, [dispatch]);

    useEffect(() => {
        getComments();
    }, [getComments]);

    return (
        <section id="feedback" className="relative overflow-hidden px-4 py-20">
            {/* Background effects */}
            <div className="pointer-events-none absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-600/10 blur-3xl" />
            <div className="pointer-events-none absolute bottom-10 right-10 h-72 w-72 rounded-full bg-pink-600/10 blur-3xl" />

            <div className="container relative z-10 mx-auto">
                {/* Header */}
                <div className="mx-auto mb-12 max-w-3xl text-center">
                    <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm font-black text-indigo-300 shadow-lg shadow-indigo-500/10">
                        <Sparkles size={17} />
                        FSociety Community
                    </div>

                    <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
                        Hamjamiyatimiz{" "}
                        <span className="hero-gradient-text">biz haqimizda</span>
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-7 text-gray-400 sm:text-base">
                        Platformamiz foydalanuvchilarining fikrlari biz uchun eng
                        muhim rag‘bat. O‘z tajribangiz bilan bo‘lishing va FSociety
                        rivojiga hissa qo‘shing.
                    </p>
                </div>

                {/* Form / Auth notice */}
                <div className="mx-auto mb-10 max-w-3xl">
                    {isLoggedIn ? (
                        <div className="rounded-3xl border border-gray-700/70 bg-gray-900/70 p-4 shadow-2xl shadow-black/30 backdrop-blur-md sm:p-5">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-300">
                                    <MessageCircle size={22} />
                                </div>

                                <div>
                                    <h3 className="text-lg font-black text-white">
                                        Fikr qoldirish
                                    </h3>
                                    <p className="text-xs font-semibold text-gray-500">
                                        Tajribangizni qisqa va aniq yozing
                                    </p>
                                </div>
                            </div>

                            <CommentForm onSuccess={getComments} />
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-gray-700/70 bg-gray-900/70 p-6 text-center shadow-2xl shadow-black/30 backdrop-blur-md">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-indigo-400/20 bg-indigo-500/10 text-indigo-300">
                                <Lock size={28} />
                            </div>

                            <h3 className="text-xl font-black text-white">
                                Fikr qoldirish uchun tizimga kiring
                            </h3>

                            <p className="mx-auto mt-2 max-w-xl text-sm font-medium leading-6 text-gray-400">
                                Izoh yozish, fikr bildirish va hamjamiyat bilan
                                muloqot qilish uchun akkauntingizga kiring yoki
                                ro‘yxatdan o‘ting.
                            </p>

                            <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
                                <Link
                                    to="/login"
                                    className="rounded-xl border border-indigo-500/40 bg-indigo-600 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
                                >
                                    Kirish
                                </Link>

                                <Link
                                    to="/register"
                                    className="rounded-xl border border-emerald-500/40 bg-emerald-600 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500"
                                >
                                    Ro‘yxatdan o‘tish
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Comments */}
                <div className="mx-auto max-w-3xl">
                    <div className="mb-5 flex items-center justify-between gap-3">
                        <div>
                            <h3 className="text-xl font-black text-white">
                                Foydalanuvchilar fikrlari
                            </h3>
                            <p className="text-xs font-semibold text-gray-500">
                                So‘nggi izohlar va taassurotlar
                            </p>
                        </div>

                        <span className="rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-indigo-300">
                            {safeComments.length} ta
                        </span>
                    </div>

                    {isLoading ? (
                        <CommentsSkeleton />
                    ) : error ? (
                        <ErrorState message={error} onRetry={getComments} />
                    ) : safeComments.length === 0 ? (
                        <EmptyComments />
                    ) : (
                        <div className="space-y-5">
                            {safeComments.map((comment, index) => (
                                <CommentItem
                                    key={comment?.id || index}
                                    comment={comment}
                                    index={index}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

const CommentsSkeleton = () => {
    return (
        <div className="space-y-5">
            {[1, 2, 3].map((item) => (
                <div
                    key={item}
                    className="rounded-3xl border border-gray-700/70 bg-gray-900/60 p-5 shadow-xl shadow-black/20"
                >
                    <div className="flex gap-4">
                        <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-gray-800" />

                        <div className="flex-1 space-y-3">
                            <div className="h-4 w-40 animate-pulse rounded-xl bg-gray-800" />
                            <div className="h-3 w-full animate-pulse rounded-xl bg-gray-800" />
                            <div className="h-3 w-3/4 animate-pulse rounded-xl bg-gray-800" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const ErrorState = ({ message, onRetry }) => {
    return (
        <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center shadow-xl shadow-black/20">
            <ShieldAlert className="mx-auto mb-4 text-red-300" size={44} />

            <h4 className="text-xl font-black text-white">
                Fikrlar yuklanmadi
            </h4>

            <p className="mx-auto mt-2 max-w-xl text-sm font-medium leading-6 text-red-200">
                {message}
            </p>

            <button
                type="button"
                onClick={onRetry}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-black text-white transition hover:bg-red-500"
            >
                <Loader2 size={17} />
                Qayta urinish
            </button>
        </div>
    );
};

const EmptyComments = () => {
    return (
        <div className="rounded-3xl border-2 border-dashed border-gray-700/70 bg-gray-900/40 px-6 py-12 text-center shadow-xl shadow-black/20">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-gray-700 bg-gray-950/70 text-gray-500">
                <MessageCircle size={42} />
            </div>

            <h4 className="text-xl font-black text-white">
                Hali fikrlar mavjud emas
            </h4>

            <p className="mx-auto mt-2 max-w-lg text-sm font-medium leading-6 text-gray-500">
                Birinchi bo‘lib fikr qoldiring va FSociety hamjamiyatini
                jonlantiring.
            </p>
        </div>
    );
};

const CommentItem = ({ comment, index }) => {
    const isHidden = comment?.status && comment.status !== "visible";
    const [showSpoiler, setShowSpoiler] = useState(isHidden);

    const username = comment?.user?.username || "anonymous";
    const profileUrl = `/${username}/profile`;
    const userImage = getImageUrl(comment?.user?.image);

    return (
        <article
            className="group relative overflow-hidden rounded-3xl border border-gray-700/70 bg-gray-900/70 p-5 shadow-xl shadow-black/20 transition-all duration-300 hover:border-indigo-500/40 hover:bg-gray-900/90 hover:shadow-indigo-500/10"
            style={{ animationDelay: `${index * 0.06}s` }}
        >
            <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-indigo-500/10 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative z-10 flex gap-4">
                <Link to={profileUrl} className="shrink-0">
                    <img
                        src={userImage}
                        alt={`${username} avatar`}
                        className="h-12 w-12 rounded-full border-2 border-gray-700 object-cover shadow-lg shadow-black/30 transition group-hover:border-indigo-400/60 sm:h-14 sm:w-14"
                        onError={(e) => {
                            e.currentTarget.src = UserImage;
                        }}
                    />
                </Link>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                            <Link
                                to={profileUrl}
                                className="inline-flex max-w-full items-center gap-2 text-base font-black text-white transition hover:text-indigo-300"
                            >
                                <span className="truncate">{username}</span>
                                <UserRound size={15} className="text-gray-500" />
                            </Link>

                            <p className="text-xs font-semibold text-gray-500">
                                {timeAgo(comment?.created_at)}
                            </p>
                        </div>

                        {comment?.status && (
                            <StatusBadge status={comment.status} />
                        )}
                    </div>

                    {showSpoiler ? (
                        <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-300">
                                    <ShieldAlert size={19} />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-bold text-red-200">
                                        Bu sharh nomaqbul yoki yashirilgan deb
                                        belgilangan.
                                    </p>

                                    <p className="mt-1 text-xs font-medium leading-5 text-red-300/70">
                                        Ko‘rishni xohlasangiz, pastdagi tugmani
                                        bosing.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => setShowSpoiler(false)}
                                        className="mt-3 inline-flex items-center gap-2 rounded-xl border border-red-400/30 bg-red-500/20 px-4 py-2 text-xs font-black text-white transition hover:bg-red-500/30"
                                    >
                                        <Eye size={15} />
                                        Sharhni ko‘rsatish
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="mt-3 whitespace-pre-line break-words text-sm font-medium leading-7 text-gray-300 sm:text-[15px]">
                            {comment?.message || "Izoh matni mavjud emas."}
                        </p>
                    )}
                </div>
            </div>
        </article>
    );
};

const StatusBadge = ({ status }) => {
    const statusMap = {
        visible: {
            label: "Visible",
            className:
                "border-emerald-400/30 bg-emerald-500/10 text-emerald-300",
        },
        hidden: {
            label: "Hidden",
            className: "border-red-400/30 bg-red-500/10 text-red-300",
        },
        flagged: {
            label: "Flagged",
            className:
                "border-yellow-400/30 bg-yellow-500/10 text-yellow-300",
        },
    };

    const current = statusMap[status] || {
        label: status,
        className: "border-gray-500/30 bg-gray-500/10 text-gray-300",
    };

    return (
        <span
            className={`w-fit rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wider ${current.className}`}
        >
            {current.label}
        </span>
    );
};

export default CommentSection;