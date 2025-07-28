const SuggestionSimulator = require('../model/suggestion-simulator.model')
const ApiResponse = require('../../../kernel/api.response')
const TypesResponse = require('../../../kernel/types.response')

const saveSuggestion= async(category,suggestionName, description)=>{
    try {
        if (!category || !suggestionName || !description) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'Faltan datos obligatorios', 400)
        }

       await SuggestionSimulator.create({
            suggested_category: category,
            suggested_name: suggestionName,
            suggested_descrption: description,
            status: 'pendiente'
        })

        return new ApiResponse(null, null, TypesResponse.SUCCESS, 'Sugerencia guardada exitosamente', 201)
    } catch (error) {
        console.log('Error en saveSuggestion:', error.message)
        throw new Error('Error al guardar la sugerencia')
    }
}

const updateSuggestionStatus = async (suggestion_id, status) => {
    try {
        if (!suggestion_id || !status) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'ID y status son requeridos', 400)
        }

        const validStatuses = ['aprobado', 'rechazado']
        if (!validStatuses.includes(status)) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'Status inválido', 400)
        }

        const suggestion = await SuggestionSimulator.findByPk(suggestion_id)
        if (!suggestion) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'Sugerencia no encontrada', 404)
        }

        suggestion.status = status
        await suggestion.save()

        return new ApiResponse(null, suggestion, TypesResponse.SUCCESS, `Sugerencia ${status} exitosamente`, 200)
    } catch (error) {
        console.log('Error en updateSuggestionStatus:', error.message)
        throw new Error('Error al actualizar el status de la sugerencia')
    }
}

module.exports = {
    updateSuggestionStatus,
    saveSuggestion
}
