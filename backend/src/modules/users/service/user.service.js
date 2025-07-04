const User = require('../model/user.model')
const { compararPassword, hashPassword } = require('../../../kernel/bcrypt')
const { getAllCategories } = require('../../../modules/categories/service/category.service')
const { generarToken } = require('../../../security/jwt')
const { sendEmail } = require('../../../kernel/configEmail')
const crypto = require('crypto')

const login = async (email, password) => {
    try{
        if (!email || !password){
            const error = new Error('Email y contraseña son requeridos')
            error.statusCode = 400
            throw error
        }

        const user = await User.findOne({where: { email }})
        if(!user){
            const error = new Error('Usuario no encontrado')
            error.statusCode = 401
            throw error
        }

        const valid = await compararPassword(password, user.password)
        if(!valid){
            const error = new Error('Contraseña incorrecta')
            error.statusCode = 401
            throw error
        }

        const token = generarToken({ user_id: user.user_id, role: user.role })

        return {
            token,
            user: {
                id: user.user_id,
                name: user.name,
                role: user.role,
                email: user.email
            }
        }
    }catch(error){
        console.log('Error en login service: ', error.message)
        throw error
    }
}

const restaurarPassword = async (email, nuevaPassword, confirmarPassword) => {
    try{
        if(!email || !nuevaPassword || !confirmarPassword){
            const error = new Error('Todos los campos son requeridos')
            error.statusCode = 400
            throw error
        }

        if(nuevaPassword !== confirmarPassword){
            const error = new Error('La contraseña de confirmacion no coincide con la contraseña')
            error.statusCode = 400
            throw error
        }

        const user = await User.findOne({
            where: {email}
        })

        if(!user){
            const error = new Error('Usuario no encontrado')
            error.statusCode = 404
            throw error
        }

        const nuevaPasswordHash = await hashPassword(nuevaPassword)

        user.password = nuevaPasswordHash
        user.reset_token = null
        user.reset_token_expiration =null
        await user.save()

        return {message: 'Contraseña actualizada correctamente'}
    }catch(error){
        console.log('Error en restaurarPassword service: ', error.message)
        throw error
    }
}

const enviarCodigoRecuperacion = async (email) => {
    try {
        if (!email) {
            const error = new Error('El correo es requerido')
            error.statusCode = 400
            throw error
        }

        const user = await User.findOne({ where: { email } })

        if (!user) {
            const error = new Error('Usuario no encontrado')
            error.statusCode = 404
            throw error
        }

        const code = crypto.randomInt(100000, 999999).toString()

        user.reset_token = code
        user.reset_token_expiration = new Date(Date.now() + 15 * 60 * 1000)
        await user.save()

        await sendEmail(user, code)

        return { message: 'Código de recuperación enviado al correo' }
    } catch (error) {
        console.log('Error en enviarCodigoRecuperacion service:', error.message)
        throw error
    }
}

const createMentor = async ({ name, lastname, email, enrollment, password }) => {
    try {

        if(!name || !lastname){
            return {
                success: false,
                message: 'El nombre y/o apellido son requeridos'
            };
        }

        if(!email){
            return {
                success: false,
                message: 'El correo electrónico es obligatorio'
            };
        }

        if(!enrollment){
            return {
                success: false,
                message: 'La matrícula es obligatoria'
            };
        }

        if(!password){
            return {
                success: false,
                message: 'La contraseña es obligatoria'
            };
        }

        if (await User.findOne({ where: { email } })|| await User.findOne({ where: { enrollment } })) {
            return {
                success: false,
                message: 'El correo electrónico o la matrícula ya se registraron'
            };
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

        
        return {
            success: true,
            data: newMentor,
            message: 'Mentor creado exitosamente'
        };
    } catch (error) {
        console.error('Error en createMentor:', error);
        throw new Error('No se pudo crear el mentor');
    }
};


const createStudent = async ({ name, lastname, email, category, enrollment, password }) => {
    try {

        if (!name || !lastname) {
            return {
                success: false,
                message: 'El nombre y/o apellido son requeridos'
            };
        }

        if ( !email) {
            return {
                success: false,
                message: 'El correo electrónico es requerido'
            };
        }

        if (!enrollment || !password) {
            return {
                success: false,
                message: 'La matrícula y/o contraseña son requeridas'
            };
        }

        if (!category){
            return {
                success: false,
                message: 'La categoría es requerida'
            };
        }

        if (await User.findOne({ where: { email } })|| await User.findOne({ where: { enrollment } })) {
            return {
                success: false,
                message: 'El correo electrónico o la matrícula ya están en uso'
            };
        }

        
        const categorias = await getAllCategories();
        const categoriaValida = categorias.find(cat => cat.name === category.name);

        if (!categoriaValida) {
            return {
                success: false,
                message: `La categoría "${category.name}" no existe en la base de datos`
            };
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


        return {
            success: true,
            data: newStudent,
            message: 'Estudiante creado exitosamente'
        };
    } catch (error) {
        console.error('Error en createStudent:', error);
        throw new Error('No se pudo crear al estudiante');
    }
};



module.exports = {
    login,
    restaurarPassword,
    enviarCodigoRecuperacion,
    createStudent,
    createMentor,
}
