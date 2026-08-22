import { City, Trip } from "../types";

export const cities: City[] = [
  {
    id: "paris",
    name: "Paris",
    country: "France",
    region: "Europe",
    costIndex: "$$$",
    popularity: 96,
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "amsterdam",
    name: "Amsterdam",
    country: "Netherlands",
    region: "Europe",
    costIndex: "$$$",
    popularity: 91,
    image:
      "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "berlin",
    name: "Berlin",
    country: "Germany",
    region: "Europe",
    costIndex: "$$",
    popularity: 88,
    image:
      "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    region: "Asia",
    costIndex: "$$$",
    popularity: 98,
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "kyoto",
    name: "Kyoto",
    country: "Japan",
    region: "Asia",
    costIndex: "$$",
    popularity: 94,
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "bali",
    name: "Bali",
    country: "Indonesia",
    region: "Asia",
    costIndex: "$$",
    popularity: 95,
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80",
  },
];

export const parisActivities = [
  {
    id: "eiffel",
    name: "Eiffel Tower",
    category: "Sightseeing",
    time: "09:00",
    duration: "2 hours",
    cost: 2500,
    image:
      "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "louvre",
    name: "Louvre Museum",
    category: "Museum",
    time: "14:00",
    duration: "3 hours",
    cost: 1800,
    image:
      "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "dinner",
    name: "Le Marais Dinner",
    category: "Food",
    time: "19:00",
    duration: "2 hours",
    cost: 1500,
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80",
  },
] as const;

export const trips: Trip[] = [
  {
    id: "europe-adventure",
    name: "Europe Adventure",
    start: "10 Jun 2026",
    end: "20 Jun 2026",
    budget: 80000,
    cover:
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1400&q=85",
    cities: [cities[0], cities[1], cities[2]],
    activities: [...parisActivities],
  },
  {
    id: "japan-escape",
    name: "Japan Escape",
    start: "03 Oct 2026",
    end: "12 Oct 2026",
    budget: 110000,
    cover:
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1200&q=85",
    cities: [cities[3], cities[4]],
    activities: [],
  },
];
