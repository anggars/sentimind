"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Sparkles, BrainCircuit, MessageSquare, Search } from "lucide-react";
import { useLanguage } from "@/app/providers"; // <-- Import Hook Bahasa

export default function Home() {
  const { lang } = useLanguage(); // <-- Ambil status bahasa aktif (en/id)

  // KAMUS BAHASA (Teks Inggris vs Indo)
  const t = {
    en: {
      badge: "The Future of Personality Analysis",
      titleLine1: "Know Your",
      titleLine2: "True Self.",
      desc: "Sentimind uses advanced Machine Learning & Data Mining to decode your MBTI personality, sentiment, and hidden patterns from simple text.",
      btnStart: "Start Analysis",
      btnChat: "Talk to AI",
      features: [
        { title: "MBTI Prediction", desc: "Support Vector Machine (SVM) algorithm to predict 16 personality types." },
        { title: "Sentiment Mining", desc: "Analyze emotional tone (Positive/Negative) using NLP TextBlob." },
        { title: "Keyword Extraction", desc: "Extract hidden patterns and topics from your daily conversations." }
      ]
    },
    id: {
      badge: "Masa Depan Analisis Kepribadian",
      titleLine1: "Kenali",
      titleLine2: "Jati Dirimu.",
      desc: "Sentimind menggunakan Machine Learning & Data Mining canggih untuk memecahkan kepribadian MBTI, sentimen, dan pola tersembunyi dari teks.",
      btnStart: "Mulai Analisis",
      btnChat: "Ngobrol sama AI",
      features: [
        { title: "Prediksi MBTI", desc: "Algoritma Support Vector Machine (SVM) untuk memprediksi 16 tipe kepribadian." },
        { title: "Analisis Sentimen", desc: "Menganalisis nada emosional (Positif/Negatif) menggunakan NLP TextBlob." },
        { title: "Ekstraksi Kata Kunci", desc: "Menggali pola dan topik tersembunyi dari percakapan sehari-hari kamu." }
      ]
    }
  };

  const content = t[lang]; // <-- Pilih konten sesuai bahasa

  // Icon Mapping (Tetap sama)
  const icons = [BrainCircuit, Sparkles, Search];

  return (
    <main className="min-h-screen flex flex-col font-sans">
      <Navbar />
      
      {/* HERO SECTION */}
      <div className="flex-1 flex flex-col items-center justify-center text-center p-4 pt-32 gap-6 relative overflow-hidden">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100/50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-200 text-sm font-medium border border-orange-200/50 dark:border-orange-800/50 animate-in fade-in zoom-in duration-700">
          <Sparkles className="w-4 h-4" />
          <span>{content.badge}</span>
        </div>

        {/* Title */}
        <h1 className="text-6xl md:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500 animate-in slide-in-from-bottom-5 duration-700">
          {content.titleLine1}<br />{content.titleLine2}
        </h1>

        <p className="text-xl opacity-70 max-w-2xl animate-in slide-in-from-bottom-10 duration-700 delay-100">
          {/* Render HTML buat bagian Bold */}
          {lang === 'en' ? (
             <>Sentimind uses advanced <strong>Machine Learning & Data Mining</strong> to decode your MBTI personality, sentiment, and hidden patterns from simple text.</>
          ) : (
             <>Sentimind menggunakan <strong>Machine Learning & Data Mining</strong> canggih untuk memecahkan kepribadian MBTI, sentimen, dan pola tersembunyi dari teks.</>
          )}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-8 animate-in slide-in-from-bottom-10 duration-700 delay-200">
          <Link href="/analysis" className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-orange-500/30 transition-all flex items-center gap-2">
            <Search className="w-5 h-5" /> {content.btnStart}
          </Link>
          <Link href="/chat" className="px-8 py-4 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 hover:bg-gray-50 dark:hover:bg-white/20 rounded-xl font-bold text-lg transition-all flex items-center gap-2">
            <MessageSquare className="w-5 h-5" /> {content.btnChat}
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-5xl w-full px-4 text-left">
          {content.features.map((item, i) => {
            const Icon = icons[i];
            return (
              <div key={i} className="liquid-glass p-6 hover:border-orange-500/50 transition-colors group">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 w-fit rounded-lg mb-4 text-orange-600 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="opacity-60 text-sm">{item.desc}</p>
              </div>
            );
          })}
        </div>

      </div>
      
      {/* Background Blob */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-500/10 blur-[100px] -z-10 rounded-full" />
    </main>
  );
}