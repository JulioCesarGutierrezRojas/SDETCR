const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../../../config/database')

const User = sequelize.define('User', {
	user_id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	name: {
		type: DataTypes.STRING(100),
		allowNull: false
	},
	lastname: {
		type: DataTypes.STRING(100),
		allowNull: false
	},
	email: {
		type: DataTypes.STRING(250),
		allowNull: false,
		validate: {
			isEmail: true
		}
	},
	category: {
		type: DataTypes.JSON,
		allowNull: true
	},
	enrollment: {
		type: DataTypes.STRING(100),
		allowNull: false
	},
	role: {
		type: DataTypes.ENUM('estudiantes', 'mentor', 'administrador'),
		allowNull: false
	},
	password: {
		type: DataTypes.STRING(250),
		allowNull: false
	},
	mentor_id: {
		type: DataTypes.INTEGER,
		allowNull: true,
		references: {
			model: 'users',
			key: 'user_id'
		}
	}
}, {
	timestamps: false,
	tableName: 'users'
})

User.belongsTo(User, { as: 'Mentor', foreignKey: 'mentor_id' })

module.exports = User