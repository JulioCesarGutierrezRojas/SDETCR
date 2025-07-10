const historyService = require('../service/history.service')
const { Router } = require('express')
const {protectedEndpoint} = require("../../../security/auth.middleware");
const routerHistory = Router()

const getHistoriesByStudent = async (req, res) => {
    try {
        const { studentId } = req.params
        const histories = await historyService.getHistoriesByStudent(studentId)
        res.status(200).json(histories)
    } catch (error) {
        console.error('Error en controller:', error.message)
        const status = error.statusCode || 500
        res.status(status).json({ message: error.message || 'Error interno del servidor' })
    }
}

routerHistory.get('/student/:studentId', protectedEndpoint('mentor', 'administrador'),
    // #swagger.tags = ['Historial']
    // #swagger.summary = 'Obtener historial por estudiante'
    // #swagger.description = 'Devuelve todas las entrevistas simuladas realizadas por un estudiante específico.'
    // #swagger.parameters['studentId'] = { description: 'ID del estudiante', in: 'path', required: true, type: 'string' }
    getHistoriesByStudent)

module.exports = {
    routerHistory
}
