import { useEffect, useState } from "react";
import { ArrowRight, Compass, Plus, WalletCards } from "lucide-react";
import { Link } from "react-router-dom";
import { trips, cities } from "../data/mock";
import { TripCard } from "../components/TripCard";
import { Pill } from "../components/ui";
import { api } from "../services/api";

export function Dashboard() {
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/me");
        setUserName(response.data.name);
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <div className="eyebrow">Friday, 22 August</div>

          <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">
            Good morning, {userName} <span>👋</span>
          </h1>

          <p className="mt-2 text-black/45">
            Where are you going next?
          </p>
        </div>

        <Link to="/trips/new" className="btn-primary">
          <Plus size={18} />
          Plan new trip
        </Link>
      </section>

      <section className="relative overflow-hidden rounded-[28px] bg-ink p-6 text-white shadow-soft sm:p-8">
        <img
          className="absolute inset-0 h-full w-full object-cover opacity-35"
          src={trips[0].cover}
        />

        <div className="relative max-w-3xl">
          <Pill tone="green">Your next adventure</Pill>

          <h2 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">
            Europe Adventure
          </h2>

          <p className="mt-2 text-white/65">
            Paris → Amsterdam → Berlin · 10 Jun — 20 Jun 2026
          </p>

          <div className="mt-7 grid max-w-xl grid-cols-3 gap-3">
            <div className="rounded-2xl bg-white/10 p-3 backdrop-blur">
              <div className="text-xs text-white/50">Budget</div>
              <b>₹80,000</b>
            </div>

            <div className="rounded-2xl bg-white/10 p-3 backdrop-blur">
              <div className="text-xs text-white/50">Estimate</div>
              <b>₹74,500</b>
            </div>

            <div className="rounded-2xl bg-white/10 p-3 backdrop-blur">
              <div className="text-xs text-white/50">Progress</div>
              <b>72%</b>
            </div>
          </div>

          <Link
            to="/trips/europe-adventure/builder"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-ink"
          >
            Continue planning
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <div className="eyebrow">Your journeys</div>
            <h2 className="mt-1 font-display text-2xl font-bold">
              Recent trips
            </h2>
          </div>

          <Link to="/trips" className="text-sm font-bold text-mint">
            View all
          </Link>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          {trips.map((t) => (
            <TripCard key={t.id} trip={t} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <div className="eyebrow">Get inspired</div>
            <h2 className="mt-1 font-display text-2xl font-bold">
              Trending destinations
            </h2>
          </div>

          <Link to="/cities" className="text-sm font-bold text-mint">
            Explore all
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2">
          {cities.slice(0, 5).map((c) => (
            <div
              key={c.id}
              className="min-w-[230px] overflow-hidden rounded-3xl bg-white shadow-card"
            >
              <img
                src={c.image}
                className="h-32 w-full object-cover"
              />

              <div className="p-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-bold">{c.name}</h3>
                    <p className="text-xs text-black/45">{c.country}</p>
                  </div>

                  <span className="text-xs font-bold text-mint">
                    {c.popularity}%
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-black/45">
                  <span>Cost {c.costIndex}</span>
                  <Compass size={15} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="panel p-5">
          <WalletCards className="text-mint" />

          <div className="mt-4 text-xs text-black/40">
            Upcoming spend
          </div>

          <div className="mt-1 text-2xl font-extrabold">
            ₹74,500
          </div>

          <p className="mt-1 text-xs text-black/40">
            Across 10 planned days
          </p>
        </div>

        <div className="panel p-5">
          <div className="text-3xl">✈️</div>

          <div className="mt-4 text-xs text-black/40">
            Cities planned
          </div>

          <div className="mt-1 text-2xl font-extrabold">
            5
          </div>

          <p className="mt-1 text-xs text-black/40">
            2 upcoming journeys
          </p>
        </div>

        <div className="panel p-5">
          <div className="text-3xl">🧭</div>

          <div className="mt-4 text-xs text-black/40">
            Activities saved
          </div>

          <div className="mt-1 text-2xl font-extrabold">
            18
          </div>

          <p className="mt-1 text-xs text-black/40">
            Ready to add to trips
          </p>
        </div>
      </section>
    </div>
  );
}
