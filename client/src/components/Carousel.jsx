import React, { useState, useEffect } from 'react';
import '../assets/css/carousel.css';

import image1 from '../assets/img/carousel/image1.webp';
import image4 from '../assets/img/carousel/image4.webp';
import image3 from '../assets/img/carousel/image3.webp';

const slides = [
  {
    subtitle: 'Edificio Departamental II',
    title: 'Departamento Arrendado',
    description:
      'Nueva Cuatro 6277 La Florida, Santiago',
    imageUrl: image4,
  },
   {
    subtitle: 'La Cisterna',
    title: 'Departamento Promesado',
    description:
      'Departamento Cercano A Metro El Parrón, La Cisterna',
    imageUrl: image1,
  },
  {
    subtitle: 'Departamento - Oficina En Santa Lucía a Pasos del Barrio Lastarria',
    title: 'Departamento Oficina en Venta Santiago',
    description:
      'Se Vende gran departamento de 185 m2, que abarca todo el piso 4° del edificio. Ubicación oriente con hermosa vista hacia el cerro Santa Lucía',
    imageUrl: image3,
  },
];

const Carousel = () => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); 

    return () => clearInterval(interval); // Limpiar el intervalo al desmontar
  }, [current]); // Dependencia para que se actualice correctamente

  return (
    <div className="carousel">
      <div className="carousel__nav">
        <span className="carousel__arrow" onClick={prevSlide}>
          <svg className="carousel__icon" viewBox="0 0 24 24">
            <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
          </svg>
        </span>
        <span className="carousel__arrow" onClick={nextSlide}>
          <svg className="carousel__icon" viewBox="0 0 24 24">
            <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" />
          </svg>
        </span>
      </div>

      {slides.map((slide, index) => (
        <div key={index} id="wrap" className={`carousel-item ${index === current ? 'active' : ''}`}>
          <div
            className="carousel-item__image"
            style={{ backgroundImage: `url(${slide.imageUrl})`}}
          />
          <div className="carousel-item__info">
            <div className="carousel-item__container">
              <h2 className="carousel-item__subtitle">{slide.subtitle}</h2>
              <h1 className="carousel-item__title">{slide.title}</h1>
              <p className="carousel-item__description">{slide.description}</p>
              {/* <a href="#" className="carousel-item__btn">Explore</a> */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Carousel;
