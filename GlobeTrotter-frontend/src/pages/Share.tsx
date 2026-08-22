import { Link } from "react-router-dom";
import { Copy, Share2 } from "lucide-react";
import { trips } from "../data/mock";
import { Pill } from "../components/ui";

export function Share(){
 const trip=trips[0];
 const copy=()=>navigator.clipboard?.writeText(window.location.href);
 return <div className="min-h-screen bg-white"><header className="flex h-16 items-center justify-between border-b border-black/5 px-5 sm:px-10"><Link to="/dashboard" className="font-display text-lg font-extrabold">Globe<span className="text-mint">Trotter</span></Link><div className="flex gap-2"><button onClick={copy} className="btn-secondary"><Copy size={15}/> Copy link</button><button className="btn-primary"><Share2 size={15}/> Share</button></div></header><main className="mx-auto max-w-5xl px-5 py-10"><div className="relative overflow-hidden rounded-[30px]"><img src={trip.cover} className="h-[390px] w-full object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent"/><div className="absolute bottom-8 left-7 text-white sm:left-10"><Pill tone="green">Shared itinerary</Pill><h1 className="mt-3 font-display text-4xl font-extrabold">Europe Adventure</h1><p className="mt-2 text-white/75">Paris → Amsterdam → Berlin · 10 June — 20 June</p></div></div><div className="mt-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h2 className="font-display text-2xl font-bold">A 10-day European escape</h2><p className="mt-1 text-sm text-black/45">3 cities · ₹80,500 planned budget</p></div><button className="btn-primary"><Copy size={16}/> Copy this trip</button></div><div className="mt-8 grid gap-4 md:grid-cols-3">{trip.cities.map(c=><div key={c.id} className="overflow-hidden rounded-2xl border border-black/5"><img src={c.image} className="h-36 w-full object-cover"/><div className="p-4"><b>{c.name}</b><p className="text-xs text-black/45">{c.country}</p></div></div>)}</div></main></div>
}
