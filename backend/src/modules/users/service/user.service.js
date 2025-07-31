const User = require('../model/user.model')
const { compararPassword, hashPassword } = require('../../../kernel/bcrypt')
const { getAllCategories } = require('../../../modules/categories/service/category.service')
const { generarToken } = require('../../../security/jwt')
const { sendEmail } = require('../../../kernel/configEmail')
const crypto = require('crypto')
const ApiResponse = require('../../../kernel/api.response')
const TypesResponse = require('../../../kernel/types.response')
const Category = require('../../categories/model/category.model')
const Simulator = require('../../simulators/model/simulator.model')
const Answer = require('../../answers/model/answer.model')
const Question = require('../../questions/model/question.model')
const sequelize = require('../../../config/database')

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

        if (!category || (Array.isArray(category) && category.length === 0)){
            return new ApiResponse(null, null, TypesResponse.WARNING, 'Al menos una categoría es requerida', 400);
        }

        if (await User.findOne({ where: { email } })|| await User.findOne({ where: { enrollment } })) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'El correo electrónico o la matrícula ya están en uso', 409);
        }
        
        const categorias = await getAllCategories();
        
        // Normalizar category para que siempre sea un arreglo
        const categoriasSeleccionadas = Array.isArray(category) ? category : [category];
        
        // Validar que todas las categorías existan
        const categoriasValidas = [];
        const categoriasInvalidas = [];
        
        for (const catName of categoriasSeleccionadas) {
            const categoriaEncontrada = categorias.result.find(cat => cat.name === catName);
            if (categoriaEncontrada) {
                categoriasValidas.push({
                    id: categoriaEncontrada.category_id,
                    name: categoriaEncontrada.name
                });
            } else {
                categoriasInvalidas.push(catName);
            }
        }
        
        if (categoriasInvalidas.length > 0) {
            return new ApiResponse(
                null, 
                null, 
                TypesResponse.WARNING, 
                `Las siguientes categorías no existen: ${categoriasInvalidas.join(', ')}`, 
                400
            );
        }

        const encryptedPassword = await hashPassword(password);

        const newStudent = await User.create({
            name,
            lastname,   
            email, 
            category: categoriasValidas,
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

const getStudentCategories = async (student_id) => {
    try {
        if (!student_id) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'El ID del estudiante es requerido', 400);
        }

        // Obtener el estudiante y sus categorías
        const student = await User.findOne({
            where: {
                user_id: student_id,
                role: 'estudiantes'
            },
            attributes: ['user_id', 'name', 'lastname', 'category']
        });

        if (!student) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'Estudiante no encontrado', 404);
        }

        if (!student.category || !Array.isArray(student.category) || student.category.length === 0) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'El estudiante no tiene categorías asignadas', 404);
        }

        // Obtener los IDs de las categorías del estudiante
        const categoryIds = student.category.map(cat => cat.id);

        // Obtener las categorías completas
        const categories = await Category.findAll({
            where: {
                category_id: categoryIds,
                status: true
            },
            attributes: ['category_id', 'name', 'description']
        });

        if (!categories || categories.length === 0) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'No se encontraron categorías activas para este estudiante', 404);
        }

        // Formatear la respuesta
        const formattedCategories = categories.map(category => ({
            category_id: category.category_id,
            category_name: category.name,
            category_description: category.description
        }));

        const result = {
            student: {
                user_id: student.user_id,
                name: student.name,
                lastname: student.lastname
            },
            categories: formattedCategories
        };

        return new ApiResponse(null, result, TypesResponse.SUCCESS, 'Categorías del estudiante obtenidas exitosamente', 200);

    } catch (error) {
        console.error('Error en getStudentCategories:', error);
        return new ApiResponse(null, null, TypesResponse.ERROR, 'Error interno al obtener las categorías del estudiante', 500);
    }
};

const getAllStudentsWithSimulatorCount = async () => {
    try {
        // Usar consulta SQL optimizada para obtener todos los estudiantes con el conteo de simuladores respondidos
        const studentsWithCount = await sequelize.query(`
            SELECT 
                u.user_id,
                u.name,
                u.lastname,
                u.email,
                u.enrollment,
                u.category,
                COALESCE(COUNT(DISTINCT q.simulator_id), 0) as simulators_answered
            FROM users u
            LEFT JOIN answers a ON u.user_id = a.student_id
            LEFT JOIN questions q ON a.question_id = q.question_id
            WHERE u.role = 'estudiantes'
            GROUP BY u.user_id, u.name, u.lastname, u.email, u.enrollment, u.category
            ORDER BY u.name ASC, u.lastname ASC
        `, {
            type: sequelize.QueryTypes.SELECT
        });

        if (!studentsWithCount || studentsWithCount.length === 0) {
            return new ApiResponse(null, [], TypesResponse.SUCCESS, 'No se encontraron estudiantes', 200);
        }

        // Formatear la respuesta
        const formattedStudents = studentsWithCount.map(student => ({
            student_id: student.user_id,
            name: student.name,
            lastname: student.lastname,
            email: student.email,
            enrollment: student.enrollment,
            categories: student.category || [],
            simulators_answered_count: parseInt(student.simulators_answered) || 0
        }));

        const result = {
            students: formattedStudents,
            total_students: formattedStudents.length
        };

        return new ApiResponse(null, result, TypesResponse.SUCCESS, 'Estudiantes con conteo de simuladores obtenidos exitosamente', 200);

    } catch (error) {
        console.error('Error en getAllStudentsWithSimulatorCount:', error);
        return new ApiResponse(null, null, TypesResponse.ERROR, 'Error interno al obtener los estudiantes con conteo de simuladores', 500);
    }
};

module.exports = {
    login,
    restaurarPassword,
    enviarCodigoRecuperacion,
    createStudent,
    createMentor,
    getStudentByMentor,
    validarTokenRecuperacion,
    getStudentCategories,
    getAllStudentsWithSimulatorCount
}
