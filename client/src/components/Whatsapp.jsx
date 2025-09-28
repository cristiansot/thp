// import React from 'react';
// import '../assets/css/whatsapp.css'

// const Whatsapp = () => {
//   return (
//     <div className="phone-call cbh-phone cbh-green cbh-show cbh-static" id="clbh_phone_div" style={{ position: 'fixed', bottom: '0px', right: '5px', zIndex: '999' }}>
//       <a id="WhatsApp-button" href="whatsapp://send?text= Hola Total Home Propiedades, necesito de tus servicios&amp;phone=+56992992640" className="phoneJs" title="Enviar mensaje!">
//         <div className="cbh-ph-circle"></div>
//         <div className="cbh-ph-circle-fill"></div>
//         <div className="cbh-ph-img-circle1"></div>
//       </a>
//     </div>
//   );
// };

// export default Whatsapp;

import React from 'react';
import ReactDOM from 'react-dom';

const Whatsapp = () => {
  const whatsappButton = (
    <div
      style={{
        position: 'fixed',
        bottom: '0px',
        right: '5px',
        zIndex: 2147483647, // Máximo z-index posible
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <a
        href="whatsapp://send?text= Hola Total Home Propiedades, necesito de tus servicios&phone=+56992992640"
        title="Enviar mensaje!"
        style={{
          display: 'block',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#25D366',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            boxShadow: '0 0 0 10px rgba(37, 211, 102, 0.3)',
            animation: 'pulse 2s infinite',
          }}
        ></div>
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            backgroundColor: '#25D366',
          }}
        ></div>
      </a>
    </div>
  );

  return ReactDOM.createPortal(whatsappButton, document.body);
};

export default Whatsapp;
