import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers"; // <--- WAJIB ADA INI!

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sentimind - AI Personality Profiler",
  description: "Decode your MBTI from text using AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* --- DARI SINI --- */}
        <Providers>
          {children}
        </Providers>
        {/* --- SAMPE SINI WAJIB ADA --- */}
      </body>
    </html>
  );
}