import { useParams, useLocation, Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";

const mockSimuladores = [
  {
    id: "sim1",
    titulo: "Simulador: Desarrollo de Software",
    categoria: "Tecnología",
    fecha: "2025-07-01",
  },
  {
    id: "sim2",
    titulo: "Simulador: Atención al Cliente",
    categoria: "Servicios",
    fecha: "2025-06-25",
  },
];

const mockEstudiante = {
  nombre: "Juan",
  apellido: "Perwez",
  correo: "juan.perez@universidad.edu.mx",
  matricula: "20230001",
};

export const StudentSimulators = () => {
  const { estudianteID } = useParams();
  const location = useLocation();
  const { nombre, apellido } = location.state || mockEstudiante;

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Título arriba */}
      <h1 className="text-2xl font-bold text-[var(--color-lavanda-700)] pb-5">
        Historial de Simuladores
      </h1>

      {/* Recuadro con datos del estudiante */}
      <div className="flex bg-white shadow-md rounded-xl border border-[var(--color-gris-200)] overflow-hidden mb-6">
        <div className="w-[7px] bg-[var(--color-lavanda-600)]" />
        <div className="flex items-center space-x-4 p-3">
          <div className="bg-[var(--color-lavanda-200)] p-3 rounded-full">
            <FaUser className="text-[var(--color-lavanda-700)] text-xl" />
          </div>
          <div>
            <p className="font-semibold text-[var(--color-gris-900)]">
              {nombre} {apellido}
            </p>
            <p className="text-sm text-[var(--color-gris-700)]">
              Correo: {mockEstudiante.correo}
            </p>
            <p className="text-sm text-[var(--color-gris-700)]">
              Matrícula: {mockEstudiante.matricula}
            </p>
          </div>
        </div>
      </div>

      {/* Lista de simuladores */}
      <div className="grid gap-4">
        {mockSimuladores.map((sim) => (
          <div
            key={sim.id}
            className="border border-[var(--color-lavanda-500)] rounded-lg p-4 shadow hover:shadow-md transition"
          >
            <h2 className="text-xl font-bold text-[var(--color-lavanda-700)]">
              {sim.titulo}
            </h2>
            <p>Categoría: {sim.categoria}</p>
            <p>Fecha: {sim.fecha}</p>
            
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
