// src/components/MapView.jsx
const MapView = ({ properties }) => {
  return (
    <MapContainer center={[-33.45, -70.6667]} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {properties.map((property) => {
        const { latitude, longitude, title, price, bedrooms, bathrooms } = property;

        return (
          latitude && longitude && (
            <Marker 
              key={property.id} 
              position={[latitude, longitude]}
            >
              <Popup>
                <div>
                  <h3>{title}</h3>
                  <p>Precio: ${price}</p>
                  <p>Habitaciones: {bedrooms}</p>
                  <p>Baños: {bathrooms}</p>
                </div>
              </Popup>
            </Marker>
          )
        );
      })}
    </MapContainer>
  );
};
