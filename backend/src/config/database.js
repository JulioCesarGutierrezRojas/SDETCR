process.loadEnvFile()
const { Sequelize } = require('sequelize')
const mysql = require('mysql2')

const sequelize = new Sequelize(process.env.DBNAME, process.env.DBUSER, process.env.DBPASS, {
    host: process.env.DBHOST,
    dialect: 'mysql',
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 5000,
        idle: 10000
    }
})

module.exports = sequelize