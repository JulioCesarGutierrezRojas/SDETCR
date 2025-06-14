process.loadEnvFile()
const express = require('express')
const cors = require('cors')
const path = require('path')

//En esta parte se mandan a traer las rutas del archivo router, por lo que se importa de ese archivo
//const {} = require()

const app = express()

app.set('port', process.env.PORT || 3001)

app.use(cors({origins: '*'}))
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

module.exports = {
    app
}