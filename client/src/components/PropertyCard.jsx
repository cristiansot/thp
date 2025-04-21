import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import bedroomIcon from '../assets/img/icons/bedroom.svg';
import bathroomIcon from '../assets/img/icons/bathroom.svg';
import metersIcon from '../assets/img/icons/meters.svg';

import '../assets/css/propertyCard.css';

function PropertyCard({ title, price, permalink, image, area, bedrooms, bathrooms, offices, total_area }) {
  // Determinar si la imagen es una URL externa o local
  let imageUrl;
  try {
    imageUrl = image?.startsWith('http')
      ? image
      : new URL(`../assets/img/properties/${image}`, import.meta.url).href;
  } catch {
    imageUrl = ''; // fallback si no hay imagen válida
  }

  // Formatea precio con puntos y decide si es UF o CLP
  const formatPrice = (value) => {
    if (!value) return '';

    const numericPrice = parseInt(value.toString().replace(/\D/g, ''), 10);
    if (isNaN(numericPrice) || numericPrice === 0) return '';

    const formatted = numericPrice
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return numericPrice <= 99999 ? `UF ${formatted}` : `$${formatted}`;
  };

  const renderBedroomsOrOffices = () => {
    if (bedrooms && bedrooms > 0) {
      return `${bedrooms} ${bedrooms == 1 ? 'Dormitorio' : 'Dormitorios'}`;
    } else if (offices && offices > 0) {
      return `${offices} ${offices == 1 ? 'Oficina' : 'Oficinas'}`;
    }
    return null;
  };

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
        <Card.Text className="card--price">{formatPrice(price)}</Card.Text>

        <div className="container--icons">
          {(area || total_area) && (
            <Card.Text className="card--text mr-3 m-1">
              <img className="icons" src={metersIcon} alt="Metros cuadrados" />
              {area || total_area}
            </Card.Text>
          )}

          {renderBedroomsOrOffices() && (
            <Card.Text className="card--text mr-3 m-1">
              <img className="icons" src={bedroomIcon} alt="Dormitorios u Oficinas" />
              {renderBedroomsOrOffices()}
            </Card.Text>
          )}

          {bathrooms && bathrooms > 0 && (
            <Card.Text className="card--text mr-3 m-1">
              <img className="icons" src={bathroomIcon} alt="Baños" />
              {`${bathrooms} ${bathrooms == 1 ? 'Baño' : 'Baños'}`}
            </Card.Text>
          )}
        </div>

        <div className="d-flex mb-2">
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
        </div>
      </Card.Body>
    </Card>
  );
}

export default PropertyCard;

     

      