const Category = require('../model/category.model')
const ApiResponse = require('../../../kernel/api.response')
const TypesResponse = require('../../../kernel/types.response')

const getAllCategories = async () => {
    try {
        const categorias = await Category.findAll()
        return new ApiResponse(null, categorias, TypesResponse.SUCCESS, 'Categorías obtenidas exitosamente', 200)
    } catch (error) {
        console.log('Error en getAllCategories:', error.message)
        throw new Error(error.message || 'Error al obtener las categorías')
    }
}

const createCategory = async (name, description) => {
    try{
        if(!name || !description){
            return new ApiResponse(null, null, TypesResponse.WARNING, 'El nombre y la descripción son requeridos', 400)
        }

        const existe = await Category.findOne({
            where: {name}
        })
        if(existe){
            return new ApiResponse(null, null, TypesResponse.WARNING, 'La categoria ya existe', 409)
        }

        const nueva = await Category.create({name, description})

        return new ApiResponse(null, nueva, TypesResponse.SUCCESS, 'Categoria creada exitosamente', 201)
    }catch(error){
        console.log('Error en createCategory: ', error.message)
        throw new Error(error.message || 'Error al crear la categoría')
    }
}

const disableCategory = async (name) => {
    try {
        const category = await Category.findOne({ where: { name } });
        if (!category) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'Categoria no encontrada', 404)
        }

        category.status = false;
        await category.save();

        return new ApiResponse(null, null, TypesResponse.SUCCESS, 'Categoria deshabilitada con exito', 200)
    } catch (error) {
        console.log('Error al deshabilitar una categoria:', error.message)
        throw new Error(error.message || 'Error al deshabilitar la categoría')
    }
}

module.exports = {
    getAllCategories,
    createCategory,
    disableCategory,
}