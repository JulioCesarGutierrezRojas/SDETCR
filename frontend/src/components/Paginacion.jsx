import React from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const Paginacion = ({ paginaActual, totalPaginas, onPageChange }) => {
  const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);

  return (
    <div className="flex justify-center mt-6 gap-2">
      <button
        onClick={() => onPageChange(paginaActual - 1)}
        disabled={paginaActual === 1}
        className="px-2 py-1 rounded-full text-sm bg-[var(--color-gris-200)] hover:bg-[var(--color-gris-300)] text-[var(--color-gris-900)]"
      >
        <FaAngleLeft />
      </button>
      {paginas.map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          className={`px-3 py-1 rounded-full ${
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
        className="px-2 py-1 rounded-full text-sm bg-[var(--color-gris-200)] hover:bg-[var(--color-gris-300)] text-[var(--color-gris-900)]"
      >
        <FaAngleRight />
      </button>
    </div>
  );
};

export default Paginacion;
