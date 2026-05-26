"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Scale } from "lucide-react";

const NAV = [
  { href: "/",         label: "Analyze" },
  { href: "/calendar", label: "Legal Clock" },
];

export default function Navbar() {
  const path = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-ink/80 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center group-hover:shadow-gold transition-all">
            <Scale size={15} className="text-gold" />
          </div>
          <span className="font-display text-xl font-bold gold-text">Juris.AI</span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-1">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`px-4 py-2 rounded-xl font-body text-sm font-medium transition-all ${
                path === n.href
                  ? "bg-gold/10 text-gold border border-gold/20"
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/4"
              }`}
            >
              {n.label}
            </Link>
          ))}
          <a
            href="https://github.com/your-repo/juris-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 px-4 py-2 rounded-xl btn-ghost text-sm font-body font-medium"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}
