import React from "react";

const Paginacion = ({ paginaActual, totalPaginas, onPageChange }) => {
  const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);

  return (
    <div className="flex justify-center mt-6 gap-2">
      <button
        onClick={() => onPageChange(paginaActual - 1)}
        disabled={paginaActual === 1}
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
      >
        Anterior
      </button>
      {paginas.map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          className={`px-3 py-1 rounded ${
            num === paginaActual
              ? "bg-[var(--color-lavanda-700)] text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          {num}
        </button>
      ))}
      <button
        onClick={() => onPageChange(paginaActual + 1)}
        disabled={paginaActual === totalPaginas}
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
      >
        Siguiente
      </button>
    </div>
  );
};

export default Paginacion;
