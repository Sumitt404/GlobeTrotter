import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Trip } from "../types";
import { Pill } from "./ui";
import { formatTripDate, parseTripDate, totalActivityCost } from "../services/tripUtils";

export function TripCard({ trip }: { trip: Trip }) {
  const estimated = totalActivityCost(trip.activities);
  const start = parseTripDate(trip.start); const end = parseTripDate(trip.end); const today = new Date();
  today.setHours(0, 0, 0, 0); start.setHours(0, 0, 0, 0); end.setHours(0, 0, 0, 0);
  let status = "Upcoming"; let tone: "green" | "neutral" = "green";
  if (end < today) { status = "Completed"; tone = "neutral"; } else if (start <= today && today <= end) status = "In progress";
  return <article className="panel group overflow-hidden"><div className="relative h-52 overflow-hidden"><img src={trip.cover} alt={trip.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/><div className="absolute inset-x-4 top-4"><Pill tone={tone}>{status}</Pill></div></div><div className="p-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0"><h3 className="break-words font-display text-xl font-bold">{trip.name}</h3><p className="mt-1 flex items-center gap-1.5 text-sm text-black/45"><CalendarDays size={14}/>{formatTripDate(trip.start)} — {formatTripDate(trip.end)}</p></div><div className="text-left sm:text-right"><div className="text-xs text-black/40">Planned cost</div><div className="font-bold">₹{estimated.toLocaleString("en-IN")}</div></div></div><div className="mt-5 flex flex-wrap gap-2">{trip.cities.map(c => <span key={c.id} className="flex items-center gap-1 rounded-full bg-black/[.04] px-2.5 py-1 text-xs font-medium"><MapPin size={11}/>{c.name}</span>)}</div><div className="mt-5 flex flex-col gap-3 border-t border-black/5 pt-4 sm:flex-row sm:items-center sm:justify-between"><span className="text-xs font-semibold text-black/45">{trip.cities.length} {trip.cities.length === 1 ? "city" : "cities"} · ₹{trip.budget.toLocaleString("en-IN")} budget</span><Link className="btn-secondary w-full text-mint sm:w-auto" to={`/trips/${trip.id}/builder`}>Open trip <ArrowUpRight size={15}/></Link></div></div></article>;
}
