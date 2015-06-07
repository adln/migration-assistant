'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	mysql = require('mysql'),
	connection;

function getCols(table) {

}


module.exports = function (Processus) {
    return {
		createConnection: function (req, res, next) {
			var connect = JSON.parse(req.query.connection),
				host = connect.host || 'localhost',
				port = connect.port,
				user = connect.user || 'root',
				password = connect.password,
				database = connect.database;

			connection = mysql.createConnection({
				host: host,
				port: port,
				user: user,
				password: password,
				database: database
			});
			console.log(database);
			next();
		},
        connectMysql: function (req, res) {

			connection.query('SHOW TABLES', function (err, rows) {
				if (err) {
					return res.status(500).json({
						error: err
					});
				}
				var list = rows.map(function (e) {
					return e[Object.keys(e)[0]];
				});

				res.json(list);
			});
		},
		getTable: function (req, res) {
			var table = req.query.table,
				obj = {};
			obj.name = table;
			connection.query('SHOW COLUMNS FROM ' + table, function (err, cols) {
				obj.columns = cols;
				res.json(obj);
			});

		},

    };
};

