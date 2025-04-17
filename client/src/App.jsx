// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import ContainerCard from './components/ContainerCards';
// import NavBar from './components/NavBar'; 
// import Carousel from './components/Carousel';
// import './app.css';

// function App() {
//   const [properties, setProperties] = useState([]);

//   const backendUrl = 'http://localhost:3001';

//   useEffect(() => {
//     axios.get(`${backendUrl}/api/properties`)
//      .then(res => {
//         console.log(res.data);
//         setProperties(res.data);
//       })
//       .catch(err => console.error('Error fetching properties:', err));
//   }, []);

//   return (
//     <>
//       <NavBar />
//       <Carousel />
//       <ContainerCard properties={properties} />
//     </>
//   );
// }  

// export default App;



// 

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CategorySearch from './components/CategorySearch';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>Home Page</h1>} />
        <Route path="/categories" element={<CategorySearch />} />
      </Routes>
    </Router>
  );
}

export default App;