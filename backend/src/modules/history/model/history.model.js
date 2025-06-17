const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../../../config/database')
const User = require('../../users/model/user.model')
const Simulator = require('../../simulators/model/simulator.model')

const History = sequelize.define('History', {
	history_id: {
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
	simulator_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: Simulator,
			key: 'simulator_id'
		}
	},
	date_realized: {
		type: DataTypes.DATE,
		allowNull: false,
        defaultValue: DataTypes.NOW
	},
	final_score: {
		type: DataTypes.INTEGER,
		allowNull: false
	}
}, {
	timestamps: false,
	tableName: 'histories'
})

// Relación uno a muchos con User
History.belongsTo(User, { as: 'Student', foreignKey: 'student_id' })
User.hasMany(History, { as: 'Histories', foreignKey: 'student_id' })

// Relación uno a muchos con Simulator
History.belongsTo(Simulator, { as: 'Simulator', foreignKey: 'simulator_id' })
Simulator.hasMany(History, { as: 'Histories', foreignKey: 'simulator_id' })

module.exports = History