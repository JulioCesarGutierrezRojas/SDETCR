const Question = require('../model/question.model')

const createQuestion = async (simulator_id, question, options, correct_answer) => {
    try {
        if (!simulator_id || !question || !options || !correct_answer) {
            const error = new Error('Todos los campos son requeridos')
            error.statusCode = 400
            throw error
        }

        const nuevaPregunta = await Question.create({
            simulator_id,
            question,
            options,
            correct_answer
        })

        return {
            message: 'Pregunta creada exitosamente',
            question: nuevaPregunta
        }
    } catch (error) {
        console.log('Error en createQuestion:', error.message)
        throw error
    }
}

module.exports = {
    createQuestion
}
