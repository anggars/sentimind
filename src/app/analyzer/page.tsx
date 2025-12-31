"use client";
import { useState } from "react";
import { useLanguage } from "@/app/providers";
import { Search, Tag, Smile, BrainCircuit, Lightbulb, BookOpen, MessageSquare, FileText, Youtube, Eye, AlertCircle } from "lucide-react";

export default function AnalysisPage() {
  const { lang } = useLanguage();
  const [mode, setMode] = useState<"text" | "youtube">("text"); 
  
  const [inputText, setInputText] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState(""); 
  
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [errorType, setErrorType] = useState<string | null>(null);
  const [backendErrorMsg, setBackendErrorMsg] = useState(""); 

  const t = {
    en: {
      title: "Text Analyzer",
      desc: "Paste your text or YouTube link. Let AI decode the personality.",
      placeholder: "Type your story here...",
      btnAnalyze: "Analyze Now",
      btnLoading: "Processing...",
      resMBTI: "MBTI Type",
      resSentiment: "Dominant Emotion",
      resKeywords: "Top Keywords",
      // GANTI LABEL BIAR JUJUR
      resContent: "Analyzed Content", 
      
      errEmptyText: "Please enter some text first!",
      errEmptyYoutube: "Please paste a YouTube URL!",
      errInvalidYoutube: "Invalid YouTube URL format.",
      errConnection: "Failed to connect to AI Server.",
      errNoTranscript: "This video has no subtitles/transcript to analyze.",
      
      modeText: "Text Input",
      modeYoutube: "YouTube Video",
      ytPlaceholder: "Paste YouTube Link (e.g., https://youtu.be/...)",
      ytTip: "Tip: Works best on videos with spoken words (podcasts, vlogs).",
      btnYoutube: "Analyze Video",
      
      guideTitle: "How to get accurate results?",
      guides: [
        { icon: MessageSquare, title: "Be Expressive", text: "Write naturally about your feelings, opinions, or daily life experiences." },
        { icon: BookOpen, title: "Length Matters", text: "Try to write at least 2-3 sentences. Short texts like 'Hello' won't reveal much." },
        { icon: Lightbulb, title: "Honesty is Key", text: "Don't overthink it. The AI analyzes your subconscious writing style." }
      ]
    },
    id: {
      title: "Analisis Teks",
      desc: "Tempel curhatan atau link YouTube. Biar AI yang bedah kepribadiannya.",
      placeholder: "Tulis cerita atau unek-unek lo di sini...",
      btnAnalyze: "Analisis Sekarang",
      btnLoading: "Lagi Nonton...",
      resMBTI: "Tipe MBTI",
      resSentiment: "Mood Dominan",
      resKeywords: "Kata Kunci",
      // GANTI LABEL BIAR JUJUR
      resContent: "Data Video & Komentar",
      
      errEmptyText: "Eits, isi dulu dong teksnya!",
      errEmptyYoutube: "Link YouTube-nya mana?",
      errInvalidYoutube: "Link YouTube-nya gak valid nih.",
      errConnection: "Yah, gagal connect ke server nih.",
      errNoTranscript: "Video ini gak ada subtitle-nya, cari yang lain gih.",
      
      modeText: "Tulis Manual",
      modeYoutube: "Link YouTube",
      ytPlaceholder: "Tempel Link YouTube (misal: https://youtu.be/...)",
      ytTip: "Tips: Paling mantep buat video podcast, vlog, atau opini.",
      btnYoutube: "Bedah Video",
      
      guideTitle: "Biar Hasilnya Akurat",
      guides: [
        { icon: MessageSquare, title: "Yang Ekspresif Dong", text: "Tulis aja secara natural soal perasaan atau opini lo. Gak usah jaim." },
        { icon: BookOpen, title: "Jangan Pendek-pendek", text: "Minimal 2-3 kalimat lah. Kalau cuma 'Halo' doang, AI-nya bakal bingung." },
        { icon: Lightbulb, title: "Jujur Itu Kunci", text: "Gak usah overthink. AI bakal baca pola penulisan bawah sadar lo." }
      ]
    }
  };

  const content = t[lang];

  // --- HELPER BUAT AMBIL ID YOUTUBE DARI LINK ---
  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getErrorMessage = () => {
    if (!errorType) return "";
    if (errorType === "EMPTY_TEXT") return content.errEmptyText;
    if (errorType === "EMPTY_YOUTUBE") return content.errEmptyYoutube;
    if (errorType === "INVALID_YOUTUBE") return content.errInvalidYoutube;
    if (errorType === "CONNECTION") return content.errConnection;
    
    if (errorType === "BACKEND_ERROR") {
        if (backendErrorMsg === "NO_TRANSCRIPT") return content.errNoTranscript;
        return backendErrorMsg || content.errConnection;
    }
    return "";
  };

  const currentErrorMsg = getErrorMessage();

  const handleAnalyze = async () => {
    setErrorType(null);
    setBackendErrorMsg("");
    setResult(null);

    // --- VALIDASI YOUTUBE ---
    if (mode === "youtube") {
        if (!youtubeUrl.trim()) {
            setErrorType("EMPTY_YOUTUBE");
            return;
        }
        const videoId = extractVideoId(youtubeUrl);
        if (!videoId) {
            setErrorType("INVALID_YOUTUBE");
            return;
        }
        
        // Panggil API dengan Video ID
        setLoading(true);
        try {
            const res = await fetch(`/api/youtube/${videoId}`, { method: "GET" });
            const data = await res.json();
            if (data.success) {
                setResult(data);
            } else {
                setBackendErrorMsg(data.error);
                setErrorType("BACKEND_ERROR");
            }
        } catch (err) {
            setErrorType("CONNECTION");
        } finally {
            setLoading(false);
        }
        return;
    }

    // --- VALIDASI TEXT ---
    if (mode === "text") {
        if (!inputText.trim()) {
            setErrorType("EMPTY_TEXT");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: inputText }),
            });
            const data = await res.json();
            if (data.success) {
                setResult(data);
            } else {
                setBackendErrorMsg(data.error);
                setErrorType("BACKEND_ERROR");
            }
        } catch (err) {
            setErrorType("CONNECTION");
        } finally {
            setLoading(false);
        }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAnalyze();
    }
  };

  const getKeywords = () => {
    if (!result?.keywords) return [];
    if (Array.isArray(result.keywords)) return result.keywords;
    return lang === 'id' ? result.keywords.id : result.keywords.en;
  };

  const currentKeywords = getKeywords();

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

        {/* --- TOMBOL SWITCH MODE (TEXT vs YOUTUBE) --- */}
        <div className="grid grid-cols-2 gap-3 mt-8 w-full max-w-[340px] mx-auto">
            <button 
              onClick={() => { setMode("text"); setResult(null); setErrorType(null); }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-full font-bold text-sm transition-all border border-transparent
                ${mode === "text" 
                  ? "bg-orange-600 text-white shadow-lg shadow-orange-500/20" 
                  : "bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-white/10"}`}
            >
              <FileText size={16}/> {content.modeText}
            </button>
            <button 
              onClick={() => { setMode("youtube"); setResult(null); setErrorType(null); }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-full font-bold text-sm transition-all border border-transparent
                ${mode === "youtube" 
                  ? "bg-[#FF0000] text-white shadow-lg shadow-[#FF0000]/20" 
                  : "bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-white/10"}`}
            >
              <Youtube size={16}/> {content.modeYoutube}
            </button>
        </div>

        <div className="liquid-glass p-1.5 shadow-2xl mt-6 max-w-3xl mx-auto w-full"> 
          <div className="bg-white/50 dark:bg-black/20 rounded-xl p-4 backdrop-blur-sm">
             
             {/* AREA INPUT */}
             <div className="min-h-[140px] flex flex-col justify-center">
               {mode === "text" ? (
                  <textarea
                    value={inputText}
                    onChange={(e) => { setInputText(e.target.value); setErrorType(null); }}
                    onKeyDown={handleKeyDown}
                    placeholder={content.placeholder}
                    className="w-full bg-transparent outline-none text-base md:text-lg h-full resize-none placeholder:text-gray-400 dark:text-white text-gray-900"
                    style={{ minHeight: '140px' }} 
                  />
               ) : (
                  <div className="py-2 px-2 w-full">
                    <div className="relative flex items-center">
                      <div className="absolute left-4 text-gray-400 pointer-events-none">
                        <Youtube size={20} />
                      </div>
                      <input
                        type="text"
                        value={youtubeUrl}
                        onChange={(e) => { setYoutubeUrl(e.target.value); setErrorType(null); }}
                        onKeyDown={handleKeyDown}
                        placeholder={content.ytPlaceholder}
                        className="w-full bg-white/50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl py-4 pl-12 pr-4 text-lg font-medium focus:border-[#FF0000] focus:ring-2 focus:ring-[#FF0000]/20 focus:outline-none transition-all text-gray-800 dark:text-white placeholder:text-gray-400"
                      />
                    </div>
                    <p className="text-xs text-left mt-3 ml-1 text-gray-500 dark:text-gray-400 flex items-center gap-1 pl-1">
                      <Lightbulb size={12} className="text-yellow-500"/> {content.ytTip}
                    </p>
                  </div>
               )}
             </div>

            {/* ERROR MSG */}
            {currentErrorMsg && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={20} className="shrink-0" />
                <span className="text-sm font-bold text-left">{currentErrorMsg}</span>
              </div>
            )}

            <div className="flex justify-end mt-4 pt-2 border-t border-gray-500/10">
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className={`flex items-center gap-2 text-white px-6 py-2 rounded-lg font-bold transition-all disabled:opacity-50 shadow-lg text-sm md:text-base
                  ${mode === "youtube" 
                    ? "bg-[#FF0000] hover:bg-red-700 hover:shadow-[#FF0000]/30" 
                    : "bg-orange-600 hover:bg-orange-700 hover:shadow-orange-500/30"}`}
              >
                {loading ? content.btnLoading : (mode === "youtube" ? content.btnYoutube : content.btnAnalyze)} 
                {!loading && <Search className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* HASIL */}
        {result && (
           <div className="w-full max-w-3xl mx-auto animate-in slide-in-from-bottom-10 mt-6 space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {/* MBTI */}
               <div className="liquid-glass p-4 border-t-4 border-orange-500 bg-white/60 dark:bg-black/40 backdrop-blur-md rounded-xl flex flex-col h-full">
                 <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-60 flex justify-center gap-2 items-center text-gray-800 dark:text-gray-200 mb-2">
                   <BrainCircuit size={12}/> {content.resMBTI}
                 </h3>
                 <div className="flex-1 flex items-center justify-center">
                    <div className="text-3xl font-black text-orange-600">{result.mbti_type}</div>
                 </div>
               </div>
               {/* EMOTION */}
               <div className="liquid-glass p-4 border-t-4 border-green-500 bg-white/60 dark:bg-black/40 backdrop-blur-md rounded-xl flex flex-col h-full">
                 <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-60 flex justify-center gap-2 items-center text-gray-800 dark:text-gray-200 mb-2">
                   <Smile size={12}/> {content.resSentiment}
                 </h3>
                 <div className="flex-1 flex items-center justify-center">
                    <div className="text-xl font-bold capitalize text-green-600 dark:text-green-400 truncate px-2 text-center">
                       {result.emotion ? (result.emotion[lang] || result.emotion.id || result.emotion) : result.sentiment}
                    </div>
                 </div>
               </div>
               {/* KEYWORDS */}
               <div className="liquid-glass p-4 border-t-4 border-blue-500 bg-white/60 dark:bg-black/40 backdrop-blur-md rounded-xl h-full flex flex-col">
                 <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-60 flex justify-center gap-2 items-center text-gray-800 dark:text-gray-200 mb-3">
                   <Tag size={12}/> {content.resKeywords}
                 </h3>
                 <div className="flex flex-wrap gap-2 justify-center items-center w-full">
                   {currentKeywords.slice(0, 3).map((k: string, i: number) => (
                     <span key={i} className="bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full text-xs font-bold text-orange-700 dark:text-orange-200 border border-orange-200 dark:border-orange-800/50 capitalize">
                       {k}
                     </span>
                   ))}
                 </div>
               </div>
             </div>

             {/* PREVIEW CONTENT */}
             {result.fetched_text && (
                <div className="liquid-glass p-6 bg-white/40 dark:bg-black/20 backdrop-blur-sm rounded-xl text-left border border-gray-200 dark:border-white/5">
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2 text-gray-500">
                    <Eye size={14}/> {content.resContent}
                  </h3>
                  <div className="bg-gray-50 dark:bg-black/40 p-4 rounded-lg max-h-60 overflow-y-auto text-sm text-gray-600 dark:text-gray-300 leading-relaxed border border-gray-100 dark:border-white/5 whitespace-pre-wrap font-mono">
                    {result.fetched_text}
                  </div>
                </div>
             )}
           </div>
        )}
        
        {/* GUIDES */}
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