export type ActivityCategory = "Sightseeing" | "Museum" | "Food" | "Nature" | "Shopping" | "Adventure";

export interface Activity {
  id: string;
  name: string;
  category: ActivityCategory;
  time: string;
  duration: string;
  cost: number;
  image: string;
  description?: string;
  date?: string;
}

export interface City {
  id: string;
  name: string;
  country: string;
  region: string;
  costIndex: string;
  popularity: number;
  image: string;
}

export interface Trip {
  id: string;
  name: string;
  start: string;
  end: string;
  budget: number;
  cover: string;
  cities: City[];
  activities: Activity[];
}
