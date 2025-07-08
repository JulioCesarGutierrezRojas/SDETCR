import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaChevronRight, FaPlus } from "react-icons/fa";

const SimuladoresAdmin = () => {

    const { categoriaId } = useParams();
    const [simuladores, setSimuladores] = useState([]);

    useEffect(() => {
        setSimuladores([
            { id: 101, nombre: "Desarrollador Backend" },
            { id: 102, nombre: "Soporte Técnico" }
        ]);
    }, [categoriaId]);

    const handleAgregar = () => {
        console.log("Agregar simulador");
    };

    const handleEditar = (id) => {
        console.log("Editar simulador:", id);
    };

    const handleEliminar = (id) => {
        console.log("Eliminar simulador:", id);
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-[var(--color-lavanda-700)]">Simuladores</h1>
                <button
                    onClick={handleAgregar}
                    className="flex items-center gap-2 px-4 py-2 rounded bg-[var(--color-lavanda-700)] text-white hover:bg-[var(--color-lavanda-500)] transition"
                >
                    <FaPlus />
                    Agregar simulador
                </button>
            </div>

            <div className="space-y-4">
                {simuladores.map((sim) => (
                    <div
                        key={sim.id}
                        className="flex justify-between items-center bg-[var(--color-gris-300)] p-4 rounded-lg shadow hover:shadow-lg transition border border-[var(--color-gris-500)]"
                    >
                        <span className="text-[var(--color-gris-950)] font-medium">{sim.nombre}</span>

                        <div className="flex gap-4 text-[var(--color-lavanda-700)]">
                            <button onClick={() => handleEditar(sim.id)}>
                                <FaEdit className="hover:text-[var(--color-lavanda-900)]" />
                            </button>

                            <button onClick={() => handleEliminar(sim.id)}>
                                <FaTrash className="hover:text-[var(--color-rojo-error)]" />
                            </button>

                            <Link to={`/admin/simulador/${sim.id}`}>
                                <FaChevronRight className="hover:text-[var(--color-lavanda-900)]" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SimuladoresAdmin;