const { updateSimulator, createSimulator, disableSimulator } = require('../service/simulator.service');
const { Router } = require('express');
const routerSimulator = Router();

const updateSimulatorController = async (req, res) => {
    try{
        const { id } = req.params
        const data = req.body

        const result = await updateSimulator(id, data)
        return res.status(result.getStatusCode()).json(result.getResponseBody())
    }catch(error){
        return res.status(500).json({ message: error.message})
    }
}

const createSimulatorController = async (req, res) => {
    try {
        const { name, category_id } = req.body
        const result = await createSimulator(name, category_id)
        return res.status(result.getStatusCode()).json(result.getResponseBody())
    } catch (error) {
        console.log('Error en createSimulatorController:', error.message)
        return res.status(500).json({ message: error.message })
    }
}

const disableSimulatorController = async (req, res) => {
    try {
        const { id } = req.params
        const result = await disableSimulator(id)
        return res.status(result.getStatusCode()).json(result.getResponseBody())
    } catch (error) {
        console.log('Error en disableSimulatorController:', error.message)
        return res.status(error.statusCode || 500).json({ message: error.message })
    }
}

routerSimulator.put('/:id', [] ,updateSimulatorController)
routerSimulator.post('/', [], createSimulatorController)
routerSimulator.patch('/', [], disableSimulatorController)

module.exports = {
    routerSimulator
}
