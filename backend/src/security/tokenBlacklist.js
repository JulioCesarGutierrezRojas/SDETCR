// Token blacklist para invalidar JWT tokens
const tokenBlacklist = new Set();

const addToBlacklist = (token) => {
    tokenBlacklist.add(token);
};

const isBlacklisted = (token) => {
    return tokenBlacklist.has(token);
};

// Limpiar tokens expirados cada hora
setInterval(() => {
    console.log('🧹 Limpiando blacklist de tokens...');
    // En una implementación de producción, esto debería usar Redis o base de datos
    // Por ahora mantenemos un Set en memoria
}, 3600000); // 1 hora

module.exports = {
    addToBlacklist,
    isBlacklisted
};
