import React from "react";

import UserImage from "../assests/userImage.jpeg";

import {
  Link,
} from "react-router-dom";

import {
  limitText,
} from "../utils/limitText";

import {
  FontAwesomeIcon,
} from "@fortawesome/react-fontawesome";

import {
  faCheckCircle,
  faHourglassHalf,
  faEye,
  faCommentAlt,
  faStar,
  faArrowRight,
  faCode,
  faBug,
  faClock,
  faTags,
} from "@fortawesome/free-solid-svg-icons";

import timeAgo from "../utils/timeAgo";


// =========================================================
// BACKEND URL
// =========================================================

const BACKEND_URL =
  (
    process.env.REACT_APP_BACKEND_URL
    ||
    "http://127.0.0.1:8000"
  ).replace(
    /\/+$/,
    ""
  );


// =========================================================
// CONFIG
// =========================================================

const DEFAULT_STACK_COLOR =
  "#64748B";


// Card ichida hammasini chiqarib
// yubormaslik uchun limit.

const MAX_LANGUAGES =
  2;


const MAX_TECHNOLOGIES =
  3;


// =========================================================
// IMAGE URL
// =========================================================

const getImageUrl = (
  image
) => {

  if (!image) {
    return UserImage;
  }


  const value =
    String(
      image
    ).trim();


  if (!value) {
    return UserImage;
  }


  if (
    value.startsWith(
      "http://"
    )
    ||
    value.startsWith(
      "https://"
    )
    ||
    value.startsWith(
      "blob:"
    )
    ||
    value.startsWith(
      "data:"
    )
  ) {
    return value;
  }


  return (
    `${BACKEND_URL}${
      value.startsWith("/")
        ? value
        : `/${value}`
    }`
  );
};


// =========================================================
// STACK COLOR
//
// Language va Technology uchun bir xil ishlaydi.
// =========================================================

const getStackColor = (
  item
) => {

  const color =
    item?.color;


  if (
    typeof color ===
      "string"
    &&
    /^#[0-9A-Fa-f]{6}$/.test(
      color
    )
  ) {
    return color;
  }


  return DEFAULT_STACK_COLOR;
};


// =========================================================
// HEX + ALPHA
//
// #3776AB
// +
// 1A
//
// =>
//
// #3776AB1A
// =========================================================

const withAlpha = (
  color,
  alpha
) => {

  const safeColor =
    (
      typeof color ===
        "string"
      &&
      /^#[0-9A-Fa-f]{6}$/.test(
        color
      )
    )
      ? color
      : DEFAULT_STACK_COLOR;


  return (
    `${safeColor}${alpha}`
  );
};


// =========================================================
// NORMALIZE STACK
// =========================================================

const normalizeStack = (
  items
) => {

  if (
    !Array.isArray(
      items
    )
  ) {
    return [];
  }


  return items
    .filter(
      Boolean
    )
    .map(
      (
        item,
        index
      ) => {

        if (
          typeof item ===
            "string"
        ) {

          return {

            id:
              `${item}-${index}`,

            name:
              item,

            color:
              DEFAULT_STACK_COLOR,
          };
        }


        return {

          ...item,

          id:
            item.id
            ??
            `${item.name || "stack"}-${index}`,

          name:
            item.name
            ||
            item.title
            ||
            "Unknown",

          color:
            getStackColor(
              item
            ),
        };
      }
    );
};


// =========================================================
// STACK BADGE
// =========================================================

const StackBadge = ({
  item,
  icon,
  compact = false,
}) => {

  const color =
    getStackColor(
      item
    );


  return (

    <span
      title={
        item?.name
        ||
        ""
      }

      className={`
        inline-flex
        max-w-full
        items-center
        rounded-full
        border

        font-bold

        transition
        duration-300

        hover:-translate-y-[1px]

        ${
          compact

            ? `
              gap-1.5
              px-2.5
              py-1
              text-[10px]
            `

            : `
              gap-2
              px-3
              py-1
              text-xs
            `
        }
      `}

      style={{

        color,

        borderColor:
          withAlpha(
            color,
            "45"
          ),

        backgroundColor:
          withAlpha(
            color,
            "16"
          ),

        boxShadow:
          `0 0 12px ${
            withAlpha(
              color,
              "0D"
            )
          }`,
      }}
    >

      {icon && (

        <FontAwesomeIcon
          icon={
            icon
          }
          className="
            shrink-0
            opacity-80
          "
        />
      )}


      <span
        className="
          truncate
        "
      >
        {item?.name}
      </span>

    </span>
  );
};


