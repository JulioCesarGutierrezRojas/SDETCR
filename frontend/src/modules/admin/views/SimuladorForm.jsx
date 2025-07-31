import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaTrash, FaPlus, FaTimes } from "react-icons/fa";

const SimuladorFormAdmin = () => {
    const { simuladorId } = useParams();
    const [preguntas, setPreguntas] = useState([]);

    useEffect(() => {
        setPreguntas([
            {
                id: 1,
                texto: "¿Qué es una IP?",
                respuestas: ["Dirección de red", "Tipo de servidor", "Nombre de usuario"],
                correcta: 0
            }
        ]);
    }, [simuladorId]);

    const handleAgregarPregunta = () => {
        if (preguntas.length >= 10) return alert("No puedes agregar más de 10 preguntas.");
        setPreguntas([
            ...preguntas,
            { id: Date.now(), texto: "", respuestas: [""], correcta: 0 }
        ]);
    };

    const handleEliminarPregunta = (id) => {
        setPreguntas(preguntas.filter((preg) => preg.id !== id));
    };

    const handleTextoPregunta = (id, nuevoTexto) => {
        setPreguntas(
            preguntas.map((preg) =>
                preg.id === id ? { ...preg, texto: nuevoTexto } : preg
            )
        );
    };

    const handleAgregarRespuesta = (pregId) => {
        setPreguntas(
            preguntas.map((preg) =>
                preg.id === pregId && preg.respuestas.length < 4
                    ? { ...preg, respuestas: [...preg.respuestas, ""] }
                    : preg
            )
        );
    };

    const handleEditarRespuesta = (pregId, indexResp, nuevoTexto) => {
        setPreguntas(
            preguntas.map((preg) => {
                if (preg.id !== pregId) return preg;
                const nuevasResp = [...preg.respuestas];
                nuevasResp[indexResp] = nuevoTexto;
                return { ...preg, respuestas: nuevasResp };
            })
        );
    };

    const handleEliminarRespuesta = (pregId, indexResp) => {
        setPreguntas(
            preguntas.map((preg) => {
                if (preg.id !== pregId) return preg;
                const nuevasResp = preg.respuestas.filter((_, i) => i !== indexResp);
                return { ...preg, respuestas: nuevasResp };
            })
        );
    };

    const handleSeleccionarCorrecta = (pregId, indexResp) => {
        setPreguntas(
            preguntas.map((preg) =>
                preg.id === pregId ? { ...preg, correcta: indexResp } : preg
            )
        );
    };

    const handleGuardar = () => {
        if (preguntas.length !== 10) {
            alert("Debes agregar exactamente 10 preguntas antes de guardar.");
            return;
        }
        console.log("Preguntas guardadas:", preguntas);
    };
    

    return (
        <div className="p-4 space-y-6 max-w-5xl mx-auto">
            <div className="bg-white p-4 rounded-lg shadow-md space-y-4 border border-[var(--color-gris-300)]">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-[var(--color-lavanda-700)]">Preguntas del Simulador</h1>
                    <div className="flex gap-4">
                        <Link to={`/admin/categoria/${simuladorId}`} className="px-4 py-2 rounded-md bg-[var(--color-gris-700)] text-white hover:bg-[var(--color-gris-800)] transition">
                            Atrás
                        </Link>
                        <button
                            onClick={handleAgregarPregunta}
                            disabled={preguntas.length >= 10}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-white transition ${preguntas.length >= 10
                                ? "bg-[var(--color-gris-700)] cursor-not-allowed"
                                : "bg-[var(--color-lavanda-700)] hover:bg-[var(--color-lavanda-800)]"
                                }`}
                        >
                            <FaPlus /> Agregar pregunta
                        </button>
                    </div>
                </div>

                {/* Barra de progreso */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[var(--color-lavanda-600)] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(preguntas.length / 10) * 100}%` }}
                    ></div>
                </div>
                <p className="text-sm text-right text-[var(--color-gris-900)]">{preguntas.length}/10</p>
            </div>

            {/* Preguntas */}
            <div className="space-y-5 max-h-[500px] overflow-y-auto pr-2">
                {preguntas.map((preg, index) => (
                    <div
                        key={preg.id}
                        className="bg-white border border-2 border-[var(--color-lavanda-400)] rounded-lg shadow p-5 space-y-4"
                    >
                        <div className="flex justify-between items-center">
                            <h2 className="font-semibold text-[var(--color-lavanda-800)]">Pregunta {index + 1}</h2>
                            <button
                                onClick={() => handleEliminarPregunta(preg.id)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <FaTrash />
                            </button>
                        </div>

                        <input
                            type="text"
                            className="w-full text-[var(--color-gris-900)] border border-[var(--color-lavanda-400)] rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-lavanda-400)]"
                            value={preg.texto}
                            onChange={(e) => handleTextoPregunta(preg.id, e.target.value)}
                            placeholder="Escribe la pregunta aquí"
                        />

                        {/* Respuestas */}
                        <div className="space-y-3">
                            {preg.respuestas.map((resp, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name={`correcta-${preg.id}`}
                                        checked={preg.correcta === idx}
                                        onChange={() => handleSeleccionarCorrecta(preg.id, idx)}
                                        className="w-5 h-5 accent-green-600"
                                    />

                                    <input
                                        type="text"
                                        className="flex-grow text-[var(--color-gris-900)] border border-[var(--color-lavanda-400)] rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-lavanda-400)]"
                                        value={resp}
                                        onChange={(e) =>
                                            handleEditarRespuesta(preg.id, idx, e.target.value)
                                        }
                                        placeholder={`Respuesta ${idx + 1}`}
                                    />
                                    <button
                                        onClick={() => handleEliminarRespuesta(preg.id, idx)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            ))}

                            {preg.respuestas.length < 4 && (
                                <button onClick={() => handleAgregarRespuesta(preg.id)}
                                    className="text-sm text-purple-700 hover:text-purple-900 flex items-center gap-1">
                                    <FaPlus /> Agregar opción
                                </button>
                            )}

                        </div>
                    </div>
                ))}
            </div>

            {/* Guardar simulador */}
            <div className="flex justify-end gap-4 pt-4">
                <button 
                    onClick={handleGuardar}
                    className="px-5 py-2 bg-[var(--color-lavanda-700)] text-white rounded-md hover:bg-[var(--color-lavanda-800)]">
                    Guardar preguntas
                </button>
            </div>
        </div>
    );
};

export default SimuladorFormAdmin;
