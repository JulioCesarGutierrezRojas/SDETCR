import { Link, useLocation } from "react-router-dom";
import { FaUserGraduate, FaClipboardList, FaLightbulb, FaChevronLeft, FaChevronRight, FaAward } from "react-icons/fa";

const sidebarStudent = ({ isCollapsed, setIsCollapsed }) => {
    const location = useLocation();

    const links = [
        { to: "/student/simuladores", label: "Categorias", icon: <FaClipboardList /> },
        { to: "/student/sugerirSimulador", label: "Sugerir simulador", icon: <FaLightbulb /> },
        { to: "/student/resultadosObtenidos", label: "Resultados obtenidos", icon: <FaAward /> },
        { to: "/student", label: "Perfil", icon: <FaUserGraduate /> },
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
                        className={
                            `flex items-center gap-2 p-2 rounded-md transition bg-[var(--color-lavanda-600)] hover:bg-[var(--color-lavanda-500)]
                            ${location.pathname === to ? "bg-[var(--color-lavanda-600)] border-l-4 border-white font-semibold" : ""}`}>
                        {icon}
                        {!isCollapsed && <span>{label}</span>}
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default sidebarStudent;
