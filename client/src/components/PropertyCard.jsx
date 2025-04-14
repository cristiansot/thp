import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import bedroomIcon from '../img/icons/bedroom.svg';
import bathroomIcon from '../img/icons/bathroom.svg';
import metersIcon from '../img/icons/meters.svg';
import '../assets/css/propertyCard.css'

function PropertyCard({ title, price, link, img, size, bedrooms, bathrooms }) {
  // Usar una URL dinámica para la imagen
  const imageUrl = new URL(`../assets/img/properties/${img}`, import.meta.url).href;

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        {/* Mostrar la imagen */}
        <Card.Img
          src={imageUrl} 
          className="card-img-top" 
          alt={title} 
          width="500" 
          height="300" 
        />
        {/* Mostrar el título de la propiedad */}
        <Card.Title className='card--title'>{title}</Card.Title>
        <Card.Text className="card--price">{price}</Card.Text>

        {/* Mostrar tamaño, dormitorios y baños en una sola fila */}
        <div className="container--icons">
          {/* Mostrar el tamaño con icono */}
          <Card.Text className="card--text mr-3 m-1">
            <img className='icons' src={metersIcon} alt="Metros cuadrados" />
            {size}
          </Card.Text>

          {/* Mostrar los dormitorios con icono */}
          <Card.Text className="card--text mr-3 m-1">
            <img className='icons' src={bedroomIcon} alt="Dormitorios" />
            {bedrooms}
          </Card.Text>

          {/* Mostrar los baños con icono */}
          <Card.Text className="card--text mr-3 m-1">
            <img className='icons' src={bathroomIcon} alt="Baños" />
            {bathrooms}
          </Card.Text>
        </div>

        <Button type="button" className='button-ver-propiedades' class="btn btn-dark" href={link} target="_blank">
          Ver Propiedad
        </Button>
      </Card.Body>
    </Card>
  );
}

export default PropertyCard;
