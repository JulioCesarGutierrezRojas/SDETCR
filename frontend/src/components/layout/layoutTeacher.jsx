import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./navbar";
import SidebarTeacher from "./sidebarTeacher";

const LayoutTeacher = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex h-screen bg-[var(--color-blanco)]">
            <SidebarTeacher isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="flex-1 overflow-y-auto p-4 bg-[var(--color-blanco)]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default LayoutTeacher;