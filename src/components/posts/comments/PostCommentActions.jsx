import React from "react";

import {
    Edit3,
    Heart,
    Loader2,
    Trash2,
} from "lucide-react";

const PostCommentActions = ({
    isLiked,
    likesCount,
    isLiking,
    isCommentOwner,
    isEditing,
    isProcessing,
    onLike,
    onEdit,
    onDelete,
}) => {
    return (
        <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-3">
            <button
                type="button"
                onClick={onLike}
                disabled={isLiking}
                aria-pressed={isLiked}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-black transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${
                    isLiked
                        ? "border-pink-400/30 bg-pink-500/10 text-pink-300"
                        : "border-white/[0.06] bg-white/[0.025] text-gray-500 hover:border-pink-400/20 hover:bg-pink-500/[0.06] hover:text-pink-300"
                }`}
            >
                {isLiking ? (
                    <Loader2
                        size={14}
                        className="animate-spin"
                    />
                ) : (
                    <Heart
                        size={14}
                        className={isLiked ? "fill-pink-400" : ""}
                    />
                )}

                <span>{likesCount}</span>
            </button>

            {isCommentOwner && !isEditing && (
                <>
                    <button
                        type="button"
                        onClick={onEdit}
                        disabled={isProcessing}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2 text-xs font-bold text-gray-500 transition hover:border-indigo-400/20 hover:bg-indigo-500/[0.06] hover:text-indigo-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Edit3 size={13} />
                        Tahrirlash
                    </button>

                    <button
                        type="button"
                        onClick={onDelete}
                        disabled={isProcessing}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2 text-xs font-bold text-gray-500 transition hover:border-red-400/20 hover:bg-red-500/[0.06] hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Trash2 size={13} />
                        O‘chirish
                    </button>
                </>
            )}
        </div>
    );
};

export default PostCommentActions;
