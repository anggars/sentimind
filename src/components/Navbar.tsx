"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Sun, Moon, BrainCircuit, Menu, X } from "lucide-react"; // Tambah Menu & X
import { useLanguage } from "@/app/providers";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { lang, toggleLang } = useLanguage();
  const pathname = usePathname();
  
  // STATE
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State menu HP
  const [mounted, setMounted] = useState(false); // State Anti-Hydration Error

  // 1. FIX HYDRATION: Tunggu component nempel di browser dulu baru render tema
  useEffect(() => {
    setMounted(true);
  }, []);

  // 2. LOGIKA SCROLL
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => 
    pathname === path 
      ? "text-orange-600 dark:text-orange-400 font-bold" 
      : "text-gray-500 hover:text-orange-500 transition-colors";

  const navLinks = [
    { href: "/", label: lang === 'en' ? "HOME" : "BERANDA" },
    { href: "/analyzer", label: lang === 'en' ? "ANALYZER" : "ANALISIS" },
    { href: "/quiz", label: lang === 'en' ? "MINI TEST" : "TES MINI" },
    { href: "/types", label: lang === 'en' ? "MBTI TYPES" : "TIPE MBTI" },
  ];

  return (
    <>
      <nav 
        className={`
          fixed left-1/2 -translate-x-1/2 z-50 
          flex justify-between items-center px-6 py-4
          navbar-transition
          ${isScrolled 
            ? "top-4 w-[90%] max-w-5xl rounded-2xl liquid-glass shadow-2xl border border-orange-500/20" 
            : "top-0 w-full rounded-none bg-transparent border-b border-transparent backdrop-blur-none" 
          }
        `}
      >
        {/* LOGO */}
        <Link href="/" className="flex items-center space-x-2 rtl:space-x-reverse group">
          <div className="p-2 bg-orange-600 rounded-lg group-hover:rotate-12 transition-transform">
             <BrainCircuit className="text-white w-6 h-6" />
          </div>
          <span className="self-center text-2xl font-black whitespace-nowrap text-gray-900 dark:text-white tracking-tight">
            Sentimind<span className="text-orange-600">.</span>
          </span>
        </Link>

        {/* --- DESKTOP MENU (Hidden di HP) --- */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <div className="flex gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={isActive(link.href)}>
                {link.label}
              </Link>
            ))}
          </div>
          
          {/* KONFIGURASI KANAN (Lang + Theme) */}
          <div className="flex items-center gap-3 border-l border-gray-300 dark:border-white/10 pl-4">
            <button 
              onClick={toggleLang}
              className="text-xs font-bold px-2 py-1 rounded hover:bg-orange-500/10 transition-colors"
            >
              {lang.toUpperCase()}
            </button>

            <button 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-orange-500/10 transition-colors"
            >
              {/* FIX HYDRATION: Kalau belum mounted, render kotak kosong seukuran icon biar gak layout shift */}
              {!mounted ? (
                <div className="w-5 h-5" /> 
              ) : theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* --- MOBILE HAMBURGER (Visible cuma di HP) --- */}
        <div className="md:hidden flex items-center gap-4">
           {/* Tombol Tema (Mobile) */}
           <button 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-orange-500/10 transition-colors"
            >
               {!mounted ? <div className="w-5 h-5" /> : theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Tombol Menu Hamburger */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-orange-600 dark:text-orange-400 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
        </div>
      </nav>

      {/* --- MOBILE MENU OVERLAY (Slide Down) --- */}
      {/* Kita taruh di luar nav biar gak keganggu layout flex */}
      <div className={`
        fixed inset-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-xl transition-transform duration-300 ease-in-out pt-32 px-6 flex flex-col gap-6
        ${isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"}
      `}>
        {navLinks.map((link) => (
          <Link 
            key={link.href} 
            href={link.href} 
            onClick={() => setIsMobileMenuOpen(false)} // Tutup menu pas diklik
            className={`text-2xl font-bold ${pathname === link.href ? "text-orange-500" : "text-gray-500"}`}
          >
            {link.label}
          </Link>
        ))}
        
        <hr className="border-gray-200 dark:border-white/10" />
        
        <button 
          onClick={() => { toggleLang(); setIsMobileMenuOpen(false); }}
          className="text-xl font-bold text-left text-gray-600 dark:text-gray-300 flex items-center gap-2"
        >
          Change Language: <span className="text-orange-500">{lang.toUpperCase()}</span>
        </button>
      </div>
    </>
  );
}