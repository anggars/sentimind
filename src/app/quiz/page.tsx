"use client";
import { useState, useEffect } from "react";
import { useLanguage } from "@/app/providers";
import Link from "next/link";
import { mbtiDatabase } from "@/data/mbti";
import { CheckCircle2, Clock, ShieldCheck } from "lucide-react";

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
      title: "Personality Quiz",
      subtitle: "Answer honestly to reveal your true type.",
      questionLabel: "Question",
      agree: "Agree",
      disagree: "Disagree",
      result: "Your Result:",
      retry: "Retake Quiz",
      submitError: "Failed to calculate result.",
      infoTitle: "Things to know",
      infos: [
        { icon: Clock, text: "Takes less than 2 minutes to complete." },
        { icon: CheckCircle2, text: "Answer instinctively, don't overthink." },
        { icon: ShieldCheck, text: "No right or wrong answers." }
      ]
    },
    // REVISI: Indo Gaul (Jaksel Lite)
    id: {
      loading: "Lagi nyiapin soal...",
      title: "Kuis Kepribadian",
      subtitle: "Jawab jujur ya, biar tipe aslinya ketahuan.",
      questionLabel: "Pertanyaan",
      agree: "Setuju",
      disagree: "Gak Setuju",
      result: "Hasil Kamu:",
      retry: "Ulangi Tes",
      submitError: "Gagal ngitung hasil nih.",
      infoTitle: "Info Penting",
      infos: [
        { icon: Clock, text: "Gak sampe 2 menit kok, santai." },
        { icon: CheckCircle2, text: "Jawab spontan aja, gak usah mikir keras." },
        { icon: ShieldCheck, text: "Gak ada jawaban bener atau salah." }
      ]
    }
  };

  const content = t[lang];

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
    fetch(`${apiUrl}/api/quiz`)
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${apiUrl}/api/quiz`, {
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

  if (loading) return (
    <div className="pt-40 flex items-center justify-center font-bold text-orange-600 animate-pulse">
      {content.loading}
    </div>
  );

  if (result) {
    const data = mbtiDatabase[result];
    const contentData = lang === 'en' ? data?.en : data?.id;

    return (
      <div className="w-full pt-28 pb-12 flex flex-col justify-center items-center font-sans relative px-4">
        <div className="liquid-glass p-8 md:p-12 text-center animate-in zoom-in duration-500 bg-white/40 dark:bg-black/20 border border-white/20 max-w-2xl w-full rounded-3xl shadow-2xl">

          <h2 className="text-sm font-bold opacity-60 uppercase tracking-widest text-gray-800 dark:text-gray-200 mb-4">
            {content.result}
          </h2>

          <div className={`p-6 rounded-2xl border-2 bg-white/50 dark:bg-black/40 backdrop-blur-md mb-8 ${data?.color || 'border-gray-500'}`}>
            <div className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 mb-2">
              {result}
            </div>
            <h3 className={`text-2xl font-bold mb-2 ${data?.textColor}`}>
              {contentData?.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base line-clamp-3">
              {contentData?.desc}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/types/${result}`}
              className="px-8 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg hover:shadow-orange-500/30"
            >
              {lang === 'en' ? "Read Full Profile" : "Baca Profil Lengkap"}
            </Link>

            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 rounded-xl font-bold hover:bg-gray-100 dark:hover:bg-white/20 transition-all text-gray-900 dark:text-white"
            >
              {content.retry}
            </button>
          </div>

        </div>
      </div>
    );
  }

  if (questions.length === 0) return null;

  const currentQuestionText = lang === 'en' ? questions[step].text_en : questions[step].text_id;

  return (
    <div className="w-full pt-28 pb-12 px-4 sm:px-6 lg:px-8 font-sans flex flex-col items-center">
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
                      : 'w-12 h-12 md:w-16 md:h-16 hover:scale-110 active:scale-95'
                    }
                    ${val < 0
                      ? 'border-red-400/50 text-red-500 hover:bg-red-500 hover:border-red-500 hover:text-white'
                      : val > 0
                        ? 'border-green-400/50 text-green-500 hover:bg-green-500 hover:border-green-500 hover:text-white'
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

        {/* INFO SECTION */}
        {!result && (
          <div className="mt-12 flex flex-col md:flex-row justify-center gap-6 md:gap-12 opacity-60 text-sm text-gray-600 dark:text-gray-400 animate-in slide-in-from-bottom-5 delay-200">
            {content.infos.map((info, idx) => (
              <div key={idx} className="flex items-center gap-2 justify-center">
                <info.icon size={16} />
                <span>{info.text}</span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}