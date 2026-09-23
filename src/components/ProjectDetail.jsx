import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
    getProjectDetailFailure,
    getProjectDetailStart,
    getProjectDetailSuccess,
} from "../features/projects";

import ProjectService from "../services/project";

import UserImage from "../assests/userImage.jpeg";

import ProjectDiscussion from "./ProjectDiscussion";
import ProjectCollaboration from "./ProjectCollaboration";
import ProjectLoadingSkeleton from "./ProjectLoadingSkeleton";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import ProjectFormModal from "./projects/CreateProjectModal";
import ProjectBoost from "./ProjectBoost";

import {
    AlertTriangle,
    Code2,
    Eye,
    ExternalLink,
    Github,
    ImageIcon,
    Loader2,
    MessageCircle,
    Pencil,
    Rocket,
    ShieldCheck,
    Sparkles,
    Star,
    Trash2,
    UserRound,
} from "lucide-react";

const selectProjectState = (state) => state.project;

const formatFeatureList = (featuresString) => {
    if (!featuresString) return [];

    return String(featuresString)
        .split(/,\s*|\n/)
        .map((item) => item.trim())
        .filter(Boolean);
};

const getImageUrl = (image) => {
    if (!image) return UserImage;
    if (typeof image === "string" && image.startsWith("http")) return image;
    return `${window.location.origin}${image}`;
};

const getProjectTitle = (project) => {
    return project?.name || project?.title || "Noma’lum loyiha";
};

const getAuthorName = (author) => {
    const fullName = `${author?.first_name || ""} ${author?.last_name || ""}`.trim();
    return fullName || author?.username || "Noma’lum user";
};

const StatPill = ({ icon: Icon, label, value, className = "" }) => {
    return (
        <div
            className={`inline-flex items-center gap-2 rounded-2xl border border-gray-700/70 bg-gray-900/70 px-4 py-2.5 text-sm font-bold text-gray-300 shadow-lg shadow-black/20 ${className}`}
        >
            <Icon size={17} />
            <span className="text-white">{value}</span>
            <span className="text-gray-500">{label}</span>
        </div>
    );
};

