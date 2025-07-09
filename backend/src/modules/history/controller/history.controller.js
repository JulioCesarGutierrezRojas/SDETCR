const { getSimulatorFromHistory } = require('../service/history.service');
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

routerHistory.get('/student/:studentId/simulator/:simulatorId', 
    // #swagger.tags = ['Historial']
    // #swagger.summary = 'Obtener simulador del historial del estudiante'
    // #swagger.description = 'Endpoint para obtener un simulador específico del historial de un estudiante.'
    getSimulatorFromHistoryController)

module.exports = {
    routerHistory
};
