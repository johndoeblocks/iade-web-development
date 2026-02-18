import { useState, useEffect } from 'react';
import './Lojas.css';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Haversine formula — calculates distance in km between two lat/lng points
 */
function calcularDistancia(lat1, lng1, lat2, lng2) {
  const R = 6371; // Raio da Terra em km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Lojas page - Fetches store locations from the backend API
 */
function Lojas() {
  const [lojas, setLojas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nearestId, setNearestId] = useState(null);
  const [distances, setDistances] = useState({});
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState(null);

  useEffect(() => {
    async function fetchStores() {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/stores`);
        if (!res.ok) throw new Error('Erro ao carregar lojas');
        const data = await res.json();
        setLojas(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStores();
  }, []);

  function encontrarMaisPerto() {
    if (!navigator.geolocation) {
      setGeoError('O seu browser não suporta geolocalização');
      return;
    }

    setGeoLoading(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        let minDist = Infinity;
        let closestId = null;
        const dists = {};

        lojas.forEach((loja) => {
          const dist = calcularDistancia(
            latitude,
            longitude,
            loja.coordenadas.lat,
            loja.coordenadas.lng
          );
          dists[loja.id] = dist;
          if (dist < minDist) {
            minDist = dist;
            closestId = loja.id;
          }
        });

        setDistances(dists);
        setNearestId(closestId);
        setGeoLoading(false);

        // Scroll to nearest card
        const el = document.getElementById(`loja-${closestId}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      },
      (err) => {
        console.error('Geolocation error:', err);
        setGeoError('Não foi possível obter a sua localização');
        setGeoLoading(false);
      }
    );
  }

  if (loading) {
    return (
      <div className="lojas">
        <section className="lojas__hero">
          <h1 className="lojas__title">As Nossas Lojas</h1>
          <p className="lojas__subtitle">A carregar...</p>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lojas">
        <section className="lojas__hero">
          <h1 className="lojas__title">Oops!</h1>
          <p className="lojas__subtitle">{error}</p>
        </section>
      </div>
    );
  }

  return (
    <div className="lojas">
      <section className="lojas__hero">
        <h1 className="lojas__title">As Nossas Lojas</h1>
        <p className="lojas__subtitle">
          Encontre a Padre Gino's mais perto de si
        </p>
        <button
          className="lojas__geo-btn"
          onClick={encontrarMaisPerto}
          disabled={geoLoading}
        >
          {geoLoading ? '📡 A localizar...' : '📍 Loja Mais Perto de Mim'}
        </button>
        {geoError && <p className="lojas__geo-error">{geoError}</p>}
      </section>

      <section className="lojas__list">
        <div className="lojas__grid">
          {lojas.map(loja => (
            <div
              key={loja.id}
              id={`loja-${loja.id}`}
              className={`loja-card ${nearestId === loja.id ? 'loja-card--nearest' : ''}`}
            >
              {nearestId === loja.id && (
                <div className="loja-card__badge">⭐ Mais Perto!</div>
              )}
              <div className="loja-card__icon">📍</div>
              <h2 className="loja-card__nome">{loja.nome}</h2>
              {distances[loja.id] !== undefined && (
                <p className="loja-card__distance">
                  📏 {distances[loja.id].toFixed(1)} km de si
                </p>
              )}
              <div className="loja-card__info">
                <div className="loja-card__row">
                  <span className="loja-card__label">📌 Morada</span>
                  <span className="loja-card__value">{loja.morada}</span>
                </div>
                <div className="loja-card__row">
                  <span className="loja-card__label">📞 Telefone</span>
                  <span className="loja-card__value">{loja.telefone}</span>
                </div>
                <div className="loja-card__row">
                  <span className="loja-card__label">🕐 Horário</span>
                  <span className="loja-card__value">{loja.horario}</span>
                </div>
              </div>
              <a
                href={`https://www.google.com/maps?q=${loja.coordenadas.lat},${loja.coordenadas.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="loja-card__btn"
              >
                Ver no Mapa
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Lojas;
