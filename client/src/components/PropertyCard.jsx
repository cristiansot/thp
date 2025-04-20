import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import bedroomIcon from '../assets/img/icons/bedroom.svg';
import bathroomIcon from '../assets/img/icons/bathroom.svg';
import metersIcon from '../assets/img/icons/meters.svg';

import '../assets/css/propertyCard.css';

function PropertyCard({ title, price, permalink, image, area, bedrooms, bathrooms, video_id }) {
  // Determinar si la imagen es una URL externa o local
  let imageUrl;
  try {
    imageUrl = image?.startsWith('http')
      ? image
      : new URL(`../assets/img/properties/${image}`, import.meta.url).href;
  } catch {
    imageUrl = ''; // fallback si no hay imagen válida
  }

  return (
    <Card className="mb-4 shadow-sm">
      {imageUrl && (
        <Card.Img
          src={imageUrl}
          className="card-img-top"
          alt={title}
          width="500"
          height="300"
        />
      )}

      <Card.Body>
        <Card.Title className="card--title">{title}</Card.Title>
        <Card.Text className="card--price">${price}</Card.Text>

        <div className="container--icons">
          <Card.Text className="card--text mr-3 m-1">
            <img className="icons" src={metersIcon} alt="Metros cuadrados" />
            {area || 'N/A'}
          </Card.Text>

          <Card.Text className="card--text mr-3 m-1">
            <img className="icons" src={bedroomIcon} alt="Dormitorios" />
            {bedrooms || 'N/A'}
          </Card.Text>

          <Card.Text className="card--text mr-3 m-1">
            <img className="icons" src={bathroomIcon} alt="Baños" />
            {bathrooms || 'N/A'}
          </Card.Text>
        </div>

        {/* Botones de acciones */}
        <div className="d-flex gap-2 mt-3">
          {permalink && (
            <Button
              variant="dark"
              className="button-ver-propiedades"
              href={permalink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver Propiedad
            </Button>
          )}

          {video_id && (
            <Button
              variant="secondary"
              className="button-ver-propiedades"
              href={video_id}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver Tour
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default PropertyCard;
