const { updateSuggestionStatus, saveSuggestion, getSuggestionsApprovedAndPending } = require('../service/suggestion-simulator.service')
const { Router } = require('express')
const routerSuggestion = Router()
const { protectedEndpoint } = require('../../../security/auth.middleware')

const saveSuggestionController = async (req, res) => {
    try {
        const { category, suggestionName, description } = req.body
        const result = await saveSuggestion(category, suggestionName, description)
        return res.status(result.getStatusCode()).json(result.getResponseBody())
    } catch (error) {
        console.log('Error en saveSuggestionController:', error.message)
        return res.status(500).json({ message: error.message })
    }
}

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

const getSuggestionsApprovedAndPendingController = async (req, res) => {
    try {
        const result = await getSuggestionsApprovedAndPending();
        return res.status(result.getStatusCode()).json(result.getResponseBody());

    } catch (error) {
        console.error('Error en getSuggestionsApprovedAndPendingController:', error.message);
        return res.status(500).json({ message: error.message });
    }
}

// POST para guardar una nueva sugerencia
routerSuggestion.post('/', protectedEndpoint('estudiantes'),
    // #swagger.tags = ['Sugerencias']
    // #swagger.summary = 'Guardar una nueva sugerencia'
    // #swagger.description = 'Permite guardar una sugerencia para un simulador.'
    saveSuggestionController
)

// PATCH para actualizar solo el status
routerSuggestion.patch('/:suggestion_id/status',
    // #swagger.tags = ['Sugerencias']
    // #swagger.summary = 'Actualizar status de una sugerencia'
    // #swagger.description = 'Permite cambiar el estado de una sugerencia a aprobado o rechazado.'
    updateSuggestionStatusController
)

// GET para obtener sugerencias aprobadas y pendientes
routerSuggestion.get('/approved-pending', protectedEndpoint('administrador', 'mentor'),
    // #swagger.tags = ['Sugerencias']
    // #swagger.summary = 'Obtener sugerencias aprobadas y pendientes'
    // #swagger.description = 'Obtiene todas las sugerencias con el estado aprobado y pendiente.'
    getSuggestionsApprovedAndPendingController
)

module.exports = {
    routerSuggestion
}
