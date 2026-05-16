import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
    getProjectFailure,
    getProjectStart,
    getProjectSuccess,
} from "../../features/projects";

import ProjectService from "../../services/project";
import { getTechnologyColor } from "../../utils/colorUtils";

import CreateProjectModal from "./CreateProjectModal";

import {
    AlertTriangle,
    Code2,
    Eye,
    FolderKanban,
    GitFork,
    ImageIcon,
    Loader2,
    MessageCircle,
    Plus,
    RefreshCcw,
    Rocket,
    Search,
    Sparkles,
    Star,
} from "lucide-react";

const selectProjectState = (state) => state.project;

const DEFAULT_PROJECT_IMAGE =
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1600&auto=format&fit=crop";

const getProjectTitle = (project) => {
    return project?.title || project?.name || "Noma’lum loyiha";
};

const getProjectDescription = (project) => {
    return (
        project?.description ||
        project?.short_description ||
        "Bu loyiha uchun tavsif hali kiritilmagan."
    );
};

const getProjectImage = (project) => {
    const image = project?.images?.[0]?.image || project?.image;

    if (!image) return DEFAULT_PROJECT_IMAGE;
    if (typeof image === "string" && image.startsWith("http")) return image;

    return `${window.location.origin}${image}`;
};

const normalizeTechnology = (technology) => {
    if (!technology) return null;

    if (typeof technology === "string") {
        return {
            name: technology,
            colorTarget: technology,
        };
    }

    return {
        name: technology?.name || technology?.title || "Noma’lum",
        colorTarget: technology,
    };
};

const truncateText = (text, max = 155) => {
    const value = String(text || "").trim();

    if (!value) return "Bu loyiha uchun tavsif hali kiritilmagan.";
    if (value.length <= max) return value;

    return `${value.slice(0, max).trim()}...`;
};

