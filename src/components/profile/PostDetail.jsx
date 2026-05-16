import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import PostService from "../../services/post";

import {
    getPostDetailStart,
    getPostDetailSuccess,
    getPostDetailFailure,

    togglePostLikeStart,
    togglePostLikeSuccess,
    togglePostLikeFailure,
    updatePostDetailLocal,

    getCommentsStart,
    getCommentsSuccess,
    getCommentsFailure,

    addCommentSuccess,
    addCommentFailure,
} from "../../features/posts";

import timeAgo from "../../utils/timeAgo";

import DeleteConfirmationModal from "../DeleteConfirmationModal";
import CreatePostModal from "./CreatePostModal";
import PostCommentItem from "../PostCommentItem";

import UserImage from "../../assests/userImage.jpeg";

import {
    AlertTriangle,
    Bookmark,
    Clock,
    Edit3,
    Eye,
    Heart,
    Loader2,
    MessageCircle,
    PenLine,
    Send,
    ShieldCheck,
    Sparkles,
    Trash2,
    UserRound,
} from "lucide-react";

const selectPostDetailState = (state) => state.post;
const selectAuthState = (state) => state.auth;

const getPostTypeDisplay = (typeKey) => {
    switch (typeKey) {
        case "TEX":
            return {
                name: "Texnologiya",
                icon: "fa-solid fa-microchip",
                className: "border-indigo-400/30 bg-indigo-500/10 text-indigo-300",
            };
        case "SPO":
            return {
                name: "Sport",
                icon: "fa-solid fa-dumbbell",
                className: "border-emerald-400/30 bg-emerald-500/10 text-emerald-300",
            };
        case "BIZ":
            return {
                name: "Biznes",
                icon: "fa-solid fa-briefcase",
                className: "border-yellow-400/30 bg-yellow-500/10 text-yellow-300",
            };
        case "ENT":
            return {
                name: "O‘yin-kulgi",
                icon: "fa-solid fa-gamepad",
                className: "border-pink-400/30 bg-pink-500/10 text-pink-300",
            };
        case "OTH":
            return {
                name: "Boshqa",
                icon: "fa-solid fa-layer-group",
                className: "border-gray-500/30 bg-gray-500/10 text-gray-300",
            };
        default:
            return {
                name: "Noma’lum",
                icon: "fa-solid fa-circle-question",
                className: "border-gray-600/30 bg-gray-800/50 text-gray-400",
            };
    }
};

const getImageUrl = (image) => {
    if (!image) return UserImage;
    if (typeof image === "string" && image.startsWith("http")) return image;
    return `${window.location.origin}${image}`;
};

const getAuthorName = (author) => {
    const fullName = `${author?.first_name || ""} ${author?.last_name || ""}`.trim();
    return fullName || author?.username || "Anonim foydalanuvchi";
};

const StatCard = ({ icon: Icon, label, value, tone = "indigo" }) => {
    const tones = {
        pink: "border-pink-400/30 bg-pink-500/10 text-pink-300",
        cyan: "border-cyan-400/30 bg-cyan-500/10 text-cyan-300",
        emerald: "border-emerald-400/30 bg-emerald-500/10 text-emerald-300",
        indigo: "border-indigo-400/30 bg-indigo-500/10 text-indigo-300",
    };

    return (
        <div className="rounded-3xl border border-gray-700/70 bg-gray-950/35 p-4 shadow-xl shadow-black/20">
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
                    <p className="text-sm font-semibold text-gray-500">
                        {label}
                    </p>
                </div>
            </div>
        </div>
    );
};

