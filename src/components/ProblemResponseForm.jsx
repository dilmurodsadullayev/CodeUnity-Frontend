import React, { useState, useEffect, useRef } from 'react';
import Editor from 'react-simple-code-editor';

// Prism.js mavzusi
import 'prismjs/themes/prism-dark.css';

// Prism.js core-ni faqat bir marta import qilamiz
import { highlight, languages } from 'prismjs/components/prism-core';

// JavaScript grammatikasini doimiy yuklaymiz, chunki u sukut bo'yicha ishlatiladi
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript'; // JSni doim yuklab qo'yamiz
import ProblemResponseService from '../services/problemResponse';

const ProblemResponseForm = ({id}) => {
  const [shortInfo, setShortInfo] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState(`function example(a, b) {
  return a + b;
}`);
  // Tilni tanlash maydoni olib tashlangan, default til 'javascript'
  const defaultLanguage = 'javascript'; 
  const isMounted = useRef(true); // Komponent unmount bo'lmasdan oldin holatni tekshirish uchun

  // Effekt faqat bir marta ishlaydi, chunki tilni dinamik yuklashga hojat yo'q
  // Faqatgina unmount holatini boshqarish uchun
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // highlight funksiyasi endi faqat 'defaultLanguage'ni ishlatadi
  const highlightCode = (codeToHighlight) => {
    // Agar 'javascript' grammatikasi yuklanmagan bo'lsa, 'clike'ni ishlatishga harakat qilamiz
    // ammo yuqorida 'javascript' doimiy yuklanganligi sababli bu shartga kamdan-kam tushiladi.
    const grammar = languages[defaultLanguage] || languages.clike || {};
    return highlight(codeToHighlight, grammar, defaultLanguage);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!shortInfo || !description) {
      alert("Iltimos, qisqa ma'lumot va tavsif maydonlarini to'ldiring.");
      return;
    }
    const solutionData = {
      answer: shortInfo,
      description: description,
      code: code,

    }
    try {
        const response = await ProblemResponseService.postSolution(id, solutionData);
        console.log({ shortInfo, description, code, language: defaultLanguage }); // Til default bo'yicha yuboriladi
        alert('Yechimingiz qabul qilindi!');         

  
        setShortInfo('');
        setDescription('');
        setCode(''); // Kod maydonini ham tozalaymiz

      } catch (error) {
            console.error("Muammoni yaratishda xatolik yuz berdi:", error);
            alert("Muammoni yaratishda xatolik yuz berdi!");
        }
  };

  return (
    <section className="mt-10 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
      <h2 className="text-2xl font-bold text-white mb-4">O'z yechimingizni yuboring</h2>
      <form onSubmit={handleSubmit} className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 space-y-6">
        <div>
          <label htmlFor="shortInfo" className="block text-lg font-medium text-white mb-2">
            Qisqa ma'lumot <span className="text-red-500">*</span>
          </label>
          <input
            id="shortInfo"
            type="text"
            className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="Yechimning qisqa tavsifi"
            value={shortInfo}
            onChange={(e) => setShortInfo(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-lg font-medium text-white mb-2">
            Tavsif <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            rows="5"
            placeholder="Muammoning yechimini to'liq tushuntiring..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        {/* Tilni tanlash maydoni olib tashlandi */}

        <div>
          <label htmlFor="code" className="block text-lg font-medium text-white mb-2">
            Kod (ixtiyoriy)
          </label>
          <Editor
            value={code}
            onValueChange={setCode}
            highlight={highlightCode} // Yuqoridagi highlightCode funksiyasini ishlatamiz
            padding={10}
            textareaClassName="focus:outline-none"
            preClassName="rounded-md overflow-auto border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 14,
              backgroundColor: '#1a202c', // bg-gray-900
              color: '#ffffff',
              height: '200px', // minHeight o'rniga height
              overflowY: 'auto', // Kod ko'payib ketsa, aylantirish uchun
            }}
          />
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Yechimni Yuborish
          </button>
        </div>
      </form>
    </section>
  );
};

export default ProblemResponseForm;