import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./navbar";
import SidebarAdmin from "./sidebarAdmin";
import StudentSimulators from "../../modules/admin/views/simulatorHistory/StudentSimulators";
import SimulatorDetail from "../../modules/admin/views/simulatorHistory/SimulatorDetail";
import { useSocketReconnect } from "../../hooks/useSocketReconnect";


const LayoutAdmin = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    
    // Reconectar Socket.IO automáticamente al cargar la página
    useSocketReconnect();

    return (
        <div className="flex h-screen bg-[var(--color-blanco)]">
            <SidebarAdmin isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="flex-1 overflow-y-auto p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default LayoutAdmin;