const PostDetailSkeleton = () => {
    return (
        <div className="min-h-screen bg-[#05070a] px-4 py-24 text-white">
            <div className="container mx-auto">
                <div className="overflow-hidden rounded-[34px] border border-gray-800 bg-gray-900/60 p-6 shadow-2xl shadow-black/40">
                    <div className="grid gap-8 lg:grid-cols-12">
                        <div className="lg:col-span-8">
                            <div className="flex gap-4">
                                <div className="h-16 w-16 animate-pulse rounded-full bg-gray-800" />
                                <div className="flex-1 space-y-3">
                                    <div className="h-5 w-48 animate-pulse rounded-xl bg-gray-800" />
                                    <div className="h-4 w-32 animate-pulse rounded-xl bg-gray-800" />
                                </div>
                            </div>

                            <div className="mt-8 h-10 w-3/4 animate-pulse rounded-2xl bg-gray-800" />
                            <div className="mt-8 space-y-4">
                                <div className="h-4 w-full animate-pulse rounded-xl bg-gray-800" />
                                <div className="h-4 w-11/12 animate-pulse rounded-xl bg-gray-800" />
                                <div className="h-4 w-10/12 animate-pulse rounded-xl bg-gray-800" />
                            </div>
                        </div>

                        <div className="lg:col-span-4">
                            <div className="h-64 animate-pulse rounded-3xl bg-gray-800" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PostDetail = () => {
    const { username, slug } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { isLoggedIn, user: currentUser } = useSelector(selectAuthState);

    const {
        postDetail: postData,
        detail_isLoading: isLoading,
        detail_error: error,

        comments,
        comments_isLoading,
        comments_error,
    } = useSelector(selectPostDetailState);

    const [commentText, setCommentText] = useState("");
    const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);
    const [isLiking, setIsLiking] = useState(false);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const safeComments = Array.isArray(comments) ? comments : [];

    const author = postData?.user || {};
    const isOwner =
        Boolean(currentUser?.username && author?.username) &&
        currentUser.username === author.username;

    const typeDisplay = useMemo(
        () => getPostTypeDisplay(postData?.post_type),
        [postData?.post_type]
    );

    const authorName = getAuthorName(author);
    const authorImage = getImageUrl(author?.image);
    const currentUserImage = getImageUrl(currentUser?.image);

    const getDetail = useCallback(async () => {
        if (!username || !slug) return;

        dispatch(getPostDetailStart());

        try {
            const response = await PostService.getPostDetail(username, slug);
            dispatch(getPostDetailSuccess(response));
        } catch (err) {
            console.error("Post Detail olishda xato:", err);
            dispatch(
                getPostDetailFailure(
                    err?.message || "Post detail olishda xato yuz berdi."
                )
            );
        }
    }, [username, slug, dispatch]);

    const getComments = useCallback(
        async (postId) => {
            if (!postId) return;

            dispatch(getCommentsStart());

            try {
                const commentsData = await PostService.getPostComments(postId);
                dispatch(getCommentsSuccess(commentsData));
            } catch (err) {
                console.error("Sharhlarni yuklashda xato:", err);
                dispatch(
                    getCommentsFailure(
                        err?.message || "Sharhlarni yuklashda xato yuz berdi."
                    )
                );
            }
        },
        [dispatch]
    );

    useEffect(() => {
        getDetail();
    }, [getDetail]);

    useEffect(() => {
        if (postData?.id) {
            getComments(postData.id);
        }
    }, [postData?.id, getComments]);

    const handleUpdatePost = async (formData) => {
        if (!isOwner || !postData?.id) return;

        try {
            const updatedPost = await PostService.updatePost(
                username,
                postData.slug,
                formData
            );

            setIsEditModalOpen(false);
            dispatch(getPostDetailSuccess(updatedPost));
        } catch (err) {
            console.error("Postni tahrirlashda xato:", err);
            throw err;
        }
    };

    const handleConfirmDelete = async () => {
        if (!isOwner || !postData?.id) return;

        setIsDeleting(true);

        try {
            await PostService.deletePost(username, postData.slug);
            navigate(`/${currentUser?.username}/profile/`);
        } catch (err) {
            console.error("Postni o‘chirishda xato:", err);
            setIsDeleteModalOpen(false);
            alert("Postni o‘chirishda xato yuz berdi.");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleLikeToggle = async () => {
        if (!isLoggedIn) {
            alert("Like bosish uchun avval tizimga kiring!");
            return;
        }

        if (!postData?.id || isLiking) return;

        setIsLiking(true);
        dispatch(togglePostLikeStart());

        const oldIsLiked = Boolean(postData.is_liked_by_user);
        const oldLikesCount = Number(postData.likes_count || 0);

        const nextIsLiked = !oldIsLiked;
        const nextLikesCount = Math.max(
            0,
            nextIsLiked ? oldLikesCount + 1 : oldLikesCount - 1
        );

        dispatch(
            updatePostDetailLocal({
                is_liked_by_user: nextIsLiked,
                likes_count: nextLikesCount,
            })
        );

        try {
            const response = await PostService.togglePostLike(postData.id);

            dispatch(
                togglePostLikeSuccess({
                    post_id: postData.id,
                    is_liked_by_user: Boolean(response?.is_liked_by_user),
                    likes_count: Number(response?.likes_count || 0),
                })
            );
        } catch (err) {
            console.error("Post like toggle xato:", err);

            dispatch(
                updatePostDetailLocal({
                    is_liked_by_user: oldIsLiked,
                    likes_count: oldLikesCount,
                })
            );

            dispatch(togglePostLikeFailure(err?.message || "Like bosishda xato."));
            alert("Like bosishda xato yuz berdi. Qayta urinib ko‘ring.");
        } finally {
            setIsLiking(false);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        if (!isLoggedIn) {
            alert("Sharh qoldirish uchun avval tizimga kiring!");
            return;
        }

        const cleanText = commentText.trim();

        if (!cleanText || !postData?.id || isCommentSubmitting) return;

        setIsCommentSubmitting(true);

        try {
            const newComment = await PostService.createPostComment(postData.id, {
                message: cleanText,
            });

            setCommentText("");
            dispatch(addCommentSuccess(newComment));
        } catch (err) {
            console.error("Sharh yuborishda xato:", err);

            const errMsg =
                err?.message || "Sharh yuborishda xato yuz berdi.";

            dispatch(addCommentFailure(errMsg));
            alert(errMsg);
        } finally {
            setIsCommentSubmitting(false);
        }
    };

    if (isLoading) {
        return <PostDetailSkeleton />;
    }

    if (error || !postData) {
        return (
            <div className="min-h-screen bg-[#05070a] px-4 pt-40 text-white">
                <div className="mx-auto max-w-xl rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center shadow-2xl shadow-black/30">
                    <AlertTriangle className="mx-auto mb-4 text-red-300" size={52} />

                    <h1 className="text-2xl font-black text-white">
                        Maqola topilmadi yoki xato yuz berdi
                    </h1>

                    <p className="mt-3 text-sm font-semibold text-red-200/80">
                        {error || "Noma’lum xato"}
                    </p>

                    <button
                        type="button"
                        onClick={getDetail}
                        className="mt-6 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-500"
                    >
                        Qayta urinish
                    </button>
                </div>
            </div>
        );
    }

    const {
        post_type,
        title,
        content,
        created_at,
        likes_count,
        views_count,
        comments_count,
        is_liked_by_user,
    } = postData;

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#05070a] text-white">
            {/* BACKGROUND */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.06)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_74%)]" />
            <div className="pointer-events-none absolute left-1/2 top-24 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-indigo-600/15 blur-[120px]" />
            <div className="pointer-events-none absolute -right-32 top-1/3 h-[360px] w-[360px] rounded-full bg-pink-500/10 blur-[115px]" />
            <div className="pointer-events-none absolute -left-32 bottom-32 h-[360px] w-[360px] rounded-full bg-purple-500/10 blur-[115px]" />

            <main className="container relative z-10 mx-auto px-4 py-24">
                <div className="overflow-hidden rounded-[34px] border border-gray-700/70 bg-gray-900/65 shadow-2xl shadow-black/40 backdrop-blur-xl">
                    <div className="grid lg:grid-cols-[1fr_370px]">
                        {/* LEFT CONTENT */}
                        <div className="border-gray-700/70 p-5 sm:p-8 lg:border-r lg:p-10">
                            {/* HEADER */}
                            <section>
                                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="flex min-w-0 items-center gap-4">
                                        <Link
                                            to={`/${author?.username}/profile/`}
                                            className="shrink-0"
                                        >
                                            <img
                                                src={authorImage}
                                                alt={author?.username}
                                                className="h-16 w-16 rounded-full border-2 border-gray-700 object-cover shadow-xl shadow-black/30"
                                                onError={(e) => {
                                                    e.currentTarget.src = UserImage;
                                                }}
                                            />
                                        </Link>

                                        <div className="min-w-0">
                                            <Link
                                                to={`/${author?.username}/profile/`}
                                                className="block truncate text-xl font-black text-white transition hover:text-indigo-300"
                                            >
                                                {authorName}
                                            </Link>

                                            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm font-semibold text-gray-500">
                                                <Clock size={15} />
                                                <span>{timeAgo(created_at)} chop etildi</span>
                                            </div>
                                        </div>
                                    </div>

                                    {isOwner && (
                                        <div className="flex shrink-0 gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setIsEditModalOpen(true)}
                                                className="inline-flex items-center gap-2 rounded-2xl border border-indigo-400/40 bg-indigo-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 active:scale-95"
                                                title="Postni tahrirlash"
                                            >
                                                <Edit3 size={17} />
                                                <span className="hidden md:inline">
                                                    Tahrirlash
                                                </span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setIsDeleteModalOpen(true)}
                                                className="inline-flex items-center gap-2 rounded-2xl border border-red-400/40 bg-red-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-red-600/20 transition hover:bg-red-500 active:scale-95"
                                                title="Postni o‘chirish"
                                            >
                                                <Trash2 size={17} />
                                                <span className="hidden md:inline">
                                                    O‘chirish
                                                </span>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6">
                                    <span
                                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-black uppercase tracking-wider ${typeDisplay.className}`}
                                    >
                                        <i className={typeDisplay.icon}></i>
                                        {typeDisplay.name}
                                    </span>
                                </div>

                                <h1 className="mt-5 bg-gradient-to-r from-indigo-300 via-purple-400 to-pink-400 bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-5xl">
                                    {title}
                                </h1>
                            </section>

                            {/* ARTICLE */}
                            <article
                                className="mt-8 max-w-none rounded-3xl border border-gray-700/70 bg-gray-950/30 p-5 text-gray-300 shadow-xl shadow-black/20 sm:p-7
                                [&_a]:text-indigo-300 [&_a]:font-bold [&_a:hover]:underline
                                [&_blockquote]:border-l-4 [&_blockquote]:border-indigo-400 [&_blockquote]:pl-4 [&_blockquote]:text-gray-300
                                [&_code]:rounded-md [&_code]:bg-pink-500/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-pink-300
                                [&_h1]:text-3xl [&_h1]:font-black [&_h1]:text-white
                                [&_h2]:mt-8 [&_h2]:border-b [&_h2]:border-gray-700 [&_h2]:pb-2 [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-white
                                [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-black [&_h3]:text-white
                                [&_li]:my-1.5
                                [&_ol]:list-decimal [&_ol]:pl-6
                                [&_p]:my-4 [&_p]:leading-8
                                [&_pre]:overflow-x-auto [&_pre]:rounded-2xl [&_pre]:bg-black/40 [&_pre]:p-4
                                [&_strong]:text-white
                                [&_ul]:list-disc [&_ul]:pl-6"
                                dangerouslySetInnerHTML={{ __html: content }}
                            />

                            {/* COMMENTS */}
                            <section className="mt-10 border-t border-gray-700/70 pt-8">
                                <div className="mb-6 flex items-center justify-between gap-4">
                                    <div>
                                        <h2 className="flex items-center gap-3 text-2xl font-black text-white">
                                            <MessageCircle className="text-emerald-300" size={26} />
                                            Sharhlar
                                        </h2>
                                        <p className="mt-1 text-sm font-semibold text-gray-500">
                                            {(comments_count || 0).toLocaleString()} ta sharh
                                        </p>
                                    </div>
                                </div>

                                <form
                                    onSubmit={handleCommentSubmit}
                                    className="mb-8 rounded-3xl border border-gray-700/70 bg-gray-950/35 p-4 shadow-xl shadow-black/20"
                                >
                                    <div className="flex items-start gap-4">
                                        <img
                                            src={currentUserImage}
                                            alt="Current user"
                                            className="h-12 w-12 shrink-0 rounded-full border-2 border-gray-700 object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src = UserImage;
                                            }}
                                        />

                                        <div className="min-w-0 flex-1">
                                            <textarea
                                                className="min-h-[110px] w-full resize-none rounded-2xl border border-gray-700 bg-gray-900/80 p-4 text-sm font-medium leading-7 text-white outline-none transition placeholder:text-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                                                rows="3"
                                                placeholder={
                                                    isLoggedIn
                                                        ? "O‘z fikringizni qoldiring..."
                                                        : "Sharh qoldirish uchun avval tizimga kiring..."
                                                }
                                                value={commentText}
                                                onChange={(e) => setCommentText(e.target.value)}
                                                disabled={!isLoggedIn || isCommentSubmitting}
                                            />

                                            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                <p className="text-xs font-semibold text-gray-500">
                                                    Hurmat bilan yozing. Nomaqbul sharhlar o‘chirilishi mumkin.
                                                </p>

                                                <button
                                                    type="submit"
                                                    disabled={
                                                        !isLoggedIn ||
                                                        commentText.trim() === "" ||
                                                        isCommentSubmitting
                                                    }
                                                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-indigo-400/40 bg-indigo-600 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    {isCommentSubmitting ? (
                                                        <Loader2 size={18} className="animate-spin" />
                                                    ) : (
                                                        <Send size={17} />
                                                    )}
                                                    {isCommentSubmitting ? "Yuborilmoqda..." : "Yuborish"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>

                                {comments_isLoading && (
                                    <div className="rounded-3xl border border-gray-700/70 bg-gray-950/35 p-6 text-center text-gray-400">
                                        <Loader2 className="mx-auto mb-2 animate-spin text-indigo-300" size={28} />
                                        Sharhlar yuklanmoqda...
                                    </div>
                                )}

                                {comments_error && (
                                    <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-5 text-center text-red-300">
                                        Sharhlarni yuklashda xato yuz berdi: {comments_error}
                                    </div>
                                )}

                                <div className="space-y-6">
                                    {safeComments.map((comment) => (
                                        <PostCommentItem
                                            key={comment.id}
                                            comment={comment}
                                            postAuthorUsername={author?.username}
                                        />
                                    ))}

                                    {!comments_isLoading &&
                                        !comments_error &&
                                        safeComments.length === 0 && (
                                            <div className="rounded-3xl border-2 border-dashed border-gray-700/70 bg-gray-950/30 p-8 text-center">
                                                <MessageCircle className="mx-auto mb-3 text-gray-600" size={44} />
                                                <p className="font-bold text-gray-500">
                                                    Hali sharhlar mavjud emas.
                                                </p>
                                                <p className="mt-1 text-sm text-gray-600">
                                                    Birinchi bo‘lib sharh qoldiring.
                                                </p>
                                            </div>
                                        )}
                                </div>
                            </section>
                        </div>

                        {/* SIDEBAR */}
                        <aside className="p-5 sm:p-8">
                            <div className="space-y-6 lg:sticky lg:top-24">
                                <div className="rounded-3xl border border-gray-700/70 bg-gray-950/35 p-5 shadow-xl shadow-black/20">
                                    <h3 className="mb-4 flex items-center gap-3 text-lg font-black text-white">
                                        <ShieldCheck className="text-indigo-300" size={22} />
                                        Maqola statistikasi
                                    </h3>

                                    <div className="space-y-4">
                                        <button
                                            type="button"
                                            onClick={handleLikeToggle}
                                            disabled={isLiking}
                                            className={`group relative w-full overflow-hidden rounded-2xl border p-4 text-left shadow-xl transition-all duration-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 ${
                                                is_liked_by_user
                                                    ? "border-pink-400/40 bg-pink-500/15 shadow-pink-500/10"
                                                    : "border-gray-700/70 bg-gray-800/50 hover:border-pink-400/30 hover:bg-pink-500/10"
                                            }`}
                                        >
                                            <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-pink-500/10 blur-2xl opacity-0 transition group-hover:opacity-100" />

                                            <div className="relative z-10 flex items-center gap-4">
                                                <div
                                                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-all ${
                                                        is_liked_by_user
                                                            ? "border-pink-400/40 bg-pink-500/20 text-pink-300"
                                                            : "border-gray-700 bg-gray-900/70 text-gray-500 group-hover:text-pink-300"
                                                    }`}
                                                >
                                                    {isLiking ? (
                                                        <Loader2 size={22} className="animate-spin" />
                                                    ) : (
                                                        <Heart
                                                            size={24}
                                                            className={
                                                                is_liked_by_user
                                                                    ? "fill-pink-400 text-pink-400"
                                                                    : ""
                                                            }
                                                        />
                                                    )}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <p className="text-2xl font-black text-white">
                                                        {(likes_count || 0).toLocaleString()}
                                                    </p>

                                                    <p className="text-sm font-semibold text-gray-400">
                                                        {is_liked_by_user
                                                            ? "Siz like bosgansiz"
                                                            : "Like bosish"}
                                                    </p>
                                                </div>

                                                {is_liked_by_user && (
                                                    <span className="rounded-full border border-pink-400/30 bg-pink-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-pink-300">
                                                        Liked
                                                    </span>
                                                )}
                                            </div>
                                        </button>

                                        <StatCard
                                            icon={Eye}
                                            label="marta ko‘rilgan"
                                            value={views_count}
                                            tone="cyan"
                                        />

                                        <StatCard
                                            icon={MessageCircle}
                                            label="ta sharh"
                                            value={comments_count}
                                            tone="emerald"
                                        />
                                    </div>
                                </div>

                                <div className="rounded-3xl border border-gray-700/70 bg-gray-950/35 p-5 shadow-xl shadow-black/20">
                                    <h3 className="mb-4 flex items-center gap-3 text-lg font-black text-white">
                                        <UserRound className="text-indigo-300" size={22} />
                                        Muallif
                                    </h3>

                                    <Link
                                        to={`/${author?.username}/profile/`}
                                        className="flex items-center gap-4 rounded-2xl border border-gray-700/70 bg-gray-900/60 p-4 transition hover:border-indigo-400/40 hover:bg-gray-800/70"
                                    >
                                        <img
                                            src={authorImage}
                                            alt={author?.username}
                                            className="h-14 w-14 rounded-full border-2 border-gray-700 object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src = UserImage;
                                            }}
                                        />

                                        <div className="min-w-0">
                                            <p className="truncate font-black text-white">
                                                {authorName}
                                            </p>
                                            <p className="mt-1 text-xs font-bold text-gray-500">
                                                @{author?.username || "unknown"}
                                            </p>
                                        </div>
                                    </Link>
                                </div>

                                <button
                                    type="button"
                                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-700 bg-gray-900/80 px-5 py-3 text-sm font-black text-white transition hover:border-gray-500 hover:bg-gray-800"
                                >
                                    <Bookmark size={18} />
                                    Saqlab qolish
                                </button>

                                <div className="rounded-3xl border border-indigo-400/20 bg-indigo-500/10 p-5">
                                    <div className="mb-3 flex items-center gap-3">
                                        <Sparkles className="text-indigo-300" size={22} />
                                        <h3 className="font-black text-white">
                                            FSociety Post
                                        </h3>
                                    </div>

                                    <p className="text-sm font-medium leading-7 text-indigo-100/80">
                                        Foydali postlarga like bosing va muallifni qo‘llab-quvvatlang.
                                    </p>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            {isOwner && (
                <CreatePostModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSubmit={handleUpdatePost}
                    initialData={{
                        post_type: post_type,
                        title: title,
                        content: content,
                    }}
                    isSubmitting={false}
                />
            )}

            {isOwner && (
                <DeleteConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleConfirmDelete}
                    itemTitle={title}
                    isProcessing={isDeleting}
                />
            )}
        </div>
    );
};

export default PostDetail;