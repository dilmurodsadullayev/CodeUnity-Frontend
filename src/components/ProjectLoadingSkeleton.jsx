// ProjectLoadingSkeleton.jsx
import React from 'react';

const ProjectLoadingSkeleton = ({ styleTag }) => (
    <div className="project-body animate-pulse">
        {styleTag}
        <div className="atmospheric-bg bg-gray-900/50"></div>

        <main className="container mx-auto px-4">
            <div className="main-content-wrapper rounded-xl shadow-2xl mb-16">
                
                {/* Header Skeleton */}
                <header className="p-6 md:p-10 border-b border-gray-700/50">
                    <div className="h-10 bg-gray-700 rounded w-1/2 mb-4"></div>
                    <div className="flex flex-wrap gap-x-6 gap-y-3 mt-4">
                        <div className="h-6 bg-gray-700 rounded w-32"></div>
                        <div className="h-6 bg-gray-700 rounded w-24"></div>
                    </div>
                    {/* Image Placeholder */}
                    <div className="mt-8 aspect-video bg-gray-700/80 rounded-lg"></div>
                </header>

                <div className="flex flex-col lg:flex-row">
                    <div className="w-full lg:w-2/3 border-r-0 lg:border-r border-gray-700/50">
                        {/* Description Skeleton */}
                        <article className="p-6 md:p-10">
                            <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                            <div className="h-4 bg-gray-700 rounded w-11/12 mb-2"></div>
                            <div className="h-4 bg-gray-700 rounded w-5/6 mb-6"></div>
                            <div className="h-6 bg-gray-700 rounded w-1/3 mb-4 mt-8"></div>
                            <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                            <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                        </article>

                        {/* Team Skeleton */}
                        <section className="p-6 md:p-10 border-t border-gray-700/50">
                            <div className="h-6 bg-gray-700 rounded w-1/4 mb-6"></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2].map(i => (
                                    <div key={i} className="flex items-center gap-3 bg-gray-800/50 p-4 rounded-lg">
                                        <div className="w-12 h-12 rounded-full bg-gray-700"></div>
                                        <div>
                                            <div className="h-4 bg-gray-700 rounded w-24 mb-1"></div>
                                            <div className="h-3 bg-gray-700 rounded w-16"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Skeleton */}
                    <aside className="w-full lg:w-1/3 p-6 md:p-10">
                        <div className="sticky-sidebar space-y-8">
                            <div className="h-8 bg-gray-700 rounded w-1/2"></div>
                            <div className="h-12 bg-gray-700 rounded w-full"></div>
                            <div className="h-8 bg-gray-700 rounded w-1/2"></div>
                            <div className="flex gap-2"><div className="h-6 bg-gray-700 rounded-full w-1/4"></div><div className="h-6 bg-gray-700 rounded-full w-1/4"></div></div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    </div>
);

export default ProjectLoadingSkeleton;