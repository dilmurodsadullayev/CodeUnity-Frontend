import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import UserImage from "../assests/userImage.jpeg";

import {
    postCommentFailure,
    postCommentStart,
    postCommentSuccess,
} from "../features/comments/Comment";

import CommentService from "../services/comments";

import {
    AlertTriangle,
    Loader2,
    MessageCircle,
    Send,
    Sparkles,
    UserRound,
} from "lucide-react";

const MAX_MESSAGE_LENGTH = 150;

const getImageUrl = (image) => {
    if (!image) return UserImage;

    if (typeof image === "string" && image.startsWith("http")) {
        return image;
    }

    return `${window.location.origin}${image}`;
};

const getErrorMessage = (error) => {
    if (!error) return "Fikr yuborishda xato yuz berdi.";

    try {
        const parsed = JSON.parse(error.message);

        if (parsed.message) {
            return Array.isArray(parsed.message)
                ? parsed.message[0]
                : parsed.message;
        }

        if (parsed.detail) return parsed.detail;

        return error.message;
    } catch {
        return error.message || "Fikr yuborishda xato yuz berdi.";
    }
};

const CommentForm = ({ onSuccess }) => {
    const dispatch = useDispatch();

    const { isLoggedIn, user } = useSelector((state) => state.auth);

    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [localError, setLocalError] = useState(null);
    const [success, setSuccess] = useState(false);

    const userImage = useMemo(() => getImageUrl(user?.image), [user?.image]);

    const remainingChars = MAX_MESSAGE_LENGTH - message.length;
    const isInvalid = !message.trim() || message.length > MAX_MESSAGE_LENGTH;

    const handleChange = (e) => {
        const value = e.target.value;

        if (value.length <= MAX_MESSAGE_LENGTH) {
            setMessage(value);
        }

        setLocalError(null);
        setSuccess(false);
    };

    const formSubmit = async (e) => {
        e.preventDefault();

        const cleanMessage = message.trim();

        if (!cleanMessage) {
            setLocalError("Fikr matni bo‘sh bo‘lmasligi kerak.");
            return;
        }

        if (cleanMessage.length > MAX_MESSAGE_LENGTH) {
            setLocalError(`Fikr ${MAX_MESSAGE_LENGTH} ta belgidan oshmasligi kerak.`);
            return;
        }

        if (!isLoggedIn) {
            setLocalError("Fikr qoldirish uchun avval tizimga kiring.");
            return;
        }

        setIsSubmitting(true);
        setLocalError(null);
        setSuccess(false);

        dispatch(postCommentStart());

        try {
            const response = await CommentService.postComment(cleanMessage);

            dispatch(postCommentSuccess(response));

            setMessage("");
            setSuccess(true);

            if (typeof onSuccess === "function") {
                await onSuccess(response);
            }

            setTimeout(() => {
                setSuccess(false);
            }, 1800);
        } catch (error) {
            console.error("Comment yuborishda xato:", error);

            const errorMessage = getErrorMessage(error);

            dispatch(postCommentFailure(errorMessage));
            setLocalError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative overflow-hidden rounded-3xl border border-gray-700/70 bg-gray-950/40 p-4 shadow-xl shadow-black/30 sm:p-5">
            <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-pink-500/10 blur-3xl" />

            <div className="relative z-10 flex items-start gap-4">
                <div className="relative shrink-0">
                    <img
                        src={userImage}
                        alt="User Avatar"
                        className="h-12 w-12 rounded-full border-2 border-gray-700 object-cover shadow-lg shadow-black/30 sm:h-14 sm:w-14"
                        onError={(e) => {
                            e.currentTarget.src = UserImage;
                        }}
                    />

                    <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-gray-950 bg-emerald-400 shadow-lg shadow-emerald-400/30" />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <UserRound size={16} className="text-indigo-300" />

                                <h4 className="truncate text-sm font-black text-white sm:text-base">
                                    {user?.username || "Foydalanuvchi"}
                                </h4>

                                <span className="inline-flex items-center gap-1 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-indigo-300">
                                    <Sparkles size={11} />
                                    Online
                                </span>
                            </div>

                            <p className="mt-1 text-xs font-semibold text-gray-500">
                                FSociety haqida fikringizni yozing
                            </p>
                        </div>

                        <div className="hidden items-center gap-2 rounded-full border border-gray-700 bg-gray-900/70 px-3 py-1 text-xs font-bold text-gray-400 sm:flex">
                            <MessageCircle size={14} />
                            Fikr
                        </div>
                    </div>

                    <form onSubmit={formSubmit} className="space-y-3">
                        <div className="relative">
                            <textarea
                                name="message"
                                value={message}
                                onChange={handleChange}
                                rows="4"
                                maxLength={MAX_MESSAGE_LENGTH}
                                disabled={isSubmitting}
                                placeholder="O‘z fikringizni shu yerga yozing..."
                                className="min-h-[120px] w-full resize-none rounded-2xl border border-gray-700 bg-gray-900/80 p-4 pr-14 text-sm font-medium leading-7 text-white outline-none transition-all placeholder:text-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                            />

                            <div className="absolute bottom-3 right-3 rounded-full border border-gray-700 bg-gray-950/80 px-2.5 py-1 text-[10px] font-black text-gray-500">
                                {remainingChars}
                            </div>
                        </div>

                        {localError && (
                            <div className="flex items-start gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm font-semibold text-red-300">
                                <AlertTriangle size={17} className="mt-0.5 shrink-0" />
                                <p>{localError}</p>
                            </div>
                        )}

                        {success && (
                            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm font-bold text-emerald-300">
                                <i className="fa-solid fa-check-circle mr-2"></i>
                                Fikringiz muvaffaqiyatli yuborildi!
                            </div>
                        )}

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs font-medium text-gray-500">
                                Hurmat bilan yozing. Nomaqbul fikrlar yashirilishi mumkin.
                            </p>

                            <button
                                type="submit"
                                disabled={isSubmitting || isInvalid}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-500/50 bg-indigo-600 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-indigo-600"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Yuborilmoqda...
                                    </>
                                ) : (
                                    <>
                                        <Send size={17} />
                                        Fikr qoldirish
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CommentForm;