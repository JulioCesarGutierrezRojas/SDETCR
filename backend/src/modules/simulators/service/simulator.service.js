
const Simulator = require('../model/simulator.model')


const createSimulator = async (name, category_id) => {
    try {
        if (!name || !category_id) {
            const error = new Error('Nombre y categoría son requeridos')
            error.statusCode = 400
            throw error
        }

        const nuevo = await Simulator.create({
            name,
            category_id,
            status: true //lopuse ooir default pa que esdten habilitados
        })

        return {
            message: 'Simulador creado exitosamente',
            simulator: nuevo
        }
    } catch (error) {
        console.log('Error en createSimulator:', error.message)
        throw error
    }
}

const disableSimulator = async (simulatorId) => {
    try {
        const simulador = await Simulator.findByPk(simulatorId)

        if (!simulador) {
            const error = new Error('Simulador no encontrado')
            error.statusCode = 404
            throw error
        }

        simulador.status = false
        await simulador.save()

        return {
            message: 'Simulador deshabilitado correctamente',
            simulator: simulador
        }
    } catch (error) {
        console.log('Error en disableSimulator:', error.message)
        throw error
    }
}

module.exports = {
    createSimulator,
    disableSimulator
}
