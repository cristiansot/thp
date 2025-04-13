import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import bedroomIcon from '../img/icons/bedroom.png';
import bathroomIcon from '../img/icons/bathroom.png';
import metersIcon from '../img/icons/meters.png';

function PropertyCard({ title, price, link, imageUrl, size, bedrooms, bathrooms }) {
  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        {/* Mostrar la imagen */}
        <Card.Img src={imageUrl} className="card-img-top" alt={title} />

        {/* Mostrar el título de la propiedad */}
        <Card.Title className='card--title'>{title}</Card.Title>
        <Card.Text className="card--price">{price}</Card.Text>

        {/* Mostrar tamaño, dormitorios y baños en una sola fila */}
        <div className="d-flex">
          {/* Mostrar el tamaño con icono */}
          <Card.Text className="card--text mr-3 m-1" >
            <img src={metersIcon} alt="Metros cuadrados" style={{ width: '35px', marginRight: '8px' }} />
            {size}
          </Card.Text>

          {/* Mostrar los dormitorios con icono */}
          <Card.Text className="card--text mr-3 m-1">
            <img src={bedroomIcon} alt="Dormitorios" style={{ width: '35px', marginRight: '8px' }} />
            {bedrooms}
          </Card.Text>

          {/* Mostrar los baños con icono */}
          <Card.Text className="card--text mr-3 m-1">
            <img src={bathroomIcon} alt="Baños" style={{ width: '35px', marginRight: '8px' }} />
            {bathrooms}
          </Card.Text>
        </div>

        <Button type="button" class="btn btn-dark" href={link} target="_blank">Ver Propiedad</Button>
      </Card.Body>
    </Card>
  );
}

export default PropertyCard;
