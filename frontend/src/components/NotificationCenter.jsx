import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaTimes, FaCheck, FaTrash, FaEye } from 'react-icons/fa';
import { useSocket } from '../context/SocketContext';

const NotificationCenter = () => {
    const { notifications, unreadCount, markNotificationAsRead, clearNotification, clearAllNotifications, connected } = useSocket();
    const [isOpen, setIsOpen] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const dropdownRef = useRef(null);

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'simulator_completed':
                return '🎯';
            case 'mentor_evaluation':
                return '📋';
            case 'mentor_finished_evaluation':
                return '✅';
            case 'student_completed_simulator':
                return '👨‍🎓';
            case 'new_simulator':
                return '📚';
            case 'info':
                return 'ℹ️';
            case 'warning':
                return '⚠️';
            case 'error':
                return '❌';
            default:
                return '📢';
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'simulator_completed':
                return 'border-green-200 bg-green-50';
            case 'mentor_evaluation':
                return 'border-blue-200 bg-blue-50';
            case 'mentor_finished_evaluation':
                return 'border-emerald-200 bg-emerald-50';
            case 'student_completed_simulator':
                return 'border-indigo-200 bg-indigo-50';
            case 'new_simulator':
                return 'border-purple-200 bg-purple-50';
            case 'info':
                return 'border-blue-200 bg-blue-50';
            case 'warning':
                return 'border-yellow-200 bg-yellow-50';
            case 'error':
                return 'border-red-200 bg-red-50';
            default:
                return 'border-gray-200 bg-gray-50';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Ahora mismo';
        if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
        if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)}h`;
        return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    };

    const displayedNotifications = showAll ? notifications : notifications.slice(0, 5);

    const handleNotificationClick = (notification) => {
        if (!notification.read) {
            markNotificationAsRead(notification.notification_id);
        }
    };

    const handleClearNotification = (notificationId, event) => {
        event.stopPropagation();
        clearNotification(notificationId);
    };

    const handleClearAll = () => {
        clearAllNotifications();
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Botón de notificaciones */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-2 rounded-full transition-colors ${
                    connected 
                        ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-100' 
                        : 'text-gray-400 cursor-not-allowed'
                }`}
                title={connected ? 'Notificaciones' : 'Desconectado - Sin notificaciones en tiempo real'}
                disabled={!connected}
            >
                <FaBell className="w-5 h-5" />
                
                {/* Badge de contador */}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
                
                {/* Indicador de conexión */}
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                    connected ? 'bg-green-400' : 'bg-gray-400'
                }`}></div>
            </button>

            {/* Dropdown de notificaciones */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[500px] overflow-hidden">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Notificaciones
                                {unreadCount > 0 && (
                                    <span className="ml-2 text-sm bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                        {unreadCount} nueva{unreadCount !== 1 ? 's' : ''}
                                    </span>
                                )}
                            </h3>
                            
                            <div className="flex items-center space-x-2">
                                {/* Indicador de conexión */}
                                <div className={`flex items-center space-x-1 text-xs ${
                                    connected ? 'text-green-600' : 'text-gray-500'
                                }`}>
                                    <div className={`w-2 h-2 rounded-full ${
                                        connected ? 'bg-green-400' : 'bg-gray-400'
                                    }`}></div>
                                    <span>{connected ? 'Conectado' : 'Desconectado'}</span>
                                </div>
                                
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-500 hover:text-gray-700 p-1"
                                >
                                    <FaTimes className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        
                        {notifications.length > 0 && (
                            <button
                                onClick={handleClearAll}
                                className="mt-2 text-sm text-red-600 hover:text-red-800 flex items-center space-x-1"
                            >
                                <FaTrash className="w-3 h-3" />
                                <span>Limpiar todas</span>
                            </button>
                        )}
                    </div>

                    {/* Lista de notificaciones */}
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center text-gray-500">
                                <FaBell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                <p>No hay notificaciones</p>
                                {!connected && (
                                    <p className="text-xs mt-2">
                                        Las notificaciones en tiempo real están deshabilitadas
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {displayedNotifications.map((notification) => (
                                    <div
                                        key={notification.notification_id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 ${
                                            !notification.read 
                                                ? getNotificationColor(notification.type) + ' border-l-blue-400' 
                                                : 'bg-white border-l-gray-200'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start space-x-3 flex-1 min-w-0">
                                                <span className="text-lg flex-shrink-0 mt-1">
                                                    {getNotificationIcon(notification.type)}
                                                </span>
                                                
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm ${
                                                        !notification.read 
                                                            ? 'font-semibold text-gray-900' 
                                                            : 'text-gray-700'
                                                    }`}>
                                                        {notification.message}
                                                    </p>
                                                    
                                                    <div className="flex items-center justify-between mt-1">
                                                        <p className="text-xs text-gray-500">
                                                            {formatDate(notification.date_send || notification.timestamp)}
                                                        </p>
                                                        
                                                        <div className="flex items-center space-x-1">
                                                            {!notification.read && (
                                                                <FaEye className="w-3 h-3 text-blue-500" title="No leída" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <button
                                                onClick={(e) => handleClearNotification(notification.notification_id, e)}
                                                className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                                                title="Eliminar notificación"
                                            >
                                                <FaTimes className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 5 && (
                        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                            <button
                                onClick={() => setShowAll(!showAll)}
                                className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                                {showAll ? 'Mostrar menos' : `Ver todas (${notifications.length})`}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationCenter;
