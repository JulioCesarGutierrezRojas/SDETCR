import { useState } from "react";
import { FaUser, FaReply } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const EvaluarSimulador = () => {
    const navigate = useNavigate();
    const [comentario, setComentario] = useState("");

    const preguntas = [
        {
            texto: '¿Qué es React?',
            opciones: ['Un lenguaje', 'Un framework', 'Una librería de JS', 'Un servidor'],
            respuesta: 'Una librería de JS',
            correcta: true,
        },
        {
            texto: '¿Qué es JSX?',
            opciones: ['Java XML', 'Una extensión de HTML', 'Una API', 'Una función'],
            respuesta: 'Una extensión de HTML',
            correcta: false,
        },
        {
            texto: '¿Qué hook se usa para estado?',
            opciones: ['useEffect', 'useRef', 'useState', 'useCallback'],
            respuesta: 'useState',
            correcta: true,
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
            <div className="bg-white border border-[var(--color-gris-200)] rounded-xl shadow-md p-6 mb-6">
                <h3 className="text-xl font-semibold text-[var(--color-gris-900)] mb-4">Respuestas del simulador</h3>

                <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                    {preguntas.map((pregunta, index) => (
                        <div className="border border-[var(--color-gris-400)] rounded-md">
                            <div key={index} className={`p-4 rounded-md border-l-4 ${pregunta.correcta ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}`}>

                                <p className="text-sm font-medium text-[var(--color-gris-900)] mb-2">
                                    Pregunta {index + 1}: {pregunta.texto}
                                </p>
                                <ul className="space-y-1 ">
                                    {pregunta.opciones.map((opcion, i) => {
                                        const esSeleccionada = opcion === pregunta.respuesta;
                                        const color =
                                            esSeleccionada && pregunta.correcta
                                                ? "bg-green-100 border-green-500 text-green-700"
                                                : esSeleccionada && !pregunta.correcta
                                                    ? "bg-red-100 border-red-500 text-red-700"
                                                    : "bg-[var(--color-blanco)] border-[var(--color-gris-500)] text-[var(--color-gris-900)]";

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
                        </div>
                    ))}
                </div>
            </div>


            {/* Comentario del docente */}
            <div className="bg-white border border-[var(--color-gris-300)] rounded-xl shadow-md p-5">
                <h4 className="text-lg font-semibold text-[var(--color-gris-900)] mb-2">Comentario del Docente</h4>
                <textarea
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    rows={4}
                    className="w-full max-h-24 border border-[var(--color-gris-300)] rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-lavanda-500)] resize-none"
                    placeholder="Escribe aquí tu observación..."
                ></textarea>

                <p className="text-sm text-[var(--color-gris-600)] mt-2 mb-4">
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
