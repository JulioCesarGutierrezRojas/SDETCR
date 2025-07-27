import { useParams, useNavigate } from "react-router-dom";
import { FaUser, FaReply } from "react-icons/fa";

// 🔹 Datos simulados
const mockDetalleSimulador = {
  estudiante: {
    nombre: "Juan Perez",
    correo: "juan.perez@universidad.edu.mx",
    matricula: "20230001",
  },
  preguntas: [
    {
      id: 1,
      texto: "¿Qué es una IP?",
      tipo: "texto",
      opciones: ["Identificador", "Dirección de red", "Programa", "Ninguna"],
      respuesta: "Dirección de red",
      correcta: true,
    },
    {
      id: 2,
      texto: "¿Qué hace un servidor?",
      tipo: "texto",
      opciones: ["Envía datos", "Almacena archivos", "Responde peticiones", "Todas las anteriores"],
      respuesta: "Envía datos",
      correcta: false,
    },
    {
      id: 3,
      texto: "Explica un algoritmo que hayas implementado recientemente.",
      tipo: "video",
      videoURL: "https://mi-servidor/videos/respuesta123.mp4",
    },
  ],
  comentarioDocente: {
    nombre: "Dra. Laura Mendoza",
    fecha: "2025-07-21",
    comentario: "Buen desempeño general del estudiante, aunque hay áreas de mejora en las preguntas teóricas.",
    calificacion: 8.5,
  },
};

export const SimulatorDetail = () => {
  const { simuladorID } = useParams();
  const navigate = useNavigate();

  const { estudiante, preguntas, comentarioDocente } = mockDetalleSimulador;

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* 📝 Título */}
      <h1 className="text-2xl font-bold text-[var(--color-lavanda-700)] pb-5">
        Detalle del Simulador #{simuladorID}
      </h1>

      {/* 🧑‍🎓 Datos del estudiante */}
      <div className="flex bg-white shadow-md rounded-xl border border-[var(--color-gris-200)] overflow-hidden mb-6">
        <div className="w-[7px] bg-[var(--color-lavanda-600)]" />
        <div className="flex items-center space-x-4 p-3">
          <div className="bg-[var(--color-lavanda-200)] p-3 rounded-full">
            <FaUser className="text-[var(--color-lavanda-700)] text-xl" />
          </div>
          <div>
            <p className="font-semibold text-[var(--color-gris-900)]">{estudiante.nombre}</p>
            <p className="text-sm text-[var(--color-gris-700)]">Correo: {estudiante.correo}</p>
            <p className="text-sm text-[var(--color-gris-700)]">Matrícula: {estudiante.matricula}</p>
          </div>
        </div>
      </div>

      {/* 📋 Respuestas del simulador */}
      <div className="bg-white border border-[var(--color-gris-300)] rounded-xl shadow-md p-5 mb-6">
        <h3 className="text-xl font-semibold text-[var(--color-gris-900)] mb-4">
          Respuestas del simulador
        </h3>

        <div className="space-y-5 max-h-60 overflow-y-auto pr-2">
          {preguntas.map((pregunta, index) => (
            <div key={index} className="border border-[var(--color-gris-500)] rounded-md">
              {pregunta.tipo === "texto" ? (
                <div
                  className={`border-l-4 rounded-md p-4 ${
                    pregunta.correcta
                      ? "border-green-500 bg-green-50"
                      : "border-red-500 bg-red-50"
                  }`}
                >
                  <p className="text-sm font-medium text-[var(--color-gris-900)] mb-2">
                    Pregunta {index + 1}: {pregunta.texto}
                  </p>
                  <ul className="space-y-1">
                    {pregunta.opciones.map((opcion, i) => {
                      const esSeleccionada = opcion === pregunta.respuesta;
                      const color =
                        esSeleccionada && pregunta.correcta
                          ? "bg-green-100 border-green-500 text-green-700"
                          : esSeleccionada && !pregunta.correcta
                          ? "bg-red-100 border-red-500 text-red-700"
                          : "bg-[var(--color-blanco)] border-[var(--color-gris-400)] text-[var(--color-gris-900)]";
                      return (
                        <li
                          key={i}
                          className={`px-3 py-2 rounded-md border ${color} text-sm`}
                        >
                          {opcion}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <div className="border-l-4 border-[var(--color-lavanda-600)] bg-[var(--color-lavanda-100)] rounded-md p-4">
                  <p className="text-sm font-medium text-[var(--color-gris-900)] mb-2">
                    Pregunta {index + 1}: {pregunta.texto}
                  </p>

                  <div className="text-sm text-[var(--color-gris-800)] mb-2">
                    Respuesta enviada en video; evaluación a cargo del docente.
                  </div>

                  <video
                    src={pregunta.videoURL}
                    controls
                    className="max-w-xs w-full aspect-video rounded-md border border-[var(--color-gris-400)]"
                  >
                    Tu navegador no soporta la reproducción de video.
                  </video>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 🧑‍🏫 Comentario del docente */}
      <div className="bg-white border border-[var(--color-lavanda-400)] rounded-xl shadow-md p-5 mb-6">
        <h3 className="text-xl font-semibold text-[var(--color-gris-900)] mb-2">Comentario del Docente</h3>
        <p className="text-sm text-[var(--color-gris-700)] mb-1">
          <strong>Docente:</strong> {comentarioDocente.nombre}
        </p>
        <p className="text-sm text-[var(--color-gris-700)] mb-1">
          <strong>Fecha:</strong> {comentarioDocente.fecha}
        </p>
        <p className="text-sm text-[var(--color-gris-800)] mb-2">
          <strong>Comentario:</strong> {comentarioDocente.comentario}
        </p>
        <p className="text-sm text-[var(--color-gris-800)]">
          <strong>Calificación final:</strong> <span className="font-bold">{comentarioDocente.calificacion}/10</span>
        </p>
      </div>

      {/* 🔙 Botón regresar */}
      <div className="flex justify-end mt-4">
        <button
          className="bg-[var(--color-gris-600)] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[var(--color-gris-700)]"
          onClick={() => navigate(-1)}
        >
          <FaReply /> Regresar
        </button>
      </div>
    </div>
  );
};

export default SimulatorDetail;
