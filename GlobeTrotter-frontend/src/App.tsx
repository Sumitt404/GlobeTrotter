import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout";
import { Auth } from "./pages/Auth";
import { Dashboard } from "./pages/Dashboard";
import { Trips } from "./pages/Trips";
import { NewTrip } from "./pages/NewTrip";
import { Builder } from "./pages/Builder";
import { Budget } from "./pages/Budget";
import { Cities } from "./pages/Cities";
import { Calendar } from "./pages/Calendar";
import { Itinerary } from "./pages/Itinerary";
import { Share } from "./pages/Share";
import { Profile } from "./pages/Profile";
import { MapsPlanner } from "./pages/MapsPlanner";

function Protected({ children }: { children: React.ReactNode }) {
  return localStorage.getItem("globetrotter_token") ? <AppShell>{children}</AppShell> : <Navigate to="/login" replace />;
}

export default function App() {
  return <Routes>
    <Route path="/login" element={<Auth/>}/>
    <Route path="/signup" element={<Auth mode="signup"/>}/>
    <Route path="/share/:shareId" element={<Share/>}/>
    <Route path="/" element={<Navigate to="/dashboard" replace/>}/>
    <Route path="/dashboard" element={<Protected><Dashboard/></Protected>}/>
    <Route path="/trips" element={<Protected><Trips/></Protected>}/>
    <Route path="/trips/new" element={<Protected><NewTrip/></Protected>}/>
    <Route path="/trips/:id" element={<Protected><Itinerary/></Protected>}/>
    <Route path="/trips/:id/builder" element={<Protected><Builder/></Protected>}/>
    <Route path="/trips/:id/budget" element={<Protected><Budget/></Protected>}/>
    <Route path="/calendar" element={<Protected><Calendar/></Protected>}/>
    <Route path="/trips/:id/calendar" element={<Protected><Calendar/></Protected>}/>
    <Route path="/cities" element={<Protected><Cities/></Protected>}/>
    <Route path="/maps" element={<Protected><MapsPlanner/></Protected>}/>
    <Route path="/cities/:id" element={<Protected><Cities/></Protected>}/>
    <Route path="/activities" element={<Protected><Builder/></Protected>}/>
    <Route path="/profile" element={<Protected><Profile/></Protected>}/>
    <Route path="*" element={<Navigate to="/dashboard" replace/>}/>
  </Routes>;
}
