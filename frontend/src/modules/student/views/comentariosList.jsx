import React, { useState, useEffect } from "react";
import { FaUser, FaReply } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getStudentAnswersAndComments, getStudentAnswersWithoutComments } from "../adapters/student.controller";
import { showErrorToast } from "../../../kernel/alerts";
import Loader from "../../../components/Loader";

const ComentariosEstudiante = () => {
    const navigate = useNavigate();
    const { simuladorId } = useParams();
    const [loading, setLoading] = useState(true);
    const [preguntas, setPreguntas] = useState([]);
    const [comentarios, setComentarios] = useState([]);
    const [student, setStudent] = useState(null);

    // Obtener el ID del estudiante desde localStorage
    const getCurrentStudentId = () => {
        // El ID del estudiante se guarda directamente en localStorage con la clave 'userId'
        const userId = localStorage.getItem('userId');
        return userId;
    };

    useEffect(() => {
        if (simuladorId) {
            fetchAnswersAndComments();
        } else {
            showErrorToast({
                title: "Error",
                text: "No se especificó un ID de simulador"
            });
            navigate('/student/resultadosObtenidos');
        }
    }, [simuladorId]);

    const fetchAnswersAndComments = async () => {
        try {
            setLoading(true);
            const studentId = getCurrentStudentId();
            
            if (!studentId) {
                showErrorToast({
                    title: "Error",
                    text: "No se pudo identificar al estudiante. Por favor, inicia sesión nuevamente."
                });
                navigate('/student/resultadosObtenidos');
                return;
            }

            console.log('📝 Obteniendo respuestas y comentarios para simulador:', simuladorId, 'estudiante:', studentId);
            
            // Primero intentamos obtener las respuestas con evaluación
            let response;
            let hasEvaluation = true;
            try {
                console.log('📝 Intentando obtener respuestas CON evaluación...');
                response = await getStudentAnswersAndComments(simuladorId, studentId);
                console.log('📝 ✅ Respuestas con evaluación obtenidas exitosamente');
            } catch (error) {
                console.log('📝 ⚠️ No se pudieron obtener respuestas con evaluación:', error.message);
                hasEvaluation = false;
                try {
                    console.log('📝 Intentando obtener respuestas SIN evaluación...');
                    // Si falla, intentamos sin evaluación
                    response = await getStudentAnswersWithoutComments(simuladorId, studentId);
                    console.log('📝 ✅ Respuestas sin evaluación obtenidas exitosamente');
                } catch (secondError) {
                    console.log('📝 ❌ Tampoco se pudieron obtener respuestas sin evaluación:', secondError.message);
                    throw new Error('No se encontraron respuestas para este simulador');
                }
            }
            
            console.log('📝 Respuesta obtenida:', response);
            console.log('📝 Tipo de respuesta:', response?.type);
            console.log('📝 Resultado presente:', !!response?.result);
            
            if (response.type === 'SUCCESS' && response.result) {
                const data = response.result;
                
                // Configurar información del estudiante
                if (data.student) {
                    setStudent({
                        nombre: `${data.student.name} ${data.student.lastname}`,
                        correo: data.student.email,
                        matricula: data.student.enrollment
                    });
                }
                
                // Configurar preguntas y respuestas
                let preguntasFormateadas = [];
                if (data.answers && data.answers.length > 0) {
                    preguntasFormateadas = data.answers.map((answerItem, index) => {
                        const question = answerItem.question;
                        const response = answerItem.student_response;
                        
                        if (response.type === 'texto') {
                            return {
                                texto: question.question_text,
                                tipo: 'texto',
                                opciones: question.options || [],
                                respuesta: response.answer,
                                correcta: response.is_correct || false
                            };
                        } else {
                            return {
                                texto: question.question_text,
                                tipo: 'video',
                                videoURL: response.url_video || null,
                                respuestaTexto: response.answer
                            };
                        }
                    });
                    setPreguntas(preguntasFormateadas);
                    console.log('📝 Preguntas formateadas:', preguntasFormateadas);
                } else {
                    console.log('📝 No hay respuestas disponibles en los datos');
                }
                
                // Configurar comentarios de evaluación (puede estar vacío)
                if (data.mentor_evaluation && data.mentor_evaluation.comment) {
                    const mentorName = data.mentor_evaluation.mentor ? 
                        `${data.mentor_evaluation.mentor.name} ${data.mentor_evaluation.mentor.lastname}` : 'Docente';
                    
                    const comentariosFormateados = [{
                        docente: mentorName,
                        fecha: data.mentor_evaluation.date_evaluation ? 
                            new Date(data.mentor_evaluation.date_evaluation).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            }) : null,
                        texto: data.mentor_evaluation.comment,
                        calificacionFinal: data.mentor_evaluation.final_score
                    }];
                    setComentarios(comentariosFormateados);
                    console.log('📝 Comentarios encontrados:', comentariosFormateados);
                } else {
                    console.log('📝 No hay evaluación del mentor');
                    setComentarios([]);
                }
                
                console.log('📝 Datos cargados:', {
                    student: data.student,
                    preguntasCount: preguntasFormateadas?.length || 0,
                    tieneEvaluacion: !!data.mentor_evaluation
                });
                
            } else {
                throw new Error(response.text || 'Error al obtener las respuestas y comentarios');
            }
            
        } catch (error) {
            console.error("❌ Error al obtener respuestas y comentarios:", error.message);
            showErrorToast({
                title: "Error",
                text: "No se pudieron cargar las respuestas y comentarios. Inténtalo nuevamente."
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader isLoading={true} />;
    }

    return (
        <div className="max-w-6xl mx-auto p-4">
            {student && (
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
            )}


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Respuestas */}
                <div className="bg-white border border-[var(--color-gris-300)] rounded-xl shadow-md max-h-[565px] overflow-y-auto">
                    <div className="p-5 sticky top-0 bg-white z-10 border-b border-[var(--color-gris-200)]">
                        <h3 className="text-xl font-semibold text-[var(--color-gris-900)]">Respuestas del Simulador</h3>
                    </div>
                    <div className="p-5 pt-4 space-y-4">
                        {preguntas.length > 0 ? (
                            preguntas.map((pregunta, index) => (
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
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 max-w-sm mx-auto">
                                    <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mx-auto mb-3">
                                        <FaUser className="text-gray-600 text-lg" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        No hay respuestas
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        No se encontraron respuestas para este simulador.
                                        Es posible que haya ocurrido un error al cargar los datos.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Comentarios */}
                <div className="bg-white border border-[var(--color-gris-300)] rounded-xl shadow-md max-h-[565px] overflow-y-auto">
                    <div className="p-5 sticky top-0 bg-white z-10 border-b border-[var(--color-gris-200)]">
                        <h3 className="text-xl font-semibold text-[var(--color-gris-900)]">Comentarios de Docentes</h3>
                    </div>
                    <div className="p-5 pt-4 space-y-4">
                        {comentarios.length > 0 ? (
                            comentarios.map((comentario, index) => (
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
                                                {comentario.calificacionFinal >= 8 ? '✅' : '❌'} Calificación Final: {comentario.calificacionFinal}/10
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 max-w-sm mx-auto">
                                    <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-3">
                                        <FaUser className="text-yellow-600 text-lg" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Sin evaluación docente
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        Todavía no has sido evaluado por un docente.
                                        Una vez que revisen tu simulador, podrás ver los comentarios y calificación aquí.
                                    </p>
                                </div>
                            </div>
                        )}
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
