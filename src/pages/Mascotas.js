import React, { useState, useEffect } from "react";

function Mascotas() {
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedMascota, setSelectedMascota] = useState(null); // Estado para la mascota seleccionada
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para abrir/cerrar el modal

  const fetchMascotas = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://huachitos.cl/api/animales/?page=${page}&limit=20`
      );
      const data = await response.json();

      if (data.data && Array.isArray(data.data)) {
        if (data.data.length === 0) {
          setHasMore(false);
        } else {
          setMascotas((prevMascotas) => [...prevMascotas, ...data.data]);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error al cargar las mascotas:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
    if (bottom && !loading && hasMore) {
      setPage(page + 1);
    }
  };

  const handleMascotaClick = (mascota) => {
    setSelectedMascota(mascota);
    setIsModalOpen(true); // Abre el modal al hacer clic en una mascota
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMascota(null);
  };

// logica adopcion //


const handleAdoptar = async () => {
  // Obtener el ID del usuario de la Mokapi
  const usuarioId = 1; // Asumiendo que el ID del usuario es 1, deberías obtenerlo dinámicamente.

  const mascotaId = selectedMascota.id;

  // Realizar el POST para adoptar
  try {
    const response = await fetch(
      "https://673102b37aaf2a9aff0f9326.mockapi.io/api/usuarioMascota",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuarioId,
          mascotaId,
        }),
      }
    );

    if (response.ok) {
      // Si la adopción fue exitosa, actualizamos el estado de mascotas
      alert(`¡Has adoptado a ${selectedMascota.nombre}!`);

      // Eliminamos la mascota adoptada de la lista de mascotas disponibles
      setMascotas((prevMascotas) =>
        prevMascotas.filter((mascota) => mascota.id !== mascotaId)
      );
      handleCloseModal();
    } else {
      alert("Hubo un error al adoptar la mascota. Intenta nuevamente.");
    }
  } catch (error) {
    console.error("Error al adoptar la mascota:", error);
    alert("Hubo un error al adoptar la mascota.");
  }
};


  // fin de logica de boton
  useEffect(() => {
    fetchMascotas();
  }, [page]);

  return (
    <div style={styles.container} onScroll={handleScroll}>
      <h1 style={styles.title}>Adopta una Mascota</h1>
      <div style={styles.mascotasContainer}>
        {mascotas.length === 0 && !loading && (
          <p style={styles.noMascotas}>No hay mascotas disponibles.</p>
        )}
        <div style={styles.mascotasList}>
          {mascotas.map((mascota) => (
            <div
              key={mascota.id}
              style={styles.mascotaCard}
              onClick={() => handleMascotaClick(mascota)} // Abre el modal al hacer clic
            >
              <img
                src={mascota.imagen}
                alt={mascota.nombre}
                style={styles.mascotaImage}
              />
              <div style={styles.mascotaInfo}>
                <h3 style={styles.mascotaTitle}>{mascota.nombre}</h3>
                <p style={styles.mascotaText}>
                  {mascota.tipo} - {mascota.edad}
                </p>
                <p style={styles.mascotaText}>Estado: {mascota.estado}</p>
                <p style={styles.mascotaText}>{mascota.desc_personalidad}</p>
              </div>
            </div>
          ))}
        </div>
        {loading && <p style={styles.loadingText}>Cargando...</p>}
        {!hasMore && !loading && (
          <p style={styles.noMore}>No hay más mascotas para mostrar.</p>
        )}
      </div>

      {/* Modal para mostrar los detalles de la mascota seleccionada */}
      {isModalOpen && selectedMascota && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>{selectedMascota.nombre}</h2>
            <img
              src={selectedMascota.imagen}
              alt={selectedMascota.nombre}
              style={styles.modalImage}
            />
            <p>
              <strong>Tipo:</strong> {selectedMascota.tipo}
            </p>
            <p>
              <strong>Edad:</strong> {selectedMascota.edad}
            </p>
            <p>
              <strong>Estado:</strong> {selectedMascota.estado}
            </p>
            <p>
              <strong>Personalidad:</strong> {selectedMascota.desc_personalidad}
            </p>
            <button style={styles.adoptButton} onClick={handleAdoptar}>
              Adoptar
            </button>
            <button style={styles.closeButton} onClick={handleCloseModal}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxHeight: "80vh",
    overflowY: "auto",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
  },
  title: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
    fontFamily: "Arial, sans-serif",
    fontSize: "2rem",
  },
  mascotasContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  mascotasList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  },
  mascotaCard: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease",
    cursor: "pointer",
  },
  mascotaImage: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
  },
  mascotaInfo: {
    padding: "10px",
  },
  mascotaTitle: {
    fontSize: "1.5rem",
    margin: "0",
    color: "#333",
  },
  mascotaText: {
    color: "#555",
    fontSize: "1rem",
    margin: "5px 0",
  },
  loadingText: {
    textAlign: "center",
    color: "#007bff",
  },
  noMascotas: {
    textAlign: "center",
    color: "#999",
  },
  noMore: {
    textAlign: "center",
    color: "#999",
  },
  modalOverlay: {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    maxWidth: "500px",
    width: "100%",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  modalImage: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  adoptButton: {
    backgroundColor: "#4caf50",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "10px",
  },
  closeButton: {
    backgroundColor: "#ccc",
    color: "black",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "10px",
    marginLeft: "10px",
  },
};

export default Mascotas;
