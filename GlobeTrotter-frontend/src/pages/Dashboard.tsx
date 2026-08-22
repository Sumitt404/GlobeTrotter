import { useEffect, useMemo, useState } from "react";
import { Compass, Plus, WalletCards } from "lucide-react";
import { Link } from "react-router-dom";
import { cities } from "../data/mock";
import { TripCard } from "../components/TripCard";
import { Pill } from "../components/ui";
import { api } from "../services/api";
import { getCreatedTrips, subscribeToTrips } from "../services/tripStore";
import { Trip } from "../types";

export function Dashboard() {
  const [userName, setUserName] = useState("User");
  const [createdTrips, setCreatedTrips] = useState<Trip[]>(() => getCreatedTrips());

  useEffect(() => {
    api.get("/auth/me").then((response) => setUserName(response.data?.name || "User")).catch((error) => console.error("Failed to load user:", error));
    return subscribeToTrips(() => setCreatedTrips(getCreatedTrips()));
  }, []);

  const dashboardTrips = useMemo(() => [...createdTrips].reverse().slice(0, 4), [createdTrips]);
  const plannedBudget = dashboardTrips.reduce((sum, trip) => sum + trip.budget, 0);
  const plannedCities = dashboardTrips.reduce((sum, trip) => sum + trip.cities.length, 0);

  return <div className="space-y-8 pb-8">
    <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div><div className="eyebrow">Friday, 22 August</div><h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Good morning, {userName} <span>👋</span></h1><p className="mt-2 text-black/45">Where are you going next?</p></div>
      <Link to="/trips/new" className="btn-primary w-full md:w-auto"><Plus size={18}/> Plan new trip</Link>
    </section>

    <section className="panel overflow-hidden p-6 sm:p-8">
      {dashboardTrips.length === 0 ? <div className="grid min-h-[280px] place-items-center text-center"><div className="max-w-lg"><Pill tone="green">Your dashboard</Pill><h2 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">Your next adventure starts here</h2><p className="mx-auto mt-3 max-w-md text-black/50">Create a trip to see it appear here instantly.</p><Link to="/trips/new" className="btn-primary mt-6"><Plus size={17}/> Create your first trip</Link></div></div> : <div><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><Pill tone="green">Latest planning activity</Pill><h2 className="mt-3 font-display text-3xl font-extrabold">Your trips</h2><p className="mt-1 text-sm text-black/45">New trips appear here immediately after creation.</p></div><Link to="/trips" className="text-sm font-bold text-mint">View all trips</Link></div><div className="mt-6 grid gap-5 xl:grid-cols-2">{dashboardTrips.map((trip) => <TripCard key={trip.id} trip={trip}/>)}</div></div>}
    </section>

    <section><div className="mb-4 flex items-end justify-between"><div><div className="eyebrow">Get inspired</div><h2 className="mt-1 font-display text-2xl font-bold">Trending destinations</h2></div><Link to="/cities" className="text-sm font-bold text-mint">Explore all</Link></div><div className="flex gap-4 overflow-x-auto pb-2">{cities.slice(0,5).map((c)=><Link key={c.id} to={`/cities/${c.id}`} className="min-w-[230px] overflow-hidden rounded-3xl bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"><img src={c.image} alt={c.name} loading="lazy" className="h-32 w-full object-cover"/><div className="p-4"><div className="flex justify-between"><div><h3 className="font-bold">{c.name}</h3><p className="text-xs text-black/45">{c.country}</p></div><span className="text-xs font-bold text-mint">{c.popularity}%</span></div><div className="mt-3 flex items-center justify-between text-xs text-black/45"><span>Cost {c.costIndex}</span><Compass size={15}/></div></div></Link>)}</div></section>

    <section className="grid gap-4 md:grid-cols-3"><div className="panel p-5"><WalletCards className="text-mint"/><div className="mt-4 text-xs text-black/40">Planned budget</div><div className="mt-1 text-2xl font-extrabold">₹{plannedBudget.toLocaleString("en-IN")}</div><p className="mt-1 text-xs text-black/40">Across dashboard trips</p></div><div className="panel p-5"><div className="text-3xl">✈️</div><div className="mt-4 text-xs text-black/40">Cities planned</div><div className="mt-1 text-2xl font-extrabold">{plannedCities}</div><p className="mt-1 text-xs text-black/40">Across created trips</p></div><div className="panel p-5"><div className="text-3xl">🧭</div><div className="mt-4 text-xs text-black/40">Trips on dashboard</div><div className="mt-1 text-2xl font-extrabold">{dashboardTrips.length}</div><p className="mt-1 text-xs text-black/40">Updated instantly</p></div></section>
  </div>;
}
