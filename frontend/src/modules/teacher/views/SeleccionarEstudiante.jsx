import { useState, useEffect } from "react";
import { FaSearch, FaUser } from "react-icons/fa";
import Paginacion from "../../../components/Paginacion";

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
  const [paginaActual, setPaginaActual] = useState(1);
  const [seleccionados, setSeleccionados] = useState([]);

  const estudiantesPorPagina = 6;

  const estudiantesFiltrados = estudiantesMock.filter((e) =>
    e.categorias.some((cat) =>
      cat.toLowerCase().includes(busqueda.toLowerCase())
    )
  );

  const totalPaginas = Math.ceil(estudiantesFiltrados.length / estudiantesPorPagina);
  const indexInicio = (paginaActual - 1) * estudiantesPorPagina;
  const indexFin = indexInicio + estudiantesPorPagina;
  const estudiantesPaginados = estudiantesFiltrados.slice(indexInicio, indexFin);

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda]);

  const toggleSeleccion = (id) => {
    if (seleccionados.includes(id)) {
      setSeleccionados(seleccionados.filter((sid) => sid !== id));
    } else {
      setSeleccionados([...seleccionados, id]);
    }
  };

  const aceptarSeleccionados = () => {
    const aceptados = estudiantesMock.filter((e) => seleccionados.includes(e.id));
    console.log("✅ Estudiantes aceptados:", aceptados);
    setSeleccionados([]);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/*  Buscador */}
      <div className="relative flex items-center mb-6">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <FaSearch />
        </span>
        <input
          type="text"
          placeholder="Buscar por categoría..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full pl-10 p-2 border border-[var(--color-gris-300)] rounded-xl shadow-sm focus:outline-none"
        />
      </div>

      {/* Botón aceptar */}
      {seleccionados.length > 0 && (
        <div className="mb-4">
          <button
            onClick={aceptarSeleccionados}
            className="bg-[var(--color-lavanda-700)] text-white font-medium py-2 px-5 rounded-lg hover:bg-[var(--color-lavanda-600)] transition"
          >
            Aceptar {seleccionados.length} estudiante{seleccionados.length > 1 ? "s" : ""}
          </button>
        </div>
      )}

      {/* Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {estudiantesPaginados.map((estudiante) => {
          const estaSeleccionado = seleccionados.includes(estudiante.id);
          return (
            <div
              key={estudiante.id}
              className={`relative bg-white shadow-md border border-[var(--color-gris-200)] rounded-xl p-4 flex flex-col gap-3 ${
                estaSeleccionado ? "ring-2 ring-[var(--color-lavanda-600)]" : ""
              }`}
            >
              {/* Contador simuladores */}
              <div className="absolute top-3 right-3 flex flex-col items-center text-center">
                <span className="bg-[var(--color-lavanda-600)] text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center shadow">
                  {estudiante.simuladores.length}
                </span>
                <span className="text-[10px] text-[var(--color-gris-600)] mt-1 leading-tight">
                  Simuladores<br />contestados
                </span>
              </div>

              {/* Info estudiante */}
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

              {/* Categorías */}
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

              {/* Checkbox abajo derecha */}
              <div className="flex justify-end mt-auto">
                <label className="flex items-center gap-2 text-sm text-[var(--color-gris-700)]">
                  <span>Seleccionar</span>
                  <input
                    type="checkbox"
                    checked={estaSeleccionado}
                    onChange={() => toggleSeleccion(estudiante.id)}
                    className="w-5 h-5 accent-[var(--color-lavanda-600)]"
                  />
                </label>
              </div>
            </div>
          );
        })}
      </div>

      {/* Paginación */}
      <Paginacion
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        onPageChange={(nuevaPagina) => setPaginaActual(nuevaPagina)}
      />
    </div>
  );
};

export default SeleccionarEstudiante;
