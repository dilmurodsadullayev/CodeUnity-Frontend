import React from "react";

import {
    Loader2,
    Save,
    X,
} from "lucide-react";

const PostCommentEditForm = ({
    value,
    onChange,
    onCancel,
    onSave,
    isProcessing,
    error,
    originalValue,
}) => {
    const cleanValue = value.trim();
    const cleanOriginalValue = String(originalValue || "").trim();

    const isSaveDisabled =
        isProcessing ||
        !cleanValue ||
        cleanValue === cleanOriginalValue;

    return (
        <div className="mt-4 space-y-3">
            <textarea
                value={value}
                onChange={(event) => onChange?.(event.target.value)}
                rows={4}
                maxLength={255}
                disabled={isProcessing}
                autoFocus
                className="min-h-[110px] w-full resize-y rounded-2xl border border-white/[0.08] bg-black/25 px-4 py-3 text-sm font-medium leading-6 text-white outline-none transition placeholder:text-gray-700 focus:border-indigo-400/40 focus:bg-indigo-500/[0.035] focus:ring-2 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Sharh matnini yozing..."
            />

            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                    {error ? (
                        <p className="text-xs font-semibold text-red-300">
                            {error}
                        </p>
                    ) : (
                        <p className="text-[11px] font-medium text-gray-600">
                            {value.length}/255
                        </p>
                    )}
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isProcessing}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-xs font-bold text-gray-400 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <X size={14} />
                        Bekor qilish
                    </button>

                    <button
                        type="button"
                        onClick={onSave}
                        disabled={isSaveDisabled}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-400/30 bg-indigo-600 px-3 py-2 text-xs font-black text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {isProcessing ? (
                            <Loader2
                                size={14}
                                className="animate-spin"
                            />
                        ) : (
                            <Save size={14} />
                        )}

                        {isProcessing ? "Saqlanmoqda..." : "Saqlash"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostCommentEditForm;
