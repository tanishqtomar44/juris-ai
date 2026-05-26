"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, User, Copy, Download, ArrowLeft, AlertTriangle, CheckCircle, TrendingUp, FileText } from "lucide-react";
import toast from "react-hot-toast";

type ResultData = {
  feature: string;
  filename: string;
  professional: string;
  layman: string;
  intake?: string;
  risk_assessment?: string;
  compliance?: string;
  case_analysis?: string;
  prediction?: string;
  strategy?: string;
  target_language?: string;
};

const FEATURE_LABELS: Record<string, string> = {
  summarize: "Legal Summary",
  analyze:   "Contract Analysis",
  translate: "Translation",
  predict:   "Outcome Prediction",
};

export default function ResultPage() {
  const router = useRouter();
  const [data, setData]       = useState<ResultData | null>(null);
  const [view, setView]       = useState<"professional" | "layman">("professional");
  const [activeTab, setActiveTab] = useState("output");

  useEffect(() => {
    const raw = sessionStorage.getItem("juris_result");
    if (!raw) { router.push("/"); return; }
    setData(JSON.parse(raw));
  }, [router]);

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const downloadText = (text: string, name: string) => {
    const blob = new Blob([text], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = name; a.click();
    URL.revokeObjectURL(url);
  };

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
    </div>
  );

  const currentText = view === "professional" ? data.professional : data.layman;
  const featureLabel = FEATURE_LABELS[data.feature] || "Analysis";

  const extraTabs = [
    data.risk_assessment && { id: "risk",       label: "Risk Assessment",   icon: AlertTriangle, content: data.risk_assessment },
    data.compliance      && { id: "compliance", label: "Compliance",        icon: CheckCircle,   content: data.compliance },
    data.case_analysis   && { id: "cases",      label: "Case Law",          icon: Scale,         content: data.case_analysis },
    data.prediction      && { id: "prediction", label: "Prediction",        icon: TrendingUp,    content: data.prediction },
    data.strategy        && { id: "strategy",   label: "Strategy",          icon: FileText,      content: data.strategy },
  ].filter(Boolean) as { id: string; label: string; icon: any; content: string }[];

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between mb-8 gap-4">
          <div>
            <button onClick={() => router.push("/")} className="flex items-center gap-2 text-slate-500 hover:text-gold text-sm font-body mb-3 transition-colors">
              <ArrowLeft size={14} /> Back to upload
            </button>
            <h1 className="font-display text-3xl font-bold gold-text">{featureLabel}</h1>
            <p className="font-body text-sm text-slate-500 mt-1">
              {data.filename}
              {data.target_language && <span className="ml-2 text-gold">→ {data.target_language}</span>}
            </p>
          </div>

          {/* View toggle */}
          <div className="flex items-center bg-white/3 border border-white/8 rounded-2xl p-1 shrink-0">
            <button
              onClick={() => setView("professional")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-body font-medium transition-all ${
                view === "professional" ? "bg-navy border border-gold/30 text-gold shadow-gold" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Scale size={14} /> Professional
            </button>
            <button
              onClick={() => setView("layman")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-body font-medium transition-all ${
                view === "layman" ? "bg-navy border border-gold/30 text-gold shadow-gold" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <User size={14} /> Plain Language
            </button>
          </div>
        </motion.div>

        {/* Intake banner */}
        {data.intake && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-4 mb-6 text-sm font-body text-slate-400 leading-relaxed border-l-2 border-gold/40"
          >
            <span className="text-gold font-semibold text-xs uppercase tracking-wider block mb-1">Document Intake Analysis</span>
            {data.intake}
          </motion.div>
        )}

        {/* Tabs */}
        {extraTabs.length > 0 && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {[{ id: "output", label: "Main Output", icon: FileText }, ...extraTabs].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-body font-medium whitespace-nowrap transition-all border ${
                    activeTab === tab.id
                      ? "bg-gold/10 border-gold/40 text-gold"
                      : "bg-white/2 border-white/5 text-slate-500 hover:text-slate-300 hover:border-white/10"
                  }`}
                >
                  <Icon size={12} /> {tab.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Main output */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + view}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === "output" ? (
              <div className="glass-card rounded-3xl overflow-hidden">
                {/* Card header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    {view === "professional"
                      ? <Scale size={16} className="text-gold" />
                      : <User size={16} className="text-gold" />}
                    <span className="font-body text-sm font-medium text-slate-300">
                      {view === "professional" ? "Professional Legal Format" : "Plain Language Summary"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => copyText(currentText)}
                      className="p-2 rounded-xl hover:bg-white/5 text-slate-500 hover:text-gold transition-colors">
                      <Copy size={14} />
                    </button>
                    <button onClick={() => downloadText(currentText, `juris-ai-${data.feature}-${view}.txt`)}
                      className="p-2 rounded-xl hover:bg-white/5 text-slate-500 hover:text-gold transition-colors">
                      <Download size={14} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                  <div className="font-body text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {currentText}
                  </div>
                </div>

                {/* Footer disclaimer */}
                <div className="px-6 py-3 border-t border-white/5 text-xs font-body text-slate-600 flex items-center gap-2">
                  <Scale size={10} />
                  Juris.AI provides legal information, not legal advice. Consult a qualified advocate for legal decisions.
                </div>
              </div>
            ) : (
              /* Extra tab content */
              (() => {
                const tab = extraTabs.find((t) => t.id === activeTab);
                if (!tab) return null;
                const Icon = tab.icon;
                return (
                  <div className="glass-card rounded-3xl overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <Icon size={16} className="text-gold" />
                        <span className="font-body text-sm font-medium text-slate-300">{tab.label}</span>
                      </div>
                      <button onClick={() => copyText(tab.content)}
                        className="p-2 rounded-xl hover:bg-white/5 text-slate-500 hover:text-gold transition-colors">
                        <Copy size={14} />
                      </button>
                    </div>
                    <div className="p-6 md:p-8">
                      <div className="font-body text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{tab.content}</div>
                    </div>
                  </div>
                );
              })()
            )}
          </motion.div>
        </AnimatePresence>

        {/* Action buttons */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="flex gap-3 mt-6 flex-wrap">
          <button onClick={() => router.push("/")}
            className="btn-ghost px-6 py-3 rounded-2xl font-body text-sm font-medium flex items-center gap-2">
            <ArrowLeft size={14} /> Analyze another document
          </button>
          <button onClick={() => downloadText(data.professional + "\n\n---\n\n" + data.layman, `juris-ai-full-report.txt`)}
            className="btn-gold px-6 py-3 rounded-2xl font-body text-sm font-medium flex items-center gap-2">
            <Download size={14} /> Download full report
          </button>
        </motion.div>
      </div>
    </div>
  );
}
