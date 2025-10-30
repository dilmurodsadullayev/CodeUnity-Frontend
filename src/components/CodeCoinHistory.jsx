import React from 'react';
import './CodeCoinHistory.css'; // CSS faylini yaratishni unutmang

const CodeCoinHistory = () => {
  // Anakin foydalanuvchisi uchun namunaviy CodeCoin tarixi
  const userHistory = {
    username: 'Anakin',
    currentCoins: 1255,
    history: [
      {
        id: 1,
        type: 'earn',
        description: 'Javob yozish (React komponentini optimallashtirish)',
        amount: 5,
        date: '2023-10-26 10:00',
        icon: 'fas fa-pen-nib text-green-400'
      },
      {
        id: 2,
        type: 'earn',
        description: 'Javob "Eng Yaxshi Yechim" deb topildi (CSS animatsiyalari)',
        amount: 50,
        date: '2023-10-25 18:30',
        icon: 'fas fa-crown text-green-400'
      },
      {
        id: 3,
        type: 'spend',
        description: 'Profil uchun "Dark Nebula" temasi sotib olindi',
        amount: -150,
        date: '2023-10-25 10:15',
        icon: 'fas fa-palette text-purple-400'
      },
      {
        id: 4,
        type: 'earn',
        description: 'Har kuni kirish bonusi',
        amount: 1,
        date: '2023-10-25 09:00',
        icon: 'fas fa-calendar-day text-green-400'
      },
      {
        id: 5,
        type: 'earn',
        description: 'Yulduzcha olindi (⭐) "JavaScript debugging" uchun',
        amount: 10,
        date: '2023-10-24 14:20',
        icon: 'fas fa-star text-green-400'
      },
      {
        id: 6,
        type: 'earn',
        description: 'Yangi loyiha yuklandi ("E-commerce Dashboard")',
        amount: 100,
        date: '2023-10-24 11:00',
        icon: 'fas fa-rocket text-green-400'
      },
      {
        id: 7,
        type: 'spend',
        description: 'Maxsus avatar ramkasi sotib olindi ("Galactic Border")',
        amount: -80,
        date: '2023-10-23 20:00',
        icon: 'fas fa-image text-purple-400'
      },
      {
        id: 8,
        type: 'earn',
        description: 'Musobaqada g\'olib bo\'ldi ("Frontend Challenge Q-3")',
        amount: 500,
        date: '2023-10-23 16:45',
        icon: 'fas fa-trophy text-green-400'
      },
      {
        id: 9,
        type: 'earn',
        description: 'Boshqalardan sovg\'a (tip) olindi',
        amount: 25,
        date: '2023-10-22 19:10',
        icon: 'fas fa-gift text-green-400'
      },
      {
        id: 10,
        type: 'earn',
        description: 'Savol berish ("Optimallashtirilgan SQL so\'rovlari")',
        amount: 2,
        date: '2023-10-22 11:30',
        icon: 'fas fa-question-circle text-green-400'
      },
    ].sort((a, b) => new Date(b.date) - new Date(a.date)), // Eng yangilari tepada bo'lishi uchun saralash
  };

  return (
    <main className="container mx-auto px-4 py-16 codecoin-history-container">
      <section className="text-center pt-8 pb-12">
        <h1 className="text-5xl md:text-6xl font-black text-white mt-4 animate-slide-in-up">
          <span style={{ background: 'linear-gradient(90deg, var(--gold), #ffbf44)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {userHistory.username}
          </span> CodeCoin Tarixi
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mt-4 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
          Jami "CodeCoin"laringiz: <span className="text-gold font-bold text-2xl">{userHistory.currentCoins}</span>
        </p>
      </section>

      <div className="history-cards-wrapper grid grid-cols-1 gap-6">
        {userHistory.history.map((item) => (
          <div key={item.id} className={`info-card history-item animate-slide-in-up ${item.type === 'earn' ? 'earn-item' : 'spend-item'}`}>
            <div className="flex items-center gap-4 p-4">
              <div className={`icon w-14 h-14 rounded-full flex items-center justify-center text-2xl 
                ${item.type === 'earn' ? 'bg-green-500/10' : 'bg-purple-500/10'}`}>
                <i className={item.icon}></i>
              </div>
              <div className="flex-grow">
                <p className="text-lg font-semibold text-white">{item.description}</p>
                <p className="text-sm text-gray-400">{item.date}</p>
              </div>
              <span className={`amount font-bold text-xl ${item.type === 'earn' ? 'text-green-400' : 'text-purple-400'}`}>
                {item.type === 'earn' ? '+' : ''}{item.amount} coin
              </span>
            </div>
          </div>
        ))}
      </div>

      {userHistory.history.length === 0 && (
        <p className="text-center text-gray-400 mt-8 text-xl">Hali hech qanday "CodeCoin" operatsiyalari mavjud emas.</p>
      )}
    </main>
  );
};

export default CodeCoinHistory;