const User = require('../model/user.model')
const { compararPassword, hashPassword } = require('../../../kernel/bcrypt')
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


module.exports = {
    login,
    restaurarPassword,
    enviarCodigoRecuperacion
}
