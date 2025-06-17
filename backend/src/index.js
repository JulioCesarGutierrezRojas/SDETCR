const { app } = require('./config/server')

const connectToDatabase = require("./config/sync");

const main = async () => {
    try {
        await connectToDatabase()

        app.listen(app.get('port'))
        console.log(`Running in http://localhost:${app.get('port')}/`)
    } catch (error) {
        console.error('An error ocurred: ', error)
    }
}

main()