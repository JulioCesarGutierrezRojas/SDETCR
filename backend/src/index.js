const { app } = require('./config/server')
const { createServer } = require('http')
const { initializeSocket } = require('./config/socket')
const { setSocketInstance } = require('./modules/notifications/service/notification.service')

const connectToDatabase = require("./config/sync");
const createInitialConfig = require('./kernel/initial.config')

const main = async () => {
    try {
        await connectToDatabase()
        await createInitialConfig()

        // Crear servidor HTTP
        const server = createServer(app)
        
        // Inicializar Socket.IO
        const io = initializeSocket(server)
        
        // Configurar la instancia de Socket.IO en el servicio de notificaciones
        setSocketInstance(io)

        server.listen(app.get('port'))
        console.log(`Running in http://localhost:${app.get('port')}/`)
        console.log(`Swagger documentation available at http://localhost:${app.get('port')}/swagger-ui`)
        console.log(`Socket.IO server running on http://localhost:${app.get('port')}/`)
    } catch (error) {
        console.error('An error ocurred: ', error)
    }
}

main()