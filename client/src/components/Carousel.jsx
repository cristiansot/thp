import React, { useState } from 'react';
import '../assets/css/carousel.css';

import image1 from '../assets/img/carousel/image1.jpg';
import image2 from '../assets/img/carousel/image2.jpg';
import image3 from '../assets/img/carousel/image3.jpg';

const slides = [
  {
    subtitle: 'The grand moment',
    title: 'Le tour',
    description:
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
    imageUrl: image1,
  },
  {
    subtitle: 'The big window',
    title: 'Minimal window',
    description:
      'Clear Glass Window With Brown and White Wooden Frame iste natus error sit voluptatem accusantium.',
    imageUrl: image2,
  },
  {
    subtitle: 'Tropical palms',
    title: 'Palms',
    description:
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
    imageUrl: image3,
  },
];

const Carousel = () => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

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
        <div key={index} id='wrap' className={`carousel-item ${index === current ? 'active' : ''}`}>
          <div
            className="carousel-item__image"
            style={{ backgroundImage: `url(${slide.imageUrl})` }}
          />
          <div className="carousel-item__info">
            <div className="carousel-item__container">
              <h2 className="carousel-item__subtitle">{slide.subtitle}</h2>
              <h1 className="carousel-item__title">{slide.title}</h1>
              <p className="carousel-item__description">{slide.description}</p>
              <a href="#" className="carousel-item__btn">Explore</a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Carousel;
