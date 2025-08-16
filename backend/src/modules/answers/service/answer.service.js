const Answer = require('../model/answer.model');
const History = require('../../history/model/history.model');
const sequelize = require('../../../config/database');
const ApiResponse = require('../../../kernel/api.response');
const TypesResponse = require('../../../kernel/types.response');
const Question = require('../../questions/model/question.model');
const User = require('../../users/model/user.model');
const EvaluationMentor = require('../../evaluation-mentor/model/evaluation-mentor.model');
const Simulator = require('../../simulators/model/simulator.model');
const { notifySimulatorCompleted, notifyMentorStudentCompleted } = require('../../notifications/service/notification.service');

const saveAnswers = async (student_id, simulator_id, answerList, files = []) => {
    const transaction = await sequelize.transaction();
    try {
        if (!student_id || !simulator_id || !answerList || answerList.length === 0) {
            await transaction.rollback();
            return new ApiResponse(null, null, TypesResponse.WARNING, 'Faltan datos obligatorios', 400);
        }

        let indexVideo = 0;
        const respuestasGuardadas = [];
        let respuestasCorrectas = 0;
        let respuestasTextoEvaluadas = 0;

        for (const ans of answerList) {
            const { question_id, type_response, answer } = ans;

            if (!question_id || !type_response) {
                await transaction.rollback();
                return new ApiResponse(null, null, TypesResponse.WARNING, 'Faltan datos obligatorios en la respuesta', 400);
            }

            const pregunta = await Question.findByPk(question_id);
            if (!pregunta) {
                await transaction.rollback();
                return new ApiResponse(null, null, TypesResponse.ERROR, `No se encontró la pregunta con ID ${question_id}`, 404);
            }

            let url_video = null;
            let textAnswer = null;

            if (type_response === 'video') {
                if (!files[indexVideo]) {
                    await transaction.rollback();
                    return new ApiResponse(null, null, TypesResponse.WARNING, 'Falta el archivo de video para la respuesta', 400);
                }
                url_video = files[indexVideo].filename;
                indexVideo++;
            } else if (type_response === 'texto') {
                textAnswer = answer;

                const correcta = pregunta.correct_answer?.trim().toLowerCase();
                const enviada = answer?.trim().toLowerCase();

                if (correcta && enviada) {
                    respuestasTextoEvaluadas++;
                    if (enviada === correcta) {
                        respuestasCorrectas++;
                    }
                }
            }

            const nuevaRespuesta = await Answer.create({
                student_id,
                question_id,
                type_response,
                answer: textAnswer,
                url_video,
                date_response: new Date()
            }, { transaction });

            respuestasGuardadas.push(nuevaRespuesta);
        }

        const final_score = respuestasTextoEvaluadas > 0
            ? Math.round((respuestasCorrectas / respuestasTextoEvaluadas) * 10)
            : 0;


        const historiales = await History.findAll({
            where: { student_id, simulator_id },
            order: [['date_realized', 'ASC']],
            transaction
        });

        if (historiales.length >= 5) {
            const historialViejo = historiales[0];
            const eliminado = await History.destroy({
                where: { history_id: historialViejo.history_id },
                transaction
            });
            if (!eliminado) {
                await transaction.rollback();
                return new ApiResponse(null, null, TypesResponse.ERROR, 'Error al eliminar historial viejo', 500);
            }
        }

        const nuevoHistorial = await History.create({
            student_id,
            simulator_id,
            final_score,
            date_realized: new Date()
        }, { transaction });

        await transaction.commit();

        // Enviar notificaciones de simulador completado
        try {
            const simulator = await Simulator.findByPk(simulator_id);
            const student = await User.findByPk(student_id, {
                include: [
                    {
                        model: User,
                        as: 'Mentor',
                        attributes: ['user_id', 'name', 'lastname']
                    }
                ],
                attributes: ['user_id', 'name', 'lastname', 'mentor_id']
            });
            
            if (simulator) {
                // Notificar al estudiante
                await notifySimulatorCompleted(student_id, simulator.name, final_score);
                
                // Notificar al mentor si el estudiante tiene uno asignado
                if (student && student.mentor_id && student.Mentor) {
                    const studentName = `${student.name} ${student.lastname}`;
                    await notifyMentorStudentCompleted(
                        student.mentor_id, 
                        studentName, 
                        simulator.name, 
                        final_score
                    );
                }
            }
        } catch (notificationError) {
            console.error('Error al enviar notificaciones:', notificationError);
            // No interrumpir el flujo principal si las notificaciones fallan
        }

        return new ApiResponse(null, {
            history_id: nuevoHistorial.history_id,
            answers_saved: respuestasGuardadas.length,
            final_score
        }, TypesResponse.SUCCESS, 'Respuestas e historial guardados exitosamente', 201);

    } catch (error) {
        await transaction.rollback();
        console.error('Error en saveAnswers:', error);
        return new ApiResponse(null, null, TypesResponse.ERROR, 'Error interno al guardar respuestas', 500);
    }
};


