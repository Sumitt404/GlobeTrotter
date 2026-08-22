import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { trips } from "../data/mock";
import { TripCard } from "../components/TripCard";

export function Trips() {
  const [q,setQ]=useState("");
  const filtered=trips.filter(t=>t.name.toLowerCase().includes(q.toLowerCase()));
  return <div className="space-y-7"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><div className="eyebrow">Your journeys</div><h1 className="mt-2 font-display text-4xl font-extrabold">My Trips</h1><p className="mt-2 text-sm text-black/45">Everything you are planning, in one place.</p></div><Link to="/trips/new" className="btn-primary"><Plus size={17}/> Plan new trip</Link></div><div className="flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search size={17} className="absolute left-3 top-3.5 text-black/35"/><input value={q} onChange={e=>setQ(e.target.value)} className="input pl-10" placeholder="Search trips..."/></div><div className="flex gap-2 overflow-x-auto"><button className="btn-secondary whitespace-nowrap">All</button><button className="btn-secondary whitespace-nowrap">Upcoming</button><button className="btn-secondary whitespace-nowrap">Ongoing</button><button className="btn-secondary whitespace-nowrap">Completed</button></div></div>{filtered.length ? <div className="grid gap-5 xl:grid-cols-2">{filtered.map(t=><TripCard key={t.id} trip={t}/>)}</div> : <div className="panel grid place-items-center py-20 text-center"><div className="text-4xl">🗺️</div><h3 className="mt-3 font-display text-xl font-bold">No trips found</h3><p className="mt-1 text-sm text-black/45">Try a different search or create a new journey.</p></div>}</div>;
}
