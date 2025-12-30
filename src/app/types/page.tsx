"use client";
import React from "react";
import Link from "next/link";
import { mbtiDatabase } from "@/data/mbti";
import { useLanguage } from "@/app/providers";

export default function TypesPage() {
  const { lang } = useLanguage();
  const codes = Object.keys(mbtiDatabase);

  const grouped = codes.reduce((acc, code) => {
    const data = mbtiDatabase[code];
    if (!acc[data.group]) acc[data.group] = [];
    acc[data.group].push({ code, ...data });
    return acc;
  }, {} as Record<string, any[]>);

  const groups = ["Analysts", "Diplomats", "Sentinels", "Explorers"];

  return (
    // HEADER & PADDING KONSISTEN (pt-20)
    <div className="min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500 pb-2 mb-2">
            {lang === 'en' ? "Personality Types" : "Tipe Kepribadian"}
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-lg max-w-2xl mx-auto">
            {lang === 'en' 
              ? "Explore the 16 personality types. Click specifically on any card to learn more."
              : "Jelajahi 16 tipe kepribadian. Klik secara spesifik pada kartu untuk mempelajari lebih lanjut."}
          </p>
        </div>

        <div className="space-y-20 animate-in slide-in-from-bottom-8 duration-700 delay-100">
          {groups.map((groupName) => (
            <div key={groupName}>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                   {groupName}
                </h2>
                <div className="h-1 flex-1 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {grouped[groupName]?.map((item) => {
                  const content = lang === 'en' ? item.en : item.id;
                  
                  return (
                    <Link href={`/types/${item.code}`} key={item.code} className="block h-full">
                      {/* FIX BACKGROUND: Light Mode pake bg-white/50 atau transparent biar nyatu sama bg-gray-50 */}
                      <div className={`
                        h-full relative group rounded-3xl p-6 border-2 transition-all duration-300 
                        hover:-translate-y-2 hover:shadow-2xl 
                        bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm cursor-pointer
                        ${item.color}
                      `}>
                        <div className="flex items-center justify-between mb-4">
                           <div className={`text-4xl font-black ${item.textColor} opacity-80 group-hover:opacity-100 transition-opacity`}>
                              {item.code}
                           </div>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {content.name}
                        </h3>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                          {content.desc}
                        </p>

                        <div className={`mt-4 text-xs font-bold uppercase tracking-wider ${item.textColor} flex items-center gap-1`}>
                          {lang === 'en' ? "Read More" : "Baca Selengkapnya"} &rarr;
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}