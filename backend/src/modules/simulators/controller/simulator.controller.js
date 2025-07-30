const { updateSimulator, createSimulator, disableSimulator, getAllSimulators, saveSimulatorResult } = require('../service/simulator.service');
const { Router } = require('express');
const {protectedEndpoint} = require("../../../security/auth.middleware");
const routerSimulator = Router();

const updateSimulatorController = async (req, res) => {
    try{
        const { id } = req.params
        const data = req.body

        const result = await updateSimulator(id, data)
        return res.status(result.getStatusCode()).json(result.getResponseBody())
    }catch(error){
        return res.status(500).json({ message: error.message})
    }
}

const createSimulatorController = async (req, res) => {
    try {
        const { name, category_id } = req.body
        const result = await createSimulator(name, category_id)
        return res.status(result.getStatusCode()).json(result.getResponseBody())
    } catch (error) {
        console.log('Error en createSimulatorController:', error.message)
        return res.status(500).json({ message: error.message })
    }
}

const disableSimulatorController = async (req, res) => {
    try {
        const { id } = req.params
        const result = await disableSimulator(id)
        return res.status(result.getStatusCode()).json(result.getResponseBody())
    } catch (error) {
        console.log('Error en disableSimulatorController:', error.message)
        return res.status(error.statusCode || 500).json({ message: error.message })
    }
}

const getAllSimulatorsController = async (req, res) => {
    try {
        const simulators = await getAllSimulators()
        return res.status(simulators.getStatusCode()).json(simulators.getResponseBody())
    } catch (error) {
        console.log('Error en getAllSimulatorsController:', error.message)
        return res.status(500).json({ message: error.message })
    }
}

const saveSimulatorResultController = async (req, res) => {
    const { student_id, simulator_id, final_score, answers } = req.body;

    if (!student_id || !simulator_id || final_score == undefined || !Array.isArray(answers) || answers.length === 0) {
        return res.status(400).json({ message: 'Faltan datos obligatorios o respuestas.' });
    }

    const result = await saveSimulatorResult({ student_id, simulator_id, final_score, answers });

    return res.status(result.getStatusCode()).json(result.getResponseBody());
};

routerSimulator.get('/all', protectedEndpoint('administrador'),
    // #swagger.tags = ['Simuladores']
    // #swagger.summary = 'Obtener todos los simuladores'
    // #swagger.description = 'Endpoint para obtener todos los simuladores de entrevistas disponibles en el sistema.'
    getAllSimulatorsController)

routerSimulator.put('/:id', protectedEndpoint('administrador'),
    // #swagger.tags = ['Simuladores']
    // #swagger.summary = 'Actualizar un simulador'
    // #swagger.description = 'Endpoint para actualizar la información de un simulador específico.'
    // #swagger.parameters['id'] = { description: 'ID del simulador a actualizar', type: 'string' }
    // #swagger.security = [{ "bearerAuth": [] }]
    updateSimulatorController)

routerSimulator.post('/', protectedEndpoint('administrador'),
    // #swagger.tags = ['Simuladores']
    // #swagger.summary = 'Crear un nuevo simulador'
    // #swagger.description = 'Endpoint para crear un nuevo simulador de entrevistas.'
    // #swagger.security = [{ "bearerAuth": [] }]
    createSimulatorController)

routerSimulator.patch('/', protectedEndpoint('administrador'),
    // #swagger.tags = ['Simuladores']
    // #swagger.summary = 'Deshabilitar un simulador'
    // #swagger.description = 'Endpoint para deshabilitar un simulador específico.'
    // #swagger.security = [{ "bearerAuth": [] }]
    disableSimulatorController)

routerSimulator.post('/saveSimulatorResult',
    // #swagger.tags = ['Simuladores']
    // #swagger.summary = 'Guardar resultado del simulador'
    // #swagger.description = 'Endpoint para guardar el resultado de un simulador realizado por un estudiante.'
    //protectedEndpoint('estudiante'),
    saveSimulatorResultController)


module.exports = {
    routerSimulator
}
