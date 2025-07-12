const User = require('../model/user.model')
const { compararPassword, hashPassword } = require('../../../kernel/bcrypt')
const { getAllCategories } = require('../../../modules/categories/service/category.service')
const { generarToken } = require('../../../security/jwt')
const { sendEmail } = require('../../../kernel/configEmail')
const crypto = require('crypto')
const ApiResponse = require('../../../kernel/api.response')
const TypesResponse = require('../../../kernel/types.response')

const login = async (email, password) => {
    try{
        if (!email || !password){
            return new ApiResponse(null, null, TypesResponse.WARNING, 'Email y contraseña son requeridos', 400)
        }

        const user = await User.findOne({where: { email }})
        if(!user){
            return new ApiResponse(null, null, TypesResponse.WARNING, 'Usuario no encontrado', 404)
        }

        const valid = await compararPassword(password, user.password)
        if(!valid){
            return new ApiResponse(null, null, TypesResponse.WARNING, 'Credenciales invalidas', 401)
        }

        const token = generarToken({ user_id: user.user_id, role: user.role })

        const loginData = {
            token,
            user: {
                id: user.user_id,
                name: user.name,
                role: user.role,
                email: user.email
            }
        }

        return new ApiResponse(null, loginData, TypesResponse.SUCCESS, 'Login exitoso', 200)
    }catch(error){
        console.log('Error en login service: ', error.message)
        throw new Error(error.message || 'Error al iniciar sesión')
    }
}

const restaurarPassword = async (email, nuevaPassword, confirmarPassword) => {
    try{
        if(!email || !nuevaPassword || !confirmarPassword){
            return new ApiResponse(null, null, TypesResponse.WARNING, 'Todos los campos son requeridos', 400)
        }

        if(nuevaPassword !== confirmarPassword){
            return new ApiResponse(null, null, TypesResponse.WARNING, 'La contraseña de confirmación no coincide con la contraseña', 400)
        }

        const user = await User.findOne({
            where: {email}
        })

        if(!user){
            return new ApiResponse(null, null, TypesResponse.WARNING, 'Usuario no encontrado', 404)
        }

        user.password =  await hashPassword(nuevaPassword)
        user.reset_token = null
        user.reset_token_expiration =null
        await user.save()

        return new ApiResponse(null, null, TypesResponse.SUCCESS, 'Contraseña actualizada correctamente', 200)
    }catch(error){
        console.log('Error en restaurarPassword service: ', error.message)
        throw new Error(error.message || 'Error al restaurar la contraseña')
    }
}

const enviarCodigoRecuperacion = async (email) => {
    try {
        if (!email) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'El correo es requerido', 400)
        }

        const user = await User.findOne({ where: { email } })

        if (!user) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'Usuario no encontrado', 404)
        }

        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        let code = ''
        for (let i = 0; i < 5; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length))
        }

        user.reset_token = code
        user.reset_token_expiration = new Date(Date.now() + 15 * 60 * 1000)
        await user.save()

        await sendEmail(user, code)

        return new ApiResponse(null, null, TypesResponse.SUCCESS, 'Código de recuperación enviado al correo', 200)
    } catch (error) {
        console.log('Error en enviarCodigoRecuperación service:', error.message)
        throw new Error(error.message || 'Error al enviar el código de recuperación')
    }
}

const createMentor = async ({ name, lastname, email, enrollment, password }) => {
    try {

        if(!name || !lastname){
            return new ApiResponse(null, null, TypesResponse.WARNING, 'El nombre y/o apellido son requeridos', 400);
        }

        if(!email){
            return new ApiResponse(null, null, TypesResponse.WARNING, 'El correo electrónico es obligatorio', 400);
        }

        if(!enrollment){
            return new ApiResponse(null, null, TypesResponse.WARNING, 'La matrícula es obligatoria', 400);
        }

        if(!password){
            return new ApiResponse(null, null, TypesResponse.WARNING, 'La contraseña es obligatoria', 400);
        }

        if (await User.findOne({ where: { email } })|| await User.findOne({ where: { enrollment } })) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'El correo electrónico o la matrícula ya se registraron', 409);
        }

        const encryptedPassword = await hashPassword(password);

        const newMentor = await User.create({
            name,
            lastname,   
            email, 
            enrollment,
            role: 'mentor', 
            password: encryptedPassword,
        });

        return new ApiResponse(null, newMentor, TypesResponse.SUCCESS, 'Mentor creado exitosamente', 201);
    } catch (error) {
        console.error('Error en createMentor:', error);
        throw new Error(error.message || 'No se pudo crear el mentor');
    }
};


