import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
    getPostFailure,
    getPostStart,
    getPostSuccess,
    createPostStart,
    createPostSuccess,
    createPostFailure,
} from "../../features/posts";

import PostService from "../../services/post";
import { getPostTypeIcon } from "../../utils/colorUtils";
import timeAgo from "../../utils/timeAgo";

import CreatePostModal from "./CreatePostModal";

import {
    AlertTriangle,
    Clock,
    Eye,
    FileText,
    Heart,
    Loader2,
    MessageCircle,
    MessageSquarePlus,
    Plus,
    RefreshCcw,
    Search,
    Sparkles,
} from "lucide-react";

const selectPostState = (state) => state.post;

const getPostTypeDisplayName = (typeKey) => {
    switch (typeKey) {
        case "TEX":
            return "Texnologiya";
        case "SPO":
            return "Sport";
        case "BIZ":
            return "Biznes";
        case "ENT":
            return "O‘yin-kulgi";
        case "OTH":
            return "Boshqa";
        default:
            return "Noma’lum tur";
    }
};

const getPostTypeStyle = (typeKey) => {
    switch (typeKey) {
        case "TEX":
            return "border-indigo-400/30 bg-indigo-500/10 text-indigo-300";
        case "SPO":
            return "border-emerald-400/30 bg-emerald-500/10 text-emerald-300";
        case "BIZ":
            return "border-yellow-400/30 bg-yellow-500/10 text-yellow-300";
        case "ENT":
            return "border-pink-400/30 bg-pink-500/10 text-pink-300";
        case "OTH":
            return "border-gray-500/30 bg-gray-500/10 text-gray-300";
        default:
            return "border-gray-600/30 bg-gray-800/50 text-gray-400";
    }
};

const stripHtml = (html = "") => {
    const text = String(html)
        .replace(/<style[^>]*>.*?<\/style>/gis, "")
        .replace(/<script[^>]*>.*?<\/script>/gis, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/\s+/g, " ")
        .trim();

    return text;
};

const truncateText = (text, maxLength = 190) => {
    if (!text) return "Post mazmuni hali mavjud emas.";

    if (text.length <= maxLength) return text;

    return `${text.slice(0, maxLength).trim()}...`;
};

