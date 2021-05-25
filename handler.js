'use strict';

const connectToDatabase = require('./db');

function HTTPError(statusCode, message) {
	const error = new Error(message);
	error.statusCode = statusCode;
	return error;
}

module.exports.healthCheck = async () => {
	await connectToDatabase();
	console.log('Connection successful.');

	return {
		statusCode: 200,
		body: JSON.stringify({ message: 'Connection successful.' }),
	};
};

module.exports.create = async (event) => {
	try {
		const { Employee } = await connectToDatabase();
		const employee = await Employee.create(JSON.parse(event.body));

		return {
			statusCode: 200,
			body: JSON.stringify(employee),
		};
	} catch (err) {
		return {
			statusCode: err.statusCode || 500,
			headers: { 'Content-Type': 'text/plain' },
			body: 'Não foi possível cadastrar um funcionário.',
		};
	}
};

module.exports.getOne = async (event) => {
	try {
		const { Employee } = await connectToDatabase();
		const employee = await Employee.findById(event.pathParameters.id);

		if (!employee) {
			throw new HTTPError(404, `Funcionário com identificador: ${event.pathParameters.id} não foi encontrado.`);
		}

		return {
			statusCode: 200,
			body: JSON.stringify(employee),
		};
	} catch (err) {
		return {
			statusCode: err.statusCode || 500,
			headers: { 'Content-Type': 'text/plain' },
			body: err.message || 'Não foi possível encontrar o funcionário.',
		};
	}
};

module.exports.getAll = async () => {
	try {
		const { Employee } = await connectToDatabase();
		const employees = await Employee.findAll();

		return {
			statusCode: 200,
			body: JSON.stringify(employees),
		};
	} catch (err) {
		return {
			statusCode: err.statusCode || 500,
			headers: { 'Content-Type': 'text/plain' },
			body: 'Não foi possível encontrar os funcionários.',
		};
	}
};

module.exports.update = async (event) => {
	try {
		const input = JSON.parse(event.body);
		const { Employee } = await connectToDatabase();
		const employee = await Employee.findById(event.pathParameters.id);

		if (!employee) {
			throw new HTTPError(404, `Funcionário com identificador: ${event.pathParameters.id} não foi encontrado.`);
		}

		if (input.nome) {
			employee.nome = input.nome;
		}
		if (input.idade) {
			employee.idade = input.idade;
		}
		if (input.cargo) {
			employee.cargo = input.cargo;
		}

		await employee.save();

		return {
			statusCode: 200,
			body: JSON.stringify(employee),
		};
	} catch (err) {
		return {
			statusCode: err.statusCode || 500,
			headers: { 'Content-Type': 'text/plain' },
			body: err.message || 'Ñão foi possível atualizador o cadastro do funcionário.',
		};
	}
};

module.exports.delete = async (event) => {
	try {
		const { Employee } = await connectToDatabase();
		const employee = await Employee.findById(event.pathParameters.id);

		if (!employee) {
			throw new HTTPError(404, `Funcionário com identificador: ${event.pathParameters.id} não foi encontrado.`);
		}

		await employee.destroy();

		return {
			statusCode: 200,
			body: JSON.stringify(employee),
		};
	} catch (err) {
		return {
			statusCode: err.statusCode || 500,
			headers: { 'Content-Type': 'text/plain' },
			body: err.message || 'Não foi possível apagar o cadastro do funcionário.',
		};
	}
};
