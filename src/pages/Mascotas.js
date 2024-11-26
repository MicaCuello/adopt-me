import React, { useState, useEffect } from "react";

function Mascotas() {
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

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
            <div key={mascota.id} style={styles.mascotaCard}>
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
  },
  mascotaCardHovered: {
    transform: "scale(1.05)",
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
  link: {
    textDecoration: "none",
    color: "#007bff",
    fontWeight: "bold",
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
};

export default Mascotas;
