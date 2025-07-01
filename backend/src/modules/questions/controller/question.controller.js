const { createQuestion } = require('../service/question.service')

const createQuestionController = async (req, res) => {
    try {
        const { simulator_id, question, options, correct_answer } = req.body
        const result = await createQuestion(simulator_id, question, options, correct_answer)
        return res.status(201).json(result)
    } catch (error) {
        console.log('Error en createQuestionController:', error.message)
        return res.status(error.statusCode || 500).json({ message: error.message })
    }
}

module.exports = {
    createQuestion: createQuestionController
}
