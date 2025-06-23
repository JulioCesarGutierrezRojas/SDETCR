const User = require('../model/user.model')
const { compararPassword } = require('../../../kernel/bcrypt')
const { generarToken } = require('../../../security/jwt')

exports.login = async (email, password) => {
    const user = await User.findOne({ where: { email } })

    if (!user) {
        return { success: false, code: 401, message: 'Usuario no encontrado' }
    }

    const valid = await compararPassword(password, user.password)
    if (!valid) {
        return { success: false, code: 401, message: 'Contraseña incorrecta' }
    }

    const token = generarToken({ user_id: user.user_id, role: user.role })

    return {
        success: true,
        data: {
            token,
            user: {
                id: user.user_id,
                name: user.name,
                role: user.role,
                email: user.email,
            }
        }
    }
}