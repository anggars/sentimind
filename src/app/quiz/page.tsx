"use client";
import { useState } from "react";
import { useLanguage } from "@/app/providers";

export default function QuizPage() {
  const { lang } = useLanguage();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);

  const t = {
    en: {
      title: "Manual MBTI Test",
      questionLabel: "Question",
      resultLabel: "Your Result:",
      btnRepeat: "Take Quiz Again",
      questions: [
        { q: "Where do you get your energy?", a: "Socializing with others (E)", b: "Alone time & thinking (I)" },
        { q: "What do you focus on?", a: "Facts & current reality (S)", b: "Ideas & possibilities (N)" },
        { q: "How do you make decisions?", a: "Logic & Objectivity (T)", b: "Values & Feelings (F)" },
        { q: "How do you live your life?", a: "Planned & Structured (J)", b: "Spontaneous & Flexible (P)" },
      ]
    },
    id: {
      title: "Tes MBTI Manual",
      questionLabel: "Pertanyaan",
      resultLabel: "Hasil Kamu:",
      btnRepeat: "Ulangi Tes",
      questions: [
        { q: "Energi kamu datang dari...", a: "Bergaul dengan orang banyak (E)", b: "Menyendiri dan berpikir (I)" },
        { q: "Kamu lebih fokus pada...", a: "Fakta yang ada sekarang (S)", b: "Ide dan masa depan (N)" },
        { q: "Cara mengambil keputusan...", a: "Logika & Objektivitas (T)", b: "Perasaan & Nilai Pribadi (F)" },
        { q: "Gaya hidup kamu...", a: "Terencana & Teratur (J)", b: "Spontan & Fleksibel (P)" },
      ]
    }
  };

  const content = t[lang];
  const questions = content.questions;

  const handleAnswer = (choice: string) => {
    const newAnswers = [...answers, choice];
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setResult("INTJ (Simulasi)");
    }
  };

  return (
    // FIX: Main jadi Div, Height Pas, Flex Center, No Padding
    <div className="min-h-[calc(100vh-10rem)] flex flex-col justify-center items-center font-sans relative overflow-hidden">
      <div className="max-w-2xl w-full z-10 px-4">
        <h1 className="text-2xl md:text-3xl font-black mb-8 text-center text-orange-600 dark:text-orange-400">
          {content.title}
        </h1>
        
        {!result ? (
          <div className="liquid-glass p-6 md:p-8 animate-in fade-in bg-white/40 dark:bg-black/20">
            <div className="mb-4 text-xs md:text-sm opacity-50 uppercase tracking-widest font-bold">
              {content.questionLabel} {step + 1} / {questions.length}
            </div>
            <h2 className="text-xl md:text-2xl font-bold mb-8 leading-tight">{questions[step].q}</h2>
            <div className="grid gap-4">
              <button onClick={() => handleAnswer("a")} className="p-4 text-left text-sm md:text-base border border-orange-500/20 rounded-xl hover:bg-orange-500 hover:text-white transition-all hover:scale-[1.02] shadow-sm active:scale-95">
                A. {questions[step].a}
              </button>
              <button onClick={() => handleAnswer("b")} className="p-4 text-left text-sm md:text-base border border-orange-500/20 rounded-xl hover:bg-orange-500 hover:text-white transition-all hover:scale-[1.02] shadow-sm active:scale-95">
                B. {questions[step].b}
              </button>
            </div>
          </div>
        ) : (
          <div className="liquid-glass p-8 md:p-10 text-center animate-in zoom-in bg-white/40 dark:bg-black/20">
            <h2 className="text-lg md:text-xl opacity-60">{content.resultLabel}</h2>
            <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 my-6">
              {result}
            </div>
            <button 
              onClick={() => {setResult(null); setStep(0); setAnswers([])}} 
              className="px-6 py-3 bg-gray-200 dark:bg-white/10 rounded-lg font-bold hover:bg-orange-500 hover:text-white transition-colors active:scale-95"
            >
              {content.btnRepeat}
            </button>
          </div>
        )}
      </div>

      {/* BLOB DIHAPUS DARI SINI BIAR POLOS */}
    </div>
  );
}