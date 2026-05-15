import React, { useEffect } from "react";
import CommentSection from "./CommentSection";
import PopularProbelmCard from "./PopularProbelmCard";
import ProblemService from "../services/problems";
import { useDispatch, useSelector } from "react-redux";
import {
  getPopularProblemStart,
  getPopularProblemSuccess,
} from "../features/problems/Problems";
import FCoinIcon from "../assests/coin/fcoin.png";

const Main = () => {
  const dispatch = useDispatch();

  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const { popularProblems, isLoading } = useSelector((state) => state.problem);

  const getPopularProblems = async () => {
    dispatch(getPopularProblemStart());

    try {
      const response = await ProblemService.getPopularProblemsList();
      dispatch(getPopularProblemSuccess(response));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPopularProblems();
  }, []);

  return (
    <>
      <main>
        {/* HERO SECTION */}
        <section className="relative overflow-hidden px-4 pt-8 pb-12 lg:pt-12 lg:pb-16">
          {/* Background */}
          <div className="absolute inset-0 -z-10 bg-[#050816]" />
          <div className="absolute left-0 top-0 -z-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-[90px]" />
          <div className="absolute right-0 top-10 -z-10 h-72 w-72 rounded-full bg-indigo-500/20 blur-[100px]" />

          <div className="container mx-auto">
            <div className="flex flex-col items-center justify-between gap-10 lg:flex-row">
              {/* LEFT CONTENT */}
              <div className="w-full text-center lg:w-1/2 lg:text-left">
                {/* Mr.Robot style welcome text */}
                {isLoggedIn && user && (
                  <div className="mb-5 text-left font-mono">
                    <p className="text-[12px] font-black uppercase tracking-[0.35em] text-gray-600">
                      fsociety://home
                    </p>

                    <h2 className="mt-2 text-xl font-black tracking-tight text-gray-100 md:text-2xl">
                      Salom, xush kelibsiz{" "}
                      <span className="text-white">@{user?.username}</span>
                      <span className="ml-1 animate-pulse text-gray-500">
                        _
                      </span>
                    </h2>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-black uppercase tracking-[0.2em] text-gray-500">
                      <span>
                        Level:{" "}
                        <span className="text-gray-200">
                          {user?.skill_level || "developer"}
                        </span>
                      </span>

                      <span className="text-gray-700">/</span>

                      <span>
                        FCoin:{" "}
                        <span className="text-gray-200">
                          {user?.coins ?? 0}
                        </span>
                      </span>
                    </div>
                  </div>
                )}

                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-bold text-cyan-300">
                  <i className="fa-solid fa-terminal"></i>
                  FSociety Platform
                </div>

                <h1 className="mb-5 text-4xl font-black leading-tight text-white md:text-5xl lg:text-6xl">
                  Muammoni{" "}
                  <span className="bg-gradient-to-r from-cyan-300 via-indigo-300 to-fuchsia-300 bg-clip-text text-transparent">
                    yechimga
                  </span>
                  <br />
                  aylantiring.
                </h1>

                <p className="mx-auto mb-7 max-w-xl text-base leading-7 text-gray-400 lg:mx-0">
                  Xatoliklarni joylang, yechim oling, boshqalarga yordam bering
                  va har bir foydali hissangiz uchun yulduzcha hamda FCoin
                  yig‘ing.
                </p>

                <div className="flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                  <a
                    href="/problem-create"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-cyan-500/20 transition duration-300 hover:-translate-y-1 hover:shadow-cyan-500/40"
                  >
                    <i className="fa-solid fa-plus"></i>
                    Savol berish
                  </a>

                  <a
                    href="/problems"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-black text-white transition duration-300 hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-300"
                  >
                    <i className="fa-solid fa-bug"></i>
                    Muammolarni ko‘rish
                  </a>
                </div>
              </div>

              {/* RIGHT CONTENT */}
              <div className="w-full lg:w-1/2">
                <div className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-3 shadow-2xl shadow-black/30 backdrop-blur">
                  <div className="rounded-2xl border border-white/10 bg-[#0d1117] p-4">
                    <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                          Popular Problems
                        </p>
                        <h3 className="text-lg font-black text-white">
                          Qaynoq muammolar
                        </h3>
                      </div>

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                        <i className="fa-solid fa-code"></i>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3">
                        <div className="mb-2 flex flex-wrap gap-2">
                          <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-xs font-bold text-orange-300">
                            django
                          </span>
                          <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs font-bold text-blue-300">
                            sql
                          </span>
                        </div>

                        <div className="flex items-start justify-between gap-3">
                          <h4 className="text-sm font-bold leading-6 text-white">
                            Django N+1 muammosini qanday optimallashtirish
                            mumkin?
                          </h4>

                          <div className="text-center">
                            <p className="text-lg font-black text-cyan-300">
                              125
                            </p>
                            <p className="text-[10px] text-gray-500">stars</p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 opacity-80">
                        <div className="mb-2 flex flex-wrap gap-2">
                          <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-xs font-bold text-cyan-300">
                            react
                          </span>
                          <span className="rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs font-bold text-yellow-300">
                            js
                          </span>
                        </div>

                        <div className="flex items-start justify-between gap-3">
                          <h4 className="text-sm font-bold leading-6 text-white">
                            Redux yoki Zustand: qaysi biri yaxshi?
                          </h4>

                          <div className="text-center">
                            <p className="text-lg font-black text-indigo-300">
                              98
                            </p>
                            <p className="text-[10px] text-gray-500">stars</p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 opacity-60">
                        <div className="mb-2 flex flex-wrap gap-2">
                          <span className="rounded-full bg-blue-600/20 px-2 py-0.5 text-xs font-bold text-blue-300">
                            css
                          </span>
                        </div>

                        <div className="flex items-start justify-between gap-3">
                          <h4 className="text-sm font-bold leading-6 text-white">
                            CSS Grid va Flexbox farqlari nima?
                          </h4>

                          <div className="text-center">
                            <p className="text-lg font-black text-fuchsia-300">
                              72
                            </p>
                            <p className="text-[10px] text-gray-500">stars</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-gray-400">
                      <span>
                        <i className="fa-solid fa-eye mr-1 text-cyan-300"></i>
                        2.4k views
                      </span>

                      <span>
                        <i className="fa-solid fa-comments mr-1 text-indigo-300"></i>
                        340 answers
                      </span>

                      <span>
                        <i className="fa-solid fa-coins mr-1 text-yellow-300"></i>
                        FCoin
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRENDING PROBLEMS SECTION */}
        <section id="problems" className="bg-[#161b22] px-4 py-20">
          <div className="container mx-auto">
            <h2 className="mb-12 text-center text-4xl font-bold text-white">
              Qaynoq{" "}
              <span className="bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                Muammolar
              </span>
            </h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse space-y-4 rounded-xl bg-[#0d1117] p-4 shadow-lg"
                  >
                    <div className="h-6 w-3/4 rounded bg-gray-700/50"></div>

                    <div className="flex space-x-2">
                      <div className="h-5 w-12 rounded bg-gray-700/50"></div>
                      <div className="h-5 w-16 rounded bg-gray-700/50"></div>
                    </div>

                    <div className="space-y-2">
                      <div className="h-4 w-full rounded bg-gray-700/50"></div>
                      <div className="h-4 w-5/6 rounded bg-gray-700/50"></div>
                    </div>

                    <div className="h-5 w-16 rounded bg-gray-700/50"></div>
                  </div>
                ))
              ) : (
                popularProblems?.map((problem) => (
                  <PopularProbelmCard
                    key={problem.id}
                    user={problem.user}
                    problem={problem.problem}
                    description={problem.description}
                    star={problem.total_stars}
                    response={problem.total_responses}
                    views={problem.total_views}
                  />
                ))
              )}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="about" className="relative overflow-hidden px-4 py-20">
          <div className="absolute inset-0 -z-10 bg-[#050816]" />
          <div className="absolute left-1/2 top-0 -z-10 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[110px]" />

          <div className="container mx-auto">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-bold text-cyan-300">
                <i className="fa-solid fa-bolt"></i>
                FSociety Reward System
              </div>

              <h2 className="mb-4 text-3xl font-black leading-tight text-white md:text-4xl">
                Yordam Bering va{" "}
                <span className="bg-gradient-to-r from-cyan-300 via-indigo-300 to-yellow-300 bg-clip-text text-transparent">
                  FCoin Ishlab Toping
                </span>
              </h2>

              <p className="mx-auto max-w-2xl text-base leading-7 text-gray-400">
                Foydali yechim yozing, yulduzcha oling va FSociety ichida
                reytingingizni oshiring.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
                  <i className="fa-solid fa-hands-helping text-3xl"></i>
                </div>

                <p className="mb-2 text-xs font-black text-gray-500">
                  STEP 01
                </p>

                <h3 className="mb-2 text-xl font-black text-white">
                  Yordam Bering
                </h3>

                <p className="text-sm leading-6 text-gray-400">
                  Savollarga javob bering va buglarga yechim yozing.
                </p>
              </div>

              <div className="rounded-3xl border border-yellow-400/20 bg-yellow-400/10 p-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-yellow-400/40 bg-yellow-400/10">
                  <img
                    src={FCoinIcon}
                    alt="FCoin"
                    className="h-11 w-11 object-contain drop-shadow-[0_0_12px_rgba(234,179,8,0.7)]"
                  />
                </div>

                <p className="mb-2 text-xs font-black text-yellow-300">
                  STEP 02
                </p>

                <h3 className="mb-2 text-xl font-black text-white">
                  FCoin Toping
                </h3>

                <p className="text-sm leading-6 text-gray-400">
                  Har bir foydali harakat uchun coin va reyting oling.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-pink-400/30 bg-pink-400/10 text-pink-300">
                  <i className="fa-solid fa-gift text-3xl"></i>
                </div>

                <p className="mb-2 text-xs font-black text-gray-500">
                  STEP 03
                </p>

                <h3 className="mb-2 text-xl font-black text-white">
                  Mukofot Oling
                </h3>

                <p className="text-sm leading-6 text-gray-400">
                  Coinlarni badge, profil bezagi yoki premium imkoniyatlarga
                  almashtiring.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CALL TO ACTION SECTION */}
        <section className="px-4 py-20">
          <div className="container mx-auto rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-700 to-purple-800 p-10 text-center lg:p-14">
            <h2 className="mb-4 text-3xl font-black text-white md:text-4xl">
              O‘zbekistonning eng kuchli dasturchilar jamiyatiga qo‘shiling!
            </h2>

            <p className="mx-auto mb-8 max-w-2xl text-lg text-indigo-200">
              Karyerangizni yangi bosqichga olib chiqing. Ro‘yxatdan o‘tish bir
              daqiqadan kam vaqt oladi.
            </p>

            <a
              href="/register"
              className="inline-block rounded-2xl bg-white px-8 py-4 text-base font-black text-indigo-700 transition-all hover:scale-105 hover:bg-gray-200"
            >
              Bepul Hisob Ochish
            </a>
          </div>
        </section>
      </main>

      <CommentSection />
    </>
  );
};

export default Main;