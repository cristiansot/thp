import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

function PropertyCard({ title, price, link, imageUrl, size, bedrooms, bathrooms }) {
  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        {/* Mostrar la imagen */}
        <Card.Img src={imageUrl} className="card-img-top" alt={title} />

        {/* Mostrar el título de la propiedad */}
        <Card.Title>{title}</Card.Title>
        <Card.Text><strong>Precio:</strong>{price}</Card.Text>

        {/* Mostrar el tamaño */}
        <Card.Text><strong>Tamaño:</strong> {size}</Card.Text>

        {/* Mostrar los dormitorios */}
        <Card.Text><strong>Dormitorios:</strong> {bedrooms}</Card.Text>
        
        {/* Mostrar los baños */}
        <Card.Text><strong>Baños:</strong> {bathrooms}</Card.Text>

        <Button variant="primary" href={link} target="_blank">Ver Propiedad</Button>
      </Card.Body>
    </Card>
  );
}

export default PropertyCard;

