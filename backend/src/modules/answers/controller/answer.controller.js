const { saveAnswer } = require('../service/answer.service');
const { Router } = require('express');
const routerAnswer = Router();

const saveAnswerController = async (req, res) => {
    try{
        const data = req.body;
        const result = await saveAnswer(data);
        return res.status(result.getStatusCode()).json(result.getResponseBody());
    }catch(error){
        console.log('Error en saveAnswerController:', error.message);
        return res.status(500).json({message: error.message})
    }
}

routerAnswer.post('/save',
    // #swagger.tags = ['Respuestas']
    // #swagger.summary = 'Guardar una respuesta'
    // #swagger.description = 'Endpoint para guardar la respuesta de un usuario a una pregunta del simulador.'
    // #swagger.security = [{ "bearerAuth": [] }]
    saveAnswerController);

module.exports = {
    routerAnswer
}