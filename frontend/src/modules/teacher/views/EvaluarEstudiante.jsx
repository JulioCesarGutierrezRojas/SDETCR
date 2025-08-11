import React, { useState, useEffect } from 'react';
import { FaUser, FaReply } from 'react-icons/fa';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { useNavigate, useSearchParams } from "react-router-dom";
import { getStudentCategoriesAndSimulators, getStudentCategories } from "../adapters/teacher.controller";
import { showErrorToast } from "../../../kernel/alerts";
import Loader from "../../../components/Loader";

const EvaluarEstudiante = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [student, setStudent] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const studentId = searchParams.get('studentId');

    useEffect(() => {
        if (studentId) {
            fetchStudentData();
        } else {
            showErrorToast({
                title: "Error",
                text: "No se especificó un ID de estudiante"
            });
            navigate('/teacher/estudiantesSeleccionados');
        }
    }, [studentId]);

    const fetchStudentData = async () => {
        try {
            setLoading(true);
            console.log('📊 Obteniendo datos del estudiante ID:', studentId);
            
            // Obtener las categorías e información del estudiante en una sola llamada
            const categoriesResponse = await getStudentCategories(studentId);
            console.log('📊 Respuesta de categorías elegidas:', categoriesResponse);
            
            const categoryData = categoriesResponse.result;
            const studentInfo = categoryData.student;
            const studentCategories = categoryData.categories || [];
            
            // Establecer información completa del estudiante
            setStudent({
                id: studentId,
                nombre: `${studentInfo.name} ${studentInfo.lastname}`,
                correo: studentInfo.email,
                matricula: studentInfo.enrollment
            });
            
            console.log('📊 Información del estudiante:', studentInfo);
            
            // Ahora obtener los simuladores realizados (si los hay)
            let simuladoresData = [];
            try {
                const simuladoresResponse = await getStudentCategoriesAndSimulators(studentId);
                simuladoresData = simuladoresResponse.result || [];
                console.log('📊 Simuladores realizados:', simuladoresData);
            } catch (simuladorError) {
                console.log('📊 El estudiante no ha realizado simuladores aún');
                // No es un error, simplemente no tiene simuladores
            }
            
            // Crear mapa de simuladores por categoría
            const simuladoresPorCategoria = {};
            simuladoresData.forEach(categoria => {
                simuladoresPorCategoria[categoria.category_id] = categoria.simulators.map(sim => ({
                    id: sim.simulator_id,
                    titulo: sim.simulator_name,
                    fecha: new Date(sim.date_realized).toLocaleDateString('es-ES'),
                    calificacion: sim.automatic_score || 0,
                    calificacionFinal: sim.mentor_evaluation?.final_score || null,
                    comentario: sim.mentor_evaluation?.comment || null,
                    fechaEvaluacion: sim.mentor_evaluation?.date_evaluation || null
                }));
            });
            
            // Combinar categorías elegidas con simuladores realizados
            const categoriasFormateadas = studentCategories.map(categoria => ({
                id: categoria.category_id,
                nombre: categoria.category_name,
                descripcion: categoria.category_description || `Categoría ${categoria.category_name}`,
                simuladores: simuladoresPorCategoria[categoria.category_id] || [] // Array vacío si no hay simuladores
            }));
            
            setCategorias(categoriasFormateadas);
            console.log('📊 Categorías finales:', categoriasFormateadas);
            
        } catch (error) {
            console.error("❌ Error al obtener datos del estudiante:", error.message);
            showErrorToast({
                title: "Error",
                text: "No se pudieron cargar los datos del estudiante"
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader isLoading={true} />;
    }

    // Validación si el estudiante no tiene categorías asignadas (caso muy raro)
    if (!loading && (!categorias || categorias.length === 0)) {
        return (
            <div className="p-4 space-y-6">
                <div className="flex justify-between items-center mb-4 pb-2 pt-4">
                    <h1 className="text-2xl font-bold text-[var(--color-lavanda-700)]">Evaluación de Estudiante</h1>
                    <button
                        className="bg-[var(--color-gris-600)] text-[var(--color-blanco)] font-semibold px-3 py-1.5 rounded-md flex items-center gap-2 hover:bg-[var(--color-gris-700)]"
                        onClick={() => navigate(`/teacher/estudiantesSeleccionados`)}>
                        <FaReply /> Regresar
                    </button>
                </div>
                
                <div className="text-center py-12">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 max-w-md mx-auto">
                        <div className="flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mx-auto mb-4">
                            <FaUser className="text-yellow-600 text-2xl" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            No se encontraron categorías
                        </h2>
                        <p className="text-gray-600 text-sm">
                            Este estudiante no tiene categorías asignadas.
                            Contacta al administrador para más información.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-6">

            <div className="flex bg-[var(--color-blanco)] border border-[var(--color-gris-300)] rounded-xl shadow-md overflow-hidden">

                <div className="w-[7px] bg-[var(--color-lavanda-600)]" />
                <div className="flex-1 p-4">
                    <div className="flex items-center space-x-4">
                        <div className="bg-[var(--color-lavanda-200)] p-3 rounded-full">
                            <FaUser className="text-[var(--color-lavanda-700)] text-xl" />
                        </div>
                        <div>
                            <p className="font-semibold text-[var(--color-gris-900)]">{student?.nombre || 'Estudiante'}</p>
                            <p className="text-sm text-[var(--color-gris-900)]">Correo: {student?.correo || 'cargando...'}</p>
                            <p className="text-sm text-[var(--color-gris-900)]">Matrícula: {student?.matricula || 'cargando...'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center mb-4 pb-2 pt-4">
                <h1 className="text-2xl font-bold text-[var(--color-lavanda-700)]">Categorias del Estudiante</h1>
                <button
                    className="bg-[var(--color-gris-600)] text-[var(--color-blanco)] font-semibold px-3 py-1.5 rounded-md flex items-center gap-2 hover:bg-[var(--color-gris-700)]"
                    onClick={() => navigate(`/teacher/estudiantesSeleccionados`)}>
                    <FaReply /> Regresar
                </button>
            </div>

            {categorias.map((cat) => (
                <div key={cat.id} className="bg-[var(--color-lavanda-100)] border border-[var(--color-lavanda-200)] rounded-xl shadow-md">
                    <div className="flex items-center justify-between px-4 py-3 cursor-pointer" onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}>
                        <div>
                            <p className="font-semibold text-[var(--color-lavanda-800)]">{cat.nombre}</p>
                            <p className="text-sm text-[var(--color-gris-800)]">Categoría de simuladores</p>
                            <p className="text-sm mt-2 text-[var(--color-gris-900)]">Simuladores respondidos: {cat.simuladores.length}</p>
                        </div>
                        <div className="text-xl p-2 rounded-full transition duration-200 text-[var(--color-lavanda-700)] hover:text-white hover:bg-[var(--color-lavanda-600)] shadow hover:shadow-md">
                            {expandedCategory === cat.id ? <IoIosArrowUp /> : <IoIosArrowDown />}
                        </div>
                    </div>

                    {expandedCategory === cat.id && (
                        <div className="border-t border-[var(--color-gris-200)] mt-3">
                            {cat.simuladores.length > 0 ? (
                                <div className="divide-y divide-[var(--color-gris-300)] bg-[var(--color-verde-claro)]">
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
                                                <p className="text-sm text-[var(--color-gris-700)]">Realizado: {sim.fecha}</p>
                                                <p className="text-sm mt-2 font-semibold text-[var(--color-lavanda-800)]">
                                                    Calificación Automática: {sim.calificacion}/10
                                                </p>
                                                <div className="mt-2 space-y-1">
                                                    {sim.calificacionFinal ? (
                                                        <>
                                                            <span
                                                                className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm
                                                                        ${sim.calificacionFinal >= 8
                                                                        ? 'bg-green-200 text-green-900 border border-green-300'
                                                                        : 'bg-red-200 text-red-900 border border-red-300'
                                                                    }`}
                                                            >
                                                                {sim.calificacionFinal >= 8 ? '✅' : '❌'} Evaluado: {sim.calificacionFinal}/10
                                                            </span>
                                                            {sim.fechaEvaluacion && (
                                                                <p className="text-xs text-gray-500">
                                                                    Evaluado el: {new Date(sim.fechaEvaluacion).toLocaleDateString('es-ES')}
                                                                </p>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm border border-yellow-400">
                                                            ⏳ Pendiente de evaluación
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <button 
                                                className="bg-[var(--color-lavanda-600)] hover:bg-[var(--color-lavanda-700)] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                                                onClick={() => navigate(`/teacher/evaluarSimulador/${sim.id}?studentId=${studentId}`)}
                                            >
                                                {sim.calificacionFinal ? 'Ver Evaluación' : 'Retroalimentar'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="px-4 py-8 text-center bg-yellow-50">
                                    <div className="max-w-sm mx-auto">
                                        <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-3">
                                            <FaUser className="text-yellow-600 text-lg" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            No hay simuladores para evaluar
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            El estudiante aún no ha realizado ningún simulador en esta categoría.
                                            Una vez que complete algunos simuladores, podrás evaluarlos aquí.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default EvaluarEstudiante;