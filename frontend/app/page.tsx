"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Scale, Languages, TrendingUp, Shield, Zap, ChevronRight, BookOpen } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const FEATURES = [
  {
    id: "summarize",
    label: "Summarize",
    icon: BookOpen,
    desc: "Generate a concise legal summary with key precedents and statutes.",
    color: "from-blue-900/40 to-blue-800/20",
    accent: "#60A5FA",
    endpoint: "/api/summarize/",
  },
  {
    id: "analyze",
    label: "Analyze",
    icon: Scale,
    desc: "Deep contract and document analysis with risk scoring.",
    color: "from-gold-dim/30 to-yellow-900/10",
    accent: "#C9A84C",
    endpoint: "/api/analyze/",
  },
  {
    id: "translate",
    label: "Translate",
    icon: Languages,
    desc: "Legal Hindi/English translation + plain language version.",
    color: "from-purple-900/40 to-purple-800/20",
    accent: "#A78BFA",
    endpoint: "/api/translate/",
  },
  {
    id: "predict",
    label: "Predict",
    icon: TrendingUp,
    desc: "Win/loss probability assessment with case strategy advice.",
    color: "from-emerald-900/40 to-emerald-800/20",
    accent: "#34D399",
    endpoint: "/api/predict/",
  },
];

const STATS = [
  { label: "Accuracy", value: "91%" },
  { label: "Time Saved", value: "73%" },
  { label: "Hallucination Rate", value: "<3%" },
];

export default function HomePage() {
  const router = useRouter();
  const [selectedFeature, setSelectedFeature] = useState(FEATURES[1]);
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState("Hindi");
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) {
      setFile(accepted[0]);
      toast.success(`Loaded: ${accepted[0].name}`);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"], "text/plain": [".txt"], "application/msword": [".doc"], "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"] },
    maxFiles: 1,
  });

  const handleSubmit = async () => {
    if (!file) { toast.error("Please upload a legal document first."); return; }
    setLoading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      if (selectedFeature.id === "translate") form.append("target_language", language);

      const { data } = await axios.post(`${API}${selectedFeature.endpoint}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Store result in sessionStorage for result page
      sessionStorage.setItem("juris_result", JSON.stringify({ ...data, feature: selectedFeature.id, filename: file.name }));
      router.push("/result");
    } catch (e: any) {
      toast.error(e?.response?.data?.detail || "Something went wrong. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-32 pb-20 px-6">
        {/* Background glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/5 text-gold text-sm font-body mb-8">
              <Zap size={13} />
              <span>Multi-Agent RAG · Indian Law · 10 Specialized Agents</span>
            </div>

            <h1 className="font-display text-6xl md:text-7xl font-bold leading-tight mb-6">
              <span className="gold-text">Juris.AI</span>
              <br />
              <span className="text-white text-4xl md:text-5xl">Legal intelligence</span>
            </h1>

            <p className="font-body text-lg text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed text-center">
              Juris.AI analyzes, summarizes, translates, and predicts outcomes for Indian legal documents — powered by RAG, 10 specialized agents, and Gemini.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
            className="flex justify-center items-center gap-4 mb-16 w-full mx-auto"
          >
            {STATS.map((s) => (
              <div key={s.label} className="glass-card rounded-xl p-4">
                <div className="font-display text-2xl font-bold gold-text">{s.value}</div>
                <div className="font-body text-xs text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Main App ── */}
      <section className="max-w-5xl mx-auto px-6 pb-32">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>

          {/* Feature selector */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              const active = selectedFeature.id === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setSelectedFeature(f)}
                  className={`relative group rounded-2xl p-4 text-left transition-all duration-300 border ${
                    active
                      ? "border-gold/60 bg-gradient-to-br " + f.color + " shadow-gold"
                      : "border-white/5 bg-white/2 hover:border-white/10 hover:bg-white/4"
                  }`}
                >
                  <Icon size={20} style={{ color: active ? f.accent : "#4A5568" }} className="mb-3 transition-colors" />
                  <div className="font-body font-semibold text-sm" style={{ color: active ? "#E8EDF5" : "#4A5568" }}>{f.label}</div>
                  <div className="font-body text-xs text-slate-600 mt-1 leading-relaxed hidden md:block">{f.desc}</div>
                  {active && (
                    <motion.div layoutId="feature-indicator" className="absolute inset-0 rounded-2xl border border-gold/30 pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Language selector for translate */}
          <AnimatePresence>
            {selectedFeature.id === "translate" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="glass-card rounded-2xl p-4 flex items-center gap-4">
                  <Languages size={16} className="text-gold shrink-0" />
                  <span className="font-body text-sm text-slate-400">Target language:</span>
                  <div className="flex gap-2">
                    {["Hindi", "English"].map((l) => (
                      <button
                        key={l}
                        onClick={() => setLanguage(l)}
                        className={`px-4 py-1.5 rounded-full text-sm font-body font-medium transition-all ${
                          language === l ? "btn-gold" : "btn-ghost"
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Upload zone */}
          <div
            {...getRootProps()}
            className={`relative rounded-3xl border-2 border-dashed cursor-pointer transition-all duration-300 p-12 text-center mb-6 ${
              isDragActive
                ? "border-gold bg-gold/10 shadow-gold"
                : file
                ? "border-gold/50 bg-gold/5"
                : "border-white/10 bg-white/2 hover:border-gold/30 hover:bg-white/3"
            }`}
          >
            <input {...getInputProps()} />
            <AnimatePresence mode="wait">
              {file ? (
                <motion.div key="file" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center">
                    <FileText size={24} className="text-gold" />
                  </div>
                  <div>
                    <p className="font-body font-semibold text-white">{file.name}</p>
                    <p className="font-body text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB · Click to replace</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/3 border border-white/10 flex items-center justify-center">
                    <Upload size={28} className="text-slate-500" />
                  </div>
                  <div>
                    <p className="font-body font-semibold text-slate-300">Drop your legal document here</p>
                    <p className="font-body text-sm text-slate-600 mt-1">PDF, DOCX, or TXT · Up to 10MB</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={loading || !file}
            className={`w-full py-4 rounded-2xl font-body font-semibold text-base flex items-center justify-center gap-3 transition-all duration-300 ${
              file && !loading ? "btn-gold" : "bg-white/5 text-slate-600 cursor-not-allowed border border-white/5"
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
                <span>Processing with {selectedFeature.label} agents...</span>
              </>
            ) : (
              <>
                <span>Run {selectedFeature.label} Analysis</span>
                <ChevronRight size={18} />
              </>
            )}
          </button>

          {/* Security note */}
          <div className="flex items-center justify-center gap-2 mt-4 text-slate-600 text-xs font-body">
            <Shield size={12} />
            <span>AES-256 encrypted · Local processing via MCP · Zero data retention</span>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
