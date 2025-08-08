const { 
    createNotification, 
    createBulkNotifications, 
    getUserNotifications, 
    getAllNotifications, 
    deleteNotification,
    markNotificationAsRead 
} = require('../service/notification.service');
const { Router } = require('express');
const { protectedEndpoint } = require('../../../security/auth.middleware');

const routerNotification = Router();

// Crear una notificación individual
const createNotificationController = async (req, res) => {
    try {
        const { addressee_id, type, message } = req.body;
        
        if (!addressee_id || !message) {
            return res.status(400).json({ message: 'addressee_id y message son requeridos' });
        }

        const result = await createNotification(addressee_id, type, message);
        return res.status(result.getStatusCode()).json(result.getResponseBody());
        
    } catch (error) {
        console.error('Error en createNotificationController:', error.message);
        return res.status(500).json({ message: error.message });
    }
};

// Crear notificaciones múltiples
const createBulkNotificationsController = async (req, res) => {
    try {
        const { addressee_ids, type, message } = req.body;
        
        if (!addressee_ids || !Array.isArray(addressee_ids) || !message) {
            return res.status(400).json({ message: 'addressee_ids (array) y message son requeridos' });
        }

        const result = await createBulkNotifications(addressee_ids, type, message);
        return res.status(result.getStatusCode()).json(result.getResponseBody());
        
    } catch (error) {
        console.error('Error en createBulkNotificationsController:', error.message);
        return res.status(500).json({ message: error.message });
    }
};

// Obtener notificaciones del usuario autenticado
const getMyNotificationsController = async (req, res) => {
    try {
        const userId = req.user.user_id; // Del middleware de autenticación
        const { limit = 50, offset = 0 } = req.query;
        
        const result = await getUserNotifications(userId, limit, offset);
        return res.status(result.getStatusCode()).json(result.getResponseBody());
        
    } catch (error) {
        console.error('Error en getMyNotificationsController:', error.message);
        return res.status(500).json({ message: error.message });
    }
};

// Obtener notificaciones de un usuario específico (solo admin/docente)
const getUserNotificationsController = async (req, res) => {
    try {
        const { userId } = req.params;
        const { limit = 50, offset = 0 } = req.query;
        
        if (!userId) {
            return res.status(400).json({ message: 'userId es requerido' });
        }
        
        const result = await getUserNotifications(userId, limit, offset);
        return res.status(result.getStatusCode()).json(result.getResponseBody());
        
    } catch (error) {
        console.error('Error en getUserNotificationsController:', error.message);
        return res.status(500).json({ message: error.message });
    }
};

// Obtener todas las notificaciones (solo administradores)
const getAllNotificationsController = async (req, res) => {
    try {
        const { limit = 50, offset = 0 } = req.query;
        
        const result = await getAllNotifications(limit, offset);
        return res.status(result.getStatusCode()).json(result.getResponseBody());
        
    } catch (error) {
        console.error('Error en getAllNotificationsController:', error.message);
        return res.status(500).json({ message: error.message });
    }
};

// Marcar una notificación propia como leída
const markMyNotificationAsReadController = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const userId = req.user.user_id;
        
        if (!notificationId) {
            return res.status(400).json({ message: 'notificationId es requerido' });
        }
        
        const result = await markNotificationAsRead(notificationId, userId);
        return res.status(result.getStatusCode()).json(result.getResponseBody());
        
    } catch (error) {
        console.error('Error en markMyNotificationAsReadController:', error.message);
        return res.status(500).json({ message: error.message });
    }
};

// Eliminar una notificación propia
const deleteMyNotificationController = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const userId = req.user.user_id;
        
        if (!notificationId) {
            return res.status(400).json({ message: 'notificationId es requerido' });
        }
        
        const result = await deleteNotification(notificationId, userId);
        return res.status(result.getStatusCode()).json(result.getResponseBody());
        
    } catch (error) {
        console.error('Error en deleteMyNotificationController:', error.message);
        return res.status(500).json({ message: error.message });
    }
};

// Eliminar cualquier notificación (solo administradores)
const deleteNotificationController = async (req, res) => {
    try {
        const { notificationId } = req.params;
        
        if (!notificationId) {
            return res.status(400).json({ message: 'notificationId es requerido' });
        }
        
        const result = await deleteNotification(notificationId);
        return res.status(result.getStatusCode()).json(result.getResponseBody());
        
    } catch (error) {
        console.error('Error en deleteNotificationController:', error.message);
        return res.status(500).json({ message: error.message });
    }
};

// Rutas
routerNotification.post('/create', protectedEndpoint(['admin', 'docente']),
    // #swagger.tags = ['Notificaciones']
    // #swagger.summary = 'Crear una notificación'
    // #swagger.description = 'Crear una notificación para un usuario específico'
    // #swagger.security = [{ "bearerAuth": [] }]
    createNotificationController
);

routerNotification.post('/create-bulk', protectedEndpoint(['admin', 'docente']),
    // #swagger.tags = ['Notificaciones']
    // #swagger.summary = 'Crear notificaciones múltiples'
    // #swagger.description = 'Crear notificaciones para múltiples usuarios'
    // #swagger.security = [{ "bearerAuth": [] }]
    createBulkNotificationsController
);

routerNotification.get('/my-notifications', protectedEndpoint(['admin', 'docente', 'estudiante']),
    // #swagger.tags = ['Notificaciones']
    // #swagger.summary = 'Obtener mis notificaciones'
    // #swagger.description = 'Obtener las notificaciones del usuario autenticado'
    // #swagger.security = [{ "bearerAuth": [] }]
    getMyNotificationsController
);

routerNotification.get('/user/:userId', protectedEndpoint(['admin', 'docente']),
    // #swagger.tags = ['Notificaciones']
    // #swagger.summary = 'Obtener notificaciones de un usuario'
    // #swagger.description = 'Obtener notificaciones de un usuario específico'
    // #swagger.security = [{ "bearerAuth": [] }]
    getUserNotificationsController
);

routerNotification.get('/all', protectedEndpoint(['admin']),
    // #swagger.tags = ['Notificaciones']
    // #swagger.summary = 'Obtener todas las notificaciones'
    // #swagger.description = 'Obtener todas las notificaciones del sistema (solo administradores)'
    // #swagger.security = [{ "bearerAuth": [] }]
    getAllNotificationsController
);

routerNotification.put('/my/:notificationId/read', protectedEndpoint(['admin', 'docente', 'estudiante']),
    // #swagger.tags = ['Notificaciones']
    // #swagger.summary = 'Marcar notificación como leída'
    // #swagger.description = 'Marcar una notificación propia como leída'
    // #swagger.security = [{ "bearerAuth": [] }]
    markMyNotificationAsReadController
);

routerNotification.delete('/my/:notificationId', protectedEndpoint(['admin', 'docente', 'estudiante']),
    // #swagger.tags = ['Notificaciones']
    // #swagger.summary = 'Eliminar mi notificación'
    // #swagger.description = 'Eliminar una notificación propia'
    // #swagger.security = [{ "bearerAuth": [] }]
    deleteMyNotificationController
);

routerNotification.delete('/:notificationId', protectedEndpoint(['admin']),
    // #swagger.tags = ['Notificaciones']
    // #swagger.summary = 'Eliminar notificación'
    // #swagger.description = 'Eliminar cualquier notificación (solo administradores)'
    // #swagger.security = [{ "bearerAuth": [] }]
    deleteNotificationController
);

module.exports = {
    routerNotification
};
