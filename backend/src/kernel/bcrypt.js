const bcrypt = require('bcryptjs')

const hashPassword = async (plainPassword) => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(plainPassword, salt)
}

const compararPassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword)
}

module.exports = {
    hashPassword,
    compararPassword
}