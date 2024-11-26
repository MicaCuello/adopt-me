import React, { useState, useEffect } from "react";
import EditarDatosUsuario from "./EditarDatosUsuario"; // Importamos el componente de edición
import AdminPanel from "./AdminPanel";

// API_URL para las solicitudes
const API_URL = "https://673102b37aaf2a9aff0f9326.mockapi.io/users";

export default function Login() {
  const [esLogin, setEsLogin] = useState(true);
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState(null); // Para manejar el ID del usuario

  useEffect(() => {
    const userId = localStorage.getItem("UsuarioId");
    const adminStatus = localStorage.getItem("EsAdmin");
    const usuarioName = localStorage.getItem("Usuario"); // Obtener el nombre de usuario desde el localStorage
    if (userId) {
      setIsLoggedIn(true);
      setUserId(userId); // Establecer el ID del usuario
      setIsAdmin(adminStatus === "true");
      setUsuario(usuarioName); // Establecer el nombre de usuario desde el localStorage
    }

    // Comprobamos si ya existe un usuario administrador
    const checkAdmin = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const adminExist = data.some((u) => u.isAdmin === true);

        // Si no hay ningún administrador, creamos uno por defecto
        if (!adminExist) {
          const defaultAdmin = {
            usuario: "admin", // Nombre del usuario administrador
            email: "admin@example.com", // Correo electrónico del administrador
            password: "admin123", // Contraseña del administrador
            isAdmin: true, // Establecemos que es un administrador
          };

          await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(defaultAdmin),
          });
          console.log("Usuario administrador creado");
        }
      } catch (error) {
        console.error("Error al verificar el administrador", error);
      }
    };

    checkAdmin(); // Llamada para verificar o crear el admin
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        alert("Error al conectar con el servidor.");
        return;
      }

      const data = await response.json();
      const user = data.find(
        (u) => u.usuario === usuario && u.password === password
      );

      if (user) {
        localStorage.setItem("UsuarioId", user.id);
        localStorage.setItem("EsAdmin", user.isAdmin);
        localStorage.setItem("Usuario", user.usuario); // Guardamos el nombre de usuario
        setIsLoggedIn(true);
        setUserId(user.id); // Guardamos el ID
        setIsAdmin(user.isAdmin);
        alert("Login exitoso");
      } else {
        alert("Credenciales incorrectas");
      }
    } catch (error) {
      alert("Error en la autenticación");
    }
  };

  const handleRegister = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      const userExist = data.some((u) => u.usuario === usuario);
      const emailExist = data.some((u) => u.email === email);

      if (userExist) {
        alert("Usuario ya registrado");
      } else if (emailExist) {
        alert("Email ya registrado");
      } else {
        const isAdmin = data.length === 0;
        const newUser = {
          usuario,
          email,
          password,
          isAdmin,
        };

        const registerResponse = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        });

        if (registerResponse.ok) {
          const nuevoUsuario = await registerResponse.json();
          localStorage.setItem("UsuarioId", nuevoUsuario.id);
          localStorage.setItem("EsAdmin", nuevoUsuario.isAdmin);
          localStorage.setItem("Usuario", nuevoUsuario.usuario); // Guardamos el nombre de usuario
          setIsLoggedIn(true);
          setUserId(nuevoUsuario.id);
          setIsAdmin(nuevoUsuario.isAdmin);
          setUsuario(nuevoUsuario.usuario); // Establecer el nombre de usuario en el estado
          alert("Registro exitoso");
        } else {
          alert("Error al registrar");
        }
      }
    } catch (error) {
      alert("Error al registrar");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUserId(null); // Limpiar el ID del usuario
    setUsuario(""); // Limpiar el nombre de usuario
  };

  const toggleMode = () => {
    setEsLogin(!esLogin);
    setUsuario("");
    setEmail("");
    setPassword("");
  };

  return (
    <div style={styles.container}>
      {isLoggedIn ? (
        <div style={styles.loggedInContainer}>
          <h2>Bienvenido, {usuario}</h2>
          {isAdmin ? (
            <p>Eres administrador. Puedes gestionar usuarios.</p>
          ) : (
            <p>Aqui puedes actualizar tus datos.</p>
          )}
          <button onClick={handleLogout} style={styles.button}>
            Cerrar sesión
          </button>
          {isAdmin ? (
            <div>
              <h3>Lista Usuarios</h3>
              <AdminPanel userId={userId} onSave={handleLogout} />
            </div>
          ) : (
            <div>
              <h3>Mis Datos</h3>
              <EditarDatosUsuario userId={userId} onSave={handleLogout} />
            </div>
          )}
        </div>
      ) : (
        <div style={styles.formContainer}>
          <h2>{esLogin ? "Iniciar sesión" : "Registrarse"}</h2>
          <input
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            style={styles.input}
          />
          {!esLogin && (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
          )}
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <button
            onClick={esLogin ? handleLogin : handleRegister}
            style={styles.button}
          >
            {esLogin ? "Login" : "Registrarse"}
          </button>
          <div style={styles.switchContainer}>
            <button onClick={toggleMode} style={styles.switchButton}>
              {esLogin
                ? "¿No tienes cuenta? Regístrate"
                : "¿Ya tienes cuenta? Login"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    backgroundColor: "#f0f8ff",
    height: "100vh",
  },
  loggedInContainer: {
    textAlign: "center",
    maxWidth: "400px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  formContainer: {
    textAlign: "center",
    maxWidth: "400px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "15px 20px",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
    fontSize: "16px",
    borderRadius: "5px",
    cursor: "pointer",
    margin: "10px 0",
  },
  switchContainer: {
    marginTop: "10px",
  },
  switchButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "#007BFF",
    fontSize: "14px",
    cursor: "pointer",
  },
  link: {
    color: "#007BFF",
    textDecoration: "none",
    marginTop: "10px",
    display: "inline-block",
  },
};
