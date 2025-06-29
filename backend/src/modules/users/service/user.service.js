const User = require('../model/user.model')
const { compararPassword, hashPassword } = require('../../../kernel/bcrypt')
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


module.exports = {
    login,
    restaurarPassword,
    enviarCodigoRecuperacion
}
