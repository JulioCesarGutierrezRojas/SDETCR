import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaPlus, FaToggleOn, FaToggleOff } from "react-icons/fa";

const CategoriasAdmin = () => {
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        setCategorias([
            { id: 1, nombre: "Software", descripcion: "Entrevista para desarrollo frontend", activo: true },
            { id: 2, nombre: "Redes", descripcion: "Entrevista para configuracion basica", activo: false },
            { id: 3, nombre: "Administración", descripcion: "Entrevista para sistemas de finanzas personales", activo: true }
        ]);
    }, []);

    const handleAgregar = () => {
        console.log("Agregar categoría");
    };

    const handleEditar = (id) => {
        console.log("Editar categoría:", id);
    };

    const handleToggleActivo = (id) => {
        setCategorias(prev =>
            prev.map(cat =>
                cat.id === id ? { ...cat, activo: !cat.activo } : cat
            )
        );
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
                            <p className="text-sm mt-1 text-[var(--color-gris-900)]">Simuladores: {cat.totalSimuladores || 2}</p>

                            <div className="absolute top-2 right-3 flex gap-1">
                                <button
                                    onClick={() => handleEditar(cat.id)}
                                    title="Editar"
                                    className="p-1 rounded-md hover:bg-white hover:shadow transition"
                                >
                                    <FaEdit className="text-[var(--color-verde-feedback)]" />
                                </button>
                                <button
                                    onClick={() => handleToggleActivo(cat.id)}
                                    title={cat.activo ? "Desactivar" : "Activar"}
                                    className="p-1 rounded-md hover:bg-white hover:shadow transition"
                                >
                                    {cat.activo ? (
                                        <FaToggleOn className="text-[var(--color-lavanda-700)]" />
                                    ) : (
                                        <FaToggleOff className="text-gray-500" />
                                    )}
                                </button>
                            </div>

                            <Link
                                to={`/admin/categoria/${cat.id}`}
                                className={`mt-4 block text-right text-sm ${cat.activo ? "text-[var(--color-lavanda-700)] hover:underline" : "text-gray-500 pointer-events-none"}`}
                            >
                                Ver simuladores
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CategoriasAdmin;
