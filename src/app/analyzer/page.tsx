"use client";
import { useState } from "react";
import { useLanguage } from "@/app/providers";
import { Search, Tag, Smile, BrainCircuit, Lightbulb, BookOpen, MessageSquare } from "lucide-react";

export default function AnalysisPage() {
  const { lang } = useLanguage();
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const t = {
    en: {
      title: "Text Analyzer",
      desc: "Paste your tweet, story, or diary. Let AI do the mining.",
      placeholder: "Type your story here...",
      btnAnalyze: "Analyze Now",
      btnLoading: "Processing...",
      resMBTI: "MBTI Type",
      resSentiment: "Dominant Emotion",
      resKeywords: "Top Keywords",
      error: "Failed to connect to AI Server.",
      guideTitle: "How to get accurate results?",
      guides: [
        { icon: MessageSquare, title: "Be Expressive", text: "Write naturally about your feelings, opinions, or daily life experiences." },
        { icon: BookOpen, title: "Length Matters", text: "Try to write at least 2-3 sentences. Short texts like 'Hello' won't reveal much." },
        { icon: Lightbulb, title: "Honesty is Key", text: "Don't overthink it. The AI analyzes your subconscious writing style." }
      ]
    },
    // REVISI: Indo Gaul (Jaksel Lite)
    id: {
      title: "Analisis Teks",
      desc: "Tempel tweet, cerita, atau curhatan lo di sini. Biar AI yang gali datanya.",
      placeholder: "Tulis cerita atau unek-unek lo di sini...",
      btnAnalyze: "Analisis Sekarang",
      btnLoading: "Lagi Mikir...",
      resMBTI: "Tipe MBTI",
      resSentiment: "Mood Dominan",
      resKeywords: "Kata Kunci",
      error: "Yah, gagal connect ke server nih.",
      guideTitle: "Biar Hasilnya Akurat",
      guides: [
        { icon: MessageSquare, title: "Yang Ekspresif Dong", text: "Tulis aja secara natural soal perasaan atau opini lo. Gak usah jaim." },
        { icon: BookOpen, title: "Jangan Pendek-pendek", text: "Minimal 2-3 kalimat lah. Kalau cuma 'Halo' doang, AI-nya bakal bingung." },
        { icon: Lightbulb, title: "Jujur Itu Kunci", text: "Gak usah overthink. AI bakal baca pola penulisan bawah sadar lo." }
      ]
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
      if (data.success) setResult(data);
    } catch (error) {
      alert(content.error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputText.trim()) {
        handleAnalyze();
      }
    }
  };

  return (
    <div className="w-full pt-28 pb-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center font-sans">
      
      <div className="w-full max-w-4xl mx-auto text-center space-y-4 animate-in fade-in zoom-in duration-500 z-10">
        
        <div>
            <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500 pb-2">
            {content.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-lg max-w-2xl mx-auto mt-2">
            {content.desc}
            </p>
        </div>

        <div className="liquid-glass p-1.5 shadow-2xl mt-12 max-w-3xl mx-auto w-full"> 
          <div className="bg-white/50 dark:bg-black/20 rounded-xl p-4 backdrop-blur-sm">
             <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={content.placeholder}
              className="w-full bg-transparent outline-none text-base md:text-lg min-h-[120px] md:min-h-[140px] resize-none placeholder:text-gray-400 dark:text-white text-gray-900"
            />
            <div className="flex justify-end mt-2 pt-2 border-t border-gray-500/10">
              <button
                onClick={handleAnalyze}
                disabled={loading || !inputText}
                className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-bold transition-all disabled:opacity-50 shadow-lg hover:shadow-orange-500/30 text-sm md:text-base"
              >
                {loading ? content.btnLoading : content.btnAnalyze} 
                {!loading && <Search className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {result && (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl mx-auto animate-in slide-in-from-bottom-10 mt-6">
             
             <div className="liquid-glass p-4 border-t-4 border-orange-500 bg-white/60 dark:bg-black/40 backdrop-blur-md rounded-xl">
              <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-60 flex justify-center gap-2 items-center text-gray-800 dark:text-gray-200">
                <BrainCircuit size={12}/> {content.resMBTI}
              </h3>
              <div className="text-3xl font-black text-orange-600 mt-1">{result.mbti_type}</div>
            </div>
            
            <div className="liquid-glass p-4 border-t-4 border-green-500 bg-white/60 dark:bg-black/40 backdrop-blur-md rounded-xl">
              <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-60 flex justify-center gap-2 items-center text-gray-800 dark:text-gray-200">
                <Smile size={12}/> {content.resSentiment}
              </h3>
              <div className="text-xl font-bold mt-1 capitalize text-green-600 dark:text-green-400 truncate">
                {result.emotion ? result.emotion[lang] : result.sentiment}
              </div>
            </div>
            
            <div className="liquid-glass p-4 border-t-4 border-blue-500 bg-white/60 dark:bg-black/40 backdrop-blur-md rounded-xl">
              <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-60 flex justify-center gap-2 items-center text-gray-800 dark:text-gray-200">
                <Tag size={12}/> {content.resKeywords}
              </h3>
              <div className="flex flex-wrap gap-2 justify-center items-center mt-3 w-full">
                {result.keywords.slice(0, 3).map((k: string, i: number) => (
                  <span key={i} className="bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full text-xs font-bold text-orange-700 dark:text-orange-200 border border-orange-200 dark:border-orange-800/50">
                    {k}
                  </span>
                ))}
              </div>
            </div>

           </div>
        )}

        {!result && (
          <div className="mt-16 w-full max-w-3xl mx-auto animate-in slide-in-from-bottom-10 delay-200">
            <h3 className="text-lg font-bold text-center mb-6 text-gray-500 uppercase tracking-widest text-xs">
              {content.guideTitle}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {content.guides.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm hover:bg-auto/50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center mb-3 mx-auto">
                    <item.icon size={16} />
                  </div>
                  <h4 className="font-bold text-sm mb-1 text-gray-800 dark:text-gray-200">{item.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}