const ProfilePosts = ({ username }) => {
    const dispatch = useDispatch();

    const { isLoggedIn, user } = useSelector((state) => state.auth);

    const {
        posts,
        post_isLoading,
        post_error,
        create_isLoading,
        create_error,
    } = useSelector(selectPostState);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [search, setSearch] = useState("");

    const safePosts = Array.isArray(posts) ? posts : [];

    const isCurrentUser =
        Boolean(isLoggedIn && user?.username && username) &&
        user.username.toLowerCase() === username.toLowerCase();

    const getPost = useCallback(async () => {
        if (!username) return;

        dispatch(getPostStart());

        try {
            const response = await PostService.getPosts(username);
            dispatch(getPostSuccess(response));
        } catch (err) {
            console.error("Post olishda xato:", err);
            dispatch(
                getPostFailure(
                    err?.message || "Postlarni yuklashda xato yuz berdi."
                )
            );
        }
    }, [dispatch, username]);

    useEffect(() => {
        getPost();
    }, [getPost]);

    const handleCreatePost = useCallback(
        async (postDataFromModal) => {
            if (!isCurrentUser) return false;

            dispatch(createPostStart());

            try {
                const newPost = await PostService.createPost(
                    username,
                    postDataFromModal
                );

                dispatch(createPostSuccess(newPost));
                setIsModalOpen(false);

                return true;
            } catch (error) {
                let serverErrors;

                try {
                    serverErrors = JSON.parse(error.message);
                } catch {
                    serverErrors = { detail: error.message };
                }

                const msg = serverErrors.title
                    ? `Sarlavha: ${serverErrors.title[0]}`
                    : serverErrors.content
                      ? `Mazmun: ${serverErrors.content[0]}`
                      : serverErrors.detail || "Post yaratishda xato yuz berdi.";

                dispatch(createPostFailure(msg));
                throw new Error(msg);
            }
        },
        [username, isCurrentUser, dispatch]
    );

    const filteredPosts = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) return safePosts;

        return safePosts.filter((post) => {
            const title = String(post?.title || "").toLowerCase();
            const type = getPostTypeDisplayName(post?.post_type).toLowerCase();
            const content = stripHtml(post?.content).toLowerCase();

            return (
                title.includes(query) ||
                type.includes(query) ||
                content.includes(query)
            );
        });
    }, [safePosts, search]);

    const stats = useMemo(() => {
        return {
            total: safePosts.length,
            likes: safePosts.reduce(
                (sum, post) => sum + Number(post?.likes_count || 0),
                0
            ),
            views: safePosts.reduce(
                (sum, post) => sum + Number(post?.views_count || 0),
                0
            ),
            comments: safePosts.reduce(
                (sum, post) => sum + Number(post?.comments_count || 0),
                0
            ),
        };
    }, [safePosts]);

    if (post_isLoading) {
        return <PostsSkeleton />;
    }

    if (post_error) {
        return (
            <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center shadow-2xl shadow-black/30">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-red-400/25 bg-red-500/10 text-red-300">
                    <AlertTriangle size={42} />
                </div>

                <h3 className="text-2xl font-black text-white">
                    Postlar yuklanmadi
                </h3>

                <p className="mx-auto mt-3 max-w-xl text-sm font-semibold leading-7 text-red-200/80">
                    {post_error}
                </p>

                <button
                    type="button"
                    onClick={getPost}
                    className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-red-400/40 bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-500"
                >
                    <RefreshCcw size={17} />
                    Qayta urinish
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {/* HEADER */}
            <section className="relative overflow-hidden rounded-3xl border border-gray-700/70 bg-gray-900/70 p-5 shadow-xl shadow-black/30">
                <div className="pointer-events-none absolute -right-24 -top-24 h-52 w-52 rounded-full bg-indigo-500/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 -left-24 h-52 w-52 rounded-full bg-pink-500/10 blur-3xl" />

                <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-indigo-300">
                            <Sparkles size={14} />
                            Profile Posts
                        </div>

                        <h3 className="text-2xl font-black text-white">
                            Postlar / Javoblar
                        </h3>

                        <p className="mt-1 text-sm font-semibold text-gray-500">
                            Foydalanuvchining maqolalari, fikrlari va kontentlari
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="relative">
                            <Search
                                size={17}
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Post qidirish..."
                                className="w-full rounded-2xl border border-gray-700 bg-gray-950/60 py-3 pl-11 pr-4 text-sm font-semibold text-white outline-none transition placeholder:text-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 sm:w-64"
                            />
                        </div>

                        {isCurrentUser && (
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(true)}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-indigo-400/40 bg-indigo-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 active:scale-95"
                            >
                                <Plus size={18} />
                                Yangi Post
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* CREATE ERROR */}
            {create_error && !isModalOpen && (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-semibold text-red-300">
                    <AlertTriangle size={17} className="mr-2 inline-block" />
                    Post yaratishda xato: {create_error}
                </div>
            )}

            {/* STATS */}
            {safePosts.length > 0 && (
                <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <MiniStat
                        icon={FileText}
                        label="Jami postlar"
                        value={stats.total}
                        tone="indigo"
                    />

                    <MiniStat
                        icon={Heart}
                        label="Layklar"
                        value={stats.likes}
                        tone="pink"
                    />

                    <MiniStat
                        icon={Eye}
                        label="Ko‘rishlar"
                        value={stats.views}
                        tone="cyan"
                    />

                    <MiniStat
                        icon={MessageCircle}
                        label="Sharhlar"
                        value={stats.comments}
                        tone="emerald"
                    />
                </section>
            )}

            {/* EMPTY */}
            {safePosts.length === 0 && (
                <EmptyPosts
                    isCurrentUser={isCurrentUser}
                    onCreate={() => setIsModalOpen(true)}
                    message={
                        isCurrentUser
                            ? "Siz hali post yozmagansiz. Birinchi maqolangizni qo‘shing."
                            : "Foydalanuvchi hali biron bir maqola chop etmagan yoki savollarga javob bermagan."
                    }
                />
            )}

            {/* FILTER EMPTY */}
            {safePosts.length > 0 && filteredPosts.length === 0 && (
                <div className="rounded-3xl border border-dashed border-gray-700/70 bg-gray-900/50 p-8 text-center">
                    <Search className="mx-auto mb-3 text-gray-600" size={42} />

                    <h4 className="text-xl font-black text-white">
                        Qidiruv bo‘yicha post topilmadi
                    </h4>

                    <p className="mt-2 text-sm font-semibold text-gray-500">
                        Boshqa kalit so‘z bilan urinib ko‘ring.
                    </p>
                </div>
            )}

            {/* POSTS */}
            {filteredPosts.length > 0 && (
                <div id="posts" className="grid gap-5">
                    {filteredPosts.map((post, index) => (
                        <PostCard
                            key={post.id || index}
                            post={post}
                            username={username}
                            index={index}
                        />
                    ))}
                </div>
            )}

            <CreatePostModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreatePost}
                isSubmitting={create_isLoading}
            />
        </div>
    );
};

const PostsSkeleton = () => {
    return (
        <div className="space-y-5">
            <div className="rounded-3xl border border-gray-700/70 bg-gray-900/70 p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-3">
                        <div className="h-5 w-32 animate-pulse rounded-xl bg-gray-800" />
                        <div className="h-8 w-56 animate-pulse rounded-xl bg-gray-800" />
                        <div className="h-4 w-80 max-w-full animate-pulse rounded-xl bg-gray-800" />
                    </div>

                    <div className="h-12 w-40 animate-pulse rounded-2xl bg-gray-800" />
                </div>
            </div>

            {[1, 2, 3].map((item) => (
                <div
                    key={item}
                    className="rounded-3xl border border-gray-700/70 bg-gray-900/60 p-5 shadow-xl shadow-black/20"
                >
                    <div className="mb-4 flex items-center gap-3">
                        <div className="h-8 w-28 animate-pulse rounded-full bg-gray-800" />
                        <div className="h-4 w-32 animate-pulse rounded-xl bg-gray-800" />
                    </div>

                    <div className="space-y-4">
                        <div className="h-7 w-3/4 animate-pulse rounded-xl bg-gray-800" />
                        <div className="h-4 w-full animate-pulse rounded-xl bg-gray-800" />
                        <div className="h-4 w-5/6 animate-pulse rounded-xl bg-gray-800" />
                        <div className="h-12 w-full animate-pulse rounded-2xl bg-gray-800" />
                    </div>
                </div>
            ))}
        </div>
    );
};

