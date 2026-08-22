import { Trip } from "../types";

const STORAGE_KEY = "globetrotter_created_trips";
const EVENT_NAME = "globetrotter:trips-updated";

function dispatchTripsUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  }
}

export function getCreatedTrips(): Trip[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Trip[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** The My Trips/Dashboard data source intentionally contains user-created trips only. */
export function getAllTrips(): Trip[] {
  return getCreatedTrips();
}

export function getTripById(id: string): Trip | undefined {
  return getCreatedTrips().find((trip) => trip.id === id);
}

export function saveCreatedTrip(trip: Trip) {
  if (typeof window === "undefined") return;
  const current = getCreatedTrips().filter((item) => item.id !== trip.id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...current, trip]));
  dispatchTripsUpdated();
}

export function updateTrip(id: string, updates: Partial<Trip>) {
  const trip = getTripById(id);
  if (!trip) return;
  saveCreatedTrip({ ...trip, ...updates });
}

export function deleteCreatedTrip(id: string) {
  if (typeof window === "undefined") return;
  const next = getCreatedTrips().filter((trip) => trip.id !== id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  dispatchTripsUpdated();
}

export function subscribeToTrips(callback: () => void) {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener(EVENT_NAME, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT_NAME, callback);
    window.removeEventListener("storage", callback);
  };
}
