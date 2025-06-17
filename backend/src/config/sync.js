const sequelize = require('./database')
require('../modules/answers/model/answer.model')
require('../modules/categories/model/category.model')
require('../modules/evaluation-mentor/model/evaluation-mentor.model')
require('../modules/history/model/history.model')
require('../modules/notifications/model/notification.model')
require('../modules/questions/model/question.model')
require('../modules/simulators/model/simulator.model')
require('../modules/suggestions-simulators/model/suggestion-simulator.model')
require('../modules/users/model/user.model')

const connectToDatabase = async () => {
    try {
        await sequelize.authenticate()
        console.log('Connection to the database has been established successfully.')

        await sequelize.sync({ alter: true })
        console.log('All models were synchronized successfully.')
    } catch (error) {
        console.error('Unable to connect to the database:', error)
    }
}

module.exports = connectToDatabase