import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MBTI Types | Sentimind",
  description: "Explore all 16 personality types.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}