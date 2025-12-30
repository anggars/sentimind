import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analyzer | Sentimind",
  description: "Analyze your text to reveal hidden personality patterns.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}