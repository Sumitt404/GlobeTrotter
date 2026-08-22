import { useMemo, useState } from "react";
import { ExternalLink, MapPinned, Navigation, Search, Sparkles, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const suggestions = [
  { name: "Paris", country: "France", places: "Eiffel Tower, Louvre Museum, Montmartre", emoji: "🇫🇷" },
  { name: "Tokyo", country: "Japan", places: "Shibuya, Senso-ji, Tokyo Tower", emoji: "🇯🇵" },
  { name: "Amsterdam", country: "Netherlands", places: "Canals, Rijksmuseum, Jordaan", emoji: "🇳🇱" },
  { name: "Dubai", country: "UAE", places: "Burj Khalifa, Dubai Marina, Old Dubai", emoji: "🇦🇪" },
  { name: "Bali", country: "Indonesia", places: "Ubud, Seminyak, Uluwatu", emoji: "🇮🇩" },
  { name: "New York", country: "USA", places: "Central Park, Times Square, Brooklyn", emoji: "🇺🇸" },
];

function mapsSearchUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function MapsPlanner() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return suggestions;
    return suggestions.filter((x) => `${x.name} ${x.country} ${x.places}`.toLowerCase().includes(q));
  }, [query]);

  const toggle = (name: string) => {
    setSelected((current) => current.includes(name) ? current.filter((x) => x !== name) : [...current, name]);
  };

  const openSelected = () => {
    if (!selected.length) return;
    window.open(mapsSearchUrl(selected.join(" to ")), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <div className="eyebrow">Map planning</div>
          <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight">Plan where you want to go</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-black/50">Pick destinations here, then jump straight into Google Maps to explore places, directions and routes.</p>
        </div>
        <button onClick={() => navigate("/trips/new")} className="btn-primary"><Sparkles size={17}/> Build itinerary</button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
        <section className="panel overflow-hidden">
          <div className="border-b border-black/5 p-5 sm:p-6">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 text-black/30" size={18}/>
              <input value={query} onChange={(e) => setQuery(e.target.value)} className="input bg-cream pl-11 pr-4" placeholder="Search a city or destination..." />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {selected.map((x) => <button key={x} onClick={() => toggle(x)} className="inline-flex items-center gap-1.5 rounded-full bg-mint/10 px-3 py-1.5 text-xs font-bold text-mint">{x}<X size={13}/></button>)}
              {!selected.length && <span className="text-xs text-black/35">Select destinations to build your route.</span>}
            </div>
          </div>

          <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6">
            {results.map((place) => {
              const active = selected.includes(place.name);
              return <div key={place.name} className={`rounded-2xl border p-4 transition ${active ? "border-mint/30 bg-mint/[.04]" : "border-black/5 bg-white hover:border-black/10"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-cream text-xl">{place.emoji}</div><div><h3 className="font-display text-lg font-bold">{place.name}</h3><p className="text-xs text-black/40">{place.country}</p></div></div>
                  <button onClick={() => toggle(place.name)} className={`rounded-xl px-3 py-2 text-xs font-bold ${active ? "bg-mint text-white" : "bg-black/[.04] text-ink hover:bg-black/[.07]"}`}>{active ? "Added" : "Add"}</button>
                </div>
                <p className="mt-4 text-xs leading-5 text-black/50">{place.places}</p>
                <a href={mapsSearchUrl(`${place.name}, ${place.country}`)} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-mint">Explore on Google Maps <ExternalLink size={13}/></a>
              </div>;
            })}
            {!results.length && <div className="col-span-full rounded-2xl border border-dashed border-black/10 p-10 text-center"><MapPinned className="mx-auto text-black/25"/><p className="mt-3 font-bold">No destination found</p><p className="mt-1 text-sm text-black/40">Try a city name like Paris, Tokyo or Bali.</p></div>}
          </div>
        </section>

        <aside className="space-y-5">
          <div className="relative min-h-[310px] overflow-hidden rounded-3xl bg-[#dce8e3] p-6 shadow-sm">
            <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "linear-gradient(rgba(47,125,104,.13) 1px, transparent 1px), linear-gradient(90deg, rgba(47,125,104,.13) 1px, transparent 1px)", backgroundSize: "34px 34px" }} />
            <div className="relative flex h-full min-h-[260px] flex-col justify-between">
              <div className="flex items-center justify-between"><span className="rounded-full bg-white/80 px-3 py-1.5 text-xs font-bold text-mint backdrop-blur">Google Maps handoff</span><MapPinned className="text-mint"/></div>
              <div className="rounded-2xl bg-white/90 p-5 backdrop-blur"><p className="text-xs font-bold uppercase tracking-wider text-black/35">Selected route</p><h2 className="mt-2 font-display text-2xl font-extrabold">{selected.length ? selected.join(" → ") : "Choose destinations"}</h2><p className="mt-2 text-sm leading-5 text-black/45">GlobeTrotter keeps the planning UI here while Google Maps handles real-world places and navigation.</p></div>
            </div>
          </div>

          <div className="panel p-5 sm:p-6">
            <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-mint/10 text-mint"><Navigation size={18}/></div><div><h3 className="font-display text-lg font-bold">Open your route</h3><p className="text-xs text-black/40">Launch Google Maps in a new tab.</p></div></div>
            <button disabled={!selected.length} onClick={openSelected} className="btn-primary mt-5 w-full disabled:cursor-not-allowed disabled:opacity-40"><ExternalLink size={17}/> Open in Google Maps</button>
            <p className="mt-3 text-center text-[11px] leading-4 text-black/35">No Google Maps API key is needed for this frontend-only version.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
