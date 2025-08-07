import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaEdit, FaChevronRight, FaPlus, FaTimes, FaToggleOn, FaToggleOff } from "react-icons/fa";
import {
    getSimulatorsByCategory,
    createSimulator,
    updateSimulator,
    toggleSimulatorStatus
} from "../adapters/simulators.controller";
import { validateSimulatorName } from "../../../kernel/validations";
import { showSuccessToast, showErrorToast, showConfirmation } from "../../../kernel/alerts";
import Loader from "../../../components/Loader";

const SimuladoresAdmin = () => {
    const { categoriaId } = useParams();
    const [simuladores, setSimuladores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [formNombre, setFormNombre] = useState("");
    const [editId, setEditId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [categoryInfo, setCategoryInfo] = useState(null);

    useEffect(() => {
        fetchSimuladores();
    }, [categoriaId]);

    const fetchSimuladores = async () => {
        try {
            setLoading(true);
            console.log(`Cargando simuladores para categoría ID: ${categoriaId}`);
            
            // Si categoriaId es undefined, no hacer la petición
            if (!categoriaId || categoriaId === 'undefined') {
                console.error('categoriaId es undefined o inválido');
                return;
            }
            
            const response = await getSimulatorsByCategory(categoriaId);
            
            if (response.result) {
                const { category, simulators } = response.result;
                console.log(`Categoría cargada: ${category.category_name}, Simuladores: ${simulators.length}`);
                setCategoryInfo(category);
                
                const simuladoresMapeados = simulators.map((sim) => ({
                    id: sim.simulator_id,
                    nombre: sim.simulator_name,
                    activo: sim.status
                }));
                
                setSimuladores(simuladoresMapeados);
            }
        } catch (error) {
            console.error("Error al obtener simuladores:", error);
            console.error("Categoria ID:", categoriaId);
            
            // No mostrar toast de error, solo mostrar la validación de "no hay datos"
            console.log("Error cargando simuladores:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAgregar = () => {
        setIsEdit(false);
        setFormNombre("");
        setErrors({});
        setShowModal(true);
    };

    const handleEditar = (id) => {
        const simulador = simuladores.find(s => s.id === id);
        if (simulador) {
            setIsEdit(true);
            setFormNombre(simulador.nombre);
            setEditId(id);
            setErrors({});
            setShowModal(true);
        }
    };

    const cerrarModal = () => {
        setShowModal(false);
        setFormNombre("");
        setErrors({});
        setEditId(null);
    };

    const handleInputChange = (value) => {
        setFormNombre(value);
        
        // Limpiar error cuando el usuario empiece a escribir
        if (errors.nombre) {
            setErrors(prev => ({ ...prev, nombre: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        const nameError = validateSimulatorName(formNombre);
        if (nameError) newErrors.nombre = nameError;
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleGuardar = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        // Validar que tenemos categoriaId
        if (!categoriaId || categoriaId === 'undefined') {
            showErrorToast({ 
                title: "Error", 
                text: "No se puede crear el simulador: ID de categoría inválido"
            });
            return;
        }
        
        try {
            setSubmitting(true);
            console.log('Guardando simulador:', {
                name: formNombre.trim(),
                category_id: parseInt(categoriaId),
                isEdit
            });
            
            if (isEdit) {
                await updateSimulator(editId, {
                    name: formNombre.trim()
                });
                showSuccessToast({ 
                    title: "Simulador actualizado exitosamente" 
                });
            } else {
                await createSimulator({
                    name: formNombre.trim(),
                    category_id: parseInt(categoriaId)
                });
                showSuccessToast({ 
                    title: "Simulador creado exitosamente" 
                });
            }

            cerrarModal();
            fetchSimuladores(); // Recargar la lista
            
        } catch (error) {
            console.error('Error al guardar simulador:', error);
            showErrorToast({ 
                title: "Error", 
                text: error.message || "No se pudo guardar el simulador"
            });
        } finally {
            setSubmitting(false);
        }
    };

    const toggleEstatus = (simulador) => {
        const accion = simulador.activo ? "desactivar" : "activar";
        const mensaje = simulador.activo 
            ? `¿Estás seguro de que deseas desactivar el simulador "${simulador.nombre}"? Los estudiantes no podrán acceder a él.`
            : `¿Estás seguro de que deseas activar el simulador "${simulador.nombre}"?`;
        
        showConfirmation(
            `Confirmar ${accion}`,
            mensaje,
            "warning",
            async () => {
                try {
                    await toggleSimulatorStatus(simulador.id, simulador.activo);
                    showSuccessToast({ 
                        title: `Simulador ${simulador.activo ? 'desactivado' : 'activado'} exitosamente` 
                    });
                    fetchSimuladores(); // Recargar la lista
                } catch (error) {
                    showErrorToast({ 
                        title: "Error", 
                        text: error.message || `No se pudo ${accion} el simulador`
                    });
                }
            }
        );
    };

    if (loading) {
        return <Loader isLoading={true} />;
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-lavanda-700)]">Simuladores</h1>
                    {categoryInfo && (
                        <p className="text-sm text-gray-600 mt-1">
                            Categoría: {categoryInfo.category_name}
                        </p>
                    )}
                </div>
                <div className="flex gap-4">
                    <Link to={`/admin/categorias`}
                        className="px-4 py-2 rounded-md bg-[var(--color-gris-800)] text-white font-semibold hover:bg-[var(--color-gris-600)] transition">
                        Atrás
                    </Link>
                    <button
                        onClick={handleAgregar}
                        className="flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--color-lavanda-700)] text-white hover:bg-[var(--color-lavanda-500)] transition">
                        <FaPlus />
                        Agregar simulador
                    </button>
                </div>
            </div>

            {simuladores.length === 0 ? (
                <div className="text-center py-12">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-blue-800 mb-2">
                            No hay simuladores disponibles
                        </h3>
                        <p className="text-blue-700 mb-4">
                            Esta categoría aún no tiene simuladores configurados. Puedes agregar uno usando el botón "Agregar simulador".
                        </p>
                        <button
                            onClick={handleAgregar}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        >
                            <FaPlus />
                            Crear primer simulador
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {simuladores.map((sim) => (
                        <div
                            key={sim.id}
                            className={`flex justify-between items-center p-4 rounded-xl shadow-md border transition
                            ${sim.activo
                                    ? "bg-[var(--color-nude-200)] hover:bg-[var(--color-nude-300)] border-[var(--color-nude-300)]"
                                    : "bg-[var(--color-gris-200)] text-[var(--color-gris-500)] border-[var(--color-gris-300)]"
                                }`}
                        >
                            <span className={`font-medium ${!sim.activo ? "line-through" : "text-[var(--color-gris-950)]"}`}>
                                {sim.nombre}
                            </span>

                            <div className="flex gap-2 items-center">
                                <button
                                    onClick={() => toggleEstatus(sim)}
                                    className={`text-sm px-3 py-1 rounded-full font-semibold transition
                                    ${sim.activo
                                            ? "bg-green-100 text-green-700 hover:bg-green-200 w-19 border border-[var(--color-gris-400)]"
                                            : "bg-gray-300 text-gray-600 hover:bg-gray-400 border border-[var(--color-gris-400)]"
                                        }`}
                                >
                                    {sim.activo ? "Activo" : "Inactivo"}
                                </button>

                                <button
                                    onClick={() => handleEditar(sim.id)}
                                    className="p-2 rounded-full text-[var(--color-lavanda-700)] hover:bg-[var(--color-lavanda-100)] hover:shadow-md transition"
                                    title="Editar simulador">
                                    <FaEdit />
                                </button>

                                <Link
                                    to={`/admin/simulador/${sim.id}`}
                                    className="p-2 rounded-full text-[var(--color-lavanda-700)] hover:bg-[var(--color-lavanda-100)] hover:shadow-md transition"
                                    title="Ver preguntas">
                                    <FaChevronRight />
                                </Link>
                            </div>

                        </div>
                    ))}
                </div>
            )}

            {/* MODAL CON BACKDROP */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0">
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 backdrop-blur-md bg-opacity-50 transition-opacity duration-300 ease-out"
                        onClick={cerrarModal}
                    ></div>
                    
                    {/* Modal */}
                    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 ease-out scale-100 opacity-100">
                        {/* Header con gradiente */}
                        <div className="bg-gradient-to-r from-[var(--color-lavanda-700)] to-[var(--color-lavanda-600)] rounded-t-xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-white bg-opacity-20 rounded-full p-2">
                                        {isEdit ? (
                                            <FaEdit className="w-5 h-5" />
                                        ) : (
                                            <FaPlus className="w-5 h-5" />
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">
                                            {isEdit ? "Editar Simulador" : "Agregar Simulador"}
                                        </h2>
                                        <p className="text-purple-100 text-sm">
                                            {isEdit ? "Actualizar información del simulador" : "Crear nuevo simulador de entrevistas"}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={cerrarModal}
                                    className="text-white hover:text-purple-200 transition-colors duration-200 p-1 rounded-full hover:bg-white hover:bg-opacity-10"
                                    disabled={submitting}
                                >
                                    <FaTimes className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Body del modal */}
                        <div className="p-6">
                            <form onSubmit={handleGuardar} className="space-y-5">
                                {/* Nombre del simulador */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre del Simulador *
                                    </label>
                                    <input
                                        type="text"
                                        value={formNombre}
                                        onChange={(e) => handleInputChange(e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 transition-all duration-200 ${
                                            errors.nombre 
                                                ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200" 
                                                : "border-gray-300 focus:border-[var(--color-lavanda-500)] focus:ring-2 focus:ring-[var(--color-lavanda-200)]"
                                        } focus:outline-none`}
                                        placeholder="Ingrese el nombre del simulador"
                                        disabled={submitting}
                                    />
                                    {errors.nombre && (
                                        <p className="text-red-500 text-xs mt-2 flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            {errors.nombre}
                                        </p>
                                    )}
                                </div>

                                {/* Información adicional */}
                                {categoryInfo && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                        <p className="text-sm text-blue-700">
                                            <strong>Categoría:</strong> {categoryInfo.category_name}
                                        </p>
                                        <p className="text-xs text-blue-600 mt-1">
                                            El simulador se creará dentro de esta categoría.
                                        </p>
                                    </div>
                                )}

                                {/* Botones */}
                                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                                    <button
                                        type="button"
                                        className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                                        onClick={cerrarModal}
                                        disabled={submitting}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2.5 bg-gradient-to-r from-[var(--color-lavanda-700)] to-[var(--color-lavanda-600)] text-white rounded-lg hover:from-[var(--color-lavanda-800)] hover:to-[var(--color-lavanda-700)] transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center space-x-2"
                                        disabled={submitting}
                                    >
                                        {submitting ? (
                                            <>
                                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>{isEdit ? 'Actualizando...' : 'Creando...'}</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>{isEdit ? 'Actualizar' : 'Crear Simulador'}</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SimuladoresAdmin;
