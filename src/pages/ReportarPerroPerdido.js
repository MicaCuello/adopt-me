import React, { useState, useRef, useEffect } from "react";

function ReportarPerroPerdido({ userId, USER_API_URL }) {
  const [usuario, setUsuario] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [contacto, setContacto] = useState("");
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const [imagenCapturada, setImagenCapturada] = useState(null);
  const [detalles, setDetalles] = useState("");
  const [error, setError] = useState("");
  const [usuarioValido, setUsuarioValido] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const API_URL =
    "https://6745c2c5512ddbd807f9876d.mockapi.io/mascotasPerdidas/mascotas";
  const USERS_API_URL = "https://673102b37aaf2a9aff0f9326.mockapi.io/users";

  const validarUsuario = async () => {
    try {
      const response = await fetch(USERS_API_URL);
      const users = await response.json();
      const usuarioExistente = users.find((user) => user.usuario === usuario);
      if (usuarioExistente) {
        setUsuarioValido(true);
      } else {
        setUsuarioValido(false);
        setError("El nombre de usuario no existe.");
      }
    } catch (error) {
      console.error("Error al validar el usuario:", error);
      setError("Hubo un error al verificar el nombre de usuario.");
    }
  };

  useEffect(() => {
    if (usuario) {
      validarUsuario();
    } else {
      setUsuarioValido(false);
    }
  }, [usuario]);

  useEffect(() => {
    const activarCamara = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error al acceder a la cámara:", error);
      }
    };

    activarCamara();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  // Función para capturar la foto desde el video
  const capturarFoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imagenBase64 = canvas.toDataURL("image/jpeg");
    setImagenCapturada(imagenBase64); // Guardamos la imagen en formato base64
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();

    const imagenFinal = imagenCapturada || imagenSeleccionada;
    if (!imagenFinal) {
      alert("Por favor, sube o captura una imagen.");
      return;
    }

    const datos = {
      Usuario: usuario,
      Ubicacion: ubicacion,
      Contacto: contacto,
      Imagen: imagenFinal, // Enviamos la imagen como string base64
      Detalles: detalles,
      id: String(Date.now()), // Usamos la fecha actual como id único
    };

    try {
      const respuesta = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      });

      if (respuesta.ok) {
        alert("¡Reporte enviado exitosamente!");
        setDetalles("");
        setUbicacion("");
        setContacto("");
        setImagenSeleccionada(null);
        setImagenCapturada(null);
      } else {
        alert("Hubo un error al enviar el reporte. Intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error al enviar el reporte:", error);
      alert("Hubo un error de conexión.");
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "600px",
        margin: "0 auto",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>
        Reportar Perro Perdido
      </h2>
      {error ? (
        <p style={{ color: "red", textAlign: "center" }}>{error}</p>
      ) : (
        <form
          onSubmit={manejarEnvio}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ fontWeight: "bold", marginBottom: "5px" }}>
              Nombre del Usuario:
            </label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
              required
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ fontWeight: "bold", marginBottom: "5px" }}>
              Ubicación:
            </label>
            <input
              type="text"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
              required
              disabled={!usuarioValido}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ fontWeight: "bold", marginBottom: "5px" }}>
              Contacto:
            </label>
            <input
              type="text"
              value={contacto}
              onChange={(e) => setContacto(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
              required
              disabled={!usuarioValido}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ fontWeight: "bold", marginBottom: "5px" }}>
              Descripción:
            </label>
            <textarea
              value={detalles}
              onChange={(e) => setDetalles(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                height: "80px",
                resize: "none",
              }}
              required
              disabled={!usuarioValido}
            ></textarea>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ fontWeight: "bold", marginBottom: "5px" }}>
              Subir Foto:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImagenSeleccionada(URL.createObjectURL(e.target.files[0]))
              }
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
              disabled={!usuarioValido}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ fontWeight: "bold", marginBottom: "5px" }}>
              O Capturar Foto:
            </label>
            <video
              ref={videoRef}
              autoPlay
              style={{ width: "100%", maxWidth: "500px" }}
            />
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
            <button
              type="button"
              onClick={capturarFoto}
              style={{
                padding: "10px 20px",
                borderRadius: "5px",
                border: "none",
                backgroundColor: "#007bff",
                color: "#fff",
                fontWeight: "bold",
                cursor: "pointer",
                alignSelf: "center",
              }}
              disabled={!usuarioValido}
            >
              Capturar Foto
            </button>
            {imagenCapturada && (
              <img
                src={imagenCapturada}
                alt="Imagen capturada"
                style={{
                  width: "100%",
                  maxWidth: "500px",
                  borderRadius: "5px",
                  marginTop: "10px",
                }}
              />
            )}
          </div>
          <div style={{ textAlign: "center" }}>
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                borderRadius: "5px",
                border: "none",
                backgroundColor: "#28a745",
                color: "#fff",
                fontWeight: "bold",
                cursor: "pointer",
              }}
              disabled={!usuarioValido}
            >
              Enviar Reporte
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ReportarPerroPerdido;
