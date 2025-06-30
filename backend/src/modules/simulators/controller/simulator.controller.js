//const { json } = require('sequelize');
const { updateSimulator } = require('../service/simulator.service');
const { Router } = require('express');
const routerSimulator = Router();

const updateSimulatorController = async (req, res) => {
    try{
        const { id } = req.params
        const data = req.body

        const result = await updateSimulator(id, data)
        return res.json(result)
    }catch(error){
        return res.status(error.statusCode || 500).json({ message: error.message})
    }
}

routerSimulator.put('/:id', [] ,updateSimulatorController)

module.exports = {
    routerSimulator
}