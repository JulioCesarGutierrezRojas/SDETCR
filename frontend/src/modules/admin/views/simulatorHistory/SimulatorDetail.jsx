import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaUser, FaReply } from "react-icons/fa";
import { getStudentAnswersWithEvaluation, getStudentAnswersWithoutEvaluation } from "../../adapters/admin.controller";
import { showErrorToast } from "../../../../kernel/alerts";
import Loader from "../../../../components/Loader";

export const SimulatorDetail = () => {
  const { estudianteID, simuladorID } = useParams();
  const navigate = useNavigate();
  
  // Estados del componente
  const [loading, setLoading] = useState(true);
  const [estudiante, setEstudiante] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [comentarioDocente, setComentarioDocente] = useState(null);
  const [simulatorInfo, setSimulatorInfo] = useState(null);
  
  useEffect(() => {
    if (estudianteID && simuladorID) {
      fetchSimulatorDetail();
    } else {
      showErrorToast({
        title: "Error",
        text: "No se especificaron los parámetros necesarios"
      });
      navigate(-1);
    }
  }, [estudianteID, simuladorID]);
  
  const fetchSimulatorDetail = async () => {
    try {
      setLoading(true);
      
      // Primero intentar obtener respuestas CON evaluación
      let simulatorData = null;
      let existingEvaluation = false;
      
      try {
        const withEvaluationResponse = await getStudentAnswersWithEvaluation(estudianteID, simuladorID);
        simulatorData = withEvaluationResponse.result;
        existingEvaluation = true;
      } catch (error) {
        try {
          // Si falla, intentamos sin evaluación
          const withoutEvaluationResponse = await getStudentAnswersWithoutEvaluation(estudianteID, simuladorID);
          simulatorData = withoutEvaluationResponse.result;
          existingEvaluation = false;
        } catch (secondError) {
          throw new Error('No se encontraron respuestas para este simulador');
        }
      }
      
      if (!simulatorData) {
        throw new Error('No se encontraron respuestas para este simulador');
      }
      
      // Extraer información del estudiante desde la nueva estructura
      if (simulatorData.student) {
        setEstudiante({
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
      
      // Extraer comentario del docente si existe
      if (existingEvaluation && simulatorData.mentor_evaluation) {
        const mentorName = simulatorData.mentor_evaluation.mentor ? 
          `${simulatorData.mentor_evaluation.mentor.name} ${simulatorData.mentor_evaluation.mentor.lastname}` : 'Mentor';
        
        setComentarioDocente({
          nombre: mentorName,
          fecha: simulatorData.mentor_evaluation.date_evaluation ? 
            new Date(simulatorData.mentor_evaluation.date_evaluation).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : 'Fecha no disponible',
          comentario: simulatorData.mentor_evaluation.comment,
          calificacion: simulatorData.mentor_evaluation.final_score
        });
      } else {
        setComentarioDocente(null);
      }
      
    } catch (error) {
      console.error("❌ Error al obtener detalle del simulador:", error.message);
      showErrorToast({
        title: "Error",
        text: "No se pudo cargar el detalle del simulador"
      });
      
      // Datos por defecto en caso de error
      setEstudiante({
        nombre: 'Estudiante no encontrado',
        correo: 'No disponible',
        matricula: 'No disponible'
      });
      setPreguntas([]);
      setComentarioDocente(null);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <Loader isLoading={true} />;
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* 📝 Título */}
      <h1 className="text-2xl font-bold text-[var(--color-lavanda-700)] pb-5">
        Detalle del Simulador #{simuladorID}
      </h1>

      {/* 🧑‍🎓 Datos del estudiante */}
      <div className="flex bg-white shadow-md rounded-xl border border-[var(--color-gris-200)] overflow-hidden mb-6">
        <div className="w-[7px] bg-[var(--color-lavanda-600)]" />
        <div className="flex items-center space-x-4 p-3">
          <div className="bg-[var(--color-lavanda-200)] p-3 rounded-full">
            <FaUser className="text-[var(--color-lavanda-700)] text-xl" />
          </div>
          <div>
            <p className="font-semibold text-[var(--color-gris-900)]">{estudiante.nombre}</p>
            <p className="text-sm text-[var(--color-gris-700)]">Correo: {estudiante.correo}</p>
            <p className="text-sm text-[var(--color-gris-700)]">Matrícula: {estudiante.matricula}</p>
          </div>
        </div>
      </div>

      {/* 📋 Respuestas del simulador */}
      <div className="bg-white border border-[var(--color-gris-300)] rounded-xl shadow-md p-5 mb-6">
        <h3 className="text-xl font-semibold text-[var(--color-gris-900)] mb-4">
          Respuestas del simulador
        </h3>

        {preguntas && preguntas.length > 0 ? (
          <div className="space-y-5 max-h-60 overflow-y-auto pr-2">
            {preguntas.map((pregunta, index) => (
              <div key={pregunta.id || index} className="border border-[var(--color-gris-500)] rounded-md">
                {/* Preguntas de opción múltiple o verdadero/falso */}
                {(pregunta.tipo === 'multiple_choice' || pregunta.tipo === 'true_false') && pregunta.opciones && pregunta.opciones.length > 0 ? (
                  <div className={`border-l-4 rounded-md p-4 ${pregunta.correcta ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}`}>
                    <p className="text-sm font-medium text-[var(--color-gris-900)] mb-2">
                      Pregunta {index + 1}: {pregunta.texto}
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
                            {esSeleccionada && <span className="ml-2 text-xs">(Respuesta del estudiante)</span>}
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
                      Pregunta {index + 1}: {pregunta.texto}
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
                  /* Tipo de pregunta no reconocido o pregunta tipo "texto" legacy */
                  <div className="border-l-4 border-gray-400 bg-gray-50 rounded-md p-4">
                    <p className="text-sm font-medium text-[var(--color-gris-900)] mb-2">
                      Pregunta {index + 1}: {pregunta.texto}
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
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 text-sm">No se encontraron preguntas para este simulador.</p>
          </div>
        )}
      </div>

      {/* 🧑‍🏫 Comentario del docente */}
      <div className="bg-white border border-[var(--color-lavanda-400)] rounded-xl shadow-md p-5 mb-6">
        <h3 className="text-xl font-semibold text-[var(--color-gris-900)] mb-2">Comentario del Docente</h3>
        
        {comentarioDocente ? (
          <div>
            <p className="text-sm text-[var(--color-gris-700)] mb-1">
              <strong>Docente:</strong> {comentarioDocente.nombre}
            </p>
            <p className="text-sm text-[var(--color-gris-700)] mb-1">
              <strong>Fecha:</strong> {comentarioDocente.fecha}
            </p>
            <p className="text-sm text-[var(--color-gris-800)] mb-2">
              <strong>Comentario:</strong> {comentarioDocente.comentario}
            </p>
            <p className="text-sm text-[var(--color-gris-800)]">
              <strong>Calificación final:</strong> <span className="font-bold">{comentarioDocente.calificacion}/10</span>
            </p>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-3">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-yellow-800 mb-2">
                Sin evaluación del docente
              </h4>
              <p className="text-yellow-700 text-sm">
                Este simulador aún no ha sido evaluado por un docente. La calificación automática está disponible, pero falta la retroalimentación personalizada.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 🔙 Botón regresar */}
      <div className="flex justify-end mt-4">
        <button
          className="bg-[var(--color-gris-600)] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[var(--color-gris-700)]"
          onClick={() => navigate(-1)}
        >
          <FaReply /> Regresar
        </button>
      </div>
    </div>
  );
};

export default SimulatorDetail;
