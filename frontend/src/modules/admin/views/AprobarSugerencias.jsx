import { useState, useEffect } from "react";
import { FaLightbulb } from "react-icons/fa";
import Paginacion from "../../../components/Paginacion"; // Ajusta la ruta si es necesario

const sugerenciasMock = [
  {
    id: 1,
    categoria: "Diseño UX/UI",
    simulador: "Diseñador UX",
    contenido:
      "Preguntas sobre procesos de diseño centrado en el usuario, herramientas como Figma, entrevistas con usuarios.",
    fecha: "2025-07-20",
  },
  {
    id: 2,
    categoria: "Marketing Digital",
    simulador: "Especialista SEO",
    contenido:
      "Cómo mejorar posicionamiento web, herramientas de análisis, estrategias de contenido.",
    fecha: "2025-07-18",
  },
  // Puedes agregar más sugerencias aquí
];

const AprobarSugerencias = () => {
  const [sugerencias, setSugerencias] = useState(sugerenciasMock);
  const [paginaActual, setPaginaActual] = useState(1);
  const sugerenciasPorPagina = 4;

  const totalPaginas = Math.ceil(sugerencias.length / sugerenciasPorPagina);
  const indexInicio = (paginaActual - 1) * sugerenciasPorPagina;
  const indexFin = indexInicio + sugerenciasPorPagina;
  const sugerenciasPaginadas = sugerencias.slice(indexInicio, indexFin);

  useEffect(() => {
    setPaginaActual(1);
  }, [sugerencias]);

  const manejarAccion = (id, accion) => {
    if (accion === "aceptar") {
      console.log(`Sugerencia ${id} aceptada`);
    } else {
      console.log(`Sugerencia ${id} rechazada`);
    }
    setSugerencias(sugerencias.filter((s) => s.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-[var(--color-lavanda-700)] pb-5">
        Revisión de Sugerencias de Simuladores
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sugerenciasPaginadas.map((sugerencia) => (
          <div
            key={sugerencia.id}
            className="bg-white border border-[var(--color-gris-200)] rounded-xl p-5 shadow-md flex flex-col gap-4"
          >
            <div className="bg-[var(--color-lavanda-100)] p-3 rounded-md flex items-start gap-3">
              <FaLightbulb className="text-[var(--color-lavanda-800)] mt-1" />
              <div className="text-sm text-[var(--color-gris-800)] space-y-1">
                <p>
                  <strong>Categoría:</strong> {sugerencia.categoria}
                </p>
                <p>
                  <strong>Simulador:</strong> {sugerencia.simulador}
                </p>
                <p>
                  <strong>Contenido:</strong> {sugerencia.contenido}
                </p>
                <p>
                  <strong>Fecha:</strong> {sugerencia.fecha}
                </p>
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-2">
              <button
                className="bg-[var(--color-verde-suave-oklch)] text-white font-bold px-6 py-2 rounded-lg hover:opacity-90 transition"
                onClick={() => manejarAccion(sugerencia.id, "aceptar")}
              >
                Aceptar
              </button>
              <button
                className="bg-[var(--color-rojo-suave-oklch)] text-white font-bold px-6 py-2 rounded-lg hover:opacity-90 transition"
                onClick={() => manejarAccion(sugerencia.id, "rechazar")}
              >
                Rechazar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Paginacion
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          onPageChange={(nuevaPagina) => setPaginaActual(nuevaPagina)}
        />
      </div>

      {sugerencias.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No hay sugerencias pendientes.
        </p>
      )}
    </div>
  );
};

export default AprobarSugerencias;
