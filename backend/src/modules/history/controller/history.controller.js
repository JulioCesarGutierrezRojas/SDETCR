const historyService = require('../service/history.service')
const { Router } = require('express')
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

routerHistory.get('/student/:studentId',
    // #swagger.tags = ['Historial']
    // #swagger.summary = 'Obtener historial por estudiante'
    // #swagger.description = 'Devuelve todas las entrevistas simuladas realizadas por un estudiante específico.'
    // #swagger.parameters['studentId'] = { description: 'ID del estudiante', in: 'path', required: true, type: 'string' }
    // #swagger.responses[200] = {
    //     description: 'Historial obtenido correctamente',
    //     schema: [
    //       {
    //         simulator_id: "abc123",
    //         date: "2025-07-08",
    //         score: 87
    //       }
    //     ]
    // }
    // #swagger.responses[500] = {
    //     description: 'Error interno del servidor'
    // }
    getHistoriesByStudent)

module.exports = {
    routerHistory
}
