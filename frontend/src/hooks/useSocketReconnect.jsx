import { useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';

export const useSocketReconnect = () => {
    const { connectSocket, connected } = useSocket();
    const hasAttemptedConnection = useRef(false);

    useEffect(() => {
        // Solo intentar reconectar una vez al montar el componente
        if (!hasAttemptedConnection.current) {
            const token = localStorage.getItem('token');
            const isAuthenticated = token && token !== 'undefined' && token !== '';
            
            if (isAuthenticated && !connected) {
                connectSocket(token);
                hasAttemptedConnection.current = true;
            }
        }
    }, []); // Solo ejecutar una vez al montar

    // Resetear la bandera cuando se desconecte (para permitir reconexión manual)
    useEffect(() => {
        if (!connected) {
            hasAttemptedConnection.current = false;
        }
    }, [connected]);

    return { connected };
};
