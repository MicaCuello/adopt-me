import React, { useState, useRef, useEffect } from "react";

function ReportarPerroPerdido({ userId, isLoggedIn, USER_API_URL }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [contactame, setContactame] = useState("");
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const [imagenCapturada, setImagenCapturada] = useState(null);
  const [error, setError] = useState("");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const API_URL =
    "https://6745c2c5512ddbd807f9876d.mockapi.io/mascotasPerdidas/mascotasPerdidas";

  useEffect(() => {
    if (isLoggedIn) {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`${USER_API_URL}/${userId}`);
          if (response.ok) {
            const user = await response.json();
            setNombre(user.usuario); // Establecemos el nombre del usuario logueado
          } else {
            setError("No se pudo obtener el usuario logueado.");
          }
        } catch (error) {
          setError("Error al obtener los datos del usuario.");
        }
      };

      fetchUserData();
    } else {
      setError("Debes loguearte para poder realizar un reporte.");
    }
  }, [userId, isLoggedIn, USER_API_URL]);

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

  const manejarCambioImagen = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      const urlImagen = URL.createObjectURL(archivo);
      setImagenSeleccionada(urlImagen);
    }
  };

  const capturarFoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      const contexto = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      contexto.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imagenData = canvas.toDataURL("image/png");
      setImagenCapturada(imagenData);
    }
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    const imagenFinal = imagenCapturada || imagenSeleccionada;
    if (!imagenFinal) {
      alert("Por favor, sube o captura una imagen.");
      return;
    }

    const datos = {
      userName: nombre,
      ubicacion,
      foto: imagenFinal,
      descripcion,
      contactame,
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
        setDescripcion("");
        setUbicacion("");
        setContactame("");
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

  const estilosContenedor = {
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    fontFamily: "Arial, sans-serif",
  };

  const estilosTitulo = {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
  };

  const estilosFormulario = {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  };

  const estilosCampo = {
    display: "flex",
    flexDirection: "column",
  };

  const estilosLabel = {
    fontWeight: "bold",
    marginBottom: "5px",
  };

  const estilosInput = {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  };

  const estilosBoton = {
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    alignSelf: "center",
  };

  const estilosImagen = {
    width: "100%",
    maxWidth: "500px",
    borderRadius: "5px",
    marginTop: "10px",
  };

  return (
    <div style={estilosContenedor}>
      <h2 style={estilosTitulo}>Reportar Perro Perdido</h2>
      {error ? (
        <p style={{ color: "red", textAlign: "center" }}>{error}</p>
      ) : (
        <form onSubmit={manejarEnvio} style={estilosFormulario}>
          <div style={estilosCampo}>
            <label style={estilosLabel}>Nombre del Usuario:</label>
            <input
              type="text"
              value={nombre}
              readOnly
              style={{
                ...estilosInput,
                backgroundColor: "#e9ecef",
                cursor: "not-allowed",
              }}
            />
          </div>
          <div style={estilosCampo}>
            <label style={estilosLabel}>Ubicación:</label>
            <input
              type="text"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              style={estilosInput}
              required
            />
          </div>
          <div style={estilosCampo}>
            <label style={estilosLabel}>Contacto:</label>
            <input
              type="text"
              value={contactame}
              onChange={(e) => setContactame(e.target.value)}
              style={estilosInput}
              required
            />
          </div>
          <div style={estilosCampo}>
            <label style={estilosLabel}>Descripción:</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              style={{ ...estilosInput, height: "80px", resize: "none" }}
              required
            ></textarea>
          </div>
          <div style={estilosCampo}>
            <label style={estilosLabel}>Subir Foto:</label>
            <input
              type="file"
              accept="image/*"
              onChange={manejarCambioImagen}
              style={estilosInput}
            />
          </div>
          <div style={estilosCampo}>
            <label style={estilosLabel}>O Capturar Foto:</label>
            <video
              ref={videoRef}
              autoPlay
              style={{ width: "100%", maxWidth: "500px" }}
            />
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
            <button type="button" onClick={capturarFoto} style={estilosBoton}>
              Capturar Foto
            </button>
          </div>
          {imagenSeleccionada && (
            <img
              src={imagenSeleccionada}
              alt="Imagen seleccionada"
              style={estilosImagen}
            />
          )}
          {imagenCapturada && (
            <img
              src={imagenCapturada}
              alt="Imagen capturada"
              style={estilosImagen}
            />
          )}
          <button type="submit" style={estilosBoton}>
            Enviar Reporte
          </button>
        </form>
      )}
    </div>
  );
}

export default ReportarPerroPerdido;
