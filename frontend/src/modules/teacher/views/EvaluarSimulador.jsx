import { useState, useEffect } from "react";
import { FaUser, FaReply } from "react-icons/fa";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { 
    getStudentAnswersWithEvaluation,
    getStudentAnswersWithoutEvaluation,
    createEvaluation,
    updateEvaluation 
} from "../adapters/teacher.controller";
import { showSuccessToast, showErrorToast, showConfirmation } from "../../../kernel/alerts";
import Loader from "../../../components/Loader";

const EvaluarSimulador = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { simuladorId } = useParams();
    
    // Estados de la UI
    const [comentario, setComentario] = useState("");
    const [calificacion, setCalificacion] = useState('');
    const [indiceActual, setIndiceActual] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    // Estados de datos
    const [student, setStudent] = useState(null);
    const [preguntas, setPreguntas] = useState([]);
    const [hasExistingEvaluation, setHasExistingEvaluation] = useState(false);
    const [simulatorInfo, setSimulatorInfo] = useState(null);
    
    const studentId = searchParams.get('studentId');

    useEffect(() => {
        if (simuladorId && studentId) {
            fetchSimulatorData();
        } else {
            showErrorToast({
                title: "Error",
                text: "No se especificó un ID de simulador o estudiante"
            });
            navigate('/teacher/estudiantesSeleccionados');
        }
    }, [simuladorId, studentId]);

    const fetchSimulatorData = async () => {
        try {
            setLoading(true);
            
            // Primero intentar obtener respuestas CON evaluación para verificar si ya existe una
            let simulatorData = null;
            let existingEvaluation = false;
            
            try {
                const withEvaluationResponse = await getStudentAnswersWithEvaluation(studentId, simuladorId);
                simulatorData = withEvaluationResponse.result;
                existingEvaluation = true;
            } catch (error) {
                // Si no hay evaluación, obtener sin evaluación
                const withoutEvaluationResponse = await getStudentAnswersWithoutEvaluation(studentId, simuladorId);
                simulatorData = withoutEvaluationResponse.result;
                existingEvaluation = false;
            }
            
            if (!simulatorData) {
                throw new Error('No se encontraron respuestas para este simulador');
            }
            
            // Extraer información del estudiante
            if (simulatorData.student) {
                setStudent({
                    id: simulatorData.student.user_id,
                    nombre: `${simulatorData.student.name} ${simulatorData.student.lastname}`,
                    correo: simulatorData.student.email || 'No disponible',
                    matricula: simulatorData.student.enrollment || 'No disponible'
                });
            }
            
            // La información del simulador se obtiene desde las preguntas
            // setSimulatorInfo se mantiene para compatibilidad pero ya no es necesario
            
            // Formatear preguntas y respuestas desde la nueva estructura
            const preguntasFormateadas = simulatorData.answers.map((answerItem, index) => {
                const question = answerItem.question;
                const response = answerItem.student_response;
                
                // Determinar el tipo de pregunta basado en la respuesta
                let tipo = 'open_question'; // por defecto
                if (response.type === 'texto' && question.options && question.options.length > 0) {
                    // Si tiene opciones y es texto, es multiple choice o true/false
                    tipo = question.options.length === 2 ? 'true_false' : 'multiple_choice';
                } else if (response.type === 'video') {
                    tipo = 'video_question';
                }
                
                
                return {
                    id: question.question_id,
                    texto: question.question_text,
                    tipo: tipo,
                    opciones: question.options || [],
                    respuesta: response.answer,
                    respuestaCorrecta: question.correct_answer,
                    correcta: response.is_correct,
                    videoURL: response.url_video,
                    puntos: response.is_correct ? 10 : 0 // Calcular puntos basado en corrección
                };
            });
            
            setPreguntas(preguntasFormateadas);
            
            // Si existe evaluación, cargar los datos
            if (existingEvaluation && simulatorData.mentor_evaluation) {
                setComentario(simulatorData.mentor_evaluation.comment || '');
                setCalificacion(simulatorData.mentor_evaluation.final_score?.toString() || '');
                setHasExistingEvaluation(true);
            }
            
        } catch (error) {
            console.error("❌ Error al obtener datos del simulador:", error.message);
            showErrorToast({
                title: "Error",
                text: "No se pudieron cargar las respuestas del simulador"
            });
            // Regresar a la pantalla anterior si hay error
            navigate(`/teacher/evaluarEstudiante?studentId=${studentId}`);
        } finally {
            setLoading(false);
        }
    };
    
    const handleSaveEvaluation = async () => {
        if (!comentario.trim()) {
            showErrorToast({
                title: "Error de validación",
                text: "El comentario es obligatorio"
            });
            return;
        }
        
        // Validar que el comentario contenga al menos una letra
        const tieneLetras = /[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/.test(comentario.trim());
        if (!tieneLetras) {
            showErrorToast({
                title: "Error de validación",
                text: "El comentario debe contener al menos una letra, no solo caracteres especiales o números"
            });
            return;
        }
        
        if (!calificacion || calificacion < 1 || calificacion > 10) {
            showErrorToast({
                title: "Error de validación",
                text: "La calificación debe estar entre 1 y 10"
            });
            return;
        }
        
        // Mostrar confirmación antes de proceder
        const confirmed = await new Promise((resolve) => {
            showConfirmation(
                hasExistingEvaluation ? "Actualizar evaluación" : "Guardar evaluación",
                hasExistingEvaluation 
                    ? "¿Estás seguro de que deseas actualizar esta evaluación?"
                    : "¿Estás seguro de que deseas guardar esta evaluación?",
                "warning",
                () => resolve(true),  // Si confirma
                () => resolve(false)  // Si cancela
            );
        });
        
        if (!confirmed) return;
        
        try {
            setSubmitting(true);
            
            // Obtener información del usuario logueado (mentor)
            const getUserInfo = () => {
                try {
                    const userId = localStorage.getItem('userId');
                    return userId;
                } catch (error) {
                    console.error('Error al obtener información del usuario:', error);
                    return null;
                }
            };
            
            const mentorId = getUserInfo();
            if (!mentorId) {
                throw new Error('No se pudo obtener la información del mentor');
            }
            
            let response;
            if (hasExistingEvaluation) {
                response = await updateEvaluation(
                    mentorId,
                    parseInt(studentId),
                    parseInt(simuladorId),
                    comentario.trim(),
                    parseInt(calificacion)
                );
            } else {
                response = await createEvaluation(
                    mentorId,
                    parseInt(studentId),
                    parseInt(simuladorId),
                    comentario.trim(),
                    parseInt(calificacion)
                );
            }
            
            showSuccessToast({
                title: "Evaluación guardada",
                text: hasExistingEvaluation 
                    ? "La evaluación se actualizó correctamente"
                    : "La evaluación se guardó correctamente"
            });
            
            // Actualizar estado
            setHasExistingEvaluation(true);
            
            // Navegar de regreso después de un breve delay
            setTimeout(() => {
                navigate(`/teacher/evaluarEstudiante?studentId=${studentId}`);
            }, 1500);
            
        } catch (error) {
            console.error("❌ Error al guardar evaluación:", error.message);
            showErrorToast({
                title: "Error",
                text: `No se pudo ${hasExistingEvaluation ? 'actualizar' : 'guardar'} la evaluación: ${error.message}`
            });
        } finally {
            setSubmitting(false);
        }
    };
    
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
    
    const fechaActual = new Date().toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    if (loading) {
        return <Loader isLoading={true} />;
    }
    
    if (!preguntas || preguntas.length === 0) {
        return (
            <div className="max-w-5xl mx-auto p-4">
                <div className="text-center py-12">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 max-w-md mx-auto">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            No se encontraron respuestas
                        </h2>
                        <p className="text-gray-600 text-sm mb-4">
                            Este estudiante no ha respondido este simulador aún.
                        </p>
                        <button
                            className="bg-[var(--color-lavanda-600)] text-white px-4 py-2 rounded-lg hover:bg-[var(--color-lavanda-700)] transition-colors"
                            onClick={() => navigate(`/teacher/evaluarEstudiante?studentId=${studentId}`)}
                        >
                            Regresar
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
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
                        {/* Preguntas de opción múltiple o verdadero/falso */}
                        {(pregunta.tipo === 'multiple_choice' || pregunta.tipo === 'true_false') && pregunta.opciones && pregunta.opciones.length > 0 ? (
                            <div className={`border-l-4 rounded-md p-4 ${pregunta.correcta ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}`}>
                                <p className="text-sm font-medium text-[var(--color-gris-900)] mb-2">
                                    Pregunta {indiceActual + 1}: {pregunta.texto}
                                </p>
                                <div className="mb-2">
                                    <span className={`inline-block text-xs font-semibold px-2 py-1 rounded-md ${pregunta.correcta ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'}`}>
                                        {pregunta.correcta ? '✅ Correcta' : '❌ Incorrecta'} - Puntos: {pregunta.puntos}
                                    </span>
                                </div>
                                <ul className="space-y-1">
                                    {pregunta.opciones.map((opcion, i) => {
                                        const esSeleccionada = opcion === pregunta.respuesta;
                                        const esCorrecta = opcion === pregunta.respuestaCorrecta;
                                        let color = "bg-[var(--color-blanco)] border-[var(--color-gris-400)] text-[var(--color-gris-900)]";
                                        
                                        if (esSeleccionada && esCorrecta) {
                                            color = "bg-green-100 border-green-500 text-green-700 font-semibold";
                                        } else if (esSeleccionada && !esCorrecta) {
                                            color = "bg-red-100 border-red-500 text-red-700 font-semibold";
                                        } else if (!esSeleccionada && esCorrecta) {
                                            color = "bg-blue-50 border-blue-300 text-blue-700";
                                        }
                                        
                                        return (
                                            <li
                                                key={i}
                                                className={`px-3 py-2 rounded-md border ${color} text-sm relative`}
                                            >
                                                {opcion}
                                                {esSeleccionada && <span className="ml-2 text-xs">(Tu respuesta)</span>}
                                                {!esSeleccionada && esCorrecta && <span className="ml-2 text-xs">(Respuesta correcta)</span>}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ) : (pregunta.tipo === 'open_question' || pregunta.tipo === 'video_question') ? (
                            /* Pregunta abierta */
                            <div className="border-l-4 border-[var(--color-lavanda-600)] bg-[var(--color-lavanda-100)] rounded-md p-4">
                                <p className="text-sm font-medium text-[var(--color-gris-900)] mb-2">
                                    Pregunta {indiceActual + 1}: {pregunta.texto}
                                </p>
                                <div className="mb-2">
                                    <span className="inline-block text-xs font-semibold px-2 py-1 rounded-md bg-blue-200 text-blue-900">
                                        📝 Pregunta abierta - Puntos: {pregunta.puntos}
                                    </span>
                                </div>
                                <div className="bg-white rounded-md p-3 border border-gray-300 mt-2">
                                    <p className="text-sm font-medium text-gray-700 mb-1">Respuesta del estudiante:</p>
                                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{pregunta.respuesta || 'Sin respuesta'}</p>
                                </div>
                                {pregunta.videoURL && (
                                    <div className="mt-3">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Video adjunto:</p>
                                        <video
                                            src={pregunta.videoURL}
                                            controls
                                            className="max-w-md w-full aspect-video rounded-md border border-[var(--color-gris-400)]"
                                        >
                                            Tu navegador no soporta la reproducción de video.
                                        </video>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Tipo de pregunta no reconocido */
                            <div className="border-l-4 border-gray-400 bg-gray-50 rounded-md p-4">
                                <p className="text-sm font-medium text-[var(--color-gris-900)] mb-2">
                                    Pregunta {indiceActual + 1}: {pregunta.texto}
                                </p>
                                <div className="mb-2">
                                    <span className="inline-block text-xs font-semibold px-2 py-1 rounded-md bg-gray-200 text-gray-900">
                                        Tipo: {pregunta.tipo} - Puntos: {pregunta.puntos}
                                    </span>
                                </div>
                                <div className="bg-white rounded-md p-3 border border-gray-300 mt-2">
                                    <p className="text-sm font-medium text-gray-700 mb-1">Respuesta:</p>
                                    <p className="text-sm text-gray-900">{pregunta.respuesta || 'Sin respuesta'}</p>
                                </div>
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
                        className={`px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                            submitting 
                                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                : 'bg-[var(--color-lavanda-700)] text-white hover:bg-[var(--color-lavanda-900)]'
                        }`}
                        onClick={handleSaveEvaluation}
                        disabled={submitting}
                    >
                        {submitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                {hasExistingEvaluation ? 'Actualizando...' : 'Guardando...'}
                            </>
                        ) : (
                            <>
                                {hasExistingEvaluation ? 'Actualizar Evaluación' : 'Guardar Evaluación'}
                            </>
                        )}
                    </button>
                    <button
                        className="bg-[var(--color-gris-600)] text-[var(--color-blanco)] font-semibold px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-[var(--color-gris-700)] transition-colors"
                        onClick={() => navigate(`/teacher/evaluarEstudiante?studentId=${studentId}`)}
                        disabled={submitting}
                    >
                        <FaReply /> Regresar
                    </button>
                </div>
                
                {/* Indicador de evaluación existente */}
                {hasExistingEvaluation && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                            ℹ️ <strong>Esta evaluación ya existe.</strong> Puedes modificar el comentario y la calificación, luego hacer clic en "Actualizar Evaluación".
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EvaluarSimulador;