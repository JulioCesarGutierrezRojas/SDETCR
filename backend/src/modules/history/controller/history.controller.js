const { getSimulatorFromHistory, getHistoriesByStudent } = require('../service/history.service');
const { Router } = require('express')
const routerHistory = Router()

const getSimulatorFromHistoryController = async (req, res) => {
    try {
        const { studentId, simulatorId } = req.params;

        const result = await getSimulatorFromHistory(studentId, simulatorId);
        res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el historial del simulador'
        });
    }
};

const getHistoriesByStudentController = async (req, res) => {
    try {
        const { studentId } = req.params
        const histories = await getHistoriesByStudent(studentId)
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
    getHistoriesByStudentController)

routerHistory.get('/student/:studentId/simulator/:simulatorId', 
    // #swagger.tags = ['Historial']
    // #swagger.summary = 'Obtener simulador del historial del estudiante'
    // #swagger.description = 'Endpoint para obtener un simulador específico del historial de un estudiante.'
    getSimulatorFromHistoryController)


module.exports = {
    routerHistory
}

