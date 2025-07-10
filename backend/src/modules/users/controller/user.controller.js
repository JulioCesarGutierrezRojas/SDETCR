const { login, restaurarPassword, enviarCodigoRecuperacion, createStudent, createMentor, getStudentByMentor } = require('../service/user.service')
const { Router } = require('express')
const routerUser = Router()

const loginController = async (req, res) => {
    try{
        const { email, password } = req.body
        const result = await login(email, password)
        return res.status(result.getStatusCode()).json(result.getResponseBody())
    }catch(error){
        console.log('Error en loginController: ', error.message)
        return res.status(500).json({ message: error.message })
    }
}

const restaurarPasswordController = async (req, res) =>{
    try{
        const {email, nuevaPassword, confirmarPassword } =  req.body
        const result = await restaurarPassword(email, nuevaPassword, confirmarPassword)
        return res.status(result.getStatusCode()).json(result.getResponseBody())
    }catch(error){
        console.log('Error en restaurarPasswordController: ', error.message)
        return res.status(500).json({ message: error.message })
    }
}

const enviarCodigoRecuperacionController = async ( req, res) => {
    try {
        const { email } = req.body
        const result = await enviarCodigoRecuperacion(email)
        return res.status(result.getStatusCode()).json(result.getResponseBody())
    } catch (error) {
        console.log('Error en enviarCodigoRecuperacionController:', error.message)
        return res.status(500).json({ message: error.message })
    }
}

const createStudentController = async (req, res) => {
    try {
        const { name, lastname, email, category, enrollment, password } = req.body;

        const result = await createStudent({ name, lastname, email, category, enrollment, password});

        res.status(result.getStatusCode()).json(result.getResponseBody());
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
};

const createMentorController = async (req, res) => {
    try {
        const { name, lastname, email, enrollment, password } = req.body;

        const result = await createMentor({ name, lastname, email, enrollment, password});

        res.status(result.getStatusCode()).json(result.getResponseBody());
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
};

const getStudentByMentorController = async (req, res) => {
    try{
        const {mentorId} = req.params;
        const result = await getStudentByMentor(mentorId);
        res.status(result.getStatusCode()).json(result.getResponseBody());
    }catch(error){
        console.error('Error en getStudentByMentorController:', error.message);
        res.status(500).json({ message: error.message });
    }
}


routerUser.post('/createMentor',
    // #swagger.tags = ['Usuarios']
    // #swagger.summary = 'Crear un mentor'
    // #swagger.description = 'Endpoint para crear un nuevo usuario con rol de mentor.'
    createMentorController);

routerUser.post('/login',
    // #swagger.tags = ['Usuarios']
    // #swagger.summary = 'Iniciar sesión'
    // #swagger.description = 'Endpoint para autenticar usuarios en el sistema.'
    loginController)

routerUser.post('/restaurar-password',
    // #swagger.tags = ['Usuarios']
    // #swagger.summary = 'Restaurar contraseña'
    // #swagger.description = 'Endpoint para restaurar la contraseña de un usuario.'
    restaurarPasswordController)

routerUser.post('/send-email',
    // #swagger.tags = ['Usuarios']
    // #swagger.summary = 'Enviar código de recuperación'
    // #swagger.description = 'Endpoint para enviar un código de recuperación de contraseña por email.'
    enviarCodigoRecuperacionController)

routerUser.post('/createStudent',
    // #swagger.tags = ['Usuarios']
    // #swagger.summary = 'Crear un estudiante'
    // #swagger.description = 'Endpoint para crear un nuevo usuario con rol de estudiante.'
    createStudentController)

routerUser.get('/students-by-mentor/:mentorId',
    // #swagger.tags = ['Usuarios']
    // #swagger.summary = 'Obtener estudiantes por mentor'
    // #swagger.description = 'Endpoint para obtener los estudiantes asociados a un mentor.'
    // #swagger.parameters['mentorId'] = { description: 'ID del mentor para filtrar los estudiantes.' }
    getStudentByMentorController)

module.exports = {
    routerUser
}