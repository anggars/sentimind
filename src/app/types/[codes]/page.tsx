"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { mbtiDatabase } from "@/data/mbti";
import { useLanguage } from "@/app/providers";
import { ArrowLeft, Quote } from "lucide-react";

export default function DetailPage() {
  const params = useParams(); 
  const router = useRouter();
  const { lang } = useLanguage();
  
  // FIX: Gunakan 'codes' (sesuai nama folder [codes])
  // Kita tambahkan safety check (?) biar gak error kalau loading
  const rawCode = params?.codes; 
  
  const [code, setCode] = useState<string>("");

  useEffect(() => {
    if (rawCode) {
      // Pastikan convert ke string & uppercase dengan aman
      const c = (Array.isArray(rawCode) ? rawCode[0] : rawCode).toUpperCase();
      setCode(c);
    }
  }, [rawCode]);

  // Tampilkan loading kosong sebentar daripada error
  if (!code) return <div className="min-h-screen bg-white dark:bg-black" />;

  const data = mbtiDatabase[code];

  // Kalau kode ngaco (misal /types/XYZ), tampilkan Not Found yang rapi
  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black text-gray-900 dark:text-white p-4 text-center">
        <h2 className="text-3xl font-black mb-4">Type Not Found 😕</h2>
        <p className="text-gray-500 mb-8">
          Tipe kepribadian <span className="font-mono bg-gray-100 px-2 py-1 rounded">{code}</span> tidak ditemukan di database kami.
        </p>
        <button 
          onClick={() => router.push("/types")}
          className="px-6 py-3 bg-orange-600 text-white rounded-full font-bold hover:bg-orange-700 transition-all"
        >
          Kembali ke Daftar
        </button>
      </div>
    );
  }

  const content = lang === 'en' ? data.en : data.id;

  return (
    <div className="min-h-screen dark:bg-black pt-28 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Tombol Back */}
        <button 
          onClick={() => router.push("/types")}
          className="flex items-center gap-2 text-gray-500 hover:text-orange-500 mb-8 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          {lang === 'en' ? "Back to Types" : "Kembali ke Daftar"}
        </button>

        {/* Header */}
        <div className={`rounded-3xl p-8 md:p-12 mb-12 border ${data.color} bg-gray-50 dark:bg-gray-900`}>
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 bg-white dark:bg-black ${data.textColor}`}>
                {data.group}
              </span>
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-2">
                {code}
              </h1>
              <h2 className={`text-2xl md:text-3xl font-bold ${data.textColor}`}>
                {content.name}
              </h2>
            </div>
          </div>
          
          <p className="mt-8 text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl">
            {content.desc}
          </p>
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Quote Section */}
            <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-gray-900 to-black text-white p-8 rounded-2xl relative overflow-hidden shadow-2xl">
                <Quote className="absolute top-4 right-4 text-white/10" size={100} />
                <blockquote className="relative z-10 text-xl md:text-2xl font-serif italic text-center leading-relaxed">
                  "{content.quote}"
                </blockquote>
            </div>

            {/* Strengths */}
            <div>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-green-600">
                    {lang === 'en' ? "Strengths" : "Kekuatan"}
                </h3>
                <ul className="space-y-3">
                    {content.strengths.map((s, idx) => (
                        <li key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0"></div>
                            <span className="text-gray-700 dark:text-gray-200 font-medium">{s}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Weaknesses */}
            <div>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-red-500">
                    {lang === 'en' ? "Weaknesses" : "Kelemahan"}
                </h3>
                <ul className="space-y-3">
                    {content.weaknesses.map((w, idx) => (
                        <li key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0"></div>
                            <span className="text-gray-700 dark:text-gray-200 font-medium">{w}</span>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
      </div>
    </div>
  );
}