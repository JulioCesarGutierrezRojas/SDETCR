import { IoMdNotifications } from "react-icons/io";
import { useState, useRef, useEffect } from "react";

const Navbar = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef(null);

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

    // Notificaciones de prueba
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
                Simulador de Entrevistas con Retroalimentación
            </h2>

            <div className="flex items-center gap-4 relative">
                <span className="text-xm text-[var(--color-gris-900)]">Rol del Usuario</span>

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
