import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Configurar los íconos para evitar errores
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

const MapView = ({ properties, zoom = 13 }) => {
  return (
    <MapContainer center={[-33.45, -70.6667]} zoom={zoom} style={{ height: '800px', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">Carto</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      
      {properties.map((property) => {
        const { id, title, price, latitude, longitude, permalink } = property;

        // Validación de coordenadas
        if (typeof latitude !== 'number' || typeof longitude !== 'number') {
          console.error(`Propiedad ${id} tiene coordenadas inválidas.`);
          return null;
        }

        return (
          <Marker key={id} position={[latitude, longitude]}>
            <Popup>
              <strong>{title}</strong><br />
              Precio: ${price}<br />
              <a href={permalink} target="_blank" rel="noopener noreferrer">Ver detalles</a>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default MapView;
