"use client";

import Link from "next/link";
import { Sparkles, BrainCircuit, Search, BookOpen } from "lucide-react"; 
import { useLanguage } from "@/app/providers";

export default function Home() {
  const { lang } = useLanguage();

  const t = {
    en: {
      badge: "AI Personality Profiler",
      titleLine1: "Understand",
      titleLine2: "Your Personality.",
      desc: "Sentimind analyzes your writing style to reveal your MBTI type, emotional tone, and communication patterns from simple text.",
      btnStart: "Start Analysis",
      btnLibrary: "Explore Types",
      features: [
        { title: "MBTI Prediction", desc: "Predicts one of 16 personality types based on your writing style." },
        { title: "Sentiment Analysis", desc: "Detects the dominant emotional tone and mood in your text." },
        { title: "Keyword Extraction", desc: "Highlights key topics and patterns from your daily conversations." }
      ]
    },
    id: {
      badge: "Profil Kepribadian AI",
      titleLine1: "Pahami",
      titleLine2: "Kepribadian Lo.",
      desc: "Gak perlu tes berjam-jam. Sentimind baca gaya nulis lo buat nebak MBTI, mood, dan pola pikir yang mungkin lo sendiri gak sadar.",
      btnStart: "Mulai Analisis",
      btnLibrary: "Kamus MBTI",
      features: [
        { title: "Prediksi MBTI", desc: "Tebak satu dari 16 tipe kepribadian based on gaya tulisan lo." },
        { title: "Analisis Sentimen", desc: "Cek vibes tulisan lo, apakah lagi positif banget atau malah gloomy." },
        { title: "Ekstraksi Kata Kunci", desc: "Highlight topik-topik yang sering lo bahas tanpa sadar." }
      ]
    }
  };

  const content = t[lang];
  const icons = [BrainCircuit, Sparkles, Search];

  return (
    <div className="flex flex-col items-center justify-start pt-28 md:pt-24 font-sans gap-8 w-full min-h-screen">
      
      <div className="flex flex-col items-center justify-center text-center gap-2 relative w-full px-4">
        
        {/* Badge */}
        <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100/50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-200 text-sm font-medium border border-orange-200/50 dark:border-orange-800/50 animate-in fade-in zoom-in duration-700">
          <Sparkles className="w-4 h-4" />
          <span>{content.badge}</span>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500 animate-in slide-in-from-bottom-5 duration-700 leading-tight pb-2">
          {content.titleLine1}<br />{content.titleLine2}
        </h1>

        <p className="text-lg md:text-xl opacity-70 max-w-2xl animate-in slide-in-from-bottom-10 duration-700 delay-100 px-2 mt-2 text-gray-600 dark:text-gray-300">
          {content.desc}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 animate-in slide-in-from-bottom-10 duration-700 delay-200 w-full px-4">
          <Link href="/analysis" className="w-full sm:w-auto px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2">
            <Search className="w-5 h-5" /> {content.btnStart}
          </Link>
          
          <Link href="/types" className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 hover:bg-gray-50 dark:hover:bg-white/20 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 text-gray-900 dark:text-white">
            <BookOpen className="w-5 h-5" /> {content.btnLibrary}
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 pb-20 max-w-5xl w-full text-center md:text-left">
          {content.features.map((item, i) => {
            const Icon = icons[i];
            return (
              <div key={i} className="liquid-glass p-6 hover:border-orange-500/50 transition-colors group flex flex-col items-center md:items-start bg-white/50 dark:bg-white/5 rounded-xl">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 w-fit rounded-lg mb-4 text-orange-600 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{item.title}</h3>
                <p className="opacity-60 text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}