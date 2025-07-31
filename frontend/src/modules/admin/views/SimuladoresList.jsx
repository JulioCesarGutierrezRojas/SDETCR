import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaEdit, FaChevronRight, FaPlus, FaTimes } from "react-icons/fa";

const SimuladoresAdmin = () => {

    const { categoriaId } = useParams();
    const [simuladores, setSimuladores] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [formNombre, setFormNombre] = useState("");
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        setSimuladores([
            { id: 101, nombre: "Desarrollador Backend", activo: true },
            { id: 102, nombre: "Soporte Técnico", activo: true }
        ]);
    }, [categoriaId]);

    const handleAgregar = () => {
        setIsEdit(false);
        setFormNombre("");
        setShowModal(true);
    };

    const handleEditar = (id) => {
        const simulador = simuladores.find(s => s.id === id);
        if (simulador) {
            setIsEdit(true);
            setFormNombre(simulador.nombre);
            setEditId(id);
            setShowModal(true);
        }
    };

    const handleGuardar = () => {
        if (formNombre.trim() === "") return;

        if (isEdit) {
            setSimuladores(simuladores.map(s => s.id === editId ? { ...s, nombre: formNombre } : s));
        } else {
            const nuevo = {
                id: Date.now(),
                nombre: formNombre,
                activo: true
            };
            setSimuladores([...simuladores, nuevo]);
        }

        setShowModal(false);
        setFormNombre("");
        setEditId(null);
    };

    const toggleEstatus = (id) => {
        setSimuladores(simuladores.map(s =>
            s.id === id ? { ...s, activo: !s.activo } : s
        ));
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-[var(--color-lavanda-700)]">Simuladores</h1>
                <div className="flex gap-4">
                    <Link to={`/admin/categorias`}
                        className="px-4 py-2 rounded-md bg-[var(--color-gris-800)] text-white font-semibold hover:bg-[var(--color-gris-600)] transition">
                        Atrás
                    </Link>
                    <button
                        onClick={handleAgregar}
                        className="flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--color-lavanda-700)] text-white hover:bg-[var(--color-lavanda-500)] transition">
                        <FaPlus />
                        Agregar simulador
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {simuladores.map((sim) => (
                    <div
                        key={sim.id}
                        className={`flex justify-between items-center p-4 rounded-xl shadow-md border transition
                        ${sim.activo
                                ? "bg-[var(--color-nude-200)] hover:bg-[var(--color-nude-300)] border-[var(--color-nude-300)]"
                                : "bg-[var(--color-gris-200)] text-[var(--color-gris-500)] border-[var(--color-gris-300)]"
                            }`}
                    >
                        <span className={`font-medium ${!sim.activo ? "line-through" : "text-[var(--color-gris-950)]"}`}>
                            {sim.nombre}
                        </span>

                        <div className="flex gap-2 items-center">
                            <button
                                onClick={() => toggleEstatus(sim.id)}
                                className={`text-sm px-3 py-1 rounded-full font-semibold transition
                                ${sim.activo
                                        ? "bg-green-100 text-green-700 hover:bg-green-200 w-19 border border-[var(--color-gris-400)]"
                                        : "bg-gray-300 text-gray-600 hover:bg-gray-400 border border-[var(--color-gris-400)]"
                                    }`}
                            >
                                {sim.activo ? "Activo" : "Inactivo"}
                            </button>

                            <button
                                onClick={() => handleEditar(sim.id)}
                                className="p-2 rounded-full text-[var(--color-lavanda-700)] hover:bg-[var(--color-lavanda-100)] hover:shadow-md transition"
                                title="Editar simulador">
                                <FaEdit />
                            </button>

                            <Link
                                to={`/admin/simulador/${sim.id}`}
                                className="p-2 rounded-full text-[var(--color-lavanda-700)] hover:bg-[var(--color-lavanda-100)] hover:shadow-md transition"
                                title="Ver preguntas">
                                <FaChevronRight />
                            </Link>
                        </div>

                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-5 w-full max-w-md shadow-lg relative border border-[var(--color-gris-400)]">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-red-500">
                            <FaTimes />
                        </button>
                        <h2 className="text-xl font-bold mb-4 text-[var(--color-lavanda-700)]">
                            {isEdit ? "Editar simulador" : "Agregar simulador"}
                        </h2>
                        <input
                            type="text"
                            value={formNombre}
                            onChange={(e) => setFormNombre(e.target.value)}
                            placeholder="Nombre del simulador"
                            className="w-full px-4 py-2 border border-[var(--color-gris-600)] rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-[var(--color-lavanda-500)]"
                        />
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
                                Cancelar
                            </button>
                            <button
                                onClick={handleGuardar}
                                className="px-4 py-2 bg-[var(--color-lavanda-700)] text-white rounded-md hover:bg-[var(--color-lavanda-500)]">
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SimuladoresAdmin;
