const History = require('../model/history.model');
const User = require('../../users/model/user.model');
const Simulator = require('../../simulators/model/simulator.model');
const ApiResponse = require('../../../kernel/api.response');
const TypesResponse = require('../../../kernel/types.response');
const EvaluationMentor = require('../../evaluation-mentor/model/evaluation-mentor.model');
const Category = require('../../categories/model/category.model');

const getSimulatorFromHistory = async (studentId, simulatorId) => {
    try {
        const historyRecord = await History.findOne({
            where: {
                student_id: studentId,
                simulator_id: simulatorId
            },
            include: [
                {
                    model: User,
                    as: 'Student',
                    attributes: ['user_id', 'name', 'lastname', 'email']
                },
                {
                    model: Simulator,
                    as: 'Simulator',
                    attributes: ['simulator_id', 'name', 'status'] 
                }
            ]
        });

        if (!historyRecord) {
            return {
                success: false,
                message: 'No se encontró el simulador en el historial del estudiante.'
            };
        }

        const plainData = historyRecord.get({ plain: true });

        const date = new Date(plainData.date_realized);
        const formattedDateTime = date.toLocaleString('es-MX', {
            timeZone: 'UTC',           
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        plainData.date_realized = formattedDateTime;

        return {
            success: true,
            data: plainData
        };
    } catch (error) {
        console.error('Error en getSimulatorFromHistory:', error);
        throw error;
    }
};

const getHistoriesByStudent = async (studentId) => {
    try {
        if (!studentId) {
            const error = new Error('El ID del estudiante es obligatorii')
            error.statusCode = 400
            throw error
        }

        const histories = await History.findAll({
            where: { student_id: studentId },
            include: [
                {
                    model: Simulator,
                    as: 'Simulator',
                    attributes: ['simulator_id', 'name', 'status']
                }
            ],
            order: [['date_realized', 'DESC']]
        })

        if (!histories.length) {
            const error = new Error('No se encontraron historiales para este estudiante')
            error.statusCode = 404
            throw error
        }

        return histories
    } catch (error) {
        console.log('Error en getHistoriesByStudent:', error.message)
        throw error
    }
}

const getStudentCategoriesAndSimulators = async (studentId) => {
    try {
        if (!studentId) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'El ID del estudiante es requerido', 400);
        }

        // Obtener historiales del estudiante con simuladores y categorías
        const histories = await History.findAll({
            where: { student_id: studentId },
            include: [
                {
                    model: Simulator,
                    as: 'Simulator',
                    attributes: ['simulator_id', 'name'],
                    include: [
                        {
                            model: Category,
                            as: 'Category',
                            attributes: ['category_id', 'name']
                        }
                    ]
                }
            ],
            attributes: ['history_id', 'simulator_id', 'date_realized', 'final_score'],
            order: [['date_realized', 'DESC']]
        });

        if (!histories || histories.length === 0) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'No se encontraron categorías para este estudiante', 404);
        }

        // Obtener evaluaciones del mentor para cada simulador
        const simulatorIds = histories.map(h => h.simulator_id);
        const evaluations = await EvaluationMentor.findAll({
            where: {
                student_id: studentId,
                simulator_id: simulatorIds
            },
            attributes: ['simulator_id', 'comment', 'final_score', 'date_evaluation']
        });

        // Crear un mapa de evaluaciones por simulator_id
        const evaluationMap = {};
        evaluations.forEach(eval => {
            evaluationMap[eval.simulator_id] = {
                comment: eval.comment,
                final_score: eval.final_score,
                date_evaluation: eval.date_evaluation
            };
        });

        // Agrupar por categoría
        const categoriesMap = {};
        histories.forEach(history => {
            const categoryId = history.Simulator.Category.category_id;
            const categoryName = history.Simulator.Category.name;
            
            if (!categoriesMap[categoryId]) {
                categoriesMap[categoryId] = {
                    category_id: categoryId,
                    category_name: categoryName,
                    simulators: []
                };
            }

            const evaluation = evaluationMap[history.simulator_id] || null;
            
            categoriesMap[categoryId].simulators.push({
                simulator_id: history.Simulator.simulator_id,
                simulator_name: history.Simulator.name,
                date_realized: history.date_realized,
                automatic_score: history.final_score,
                mentor_evaluation: evaluation
            });
        });

        const formattedData = Object.values(categoriesMap);

        return new ApiResponse(null, formattedData, TypesResponse.SUCCESS, 'Categorías y Simuladores obtenidos exitosamente', 200);
    } catch (error) {
        console.error('Error en getStudentCategoriesAndSimulators:', error);
        return new ApiResponse(null, null, TypesResponse.ERROR, 'Error interno al obtener las categorías', 500);
    }
};

module.exports = {
    getHistoriesByStudent,
    getSimulatorFromHistory,
    getStudentCategoriesAndSimulators
}

