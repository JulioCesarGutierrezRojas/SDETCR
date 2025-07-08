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
                preg.id === pregId
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

    return (
        <div className="p-4 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-[var(--color-lavanda-700)]">Preguntas del Simulador</h1>
                <div className="flex gap-4">
                    <Link
                        to={`/admin/categoria/${simuladorId}`}
                        className="px-4 py-2 rounded-md bg-[var(--color-gris-800)] text-white font-semibold hover:bg-[var(--color-nude-600)] transition"
                    >
                        Atrás
                    </Link>
                    <button
                        onClick={handleAgregarPregunta}
                        disabled={preguntas.length >= 10}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-white transition ${preguntas.length >= 10
                            ? "bg-[var(--color-gris-400)] cursor-not-allowed"
                            : "bg-[var(--color-lavanda-700)] hover:bg-[var(--color-lavanda-500)]"
                            }`}
                    >
                        <FaPlus />
                        Agregar pregunta
                    </button>
                </div>
            </div>

            {preguntas.map((preg, index) => (
                <div key={preg.id} className="bg-[var(--color-lavanda-300)] p-4 rounded-lg shadow space-y-3">
                    <div className="flex justify-between items-center">
                        <input
                            type="text"
                            className="w-full p-2 border rounded text-[var(--color-gris-900)] bg-[var(--white)]"
                            value={preg.texto}
                            onChange={(e) => handleTextoPregunta(preg.id, e.target.value)}
                            placeholder={`Pregunta ${index + 1}`}
                        />
                        <button onClick={() => handleEliminarPregunta(preg.id)} className="text-[var(--color-rojo-error)] ml-4">
                            <FaTrash />
                        </button>
                    </div>

                    <div className="space-y-2">
                        {preg.respuestas.map((resp, idx) => (
                            <div key={idx} className="flex gap-2 items-center">
                                <input
                                    type="radio"
                                    name={`correcta-${preg.id}`}
                                    checked={preg.correcta === idx}
                                    onChange={() => handleSeleccionarCorrecta(preg.id, idx)}
                                />
                                <input
                                    type="text"
                                    className="flex-grow p-2 border border-[var(--color-lavanda-400)] rounded bg-[var(--white)]"
                                    value={resp}
                                    onChange={(e) => handleEditarRespuesta(preg.id, idx, e.target.value)}
                                    placeholder={`Respuesta ${idx + 1}`}
                                />
                                <button onClick={() => handleEliminarRespuesta(preg.id, idx)} className="text-[var(--color-rojo-error)]">
                                    <FaTimes />
                                </button>
                            </div>
                        ))}

                        <button
                            onClick={() => handleAgregarRespuesta(preg.id)}
                            className="text-sm text-[var(--color-lavanda-700)] hover:text-[var(--color-lavanda-900)]"
                        >
                            <FaPlus className="inline mr-1" /> Agregar respuesta
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SimuladorFormAdmin;
