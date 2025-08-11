import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { showSuccessToast, showErrorToast } from '../kernel/alerts';

const SocketContext = createContext();

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket debe ser usado dentro de un SocketProvider');
    }
    return context;
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const reconnectAttempts = useRef(0);
    const isConnecting = useRef(false);

    const connectSocket = (token) => {
        if (!token) {
            console.error('No token provided for socket connection');
            return;
        }

        // Prevenir múltiples conexiones simultáneas
        if (isConnecting.current || (socket && connected)) {
            return;
        }

        isConnecting.current = true;

        // Desconectar socket existente si hay uno
        if (socket) {
            socket.disconnect();
        }

        
        const newSocket = io(import.meta.env.VITE_SOCKET_API_URL || 'http://localhost:4000', {
            auth: {
                token: token
            },
            transports: ['websocket', 'polling'],
            timeout: 20000,
            reconnection: true,
            reconnectionDelay: 2000,
            reconnectionDelayMax: 10000,
            maxReconnectionAttempts: 5
        });

        newSocket.on('connect', () => {
            setConnected(true);
            isConnecting.current = false;
            reconnectAttempts.current = 0;
            
            // Solicitar notificaciones pendientes al conectarse
            newSocket.emit('request_pending_notifications');
        });

        newSocket.on('disconnect', (reason) => {
            setConnected(false);
        });

        newSocket.on('connect_error', (error) => {
            console.error('Socket.IO connection error:', error.message);
            setConnected(false);
            isConnecting.current = false;
            
            if (reconnectAttempts.current >= 5) {
                showErrorToast({
                    title: 'Error de conexión',
                    text: 'No se pudo establecer conexión para notificaciones en tiempo real'
                });
            }
            reconnectAttempts.current++;
        });

        // Escuchar nuevas notificaciones
        newSocket.on('new_notification', (notification) => {
            // Agregar la nueva notificación al estado
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);
            
            // Mostrar toast de notificación
            showSuccessToast({
                title: 'Nueva notificación',
                text: notification.message
            });
        });

        // Respuesta con notificaciones pendientes
        newSocket.on('pending_notifications', (pendingNotifications) => {
            if (pendingNotifications && pendingNotifications.length > 0) {
                setNotifications(pendingNotifications);
                // Contar solo las notificaciones no leídas
                const unreadNotifications = pendingNotifications.filter(notif => !notif.read);
                setUnreadCount(unreadNotifications.length);
            }
        });

        // Respuesta de ping-pong para mantener conexión
        newSocket.on('pong', () => {
            // Heartbeat response - connection is alive
        });

        setSocket(newSocket);
    };

    const disconnectSocket = () => {
        if (socket) {
            socket.disconnect();
            setSocket(null);
            setConnected(false);
            setNotifications([]);
            setUnreadCount(0);
        }
    };

    const markNotificationAsRead = (notificationId) => {
        if (socket && connected) {
            socket.emit('mark_notification_read', notificationId);
        }
        
        // Actualizar estado local
        setNotifications(prev => 
            prev.map(notif => 
                notif.notification_id === notificationId 
                    ? { ...notif, read: true }
                    : notif
            )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const clearNotification = (notificationId) => {
        // Encontrar si la notificación que se va a eliminar está sin leer
        const notificationToRemove = notifications.find(notif => notif.notification_id === notificationId);
        const isUnread = notificationToRemove && !notificationToRemove.read;
        
        setNotifications(prev => 
            prev.filter(notif => notif.notification_id !== notificationId)
        );
        
        // Solo decrementar el contador si la notificación eliminada no estaba leída
        if (isUnread) {
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
    };

    const clearAllNotifications = () => {
        setNotifications([]);
        setUnreadCount(0);
    };

    // Función para enviar ping periódicamente
    useEffect(() => {
        if (socket && connected) {
            const pingInterval = setInterval(() => {
                socket.emit('ping');
            }, 30000);

            return () => clearInterval(pingInterval);
        }
    }, [socket, connected]);

    // Limpieza al desmontar el componente
    useEffect(() => {
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, []);

    const value = {
        socket,
        connected,
        notifications,
        unreadCount,
        connectSocket,
        disconnectSocket,
        markNotificationAsRead,
        clearNotification,
        clearAllNotifications
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};
