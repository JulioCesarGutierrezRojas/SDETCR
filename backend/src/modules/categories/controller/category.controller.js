const { createCategory, getAllCategories , disableCategory, updateCategory} = require('../service/category.service')
const { Router } = require('express')
const {protectedEndpoint} = require("../../../security/auth.middleware");
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

const updateCategoryController = async (req, res) => {
    try {
        const { id, name, description } = req.body;
        const result = await updateCategory(id, name, description);
        return res.status(result.getStatusCode()).json(result.getResponseBody());
    } catch (error) {
        console.log('Error en updateCategoryController:', error.message)
        return res.status(500).json({ message: error.message })
    }
}

routerCategory.get('/all',
    // #swagger.tags = ['Categorías']
    // #swagger.summary = 'Obtener todas las categorías'
    // #swagger.description = 'Endpoint para obtener todas las categorías de preguntas disponibles en el sistema, incluyendo el contador de simuladores activos por categoría.'
    getAllCategoriesController)

routerCategory.post('/create', protectedEndpoint('administrador'),
    // #swagger.tags = ['Categorías']
    // #swagger.summary = 'Crear una nueva categoría'
    // #swagger.description = 'Endpoint para crear una nueva categoría de preguntas.'
    // #swagger.security = [{ "bearerAuth": [] }]
    createCategoryController)

routerCategory.patch('/disable', protectedEndpoint('administrador'),
    // #swagger.tags = ['Categorías']
    // #swagger.summary = 'Deshabilitar una categoría'
    // #swagger.description = 'Endpoint para deshabilitar una categoría específica.'
    // #swagger.security = [{ "bearerAuth": [] }]
    disableCategoryController)

routerCategory.put('/update', 
    // #swagger.tags = ['Categorías']
    // #swagger.summary = 'Actualizar una categoría'
    // #swagger.description = 'Endpoint para actualizar una categoría existente.'
    // #swagger.security = [{ "bearerAuth": [] }]
    updateCategoryController)

module.exports = {
    routerCategory
}