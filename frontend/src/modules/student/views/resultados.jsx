import React, { useState, useEffect } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { useNavigate } from "react-router-dom";
import { getStudentCategoriesAndSimulators } from "../adapters/student.controller";
import { showErrorToast, showInfoToast } from "../../../kernel/alerts";
import Loader from "../../../components/Loader";

const ResultadosEstudiante = () => {
    const navigate = useNavigate();
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);

    // Obtener el ID del estudiante desde localStorage
    const getCurrentStudentId = () => {
        // El ID del estudiante se guarda directamente en localStorage con la clave 'userId'
        const userId = localStorage.getItem('userId');
        return userId;
    };

    useEffect(() => {
        fetchStudentResults();
    }, []);

    const fetchStudentResults = async () => {
        try {
            setLoading(true);
            const studentId = getCurrentStudentId();
            
            if (!studentId) {
                showErrorToast({
                    title: "Error",
                    text: "No se pudo identificar al estudiante. Por favor, inicia sesión nuevamente."
                });
                return;
            }

            const response = await getStudentCategoriesAndSimulators(studentId);
            
            if (response.type === 'SUCCESS' && response.result) {
                const simuladoresData = response.result;
                
                // Formatear los datos para el componente
                const categoriasFormateadas = simuladoresData.map(categoria => ({
                    id: categoria.category_id,
                    nombre: categoria.category_name,
                    descripcion: categoria.category_description || `Categoría ${categoria.category_name}`,
                    simuladores: categoria.simulators.map(sim => ({
                        id: sim.simulator_id,
                        titulo: sim.simulator_name,
                        fecha: new Date(sim.date_realized).toLocaleDateString('es-ES'),
                        calificacion: sim.automatic_score || 0,
                        calificacionFinal: sim.mentor_evaluation?.final_score || null,
                        comentario: sim.mentor_evaluation?.comment || null,
                        fechaEvaluacion: sim.mentor_evaluation?.date_evaluation || null
                    }))
                }));
                
                setCategorias(categoriasFormateadas);
                
                if (categoriasFormateadas.length === 0) {
                    showInfoToast({
                        title: "Sin resultados",
                        text: "Aún no has completado ningún simulador."
                    });
                }
            } else {
                throw new Error(response.text || 'Error al obtener los resultados');
            }
            
        } catch (error) {
            console.error("❌ Error al obtener resultados:", error.message);
            showErrorToast({
                title: "Error",
                text: "No se pudieron cargar tus resultados. Inténtalo nuevamente."
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader isLoading={true} />;
    }

    // Validación si no hay categorías con simuladores
    if (!loading && categorias.length === 0) {
        return (
            <div className="p-4 space-y-6">
                <div className="flex justify-between items-center mb-4 pb-2">
                    <h1 className="text-2xl font-bold text-[var(--color-lavanda-700)]">Mis categorias y simuladores respondidos</h1>
                </div>
                
                <div className="text-center py-12">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 max-w-md mx-auto">
                        <div className="flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mx-auto mb-4">
                            <IoIosArrowDown className="text-yellow-600 text-2xl" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            No hay simuladores completados
                        </h2>
                        <p className="text-gray-600 text-sm">
                            Aún no has completado ningún simulador. Una vez que completes algunos simuladores,
                            podrás ver tus resultados y comentarios aquí.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-6">

            <div className="flex justify-between items-center mb-4 pb-2 ">
                <h1 className="text-2xl font-bold text-[var(--color-lavanda-700)]">Mis categorias y simuladores respondidos</h1>
            </div>

            {categorias.map((cat) => (
                <div key={cat.id} className="bg-[var(--color-lavanda-100)] border border-[var(--color-lavanda-300)] rounded-xl shadow-md">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-3 cursor-pointer relative" onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}>
                        <div>
                            <p className="font-semibold text-[var(--color-lavanda-800)]">Categoria: {cat.nombre}</p>
                            <p className="text-sm text-[var(--color-gris-800)]">Descripción: {cat.descripcion}</p>
                            <p className="text-sm mt-2 text-[var(--color-gris-900)]">Simuladores respondidos: {cat.simuladores.length}</p>
                        </div>
                        <div className="ml-auto flex items-center text-xs text-[var(--color-lavanda-700)] hover:underline mt-4 sm:mt-0 pt-11">
                            <span className="mr-1">Ver simuladores respondidos</span>
                            {expandedCategory === cat.id ? <IoIosArrowUp /> : <IoIosArrowDown />}
                        </div>
                    </div>

                    {expandedCategory === cat.id && (
                        <div className="border-t border-[var(--color-gris-400)] divide-y divide-[var(--color-gris-100)] bg-[var(--color-verde-claro)] mt-3">
                            {cat.simuladores.map((sim) => (
                                <div key={sim.id}
                                    className={`flex items-center justify-between px-4 py-3 rounded-md
                                    ${sim.calificacionFinal
                                            ? sim.calificacionFinal >= 8
                                                ? 'bg-green-100'
                                                : 'bg-red-100'
                                            : 'bg-[var(--color-nude-100)]'
                                        }`}
                                >
                                    <div>
                                        <p className="font-medium text-[var(--color-gris-900)]">Simulador: {sim.titulo}</p>
                                        <p className="text-sm text-[var(--color-gris-700)]">{sim.fecha}</p>
                                        <p className="text-sm mt-2 font-semibold text-[var(--color-lavanda-800)]">
                                            Calificación Automática: {sim.calificacion}/10
                                        </p>
                                        <div className="mt-2">
                                            {sim.calificacionFinal ? (
                                                <span
                                                    className={`text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm
                                                            ${sim.calificacionFinal >= 8
                                                            ? 'bg-green-200 text-green-900 border border-green-300'
                                                            : 'bg-red-200 text-red-900 border border-red-300'
                                                        }`}
                                                >
                                                    {sim.calificacionFinal >= 8 ? '' : ''} Evaluado por el docente: {sim.calificacionFinal}/10
                                                </span>
                                            ) : (
                                                <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm border border-yellow-400">
                                                    Pendiente de evaluación
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button className="bg-[var(--color-lavanda-600)] hover:bg-[var(--color-lavanda-800)] text-white text-sm font-semibold px-4 py-2 rounded-xl"
                                        onClick={() => navigate(`/student/comentariosObtenidos/${sim.id}`)}>
                                        Ver comentarios
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ResultadosEstudiante;