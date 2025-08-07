import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { showErrorToast } from "../kernel/alerts";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children, role }) => {
    const { user } = useAuth();
    const [showToast, setShowToast] = useState(true);

    useEffect(() => {
        if (!user && showToast) {
            showErrorToast({
                title: "Acceso denegado",
                text: "Debes iniciar sesión para acceder.",
            });
            setShowToast(false);
        }

        if (user && role && user.role?.toLowerCase() !== role.toLowerCase() && showToast) {
            showErrorToast({
                title: "Acceso restringido",
                text: "No tienes permisos para acceder a esta sección.",
            });
            setShowToast(false);
        }
    }, [user, role, showToast]);

    if (!user || (role && user.role?.toLowerCase() !== role.toLowerCase())) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;