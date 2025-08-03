import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaPlus, FaToggleOn, FaToggleOff } from "react-icons/fa";
import {
    getAllCategories,
    createCategory,
    updateCategory,
    disableCategory
} from "../adapters/categories.controller";

const CategoriasAdmin = () => {
    const [categorias, setCategorias] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [categoriaEditando, setCategoriaEditando] = useState(null);
    const [nuevoNombre, setNuevoNombre] = useState("");
    const [nuevaDescripcion, setNuevaDescripcion] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const {result} = await getAllCategories();
                const categoriasMapeadas = result.map((cat) => ({
                    id: cat.category_id,
                    nombre: cat.name,
                    descripcion: cat.description,
                    activo: cat.status
                }));
                setCategorias(categoriasMapeadas);
            } catch (error) {
                console.error("Error al obtener categorías:", error);
            }
        };
        fetchData();
    }, []);

    const handleAgregar = () => {
        setCategoriaEditando(null);
        setNuevoNombre("");
        setNuevaDescripcion("");
        setMostrarModal(true);
    };

    const handleEditar = (id) => {
        const cat = categorias.find((c) => c.id === id);
        if (cat) {
            setCategoriaEditando(cat);
            setNuevoNombre(cat.nombre);
            setNuevaDescripcion(cat.descripcion);
            setMostrarModal(true);
        }
    };

    const handleGuardarCambios = async () => {
        try {
            let response;
            if (categoriaEditando) {
                response = await updateCategory({
                    id: categoriaEditando.id,
                    name: nuevoNombre,
                    description: nuevaDescripcion
                });
            } else {
                response = await createCategory({
                    name: nuevoNombre,
                    description: nuevaDescripcion
                });
            }

            const {result} = await getAllCategories();
            const categoriasMapeadas = result.map((cat) => ({
                id: cat.category_id,
                nombre: cat.name,
                descripcion: cat.description,
                activo: cat.status
            }));
            setCategorias(categoriasMapeadas);
            setMostrarModal(false);
            setCategoriaEditando(null);

        } catch (error) {
            console.error("Error:", error.message);
        }
    };


    const handleToggleActivo = async (nombre) => {
        try {
            await disableCategory(nombre);
            const {result} = await getAllCategories();
            const categoriasMapeadas = result.map((cat) => ({
                id: cat.category_id,
                nombre: cat.name,
                descripcion: cat.description,
                activo: cat.status
            }));
            setCategorias(categoriasMapeadas);
        } catch (error) {
            console.error("Error al cambiar estado:", error);
        }
    };

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
                                    onClick={() => handleToggleActivo(cat.nombre)}
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

                            <Link to={`/admin/categoria/${cat.id}`}
                                className={`mt-4 block text-right text-sm ${cat.activo ? "text-[var(--color-lavanda-700)] hover:underline" : "text-gray-500 pointer-events-none"}`}>
                                Ver simuladores
                            </Link>
                        </div>
                    );
                })}
            </div>

            {/* MODAL DE EDICIÓN */}
            {mostrarModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-[70%] max-w-md border border-[var(--color-gris-500)]">
                        <h2 className="text-xl font-bold text-[var(--color-lavanda-700)] mb-4">
                            {categoriaEditando ? "Editar Categoría" : "Agregar Categoría"}
                        </h2>

                        <div className="space-y-4">
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-[var(--color-lavanda-500)]"
                                placeholder="Nombre"
                                value={nuevoNombre}
                                onChange={(e) => setNuevoNombre(e.target.value)}
                            />
                            <textarea
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-[var(--color-lavanda-500)]"
                                rows={3}
                                placeholder="Descripción"
                                value={nuevaDescripcion}
                                onChange={(e) => setNuevaDescripcion(e.target.value)}
                            />
                            <div className="flex justify-end gap-2 pt-2">
                                <button className="px-4 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                                    onClick={() => setMostrarModal(false)}>
                                    Cancelar
                                </button>
                                <button className="px-4 py-1 bg-[var(--color-lavanda-700)] text-white rounded-md hover:bg-[var(--color-lavanda-800)]"
                                    onClick={handleGuardarCambios}>
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoriasAdmin;
