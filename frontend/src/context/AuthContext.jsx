import { createContext, useContext, useState, useEffect } from "react";
import { showSuccessToast } from '../kernel/alerts';
import { logout as logoutService } from '../modules/auth/adapters/auth.controller';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const name = localStorage.getItem("user");
        const role = localStorage.getItem("role");
        const email = localStorage.getItem("email");
        const id = localStorage.getItem("userId");

        if (name && role && email && id) {
            setUser({ name, role, email, id });
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = async () => {
        const token = localStorage.getItem("token");
        
        // Si hay token, intentar invalidarlo en el backend usando el servicio
        if (token) {
            await logoutService();
        }
        
        // Limpiar estado local siempre
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        localStorage.removeItem("email");
        localStorage.removeItem("userId");
        
        // Limpiar todas las claves de toast del sessionStorage
        Object.keys(sessionStorage).forEach(key => {
            if (key.startsWith('toast_shown_')) {
                sessionStorage.removeItem(key);
            }
        });
        
        showSuccessToast({
            title: 'Sesión cerrada',
            text: 'Sesión cerrada correctamente'
        });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
