import { useEffect, useState } from 'react';
import axios from 'axios';
import ContainerCard from './components/ContainerCards';
import NavBar from './components/NavBar'; 
import Carousel from './components/Carousel';
import './app.css';

function App() {
  const [properties, setProperties] = useState([]);

  const backendUrl = 'https://thp-backend-16jj.onrender.com';

  useEffect(() => {
    axios.get(`${backendUrl}/api/properties`)
     .then(res => {
        console.log(res.data);
        setProperties(res.data);
      })
      .catch(err => console.error('Error fetching properties:', err));
  }, []);

  return (
    <>
      <NavBar />
      <Carousel />
      <ContainerCard properties={properties} />
    </>
  );
}

export default App;
