// ContainerCard.jsx
import React from "react";
import PropertyCard from "./PropertyCard";
import '../app.css'

const ContainerCard = ({ properties }) => {
  return (
    <div className="container">
      <div className="row d-flex">
        {properties.length > 0 ? (
          properties.map((p, idx) => (
            <div key={idx} className="col-md-4">
              <PropertyCard {...p} />
            </div>
          ))
        ) : (
          <p className='loading'>Cargando propiedades...</p>
        )}
      </div>
    </div>
  );
};

export default ContainerCard;
