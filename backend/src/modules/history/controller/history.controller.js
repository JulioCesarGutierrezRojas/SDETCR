const historyService = require('../service/history.service')

const getHistoriesByStudent = async (req, res) => {
    try {
        const { studentId } = req.params
        const histories = await historyService.getHistoriesByStudent(studentId)
        res.status(200).json(histories)
    } catch (error) {
        console.error('Error en controller:', error.message)
        const status = error.statusCode || 500
        res.status(status).json({ message: error.message || 'Error interno del servidor' })
    }
}

module.exports = {
    getHistoriesByStudent
}
