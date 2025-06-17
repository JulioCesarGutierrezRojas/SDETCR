const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../../../config/database')

const Category = sequelize.define('Category', {
	category_id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	name: {
		type: DataTypes.STRING(100),
		allowNull: false
	},
	description: {
		type: DataTypes.TEXT,
		allowNull: false
	}
}, {
	timestamps: false,
	tableName: 'categories'
})

module.exports = Category