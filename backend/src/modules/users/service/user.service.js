const User = require('../model/user.model')
const { compararPassword } = require('../../../kernel/bcrypt')
const { generarToken } = require('../../../security/jwt')

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

module.exports = {
    login
}
