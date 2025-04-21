import React, { useState, useEffect } from "react";
import "../assets/css/NavBar.css";

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
              <a className="nav-link" href="#">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Propiedades</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Nosotros</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Contacto</a>
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
