import { ArrowUpRight, CalendarDays, MapPin, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { Trip } from "../types";
import { Pill } from "./ui";

export function TripCard({ trip }: { trip: Trip }) {
  const estimated = trip.id === "europe-adventure" ? 74500 : 82300;
  return <div className="panel group overflow-hidden">
    <div className="relative h-52 overflow-hidden"><img src={trip.cover} className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/><div className="absolute inset-x-4 top-4 flex justify-between"><Pill tone="green">Upcoming</Pill><button className="rounded-xl bg-white/90 p-2 backdrop-blur"><MoreHorizontal size={17}/></button></div></div>
    <div className="p-5"><div className="flex items-start justify-between gap-4"><div><h3 className="font-display text-xl font-bold">{trip.name}</h3><p className="mt-1 flex items-center gap-1.5 text-sm text-black/45"><CalendarDays size={14}/>{trip.start} — {trip.end}</p></div><div className="text-right"><div className="text-xs text-black/40">Estimated</div><div className="font-bold">₹{estimated.toLocaleString("en-IN")}</div></div></div>
      <div className="mt-5 flex flex-wrap gap-2">{trip.cities.map(c => <span key={c.id} className="flex items-center gap-1 rounded-full bg-black/[.04] px-2.5 py-1 text-xs font-medium"><MapPin size={11}/>{c.name}</span>)}</div>
      <div className="mt-5 flex items-center justify-between border-t border-black/5 pt-4"><span className="text-xs font-semibold text-black/45">{trip.cities.length} cities · ₹{trip.budget.toLocaleString("en-IN")} budget</span><Link className="inline-flex items-center gap-1 text-sm font-bold text-mint" to={`/trips/${trip.id}/builder`}>Open trip <ArrowUpRight size={15}/></Link></div>
    </div>
  </div>
}
