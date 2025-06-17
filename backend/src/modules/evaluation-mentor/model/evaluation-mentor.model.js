const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../../../config/database')
const User = require('../../users/model/user.model')
const Simulator = require('../../simulators/model/simulator.model')

const EvaluationMentor = sequelize.define('EvaluationMentor', {
	evaluation_id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	mentor_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: User,
			key: 'user_id'
		}
	},
	student_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: User,
			key: 'user_id'
		}
	},
	simulator_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: Simulator,
			key: 'simulator_id'
		}
	},
	comment: {
		type: DataTypes.TEXT,
		allowNull: false
	},
	final_score: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	date_evaluation: {
		type: DataTypes.DATE,
		allowNull: false
	}
}, {
	timestamps: false,
	tableName: 'evaluations_mentors'
})

// Relación uno a muchos con User
EvaluationMentor.belongsTo(User, { as: 'Mentor', foreignKey: 'mentor_id' })
User.hasMany(EvaluationMentor, { as: 'MentorEvaluation', foreignKey: 'mentor_id' })

EvaluationMentor.belongsTo(User, { as: 'Student', foreignKey: 'student_id' })
User.hasMany(EvaluationMentor, { as: 'StudentEvaluation', foreignKey: 'student_id' })

// Relación uno a muchos con Simulator
EvaluationMentor.belongsTo(Simulator, { as: 'Simulator', foreignKey: 'simulator_id' })
Simulator.hasMany(EvaluationMentor, { as: 'EvaluationMentor', foreignKey: 'simulator_id' })

module.exports = EvaluationMentor