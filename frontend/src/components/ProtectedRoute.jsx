import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { showErrorToast, showWarningToast } from "../kernel/alerts";
import { useEffect, useRef } from "react";

const ProtectedRoute = ({ children, role }) => {
    const { user } = useAuth();
    const hasShownToast = useRef(false);

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

    useEffect(() => {
        // Generar una clave única para esta sesión de navegación y rol
        const toastKey = `toast_shown_${role || 'no-role'}_${user?.id || 'no-user'}`;
        const hasShownInSession = sessionStorage.getItem(toastKey);
        
        if (!hasShownToast.current && !hasShownInSession) {
            if (!user) {
                showErrorToast({
                    title: "Acceso denegado",
                    text: "Debes iniciar sesión para acceder.",
                });
                hasShownToast.current = true;
                sessionStorage.setItem(toastKey, 'true');
            } else if (role && user.role?.toLowerCase() !== role.toLowerCase()) {
                showWarningToast({
                    title: "Acceso restringido",
                    text: `No tienes permisos para acceder a esta sección. Serás redirigido a tu dashboard.`,
                });
                hasShownToast.current = true;
                sessionStorage.setItem(toastKey, 'true');
            }
        }
    }, [user, role]);

    // Si no hay usuario, redirigir al login
    if (!user) {
        return <Navigate to="/" />;
    }

    // Si el usuario tiene un rol diferente al requerido, redirigir a su dashboard
    if (role && user.role?.toLowerCase() !== role.toLowerCase()) {
        const dashboardRoute = getDashboardRoute(user.role);
        return <Navigate to={dashboardRoute} />;
    }

    return children;
};

export default ProtectedRoute;