const ProfileProjects = ({ username }) => {
    const dispatch = useDispatch();

    const { projects, project_isLoading, project_error } =
        useSelector(selectProjectState);

    const { isLoggedIn, user } = useSelector((state) => state.auth);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [createError, setCreateError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const safeProjects = Array.isArray(projects) ? projects : [];

    const isOwner =
        Boolean(isLoggedIn && user?.username && username) &&
        user.username.toLowerCase() === username.toLowerCase();

    const getProject = useCallback(async () => {
        if (!username) return;

        dispatch(getProjectStart());
        setCreateError(null);

        try {
            const response = await ProjectService.getProjects(username);
            dispatch(getProjectSuccess(response));
        } catch (err) {
            console.error("Project olishda xato:", err);

            dispatch(
                getProjectFailure(
                    err?.response?.data?.detail ||
                        err?.message ||
                        "Loyihalarni yuklashda xato yuz berdi."
                )
            );
        }
    }, [dispatch, username]);

    useEffect(() => {
        getProject();
    }, [getProject]);

    const handleCreateProject = () => {
        setCreateError(null);
        setIsCreateModalOpen(true);
    };

    const handleProjectSubmit = async (formDataWithImages) => {
        if (!isOwner) return false;

        setIsSubmitting(true);
        setCreateError(null);

        try {
            const response = await ProjectService.createProject(formDataWithImages);

            setIsCreateModalOpen(false);
            await getProject();

            return response?.data || response;
        } catch (err) {
            console.error("Yangi loyiha yaratishda xato:", err);

            const message =
                err?.response?.data?.detail ||
                err?.response?.data?.name?.[0] ||
                err?.response?.data?.title?.[0] ||
                err?.message ||
                "Loyihani yaratishda kutilmagan xato.";

            setCreateError(message);
            throw new Error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredProjects = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) return safeProjects;

        return safeProjects.filter((project) => {
            const title = getProjectTitle(project).toLowerCase();
            const description = getProjectDescription(project).toLowerCase();
            const language = String(
                project?.language_data?.name || project?.language_data || ""
            ).toLowerCase();
            const technology = String(
                project?.technology_data?.name || project?.technology_data || ""
            ).toLowerCase();

            return (
                title.includes(query) ||
                description.includes(query) ||
                language.includes(query) ||
                technology.includes(query)
            );
        });
    }, [safeProjects, search]);

    const stats = useMemo(() => {
        return {
            total: safeProjects.length,
            stars: safeProjects.reduce(
                (sum, project) => sum + Number(project?.stars_count || 0),
                0
            ),
            views: safeProjects.reduce(
                (sum, project) => sum + Number(project?.views_count || 0),
                0
            ),
            comments: safeProjects.reduce(
                (sum, project) => sum + Number(project?.comments_count || 0),
                0
            ),
        };
    }, [safeProjects]);

    if (project_isLoading) {
        return <ProjectsSkeleton />;
    }

    if (project_error) {
        return (
            <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center shadow-2xl shadow-black/30">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-red-400/25 bg-red-500/10 text-red-300">
                    <AlertTriangle size={42} />
                </div>

                <h3 className="text-2xl font-black text-white">
                    Loyihalar yuklanmadi
                </h3>

                <p className="mx-auto mt-3 max-w-xl text-sm font-semibold leading-7 text-red-200/80">
                    {project_error}
                </p>

                <button
                    type="button"
                    onClick={getProject}
                    className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-red-400/40 bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-500 active:scale-95"
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
                <div className="pointer-events-none absolute -bottom-24 -left-24 h-52 w-52 rounded-full bg-purple-500/10 blur-3xl" />

                <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-indigo-300">
                            <Sparkles size={14} />
                            Profile Projects
                        </div>

                        <h3 className="text-2xl font-black text-white">
                            Loyihalar
                        </h3>

                        <p className="mt-1 text-sm font-semibold text-gray-500">
                            Portfolio, real ishlar va community uchun yaratilgan loyihalar
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
                                placeholder="Loyiha qidirish..."
                                className="w-full rounded-2xl border border-gray-700 bg-gray-950/60 py-3 pl-11 pr-4 text-sm font-semibold text-white outline-none transition placeholder:text-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 sm:w-64"
                            />
                        </div>

                        {isOwner && (
                            <button
                                type="button"
                                onClick={handleCreateProject}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-indigo-400/40 bg-indigo-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 active:scale-95"
                            >
                                <Plus size={18} />
                                Yangi loyiha
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* CREATE ERROR */}
            {createError && (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-semibold text-red-300">
                    <AlertTriangle size={17} className="mr-2 inline-block" />
                    Loyiha yaratishda xato: {createError}
                </div>
            )}

            {/* STATS */}
            {safeProjects.length > 0 && (
                <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <MiniStat
                        icon={FolderKanban}
                        label="Jami loyihalar"
                        value={stats.total}
                        tone="indigo"
                    />

                    <MiniStat
                        icon={Star}
                        label="Starlar"
                        value={stats.stars}
                        tone="yellow"
                    />

                    <MiniStat
                        icon={Eye}
                        label="Ko‘rishlar"
                        value={stats.views}
                        tone="cyan"
                    />

                    <MiniStat
                        icon={MessageCircle}
                        label="Izohlar"
                        value={stats.comments}
                        tone="emerald"
                    />
                </section>
            )}

            {/* EMPTY */}
            {safeProjects.length === 0 && (
                <EmptyProjects
                    isOwner={isOwner}
                    onCreate={handleCreateProject}
                    message={
                        isOwner
                            ? "Sizda hali hech qanday loyiha mavjud emas. Birinchi loyihangizni yarating!"
                            : "Foydalanuvchida hali hech qanday loyiha mavjud emas."
                    }
                />
            )}

            {/* FILTER EMPTY */}
            {safeProjects.length > 0 && filteredProjects.length === 0 && (
                <div className="rounded-3xl border border-dashed border-gray-700/70 bg-gray-900/50 p-8 text-center">
                    <Search className="mx-auto mb-3 text-gray-600" size={42} />

                    <h4 className="text-xl font-black text-white">
                        Qidiruv bo‘yicha loyiha topilmadi
                    </h4>

                    <p className="mt-2 text-sm font-semibold text-gray-500">
                        Boshqa kalit so‘z bilan urinib ko‘ring.
                    </p>
                </div>
            )}

            {/* PROJECTS */}
            {filteredProjects.length > 0 && (
                <div id="projects" className="grid gap-6 md:grid-cols-2">
                    {filteredProjects.map((project, index) => (
                        <ProjectCard
                            key={project.id || index}
                            project={project}
                            index={index}
                        />
                    ))}
                </div>
            )}

            <CreateProjectModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleProjectSubmit}
                isSubmitting={isSubmitting}
            />
        </div>
    );
};

const ProjectsSkeleton = () => {
    return (
        <div className="space-y-5">
            <div className="rounded-3xl border border-gray-700/70 bg-gray-900/70 p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-3">
                        <div className="h-5 w-36 animate-pulse rounded-xl bg-gray-800" />
                        <div className="h-8 w-56 animate-pulse rounded-xl bg-gray-800" />
                        <div className="h-4 w-80 max-w-full animate-pulse rounded-xl bg-gray-800" />
                    </div>

                    <div className="h-12 w-40 animate-pulse rounded-2xl bg-gray-800" />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {[1, 2].map((item) => (
                    <div
                        key={item}
                        className="overflow-hidden rounded-3xl border border-gray-700/70 bg-gray-900/60 shadow-xl shadow-black/20"
                    >
                        <div className="h-48 animate-pulse bg-gray-800" />

                        <div className="space-y-4 p-5">
                            <div className="h-7 w-3/4 animate-pulse rounded-xl bg-gray-800" />
                            <div className="h-4 w-full animate-pulse rounded-xl bg-gray-800" />
                            <div className="h-4 w-5/6 animate-pulse rounded-xl bg-gray-800" />

                            <div className="flex gap-2">
                                <div className="h-7 w-20 animate-pulse rounded-full bg-gray-800" />
                                <div className="h-7 w-24 animate-pulse rounded-full bg-gray-800" />
                            </div>

                            <div className="h-12 w-full animate-pulse rounded-2xl bg-gray-800" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const EmptyProjects = ({ message, isOwner, onCreate }) => {
    return (
        <div className="relative overflow-hidden rounded-3xl border border-dashed border-gray-700/70 bg-gray-900/60 p-8 text-center shadow-2xl shadow-black/30">
            <div className="pointer-events-none absolute -right-24 -top-24 h-52 w-52 rounded-full bg-indigo-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-52 w-52 rounded-full bg-purple-500/10 blur-3xl" />

            <div className="relative z-10">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-gray-700 bg-gray-950/70 text-gray-500">
                    <FolderKanban size={42} />
                </div>

                <h4 className="text-2xl font-black text-white">
                    Loyihalar mavjud emas
                </h4>

                <p className="mx-auto mt-2 max-w-xl text-sm font-semibold leading-7 text-gray-500">
                    {message}
                </p>

                {isOwner && (
                    <button
                        type="button"
                        onClick={onCreate}
                        className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-indigo-400/40 bg-indigo-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 active:scale-95"
                    >
                        <Plus size={18} />
                        Yangi loyiha yaratish
                    </button>
                )}
            </div>
        </div>
    );
};

const MiniStat = ({ icon: Icon, label, value, tone = "indigo" }) => {
    const tones = {
        indigo: "border-indigo-400/20 bg-indigo-500/10 text-indigo-300",
        yellow: "border-yellow-400/20 bg-yellow-500/10 text-yellow-300",
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

const ProjectCard = ({ project, index }) => {
    const title = getProjectTitle(project);
    const description = truncateText(getProjectDescription(project));
    const projectImage = getProjectImage(project);

    const language = normalizeTechnology(project?.language_data);
    const technology = normalizeTechnology(project?.technology_data);

    return (
        <article
            className="group relative overflow-hidden rounded-3xl border border-gray-700/70 bg-gray-900/70 shadow-xl shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/40 hover:bg-gray-900/90 hover:shadow-indigo-500/10"
            style={{ animationDelay: `${index * 80}ms` }}
        >
            <div className="relative h-52 overflow-hidden bg-gray-950">
                <img
                    src={projectImage}
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                        e.currentTarget.src = DEFAULT_PROJECT_IMAGE;
                    }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-black/20 to-transparent" />

                <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/45 px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-white backdrop-blur-md">
                    <Rocket size={14} />
                    Project
                </div>

                <div className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/20 text-indigo-200 backdrop-blur-md">
                    <Code2 size={21} />
                </div>
            </div>

            <div className="relative p-5">
                <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-indigo-500/10 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative z-10">
                    <h4 className="line-clamp-2 text-xl font-black leading-tight text-white transition-colors group-hover:text-indigo-300">
                        {title}
                    </h4>

                    <p className="mt-3 line-clamp-3 text-sm font-medium leading-7 text-gray-400">
                        {description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {language && (
                            <span
                                className={`${getTechnologyColor(
                                    language.colorTarget
                                )} rounded-full px-3 py-1.5 text-xs font-black`}
                            >
                                {language.name}
                            </span>
                        )}

                        {technology && (
                            <span
                                className={`${getTechnologyColor(
                                    technology.colorTarget
                                )} rounded-full px-3 py-1.5 text-xs font-black`}
                            >
                                {technology.name}
                            </span>
                        )}

                        {!language && !technology && (
                            <span className="rounded-full border border-gray-700 bg-gray-950/50 px-3 py-1.5 text-xs font-black text-gray-500">
                                Texnologiyalar kiritilmagan
                            </span>
                        )}
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-gray-700/70 pt-4">
                        <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-gray-400">
                            <span
                                className="inline-flex items-center gap-1.5 text-yellow-300"
                                title="Yulduzlar"
                            >
                                <Star size={16} className="fill-yellow-400/20" />
                                {(project?.stars_count || 0).toLocaleString()}
                            </span>

                            <span
                                className="inline-flex items-center gap-1.5 text-purple-300"
                                title="Collaborations"
                            >
                                <GitFork size={16} />
                                {(project?.collaborations_count || 0).toLocaleString()}
                            </span>

                            <span
                                className="inline-flex items-center gap-1.5 text-emerald-300"
                                title="Izohlar"
                            >
                                <MessageCircle size={16} />
                                {(project?.comments_count || 0).toLocaleString()}
                            </span>

                            <span
                                className="inline-flex items-center gap-1.5 text-cyan-300"
                                title="Ko‘rishlar"
                            >
                                <Eye size={16} />
                                {(project?.views_count || 0).toLocaleString()}
                            </span>
                        </div>

                        <Link
                            to={`/project/${project.id}/detail`}
                            className="inline-flex items-center gap-2 rounded-2xl border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-xs font-black text-indigo-300 transition hover:bg-indigo-500/20"
                        >
                            Batafsil
                            <i className="fa-solid fa-arrow-right transition-transform group-hover:translate-x-1"></i>
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default ProfileProjects;