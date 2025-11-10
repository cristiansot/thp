import '../assets/css/whatsapp.css'

const Whatsapp = () => {
  return (
    <div className="phone-call cbh-phone cbh-green cbh-show cbh-static" id="clbh_phone_div" 
      style={{ position: 'fixed', bottom: '0px', right: '5px', zIndex: '2147483647' }}>
      <a id="WhatsApp-button" href="whatsapp://send?text= Hola Total Home Propiedades, necesito de tus servicios&amp;phone=+56992992640" className="phoneJs" title="Enviar mensaje!">
        <div className="cbh-ph-circle"></div>
        <div className="cbh-ph-circle-fill"></div>
        <div className="cbh-ph-img-circle1"></div>
      </a>
    </div>
  );
};

export default Whatsapp;

// import ReactDOM from 'react-dom';

// const Whatsapp = () => {
//   const whatsappButton = (
//     <div
//       style={{
//         position: 'fixed',
//         bottom: '20px',
//         right: '20px',
//         zIndex: 2147483647,
//       }}
//     >
//       <a
//         href="https://wa.me/56992992640?text=Hola%20Total%20Home%20Propiedades,%20necesito%20de%20tus%20servicios"
//         title="Enviar mensaje!"
//         target="_blank"
//         rel="noopener noreferrer"
//         style={{
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           width: '60px',
//           height: '60px',
//           borderRadius: '50%',
//           backgroundColor: '#25D366',
//           boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
//         }}
//       >
//         <img
//           src="/icons/whatsapp.png" // 👈 pon aquí tu ícono (puede estar en /public/icons/)
//           alt="WhatsApp"
//           style={{ width: '30px', height: '30px' }}
//         />
//       </a>
//     </div>
//   );

//   return ReactDOM.createPortal(whatsappButton, document.body);
// };

// export default Whatsapp;

