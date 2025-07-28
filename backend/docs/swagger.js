process.loadEnvFile()
const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger-output.json'
const endpointsFiles = ['../src/config/server.js']

const doc = {
    info: {
        version: '1.0.0',
        title: 'API Documentation - Simulador de Entrevistas Laborales con Retroalimentación',
        description: 'Esta API permite a los usuarios simular entrevistas laborales y recibir retroalimentación sobre su desempeño.',
    },
    host: `localhost:${process.env.PORT}`,
    basePath: '/',
    schemes: ['http'],
    tags: [
        {
            name: 'Simuladores',
            description: 'Operaciones relacionadas con los simuladores de entrevistas.'
        },
        {
            name: 'Categorías',
            description: 'Operaciones relacionadas con las categorías de preguntas.'
        },
        {
            name: 'Usuarios',
            description: 'Operaciones relacionadas con los usuarios del sistema.'
        },
        {
            name: 'Respuestas',
            description: 'Operaciones relacionadas con las respuestas a las preguntas.'
        },
        {
            name: 'Preguntas',
            description: 'Operaciones relacionadas con las preguntas de las entrevistas.'
        },
        {
            name: 'Evaluaciones',
            description: 'Operaciones relacionadas con las evaluaciones de los simuladores.'
        },
        {
            name: 'Evaluación Mentor',
            description: 'Operaciones relacionadas con las evaluaciones realizadas por mentores.'
        },
        {
            name: 'Historial',
            description: 'Operaciones relacionadas con el historial de entrevistas de los estudiantes.'
        },
        {
            name: 'Sugerencias',
            description: 'Operaciones relacionadas con las sugerencias de los simuladores.'
        }
    ],
    securityDefinitions: {
        bearerAuth: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
            description: 'Ingrese el token JWT con el formato: Bearer {token}'
        }
    },
    security: [
        {
            bearerAuth: []
        }
    ]
}

swaggerAutogen(
    outputFile,
    endpointsFiles,
    doc
).then(() => {
    console.log('Swagger documentation generated successfully!')
}).catch(error => {
    console.error('Error generating Swagger documentation:', error)
})
