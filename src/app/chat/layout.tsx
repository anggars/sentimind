import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat | Sentimind",
  description: "Chat with Sentimind AI.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}