"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/app/providers";
import Link from "next/link";
import { mbtiDatabase } from "@/data/mbti";
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Send,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Question = {
  id: number;
  text_id: string;
  text_en: string;
};

const QUESTIONS_PER_PAGE = 5;

export default function QuizPage() {
  const { lang } = useLanguage();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const t = {
    en: {
      loading: "Loading questions...",
      title: "Personality Quiz",
      subtitle: "Answer honestly to reveal your true type.",
      questionLabel: "Question",
      agree: "Agree",
      disagree: "Disagree",
      result: "Your Result:",
      retry: "Retake Quiz",
      submitError: "Failed to calculate result.",
      infoTitle: "Things to know",
      prev: "Previous",
      next: "Next",
      submit: "Submit Quiz",
      progress: "Page",
      infos: [
        { icon: Clock, text: "Takes about 5 minutes." },
        { icon: CheckCircle2, text: "Answer instinctively." },
        { icon: ShieldCheck, text: "No right or wrong answers." },
      ],
    },
    id: {
      loading: "Lagi nyiapin soal...",
      title: "Kuis Kepribadian",
      subtitle: "Jawab jujur ya, biar tipe aslinya ketahuan.",
      questionLabel: "Pertanyaan",
      agree: "Setuju",
      disagree: "Gak Setuju",
      result: "Hasil Kamu:",
      retry: "Ulangi Tes",
      submitError: "Gagal ngitung hasil nih.",
      infoTitle: "Info Penting",
      prev: "Sebelumnya",
      next: "Lanjut",
      submit: "Lihat Hasil",
      progress: "Halaman",
      infos: [
        { icon: Clock, text: "Sekitar 5 menitan." },
        { icon: CheckCircle2, text: "Jawab spontan aja." },
        { icon: ShieldCheck, text: "Gak ada jawaban salah." },
      ],
    },
  };

  const content = t[lang];

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
    fetch(`${apiUrl}/api/quiz`)
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.questions || []);
        setLoading(false);
      });
  }, []);

  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  const currentQuestions = questions.slice(
    currentPage * QUESTIONS_PER_PAGE,
    (currentPage + 1) * QUESTIONS_PER_PAGE
  );

  const handleAnswer = (qId: number, val: number) => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const isPageComplete = currentQuestions.every(
    (q) => answers[q.id] !== undefined
  );

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      submitAnswers();
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const submitAnswers = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${apiUrl}/api/quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: answers }),
      });
      const data = await res.json();
      setResult(data.mbti);
    } catch (e) {
      alert(content.submitError);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !result)
    return (
      <div className="pt-40 flex items-center justify-center font-bold text-orange-600 animate-pulse">
        {content.loading}
      </div>
    );

  if (result) {
    const data = mbtiDatabase[result];
    const contentData = lang === "en" ? data?.en : data?.id;

    return (
      <div className="w-full pt-28 pb-12 flex flex-col justify-center items-center font-sans relative px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="liquid-glass p-8 md:p-12 text-center bg-white/40 dark:bg-black/20 border border-white/20 max-w-2xl w-full rounded-3xl shadow-2xl"
        >
          <h2 className="text-sm font-bold opacity-60 uppercase tracking-widest text-gray-800 dark:text-gray-200 mb-4">
            {content.result}
          </h2>

          <div
            className={`p-6 rounded-2xl border-2 bg-white/50 dark:bg-black/40 backdrop-blur-md mb-8 ${
              data?.color || "border-gray-500"
            }`}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 mb-2"
            >
              {result}
            </motion.div>
            <h3 className={`text-2xl font-bold mb-2 ${data?.textColor}`}>
              {contentData?.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base line-clamp-3">
              {contentData?.desc}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/types/${result}`}
              className="px-8 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg hover:shadow-orange-500/30"
            >
              {lang === "en" ? "Read Full Profile" : "Baca Profil Lengkap"}
            </Link>

            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 rounded-xl font-bold hover:bg-gray-100 dark:hover:bg-white/20 transition-all text-gray-900 dark:text-white"
            >
              {content.retry}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (questions.length === 0) return null;

  return (
    <div className="w-full pt-28 pb-12 px-4 sm:px-6 lg:px-8 font-sans flex flex-col items-center">
      <div className="max-w-3xl w-full z-10">
        {/* HEADER */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500 pb-2 mb-2">
            {content.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-lg max-w-2xl mx-auto">
            {content.subtitle}
          </p>
        </motion.div>

        {/* PROGRESS BAR */}
        <div className="w-full mb-8">
          <div className="flex justify-between text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
            <span>
              {content.progress} {currentPage + 1} / {totalPages}
            </span>
            <span>{Math.round((currentPage / totalPages) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
              className="h-full bg-orange-500 rounded-full"
            />
          </div>
        </div>

        {/* QUESTIONS LIST (PAGINATED) */}
        <div className="space-y-8">
          {currentQuestions.map((q, idx) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="liquid-glass p-6 md:p-8 bg-white/50 dark:bg-black/30 backdrop-blur-md shadow-lg border border-white/20 rounded-3xl"
            >
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-widest opacity-50 text-gray-700 dark:text-gray-300 block mb-2">
                  {content.questionLabel}{" "}
                  {currentPage * QUESTIONS_PER_PAGE + idx + 1}
                </span>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white leading-snug">
                  {lang === "en" ? q.text_en : q.text_id}
                </h3>
              </div>

              {/* SCALE INPUT */}
              <div className="relative pt-6">
                <div className="hidden md:flex justify-between absolute top-0 w-full text-[10px] font-bold opacity-60 px-2 uppercase tracking-wider">
                  <span className="text-red-500">{content.disagree}</span>
                  <span className="text-green-500">{content.agree}</span>
                </div>

                <div className="flex justify-between items-center gap-2">
                  {[-3, -2, -1, 0, 1, 2, 3].map((val) => (
                    <button
                      key={val}
                      onClick={() => handleAnswer(q.id, val)}
                      className={`
                                        group relative rounded-full transition-all duration-200 flex items-center justify-center
                                        ${
                                          val === 0
                                            ? "w-8 h-8 md:w-10 md:h-10 border-2 border-gray-300 text-gray-400"
                                            : "w-10 h-10 md:w-14 md:h-14 border-2"
                                        }
                                        ${
                                          answers[q.id] === val
                                            ? "scale-110 ring-4 ring-orange-200 dark:ring-orange-900"
                                            : "hover:scale-105"
                                        }
                                        ${
                                          val < 0
                                            ? `border-red-400 text-red-500 ${
                                                answers[q.id] === val
                                                  ? "bg-red-500 text-white"
                                                  : "hover:bg-red-50"
                                              }`
                                            : val > 0
                                            ? `border-green-400 text-green-500 ${
                                                answers[q.id] === val
                                                  ? "bg-green-500 text-white"
                                                  : "hover:bg-green-50"
                                              }`
                                            : `${
                                                answers[q.id] === val
                                                  ? "bg-gray-400 text-white border-gray-400"
                                                  : ""
                                              }`
                                        }
                                    `}
                    >
                      <span
                        className={`
                                        rounded-full transition-all
                                        ${
                                          Math.abs(val) === 3
                                            ? "w-3 h-3 md:w-4 md:h-4"
                                            : ""
                                        }
                                        ${
                                          Math.abs(val) === 2
                                            ? "w-2.5 h-2.5 md:w-3 md:h-3"
                                            : ""
                                        }
                                        ${
                                          Math.abs(val) === 1
                                            ? "w-2 h-2 md:w-2 md:h-2"
                                            : ""
                                        }
                                        ${
                                          val === 0
                                            ? "w-1.5 h-1.5"
                                            : "bg-current"
                                        }
                                        ${
                                          answers[q.id] === val
                                            ? "bg-white"
                                            : val === 0
                                            ? "bg-gray-400"
                                            : "bg-current"
                                        }
                                    `}
                      ></span>
                    </button>
                  ))}
                </div>
                <div className="flex justify-between mt-3 text-[10px] font-bold opacity-60 uppercase md:hidden tracking-wider">
                  <span className="text-red-500">{content.disagree}</span>
                  <span className="text-green-500">{content.agree}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* NAVIGATION BUTTONS */}
        <div className="flex justify-between items-center mt-12 gap-4 pb-20">
          <button
            onClick={handlePrev}
            disabled={currentPage === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 transition-all"
          >
            <ChevronLeft size={20} /> {content.prev}
          </button>

          <button
            onClick={handleNext}
            disabled={!isPageComplete}
            className={`
                    flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg
                    ${
                      isPageComplete
                        ? "bg-orange-600 hover:bg-orange-700 hover:shadow-orange-500/30 transform hover:-translate-y-1"
                        : "bg-gray-400 cursor-not-allowed opacity-50"
                    }
                `}
          >
            {currentPage === totalPages - 1 ? (
              <>
                {content.submit} <Send size={18} />
              </>
            ) : (
              <>
                {content.next} <ChevronRight size={20} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
