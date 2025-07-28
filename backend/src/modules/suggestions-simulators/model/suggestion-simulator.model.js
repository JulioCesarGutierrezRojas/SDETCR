const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../../../config/database')

const SuggestionSimulator = sequelize.define('SuggestionSimulator', {
	suggestion_id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	suggested_category: {
		type: DataTypes.STRING,
		allowNull: false
	},
	suggested_name:{
		type: DataTypes.STRING,
		allowNull:false
	},
	suggested_descrption:{
		type: DataTypes.STRING,
		allowNull:false
	},
	date_suggestion: {
		type: DataTypes.DATE,
		allowNull: false,
        defaultValue: DataTypes.NOW
	},
	status: {
		type: DataTypes.ENUM('pendiente', 'aprobado', 'rechazado'),
		allowNull: false
	}
}, {
	timestamps: false,
	tableName: 'suggestions_simulators'
})

module.exports = SuggestionSimulator