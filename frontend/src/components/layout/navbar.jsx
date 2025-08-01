import { IoMdNotifications } from "react-icons/io";
import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";

const Navbar = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef(null);
    const location = useLocation();

    // Detectar el rol por ruta
    let rol = "";
    if (location.pathname.startsWith("/admin")) rol = "Administrador";
    else if (location.pathname.startsWith("/teacher")) rol = "Docente";
    else if (location.pathname.startsWith("/student")) rol = "Estudiante";

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const notificaciones = [
        { id: 1, mensaje: "Tienes una nueva entrevista programada." },
        { id: 2, mensaje: "Tu simulador fue evaluado." },
        { id: 3, mensaje: "Nueva retroalimentación disponible." },
        { id: 4, mensaje: "Tienes una nueva entrevista programada." },
        { id: 5, mensaje: "Tu simulador fue evaluado." },
    ];

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

                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={toggleNotifications}
                        className="h-9 w-9 rounded-full flex items-center justify-center bg-[var(--color-lavanda-700)] text-white hover:bg-[var(--color-lavanda-500)] transition"
                    >
                        <IoMdNotifications size={20} />
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-72 bg-white border border-[var(--color-gris-400)] rounded-md shadow-lg p-3 z-50">
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Notificaciones</h3>
                            <ul className="space-y-2 max-h-60 overflow-y-auto">
                                {notificaciones.map((n) => (
                                    <li
                                        key={n.id}
                                        className="text-sm text-gray-600 bg-gray-50 hover:bg-[var(--color-lavanda-200)] rounded-md p-2 transition border border-[var(--color-gris-100)]"
                                    >
                                        {n.mensaje}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <button className="px-3 py-2 rounded-md bg-[var(--color-lavanda-700)] text-white font-medium hover:bg-[var(--color-lavanda-500)] transition">
                    Cerrar sesión
                </button>
            </div>
        </header>
    );
};

export default Navbar;
