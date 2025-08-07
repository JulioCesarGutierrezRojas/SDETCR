const Notification = require('../model/notification.model');
const User = require('../../users/model/user.model');
const ApiResponse = require('../../../kernel/api.response');
const TypesResponse = require('../../../kernel/types.response');
const { sendNotificationToUser, sendNotificationToRole } = require('../../../config/socket');

// Variable global para almacenar la instancia de Socket.IO
let socketInstance = null;

const setSocketInstance = (io) => {
    socketInstance = io;
};

// Crear una nueva notificación
const createNotification = async (addresseeId, type, message, sendRealTime = true) => {
    try {
        if (!addresseeId || !message) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'addressee_id y message son requeridos', 400);
        }

        // Verificar que el destinatario existe
        const addressee = await User.findByPk(addresseeId);
        if (!addressee) {
            return new ApiResponse(null, null, TypesResponse.ERROR, 'El destinatario no existe', 404);
        }

        const notification = await Notification.create({
            addressee_id: addresseeId,
            type: type || 'info',
            message: message,
            date_send: new Date()
        });

        // Enviar notificación en tiempo real si está habilitado
        if (sendRealTime && socketInstance) {
            sendNotificationToUser(socketInstance, addresseeId, notification);
        }

        return new ApiResponse(null, {
            notification_id: notification.notification_id,
            addressee_id: notification.addressee_id,
            type: notification.type,
            message: notification.message,
            date_send: notification.date_send
        }, TypesResponse.SUCCESS, 'Notificación creada exitosamente', 201);

    } catch (error) {
        console.error('Error en createNotification:', error);
        return new ApiResponse(null, null, TypesResponse.ERROR, 'Error interno al crear la notificación', 500);
    }
};

// Crear notificaciones múltiples (para envío masivo)
const createBulkNotifications = async (addresseeIds, type, message, sendRealTime = true) => {
    try {
        if (!addresseeIds || !Array.isArray(addresseeIds) || addresseeIds.length === 0 || !message) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'addresseeIds (array) y message son requeridos', 400);
        }

        const notifications = [];
        const createdNotifications = [];

        // Preparar las notificaciones
        for (const addresseeId of addresseeIds) {
            notifications.push({
                addressee_id: addresseeId,
                type: type || 'info',
                message: message,
                date_send: new Date()
            });
        }

        // Crear todas las notificaciones
        const createdBulk = await Notification.bulkCreate(notifications, { returning: true });
        
        // Enviar notificaciones en tiempo real si está habilitado
        if (sendRealTime && socketInstance) {
            for (const notification of createdBulk) {
                sendNotificationToUser(socketInstance, notification.addressee_id, notification);
                createdNotifications.push({
                    notification_id: notification.notification_id,
                    addressee_id: notification.addressee_id,
                    type: notification.type,
                    message: notification.message,
                    date_send: notification.date_send
                });
            }
        }

        return new ApiResponse(null, {
            notifications_created: createdNotifications.length > 0 ? createdNotifications : createdBulk.map(n => ({
                notification_id: n.notification_id,
                addressee_id: n.addressee_id,
                type: n.type,
                message: n.message,
                date_send: n.date_send
            }))
        }, TypesResponse.SUCCESS, `${createdBulk.length} notificaciones creadas exitosamente`, 201);

    } catch (error) {
        console.error('Error en createBulkNotifications:', error);
        return new ApiResponse(null, null, TypesResponse.ERROR, 'Error interno al crear las notificaciones', 500);
    }
};

// Obtener notificaciones de un usuario
const getUserNotifications = async (userId, limit = 50, offset = 0) => {
    try {
        if (!userId) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'userId es requerido', 400);
        }

        const notifications = await Notification.findAndCountAll({
            where: { addressee_id: userId },
            include: [
                {
                    model: User,
                    as: 'Addressee',
                    attributes: ['user_id', 'name', 'lastname', 'email']
                }
            ],
            order: [['date_send', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset),
            attributes: ['notification_id', 'type', 'message', 'date_send', 'read']
        });

        return new ApiResponse(null, {
            notifications: notifications.rows,
            total: notifications.count,
            page: Math.floor(offset / limit) + 1,
            totalPages: Math.ceil(notifications.count / limit),
            hasMore: (offset + limit) < notifications.count
        }, TypesResponse.SUCCESS, 'Notificaciones obtenidas exitosamente', 200);

    } catch (error) {
        console.error('Error en getUserNotifications:', error);
        return new ApiResponse(null, null, TypesResponse.ERROR, 'Error interno al obtener las notificaciones', 500);
    }
};

