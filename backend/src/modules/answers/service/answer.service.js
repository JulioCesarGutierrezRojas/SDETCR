const Answer = require('../model/answer.model');

const saveAnswer = async (data) => {
    try{
        const { student_id, question_id, answer } = data;

        if(!student_id || !question_id || !answer) {
            const error = new Error('student_id, question_id, y answer son obligaorios');
            error.status = 400;
            throw error;
        }

        const newAnswer = await Answer.create({
            student_id,
            question_id,
            type_response: 'texto',
            answer,
            url_video: null,
            date_response: new Date()
        });

        return {message: 'Respuesta guardada correctamente', answer: newAnswer };
    }catch(error){
        console.log('Error en saveAnswer:',error.message);
        throw error;
    }
}

module.exports = {
    saveAnswer
};