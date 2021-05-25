module.exports = (sequelize, type) => {
	return sequelize.define('employee', {
		id: {
			type: type.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		nome: type.STRING,
		cargo: type.STRING,
		idade: type.INTEGER,
	});
};
