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

routerCategory.get('/all', [], getAllCategoriesController)
routerCategory.post('/create', createCategoryController)
routerCategory.put('/disable', disableCategoryController)

module.exports = {
    routerCategory
}