import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Configurar los íconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

const FitMapToProperties = ({ properties }) => {
  const map = useMap();

  React.useEffect(() => {
    const coords = properties
      .filter(p => p.latitude && p.longitude)
      .map(p => [p.latitude, p.longitude]);

    if (coords.length === 1) {
      map.setView(coords[0], 17);
    } else if (coords.length > 1) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [20, 20], maxZoom: 16 });
    }
  }, [map, properties]);

  return null;
};

const MapView = ({ properties = [] }) => {
  const renderBedroomsOrOffices = (bedrooms, offices) => {
    if (bedrooms && bedrooms > 0) {
      return `${bedrooms} ${bedrooms === 1 ? 'Dormitorio' : 'Dormitorios'}`;
    } else if (offices && offices > 0) {
      return `${offices} ${offices === 1 ? 'Oficina' : 'Oficinas'}`;
    }
    return 'Sin información de dormitorios';
  };

  const formatPrice = (value) => {
    if (!value) return '';
    const numericPrice = parseInt(value.toString().replace(/\D/g, ''), 10);
    if (isNaN(numericPrice) || numericPrice === 0) return '';
    const formatted = numericPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return numericPrice <= 99999 ? `UF ${formatted}` : `$${formatted}`;
  };

  return (
    <MapContainer
      center={[-33.45, -70.6667]}
      zoom={13}
      style={{ height: '800px', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">Carto</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />

      <FitMapToProperties properties={properties} />

      {properties.map((prop) =>
        prop.latitude && prop.longitude && (
          <Marker 
            key={prop.id} 
            position={[prop.latitude, prop.longitude]}
            eventHandlers={{
              click: (e) => {
                const map = e.target._map;
                const marker = e.target;
                const popup = marker.getPopup();
                
                // Abre el popup si no está abierto
                if (!popup.isOpen()) {
                  marker.openPopup();
                }
                
                // Ajusta la vista para mostrar completamente el popup
                const popupLatLng = marker.getLatLng();
                const popupHeight = popup.getElement().offsetHeight;
                const offset = map.project(popupLatLng, map.getZoom())
                  .subtract(map.project(map.getCenter(), map.getZoom()))
                  .add([0, -popupHeight/2]);
                
                map.panBy(offset, { animate: true, duration: 0.5 });
              }
            }}
          >
            <Popup className="custom-popup">
              <a
                href={prop.permalink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{ maxWidth: '240px' }}>
                  {prop.image && (
                    <img
                      src={prop.image}
                      alt={prop.title}
                      style={{
                        width: '100%',
                        height: '150px',
                        objectFit: 'cover',
                        borderRadius: '5px'
                      }}
                    />
                  )}
                  <h5 style={{ margin: '10px 0 5px 0', fontWeight: 500 }}>{prop.title}</h5>
                  <h5 style={{ margin: 0, color: '#2998ff' }}>
                    Precio: {formatPrice(prop.price)}
                  </h5>
                  <h6 style={{ margin: 0 }}>
                    {renderBedroomsOrOffices(prop.bedrooms, prop.offices)}
                  </h6>
                  {prop.bathrooms && prop.bathrooms > 0 && (
                    <h6 style={{ margin: 0 }}>
                      {`${prop.bathrooms} ${prop.bathrooms === 1 ? 'Baño' : 'Baños'}`}
                    </h6>
                  )}
                  {(prop.area || prop.total_area) && (
                    <h6 style={{ margin: 0 }}>
                      {prop.area || prop.total_area} m²
                    </h6>
                  )}
                </div>
              </a>
            </Popup>
          </Marker>
        )
      )}
    </MapContainer>
  );
};

export default MapView;