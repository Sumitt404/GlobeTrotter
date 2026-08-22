# GlobeTrotter Frontend

A premium, responsive React + Vite + TypeScript + Tailwind CSS travel-planning frontend built from the supplied GlobeTrotter specification.

## Stack
- React + TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React
- Recharts
- Axios
- React Hook Form dependency included for API-ready forms
- Framer Motion

## Run
```bash
npm install
npm run dev
```

Then open the Vite URL shown in the terminal.

## Demo
The app uses mock data in `src/data/mock.ts`. Login/signup is demo-only and writes `globetrotter_token` to localStorage.

## Backend integration
Set:
```env
VITE_API_URL=http://localhost:8000/api
```
The Axios client is in `src/services/api.ts`, with bearer-token handling already wired.

## Main demo flow
1. Open `/login`
2. Sign in with any valid-looking email/password
3. Dashboard → My Trips → Europe Adventure → Continue planning
4. Add/remove activities in the itinerary builder
5. Watch the live budget update
6. Open Budget / Calendar / Share views
