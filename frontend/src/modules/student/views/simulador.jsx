import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useParams } from "react-router";

const Simuladores = () => {
    const { categoriaId } = useParams();
    const [simuladores, setSimuladores] = useState([]);

    useEffect(()=>{
        setSimuladores([
            {id: 10, nombre:'Desarollo de Software'},
            {id: 11, nombre:'Soporte Tecnico'}
        ]);
    },[categoriaId]);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold text-[var(--primary)] mb-6">Simuladores Disponibles</h1>
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