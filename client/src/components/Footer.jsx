import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import '../assets/css/footer.css';
import logotipo from '../assets/img/icons/logotipo.svg';

const Footer = () => {
  const initialValues = {
    nombre: "",
    correo: "",
    asunto: "",
  };

  const validationSchema = Yup.object({
    nombre: Yup.string().required("El nombre es obligatorio"),
    correo: Yup.string()
      .email("Correo inválido")
      .required("El correo es obligatorio"),
    asunto: Yup.string().required("El asunto es obligatorio"),
  });

  const handleSubmit = (values, { resetForm }) => {
    console.log("Formulario enviado:", values);
    resetForm();
  };

  return (
    <footer className="footer container-fluid py-5">
      <div className="container mt-2 ">
        <div className="row justify-content-center align-items-start">
          
          {/* Izquierda: Logotipo */}
          <div className="left col-md-4 text-center mb-4 mb-md-0">
            <img src={logotipo} alt="Logotipo" className="footer-logo" />
          </div>

          {/* Centro: Nosotros */}
          <div className="center col-md-4 text-center mb-4 mb-md-0">
            <h2 className="mb-3 mt-3 footer-title">Nosotros</h2>
            <p className="text-muted">
              Somos una corredora de propiedades con más de 6 años de experiencia, 
              ofreciendo atención personalizada y un servicio de excelencia.<br />
              Acompañamos a nuestros clientes en todo el proceso de compraventa o arriendo, 
              utilizando tecnología de punta, recorridos virtuales y difusión en los principales portales 
              y redes sociales.<br /> Nuestra visión es ser una corredora comprometida, confiable, cercana 
              y transparente, destacando en el corretaje boutique.
            </p>
          </div>

          {/* Derecha: Formulario */}
          <div className="right col-md-4">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {() => (
                <Form className="p-3">
                  <h2 className="footer-title mb-0 text-start">Contáctanos</h2>

                  <div className="form-floating mb-0">
                    <Field
                      type="text"
                      id="nombre"
                      name="nombre"
                      className="form-control floating-input ms-0"
                      placeholder="Nombre"
                    />
                    <label htmlFor="nombre" className="floating-label ms-0">Nombre</label>
                    <ErrorMessage name="nombre" component="div" className="text-danger small text-start ms-0" />
                  </div>

                  <div className="form-floating mb-0">
                    <Field
                      type="email"
                      id="correo"
                      name="correo"
                      className="form-control floating-input ms-0"
                      placeholder="Correo"
                    />
                    <label htmlFor="correo" className="floating-label ms-0">Correo</label>
                    <ErrorMessage name="correo" component="div" className="text-danger small text-start ms-0" />
                  </div>

                  <div className="form-floating mb-3 mt-0">
                    <Field
                      as="textarea"
                      id="asunto"
                      name="asunto"
                      className="form-control floating-input ms-0"
                      placeholder="Asunto"
                      rows="3"
                    />
                    <label htmlFor="asunto" className="floating-label ms-0">Asunto</label>
                    <ErrorMessage name="asunto" component="div" className="text-danger small text-start ms-0" />
                  </div>

                  <button type="submit" className="btn mt-3 btn-primary w-100">
                    Enviar
                  </button>
                </Form>
              )}
            </Formik>
          </div>
             
        </div>

        {/* Copyright */}
        <div className="footer-copyright w-100  p-3">
          <div className="col-12 text-center">
            <p className="m-0">
              &copy; {new Date().getFullYear()} Total Home Propiedades. Todos los derechos reservados.
            </p>
          </div>
        </div>


      </div>
    </footer>
  );
};

export default Footer;
