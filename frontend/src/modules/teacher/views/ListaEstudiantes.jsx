import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaAngleLeft, FaAngleRight, FaSearch } from "react-icons/fa";

const ListaEstudiantes = () => {
    const navigate = useNavigate();

    const estudiantes = [
        {
            nombre: "Ana García López",
            correo: "ana.garcia@universidad.edu.mx",
            matricula: "20230001",
            categorias: 3,
            simuladores: 7,
        },
        {
            nombre: "Carlos Rodríguez Mendoza",
            correo: "carlos.rodriguez@universidad.edu.mx",
            matricula: "20230002",
            categorias: 2,
            simuladores: 5,
        },
        {
            nombre: "María Elena Jiménez",
            correo: "maria.jimenez@universidad.edu.mx",
            matricula: "20230003",
            categorias: 4,
            simuladores: 9,
        },
        {
            nombre: "Diego Hernández Castro",
            correo: "diego.hernandez@universidad.edu.mx",
            matricula: "20230004",
            categorias: 2,
            simuladores: 6,
        },
        {
            nombre: "Sofía Torres Ramírez",
            correo: "sofia.torres@universidad.edu.mx",
            matricula: "20230005",
            categorias: 5,
            simuladores: 10,
        },
        {
            nombre: "Luis Alberto Morales",
            correo: "luis.morales@universidad.edu.mx",
            matricula: "20230006",
            categorias: 3,
            simuladores: 7,
        },
        {
            nombre: "Otra Estudiante",
            correo: "otra@universidad.edu.mx",
            matricula: "20230007",
            categorias: 4,
            simuladores: 3,
        },
    ];

    const [busquedaCorreo, setBusquedaCorreo] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);
    const estudiantesPorPagina = 6;

    const filtrados = estudiantes.filter((e) =>
        e.correo.toLowerCase().includes(busquedaCorreo.toLowerCase())
    );

    const totalPaginas = Math.ceil(filtrados.length / estudiantesPorPagina);

    const estudiantesMostrados = filtrados.slice(
        (paginaActual - 1) * estudiantesPorPagina,
        paginaActual * estudiantesPorPagina
    );

    const cambiarPagina = (nuevaPagina) => {
        if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
            setPaginaActual(nuevaPagina);
        }
    };

    return (
        <div className="p-4">
            <div className="bg-[var(--white)] p-6 rounded-xl shadow-md border border-[var(--color-gris-100)]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                    <h1 className="text-xl font-semibold text-[var(--primary)]">
                        Mis estudiantes seleccionados
                    </h1>
                    <div className="relative w-full max-w-xs">
                        <span className="absolute inset-y-0 right-4 flex items-center text-gray-400">
                            <FaSearch />
                        </span>
                        <input
                            type="text"
                            placeholder="Buscar por correo..."
                            className="pl-5 pr-4 py-2 w-full border border-[var(--blue)] rounded-full text-sm bg-[var(--color-nude-100)] focus:outline-none focus:ring focus:ring-[var(--color-lavanda-300)]"
                            value={busquedaCorreo}
                            onChange={(e) => {
                                setBusquedaCorreo(e.target.value);
                                setPaginaActual(1);
                            }}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto pt-2">
                    <table className="min-w-full divide-y divide-[var(--blue)]">
                        <thead className="bg-[var(--color-lavanda-200)]">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--color-lavanda-950)] rounded-tl-lg">Nombre</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--color-lavanda-950)]">Correo</th>
                                <th className="px-4 py-3 text-center text-sm font-medium text-[var(--color-lavanda-950)]">Matrícula</th>
                                <th className="px-4 py-3 text-center text-sm font-medium text-[var(--color-lavanda-950)]">Categorías</th>
                                <th className="px-4 py-3 text-center text-sm font-medium text-[var(--color-lavanda-950)]">Simuladores</th>
                                <th className="px-4 py-3 text-center text-sm font-medium text-[var(--color-lavanda-950)] rounded-tr-lg">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-gris-300)] bg-[var(--white)]">
                            {estudiantesMostrados.map((estudiante, idx) => (
                                <tr key={idx} className="hover:bg-[var(--color-lavanda-100)] transition-colors">
                                    <td className="px-4 py-3 text-sm text-gray-800">{estudiante.nombre}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{estudiante.correo}</td>
                                    <td className="px-4 py-3 text-center text-sm">
                                        <span className="bg-[var(--color-lavanda-300)] text-[var(--color-lavanda-950)] font-semibold py-1 px-3 rounded-full text-xs">
                                            {estudiante.matricula}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center text-sm text-gray-700">{estudiante.categorias}</td>
                                    <td className="px-4 py-3 text-center text-sm text-gray-700">{estudiante.simuladores}</td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            className="bg-[var(--color-lavanda-700)] text-white text-sm font-semibold px-4 py-1 rounded-full hover:bg-[var(--color-lavanda-800)] transition duration-300 shadow"
                                            onClick={() => navigate(`/evaluar/${estudiante.matricula}`)}
                                        >
                                            Evaluar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {estudiantesMostrados.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-4 py-4 text-center text-gray-500 text-sm">
                                        No se encontraron resultados
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>


                {totalPaginas > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
                        <button
                            className="px-2 py-1 rounded-full text-sm bg-[var(--color-gris-200)] hover:bg-[var(--color-gris-300)] text-[var(--color-gris-900)]"
                            onClick={() => cambiarPagina(paginaActual - 1)}
                            disabled={paginaActual === 1}
                        >
                            <FaAngleLeft />
                        </button>

                        {[...Array(totalPaginas)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => cambiarPagina(i + 1)}
                                className={`px-3 py-1 rounded-full text-sm font-medium ${paginaActual === i + 1
                                    ? "bg-[var(--color-lavanda-700)] text-white"
                                    : "bg-[var(--color-lavanda-200)] text-[var(--color-lavanda-950)] hover:bg-[var(--color-lavanda-300)]"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            className="px-2 py-1 rounded-full text-sm bg-[var(--color-gris-200)] hover:bg-[var(--color-gris-300)] text-[var(--color-gris-900)]"
                            onClick={() => cambiarPagina(paginaActual + 1)}
                            disabled={paginaActual === totalPaginas}
                        >
                            <FaAngleRight />
                        </button>
                    </div>
                )}


            </div>
        </div>
    );
};

export default ListaEstudiantes;