process.loadEnvFile()
const express = require('express')
const cors = require('cors')
const path = require('path')
const swaggerUi = require('swagger-ui-express')
const swaggerDocumentation = require('../../docs/swagger-output.json')

const { routerSimulator } = require('../modules/simulators/controller/simulator.controller')
const { routerCategory } = require('../modules/categories/controller/category.controller')
const { routerUser } = require('../modules/users/controller/user.controller')
const { routerAnswer } = require('../modules/answers/controller/answer.controller')
const { routerQuestion } = require('../modules/questions/controller/question.controller')
const { routerEvaluation } = require('../modules/evaluation-mentor/controller/evaluation-mentor.controller')
const { routerHistory } = require('../modules/history/controller/history.controller')
const { routerSuggestion } = require('../modules/suggestions-simulators/controller/suggestion-simulator.controller')
const { routerNotification } = require('../modules/notifications/controller/notification.controller')

const app = express()

app.set('port', process.env.PORT || 3001)

app.use(cors({origin: '*'}))
app.use(express.json({limit: '50mb'}))

app.get('/', (request, response) => {
    response.send('Simulador de Entrevistas con Retroalimentación')
})

/**
 * Endpoints
 * 
 * En esta parte se pone lo que son los endpoints que maneja la API
 * se ponen de la siguiente manera:
 * 
 * app.use('lo que es el endpoint', la ruta)
 * 
 * Por ruta se entiende que son las que se traen del archivo router,
 * las cuales se importaron mas arriba
 */

app.use('/api/simulators', routerSimulator)
app.use('/api/categories', routerCategory)
app.use('/api/users', routerUser)
app.use('/api/answers', routerAnswer)
app.use('/api/questions', routerQuestion)
app.use('/api/evaluation', routerEvaluation)
app.use('/api/history', routerHistory)
app.use('/api/suggestions', routerSuggestion)
app.use('/api/notifications', routerNotification)

app.use('/uploads', express.static(path.join(__dirname, '../..', 'data')))
app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerDocumentation))

module.exports = {
    app
}