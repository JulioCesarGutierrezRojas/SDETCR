import React from 'react';

const FeedbackFinal = ({ score }) => {
  let mensaje = '';
  let borderColor = '';
  let backgroundColor = '';

 
  const colors = {
    green: '#7FC97F',  
    orange: '#FDB462', 
    red: '#F768A1'    
  };

  if (score >= 8) {
    mensaje = '¡Excelente! Has pasado el simulador con éxito. Tienes un buen dominio de las entrevistas.';
    borderColor = colors.green;
    backgroundColor = '#dff0d8'; 
  } else if (score >= 6) {
    mensaje = 'Buen intento. Puedes mejorar ciertos aspectos para tener un mejor desempeño.';
    borderColor = colors.orange;
    backgroundColor = '#fff3e0'; 
  } else {
    mensaje = 'Es necesario mejorar bastante. Te recomendamos practicar más para estar listo.';
    borderColor = colors.red;
    backgroundColor = '#fde2e4'; 
  }

  return (
    <div style={{
      border: `2px solid ${borderColor}`,
      borderRadius: '12px',
      padding: '20px',
      maxWidth: '100%',
      margin: '0 auto',
      textAlign: 'center',
      backgroundColor: backgroundColor,
      color: '#62636C',  
      fontWeight: '600'
    }}>
      <h1 style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>Resultado Final</h1>
      <p style={{ fontSize: '0.95rem' }}>
        <strong>Calificación Final:</strong> {score}/10
      </p>
      <p style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>{mensaje}</p>
    </div>
  );
};

export default FeedbackFinal;
