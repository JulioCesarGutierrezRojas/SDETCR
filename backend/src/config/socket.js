const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

// Almacenar usuarios conectados
const connectedUsers = new Map();

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*", // En producción, especifica el dominio exacto
            methods: ["GET", "POST"],
            credentials: true
        },
        transports: ['websocket', 'polling']
    });

    // Middleware de autenticación para Socket.IO
    io.use((socket, next) => {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization;
        
        if (!token) {
            return next(new Error('Authentication error: No token provided'));
        }

        try {
            // Remover 'Bearer ' si está presente
            const cleanToken = token.replace('Bearer ', '');
            const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
            
            socket.userId = decoded.user_id;
            socket.userRole = decoded.role;
            next();
        } catch (err) {
            console.error('Socket authentication error:', err.message);
            next(new Error('Authentication error: Invalid token'));
        }
    });

    io.on('connection', (socket) => {
        // Almacenar la conexión del usuario
        connectedUsers.set(socket.userId, {
            socketId: socket.id,
            role: socket.userRole,
            connectedAt: new Date()
        });

        // Unir al usuario a una room basada en su rol
        socket.join(`role_${socket.userRole}`);
        socket.join(`user_${socket.userId}`);

        // Manejar solicitud de notificaciones pendientes
        socket.on('request_pending_notifications', async () => {
            try {
                const { getUserNotifications } = require('../modules/notifications/service/notification.service');
                const result = await getUserNotifications(socket.userId, 50, 0);
                
                if (result.getStatusCode() === 200) {
                    const responseBody = result.getResponseBody();
                    const notifications = responseBody.result.notifications;
                    
                    // Formatear las notificaciones para que coincidan con el formato esperado por el frontend
                    const formattedNotifications = notifications.map(notification => ({
                        notification_id: notification.notification_id,
                        type: notification.type,
                        message: notification.message,
                        date_send: notification.date_send,
                        read: notification.read
                    }));
                    
                    socket.emit('pending_notifications', formattedNotifications);
                } else {
                    console.error('Error getting notifications for user:', socket.userId, result.getMessage());
                }
            } catch (error) {
                console.error('Error handling request_pending_notifications:', error.message);
            }
        });
        
        // Enviar notificaciones pendientes automáticamente al conectarse
        setTimeout(async () => {
            try {
                const { getUserNotifications } = require('../modules/notifications/service/notification.service');
                const result = await getUserNotifications(socket.userId, 50, 0);
                
                if (result.getStatusCode() === 200) {
                    const responseBody = result.getResponseBody();
                    const notifications = responseBody.result.notifications;
                    
                    // Formatear las notificaciones para que coincidan con el formato esperado por el frontend
                    const formattedNotifications = notifications.map(notification => ({
                        notification_id: notification.notification_id,
                        type: notification.type,
                        message: notification.message,
                        date_send: notification.date_send,
                        read: notification.read
                    }));
                    
                    socket.emit('pending_notifications', formattedNotifications);
                } else {
                    console.error('Error getting notifications for user:', socket.userId, result.getMessage());
                }
            } catch (error) {
                console.error('Error sending pending notifications:', error.message);
            }
        }, 1000); // Delay de 1 segundo para asegurar que el cliente esté listo

        // Manejar desconexión
        socket.on('disconnect', () => {
            connectedUsers.delete(socket.userId);
        });

        // Marcar notificación como leída
        socket.on('mark_notification_read', async (notificationId) => {
            try {
                const { markNotificationAsRead } = require('../modules/notifications/service/notification.service');
                await markNotificationAsRead(notificationId, socket.userId);
            } catch (error) {
                console.error('Error marking notification as read:', error.message);
            }
        });

        // Heartbeat para mantener la conexión activa
        socket.on('ping', () => {
            socket.emit('pong');
        });
    });

    return io;
};

// Función para enviar notificación a un usuario específico
const sendNotificationToUser = (io, userId, notification) => {
    if (!io) {
        console.error('Socket.IO instance not available');
        return false;
    }

    const userConnection = connectedUsers.get(parseInt(userId));
    if (userConnection) {
        io.to(`user_${userId}`).emit('new_notification', {
            notification_id: notification.notification_id,
            type: notification.type,
            message: notification.message,
            date_send: notification.date_send,
            read: false,
            timestamp: new Date().toISOString()
        });
        return true;
    } else {
        return false;
    }
};

// Función para enviar notificación a usuarios por rol
const sendNotificationToRole = (io, role, notification) => {
    if (!io) {
        console.error('Socket.IO instance not available');
        return false;
    }

    io.to(`role_${role}`).emit('new_notification', {
        notification_id: notification.notification_id,
        type: notification.type,
        message: notification.message,
        date_send: notification.date_send,
        read: false,
        timestamp: new Date().toISOString()
    });
    return true;
};

// Función para obtener usuarios conectados
const getConnectedUsers = () => {
    return Array.from(connectedUsers.entries()).map(([userId, data]) => ({
        userId,
        ...data
    }));
};

// Función para verificar si un usuario está conectado
const isUserConnected = (userId) => {
    return connectedUsers.has(parseInt(userId));
};

module.exports = {
    initializeSocket,
    sendNotificationToUser,
    sendNotificationToRole,
    getConnectedUsers,
    isUserConnected
};
