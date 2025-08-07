const { login, restaurarPassword, enviarCodigoRecuperacion, createStudent, createMentor, getStudentByMentor, validarTokenRecuperacion, getStudentCategories, getAllStudentsWithSimulatorCount, getAllUsers, updateUser, deleteUser, createUser } = require('../service/user.service')
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

const validarTokenRecuperacionController = async (req, res) => {
    try{
        const { token } = req.body;
        const result = await validarTokenRecuperacion(token);
        res.status(result.getStatusCode()).json(result.getResponseBody());
    }catch(error){
        console.error('Error en validarTokenRecuperacionController:', error.message);
        res.status(500).json({ message: error.message });
    }
}

const getStudentCategoriesController = async (req, res) => {
    try {
        const { student_id } = req.params;
        
        const result = await getStudentCategories(student_id);
        return res.status(result.getStatusCode()).json(result.getResponseBody());

    } catch (error) {
        console.error('Error en getStudentCategoriesController:', error.message);
        return res.status(500).json({ message: error.message });
    }
}

const getAllStudentsWithSimulatorCountController = async (req, res) => {
    try {
        const result = await getAllStudentsWithSimulatorCount();
        return res.status(result.getStatusCode()).json(result.getResponseBody());

    } catch (error) {
        console.error('Error en getAllStudentsWithSimulatorCountController:', error.message);
        return res.status(500).json({ message: error.message });
    }
}

// Nuevos controladores para CRUD de usuarios
const getAllUsersController = async (req, res) => {
    try {
        const result = await getAllUsers();
        return res.status(result.getStatusCode()).json(result.getResponseBody());
    } catch (error) {
        console.error('Error en getAllUsersController:', error.message);
        return res.status(500).json({ message: error.message });
    }
}

const updateUserController = async (req, res) => {
    try {
        const { userId } = req.params;
        const userData = req.body;
        
        const result = await updateUser(userId, userData);
        return res.status(result.getStatusCode()).json(result.getResponseBody());
    } catch (error) {
        console.error('Error en updateUserController:', error.message);
        return res.status(500).json({ message: error.message });
    }
}

const deleteUserController = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const result = await deleteUser(userId);
        return res.status(result.getStatusCode()).json(result.getResponseBody());
    } catch (error) {
        console.error('Error en deleteUserController:', error.message);
        return res.status(500).json({ message: error.message });
    }
}

const createUserController = async (req, res) => {
    try {
        const userData = req.body;
        
        const result = await createUser(userData);
        return res.status(result.getStatusCode()).json(result.getResponseBody());
    } catch (error) {
        console.error('Error en createUserController:', error.message);
        return res.status(500).json({ message: error.message });
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
    // #swagger.description = 'Endpoint para obtener los estudiantes asociados a un mentor, con contador de estudiantes.'
    // #swagger.parameters['mentorId'] = { description: 'ID del mentor para filtrar los estudiantes.' }
    getStudentByMentorController)

routerUser.post('/validate-recovery-token',
    // #swagger.tags = ['Usuarios']
    // #swagger.summary = 'Validar token de recuperación'
    // #swagger.description = 'Endpoint para validar un token de recuperación de contraseña.'
    validarTokenRecuperacionController)

routerUser.get('/student/:student_id/categories',
    // #swagger.tags = ['Usuarios']
    // #swagger.summary = 'Obtener categorías del estudiante'
    // #swagger.description = 'Obtiene las categorías que eligió el estudiante.'
    // #swagger.parameters['student_id'] = { description: 'ID del estudiante', in: 'path', required: true, type: 'integer' }
    getStudentCategoriesController)

routerUser.get('/students/simulator-count',
    // #swagger.tags = ['Usuarios']
    // #swagger.summary = 'Obtener todos los estudiantes con conteo de simuladores'
    // #swagger.description = 'Obtiene una lista de todos los estudiantes con el número de simuladores que han respondido.'
    getAllStudentsWithSimulatorCountController)

// Nuevas rutas para CRUD de usuarios
routerUser.get('/all',
    // #swagger.tags = ['Usuarios']
    // #swagger.summary = 'Obtener todos los usuarios'
    // #swagger.description = 'Endpoint para obtener todos los usuarios del sistema (para administradores).'
    // #swagger.security = [{ "bearerAuth": [] }]
    getAllUsersController)

routerUser.post('/create',
    // #swagger.tags = ['Usuarios']
    // #swagger.summary = 'Crear un usuario'
    // #swagger.description = 'Endpoint para crear un nuevo usuario (genérico para administradores).'
    // #swagger.security = [{ "bearerAuth": [] }]
    createUserController)

routerUser.put('/:userId',
    // #swagger.tags = ['Usuarios']
    // #swagger.summary = 'Actualizar un usuario'
    // #swagger.description = 'Endpoint para actualizar la información de un usuario específico.'
    // #swagger.parameters['userId'] = { description: 'ID del usuario a actualizar', in: 'path', required: true, type: 'integer' }
    // #swagger.security = [{ "bearerAuth": [] }]
    updateUserController)

routerUser.delete('/:userId',
    // #swagger.tags = ['Usuarios']
    // #swagger.summary = 'Eliminar un usuario'
    // #swagger.description = 'Endpoint para eliminar un usuario específico.'
    // #swagger.parameters['userId'] = { description: 'ID del usuario a eliminar', in: 'path', required: true, type: 'integer' }
    // #swagger.security = [{ "bearerAuth": [] }]
    deleteUserController)

module.exports = {
    routerUser
}
