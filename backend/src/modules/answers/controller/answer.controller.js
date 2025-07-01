const { saveAnswer } = require('../service/answer.service');
const { Router } = require('express');
const routerAnswer = Router();

const saveAnswerController = async (req, res) => {
    try{
        const data = req.body;
        const result = await saveAnswer(data);
        return res.json(result);
    }catch(error){
        return res.status(error.statusCode || 500).json({message: error.message})
    }
}

routerAnswer.post('/save', saveAnswerController);

module.exports = {
    routerAnswer
}