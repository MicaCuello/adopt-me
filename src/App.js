import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import { FaHome, FaSignInAlt, FaPaw, FaUserMd } from "react-icons/fa"; // Íconos
import Home from "./pages/Home";
import Mascotas from "./pages/Mascotas";
import Veterinarias from "./pages/Veterinarias";

import "./App.css"; // Archivo CSS para los estilos

function App() {
  return (
    <Router>
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mascotas" element={<Mascotas />} />
          <Route path="/veterinarias" element={<Veterinarias />} />
        </Routes>
      </div>

      {/* Barra de navegación inferior */}
      <nav className="bottom-nav">
        <NavLink to="/" className="nav-item">
          <FaHome size={24} />
          <span>Inicio</span>
        </NavLink>
        <NavLink to="/mascotas" className="nav-item">
          <FaPaw size={24} />
          <span>Mascotas</span>
        </NavLink>
        <NavLink to="/veterinarias" className="nav-item">
          <FaUserMd size={24} />
          <span>Veterinarias</span>
        </NavLink>
      </nav>
    </Router>
  );
}

export default App;