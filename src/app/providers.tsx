"use client";

import { ThemeProvider } from "next-themes";
import { useState, useEffect, createContext, useContext } from "react";

type LangContextType = {
  lang: "en" | "id";
  toggleLang: () => void;
};

const LanguageContext = createContext<LangContextType | undefined>(undefined);

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState<"en" | "id">("en");

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleLang = () => {
    setLang((prev) => (prev === "en" ? "id" : "en"));
  };

  // FIX: Jangan return children polosan di sini. 
  // Biarin ThemeProvider yang ngurus hydration di dalem.
  
  return (
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      {/* Next-themes udah pinter ngurus hydration mismatch, 
         jadi kita render langsung aja. Kalaupun mau pake check mounted,
         Provider bahasa tetep harus di luar if.
      */}
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within Providers");
  return context;
};