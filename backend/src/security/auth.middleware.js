const {verificarToken} = require('./jwt')

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader?.split(' ')[1] || null

    if(!token) return res.status(403).json({ message: 'Token requerido '})
    
    const decoded = verificarToken(token)
    if(!decoded) return res.status(401).json({ message: 'Token invalido o expirado'})

    req.user = decoded
    next()
}