import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaSearch, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getAllUsers, updateUser, deleteUser } from "../adapters/users.controller";
import { validateName, validateEmail, validateEnrollment, validateRole } from "../../../kernel/validations";
import { showSuccessToast, showErrorToast, showConfirmation } from "../../../kernel/alerts";
import Loader from "../../../components/Loader";

const UsuariosList = () => {
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);

    const [busquedaCorreo, setBusquedaCorreo] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);
    const usuariosPorPagina = 6;

    const [mostrarModal, setMostrarModal] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    
    // Campos del formulario
    const [formData, setFormData] = useState({
        name: "",
        lastname: "",
        email: "",
        enrollment: "",
        role: "",
        password: ""
    });
    
    // Errores de validación
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchUsuarios();
    }, []);
    
    const fetchUsuarios = async () => {
        try {
            setLoading(true);
            const response = await getAllUsers();
            setUsuarios(response.result || []);
        } catch (error) {
            console.error("Error al obtener usuarios:", error.message);
            showErrorToast({ 
                title: "Error", 
                text: "No se pudieron cargar los usuarios" 
            });
        } finally {
            setLoading(false);
        }
    };


    const handleEditar = (usuario) => {
        // Prevenir edición de administradores
        if (usuario.role === "administrador") {
            showErrorToast({ 
                title: "Acción no permitida", 
                text: "No se pueden modificar cuentas de administrador" 
            });
            return;
        }
        
        setModoEdicion(true);
        setUsuarioSeleccionado(usuario);
        setFormData({
            name: usuario.name || "",
            lastname: usuario.lastname || "",
            email: usuario.email || "",
            enrollment: usuario.enrollment || "",
            role: usuario.role || "",
            password: "" // No mostrar contraseña actual
        });
        setErrors({});
        setMostrarModal(true);
    };

    const handleEliminar = (usuario) => {
        // Prevenir eliminación de administradores
        if (usuario.role === "administrador") {
            showErrorToast({ 
                title: "Acción no permitida", 
                text: "No se pueden eliminar cuentas de administrador" 
            });
            return;
        }
        
        showConfirmation(
            "Confirmar eliminación",
            `¿Estás seguro de que deseas eliminar al usuario "${usuario.name} ${usuario.lastname}"? Esta acción no se puede deshacer.`,
            "warning",
            async () => {
                try {
                    await deleteUser(usuario.user_id);
                    showSuccessToast({ title: "Usuario eliminado exitosamente" });
                    fetchUsuarios(); // Recargar la lista
                } catch (error) {
                    showErrorToast({ 
                        title: "Error", 
                        text: error.message || "No se pudo eliminar el usuario"
                    });
                }
            }
        );
    };

    const cerrarModal = () => {
        setMostrarModal(false);
        setFormData({
            name: "",
            lastname: "",
            email: "",
            enrollment: "",
            role: "",
            password: ""
        });
        setErrors({});
        setUsuarioSeleccionado(null);
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Limpiar error del campo cuando el usuario empiece a escribir
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };
    
    const validateForm = () => {
        const newErrors = {};
        
        // Validar nombre
        const nameError = validateName(formData.name);
        if (nameError) newErrors.name = nameError;
        
        // Validar apellido
        const lastnameError = validateName(formData.lastname);
        if (lastnameError) newErrors.lastname = lastnameError;
        
        // Validar email
        const emailError = validateEmail(formData.email);
        if (emailError) newErrors.email = emailError;
        
        // Validar matrícula
        const enrollmentError = validateEnrollment(formData.enrollment);
        if (enrollmentError) newErrors.enrollment = enrollmentError;
        
        // Validar rol
        const roleError = validateRole(formData.role);
        if (roleError) newErrors.role = roleError;
        
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        try {
            setSubmitting(true);
            
            if (modoEdicion) {
                // Actualizar usuario
                const updateData = {
                    name: formData.name,
                    lastname: formData.lastname,
                    email: formData.email,
                    enrollment: formData.enrollment,
                    role: formData.role
                };
                
                await updateUser(usuarioSeleccionado.user_id, updateData);
                showSuccessToast({ title: "Usuario actualizado exitosamente" });
            }
            
            cerrarModal();
            fetchUsuarios(); // Recargar la lista
            
        } catch (error) {
            showErrorToast({ 
                title: "Error", 
                text: error.message || "No se pudo guardar el usuario"
            });
        } finally {
            setSubmitting(false);
        }
    };


    // Filtrar TODOS los usuarios, no solo los de la página actual
    const filtrados = usuarios.filter((e) =>
        e.email.toLowerCase().includes(busquedaCorreo.toLowerCase())
    );

    const totalPaginas = Math.ceil(filtrados.length / usuariosPorPagina);
    const indiceInicio = (paginaActual - 1) * usuariosPorPagina;
    const usuariosPagina = filtrados.slice(indiceInicio, indiceInicio + usuariosPorPagina);

    const cambiarPagina = (nuevaPagina) => {
        if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
            setPaginaActual(nuevaPagina);
        }
    };

    if (loading) {
        return <Loader isLoading={true} />;
    }
    
    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4 pb-2">
                <h1 className="text-2xl font-bold text-[var(--color-lavanda-700)]">Gestión de Usuarios</h1>
                <div className="flex items-center gap-4">
                    <div className="relative w-full max-w-xs">
                        <span className="absolute inset-y-0 right-4 flex items-center text-gray-400">
                            <FaSearch />
                        </span>
                        <input
                            type="text"
                            placeholder="Buscar por correo..."
                            className="pl-5 pr-4 py-2 w-full border border-[var(--blue)] rounded-full text-sm bg-[var(--color-blanco)] focus:outline-none focus:ring focus:ring-[var(--color-lavanda-300)]"
                            value={busquedaCorreo}
                            onChange={(e) => {
                                setBusquedaCorreo(e.target.value);
                                setPaginaActual(1);
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
                <table className="min-w-full bg-white text-sm divide-y divide-[var(--blue)]">
                    <thead className="bg-[var(--color-lavanda-200)] text-[var(--color-gris-900)] text-left">
                        <tr>
                            <th className="py-3 px-4">ID</th>
                            <th className="py-3 px-4">Nombre</th>
                            <th className="py-3 px-4">Correo</th>
                            <th className="py-3 px-4">Rol</th>
                            <th className="py-3 px-4">Matrícula</th>
                            <th className="py-3 px-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-gris-300)]">
                        {usuariosPagina.length > 0 ? (
                            usuariosPagina.map((usuario, index) => (
                                <tr key={usuario.user_id} className="hover:bg-[var(--color-lavanda-100)]">
                                    <td className="py-2 px-4">{indiceInicio + index + 1}</td>
                                    <td className="py-2 px-4">{usuario.name} {usuario.lastname}</td>
                                    <td className="py-2 px-4">{usuario.email}</td>
                                    <td className="py-2 px-4 capitalize">{usuario.role}</td>
                                    <td className="py-2 px-4">
                                        {usuario.role === "estudiantes" ? (
                                            <span className="bg-[var(--color-lavanda-300)] text-[var(--color-lavanda-950)] font-semibold py-1 px-5 rounded-full text-xs">
                                                {usuario.enrollment}
                                            </span>
                                        ) : (
                                            <span className="bg-gray-200 text-gray-600 font-semibold py-1 px-3 rounded-full text-xs">
                                                {usuario.enrollment}
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-2 px-4 flex justify-center gap-2 flex-wrap">
                                        <button
                                            className={`p-2.5 border border-[var(--color-gris-300)] rounded-full transition duration-200 shadow hover:shadow-md ${
                                                usuario.role === "administrador"
                                                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                                                    : "text-[var(--color-lavanda-700)] hover:text-white hover:bg-[var(--color-lavanda-600)]"
                                            }`}
                                            title={usuario.role === "administrador" ? "No se pueden modificar administradores" : "Editar usuario"}
                                            onClick={() => handleEditar(usuario)}
                                            disabled={usuario.role === "administrador"}>
                                            <FaEdit />
                                        </button>

                                        <button
                                            className={`p-2.5 border border-[var(--color-gris-300)] rounded-full transition duration-200 shadow hover:shadow-md ${
                                                usuario.role === "administrador"
                                                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                                                    : "text-[var(--color-lavanda-700)] hover:text-white hover:bg-[var(--color-lavanda-600)]"
                                            }`}
                                            title={usuario.role === "administrador" ? "No se pueden eliminar administradores" : "Eliminar usuario"}
                                            onClick={() => handleEliminar(usuario)}
                                            disabled={usuario.role === "administrador"}>
                                            <FaTrash />
                                        </button>

                                        <button
                                            className={`p-1 px-4 rounded-full text-sm font-medium shadow border ${usuario.role === "estudiantes"
                                                ? "text-[var(--color-lavanda-800)] border-[var(--color-gris-300)] hover:bg-[var(--color-lavanda-600)] hover:text-white"
                                                : "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                                                }`}
                                            disabled={usuario.role !== "estudiantes"}
                                            onClick={() =>
                                                usuario.role === "estudiantes" &&
                                                navigate(`/admin/historial/${usuario.user_id}`, {
                                                    state: { nombre: usuario.name, apellido: usuario.lastname },
                                                })
                                            }
                                        >
                                            Ver historial
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-6 text-gray-500">
                                    No hay usuarios disponibles
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>


            {totalPaginas > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
                    <button
                        className="px-2 py-1 rounded-full text-sm bg-[var(--color-gris-200)] hover:bg-[var(--color-gris-300)] text-[var(--color-gris-900)]"
                        onClick={() => cambiarPagina(paginaActual - 1)}
                        disabled={paginaActual === 1}
                    >
                        <FaAngleLeft />
                    </button>

                    {[...Array(totalPaginas)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => cambiarPagina(i + 1)}
                            className={`px-3 py-1 rounded-full text-sm font-medium ${paginaActual === i + 1
                                ? "bg-[var(--color-lavanda-700)] text-white"
                                : "bg-[var(--color-lavanda-200)] text-[var(--color-lavanda-950)] hover:bg-[var(--color-lavanda-300)]"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        className="px-2 py-1 rounded-full text-sm bg-[var(--color-gris-200)] hover:bg-[var(--color-gris-300)] text-[var(--color-gris-900)]"
                        onClick={() => cambiarPagina(paginaActual + 1)}
                        disabled={paginaActual === totalPaginas}
                    >
                        <FaAngleRight />
                    </button>
                </div>
            )}

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
                                        <FaEdit className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">Editar Usuario</h2>
                                        <p className="text-purple-100 text-sm">Actualizar información del usuario</p>
                                    </div>
                                </div>
                                <button
                                    onClick={cerrarModal}
                                    className="text-white hover:text-purple-200 transition-colors duration-200 p-1 rounded-full hover:bg-white hover:bg-opacity-10"
                                    disabled={submitting}
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Body del modal */}
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Nombre y Apellido en fila */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nombre *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 transition-all duration-200 ${
                                                errors.name 
                                                    ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200" 
                                                    : "border-gray-300 focus:border-[var(--color-lavanda-500)] focus:ring-2 focus:ring-[var(--color-lavanda-200)]"
                                            } focus:outline-none`}
                                            placeholder="Ingrese el nombre"
                                        />
                                        {errors.name && (
                                            <p className="text-red-500 text-xs mt-2 flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Apellido *
                                        </label>
                                        <input
                                            type="text"
                                            name="lastname"
                                            value={formData.lastname}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 transition-all duration-200 ${
                                                errors.lastname 
                                                    ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200" 
                                                    : "border-gray-300 focus:border-[var(--color-lavanda-500)] focus:ring-2 focus:ring-[var(--color-lavanda-200)]"
                                            } focus:outline-none`}
                                            placeholder="Ingrese el apellido"
                                        />
                                        {errors.lastname && (
                                            <p className="text-red-500 text-xs mt-2 flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {errors.lastname}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Correo Electrónico *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 transition-all duration-200 ${
                                            errors.email 
                                                ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200" 
                                                : "border-gray-300 focus:border-[var(--color-lavanda-500)] focus:ring-2 focus:ring-[var(--color-lavanda-200)]"
                                        } focus:outline-none`}
                                        placeholder="ejemplo@correo.com"
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-xs mt-2 flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            {errors.email}
                                        </p>
                                    )}
                                </div>
                                
                                {/* Matrícula y Rol en fila */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Matrícula *
                                        </label>
                                        <input
                                            type="text"
                                            name="enrollment"
                                            value={formData.enrollment}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 transition-all duration-200 ${
                                                errors.enrollment 
                                                    ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200" 
                                                    : "border-gray-300 focus:border-[var(--color-lavanda-500)] focus:ring-2 focus:ring-[var(--color-lavanda-200)]"
                                            } focus:outline-none`}
                                            placeholder="20230001"
                                        />
                                        {errors.enrollment && (
                                            <p className="text-red-500 text-xs mt-2 flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {errors.enrollment}
                                            </p>
                                        )}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Rol *
                                        </label>
                                        <select
                                            name="role"
                                            value={formData.role}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-lg text-gray-900 transition-all duration-200 ${
                                                errors.role 
                                                    ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200" 
                                                    : "border-gray-300 focus:border-[var(--color-lavanda-500)] focus:ring-2 focus:ring-[var(--color-lavanda-200)]"
                                            } focus:outline-none bg-white`}
                                        >
                                            <option value="" disabled>Seleccionar rol</option>
                                            <option value="estudiantes">Estudiante</option>
                                            <option value="mentor">Mentor</option>
                                        </select>
                                        {errors.role && (
                                            <p className="text-red-500 text-xs mt-2 flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {errors.role}
                                            </p>
                                        )}
                                    </div>
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
                                                <span>Actualizando...</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>Guardar Cambios</span>
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

export default UsuariosList;
