import { useEffect, useMemo, useState } from "react";
import { Plus, GripVertical, Clock3, Trash2, Wallet, ChevronRight, MapPin, Share2, X } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Activity, ActivityCategory } from "../types";
import { Pill, Toast } from "../components/ui";
import { getTripById, subscribeToTrips, updateTrip } from "../services/tripStore";
import { activityDate, formatTripDate, getTripDays, totalActivityCost, tripDurationDays } from "../services/tripUtils";

const categories: ActivityCategory[] = ["Sightseeing", "Museum", "Food", "Nature", "Shopping", "Adventure"];
const defaultImage = "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80";

export function Builder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(() => (id ? getTripById(id) : undefined));
  const [toast, setToast] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", category: "Sightseeing" as ActivityCategory, time: "09:00", duration: "1 hour", cost: "", date: "" });
  const [budgetDraft, setBudgetDraft] = useState("");

  useEffect(() => subscribeToTrips(() => {
    setTrip(id ? getTripById(id) : undefined);
  }), [id]);

  useEffect(() => {
    if (!trip) return;
    const days = getTripDays(trip);
    const nextDate = selectedDate && days.includes(selectedDate) ? selectedDate : days[0];
    setSelectedDate(nextDate || "");
    setBudgetDraft(String(trip.budget));
  }, [trip?.id, trip?.start, trip?.end, selectedDate]);

  if (!trip) {
    return <div className="panel p-8 text-center"><h1 className="font-display text-2xl font-bold">Trip not found</h1><p className="mt-2 text-sm text-black/45">This trip may have been removed or is no longer available.</p><Link to="/trips" className="btn-primary mt-5 inline-flex">Back to My Trips</Link></div>;
  }

  const days = getTripDays(trip);
  const activeDate = selectedDate || days[0];
  const dayActivities = trip.activities.filter((activity) => activityDate(activity, trip) === activeDate);
  const total = totalActivityCost(trip.activities);
  const budget = Math.max(0, Number(trip.budget) || 0);
  const remaining = budget - total;
  const percent = budget > 0 ? Math.min(100, (total / budget) * 100) : total > 0 ? 100 : 0;
  const avg = Math.round(total / tripDurationDays(trip));
  const cityIndex = days.indexOf(activeDate);
  const activeCity = trip.cities[Math.min(Math.max(cityIndex === -1 ? 0 : Math.floor(cityIndex / Math.max(1, Math.ceil(days.length / trip.cities.length))), 0), trip.cities.length - 1)] || trip.cities[0];

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  };

  const persistActivities = (activities: Activity[], message: string) => {
    const nextTrip = { ...trip, activities };
    setTrip(nextTrip);
    updateTrip(trip.id, { activities });
    flash(message);
  };

  const remove = (activityId: string) => {
    persistActivities(trip.activities.filter((activity) => activity.id !== activityId), "Activity removed.");
  };

  const add = () => {
    const name = form.name.trim();
    if (!name) {
      flash("Add an activity name first.");
      return;
    }
    const cost = Math.max(0, Number(form.cost) || 0);
    const activity: Activity = {
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      name,
      category: form.category,
      time: form.time,
      duration: form.duration.trim() || "1 hour",
      cost,
      image: defaultImage,
      date: form.date || activeDate,
    };
    persistActivities([...trip.activities, activity], `${name} added.`);
    setForm({ name: "", category: "Sightseeing", time: "09:00", duration: "1 hour", cost: "", date: activeDate });
    setShowAdd(false);
  };

  const saveBudget = (value: string) => {
    setBudgetDraft(value);
    const nextBudget = Math.max(0, Number(value) || 0);
    if (nextBudget !== trip.budget) {
      const nextTrip = { ...trip, budget: nextBudget };
      setTrip(nextTrip);
      updateTrip(trip.id, { budget: nextBudget });
    }
  };

  return <div className="space-y-5">
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><div className="eyebrow">Itinerary builder</div><h1 className="mt-2 font-display text-3xl font-extrabold">{trip.name}</h1><p className="mt-1 text-sm text-black/45">{formatTripDate(trip.start)} — {formatTripDate(trip.end)} · {tripDurationDays(trip)} days · {trip.cities.length} {trip.cities.length === 1 ? "city" : "cities"}</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => flash("Share links will be connected when the sharing service is enabled.")} className="btn-secondary"><Share2 size={16}/> Share</button><Link to={`/trips/${trip.id}/budget`} className="btn-primary"><Wallet size={16}/> Budget</Link></div></div>
    <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)_250px]">
      <aside className="panel h-fit p-4 lg:sticky lg:top-24"><div className="text-xs font-bold text-black/40">TRIP STOPS</div><div className="mt-4 space-y-2">{trip.cities.map((city, i) => <div key={city.id} className="flex cursor-grab items-center gap-2 rounded-2xl border border-black/5 bg-black/[.015] p-3"><GripVertical size={16} className="text-black/25"/><div className="grid h-7 w-7 place-items-center rounded-lg bg-mint/10 text-xs font-bold text-mint">{i + 1}</div><div className="flex-1"><b className="text-sm">{city.name}</b><div className="text-[11px] text-black/40">{city.country}</div></div><ChevronRight size={15} className="text-black/25"/></div>)}</div><div className="mt-6 rounded-2xl bg-[#eef6f2] p-4"><div className="text-xs text-black/45">Live budget</div><div className="mt-1 text-lg font-extrabold">₹{total.toLocaleString("en-IN")}</div><div className="mt-3 h-2 overflow-hidden rounded-full bg-black/10"><div className={`h-full ${remaining < 0 ? "bg-red-500" : "bg-mint"}`} style={{ width: `${percent}%` }}/></div><div className={`mt-2 text-xs font-semibold ${remaining < 0 ? "text-red-600" : "text-mint"}`}>{remaining < 0 ? `₹${Math.abs(remaining).toLocaleString("en-IN")} over budget` : `₹${remaining.toLocaleString("en-IN")} remaining`}</div></div></aside>
      <main className="space-y-5">
        <div className="panel p-5 sm:p-7">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><Pill tone="green">DAY {Math.max(1, cityIndex + 1)}</Pill><h2 className="mt-3 font-display text-2xl font-bold">{formatTripDate(activeDate, false)} · {activeCity?.name || "Trip day"}</h2></div><button type="button" onClick={() => { setForm((value) => ({ ...value, date: activeDate })); setShowAdd((value) => !value); }} className="btn-primary w-full sm:w-auto"><Plus size={16}/>{showAdd ? "Close" : "Add activity"}</button></div>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">{days.map((day, index) => <button type="button" key={day} onClick={() => { setSelectedDate(day); setForm((value) => ({ ...value, date: day })); }} className={day === activeDate ? "btn-primary whitespace-nowrap" : "btn-secondary whitespace-nowrap"}>Day {index + 1} · {formatTripDate(day, false)}</button>)}</div>

          {showAdd && <div className="mt-6 rounded-2xl border border-black/5 bg-black/[.02] p-4 sm:p-5"><div className="flex items-center justify-between"><div><div className="text-xs font-bold text-black/40">NEW ACTIVITY</div><p className="mt-1 text-sm text-black/45">Add a planned activity and its cost. Changes are saved instantly.</p></div><button type="button" onClick={() => setShowAdd(false)} className="rounded-lg p-2 text-black/35 hover:bg-black/5"><X size={17}/></button></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold">Activity name<input className="input mt-2" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. City tour" /></label><label className="text-sm font-bold">Category<select className="input mt-2" value={form.category} onChange={e => setForm({ ...form, category: e.target.value as ActivityCategory })}>{categories.map(category => <option key={category}>{category}</option>)}</select></label><label className="text-sm font-bold">Date<input className="input mt-2" type="date" value={form.date || activeDate} min={days[0]} max={days[days.length - 1]} onChange={e => setForm({ ...form, date: e.target.value })} /></label><label className="text-sm font-bold">Time<input className="input mt-2" type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} /></label><label className="text-sm font-bold">Duration<input className="input mt-2" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="2 hours" /></label><label className="text-sm font-bold">Cost<input className="input mt-2" type="number" min="0" step="50" value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} placeholder="0" /></label></div><div className="mt-4 flex justify-end"><button type="button" onClick={add} className="btn-primary"><Plus size={16}/> Save activity</button></div></div>}

          <div className="mt-7 space-y-4">{dayActivities.length ? dayActivities.map(activity => <div key={activity.id} className="group flex gap-3 sm:gap-4"><div className="w-14 shrink-0 pt-4 text-right text-xs font-bold text-black/40">{activity.time}</div><div className="relative min-w-0 flex-1 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-card"><div className="flex flex-col sm:flex-row"><img src={activity.image} alt="" className="h-28 w-full object-cover sm:h-24 sm:w-28"/><div className="min-w-0 flex-1 p-4"><div className="flex items-start justify-between gap-2"><div><Pill>{activity.category}</Pill><h3 className="mt-2 font-bold">{activity.name}</h3></div><button type="button" aria-label={`Remove ${activity.name}`} onClick={() => remove(activity.id)} className="rounded-lg p-1.5 text-black/25 hover:bg-red-50 hover:text-red-500"><Trash2 size={16}/></button></div><div className="mt-2 flex flex-wrap gap-3 text-xs text-black/45"><span className="flex items-center gap-1"><Clock3 size={13}/>{activity.duration}</span><span className="font-bold text-ink">₹{activity.cost.toLocaleString("en-IN")}</span></div></div></div></div></div>) : <div className="rounded-2xl border border-dashed border-black/10 p-8 text-center"><div className="text-3xl">🧭</div><h3 className="mt-2 font-display text-lg font-bold">No activities planned for this day</h3><p className="mt-1 text-sm text-black/45">Add an activity to start building your itinerary.</p><button type="button" onClick={() => { setForm((value) => ({ ...value, date: activeDate })); setShowAdd(true); }} className="mt-4 text-sm font-bold text-mint"><Plus size={16} className="mr-1 inline"/> Add activity</button></div>}</div>
        </div>
        <div className="panel p-5"><div className="flex items-center gap-2"><MapPin size={18} className="text-mint"/><b>{trip.cities.length > 1 ? "Trip destinations" : "Trip destination"}</b></div><div className="mt-3 flex flex-wrap gap-2">{trip.cities.map(city => <span key={city.id} className="rounded-full bg-black/[.04] px-3 py-1.5 text-xs font-semibold">{city.name}</span>)}</div></div>
      </main>
      <aside className="space-y-4"><div className="panel p-5 lg:sticky lg:top-24"><div className="flex items-center justify-between"><span className="text-xs font-bold text-black/40">TRIP BUDGET</span><Link className="text-xs font-bold text-mint" to={`/trips/${trip.id}/budget`}>Details</Link></div><div className="mt-4 text-3xl font-extrabold">₹{total.toLocaleString("en-IN")}</div><div className="mt-1 text-xs text-black/40">of ₹{budget.toLocaleString("en-IN")}</div><div className="mt-4"><label className="text-xs font-bold text-black/40">EDIT BUDGET</label><div className="mt-2 flex items-center gap-2"><span className="text-black/40">₹</span><input aria-label="Trip budget" className="input" type="number" min="0" step="500" value={budgetDraft} onChange={(e) => saveBudget(e.target.value)} /></div></div><div className="mt-5 space-y-3 text-sm"><div className="flex justify-between"><span className="text-black/50">Planned activities</span><b>₹{total.toLocaleString("en-IN")}</b></div><div className="flex justify-between"><span className="text-black/50">Remaining</span><b className={remaining < 0 ? "text-red-600" : "text-mint"}>₹{remaining.toLocaleString("en-IN")}</b></div><div className="flex justify-between"><span className="text-black/50">Avg / day</span><b>₹{avg.toLocaleString("en-IN")}</b></div></div>{remaining < 0 && <div className="mt-5 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600">⚠ Your planned activities are over budget. Remove or reduce an activity cost, or raise the budget.</div>}</div></aside>
    </div>{toast && <Toast message={toast} onClose={() => setToast("")}/>}</div>;
}
