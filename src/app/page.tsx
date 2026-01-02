"use client";

import Link from "next/link";
import { Sparkles, BrainCircuit, Search, BookOpen } from "lucide-react"; 
import { useLanguage } from "@/app/providers";
import { Button } from "@/components/ui/button"; // Pastiin ini keimport

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
    <div className="flex flex-col items-center justify-start pt-28 md:pt-32 font-sans gap-8 w-full min-h-screen">
      
      <div className="flex flex-col items-center justify-center text-center gap-4 relative w-full px-4 max-w-4xl mx-auto">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50/50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 text-xs font-medium border border-orange-200 dark:border-orange-800 animate-in fade-in zoom-in duration-700">
          <Sparkles className="w-3 h-3" />
          <span>{content.badge}</span>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 dark:text-white animate-in slide-in-from-bottom-5 duration-700 leading-[1.1] pb-2">
          {content.titleLine1} <span className="text-transparent bg-clip-text bg-gradient-to-br from-orange-500 to-amber-600">{content.titleLine2}</span>
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl animate-in slide-in-from-bottom-10 duration-700 delay-100 leading-relaxed">
          {content.desc}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 w-full animate-in slide-in-from-bottom-10 duration-700 delay-200">
          
          <Button asChild size="lg" className="w-full sm:w-auto h-12 px-8 text-base font-semibold rounded-lg shadow-sm cursor-pointer bg-orange-600 hover:bg-orange-700 text-white border-transparent">
             <Link href="/analyzer">
                <Search className="w-4 h-4 mr-2" />
                {content.btnStart}
             </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 text-base font-semibold rounded-lg border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 bg-transparent cursor-pointer">
             <Link href="/types">
                <BookOpen className="w-4 h-4 mr-2" />
                {content.btnLibrary}
             </Link>
          </Button>

        </div>

        {/* Features Grid - Tetap Sama */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-20 pb-20 w-full text-left">
          {content.features.map((item, i) => {
            const Icon = icons[i];
            return (
              <div key={i} className="group p-6 border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 rounded-xl hover:shadow-lg transition-all duration-300">
                <div className="p-2.5 bg-orange-100 dark:bg-orange-500/20 w-fit rounded-lg mb-4 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold mb-2 text-gray-900 dark:text-white tracking-tight">{item.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}