import { useState, useEffect } from "react";
import { FaLightbulb, FaCheck, FaTimes, FaCalendarAlt, FaTag, FaFileAlt, FaExclamationCircle } from "react-icons/fa";
import Paginacion from "../../../components/Paginacion";
import Loader from "../../../components/Loader";
import { getSuggestionsApprovedAndPending, updateSuggestionStatus } from "../adapters/suggestions.controller";
import { showSuccessToast, showErrorToast, showConfirmation } from "../../../kernel/alerts";

const AprobarSugerencias = () => {
  const [sugerencias, setSugerencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const [processingId, setProcessingId] = useState(null);
  const sugerenciasPorPagina = 4;

  const totalPaginas = Math.ceil(sugerencias.length / sugerenciasPorPagina);
  const indexInicio = (paginaActual - 1) * sugerenciasPorPagina;
  const indexFin = indexInicio + sugerenciasPorPagina;
  const sugerenciasPaginadas = sugerencias.slice(indexInicio, indexFin);

  useEffect(() => {
    fetchSugerencias();
  }, []);

  useEffect(() => {
    setPaginaActual(1);
  }, [sugerencias]);

  const fetchSugerencias = async () => {
    try {
      setLoading(true);
      const { result } = await getSuggestionsApprovedAndPending();
      
      const sugerenciasMapeadas = result.map((sug) => ({
        id: sug.suggestion_id,
        categoria: sug.suggested_category,
        simulador: sug.suggested_name,
        contenido: sug.suggested_description,
        fecha: new Date(sug.date_suggestion).toLocaleDateString('es-ES'),
        status: sug.status
      }));
      
      setSugerencias(sugerenciasMapeadas);
    } catch (error) {
      console.error("Error al obtener sugerencias:", error);
      // Solo mostrar toast de error si no es el caso de "no hay datos"
      if (!error.message.includes("No se encontraron sugerencias")) {
        showErrorToast({
          title: "Error",
          text: "No se pudieron cargar las sugerencias"
        });
      }
      setSugerencias([]);
    } finally {
      setLoading(false);
    }
  };

  const manejarAccion = (sugerencia, accion) => {
    const accionTexto = accion === "aprobado" ? "aprobar" : "rechazar";
    const mensaje = `¿Estás seguro de que deseas ${accionTexto} la sugerencia "${sugerencia.simulador}"?`;
    
    showConfirmation(
      `Confirmar ${accionTexto}`,
      mensaje,
      "question",
      async () => {
        await procesarSugerencia(sugerencia.id, accion);
      }
    );
  };

  const procesarSugerencia = async (id, status) => {
    try {
      setProcessingId(id);
      
      await updateSuggestionStatus(id, status);
      
      const accionTexto = status === "aprobado" ? "aprobada" : "rechazada";
      showSuccessToast({
        title: `Sugerencia ${accionTexto} exitosamente`
      });
      
      if (status === "aprobado") {
        // Si es aprobada, actualizar el estado en la lista local
        setSugerencias(prev => prev.map(s => 
          s.id === id ? { ...s, status: "aprobado" } : s
        ));
      } else {
        // Si es rechazada, remover de la lista ya que no debe aparecer más
        setSugerencias(prev => prev.filter(s => s.id !== id));
      }
      
    } catch (error) {
      const accionTexto = status === "aprobado" ? "aprobar" : "rechazar";
      showErrorToast({
        title: "Error",
        text: error.message || `No se pudo ${accionTexto} la sugerencia`
      });
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return <Loader isLoading={true} />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-[var(--color-lavanda-700)] pb-5">
        Revisión de Sugerencias de Simuladores
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sugerenciasPaginadas.map((sugerencia) => {
          const isProcessing = processingId === sugerencia.id;
          const isPending = sugerencia.status === 'pendiente';
          const isApproved = sugerencia.status === 'aprobado';
          
          return (
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
                  {isApproved && (
                    <p>
                      <strong>Estado:</strong> <span className="text-green-600 font-semibold">Aprobada</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Botones de acción - Solo mostrar si está pendiente */}
              {isPending && (
                <div className="flex justify-center gap-4 mt-2">
                  <button
                    className={`px-6 py-2 rounded-lg font-bold transition ${
                      isProcessing
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-[var(--color-verde-suave-oklch)] text-white hover:opacity-90'
                    }`}
                    onClick={() => manejarAccion(sugerencia, "aprobado")}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Procesando...' : 'Aceptar'}
                  </button>
                  <button
                    className={`px-6 py-2 rounded-lg font-bold transition ${
                      isProcessing
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-[var(--color-rojo-suave-oklch)] text-white hover:opacity-90'
                    }`}
                    onClick={() => manejarAccion(sugerencia, "rechazado")}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Procesando...' : 'Rechazar'}
                  </button>
                </div>
              )}

              {/* Mensaje para sugerencias ya aprobadas */}
              {isApproved && (
                <div className="flex justify-center">
                  <span className="text-green-600 font-semibold text-sm">
                    ✓ Esta sugerencia ya fue aprobada
                  </span>
                </div>
              )}
            </div>
          );
        })}
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
