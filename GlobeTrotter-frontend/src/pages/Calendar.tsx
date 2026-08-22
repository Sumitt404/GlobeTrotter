import { CalendarDays, Clock3, MapPin } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Pill } from "../components/ui";
import { getCreatedTrips, getTripById, subscribeToTrips } from "../services/tripStore";
import { activityDate, formatTripDate, getTripDays } from "../services/tripUtils";
import { Trip } from "../types";

export function Calendar() {
  const { id } = useParams();
  const [trip, setTrip] = useState<Trip | undefined>(() => id ? getTripById(id) : getCreatedTrips().slice(-1)[0]);

  useEffect(() => subscribeToTrips(() => setTrip(id ? getTripById(id) : getCreatedTrips().slice(-1)[0])), [id]);

  const days = useMemo(() => trip ? getTripDays(trip) : [], [trip]);
  if (!trip) return <div className="panel grid place-items-center p-10 text-center"><div className="text-4xl">📅</div><h1 className="mt-3 font-display text-2xl font-bold">Your calendar is empty</h1><p className="mt-2 max-w-md text-sm text-black/45">Create a trip to start scheduling activities. Your newest trip will automatically appear here.</p><Link to="/trips/new" className="btn-primary mt-5">Create a trip</Link></div>;

  const activitiesByDay = new Map(days.map(day => [day, trip.activities.filter(activity => activityDate(activity, trip) === day)]));
  const firstWeek = days.slice(0, 7);
  const firstDay = firstWeek[0];

  return <div className="space-y-7"><div><div className="eyebrow">Journey timeline</div><h1 className="mt-2 font-display text-4xl font-extrabold">{trip.name}</h1><p className="mt-2 text-sm text-black/45">{formatTripDate(trip.start)} — {formatTripDate(trip.end)} · Calendar view</p></div><div className="flex flex-wrap gap-2"><Link to={`/trips/${trip.id}/calendar`} className="btn-primary"><CalendarDays size={16}/> Calendar</Link><Link to={`/trips/${trip.id}/builder`} className="btn-secondary">Timeline</Link><Link to={`/trips/${trip.id}/builder`} className="btn-secondary">List</Link></div><div className="panel overflow-hidden"><div className="grid grid-cols-7 border-b border-black/5">{firstWeek.map((day, index) => { const parsed = new Date(`${day}T12:00:00`); return <div key={day} className="border-r border-black/5 p-3 text-center last:border-0"><div className="text-[10px] font-bold text-black/35">{parsed.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()}</div><div className={`mt-1 text-lg font-bold ${day === firstDay ? "text-mint" : ""}`}>{parsed.getDate()}</div><div className="text-[10px] text-black/35">Day {index + 1}</div></div>; })}</div><div className="space-y-5 p-4 sm:p-6">{days.length === 0 ? <div className="py-8 text-center text-sm text-black/45">No days are available for this trip.</div> : days.map((day, index) => { const activities = activitiesByDay.get(day) || []; const parsed = new Date(`${day}T12:00:00`); return <section key={day}><div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"><div><div className="text-xs font-bold text-mint">DAY {index + 1}</div><h2 className="font-display text-xl font-bold">{parsed.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</h2></div><Link to={`/trips/${trip.id}/builder`} className="text-xs font-bold text-mint">Manage activities</Link></div>{activities.length ? <div className="space-y-3">{activities.map(activity => <div key={activity.id} className="flex gap-4 rounded-2xl border border-black/5 bg-black/[.015] p-4"><div className="w-16 shrink-0 text-right text-xs font-bold text-black/40">{activity.time}</div><div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl"><img src={activity.image} alt="" className="h-full w-full object-cover"/></div><div className="flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold">{activity.name}</h3><Pill>{activity.category}</Pill></div><div className="mt-2 flex flex-wrap gap-3 text-xs text-black/45"><span className="flex items-center gap-1"><Clock3 size={13}/>{activity.duration}</span><span className="flex items-center gap-1"><MapPin size={13}/>{trip.cities[Math.min(trip.cities.length - 1, Math.floor(index / Math.max(1, Math.ceil(days.length / trip.cities.length))))]?.name || "Trip"}</span><b className="text-ink">₹{activity.cost.toLocaleString("en-IN")}</b></div></div></div>)}</div> : <div className="rounded-2xl border border-dashed border-black/10 p-5 text-sm text-black/45">No activities planned for this day yet. Add them from the itinerary builder.</div>}</section>; })}</div></div></div>;
}
