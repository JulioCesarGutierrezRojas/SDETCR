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

module.exports = {
    updateSimulator
}