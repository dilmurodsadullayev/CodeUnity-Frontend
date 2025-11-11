// ProjectDiscussion.jsx
import React from 'react';

const ProjectDiscussion = () => {
    // Demo sharh ma'lumotlari
    const comments = [
        { 
            id: 1, 
            user: 'Sardor', 
            avatar: 'https://i.pravatar.cc/150?u=sardor', 
            time: '1 kun oldin', 
            text: "Juda toza va tushunarli kod yozilgan ekan. Ayniqsa, to'lov tizimi integratsiyasi qismi ancha yordam berdi. Rahmat!" 
        },
        { 
            id: 2, 
            user: 'Lola', 
            avatar: 'https://i.pravatar.cc/150?u=lola', 
            time: '2 soat oldin', 
            text: "Bu loyihaning arxitekturasi juda yaxshi! Lekin xavfsizlik borasida qo'shimcha fikrlarim bor edi. Qayerda muhokama qilsak bo'ladi?" 
        },
    ];

    return (
        <section className="p-6 md:p-10 border-t border-gray-700/50">
            <h2 className="text-2xl font-bold text-white mb-6">Loyiha Muhokamasi ({comments.length})</h2>
            
            {/* Yangi sharh qo'shish qismi */}
            <div className="flex items-start gap-4 mb-8">
                <img src="https://i.pravatar.cc/150?u=current_user" className="w-12 h-12 rounded-full" alt="Current User" />
                <div className="w-full">
                    <textarea 
                        className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" 
                        rows="3" 
                        placeholder="Fikringizni qoldiring..."
                    ></textarea>
                    <button 
                        className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors float-right"
                        onClick={() => alert("Sharh yuborish logikasi chaqirildi.")}
                    >
                        Yuborish
                    </button>
                </div>
            </div>
            
            {/* Mavjud sharhlar ro'yxati */}
            <div className="space-y-6 pt-10 border-t border-gray-800/50">
                {comments.map(comment => (
                    <div key={comment.id} className="flex gap-4">
                        <img src={comment.avatar} className="w-12 h-12 rounded-full mt-1" alt={comment.user} />
                        <div>
                            <p className="font-bold text-white">
                                {comment.user} <span className="text-sm font-normal text-gray-500 ml-2">{comment.time}</span>
                            </p>
                            <p className="text-gray-300 mt-1">{comment.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ProjectDiscussion;