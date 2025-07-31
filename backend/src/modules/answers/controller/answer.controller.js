const { saveAnswers, getStudentAnswersWithEvaluation, getStudentAnswersWithoutEvaluation } = require('../service/answer.service');
const { Router } = require('express');
const { protectedEndpoint } = require("../../../security/auth.middleware");
const { upload } = require("../../../config/multer")
const routerAnswer = Router();

const saveAnswerController = async (req, res) => {
    try {
        const { student_id, simulator_id, answerList } = req.body;
        const files = req.files || [];

        if (!student_id || !simulator_id) {
            return res.status(400).json({ message: 'Faltan datos obligatorios: student_id o simulator_id' });
        }

        let answerArray;
        try {
            answerArray = typeof answerList === 'string' ? JSON.parse(answerList) : answerList;
            if (!Array.isArray(answerArray)) {
                return res.status(400).json({
                    message: 'El campo "answerList" debe ser un arreglo de respuestas.'
                });
            }
            if (answerArray.length === 0) {
                return res.status(400).json({
                    message: 'El campo "answerList" no puede estar vacío.'
                });
            }
        } catch (error) {
            return res.status(400).json({
                message: 'Error al procesar las respuestas. Asegúrate de enviar un JSON válido.',
                error: error.message
            });
        }

        const result = await saveAnswers(student_id, simulator_id, answerArray, files);
        return res.status(result.getStatusCode()).json(result.getResponseBody());

    } catch (error) {
        console.log('Error en saveAnswerController: ', error.message);
        return res.status(500).json({ message: error.message });
    }
}

const getStudentAnswersWithEvaluationController = async (req, res) => {
    try {
        const { student_id, simulator_id } = req.params;
        
        if (!student_id || !simulator_id) {
            return res.status(400).json({ message: 'student_id y simulator_id son requeridos' });
        }

        const result = await getStudentAnswersWithEvaluation(student_id, simulator_id);
        return res.status(result.getStatusCode()).json(result.getResponseBody());

    } catch (error) {
        console.error('Error en getStudentAnswersWithEvaluationController:', error.message);
        return res.status(500).json({ message: error.message });
    }
}

const getStudentAnswersWithoutEvaluationController = async (req, res) => {
    try {
        const { student_id, simulator_id } = req.params;
        
        if (!student_id || !simulator_id) {
            return res.status(400).json({ message: 'student_id y simulator_id son requeridos' });
        }

        const result = await getStudentAnswersWithoutEvaluation(student_id, simulator_id);
        return res.status(result.getStatusCode()).json(result.getResponseBody());

    } catch (error) {
        console.error('Error en getStudentAnswersWithoutEvaluationController:', error.message);
        return res.status(500).json({ message: error.message });
    }
}


routerAnswer.post('/save', //protectedEndpoint('estudiantes'),
    upload.array('files', 20),
    // #swagger.tags = ['Respuestas']
    // #swagger.summary = 'Guardar una respuesta'
    // #swagger.description = 'Endpoint para guardar la respuesta de un usuario a una pregunta del simulador.'
    // #swagger.security = [{ "bearerAuth": [] }]
    saveAnswerController);

routerAnswer.get('/student/:student_id/simulator/:simulator_id/with-evaluation',
    // #swagger.tags = ['Respuestas']
    // #swagger.summary = 'Obtener respuestas del estudiante con evaluación del mentor'
    // #swagger.description = 'Obtiene las respuestas de un estudiante para un simulador específico incluyendo las preguntas, si son correctas y la evaluación del mentor (calificación y comentario).'
    // #swagger.security = [{ "bearerAuth": [] }]
    getStudentAnswersWithEvaluationController);

routerAnswer.get('/student/:student_id/simulator/:simulator_id/without-evaluation',
    // #swagger.tags = ['Respuestas']
    // #swagger.summary = 'Obtener respuestas del estudiante sin evaluación del mentor'
    // #swagger.description = 'Obtiene las respuestas de un estudiante para un simulador específico incluyendo las preguntas y si son correctas, pero sin incluir la evaluación del mentor.'
    // #swagger.security = [{ "bearerAuth": [] }]
    getStudentAnswersWithoutEvaluationController);


module.exports = {
    routerAnswer
}
