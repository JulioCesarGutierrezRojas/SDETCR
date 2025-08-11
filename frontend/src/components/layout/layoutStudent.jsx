import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./navbar";
import SidebarStudent from "./sidebarStudent";
import { useSocketReconnect } from "../../hooks/useSocketReconnect";

const LayoutStudent = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    
    // Reconectar Socket.IO automáticamente al cargar la página
    useSocketReconnect();

    return (
        <div className="flex h-screen bg-[var(--color-blanco)]">
            <SidebarStudent isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="p-4 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default LayoutStudent;