const Simulator = require('../model/simulator.model');
const Category = require('../../categories/model/category.model');

const updateSimulator = async (id, data) => {
    try{
        const simulator = await Simulator.findByPk(id)

        if(!simulator){
            const error = new Error('Simulador No Encontrado')
            error.statusCode = 404
            throw error
        }

        const {name, status, category_id } = data

        if(category_id != undefined){
            const categoriaExiste = await Category.findByPk(category_id)
            if(!categoriaExiste){
                const error = new Error('Categoria No Encontrada')
                error.statusCode = 400
                throw error
            }
            simulator.category_id = category_id
        }

        if(name !== undefined) simulator.name = name
        if(status !== undefined) simulator.status = status

        await simulator.save()

        return { message: 'Simulador Actualizado Correctamente ', simulator}
    }catch(error){
        console.log('Error en el updateSimulator:', error.message)
        throw error
    }
}

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
        thrown error
    }
}

module.exports = {
    updateSimulator,
    createSimulator,
    disableSimulator
}
