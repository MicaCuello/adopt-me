import React, { useState, useEffect } from "react";
import EditarDatosUsuario from "./EditarDatosUsuario"; // Si es necesario

const API_URL = "https://673102b37aaf2a9aff0f9326.mockapi.io/users";

export default function AdminPanelModal() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false); // Estado para manejar la visibilidad del modal

  useEffect(() => {
    // Cargar la lista de usuarios cuando el componente se monta
    const fetchUsuarios = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          alert("Error al obtener la lista de usuarios.");
          return;
        }
        const data = await response.json();
        setUsuarios(data);
      } catch (error) {
        alert("Error al obtener la lista de usuarios.");
      }
    };

    fetchUsuarios();
  }, []);

  const handleEliminarUsuario = async (id) => {
    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar este usuario?"
    );
    if (confirmar) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          alert("Usuario eliminado con éxito");
          // Filtrar el usuario eliminado de la lista
          setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
        } else {
          alert("Error al eliminar el usuario.");
        }
      } catch (error) {
        alert("Error al eliminar el usuario.");
      }
    }
  };

  const handleEditarUsuario = (usuario) => {
    setUsuarioSeleccionado(usuario);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("username");
    window.location.href = "/login"; // Redirige a la página de login
  };

  // Abrir y cerrar el modal
  const toggleModal = () => {
    setModalAbierto(!modalAbierto);
  };

  return (
    <div>
      {/* Botón para abrir el modal */}
      <button onClick={toggleModal} style={styles.button}>
        Lista Usuarios
      </button>

      {/* Modal */}
      {modalAbierto && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <button onClick={toggleModal} style={styles.closeButton}>
              X
            </button>
            <h2>Panel de administración</h2>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Cerrar sesión
            </button>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{usuario.usuario}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.isAdmin ? "Administrador" : "Usuario"}</td>
                    <td>
                      <button
                        onClick={() => handleEditarUsuario(usuario)}
                        style={styles.button}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminarUsuario(usuario.id)}
                        style={styles.button}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {usuarioSeleccionado && (
              <div style={styles.editarUsuario}>
                <h3>Editar Usuario</h3>
                <EditarDatosUsuario userId={usuarioSeleccionado.id} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  button: {
    padding: "10px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginBottom: "20px",
  },
  logoutButton: {
    backgroundColor: "#FF5733",
    color: "#fff",
    padding: "10px 20px",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginBottom: "20px",
    textAlign: "center",
  },
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "20px",
    width: "80%",
    maxHeight: "80%",
    overflowY: "auto",
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "#FF5733",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    fontSize: "16px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  tableCell: {
    padding: "10px",
    border: "1px solid #ddd",
  },
  editarUsuario: {
    marginTop: "20px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
};
