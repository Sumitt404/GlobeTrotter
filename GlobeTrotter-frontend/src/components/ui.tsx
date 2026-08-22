import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Check, Loader2, X } from "lucide-react";

export function Logo() {
  return <div className="flex items-center gap-2.5"><div className="grid h-9 w-9 place-items-center rounded-xl bg-mint text-white"><span className="font-display text-lg font-extrabold">G</span></div><span className="font-display text-lg font-extrabold tracking-tight">GlobeTrotter</span></div>;
}

export function Pill({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "green" | "amber" | "red" }) {
  const styles = { neutral: "bg-black/5 text-black/60", green: "bg-mint/10 text-mint", amber: "bg-amber-50 text-amber-700", red: "bg-red-50 text-red-600" };
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles[tone]}`}>{children}</span>;
}

export function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return <motion.div initial={{ opacity: 0, y: 20, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white shadow-soft"><Check size={17} className="text-[#8bd2bc]" />{message}<button onClick={onClose}><X size={16} className="opacity-60 hover:opacity-100" /></button></motion.div>;
}

export function Loading() {
  return <div className="grid min-h-[50vh] place-items-center"><Loader2 className="animate-spin text-mint" /></div>;
}
