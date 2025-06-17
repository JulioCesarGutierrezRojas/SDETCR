const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../../../config/database')
const User = require('../../users/model/user.model')

const Notification = sequelize.define('Notification', {
	notification_id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	addressee_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: User,
			key: 'user_id'
		}
	},
	type: {
		type: DataTypes.STRING(100),
		allowNull: true
	},
	message: {
		type: DataTypes.STRING(250),
		allowNull: false
	},
	date_send: {
		type: DataTypes.DATE,
		allowNull: false,
        defaultValue: DataTypes.NOW
	}
}, {
	timestamps: false,
	tableName: 'notifications'
})

// Relación uno a muchos con User
Notification.belongsTo(User, { as: 'Addressee', foreignKey: 'addressee_id' })
User.hasMany(Notification, { foreignKey: 'addressee_id', as: 'Notification' })

module.exports = Notification