// Obtener todas las notificaciones (para administradores)
const getAllNotifications = async (limit = 50, offset = 0) => {
    try {
        const notifications = await Notification.findAndCountAll({
            include: [
                {
                    model: User,
                    as: 'Addressee',
                    attributes: ['user_id', 'name', 'lastname', 'email']
                }
            ],
            order: [['date_send', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        return new ApiResponse(null, {
            notifications: notifications.rows,
            total: notifications.count,
            page: Math.floor(offset / limit) + 1,
            totalPages: Math.ceil(notifications.count / limit),
            hasMore: (offset + limit) < notifications.count
        }, TypesResponse.SUCCESS, 'Todas las notificaciones obtenidas exitosamente', 200);

    } catch (error) {
        console.error('Error en getAllNotifications:', error);
        return new ApiResponse(null, null, TypesResponse.ERROR, 'Error interno al obtener las notificaciones', 500);
    }
};

// Marcar notificación como leída
const markNotificationAsRead = async (notificationId, userId = null) => {
    try {
        if (!notificationId) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'notification_id es requerido', 400);
        }

        const whereClause = { notification_id: notificationId };
        
        // Si se proporciona userId, solo permitir marcar sus propias notificaciones
        if (userId) {
            whereClause.addressee_id = userId;
        }

        const [updatedRows] = await Notification.update(
            { read: true },
            { where: whereClause }
        );

        if (updatedRows === 0) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'Notificación no encontrada', 404);
        }

        return new ApiResponse(null, null, TypesResponse.SUCCESS, 'Notificación marcada como leída', 200);

    } catch (error) {
        console.error('Error en markNotificationAsRead:', error);
        return new ApiResponse(null, null, TypesResponse.ERROR, 'Error interno al marcar la notificación', 500);
    }
};

// Eliminar una notificación
const deleteNotification = async (notificationId, userId = null) => {
    try {
        if (!notificationId) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'notification_id es requerido', 400);
        }

        const whereClause = { notification_id: notificationId };
        
        // Si se proporciona userId, solo permitir eliminar sus propias notificaciones
        if (userId) {
            whereClause.addressee_id = userId;
        }

        const deleted = await Notification.destroy({ where: whereClause });

        if (deleted === 0) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'Notificación no encontrada', 404);
        }

        return new ApiResponse(null, null, TypesResponse.SUCCESS, 'Notificación eliminada exitosamente', 200);

    } catch (error) {
        console.error('Error en deleteNotification:', error);
        return new ApiResponse(null, null, TypesResponse.ERROR, 'Error interno al eliminar la notificación', 500);
    }
};

// Función utilitaria para crear notificación de simulador completado
const notifySimulatorCompleted = async (studentId, simulatorName, score) => {
    const message = `¡Has completado el simulador "${simulatorName}" con una calificación de ${score}/10!`;
    return await createNotification(studentId, 'simulator_completed', message);
};

// Función utilitaria para crear notificación de evaluación por mentor
const notifyMentorEvaluation = async (studentId, mentorName, simulatorName, finalScore) => {
    const message = `${mentorName} ha evaluado tu simulador "${simulatorName}" con una calificación final de ${finalScore}/10.`;
    return await createNotification(studentId, 'mentor_evaluation', message);
};

// Función utilitaria para crear notificación de nuevo simulador asignado
const notifyNewSimulator = async (studentIds, simulatorName) => {
    const message = `Se ha asignado un nuevo simulador: "${simulatorName}". ¡Ve a resolverlo!`;
    return await createBulkNotifications(studentIds, 'new_simulator', message);
};

// Función utilitaria para notificar al mentor cuando su estudiante completa un simulador
const notifyMentorStudentCompleted = async (mentorId, studentName, simulatorName, score) => {
    const message = `Tu estudiante ${studentName} ha completado el simulador "${simulatorName}" con una calificación de ${score}/10.`;
    return await createNotification(mentorId, 'student_completed_simulator', message);
};

// Función utilitaria para notificar al estudiante cuando su mentor lo evalúa
const notifyStudentEvaluated = async (studentId, mentorName, simulatorName, finalScore) => {
    const message = `¡Tu mentor ${mentorName} ha terminado de evaluar tu simulador "${simulatorName}"! Revisa tu calificación final: ${finalScore}/10.`;
    return await createNotification(studentId, 'mentor_finished_evaluation', message);
};

module.exports = {
    setSocketInstance,
    createNotification,
    createBulkNotifications,
    getUserNotifications,
    getAllNotifications,
    deleteNotification,
    // Funciones utilitarias
    notifySimulatorCompleted,
    notifyMentorEvaluation,
    notifyNewSimulator,
    notifyMentorStudentCompleted,
    notifyStudentEvaluated,
    markNotificationAsRead
};
