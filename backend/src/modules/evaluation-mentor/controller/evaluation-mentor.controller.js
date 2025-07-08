const { getFeedbackByStudentId } = require('../service/evaluation-mentor.service');
const { createEvaluation } = require('../service/evaluation-mentor.service');
const { Router } = require('express');
const routerEvaluation = Router();

const feedbacksController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await getFeedbackByStudentId(id);
        return res.status(result.getStatusCode()).json(result.getResponseBody());
    } catch (error) {
        console.error('Error en feedbacksController:', error.message);
        return res.status(500).json({ message: error.message })
    }
}

const createEvaluationController = async (req, res) => {
    try {
        const mentor_id = req.body.mentor_id;
        const { student_id, simulator_id, comment, final_score } = req.body
        const result = await createEvaluation({ mentor_id, student_id, simulator_id, comment, final_score })

        return res.status(result.getStatusCode()).json(result.getResponseBody())
    } catch (error) {
        console.error('Error en createEvaluationController:', error.message)
        return res.status(500).json({ message: error.message })
    }
}


//routerEvaluation.get('/feedback/:id', feedbacksController)
//routerEvaluation.post('/create', createEvaluationController)
routerEvaluation.get('/feedback/:id', 
    // #swagger.tags = ['Evaluación Mentor']
    // #swagger.summary = 'Obtener retroalimentaciones por ID de estudiante'
    // #swagger.description = 'Obtiene las retroalimentaciones de un estudiante por su ID'
    // #swagger.security = [{ "bearerAuth": [] }]
    feedbacksController
);

routerEvaluation.post('/create',
    // #swagger.tags = ['Evaluación Mentor']
    // #swagger.summary = 'Crear una nueva evaluación de mentor'
    // #swagger.description = 'Crea una nueva evaluación de mentor para un estudiante'
    // #swagger.security = [{ "bearerAuth": [] }]
    createEvaluationController
);

module.exports = {
    routerEvaluation
}