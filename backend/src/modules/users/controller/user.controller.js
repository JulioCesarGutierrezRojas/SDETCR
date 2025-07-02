const { login, restaurarPassword, enviarCodigoRecuperacion, createStudent } = require('../service/user.service')
const { Router } = require('express')
const routerUser = Router()

const loginController = async (req, res) => {
    try{
        const { email, password } = req.body
        const result = await login(email, password)
        return res.json(result)
    }catch(error){
        console.log('Error en loginController: ', error.message)
        return res.status(error.statusCode || 500).json({ message: error.message })
    }
}

const restaurarPasswordController = async (req, res) =>{
    try{
        const {email, nuevaPassword, confirmarPassword } =  req.body
        const result = await restaurarPassword(email, nuevaPassword, confirmarPassword)
        return res.json(result)
    }catch(error){
        console.log('Error en restaurarPasswordController: ', error.message)
        return res.status(error.statusCode || 500).json({ message: error.message })
    }
}

const enviarCodigoRecuperacionController = async (req, res) => {
    try {
        const { email } = req.body
        const result = await enviarCodigoRecuperacion(email)
        return res.json(result)
    } catch (error) {
        console.log('Error en enviarCodigoRecuperacionController:', error.message)
        return res.status(error.statusCode || 500).json({ message: error.message })
    }
}

const createStudentController = async (req, res) => {
    try {
        const { name, lastname, email, category, enrollment, password } = req.body;

        const result = await createStudent({ name, lastname, email, category, enrollment, password});

        res.status(201).json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

routerUser.post('/login', loginController)
routerUser.post('/restaurar-password', restaurarPasswordController)
routerUser.post('/send-email', enviarCodigoRecuperacionController)
routerUser.post('/createStudent', createStudentController)

module.exports = {
    routerUser
}