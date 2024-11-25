import { useState, useEffect } from "react";

// API_URL para las solicitudes
const API_URL = "https://673102b37aaf2a9aff0f9326.mockapi.io/users";

export default function Login() {
  const [esLogin, setEsLogin] = useState(false);
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validations, setValidations] = useState({
    username: false,
    email: false,
    minLength: false,
    specialChar: false,
    uppercase: false,
    lowercase: false,
    number: false,
  });

  // Validar entradas de formulario
  const validateInputs = () => {
    setValidations({
      username: usuario.length > 5,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      minLength: password.length >= 8,
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
    });
  };

  useEffect(() => {
    validateInputs();
  }, [usuario, email, password]);

  // Función para manejar el login
  const handleLogin = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        console.error("Error en la respuesta:", response.status);
        alert("Error al conectar con el servidor.");
        return;
      }

      const data = await response.json();
      const user = data.find(
        (u) => u.usuario === usuario && u.password === password
      );

      if (user) {
        localStorage.setItem("UsuarioId", user.id);
        alert("Login Conseguido");
        // Aquí debes redirigir a la página principal o dashboard
        window.location.href = "/dashboard";
      } else {
        alert("Login Fallido");
      }
    } catch (error) {
      console.error("Error en la autenticación:", error);
      alert("Error en la autenticación");
    }
  };

  // Función para manejar el registro
  const handleRegister = async () => {
    console.log("Usuario: ", usuario);
    console.log("Password: ", password);

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
        const body = JSON.stringify({
          usuario: usuario,
          email: email,
          password: password,
        });

        const registerResponse = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: body,
        });

        if (registerResponse.ok) {
          alert("Registro Exitoso");
          const nuevoUsuario = await registerResponse.json();

          localStorage.setItem("UsuarioId", nuevoUsuario.id);
          console.log(
            "UsuarioId almacenado después del registro:",
            nuevoUsuario.id
          );

          // Redirige después de un registro exitoso
          window.location.href = "/dashboard";
        } else {
          alert("Error al registrar el usuario");
        }
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      alert("Error en la autenticación");
    }
  };

  // Cambiar entre el modo de Login y Registro
  const toggleMode = () => {
    setEsLogin((prev) => !prev);
    setUsuario("");
    setEmail("");
    setPassword("");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{esLogin ? "Login" : "Adopt-me"}</h2>
      <label>Usuario:</label>
      <input
        style={styles.input}
        placeholder="Ingrese su Usuario"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
      />
      {!esLogin && (
        <p
          style={{
            ...styles.validationText,
            color: validations.username ? "green" : "red",
          }}
        >
          {validations.username ? "✓" : "✗"} Nombre de usuario (mínimo 6
          caracteres)
        </p>
      )}

      {!esLogin && (
        <>
          <label>Email:</label>
          <input
            style={styles.input}
            placeholder="Ingrese su Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p
            style={{
              ...styles.validationText,
              color: validations.email ? "green" : "red",
            }}
          >
            {validations.email ? "✓" : "✗"} Email válido (contiene '@')
          </p>
        </>
      )}

      <label>Password:</label>
      <input
        type="password"
        style={styles.input}
        placeholder="Ingrese su password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {!esLogin && (
        <div style={{ ...styles.validationContainer, marginBottom: 20 }}>
          <p
            style={{
              ...styles.validationText,
              color: validations.minLength ? "green" : "red",
            }}
          >
            {validations.minLength ? "✓" : "✗"} Contraseña (mínimo 8 caracteres)
          </p>
          <p
            style={{
              ...styles.validationText,
              color: validations.specialChar ? "green" : "red",
            }}
          >
            {validations.specialChar ? "✓" : "✗"} 1 carácter especial
          </p>
          <p
            style={{
              ...styles.validationText,
              color: validations.uppercase ? "green" : "red",
            }}
          >
            {validations.uppercase ? "✓" : "✗"} 1 letra mayúscula
          </p>
          <p
            style={{
              ...styles.validationText,
              color: validations.lowercase ? "green" : "red",
            }}
          >
            {validations.lowercase ? "✓" : "✗"} 1 letra minúscula
          </p>
          <p
            style={{
              ...styles.validationText,
              color: validations.number ? "green" : "red",
            }}
          >
            {validations.number ? "✓" : "✗"} 1 número
          </p>
        </div>
      )}

      <div style={styles.register}>
        <button
          style={styles.button}
          onClick={esLogin ? handleLogin : handleRegister}
        >
          {esLogin ? "Iniciar Sesión" : "Regístrate"}
        </button>
      </div>

      <div style={styles.switchContainer}>
        <p style={styles.switchText}>
          {esLogin ? "Cambia a Registro" : "Cambia a Login"}
        </p>
        <label style={styles.switchText}>
          <input type="checkbox" checked={esLogin} onChange={toggleMode} />
        </label>
      </div>
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
    textAlign: "center",
  },
  register: {
    marginVertical: "20px",
  },
  button: {
    backgroundColor: "#007bff",
    padding: "12px 30px",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
  },
  validationContainer: {
    width: "100%",
  },
  validationText: {
    fontSize: "14px",
    marginBottom: "5px",
  },
  switchContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: "20px",
  },
  switchText: {
    fontSize: "16px",
    marginRight: "10px",
  },
};