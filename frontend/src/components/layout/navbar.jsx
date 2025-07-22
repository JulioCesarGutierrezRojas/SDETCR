import { IoMdNotifications } from "react-icons/io";

const Navbar = () => {
    return (
        <header className="h-14 bg-[var(--color-blanco)] border-b border-[var(--blue)] flex items-center justify-between px-6 shadow-sm">
            <h2 className="text-[var(--primary)] font-semibold text-lg">
                Simulador de Entrevistas con Retroalimentación
            </h2>

            <div className="flex items-center gap-4">
                <span className="text-xm text-[var(--color-gris-900)]">Rol del Usuario</span>
                <button className="h-9 w-9 rounded-full flex items-center justify-center bg-[var(--color-lavanda-700)] text-white hover:bg-[var(--color-lavanda-500)] transition">
                    <IoMdNotifications size={20} />
                </button>
                
                <button className="px-3 py-2 rounded-md bg-[var(--color-lavanda-700)] text-white font-medium hover:bg-[var(--color-lavanda-500)] transition">
                    Cerrar sesión
                </button>
            </div>
        </header>
    );
};

export default Navbar;
