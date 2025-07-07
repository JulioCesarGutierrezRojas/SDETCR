import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaChevronRight, FaPlus } from "react-icons/fa";

const CategoriasAdmin = () => {
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        setCategorias([
            { id: 1, nombre: "Software" },
            { id: 2, nombre: "Redes" },
            { id: 3, nombre: "Administración" },
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
                <h1 className="text-2xl font-bold text-[var(--color-lavanda-700)]">Categorías Existentes</h1>
                <button
                    onClick={handleAgregar}
                    className="flex items-center gap-2 px-4 py-2 rounded bg-[var(--color-lavanda-700)] text-white hover:bg-[var(--color-lavanda-500)] transition">
                    <FaPlus />
                    Agregar categoría
                </button>
            </div>

            <div className="space-y-4">
                {categorias.map((cat) => (
                    <div
                        key={cat.id}
                        className="flex justify-between items-center bg-[var(--color-gris-300)] p-4 rounded-lg shadow hover:shadow-lg transition border border-[var(--color-gris-500)]"
                    >
                        <span className="text-[var(--color-gris-950)] font-medium">{cat.nombre}</span>

                        <div className="flex gap-4 text-[var(--color-lavanda-700)]">
                            <button onClick={() => handleEditar(cat.id)}>
                                <FaEdit className="hover:text-[var(--color-lavanda-900)]" />
                            </button>

                            <button onClick={() => handleEliminar(cat.id)}>
                                <FaTrash className="hover:text-[var(--color-rojo-error)]" />
                            </button>

                            <Link to={`/admin/categoria/${cat.id}`}>
                                <FaChevronRight className="hover:text-[var(--color-lavanda-900)]" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default CategoriasAdmin;