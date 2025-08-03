import { useState, useEffect } from "react";
import { Link } from "react-router";
import { FaSearch } from "react-icons/fa";
import { getCategoriesByStudent } from "../adapters/studentCategories.controller";

const Categorias = () => {
    const [categorias, setCategorias] = useState([]);
    const [busquedaCategoria, setBusquedaCategoria] = useState("");

    useEffect(() => {
        const fetchCategorias = async () => {
            const student_id = localStorage.getItem("userId");
    
            if (!student_id) {
                console.warn("No se encontró el ID del estudiante en localStorage");
                return;
            }
    
            try {
                const { categories } = await getCategoriesByStudent(student_id);
    
                const categoriasMapeadas = categories.map(cat => ({
                    id: cat.category_id,
                    nombre: cat.category_name,
                    descripcion: cat.category_description,
                    estatus: "activo"
                }));
    
                setCategorias(categoriasMapeadas);
            } catch (error) {
                console.error("Error al obtener categorías del estudiante:", error.message);
            }
        };
    
        fetchCategorias();
    }, []);

    const categoriasFiltradas = categorias.filter((e) =>
        e.nombre.toLowerCase().includes(busquedaCategoria.toLowerCase())
    );

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4 pb-2">
                <h1 className="text-2xl font-bold text-[var(--primary)]">Selecciona una Categoría</h1>
                <div className="relative w-full max-w-xs">
                    <span className="absolute inset-y-0 right-4 flex items-center text-gray-400">
                        <FaSearch />
                    </span>
                    <input
                        type="text"
                        placeholder="Buscar por nombre de categoria..."
                        className="pl-5 pr-4 py-2 w-full border border-[var(--blue)] rounded-full text-sm bg-[var(--color-blanco)] focus:outline-none focus:ring focus:ring-[var(--color-lavanda-300)]"
                        value={busquedaCategoria}
                        onChange={(e) => {
                            setBusquedaCategoria(e.target.value);
                        }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoriasFiltradas.map((cat) => (
                    <Link
                        key={cat.id}
                        to={cat.estatus === "activo" ? `/student/simuladores/${cat.id}` : "#"}
                        className={`text-center rounded-xl shadow-md transition px-4 py-6
                        ${cat.estatus === "activo"
                                ? "bg-[var(--color-lavanda-200)] hover:bg-[var(--color-lavanda-300)] text-[var(--color-lavanda-900)] cursor-pointer"
                                : "bg-[var(--color-gris-200)] text-[var(--color-gris-700)] cursor-not-allowed"}`}
                    >
                        <p className="text-lg font-semibold mb-1">{cat.nombre}</p>
                        <p className="text-sm mb-2">{cat.descripcion}</p>
                        <span className={`inline-block text-xs font-semibold px-4 py-1 rounded-full border border-[var(--color-gris-500)]
                        ${cat.estatus === "activo" ? "bg-green-100 text-green-700" : "bg-gray-300 text-gray-700"}`}>
                            {cat.estatus === "activo" ? "Activa" : "Inactiva"}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Categorias;