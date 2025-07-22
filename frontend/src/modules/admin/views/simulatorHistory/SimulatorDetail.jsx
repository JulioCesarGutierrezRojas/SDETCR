import { useParams } from "react-router-dom";

// Datos simulados para preguntas mixtas (texto, video, opción múltiple)
const mockDetalleSimulador = {
  preguntas: [
    {
      id: 1,
      texto: "¿Qué es una IP?",
      tipo: "opcion_multiple",
      opciones: ["Identificador", "Dirección de red", "Programa", "Ninguna"],
      respuesta: "Dirección de red",
      retroalimentacion: "Correcto. Una IP es una dirección de red."
    },
    {
      id: 2,
      texto: "¿Qué hace un servidor?",
      tipo: "opcion_multiple",
      opciones: ["Envía datos", "Almacena archivos", "Responde peticiones", "Todas las anteriores"],
      respuesta: "Envía datos",
      retroalimentacion: "Correcto, pero también puede hacer otras tareas."
    },
    {
      id: 3,
      texto: "Explica un algoritmo que hayas implementado recientemente.",
      tipo: "video",
      respuesta: "https://mi-servidor/videos/respuesta123.mp4",
      retroalimentacion: "Muy clara la explicación en el video."
    }
  ]
};

export const SimulatorDetail = () => {
  const { estudianteID, simuladorID } = useParams();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[var(--primary)] mb-6">
        Detalle del Simulador #{simuladorID}
      </h1>

      <div className="space-y-6">
        {mockDetalleSimulador.preguntas.map((pregunta, index) => (
          <div key={pregunta.id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
            <p className="font-semibold mb-4">{index + 1}. {pregunta.texto}</p>

            {/* Opción múltiple */}
            {pregunta.tipo === "opcion_multiple" && (
              <div className="space-y-2">
                {pregunta.opciones.map((opcion, idx) => (
                  <label key={idx} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={`pregunta-${pregunta.id}`}
                      checked={opcion === pregunta.respuesta}
                      readOnly
                    />
                    <span>{opcion}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Video */}
            {pregunta.tipo === "video" && (
              <video
                src={pregunta.respuesta}
                controls
                className="w-full max-w-md mt-2 rounded shadow-md"
              />
            )}

            <p className="text-sm text-gray-600 mt-4">
              <strong>Retroalimentación:</strong> {pregunta.retroalimentacion}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimulatorDetail;
