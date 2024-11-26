import { useState, useEffect } from "react";

// URL de la API MockAPI
const API_URL = "https://673102b37aaf2a9aff0f9326.mockapi.io/users";

export default function AdminPanel() {
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    usuario: "",
    email: "",
    password: "",
    isAdmin: false,
  });

  // Cargar usuarios al iniciar
  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  const agregarUsuario = async () => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoUsuario),
      });

      if (response.ok) {
        alert("Usuario agregado exitosamente.");
        fetchUsuarios();
        setNuevoUsuario({
          usuario: "",
          email: "",
          password: "",
          isAdmin: false,
        });
      } else {
        alert("Error al agregar usuario.");
      }
    } catch (error) {
      console.error("Error al agregar usuario:", error);
    }
  };

  const eliminarUsuario = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

      if (response.ok) {
        alert("Usuario eliminado.");
        fetchUsuarios();
      } else {
        alert("Error al eliminar usuario.");
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  const editarUsuario = async (id, datosActualizados) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosActualizados),
      });

      if (response.ok) {
        alert("Usuario actualizado.");
        fetchUsuarios();
      } else {
        alert("Error al actualizar usuario.");
      }
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Gestión de Usuarios</h2>

      {/* Formulario para agregar un nuevo usuario */}
      <div>
        <h3>Agregar Usuario</h3>
        <input
          type="text"
          placeholder="Usuario"
          value={nuevoUsuario.usuario}
          onChange={(e) =>
            setNuevoUsuario({ ...nuevoUsuario, usuario: e.target.value })
          }
        />
        <input
          type="email"
          placeholder="Email"
          value={nuevoUsuario.email}
          onChange={(e) =>
            setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={nuevoUsuario.password}
          onChange={(e) =>
            setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })
          }
        />
        <label>
          <input
            type="checkbox"
            checked={nuevoUsuario.isAdmin}
            onChange={(e) =>
              setNuevoUsuario({ ...nuevoUsuario, isAdmin: e.target.checked })
            }
          />
          Administrador
        </label>
        <button onClick={agregarUsuario}>Agregar</button>
      </div>

      {/* Lista de usuarios */}
      <h3>Usuarios Registrados</h3>
      <ul>
        {usuarios.map((user) => (
          <li key={user.id}>
            <strong>{user.usuario}</strong> ({user.email}) -{" "}
            {user.isAdmin ? "Admin" : "Usuario"}{" "}
            <button onClick={() => eliminarUsuario(user.id)}>Eliminar</button>
            <button
              onClick={() =>
                editarUsuario(user.id, {
                  ...user,
                  usuario: prompt("Nuevo nombre de usuario:", user.usuario),
                })
              }
            >
              Editar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
