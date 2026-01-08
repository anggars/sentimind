"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Sun, Moon, BrainCircuit, Menu, X } from "lucide-react";
import { useLanguage } from "@/app/providers";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { lang, toggleLang } = useLanguage();
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getLinkVariant = (path: string) => pathname === path ? "secondary" : "ghost";

  const navLinks = [
    { href: "/", label: lang === 'en' ? "Home" : "Beranda" },
    { href: "/analyzer", label: lang === 'en' ? "Analyzer" : "Analisis" },
    { href: "/quiz", label: lang === 'en' ? "Mini Test" : "Tes Mini" },
    { href: "/types", label: lang === 'en' ? "Types" : "Tipe" },
    { href: "/chat", label: lang === 'en' ? "Chat" : "Chat" },
  ];

  return (
    <>
      <nav
        className={`
          fixed left-1/2 -translate-x-1/2 z-50 
          flex justify-between items-center px-4 py-3
          /* GANTI BAGIAN TRANSISI DI SINI: */
          transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] will-change-[width,top,background]
          ${isScrolled
            /* SCROLLED STATE: 
               - top-4: Turun dikit
               - w-[92%]: Lebar di layar kecil
               - md:w-[64rem]: KUNCI ANIMASI! Kita set lebar fix (setara max-w-5xl) biar width-nya yang animasi, bukan max-width.
               - rounded-[12px]: Jadi kotak tumpul (sebelumnya rounded-full)
            */
            ? "top-4 w-[92%] md:w-[64rem] rounded-[12px] bg-white/80 dark:bg-black/80 backdrop-blur-md border border-gray-200 dark:border-white/10 shadow-sm"
            /* DEFAULT STATE:
               - top-0: Nempel atas
               - w-full: Lebar penuh
               - rounded-none: Kotak
            */
            : "top-0 w-full bg-transparent border-b border-transparent"
          }
        `}
      >
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 pl-2">
          <div className="bg-orange-600 p-1.5 rounded-[8px]">
            <BrainCircuit className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight text-gray-900 dark:text-white">
            Sentimind<span className="text-orange-600">.</span>
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Button
              key={link.href}
              asChild
              variant={getLinkVariant(link.href)}
              size="sm"
              className={`cursor-pointer text-sm font-medium ${pathname === link.href ? "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30" : "text-gray-600 dark:text-gray-400"}`}
            >
              <Link href={link.href}>
                {link.label}
              </Link>
            </Button>
          ))}
        </div>

        {/* KANAN: Lang + Theme */}
        <div className="flex items-center gap-2 pr-2">
          <Button
            onClick={toggleLang}
            variant="ghost"
            size="sm"
            className="w-9 h-9 p-0 text-xs font-bold text-gray-500"
          >
            {lang.toUpperCase()}
          </Button>

          <Button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            variant="ghost"
            size="icon"
            className="w-9 h-9 rounded-full text-gray-500"
          >
            {!mounted ? <div className="w-4 h-4" /> : theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white dark:bg-black pt-24 px-6 animate-in slide-in-from-top-10 fade-in duration-200">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" size="lg" className="w-full justify-start text-lg font-medium">
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}