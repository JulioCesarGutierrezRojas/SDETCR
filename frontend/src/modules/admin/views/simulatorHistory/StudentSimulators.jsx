// MOCK DATA (puedes moverlo a otro archivo luego)
import { useParams, useLocation, Link } from "react-router-dom";

const mockSimuladores = [
  {
    id: "sim1",
    titulo: "Simulador: Desarrollo de Software",
    categoria: "Tecnología",
    fecha: "2025-07-01",
    estado: "Completado",
  },
  {
    id: "sim2",
    titulo: "Simulador: Atención al Cliente",
    categoria: "Servicios",
    fecha: "2025-06-25",
    estado: "En progreso",
  },
];

//1. Lista de simuladores del estudiante


export const StudentSimulators = () => {
  const { estudianteID } = useParams();
  //para mostrar el nombre
  const location = useLocation();
  const { nombre, apellido } = location.state || {};

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4 text-[var(--primary)]">
        Historial de Simuladores de {nombre ? `${nombre} ${apellido}` : `Estudiante #${estudianteID}`}
      </h1>
      <div className="grid gap-4">
        {mockSimuladores.map((sim) => (
          <div
            key={sim.id}
            className="border border-[var(--color-lavanda-500)] rounded-lg p-4 shadow hover:shadow-md transition"
          >
            <h2 className="text-xl font-bold text-[var(--color-lavanda-700)]">{sim.titulo}</h2>
            <p>Categoría: {sim.categoria}</p>
            <p>Fecha: {sim.fecha}</p>
            <p className="font-medium text-sm mt-1">
              Estado: <span className="text-green-600">{sim.estado}</span>
            </p>
            <Link
              to={`/admin/historial/${estudianteID}/${sim.id}`}
              className="inline-block mt-3 px-4 py-2 bg-[var(--color-lavanda-700)] text-white rounded hover:bg-[var(--color-lavanda-500)]"
            >
              Ver detalle
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
export default StudentSimulators;