const History = require('../model/history.model');
const User = require('../../users/model/user.model');
const Simulator = require('../../simulators/model/simulator.model');
const Category = require('../../categories/model/category.model');
const ApiResponse = require('../../../kernel/api.response')
const TypesResponse = require('../../../kernel/types.response')

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
            return new ApiResponse(null, null, TypesResponse.WARNING, 'No se encontró el simulador en el historial del estudiante.', 404);
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

        return new ApiResponse(null, plainData, TypesResponse.SUCCESS, 'Simulador obtenido correctamente del historial', 200);
    } catch (error) {
        console.error('Error en getSimulatorFromHistory:', error);
        throw new Error(error.message || 'Error al obtener el simulador del historial');
    }
};

const getHistoriesByStudent = async (studentId) => {
    try {
        if (!studentId) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'El ID del estudiante es obligatorio', 400);
        }

        const histories = await History.findAll({
            where: { student_id: studentId },
            include: [
                {
                    model: Simulator,
                    as: 'Simulator',
                    attributes: ['simulator_id', 'name', 'status', 'category_id'],
                    include: [
                        {
                            model: Category,
                            as: 'Category',
                            attributes: ['category_id', 'name', 'description']
                        }
                    ]
                }
            ],
            order: [['date_realized', 'DESC']]
        })

        if (!histories.length) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'No se encontraron historiales para este estudiante', 404)
        }

        // Calcular contadores
        const totalSimulators = histories.length;
        
        // Obtener categorías únicas
        const uniqueCategories = new Set();
        histories.forEach(history => {
            if (history.Simulator && history.Simulator.Category) {
                uniqueCategories.add(history.Simulator.Category.category_id);
            }
        });
        const totalCategories = uniqueCategories.size;

        return new ApiResponse(null, { totalSimulators, totalCategories, histories }, TypesResponse.SUCCESS, 'Historiales obtenidos correctamente', 200)
    } catch (error) {
        console.log('Error en getHistoriesByStudent:', error.message)
        throw new Error(error.message || 'Error al obtener los historiales del estudiante');
    }
}

module.exports = {
    getHistoriesByStudent,
    getSimulatorFromHistory
}

