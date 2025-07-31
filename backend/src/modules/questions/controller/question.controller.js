const { createQuestion, createMultipleQuestions } = require('../service/question.service')
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

module.exports = {
    routerQuestion
}
