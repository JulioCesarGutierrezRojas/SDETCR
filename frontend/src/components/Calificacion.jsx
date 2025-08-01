import React from 'react';

const CalificacionProv = ({ score }) => {
  return (
    <div className="text-sm text-right bg-gray-100 px-3 py-1 rounded-md shadow-sm max-w-xs">
      <h2 className="font-semibold text-gray-800">Calificación Automática: {score}/10</h2>
      <p className="text-gray-500 text-xs">* La calificación final será asignada por el docente.</p>
    </div>
  );
};

export default CalificacionProv;