const EmptyPosts = ({ message, isCurrentUser, onCreate }) => {
    return (
        <div className="relative overflow-hidden rounded-3xl border border-dashed border-gray-700/70 bg-gray-900/60 p-8 text-center shadow-2xl shadow-black/30">
            <div className="pointer-events-none absolute -right-24 -top-24 h-52 w-52 rounded-full bg-indigo-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-52 w-52 rounded-full bg-pink-500/10 blur-3xl" />

            <div className="relative z-10">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-gray-700 bg-gray-950/70 text-gray-500">
                    <MessageSquarePlus size={42} />
                </div>

                <h4 className="text-2xl font-black text-white">
                    Hech qanday post mavjud emas
                </h4>

                <p className="mx-auto mt-2 max-w-xl text-sm font-semibold leading-7 text-gray-500">
                    {message}
                </p>

                {isCurrentUser && (
                    <button
                        type="button"
                        onClick={onCreate}
                        className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-indigo-400/40 bg-indigo-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 active:scale-95"
                    >
                        <Plus size={18} />
                        Yangi Post
                    </button>
                )}
            </div>
        </div>
    );
};

const MiniStat = ({ icon: Icon, label, value, tone = "indigo" }) => {
    const tones = {
        indigo: "border-indigo-400/20 bg-indigo-500/10 text-indigo-300",
        pink: "border-pink-400/20 bg-pink-500/10 text-pink-300",
        cyan: "border-cyan-400/20 bg-cyan-500/10 text-cyan-300",
        emerald: "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
    };

    return (
        <div className="rounded-3xl border border-gray-700/70 bg-gray-900/60 p-4 shadow-xl shadow-black/20">
            <div className="flex items-center gap-4">
                <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
                        tones[tone] || tones.indigo
                    }`}
                >
                    <Icon size={22} />
                </div>

                <div>
                    <p className="text-2xl font-black text-white">
                        {(value || 0).toLocaleString()}
                    </p>

                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        {label}
                    </p>
                </div>
            </div>
        </div>
    );
};

const PostCard = ({ post, username, index }) => {
    const typeLabel = getPostTypeDisplayName(post?.post_type);
    const typeStyle = getPostTypeStyle(post?.post_type);
    const preview = truncateText(stripHtml(post?.content));

    return (
        <Link
            to={`/${username}/post/${post.slug}/`}
            className="group relative block overflow-hidden rounded-3xl border border-gray-700/70 bg-gray-900/70 p-5 shadow-xl shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/40 hover:bg-gray-900/90 hover:shadow-indigo-500/10"
            style={{ animationDelay: `${index * 80}ms` }}
        >
            <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-indigo-500/10 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative z-10">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-wider ${typeStyle}`}
                    >
                        <i className={`${getPostTypeIcon(post?.post_type)}`}></i>
                        {typeLabel}
                    </span>

                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500">
                        <Clock size={14} />
                        {timeAgo(post?.created_at)}
                    </span>
                </div>

                <h4 className="text-xl font-black leading-tight text-white transition-colors group-hover:text-indigo-300 sm:text-2xl">
                    {post?.title || "Noma’lum post"}
                </h4>

                <p className="mt-3 line-clamp-3 border-l-2 border-gray-700 pl-4 text-sm font-medium leading-7 text-gray-400 transition group-hover:border-indigo-400/60">
                    {preview}
                </p>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-gray-700/70 pt-4">
                    <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-gray-400">
                        <span className="inline-flex items-center gap-1.5 text-pink-300">
                            <Heart size={16} className="fill-pink-400/20" />
                            {(post?.likes_count || 0).toLocaleString()}
                        </span>

                        <span className="inline-flex items-center gap-1.5 text-cyan-300">
                            <Eye size={16} />
                            {(post?.views_count || 0).toLocaleString()}
                        </span>

                        <span className="inline-flex items-center gap-1.5 text-emerald-300">
                            <MessageCircle size={16} />
                            {(post?.comments_count || 0).toLocaleString()}
                        </span>
                    </div>

                    <span className="inline-flex items-center gap-2 rounded-2xl border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-xs font-black text-indigo-300 transition group-hover:bg-indigo-500/20">
                        Batafsil o‘qish
                        <i className="fa-solid fa-arrow-right transition-transform group-hover:translate-x-1"></i>
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default ProfilePosts;