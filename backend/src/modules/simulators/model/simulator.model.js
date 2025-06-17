const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../../../config/database')
const Category = require('../../categories/model/category.model')

const Simulator = sequelize.define('Simulator', {
	simulator_id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	category_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: Category,
			key: 'category_id'
		}
	},
	name: {
		type: DataTypes.STRING(100),
		allowNull: false
	},
	status: {
		type: DataTypes.BOOLEAN,
		allowNull: false
	}
}, {
	timestamps: false,
	tableName: 'simulators'
})

// Relación uno a muchos con Category
Simulator.belongsTo(Category, { foreignKey: 'category_id', as: 'Category' })
Category.hasMany(Simulator, { foreignKey: 'category_id', as: 'Simulator' })

module.exports = Simulator