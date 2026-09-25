import React, {
  useEffect,
  useState,
  useCallback,
} from "react";

import ProblemCard from "./ProblemCard";

import {
  getProblemStart,
  getProblemSuccess,
  getProblemtFailure,
} from "../features/problems/Problems";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import ProblemService from "../services/problems";

import {
  Link,
} from "react-router-dom";

import {
  Plus,
  Search,
  X,
} from "lucide-react";


const Problems = () => {

  const dispatch =
    useDispatch();


  const {
    problems,
    isLoading,
    count,
    error,
  } = useSelector(
    (state) => state.problem
  );


  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);


  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");


  const [
    debouncedSearchTerm,
    setDebouncedSearchTerm,
  ] = useState("");


  const pageSize = 6;


  // =======================================================
  // DEBOUNCE
  // =======================================================

  useEffect(() => {

    const timer =
      setTimeout(() => {

        setDebouncedSearchTerm(
          searchTerm
        );

      }, 500);


    return () =>
      clearTimeout(timer);

  }, [
    searchTerm,
  ]);


  // =======================================================
  // GET PROBLEMS
  // =======================================================

  const getProblems =
    useCallback(
      async (
        page,
        term
      ) => {

        dispatch(
          getProblemStart()
        );


        try {

          let response;


          if (
            term &&
            term.trim() !== ""
          ) {

            response =
              await ProblemService
                .getProblemSearch(
                  term,
                  page
                );

          } else {

            response =
              await ProblemService
                .getProblemsList(
                  page
                );
          }


          dispatch(
            getProblemSuccess(
              response
            )
          );

        } catch (error) {

          console.error(
            "Xatolik:",
            error
          );


          dispatch(
            getProblemtFailure(
              error.message
            )
          );
        }

      },
      [
        dispatch,
      ]
    );


  // =======================================================
  // SEARCH CHANGE
  // =======================================================

  useEffect(() => {

    setCurrentPage(1);

  }, [
    debouncedSearchTerm,
  ]);


  // =======================================================
  // FETCH
  // =======================================================

  useEffect(() => {

    getProblems(
      currentPage,
      debouncedSearchTerm
    );

  }, [
    currentPage,
    debouncedSearchTerm,
    getProblems,
  ]);


  // =======================================================
  // SEARCH INPUT
  // =======================================================

  const handleSearch = (
    e
  ) => {

    setSearchTerm(
      e.target.value
    );
  };


  // =======================================================
  // CLEAR SEARCH
  // =======================================================

  const handleClearSearch = () => {

    setSearchTerm("");

    setDebouncedSearchTerm("");

    setCurrentPage(1);
  };


  // =======================================================
  // PAGE
  // =======================================================

  const handlePageChange = (
    page
  ) => {

    setCurrentPage(
      page
    );


    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  // =======================================================
  // DATA
  // =======================================================

  const problemList =
    problems || [];


  const totalPages =
    Math.ceil(
      (count || 0)
      /
      pageSize
    );


  // =======================================================
  // RENDER
  // =======================================================

  return (

    <section
      id="problems-hero"
      className="
        py-20
        px-4
        min-h-screen
        bg-gradient-to-b
        from-gray-900
        to-black
        text-gray-100
      "
    >

      <div
        className="
          container
          mx-auto
          max-w-7xl
        "
      >

        {/* =================================================
            HERO SECTION
        ================================================== */}

        <div
          className="
            text-center
            animate-fade-in-up
          "
        >

          <h1
            className="
              text-5xl
              lg:text-6xl
              font-black
              text-white
              mb-4
              leading-tight
            "
          >

            Muammolar{" "}

            <span
              className="
                hero-gradient-text
                bg-clip-text
                text-transparent
                bg-gradient-to-r
                from-purple-400
                to-indigo-600
              "
            >
              Markazi
            </span>

          </h1>


          <p
            className="
              text-lg
              text-gray-400
              max-w-2xl
              mx-auto
            "
          >
            Jamiyatimiz bilimini o&apos;rganing,
            o&apos;z muammolaringizni baham ko&apos;ring
            va eng yaxshi yechimlarni toping.
          </p>

        </div>


        {/* =================================================
            SEARCH + CREATE ACTION PANEL
        ================================================== */}

        <div
          className="
            relative
            max-w-5xl
            mx-auto
            my-12
            animate-fade-in-up
          "
          style={{
            animationDelay:
              "0.2s",
          }}
        >

          {/* glow */}

          <div
            className="
              pointer-events-none
              absolute
              -inset-4
              rounded-[2rem]
              bg-gradient-to-r
              from-indigo-500/10
              via-purple-500/5
              to-cyan-500/10
              blur-2xl
            "
          />


          <div
            className="
              relative
              overflow-hidden
              rounded-3xl
              border
              border-white/[0.08]
              bg-[#090e18]/95
              p-2

              shadow-2xl
              shadow-black/30

              backdrop-blur-xl
            "
          >

            {/* subtle top highlight */}

            <div
              className="
                pointer-events-none
                absolute
                left-10
                right-10
                top-0
                h-px
                bg-gradient-to-r
                from-transparent
                via-indigo-400/40
                to-transparent
              "
            />


            <div
              className="
                relative
                flex
                flex-col
                gap-2

                md:flex-row
                md:items-center
              "
            >

              {/* =============================================
                  SEARCH
              ============================================== */}

              <div
                className="
                  group
                  relative
                  flex-1
                "
              >

                <div
                  className="
                    pointer-events-none
                    absolute
                    left-4
                    top-1/2
                    z-10
                    -translate-y-1/2
                  "
                >

                  <Search
                    size={19}
                    strokeWidth={2.2}
                    className="
                      text-gray-500
                      transition-colors
                      duration-300

                      group-focus-within:text-indigo-400
                    "
                  />

                </div>


                <input
                  type="text"

                  value={
                    searchTerm
                  }

                  onChange={
                    handleSearch
                  }

                  placeholder="Python, React, Docker... bo'yicha qidirish"

                  className="
                    w-full
                    min-h-[52px]

                    rounded-2xl

                    border
                    border-white/[0.07]

                    bg-white/[0.035]

                    py-3
                    pl-12
                    pr-24

                    text-sm
                    font-medium
                    text-gray-100

                    outline-none

                    transition-all
                    duration-300

                    placeholder:text-gray-600

                    hover:border-white/[0.12]
                    hover:bg-white/[0.045]

                    focus:border-indigo-400/40
                    focus:bg-[#0d1320]
                    focus:ring-4
                    focus:ring-indigo-500/10
                  "
                />


                {/* SEARCH RIGHT ACTION */}

                <div
                  className="
                    absolute
                    right-3
                    top-1/2

                    flex
                    -translate-y-1/2
                    items-center
                    gap-2
                  "
                >

                  {isLoading &&
                    searchTerm && (

                    <span
                      className="
                        inline-flex
                        h-7
                        w-7
                        items-center
                        justify-center

                        rounded-lg

                        border
                        border-indigo-400/10

                        bg-indigo-400/[0.05]
                      "
                    >

                      <i
                        className="
                          fas
                          fa-spinner
                          fa-spin
                          text-xs
                          text-indigo-400
                        "
                      />

                    </span>
                  )}


                  {searchTerm && (
                    <button
                      type="button"

                      onClick={
                        handleClearSearch
                      }

                      title="Qidiruvni tozalash"

                      className="
                        inline-flex
                        h-7
                        w-7
                        items-center
                        justify-center

                        rounded-lg

                        border
                        border-white/[0.06]

                        bg-white/[0.03]

                        text-gray-600

                        transition-all
                        duration-200

                        hover:border-red-400/20
                        hover:bg-red-400/[0.07]
                        hover:text-red-300
                      "
                    >

                      <X
                        size={14}
                        strokeWidth={2.4}
                      />

                    </button>
                  )}

                </div>

              </div>


              {/* =============================================
                  DIVIDER
              ============================================== */}

              <div
                className="
                  hidden
                  h-8
                  w-px
                  bg-white/[0.07]

                  md:block
                "
              />


              {/* =============================================
                  CREATE PROBLEM BUTTON
              ============================================== */}

              <Link
                to="/problem-create"

                className="
                  group/create

                  relative
                  inline-flex
                  min-h-[52px]

                  shrink-0

                  items-center
                  justify-center
                  gap-2.5

                  overflow-hidden

                  rounded-2xl

                  border
                  border-indigo-400/30

                  bg-gradient-to-r
                  from-indigo-600
                  to-purple-600

                  px-6

                  text-sm
                  font-black
                  text-white

                  shadow-lg
                  shadow-indigo-950/40

                  transition-all
                  duration-300

                  hover:-translate-y-[1px]
                  hover:border-indigo-300/50
                  hover:from-indigo-500
                  hover:to-purple-500
                  hover:shadow-indigo-600/20

                  active:translate-y-0
                  active:scale-[0.98]

                  md:min-w-[205px]
                "
              >

                {/* hover shine */}

                <span
                  className="
                    pointer-events-none
                    absolute
                    -left-16
                    top-0
                    h-full
                    w-12
                    -skew-x-12

                    bg-white/10
                    blur-sm

                    transition-all
                    duration-700

                    group-hover/create:left-[110%]
                  "
                />


                <span
                  className="
                    relative
                    inline-flex
                    h-8
                    w-8
                    items-center
                    justify-center

                    rounded-xl

                    border
                    border-white/15

                    bg-white/10

                    shadow-inner
                  "
                >

                  <Plus
                    size={17}
                    strokeWidth={2.7}
                  />

                </span>


                <span
                  className="
                    relative
                    whitespace-nowrap
                  "
                >
                  Yangi Muammo
                </span>

              </Link>

            </div>


            {/* ===============================================
                SEARCH HELPER
            ================================================ */}

            <div
              className="
                hidden
                items-center
                justify-between

                px-3
                pb-1
                pt-2

                text-[10px]
                font-medium
                text-gray-700

                sm:flex
              "
            >

              <span>
                Muammo nomi, til yoki texnologiya bo&apos;yicha qidiring
              </span>


              {debouncedSearchTerm ? (

                <span
                  className="
                    max-w-[240px]
                    truncate

                    rounded-full

                    border
                    border-indigo-400/10

                    bg-indigo-400/[0.04]

                    px-2.5
                    py-1

                    font-mono
                    text-indigo-400/70
                  "
                >
                  “{debouncedSearchTerm}”
                </span>

              ) : (

                <span
                  className="
                    font-mono
                    text-gray-800
                  "
                >
                  search / create
                </span>
              )}

            </div>

          </div>

        </div>


        {/* =================================================
            ERROR
        ================================================== */}

        {error && (

          <div
            className="
              bg-red-900/50
              border
              border-red-500
              text-red-200
              p-4
              rounded-md
              mb-8
              text-center
              max-w-2xl
              mx-auto
            "
          >

            <i
              className="
                fas
                fa-exclamation-circle
                mr-2
              "
            />

            Xato yuz berdi:{" "}
            {error}

          </div>
        )}


        {/* =================================================
            PROBLEMS GRID
        ================================================== */}

        <div
          className="
            grid
            md:grid-cols-2
            lg:grid-cols-3
            gap-8
          "
        >

          {isLoading ? (

            [
              ...Array(
                pageSize
              ),
            ].map(
              (
                _,
                i
              ) => (

                <div
                  key={
                    i
                  }
                  className="
                    animate-pulse
                    bg-gray-800
                    p-6
                    flex
                    flex-col
                    h-full
                    rounded-lg
                    shadow-xl
                    border
                    border-gray-700
                    space-y-4
                  "
                >

                  <div
                    className="
                      h-10
                      w-10
                      rounded-full
                      bg-gray-700
                    "
                  />


                  <div
                    className="
                      h-6
                      bg-gray-700
                      rounded
                      w-3/4
                    "
                  />


                  <div
                    className="
                      h-4
                      bg-gray-700
                      rounded
                      w-1/2
                    "
                  />


                  <div
                    className="
                      h-20
                      bg-gray-700
                      rounded
                      w-full
                    "
                  />

                </div>
              )
            )

          ) : (

            problemList.length > 0 ? (

              problemList.map(
                (
                  problem
                ) => (

                  <ProblemCard
                        key={problem.id}

                        id={problem.id}

                        username={
                          problem.user?.username
                        }

                        firstName={
                          problem.user?.first_name
                        }

                        lastName={
                          problem.user?.last_name
                        }

                        image={
                          problem.user?.image
                        }

                        name={
                          problem.problem
                        }

                        views={
                          problem.total_views
                        }

                        languages={
                          problem.language_data
                          || []
                        }

                        technologies={
                          problem.technology_data
                          || []
                        }

                        createdAt={
                          problem.created_at
                        }

                        star={
                          problem.star
                        }

                        responseCount={
                          problem.response_count
                        }

                        isSolved={
                          problem.is_solved
                        }
                      />

                )
              )

            ) : (

              <div
                className="
                  col-span-full
                  text-center
                  py-20
                "
              >

                <i
                  className="
                    fas
                    fa-search
                    text-5xl
                    text-gray-600
                    mb-4
                  "
                />


                <p
                  className="
                    text-gray-400
                    text-xl
                  "
                >
                  &quot;{debouncedSearchTerm}&quot;
                  {" "}
                  bo&apos;yicha hech qanday muammo topilmadi.
                </p>

              </div>
            )

          )}

        </div>


        {/* =================================================
            PAGINATION
        ================================================== */}

        {!isLoading &&
          totalPages > 1 && (

          <div
            className="
              flex
              justify-center
              items-center
              mt-16
              space-x-2
            "
          >

            <button
              onClick={() =>
                handlePageChange(
                  currentPage - 1
                )
              }
              disabled={
                currentPage === 1
              }
              className={`
                px-4
                py-2
                rounded-md
                border
                transition-all

                ${
                  currentPage === 1

                    ? `
                      bg-gray-800
                      text-gray-500
                      border-gray-700
                      cursor-not-allowed
                    `

                    : `
                      bg-gray-800
                      border-gray-700
                      text-gray-300
                      hover:bg-indigo-600
                      hover:text-white
                    `
                }
              `}
            >

              <i
                className="
                  fas
                  fa-chevron-left
                "
              />

            </button>


            {Array.from(
              {
                length:
                  totalPages,
              },
              (
                _,
                i
              ) =>
                i + 1
            )
              .filter(
                (p) =>
                  p === 1
                  ||
                  p ===
                    totalPages
                  ||
                  Math.abs(
                    p -
                    currentPage
                  ) <= 1
              )
              .map(
                (
                  page,
                  index,
                  array
                ) => (

                  <React.Fragment
                    key={
                      page
                    }
                  >

                    {index > 0 &&
                      array[
                        index - 1
                      ] !==
                        page - 1 && (

                      <span
                        className="
                          text-gray-600
                        "
                      >
                        ...
                      </span>
                    )}


                    <button
                      onClick={() =>
                        handlePageChange(
                          page
                        )
                      }
                      className={`
                        px-4
                        py-2
                        rounded-md
                        border
                        transition-all

                        ${
                          currentPage ===
                          page

                            ? `
                              bg-indigo-600
                              text-white
                              border-indigo-600
                            `

                            : `
                              bg-gray-800
                              border-gray-700
                              text-gray-300
                              hover:bg-indigo-600
                              hover:text-white
                            `
                        }
                      `}
                    >
                      {page}
                    </button>

                  </React.Fragment>
                )
              )}


            <button
              onClick={() =>
                handlePageChange(
                  currentPage + 1
                )
              }
              disabled={
                currentPage ===
                totalPages
              }
              className={`
                px-4
                py-2
                rounded-md
                border
                transition-all

                ${
                  currentPage ===
                  totalPages

                    ? `
                      bg-gray-800
                      text-gray-500
                      border-gray-700
                      cursor-not-allowed
                    `

                    : `
                      bg-gray-800
                      border-gray-700
                      text-gray-300
                      hover:bg-indigo-600
                      hover:text-white
                    `
                }
              `}
            >

              <i
                className="
                  fas
                  fa-chevron-right
                "
              />

            </button>

          </div>
        )}

      </div>

    </section>
  );
};


export default Problems;