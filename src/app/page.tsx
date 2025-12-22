"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, BrainCircuit, Search, Sparkles } from "lucide-react";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [lang, setLang] = useState<"en" | "id">("en");
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Trigger di 10px biar instan
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const t = {
    en: {
      title: "Sentimind",
      subtitle: "AI Personality Profiler",
      desc: "Decode your true self. Analyze your words to reveal your MBTI personality type using advanced Support Vector Machine.",
      placeholder: "Type your story, tweet, or thoughts here...",
      analyzeBtn: "Analyze Personality",
      analyzing: "Reading Minds...",
      resultTitle: "Your Personality Type:",
      footer: "© 2025 Sentimind. Crafted with Intelligence.",
    },
    id: {
      title: "Sentimind",
      subtitle: "Profil Kepribadian AI",
      desc: "Ungkap jati dirimu. Analisis kata-katamu untuk menemukan tipe kepribadian MBTI menggunakan Support Vector Machine.",
      placeholder: "Ketik cerita, tweet, atau pikiranmu di sini...",
      analyzeBtn: "Analisis Kepribadian",
      analyzing: "Membaca Pikiran...",
      resultTitle: "Tipe Kepribadian Anda:",
      footer: "© 2025 Sentimind. Dibuat dengan Kecerdasan.",
    }
  };

  const content = t[lang];

  const handleAnalyze = async () => {
    if (!inputText) return;
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await response.json();
      if (data.success) {
        setResult(data.mbti_type);
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      alert("Failed to connect to AI Server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col pt-32 relative overflow-hidden font-sans">
      
      {/* --- NAVBAR PREMIUM SMOOTH --- */}
      <nav 
        className={`
          fixed left-1/2 -translate-x-1/2 z-50 
          flex justify-between items-center px-6 py-4
          navbar-transition /* Class Sakti Kita */
          ${isScrolled 
            ? "top-6 w-[90%] max-w-5xl rounded-2xl liquid-glass shadow-2xl border border-orange-500/20" 
            : "top-0 w-full rounded-none bg-transparent border-b border-transparent backdrop-blur-none" 
          }
        `}
      >
        <div className="flex items-center gap-2">
          {/* Logo Scale Animation */}
          <div className={`
            p-2 rounded-lg text-white navbar-transition
            ${isScrolled 
              ? "bg-gradient-to-tr from-orange-500 to-amber-500 shadow-lg scale-100" 
              : "bg-transparent text-orange-600 dark:text-orange-400 scale-90" 
            }
          `}>
            <BrainCircuit className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-orange-600 dark:text-orange-400">
            SENTIMIND
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setLang(lang === "en" ? "id" : "en")}
            className="p-2 rounded-full hover:bg-orange-500/10 transition-colors text-sm font-bold opacity-80 hover:opacity-100 cursor-pointer"
          >
            {lang.toUpperCase()}
          </button>
          <button 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-orange-500/10 transition-colors opacity-80 hover:opacity-100 cursor-pointer"
          >
            {theme === "dark" ? <Sun className="w-5 h-5 text-orange-400" /> : <Moon className="w-5 h-5 text-orange-600" />}
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full text-center gap-8 z-10 p-4">
        
        <div className="space-y-4 animate-in fade-in zoom-in duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100/50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-200 text-sm font-medium mb-4 border border-orange-200/50 dark:border-orange-800/50 backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            <span>Powered by SVM Algorithm</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black tracking-tight drop-shadow-sm">
            {content.title}
          </h2>
          <p className="text-2xl md:text-3xl font-light text-orange-600 dark:text-orange-300/90">
            {content.subtitle}
          </p>
        </div>

        <p className="opacity-80 max-w-xl text-lg leading-relaxed font-medium">
          {content.desc}
        </p>

        {/* INPUT CARD */}
        <div className="w-full liquid-glass p-1.5 mt-8 group focus-within:ring-2 ring-orange-400 transition-all duration-300 shadow-2xl shadow-orange-500/10">
          <div className="bg-white/40 dark:bg-black/20 rounded-xl p-6 backdrop-blur-sm">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={content.placeholder}
              className="w-full bg-transparent outline-none text-lg min-h-[180px] resize-none placeholder:text-gray-400/70 text-current"
            />
            <div className="flex justify-between items-center mt-4 border-t border-gray-200/20 dark:border-white/10 pt-4">
              <span className="text-xs opacity-50 font-mono">
                {inputText.length} chars
              </span>
              <button
                onClick={handleAnalyze}
                disabled={loading || !inputText}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-orange-500/20 transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
              >
                {loading ? (
                  <span className="animate-pulse">{content.analyzing}</span>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    {content.analyzeBtn}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* RESULT SECTION */}
        {result && (
          <div className="mt-12 liquid-glass p-10 w-full animate-in slide-in-from-bottom-10 fade-in duration-500 border-t-4 border-t-orange-500 bg-gradient-to-b from-white/40 to-white/10 dark:from-black/40">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] opacity-60 mb-4">
              {content.resultTitle}
            </h3>
            <div className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 drop-shadow-sm">
              {result}
            </div>
          </div>
        )}

      </div>

      <footer className="mt-20 text-center text-sm opacity-50 py-6">
        {content.footer}
      </footer>

      {/* BACKGROUND BLOB */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-500/10 dark:bg-orange-500/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
    </main>
  );
}