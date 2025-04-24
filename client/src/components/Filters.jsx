import React, { useState } from 'react';

const Filters = ({ properties, setFilteredProperties }) => {
  const [selectedType, setSelectedType] = useState('all');

  const handleFilterChange = (event) => {
    const selected = event.target.value;
    setSelectedType(selected);

    if (selected === 'all') {
      setFilteredProperties(properties);
    } else {
      const filtered = properties.filter((property) => {
        const domain = property.domain_id?.toUpperCase() || '';
        switch (selected) {
          case 'apartment':
            return domain.includes('APARTMENTS');
          case 'house':
            return domain.includes('HOUSES');
          case 'office':
            return domain.includes('OFFICES');
          case 'land':
            return domain.includes('FARMS');
          default:
            return true;
        }
      });
      setFilteredProperties(filtered);
    }
  };

  return (
    <div style={{ margin: '1rem' }}>
      <label htmlFor="type-filter">Filtrar por tipo de propiedad:</label>
      <select
        id="type-filter"
        value={selectedType}
        onChange={handleFilterChange}
        style={{ marginLeft: '0.5rem', padding: '0.3rem' }}
      >
        <option value="all">Todas</option>
        <option value="house">Casas</option>
        <option value="apartment">Departamentos</option>
        <option value="office">Oficinas</option>
        <option value="land">Parcelas</option>
      </select>
    </div>
  );
};

export default Filters;
