import { useState, useEffect } from "react";
import { Link } from "react-router";

const Categorias = () => {
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        setCategorias([
            { id: 1, nombre: "Desarrollo de Software" },
            { id: 2, nombre: "Manejo de Redes" },
            { id: 3, nombre: "Administración de Empresas" }
        ]);
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold text-[var(--primary)] mb-6">Selecciona una Categoría</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categorias.map((cat) => (
                    <Link
                        key={cat.id}
                        to={`/student/simuladores/${cat.id}`}
                        className="bg-[var(--color-lavanda-200)] hover:bg-[var(--color-lavanda-300)] text-[var(--color-lavanda-900)] font-medium py-6 px-4 rounded-xl shadow-md transition text-center"
                    >
                        {cat.nombre}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Categorias;