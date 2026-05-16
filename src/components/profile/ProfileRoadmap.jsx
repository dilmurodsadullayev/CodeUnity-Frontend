import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    getRoadMapFailure,
    getRoadMapStart,
    getRoadMapSuccess,

    deleteRoadMapStart,
    deleteRoadMapSuccess,
    deleteRoadMapFailure,

    toggleLikeRoadmapStart,
    toggleLikeRoadmapSuccess,
    toggleLikeRoadmapFailure,
    updateRoadmapLocal,
} from "../../features/roadmap";

import RoadmapService from "../../services/roadmap";

import RoadmapItem from "./RoadmapItem";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import RoadmapFormModal from "./RoadmapCreateModal";

const selectRoadmapState = (state) => state.roadmap;
const selectAuthUsername = (state) => state.auth.user?.username;

const ProfileRoadmap = ({ username }) => {
    const dispatch = useDispatch();

    const {
        roadmaps,
        roadmap_isLoading,
        roadmap_error,

        isDeleting,
        deleteError,

        isLiking,
        likingRoadmapId,
        likeError,
    } = useSelector(selectRoadmapState);

    const currentAuthUsername = useSelector(selectAuthUsername);
    const isOwner = currentAuthUsername === username;

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingRoadmap, setEditingRoadmap] = useState(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingRoadmap, setDeletingRoadmap] = useState(null);

    const safeRoadmaps = Array.isArray(roadmaps) ? roadmaps : [];

    const getRoadmap = useCallback(async () => {
        if (!username) return;

        dispatch(getRoadMapStart());

        try {
            const response = await RoadmapService.getRoadmap(username);
            dispatch(getRoadMapSuccess(response));
        } catch (err) {
            console.error("Roadmap olishda xato:", err);

            const errorMessage =
                err?.response?.data?.detail ||
                err?.message ||
                "Roadmaplarni olishda xato yuz berdi.";

            dispatch(getRoadMapFailure(errorMessage));
        }
    }, [dispatch, username]);

    useEffect(() => {
        getRoadmap();
    }, [getRoadmap]);

    const handleCreateClick = () => {
        setEditingRoadmap(null);
        setIsFormModalOpen(true);
    };

    const handleEditClick = (roadmap) => {
        setEditingRoadmap(roadmap);
        setIsFormModalOpen(true);
    };

    const handleCloseFormModal = () => {
        setIsFormModalOpen(false);
        setEditingRoadmap(null);

        // Modal ichida create/update bo‘lganidan keyin ro‘yxat yangilansin
        getRoadmap();
    };

    const handleDeleteClick = (roadmap) => {
        setDeletingRoadmap(roadmap);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeletingRoadmap(null);
    };

    const handleConfirmDelete = async () => {
        if (!deletingRoadmap || isDeleting) return;

        dispatch(deleteRoadMapStart());

        try {
            const deletedId = await RoadmapService.deleteRoadmap(
                username,
                deletingRoadmap.id
            );

            dispatch(deleteRoadMapSuccess(deletedId));
            handleCloseDeleteModal();
        } catch (err) {
            console.error("Roadmap o‘chirishda xato:", err);

            const errorMessage =
                err?.response?.data?.detail ||
                err?.message ||
                "Roadmap o‘chirishda kutilmagan xato yuz berdi.";

            dispatch(deleteRoadMapFailure(errorMessage));
            handleCloseDeleteModal();

            alert(`Xato: ${errorMessage}`);
        }
    };

    const handleToggleLike = async (roadmap) => {
        if (!roadmap?.id) return;

        if (!currentAuthUsername) {
            alert("Roadmapni yoqtirish uchun avval tizimga kiring.");
            return;
        }

        if (isLiking || isDeleting || roadmap_isLoading) return;

        dispatch(toggleLikeRoadmapStart(roadmap.id));

        const oldIsLiked = Boolean(roadmap.is_liked);
        const oldLikeCount = Number(roadmap.like_count || 0);

        const nextIsLiked = !oldIsLiked;
        const nextLikeCount = Math.max(
            0,
            nextIsLiked ? oldLikeCount + 1 : oldLikeCount - 1
        );

        // Like bosilganda UI darhol yonadi
        dispatch(
            updateRoadmapLocal({
                id: roadmap.id,
                changes: {
                    is_liked: nextIsLiked,
                    like_count: nextLikeCount,
                },
            })
        );

        try {
            const response = await RoadmapService.toggleLikeRoadmap(roadmap.id);

            dispatch(
                toggleLikeRoadmapSuccess({
                    ...response,
                    id: response?.id || roadmap.id,
                    is_liked: Boolean(response?.is_liked),
                    like_count: Number(response?.like_count ?? nextLikeCount),
                })
            );
        } catch (err) {
            console.error("Roadmap like bosishda xato:", err);

            // Xato bo‘lsa eski holatga qaytaradi
            dispatch(
                updateRoadmapLocal({
                    id: roadmap.id,
                    changes: {
                        is_liked: oldIsLiked,
                        like_count: oldLikeCount,
                    },
                })
            );

            const errorMessage =
                err?.response?.data?.detail ||
                err?.message ||
                "Roadmap like bosishda xato yuz berdi.";

            dispatch(toggleLikeRoadmapFailure(errorMessage));

            alert(`Xato: ${errorMessage}`);
        }
    };

    const NoRoadmap = ({ message }) => (
        <div className="relative overflow-hidden rounded-3xl border border-dashed border-gray-700/70 bg-gray-900/60 p-8 text-center shadow-2xl shadow-black/30">
            <div className="pointer-events-none absolute -right-24 -top-24 h-52 w-52 rounded-full bg-indigo-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-52 w-52 rounded-full bg-pink-500/10 blur-3xl" />

            <div className="relative z-10">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-gray-700 bg-gray-950/70 text-gray-500">
                    <i className="fa-solid fa-map-location-dot text-4xl"></i>
                </div>

                <h4 className="text-2xl font-black text-white">
                    Yo‘l xaritasi tuzilmagan
                </h4>

                <p className="mx-auto mt-2 max-w-xl text-sm font-semibold leading-7 text-gray-500">
                    {message}
                </p>

                {isOwner && (
                    <button
                        type="button"
                        onClick={handleCreateClick}
                        className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-indigo-400/40 bg-indigo-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 active:scale-95"
                    >
                        <i className="fa-solid fa-plus"></i>
                        Roadmap qo‘shish
                    </button>
                )}
            </div>
        </div>
    );

    if (roadmap_isLoading) {
        return (
            <div id="roadmap">
                <div className="relative overflow-hidden rounded-3xl border border-gray-700/70 bg-gray-900/70 p-6 shadow-2xl shadow-black/30 md:p-8">
                    <div className="absolute left-10 top-10 h-[calc(100%-4rem)] w-0.5 bg-gray-800"></div>

                    <div className="space-y-8">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="relative flex gap-5 pl-10"
                            >
                                <div className="absolute left-0 top-1.5 h-9 w-9 animate-pulse rounded-full bg-gray-800"></div>

                                <div className="flex-1 space-y-3">
                                    <div className="h-4 w-40 animate-pulse rounded-xl bg-gray-800"></div>
                                    <div className="h-6 w-2/3 animate-pulse rounded-xl bg-gray-800"></div>
                                    <div className="h-4 w-full animate-pulse rounded-xl bg-gray-800"></div>
                                    <div className="h-4 w-4/5 animate-pulse rounded-xl bg-gray-800"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (roadmap_error) {
        return (
            <NoRoadmap
                message={`Yo‘l xaritasini yuklashda xato yuz berdi: ${roadmap_error}`}
            />
        );
    }

    if (safeRoadmaps.length === 0) {
        return (
            <>
                <NoRoadmap
                    message={
                        isOwner
                            ? "Sizning rivojlanish bosqichlaringizni qo‘shing!"
                            : "Foydalanuvchi o‘zining rivojlanish bosqichlarini hali kiritmagan."
                    }
                />

                <RoadmapFormModal
                    isOpen={isFormModalOpen}
                    onClose={handleCloseFormModal}
                    username={username}
                    initialData={editingRoadmap}
                />
            </>
        );
    }

    return (
        <div id="roadmap" className="space-y-5">
            <div className="flex flex-col gap-4 rounded-3xl border border-gray-700/70 bg-gray-900/60 p-5 shadow-xl shadow-black/20 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-2xl font-black text-white">
                        Yo‘l xaritasi
                    </h3>

                    <p className="mt-1 text-sm font-semibold text-gray-500">
                        Rivojlanish bosqichlari va tajribalar
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <span className="rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-indigo-300">
                        {safeRoadmaps.length} ta
                    </span>

                    {isOwner && (
                        <button
                            type="button"
                            onClick={handleCreateClick}
                            className="inline-flex items-center gap-2 rounded-2xl border border-indigo-400/40 bg-indigo-600 px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 active:scale-95"
                        >
                            <i className="fa-solid fa-plus"></i>
                            Roadmap qo‘shish
                        </button>
                    )}
                </div>
            </div>

            {(deleteError || likeError) && (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-semibold text-red-300">
                    {deleteError || likeError}
                </div>
            )}

            <div className="relative overflow-hidden rounded-3xl border border-gray-700/70 bg-gray-900/70 p-5 shadow-2xl shadow-black/30 md:p-8">
                <div className="pointer-events-none absolute -right-24 -top-24 h-52 w-52 rounded-full bg-indigo-500/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 -left-24 h-52 w-52 rounded-full bg-pink-500/10 blur-3xl" />

                <div className="relative">
                    <div className="absolute left-4 top-4 h-[calc(100%-1rem)] w-0.5 bg-gray-800"></div>

                    {safeRoadmaps.map((event, index) => (
                        <RoadmapItem
                            key={event.id}
                            event={event}
                            index={index}
                            isLikeLoading={
                                isLiking && likingRoadmapId === event.id
                            }
                            onEdit={handleEditClick}
                            onDelete={handleDeleteClick}
                            onToggleLike={handleToggleLike}
                        />
                    ))}
                </div>
            </div>

            <RoadmapFormModal
                isOpen={isFormModalOpen}
                onClose={handleCloseFormModal}
                username={username}
                initialData={editingRoadmap}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                itemTitle={deletingRoadmap ? deletingRoadmap.title : ""}
                isProcessing={isDeleting}
            />

            {isDeleting && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="rounded-3xl border border-indigo-400/20 bg-gray-900/95 px-6 py-5 shadow-2xl">
                        <div className="flex items-center gap-3">
                            <i className="fa-solid fa-spinner fa-spin text-3xl text-indigo-400"></i>
                            <p className="font-black text-indigo-200">
                                O‘chirilmoqda...
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileRoadmap;