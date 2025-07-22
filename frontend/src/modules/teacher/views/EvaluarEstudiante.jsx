import React, { useState } from 'react';
import { FaUser, FaReply } from 'react-icons/fa';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { useNavigate } from "react-router-dom";

const EvaluarEstudiante = () => {
    const navigate = useNavigate();
    const [expandedCategory, setExpandedCategory] = useState(null);

    const student = {
        nombre: 'Juan Perwez',
        correo: 'juan.perez@universidad.edu.mx',
        matricula: '20230001',
    };

    const categorias = [
        {
            id: 1,
            nombre: 'Desarrollo de Software',
            descripcion: 'Entrevistas técnicas de desarrollo web',
            simuladores: [
                {
                    id: 1,
                    titulo: 'Entrevista para Desarrollador React',
                    fecha: '14/07/2024',
                    calificacion: '8.5/10',
                },
                {
                    id: 2,
                    titulo: 'Entrevista HTML/CSS',
                    fecha: '12/07/2024',
                    calificacion: '9/10',
                },
            ],
        },
        {
            id: 2,
            nombre: 'Administracion de empresas',
            descripcion: 'Evaluación de habilidades blandas',
            simuladores: [
                {
                    id: 3,
                    titulo: 'Entrevista de Comportamiento 1',
                    fecha: '10/07/2024',
                    calificacion: '8.8/10',
                },
                {
                    id: 4,
                    titulo: 'Entrevista de Contabilidad',
                    fecha: '10/07/2024',
                    calificacion: '8.8/10',
                },
            ],
        },
    ];

    return (
        <div className="p-4 space-y-6">

            <div className="flex bg-[var(--color-blanco)] border border-[var(--color-gris-300)] rounded-xl shadow-md overflow-hidden">

                <div className="w-[7px] bg-[var(--color-lavanda-600)]" />
                <div className="flex-1 p-4">
                    <div className="flex items-center space-x-4">
                        <div className="bg-[var(--color-lavanda-200)] p-3 rounded-full">
                            <FaUser className="text-[var(--color-lavanda-700)] text-xl" />
                        </div>
                        <div>
                            <p className="font-semibold text-[var(--color-gris-900)]">{student.nombre}</p>
                            <p className="text-sm text-[var(--color-gris-900)]">Correo: {student.correo}</p>
                            <p className="text-sm text-[var(--color-gris-900)]">Matrícula: {student.matricula}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center mb-4 pb-2 pt-4">
                <h1 className="text-2xl font-bold text-[var(--color-lavanda-700)]">Categorias del Estudiante</h1>
                <button
                    className="bg-[var(--color-gris-600)] text-[var(--color-blanco)] font-semibold px-3 py-1.5 rounded-md flex items-center gap-2 hover:bg-[var(--color-gris-700)]"
                    onClick={() => navigate(`/teacher/estudiantesSeleccionados`)}>
                    <FaReply /> Regresar
                </button>
            </div>

            {categorias.map((cat) => (
                <div key={cat.id} className="bg-[var(--color-lavanda-100)] border border-[var(--color-lavanda-200)] rounded-xl shadow-md">
                    <div className="flex items-center justify-between px-4 py-3 cursor-pointer" onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}>
                        <div>
                            <p className="font-semibold text-[var(--color-lavanda-800)]">{cat.nombre}</p>
                            <p className="text-sm text-[var(--color-gris-800)]">Descripción: {cat.descripcion}</p>
                            <p className="text-sm mt-2 text-[var(--color-gris-900)]">Simuladores respondidos: {cat.simuladores.length}</p>
                        </div>
                        <div className="text-xl p-2 rounded-full transition duration-200 text-[var(--color-lavanda-700)] hover:text-white hover:bg-[var(--color-lavanda-600)] shadow hover:shadow-md">
                            {expandedCategory === cat.id ? <IoIosArrowUp /> : <IoIosArrowDown />}
                        </div>
                    </div>

                    {expandedCategory === cat.id && (
                        <div className="border-t border-[var(--color-gris-200)] divide-y divide-[var(--color-gris-300)] bg-[var(--color-verde-claro)] mt-3">
                            {cat.simuladores.map((sim) => (
                                <div key={sim.id} className="flex items-center justify-between px-4 py-3">
                                    <div>
                                        <p className="font-medium text-[var(--color-gris-900)]">Simulador {sim.titulo}</p>
                                        <p className="text-sm text-[var(--color-gris-700)]">{sim.fecha}</p>
                                        <p className="text-sm mt-2 font-semibold text-[var(--color-lavanda-800)]">Calificación: {sim.calificacion}</p>
                                    </div>
                                    <button className="bg-[var(--color-lavanda-600)] hover:bg-[var(--color-lavanda-700)] text-white text-sm font-semibold px-4 py-2 rounded-xl"
                                    onClick={() => navigate(`/teacher/evaluarSimulador`)}>
                                        Retroalimentar
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default EvaluarEstudiante;