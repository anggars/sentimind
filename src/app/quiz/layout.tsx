import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mini Test | Sentimind",
  description: "Take a quick personality test to know your MBTI.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}