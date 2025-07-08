const { createQuestion } = require('../service/question.service')
const { Router } = require('express')
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

routerQuestion.post('/create',
    // #swagger.tags = ['Preguntas']
    // #swagger.summary = 'Crear una nueva pregunta'
    // #swagger.description = 'Endpoint para crear una nueva pregunta para un simulador específico.'
    // #swagger.security = [{ "bearerAuth": [] }]
    createQuestionController)

module.exports = {
    routerQuestion
}
