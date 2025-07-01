process.loadEnvFile()
const express = require('express')
const cors = require('cors')
const path = require('path')

const userController = require('../modules/users/controller/user.controller')
const { updateSimulator } = require('../modules/simulators/controller/simulator.controller')
const simulatorController = require('../modules/simulators/controller/simulator.controller')
const categoryController = require('../modules/categories/controller/category.controller')
const questionController = require('../modules/questions/controller/question.controller')

const { routerSimulator } = require('../modules/simulators/controller/simulator.controller')
const { routerCategory } = require('../modules/categories/controller/category.controller')
const { routerUser } = require('../modules/users/controller/user.controller')


//TODO: CREACION DE USUARIO CON ENCRIPTACION (PRUEBA)
// const bcrypt = require('bcryptjs')
// const User = require('../modules/users/model/user.model')

// async function crearUsuarioDePrueba() {
//   const email = '20223tn124@utez.edu.mx'

//   const existente = await User.findOne({ where: { email } })
//   if (existente) {
//     console.log('🔁 Usuario ya existe, no se crea de nuevo.')
//     return
//   }

//   const hash = await bcrypt.hash('123456', 10)

//   await User.create({
//     name: 'Carlos',
//     lastname: 'Galán',
//     email: email,
//     enrollment: 'ABC123',
//     role: 'mentor',
//     password: hash,
//     category: null,
//     mentor_id: null
//   })

//   console.log('✅ Usuario de prueba creado con contraseña segura')
// }

// crearUsuarioDePrueba()


//En esta parte se mandan a traer las rutas del archivo router, por lo que se importa de ese archivo
//const {} = require()

const app = express()

app.set('port', process.env.PORT || 3001)

app.use(cors({origins: '*'}))
app.use(express.json({limit: '50mb'}))

app.get('/', (request, response) => {
    response.send('Simulador de Entrevistas con Retroalimentación')
})

app.post('/api/questions', questionController.createQuestion)

//app.put('/api/simulators/:id', simulatorController.updateSimulator)
//app.post('/api/users/login', userController.login)
//app.post('/restaurar-password', userController.restaurarPassword)
//app.post('/api/categories/create', categoryController.createCategory)

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

module.exports = {
    app
}