const { verificarToken } = require('./jwt')
const { isBlacklisted } = require('./tokenBlacklist')

const protectedEndpoint = ( ...allowedRoles ) => {
    return (req, res, next) => {
        try {
            const auth = req.headers['authorization']

            if(!auth)
                return res.status(403).json({ message: 'Token no proporcionado' })

            const token = auth.split(' ')[1]
            
            // Verificar si el token está en blacklist
            if (isBlacklisted(token)) {
                return res.status(401).json({ message: 'Token inválido - sesión cerrada' })
            }
            
            const decoded = verificarToken(token)

            if(!decoded)
                return res.status(401).json({ message: 'Token invalido o expirado' })

            req.role = decoded.role

            if(!allowedRoles.includes(req.role))
                return res.status(403).json({ message: 'Acceso denegado' })

            next()
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: `Ocurrió un problema: ${error.message}`})
        }
    }
}

module.exports = {
    protectedEndpoint
}