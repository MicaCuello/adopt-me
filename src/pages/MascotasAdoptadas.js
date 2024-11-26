import React, { useState, useEffect } from "react";
// import { useAuth } from "./AuthContext";

function Mascotas() {
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedMascota, setSelectedMascota] = useState(null); // Estado para la mascota seleccionada
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para abrir/cerrar el modal
  const [usuarioId, setUsuarioId] = useState(null); // Estado para almacenar el ID del usuario

  // Obtener el ID del usuario desde el MockAPI
  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await fetch(
          "https://673102b37aaf2a9aff0f9326.mockapi.io/users/1"
        ); // Aquí asumo que siempre es el usuario con ID 1
        const data = await response.json();
        setUsuarioId(data.id);
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
      }
    };

    fetchUsuario();
  }, []);

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

  const handleAdoptar = async () => {
    if (!usuarioId || !selectedMascota) return;

    // Crear el objeto para el POST
    const mascotaAdoptada = {
      idUsuario: usuarioId,
      idMascota: selectedMascota.id,
    };

    try {
      // Hacer el POST a usuarioMascota
      const response = await fetch(
        "https://673102b37aaf2a9aff0f9326.mockapi.io/api/usuarioMascota",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mascotaAdoptada),
        }
      );

      if (response.ok) {
        alert(`¡Has adoptado a ${selectedMascota.nombre}!`);
        handleCloseModal();

        // Actualizar las mascotas para reflejar la adopción (esto puede implicar eliminar la mascota de la lista)
        setMascotas((prevMascotas) =>
          prevMascotas.filter((mascota) => mascota.id !== selectedMascota.id)
        );
      } else {
        console.error("Error al adoptar la mascota:", response);
        alert("Hubo un error al adoptar la mascota.");
      }
    } catch (error) {
      console.error("Error al hacer el POST:", error);
      alert("Hubo un error al adoptar la mascota.");
    }
  };

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
    fontStyle: "italic",
    color: "#555",
  },
  noMore: {
    textAlign: "center",
    color: "#aaa",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    maxWidth: "400px",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    position: "relative",
  },
  modalImage: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "10px",
  },
  adoptButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1.2rem",
    margin: "10px 0",
  },
  closeButton: {
    backgroundColor: "#ccc",
    color: "#333",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
  },
};

export default Mascotas;
