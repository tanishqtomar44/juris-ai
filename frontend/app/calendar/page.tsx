"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, AlertCircle, RefreshCw } from "lucide-react";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Event = { summary: string; start: string; description: string };

function daysUntil(dateStr: string) {
  const now  = new Date();
  const date = new Date(dateStr);
  return Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function urgencyColor(days: number) {
  if (days <= 3)  return { border: "border-red-500/50",    bg: "bg-red-500/10",    text: "text-red-400" };
  if (days <= 7)  return { border: "border-orange-500/50", bg: "bg-orange-500/10", text: "text-orange-400" };
  if (days <= 14) return { border: "border-gold/50",       bg: "bg-gold/10",       text: "text-gold" };
  return           { border: "border-white/10",            bg: "bg-white/3",       text: "text-slate-400" };
}

export default function CalendarPage() {
  const [events,  setEvents]  = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  const fetchEvents = async () => {
    setLoading(true); setError("");
    try {
      const { data } = await axios.get(`${API}/api/calendar/events`);
      setEvents(data.events || []);
    } catch {
      setError("Could not load calendar. Make sure the backend is running.");
      // Show mock events anyway
      setEvents([
        { summary: "Filing Deadline — Contract Dispute",      start: new Date(Date.now() + 3  * 86400000).toISOString().split("T")[0], description: "Submit petition to Delhi High Court" },
        { summary: "Hearing Date — NDA Breach Case",          start: new Date(Date.now() + 7  * 86400000).toISOString().split("T")[0], description: "Commercial Court, Delhi" },
        { summary: "Limitation Period Expires — Land Matter", start: new Date(Date.now() + 12 * 86400000).toISOString().split("T")[0], description: "Last date to file appeal" },
        { summary: "Statutory Compliance Deadline",           start: new Date(Date.now() + 21 * 86400000).toISOString().split("T")[0], description: "Annual return filing — Companies Act 2013" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-display text-4xl font-bold gold-text">Legal Clock</h1>
            <p className="font-body text-slate-500 mt-2">Track deadlines, hearings, and limitation periods</p>
          </div>
          <button onClick={fetchEvents}
            className="btn-ghost px-4 py-2 rounded-xl text-sm font-body flex items-center gap-2">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </motion.div>

        {error && (
          <div className="glass-card rounded-2xl p-4 mb-6 flex items-start gap-3 border-orange-500/20">
            <AlertCircle size={16} className="text-orange-400 mt-0.5 shrink-0" />
            <p className="font-body text-sm text-orange-300">{error} Showing sample events.</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((ev, i) => {
              const days = daysUntil(ev.start);
              const col  = urgencyColor(days);
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`rounded-2xl border p-5 ${col.border} ${col.bg} flex items-start justify-between gap-4`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center shrink-0 mt-0.5">
                      <Calendar size={16} className="text-gold" />
                    </div>
                    <div>
                      <p className="font-body font-semibold text-white text-sm">{ev.summary}</p>
                      {ev.description && <p className="font-body text-xs text-slate-500 mt-1">{ev.description}</p>}
                      <div className="flex items-center gap-1.5 mt-2">
                        <Clock size={11} className={col.text} />
                        <span className={`font-body text-xs font-medium ${col.text}`}>{ev.start}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`shrink-0 text-right`}>
                    <span className={`font-display font-bold text-2xl ${col.text}`}>{days}</span>
                    <p className="font-body text-xs text-slate-600">days left</p>
                  </div>
                </motion.div>
              );
            })}

            {events.length === 0 && (
              <div className="text-center py-20 text-slate-600 font-body">
                <Calendar size={32} className="mx-auto mb-3 opacity-30" />
                No upcoming legal deadlines found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
