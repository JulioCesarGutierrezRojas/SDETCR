const { createQuestion, createMultipleQuestions, getQuestionsBySimulator, getQuestionsWithAnswersBySimulator, updateMultipleQuestions } = require('../service/question.service')
const { Router } = require('express')
const {protectedEndpoint} = require("../../../security/auth.middleware");
const routerQuestion = Router()

const createQuestionController = async (req, res) => {
    try {
        const { simulator_id, question, options, correct_answer } = req.body
        const result = await createQuestion(simulator_id, question, options, correct_answer)
        return res.status(result.getStatusCode()).json(result.getResponseBody())
    } catch (error) {
        console.log('Error en createQuestionController:', error.message)
        return res.status(500).json({message: error.message})
    }
}

const createMultipleQuestionsController = async (req, res) => {
    try {
        const { simulator_id, questions } = req.body;
        
        if (!Array.isArray(questions)) {
            return res.status(400).json({ message: 'El campo questions debe ser un array' });
        }

        const result = await createMultipleQuestions(simulator_id, questions);
        return res.status(result.getStatusCode()).json(result.getResponseBody());

    } catch (error) {
        console.error('Error en createMultipleQuestionsController:', error.message);
        return res.status(500).json({ message: error.message });
    }
}

const getQuestionsBySimulatorController = async (req, res) => {
    try {
        const { simulator_id } = req.params;
        
        const result = await getQuestionsBySimulator(simulator_id);
        return res.status(result.getStatusCode()).json(result.getResponseBody());

    } catch (error) {
        console.error('Error en getQuestionsBySimulatorController:', error.message);
        return res.status(500).json({ message: error.message });
    }
}

const getQuestionsWithAnswersBySimulatorController = async (req, res) => {
    try {
        const { simulator_id } = req.params;
        
        const result = await getQuestionsWithAnswersBySimulator(simulator_id);
        return res.status(result.getStatusCode()).json(result.getResponseBody());

    } catch (error) {
        console.error('Error en getQuestionsWithAnswersBySimulatorController:', error.message);
        return res.status(500).json({ message: error.message });
    }
}

const updateMultipleQuestionsController = async (req, res) => {
    try {
        const { simulator_id, questions } = req.body;
        
        if (!Array.isArray(questions)) {
            return res.status(400).json({ message: 'El campo questions debe ser un array' });
        }

        const result = await updateMultipleQuestions(simulator_id, questions);
        return res.status(result.getStatusCode()).json(result.getResponseBody());

    } catch (error) {
        console.error('Error en updateMultipleQuestionsController:', error.message);
        return res.status(500).json({ message: error.message });
    }
}

routerQuestion.post('/create', protectedEndpoint('administrador', 'mentor'),
    // #swagger.tags = ['Preguntas']
    // #swagger.summary = 'Crear una nueva pregunta'
    // #swagger.description = 'Endpoint para crear una nueva pregunta para un simulador específico.'
    // #swagger.security = [{ "bearerAuth": [] }]
    createQuestionController)

routerQuestion.post('/create-multiple',
    // #swagger.tags = ['Preguntas']
    // #swagger.summary = 'Crear múltiples preguntas para un simulador'
    // #swagger.description = 'Endpoint para crear exactamente 10 preguntas para un simulador específico usando transacciones.'
    // #swagger.security = [{ "bearerAuth": [] }]
    createMultipleQuestionsController)

routerQuestion.get('/simulator/:simulator_id',
    // #swagger.tags = ['Preguntas']
    // #swagger.summary = 'Obtener preguntas de un simulador'
    // #swagger.description = 'Endpoint para obtener todas las preguntas de un simulador específico con sus opciones (sin mostrar las respuestas correctas).'
    // #swagger.parameters['simulator_id'] = { description: 'ID del simulador', in: 'path', required: true, type: 'integer' }
    getQuestionsBySimulatorController)

routerQuestion.get('/admin/simulator/:simulator_id', protectedEndpoint('administrador'),
    // #swagger.tags = ['Preguntas']
    // #swagger.summary = 'Obtener preguntas con respuestas correctas (Admin)'
    // #swagger.description = 'Endpoint para obtener todas las preguntas de un simulador con respuestas correctas. Solo para administradores.'
    // #swagger.parameters['simulator_id'] = { description: 'ID del simulador', in: 'path', required: true, type: 'integer' }
    // #swagger.security = [{ "bearerAuth": [] }]
    getQuestionsWithAnswersBySimulatorController)

routerQuestion.put('/update-multiple', protectedEndpoint('administrador'),
    // #swagger.tags = ['Preguntas']
    // #swagger.summary = 'Actualizar múltiples preguntas'
    // #swagger.description = 'Endpoint para actualizar exactamente 10 preguntas de un simulador. Reemplaza todas las preguntas existentes.'
    // #swagger.security = [{ "bearerAuth": [] }]
    updateMultipleQuestionsController)

module.exports = {
    routerQuestion
}
