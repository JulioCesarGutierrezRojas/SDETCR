const { app } = require('./config/server')

const connectToDatabase = require("./config/sync");

const main = async () => {
    try {
        await connectToDatabase()

        app.listen(app.get('port'))
        console.log(`Running in http://localhost:${app.get('port')}/`)
        console.log(`Swagger documentation available at http://localhost:${app.get('port')}/swagger-ui`)
    } catch (error) {
        console.error('An error ocurred: ', error)
    }
}

main()