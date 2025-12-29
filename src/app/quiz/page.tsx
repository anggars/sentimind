"use client";
import { useState, useEffect } from "react";
import { useLanguage } from "@/app/providers";

// Definisi Tipe Soal sesuai Database baru
type Question = {
  id: number;
  text_id: string;
  text_en: string;
};

export default function QuizPage() {
  const { lang } = useLanguage(); 
  const [questions, setQuestions] = useState<Question[]>([]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const t = {
    en: {
      loading: "Loading questions...",
      title: "Personality Quiz", // Disamain biar konsisten
      subtitle: "Answer honestly to reveal your true type.",
      questionLabel: "Question",
      agree: "Agree",
      disagree: "Disagree",
      result: "Your Result:",
      retry: "Retake Quiz",
      submitError: "Failed to calculate result."
    },
    id: {
      loading: "Memuat soal...",
      title: "Kuis Kepribadian", // Disamain biar konsisten
      subtitle: "Jawab dengan jujur untuk mengetahui tipe aslimu.",
      questionLabel: "Pertanyaan",
      agree: "Setuju",
      disagree: "Tidak Setuju",
      result: "Hasil Kamu:",
      retry: "Ulangi Tes",
      submitError: "Gagal menghitung hasil."
    }
  };
  
  const content = t[lang];

  // Fetch soal saat loading
  useEffect(() => {
    fetch("/api/quiz")
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.questions || []);
        setLoading(false);
      });
  }, []);

  const handleAnswer = (val: number) => {
    const currentQ = questions[step];
    setAnswers((prev) => ({ ...prev, [currentQ.id]: val }));

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      submitAnswers({ ...answers, [currentQ.id]: val });
    }
  };

  const submitAnswers = async (finalAnswers: Record<string, number>) => {
    setLoading(true);
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: finalAnswers }),
      });
      const data = await res.json();
      setResult(data.mbti);
    } catch (e) {
      alert(content.submitError);
    } finally {
      setLoading(false);
    }
  };

  // State Loading (Styling disesuaikan dikit biar rapi)
  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pt-20 flex items-center justify-center font-bold text-orange-600 animate-pulse">
      {content.loading}
    </div>
  );

  // State Result (Styling disamain backgroundnya)
  if (result) {
    return (
      <div className="h-screen w-full dark:bg-black pt-20 flex flex-col justify-center items-center font-sans relative overflow-hidden pb-12">
        <div className="liquid-glass p-10 text-center animate-in zoom-in duration-500 bg-white/40 dark:bg-black/20 border border-white/20">
          <h2 className="text-xl font-bold opacity-60 uppercase tracking-widest text-gray-800 dark:text-gray-200">{content.result}</h2>
          <div className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 my-6 drop-shadow-sm">
            {result}
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-8 py-3 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 rounded-xl font-bold hover:bg-orange-600 hover:text-white dark:text-white transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            {content.retry}
          </button>
        </div>
      </div>
    );
  }

  // Fallback jika soal kosong
  if (questions.length === 0) return null;

  // Pilih teks soal berdasarkan bahasa aktif
  const currentQuestionText = lang === 'en' ? questions[step].text_en : questions[step].text_id;

  return (
    <div className="h-screen dark:bg-black pt-28 pb-12 px-4 sm:px-6 lg:px-8 font-sans flex flex-col items-center overflow-hidden">
      {/* ... sisa codingan sama persis ... */}
      <div className="max-w-3xl w-full z-10">
        
        {/* HEADER */}
        <div className="text-center mb-12 animate-in fade-in zoom-in duration-500">
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500 pb-2 mb-2">
            {content.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-lg max-w-2xl mx-auto">
            {content.subtitle}
          </p>
        </div>
        
        {/* CARD SOAL */}
        <div className="liquid-glass p-6 md:p-10 animate-in fade-in zoom-in duration-300 bg-white/50 dark:bg-black/30 backdrop-blur-md shadow-2xl border border-white/20 rounded-3xl">
           {/* ... isi card soal sama persis ... */}
            <div className="flex justify-between items-end mb-6 border-b border-gray-500/10 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest opacity-50 text-gray-700 dark:text-gray-300">
              {content.questionLabel}
            </span>
            <span className="text-2xl font-black text-orange-600">
              {step + 1} <span className="text-sm font-medium text-gray-400">/ {questions.length}</span>
            </span>
          </div>

          <h2 className="text-xl md:text-3xl font-bold mb-12 text-center leading-snug min-h-[100px] flex items-center justify-center text-gray-900 dark:text-white">
            {currentQuestionText}
          </h2>
          
          <div className="relative">
            <div className="hidden md:flex justify-between absolute -top-8 w-full text-xs font-bold opacity-60 px-2">
              <span className="text-red-500">{content.disagree}</span>
              <span className="text-green-500">{content.agree}</span>
            </div>

            <div className="flex justify-between items-center gap-2 md:gap-4">
              {[-3, -2, -1, 0, 1, 2, 3].map((val) => (
                <button
                  key={val}
                  onClick={() => handleAnswer(val)}
                  className={`
                    group relative rounded-full border-2 transition-all duration-300 flex items-center justify-center shadow-sm
                    ${val === 0 
                      ? 'w-10 h-10 md:w-12 md:h-12 border-gray-300 text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10' 
                      : 'w-12 h-12 md:w-16 md:h-16 hover:scale-110 active:scale-95 text-white'
                    }
                    ${val < 0 
                      ? 'border-red-400/50 text-red-500 hover:bg-red-500 hover:border-red-500' 
                      : val > 0 
                        ? 'border-green-400/50 text-green-500 hover:bg-green-500 hover:border-green-500' 
                        : ''
                    }
                  `}
                  title={`${val}`}
                >
                  <span className={`
                    absolute rounded-full transition-all duration-300
                    ${Math.abs(val) === 3 ? 'w-3 h-3 md:w-4 md:h-4' : ''}
                    ${Math.abs(val) === 2 ? 'w-2.5 h-2.5 md:w-3 md:h-3' : ''}
                    ${Math.abs(val) === 1 ? 'w-2 h-2 md:w-2 md:h-2' : ''}
                    ${val === 0 ? 'w-1.5 h-1.5 bg-gray-400' : 'bg-current'}
                    group-hover:bg-white
                  `}></span>
                  <span className="md:hidden absolute -bottom-6 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity text-gray-500">
                    {val === -3 ? 'Sgt Tdk' : val === 3 ? 'Sgt Iya' : val}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex justify-between mt-6 text-[10px] font-bold opacity-60 uppercase md:hidden tracking-wider">
              <span className="text-red-500">{content.disagree}</span>
              <span className="text-green-500">{content.agree}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}