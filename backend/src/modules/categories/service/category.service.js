const Category = require('../model/category.model')

const getAllCategories = async () => {
    try {
        const categorias = await Category.findAll()
        return categorias
    } catch (error) {
        console.log('Error en getAllCategories:', error.message)
        throw error
    }
}

const createCategory = async (name, description) => {
    try{
        if(!name || !description){
            const error = new Error('El nombre y la descripcion son requeridos')
            error.statusCode = 400
            throw error
        }

        const existe = await Category.findOne({
            where: {name}
        })
        if(existe){
            const error = new Error('La categoria ya existe!')
            error.statusCode = 409
            throw error
        }

        const nueva = await Category.create({name, description})
        return{
            message: 'Categoria creada con exito!',
            category: nueva
        }
    }catch(error){
        console.log('Error en createCategory: ', error.message)
        throw error
    }
}

module.exports = {
    getAllCategories,
    createCategory
}