import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sentimind - AI Personality Profiler",
  description: "Analyze your personality using AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground flex flex-col`}> 
        <Providers>
          <Navbar />
          
          {/* Main content fills available space */}
          <main className="container mx-auto px-4 md:px-8 flex-grow"> 
            {children}
          </main>

          <Footer />
          
        </Providers>
      </body>
    </html>
  );
}