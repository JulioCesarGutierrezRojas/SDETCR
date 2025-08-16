import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaVideo, FaKeyboard } from "react-icons/fa";
import VideoRecorderModal from "../components/VideoRecorderModal.jsx";
import Feedback from "../../../components/Feedback.jsx";
import CalificacionProv from "../../../components/Calificacion.jsx";
import { getSimulatorQuestions, saveStudentAnswers } from "../adapters/student.controller.js";
import { showAlert, showConfirmation, showErrorToast, showSuccessToast, showWarningToast } from "../../../kernel/alerts.js";
import { isValidVideoFile, getFileSizeInMB, validateVideoFileSize } from "../../../kernel/validations.js";

const SimuladorFormulario = () => {
    const { simuladorID } = useParams();
    const [preguntas, setPreguntas] = useState([]);
    const [respuestas, setRespuestas] = useState({});
    const [modosPorPregunta, setModosPorPregunta] = useState({});
    const [modalAbierto, setModalAbierto] = useState(false);
    const [preguntaActualModal, setPreguntaActualModal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [simulatorInfo, setSimulatorInfo] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [finalScore, setFinalScore] = useState(null);

    useEffect(() => {
        const loadQuestions = async () => {
            try {
                setLoading(true);
                
                const response = await getSimulatorQuestions(simuladorID);
                
                // Los datos vienen en result según el backend
                let simulator, questions;
                
                if (response.result) {
                    simulator = response.result.simulator;
                    questions = response.result.questions;
                } else if (response.metadata) {
                    // Fallback por si cambia la estructura
                    simulator = response.metadata.simulator;
                    questions = response.metadata.questions;
                } else {
                    throw new Error('No se encontraron datos de preguntas en la respuesta del servidor');
                }
                
                if (questions && questions.length > 0) {
                    setSimulatorInfo(simulator);
                    setPreguntas(questions);
                    
                    // Inicializar modos con texto por defecto
                    const modosIniciales = {};
                    questions.forEach(q => modosIniciales[q.question_id] = "texto");
                    setModosPorPregunta(modosIniciales);
                } else {
                    console.warn('No se encontraron preguntas o el arreglo está vacío');
                }
            } catch (error) {
                showErrorToast({
                    title: 'Error al cargar preguntas',
                    text: error.message || 'No se pudieron cargar las preguntas del simulador'
                });
            } finally {
                setLoading(false);
            }
        };

        if (simuladorID) {
            loadQuestions();
        }
    }, [simuladorID]);

    const handleModoPregunta = (idPregunta, modo) => {
        setModosPorPregunta({ ...modosPorPregunta, [idPregunta]: modo });
    };

    const handleRespuestaTexto = (idPregunta, opcion) => {
        setRespuestas({ ...respuestas, [idPregunta]: { tipo: "texto", valor: opcion } });
    };

    const handleRespuestaVideo = (idPregunta, archivo) => {
        if (!archivo) return;
        
        // Validar que el archivo sea un video
        if (!isValidVideoFile(archivo)) {
            showErrorToast({
                title: 'Archivo no válido',
                text: 'Por favor selecciona un archivo de video válido (MP4, AVI, MOV, WMV, etc.)'
            });
            return;
        }
        
        // Validar el tamaño del archivo
        const sizeError = validateVideoFileSize(archivo);
        if (sizeError) {
            showWarningToast({
                title: 'Archivo muy grande',
                text: sizeError
            });
            return;
        }
        
        setRespuestas({ ...respuestas, [idPregunta]: { tipo: "video", valor: archivo } });
    };

    const handleIniciarGrabacion = (idPregunta) => {
        setPreguntaActualModal(idPregunta);
        setModalAbierto(true);
    };

    const handleVideoGrabado = (archivo) => {
        if (preguntaActualModal && archivo) {
            // Validar que el archivo grabado sea un video
            if (!isValidVideoFile(archivo)) {
                showErrorToast({
                    title: 'Error en grabación',
                    text: 'El archivo grabado no es un video válido. Por favor intenta grabar de nuevo.'
                });
                return;
            }
            
            // Validar el tamaño del archivo grabado
            const sizeError = validateVideoFileSize(archivo);
            if (sizeError) {
                showWarningToast({
                    title: 'Video muy grande',
                    text: sizeError
                });
                return;
            }
            
            setRespuestas({ ...respuestas, [preguntaActualModal]: { tipo: "video", valor: archivo } });
        }
    };

    const handleCerrarModal = () => {
        setModalAbierto(false);
        setPreguntaActualModal(null);
    };

    const handleConfirmSubmit = async () => {
        setLoading(true);

        try {
            const studentId = localStorage.getItem('userId');
            const answersToSend = preguntas.map(p => ({
                question_id: p.question_id,
                type_response: modosPorPregunta[p.question_id],
                answer: respuestas[p.question_id]?.valor // Solo texto
            }));

            const videoFiles = Object.values(respuestas)
                .filter(r => r.tipo === 'video' && r.valor instanceof File)
                .map(r => r.valor);

            const response = await saveStudentAnswers(studentId, simuladorID, answersToSend, videoFiles);

            // Capturar la calificación de la respuesta
            if (response.result && response.result.final_score !== undefined) {
                setFinalScore(response.result.final_score);
            }

            setIsSubmitted(true);

            showSuccessToast({
                title: '¡Respuestas enviadas!',
                text: 'Tus respuestas han sido enviadas correctamente.'
            });

            // Redirigir a la página de resultados o a donde sea necesario
            // navigate(`/student/resultados/${simuladorID}`);

        } catch (error) {
            showErrorToast({
                title: 'Error al enviar',
                text: error.message || 'Hubo un problema al enviar tus respuestas'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        const studentId = localStorage.getItem('userId'); // El ID del estudiante está en localStorage
        if (!studentId) {
            showAlert('Error de autenticación', 'No se pudo identificar al estudiante. Por favor, inicie sesión de nuevo.', 'error');
            return;
        }

        // Validar que todas las preguntas tengan una respuesta
        if (Object.keys(respuestas).length !== preguntas.length) {
            showWarningToast({
                title: 'Respuestas incompletas',
                text: 'Debes responder todas las preguntas antes de enviar.'
            });
            return;
        }

        // Confirmación del usuario
        showConfirmation(
            '¿Estás seguro?',
            'Una vez enviado, no podrás cambiar tus respuestas.',
            'warning',
            handleConfirmSubmit // <- Aquí se usa la nueva función
        );
    };

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-[var(--color-lavanda-700)]">
                    {simulatorInfo?.name || `Simulador #${simuladorID}`}
                </h1>
            </div>

            {preguntas.length === 0 ? (
                <div className="text-center py-12">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-yellow-100 rounded-full">
                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                            No hay preguntas disponibles
                        </h3>
                        <p className="text-yellow-700 mb-4">
                            Este simulador aún no tiene preguntas configuradas. Por favor, inténtalo más tarde o contacta con tu instructor.
                        </p>
                        <Link 
                            to="/student/simuladores" 
                            className="inline-block px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition"
                        >
                            Volver a simuladores
                        </Link>
                    </div>
                </div>
            ) : (
                <>
                    <div className="space-y-8">
                        {preguntas.map((preg, index) => (
                            <div key={preg.question_id} className="bg-white border border-2 border-[var(--color-lavanda-500)] rounded-lg shadow-md p-5 space-y-4">
                                <h2 className="font-semibold text-[var(--color-lavanda-800)]">Pregunta {index + 1}</h2>
                                <p className="text-[var(--color-gris-900)] border border-[var(--color-lavanda-600)] rounded-md py-2 pl-2">{preg.question}</p>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleModoPregunta(preg.question_id, "texto")}
                                        className={`px-4 py-1 rounded-md font-semibold 
                                        ${modosPorPregunta[preg.question_id] === "texto"
                                                ? "bg-[var(--color-lavanda-600)] text-white"
                                                : "bg-[var(--color-gris-200)] text-[var(--color-gris-900)]"
                                            }`}>
                                        Texto
                                    </button>
                                    <button
                                        onClick={() => handleModoPregunta(preg.question_id, "video")}
                                        className={`px-4 py-1 rounded-md font-semibold 
                                        ${modosPorPregunta[preg.question_id] === "video"
                                                ? "bg-[var(--color-lavanda-600)] text-white"
                                                : "bg-[var(--color-gris-200)] text-[var(--color-gris-900)]"
                                            }`}>
                                        Video
                                    </button>
                                </div>

                                {modosPorPregunta[preg.question_id] === "texto" ? (
                                    <div className="space-y-2 mt-3">
                                        {preg.options.map((op, i) => (
                                            <label key={i} className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name={`pregunta-${preg.question_id}`}
                                                    value={op}
                                                    checked={respuestas[preg.question_id]?.valor === op}
                                                    onChange={() => handleRespuestaTexto(preg.question_id, op)}
                                                    className="w-5 h-5 accent-green-600"
                                                />
                                                <span>{op}</span>
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="mt-3 space-y-3">
                                        {respuestas[preg.question_id]?.valor ? (
                                            <div className="border-2 border-dashed border-[var(--color-lavanda-400)] rounded-md p-3 bg-lavanda-50 flex items-center justify-between">
                                                <div className="flex items-center min-w-0">
                                                    <FaVideo className="text-[var(--color-lavanda-600)] text-xl mr-3 flex-shrink-0" />
                                                    <span className="text-[var(--color-gris-800)] font-medium truncate" title={respuestas[preg.question_id].valor.name || 'Video grabado'}>
                                                        {respuestas[preg.question_id].valor.name || 'Video grabado'}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => setRespuestas({ ...respuestas, [preg.question_id]: null })}
                                                    className="ml-4 flex-shrink-0 py-1 px-3 bg-red-500 text-white text-xs font-semibold rounded-md hover:bg-red-600 transition"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <label className="flex flex-col items-center justify-center py-6 border-2 border-dashed rounded-md cursor-pointer hover:border-[var(--color-lavanda-600)] border-[var(--color-gris-500)]">
                                                    <FaVideo className="text-[var(--color-lavanda-600)] text-3xl mb-2" />
                                                    <span className="text-[var(--color-gris-700)] text-sm">Haz clic para subir video o arrastralo aquí</span>
                                                    <input
                                                        type="file"
                                                        accept="video/*,.mp4,.avi,.mov,.wmv,.flv,.webm,.mkv,.3gp,.m4v,.mpg,.mpeg,.ogv"
                                                        onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            if (file) {
                                                                handleRespuestaVideo(preg.question_id, file);
                                                            }
                                                            // Limpiar el input para permitir seleccionar el mismo archivo
                                                            e.target.value = '';
                                                        }}
                                                        className="hidden"
                                                    />
                                                </label>

                                                <button
                                                    onClick={() => handleIniciarGrabacion(preg.question_id)}
                                                    className="w-full py-2 bg-[var(--color-lavanda-600)] text-white font-semibold rounded-md hover:bg-[var(--color-lavanda-700)] transition"
                                                >
                                                    Grabar video desde aquí
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Mostrar componentes de feedback y calificación después del envío */}
                    {isSubmitted && finalScore !== null && (
                        <div className="mt-8 space-y-6">
                            {/* Calificación provisional */}
                            <div className="flex justify-end">
                                <CalificacionProv score={finalScore} />
                            </div>
                            
                            {/* Feedback final */}
                            <Feedback score={finalScore} />
                        </div>
                    )}

                    <div className="mt-10 flex gap-4">
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitted || loading}
                            className={`px-4 py-2 rounded-md text-white font-semibold transition ${
                                isSubmitted || loading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-[var(--color-lavanda-700)] hover:bg-[var(--color-verde-feedback)]'
                            }`}
                        >
                            {loading ? 'Enviando...' : isSubmitted ? 'Respuestas enviadas' : 'Enviar respuestas'}
                        </button>

                        <Link 
                            to={isSubmitted ? '/student/resultadosObtenidos' : `/student/simuladores/${simuladorID}`}
                            className="px-5 py-2 rounded-md bg-[var(--color-gris-700)] text-white font-semibold hover:bg-[var(--color-gris-900)] transition text-center"
                        >
                            {isSubmitted ? 'Ver mis resultados' : 'Atrás'}
                        </Link>
                    </div>

                    {/* Modal de grabación de video */}
                    <VideoRecorderModal
                        isOpen={modalAbierto}
                        onClose={handleCerrarModal}
                        onVideoRecorded={handleVideoGrabado}
                    />
                </>
            )}
        </div>
    );
};

export default SimuladorFormulario;
