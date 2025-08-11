import { useParams, useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { getStudentCategories, getStudentHistory } from "../../adapters/admin.controller";
import { showErrorToast } from "../../../../kernel/alerts";
import Loader from "../../../../components/Loader";

export const StudentSimulators = () => {
  const { estudianteID } = useParams();
  const location = useLocation();
  
  // Estados del componente
  const [student, setStudent] = useState(null);
  const [simuladores, setSimuladores] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Datos del state o valores por defecto
  const stateData = location.state || {};
  const defaultName = stateData.nombre || stateData.name || "Estudiante";
  const defaultLastname = stateData.apellido || stateData.lastname || "";
  
  useEffect(() => {
    if (estudianteID) {
      fetchStudentData();
    } else {
      showErrorToast({
        title: "Error",
        text: "No se especificó un ID de estudiante"
      });
    }
  }, [estudianteID]);
  
  const fetchStudentData = async () => {
    try {
      setLoading(true);
      console.log('📊 Obteniendo datos del estudiante ID:', estudianteID);
      
      // Obtener información básica del estudiante
      let studentInfo = {
        nombre: defaultName,
        apellido: defaultLastname,
        correo: 'Cargando...',
        matricula: 'Cargando...'
      };
      
      // Intentar obtener información completa del estudiante desde las categorías
      try {
        const categoriesResponse = await getStudentCategories(estudianteID);
        console.log('📊 Respuesta de categorías:', categoriesResponse);
        
        if (categoriesResponse.result && categoriesResponse.result.student) {
          const studentData = categoriesResponse.result.student;
          studentInfo = {
            nombre: studentData.name,
            apellido: studentData.lastname,
            correo: studentData.email,
            matricula: studentData.enrollment
          };
          console.log('📊 Información del estudiante obtenida:', studentInfo);
        } else {
          console.log('📊 Estructura de respuesta inesperada:', categoriesResponse.result);
        }
      } catch (error) {
        console.log('📊 Error al obtener categorías del estudiante:', error.message);
        console.log('📊 Usando datos del state o por defecto');
      }
      
      setStudent(studentInfo);
      
      // Obtener historial de simuladores
      try {
        const historyResponse = await getStudentHistory(estudianteID);
        const historyData = historyResponse.result;
        
        console.log('📊 Historial obtenido:', historyData);
        
        if (historyData && historyData.histories && Array.isArray(historyData.histories)) {
          const simuladoresFormateados = historyData.histories.map(history => ({
            id: history.Simulator.simulator_id,
            titulo: `Simulador: ${history.Simulator.name}`,
            categoria: history.Simulator.Category ? history.Simulator.Category.name : 'Sin categoría',
            fecha: new Date(history.date_realized).toLocaleDateString('es-ES'),
            fechaCompleta: history.date_realized,
            calificacion: history.final_score
          }));
          
          // Ordenar por fecha más reciente primero
          simuladoresFormateados.sort((a, b) => new Date(b.fechaCompleta) - new Date(a.fechaCompleta));
          
          setSimuladores(simuladoresFormateados);
        } else {
          setSimuladores([]);
        }
        
      } catch (historyError) {
        console.log('📊 No se encontró historial para este estudiante');
        setSimuladores([]);
      }
      
    } catch (error) {
      console.error("❌ Error al obtener datos del estudiante:", error.message);
      showErrorToast({
        title: "Error",
        text: "No se pudieron cargar los datos del estudiante"
      });
      
      // Usar datos por defecto en caso de error
      setStudent({
        nombre: defaultName,
        apellido: defaultLastname,
        correo: 'No disponible',
        matricula: 'No disponible'
      });
      setSimuladores([]);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <Loader isLoading={true} />;
  }

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
              {student?.nombre} {student?.apellido}
            </p>
            <p className="text-sm text-[var(--color-gris-700)]">
              Correo: {student?.correo || 'Cargando...'}
            </p>
            <p className="text-sm text-[var(--color-gris-700)]">
              Matrícula: {student?.matricula || 'Cargando...'}
            </p>
          </div>
        </div>
      </div>

      {/* Lista de simuladores */}
      {simuladores && simuladores.length > 0 ? (
        <div className="grid gap-4">
          {simuladores.map((sim) => (
            <div
              key={sim.id}
              className="border border-[var(--color-lavanda-500)] rounded-lg p-4 shadow hover:shadow-md transition"
            >
              <h2 className="text-xl font-bold text-[var(--color-lavanda-700)]">
                {sim.titulo}
              </h2>
              <p>Categoría: {sim.categoria}</p>
              <p>Fecha: {sim.fecha}</p>
              {sim.calificacion && (
                <p className="text-sm font-medium text-[var(--color-lavanda-600)]">
                  Calificación: {sim.calificacion}/10
                </p>
              )}
              
              <Link
                to={`/admin/historial/${estudianteID}/${sim.id}`}
                className="inline-block mt-3 px-4 py-2 bg-[var(--color-lavanda-700)] text-white rounded hover:bg-[var(--color-lavanda-500)] transition-colors"
              >
                Ver detalle
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 max-w-md mx-auto">
            <div className="flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mx-auto mb-4">
              <FaUser className="text-yellow-600 text-2xl" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No hay simuladores realizados
            </h2>
            <p className="text-gray-600 text-sm">
              Este estudiante aún no ha completado ningún simulador.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentSimulators;
