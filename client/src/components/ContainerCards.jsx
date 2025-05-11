import React from 'react';
import { motion } from 'framer-motion';
import PropertyCard from './PropertyCard';
import '../app.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Retraso entre cada card
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const ContainerCard = ({ properties, loading, error }) => {
  if (loading)
    return (
      <div className="text-center p-5">
  <p className="loading mb-2">Cargando propiedades...</p>
  <div className="d-flex justify-content-center">
    <div className="progress" style={{ width: '300px', height: '4px' }}>
      <div
        className="progress-bar progress-bar-striped progress-bar-animated bg-info"
        style={{ width: '100%' }}      ></div>
    </div>
  </div>
</div>

    );
  if (error) return <p className="error">Error: {error.message || JSON.stringify(error)}</p>;

  return (
    <div className="container" style={{ padding: '0px' }}>
      <motion.div
        className="row d-flex md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {properties.length > 0 ? (
          properties.map((p, idx) => (
            <motion.div
              key={idx}
              className="col-sm-12 col-md-6 col-xl-4"
              variants={cardVariants}
            >
              <PropertyCard {...p} />
            </motion.div>
          ))
        ) : (
          <p className="loading">No hay propiedades disponibles.</p>
        )}
      </motion.div>
    </div>
  );
};

export default ContainerCard;