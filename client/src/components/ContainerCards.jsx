import React from 'react';
import PropertyCard from './PropertyCard';
import '../app.css';

const ContainerCard = ({ properties, loading, error }) => {
  if (loading) return <p className="loading">Cargando propiedades...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="container">
      <div className="row d-flex md">
        {properties.length > 0 ? (
          properties.map((p, idx) => (
            <div key={idx} className="col-sm-12 col-md-6 col-xl-4">
              <PropertyCard {...p} />
            </div>
          ))
        ) : (
          <p className="loading">No hay propiedades disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default ContainerCard;
