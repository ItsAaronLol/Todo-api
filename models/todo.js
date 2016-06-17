module.exports = function(sequelize, DataTypes) {
	return sequelize.define('todo', {
		description: {
			type: DataTypes.STRING, //must be a string
			allowNull: false, //needs to exist
			validate: {
				len: [1, 250] //length is one or greater, less than or equal to 250
			}
		},
		completed: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	});
};