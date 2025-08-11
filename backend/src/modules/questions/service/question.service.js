const Question = require('../model/question.model')
const ApiResponse = require('../../../kernel/api.response')
const TypesResponse = require('../../../kernel/types.response')
const sequelize = require('../../../config/database')
const Simulator = require('../../simulators/model/simulator.model')

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

const createMultipleQuestions = async (simulator_id, questionsList) => {
    const transaction = await sequelize.transaction();
    try {
        // Validar parámetros básicos
        if (!simulator_id || !questionsList || !Array.isArray(questionsList)) {
            await transaction.rollback();
            return new ApiResponse(null, null, TypesResponse.WARNING, 'simulator_id y questionsList (array) son requeridos', 400);
        }

        // Validar que sean exactamente 10 preguntas
        if (questionsList.length !== 10) {
            await transaction.rollback();
            return new ApiResponse(null, null, TypesResponse.WARNING, 'Se requieren exactamente 10 preguntas', 400);
        }

        // Verificar que el simulador existe
        const simulator = await Simulator.findByPk(simulator_id);
        if (!simulator) {
            await transaction.rollback();
            return new ApiResponse(null, null, TypesResponse.WARNING, 'El simulador especificado no existe', 404);
        }

        // Verificar si ya existen preguntas para este simulador
        const existingQuestions = await Question.findAll({
            where: { simulator_id },
            transaction
        });

        if (existingQuestions.length > 0) {
            await transaction.rollback();
            return new ApiResponse(null, null, TypesResponse.WARNING, 'Este simulador ya tiene preguntas asignadas', 409);
        }

        const createdQuestions = [];
        
        // Validar y crear cada pregunta
        for (let i = 0; i < questionsList.length; i++) {
            const { question, options, correct_answer } = questionsList[i];
            
            // Validar campos obligatorios de cada pregunta
            if (!question || !options || !correct_answer) {
                await transaction.rollback();
                return new ApiResponse(null, null, TypesResponse.WARNING, `Pregunta ${i + 1}: Todos los campos (question, options, correct_answer) son requeridos`, 400);
            }

            // Validar que options sea un array
            if (!Array.isArray(options) || options.length === 0) {
                await transaction.rollback();
                return new ApiResponse(null, null, TypesResponse.WARNING, `Pregunta ${i + 1}: Las opciones deben ser un array no vacío`, 400);
            }

            // Validar que correct_answer esté en las opciones
            if (!options.includes(correct_answer)) {
                await transaction.rollback();
                return new ApiResponse(null, null, TypesResponse.WARNING, `Pregunta ${i + 1}: La respuesta correcta debe estar incluida en las opciones`, 400);
            }

            // Crear la pregunta
            const newQuestion = await Question.create({
                simulator_id,
                question: question.trim(),
                options,
                correct_answer: correct_answer.trim()
            }, { transaction });

            createdQuestions.push(newQuestion);
        }

        // Si llegamos aquí, todo salió bien
        await transaction.commit();

        return new ApiResponse(null, null, TypesResponse.SUCCESS, 'Las 10 preguntas fueron creadas exitosamente', 201);

    } catch (error) {
        await transaction.rollback();
        console.error('Error en createMultipleQuestions:', error);
        return new ApiResponse(null, null, TypesResponse.ERROR, 'Error interno al crear las preguntas', 500);
    }
};

const getQuestionsBySimulator = async (simulator_id) => {
    try {
        if (!simulator_id) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'El ID del simulador es requerido', 400);
        }

        // Verificar que el simulador existe
        const simulator = await Simulator.findByPk(simulator_id);
        if (!simulator) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'El simulador especificado no existe', 404);
        }

        // Obtener las preguntas del simulador
        const questions = await Question.findAll({
            where: { simulator_id },
            attributes: ['question_id', 'question', 'options'],
            order: [['question_id', 'ASC']]
        });

        if (questions.length === 0) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'No se encontraron preguntas para este simulador', 404);
        }

        const result = {
            simulator: {
                simulator_id: simulator.simulator_id,
                name: simulator.name
            },
            questions: questions.map(q => ({
                question_id: q.question_id,
                question: q.question,
                options: q.options
            }))
        };

        return new ApiResponse(null, result, TypesResponse.SUCCESS, 'Preguntas obtenidas exitosamente', 200);

    } catch (error) {
        console.error('Error en getQuestionsBySimulator:', error);
        return new ApiResponse(null, null, TypesResponse.ERROR, 'Error interno al obtener las preguntas', 500);
    }
};

