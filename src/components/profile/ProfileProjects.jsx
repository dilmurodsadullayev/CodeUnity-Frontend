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

import {
    getProjectFailure,
    getProjectStart,
    getProjectSuccess,
} from "../../features/projects";

import ProjectService from "../../services/project";

import CreateProjectModal from "../projects/CreateProjectModal";

import ProjectCard from "../projects/ProjectCard";

import {
    AlertTriangle,
    Eye,
    FolderKanban,
    MessageCircle,
    Plus,
    RefreshCcw,
    Search,
    Sparkles,
    Star,
} from "lucide-react";


// =========================================================
// SELECTOR
// =========================================================

const selectProjectState = (
    state
) => state.project;


// =========================================================
// PROJECT TITLE
// =========================================================

const getProjectTitle = (
    project
) => {
    return (
        project?.title
        ||
        project?.name
        ||
        "Noma’lum loyiha"
    );
};


// =========================================================
// PROJECT DESCRIPTION
// =========================================================

const getProjectDescription = (
    project
) => {
    return (
        project?.description
        ||
        project?.short_description
        ||
        "Bu loyiha uchun tavsif hali kiritilmagan."
    );
};


// =========================================================
// STACK NAMES
// =========================================================

const getStackNames = (
    items
) => {
    if (
        !Array.isArray(
            items
        )
    ) {
        return "";
    }

    return items
        .map(
            (item) =>
                item?.name
                ||
                item?.title
                ||
                ""
        )
        .filter(
            Boolean
        )
        .join(" ")
        .toLowerCase();
};


// =========================================================
// PROJECT SEARCH TEXT
// =========================================================

const getProjectSearchText = (
    project
) => {
    const title =
        getProjectTitle(
            project
        );

    const description =
        getProjectDescription(
            project
        );

    const primaryLanguage =
        project?.language_data?.name
        ||
        project?.language_data
        ||
        "";

    const primaryTechnology =
        project?.technology_data?.name
        ||
        project?.technology_data
        ||
        "";

    const languages =
        getStackNames(
            project?.languages_data
        );

    const technologies =
        getStackNames(
            project?.technologies_data
        );

    return [
        title,
        description,
        primaryLanguage,
        primaryTechnology,
        languages,
        technologies,
    ]
        .join(" ")
        .toLowerCase();
};


// =========================================================
// PROFILE PROJECTS
// =========================================================

