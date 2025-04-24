import React, { useState } from 'react';

const Filters = ({ properties, setFilteredProperties }) => {
  const [selectedType, setSelectedType] = useState('all');

  const handleFilterChange = (e) => {
    const selected = e.target.value;
    setSelectedType(selected);

    const filtered = properties.filter((property) => {
      const op = property.operation?.toUpperCase() || '';
      if (selected === 'all') return true;
      if (selected === 'apartment') return op.includes('APARTMENTS');
      if (selected === 'house') return op.includes('HOUSES');
      if (selected === 'office') return op.includes('OFFICES');
      if (selected === 'land') return op.includes('FARMS');
      return false;
    });

    setFilteredProperties(filtered);
  };

  return (
    <div>
      <label htmlFor="type-filter">Filtrar por tipo:</label>
      <select id="type-filter" value={selectedType} onChange={handleFilterChange}>
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
