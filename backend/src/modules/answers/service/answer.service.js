const Answer = require('../model/answer.model');
const ApiResponse = require('../../../kernel/api.response')
const TypesResponse = require('../../../kernel/types.response');

const saveAnswer = async (data) => {
    try{
        const { student_id, question_id, answer } = data;

        if(!student_id || !question_id || !answer) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'Faltan datos obligatorios', 400);
        }

        const newAnswer = await Answer.create({
            student_id,
            question_id,
            type_response: 'texto',
            answer,
            url_video: null,
            date_response: new Date()
        });

        return new ApiResponse(null, newAnswer, TypesResponse.SUCCESS, 'Respuesta guardada correctamente', 200);
    }catch(error){
        console.log('Error en saveAnswer:',error.message);
        throw new Error(error.message || 'Error al guardar la respuesta');
    }
}

module.exports = {
    saveAnswer
};