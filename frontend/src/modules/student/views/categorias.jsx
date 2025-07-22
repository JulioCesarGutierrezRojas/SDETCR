import { useState, useEffect } from "react";
import { Link } from "react-router";

const Categorias = () => {
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        setCategorias([
            { id: 1, nombre: "Desarrollo de Software", descripcion: "Entrevistas sobre desarrollo junior", estatus: "activo" },
            { id: 2, nombre: "Manejo de Redes", descripcion: "Entrevistas sobre configuración y redes", estatus: "inactivo" },
            { id: 3, nombre: "Administración de Empresas", descripcion: "Entrevistas sobre gestión empresarial", estatus: "activo" }
        ]);
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold text-[var(--primary)] mb-6">Selecciona una Categoría</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categorias.map((cat) => (
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