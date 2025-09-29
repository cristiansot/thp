import React, { useState, useEffect, useRef } from 'react';
import "../assets/css/filters.css";

const Filters = ({ properties, setFilteredProperties, showMap, setShowMap }) => {
  const [selectedType, setSelectedType] = useState('all');
  const [selectedOperation, setSelectedOperation] = useState('all');
  const filtersRef = useRef(null);

  useEffect(() => {
    let filtered = properties;

    if (selectedType !== 'all') {
      filtered = filtered.filter((property) => mapDomainToType(property.domain_id) === selectedType);
    }

    if (selectedOperation !== 'all') {
      filtered = filtered.filter((property) => mapOperation(property.operation) === selectedOperation);
    }

    setFilteredProperties(filtered);
  }, [selectedType, selectedOperation, properties, setFilteredProperties]);

  const mapDomainToType = (domainId) => {
    if (!domainId) return 'other';
    if (domainId.includes('APARTMENTS')) return 'apartment';
    if (domainId.includes('HOUSES')) return 'house';
    if (domainId.includes('OFFICES')) return 'office';
    if (domainId.includes('FARMS')) return 'land';
    return 'other';
  };

  const mapOperation = (operation) => {
    if (operation.toLowerCase() === 'venta') return 'venta';
    if (operation.toLowerCase() === 'arriendo') return 'arriendo';
    return operation;
  };

  return (
    <div
      ref={filtersRef}
      className="filters-container"
    >

      <div className="container my-3">
        <div className="row g-3 align-items-center">
          {/* Tipo de propiedad */}
         <div className="col-md-4 d-flex align-items-center">
          <label
            htmlFor="property-type-filter"
            className="me-2 mb-0 title flex-shrink-0"
          >
            Tipo de propiedad:
          </label>
          <select
            id="property-type-filter"
            className="form-select flex-grow-1"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">Todas</option>
            <option value="house">Casas</option>
            <option value="apartment">Departamentos</option>
            <option value="office">Oficinas</option>
            <option value="land">Parcelas</option>
          </select>
        </div>


          {/* Tipo de operación */}
       <div className="col-md-4 d-flex align-items-center">
          <label
            htmlFor="operation-filter"
            className="me-2 mb-0 title flex-shrink-0"
          >
            Tipo de operación:
          </label>
          <select
            id="operation-filter"
            className="form-select flex-grow-1"
            value={selectedOperation}
            onChange={(e) => setSelectedOperation(e.target.value)}
          >
            <option value="all">Todas</option>
            <option value="venta">Venta</option>
            <option value="arriendo">Arriendo</option>
          </select>
        </div>

          {/* Botón para alternar mapa/propiedades */}
          <div className="col-md-4 d-flex justify-content-center align-items-center">
            <button
              className="col-md-6 btn btn-primary"
              onClick={() => setShowMap(!showMap)}
            >
              {showMap ? 'Ver propiedades' : 'Ver mapa'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