const TechBadge = ({ children, type = "indigo" }) => {
    const classes = {
        blue: "border-blue-400/30 bg-blue-500/10 text-blue-300",
        purple: "border-purple-400/30 bg-purple-500/10 text-purple-300",
        indigo: "border-indigo-400/30 bg-indigo-500/10 text-indigo-300",
    };

    return (
        <span
            className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-black ${classes[type]}`}
        >
            {children}
        </span>
    );
};

const ProjectDetail = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { isLoggedIn, user } = useSelector((state) => state.auth);

    const {
        projectDetail,
        projectDetailIsLoading,
        projectDetailError,
    } = useSelector(selectProjectState);

    const [activeIndex, setActiveIndex] = useState(0);
    const [isStarred, setIsStarred] = useState(false);
    const [isStarLoading, setIsStarLoading] = useState(false);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const projectData = projectDetail || {};
    const projectImages = Array.isArray(projectData?.images) ? projectData.images : [];
    const author = projectData?.user || {};
    const featuresList = useMemo(
        () => formatFeatureList(projectData?.main_features),
        [projectData?.main_features]
    );

    const projectTitle = getProjectTitle(projectData);
    const mainImage = getImageUrl(projectImages?.[activeIndex]?.image);
    const authorImage = getImageUrl(author?.image);

    const isOwner =
        Boolean(user?.id && author?.id) && Number(user.id) === Number(author.id);

    const starsCount = projectData?.stars_count || 0;
    const viewsCount = projectData?.views_count || 0;
    const commentsCount = projectData?.comments_count || 0;

    const getProjectDetail = useCallback(async () => {
        dispatch(getProjectDetailStart());

        try {
            const response = await ProjectService.projectDetail(projectId);

            dispatch(getProjectDetailSuccess(response));

            const responseImages = Array.isArray(response?.images)
                ? response.images
                : [];

            setActiveIndex((prev) =>
                responseImages.length > 0
                    ? Math.min(prev, responseImages.length - 1)
                    : 0
            );

            setIsStarred(Boolean(response?.is_starred_by_user));
        } catch (err) {
            console.error("ProjectDetail olishda xato:", err);
            dispatch(
                getProjectDetailFailure(
                    err?.message || "Loyihani yuklashda xato yuz berdi"
                )
            );
        }
    }, [projectId, dispatch]);

    useEffect(() => {
        getProjectDetail();
    }, [getProjectDetail]);

    useEffect(() => {
        setIsStarred(Boolean(projectDetail?.is_starred_by_user));
    }, [projectDetail?.is_starred_by_user]);

    const handleUpdateProject = async (formData, projectIdToUpdate) => {
        try {
            await ProjectService.updateProject(projectIdToUpdate, formData);
            setIsEditModalOpen(false);
            await getProjectDetail();
        } catch (error) {
            console.error("Loyihani tahrirlashda xato:", error);
            throw error;
        }
    };

    const handleConfirmDelete = async () => {
        if (!projectData?.id) return;

        setIsDeleting(true);

        try {
            await ProjectService.deleteProject(projectData.id);
            navigate(`/${user?.username}/profile/`);
        } catch (err) {
            console.error("Loyihani o'chirishda xato:", err);
            alert(
                "Loyihani o‘chirishda xato yuz berdi: " +
                    (err?.message || "Noma’lum xato")
            );
            setIsDeleteModalOpen(false);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleStarToggle = useCallback(async () => {
        if (!isLoggedIn) {
            alert("Loyihani yoqtirish uchun avval tizimga kiring!");
            return;
        }

        if (isStarLoading || !projectDetail?.id) return;

        setIsStarLoading(true);

        const oldIsStarred = Boolean(isStarred);
        const oldStarsCount = projectDetail?.stars_count || 0;

        const nextIsStarred = !oldIsStarred;
        const optimisticStarsCount = Math.max(
            0,
            nextIsStarred ? oldStarsCount + 1 : oldStarsCount - 1
        );

        setIsStarred(nextIsStarred);

        dispatch(
            getProjectDetailSuccess({
                ...projectDetail,
                stars_count: optimisticStarsCount,
                is_starred_by_user: nextIsStarred,
            })
        );

        try {
            const response = await ProjectService.toggleProjectStar(projectId);

            const backendIsStarred = Boolean(response?.is_starred_by_user);
            const backendStarsCount =
                typeof response?.stars_count === "number"
                    ? response.stars_count
                    : optimisticStarsCount;

            setIsStarred(backendIsStarred);

            dispatch(
                getProjectDetailSuccess({
                    ...projectDetail,
                    stars_count: backendStarsCount,
                    is_starred_by_user: backendIsStarred,
                })
            );
        } catch (error) {
            console.error("Star/Unstar qilishda xato:", error);

            setIsStarred(oldIsStarred);

            dispatch(
                getProjectDetailSuccess({
                    ...projectDetail,
                    stars_count: oldStarsCount,
                    is_starred_by_user: oldIsStarred,
                })
            );

            alert("Star amalida xato yuz berdi. Qayta urinib ko‘ring.");
        } finally {
            setIsStarLoading(false);
        }
    }, [
        isLoggedIn,
        isStarLoading,
        isStarred,
        projectDetail,
        projectId,
        dispatch,
    ]);

    if (projectDetailIsLoading) {
        return <ProjectLoadingSkeleton />;
    }

    if (projectDetailError || !projectData?.id) {
        return (
            <div className="min-h-screen bg-[#05070a] px-4 pt-40 text-white">
                <div className="mx-auto max-w-xl rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center shadow-2xl shadow-black/30">
                    <AlertTriangle className="mx-auto mb-4 text-red-300" size={52} />

                    <h1 className="text-2xl font-black text-white">
                        Loyiha topilmadi yoki xato yuz berdi
                    </h1>

                    <p className="mt-3 text-sm font-semibold text-gray-400">
                        Loyiha ID: {projectId}
                    </p>

                    {projectDetailError && (
                        <p className="mt-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                            {projectDetailError}
                        </p>
                    )}

                    <button
                        type="button"
                        onClick={getProjectDetail}
                        className="mt-6 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-500"
                    >
                        Qayta urinish
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#05070a] text-white">
            {/* Background */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.06)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_74%)]" />
            <div className="pointer-events-none absolute left-1/2 top-24 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-indigo-600/15 blur-[120px]" />
            <div className="pointer-events-none absolute -right-32 top-1/3 h-[360px] w-[360px] rounded-full bg-purple-500/10 blur-[115px]" />
            <div className="pointer-events-none absolute -left-32 bottom-32 h-[360px] w-[360px] rounded-full bg-pink-500/10 blur-[115px]" />

            <main className="container relative z-10 mx-auto px-4 py-24">
                <div className="overflow-hidden rounded-[34px] border border-gray-700/70 bg-gray-900/65 shadow-2xl shadow-black/40 backdrop-blur-xl">
                    {/* Header */}
                    <header className="border-b border-gray-700/70 p-5 sm:p-8 lg:p-10">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                            <div className="min-w-0 flex-1">
                                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-indigo-300">
                                    <Rocket size={16} />
                                    Project showcase
                                </div>

                                <h1 className="max-w-5xl bg-gradient-to-r from-indigo-300 via-purple-400 to-pink-400 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-5xl lg:text-6xl">
                                    {projectTitle}
                                </h1>

                                <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-gray-400 sm:text-base">
                                    {projectData?.description ||
                                        "Ushbu loyiha uchun hali to‘liq tavsif kiritilmagan."}
                                </p>
                            </div>

                            {isOwner && (
                                <div className="flex shrink-0 flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditModalOpen(true)}
                                        className="inline-flex items-center gap-2 rounded-2xl border border-indigo-400/40 bg-indigo-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 active:scale-95"
                                    >
                                        <Pencil size={17} />
                                        <span className="hidden sm:inline">Tahrirlash</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setIsDeleteModalOpen(true)}
                                        className="inline-flex items-center gap-2 rounded-2xl border border-red-400/40 bg-red-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-red-600/20 transition hover:bg-red-500 active:scale-95"
                                    >
                                        <Trash2 size={17} />
                                        <span className="hidden sm:inline">O‘chirish</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Stats and star */}
                        <div className="mt-7 flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                onClick={handleStarToggle}
                                disabled={isStarLoading}
                                className={`group relative inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-black transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 ${
                                    isStarred
                                        ? "border-yellow-400/40 bg-yellow-500/15 text-yellow-200 shadow-lg shadow-yellow-500/20"
                                        : "border-gray-700 bg-gray-900/70 text-gray-300 hover:border-yellow-400/30 hover:bg-yellow-500/10 hover:text-yellow-200"
                                }`}
                                title={
                                    isStarred
                                        ? "Star bosilgan. Bekor qilish uchun bosing"
                                        : "Loyihaga star berish"
                                }
                            >
                                {isStarLoading ? (
                                    <Loader2 size={19} className="animate-spin" />
                                ) : (
                                    <Star
                                        size={20}
                                        className={
                                            isStarred
                                                ? "fill-yellow-300 text-yellow-300"
                                                : "text-yellow-400"
                                        }
                                    />
                                )}

                                <span>
                                    {isStarred ? "Star bosilgan" : "Star berish"}
                                </span>

                                {isStarred && (
                                    <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-yellow-300 shadow-[0_0_14px_rgba(250,204,21,0.9)]" />
                                )}
                            </button>

                            <StatPill
                                icon={Star}
                                value={starsCount.toLocaleString()}
                                label="star"
                                className="text-yellow-300"
                            />

                            <StatPill
                                icon={Eye}
                                value={viewsCount.toLocaleString()}
                                label="ko‘rish"
                            />

                            <StatPill
                                icon={MessageCircle}
                                value={commentsCount.toLocaleString()}
                                label="sharh"
                            />
                        </div>

                        {/* Gallery */}
                        <div className="mt-8">
                            <div className="relative overflow-hidden rounded-[28px] border border-gray-700/70 bg-black/30 shadow-2xl shadow-black/40">
                                <div className="aspect-video">
                                    {projectImages.length > 0 ? (
                                        projectImages.map((img, index) => (
                                            <img
                                                key={img?.id || index}
                                                src={getImageUrl(img?.image)}
                                                className={`absolute inset-0 h-full w-full object-contain transition-all duration-500 ${
                                                    activeIndex === index
                                                        ? "scale-100 opacity-100"
                                                        : "scale-95 opacity-0"
                                                }`}
                                                alt={
                                                    img?.title ||
                                                    `Project Screenshot ${index + 1}`
                                                }
                                            />
                                        ))
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-gray-950/70">
                                            <div className="text-center">
                                                <ImageIcon
                                                    className="mx-auto mb-3 text-gray-700"
                                                    size={72}
                                                />
                                                <p className="font-bold text-gray-600">
                                                    Rasm mavjud emas
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {projectImages.length > 1 && (
                                <div className="mt-4 flex flex-wrap justify-center gap-2">
                                    {projectImages.map((img, index) => (
                                        <button
                                            key={img?.id || index}
                                            type="button"
                                            onClick={() => setActiveIndex(index)}
                                            className={`h-16 w-24 overflow-hidden rounded-2xl border transition-all ${
                                                activeIndex === index
                                                    ? "border-indigo-400 ring-2 ring-indigo-500/30"
                                                    : "border-gray-700 opacity-60 hover:opacity-100"
                                            }`}
                                        >
                                            <img
                                                src={getImageUrl(img?.image)}
                                                alt=""
                                                className="h-full w-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </header>

                    <div className="grid lg:grid-cols-[1fr_380px]">
                        {/* Main content */}
                        <section className="border-gray-700/70 lg:border-r">
                            <article className="p-5 sm:p-8 lg:p-10">
                                <div className="rounded-3xl border border-indigo-400/20 bg-indigo-500/10 p-5 text-sm font-medium leading-7 text-indigo-100 sm:text-base">
                                    {projectData?.description ||
                                        "Ushbu loyiha uchun hali to‘liq tavsif kiritilmagan."}
                                </div>

                                <div className="mt-8">
                                    <h2 className="mb-4 flex items-center gap-3 text-2xl font-black text-white">
                                        <Sparkles className="text-indigo-300" size={26} />
                                        Loyiha haqida
                                    </h2>

                                    <p className="text-sm font-medium leading-8 text-gray-400 sm:text-base">
                                        {projectData?.description ||
                                            "Loyiha haqida to‘liqroq ma’lumotlar tez orada kiritiladi."}
                                    </p>
                                </div>

                                {featuresList.length > 0 && (
                                    <div className="mt-8">
                                        <h3 className="mb-4 flex items-center gap-3 text-xl font-black text-white">
                                            <ShieldCheck
                                                className="text-emerald-300"
                                                size={23}
                                            />
                                            Asosiy imkoniyatlar
                                        </h3>

                                        <div className="grid gap-3 sm:grid-cols-2">
                                            {featuresList.map((feature, index) => (
                                                <div
                                                    key={index}
                                                    className="rounded-2xl border border-gray-700/70 bg-gray-950/35 p-4 text-sm font-semibold leading-6 text-gray-300 transition hover:border-indigo-400/30 hover:bg-gray-900"
                                                >
                                                    <span className="mr-2 text-indigo-300">
                                                        #{index + 1}
                                                    </span>
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </article>

                            <ProjectCollaboration
                                currentCollaborators={projectDetail.collaborations}
                                pendingRequests={[]}
                                projectOwner={author}
                                isOwner={isOwner}
                                isCollaborator={false}
                                hasSentRequest={false}
                                projectId={projectId}
                            />
                        </section>

                        {/* Sidebar */}
                        <aside className="p-5 sm:p-8 lg:p-8">
                            <div className="space-y-6 lg:sticky lg:top-24">
                                {isOwner && (
                                    <ProjectBoost
                                        projectId={projectData.id}
                                        projectName={projectTitle}
                                        userCoins={user?.coins || 0}
                                    />
                                )}

                                <div className="rounded-3xl border border-gray-700/70 bg-gray-950/35 p-5 shadow-xl shadow-black/20">
                                    <h3 className="mb-4 flex items-center gap-3 text-lg font-black text-white">
                                        <UserRound className="text-indigo-300" size={21} />
                                        Muallif
                                    </h3>

                                    <Link
                                        to={`/${author?.username}/profile/`}
                                        className="flex items-center gap-4 rounded-2xl border border-gray-700/70 bg-gray-900/60 p-4 transition hover:border-indigo-400/40 hover:bg-gray-800/70"
                                    >
                                        <img
                                            src={authorImage}
                                            className="h-14 w-14 rounded-full border-2 border-gray-700 object-cover"
                                            alt={author?.username}
                                        />

                                        <div className="min-w-0">
                                            <p className="truncate font-black text-white">
                                                {getAuthorName(author)}
                                            </p>
                                            <p className="mt-1 text-xs font-bold text-gray-500">
                                                @{author?.username || "unknown"}
                                            </p>
                                            <p className="mt-1 text-xs font-bold text-indigo-300">
                                                Daraja:{" "}
                                                {author?.skill_level || "Aniqlanmagan"}
                                            </p>
                                        </div>
                                    </Link>
                                </div>

                                <div className="rounded-3xl border border-gray-700/70 bg-gray-950/35 p-5 shadow-xl shadow-black/20">
                                    <h3 className="mb-4 flex items-center gap-3 text-lg font-black text-white">
                                        <Code2 className="text-purple-300" size={21} />
                                        Texnologiyalar
                                    </h3>

                                    <div className="flex flex-wrap gap-2">
                                        {projectData?.language_data && (
                                            <TechBadge type="blue">
                                                {projectData.language_data.name}
                                            </TechBadge>
                                        )}

                                        {projectData?.technology_data && (
                                            <TechBadge type="purple">
                                                {projectData.technology_data.name}
                                            </TechBadge>
                                        )}

                                        {!projectData?.language_data &&
                                            !projectData?.technology_data && (
                                                <p className="text-sm font-semibold text-gray-500">
                                                    Texnologiyalar hali kiritilmagan.
                                                </p>
                                            )}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {projectData?.github_url && (
                                        <a
                                            href={projectData.github_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-700 bg-gray-900/80 px-5 py-3 text-sm font-black text-white transition hover:border-gray-500 hover:bg-gray-800"
                                        >
                                            <Github size={18} />
                                            GitHub
                                        </a>
                                    )}

                                    {projectData?.website_url && (
                                        <a
                                            href={projectData.website_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-indigo-400/40 bg-indigo-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
                                        >
                                            <ExternalLink size={18} />
                                            Live Demo
                                        </a>
                                    )}
                                </div>
                            </div>
                        </aside>
                    </div>

                    <ProjectDiscussion projectId={projectId} />
                </div>
            </main>

            {isOwner && (
                <ProjectFormModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSubmit={handleUpdateProject}
                    initialData={projectData}
                />
            )}

            {isOwner && (
                <DeleteConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleConfirmDelete}
                    itemTitle={projectTitle}
                    isProcessing={isDeleting}
                />
            )}
        </div>
    );
};

export default ProjectDetail;