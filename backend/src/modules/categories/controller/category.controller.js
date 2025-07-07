const { createCategory, getAllCategories , disableCategory} = require('../service/category.service')
const { Router } = require('express')
const routerCategory = Router()

const createCategoryController = async (req, res) => {
    try{
        const {name, description} = req.body
        const result = await createCategory(name, description)
        return res.status(result.getStatusCode()).json(result.getResponseBody())
    }catch(error){
        console.log('Error en createCategoryController: ', error.message)
        return res.status(500).json({ message: error.message })
    }
}

const getAllCategoriesController = async (req, res) => {
    try {
        const result = await getAllCategories()
        return res.status(result.getStatusCode()).json(result.getResponseBody())
    } catch (error) {
        console.log('Error en getAllCategoriesController:', error.message)
        return res.status(500).json({ message: error.message })
    }
}

const disableCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        const result = await disableCategory(name);
        return res.status(result.getStatusCode()).json(result.getResponseBody());
    } catch (error) {
        console.log('Error en enableCategoryController:', error.message)
        return res.status(500).json({ message: error.message })
    }
}

routerCategory.get('/all', [],
    // #swagger.tags = ['Categorías']
    // #swagger.summary = 'Obtener todas las categorías'
    // #swagger.description = 'Endpoint para obtener todas las categorías de preguntas disponibles en el sistema.'
    getAllCategoriesController)

routerCategory.post('/create',
    // #swagger.tags = ['Categorías']
    // #swagger.summary = 'Crear una nueva categoría'
    // #swagger.description = 'Endpoint para crear una nueva categoría de preguntas.'
    // #swagger.security = [{ "bearerAuth": [] }]
    createCategoryController)

routerCategory.put('/disable',
    // #swagger.tags = ['Categorías']
    // #swagger.summary = 'Deshabilitar una categoría'
    // #swagger.description = 'Endpoint para deshabilitar una categoría específica.'
    // #swagger.security = [{ "bearerAuth": [] }]
    disableCategoryController)

module.exports = {
    routerCategory
}