import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

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
      {/* HAPUS class 'bg-background' atau 'text-foreground' di sini biar gak nabrak */}
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}