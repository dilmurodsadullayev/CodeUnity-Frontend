import React, { useEffect } from 'react'
import CommentSection from './CommentSection';
import PopularProbelmCard from './PopularProbelmCard';
import ProblemService from '../services/problems';
import { useDispatch, useSelector } from 'react-redux';
import { getPopularProblemStart, getPopularProblemSuccess, getProblemStart, getProblemSuccess } from '../features/problems/Problems';
import FCoinIcon from '../assests/coin/fcoin.png';

const Main = () => {
    const dispatch = useDispatch()
    const { popularProblems, isLoading } = useSelector((state) => state.problem);
    console.log("Popular problems ", popularProblems)

    const getPopularProblems = async() => {
        dispatch(getPopularProblemStart())
        try {
        const response = await ProblemService.getPopularProblemsList()
        dispatch(getPopularProblemSuccess(response))      
        
        } catch (error) {
        console.log(error);
        
        
        }
    }



    useEffect(() => {
        
        getPopularProblems()


        }, [])
  return (
    <>
       <main>
        {/* <!-- HERO SECTION --> */}
        <section className="relative container mx-auto flex flex-col lg:flex-row items-center justify-between px-4 pt-20 pb-10 lg:pt-32 lg:pb-20">
            {/* <!-- Left Text Content --> */}
            <div className="lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0">
                <h1 className="text-5xl lg:text-7xl font-black text-white mb-5 leading-tight fade-in-up">
                    Muammoni <span className="hero-gradient-text">yechimga</span><br/>aylantiring.
                </h1>
                <p className="text-lg text-gray-400 max-w-xl mx-auto lg:mx-0 mb-8 fade-in-up" style={{ animationDelay: '0.2s' }}>
                    Eng murakkab xatoliklardan tortib, yangi g'oyalargacha — F.Society sizning ishonchli hamrohingiz. Savol bering, yordam oling va mahoratingizni keyingi bosqichga olib chiqing.
                </p>
                <div className="flex justify-center lg:justify-start space-x-4 fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <a href="/problem-create" className="btn-primary text-white font-bold py-3 px-8 rounded-lg text-lg">
                        Savol berish
                    </a>
                    <a href="/problems" className="btn-secondary text-white font-bold py-3 px-8 rounded-lg text-lg">
                        Muammolarni ko'rish
                    </a>
                </div>
            </div>
            {/* <!-- Right Visual Content --> */}
            <div className="lg:w-1/2 relative flex justify-center fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="w-full max-w-lg p-2 rounded-xl bg-gradient-to-tr from-indigo-900 to-gray-900 shadow-2xl transform lg:rotate-3">
                    <div className="bg-[#0d1117] rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between problem-card p-3 rounded-lg">
                            <div>
                                <h3 className="font-bold text-white">Django N+1 muammosini qanday optimallashtirish mumkin?</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-full">django</span>
                                    <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">sql</span>
                                </div>
                            </div>
                            <div className="text-center ml-4">
                               <div className="font-bold text-lg text-green-400">125</div>
                               <div className="text-xs text-gray-500">votes</div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between problem-card p-3 rounded-lg opacity-70">
                             <div>
                                <h3 className="font-bold text-white">React-da state management uchun qaysi biri yaxshi: Redux yoki Zustand?</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full">react</span>
                                    <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full">javascript</span>
                                </div>
                            </div>
                             <div className="text-center ml-4">
                               <div className="font-bold text-lg text-green-400">98</div>
                               <div className="text-xs text-gray-500">votes</div>
                            </div>
                        </div>
                         <div className="flex items-center justify-between problem-card p-3 rounded-lg opacity-40">
                             <div>
                                <h3 className="font-bold text-white">CSS Grid va Flexbox o'rtasidagi asosiy farqlar nima?</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded-full">css</span>
                                </div>
                            </div>
                             <div className="text-center ml-4">
                               <div className="font-bold text-lg text-green-400">72</div>
                               <div className="text-xs text-gray-500">votes</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* <!-- TRENDING PROBLEMS SECTION --> */}
        <section id="problems" className="py-20 px-4 bg-[#161b22]">
            <div className="container mx-auto">
                <h2 className="text-4xl font-bold text-center mb-12 text-white">Qaynoq <span className="hero-gradient-text">Muammolar</span></h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {isLoading ? (
                      [...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="animate-pulse bg-[#0d1117] p-4 rounded-xl shadow-lg space-y-4"
                        >
                            {/* Title */}
                            <div className="h-6 bg-gray-700/50 rounded w-3/4"></div>
                            {/* Tags */}
                            <div className="flex space-x-2">
                            <div className="h-5 bg-gray-700/50 rounded w-12"></div>
                            <div className="h-5 bg-gray-700/50 rounded w-16"></div>
                            </div>
                            {/* Description */}
                            <div className="space-y-2">
                            <div className="h-4 bg-gray-700/50 rounded w-full"></div>
                            <div className="h-4 bg-gray-700/50 rounded w-5/6"></div>
                            </div>
                            {/* Votes */}
                            <div className="h-5 bg-gray-700/50 rounded w-16"></div>
                        </div>
                        ))
                    ) : (
                    popularProblems.map((problem) => (
                        <PopularProbelmCard
                        key={problem.id}
                        problem={problem.problem}
                        description={problem.description}
                        star={problem.total_stars}
                        response={problem.total_responses}
                        views = {problem.total_views}
                        />
                    ))
                    )}

                   
                  
                </div>
            </div>
        </section>
        
        {/* <!-- HOW IT WORKS (GAMIFICATION) SECTION --> */}
        <section id="about" className="py-20 px-4">
            <div className="container mx-auto">
                <h2 className="text-4xl font-bold text-center mb-4 text-white">Yordam Bering va <span className="hero-gradient-text">Mukofot Oling</span></h2>
                <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">Bizning noyob "CodeCoin" tizimi sizning har bir hissangizni qadrlaydi. Bu oddiy: yordam berasiz, reyting va coin'lar yig'asiz.</p>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    {/* <!-- Step 1 --> */}
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4 border-2 border-indigo-500">
                            <i className="fa-solid fa-hands-helping text-4xl text-indigo-300"></i>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">1. Bo'lishing & Yordam Bering</h3>
                        <p className="text-gray-400">Savollarga javob bering, o'z loyihalaringizni yuklang yoki foydali qo'llanmalar yozing.</p>
                    </div>
                    {/* <!-- Step 2 --> */}
                    <div className="flex flex-col items-center">
                                <div className="w-24 h-24 rounded-full bg-yellow-500/20 flex items-center justify-center mb-4 border-2 border-yellow-500 overflow-hidden">
                                    <img 
                                        src={FCoinIcon} 
                                        alt="FCoin" 
                                        className="h-14 w-14 object-contain drop-shadow-[0_0_10px_rgba(234,179,8,0.6)]" 
                                    />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">2. "**FCoin**" Ishlab Toping</h3>
                                <p className="text-gray-400">Har bir foydali harakatingiz uchun reyting ballari va "**FCoin**"lar bilan taqdirlanasiz.</p>
                            </div>
                    {/* <!-- Step 3 --> */}
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full bg-pink-500/20 flex items-center justify-center mb-4 border-2 border-pink-500">
                            <i className="fa-solid fa-gift text-4xl text-pink-300"></i>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">3. Mukofotlarga Ega Bo'ling</h3>
                        <p className="text-gray-400">To'plagan coin'laringizni profil bezaklari, maxsus nishonlar yoki premium funksiyalarga almashtiring.</p>
                    </div>
                </div>
            </div>
        </section>
        
        {/* <!-- FINAL CALL TO ACTION SECTION --> */}
        <section className="py-20 px-4">
            <div className="container mx-auto text-center bg-gradient-to-r from-indigo-700 to-purple-800 rounded-lg p-10 lg:p-16">
                <h2 className="text-4xl font-bold text-white mb-4">O'zbekistonning eng kuchli dasturchilar<br/>jamiyatiga hoziroq qo'shiling!</h2>
                <p className="text-indigo-200 text-lg mb-8 max-w-2xl mx-auto">
                    Karyerangizni yangi bosqichga olib chiqing. Ro'yxatdan o'tish bir daqiqadan kam vaqt oladi.
                </p>
                <a href="#" className="bg-white hover:bg-gray-200 text-indigo-700 font-bold py-4 px-10 rounded-lg text-lg transition-all transform hover:scale-105 inline-block">
                    Bepul Hisob Ochish
                </a>
            </div>
        </section>
    </main>
    <CommentSection/>
       
    </>
  )
}



export default Main;