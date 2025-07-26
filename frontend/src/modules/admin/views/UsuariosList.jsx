import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const UsuariosList = () => {
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([
        {
            user_id: 1,
            name: "Juan",
            lastname: "Pérez",
            email: "juan.perez@universidad.edu.mx",
            role: "estudiante",
            enrollment: "20230001"
        },
        {
            user_id: 2,
            name: "Omar",
            lastname: "Pérez",
            email: "omar.perez@universidad.edu.mx",
            role: "docente",
            enrollment: "20230001"
        }
    ]);
    const [paginaActual, setPaginaActual] = useState(1);
    const usuariosPorPagina = 6;

    const [mostrarModal, setMostrarModal] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

    useEffect(() => { }, []);

    const handleEditar = (usuario) => {
        setModoEdicion(true);
        setUsuarioSeleccionado(usuario);
        setMostrarModal(true);
    };

    const handleEliminar = (usuarioId) => {
        console.log("Eliminar usuario", usuarioId);
    };

    const handleCrear = () => {
        setModoEdicion(false);
        setUsuarioSeleccionado(null);
        setMostrarModal(true);
    };

    const cerrarModal = () => {
        setMostrarModal(false);
    };

    const totalPaginas = Math.ceil(usuarios.length / usuariosPorPagina);
    const indiceInicio = (paginaActual - 1) * usuariosPorPagina;
    const usuariosPagina = usuarios.slice(indiceInicio, indiceInicio + usuariosPorPagina);

    const cambiarPagina = (nuevaPagina) => {
        if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
            setPaginaActual(nuevaPagina);
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4 pb-2">
                <h1 className="text-2xl font-bold text-[var(--color-lavanda-700)]">Gestión de Usuarios</h1>
                <button
                    className="bg-[var(--color-lavanda-600)] text-white px-3 py-1.5 rounded-md flex items-center gap-2 hover:bg-[var(--color-lavanda-700)]"
                    onClick={handleCrear}>
                    <FaPlus /> Crear Usuario
                </button>
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
                            usuariosPagina.map((usuario) => (
                                <tr key={usuario.user_id} className="hover:bg-[var(--color-lavanda-100)]">
                                    <td className="py-2 px-4">{usuario.user_id}</td>
                                    <td className="py-2 px-4">{usuario.name} {usuario.lastname}</td>
                                    <td className="py-2 px-4">{usuario.email}</td>
                                    <td className="py-2 px-4 capitalize">{usuario.role}</td>
                                    <td className="py-2 px-4">
                                        {usuario.role === "estudiante" ? (
                                            <span className="bg-[var(--color-lavanda-300)] text-[var(--color-lavanda-950)] font-semibold py-1 px-5 rounded-full text-xs">
                                                {usuario.enrollment}
                                            </span>
                                        ) : (
                                            <span className="bg-gray-200 text-gray-600 font-semibold py-1 px-3 rounded-full text-xs">
                                                Sin matrícula
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-2 px-4 flex justify-center gap-2 flex-wrap">
                                        <button
                                            className="p-2.5 border border-[var(--color-gris-300)] rounded-full transition duration-200 text-[var(--color-lavanda-700)] hover:text-white hover:bg-[var(--color-lavanda-600)] shadow hover:shadow-md"
                                            title="Editar usuario"
                                            onClick={() => handleEditar(usuario)}>
                                            <FaEdit />
                                        </button>

                                        <button
                                            className="p-2.5 border border-[var(--color-gris-300)] rounded-full transition duration-200 text-[var(--color-lavanda-700)] hover:text-white hover:bg-[var(--color-lavanda-600)] shadow hover:shadow-md"
                                            title="Eliminar usuario"
                                            onClick={() => handleEliminar(usuario.user_id)}>
                                            <FaTrash />
                                        </button>

                                        <button
                                            className={`p-1 px-4 rounded-full text-sm font-medium shadow border ${usuario.role === "estudiante"
                                                    ? "text-[var(--color-lavanda-800)] border-[var(--color-gris-300)] hover:bg-[var(--color-lavanda-600)] hover:text-white"
                                                    : "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                                                }`}
                                            disabled={usuario.role !== "estudiante"}
                                            onClick={() =>
                                                usuario.role === "estudiante" &&
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

            {/* MODAL */}
            {mostrarModal && (
                <div className="fixed top-1/2 left-[calc(50%+100px)] transform -translate-x-1/2 -translate-y-1/2 z-50">
                    <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg border border-[var(--color-gris-400)]">
                        <h2 className="text-xl font-semibold text-[var(--color-lavanda-700)] mb-4">
                            {modoEdicion ? "Editar Usuario" : "Crear Usuario"}
                        </h2>

                        <form className="space-y-4">
                            <input
                                type="text"
                                placeholder="Nombre"
                                defaultValue={usuarioSeleccionado?.name || ""}
                                className="w-full p-2 border border-[var(--color-gris-500)] rounded text-[var(--color-gris-900)] focus:outline-none focus:ring-1 focus:ring-[var(--color-lavanda-500)] focus:border-[var(--color-lavanda-500)]"
                            />
                            <input
                                type="text"
                                placeholder="Apellido"
                                defaultValue={usuarioSeleccionado?.lastname || ""}
                                className="w-full p-2 border border-[var(--color-gris-500)] rounded text-[var(--color-gris-900)] focus:outline-none focus:ring-1 focus:ring-[var(--color-lavanda-500)] focus:border-[var(--color-lavanda-500)]"
                            />
                            <input
                                type="email"
                                placeholder="Correo"
                                defaultValue={usuarioSeleccionado?.email || ""}
                                className="w-full p-2 border border-[var(--color-gris-500)] rounded text-[var(--color-gris-900)] focus:outline-none focus:ring-1 focus:ring-[var(--color-lavanda-500)] focus:border-[var(--color-lavanda-500)]"
                            />
                            <input
                                type="text"
                                placeholder="Matrícula"
                                defaultValue={usuarioSeleccionado?.enrollment || ""}
                                className="w-full p-2 border border-[var(--color-gris-500)] rounded text-[var(--color-gris-900)] focus:outline-none focus:ring-1 focus:ring-[var(--color-lavanda-500)] focus:border-[var(--color-lavanda-500)]"
                            />
                            <select
                                defaultValue={usuarioSeleccionado?.role || ""}
                                className="w-full p-2 border border-[var(--color-gris-500)] rounded text-[var(--color-gris-900)] focus:outline-none focus:ring-1 focus:ring-[var(--color-lavanda-500)] focus:border-[var(--color-lavanda-500)]"
                            >
                                <option value="">Seleccionar rol</option>
                                <option value="estudiantes">Estudiante</option>
                                <option value="mentor">Mentor</option>
                                <option value="administrador">Administrador</option>
                            </select>

                            <div className="flex justify-end gap-2 pt-4">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                                    onClick={cerrarModal}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-[var(--color-lavanda-700)] text-white rounded hover:bg-[var(--color-lavanda-800)]"
                                >
                                    {modoEdicion ? "Guardar cambios" : "Crear"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default UsuariosList;
