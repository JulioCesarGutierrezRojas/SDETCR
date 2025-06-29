const { createCategory, getAllCategories } = require('../service/category.service')


const getAllCategoriesController = async (req, res) => {
    try {
        const result = await getAllCategories()
        return res.status(200).json(result)
    } catch (error) {
        console.log('Error en getAllCategoriesController:', error.message)
        return res.status(error.statusCode || 500).json({ message: error.message })
    }
}

const createCategoryController = async (req, res) => {
    try{
        const {name, description} = req.body
        const result = await createCategory(name, description)
        return res.status(201).json(result)
    }catch(error){
        console.log('Error en createCategoryController: ', error.message)
        return res.status(error.statusCode || 500).json({ message: error.message })
    }
}

module.exports = {
    getAllCategories: getAllCategoriesController,
    createCategory: createCategoryController
}