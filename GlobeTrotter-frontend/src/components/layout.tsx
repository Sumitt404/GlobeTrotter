import { ReactNode, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Compass,
  Home,
  Map,
  Plus,
  Search,
  Sparkles,
  UserRound,
  X,
  Bell,
  Menu,
  MapPinned,
  LogOut,
} from "lucide-react";
import { Logo } from "./ui";
import { api } from "../services/api";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/trips", label: "My Trips", icon: Map },
  { to: "/cities", label: "Explore", icon: Compass },
  { to: "/maps", label: "Plan on Maps", icon: MapPinned },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/profile", label: "Profile", icon: UserRound },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await api.get("/auth/me");
        setUserName(response.data.name || "");
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    };

    if (localStorage.getItem("globetrotter_token")) {
      getUser();
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("globetrotter_token");
    navigate("/login", { replace: true });
  };

  const initial = userName ? userName.charAt(0).toUpperCase() : "P";

  return (
    <div className="min-h-screen bg-cream">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-black/5 bg-white px-5 py-6 transition-transform lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <Logo />
          <button
            className="lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <button
          onClick={() => navigate("/trips/new")}
          className="btn-primary mt-8 w-full"
        >
          <Plus size={17} /> Plan new trip
        </button>

        <nav className="mt-7 space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-mint/10 text-mint"
                    : "text-black/55 hover:bg-black/[.03] hover:text-ink"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-6 left-5 right-5 rounded-2xl bg-[#eef6f2] p-4">
          <div className="flex items-center gap-2 text-sm font-bold">
            <Sparkles size={16} className="text-mint" />
            Smart planning
          </div>
          <p className="mt-1 text-xs leading-5 text-black/50">
            Keep your itinerary organized and on budget.
          </p>
        </div>
      </aside>

      {mobileOpen && (
        <button
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-black/5 bg-cream/90 px-4 backdrop-blur-xl sm:px-8">
          <button
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu />
          </button>

          <div className="relative hidden w-full max-w-md sm:block">
            <Search
              className="absolute left-3 top-3.5 text-black/35"
              size={17}
            />
            <input
              className="input bg-white/80 pl-10"
              placeholder="Search trips, cities, activities..."
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button className="rounded-xl p-2.5 hover:bg-white">
              <Bell size={19} />
            </button>

            <button
              onClick={logout}
              title="Log out"
              className="hidden items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-black/55 hover:bg-white sm:flex"
            >
              <LogOut size={16} /> Logout
            </button>

            <div className="grid h-9 w-9 place-items-center rounded-full bg-[#d9e8e1] text-sm font-bold text-mint">
              {initial}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1500px] px-4 py-7 sm:px-8 lg:px-10">
          {children}
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-30 flex justify-around border-t border-black/5 bg-white/95 py-2 backdrop-blur lg:hidden">
        {links.slice(0, 4).map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-1 text-[10px] font-semibold ${
                isActive ? "text-mint" : "text-black/45"
              }`
            }
          >
            <Icon size={19} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
