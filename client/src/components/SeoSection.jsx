import React from "react";
import '../assets/css/seosection.css';

const SeoSection = () => {
  return (
    <section className="container my-6 py-6 seo-section">
      <div className="row justify-content-center">
        <div className="col-lg-12">

          {/* H2 SEO */}
          <h2 className="mb-4 text-center SeoSection-title">
            Administración de propiedades en Santiago y gestión de arriendos
          </h2>

          {/* Texto SEO */}
          <p className="SeoSection-paragraph">
            En <strong>Total Home Propiedades</strong> nos especializamos en la administración de propiedades en Santiago, ayudando a propietarios a arrendar sus inmuebles de forma segura, rápida y sin complicaciones.
          </p>

          <p className="SeoSection-paragraph">
            Si estás buscando <strong>dejar tu propiedad en arriendo</strong>, nuestro equipo se encarga de todo el proceso: publicación, selección de arrendatarios, contratos, cobranza mensual y gestión de mantenciones.
          </p>

          <p className="SeoSection-paragraph">
            Trabajamos con un enfoque claro: proteger tu inversión y maximizar tu rentabilidad, evitando problemas comunes como la morosidad o el mal uso de la propiedad.
          </p>

          <p className="SeoSection-paragraph">
            Como corredor de propiedades en Santiago, ofrecemos un servicio integral para quienes desean delegar la gestión de su inmueble en profesionales confiables.
          </p>

          {/* Beneficios */}
          <div className="row mt-0 mb-4">
            <div className="col-md-6">
              <ul className="list-unstyled">
                <li className="SeoSection-list">✔ Publicación de tu propiedad</li>
                <li className="SeoSection-list">✔ Selección de arrendatarios</li>
                <li className="SeoSection-list">✔ Gestión de contratos</li>
              </ul>
            </div>
            <div className="col-md-6">
              <ul className="list-unstyled">
                <li className="SeoSection-list">✔ Cobranza mensual</li>
                <li className="SeoSection-list">✔ Seguimiento de pagos</li>
                <li className="SeoSection-list">✔ Coordinación de mantenciones</li>
              </ul>
            </div>
          </div>

          {/* BLOQUE DE CAPTACIÓN (MUY IMPORTANTE) */}
          <div className="bg-dark p-4 rounded text-center mt-5 bloque">
            <h3 className="mb-3 SeoSection-subtitle">
              ¿Quieres vender o arrendar tu propiedad sin complicaciones?
            </h3>

            <p className="SeoSection-paragraph">
              Déjanos tu propiedad y nosotros nos encargamos de todo el proceso de arriendo y administración.
            </p>

            <a
              href="https://wa.me/56992992640?text=Hola,%20quiero%20dejar%20mi%20propiedad%20en%20arriendo"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary px-4 py-2"
            >
              Publicar mi propiedad
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SeoSection;