const getStudentAnswersWithEvaluation = async (student_id, simulator_id) => {
    try {
        if (!student_id || !simulator_id) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'student_id y simulator_id son requeridos', 400);
        }

        // Obtener las respuestas del estudiante para el simulador específico
        const answers = await Answer.findAll({
            where: {
                student_id: student_id
            },
            include: [
                {
                    model: Question,
                    as: 'Question',
                    where: {
                        simulator_id: simulator_id
                    },
                    attributes: ['question_id', 'question', 'options', 'correct_answer']
                },
                {
                    model: User,
                    as: 'Student',
                    attributes: ['user_id', 'name', 'lastname', 'email', 'enrollment']
                }
            ],
            attributes: ['answer_id', 'type_response', 'answer', 'url_video', 'date_response']
        });

        if (!answers || answers.length === 0) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'No se encontraron respuestas para este estudiante y simulador', 404);
        }

        // Obtener la evaluación del mentor si existe
        const evaluation = await EvaluationMentor.findOne({
            where: {
                student_id: student_id,
                simulator_id: simulator_id
            },
            include: [
                {
                    model: User,
                    as: 'Mentor',
                    attributes: ['user_id', 'name', 'lastname']
                }
            ],
            attributes: ['evaluation_id', 'comment', 'final_score', 'date_evaluation']
        });

        // Formatear las respuestas con información de corrección
        const formattedAnswers = answers.map(answer => {
            let isCorrect = null;
            if (answer.type_response === 'texto' && answer.Question?.correct_answer) {
                const correctAnswer = answer.Question.correct_answer.trim().toLowerCase();
                const studentAnswer = answer.answer?.trim().toLowerCase();
                isCorrect = correctAnswer === studentAnswer;
            }

            // Formatear URL del video si existe
            let videoUrl = null;
            if (answer.url_video) {
                const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3001}`;
                videoUrl = `${baseUrl}/uploads/${answer.url_video}`;
            }

            return {
                answer_id: answer.answer_id,
                question: {
                    question_id: answer.Question.question_id,
                    question_text: answer.Question.question,
                    options: answer.Question.options,
                    correct_answer: answer.Question.correct_answer
                },
                student_response: {
                    type: answer.type_response,
                    answer: answer.answer,
                    url_video: videoUrl,
                    date_response: answer.date_response,
                    is_correct: isCorrect
                }
            };
        });

        const result = {
            student: answers[0]?.Student ? {
                user_id: answers[0].Student.user_id,
                name: answers[0].Student.name,
                lastname: answers[0].Student.lastname,
                email: answers[0].Student.email,
                enrollment: answers[0].Student.enrollment
            } : null,
            answers: formattedAnswers,
            mentor_evaluation: evaluation ? {
                evaluation_id: evaluation.evaluation_id,
                mentor: evaluation.Mentor ? {
                    user_id: evaluation.Mentor.user_id,
                    name: evaluation.Mentor.name,
                    lastname: evaluation.Mentor.lastname
                } : null,
                comment: evaluation.comment,
                final_score: evaluation.final_score,
                date_evaluation: evaluation.date_evaluation
            } : null
        };

        return new ApiResponse(null, result, TypesResponse.SUCCESS, 'Respuestas del estudiante obtenidas exitosamente', 200);

    } catch (error) {
        console.error('Error en getStudentAnswersWithEvaluation:', error);
        return new ApiResponse(null, null, TypesResponse.ERROR, 'Error interno al obtener las respuestas', 500);
    }
};

const getStudentAnswersWithoutEvaluation = async (student_id, simulator_id) => {
    try {
        if (!student_id || !simulator_id) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'student_id y simulator_id son requeridos', 400);
        }

        // Obtener las respuestas del estudiante para el simulador específico
        const answers = await Answer.findAll({
            where: {
                student_id: student_id
            },
            include: [
                {
                    model: Question,
                    as: 'Question',
                    where: {
                        simulator_id: simulator_id
                    },
                    attributes: ['question_id', 'question', 'options', 'correct_answer']
                },
                {
                    model: User,
                    as: 'Student',
                    attributes: ['user_id', 'name', 'lastname', 'email', 'enrollment']
                }
            ],
            attributes: ['answer_id', 'type_response', 'answer', 'url_video', 'date_response']
        });

        if (!answers || answers.length === 0) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'No se encontraron respuestas para este estudiante y simulador', 404);
        }

        // Formatear las respuestas con información de corrección
        const formattedAnswers = answers.map(answer => {
            let isCorrect = null;
            if (answer.type_response === 'texto' && answer.Question?.correct_answer) {
                const correctAnswer = answer.Question.correct_answer.trim().toLowerCase();
                const studentAnswer = answer.answer?.trim().toLowerCase();
                isCorrect = correctAnswer === studentAnswer;
            }

            // Formatear URL del video si existe
            let videoUrl = null;
            if (answer.url_video) {
                const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3001}`;
                videoUrl = `${baseUrl}/uploads/${answer.url_video}`;
            }

            return {
                answer_id: answer.answer_id,
                question: {
                    question_id: answer.Question.question_id,
                    question_text: answer.Question.question,
                    options: answer.Question.options,
                    correct_answer: answer.Question.correct_answer
                },
                student_response: {
                    type: answer.type_response,
                    answer: answer.answer,
                    url_video: videoUrl,
                    date_response: answer.date_response,
                    is_correct: isCorrect
                }
            };
        });

        const result = {
            student: answers[0]?.Student ? {
                user_id: answers[0].Student.user_id,
                name: answers[0].Student.name,
                lastname: answers[0].Student.lastname,
                email: answers[0].Student.email,
                enrollment: answers[0].Student.enrollment
            } : null,
            answers: formattedAnswers
        };

        return new ApiResponse(null, result, TypesResponse.SUCCESS, 'Respuestas del estudiante obtenidas exitosamente', 200);

    } catch (error) {
        console.error('Error en getStudentAnswersWithoutEvaluation:', error);
        return new ApiResponse(null, null, TypesResponse.ERROR, 'Error interno al obtener las respuestas', 500);
    }
};

module.exports = {
    saveAnswers,
    getStudentAnswersWithEvaluation,
    getStudentAnswersWithoutEvaluation
};
