import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import NotificationCenter from '../NotificationCenter';
import { useSocket } from '../../context/SocketContext';

const Navbar = () => {
    const location = useLocation();
    const { disconnectSocket } = useSocket();

    // Detectar el rol por ruta
    let rol = "";
    if (location.pathname.startsWith("/admin")) rol = "Administrador";
    else if (location.pathname.startsWith("/teacher")) rol = "Docente";
    else if (location.pathname.startsWith("/student")) rol = "Estudiante";

    const handleLogout = () => {
        // Desconectar socket
        disconnectSocket();
        
        // Limpiar localStorage
        localStorage.clear();
        
        // Redirigir al login
        window.location.href = '/';
    };

    return (
        <header className="h-14 bg-[var(--color-blanco)] border-b border-[var(--blue)] flex items-center justify-between px-6 shadow-sm relative z-50">
            <h2 className="text-[var(--primary)] font-semibold text-lg">
                Simulador de Entrevistas de Trabajo con Retroalimentación
            </h2>

            <div className="flex items-center gap-4 relative">
                
                {rol && (
                    <span
                        className={`text-sm font-medium px-3 py-1 rounded-full 
                            ${rol === "Administrador"
                                ? "bg-yellow-100 text-yellow-700 border border-yellow-400"
                                : rol === "Docente"
                                    ? "bg-blue-100 text-blue-700 border border-blue-300"
                                    : "bg-blue-100 text-blue-700 border border-blue-300"
                            }`}
                    >
                        {rol}
                    </span>
                )}

                {/* Centro de Notificaciones con Socket.IO */}
                <NotificationCenter />

                <button 
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-md bg-[var(--color-lavanda-700)] text-white font-medium hover:bg-[var(--color-lavanda-500)] transition"
                >
                    Cerrar sesión
                </button>
            </div>
        </header>
    );
};

export default Navbar;
