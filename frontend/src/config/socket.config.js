// Configuración de Socket.IO
export const SOCKET_CONFIG = {
    // URL del servidor Socket.IO
    URL: import.meta.env.VITE_SOCKET_API_URL || 'http://localhost:4000',
    
    // Timeout de conexión
    TIMEOUT: parseInt(import.meta.env.VITE_SOCKET_TIMEOUT) || 20000,
    
    // Número máximo de intentos de reconexión
    MAX_RECONNECT_ATTEMPTS: parseInt(import.meta.env.VITE_SOCKET_RECONNECT_ATTEMPTS) || 5,
    
    // Configuración de transporte
    TRANSPORTS: ['websocket', 'polling'],
    
    // Configuración de reconexión
    RECONNECTION_CONFIG: {
        reconnection: true,
        reconnectionDelay: 2000,
        reconnectionDelayMax: 10000
    },
    
    // Intervalo de ping (en milisegundos)
    PING_INTERVAL: 30000
};
