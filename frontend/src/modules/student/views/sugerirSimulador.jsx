import React, { useState } from "react";
import { FaUser} from "react-icons/fa";

const SugerirSimulador = () => {

    const student = {
        nombre: 'Juan Perwez',
        correo: 'juan.perez@universidad.edu.mx',
        matricula: '20230001',
    };

    const [formData, setFormData] = useState({
        categoria: "",
        simulador: "",
        descripcion: "",
        fecha: new Date().toLocaleDateString("es-MX"),
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Sugerencia enviada:", formData);
    };

    return (
        <div className="p-4">
            <div className="flex bg-white shadow-md rounded-xl border border-[var(--color-gris-200)] overflow-hidden mb-6">
                <div className="w-[7px] bg-[var(--color-lavanda-600)]" />
                <div className="flex items-center space-x-4 p-3">
                    <div className="bg-[var(--color-lavanda-200)] p-3 rounded-full">
                        <FaUser className="text-[var(--color-lavanda-700)] text-xl" />
                    </div>
                    <div>
                        <p className="font-semibold text-[var(--color-gris-900)]">{student.nombre}</p>
                        <p className="text-sm text-[var(--color-gris-700)]">Correo: {student.correo}</p>
                        <p className="text-sm text-[var(--color-gris-700)]">Matrícula: {student.matricula}</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-xl border border-[var(--color-gris-400)] space-y-4">
                <h2 className="text-xl font-semibold text-[var(--color-lavanda-700)] pb-2">
                    Sugerencia de Nuevo Simulador
                </h2>

                <div>
                    <label className="block mb-1 font-medium text-sm text-[var(--color-gris-900)]">
                        Nombre de la categoría sugerida
                    </label>
                    <input
                        type="text"
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleChange}
                        className="w-full border border-[var(--color-gris-500)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lavanda-400)]"
                        placeholder="Ej. Redes, Seguridad, Programación"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium text-sm text-[var(--color-gris-900)]">
                        Nombre del simulador sugerido
                    </label>
                    <input
                        type="text"
                        name="simulador"
                        value={formData.simulador}
                        onChange={handleChange}
                        className="w-full border border-[var(--color-gris-500)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lavanda-400)]"
                        placeholder="Ej. Simulador de IPs, Firewall básico"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium text-sm text-[var(--color-gris-900)]">
                        Tipo de preguntas o contenido sugerido
                    </label>
                    <textarea
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        rows={4}
                        className="w-full border border-[var(--color-gris-500)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lavanda-400)]"
                        placeholder="Describe el tipo de preguntas, temas o dinámicas que debería tener el simulador..."
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium text-sm text-[var(--color-gris-900)]">
                        Fecha de sugerencia
                    </label>
                    <input
                        type="text"
                        name="fecha"
                        value={formData.fecha}
                        readOnly
                        className="w-full bg-gray-100 border border-[var(--color-gris-500)] rounded-lg px-3 py-2 text-sm text-[var(--color-gris-800)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lavanda-400)]"
                    />
                </div>

                <div className="text-right">
                    <button type="submit"
                        className="bg-[var(--color-lavanda-600)] text-[var(--color-blanco)] px-5 py-2 rounded-lg hover:bg-[var(--color-lavanda-800)] transition"
                    >
                        Enviar sugerencia
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SugerirSimulador;