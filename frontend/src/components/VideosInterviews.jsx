import React from 'react';

const videosDeUsuarios = [
  {
    id: 1,
    nombreUsuario: 'Carlos Pérez',
    titulo: 'Retroalimentación de entrevista técnica',
    filename: 'entrevista1.mp4',
  },
  {
    id: 2,
    nombreUsuario: 'Laura Gómez',
    titulo: 'Evaluación general de entrevista',
    filename: 'entrevista2.mp4',
  },
  {
    id: 3,
    nombreUsuario: 'Andrés Rivera',
    titulo: 'Consejos personalizados',
    filename: 'entrevista3.mp4',
  },
];

const GaleriaVideos = () => {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Galería de Retroalimentaciones</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
        marginTop: '20px'
      }}>
        {videosDeUsuarios.map(video => (
          <div key={video.id} style={{
            border: '1px solid #ddd',
            borderRadius: '10px',
            padding: '10px',
            backgroundColor: '#fdfdfd'
          }}>
            <h4>{video.nombreUsuario}</h4>
            <p>{video.titulo}</p>
            <video
              width="100%"
              height="auto"
              controls
              style={{ borderRadius: '8px' }}
            >
              <source src={`http://localhost:3000/api/video/${video.filename}`} type="video/mp4" />
              Tu navegador no soporta la visualización de video.
            </video>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GaleriaVideos;