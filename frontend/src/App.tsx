import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Rooms from "./pages/Rooms";
import People from "./pages/People";
import Events from "./pages/Events";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/people" element={<People />} />
            <Route path="/events" element={<Events/>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;