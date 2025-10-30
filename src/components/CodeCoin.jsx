import React from 'react';
import './CodeCoin.css'; // Make sure to create and import a CSS file for styles

const CodeCoin = () => {
  return (
    <>
      <div className="floating-coins-bg">
        <i className="coin fa-solid fa-circle" style={{ fontSize: '20px', left: '10%', animationDelay: '0s' }}></i>
        <i className="coin fa-solid fa-circle" style={{ fontSize: '40px', left: '20%', animationDelay: '3s' }}></i>
        <i className="coin fa-solid fa-circle" style={{ fontSize: '15px', left: '30%', animationDelay: '7s' }}></i>
        <i className="coin fa-solid fa-circle" style={{ fontSize: '30px', left: '40%', animationDelay: '1s' }}></i>
        <i className="coin fa-solid fa-circle" style={{ fontSize: '25px', left: '50%', animationDelay: '5s' }}></i>
        <i className="coin fa-solid fa-circle" style={{ fontSize: '18px', left: '60%', animationDelay: '8s' }}></i>
        <i className="coin fa-solid fa-circle" style={{ fontSize: '35px', left: '70%', animationDelay: '2s' }}></i>
        <i className="coin fa-solid fa-circle" style={{ fontSize: '22px', left: '80%', animationDelay: '6s' }}></i>
        <i className="coin fa-solid fa-circle" style={{ fontSize: '28px', left: '90%', animationDelay: '4s' }}></i>
      </div>

      <main className="container mx-auto px-4 py-16">
        <section className="text-center pt-8 pb-16">
          <div className="main-coin mx-auto">
            <i className="fa-solid fa-coins"></i>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mt-4 animate-slide-in-up">
            CodeCoin <span style={{ background: 'linear-gradient(90deg, var(--gold), #ffbf44)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Iqtisodiyoti</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mt-4 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
            Hissangizni qadrlaymiz. Platformadagi har bir faoliyatingiz uchun taqdirlanasiz va noyob imkoniyatlarga ega bo'lasiz.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="info-card earning animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="p-6">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <i className="fas fa-arrow-up-right-dots text-green-400"></i>"CodeCoin"larni Qanday Ishlash Mumkin?
              </h2>
              <div className="mt-6 space-y-3">
                <div className="info-item flex items-center gap-4 p-3 rounded-lg">
                  <div className="icon w-12 h-12 rounded-lg flex items-center justify-center bg-green-500/10 text-green-300 text-xl">
                    <i className="fas fa-pen-nib"></i>
                  </div>
                  <p className="flex-grow text-gray-300">Javob yozish</p>
                  <span className="font-bold text-white">+5 coin</span>
                </div>
                <div className="info-item flex items-center gap-4 p-3 rounded-lg">
                  <div className="icon w-12 h-12 rounded-lg flex items-center justify-center bg-green-500/10 text-green-300 text-xl">
                    <i className="fas fa-crown"></i>
                  </div>
                  <p className="flex-grow text-gray-300">Javobingiz "Eng Yaxshi Yechim" deb topilishi</p>
                  <span className="font-bold text-white">+50 coin</span>
                </div>
                <div className="info-item flex items-center gap-4 p-3 rounded-lg">
                  <div className="icon w-12 h-12 rounded-lg flex items-center justify-center bg-green-500/10 text-green-300 text-xl">
                    <i className="fas fa-star"></i>
                  </div>
                  <p className="flex-grow text-gray-300">Har bir olingan yulduzcha (⭐) uchun</p>
                  <span className="font-bold text-white">+10 coin</span>
                </div>
                <div className="info-item flex items-center gap-4 p-3 rounded-lg">
                  <div className="icon w-12 h-12 rounded-lg flex items-center justify-center bg-green-500/10 text-green-300 text-xl">
                    <i className="fas fa-question-circle"></i>
                  </div>
                  <p className="flex-grow text-gray-300">Savol berish</p>
                  <span className="font-bold text-white">+2 coin</span>
                </div>
                <div className="info-item flex items-center gap-4 p-3 rounded-lg">
                  <div className="icon w-12 h-12 rounded-lg flex items-center justify-center bg-green-500/10 text-green-300 text-xl">
                    <i className="fas fa-calendar-day"></i>
                  </div>
                  <p className="flex-grow text-gray-300">Saytga har kuni kirish (Daily Bonus)</p>
                  <span className="font-bold text-white">+1 coin</span>
                </div>
                <div className="info-item flex items-center gap-4 p-3 rounded-lg">
                  <div className="icon w-12 h-12 rounded-lg flex items-center justify-center bg-green-500/10 text-green-300 text-xl">
                    <i className="fas fa-rocket"></i>
                  </div>
                  <p className="flex-grow text-gray-300">Yangi loyiha yuklash</p>
                  <span className="font-bold text-white">+100 coin</span>
                </div>
                <div className="info-item flex items-center gap-4 p-3 rounded-lg">
                  <div className="icon w-12 h-12 rounded-lg flex items-center justify-center bg-green-500/10 text-green-300 text-xl">
                    <i className="fas fa-trophy"></i>
                  </div>
                  <p className="flex-grow text-gray-300">Musobaqalarda g'olib bo'lish</p>
                  <span className="font-bold text-white">Sovrin jamg'armasi</span>
                </div>
                <div className="info-item flex items-center gap-4 p-3 rounded-lg">
                  <div className="icon w-12 h-12 rounded-lg flex items-center justify-center bg-green-500/10 text-green-300 text-xl">
                    <i className="fas fa-gift"></i>
                  </div>
                  <p className="flex-grow text-gray-300">Boshqalardan sovg'a (tip) olish</p>
                  <span className="font-bold text-white">O'tkazilgan miqdor</span>
                </div>
              </div>
            </div>
          </div>

          <div className="info-card spending animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="p-6">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <i className="fas fa-shopping-cart text-purple-400"></i>"CodeCoin"larni Nimaga Sarflash Mumkin?
              </h2>
              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="font-bold text-purple-300 text-lg mb-2">A) Profilni Moslashtirish</h3>
                  <div className="space-y-3">
                    <div className="info-item flex items-center gap-4 p-3 rounded-lg">
                      <div className="icon w-12 h-12 rounded-lg flex items-center justify-center bg-purple-500/10 text-purple-300 text-xl">
                        <i className="fas fa-image"></i>
                      </div>
                      <p>Maxsus avatar ramkalari</p>
                    </div>
                    <div className="info-item flex items-center gap-4 p-3 rounded-lg">
                      <div className="icon w-12 h-12 rounded-lg flex items-center justify-center bg-purple-500/10 text-purple-300 text-xl">
                        <i className="fas fa-palette"></i>
                      </div>
                      <p>Profil uchun maxsus "tema"lar</p>
                    </div>
                    <div className="info-item flex items-center gap-4 p-3 rounded-lg">
                      <div className="icon w-12 h-12 rounded-lg flex items-center justify-center bg-purple-500/10 text-purple-300 text-xl">
                        <i className="fas fa-award"></i>
                      </div>
                      <p>Maxsus nishonlar ("Badges")</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-purple-300 text-lg mb-2">B) Funksional Imkoniyatlar</h3>
                  <div className="space-y-3">
                    <div className="info-item flex items-center gap-4 p-3 rounded-lg">
                      <div className="icon w-12 h-12 rounded-lg flex items-center justify-center bg-purple-500/10 text-purple-300 text-xl">
                        <i className="fas fa-arrow-up-from-bracket"></i>
                      </div>
                      <p>"Savolimni tepaga chiqarish"</p>
                    </div>
                    <div className="info-item flex items-center gap-4 p-3 rounded-lg">
                      <div className="icon w-12 h-12 rounded-lg flex items-center justify-center bg-purple-500/10 text-purple-300 text-xl">
                        <i className="fas fa-bullhorn"></i>
                      </div>
                      <p>"Loyihamni reklama qilish"</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-purple-300 text-lg mb-2">C) Sayt Do'koni</h3>
                  <div className="space-y-3">
                    <div className="info-item flex items-center gap-4 p-3 rounded-lg">
                      <div className="icon w-12 h-12 rounded-lg flex items-center justify-center bg-purple-500/10 text-purple-300 text-xl">
                        <i className="fas fa-tags"></i>
                      </div>
                      <p>Brendli mahsulotlarga chegirmalar</p>
                    </div>
                    <div className="info-item flex items-center gap-4 p-3 rounded-lg">
                      <div className="icon w-12 h-12 rounded-lg flex items-center justify-center bg-purple-500/10 text-purple-300 text-xl">
                        <i className="fas fa-graduation-cap"></i>
                      </div>
                      <p>Maxsus kurslarga kirish</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-12 animate-slide-in-up" style={{ animationDelay: '0.8s' }}>
          <div className="info-card p-6 lg:p-8">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <i className="fas fa-exclamation-triangle text-gold"></i>Muhim Qoidalar
            </h2>
            <ul className="mt-4 space-y-3 list-disc list-inside text-gray-300">
              <li>
                <strong className="text-white">Balans:</strong> Coin ishlash va sarflash o'rtasidagi muvozanat doimiy tahlil qilinadi.
              </li>
              <li>
                <strong className="text-white">Haqiqiy pul emas:</strong> "CodeCoin"larni haqiqiy pulga sotib olish yoki sotish qat'iyan man etiladi. Ular faqat platforma ichidagi mehnat va hissa uchun mukofotdir.
              </li>
              <li>
                <strong className="text-white">Shaffoflik:</strong> Profilingizda har bir coin operatsiyasining tarixini kuzatib borishingiz mumkin bo'ladi.
              </li>
            </ul>
          </div>
        </section>
      </main>
    </>
  );
};

export default CodeCoin;