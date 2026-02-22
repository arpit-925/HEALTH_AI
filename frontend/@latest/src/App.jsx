import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { HealthProvider } from "./context/HealthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Hospitals from "./pages/Hospitals";

function App() {
  return (
    <AuthProvider>
      <HealthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/hospitals" element={<Hospitals />} />
          </Routes>
        </BrowserRouter>
      </HealthProvider>
    </AuthProvider>
  );
}

export default App;