const createStudent = async ({ name, lastname, email, category, enrollment, password }) => {
    try {

        if (!name || !lastname) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'El nombre y/o apellido son requeridos', 400);
        }

        if ( !email) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'El correo electrónico es requerido', 400);
        }

        if (!enrollment || !password) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'La matrícula y/o contraseña son requeridas', 400);
        }

        if (!category){
            return new ApiResponse(null, null, TypesResponse.WARNING, 'La categoría es requerida', 400);
        }

        if (await User.findOne({ where: { email } })|| await User.findOne({ where: { enrollment } })) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'El correo electrónico o la matrícula ya están en uso', 409);
        }

        
        const categorias = await getAllCategories();
        const categoriaValida = categorias.result.find(cat => cat.name === category.name);

        if (!categoriaValida) {
            return new ApiResponse(null, null, TypesResponse.WARNING, `La categoría "${category.name}" no existe en la base de datos`, 400);
        }

        const encryptedPassword = await hashPassword(password);

        const newStudent = await User.create({
            name,
            lastname,   
            email, 
            category: { name: categoriaValida.name },
            enrollment,
            role: 'estudiantes', 
            password: encryptedPassword
        });

        return new ApiResponse(null, newStudent, TypesResponse.SUCCESS, 'Estudiante creado exitosamente', 201);
    } catch (error) {
        console.error('Error en createStudent:', error);
        throw new Error(error.message || 'No se pudo crear al estudiante');
    }
};

const getStudentByMentor = async (mentorId) => {
    try{
        if(!mentorId){
            return new ApiResponse(null, null, TypesResponse.WARNING, 'El ID del mentor es requerido', 400);
        }

        const students = await User.findAll({
            where: {
                mentor_id: mentorId,
                role: 'estudiantes'
            },
            attributes: ['user_id', 'name', 'lastname', 'email', 'enrollment', 'category'],
        });
        return new ApiResponse(null, students, TypesResponse.SUCCESS, 'Estudiantes obtenidos exitosamente', 200);
    }catch(error){
        console.error('Error en getStudentByMentor:', error);
        throw new Error(error.message || 'No se pudieron obtener los estudiantes');
    }
}

const validarTokenRecuperacion = async(token) => {
    try{
        if(!token){
            return new ApiResponse(null, null, TypesResponse.WARNING, 'El token es requerido', 400);
        }
        
        const user = await User.findOne({ where: {reset_token: token} });
        if(!user){
            return new ApiResponse(null, null, TypesResponse.WARNING, 'Usuario no encontrado', 404);
        }

        if(user.reset_token !== token){
            return new ApiResponse(null, null, TypesResponse.WARNING, 'Token de recuperación inválido', 400);
        }

        if(user.reset_token_expiration < new Date()){
            return new ApiResponse(null, null, TypesResponse.WARNING, 'El token de recuperación ha expirado', 400);
        }

        return new ApiResponse(null, {user:{email: user.email}}, TypesResponse.SUCCESS, 'Token de recuperación válido', 200);

    }catch(error){
        console.error('Error en validarTokenRecuperacion:', error.message);
        throw new Error(error.message || 'Error al validar el token de recuperación');
    }
}

module.exports = {
    login,
    restaurarPassword,
    enviarCodigoRecuperacion,
    createStudent,
    createMentor,
    getStudentByMentor,
    validarTokenRecuperacion,
}
