const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../../../config/database')
const Simulator = require('../../simulators/model/simulator.model')

const Question = sequelize.define('Question', {
	question_id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	simulator_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: Simulator,
			key: 'simulator_id'
		}
	},
	options: {
		type: DataTypes.JSON,
		allowNull: false
	},
	question: {
		type: DataTypes.STRING(250),
		allowNull: false
	},
	correct_answer: {
		type: DataTypes.STRING(250),
		allowNull: false
	}
}, {
	timestamps: false,
	tableName: 'questions'
})

// Relación uno a muchos con Simulator
Question.belongsTo(Simulator, { as: 'Simulator', foreignKey: 'simulator_id' })
Simulator.hasMany(Question, { as: 'Questions', foreignKey: 'simulator_id' })

module.exports = Question