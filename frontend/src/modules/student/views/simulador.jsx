import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useParams } from "react-router";
import { FaReply } from "react-icons/fa";

const Simuladores = () => {
    const { categoriaId } = useParams();
    const [simuladores, setSimuladores] = useState([]);

    useEffect(() => {
        setSimuladores([
            { id: 10, nombre: 'Desarollo de Software' },
            { id: 11, nombre: 'Soporte Tecnico' }
        ]);
    }, [categoriaId]);

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-[var(--primary)]">Simuladores Disponibles</h1>
                <div className="flex gap-4">
                    <Link to={`/student/simuladores`}
                        className="bg-[var(--color-gris-600)] text-[var(--color-blanco)] font-semibold px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-[var(--color-gris-700)]">
                        <FaReply /> Volver a las categorias
                    </Link>
                </div>
            </div>
            <div className="space-y-4">
                {simuladores.map((simulador) => (
                    <Link
                        key={simulador.id}
                        to={`/student/formulario/${simulador.id}`}
                        className="block bg-[var(--color-nude-200)] hover:bg-[var(--color-nude-300)] text-[var(--color-nude-950)] font-semibold px-6 py-4 rounded-xl shadow-sm transition"
                    >
                        {simulador.nombre}
                    </Link>
                ))}
            </div>
        </div>
    );

}

export default Simuladores;