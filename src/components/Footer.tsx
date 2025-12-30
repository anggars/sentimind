"use client";
import Link from "next/link";
import { useLanguage } from "@/app/providers";

export default function Footer() {
  const { lang } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="w-full py-8 mt-auto border-t border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-sm text-center">
      <div className="container mx-auto px-4">
        <div className="mb-4">
            <span className="text-2xl font-black tracking-tighter text-orange-600">Sentimind.</span>
        </div>
        <div className="flex justify-center gap-6 mb-6 text-sm font-medium text-gray-600 dark:text-gray-300">
           <Link href="/" className="hover:text-orange-600 transition-colors">Home</Link>
           <Link href="/analyzer" className="hover:text-orange-600 transition-colors">Analyzer</Link>
           <Link href="/quiz" className="hover:text-orange-600 transition-colors">Mini Test</Link>
           <Link href="/types" className="hover:text-orange-600 transition-colors">{lang === 'en' ? "MBTI Types" : "Tipe MBTI"}</Link>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-xs">
          © {year} Sentimind Project. {"All rights reserved."}
        </p>
      </div>
    </footer>
  );
}