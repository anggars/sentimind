"use client";
import { useState } from "react";
import { useLanguage } from "@/app/providers";
import {
  Search,
  Tag,
  Smile,
  BrainCircuit,
  Lightbulb,
  BookOpen,
  MessageSquare,
  FileText,
  Youtube,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AnalysisPage() {
  const { lang } = useLanguage();
  const [mode, setMode] = useState<"text" | "youtube">("text");

  const [inputText, setInputText] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [errorType, setErrorType] = useState<string | null>(null);
  const [backendErrorMsg, setBackendErrorMsg] = useState("");
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);

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
        {
          icon: MessageSquare,
          title: "Be Expressive",
          text: "Write naturally about your feelings, opinions, or daily life experiences.",
        },
        {
          icon: BookOpen,
          title: "Length Matters",
          text: "Try to write at least 2-3 sentences. Short texts like 'Hello' won't reveal much.",
        },
        {
          icon: Lightbulb,
          title: "Honesty is Key",
          text: "Don't overthink it. The AI analyzes your subconscious writing style.",
        },
      ],
    },
    id: {
      title: "Analisis Teks",
      desc: "Tempel curhatan atau link YouTube. Biar AI yang bedah kepribadiannya.",
      placeholder: "Tulis cerita atau unek-unek lo di sini...",
      btnAnalyze: "Analisis Sekarang",
      btnLoading: "Lagi Mikir...",
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
        {
          icon: MessageSquare,
          title: "Yang Ekspresif Dong",
          text: "Tulis aja secara natural soal perasaan atau opini lo. Gak usah jaim.",
        },
        {
          icon: BookOpen,
          title: "Jangan Pendek-pendek",
          text: "Minimal 2-3 kalimat lah. Kalau cuma 'Halo' doang, AI-nya bakal bingung.",
        },
        {
          icon: Lightbulb,
          title: "Jujur Itu Kunci",
          text: "Gak usah overthink. AI bakal baca pola penulisan bawah sadar lo.",
        },
      ],
    },
  };

  const content = t[lang];

  // --- HELPER BUAT AMBIL ID YOUTUBE DARI LINK ---
  const extractVideoId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
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
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const res = await fetch(`${apiUrl}/api/youtube/${videoId}`, {
          method: "GET",
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
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const res = await fetch(`${apiUrl}/api/predict`, {
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

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      const isMobile = window.innerWidth < 768;
      if (mode === "text" && isMobile) {
        return;
      }
      e.preventDefault();
      handleAnalyze();
    }
  };

  const getKeywords = () => {
    if (!result?.keywords) return [];
    if (Array.isArray(result.keywords)) return result.keywords;
    return lang === "id" ? result.keywords.id : result.keywords.en;
  };

  const currentKeywords = getKeywords();

  return (
    <div className="w-full pt-28 pb-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl mx-auto text-center space-y-4 z-10"
      >
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
            onClick={() => {
              setMode("text");
              setResult(null);
              setErrorType(null);
            }}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-full font-bold text-sm transition-all border border-transparent
                ${
                  mode === "text"
                    ? "bg-orange-600 text-white shadow-lg shadow-orange-500/20"
                    : "bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-white/10"
                }`}
          >
            <FileText size={16} /> {content.modeText}
          </button>
          <button
            onClick={() => {
              setMode("youtube");
              setResult(null);
              setErrorType(null);
            }}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-full font-bold text-sm transition-all border border-transparent
                ${
                  mode === "youtube"
                    ? "bg-[#FF0000] text-white shadow-lg shadow-[#FF0000]/20"
                    : "bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-white/10"
                }`}
          >
            <Youtube size={16} /> {content.modeYoutube}
          </button>
        </div>

        <div className="liquid-glass p-1.5 shadow-2xl mt-6 max-w-3xl mx-auto w-full">
          <div className="bg-white/50 dark:bg-black/20 rounded-xl p-4 backdrop-blur-sm">
            {/* AREA INPUT */}
            <div className="min-h-[140px] flex flex-col justify-center">
              {mode === "text" ? (
                <textarea
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    setErrorType(null);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder={content.placeholder}
                  className="w-full bg-transparent outline-none text-base md:text-lg h-full resize-none placeholder:text-gray-400 dark:text-white text-gray-900"
                  style={{ minHeight: "140px" }}
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
                      onChange={(e) => {
                        setYoutubeUrl(e.target.value);
                        setErrorType(null);
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder={content.ytPlaceholder}
                      className="w-full bg-white/50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl py-4 pl-12 pr-4 text-lg font-medium focus:border-[#FF0000] focus:ring-2 focus:ring-[#FF0000]/20 focus:outline-none transition-all text-gray-800 dark:text-white placeholder:text-gray-400"
                    />
                  </div>
                  <p className="text-xs text-left mt-3 ml-1 text-gray-500 dark:text-gray-400 flex items-center gap-1 pl-1">
                    <Lightbulb size={12} className="text-yellow-500" />{" "}
                    {content.ytTip}
                  </p>
                </div>
              )}
            </div>

            {/* ERROR MSG */}
            <AnimatePresence>
              {currentErrorMsg && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-600 dark:text-red-400 overflow-hidden"
                >
                  <AlertCircle size={20} className="shrink-0" />
                  <span className="text-sm font-bold text-left">
                    {currentErrorMsg}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-end mt-4 pt-2 border-t border-gray-500/10">
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className={`flex items-center gap-2 text-white px-6 py-2 rounded-lg font-bold transition-all disabled:opacity-50 shadow-lg text-sm md:text-base
                  ${
                    mode === "youtube"
                      ? "bg-[#FF0000] hover:bg-red-700 hover:shadow-[#FF0000]/30"
                      : "bg-orange-600 hover:bg-orange-700 hover:shadow-orange-500/30"
                  }`}
              >
                {loading
                  ? content.btnLoading
                  : mode === "youtube"
                  ? content.btnYoutube
                  : content.btnAnalyze}
                {!loading && <Search className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* HASIL */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 20 }}
              className="w-full max-w-3xl mx-auto mt-6 space-y-4 text-left"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* MBTI */}
                {/* MBTI */}
                <div className="liquid-glass p-5 border-t-4 border-orange-500 bg-white/60 dark:bg-black/40 backdrop-blur-md rounded-xl flex flex-col h-full group hover:bg-white/80 dark:hover:bg-white/5 transition-all">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-60 flex justify-center gap-2 items-center text-gray-800 dark:text-gray-200 mb-0 border-b border-gray-100 dark:border-white/5 pb-3">
                    <BrainCircuit size={12} /> {content.resMBTI}
                  </h3>
                  <div className="flex-1 flex flex-col items-center justify-center gap-3">
                    <div className="text-4xl font-black text-orange-600 tracking-tight">
                      {result.mbti_type}
                    </div>
                  </div>

                  {/* Footer Reasoning */}
                  {result.reasoning && (
                    <div className="mt-auto pt-3 border-t border-orange-100 dark:border-white/5 w-full">
                      <p className="text-[10px] text-center text-gray-500 dark:text-gray-400 leading-relaxed px-2 font-medium italic">
                        {result.reasoning.mbti?.[lang] ||
                          "Analisis kepribadian mendalam."}
                      </p>
                    </div>
                  )}
                </div>

                {/* EMOTION */}
                <div className="liquid-glass p-5 border-t-4 border-green-500 bg-white/60 dark:bg-black/40 backdrop-blur-md rounded-xl flex flex-col h-full group hover:bg-white/80 dark:hover:bg-white/5 transition-all">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-60 flex justify-center gap-2 items-center text-gray-800 dark:text-gray-200 mb-0 border-b border-gray-100 dark:border-white/5 pb-3">
                    <Smile size={12} /> {content.resSentiment}
                  </h3>

                  <div className="flex-1 flex flex-col items-center justify-center gap-3 w-full">
                    {/* Unified Top 3 List (Badge Style like Keywords) */}
                    {result.emotion?.list ? (
                      <div className="flex flex-wrap gap-2 justify-center items-center w-full">
                        {result.emotion.list.map((item: any, idx: number) => (
                          <span
                            key={idx}
                            className="bg-green-100 dark:bg-green-900/30 px-3 py-1.5 rounded-full text-xs font-bold text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800/50 capitalize shadow-sm"
                          >
                            {lang === "id" ? item.id : item.en}{" "}
                            {Math.round(item.score * 100)}%
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-2xl font-bold capitalize text-green-600 dark:text-green-400 truncate px-2 text-center">
                        {result.emotion
                          ? result.emotion[lang] ||
                            result.emotion.id ||
                            result.emotion
                          : result.sentiment}
                      </div>
                    )}
                  </div>

                  {/* Footer Reasoning */}
                  {result.reasoning && (
                    <div className="mt-auto pt-3 border-t border-green-100 dark:border-green-800/20 w-full">
                      <p className="text-[10px] text-center text-gray-500 dark:text-gray-400 italic leading-relaxed px-2 font-medium">
                        {result.reasoning.emotion?.[lang] ||
                          "Analisis sentimen teks."}
                      </p>
                    </div>
                  )}
                </div>

                {/* KEYWORDS */}
                <div className="liquid-glass p-5 border-t-4 border-blue-500 bg-white/60 dark:bg-black/40 backdrop-blur-md rounded-xl h-full flex flex-col group hover:bg-white/80 dark:hover:bg-white/5 transition-all">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-60 flex justify-center gap-2 items-center text-gray-800 dark:text-gray-200 mb-0 border-b border-gray-100 dark:border-white/5 pb-3">
                    <Tag size={12} /> {content.resKeywords}
                  </h3>
                  <div className="flex-1 flex flex-col items-center justify-center gap-3">
                    <div className="flex flex-wrap gap-2 justify-center items-center w-full">
                      {currentKeywords
                        .slice(0, 3)
                        .map((k: string, i: number) => (
                          <span
                            key={i}
                            className="bg-orange-100 dark:bg-orange-900/30 px-3 py-1.5 rounded-full text-xs font-bold text-orange-700 dark:text-orange-200 border border-orange-200 dark:border-orange-800/50 capitalize shadow-sm"
                          >
                            {k}
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* Footer Reasoning */}
                  {result.reasoning && (
                    <div className="mt-auto pt-3 border-t border-blue-100 dark:border-white/5 w-full">
                      <p className="text-[10px] text-center text-gray-500 dark:text-gray-400 italic font-medium">
                        {result.reasoning.keywords?.[lang] ||
                          "Kata kunci dominan."}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* PREVIEW CONTENT - YouTube Style */}
              {(result.video || result.fetched_text) && (
                <div className="space-y-4">
                  {/* YouTube Video Card with Thumbnail */}
                  {result.video && (
                    <div className="liquid-glass overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10">
                      {/* Thumbnail */}
                      {result.video.thumbnail && (
                        <div className="relative aspect-video bg-black">
                          <img
                            src={result.video.thumbnail}
                            alt={result.video.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium">
                            YouTube
                          </div>
                        </div>
                      )}

                      {/* Video Info */}
                      <div className="p-5 bg-white/60 dark:bg-black/40">
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-2">
                          {result.video.title}
                        </h4>

                        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-4">
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {result.video.channel}
                          </span>
                          <span>•</span>
                          <span>
                            {Number(result.video.viewCount).toLocaleString()}{" "}
                            views
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp size={14} />{" "}
                            {Number(result.video.likeCount).toLocaleString()}
                          </span>
                        </div>

                        {/* Description */}
                        <div className="bg-gray-100 dark:bg-white/5 p-4 rounded-xl">
                          <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {showFullDesc
                              ? result.video.description
                              : result.video.description?.slice(0, 250)}
                            {result.video.description?.length > 250 &&
                              !showFullDesc &&
                              "..."}
                          </div>
                          {result.video.description?.length > 250 && (
                            <button
                              onClick={() => setShowFullDesc(!showFullDesc)}
                              className="mt-2 text-sm font-bold text-blue-600 hover:text-blue-700"
                            >
                              {showFullDesc ? "Show less" : "Show more"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Comments Section - YouTube Style */}
                  {result.comments && result.comments.length > 0 && (
                    <div className="liquid-glass p-5 bg-white/60 dark:bg-black/40 rounded-2xl border border-gray-200 dark:border-white/10">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <MessageSquare size={16} />
                        {result.comments.length} Comments
                      </h3>

                      <div className="space-y-4">
                        {(showAllComments
                          ? result.comments
                          : result.comments.slice(0, 5)
                        ).map((comment: any, idx: number) => (
                          <div key={idx} className="flex gap-3">
                            {/* Avatar */}
                            {comment.authorImage ? (
                              <img
                                src={comment.authorImage}
                                alt={comment.author}
                                className="w-10 h-10 rounded-full shrink-0 object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                                {comment.author?.charAt(0).toUpperCase() || "A"}
                              </div>
                            )}

                            {/* Comment Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {comment.author}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {comment.publishedAt &&
                                    new Date(
                                      comment.publishedAt
                                    ).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                {comment.text}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <span className="flex items-center gap-1 hover:text-gray-700 cursor-pointer">
                                  <ThumbsUp size={14} />{" "}
                                  {comment.likeCount || 0}
                                </span>
                                <span className="flex items-center gap-1 hover:text-gray-700 cursor-pointer">
                                  <ThumbsDown size={14} />
                                </span>
                                {comment.replyCount > 0 && (
                                  <span className="text-blue-600 font-medium">
                                    {comment.replyCount} replies
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {result.comments.length > 5 && (
                        <button
                          onClick={() => setShowAllComments(!showAllComments)}
                          className="mt-4 w-full py-3 text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded-xl transition-colors"
                        >
                          {showAllComments
                            ? "▲ Show Less"
                            : `▼ View all ${result.comments.length} comments`}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Fallback for transcript-only data */}
                  {!result.video && result.fetched_text && (
                    <div className="liquid-glass p-5 bg-white/60 dark:bg-black/40 rounded-2xl border border-gray-200 dark:border-white/10">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <FileText size={16} /> Transcript
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {result.fetched_text}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* GUIDES */}
        {!result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-16 w-full max-w-3xl mx-auto"
          >
            <h3 className="text-lg font-bold text-center mb-6 text-gray-500 uppercase tracking-widest text-xs">
              {content.guideTitle}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              {content.guides.map((item, idx) => (
                <div
                  key={idx}
                  className="group p-6 border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  <div className="p-2.5 bg-orange-100 dark:bg-orange-500/20 w-fit rounded-lg mb-4 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-5 h-5" />
                  </div>

                  <h4 className="text-sm font-bold mb-2 text-gray-900 dark:text-white tracking-tight">
                    {item.title}
                  </h4>

                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
