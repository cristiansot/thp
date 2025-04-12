import { useEffect, useState } from 'react';
import axios from 'axios';
import PropertyCard from './components/PropertyCard.jsx';

function App() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/properties')
      .then(res => {
        console.log(res.data);
        setProperties(res.data);
      })
      .catch(err => console.error('Error fetching properties:', err));
  }, []);  

  return (
    <div className="container mt-4">
      <div className="row d-flex">
        {properties.length > 0 ? (
          properties.map((p, idx) => (
            <div key={idx} className="col-md-4">
              <PropertyCard {...p} />
            </div>
          ))
        ) : (
          <p>Cargando propiedades...</p>
        )}
      </div>
    </div>
  );  
}

export default App;
