import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
    const { user } = useAuth();

    // Función para obtener la ruta del dashboard según el rol
    const getDashboardRoute = (userRole) => {
        switch (userRole?.toLowerCase()) {
            case 'estudiantes':
                return '/student';
            case 'administrador':
                return '/admin';
            case 'mentor':
                return '/teacher';
            default:
                return '/';
        }
    };

    // Si el usuario está autenticado, redirigir a su dashboard
    if (user) {
        const dashboardRoute = getDashboardRoute(user.role);
        return <Navigate to={dashboardRoute} replace />;
    }

    // Si no está autenticado, mostrar el componente público
    return children;
};

export default PublicRoute;
