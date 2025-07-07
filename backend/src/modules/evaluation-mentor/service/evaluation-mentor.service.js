const EvaluationMentor = require('../model/evaluation-mentor.model')
const User = require('../../users/model/user.model')
const Simulator = require('../../simulators/model/simulator.model')
const ApiResponse = require('../../../kernel/api.response')
const TypesResponse = require('../../../kernel/types.response')

const getFeedbackByStudentId = async (studentId) => {
    try{
        if(!studentId){
            return new ApiResponse(null, null, TypesResponse.WARNING, 'El ID del estudiante es requerido', 400)
        }

        const feedbacks = await EvaluationMentor.findAll({
            where: { student_id: studentId  },
            include: [
                {
                    model: User,
                    as: 'Mentor',
                    attributes: ['user_id', 'name', 'lastname']
                },
                {
                model: User,
                as: 'Student',
                attributes: ['user_id', 'name', 'lastname']
                },
                {
                    model: Simulator,
                    as: 'Simulator',
                    attributes: ['simulator_id', 'name']
                }
            ],
            order: [['date_evaluation', 'DESC']]
        })

        if(!feedbacks || feedbacks.length === 0){
            return new ApiResponse(null, null, TypesResponse.WARNING, 'No se encontraron retroalimentaciones para el estudiante', 404)
        }

        const formato = feedbacks.map(fb=>({
            simulator_id: fb.simulator_id,
            simulator_name: fb.Simulator?.name || 'Sin nombre',
            mentor_name: `${fb.Mentor?.name || 'Desconocido'} ${fb.Mentor?.lastname || ''}`,
            student_name: `${fb.Student?.name || 'Desconocido'} ${fb.Student?.lastname || ''}`,
            comment: fb.comment,
            final_score: fb.final_score,
            date_evaluation: fb.date_evaluation
            }))
            return new ApiResponse(null, formato, TypesResponse.SUCCESS, 'Retroalimentaciones obtenidas correctamente', 200)
    }catch(error){
        console.error('Error en getFeedbackByStudentId:', error.message)
        throw new Error(error.message || 'No se pudo obtener la retroalimentación del estudiante')
    }
}

const createEvaluation = async({ mentor_id, student_id, simulator_id, comment, final_score}) => {
    try{
        if(!mentor_id || !student_id || !simulator_id || !comment || final_score == null){
            return new ApiResponse(null, null, TypesResponse.WARNING, 'Todos los campos son obligatorios', 400)
        }

        const newEvalution = await EvaluationMentor.create({
            mentor_id,
            student_id,
            simulator_id,
            comment,
            final_score,
            date_evaluation: new Date()
        })
        return new ApiResponse(null, newEvalution, TypesResponse.SUCCESS, 'Evaluación creada correctamente', 201)
    }catch(error){
        console.error("Error en createEvaluation:", error.message)
        throw new Error(error.message || 'No se pudo crear la evaluación')
    }
}

module.exports = {
    getFeedbackByStudentId,
    createEvaluation
}