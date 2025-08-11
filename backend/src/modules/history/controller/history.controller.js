const { getSimulatorFromHistory, getHistoriesByStudent, getStudentCategoriesAndSimulators } = require('../service/history.service');
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

const getStudentCategoriesAndSimulatorsController = async (req, res) => {
    try {
        const { studentId } = req.params;
        
        if (!studentId) {
            return res.status(400).json({ message: 'El ID del estudiante es requerido' });
        }

        const result = await getStudentCategoriesAndSimulators(studentId);
        return res.status(result.getStatusCode()).json(result.getResponseBody());

    } catch (error) {
        console.error('Error en getStudentCategoriesAndSimulatorsController:', error.message);
        return res.status(500).json({ message: error.message });
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

routerHistory.get('/student/:studentId/categories', protectedEndpoint('mentor', 'administrador'),
    // #swagger.tags = ['Historial']
    // #swagger.summary = 'Obtener categorías y simuladores respondidos por estudiante (solo mentores/admin)'
    // #swagger.description = 'Obtiene las categorías en las que ha respondido un estudiante junto con el nombre de los simuladores, la calificación automática y el comentario del mentor.'
    // #swagger.security = [{ "bearerAuth": [] }]
    getStudentCategoriesAndSimulatorsController)

routerHistory.get('/my-results/:studentId',
    // #swagger.tags = ['Historial']
    // #swagger.summary = 'Obtener mis resultados (para estudiantes)'
    // #swagger.description = 'Permite a un estudiante obtener sus propios resultados de simuladores sin restricciones de rol.'
    getStudentCategoriesAndSimulatorsController)

//routerHistory.get('/byStudent',getHistoriesByStudent) // Este no se quien lo hizo jeje


module.exports = {
    routerHistory
}

