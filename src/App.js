import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import { FaHome, FaPaw, FaSearch } from "react-icons/fa"; // Íconos
// import { AuthProvider } from "./AuthContext";
import Mascotas from "./pages/Mascotas";
import Veterinarias from "./pages/Veterinarias";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
import ReportarPerroPerdido from "./pages/ReportarPerroPerdido";
import MascotasAdoptadas from "./pages/MascotasAdoptadas";
import ListaPerrosPerdidos from "./pages/ListaPerrosPerdidos";

import "./App.css"; // Archivo CSS para los estilos

function App() {
  return (
    <Router>
      <div className="content">
        <Routes>
          {/* Rutas principales */}
          <Route path="/" element={<Login />} />
          {/* <AuthProvider> */}
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/mascotas" element={<Mascotas />} />
          <Route path="/veterinarias" element={<Veterinarias />} />
          <Route path="/mascotasAdoptadas" element={<MascotasAdoptadas />} />
          <Route path="/reportar" element={<ReportarPerroPerdido />} />
          <Route path="/mascotasPerdidas" element={<ReportarPerroPerdido />} />
          <Route path="/listaperdidos" element={<ListaPerrosPerdidos />} />
          {/* </AuthProvider> */}
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
        {/* Nuevo botón para "Mascotas Perdidas" */}
        <NavLink to="/listaperdidos" className="nav-item">
          <FaSearch size={24} />
          <span>Mascotas Perdidas</span>
        </NavLink>
      </nav>
    </Router>
  );
}

export default App;
