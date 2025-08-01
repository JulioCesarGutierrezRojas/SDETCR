import React, { useState } from 'react';
import { FaReply } from 'react-icons/fa';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { useNavigate } from "react-router-dom";

const ResultadosEstudiante = () => {
    const navigate = useNavigate();
    const [expandedCategory, setExpandedCategory] = useState(null);


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
                    calificacion: '8',
                    calificacionFinal: null,
                },
                {
                    id: 2,
                    titulo: 'Entrevista HTML/CSS',
                    fecha: '12/07/2024',
                    calificacion: '9',
                    calificacionFinal: '9'
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
                    calificacion: '7',
                    calificacionFinal: null
                },
                {
                    id: 4,
                    titulo: 'Entrevista de Contabilidad',
                    fecha: '10/07/2024',
                    calificacion: '8',
                    calificacionFinal: '9'
                },
            ],
        },
        {
            id: 3,
            nombre: 'Manejo de Redes',
            descripcion: 'Evaluación de configuracion basica de un router',
            simuladores: [
                {
                    id: 5,
                    titulo: 'Seguridad 1',
                    fecha: '10/07/2024',
                    calificacion: '6',
                    calificacionFinal: null
                },
                {
                    id: 6,
                    titulo: 'Entrevista de analisis',
                    fecha: '10/07/2024',
                    calificacion: '5',
                    calificacionFinal: '7'
                },
            ],
        },
    ];

    return (
        <div className="p-4 space-y-6">

            <div className="flex justify-between items-center mb-4 pb-2 ">
                <h1 className="text-2xl font-bold text-[var(--color-lavanda-700)]">Mis categorias y simuladores respondidos</h1>
            </div>

            {categorias.map((cat) => (
                <div key={cat.id} className="bg-[var(--color-lavanda-100)] border border-[var(--color-lavanda-300)] rounded-xl shadow-md">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-3 cursor-pointer relative" onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}>
                        <div>
                            <p className="font-semibold text-[var(--color-lavanda-800)]">Categoria: {cat.nombre}</p>
                            <p className="text-sm text-[var(--color-gris-800)]">Descripción: {cat.descripcion}</p>
                            <p className="text-sm mt-2 text-[var(--color-gris-900)]">Simuladores respondidos: {cat.simuladores.length}</p>
                        </div>
                        <div className="ml-auto flex items-center text-xs text-[var(--color-lavanda-700)] hover:underline mt-4 sm:mt-0 pt-11">
                            <span className="mr-1">Ver simuladores respondidos</span>
                            {expandedCategory === cat.id ? <IoIosArrowUp /> : <IoIosArrowDown />}
                        </div>
                    </div>

                    {expandedCategory === cat.id && (
                        <div className="border-t border-[var(--color-gris-400)] divide-y divide-[var(--color-gris-100)] bg-[var(--color-verde-claro)] mt-3">
                            {cat.simuladores.map((sim) => (
                                <div key={sim.id}
                                    className={`flex items-center justify-between px-4 py-3 rounded-md
                                    ${sim.calificacionFinal
                                            ? sim.calificacionFinal >= 8
                                                ? 'bg-green-100'
                                                : 'bg-red-100'
                                            : 'bg-[var(--color-nude-100)]'
                                        }`}
                                >
                                    <div>
                                        <p className="font-medium text-[var(--color-gris-900)]">Simulador: {sim.titulo}</p>
                                        <p className="text-sm text-[var(--color-gris-700)]">{sim.fecha}</p>
                                        <p className="text-sm mt-2 font-semibold text-[var(--color-lavanda-800)]">
                                            Calificación Automática: {sim.calificacion}/10
                                        </p>
                                        <div className="mt-2">
                                            {sim.calificacionFinal ? (
                                                <span
                                                    className={`text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm
                                                            ${sim.calificacionFinal >= 8
                                                            ? 'bg-green-200 text-green-900 border border-green-300'
                                                            : 'bg-red-200 text-red-900 border border-red-300'
                                                        }`}
                                                >
                                                    {sim.calificacionFinal >= 8 ? '' : ''} Evaluado por el docente: {sim.calificacionFinal}/10
                                                </span>
                                            ) : (
                                                <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm border border-yellow-400">
                                                    Pendiente de evaluación
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button className="bg-[var(--color-lavanda-600)] hover:bg-[var(--color-lavanda-800)] text-white text-sm font-semibold px-4 py-2 rounded-xl"
                                        onClick={() => navigate(`/student/comentariosObtenidos`)}>
                                        Ver comentarios
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

export default ResultadosEstudiante;