const Category = require('../model/category.model')
const Simulator = require('../../simulators/model/simulator.model')
const ApiResponse = require('../../../kernel/api.response')
const TypesResponse = require('../../../kernel/types.response')

const getAllCategories = async () => {
    try {
        const categorias = await Category.findAll({
            include: [{
                model: Simulator,
                as: 'Simulator',
                attributes: [], // No necesitamos los datos del simulador, solo el conteo
                where: { status: true }, // Solo contar simuladores activos
                required: false // LEFT JOIN para incluir categorías sin simuladores
            }],
            attributes: [
                'category_id',
                'name',
                'description',
                'status',
                [Simulator.sequelize.fn('COUNT', Simulator.sequelize.col('Simulator.simulator_id')), 'simulators_count']
            ],
            group: ['Category.category_id']
        })
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

const updateCategory = async (id, name, description) => {
    try {
        const category = await Category.findOne({
            where: { category_id: id }
        });

        if (!category) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'Categoria no encontrada', 404)
        }

        category.name = name;
        category.description = description;
        await category.save();

        return new ApiResponse(null, null, TypesResponse.SUCCESS, 'Categoria actualizada con exito', 200)
    } catch (error) {
        console.log('Error al actualizar una categoria:', error.message)
        throw new Error(error.message || 'Error al actualizar la categoría')
    }
}

module.exports = {
    getAllCategories,
    createCategory,
    disableCategory,
    updateCategory
}