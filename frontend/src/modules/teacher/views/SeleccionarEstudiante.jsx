import { useState, useEffect } from "react";
import { FaSearch, FaUser } from "react-icons/fa";
import Paginacion from "../../../components/Paginacion";
import { getAllStudentsWithSimulatorCount, assignStudentsToMentor } from "../adapters/teacher.controller";
import { showSuccessToast, showErrorToast, showConfirmation } from "../../../kernel/alerts";
import Loader from "../../../components/Loader";

const SeleccionarEstudiante = () => {
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [seleccionados, setSeleccionados] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const estudiantesPorPagina = 6;

  // Obtener información del usuario logueado
  const getUserInfo = () => {
    try {
      // Según auth.controller.js, la información se guarda por separado
      const userName = localStorage.getItem('user');      // Solo el nombre
      const userId = localStorage.getItem('userId');      // El ID del usuario
      const userEmail = localStorage.getItem('email');    // El email
      const userRole = localStorage.getItem('role');      // El rol
      
      console.log('🔍 Datos del localStorage:');
      console.log('  - user (nombre):', userName);
      console.log('  - userId:', userId);
      console.log('  - email:', userEmail);
      console.log('  - role:', userRole);
      
      if (!userName || !userId) {
        console.warn('⚠️ No se encontró información completa del usuario en localStorage');
        return null;
      }
      
      // Construir el objeto usuario
      const userInfo = {
        id: userId,
        user_id: userId,  // Para compatibilidad
        name: userName,
        email: userEmail,
        role: userRole
      };
      
      console.log('👤 Usuario construido:', userInfo);
      return userInfo;
    } catch (error) {
      console.error('❌ Error al obtener información del usuario:', error);
      return null;
    }
  };

  // Fetch estudiantes al cargar el componente
  useEffect(() => {
    fetchEstudiantes();
  }, []);

  const fetchEstudiantes = async () => {
    try {
      setLoading(true);
      const response = await getAllStudentsWithSimulatorCount();
      console.log('📊 Respuesta completa de la API:', response);
      console.log('📊 response.result:', response.result);
      console.log('📊 response.result.students:', response.result?.students);
      
      // Los estudiantes están en response.result.students según el backend
      const estudiantesData = response.result?.students || [];
      console.log('📊 Estudiantes obtenidos:', estudiantesData);
      setEstudiantes(estudiantesData);
    } catch (error) {
      console.error("❌ Error al obtener estudiantes:", error.message);
      showErrorToast({ 
        title: "Error", 
        text: "No se pudieron cargar los estudiantes" 
      });
    } finally {
      setLoading(false);
    }
  };

  // Filtrar estudiantes por nombre, apellido o matrícula
  const estudiantesFiltrados = (Array.isArray(estudiantes) ? estudiantes : []).filter((e) => {
    const nombreCompleto = `${e.name || ''} ${e.lastname || ''}`.toLowerCase();
    const matricula = (e.enrollment || '').toLowerCase();
    const busquedaLower = busqueda.toLowerCase();
    
    return nombreCompleto.includes(busquedaLower) || matricula.includes(busquedaLower);
  });

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
    if (seleccionados.length === 0) {
      showErrorToast({ 
        title: "Error", 
        text: "Debe seleccionar al menos un estudiante" 
      });
      return;
    }

    const estudiantesSeleccionados = (Array.isArray(estudiantes) ? estudiantes : []).filter((e) => {
      const estudianteId = e.student_id || e.user_id;
      return seleccionados.includes(estudianteId);
    });
    const nombresEstudiantes = estudiantesSeleccionados.map(e => `${e.name} ${e.lastname}`).join(", ");
    
    showConfirmation(
      "Confirmar selección",
      `¿Estás seguro de que deseas asignar los siguientes estudiantes a tu mentoría?\n\n${nombresEstudiantes}`,
      "question",
      async () => {
        try {
          setSubmitting(true);
          const userInfo = getUserInfo();
          
          console.log('🔍 userInfo obtenido:', userInfo);
          
          if (!userInfo) {
            throw new Error("No se encontró información del usuario. Por favor, inicia sesión nuevamente.");
          }
          
          // Intentar diferentes campos para el ID del usuario
          const userId = userInfo.user_id || userInfo.id;
          console.log('🆔 userId a usar:', userId);
          
          if (!userId) {
            throw new Error("No se pudo obtener el ID del usuario. Estructura del usuario: " + JSON.stringify(userInfo));
          }
          
          console.log('📤 Enviando asignación - mentorId:', userId, 'studentIds:', seleccionados);
          await assignStudentsToMentor(userId, seleccionados);
          
          showSuccessToast({ 
            title: "¡Éxito!", 
            text: `Se han asignado ${seleccionados.length} estudiante${seleccionados.length > 1 ? 's' : ''} exitosamente` 
          });
          
          setSeleccionados([]);
          // Opcionalmente refrescar la lista
          await fetchEstudiantes();
          
        } catch (error) {
          console.error("Error al asignar estudiantes:", error.message);
          showErrorToast({ 
            title: "Error", 
            text: error.message || "No se pudieron asignar los estudiantes" 
          });
        } finally {
          setSubmitting(false);
        }
      }
    );
  };

  if (loading) {
    return <Loader isLoading={true} />;
  }

  // Validación si no hay estudiantes en el sistema
  if (!loading && (!Array.isArray(estudiantes) || estudiantes.length === 0)) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="text-center py-12">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 max-w-md mx-auto">
            <div className="flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mx-auto mb-4">
              <FaUser className="text-yellow-600 text-2xl" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No hay estudiantes disponibles
            </h2>
            <p className="text-gray-600 text-sm">
              Actualmente no hay estudiantes registrados en el sistema.
              Contacta al administrador para más información.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/*  Buscador */}
      <div className="relative flex items-center mb-6">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <FaSearch />
        </span>
        <input
          type="text"
          placeholder="Buscar por nombre o matrícula..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full pl-10 p-2 border border-[var(--color-gris-300)] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lavanda-300)] focus:border-[var(--color-lavanda-500)]"
        />
      </div>

      {/* Botón aceptar */}
      {seleccionados.length > 0 && (
        <div className="mb-4">
          <button
            onClick={aceptarSeleccionados}
            disabled={submitting}
            className={`font-medium py-2 px-5 rounded-lg transition flex items-center gap-2 ${
              submitting 
                ? "bg-gray-400 text-gray-700 cursor-not-allowed" 
                : "bg-[var(--color-lavanda-700)] text-white hover:bg-[var(--color-lavanda-600)]"
            }`}
          >
            {submitting ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Asignando...
              </>
            ) : (
              `Aceptar ${seleccionados.length} estudiante${seleccionados.length > 1 ? "s" : ""}`
            )}
          </button>
        </div>
      )}

      {/* Tarjetas */}
      {estudiantesPaginados.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {estudiantesPaginados.map((estudiante) => {
            // Usar student_id según la estructura del backend
            const estudianteId = estudiante.student_id || estudiante.user_id;
            const estaSeleccionado = seleccionados.includes(estudianteId);
            return (
              <div
                key={estudianteId}
                className={`relative bg-white shadow-md border border-[var(--color-gris-200)] rounded-xl p-4 flex flex-col gap-3 transition-all ${
                  estaSeleccionado ? "ring-2 ring-[var(--color-lavanda-600)] shadow-lg" : "hover:shadow-lg"
                }`}
              >
                {/* Contador simuladores */}
                <div className="absolute top-3 right-3 flex flex-col items-center text-center">
                  <span className="bg-[var(--color-lavanda-600)] text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center shadow">
                    {estudiante.simulators_answered_count || estudiante.simulators_answered || 0}
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
                      {estudiante.name} {estudiante.lastname}
                    </h3>
                    <p className="text-sm text-[var(--color-gris-600)]">
                      Matrícula: {estudiante.enrollment}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <p className="text-sm text-[var(--color-gris-700)] font-medium">Email:</p>
                  <p className="text-sm text-[var(--color-gris-600)] break-all">
                    {estudiante.email}
                  </p>
                </div>

                {/* Checkbox abajo derecha */}
                <div className="flex justify-end mt-auto">
                  <label className="flex items-center gap-2 text-sm text-[var(--color-gris-700)] cursor-pointer">
                    <span>Seleccionar</span>
                    <input
                      type="checkbox"
                      checked={estaSeleccionado}
                      onChange={() => toggleSeleccion(estudianteId)}
                      disabled={submitting}
                      className={`w-5 h-5 accent-[var(--color-lavanda-600)] ${
                        submitting ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                      }`}
                    />
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-xl p-8 max-w-md mx-auto">
            <FaSearch className="text-gray-400 text-4xl mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron estudiantes
            </h3>
            <p className="text-gray-600 text-sm">
              {busqueda ? 
                `No hay estudiantes que coincidan con "${busqueda}"` : 
                "No hay estudiantes disponibles en este momento"
              }
            </p>
          </div>
        </div>
      )}
      
      {/* Paginación - Solo mostrar si hay más de una página */}
      {totalPaginas > 1 && (
        <Paginacion
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          onPageChange={(nuevaPagina) => setPaginaActual(nuevaPagina)}
        />
      )}
    </div>
  );
};

export default SeleccionarEstudiante;
