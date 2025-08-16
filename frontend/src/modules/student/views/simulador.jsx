import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useParams } from "react-router";
import { FaReply, FaExclamationTriangle } from "react-icons/fa";
import { getSimulatorsByCategory } from "../../admin/adapters/simulators.controller";
import { showErrorToast } from "../../../kernel/alerts";
import Loader from "../../../components/Loader";

const Simuladores = () => {
    const { categoriaID } = useParams();
    const [simuladores, setSimuladores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryInfo, setCategoryInfo] = useState(null);

    useEffect(() => {
        fetchSimuladores();
    }, [categoriaID]);

    const fetchSimuladores = async () => {
        try {
            setLoading(true);
            
            // Validar que tenemos categoriaID válido
            if (!categoriaID || categoriaID === 'undefined' || categoriaID === null || 
                (typeof categoriaID === 'string' && categoriaID.trim() === '')) {
                console.error(`categoriaID es inválido: ${categoriaID}`);
                showErrorToast({
                    title: "Error",
                    text: "ID de categoría inválido"
                });
                return;
            }
            
            const response = await getSimulatorsByCategory(categoriaID);
            
            if (response.result) {
                const { category, simulators } = response.result;
                setCategoryInfo(category);
                
                // Filtrar solo simuladores activos para estudiantes
                const simuladoresActivos = simulators
                    .filter(sim => sim.status === true)
                    .map((sim) => ({
                        id: sim.simulator_id,
                        nombre: sim.simulator_name
                    }));
                
                setSimuladores(simuladoresActivos);
            }
        } catch (error) {
            console.error("Error al obtener simuladores:", error);
            console.error("Categoria ID:", categoriaID);
            
            showErrorToast({
                title: "Error",
                text: error.message || "No se pudieron cargar los simuladores"
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader isLoading={true} />;
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-lavanda-700)]">Simuladores Disponibles</h1>
                    {categoryInfo && (
                        <p className="text-sm text-gray-600 mt-1">
                            Categoría: {categoryInfo.category_name}
                        </p>
                    )}
                </div>
                <div className="flex gap-4">
                    <Link to={`/student/simuladores`}
                        className="bg-[var(--color-gris-600)] text-[var(--color-blanco)] font-semibold px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-[var(--color-gris-700)]">
                        <FaReply /> Volver a las categorías
                    </Link>
                </div>
            </div>

            {simuladores.length === 0 ? (
                <div className="text-center py-12">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-yellow-100 rounded-full">
                            <FaExclamationTriangle className="w-6 h-6 text-yellow-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                            No hay simuladores disponibles
                        </h3>
                        <p className="text-yellow-700 mb-4">
                            Esta categoría no tiene simuladores activos en este momento. Por favor, inténtalo más tarde o consulta con tu instructor.
                        </p>
                        <Link 
                            to="/student/simuladores" 
                            className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition"
                        >
                            <FaReply />
                            Volver a categorías
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {simuladores.map((simulador) => (
                        <Link
                            key={simulador.id}
                            to={`/student/formulario/${simulador.id}`}
                            className="block bg-[var(--color-nude-200)] hover:bg-[var(--color-nude-300)] text-[var(--color-nude-950)] font-semibold px-6 py-4 rounded-xl shadow-sm transition border border-[var(--color-nude-300)] hover:border-[var(--color-nude-400)]"
                        >
                            <div className="flex items-center justify-between">
                                <span>{simulador.nombre}</span>
                                <span className="text-sm text-[var(--color-nude-700)]">
                                    Iniciar simulador →
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );

}

export default Simuladores;