// Nuevo servicio para obtener preguntas con respuestas correctas (solo para admin)
const getQuestionsWithAnswersBySimulator = async (simulator_id) => {
    try {
        if (!simulator_id) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'El ID del simulador es requerido', 400);
        }

        // Verificar que el simulador existe
        const simulator = await Simulator.findByPk(simulator_id);
        if (!simulator) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'El simulador especificado no existe', 404);
        }

        // Obtener las preguntas del simulador con respuestas correctas
        const questions = await Question.findAll({
            where: { simulator_id },
            attributes: ['question_id', 'question', 'options', 'correct_answer'],
            order: [['question_id', 'ASC']]
        });

        if (questions.length === 0) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'No se encontraron preguntas para este simulador', 404);
        }

        const result = {
            simulator: {
                simulator_id: simulator.simulator_id,
                name: simulator.name
            },
            questions: questions.map(q => ({
                question_id: q.question_id,
                question: q.question,
                options: q.options,
                correct_answer: q.correct_answer
            }))
        };

        return new ApiResponse(null, result, TypesResponse.SUCCESS, 'Preguntas obtenidas exitosamente', 200);

    } catch (error) {
        console.error('Error en getQuestionsWithAnswersBySimulator:', error);
        return new ApiResponse(null, null, TypesResponse.ERROR, 'Error interno al obtener las preguntas', 500);
    }
};

// Nuevo servicio para actualizar múltiples preguntas
const updateMultipleQuestions = async (simulator_id, questionsList) => {
    const transaction = await sequelize.transaction();
    try {
        // Validar parámetros básicos
        if (!simulator_id || !questionsList || !Array.isArray(questionsList)) {
            await transaction.rollback();
            return new ApiResponse(null, null, TypesResponse.WARNING, 'simulator_id y questionsList (array) son requeridos', 400);
        }

        // Validar que sean exactamente 10 preguntas
        if (questionsList.length !== 10) {
            await transaction.rollback();
            return new ApiResponse(null, null, TypesResponse.WARNING, 'Se requieren exactamente 10 preguntas', 400);
        }

        // Verificar que el simulador existe
        const simulator = await Simulator.findByPk(simulator_id);
        if (!simulator) {
            await transaction.rollback();
            return new ApiResponse(null, null, TypesResponse.WARNING, 'El simulador especificado no existe', 404);
        }

        // Eliminar preguntas existentes
        await Question.destroy({
            where: { simulator_id },
            transaction
        });

        const createdQuestions = [];
        
        // Validar y crear cada pregunta
        for (let i = 0; i < questionsList.length; i++) {
            const { question, options, correct_answer } = questionsList[i];
            
            // Validar campos obligatorios de cada pregunta
            if (!question || !options || !correct_answer) {
                await transaction.rollback();
                return new ApiResponse(null, null, TypesResponse.WARNING, `Pregunta ${i + 1}: Todos los campos (question, options, correct_answer) son requeridos`, 400);
            }

            // Validar que options sea un array
            if (!Array.isArray(options) || options.length === 0) {
                await transaction.rollback();
                return new ApiResponse(null, null, TypesResponse.WARNING, `Pregunta ${i + 1}: Las opciones deben ser un array no vacío`, 400);
            }

            // Validar que correct_answer esté en las opciones
            if (!options.includes(correct_answer)) {
                await transaction.rollback();
                return new ApiResponse(null, null, TypesResponse.WARNING, `Pregunta ${i + 1}: La respuesta correcta debe estar incluida en las opciones`, 400);
            }

            // Crear la pregunta
            const newQuestion = await Question.create({
                simulator_id,
                question: question.trim(),
                options,
                correct_answer: correct_answer.trim()
            }, { transaction });

            createdQuestions.push(newQuestion);
        }

        // Si llegamos aquí, todo salió bien
        await transaction.commit();

        return new ApiResponse(null, null, TypesResponse.SUCCESS, 'Las preguntas fueron actualizadas exitosamente', 200);

    } catch (error) {
        await transaction.rollback();
        console.error('Error en updateMultipleQuestions:', error);
        return new ApiResponse(null, null, TypesResponse.ERROR, 'Error interno al actualizar las preguntas', 500);
    }
};

module.exports = {
    createQuestion,
    createMultipleQuestions,
    getQuestionsBySimulator,
    getQuestionsWithAnswersBySimulator,
    updateMultipleQuestions
}
