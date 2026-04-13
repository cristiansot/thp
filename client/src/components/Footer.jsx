import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Turnstile } from "@marsidev/react-turnstile";

import '../assets/css/footer.css';
import logotipo from '../assets/img/icons/logotipo.svg';

const Footer = () => {

  const [token, setToken] = useState(null);

  const initialValues = {
    nombre: "",
    correo: "",
    asunto: "",
    website: "",
  };

  const validationSchema = Yup.object({
    nombre: Yup.string().required("El nombre es obligatorio"),
    correo: Yup.string()
      .email("Correo inválido")
      .required("El correo es obligatorio"),
    asunto: Yup.string().required("El asunto es obligatorio"),
  });

  const handleSubmit = (values, { resetForm, setSubmitting, setStatus }) => {

    if (!token) {
      setStatus({ error: "Por favor verifica que no eres humano" });
      setSubmitting(false);
      return;
    }

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...values,
        token,
      }),
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error al enviar el formulario: ${res.statusText}`);
        return res.json();
      })
      .then((data) => {
        console.log('✅ Respuesta backend:', data);

        alert('Correo enviado con éxito');

        resetForm();
        setToken(null);
      })
      .catch((err) => {
        console.error('❌ Error:', err);
        setStatus({ error: `Error: ${err.message}` });
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <footer className="footer container-fluid py-5">
      <div className="container" id="container-footer">
        <div className="row justify-content-center align-items-start mt-4">

          <div className="left col-md-4 text-center mb-4 mb-md-0">
            <img src={logotipo} alt="Logotipo" className="footer-logo" />
          </div>

          <div className="center col-md-4 text-center mb-4 mb-md-0">
            <h2 className="mb-3 mt-3 footer-title">Nosotros</h2>
            <p className="text-muted">
              Somos una corredora de propiedades con más de 6 años de experiencia...
            </p>
          </div>

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
                    <Field type="text" name="nombre" className="form-control" placeholder="Nombre" />
                    <label>Nombre</label>
                    <ErrorMessage name="nombre" component="div" className="text-danger small" />
                  </div>

                  <div className="form-floating mb-0">
                    <Field type="email" name="correo" className="form-control" placeholder="Correo" />
                    <label>Correo</label>
                    <ErrorMessage name="correo" component="div" className="text-danger small" />
                  </div>

                  <div className="form-floating mb-3">
                    <Field as="textarea" name="asunto" className="form-control" placeholder="Mensaje" />
                    <label>Mensaje</label>
                    <ErrorMessage name="asunto" component="div" className="text-danger small" />
                  </div>

                  {/* Honeypot */}
                  <Field type="text" name="website" style={{ display: "none" }} />

                  {/* 🔒 Turnstile con DEBUG */}
                  <div className="mb-3">
                    <Turnstile
                      siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                      onSuccess={(token) => {
                        console.log("🔥 TOKEN GENERADO:", token);
                        setToken(token);
                      }}
                      onError={() => {
                        console.log("❌ Error en Turnstile");
                      }}
                      onExpire={() => {
                        console.log("⚠️ Token expirado");
                        setToken(null);
                      }}
                    />
                  </div>

                  {status && status.error && (
                    <div className="text-danger mb-3">{status.error}</div>
                  )}

                  <button
                    type="submit"
                    className="btn mt-3 btn-primary w-100"
                    disabled={isSubmitting || !token}
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar'}
                  </button>

                </Form>
              )}
            </Formik>
          </div>

        </div>
      </div>

      <div className="footer-copyright">
        <p className="m-0">
          &copy; {new Date().getFullYear()} Total Home Propiedades.
        </p>
      </div>
    </footer>
  );
};

export default Footer;