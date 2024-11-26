import React, { useState, useEffect } from "react";

// API_URL para las solicitudes
const API_URL = "https://673102b37aaf2a9aff0f9326.mockapi.io/users";

function EditarDatosUsuario({ userId, onSave }) {
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Obtener los datos actuales del usuario al montar el componente
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_URL}/${userId}`);
        if (response.ok) {
          const user = await response.json();
          setUsuario(user.usuario);
          setEmail(user.email);
          setPassword(user.password);
        } else {
          setError("Error al obtener los datos del usuario.");
        }
      } catch (error) {
        setError("Error en la solicitud.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // Actualizar los datos del usuario en el servidor
  const handleSave = async () => {
    if (!usuario || !email || !password) {
      setError("Por favor, complete todos los campos.");
      return;
    }

    const updatedData = { usuario, email, password };

    try {
      const response = await fetch(`${API_URL}/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        setSuccessMessage("Datos actualizados con éxito.");
        onSave(); // Notificar al componente padre que se guardaron los datos
      } else {
        setError("Error al actualizar los datos.");
      }
    } catch (error) {
      setError("Error al actualizar los datos del usuario.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Editar mis datos</h2>

      {isLoading && <p>Cargando...</p>}
      {error && <p style={styles.error}>{error}</p>}
      {successMessage && <p style={styles.success}>{successMessage}</p>}

      <label htmlFor="usuario">Usuario:</label>
      <input
        id="usuario"
        type="text"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        style={styles.input}
        disabled={isLoading}
      />

      <label htmlFor="email">Email:</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
        disabled={isLoading}
      />

      <label htmlFor="password">Contraseña:</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
        disabled={isLoading}
      />

      <button onClick={handleSave} style={styles.button} disabled={isLoading}>
        Guardar Cambios
      </button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "auto",
    padding: "20px",
    backgroundColor: "#fffcf2", // Fondo claro que complementa los colores verdes y amarillos
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    backgroundImage: 'url("https://www.example.com/animal-background.jpg")', // Fondo relacionado con animales
    backgroundSize: "cover", // Hace que el fondo cubra toda el área
    backgroundPosition: "center",
  },
  input: {
    display: "block",
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  button: {
    backgroundColor: "#f4b400", // Amarillo brillante para el botón
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s ease",
  },
  buttonHover: {
    backgroundColor: "#ff9800", // Color cuando el cursor está encima
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginBottom: "15px",
  },
  success: {
    color: "green",
    fontSize: "14px",
    marginBottom: "15px",
  },
};

export default EditarDatosUsuario;
