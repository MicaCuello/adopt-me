import React, { useState, useEffect } from "react";

// API_URL para las solicitudes
const API_URL = "https://673102b37aaf2a9aff0f9326.mockapi.io/users";

function EditarDatosUsuario({ userId, onSave }) {
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
          console.error("Error al obtener los datos del usuario.");
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  // Actualizar los datos del usuario en el servidor
  const handleSave = async () => {
    const updatedData = {
      usuario,
      email,
      password,
    };

    try {
      const response = await fetch(`${API_URL}/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        alert("Datos actualizados con éxito.");
        onSave(); // Notificar al componente padre que se guardaron los datos
      } else {
        alert("Error al actualizar los datos.");
      }
    } catch (error) {
      console.error("Error al actualizar los datos del usuario:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Editar mis datos</h2>
      <label>Usuario:</label>
      <input
        type="text"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        style={styles.input}
      />

      <label>Email:</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />

      <label>Contraseña:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />

      <button onClick={handleSave} style={styles.button}>
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
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
  },
  input: {
    display: "block",
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    backgroundColor: "#4caf50",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default EditarDatosUsuario;
