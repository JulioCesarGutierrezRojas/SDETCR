import React from "react";
import { FaUser, FaReply } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ComentariosEstudiante = () => {
    const navigate = useNavigate();

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

    const comentarios = [
        {
            docente: 'Dra. Marcela Jiménez',
            fecha: '18 de julio de 2024',
            texto: 'Buen trabajo general, pero podrías repasar el tema de jsx y su sintaxis.',
            calificacionFinal: 9
        }
    ];

    const student = {
        nombre: 'Juan Perwez',
        correo: 'juan.perez@universidad.edu.mx',
        matricula: '20230001',
    };

    return (
        <div className="max-w-6xl mx-auto p-4">
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


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Respuestas */}
                <div className="bg-white border border-[var(--color-gris-300)] rounded-xl shadow-md max-h-[565px] overflow-y-auto">
                    <div className="p-5 sticky top-0 bg-white z-10 border-b border-[var(--color-gris-200)]">
                        <h3 className="text-xl font-semibold text-[var(--color-gris-900)]">Respuestas del Simulador</h3>
                    </div>
                    <div className="p-5 pt-4 space-y-4">
                        {preguntas.map((pregunta, index) => (
                            <div key={index} className="border border-[var(--color-gris-500)] rounded-md">
                                {pregunta.tipo === "texto" ? (
                                    <div className={`border-l-4 rounded-md p-4 ${pregunta.correcta ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}`}>
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
                                            Respuesta enviada en video; evaluación a cargo del docente
                                        </div>

                                        <video
                                            src={pregunta.videoURL}
                                            controls
                                            className="w-full rounded-md border border-[var(--color-gris-400)]"
                                        >
                                            Tu navegador no soporta la reproducción de video.
                                        </video>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Comentarios */}
                <div className="bg-white border border-[var(--color-gris-300)] rounded-xl shadow-md max-h-[565px] overflow-y-auto">
                    <div className="p-5 sticky top-0 bg-white z-10 border-b border-[var(--color-gris-200)]">
                        <h3 className="text-xl font-semibold text-[var(--color-gris-900)]">Comentarios de Docentes</h3>
                    </div>
                    <div className="p-5 pt-4 space-y-4">
                        {comentarios.map((comentario, index) => (
                            <div key={index} className="bg-[var(--color-lavanda-100)] p-4 rounded-lg border border-[var(--color-lavanda-300)]">
                                <p className="font-semibold text-[var(--color-lavanda-800)]">{comentario.docente}</p>
                                <p className="text-sm text-[var(--color-gris-800)]">{comentario.fecha}</p>
                                <p className="mt-3 text-[var(--color-gris-900)] text-sm">{comentario.texto}</p>

                                {comentario.calificacionFinal !== null && (
                                    <div className="mt-2">
                                        <span className={`text-xs font-semibold px-2.5 py-2 rounded-md shadow-sm
                                  ${comentario.calificacionFinal >= 8
                                                ? 'bg-green-200 text-green-800 border border-green-300'
                                                : 'bg-red-200 text-red-800 border border-red-300'}`}>
                                            {comentario.calificacionFinal >= 8 ? '' : ''} Calificación Final: {comentario.calificacionFinal}/10
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

            </div>


            <div className="mt-6">
                <button
                    className="bg-[var(--color-gris-700)] text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[var(--color-gris-600)]"
                    onClick={() => navigate(`/student/resultadosObtenidos`)}>
                    <FaReply /> Regresar a resultados generales
                </button>
            </div>
        </div>
    );
};

export default ComentariosEstudiante;
