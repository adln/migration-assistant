'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	mysql = require('mysql'),
	_ = require('lodash'),
	connection;



var association = { "first": { "name": "dept_emp", "columns": [{ "Field": "emp_no", "Type": "int(11)", "Null": "NO", "Key": "PRI", "Default": "", "Extra": "", "selected": true }, { "Field": "dept_no", "Type": "char(4)", "Null": "NO", "Key": "PRI", "Default": "", "Extra": "" }, { "Field": "from_date", "Type": "date", "Null": "NO", "Key": "", "Default": "", "Extra": "" }, { "Field": "to_date", "Type": "date", "Null": "NO", "Key": "", "Default": "", "Extra": "" }] }, "type": { "id": 1, "label": "1 - 1" }, "second": { "name": "dept_manager", "columns": [{ "Field": "dept_no", "Type": "char(4)", "Null": "NO", "Key": "PRI", "Default": "", "Extra": "" }, { "Field": "emp_no", "Type": "int(11)", "Null": "NO", "Key": "PRI", "Default": "", "Extra": "", "selected": true }, { "Field": "from_date", "Type": "date", "Null": "NO", "Key": "", "Default": "", "Extra": "" }, { "Field": "to_date", "Type": "date", "Null": "NO", "Key": "", "Default": "", "Extra": "" }] } };


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
		/**
		 * For one to one associations
		 * @params association {first: {name:"",columns:[{}] }, second:{name: String,columns:[{}]}, type:{id:Number, label:String}}
		 */
		first: function (req, res) {
			var first = association.first,
				second = association.second,
				obj = { name: first.name };

			_.forEach(first.columns, function (e) {
				if (e.selected) e = { v: "x" };
			});
		}

    };
};

