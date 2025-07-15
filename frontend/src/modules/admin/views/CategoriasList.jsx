import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaChevronRight, FaPlus } from "react-icons/fa";

const CategoriasAdmin = () => {
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        setCategorias([
            { id: 1, nombre: "Software" },
            { id: 2, nombre: "Redes" },
            { id: 3, nombre: "Administración" }
        ]);
    }, []);

    const handleAgregar = () => {
        console.log("Agregar categoría");
    };

    const handleEditar = (id) => {
        console.log("Editar categoría:", id);
    };

    const handleEliminar = (id) => {
        console.log("Eliminar categoría:", id);
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-[var(--color-lavanda-700)]">Gestión de Categorías</h1>
                <button
                    onClick={handleAgregar}
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--color-lavanda-700)] text-white hover:bg-[var(--color-lavanda-500)] transition"
                >
                    <FaPlus />
                    Agregar categoría
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categorias.map((cat) => (
                    <div key={cat.id} className="bg-[var(--color-lavanda-100)] rounded-lg shadow p-4 relative hover:shadow-lg border border-[var(--color-lavanda-200)]">
                        <h2 className="text-xl font-semibold text-[var(--color-lavanda-700)]">{cat.nombre}</h2>
                        <p className="text-sm text-gray-600 mt-1">Simuladores: {cat.totalSimuladores}</p>

                        <div className="absolute top-2 right-3 flex gap-1">
                            <button
                                onClick={() => handleEditar(cat.id)}
                                title="Editar"
                                className="p-1 rounded-md hover:bg-white hover:shadow transition"
                            >
                                <FaEdit className="text-[var(--color-verde-feedback)]" />
                            </button>
                            <button
                                onClick={() => handleEliminar(cat.id)}
                                title="Eliminar"
                                className="p-1 rounded-md hover:bg-white hover:shadow transition"
                            >
                                <FaTrash className="text-[var(--color-rojo-error)]" />
                            </button>
                        </div>

                        <Link to={`/admin/categoria/${cat.id}`} className="mt-4 block text-right text-sm text-[var(--color-lavanda-700)] hover:underline">
                            Ver simuladores
                        </Link>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default CategoriasAdmin;
