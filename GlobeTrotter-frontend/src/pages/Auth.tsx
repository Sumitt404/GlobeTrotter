import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../components/ui";
import { api } from "../services/api";

export function Auth({ mode = "login" }: { mode?: "login" | "signup" }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const signup = mode === "signup";

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);

    try {
      if (signup) {
        await api.post("/auth/register", {
          name: form.get("name"),
          email: form.get("email"),
          password: form.get("password"),
        });

        alert("Account created successfully. Please sign in.");
        navigate("/login");
        return;
      }

      const response = await api.post("/auth/login", {
        email: form.get("email"),
        password: form.get("password"),
      });

      localStorage.setItem(
        "globetrotter_token",
        response.data.access_token
      );

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Authentication failed:", error);

      alert(
        error?.response?.data?.detail ||
          "Authentication failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white lg:grid lg:grid-cols-[1.05fr_.95fr]">
      <div className="relative hidden overflow-hidden lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=85"
          alt="Travel destination"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />

        <div className="absolute left-10 top-10">
          <Logo />
        </div>

        <div className="absolute bottom-12 left-10 max-w-xl text-white">
          <div className="mb-4 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
            Plan less. Experience more.
          </div>

          <h1 className="font-display text-5xl font-extrabold leading-[1.05]">
            Your next great story starts with a better plan.
          </h1>

          <p className="mt-5 text-base leading-7 text-white/75">
            Build multi-city journeys, discover places, and keep every rupee
            visible before you go.
          </p>
        </div>
      </div>

      <div className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-9 lg:hidden">
            <Logo />
          </div>

          <div className="eyebrow">
            {signup ? "Create your account" : "Welcome back"}
          </div>

          <h2 className="mt-2 font-display text-3xl font-extrabold">
            {signup ? "Start planning smarter." : "Good to see you again."}
          </h2>

          <p className="mt-2 text-sm text-black/45">
            {signup
              ? "Build your first personalized itinerary in minutes."
              : "Sign in to continue your travel plans."}
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            {signup && (
              <div>
                <label className="mb-1.5 block text-xs font-bold">
                  Full name
                </label>

                <input
                  className="input"
                  name="name"
                  type="text"
                  required
                  placeholder="Prem Mishra"
                />
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-bold">
                Email
              </label>

              <input
                className="input"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold">
                Password
              </label>

              <div className="relative">
                <input
                  className="input pr-11"
                  name="password"
                  type={show ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-3 text-black/40"
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {signup && (
              <>
                <div>
                  <label className="mb-1.5 block text-xs font-bold">
                    Confirm password
                  </label>

                  <input
                    className="input"
                    name="confirmPassword"
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                  />
                </div>

                <label className="flex items-start gap-2 text-xs text-black/55">
                  <input
                    type="checkbox"
                    required
                    className="mt-0.5 accent-[#2F7D68]"
                  />

                  <span>
                    I agree to the terms and privacy policy.
                  </span>
                </label>
              </>
            )}

            {!signup && (
              <div className="flex items-center justify-between text-xs">
                <label className="flex gap-2 text-black/55">
                  <input
                    type="checkbox"
                    className="accent-[#2F7D68]"
                  />

                  Remember me
                </label>

                <button
                  type="button"
                  className="font-semibold text-mint"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="btn-primary w-full py-3.5"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : signup
                ? "Create account"
                : "Sign in"}

              {!loading && <ArrowRight size={16} />}
            </button>

            <button
              type="button"
              className="btn-secondary w-full py-3.5"
            >
              Continue with Google
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-black/45">
            {signup
              ? "Already have an account?"
              : "New to GlobeTrotter?"}{" "}
            <Link
              className="font-bold text-mint"
              to={signup ? "/login" : "/signup"}
            >
              {signup ? "Sign in" : "Create account"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
