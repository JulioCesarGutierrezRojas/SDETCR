const Answer = require('../model/answer.model');
const ApiResponse = require('../../../kernel/api.response')
const TypesResponse = require('../../../kernel/types.response');

const saveAnswers = async (student_id, answerList, files = []) => {
    try {
        if (!student_id || !answerList || !answerList.length === 0) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'Faltan datos obligatorios', 400);
        }

        const respuestas = [];
        let indexVideo = 0;

        for (let i = 0; i < answerList.length; i++) {
            const { question_id, type_response, answer } = answerList[i];

            if (!question_id || !type_response) {
                return new ApiResponse(null, null, TypesResponse.WARNING, 'Faltan datos obligatorios en la respuesta', 400);
            }

            let url_video = null;
            let textAnswer = null;

            if(type_response === 'video') {
                if (!files[indexVideo]) {
                    return new ApiResponse(null, null, TypesResponse.WARNING, 'Falta el archivo de video para la respuesta', 400);
                }
                url_video = `data/${files[indexVideo].filename}`;
                indexVideo++;
            } else if (type_response === 'texto') {
                textAnswer = answer;
            }

            const nuevaRespuesta = await Answer.create({
                student_id,
                question_id,
                type_response,
                answer: textAnswer,
                url_video,
                date_response: new Date()
            });
            respuestas.push(nuevaRespuesta);
        }
        return new ApiResponse(respuestas, null, TypesResponse.SUCCESS, 'Respuestas guardadas exitosamente', 201);
    } catch (error) {
        console.log('Error en saveAnswer:', error.message);
        throw new Error(error.message || 'Error al guardar la respuesta');
    }
}

module.exports = {
    saveAnswers,
}