const ProfileProjects = ({
    username,
}) => {

    const dispatch =
        useDispatch();


    // =====================================================
    // REDUX
    // =====================================================

    const {
        projects,
        project_isLoading,
        project_error,
    } = useSelector(
        selectProjectState
    );


    const {
        isLoggedIn,
        user,
    } = useSelector(
        (state) =>
            state.auth
    );


    // =====================================================
    // STATE
    // =====================================================

    const [
        isCreateModalOpen,
        setIsCreateModalOpen,
    ] = useState(false);


    const [
        search,
        setSearch,
    ] = useState("");


    const [
        createError,
        setCreateError,
    ] = useState(null);


    const [
        isSubmitting,
        setIsSubmitting,
    ] = useState(false);


    // =====================================================
    // SAFE PROJECTS
    // =====================================================

    const safeProjects =
        Array.isArray(
            projects
        )
            ? projects
            : [];


    // =====================================================
    // OWNER
    // =====================================================

    const isOwner =
        Boolean(
            isLoggedIn
            &&
            user?.username
            &&
            username
        )
        &&
        user.username.toLowerCase()
        ===
        username.toLowerCase();


    // =====================================================
    // GET PROJECTS
    // =====================================================

    const getProject =
        useCallback(
            async () => {

                if (!username) {
                    return;
                }


                dispatch(
                    getProjectStart()
                );


                setCreateError(
                    null
                );


                try {

                    const response =
                        await ProjectService
                            .getProjects(
                                username
                            );


                    dispatch(
                        getProjectSuccess(
                            response
                        )
                    );

                } catch (err) {

                    console.error(
                        "Project olishda xato:",
                        err
                    );


                    dispatch(
                        getProjectFailure(
                            err?.response
                                ?.data
                                ?.detail
                            ||
                            err?.message
                            ||
                            "Loyihalarni yuklashda xato yuz berdi."
                        )
                    );
                }

            },
            [
                dispatch,
                username,
            ]
        );


    // =====================================================
    // INITIAL FETCH
    // =====================================================

    useEffect(
        () => {

            getProject();

        },
        [
            getProject,
        ]
    );


    // =====================================================
    // OPEN CREATE MODAL
    // =====================================================

    const handleCreateProject =
        () => {

            setCreateError(
                null
            );

            setIsCreateModalOpen(
                true
            );
        };


    // =====================================================
    // CREATE PROJECT
    // =====================================================

    const handleProjectSubmit =
        async (
            formDataWithImages
        ) => {

            if (!isOwner) {
                return false;
            }


            setIsSubmitting(
                true
            );

            setCreateError(
                null
            );


            try {

                const response =
                    await ProjectService
                        .createProject(
                            formDataWithImages
                        );


                setIsCreateModalOpen(
                    false
                );


                await getProject();


                return (
                    response?.data
                    ||
                    response
                );

            } catch (err) {

                console.error(
                    "Yangi loyiha yaratishda xato:",
                    err
                );


                const responseData =
                    err?.response?.data;


                let message =
                    responseData?.detail
                    ||
                    responseData?.name?.[0]
                    ||
                    responseData?.title?.[0]
                    ||
                    responseData?.languages?.[0]
                    ||
                    responseData?.technologies?.[0]
                    ||
                    err?.message
                    ||
                    "Loyihani yaratishda kutilmagan xato.";


                if (
                    Array.isArray(
                        message
                    )
                ) {
                    message =
                        message[0];
                }


                if (
                    typeof message !==
                    "string"
                ) {
                    message =
                        JSON.stringify(
                            message
                        );
                }


                setCreateError(
                    message
                );


                throw new Error(
                    message
                );

            } finally {

                setIsSubmitting(
                    false
                );
            }
        };


    // =====================================================
    // FILTER PROJECTS
    //
    // Endi:
    //
    // name
    // description
    // primary language
    // primary technology
    // languages_data[]
    // technologies_data[]
    //
    // bo‘yicha qidiradi.
    // =====================================================

    const filteredProjects =
        useMemo(
            () => {

                const query =
                    search
                        .trim()
                        .toLowerCase();


                if (!query) {
                    return safeProjects;
                }


                return safeProjects.filter(
                    (
                        project
                    ) => {

                        const searchableText =
                            getProjectSearchText(
                                project
                            );


                        return (
                            searchableText.includes(
                                query
                            )
                        );
                    }
                );

            },
            [
                safeProjects,
                search,
            ]
        );


    // =====================================================
    // STATS
    // =====================================================

    const stats =
        useMemo(
            () => {

                return {

                    total:
                        safeProjects.length,


                    stars:
                        safeProjects.reduce(
                            (
                                sum,
                                project
                            ) =>
                                sum
                                +
                                Number(
                                    project?.stars_count
                                    ||
                                    0
                                ),
                            0
                        ),


                    views:
                        safeProjects.reduce(
                            (
                                sum,
                                project
                            ) =>
                                sum
                                +
                                Number(
                                    project?.views_count
                                    ||
                                    0
                                ),
                            0
                        ),


                    comments:
                        safeProjects.reduce(
                            (
                                sum,
                                project
                            ) =>
                                sum
                                +
                                Number(
                                    project?.comments_count
                                    ||
                                    0
                                ),
                            0
                        ),
                };

            },
            [
                safeProjects,
            ]
        );


    // =====================================================
    // LOADING
    // =====================================================

    if (
        project_isLoading
    ) {
        return (
            <ProjectsSkeleton />
        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (
        project_error
    ) {

        return (

            <div
                className="
                    rounded-3xl
                    border
                    border-red-500/30
                    bg-red-500/10
                    p-8
                    text-center
                    shadow-2xl
                    shadow-black/30
                "
            >

                <div
                    className="
                        mx-auto
                        mb-5
                        flex
                        h-20
                        w-20
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-red-400/25
                        bg-red-500/10
                        text-red-300
                    "
                >
                    <AlertTriangle
                        size={42}
                    />
                </div>


                <h3
                    className="
                        text-2xl
                        font-black
                        text-white
                    "
                >
                    Loyihalar yuklanmadi
                </h3>


                <p
                    className="
                        mx-auto
                        mt-3
                        max-w-xl
                        text-sm
                        font-semibold
                        leading-7
                        text-red-200/80
                    "
                >
                    {project_error}
                </p>


                <button
                    type="button"
                    onClick={
                        getProject
                    }
                    className="
                        mt-6
                        inline-flex
                        items-center
                        gap-2
                        rounded-2xl
                        border
                        border-red-400/40
                        bg-red-600
                        px-5
                        py-3
                        text-sm
                        font-black
                        text-white
                        transition

                        hover:bg-red-500
                        active:scale-95
                    "
                >
                    <RefreshCcw
                        size={17}
                    />

                    Qayta urinish
                </button>

            </div>
        );
    }


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div
            className="
                space-y-5
            "
        >

            {/* =================================================
                HEADER
            ================================================== */}

            <section
                className="
                    relative
                    overflow-hidden
                    rounded-3xl
                    border
                    border-gray-700/70
                    bg-gray-900/70
                    p-5
                    shadow-xl
                    shadow-black/30
                "
            >

                <div
                    className="
                        pointer-events-none
                        absolute
                        -right-24
                        -top-24
                        h-52
                        w-52
                        rounded-full
                        bg-indigo-500/10
                        blur-3xl
                    "
                />


                <div
                    className="
                        pointer-events-none
                        absolute
                        -bottom-24
                        -left-24
                        h-52
                        w-52
                        rounded-full
                        bg-purple-500/10
                        blur-3xl
                    "
                />


                <div
                    className="
                        relative
                        z-10
                        flex
                        flex-col
                        gap-5

                        lg:flex-row
                        lg:items-center
                        lg:justify-between
                    "
                >

                    <div>

                        <div
                            className="
                                mb-3
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                border
                                border-indigo-400/30
                                bg-indigo-500/10
                                px-3
                                py-1
                                text-[11px]
                                font-black
                                uppercase
                                tracking-wider
                                text-indigo-300
                            "
                        >
                            <Sparkles
                                size={14}
                            />

                            Profile Projects
                        </div>


                        <h3
                            className="
                                text-2xl
                                font-black
                                text-white
                            "
                        >
                            Loyihalar
                        </h3>


                        <p
                            className="
                                mt-1
                                text-sm
                                font-semibold
                                text-gray-500
                            "
                        >
                            Portfolio, real ishlar va community uchun yaratilgan loyihalar
                        </p>

                    </div>


                    <div
                        className="
                            flex
                            flex-col
                            gap-3

                            sm:flex-row
                            sm:items-center
                        "
                    >

                        {/* SEARCH */}

                        <div
                            className="
                                relative
                            "
                        >

                            <Search
                                size={17}
                                className="
                                    pointer-events-none
                                    absolute
                                    left-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-gray-500
                                "
                            />


                            <input
                                type="text"

                                value={
                                    search
                                }

                                onChange={
                                    (
                                        event
                                    ) =>
                                        setSearch(
                                            event.target.value
                                        )
                                }

                                placeholder="Loyiha qidirish..."

                                className="
                                    w-full
                                    rounded-2xl
                                    border
                                    border-gray-700
                                    bg-gray-950/60
                                    py-3
                                    pl-11
                                    pr-4
                                    text-sm
                                    font-semibold
                                    text-white
                                    outline-none
                                    transition

                                    placeholder:text-gray-600

                                    focus:border-indigo-500
                                    focus:ring-2
                                    focus:ring-indigo-500/20

                                    sm:w-64
                                "
                            />

                        </div>


                        {/* CREATE */}

                        {isOwner && (

                            <button
                                type="button"

                                onClick={
                                    handleCreateProject
                                }

                                className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-2xl
                                    border
                                    border-indigo-400/40
                                    bg-indigo-600
                                    px-5
                                    py-3
                                    text-sm
                                    font-black
                                    text-white
                                    shadow-lg
                                    shadow-indigo-600/20
                                    transition

                                    hover:bg-indigo-500
                                    active:scale-95
                                "
                            >
                                <Plus
                                    size={18}
                                />

                                Yangi loyiha
                            </button>
                        )}

                    </div>

                </div>

            </section>


            {/* =================================================
                CREATE ERROR
            ================================================== */}

            {createError && (

                <div
                    className="
                        rounded-2xl
                        border
                        border-red-500/30
                        bg-red-500/10
                        p-4
                        text-sm
                        font-semibold
                        text-red-300
                    "
                >

                    <AlertTriangle
                        size={17}
                        className="
                            mr-2
                            inline-block
                        "
                    />

                    Loyiha yaratishda xato:{" "}
                    {createError}

                </div>
            )}


            {/* =================================================
                STATS
            ================================================== */}

            {safeProjects.length > 0 && (

                <section
                    className="
                        grid
                        gap-3

                        sm:grid-cols-2
                        xl:grid-cols-4
                    "
                >

                    <MiniStat
                        icon={
                            FolderKanban
                        }
                        label="Jami loyihalar"
                        value={
                            stats.total
                        }
                        tone="indigo"
                    />


                    <MiniStat
                        icon={
                            Star
                        }
                        label="Starlar"
                        value={
                            stats.stars
                        }
                        tone="yellow"
                    />


                    <MiniStat
                        icon={
                            Eye
                        }
                        label="Ko‘rishlar"
                        value={
                            stats.views
                        }
                        tone="cyan"
                    />


                    <MiniStat
                        icon={
                            MessageCircle
                        }
                        label="Izohlar"
                        value={
                            stats.comments
                        }
                        tone="emerald"
                    />

                </section>
            )}


            {/* =================================================
                EMPTY
            ================================================== */}

            {safeProjects.length === 0 && (

                <EmptyProjects
                    isOwner={
                        isOwner
                    }

                    onCreate={
                        handleCreateProject
                    }

                    message={
                        isOwner

                            ? (
                                "Sizda hali hech qanday loyiha mavjud emas. "
                                +
                                "Birinchi loyihangizni yarating!"
                            )

                            : (
                                "Foydalanuvchida hali hech qanday loyiha mavjud emas."
                            )
                    }
                />
            )}


            {/* =================================================
                FILTER EMPTY
            ================================================== */}

            {safeProjects.length > 0
                &&
                filteredProjects.length === 0
                && (

                <div
                    className="
                        rounded-3xl
                        border
                        border-dashed
                        border-gray-700/70
                        bg-gray-900/50
                        p-8
                        text-center
                    "
                >

                    <Search
                        className="
                            mx-auto
                            mb-3
                            text-gray-600
                        "
                        size={42}
                    />


                    <h4
                        className="
                            text-xl
                            font-black
                            text-white
                        "
                    >
                        Qidiruv bo‘yicha loyiha topilmadi
                    </h4>


                    <p
                        className="
                            mt-2
                            text-sm
                            font-semibold
                            text-gray-500
                        "
                    >
                        Boshqa kalit so‘z bilan urinib ko‘ring.
                    </p>

                </div>
            )}


            {/* =================================================
                PROJECTS
            ================================================== */}

            {filteredProjects.length > 0 && (

                <div
                    id="projects"
                    className="
                        grid
                        gap-6

                        md:grid-cols-2
                    "
                >

                    {filteredProjects.map(
                        (
                            project,
                            index
                        ) => (

                            <ProjectCard
                                key={
                                    project.id
                                    ||
                                    index
                                }

                                project={
                                    project
                                }

                                index={
                                    index
                                }
                            />
                        )
                    )}

                </div>
            )}


            {/* =================================================
                CREATE MODAL
            ================================================== */}

            <CreateProjectModal

                isOpen={
                    isCreateModalOpen
                }

                onClose={() =>
                    setIsCreateModalOpen(
                        false
                    )
                }

                onSubmit={
                    handleProjectSubmit
                }

                isSubmitting={
                    isSubmitting
                }
            />

        </div>
    );
};


// =========================================================
// PROJECTS SKELETON
// =========================================================

const ProjectsSkeleton = () => {

    return (

        <div
            className="
                space-y-5
            "
        >

            <div
                className="
                    rounded-3xl
                    border
                    border-gray-700/70
                    bg-gray-900/70
                    p-5
                "
            >

                <div
                    className="
                        flex
                        flex-col
                        gap-4

                        lg:flex-row
                        lg:items-center
                        lg:justify-between
                    "
                >

                    <div
                        className="
                            space-y-3
                        "
                    >
                        <div
                            className="
                                h-5
                                w-36
                                animate-pulse
                                rounded-xl
                                bg-gray-800
                            "
                        />

                        <div
                            className="
                                h-8
                                w-56
                                animate-pulse
                                rounded-xl
                                bg-gray-800
                            "
                        />

                        <div
                            className="
                                h-4
                                w-80
                                max-w-full
                                animate-pulse
                                rounded-xl
                                bg-gray-800
                            "
                        />
                    </div>


                    <div
                        className="
                            h-12
                            w-40
                            animate-pulse
                            rounded-2xl
                            bg-gray-800
                        "
                    />

                </div>

            </div>


            <div
                className="
                    grid
                    gap-6

                    md:grid-cols-2
                "
            >

                {[
                    1,
                    2,
                ].map(
                    (
                        item
                    ) => (

                        <div
                            key={
                                item
                            }
                            className="
                                overflow-hidden
                                rounded-3xl
                                border
                                border-gray-700/70
                                bg-gray-900/60
                                shadow-xl
                                shadow-black/20
                            "
                        >

                            <div
                                className="
                                    h-48
                                    animate-pulse
                                    bg-gray-800
                                "
                            />


                            <div
                                className="
                                    space-y-4
                                    p-5
                                "
                            >

                                <div
                                    className="
                                        h-7
                                        w-3/4
                                        animate-pulse
                                        rounded-xl
                                        bg-gray-800
                                    "
                                />

                                <div
                                    className="
                                        h-4
                                        w-full
                                        animate-pulse
                                        rounded-xl
                                        bg-gray-800
                                    "
                                />

                                <div
                                    className="
                                        h-4
                                        w-5/6
                                        animate-pulse
                                        rounded-xl
                                        bg-gray-800
                                    "
                                />


                                <div
                                    className="
                                        flex
                                        gap-2
                                    "
                                >

                                    <div
                                        className="
                                            h-7
                                            w-20
                                            animate-pulse
                                            rounded-full
                                            bg-gray-800
                                        "
                                    />

                                    <div
                                        className="
                                            h-7
                                            w-24
                                            animate-pulse
                                            rounded-full
                                            bg-gray-800
                                        "
                                    />

                                </div>


                                <div
                                    className="
                                        h-12
                                        w-full
                                        animate-pulse
                                        rounded-2xl
                                        bg-gray-800
                                    "
                                />

                            </div>

                        </div>
                    )
                )}

            </div>

        </div>
    );
};


// =========================================================
// EMPTY PROJECTS
// =========================================================

const EmptyProjects = ({
    message,
    isOwner,
    onCreate,
}) => {

    return (

        <div
            className="
                relative
                overflow-hidden
                rounded-3xl
                border
                border-dashed
                border-gray-700/70
                bg-gray-900/60
                p-8
                text-center
                shadow-2xl
                shadow-black/30
            "
        >

            <div
                className="
                    pointer-events-none
                    absolute
                    -right-24
                    -top-24
                    h-52
                    w-52
                    rounded-full
                    bg-indigo-500/10
                    blur-3xl
                "
            />


            <div
                className="
                    pointer-events-none
                    absolute
                    -bottom-24
                    -left-24
                    h-52
                    w-52
                    rounded-full
                    bg-purple-500/10
                    blur-3xl
                "
            />


            <div
                className="
                    relative
                    z-10
                "
            >

                <div
                    className="
                        mx-auto
                        mb-5
                        flex
                        h-20
                        w-20
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-gray-700
                        bg-gray-950/70
                        text-gray-500
                    "
                >
                    <FolderKanban
                        size={42}
                    />
                </div>


                <h4
                    className="
                        text-2xl
                        font-black
                        text-white
                    "
                >
                    Loyihalar mavjud emas
                </h4>


                <p
                    className="
                        mx-auto
                        mt-2
                        max-w-xl
                        text-sm
                        font-semibold
                        leading-7
                        text-gray-500
                    "
                >
                    {message}
                </p>


                {isOwner && (

                    <button
                        type="button"
                        onClick={
                            onCreate
                        }
                        className="
                            mt-6
                            inline-flex
                            items-center
                            gap-2
                            rounded-2xl
                            border
                            border-indigo-400/40
                            bg-indigo-600
                            px-5
                            py-3
                            text-sm
                            font-black
                            text-white
                            shadow-lg
                            shadow-indigo-600/20
                            transition

                            hover:bg-indigo-500
                            active:scale-95
                        "
                    >
                        <Plus
                            size={18}
                        />

                        Yangi loyiha yaratish
                    </button>
                )}

            </div>

        </div>
    );
};


// =========================================================
// MINI STAT
// =========================================================

const MiniStat = ({
    icon: Icon,
    label,
    value,
    tone = "indigo",
}) => {

    const tones = {

        indigo:
            "border-indigo-400/20 bg-indigo-500/10 text-indigo-300",

        yellow:
            "border-yellow-400/20 bg-yellow-500/10 text-yellow-300",

        cyan:
            "border-cyan-400/20 bg-cyan-500/10 text-cyan-300",

        emerald:
            "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
    };


    return (

        <div
            className="
                rounded-3xl
                border
                border-gray-700/70
                bg-gray-900/60
                p-4
                shadow-xl
                shadow-black/20
            "
        >

            <div
                className="
                    flex
                    items-center
                    gap-4
                "
            >

                <div
                    className={`
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-2xl
                        border

                        ${
                            tones[
                                tone
                            ]
                            ||
                            tones.indigo
                        }
                    `}
                >
                    <Icon
                        size={22}
                    />
                </div>


                <div>

                    <p
                        className="
                            text-2xl
                            font-black
                            text-white
                        "
                    >
                        {Number(
                            value
                            ||
                            0
                        ).toLocaleString()}
                    </p>


                    <p
                        className="
                            text-xs
                            font-bold
                            uppercase
                            tracking-wider
                            text-gray-500
                        "
                    >
                        {label}
                    </p>

                </div>

            </div>

        </div>
    );
};


export default ProfileProjects;