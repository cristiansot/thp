import React, { useState, useEffect } from "react";
import "../assets/css/NavBar.css";
import mail from "../assets/img/icons/mail.svg";
import phone from "../assets/img/icons/phone_calling.svg";


const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [uf, setUf] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchUF = async () => {
      try {
        const response = await fetch(
          `https://api.cmfchile.cl/api-sbifv3/recursos_api/uf?apikey=${import.meta.env.VITE_CMF_API_KEY}&formato=json`
        );
        const data = await response.json();
        const todayUF = data.UFs?.[0]?.Valor;
        setUf(todayUF);
      } catch (error) {
        console.error("Error al obtener la UF:", error);
      }
    };

    fetchUF();
  }, []);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <nav className={`navbar navbar-expand-lg fixed-top ${(scrolling || menuOpen) ? "black" : ""}`}>
      <div className="container-fluid">
        <div className="logo">
          Total Home Propiedades
        </div>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded={menuOpen ? "true" : "false"}
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`} id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a
                className="nav-link d-flex align-items-center"
                href="tel:+56992992640"
                style={{ color: "#42ea60" }}
              >
                <img
                  src={phone}
                  alt="Teléfono"
                  style={{ width: "20px", height: "20px", marginRight: "8px" }}
                />
                +56 9 9299 2640
              </a>
            </li>
            <li className="nav-item">
              <button className="nav-link" onClick={() => scrollToSection('home')}>Home</button>
            </li>
            <li className="nav-item">
              <button className="nav-link" onClick={() => scrollToSection('contacto')}>Nosotros</button>
            </li>
            <li className="nav-item">
              <button className="nav-link" onClick={() => scrollToSection('contacto')}>Contacto</button>
            </li>
             <li className="nav-item">
              <a className="nav-link d-flex align-items-center" href="mailto:paula@thp.cl">
                <img
                  src={mail}
                  alt="Correo"
                  style={{ width: "20px", height: "20px", marginRight: "8px" }}
                />
                Escríbenos
              </a>
            </li>
            {uf && (
              <li>
                <span className="nav-link disabled">UF: ${uf}</span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
