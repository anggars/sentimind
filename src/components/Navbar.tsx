"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Sun, Moon, BrainCircuit } from "lucide-react";
import { useLanguage } from "@/app/providers"; // Import Hook Bahasa kita

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { lang, toggleLang } = useLanguage(); // Pake state bahasa global
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  // LOGIKA SCROLL (MORPHING)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20); // Trigger animasi pas scroll dikit
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => 
    pathname === path 
      ? "text-orange-600 dark:text-orange-400 font-bold" 
      : "text-gray-500 hover:text-orange-500 transition-colors";

  return (
    <nav 
      className={`
        fixed left-1/2 -translate-x-1/2 z-50 
        flex justify-between items-center px-6 py-4
        navbar-transition /* Class animasi halus dari globals.css */
        ${isScrolled 
          ? "top-6 w-[90%] max-w-5xl rounded-2xl liquid-glass shadow-2xl border border-orange-500/20" // MODE FLOATING
          : "top-0 w-full rounded-none bg-transparent border-b border-transparent backdrop-blur-none" // MODE NORMAL
        }
      `}
    >
      <Link href="/" className="flex items-center gap-2 group">
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
      </Link>

      <div className="flex items-center gap-6 text-sm font-medium">
        {/* Menu disembunyiin di HP biar gak sempit (hidden md:flex) */}
        <div className="hidden md:flex gap-6">
          <Link href="/" className={isActive("/")}>HOME</Link>
          <Link href="/analysis" className={isActive("/analysis")}>ANALYZER</Link>
          <Link href="/quiz" className={isActive("/quiz")}>QUIZ</Link>
          <Link href="/chat" className={isActive("/chat")}>CHAT</Link>
        </div>
        
        <div className="flex items-center gap-3 border-l border-gray-300 dark:border-white/10 pl-4">
          {/* TOMBOL BAHASA (BALIK LAGI COK!) */}
          <button 
            onClick={toggleLang}
            className="text-xs font-bold px-2 py-1 rounded hover:bg-orange-500/10 transition-colors"
          >
            {lang.toUpperCase()}
          </button>

          {/* Tombol Tema */}
          <button 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-orange-500/10 transition-colors"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </nav>
  );
}