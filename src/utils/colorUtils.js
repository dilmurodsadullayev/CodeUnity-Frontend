// utils/colorUtils.js faylida joylashadi

// Yo'l xaritasi ranglari uchun utility funksiyalari
export const getRoadmapColorClass = (color) => {
  switch (color) {
    case 'indigo': return 'bg-indigo-500/20';
    case 'green': return 'bg-green-500/20';
    case 'yellow': return 'bg-yellow-500/20';
    default: return 'bg-gray-500/20';
  }
};

export const getRoadmapInnerColorClass = (color) => {
  switch (color) {
    case 'indigo': return 'bg-indigo-500';
    case 'green': return 'bg-green-500';
    case 'yellow': return 'bg-yellow-400';
    default: return 'bg-gray-500';
  }
};

export const getTechColorClass = (color) => {
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


export const getTechnologyColor = (name) => {
  if (!name) return 'bg-gray-500/20 text-gray-300';

  // agar obyekt bo‘lsa — ichidan name ni olamiz
  const actualName = typeof name === 'object' && name !== null ? name.name : name;

  if (!actualName || typeof actualName !== 'string') {
    return 'bg-gray-500/20 text-gray-300';
  }

  const lower = actualName.toLowerCase();

  switch (true) {
    // 🐍 Dasturlash tillari
    case lower.includes('python'): return 'bg-yellow-500/20 text-yellow-300';
    case lower.includes('javascript'): return 'bg-yellow-400/20 text-yellow-200';
    case lower.includes('typescript'): return 'bg-blue-500/20 text-blue-300';
    case lower.includes('java'): return 'bg-orange-500/20 text-orange-300';
    case lower.includes('c++'): return 'bg-purple-500/20 text-purple-300';
    case lower.includes('c#'): return 'bg-green-500/20 text-green-300';
    case lower.includes('php'): return 'bg-indigo-500/20 text-indigo-300';
    case lower.includes('ruby'): return 'bg-red-500/20 text-red-300';
    case lower.includes('go'): return 'bg-sky-500/20 text-sky-300';
    case lower.includes('swift'): return 'bg-orange-400/20 text-orange-200';
    case lower.includes('dart'): return 'bg-cyan-500/20 text-cyan-300'; // 🧩 Dart qo‘shildi

    // ⚙️ Framework / texnologiyalar
    case lower.includes('django'): return 'bg-green-600/20 text-green-400';
    case lower.includes('drf'): return 'bg-green-700/20 text-green-400'; // ⚙️ DRF qo‘shildi
    case lower.includes('flask'): return 'bg-gray-500/20 text-gray-300';
    case lower.includes('react'): return 'bg-sky-500/20 text-sky-300';
    case lower.includes('vue'): return 'bg-emerald-500/20 text-emerald-300';
    case lower.includes('angular'): return 'bg-red-500/20 text-red-300';
    case lower.includes('next'): return 'bg-gray-600/20 text-gray-400';
    case lower.includes('node'): return 'bg-green-500/20 text-green-300';
    case lower.includes('express'): return 'bg-gray-700/20 text-gray-400';
    case lower.includes('laravel'): return 'bg-rose-500/20 text-rose-300';
    case lower.includes('spring'): return 'bg-green-700/20 text-green-400';
    case lower.includes('flutter'): return 'bg-blue-400/20 text-blue-300';
    case lower.includes('android'): return 'bg-green-500/20 text-green-300';
    case lower.includes('ios'): return 'bg-slate-400/20 text-slate-200';
    case lower.includes('.net'):
    case lower.includes('dotnet'): return 'bg-purple-500/20 text-purple-300';
    case lower.includes('fastapi'): return 'bg-teal-500/20 text-teal-300'; // 🧠 FastAPI rang
    case lower.includes('rest'): return 'bg-lime-500/20 text-lime-300';

    // 🧠 AI / Ma'lumot tahlili
    case lower.includes('pytorch'): return 'bg-red-600/20 text-red-400';
    case lower.includes('tensorflow'): return 'bg-orange-500/20 text-orange-300';
    case lower.includes('scikit'): return 'bg-yellow-500/20 text-yellow-300';
    case lower.includes('numpy'): return 'bg-blue-500/20 text-blue-300';
    case lower.includes('pandas'): return 'bg-purple-400/20 text-purple-300';

    // 🔒 Boshqa umumiy
    default: return 'bg-gray-500/20 text-gray-300';
  }
};



export const getPostTypeIcon = (typeKey) => {
    switch (typeKey) {
        case 'TEX':
            return 'fa-solid fa-microchip'; // Yoki 'fa-solid fa-laptop'
        case 'SPO':
            return 'fa-solid fa-volleyball-ball'; // Yoki 'fa-solid fa-futbol'
        case 'BIZ':
            return 'fa-solid fa-briefcase';
        case 'ENT':
            return 'fa-solid fa-gamepad';
        case 'OTH':
            return 'fa-solid fa-pen-to-square';
        default:
            return 'fa-solid fa-tag'; // Noma'lum tur uchun standart iconka
    }
};