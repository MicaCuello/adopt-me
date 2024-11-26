import React, { useState, useEffect } from "react";
import EditarDatosUsuario from "./EditarDatosUsuario"; // Importamos el componente de edición

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
    <div style={{ padding: "20px" }}>
      {isLoggedIn ? (
        <div>
          <h2>Bienvenido, {usuario}</h2>
          {isAdmin ? (
            <p>Eres administrador. Puedes gestionar usuarios.</p>
          ) : (
            <p>Eres un usuario normal. Solo puedes actualizar tus datos.</p>
          )}
          <button onClick={handleLogout}>Cerrar sesión</button>
          {isAdmin ? (
            <a href="/admin.html">Ir a gestión de usuarios</a>
          ) : (
            <div>
              <h3>Mis Datos</h3>
              <EditarDatosUsuario userId={userId} onSave={handleLogout} />
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2>{esLogin ? "Iniciar sesión" : "Registrarse"}</h2>
          <input
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
          {!esLogin && (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          )}
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={esLogin ? handleLogin : handleRegister}>
            {esLogin ? "Login" : "Registrarse"}
          </button>
          <button onClick={toggleMode}>
            {esLogin
              ? "¿No tienes cuenta? Regístrate"
              : "¿Ya tienes cuenta? Login"}
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f8ff",
    padding: "20px",
  },
  input: {
    height: "40px",
    width: "100%",
    border: "1px solid #ccc",
    marginBottom: "10px",
    padding: "10px",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#2f3640",
    marginBottom: "30px",
  },
  button: {
    height: "40px",
    width: "100%",
    backgroundColor: "#2f3640",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  validationText: {
    fontSize: "14px",
    marginTop: "5px",
  },
  validationContainer: {
    marginBottom: "20px",
  },
  register: {
    marginTop: "20px",
  },
  switchContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: "15px",
  },
  switchText: {
    fontSize: "16px",
    marginRight: "10px",
  },
  logout: {
    marginTop: "20px",
  },
};
