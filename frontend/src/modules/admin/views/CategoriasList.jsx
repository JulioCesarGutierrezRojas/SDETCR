import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaPlus, FaToggleOn, FaToggleOff, FaTimes } from "react-icons/fa";
import {
    getAllCategories,
    createCategory,
    updateCategory,
    disableCategory
} from "../adapters/categories.controller";
import { validateCategoryName, validateCategoryDescription } from "../../../kernel/validations";
import { showSuccessToast, showErrorToast, showConfirmation } from "../../../kernel/alerts";
import Loader from "../../../components/Loader";

const CategoriasAdmin = () => {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [categoriaEditando, setCategoriaEditando] = useState(null);
    const [nuevoNombre, setNuevoNombre] = useState("");
    const [nuevaDescripcion, setNuevaDescripcion] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchCategorias();
    }, []);

    const fetchCategorias = async () => {
        try {
            setLoading(true);
            const {result} = await getAllCategories();
            const categoriasMapeadas = result.map((cat) => ({
                id: cat.category_id,
                nombre: cat.name,
                descripcion: cat.description,
                activo: cat.status,
                totalSimuladores: parseInt(cat.simulators_count) || 0
            }));
            setCategorias(categoriasMapeadas);
        } catch (error) {
            console.error("Error al obtener categorías:", error);
            showErrorToast({
                title: "Error",
                text: "No se pudieron cargar las categorías"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAgregar = () => {
        setCategoriaEditando(null);
        setNuevoNombre("");
        setNuevaDescripcion("");
        setErrors({});
        setMostrarModal(true);
    };

    const handleEditar = (id) => {
        const cat = categorias.find((c) => c.id === id);
        if (cat) {
            setCategoriaEditando(cat);
            setNuevoNombre(cat.nombre);
            setNuevaDescripcion(cat.descripcion);
            setErrors({});
            setMostrarModal(true);
        }
    };

    const cerrarModal = () => {
        setMostrarModal(false);
        setNuevoNombre("");
        setNuevaDescripcion("");
        setErrors({});
        setCategoriaEditando(null);
    };

    const handleInputChange = (field, value) => {
        if (field === 'nombre') {
            setNuevoNombre(value);
        } else if (field === 'descripcion') {
            setNuevaDescripcion(value);
        }
        
        // Limpiar error del campo cuando el usuario empiece a escribir
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ""
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Validar nombre
        const nameError = validateCategoryName(nuevoNombre);
        if (nameError) newErrors.nombre = nameError;
        
        // Validar descripción
        const descriptionError = validateCategoryDescription(nuevaDescripcion);
        if (descriptionError) newErrors.descripcion = descriptionError;
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleGuardarCambios = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        try {
            setSubmitting(true);
            
            if (categoriaEditando) {
                await updateCategory({
                    id: categoriaEditando.id,
                    name: nuevoNombre.trim(),
                    description: nuevaDescripcion.trim()
                });
                showSuccessToast({ 
                    title: "Categoría actualizada exitosamente" 
                });
            } else {
                await createCategory({
                    name: nuevoNombre.trim(),
                    description: nuevaDescripcion.trim()
                });
                showSuccessToast({ 
                    title: "Categoría creada exitosamente" 
                });
            }

            cerrarModal();
            fetchCategorias(); // Recargar la lista
            
        } catch (error) {
            showErrorToast({ 
                title: "Error", 
                text: error.message || "No se pudo guardar la categoría"
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleActivo = (categoria) => {
        const accion = categoria.activo ? "desactivar" : "activar";
        const mensaje = categoria.activo 
            ? `¿Estás seguro de que deseas desactivar la categoría "${categoria.nombre}"? Esto puede afectar la disponibilidad de los simuladores asociados.`
            : `¿Estás seguro de que deseas activar la categoría "${categoria.nombre}"?`;
        
        showConfirmation(
            `Confirmar ${accion}`,
            mensaje,
            "warning",
            async () => {
                try {
                    await disableCategory(categoria.nombre);
                    showSuccessToast({ 
                        title: `Categoría ${categoria.activo ? 'desactivada' : 'activada'} exitosamente` 
                    });
                    fetchCategorias(); // Recargar la lista
                } catch (error) {
                    showErrorToast({ 
                        title: "Error", 
                        text: error.message || `No se pudo ${accion} la categoría`
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
                <h1 className="text-2xl font-bold text-[var(--color-lavanda-700)]">Gestión de Categorías</h1>
                <button onClick={handleAgregar}
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--color-lavanda-700)] text-white hover:bg-[var(--color-lavanda-500)] transition">
                    <FaPlus />
                    Agregar categoría
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categorias.map((cat) => {
                    const cardClass = cat.activo
                        ? "bg-[var(--color-lavanda-100)] border-[var(--color-lavanda-300)]"
                        : "bg-gray-200 border-gray-300 text-gray-500";

                    return (
                        <div key={cat.id} className={`rounded-lg shadow p-4 relative hover:shadow-lg border ${cardClass}`}>
                            <h2 className={`text-xl font-semibold ${cat.activo ? "text-[var(--color-lavanda-700)]" : "text-gray-500"}`}>
                                {cat.nombre}
                            </h2>
                            <p className="text-sm mt-1 text-[var(--color-gris-900)]">{cat.descripcion}</p>
                            <p className="text-sm mt-1 text-[var(--color-gris-900)]">Simuladores: {cat.totalSimuladores}</p>

                            <div className="absolute top-2 right-3 flex gap-1">
                                <button
                                    onClick={() => handleEditar(cat.id)}
                                    title="Editar"
                                    className="p-1 rounded-md hover:bg-[var(--color-lavanda-300)] hover:shadow transition"
                                >
                                    <FaEdit className="text-[var(--color-verde-feedback)]" />
                                </button>
                                <button
                                    onClick={() => handleToggleActivo(cat)}
                                    title={cat.activo ? "Desactivar" : "Activar"}
                                    className="p-1 rounded-md hover:bg-[var(--color-lavanda-300)] hover:shadow transition"
                                >
                                    {cat.activo ? (
                                        <FaToggleOn className="text-[var(--color-lavanda-700)]" />
                                    ) : (
                                        <FaToggleOff className="text-gray-500" />
                                    )}
                                </button>
                            </div>

                            <Link to={`/admin/categoria/${cat.id}`}
                                className={`mt-4 block text-right text-sm ${cat.activo ? "text-[var(--color-lavanda-700)] hover:underline" : "text-gray-500 pointer-events-none"}`}>
                                Ver simuladores
                            </Link>
                        </div>
                    );
                })}
            </div>

            {/* MODAL CON BACKDROP */}
            {mostrarModal && (
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
                                        {categoriaEditando ? (
                                            <FaEdit className="w-5 h-5" />
                                        ) : (
                                            <FaPlus className="w-5 h-5" />
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">
                                            {categoriaEditando ? "Editar Categoría" : "Agregar Categoría"}
                                        </h2>
                                        <p className="text-purple-100 text-sm">
                                            {categoriaEditando ? "Actualizar información de la categoría" : "Crear nueva categoría de simuladores"}
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
                            <form onSubmit={handleGuardarCambios} className="space-y-5">
                                {/* Nombre */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre de la Categoría *
                                    </label>
                                    <input
                                        type="text"
                                        value={nuevoNombre}
                                        onChange={(e) => handleInputChange('nombre', e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 transition-all duration-200 ${
                                            errors.nombre 
                                                ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200" 
                                                : "border-gray-300 focus:border-[var(--color-lavanda-500)] focus:ring-2 focus:ring-[var(--color-lavanda-200)]"
                                        } focus:outline-none`}
                                        placeholder="Ingrese el nombre de la categoría"
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
                                
                                {/* Descripción */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Descripción *
                                    </label>
                                    <textarea
                                        value={nuevaDescripcion}
                                        onChange={(e) => handleInputChange('descripcion', e.target.value)}
                                        rows={4}
                                        className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 transition-all duration-200 resize-none ${
                                            errors.descripcion 
                                                ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200" 
                                                : "border-gray-300 focus:border-[var(--color-lavanda-500)] focus:ring-2 focus:ring-[var(--color-lavanda-200)]"
                                        } focus:outline-none`}
                                        placeholder="Ingrese una descripción detallada de la categoría"
                                        disabled={submitting}
                                    />
                                    {errors.descripcion && (
                                        <p className="text-red-500 text-xs mt-2 flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            {errors.descripcion}
                                        </p>
                                    )}
                                </div>

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
                                                <span>{categoriaEditando ? 'Actualizando...' : 'Creando...'}</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>{categoriaEditando ? 'Actualizar' : 'Crear Categoría'}</span>
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
};

export default CategoriasAdmin;
