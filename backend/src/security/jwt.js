const jwt = require('jsonwebtoken')

const secret = process.env.JWT_SECRET || 'clave_jwt_defecto'

//Generamos el Token
function generarToken(payload, expiresIn = '1h'){
    return jwt.sign(payload, secret, { expiresIn })
}

//Verificamos el token
function verificarToken(token){
    try{
        return jwt.verify(token, secret)
    }catch (err){
        return null
    }
}

module.exports = {
    generarToken,
    verificarToken
}