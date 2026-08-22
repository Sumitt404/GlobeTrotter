import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, TrendingDown, TrendingUp } from "lucide-react";
import { getTripById, subscribeToTrips, updateTrip } from "../services/tripStore";
import { activityDate, formatTripDate, getTripDays, totalActivityCost, tripDurationDays } from "../services/tripUtils";
import { Trip, ActivityCategory } from "../types";

const categories: ActivityCategory[] = ["Sightseeing", "Museum", "Food", "Nature", "Shopping", "Adventure"];

export function Budget() {
  const { id } = useParams();
  const [trip, setTrip] = useState<Trip | undefined>(() => (id ? getTripById(id) : undefined));
  const [budgetDraft, setBudgetDraft] = useState("");

  useEffect(() => subscribeToTrips(() => setTrip(id ? getTripById(id) : undefined)), [id]);
  useEffect(() => { if (trip) setBudgetDraft(String(trip.budget)); }, [trip?.id, trip?.budget]);

  const data = useMemo(() => {
    if (!trip) return { total: 0, budget: 0, remaining: 0, pie: [], bars: [], days: [] as string[] };
    const total = totalActivityCost(trip.activities);
    const budget = Math.max(0, Number(trip.budget) || 0);
    const byCategory = categories.map(name => ({ name, value: trip.activities.filter(a => a.category === name).reduce((sum, a) => sum + a.cost, 0) })).filter(item => item.value > 0);
    const days = getTripDays(trip);
    const bars = days.map(day => ({ day: formatTripDate(day, false), spend: trip.activities.filter(a => activityDate(a, trip) === day).reduce((sum, a) => sum + a.cost, 0) }));
    return { total, budget, remaining: budget - total, pie: byCategory, bars, days };
  }, [trip]);

  if (!trip) return <div className="panel p-8 text-center"><h1 className="font-display text-2xl font-bold">Trip not found</h1><Link to="/trips" className="btn-primary mt-5 inline-flex">Back to My Trips</Link></div>;

  const saveBudget = (value: string) => {
    setBudgetDraft(value);
    const nextBudget = Math.max(0, Number(value) || 0);
    if (nextBudget !== trip.budget) {
      const updated = { ...trip, budget: nextBudget };
      setTrip(updated);
      updateTrip(trip.id, { budget: nextBudget });
    }
  };

  const percentBelow = data.budget > 0 ? ((data.budget - data.total) / data.budget) * 100 : 0;
  const mostExpensive = [...data.bars].sort((a, b) => b.spend - a.spend)[0];
  const cheapest = [...data.bars].filter(x => x.spend > 0).sort((a, b) => a.spend - b.spend)[0];
  const colors = ["#2F7D68", "#5E9D8A", "#A6C9BD", "#D4A85C", "#B6B8B3", "#7A8F87"];

  return <div className="space-y-7"><div><Link to={`/trips/${trip.id}/builder`} className="inline-flex items-center gap-2 text-sm font-semibold text-black/45"><ArrowLeft size={16}/> Back to builder</Link><div className="mt-5"><div className="eyebrow">Financial view</div><h1 className="mt-2 font-display text-4xl font-extrabold">Trip budget</h1><p className="mt-1 text-sm text-black/45">{trip.name} · {formatTripDate(trip.start)} — {formatTripDate(trip.end)}</p></div></div>
    <div className="grid gap-4 md:grid-cols-3"><div className="panel p-5"><div className="text-xs font-bold text-black/40">TOTAL PLANNED COST</div><div className="mt-2 text-3xl font-extrabold">₹{data.total.toLocaleString("en-IN")}</div><div className={`mt-2 flex items-center gap-1 text-xs font-semibold ${data.remaining >= 0 ? "text-mint" : "text-red-600"}`}>{data.remaining >= 0 ? <TrendingDown size={14}/> : <TrendingUp size={14}/>} {data.budget > 0 ? `${Math.abs(percentBelow).toFixed(1)}% ${data.remaining >= 0 ? "below" : "over"} budget` : "Set a budget target"}</div></div><div className="panel p-5"><div className="text-xs font-bold text-black/40">BUDGET</div><div className="mt-2 flex items-center gap-2"><span className="text-black/40">₹</span><input className="input text-2xl font-extrabold" aria-label="Trip budget" type="number" min="0" step="500" value={budgetDraft} onChange={e => saveBudget(e.target.value)} /></div><div className="mt-2 text-xs text-black/40">Updates everywhere instantly.</div></div><div className="panel p-5"><div className="text-xs font-bold text-black/40">REMAINING</div><div className={`mt-2 text-3xl font-extrabold ${data.remaining >= 0 ? "text-mint" : "text-red-600"}`}>₹{data.remaining.toLocaleString("en-IN")}</div><div className="mt-2 text-xs text-black/40">₹{Math.round(data.total / tripDurationDays(trip)).toLocaleString("en-IN")} average / day</div></div></div>
    <div className="grid gap-5 lg:grid-cols-2"><div className="panel p-6"><h2 className="font-display text-xl font-bold">Where your money goes</h2><div className="mt-4 h-[300px]">{data.pie.length ? <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data.pie} dataKey="value" nameKey="name" innerRadius={72} outerRadius={105} paddingAngle={3}>{data.pie.map((entry, i) => <Cell key={entry.name} fill={colors[i % colors.length]}/>)}</Pie><Tooltip formatter={(v) => `₹${Number(v).toLocaleString("en-IN")}`}/></PieChart></ResponsiveContainer> : <div className="grid h-full place-items-center text-center text-sm text-black/45">Add activities to see live spending by category.</div>}</div><div className="grid grid-cols-2 gap-2 text-xs">{data.pie.length ? data.pie.map(x => <div key={x.name} className="flex justify-between rounded-lg bg-black/[.03] p-2"><span className="text-black/50">{x.name}</span><b>₹{x.value.toLocaleString("en-IN")}</b></div>) : <div className="col-span-2 rounded-lg bg-black/[.03] p-3 text-black/45">No planned costs yet.</div>}</div></div>
    <div className="panel p-6"><h2 className="font-display text-xl font-bold">Daily spending</h2><div className="mt-5 h-[330px]">{data.bars.length ? <ResponsiveContainer width="100%" height="100%"><BarChart data={data.bars}><CartesianGrid vertical={false} stroke="#00000010"/><XAxis dataKey="day" tick={{fontSize:11}}/><YAxis tick={{fontSize:11}}/><Tooltip formatter={(v) => `₹${Number(v).toLocaleString("en-IN")}`}/><Bar dataKey="spend" radius={[7,7,0,0]} fill="#2F7D68"/></BarChart></ResponsiveContainer> : <div className="grid h-full place-items-center text-sm text-black/45">No trip dates are available.</div>}</div></div></div>
    <div className="grid gap-5 md:grid-cols-3"><div className="panel p-5"><div className="text-xs font-bold text-black/40">MOST EXPENSIVE DAY</div><div className="mt-2 font-display text-xl font-bold">{mostExpensive?.day || "—"}</div><div className="mt-1 text-sm text-black/45">₹{(mostExpensive?.spend || 0).toLocaleString("en-IN")} planned</div></div><div className="panel p-5"><div className="text-xs font-bold text-black/40">CHEAPEST DAY</div><div className="mt-2 font-display text-xl font-bold">{cheapest?.day || "—"}</div><div className="mt-1 text-sm text-black/45">₹{(cheapest?.spend || 0).toLocaleString("en-IN")} planned</div></div><div className="panel p-5"><div className="text-xs font-bold text-black/40">OPTIMIZATION</div><div className="mt-2 flex items-center gap-2 font-display text-xl font-bold"><TrendingUp size={19} className="text-mint"/> {data.remaining >= 0 ? `₹${data.remaining.toLocaleString("en-IN")}` : `₹${Math.abs(data.remaining).toLocaleString("en-IN")}`}</div><div className="mt-1 text-sm text-black/45">{data.remaining >= 0 ? "Available planning headroom" : "Amount over budget"}</div></div></div>
  </div>;
}