// =========================================================
// MORE BADGE
// =========================================================

const MoreBadge = ({
  count,
  hiddenItems = [],
}) => {

  if (
    count <= 0
  ) {
    return null;
  }


  const hiddenNames =
    hiddenItems
      .map(
        (
          item
        ) =>
          item?.name
      )
      .filter(
        Boolean
      )
      .join(
        ", "
      );


  return (

    <span

      title={
        hiddenNames
        ||
        `${count} ta qo‘shimcha tag`
      }

      className="
        inline-flex
        items-center
        justify-center

        rounded-full

        border
        border-white/10

        bg-white/[0.04]

        px-2.5
        py-1

        text-[10px]
        font-black
        text-gray-400

        transition
        duration-300

        hover:border-white/20
        hover:bg-white/[0.07]
        hover:text-white
      "
    >
      +{count}

    </span>
  );
};


// =========================================================
// PROBLEM CARD
// =========================================================

const ProblemCard = ({

  id,

  username,

  firstName,

  lastName,

  image,

  name,

  views,

  languages = [],

  technologies = [],

  createdAt,

  star,

  responseCount,

  isSolved,

}) => {


  // =======================================================
  // USER
  // =======================================================

  const fullName =
    firstName ||
    lastName

      ? `${firstName || ""} ${
          lastName || ""
        }`.trim()

      : username ||
        "Anonymous";


  const avatar =
    getImageUrl(
      image
    );


  // =======================================================
  // STACK
  // =======================================================

  const normalizedLanguages =
    normalizeStack(
      languages
    );


  const normalizedTechnologies =
    normalizeStack(
      technologies
    );


  // =======================================================
  // VISIBLE LANGUAGES
  // =======================================================

  const visibleLanguages =
    normalizedLanguages.slice(
      0,
      MAX_LANGUAGES
    );


  const hiddenLanguages =
    normalizedLanguages.slice(
      MAX_LANGUAGES
    );


  // =======================================================
  // VISIBLE TECHNOLOGIES
  // =======================================================

  const visibleTechnologies =
    normalizedTechnologies.slice(
      0,
      MAX_TECHNOLOGIES
    );


  const hiddenTechnologies =
    normalizedTechnologies.slice(
      MAX_TECHNOLOGIES
    );


  // =======================================================
  // STATUS
  // =======================================================

  const statusData =
    isSolved

      ? {

          text:
            "YECHILGAN",

          icon:
            faCheckCircle,

          border:
            "border-emerald-400/30",

          bg:
            "bg-emerald-400/10",

          textColor:
            "text-emerald-300",

          glow:
            "shadow-emerald-500/10",

          line:
            "from-emerald-400 via-cyan-400 to-transparent",
        }

      : {

          text:
            "YECHILMAGAN",

          icon:
            faHourglassHalf,

          border:
            "border-red-400/30",

          bg:
            "bg-red-400/10",

          textColor:
            "text-red-300",

          glow:
            "shadow-red-500/10",

          line:
            "from-red-400 via-orange-400 to-transparent",
        };


  // =======================================================
  // RENDER
  // =======================================================

  return (

    <div
      className="
        animate-fade-in-up
      "
      style={{
        animationDelay:
          "0.25s",
      }}
    >

      <Link

        to={
          `/problem/${id}/detail`
        }

        className={`
          group
          relative
          block
          h-full
          overflow-hidden
          rounded-3xl
          border
          bg-[#050816]
          p-[1px]

          shadow-2xl
          shadow-black/30

          transition-all
          duration-300

          hover:-translate-y-1.5
          hover:shadow-cyan-500/10

          ${statusData.border}
          ${statusData.glow}
        `}
      >

        {/* =================================================
            GLOW BACKGROUND
        ================================================== */}

        <div
          className="
            absolute
            -left-24
            -top-24
            h-52
            w-52
            rounded-full
            bg-cyan-500/10
            blur-3xl
            transition
            duration-500

            group-hover:bg-cyan-400/20
          "
        />


        <div
          className="
            absolute
            -bottom-24
            -right-24
            h-52
            w-52
            rounded-full
            bg-indigo-500/10
            blur-3xl
            transition
            duration-500

            group-hover:bg-indigo-400/20
          "
        />


        {/* =================================================
            STATUS LINE
        ================================================== */}

        <div
          className={`
            absolute
            left-0
            top-0
            h-[2px]
            w-full
            bg-gradient-to-r

            ${statusData.line}
          `}
        />


        <div
          className="
            relative
            flex
            h-full
            flex-col
            rounded-3xl
            bg-gradient-to-br
            from-[#0b1020]
            via-[#080d18]
            to-[#0d1117]
            p-5
          "
        >

          {/* =================================================
              TOP USER
          ================================================== */}

          <div
            className="
              mb-5
              flex
              items-start
              justify-between
              gap-4
            "
          >

            <div
              className="
                flex
                min-w-0
                items-center
                gap-3
              "
            >

              <div
                className="
                  relative
                  shrink-0
                "
              >

                <img

                  src={
                    avatar
                  }

                  alt={
                    username ||
                    "user"
                  }

                  onError={
                    (
                      event
                    ) => {

                      event.currentTarget.src =
                        UserImage;
                    }
                  }

                  className={`
                    h-11
                    w-11
                    rounded-2xl
                    border
                    object-cover
                    shadow-lg

                    ${
                      isSolved
                        ? "border-emerald-400/40"
                        : "border-red-400/30"
                    }
                  `}
                />


                <span
                  className={`
                    absolute
                    -right-1
                    -top-1
                    h-3.5
                    w-3.5
                    rounded-full
                    border-2
                    border-[#0b1020]

                    ${
                      isSolved
                        ? "bg-emerald-400"
                        : "bg-red-400"
                    }
                  `}
                />

              </div>


              <div
                className="
                  min-w-0
                "
              >

                <h4
                  className="
                    truncate
                    text-sm
                    font-black
                    text-white
                  "
                >
                  {fullName}
                </h4>


                <div
                  className="
                    mt-1
                    flex
                    items-center
                    gap-2
                    text-xs
                    text-gray-500
                  "
                >

                  <span
                    className="
                      truncate
                      font-mono
                    "
                  >
                    @{username || "unknown"}
                  </span>


                  <span>
                    •
                  </span>


                  <span
                    className="
                      flex
                      items-center
                      gap-1
                    "
                  >

                    <FontAwesomeIcon
                      icon={
                        faClock
                      }
                    />

                    {timeAgo(
                      createdAt
                    )}

                  </span>

                </div>

              </div>

            </div>


            {/* =================================================
                STATUS
            ================================================== */}

            <span
              className={`
                shrink-0
                rounded-full
                border
                px-3
                py-1.5
                text-[11px]
                font-black
                uppercase
                tracking-wider

                ${statusData.border}
                ${statusData.bg}
                ${statusData.textColor}
              `}
            >

              <FontAwesomeIcon
                icon={
                  statusData.icon
                }
                className="
                  mr-1.5
                "
              />

              {statusData.text}

            </span>

          </div>


          {/* =================================================
              TICKET LABEL
          ================================================== */}

          <div
            className="
              mb-3
              flex
              items-center
              justify-between
            "
          >

            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-cyan-400/20
                bg-cyan-400/10
                px-3
                py-1
                text-[11px]
                font-black
                uppercase
                tracking-[0.18em]
                text-cyan-300
              "
            >

              <FontAwesomeIcon
                icon={
                  faBug
                }
              />

              problem ticket

            </div>


            <span
              className="
                font-mono
                text-xs
                font-black
                text-gray-600
              "
            >
              #{id}
            </span>

          </div>


          {/* =================================================
              TITLE
          ================================================== */}

          <h3
            className="
              mb-5
              text-xl
              font-black
              leading-snug
              text-white

              transition
              duration-300

              group-hover:text-cyan-300
            "
          >

            {limitText(
              name ||
              "Nomsiz muammo",
              80
            )}

          </h3>


          {/* =================================================
              STACK AREA
          ================================================== */}

          <div
            className="
              mb-5
              space-y-3
            "
          >

            {/* =================================================
                LANGUAGES
            ================================================== */}

            <div>

              <div
                className="
                  mb-2
                  flex
                  items-center
                  gap-2

                  font-mono
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.16em]
                  text-gray-600
                "
              >

                <FontAwesomeIcon
                  icon={
                    faCode
                  }
                  className="
                    text-cyan-500
                  "
                />

                Til

              </div>


              <div
                className="
                  flex
                  min-h-[28px]
                  flex-wrap
                  items-center
                  gap-1.5
                "
              >

                {visibleLanguages.length >
                  0 ? (

                  <>

                    {visibleLanguages.map(
                      (
                        language
                      ) => (

                        <StackBadge

                          key={
                            `language-${language.id}`
                          }

                          item={
                            language
                          }

                          icon={
                            faCode
                          }
                        />

                      )
                    )}


                    <MoreBadge

                      count={
                        hiddenLanguages.length
                      }

                      hiddenItems={
                        hiddenLanguages
                      }
                    />

                  </>

                ) : (

                  <span
                    className="
                      rounded-full
                      border
                      border-white/10
                      bg-white/[0.04]
                      px-3
                      py-1

                      text-xs
                      font-bold
                      text-gray-500
                    "
                  >
                    Til belgilanmagan
                  </span>
                )}

              </div>

            </div>


            {/* =================================================
                TECHNOLOGY TAGS
            ================================================== */}

            <div>

              <div
                className="
                  mb-2
                  flex
                  items-center
                  justify-between
                  gap-3
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-2

                    font-mono
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.16em]
                    text-gray-600
                  "
                >

                  <FontAwesomeIcon
                    icon={
                      faTags
                    }
                    className="
                      text-indigo-400
                    "
                  />

                  Taglar

                </div>


                {normalizedTechnologies.length >
                  0 && (

                  <span
                    className="
                      font-mono
                      text-[9px]
                      font-black
                      text-gray-700
                    "
                  >
                    {
                      normalizedTechnologies.length
                    }
                  </span>
                )}

              </div>


              <div
                className="
                  flex
                  min-h-[28px]
                  flex-wrap
                  items-center
                  gap-1.5
                "
              >

                {visibleTechnologies.length >
                  0 ? (

                  <>

                    {visibleTechnologies.map(
                      (
                        technology
                      ) => (

                        <StackBadge

                          key={
                            `technology-${technology.id}`
                          }

                          item={
                            technology
                          }

                          icon={
                            faTags
                          }

                          compact
                        />

                      )
                    )}


                    <MoreBadge

                      count={
                        hiddenTechnologies.length
                      }

                      hiddenItems={
                        hiddenTechnologies
                      }
                    />

                  </>

                ) : (

                  <span
                    className="
                      rounded-full
                      border
                      border-white/10
                      bg-white/[0.04]
                      px-3
                      py-1

                      text-[10px]
                      font-bold
                      text-gray-500
                    "
                  >
                    Tag yo‘q
                  </span>
                )}

              </div>

            </div>

          </div>


          {/* =================================================
              BOTTOM
          ================================================== */}

          <div
            className="
              mt-auto
              border-t
              border-white/10
              pt-4
            "
          >

            <div
              className="
                flex
                flex-col
                gap-4

                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >

              {/* =============================================
                  STATS
              ============================================== */}

              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-2
                  text-sm
                "
              >

                <span
                  className="
                    rounded-full
                    border
                    border-white/10
                    bg-white/[0.04]
                    px-3
                    py-1.5
                    font-semibold
                    text-gray-400
                  "
                >

                  <FontAwesomeIcon
                    icon={
                      faEye
                    }
                    className="
                      mr-1.5
                      text-cyan-300
                    "
                  />

                  {views || 0}

                </span>


                <span
                  className="
                    rounded-full
                    border
                    border-white/10
                    bg-white/[0.04]
                    px-3
                    py-1.5
                    font-semibold
                    text-gray-400
                  "
                >

                  <FontAwesomeIcon
                    icon={
                      faCommentAlt
                    }
                    className="
                      mr-1.5
                      text-indigo-300
                    "
                  />

                  {responseCount || 0}

                </span>


                <span
                  className="
                    rounded-full
                    border
                    border-white/10
                    bg-white/[0.04]
                    px-3
                    py-1.5
                    font-semibold
                    text-gray-400
                  "
                >

                  <FontAwesomeIcon
                    icon={
                      faStar
                    }
                    className="
                      mr-1.5
                      text-yellow-300
                    "
                  />

                  {star || 0}

                </span>

              </div>


              {/* =============================================
                  CTA
              ============================================== */}

              <span
                className={`
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  border
                  px-4
                  py-2
                  text-xs
                  font-black
                  uppercase
                  tracking-wider

                  transition
                  duration-300

                  group-hover:translate-x-1

                  ${
                    isSolved

                      ? `
                        border-emerald-400/20
                        bg-emerald-400/10
                        text-emerald-300

                        group-hover:bg-emerald-400
                        group-hover:text-[#050816]
                      `

                      : `
                        border-cyan-400/20
                        bg-cyan-400/10
                        text-cyan-300

                        group-hover:bg-cyan-400
                        group-hover:text-[#050816]
                      `
                  }
                `}
              >

                Yechimni ko&apos;rish

                <FontAwesomeIcon
                  icon={
                    faArrowRight
                  }
                />

              </span>

            </div>

          </div>

        </div>

      </Link>

    </div>
  );
};


export default ProblemCard;