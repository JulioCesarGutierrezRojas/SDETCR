import { Link, useLocation } from "react-router-dom";
import { FaUserGraduate, FaClipboardList, FaComments, FaChevronLeft, FaChevronRight, FaVideo, FaUserPlus } from "react-icons/fa";

const sidebarTeacher = ({ isCollapsed, setIsCollapsed }) => {
    const location = useLocation();

    const links = [
        { to: "/teacher", label: "Seleccionar estudiantes", icon: <FaUserPlus /> },
        { to: "/teacher/estudiantesSeleccionados", label: "Estudiantes seleccionados", icon: <FaUserGraduate /> },
        { to: "/teacher", label: "Entrevistas por evaluar", icon: <FaClipboardList /> },
        { to: "/teacher/videos", label: "Entrevistas por visualizar", icon: <FaVideo /> },
        { to: "/teacher", label: "Comentarios enviados", icon: <FaComments /> },
    ];

    return (
        <div className={`bg-[var(--primary)] text-white transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"} flex flex-col`}>
            <div className="flex items-center justify-between px-4 h-14 shadow-sm border border-[var(--color-lavanda-600)]">
                {!isCollapsed && <h1 className="text-lg font-semibold">SDETCR</h1>}
                <button className="text-white focus:outline-none"
                    onClick={() => setIsCollapsed(!isCollapsed)}>
                    {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
                </button>
            </div>

            <nav className="flex flex-col gap-2 p-4">
                {links.map(({ to, label, icon }) => (
                    <Link
                        key={to}
                        to={to}
                        className={`flex items-center gap-2 p-2 rounded-md transition bg-[var(--color-lavanda-600)] hover:bg-[var(--color-lavanda-500)] ${location.pathname === to ? "bg-[var(--color-lavanda-600)]" : ""}`}>
                        {icon}
                        {!isCollapsed && <span>{label}</span>}
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default sidebarTeacher;