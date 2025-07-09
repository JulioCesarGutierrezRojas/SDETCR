const History = require('../model/history.model')
const Simulator = require('../../simulators/model/simulator.model')

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

module.exports = {
    getHistoriesByStudent
}
