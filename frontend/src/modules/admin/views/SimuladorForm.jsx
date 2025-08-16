import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaTrash, FaPlus, FaTimes } from "react-icons/fa";
import {
    getQuestionsWithAnswersBySimulator,
    createMultipleQuestions,
    updateMultipleQuestions
} from "../adapters/questions.controller";
import {
    validateQuestionText,
    validateAnswerOption,
    validateQuestionComplete,
    validateAllQuestions
} from "../../../kernel/validations";
import { showSuccessToast, showErrorToast, showConfirmation } from "../../../kernel/alerts";
import Loader from "../../../components/Loader";

const SimuladorFormAdmin = () => {
    const { simuladorId } = useParams();
    const [preguntas, setPreguntas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [simulatorInfo, setSimulatorInfo] = useState(null);
    const [hasExistingQuestions, setHasExistingQuestions] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchQuestions();
    }, [simuladorId]);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            
            if (!simuladorId || simuladorId === 'undefined') {
                console.error('simuladorId es undefined o inválido');
                showErrorToast({
                    title: "Error",
                    text: "ID de simulador inválido"
                });
                return;
            }
            
            const response = await getQuestionsWithAnswersBySimulator(simuladorId);
            
            if (response.result) {
                const { simulator, questions } = response.result;
                setSimulatorInfo(simulator);
                setHasExistingQuestions(true);
                
                const preguntasMapeadas = questions.map((q, index) => ({
                    id: q.question_id || Date.now() + index,
                    texto: q.question,
                    respuestas: q.options,
                    correcta: q.options.findIndex(option => option === q.correct_answer)
                }));
                
                setPreguntas(preguntasMapeadas);
            }
        } catch (error) {
            console.error("Error al obtener preguntas:", error);
            console.error("Simulador ID:", simuladorId);
            
            // Si es cualquier error relacionado con "no encontrar preguntas", 
            // simplemente asumimos que no hay preguntas (caso normal)
            if (error.message && (error.message.includes('No se encontraron preguntas') || 
                                 error.message.includes('no encontrada') || 
                                 error.message.includes('404'))) {
                // El simulador existe pero no tiene preguntas - esto es normal
                setHasExistingQuestions(false);
                setPreguntas([]);
            } else {
                // Solo mostrar errores realmente problemáticos
                showErrorToast({
                    title: "Error",
                    text: error.message || "No se pudieron cargar las preguntas"
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAgregarPregunta = () => {
        if (preguntas.length >= 10) {
            showErrorToast({
                title: "Límite alcanzado",
                text: "No puedes agregar más de 10 preguntas."
            });
            return;
        }
        
        const nuevaPregunta = { 
            id: Date.now(), 
            texto: "", 
            respuestas: ["", ""], 
            correcta: 0 
        };
        
        setPreguntas([...preguntas, nuevaPregunta]);
    };

    const handleEliminarPregunta = (id) => {
        showConfirmation(
            "Confirmar eliminación",
            "¿Estás seguro de que deseas eliminar esta pregunta?",
            "warning",
            () => {
                setPreguntas(preguntas.filter((preg) => preg.id !== id));
                // Limpiar errores de esta pregunta
                const newErrors = { ...errors };
                Object.keys(newErrors).forEach(key => {
                    if (key.includes(`pregunta_${preguntas.findIndex(p => p.id === id)}`)) {
                        delete newErrors[key];
                    }
                });
                setErrors(newErrors);
            }
        );
    };

    const handleTextoPregunta = (id, nuevoTexto) => {
        setPreguntas(
            preguntas.map((preg) =>
                preg.id === id ? { ...preg, texto: nuevoTexto } : preg
            )
        );
        
        // Limpiar error cuando el usuario empiece a escribir
        const preguntaIndex = preguntas.findIndex(p => p.id === id);
        if (errors[`pregunta_${preguntaIndex}`]?.texto) {
            const newErrors = { ...errors };
            delete newErrors[`pregunta_${preguntaIndex}`].texto;
            if (Object.keys(newErrors[`pregunta_${preguntaIndex}`]).length === 0) {
                delete newErrors[`pregunta_${preguntaIndex}`];
            }
            setErrors(newErrors);
        }
    };

    const handleAgregarRespuesta = (pregId) => {
        const pregunta = preguntas.find(p => p.id === pregId);
        if (pregunta.respuestas.length >= 4) {
            showErrorToast({
                title: "Límite alcanzado",
                text: "No puedes agregar más de 4 opciones de respuesta."
            });
            return;
        }
        
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
        const pregunta = preguntas.find(p => p.id === pregId);
        if (pregunta.respuestas.length <= 2) {
            showErrorToast({
                title: "Mínimo requerido",
                text: "Debe tener al menos 2 opciones de respuesta."
            });
            return;
        }
        
        setPreguntas(
            preguntas.map((preg) => {
                if (preg.id !== pregId) return preg;
                const nuevasResp = preg.respuestas.filter((_, i) => i !== indexResp);
                // Ajustar la respuesta correcta si es necesario
                let nuevaCorrecta = preg.correcta;
                if (indexResp === preg.correcta) {
                    nuevaCorrecta = 0; // Seleccionar la primera por defecto
                } else if (indexResp < preg.correcta) {
                    nuevaCorrecta = preg.correcta - 1;
                }
                return { ...preg, respuestas: nuevasResp, correcta: nuevaCorrecta };
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

    const validateForm = () => {
        const validationErrors = validateAllQuestions(preguntas);
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleGuardar = async () => {
        if (!validateForm()) {
            showErrorToast({
                title: "Errores en el formulario",
                text: "Por favor, corrige los errores antes de guardar."
            });
            return;
        }
        
        const accion = hasExistingQuestions ? "actualizar" : "crear";
        const mensaje = hasExistingQuestions 
            ? "¿Estás seguro de que deseas actualizar las preguntas? Esto reemplazará todas las preguntas existentes."
            : "¿Estás seguro de que deseas guardar estas preguntas?";
            
        showConfirmation(
            `Confirmar ${accion}`,
            mensaje,
            "question",
            async () => {
                try {
                    setSubmitting(true);
                    
                    // Convertir preguntas al formato del backend
                    const questionsForBackend = preguntas.map(pregunta => ({
                        question: pregunta.texto.trim(),
                        options: pregunta.respuestas.map(resp => resp.trim()),
                        correct_answer: pregunta.respuestas[pregunta.correcta].trim()
                    }));
                    
                    if (hasExistingQuestions) {
                        await updateMultipleQuestions(parseInt(simuladorId), questionsForBackend);
                        showSuccessToast({
                            title: "Preguntas actualizadas exitosamente"
                        });
                    } else {
                        await createMultipleQuestions(parseInt(simuladorId), questionsForBackend);
                        showSuccessToast({
                            title: "Preguntas creadas exitosamente"
                        });
                        setHasExistingQuestions(true);
                    }
                    
                    // Recargar las preguntas para obtener los IDs del servidor
                    await fetchQuestions();
                    
                } catch (error) {
                    console.error('Error al guardar preguntas:', error);
                    showErrorToast({
                        title: "Error",
                        text: error.message || "No se pudieron guardar las preguntas"
                    });
                } finally {
                    setSubmitting(false);
                }
            }
        );
    };
    
    if (loading) {
        return <Loader isLoading={true} />;
    }

    return (
        <div className="p-4 space-y-6 max-w-5xl mx-auto">
            <div className="bg-white p-4 rounded-lg shadow-md space-y-4 border border-[var(--color-gris-300)]">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--color-lavanda-700)]">Preguntas del Simulador</h1>
                        {simulatorInfo && (
                            <p className="text-sm text-gray-600 mt-1">
                                Simulador: {simulatorInfo.name}
                            </p>
                        )}
                    </div>
                    <div className="flex gap-4">
                        <Link to={`/admin/categorias`} className="px-4 py-2 rounded-md bg-[var(--color-gris-700)] text-white hover:bg-[var(--color-gris-800)] transition">
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

                {/* Errores generales */}
                {errors.general && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-red-700 text-sm">{errors.general}</p>
                    </div>
                )}

                {/* Barra de progreso */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[var(--color-lavanda-600)] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(preguntas.length / 10) * 100}%` }}
                    ></div>
                </div>
                <p className="text-sm text-right text-[var(--color-gris-900)]">{preguntas.length}/10</p>
            </div>

            {/* Mensaje cuando no hay preguntas */}
            {preguntas.length === 0 ? (
                <div className="text-center py-12">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-blue-800 mb-2">
                            No hay preguntas configuradas
                        </h3>
                        <p className="text-blue-700 mb-4">
                            Este simulador aún no tiene preguntas. Puedes agregar preguntas usando el botón "Agregar pregunta".
                        </p>
                        <button
                            onClick={handleAgregarPregunta}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        >
                            <FaPlus />
                            Crear primera pregunta
                        </button>
                    </div>
                </div>
            ) : (
                /* Preguntas */
                <div className="space-y-5 max-h-[500px] overflow-y-auto pr-2">
                    {preguntas.map((preg, index) => {
                        const preguntaErrors = errors[`pregunta_${index}`] || {};
                        const hasErrors = Object.keys(preguntaErrors).length > 0;
                        
                        return (
                            <div
                                key={preg.id}
                                className={`bg-white border border-2 rounded-lg shadow p-5 space-y-4 ${
                                    hasErrors 
                                        ? "border-red-300 bg-red-50" 
                                        : "border-[var(--color-lavanda-400)]"
                                }`}
                            >
                                <div className="flex justify-between items-center">
                                    <h2 className="font-semibold text-[var(--color-lavanda-800)]">
                                        Pregunta {index + 1}
                                        {hasErrors && <span className="text-red-500 ml-2 text-sm">(Errores)</span>}
                                    </h2>
                                    <button
                                        onClick={() => handleEliminarPregunta(preg.id)}
                                        className="text-red-500 hover:text-red-700"
                                        disabled={submitting}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>

                                <div>
                                    <input
                                        type="text"
                                        className={`w-full text-[var(--color-gris-900)] border rounded px-4 py-2 focus:outline-none focus:ring-2 transition ${
                                            preguntaErrors.texto
                                                ? "border-red-300 focus:ring-red-200 focus:border-red-500"
                                                : "border-[var(--color-lavanda-400)] focus:ring-[var(--color-lavanda-400)]"
                                        }`}
                                        value={preg.texto}
                                        onChange={(e) => handleTextoPregunta(preg.id, e.target.value)}
                                        placeholder="Escribe la pregunta aquí"
                                        disabled={submitting}
                                    />
                                    {preguntaErrors.texto && (
                                        <p className="text-red-500 text-xs mt-1 flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            {preguntaErrors.texto}
                                        </p>
                                    )}
                                </div>

                                {/* Respuestas */}
                                <div className="space-y-3">
                                    {preguntaErrors.respuestas && (
                                        <p className="text-red-500 text-xs">{preguntaErrors.respuestas}</p>
                                    )}
                                    {preg.respuestas.map((resp, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name={`correcta-${preg.id}`}
                                                checked={preg.correcta === idx}
                                                onChange={() => handleSeleccionarCorrecta(preg.id, idx)}
                                                className="w-5 h-5 accent-green-600"
                                                disabled={submitting}
                                            />

                                            <input
                                                type="text"
                                                className={`flex-grow text-[var(--color-gris-900)] border rounded px-4 py-2 focus:outline-none focus:ring-2 transition ${
                                                    preguntaErrors[`respuesta_${idx}`]
                                                        ? "border-red-300 focus:ring-red-200 focus:border-red-500"
                                                        : "border-[var(--color-lavanda-400)] focus:ring-[var(--color-lavanda-400)]"
                                                }`}
                                                value={resp}
                                                onChange={(e) =>
                                                    handleEditarRespuesta(preg.id, idx, e.target.value)
                                                }
                                                placeholder={`Respuesta ${idx + 1}`}
                                                disabled={submitting}
                                            />
                                            <button
                                                onClick={() => handleEliminarRespuesta(preg.id, idx)}
                                                className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                                                disabled={submitting || preg.respuestas.length <= 2}
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                    ))}

                                    {preg.respuestas.length < 4 && (
                                        <button 
                                            onClick={() => handleAgregarRespuesta(preg.id)}
                                            className="text-sm text-purple-700 hover:text-purple-900 flex items-center gap-1 disabled:opacity-50"
                                            disabled={submitting}
                                        >
                                            <FaPlus /> Agregar opción
                                        </button>
                                    )}

                                    {preguntaErrors.correcta && (
                                        <p className="text-red-500 text-xs">{preguntaErrors.correcta}</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Guardar simulador */}
            {preguntas.length > 0 && (
                <div className="flex justify-end gap-4 pt-4">
                    <button 
                        onClick={handleGuardar}
                        disabled={submitting}
                        className="px-6 py-2.5 bg-gradient-to-r from-[var(--color-lavanda-700)] to-[var(--color-lavanda-600)] text-white rounded-lg hover:from-[var(--color-lavanda-800)] hover:to-[var(--color-lavanda-700)] transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center space-x-2"
                    >
                        {submitting ? (
                            <>
                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>{hasExistingQuestions ? 'Actualizando...' : 'Guardando...'}</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>{hasExistingQuestions ? 'Actualizar Preguntas' : 'Guardar Preguntas'}</span>
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default SimuladorFormAdmin;
