const Answer = require('../model/answer.model');
const History = require('../../history/model/history.model');
const sequelize = require('../../../config/database');
const ApiResponse = require('../../../kernel/api.response');
const TypesResponse = require('../../../kernel/types.response');
const Question = require('../../questions/model/question.model');

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

        return new ApiResponse({
            history_id: nuevoHistorial.history_id,
            answers_saved: respuestasGuardadas.length,
            final_score
        }, null, TypesResponse.SUCCESS, 'Respuestas e historial guardados exitosamente', 201);

    } catch (error) {
        await transaction.rollback();
        console.error('Error en saveAnswers:', error);
        return new ApiResponse(null, null, TypesResponse.ERROR, 'Error interno al guardar respuestas', 500);
    }
};


module.exports = {
    saveAnswers,
};
