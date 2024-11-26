import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function ListaPerrosPerdidos() {
  const [perros, setPerros] = useState([]);
  const [perroSeleccionado, setPerroSeleccionado] = useState(null);
  const [usuario, setUsuario] = useState("");
  const [usuarioValido, setUsuarioValido] = useState(false);
  const [error, setError] = useState("");

  const API_URL =
    "https://6745c2c5512ddbd807f9876d.mockapi.io/mascotasPerdidas/mascotas";
  const USERS_API_URL = "https://673102b37aaf2a9aff0f9326.mockapi.io/api/users"; // Reemplaza con la URL real de usuarios

  useEffect(() => {
    const obtenerPerros = async () => {
      try {
        const respuesta = await fetch(API_URL);
        const data = await respuesta.json();
        setPerros(data);
      } catch (error) {
        console.error("Error al obtener los perros:", error);
      }
    };

    obtenerPerros();
  }, []);

  const validarUsuario = async () => {
    try {
      const response = await fetch(USERS_API_URL);
      const users = await response.json();
      const usuarioExistente = users.find((user) => user.usuario === usuario);
      if (usuarioExistente) {
        setUsuarioValido(true);
        setError("");
        alert("Usuario validado correctamente.");
        eliminarPerroSeleccionado();
      } else {
        setUsuarioValido(false);
        setError("El nombre de usuario no existe.");
      }
    } catch (error) {
      console.error("Error al validar el usuario:", error);
      setError("Hubo un error al verificar el nombre de usuario.");
    }
  };

  const eliminarPerroSeleccionado = async () => {
    try {
      const response = await fetch(`${API_URL}/${perroSeleccionado.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Perro marcado como encontrado con éxito.");
        setPerros(perros.filter((perro) => perro.id !== perroSeleccionado.id));
        cerrarModal();
      } else {
        alert("Error al marcar como encontrado.");
      }
    } catch (error) {
      console.error("Error al eliminar el perro:", error);
      alert("Hubo un error al intentar eliminar el perro.");
    }
  };

  const abrirModal = (perro) => {
    setPerroSeleccionado(perro);
    setUsuario(""); // Reiniciar el nombre de usuario
    setUsuarioValido(false);
    setError("");
  };

  const cerrarModal = () => setPerroSeleccionado(null);

  return (
    <div style={{ padding: "20px", textAlign: "center", fontFamily: "Arial" }}>
      <h2 style={{ marginBottom: "20px" }}>Lista de Perros Perdidos</h2>

      <div style={{ marginBottom: "20px" }}>
        <Link to="/reportar">
          <button
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Reportar un Perro Perdido
          </button>
        </Link>
      </div>

      <div>
        {perros.length === 0 ? (
          <p>No hay perros reportados como perdidos.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
            }}
          >
            {perros.map((perro) => (
              <div
                key={perro.id}
                style={{
                  padding: "15px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  textAlign: "left",
                }}
              >
                <h3>{perro.Nombre}</h3>
                <p>
                  <strong>Ubicación:</strong> {perro.Ubicacion}
                </p>
                <img
                  src={perro.Imagen}
                  alt={perro.Nombre}
                  style={{
                    width: "100%",
                    maxWidth: "200px",
                    borderRadius: "5px",
                    marginBottom: "10px",
                  }}
                />
                <button
                  onClick={() => abrirModal(perro)}
                  style={{
                    padding: "8px 12px",
                    fontSize: "14px",
                    backgroundColor: "#28a745",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Ver detalles
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {perroSeleccionado && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              width: "90%",
              maxWidth: "500px",
              textAlign: "center",
            }}
          >
            <h2>{perroSeleccionado.Nombre}</h2>
            <img
              src={perroSeleccionado.Imagen}
              alt={perroSeleccionado.Nombre}
              style={{
                width: "100%",
                maxWidth: "300px",
                borderRadius: "8px",
                marginBottom: "15px",
              }}
            />
            <p>
              <strong>Ubicación:</strong> {perroSeleccionado.Ubicacion}
            </p>
            <p>
              <strong>Contacto:</strong> {perroSeleccionado.Contacto}
            </p>
            <p>
              <strong>Detalles:</strong> {perroSeleccionado.Detalles}
            </p>
            <input
              type="text"
              placeholder="Ingresa tu usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              style={{
                marginBottom: "10px",
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #ddd",
                width: "100%",
              }}
            />
            <button
              onClick={validarUsuario}
              style={{
                marginBottom: "10px",
                padding: "8px 12px",
                backgroundColor: "#17a2b8",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Perro encontrado
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button
              onClick={cerrarModal}
              style={{
                marginRight: "10px",
                padding: "8px 12px",
                backgroundColor: "#dc3545",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListaPerrosPerdidos;
