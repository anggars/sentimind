import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sentimind - AI Personality Profiler",
  description: "Decode your MBTI from text using AI",
};

// ... import lainnya

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
        <Providers>
          <Navbar />

          <main className="container mx-auto px-4 md:px-8"> 
            {children}
          </main>
          
        </Providers>
      </body>
    </html>
  );
}