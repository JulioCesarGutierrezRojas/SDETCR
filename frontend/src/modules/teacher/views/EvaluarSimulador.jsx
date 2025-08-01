import { useState } from "react";
import { FaUser, FaReply } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

const EvaluarSimulador = () => {
    const navigate = useNavigate();
    const [comentario, setComentario] = useState("");
    const [calificacion, setCalificacion] = useState('');
    const [indiceActual, setIndiceActual] = useState(0);
    const { simuladorId } = useParams();

    const preguntas = [
        {
            texto: '¿Qué es React?',
            tipo: 'texto',
            opciones: ['Un lenguaje', 'Un framework', 'Una librería de JS', 'Un servidor'],
            respuesta: 'Una librería de JS',
            correcta: true,
        },
        {
            texto: 'Explica cómo aplicarías React en un proyecto real.',
            tipo: 'video',
            videoURL: '/videos/respuesta1.mp4',
        },
        {
            texto: '¿Qué hook se usa para estado?',
            tipo: 'texto',
            opciones: ['useEffect', 'useRef', 'useState', 'useCallback'],
            respuesta: 'useState',
            correcta: false,
        },
    ];

    const student = {
        nombre: 'Juan Perwez',
        correo: 'juan.perez@universidad.edu.mx',
        matricula: '20230001',
    };

    const fechaActual = new Date().toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    const siguientePregunta = () => {
        if (indiceActual < preguntas.length - 1) {
            setIndiceActual(indiceActual + 1);
        }
    };

    const anteriorPregunta = () => {
        if (indiceActual > 0) {
            setIndiceActual(indiceActual - 1);
        }
    };

    const pregunta = preguntas[indiceActual];

    return (
        <div className="max-w-5xl mx-auto p-4">
            <div className="flex bg-white shadow-md rounded-xl border border-[var(--color-gris-200)] overflow-hidden mb-6">
                <div className="w-[7px] bg-[var(--color-lavanda-600)]" />
                <div className="flex items-center space-x-4 p-3">
                    <div className="bg-[var(--color-lavanda-200)] p-3 rounded-full">
                        <FaUser className="text-[var(--color-lavanda-700)] text-xl" />
                    </div>
                    <div>
                        <p className="font-semibold text-[var(--color-gris-900)]">{student.nombre}</p>
                        <p className="text-sm text-[var(--color-gris-700)]">Correo: {student.correo}</p>
                        <p className="text-sm text-[var(--color-gris-700)]">Matrícula: {student.matricula}</p>
                    </div>
                </div>
            </div>

            {/* Preguntas del simulador */}
            <div className="bg-white border border-[var(--color-gris-300)] rounded-xl shadow-md p-5 mb-6">
                <h3 className="text-xl font-semibold text-[var(--color-gris-900)] mb-4">Respuestas del simulador</h3>

                <div className="space-y-5">
                    <div className="border border-[var(--color-gris-500)] rounded-md">
                        {pregunta.tipo === "texto" ? (
                            <div className={`border-l-4 rounded-md p-4 ${pregunta.correcta ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}`}>
                                <p className="text-sm font-medium text-[var(--color-gris-900)] mb-2">
                                    Pregunta {indiceActual + 1}: {pregunta.texto}
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
                                    Pregunta {indiceActual + 1}: {pregunta.texto}
                                </p>
                                <div className="text-sm text-[var(--color-gris-800)] mb-2">
                                    Respuesta enviada en video; evaluación a cargo del docente
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

                    {/* Navegación entre preguntas */}
                    <div className="flex justify-between items-center mt-4">
                        <button
                            onClick={anteriorPregunta}
                            disabled={indiceActual === 0}
                            className={`px-4 py-1 rounded-md font-medium ${indiceActual === 0 ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-[var(--color-lavanda-600)] text-white hover:bg-[var(--color-lavanda-800)]'}`}
                        >
                            Anterior
                        </button>
                        <span className="text-sm text-[var(--color-gris-700)]">
                            Pregunta {indiceActual + 1} de {preguntas.length}
                        </span>
                        <button
                            onClick={siguientePregunta}
                            disabled={indiceActual === preguntas.length - 1}
                            className={`px-4 py-1 rounded-md font-medium ${indiceActual === preguntas.length - 1 ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-[var(--color-lavanda-600)] text-white hover:bg-[var(--color-lavanda-800)]'}`}
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            </div>

            {/* Comentario del docente */}
            <div className="bg-white border border-[var(--color-gris-400)] rounded-xl shadow-md p-5">
                <h4 className="text-lg font-semibold text-[var(--color-gris-900)] mb-2">Comentario del Docente</h4>

                <textarea
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    rows={4}
                    className="w-full max-h-15 border border-[var(--color-gris-300)] rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-lavanda-500)] resize-none"
                    placeholder="Escribe aquí tu observación..."
                ></textarea>

                <div className="mt-2">
                    <label className="block text-sm font-medium text-[var(--color-gris-800)] mb-1">
                        Puntiación final (1 a 10):
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="10"
                        step="1"
                        value={calificacion}
                        onChange={(e) => setCalificacion(e.target.value)}
                        className="w-40 border border-[var(--color-gris-300)] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-lavanda-500)]"
                        placeholder="Ej. 8"
                    />
                </div>

                <p className="text-sm text-[var(--color-gris-700)] mt-4 mb-4">
                    Fecha de evaluación: {fechaActual}
                </p>

                <div className="flex gap-4">
                    <button
                        className="bg-[var(--color-lavanda-700)] text-white px-6 py-2 rounded-lg hover:bg-[var(--color-lavanda-900)] transition-colors"
                        onClick={() => alert("Comentario guardado (simulado)")}>
                        Guardar comentario
                    </button>
                    <button
                        className="bg-[var(--color-gris-600)] text-[var(--color-blanco)] font-semibold px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-[var(--color-gris-700)]"
                        onClick={() => navigate(`/teacher/evaluarEstudiante`)}>
                        <FaReply /> Regresar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EvaluarSimulador;