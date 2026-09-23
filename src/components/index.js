// src/components/index.js


// =========================================================
// MAIN / LAYOUT
// =========================================================

export {
    default as Main,
} from "./Main";

export {
    default as Navbar,
} from "./Navbar";

export {
    default as Footer,
} from "./Footer";


// =========================================================
// AUTH
// =========================================================

export {
    default as Login,
} from "./Login";

export {
    default as Register,
} from "./Register";

export {
    default as SocialCallback,
} from "./SocialCallback";


// =========================================================
// GLOBAL COMMENTS
// =========================================================

export {
    default as CommentSection,
} from "./CommentSection";

export {
    default as CommentForm,
} from "./CommentForm";


// =========================================================
// PROBLEMS
// =========================================================

export {
    default as Problems,
} from "./Problems";

export {
    default as ProblemDetail,
} from "./ProblemDetail";

export {
    default as ProblemResponse,
} from "./ProblemResponse";

export {
    default as ProblemResponseForm,
} from "./ProblemResponseForm";

export {
    default as ProblemCard,
} from "./ProblemCard";

export {
    default as ProblemCreate,
} from "./ProblemCreate";

export {
    default as ProblemSolutionUpdate,
} from "./ProblemSolutionUpdate";


// =========================================================
// POPULAR PROBLEM CARD
//
// Fayl nomingda hozir typo bor:
// PopularProbelmCard.jsx
//
// Shuning uchun fayl pathni hozircha o‘zgartirmaymiz.
// Ikkita export qoldiramiz:
//
// PopularProblemCard  -> yangi to‘g‘ri nom
// PopularProbelmCard -> eski kodlar buzilmasligi uchun
// =========================================================

export {
    default as PopularProblemCard,
} from "./PopularProbelmCard";

export {
    default as PopularProbelmCard,
} from "./PopularProbelmCard";


// =========================================================
// FEEDBACK
// =========================================================

export {
    default as Feedback,
} from "./Feedback";


// =========================================================
// FCOIN
// =========================================================

export {
    default as FCoin,
} from "./FCoin";

export {
    default as FCoinHistory,
} from "./FCoinHistory";


// =========================================================
// USERS
// =========================================================

export {
    default as Users,
} from "./Users";

export {
    default as UserCard,
} from "./UserCard";


// =========================================================
// PROFILE
//
// Faqat profile sahifasiga tegishli componentlar
// profile/ papkasida qoladi.
// =========================================================

export {
    default as Profile,
} from "./profile/Profile";

export {
    default as ProfileProjects,
} from "./profile/ProfileProjects";

export {
    default as ProfilePosts,
} from "./profile/ProfilePosts";

export {
    default as ProfileRoadmap,
} from "./profile/ProfileRoadmap";

export {
    default as ProfileBadges,
} from "./profile/ProfileBadges";

export {
    default as EditProfileModal,
} from "./profile/EditProfileModal";


// =========================================================
// POSTS
//
// Clean architecture:
//
// components/posts/
// ├── PostDetail.jsx
// ├── CreatePostModal.jsx
// └── comments/
// =========================================================

export {
    default as PostDetail,
} from "./posts/PostDetail";

export {
    default as CreatePostModal,
} from "./posts/CreatePostModal";


// =========================================================
// PROJECTS
//
// Hozir:
//
// components/
// ├── Projects.jsx
// ├── ProjectDetail.jsx
// └── projects/
//     └── CreateProjectModal.jsx
// =========================================================

export {
    default as Projects,
} from "./Projects";

export {
    default as ProjectDetail,
} from "./ProjectDetail";

export {
    default as CreateProjectModal,
} from "./projects/CreateProjectModal";


// =========================================================
// NOTIFICATIONS
// =========================================================

export {
    default as NotificationsPage,
} from "./NotificationsPage";

export {
    default as NotificationDropdown,
} from "./NotificationDropdown";


// =========================================================
// MY PROBLEMS
// =========================================================

export {
    default as MyProblems,
} from "./MyProblems";

export {
    default as MyProblemCard,
} from "./MyProblemCard";

export {
    default as SimilarProblems,
} from "./SimilarProblems";


// =========================================================
// SHARED COMPONENTS
// =========================================================

export {
    default as DeleteConfirmationModal,
} from "./DeleteConfirmationModal";


// =========================================================
// 404
// =========================================================

export {
    default as NotFound,
} from "./NotFound";