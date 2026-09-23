import React, {
    useMemo,
    useState,
} from "react";

import {
    Loader2,
    LogIn,
    Send,
} from "lucide-react";

import {
    getCommentAvatarUrl,
    handleCommentAvatarError,
} from "./commentUtils";

const PostCommentForm = ({
    currentUser,
    isLoggedIn,
    isSubmitting,
    onSubmit,
}) => {
    const [message, setMessage] = useState("");

    const avatarUrl = useMemo(
        () => getCommentAvatarUrl(currentUser),
        [currentUser]
    );

    const cleanMessage = message.trim();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (
            !isLoggedIn ||
            !cleanMessage ||
            isSubmitting
        ) {
            return;
        }

        const created = await onSubmit?.(cleanMessage);

        if (created !== false) {
            setMessage("");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mb-8 rounded-3xl border border-gray-700/70 bg-gray-950/35 p-4 shadow-xl shadow-black/20"
        >
            <div className="flex items-start gap-3 sm:gap-4">
                <img
                    src={avatarUrl}
                    alt={currentUser?.username || "Current user"}
                    onError={handleCommentAvatarError}
                    className="h-11 w-11 shrink-0 rounded-full border-2 border-gray-700 bg-gray-900 object-cover sm:h-12 sm:w-12"
                />

                <div className="min-w-0 flex-1">
                    <textarea
                        rows={3}
                        maxLength={255}
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        disabled={!isLoggedIn || isSubmitting}
                        placeholder={
                            isLoggedIn
                                ? "O‘z fikringizni qoldiring..."
                                : "Sharh qoldirish uchun avval tizimga kiring..."
                        }
                        className="min-h-[110px] w-full resize-y rounded-2xl border border-gray-700 bg-gray-900/80 p-4 text-sm font-medium leading-7 text-white outline-none transition placeholder:text-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold text-gray-500">
                                Hurmat bilan yozing. Spam va nomaqbul sharhlar o‘chirilishi mumkin.
                            </p>

                            <p className="mt-1 text-[10px] font-bold text-gray-700">
                                {message.length}/255
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={
                                !isLoggedIn ||
                                !cleanMessage ||
                                isSubmitting
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-indigo-400/40 bg-indigo-600 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <Loader2
                                    size={18}
                                    className="animate-spin"
                                />
                            ) : isLoggedIn ? (
                                <Send size={17} />
                            ) : (
                                <LogIn size={17} />
                            )}

                            {isSubmitting
                                ? "Yuborilmoqda..."
                                : isLoggedIn
                                    ? "Yuborish"
                                    : "Avval tizimga kiring"}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default PostCommentForm;
