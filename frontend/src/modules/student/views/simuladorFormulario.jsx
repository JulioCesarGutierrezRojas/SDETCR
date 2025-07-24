import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaVideo, FaKeyboard } from "react-icons/fa";
// import Feedback from "../../components/Feedback.jsx";

const SimuladorFormulario = () => {
    const { simuladorId } = useParams();
    const [modo, setModo] = useState("texto");
    const [preguntas, setPreguntas] = useState([]);
    const [respuestas, setRespuestas] = useState({});
    const [video, setVideo] = useState(null);

    useEffect(() => {
        setPreguntas([
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
        ]);
    }, [simuladorId]);

    const handleRespuesta = (preguntaId, opcion) => {
        setRespuestas({ ...respuestas, [preguntaId]: opcion });
    };

    const handleSubmit = () => {
        if (modo === "texto") {
            console.log("Respuestas:", respuestas);
        } else {
            console.log("Video seleccionado:", video);
        }
    };

    return (
        <div className="p-4 max-w-6xl mx-auto">
            {/* <Feedback/> Descomentar después de que la pantalla este lista para añdir la lógica*/}
            <h1 className="text-2xl font-bold text-[var(--primary)] mb-4">Simulador #{simuladorId}</h1>

            <div className="mb-6">
                <label className="block mb-2 font-medium text-[var(--color-gris-900)]">
                    Selecciona el modo de respuesta:
                </label>
                <div className="flex gap-5">
                    <button
                        onClick={() => setModo("texto")}
                        className={`min-w-[150px] px-4 py-2 rounded-md font-semibold flex items-center justify-center gap-2
                            ${modo === "texto"
                                ? "bg-[var(--color-lavanda-600)] text-white"
                                : "bg-[var(--color-gris-200)] text-[var(--color-gris-900)]"
                            }`}
                    >
                        <FaKeyboard /> <span>Texto</span>
                    </button>
                    <button
                        onClick={() => setModo("video")}
                        className={`min-w-[150px] px-4 py-2 rounded-md font-semibold flex items-center justify-center gap-2
                            ${modo === "video"
                                ? "bg-[var(--color-lavanda-600)] text-white"
                                : "bg-[var(--color-gris-200)] text-[var(--color-gris-900)]"
                            }`}
                    >
                        <FaVideo /><span>Video</span>
                    </button>
                </div>
            </div>

            {modo === "texto" ? (
                <>
                    <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                        {preguntas.map((preg, index) => (
                            <div
                                key={preg.id}
                                className="bg-white border border-[var(--color-lavanda-500)] rounded-lg shadow-md p-5 space-y-4"
                            >
                                <h2 className="font-semibold text-[var(--color-lavanda-800)]">
                                    Pregunta {index + 1}
                                </h2>

                                <p className="text-[var(--color-gris-900)] border border-[var(--color-lavanda-400)] rounded-md p-1">
                                    {preg.texto}
                                </p>

                                <div className="space-y-3">
                                    {preg.opciones.map((op, i) => (
                                        <label key={i} className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name={`pregunta-${preg.id}`}
                                                value={op}
                                                checked={respuestas[preg.id] === op}
                                                onChange={() => handleRespuesta(preg.id, op)}
                                                className="w-5 h-5 accent-green-600"
                                            />
                                            <span className="text-[var(--color-gris-900)]">{op}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="bg-[var(--color-blanco)] border border-[var(--color-gris-500)] p-4 rounded-md shadow-md">
                    <label className="block mb-2 font-medium text-[var(--color-gris-900)] text-center">
                        Sube tu video de respuesta
                    </label>

                    <label
                        className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-[var(--color-gris-500)] hover:border-[var(--color-lavanda-600)] transition cursor-pointer rounded-md"
                    >
                        <FaVideo className="text-[var(--color-lavanda-600)] text-4xl mb-4" />
                        <p className="text-[var(--color-gris-700)]">Arrastra tu archivo aquí o haz clic para seleccionar</p>

                        <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => setVideo(e.target.files[0])}
                            className="hidden"
                        />
                    </label>

                    <button
                        onClick={() => alert("Funcionalidad de grabación próximamente")}
                        className="mt-5 w-full py-3 px-4 bg-[var(--color-lavanda-600)] hover:bg-[var(--color-lavanda-700)] text-white rounded-md font-semibold transition text-center"
                    >
                        Grabar video desde aquí
                    </button>
                </div>

            )}

            <div className="mt-6 flex gap-4">
                <button
                    onClick={handleSubmit}
                    className="px-6 py-3 rounded-md bg-[var(--color-gris-700)] text-white font-semibold hover:bg-[var(--color-gris-900)] transition">
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
