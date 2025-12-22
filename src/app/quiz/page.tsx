"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/app/providers"; // <-- Import Bahasa

export default function QuizPage() {
  const { lang } = useLanguage();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);

  // KAMUS BAHASA & SOAL
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

  const content = t[lang]; // Pilih konten
  const questions = content.questions; // Ambil soal sesuai bahasa

  const handleAnswer = (choice: string) => {
    const newAnswers = [...answers, choice];
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setResult("INTJ (Simulasi)"); // Mock Result
    }
  };

  return (
    <main className="min-h-screen flex flex-col pt-32 font-sans p-4 items-center relative overflow-hidden">
      <Navbar />
      <div className="max-w-2xl w-full z-10">
        <h1 className="text-3xl font-black mb-8 text-center text-orange-600 dark:text-orange-400">
          {content.title}
        </h1>
        
        {!result ? (
          <div className="liquid-glass p-8 animate-in fade-in bg-white/40 dark:bg-black/20">
            <div className="mb-4 text-sm opacity-50 uppercase tracking-widest font-bold">
              {content.questionLabel} {step + 1} / {questions.length}
            </div>
            <h2 className="text-2xl font-bold mb-8">{questions[step].q}</h2>
            <div className="grid gap-4">
              <button onClick={() => handleAnswer("a")} className="p-4 text-left border border-orange-500/20 rounded-xl hover:bg-orange-500 hover:text-white transition-all hover:scale-[1.02] shadow-sm">
                A. {questions[step].a}
              </button>
              <button onClick={() => handleAnswer("b")} className="p-4 text-left border border-orange-500/20 rounded-xl hover:bg-orange-500 hover:text-white transition-all hover:scale-[1.02] shadow-sm">
                B. {questions[step].b}
              </button>
            </div>
          </div>
        ) : (
          <div className="liquid-glass p-10 text-center animate-in zoom-in bg-white/40 dark:bg-black/20">
            <h2 className="text-xl opacity-60">{content.resultLabel}</h2>
            <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 my-6">
              {result}
            </div>
            <button 
              onClick={() => {setResult(null); setStep(0); setAnswers([])}} 
              className="px-6 py-3 bg-gray-200 dark:bg-white/10 rounded-lg font-bold hover:bg-orange-500 hover:text-white transition-colors"
            >
              {content.btnRepeat}
            </button>
          </div>
        )}
      </div>

      {/* Background Blob */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-500/10 blur-[100px] -z-10 rounded-full pointer-events-none" />
    </main>
  );
}