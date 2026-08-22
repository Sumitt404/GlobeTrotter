import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { TripCard } from "../components/TripCard";
import { getCreatedTrips, subscribeToTrips } from "../services/tripStore";
import { Trip } from "../types";
import { parseTripDate } from "../services/tripUtils";

type Filter = "All" | "Upcoming" | "Ongoing" | "Completed";

export function Trips() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [allTrips, setAllTrips] = useState<Trip[]>(() => getCreatedTrips());
  useEffect(() => subscribeToTrips(() => setAllTrips(getCreatedTrips())), []);
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return allTrips.filter((trip) => {
      const matchesSearch = !query || trip.name.toLowerCase().includes(query) || trip.cities.some((city) => city.name.toLowerCase().includes(query));
      if (!matchesSearch) return false;
      const start = parseTripDate(trip.start); const end = parseTripDate(trip.end); start.setHours(0, 0, 0, 0); end.setHours(0, 0, 0, 0);
      if (filter === "Upcoming") return start > today;
      if (filter === "Ongoing") return start <= today && today <= end;
      if (filter === "Completed") return end < today;
      return true;
    });
  }, [allTrips, filter, q]);
  return <div className="space-y-7 pb-8"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><div className="eyebrow">Your journeys</div><h1 className="mt-2 font-display text-4xl font-extrabold">My Trips</h1><p className="mt-2 text-sm text-black/45">Only trips you create are shown here.</p></div><Link to="/trips/new" className="btn-primary w-full md:w-auto"><Plus size={17}/> Plan new trip</Link></div><div className="flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search size={17} className="absolute left-3 top-3.5 text-black/35"/><input value={q} onChange={(e) => setQ(e.target.value)} className="input pl-10" placeholder="Search trips or cities..."/></div><div className="flex gap-2 overflow-x-auto pb-1">{(["All", "Upcoming", "Ongoing", "Completed"] as Filter[]).map((item) => <button key={item} type="button" onClick={() => setFilter(item)} aria-pressed={filter === item} className={filter === item ? "btn-primary whitespace-nowrap" : "btn-secondary whitespace-nowrap"}>{item}</button>)}</div></div>{filtered.length ? <div className="grid gap-5 xl:grid-cols-2">{filtered.map(t => <TripCard key={t.id} trip={t}/>)}</div> : <div className="panel grid place-items-center py-20 text-center"><div className="text-4xl">🗺️</div><h3 className="mt-3 font-display text-xl font-bold">{allTrips.length ? "No trips found" : "No trips yet"}</h3><p className="mt-1 text-sm text-black/45">{allTrips.length ? "Try a different search or status filter." : "Create your first journey and it will appear here immediately."}</p><Link to="/trips/new" className="btn-primary mt-5"><Plus size={16}/> Create trip</Link></div>}</div>;
}
