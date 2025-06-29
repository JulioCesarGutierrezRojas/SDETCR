
const { disableSimulator, createSimulator } = require('../service/simulator.service')


const createSimulatorController = async (req, res) => {
    try {
        const { name, category_id } = req.body
        const result = await createSimulator(name, category_id)
        return res.status(201).json(result)
    } catch (error) {
        console.log('Error en createSimulatorController:', error.message)
        return res.status(error.statusCode || 500).json({ message: error.message })
    }
}

const disableSimulatorController = async (req, res) => {
    try {
        const { id } = req.params
        const result = await disableSimulator(id)
        return res.status(200).json(result)
    } catch (error) {
        console.log('Error en disableSimulatorController:', error.message)
        return res.status(error.statusCode || 500).json({ message: error.message })
    }
}

module.exports = {
    createSimulator: createSimulatorController,
    disableSimulator: disableSimulatorController
}
