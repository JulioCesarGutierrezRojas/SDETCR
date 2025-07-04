const Question = require('../model/question.model')
const ApiResponse = require('../../../kernel/api.response')
const TypesResponse = require('../../../kernel/types.response')

const createQuestion = async (simulator_id, question, options, correct_answer) => {
    try {
        if (!simulator_id || !question || !options || !correct_answer) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'Todos los campos son requeridos', 400)
        }

        const nuevaPregunta = await Question.create({
            simulator_id,
            question,
            options,
            correct_answer
        })

        return new ApiResponse(null, nuevaPregunta, TypesResponse.SUCCESS, 'Pregunta creada exitosamente', 201)
    } catch (error) {
        console.log('Error en createQuestion:', error.message)
        throw new Error(error.message || 'Error al crear la pregunta')
    }
}

module.exports = {
    createQuestion
}
