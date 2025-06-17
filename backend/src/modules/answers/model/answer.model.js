const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../../../config/database')
const User = require('../../users/model/user.model')
const Question = require('../../questions/model/question.model')

const Answer = sequelize.define('Answer', {
	answer_id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	student_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: User,
			key: 'user_id'
		}
	},
	question_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: Question,
			key: 'question_id'
		}
	},
	type_response: {
		type: DataTypes.ENUM('texto', 'video'),
		allowNull: false
	},
	answer: {
		type: DataTypes.STRING(250),
		allowNull: true
	},
	url_video: {
		type: DataTypes.STRING(250),
		allowNull: true
	},
	date_response: {
		type: DataTypes.DATE,
		allowNull: false
	}
}, {
	timestamps: false,
	tableName: 'answers'
})

// Relación uno a muchos con User
Answer.belongsTo(User, { as: 'Student', foreignKey: 'student_id' })
User.hasMany(Answer, { as: 'Answers', foreignKey: 'student_id' })

// Relación uno a muchos con Question
Answer.belongsTo(Question, { as: 'Question', foreignKey: 'question_id' })
Question.hasMany(Answer, { as: 'Answers', foreignKey: 'question_id' })

module.exports = Answer