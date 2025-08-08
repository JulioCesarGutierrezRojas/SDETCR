const EvaluationMentor = require('../model/evaluation-mentor.model')
const User = require('../../users/model/user.model')
const Simulator = require('../../simulators/model/simulator.model')
const ApiResponse = require('../../../kernel/api.response')
const TypesResponse = require('../../../kernel/types.response')
const { notifyStudentEvaluated } = require('../../notifications/service/notification.service')

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
        
        // Enviar notificación de evaluación completada
        try {
            const mentor = await User.findByPk(mentor_id, { attributes: ['name', 'lastname'] });
            const simulator = await Simulator.findByPk(simulator_id, { attributes: ['name'] });
            
            if (mentor && simulator) {
                const mentorName = `${mentor.name} ${mentor.lastname}`;
                const simulatorName = simulator.name;
                await notifyStudentEvaluated(student_id, mentorName, simulatorName, final_score);
            }
        } catch (notificationError) {
            console.error('Error al enviar notificación de evaluación:', notificationError);
            // No interrumpir el flujo principal si la notificación falla
        }
        
        return new ApiResponse(null, newEvalution, TypesResponse.SUCCESS, 'Evaluación creada correctamente', 201)
    }catch(error){
        console.error("Error en createEvaluation:", error.message)
        throw new Error(error.message || 'No se pudo crear la evaluación')
    }
}

const updateEvaluation = async ({ mentor_id, student_id, simulator_id, comment, final_score }) => {
    try {
        if (!mentor_id || !student_id || !simulator_id || !comment || final_score == null) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'Todos los campos son obligatorios', 400);
        }

        // Buscar la evaluación existente
        const existingEvaluation = await EvaluationMentor.findOne({
            where: {
                mentor_id,
                student_id,
                simulator_id
            }
        });

        if (!existingEvaluation) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'No se encontró la evaluación a actualizar', 404);
        }

        // Actualizar la evaluación
        const updatedEvaluation = await existingEvaluation.update({
            comment,
            final_score,
            date_evaluation: new Date()
        });

        // Enviar notificación de evaluación actualizada
        try {
            const mentor = await User.findByPk(mentor_id, { attributes: ['name', 'lastname'] });
            const simulator = await Simulator.findByPk(simulator_id, { attributes: ['name'] });
            
            if (mentor && simulator) {
                const mentorName = `${mentor.name} ${mentor.lastname}`;
                const simulatorName = simulator.name;
                await notifyStudentEvaluated(student_id, mentorName, simulatorName, final_score);
            }
        } catch (notificationError) {
            console.error('Error al enviar notificación de actualización:', notificationError);
            // No interrumpir el flujo principal si la notificación falla
        }

        return new ApiResponse(null, updatedEvaluation, TypesResponse.SUCCESS, 'Evaluación actualizada correctamente', 200);
    } catch (error) {
        console.error("Error en updateEvaluation:", error.message);
        throw new Error(error.message || 'No se pudo actualizar la evaluación');
    }
}

const assignStudentToMentor = async ({ mentor_id, student_ids }) => {
    try {
        if (!mentor_id || !student_ids || !Array.isArray(student_ids) || student_ids.length === 0) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'El ID del mentor y un arreglo de IDs de estudiantes son obligatorios', 400);
        }

        const mentor = await User.findOne({
            where: { 
                user_id: mentor_id,
                role: 'mentor'
            }
        });

        if (!mentor) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'El usuario especificado no es un mentor válido', 404);
        }

        const assignedStudents = [];
        const errors = [];

        for (const student_id of student_ids) {
            try {
                const student = await User.findOne({
                    where: { 
                        user_id: student_id,
                        role: 'estudiantes'
                    }
                });

                if (!student) {
                    errors.push(`El usuario con ID ${student_id} no es un estudiante válido`);
                    continue;
                }

                const existingAssignment = await User.findOne({
                    where: { 
                        user_id: student_id,
                        mentor_id: mentor_id
                    }
                });

                if (existingAssignment) {
                    errors.push(`El estudiante ${student.name} ${student.lastname} ya está asignado a este mentor`);
                    continue;
                }

                await User.update(
                    { mentor_id: mentor_id },
                    { where: { user_id: student_id } }
                );

                assignedStudents.push({
                    student_id: student.user_id,
                    student_name: `${student.name} ${student.lastname}`,
                    email: student.email
                });

            } catch (studentError) {
                errors.push(`Error procesando estudiante ${student_id}: ${studentError.message}`);
            }
        }

        if (assignedStudents.length === 0) {
            return new ApiResponse(null,null, TypesResponse.WARNING, 'No se pudo asignar ningún estudiante', 400);
        }

        const message = errors.length > 0 
            ? `Se asignaron ${assignedStudents.length} estudiantes correctamente, pero hubo ${errors.length} errores`
            : `Se asignaron ${assignedStudents.length} estudiantes correctamente`;

        return new ApiResponse(null, null, TypesResponse.SUCCESS, message, 201);

    } catch (error) {
        console.error('Error en assignStudentToMentor:', error.message);
        throw new Error(error.message || 'No se pudo asignar los estudiantes');
    }
}


module.exports = {
    getFeedbackByStudentId,
    createEvaluation,
    updateEvaluation,
    assignStudentToMentor
}
