import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaVideo, FaKeyboard } from "react-icons/fa";
// import Feedback from "../../components/Feedback.jsx";

const SimuladorFormulario = () => {
    const { simuladorId } = useParams();
    const [preguntas, setPreguntas] = useState([]);
    const [respuestas, setRespuestas] = useState({});
    const [modosPorPregunta, setModosPorPregunta] = useState({});

    useEffect(() => {
        const preguntasMock = [
            {
                id: 1,
                texto: "¿Qué es una IP?",
                opciones: ["Identificador", "Dirección de red", "Programa", "Ninguna"]
            },
            {
                id: 2,
                texto: "¿Qué hace un servidor?",
                opciones: ["Envía datos", "Almacena archivos", "Responde peticiones", "Todas las anteriores"]
            },
        ];

        setPreguntas(preguntasMock);

        // Inicializar con texto por defecto
        const modosIniciales = {};
        preguntasMock.forEach(p => modosIniciales[p.id] = "texto");
        setModosPorPregunta(modosIniciales);
    }, [simuladorId]);

    const handleModoPregunta = (idPregunta, modo) => {
        setModosPorPregunta({ ...modosPorPregunta, [idPregunta]: modo });
    };

    const handleRespuestaTexto = (idPregunta, opcion) => {
        setRespuestas({ ...respuestas, [idPregunta]: { tipo: "texto", valor: opcion } });
    };

    const handleRespuestaVideo = (idPregunta, archivo) => {
        setRespuestas({ ...respuestas, [idPregunta]: { tipo: "video", valor: archivo } });
    };

    const handleSubmit = () => {
        console.log("Respuestas enviadas:", respuestas);
    };

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-[var(--primary)] mb-6">Simulador #{simuladorId}</h1>

            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                {preguntas.map((preg, index) => (
                    <div key={preg.id} className="bg-white border border-[var(--color-lavanda-500)] rounded-lg shadow-md p-5 space-y-4">
                        <h2 className="font-semibold text-[var(--color-lavanda-800)]">Pregunta {index + 1}</h2>
                        <p className="text-[var(--color-gris-900)]">{preg.texto}</p>

                        <div className="flex gap-4">
                            <button
                                onClick={() => handleModoPregunta(preg.id, "texto")}
                                className={`px-4 py-2 rounded-md font-semibold 
                                ${modosPorPregunta[preg.id] === "texto"
                                        ? "bg-[var(--color-lavanda-600)] text-white"
                                        : "bg-[var(--color-gris-200)] text-[var(--color-gris-900)]"
                                    }`}>
                                Texto
                            </button>
                            <button
                                onClick={() => handleModoPregunta(preg.id, "video")}
                                className={`px-4 py-2 rounded-md font-semibold 
                                ${modosPorPregunta[preg.id] === "video"
                                        ? "bg-[var(--color-lavanda-600)] text-white"
                                        : "bg-[var(--color-gris-200)] text-[var(--color-gris-900)]"
                                    }`}>
                                Video
                            </button>
                        </div>

                        {modosPorPregunta[preg.id] === "texto" ? (
                            <div className="space-y-2 mt-3">
                                {preg.opciones.map((op, i) => (
                                    <label key={i} className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name={`pregunta-${preg.id}`}
                                            value={op}
                                            checked={respuestas[preg.id]?.valor === op}
                                            onChange={() => handleRespuestaTexto(preg.id, op)}
                                            className="w-5 h-5 accent-green-600"
                                        />
                                        <span>{op}</span>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <div className="mt-3 space-y-3">
                                <label className="flex flex-col items-center justify-center py-6 border-2 border-dashed rounded-md cursor-pointer hover:border-[var(--color-lavanda-600)] border-[var(--color-gris-500)]">
                                    <FaVideo className="text-[var(--color-lavanda-600)] text-3xl mb-2" />
                                    <span className="text-[var(--color-gris-700)] text-sm">Haz clic para subir video</span>
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={(e) => handleRespuestaVideo(preg.id, e.target.files[0])}
                                        className="hidden"
                                    />
                                </label>

                                <button
                                    onClick={() => alert("Funcionalidad de grabación próximamente")}
                                    className="w-full py-2 bg-[var(--color-lavanda-600)] text-white font-semibold rounded-md hover:bg-[var(--color-lavanda-700)] transition"
                                >
                                    Grabar video desde aquí
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-6 flex gap-4">
                <button
                    onClick={handleSubmit}
                    className="px-6 py-3 rounded-md bg-[var(--color-gris-700)] text-white font-semibold hover:bg-[var(--color-gris-900)] transition"
                >
                    Enviar respuestas
                </button>

                <Link to={`/student/simuladores/${simuladorId}`} className="px-6 py-3 rounded-md bg-[var(--color-gris-700)] text-white font-semibold hover:bg-[var(--color-gris-900)] transition text-center">
                    Atrás
                </Link>
            </div>
        </div>
    );
};

export default SimuladorFormulario;
