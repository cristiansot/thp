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

  const handleSubmit = (values, { resetForm, setSubmitting, setStatus }) => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
      credentials: 'include', 
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error al enviar el formulario: ${res.statusText}`);
        return res.json(); 
      })
      .then((data) => {
        console.log('Respuesta del backend:', data);
        alert('Correo enviado con éxito, pronto nos pondremos en contacto con usted.');
        resetForm();
      })
      .catch((err) => {
        console.error('Error al enviar el correo:', err);
        setStatus({ error: `Error al enviar el correo: ${err.message}` });
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <footer className="footer container-fluid py-5">
    <div className="container" id="container-footer">
      <div className="row justify-content-center align-items-start mt-4">
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
            {({ isSubmitting, status }) => (
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
  
                {status && status.error && (
                  <div className="text-danger mb-3">{status.error}</div>
                )}
  
                <button 
                  type="submit" 
                  className="btn mt-3 btn-primary w-100" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar'}
                </button>
              </Form>
            )}
          </Formik>
        </div>
  
      </div>
    </div>
  
    {/* Copyright */}
    <div className="footer-copyright">
      <p className="m-0">
        &copy; {new Date().getFullYear()} Total Home Propiedades. Todos los derechos reservados.
      </p>
    </div>
  
  </footer>
  );
};

export default Footer;
