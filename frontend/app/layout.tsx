import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Juris.AI — Legal Intelligence Platform",
  description: "Multi-Agent RAG Legal AI for Indian Law — Summarize, Analyze, Translate, and Predict legal outcomes.",
  keywords: "Legal AI, Indian Law, RAG, Contract Analysis, Legal Translation",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen relative">
        <Navbar />
        <main className="relative z-10">{children}</main>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: "#1a2a3a", color: "#E8EDF5", border: "1px solid #C9A84C44" },
            success: { iconTheme: { primary: "#C9A84C", secondary: "#0D1117" } },
          }}
        />
      </body>
    </html>
  );
}
