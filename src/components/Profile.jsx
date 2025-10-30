import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // Agar Redux state'dan foydalanmoqchi bo'lsangiz
// import UserImage from '../assests/userImage.jpeg'; // Profil rasmi uchun default rasm

const Profile = () => {
  // Misol uchun, user ma'lumotlarini Redux store'dan olish (agar mavjud bo'lsa)
  // const { user } = useSelector((state) => state.auth);
  // Agar Redux ishlatmasangiz, bu qatorni o'chiring va user ma'lumotlarini hardcode qiling yoki prop orqali oling.

  // Hozircha statik user ma'lumotlari
  const currentUser = {
    profileImage: "https://i.pravatar.cc/150?u=anvar", // Joriy foydalanuvchi profil rasmi
    coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop", // Qopqoq rasmi
    fullName: "Anvar Juraev",
    username: "anvar-dev",
    title: "Senior Python Developer",
    company: "Google",
    rating: "124K",
    codeCoin: "15,780",
    subscribers: "2,150",
    projectsCount: "42",
    location: "Toshkent, O'zbekiston",
    website: "anvar.dev",
    github: "anvar-dev",
    memberSince: "2023-yil, Mart", // Bu ma'lumotni to'g'irladim
    aboutMe: "Men backend dasturchiman va toza, samarali kod yaratishga ishtiyoqim baland. Asosan Python (Django, FastAPI) va Go tillarida ishlayman. Hozirda sun'iy intellekt va katta ma'lumotlar (Big Data) texnologiyalarini chuqur o'rganmoqdaman. Bo'sh vaqtimda ochiq manbali loyihalarga hissa qo'shishni yaxshi ko'raman.",
    skills: ["Python", "Django", "FastAPI", "PostgreSQL", "Docker", "JavaScript", "AWS"],
    badges: [
      { emoji: "🏆", title: "Top 10 Dasturchi", text: "Top 10" },
      { emoji: "🧪", title: "Beta Tester", text: "Beta Tester" },
      { emoji: "📅", title: "1 Yillik A'zo", text: "Veteran" },
      { emoji: "🐍", title: "Python Ustasi", text: "Pythonista" },
    ],
    // Loyihalar ma'lumotlari
    projects: [
      {
        id: 1,
        image: "https://cdn.dribbble.com/userupload/12470728/file/original-b1843d1d2b5164a6d1a66597581561f5.png?resize=1024x768",
        title: "E-commerce API",
        description: "Django Rest Framework va PostgreSQL asosida qurilgan onlayn do'kon uchun kuchli API.",
        techs: [
          { name: "Django", color: "orange" },
          { name: "DRF", color: "green" },
          { name: "PostgreSQL", color: "blue" },
        ],
        stars: "1.2k",
        forks: "345",
        detailLink: "project-detail.html",
      },
      {
        id: 2,
        image: "https://cdn.dribbble.com/userupload/10907149/file/original-1b91361732e4d2716480c5df0896025a.png?resize=1024x768",
        title: "Telegram Bot Konstruktor",
        description: "Foydalanuvchilarga kod yozmasdan turib o'z botlarini yaratish imkonini beruvchi platforma.",
        techs: [
          { name: "Python", color: "sky" },
          { name: "Aiogram", color: "purple" },
          { name: "Redis", color: "red" },
        ],
        stars: "876",
        forks: "112",
        detailLink: "./project-detail.html",
      },
    ],
    // Postlar ma'lumotlari
    posts: [
      {
        id: 1,
        type: "Maqola chop etdi",
        time: "3 kun oldin",
        title: "JWT token'ni front-end'da qayerda va qanday saqlash kerak?",
        excerpt: "Xavfsizlik nuqtai nazaridan eng to'g'ri yondashuv - bu `HttpOnly` cookie'lardan foydalanish. Chunki `localStorage` XSS hujumlariga nisbatan ancha zaif...",
        likes: "2,150",
        views: "12.4k",
        comments: "89",
        detailLink: "post-detail.html",
      },
      {
        id: 2,
        type: "Maqola chop etdi",
        time: "1 hafta oldin",
        title: "Tailwind CSS bilan custom animatsiyalar yaratish",
        likes: "980",
        views: "8.2k",
        comments: "45",
        detailLink: "post-detail.html",
      },
    ],
    // Yo'l xaritasi ma'lumotlari
    roadmap: [
      {
        id: 1,
        time: "2021-yil, Mart",
        title: "Sarguzasht Boshlandi",
        description: "Python va uning asosiy kutubxonalarini o'rganishni boshladim. Dastlabki `print(\"Hello World\")` dan tortib, OOP konsepsiyalarigacha bo'lgan yo'l.",
        icon: "fa-solid fa-rocket",
        color: "indigo",
      },
      {
        id: 2,
        time: "2021-yil, Dekabr",
        title: "Birinchi \"Evrika!\"",
        description: "O'zimning ilk Django proektim - oddiy blog saytini yaratdim. Modellar, admin paneli va CRUD amallari bilan ishlashni o'rgandim. Bu katta yutuq edi!",
        icon: "fa-solid fa-lightbulb",
        color: "green",
      },
      {
        id: 3,
        time: "2022-yil, Avgust",
        title: "CodeUnity Hamjamiyatiga Qo'shildim",
        description: "Jamiyatga qo'shilib, o'zim duch kelgan muammolarni muhokama qila boshladim va boshqalarga yordam berdim. Bu mening tez o'sishimga katta turtki bo'ldi.",
        icon: "fa-solid fa-users",
        color: "yellow",
      },
    ],
  };

  const [activeTab, setActiveTab] = useState('projects'); // Aktiv tabni kuzatish uchun state

  // Agar sizda `stat-gradient-text` klassi uchun stil bo'lmasa, uni global CSS faylingizga qo'shing.
  // Masalan:
  /*
  .stat-gradient-text {
    background: linear-gradient(90deg, #6366f1, #a855f7); // indigo-500 to purple-500
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  */

  // Tech span ranglari uchun utility funksiya
  const getTechColorClass = (color) => {
    switch (color) {
      case 'sky': return 'bg-sky-500/20 text-sky-300';
      case 'orange': return 'bg-orange-500/20 text-orange-300';
      case 'green': return 'bg-green-500/20 text-green-300';
      case 'blue': return 'bg-blue-500/20 text-blue-300';
      case 'purple': return 'bg-purple-500/20 text-purple-300';
      case 'yellow': return 'bg-yellow-500/20 text-yellow-300';
      case 'red': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getRoadmapColorClass = (color) => {
    switch (color) {
      case 'indigo': return 'bg-indigo-500/20';
      case 'green': return 'bg-green-500/20';
      case 'yellow': return 'bg-yellow-500/20';
      default: return 'bg-gray-500/20';
    }
  };

  const getRoadmapInnerColorClass = (color) => {
    switch (color) {
      case 'indigo': return 'bg-indigo-500';
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-400';
      default: return 'bg-gray-500';
    }
  };


  return (
    <main className="container mx-auto p-4 fade-in">
        
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="h-48 md:h-64 bg-cover bg-center" style={{ backgroundImage: `url('${currentUser.coverImage}')` }}></div>
            
            <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-end -mt-20 sm:-mt-16">
                <img src={currentUser.profileImage} alt="Profil rasmi" className="h-32 w-32 rounded-full border-4 border-gray-800 z-10 object-cover"/>
                <div className="sm:ml-6 mt-4 sm:mt-0 text-center sm:text-left">
                    <h1 className="text-2xl md:text-3xl font-bold text-white">{currentUser.fullName}</h1>
                    <p className="text-gray-400">{currentUser.title} @ {currentUser.company}</p>
                </div>
                <div className="flex space-x-2 mt-4 sm:mt-0 sm:ml-auto">
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-5 rounded-lg transition-all flex items-center space-x-2">
                        <i className="fa-solid fa-user-plus"></i>
                        <span>Obuna bo'lish</span>
                    </button>
                     <button className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-5 rounded-lg transition-all">
                        Mentorlik so'rash
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-700/50">
                <div className="bg-gray-800/80 text-center p-4">
                    <p className="text-sm text-gray-400">Reyting</p>
                    <p className="text-3xl font-black stat-gradient-text">{currentUser.rating}</p>
                </div>
                 <div className="bg-gray-800/80 text-center p-4">
                    <p className="text-sm text-gray-400">CodeCoin</p>
                    <p className="text-3xl font-black stat-gradient-text">{currentUser.codeCoin}</p>
                </div>
                 <div className="bg-gray-800/80 text-center p-4">
                    <p className="text-sm text-gray-400">Obunachilar</p>
                    <p className="text-3xl font-black stat-gradient-text">{currentUser.subscribers}</p>
                </div>
                 <div className="bg-gray-800/80 text-center p-4">
                    <p className="text-sm text-gray-400">Loyihalar</p>
                    <p className="text-3xl font-black stat-gradient-text">{currentUser.projectsCount}</p>
                </div>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mt-6">
            
            <aside className="lg:w-1/3 flex flex-col gap-6">
               <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-white mb-4">Ma'lumot</h3>
                <ul className="space-y-3 text-gray-300">
                    <li className="flex items-center"><i className="fa-solid fa-location-dot w-6 text-gray-400"></i> {currentUser.location}</li>
                    <li className="flex items-center"><i className="fa-solid fa-link w-6 text-gray-400"></i> <a href={`https://${currentUser.website}`} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">{currentUser.website}</a></li>
                    <li className="flex items-center"><i className="fa-brands fa-github w-6 text-gray-400"></i> <a href={`https://github.com/${currentUser.github}`} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">{currentUser.github}</a></li>
                    <li className="flex items-center"><i className="fa-solid fa-calendar-alt w-6 text-gray-400"></i> {currentUser.memberSince}</li>
                </ul>

                <div className="mt-6 pt-6 border-t border-gray-700">
                    <div className="bg-gray-900/60 rounded-xl p-5 border border-gray-700 shadow-inner shadow-black/20 ring-1 ring-white/10 relative overflow-hidden">
                        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-600/30 rounded-full blur-3xl"></div>
                        
                        <h3 className="flex items-center text-xl font-bold text-white mb-3 relative z-10">
                            <i className="fa-solid fa-terminal mr-3 text-indigo-400"></i>
                            Men haqimda
                        </h3>
                        <p className="text-gray-300 leading-relaxed relative z-10">
                            {currentUser.aboutMe}
                        </p>
                    </div>
                </div>
               </div> {/* Added closing div for "Ma'lumot" section */}
                            
                <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-white mb-4">Ko'nikmalar</h3>
                    <div className="flex flex-wrap gap-2">
                        {currentUser.skills.map((skill, index) => (
                            <span key={index} className={`${getTechColorClass(skill.toLowerCase().split(' ')[0])} text-sm font-semibold px-3 py-1 rounded-full`}>{skill}</span>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-white mb-4">Nishonlar</h3>
                    <div className="grid grid-cols-4 gap-4 text-center">
                        {currentUser.badges.map((badge, index) => (
                            <div key={index}>
                                <span className="text-4xl" title={badge.title}>{badge.emoji}</span>
                                <p className="text-xs mt-1 text-gray-400">{badge.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </aside>
            
            <div className="lg:w-2/3">
                <div className="flex space-x-2 border-b border-gray-700 mb-4">
                    <button
                        onClick={() => setActiveTab('projects')}
                        className={`tab-btn font-semibold px-6 py-3 border-b-2 border-transparent text-gray-400 hover:text-white transition-all ${activeTab === 'projects' ? 'border-indigo-500 text-white' : ''}`}
                    >
                        Loyihalar
                    </button>
                    <button
                        onClick={() => setActiveTab('posts')}
                        className={`tab-btn font-semibold px-6 py-3 border-b-2 border-transparent text-gray-400 hover:text-white transition-all ${activeTab === 'posts' ? 'border-indigo-500 text-white' : ''}`}
                    >
                        Postlar / Javoblar
                    </button>
                    <button
                        onClick={() => setActiveTab('roadmap')}
                        className={`tab-btn font-semibold px-6 py-3 border-b-2 border-transparent text-gray-400 hover:text-white transition-all ${activeTab === 'roadmap' ? 'border-indigo-500 text-white' : ''}`}
                    >
                        Yo'l Xaritasi
                    </button>
                </div>
                
                <div id="tab-content" className="space-y-4">
                     <div id="projects" className={`tab-panel ${activeTab === 'projects' ? 'grid md:grid-cols-2' : 'hidden'} gap-6`}>
                        {currentUser.projects.map((project) => (
                            <div key={project.id} className="project-card bg-gray-800 rounded-lg overflow-hidden flex flex-col">
                                <div className="h-48 overflow-hidden">
                                    <img src={project.image} alt="Loyiha skrinshoti" className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"/>
                                </div>
                                <div className="p-5 flex flex-col flex-grow">
                                    <h4 className="text-xl font-bold text-white">{project.title}</h4>
                                    <p className="text-gray-400 mt-1 mb-4 flex-grow">{project.description}</p>
                                    
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.techs.map((tech, index) => (
                                            <span key={index} className={`${getTechColorClass(tech.color)} text-xs font-semibold px-2.5 py-1 rounded-full`}>{tech.name}</span>
                                        ))}
                                    </div>

                                    <div className="border-t border-gray-700 pt-4 flex justify-between items-center text-gray-400">
                                        <div className="flex items-center space-x-4">
                                            <span title="Yulduzlar"><i className="fa-solid fa-star text-yellow-400 mr-1"></i> {project.stars}</span>
                                            <span title="Forklar"><i className="fa-solid fa-code-fork text-gray-500 mr-1"></i> {project.forks}</span>
                                        </div>
                                        <a href={project.detailLink} className="text-indigo-400 hover:text-indigo-300 font-semibold text-sm">
                                            Batafsil <i className="fa-solid fa-arrow-right ml-1"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div id="posts" className={`tab-panel ${activeTab === 'posts' ? 'block' : 'hidden'} space-y-4`}>
                        {currentUser.posts.map((post) => (
                            <a key={post.id} href={post.detailLink} className="block project-card bg-gray-800 p-5 rounded-lg border-l-4 border-indigo-500 hover:border-indigo-400">
                                <div className="flex items-center text-gray-400 mb-3 text-sm">
                                    <i className="fa-solid fa-pen-to-square text-indigo-400 mr-2"></i>
                                    <span className="font-semibold">{post.type}</span>
                                    <span className="mx-2">&middot;</span>
                                    <span>{post.time}</span>
                                </div>
                                <h4 className="text-lg font-bold text-white mb-2">{post.title}</h4>
                                {post.excerpt && (
                                    <p className="text-gray-400 text-sm italic border-l-2 border-gray-700 pl-3">
                                        {post.excerpt}
                                    </p>
                                )}
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400 mt-4 pt-3 border-t border-gray-700">
                                    <span className="flex items-center gap-1.5 text-pink-400" title="Layklar"><i className="fa-solid fa-heart"></i> {post.likes}</span>
                                    <span className="flex items-center gap-1.5" title="Ko'rishlar"><i className="fa-solid fa-eye"></i> {post.views}</span>
                                    <span className="flex items-center gap-1.5" title="Sharhlar"><i className="fa-solid fa-comments"></i> {post.comments}</span>
                                </div>
                            </a>
                        ))}
                    </div>
                    <div id="roadmap" className={`tab-panel ${activeTab === 'roadmap' ? 'block' : 'hidden'}`}>
                        <div className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-lg">
                            <div className="relative">
                                <div className="absolute left-4 top-4 h-full w-0.5 bg-gray-700"></div>

                                {currentUser.roadmap.map((event, index) => (
                                    <div key={event.id} className="relative mb-8 pl-12 fade-in" style={{ animationDelay: `${100 * (index + 1)}ms` }}>
                                        <div className={`absolute left-0 top-1.5 flex items-center justify-center w-8 h-8 ${getRoadmapColorClass(event.color)} rounded-full`}>
                                            <div className={`w-4 h-4 ${getRoadmapInnerColorClass(event.color)} rounded-full border-2 border-gray-800`}></div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <i className={`${event.icon} text-3xl text-${event.color}-400`}></i>
                                            <div>
                                                <p className="text-sm text-gray-400">{event.time}</p>
                                                <h4 className="text-lg font-bold text-white">{event.title}</h4>
                                            </div>
                                        </div>
                                        <p className="mt-2 text-gray-300">{event.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
  )
}

export default Profile;