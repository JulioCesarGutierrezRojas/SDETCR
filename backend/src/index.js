const { app } = require('./config/server')
const sequelize = require('./config/database')

const main = async () => {
    try {
        app.listen(app.get('port'))
        console.log(`Running in http://localhost:${app.get('port')}/`)

        await sequelize.authenticate()
        console.log('Connection has been established successfully.')
    } catch (error) {
        console.error('An error ocurred: ', error)
    }
}

main()