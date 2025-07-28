import { useState } from "react";
import { FaSearch, FaUser } from "react-icons/fa";

const estudiantesMock = [
  {
    id: 1,
    nombre: "Andrea Martínez",
    matricula: "20230123",
    categorias: ["Software", "Administración"],
    simuladores: ["Desarrollador Backend", "Analista de Datos"],
  },
  {
    id: 2,
    nombre: "Luis González",
    matricula: "20230144",
    categorias: ["Redes"],
    simuladores: ["Soporte Técnico"],
  },
  {
    id: 3,
    nombre: "Paola Ramírez",
    matricula: "20230177",
    categorias: ["Software"],
    simuladores: ["Desarrollador Backend", "QA"],
  },
  {
    id: 4,
    nombre: "Mario López",
    matricula: "20230199",
    categorias: ["Software", "Redes"],
    simuladores: [
      "Desarrollador Backend",
      "QA",
      "Soporte Técnico",
      "Administrador de Base de Datos",
      "DevOps Engineer",
    ],
  },
];

const SeleccionarEstudiante = () => {
  const [busqueda, setBusqueda] = useState("");

  const estudiantesFiltrados = estudiantesMock.filter((e) =>
    e.categorias.some((cat) =>
      cat.toLowerCase().includes(busqueda.toLowerCase())
    )
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* 🔍 Buscador por categoría */}
      <div className="flex items-center gap-3 mb-6">
        <FaSearch className="text-[var(--color-gris-700)]" />
        <input
          type="text"
          placeholder="Buscar por categoría..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full p-2 border border-[var(--color-gris-300)] rounded-lg shadow-sm focus:outline-none"
        />
      </div>

      {/* 📋 Lista de estudiantes */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {estudiantesFiltrados.map((estudiante) => (
          <div
            key={estudiante.id}
            className="bg-white shadow-md border border-[var(--color-gris-200)] rounded-xl p-4 flex flex-col gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="bg-[var(--color-lavanda-200)] p-3 rounded-full">
                <FaUser className="text-[var(--color-lavanda-700)] text-xl" />
              </div>
              <div>
                <h3 className="text-[var(--color-gris-900)] font-semibold text-lg">
                  {estudiante.nombre}
                </h3>
                <p className="text-sm text-[var(--color-gris-600)]">
                  Matrícula: {estudiante.matricula}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-[var(--color-gris-700)] font-medium">Categorías:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {estudiante.categorias.map((cat, i) => (
                  <span
                    key={i}
                    className="bg-[var(--color-lavanda-100)] text-[var(--color-lavanda-800)] text-xs font-medium px-2 py-1 rounded-full"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-[var(--color-gris-700)] font-medium">Simuladores:</p>
              <ul className="list-disc pl-5 text-sm text-[var(--color-gris-800)] space-y-1">
                {estudiante.simuladores.map((sim, i) => (
                  <li key={i}>{sim}</li>
                ))}
              </ul>
            </div>

            <button className="mt-auto bg-[var(--color-lavanda-700)] text-white font-medium py-2 px-4 rounded-lg hover:bg-[var(--color-lavanda-600)] transition">
              Aceptar estudiante
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeleccionarEstudiante;
