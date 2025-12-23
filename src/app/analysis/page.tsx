"use client";
import { useState } from "react";
import { useLanguage } from "@/app/providers";
import { Search, Tag, Smile, BrainCircuit } from "lucide-react";

export default function AnalysisPage() {
  const { lang } = useLanguage();
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const t = {
    en: {
      title: "AI Text Analyzer",
      desc: "Paste your tweet, story, or diary. Let AI do the mining.",
      placeholder: "Type your story here...",
      btnAnalyze: "Analyze Now",
      btnLoading: "Processing...",
      resMBTI: "MBTI Type",
      resSentiment: "Sentiment",
      resKeywords: "Top Keywords",
      error: "Failed to connect to AI Server."
    },
    id: {
      title: "Analisis Teks AI",
      desc: "Tempel tweet, cerita, atau buku harianmu. Biarkan AI menggali datanya.",
      placeholder: "Ketik ceritamu di sini...",
      btnAnalyze: "Analisis Sekarang",
      btnLoading: "Memproses...",
      resMBTI: "Tipe MBTI",
      resSentiment: "Sentimen",
      resKeywords: "Kata Kunci Utama",
      error: "Gagal terhubung ke Server AI."
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

  return (
    // FIX: space-y-6 diganti space-y-2 biar gak kejauhan sama Title
    <div className="min-h-[calc(100vh-10rem)] flex flex-col justify-center font-sans relative overflow-hidden">
      
      <div className="max-w-4xl mx-auto w-full text-center space-y-2 animate-in fade-in zoom-in duration-500 z-10 px-4">
        {/* Title tetep pake pb-2 biar 'y' gak kepotong, tapi space-y container udah dikurangin */}
        <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500 pb-2">
          {content.title}
        </h1>
        <p className="opacity-60 text-sm md:text-lg">{content.desc}</p>

        {/* INPUT AREA */}
        <div className="liquid-glass p-1.5 shadow-2xl mt-6"> 
        {/* ^^^ Ditambah mt-6 biar inputnya tetep ada jarak dari teks deskripsi */}
          <div className="bg-white/50 dark:bg-black/20 rounded-xl p-4 md:p-6 backdrop-blur-sm">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={content.placeholder}
              className="w-full bg-transparent outline-none text-base md:text-lg min-h-[150px] md:min-h-[180px] resize-none placeholder:text-gray-400"
            />
            <div className="flex justify-end mt-4 pt-4 border-t border-gray-500/10">
              <button
                onClick={handleAnalyze}
                disabled={loading || !inputText}
                className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg hover:shadow-orange-500/30 w-full md:w-auto justify-center"
              >
                {loading ? content.btnLoading : content.btnAnalyze} 
                {!loading && <Search className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* RESULT GRID */}
        {result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full animate-in slide-in-from-bottom-10">
            {/* MBTI */}
            <div className="liquid-glass p-5 border-t-4 border-orange-500 bg-white/40 dark:bg-black/40">
              <h3 className="text-xs font-bold uppercase tracking-widest opacity-60 flex justify-center gap-2 items-center">
                <BrainCircuit size={14}/> {content.resMBTI}
              </h3>
              <div className="text-4xl font-black text-orange-600 mt-3">{result.mbti_type}</div>
            </div>
            {/* SENTIMENT */}
            <div className="liquid-glass p-5 border-t-4 border-green-500 bg-white/40 dark:bg-black/40">
              <h3 className="text-xs font-bold uppercase tracking-widest opacity-60 flex justify-center gap-2 items-center">
                <Smile size={14}/> {content.resSentiment}
              </h3>
              <div className="text-2xl font-bold mt-3">{result.sentiment}</div>
            </div>
            {/* KEYWORDS */}
            <div className="liquid-glass p-5 border-t-4 border-blue-500 bg-white/40 dark:bg-black/40">
              <h3 className="text-xs font-bold uppercase tracking-widest opacity-60 flex justify-center gap-2 items-center">
                <Tag size={14}/> {content.resKeywords}
              </h3>
              <div className="flex flex-wrap gap-2 justify-center mt-3">
                {result.keywords.map((k: string, i: number) => (
                  <span key={i} className="bg-orange-100 dark:bg-orange-900/40 px-2.5 py-1 rounded-full text-xs font-medium text-orange-800 dark:text-orange-200">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}