const Simulator = require('../model/simulator.model');
const Category = require('../../categories/model/category.model');
const ApiResponse = require('../../../kernel/api.response')
const TypesResponse = require('../../../kernel/types.response');

const updateSimulator = async (id, data) => {
    try{
        const simulator = await Simulator.findByPk(id)

        if(!simulator){
            return new ApiResponse(null, null, TypesResponse.WARNING, 'Simulador No Encontrado', 404)
        }

        const {name, status, category_id } = data

        if(category_id != undefined){
            const categoriaExiste = await Category.findByPk(category_id)
            if(!categoriaExiste){
                return new ApiResponse(null, null, TypesResponse.WARNING, 'Categoria No Encontrada', 400)
            }
            simulator.category_id = category_id
        }

        if(name !== undefined) simulator.name = name
        if(status !== undefined) simulator.status = status

        await simulator.save()

        return new ApiResponse(null, null, TypesResponse.SUCCESS, 'Simulador actualizado exitosamente', 200)
    }catch(error){
        console.log('Error en el updateSimulator:', error.message)
        throw new Error(error.message || 'Error al actualizar el simulador')
    }
}

const createSimulator = async (name, category_id) => {
    try {
        if (!name || !category_id) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'Nombre y categoría son requeridos', 400)
        }

        const nuevo = await Simulator.create({
            name,
            category_id,
            status: true //lopuse ooir default pa que esdten habilitados
        })

        return new ApiResponse(null, null, TypesResponse.SUCCESS, 'Simulador creado exitosamente', 201)
    } catch (error) {
        console.log('Error en createSimulator:', error.message)
        throw new Error(error.message || 'Error al crear el simulador')
    }
}

const disableSimulator = async (simulatorId) => {
    try {
        const simulador = await Simulator.findByPk(simulatorId)

        if (!simulador) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'Simulador no encontrado', 404)
        }

        simulador.status = false
        await simulador.save()

        return new ApiResponse(null, null, TypesResponse.SUCCESS, 'Simulador deshabilitado correctamente', 200)
    } catch (error) {
        console.log('Error en disableSimulator:', error.message)
        throw new Error(error.message || 'Error al deshabilitar el simulador')
    }
}

const getAllSimulators = async () => {
    try {
        const simuladors = await Simulator.findAll()
        return simuladors
    } catch (error) {
        console.log('Error al obtener todos los simuladores:', error.message)
        throw error
    }
}

module.exports = {
    updateSimulator,
    createSimulator,
    disableSimulator,
    getAllSimulators,
}
