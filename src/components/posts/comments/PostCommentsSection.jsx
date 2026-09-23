import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import toast from "react-hot-toast";

import {
    AlertTriangle,
    Loader2,
    MessageCircle,
    RefreshCcw,
} from "lucide-react";

import PostService from "../../../services/post";

import {
    addCommentFailure,
    addCommentSuccess,
    getCommentsFailure,
    getCommentsStart,
    getCommentsSuccess,
    updatePostDetailLocal,
} from "../../../features/posts";

import PostCommentForm from "./PostCommentForm";
import PostCommentItem from "./PostCommentItem";
import {
    getCommentErrorMessage,
} from "./commentUtils";

const selectPostState = (state) => state.post;

const PostCommentsSection = ({
    postId,
    postAuthorUsername,
    currentUser,
    isLoggedIn,
}) => {
    const dispatch = useDispatch();

    const {
        comments,
        comments_isLoading: isLoading,
        comments_error: error,
        postDetail,
    } = useSelector(selectPostState);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const safeComments = useMemo(
        () => Array.isArray(comments) ? comments : [],
        [comments]
    );

    const commentsCount = Number(
        postDetail?.comments_count ?? safeComments.length ?? 0
    );

    const loadComments = useCallback(async () => {
        if (!postId) {
            return;
        }

        dispatch(getCommentsStart());

        try {
            const response = await PostService.getPostComments(postId);

            const commentList = Array.isArray(response)
                ? response
                : Array.isArray(response?.results)
                    ? response.results
                    : [];

            dispatch(
                getCommentsSuccess(commentList)
            );
        } catch (requestError) {
            const message = getCommentErrorMessage(
                requestError,
                "Sharhlarni yuklashda xato yuz berdi."
            );

            dispatch(
                getCommentsFailure(message)
            );
        }
    }, [postId, dispatch]);

    useEffect(() => {
        loadComments();
    }, [loadComments]);

    const handleCreateComment = async (message) => {
        if (!isLoggedIn) {
            toast.error(
                "Sharh qoldirish uchun avval tizimga kiring."
            );
            return false;
        }

        if (!postId || isSubmitting) {
            return false;
        }

        const cleanMessage = String(message || "").trim();

        if (!cleanMessage) {
            toast.error("Sharh matnini kiriting.");
            return false;
        }

        if (cleanMessage.length > 255) {
            toast.error("Sharh 255 ta belgidan oshmasligi kerak.");
            return false;
        }

        setIsSubmitting(true);

        const toastId = toast.loading("Sharh yuborilmoqda...");

        try {
            const response = await PostService.createPostComment(
                postId,
                {
                    message: cleanMessage,
                }
            );

            const newComment = response?.comment || response;

            dispatch(
                addCommentSuccess(newComment)
            );

            dispatch(
                updatePostDetailLocal({
                    comments_count: commentsCount + 1,
                })
            );

            toast.success(
                "Sharh yuborildi.",
                {
                    id: toastId,
                }
            );

            return true;
        } catch (requestError) {
            const messageText = getCommentErrorMessage(
                requestError,
                "Sharh yuborishda xato yuz berdi."
            );

            dispatch(
                addCommentFailure(messageText)
            );

            toast.error(
                messageText,
                {
                    id: toastId,
                }
            );

            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCommentDeleted = () => {
        dispatch(
            updatePostDetailLocal({
                comments_count: Math.max(
                    0,
                    commentsCount - 1
                ),
            })
        );
    };

    return (
        <section className="mt-10 border-t border-gray-700/70 pt-8">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="flex items-center gap-3 text-2xl font-black text-white">
                        <MessageCircle
                            className="text-emerald-300"
                            size={26}
                        />
                        Sharhlar
                    </h2>

                    <p className="mt-1 text-sm font-semibold text-gray-500">
                        {commentsCount.toLocaleString()} ta sharh
                    </p>
                </div>

                <button
                    type="button"
                    onClick={loadComments}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 self-start rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-xs font-bold text-gray-500 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
                >
                    <RefreshCcw
                        size={14}
                        className={isLoading ? "animate-spin" : ""}
                    />
                    Yangilash
                </button>
            </div>

            <PostCommentForm
                currentUser={currentUser}
                isLoggedIn={isLoggedIn}
                isSubmitting={isSubmitting}
                onSubmit={handleCreateComment}
            />

            {isLoading && safeComments.length === 0 && (
                <div className="rounded-3xl border border-gray-700/70 bg-gray-950/35 p-6 text-center text-gray-400">
                    <Loader2
                        className="mx-auto mb-2 animate-spin text-indigo-300"
                        size={28}
                    />
                    Sharhlar yuklanmoqda...
                </div>
            )}

            {error && (
                <div className="mb-5 flex items-start gap-3 rounded-3xl border border-red-500/30 bg-red-500/10 p-5 text-red-300">
                    <AlertTriangle
                        size={19}
                        className="mt-0.5 shrink-0"
                    />

                    <div>
                        <p className="font-black">
                            Sharhlarni yuklashda xato
                        </p>
                        <p className="mt-1 text-sm font-medium text-red-200/80">
                            {error}
                        </p>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {safeComments.map((comment) => (
                    <PostCommentItem
                        key={comment.id}
                        comment={comment}
                        postAuthorUsername={postAuthorUsername}
                        currentUser={currentUser}
                        isLoggedIn={isLoggedIn}
                        onDeleted={handleCommentDeleted}
                    />
                ))}

                {!isLoading &&
                    !error &&
                    safeComments.length === 0 && (
                        <div className="rounded-3xl border-2 border-dashed border-gray-700/70 bg-gray-950/30 p-8 text-center">
                            <MessageCircle
                                className="mx-auto mb-3 text-gray-600"
                                size={44}
                            />

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
    );
};

export default PostCommentsSection;
