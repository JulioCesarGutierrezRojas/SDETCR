const { createCategory } = require('../service/category.service')
const { Router } = require('express')
const routerCategory = Router()

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

routerCategory.post('/create', createCategoryController)

module.exports = {
    routerCategory
}