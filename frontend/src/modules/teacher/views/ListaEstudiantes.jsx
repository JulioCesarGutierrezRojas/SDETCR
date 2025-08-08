import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaAngleLeft, FaAngleRight, FaSearch, FaUsers } from "react-icons/fa";
import { getStudentsByMentor } from "../adapters/teacher.controller";
import { showErrorToast } from "../../../kernel/alerts";
import Loader from "../../../components/Loader";

const ListaEstudiantes = () => {
    const navigate = useNavigate();

    const [estudiantes, setEstudiantes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busquedaCorreo, setBusquedaCorreo] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);
    const [mentorInfo, setMentorInfo] = useState(null);
    const [totalStudents, setTotalStudents] = useState(0);

    const estudiantesPorPagina = 6;

    // Obtener información del usuario logueado
    const getUserInfo = () => {
        try {
            const userName = localStorage.getItem('user');
            const userId = localStorage.getItem('userId');
            const userEmail = localStorage.getItem('email');
            const userRole = localStorage.getItem('role');
            
            if (!userName || !userId) {
                console.warn('⚠️ No se encontró información completa del usuario en localStorage');
                return null;
            }
            
            return {
                id: userId,
                user_id: userId,
                name: userName,
                email: userEmail,
                role: userRole
            };
        } catch (error) {
            console.error('❌ Error al obtener información del usuario:', error);
            return null;
        }
    };

    useEffect(() => {
        fetchEstudiantesAsignados();
    }, []);

    const fetchEstudiantesAsignados = async () => {
        try {
            setLoading(true);
            const userInfo = getUserInfo();
            
            if (!userInfo) {
                showErrorToast({ 
                    title: "Error", 
                    text: "No se pudo obtener la información del usuario. Por favor, inicia sesión nuevamente." 
                });
                return;
            }
            
            const userId = userInfo.user_id || userInfo.id;
            console.log('📊 Obteniendo estudiantes para mentor ID:', userId);
            
            const response = await getStudentsByMentor(userId);
            console.log('📊 Respuesta de estudiantes asignados:', response);
            
            const data = response.result || {};
            const estudiantesData = data.students || [];
            const mentorData = data.mentor || null;
            const total = data.totalStudents || 0;
            
            console.log('📊 Estudiantes asignados:', estudiantesData);
            console.log('📊 Info del mentor:', mentorData);
            console.log('📊 Total estudiantes:', total);
            
            setEstudiantes(estudiantesData);
            setMentorInfo(mentorData);
            setTotalStudents(total);
        } catch (error) {
            console.error("❌ Error al obtener estudiantes asignados:", error.message);
            showErrorToast({ 
                title: "Error", 
                text: "No se pudieron cargar los estudiantes asignados" 
            });
        } finally {
            setLoading(false);
        }
    };

    const filtrados = (Array.isArray(estudiantes) ? estudiantes : []).filter((e) => {
        const email = e.email || e.correo || '';
        const nombre = `${e.name || ''} ${e.lastname || ''}` || e.nombre || '';
        const matricula = e.enrollment || e.matricula || '';
        const busquedaLower = busquedaCorreo.toLowerCase();
        
        return email.toLowerCase().includes(busquedaLower) ||
               nombre.toLowerCase().includes(busquedaLower) ||
               matricula.toLowerCase().includes(busquedaLower);
    });

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

    if (loading) {
        return <Loader isLoading={true} />;
    }

    return (
        <div className="p-4 relative">

            <div className="mb-6">
                <div className="flex bg-white shadow-md rounded-xl border border-[var(--color-gris-100)] overflow-hidden">
                    <div className="w-[7px] bg-[var(--color-lavanda-600)]" />
                    <div className="flex justify-between items-center flex-1 p-3.5">
                        <div>
                            <p className="text-sm text-[var(--color-gris-800)]">Total Estudiantes</p>
                            <p className="text-2xl font-semibold text-[var(--color-lavanda-800)]">{totalStudents}</p>
                        </div>
                        <div className="text-[var(--color-lavanda-600)] text-3xl pr-2">
                            <FaUsers />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-[var(--color-blanco)] p-6 rounded-xl shadow-lg border border-[var(--color-gris-100)]">
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
                            placeholder="Buscar por nombre, correo o matrícula..."
                            className="pl-5 pr-4 py-2 w-full border border-[var(--blue)] rounded-full text-sm bg-[var(--color-blanco)] focus:outline-none focus:ring focus:ring-[var(--color-lavanda-300)]"
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
                        <tbody className="divide-y divide-[var(--color-gris-300)] bg-[var(--color-blanco)]">
                            {estudiantesMostrados.map((estudiante, idx) => {
                                const estudianteId = estudiante.user_id;
                                const nombre = `${estudiante.name || ''} ${estudiante.lastname || ''}`.trim();
                                const email = estudiante.email;
                                const matricula = estudiante.enrollment;
                                const categorias = Array.isArray(estudiante.category) ? estudiante.category.length : 0;
                                
                                return (
                                    <tr key={estudianteId || idx} className="hover:bg-[var(--color-lavanda-100)] transition-colors">
                                        <td className="px-4 py-3 text-sm text-gray-800">{nombre}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{email}</td>
                                        <td className="px-4 py-3 text-center text-sm">
                                            <span className="bg-[var(--color-lavanda-300)] text-[var(--color-lavanda-950)] font-semibold py-1 px-3 rounded-full text-xs">
                                                {matricula}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center text-sm text-gray-700">{categorias}</td>
                                        <td className="px-4 py-3 text-center text-sm text-gray-700">-</td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                className="bg-[var(--color-lavanda-700)] text-white text-sm font-semibold px-4 py-1 rounded-full hover:bg-[var(--color-lavanda-900)] transition duration-300 shadow"
                                                onClick={() => navigate(`/teacher/evaluarEstudiante?studentId=${estudianteId}`)}
                                            >
                                                Evaluar
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {estudiantesMostrados.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-4 py-8 text-center">
                                        <div className="flex flex-col items-center justify-center py-8">
                                            <FaUsers className="text-gray-400 text-4xl mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                {busquedaCorreo ? 'No se encontraron estudiantes' : 'No tienes estudiantes asignados'}
                                            </h3>
                                            <p className="text-gray-600 text-sm">
                                                {busquedaCorreo ? 
                                                    `No hay estudiantes que coincidan con "${busquedaCorreo}"` : 
                                                    'Aún no tienes estudiantes asignados a tu mentoría'
                                                }
                                            </p>
                                        </div>
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