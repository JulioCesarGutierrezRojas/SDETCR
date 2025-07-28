const { updateSuggestionStatus } = require('../service/suggestion.service')
const { Router } = require('express')
const routerSuggestion = Router()

const updateSuggestionStatusController = async (req, res) => {
    try {
        const { suggestion_id } = req.params
        const { status } = req.body

        const result = await updateSuggestionStatus(suggestion_id, status)
        return res.status(result.getStatusCode()).json(result.getResponseBody())
    } catch (error) {
        console.log('Error en updateSuggestionStatusController:', error.message)
        return res.status(500).json({ message: error.message })
    }
}


// PATCH para actualizar solo el status
routerSuggestion.patch('/:suggestion_id/status',
    // #swagger.tags = ['Sugerencias']
    // #swagger.summary = 'Actualizar status de una sugerencia'
    // #swagger.description = 'Permite cambiar el estado de una sugerencia a aprobado o rechazado.'
    updateSuggestionStatusController
)

module.exports = {
    routerSuggestion
}