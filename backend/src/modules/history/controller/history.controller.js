const { getSimulatorFromHistory, getHistoriesByStudent } = require('../service/history.service');
const { Router } = require('express')
const {protectedEndpoint} = require("../../../security/auth.middleware");
const routerHistory = Router()

const getSimulatorFromHistoryController = async (req, res) => {
    try {
        const { studentId, simulatorId } = req.params;
        const result = await getSimulatorFromHistory(studentId, simulatorId);
        res.status(result.getStatusCode()).json(result.getResponseBody());
    } catch (error) {
        console.error('Error en getSimulatorFromHistoryController:', error.message);
        res.status(500).json({message: 'Error al obtener el historial del simulador'});
    }
};

const getHistoriesByStudentController = async (req, res) => {
    try {
        const { studentId } = req.params
        const histories = await getHistoriesByStudent(studentId)
        res.status(histories.getStatusCode()).json(histories.getResponseBody())
    } catch (error) {
        console.error('Error en controller:', error.message)
        res.status(500).json({ message: error.message || 'Error interno del servidor' })
    }
}

routerHistory.get('/student/:studentId', protectedEndpoint('mentor', 'administrador'),
    // #swagger.tags = ['Historial']
    // #swagger.summary = 'Obtener historial por estudiante'
    // #swagger.description = 'Devuelve todas las entrevistas simuladas realizadas por un estudiante específico, incluyendo detalles de los simuladores y categorías (contadores).'
    // #swagger.parameters['studentId'] = { description: 'ID del estudiante', in: 'path', required: true, type: 'string' }
    getHistoriesByStudentController)

routerHistory.get('/student/:studentId/simulator/:simulatorId', 
    // #swagger.tags = ['Historial']
    // #swagger.summary = 'Obtener simulador del historial del estudiante'
    // #swagger.description = 'Endpoint para obtener un simulador específico del historial de un estudiante.'
    getSimulatorFromHistoryController)

//routerHistory.get('/byStudent',getHistoriesByStudent) // Este no se quien lo hizo jeje


module.exports = {
    routerHistory
}

