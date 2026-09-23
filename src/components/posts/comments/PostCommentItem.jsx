import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useDispatch,
} from "react-redux";

import {
    Link,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
    Clock3,
    Crown,
} from "lucide-react";

import PostService from "../../../services/post";

import {
    deleteCommentSuccess,
    updateCommentSuccess,
} from "../../../features/posts";

import timeAgo from "../../../utils/timeAgo";

import DeleteConfirmationModal from "../../DeleteConfirmationModal";

import PostCommentActions from "./PostCommentActions";
import PostCommentEditForm from "./PostCommentEditForm";

import {
    getCommentAvatarUrl,
    getCommentErrorMessage,
    getCommentUserName,
    handleCommentAvatarError,
    normalizeLikesCount,
} from "./commentUtils";


// =========================================================
// POST COMMENT ITEM
// =========================================================

const PostCommentItem = ({
    comment,
    postAuthorUsername,
    currentUser,
    isLoggedIn,
    onDeleted,
}) => {

    // =====================================================
    // REDUX
    // =====================================================

    const dispatch =
        useDispatch();


    // =====================================================
    // EDIT STATE
    // =====================================================

    const [
        isEditing,
        setIsEditing,
    ] = useState(
        false
    );


    const [
        editMessage,
        setEditMessage,
    ] = useState(
        comment?.message
        ||
        ""
    );


    const [
        editError,
        setEditError,
    ] = useState(
        ""
    );


    // =====================================================
    // PROCESSING STATE
    // =====================================================

    const [
        isProcessing,
        setIsProcessing,
    ] = useState(
        false
    );


    const [
        isDeleteModalOpen,
        setIsDeleteModalOpen,
    ] = useState(
        false
    );


    // =====================================================
    // LIKE STATE
    // =====================================================

    const [
        isLiking,
        setIsLiking,
    ] = useState(
        false
    );


    const [
        isLiked,
        setIsLiked,
    ] = useState(
        Boolean(
            comment?.is_liked_by_user
        )
    );


    const [
        likesCount,
        setLikesCount,
    ] = useState(
        normalizeLikesCount(
            comment
        )
    );


    // =====================================================
    // SYNC COMMENT DATA
    // =====================================================

    useEffect(
        () => {

            setEditMessage(
                comment?.message
                ||
                ""
            );


            setIsLiked(
                Boolean(
                    comment?.is_liked_by_user
                )
            );


            setLikesCount(
                normalizeLikesCount(
                    comment
                )
            );

        },
        [
            comment?.id,
            comment?.message,
            comment?.is_liked_by_user,
            comment?.likes_count,
            comment?.likes,
        ]
    );


    // =====================================================
    // COMMENT USER
    // =====================================================

    const commentUser =
        comment?.user
        ||
        {};


    // =====================================================
    // POST AUTHOR
    // =====================================================

    const isPostAuthor =
        Boolean(
            postAuthorUsername
            &&
            commentUser?.username
            &&
            postAuthorUsername
            ===
            commentUser.username
        );


    // =====================================================
    // COMMENT OWNER
    // =====================================================

    const calculatedOwner =
        Boolean(
            currentUser?.id
            &&
            commentUser?.id
            &&
            Number(
                currentUser.id
            )
            ===
            Number(
                commentUser.id
            )
        );


    /*
        Backend serializer:

        is_owner
        can_modify

        fieldlarini yuboradi.

        Agar ular mavjud bo‘lsa backend natijasini ishlatamiz.
        Aks holda currentUser ID orqali tekshiramiz.
    */

    const isCommentOwner =
        typeof comment?.is_owner
        === "boolean"

            ? comment.is_owner

            : typeof comment?.can_modify
              === "boolean"

                ? comment.can_modify

                : calculatedOwner;


    // =====================================================
    // AVATAR
    // =====================================================

    const avatarUrl =
        useMemo(
            () =>
                getCommentAvatarUrl(
                    commentUser
                ),
            [
                commentUser,
            ]
        );


    // =====================================================
    // DISPLAY NAME
    // =====================================================

    const displayName =
        getCommentUserName(
            commentUser
        );


    // =====================================================
    // START EDIT
    // =====================================================

    const handleStartEdit =
        () => {

            if (
                !isCommentOwner
                ||
                isProcessing
                ||
                isLiking
            ) {
                return;
            }


            setEditMessage(
                comment?.message
                ||
                ""
            );


            setEditError(
                ""
            );


            setIsEditing(
                true
            );
        };


    // =====================================================
    // CANCEL EDIT
    // =====================================================

    const handleCancelEdit =
        () => {

            if (
                isProcessing
            ) {
                return;
            }


            setEditMessage(
                comment?.message
                ||
                ""
            );


            setEditError(
                ""
            );


            setIsEditing(
                false
            );
        };


    // =====================================================
    // SAVE EDIT
    // =====================================================

    const handleSaveEdit =
        async () => {

            if (
                !isCommentOwner
                ||
                isProcessing
            ) {
                return;
            }


            const cleanMessage =
                String(
                    editMessage
                    ||
                    ""
                )
                    .trim();


            const oldMessage =
                String(
                    comment?.message
                    ||
                    ""
                )
                    .trim();


            // ---------------------------------------------
            // EMPTY
            // ---------------------------------------------

            if (
                !cleanMessage
            ) {

                setEditError(
                    "Sharh matni bo‘sh bo‘lishi mumkin emas."
                );

                return;
            }


            // ---------------------------------------------
            // MAX LENGTH
            // ---------------------------------------------

            if (
                cleanMessage.length
                >
                255
            ) {

                setEditError(
                    "Sharh 255 ta belgidan oshmasligi kerak."
                );

                return;
            }


            // ---------------------------------------------
            // NOT CHANGED
            // ---------------------------------------------

            if (
                cleanMessage
                ===
                oldMessage
            ) {

                setEditError(
                    ""
                );


                setIsEditing(
                    false
                );

                return;
            }


            // ---------------------------------------------
            // REQUEST
            // ---------------------------------------------

            setIsProcessing(
                true
            );


            setEditError(
                ""
            );


            const toastId =
                toast.loading(
                    "Sharh saqlanmoqda..."
                );


            try {

                const updatedComment =
                    await PostService
                        .updatePostComment(
                            comment.id,
                            {
                                message:
                                    cleanMessage,
                            }
                        );


                // Redux ichidagi commentni yangilaymiz
                dispatch(
                    updateCommentSuccess(
                        updatedComment
                    )
                );


                setEditMessage(
                    updatedComment?.message
                    ??
                    cleanMessage
                );


                setIsEditing(
                    false
                );


                toast.success(
                    "Sharh yangilandi.",
                    {
                        id:
                            toastId,
                    }
                );

            } catch (
                error
            ) {

                const message =
                    getCommentErrorMessage(
                        error,
                        "Sharhni saqlashda xato yuz berdi."
                    );


                setEditError(
                    message
                );


                toast.error(
                    message,
                    {
                        id:
                            toastId,
                    }
                );

            } finally {

                setIsProcessing(
                    false
                );
            }
        };


    // =====================================================
    // OPEN DELETE
    // =====================================================

    const handleOpenDelete =
        () => {

            if (
                !isCommentOwner
                ||
                isProcessing
                ||
                isLiking
            ) {
                return;
            }


            setIsDeleteModalOpen(
                true
            );
        };


    // =====================================================
    // CLOSE DELETE
    // =====================================================

    const handleCloseDelete =
        () => {

            if (
                isProcessing
            ) {
                return;
            }


            setIsDeleteModalOpen(
                false
            );
        };


    // =====================================================
    // DELETE COMMENT
    // =====================================================

    const handleConfirmDelete =
        async () => {

            if (
                !isCommentOwner
                ||
                isProcessing
                ||
                !comment?.id
            ) {
                return;
            }


            setIsProcessing(
                true
            );


            const toastId =
                toast.loading(
                    "Sharh o‘chirilmoqda..."
                );


            try {

                await PostService
                    .deletePostComment(
                        comment.id
                    );


                // Redux listdan olib tashlaymiz
                dispatch(
                    deleteCommentSuccess(
                        comment.id
                    )
                );


                setIsDeleteModalOpen(
                    false
                );


                // Parent component kerak bo‘lsa
                // comments_count kabi qiymatni
                // alohida yangilashi mumkin.
                if (
                    typeof onDeleted
                    === "function"
                ) {

                    onDeleted(
                        comment.id
                    );
                }


                toast.success(
                    "Sharh o‘chirildi.",
                    {
                        id:
                            toastId,
                    }
                );

            } catch (
                error
            ) {

                const message =
                    getCommentErrorMessage(
                        error,
                        "Sharhni o‘chirishda xato yuz berdi."
                    );


                toast.error(
                    message,
                    {
                        id:
                            toastId,
                    }
                );

            } finally {

                setIsProcessing(
                    false
                );
            }
        };


    // =====================================================
    // COMMENT LIKE / UNLIKE
    // =====================================================

    const handleLikeToggle =
        async () => {

            // ---------------------------------------------
            // AUTH
            // ---------------------------------------------

            if (
                !isLoggedIn
            ) {

                toast.error(
                    "Sharhga like bosish uchun avval tizimga kiring."
                );

                return;
            }


            // ---------------------------------------------
            // GUARD
            // ---------------------------------------------

            if (
                !comment?.id
                ||
                isLiking
            ) {
                return;
            }


            // ---------------------------------------------
            // CURRENT STATE
            // ---------------------------------------------

            const previousLiked =
                Boolean(
                    isLiked
                );


            const previousCount =
                Number.isFinite(
                    Number(
                        likesCount
                    )
                )
                    ? Math.max(
                        0,
                        Number(
                            likesCount
                        )
                    )
                    : 0;


            // ---------------------------------------------
            // OPTIMISTIC STATE
            // ---------------------------------------------

            const optimisticLiked =
                !previousLiked;


            const optimisticCount =
                Math.max(
                    0,

                    previousCount
                    +
                    (
                        optimisticLiked
                            ? 1
                            : -1
                    )
                );


            setIsLiked(
                optimisticLiked
            );


            setLikesCount(
                optimisticCount
            );


            setIsLiking(
                true
            );


            try {

                // =========================================
                // YANGI POST SERVICE
                // =========================================

                const response =
                    await PostService
                        .togglePostCommentLike(
                            comment.id
                        );


                // =========================================
                // SERVER STATE
                // =========================================

                const serverLiked =
                    response
                        ?.is_liked_by_user
                    ??
                    response
                        ?.is_liked
                    ??
                    optimisticLiked;


                const rawServerCount =
                    Number(
                        response
                            ?.likes_count
                        ??
                        response
                            ?.like_count
                        ??
                        optimisticCount
                    );


                const serverCount =
                    Number.isFinite(
                        rawServerCount
                    )

                        ? Math.max(
                            0,
                            rawServerCount
                        )

                        : optimisticCount;


                // =========================================
                // LOCAL STATE
                // =========================================

                setIsLiked(
                    Boolean(
                        serverLiked
                    )
                );


                setLikesCount(
                    serverCount
                );


                // =========================================
                // REDUX STATE
                // =========================================
                //
                // Muhim:
                // faqat local state'da qoldirmaymiz.
                //
                // Aks holda boshqa Redux update sodir
                // bo‘lganda eski like qiymati qaytishi mumkin.
                // =========================================

                dispatch(
                    updateCommentSuccess({
                        ...comment,

                        is_liked_by_user:
                            Boolean(
                                serverLiked
                            ),

                        likes_count:
                            serverCount,
                    })
                );

            } catch (
                error
            ) {

                // =========================================
                // ROLLBACK
                // =========================================

                setIsLiked(
                    previousLiked
                );


                setLikesCount(
                    previousCount
                );


                toast.error(
                    getCommentErrorMessage(
                        error,
                        "Sharhga like bosishda xato yuz berdi."
                    )
                );

            } finally {

                setIsLiking(
                    false
                );
            }
        };


    // =====================================================
    // JSX
    // =====================================================

    return (

        <article
            className="
                group
                rounded-3xl
                border
                border-white/[0.06]
                bg-white/[0.022]
                p-4
                shadow-xl
                shadow-black/10
                transition
                duration-300
                hover:border-white/[0.10]
                hover:bg-white/[0.03]
                sm:p-5
            "
        >

            <div
                className="
                    flex
                    items-start
                    gap-3
                    sm:gap-4
                "
            >

                {/* =========================================
                    AVATAR
                ========================================== */}

                <Link
                    to={`/${
                        commentUser?.username
                        ||
                        "user"
                    }/profile/`}
                    className="
                        shrink-0
                    "
                >

                    <img
                        src={
                            avatarUrl
                        }
                        alt={
                            commentUser?.username
                            ||
                            "User"
                        }
                        onError={
                            handleCommentAvatarError
                        }
                        className="
                            h-11
                            w-11
                            rounded-full
                            border-2
                            border-white/[0.08]
                            bg-gray-900
                            object-cover
                            transition
                            duration-300
                            group-hover:border-indigo-400/20
                            sm:h-12
                            sm:w-12
                        "
                    />

                </Link>


                {/* =========================================
                    CONTENT
                ========================================== */}

                <div
                    className="
                        min-w-0
                        flex-1
                    "
                >

                    {/* =====================================
                        USER INFO
                    ====================================== */}

                    <div
                        className="
                            flex
                            flex-wrap
                            items-center
                            gap-x-2
                            gap-y-1
                        "
                    >

                        <Link
                            to={`/${
                                commentUser?.username
                                ||
                                "user"
                            }/profile/`}
                            className="
                                truncate
                                text-sm
                                font-black
                                text-white
                                transition
                                hover:text-indigo-300
                            "
                        >
                            {
                                displayName
                            }
                        </Link>


                        <span
                            className="
                                text-xs
                                font-bold
                                text-gray-600
                            "
                        >
                            @
                            {
                                commentUser?.username
                                ||
                                "unknown"
                            }
                        </span>


                        {/* =================================
                            POST AUTHOR BADGE
                        ================================== */}

                        {isPostAuthor && (

                            <span
                                className="
                                    inline-flex
                                    items-center
                                    gap-1
                                    rounded-full
                                    border
                                    border-indigo-400/20
                                    bg-indigo-500/10
                                    px-2
                                    py-0.5
                                    text-[9px]
                                    font-black
                                    uppercase
                                    tracking-wider
                                    text-indigo-300
                                "
                            >

                                <Crown
                                    size={10}
                                />

                                Muallif

                            </span>

                        )}


                        {/* =================================
                            DATE
                        ================================== */}

                        <span
                            className="
                                inline-flex
                                items-center
                                gap-1
                                text-[10px]
                                font-semibold
                                text-gray-600
                            "
                        >

                            <Clock3
                                size={11}
                            />

                            {
                                timeAgo(
                                    comment?.created_at
                                )
                            }

                        </span>

                    </div>


                    {/* =====================================
                        COMMENT MESSAGE / EDIT
                    ====================================== */}

                    {isEditing ? (

                        <PostCommentEditForm
                            value={
                                editMessage
                            }
                            onChange={
                                setEditMessage
                            }
                            onCancel={
                                handleCancelEdit
                            }
                            onSave={
                                handleSaveEdit
                            }
                            isProcessing={
                                isProcessing
                            }
                            error={
                                editError
                            }
                            originalValue={
                                comment?.message
                            }
                        />

                    ) : (

                        <p
                            className="
                                mt-3
                                whitespace-pre-wrap
                                break-words
                                text-sm
                                font-medium
                                leading-7
                                text-gray-300
                            "
                        >
                            {
                                comment?.message
                                ||
                                ""
                            }
                        </p>

                    )}


                    {/* =====================================
                        COMMENT ACTIONS
                    ====================================== */}

                    <PostCommentActions
                        isLiked={
                            isLiked
                        }
                        likesCount={
                            likesCount
                        }
                        isLiking={
                            isLiking
                        }
                        isCommentOwner={
                            isCommentOwner
                        }
                        isEditing={
                            isEditing
                        }
                        isProcessing={
                            isProcessing
                        }
                        onLike={
                            handleLikeToggle
                        }
                        onEdit={
                            handleStartEdit
                        }
                        onDelete={
                            handleOpenDelete
                        }
                    />

                </div>

            </div>


            {/* =============================================
                DELETE MODAL
            ============================================== */}

            {isCommentOwner && (

                <DeleteConfirmationModal
                    isOpen={
                        isDeleteModalOpen
                    }
                    onClose={
                        handleCloseDelete
                    }
                    onConfirm={
                        handleConfirmDelete
                    }
                    itemTitle={
                        `Sharh (${String(
                            comment?.message
                            ||
                            ""
                        ).slice(
                            0,
                            30
                        )}${
                            String(
                                comment?.message
                                ||
                                ""
                            ).length > 30
                                ? "..."
                                : ""
                        })`
                    }
                    isProcessing={
                        isProcessing
                    }
                />

            )}

        </article>
    );
};


export default PostCommentItem;