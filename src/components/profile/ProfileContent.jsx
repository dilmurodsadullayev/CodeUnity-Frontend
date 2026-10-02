// src/components/profile/ProfileContent.jsx

import React from "react";

import ProfilePosts from "./ProfilePosts";
import ProfileProjects from "./ProfileProjects";
import ProfileRoadmap from "./ProfileRoadmap";


// =========================================================
// TAB
// =========================================================

const TabButton = ({
    active,
    children,
    onClick,
}) => {
    return (
        <button
            type="button"
            onClick={
                onClick
            }
            className={`
                whitespace-nowrap

                border-b-2

                px-5
                py-4

                text-sm
                font-black

                transition-all

                ${
                    active
                        ? "border-indigo-400 text-white"
                        : "border-transparent text-gray-400 hover:text-white"
                }
            `}
        >
            {children}
        </button>
    );
};


// =========================================================
// CONTENT
// =========================================================

const ProfileContent = ({
    username,
    activeTab,
    onTabChange,
}) => {
    return (
        <section
            className="
                min-w-0
            "
        >
            {/* =============================================
                TABS
            ============================================== */}

            <div
                className="
                    mb-5

                    flex
                    flex-col

                    gap-4

                    border-b
                    border-gray-700/70

                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >
                <div
                    className="
                        flex
                        min-w-0

                        overflow-x-auto
                    "
                >
                    <TabButton
                        active={
                            activeTab ===
                            "projects"
                        }
                        onClick={
                            () => (
                                onTabChange(
                                    "projects"
                                )
                            )
                        }
                    >
                        Loyihalar
                    </TabButton>


                    <TabButton
                        active={
                            activeTab ===
                            "posts"
                        }
                        onClick={
                            () => (
                                onTabChange(
                                    "posts"
                                )
                            )
                        }
                    >
                        Postlar / Javoblar
                    </TabButton>


                    <TabButton
                        active={
                            activeTab ===
                            "roadmap"
                        }
                        onClick={
                            () => (
                                onTabChange(
                                    "roadmap"
                                )
                            )
                        }
                    >
                        Yo‘l xaritasi
                    </TabButton>
                </div>
            </div>


            {/* =============================================
                CONTENT
            ============================================== */}

            <div
                className="
                    space-y-4
                "
            >
                {
                    activeTab ===
                    "projects"
                    &&
                    (
                        <ProfileProjects
                            username={
                                username
                            }
                        />
                    )
                }


                {
                    activeTab ===
                    "posts"
                    &&
                    (
                        <ProfilePosts
                            username={
                                username
                            }
                        />
                    )
                }


                {
                    activeTab ===
                    "roadmap"
                    &&
                    (
                        <ProfileRoadmap
                            username={
                                username
                            }
                        />
                    )
                }
            </div>
        </section>
    );
};


export default ProfileContent;