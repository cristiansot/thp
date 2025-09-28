import React from 'react';
import '../assets/css/whatsapp.css'

const Whatsapp = () => {
  return (
    <div className="phone-call cbh-phone cbh-green cbh-show cbh-static" id="clbh_phone_div" style={{ position: 'fixed', bottom: '0px', right: '5px', zIndex: '999' }}>
      <a id="WhatsApp-button" href="whatsapp://send?text= Hola Total Home Propiedades, necesito de tus servicios&amp;phone=+56992992640" className="phoneJs" title="Enviar mensaje!">
        <div className="cbh-ph-circle"></div>
        <div className="cbh-ph-circle-fill"></div>
        <div className="cbh-ph-img-circle1"></div>
      </a>
    </div>
  );
};

export default Whatsapp;