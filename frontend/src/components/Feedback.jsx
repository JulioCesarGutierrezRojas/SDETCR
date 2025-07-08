import React from 'react';

const FeedbackFinal = ({ score }) => {
  let mensaje = '';
  let color = '';
  
  if (score >= 8) {
    mensaje = '¡Excelente! Has pasado el simulador con éxito. Tienes un buen dominio de las entrevistas.';
    color = 'green';
  } else if (score >= 6) {
    mensaje = 'Buen intento. Puedes mejorar ciertos aspectos para tener un mejor desempeño.';
    color = 'orange';
  } else {
    mensaje = 'Es necesario mejorar bastante. Te recomendamos practicar más para estar listo.';
    color = 'red';
  }

  return (
    <div style={{
      border: `2px solid ${color}`,
      borderRadius: '12px',
      padding: '20px',
      maxWidth: '500px',
      margin: '0 auto',
      textAlign: 'center',
      backgroundColor: '#f9f9f9'
    }}>
      <h2 style={{ color }}>Resultado Final</h2>
      <p style={{ fontSize: '1.2rem' }}>
        <strong>Calificación:</strong> {score}/10
      </p>
      <p style={{ fontStyle: 'italic', color: '#333' }}>{mensaje}</p>
    </div>
  );
};

export default FeedbackFinal;
