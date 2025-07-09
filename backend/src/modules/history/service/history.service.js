const History = require('../model/history.model');
const User = require('../../users/model/user.model');
const Simulator = require('../../simulators/model/simulator.model');

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

module.exports = {
    getSimulatorFromHistory
};
