'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	mysql = require('mysql'),
	_ = require('lodash'),
	connection;




var association = {
	"first": {
		"name": "employees",
		"columns": [{
			"Field": "emp_no",
			"Type": "int(11)",
			"Null": "NO",
			"Key": "PRI",
			"Default": null,
			"Extra": "",
			"selected": true
		}, {
			"Field": "birth_date",
			"Type": "date",
			"Null": "NO",
			"Key": "",
			"Default": null,
			"Extra": ""
		}, {
			"Field": "first_name",
			"Type": "varchar(14)",
			"Null": "NO",
			"Key": "",
			"Default": null,
			"Extra": ""
		}, {
			"Field": "last_name",
			"Type": "varchar(16)",
			"Null": "NO",
			"Key": "",
			"Default": null,
			"Extra": ""
		}, {
			"Field": "gender",
			"Type": "enum('M','F')",
			"Null": "NO",
			"Key": "",
			"Default": null,
			"Extra": ""
		}, {
			"Field": "hire_date",
			"Type": "date",
			"Null": "NO",
			"Key": "",
			"Default": null,
			"Extra": ""
		}]
	},
	"type": {
		"id": 1,
		"label": "1 - 1"
	},
	"second": {
		"name": "titles",
		"columns": [{
			"Field": "emp_no",
			"Type": "int(11)",
			"Null": "NO",
			"Key": "PRI",
			"Default": null,
			"Extra": "",
			"selected": true
		}, {
			"Field": "title",
			"Type": "varchar(50)",
			"Null": "NO",
			"Key": "PRI",
			"Default": null,
			"Extra": ""
		}, {
			"Field": "from_date",
			"Type": "date",
			"Null": "NO",
			"Key": "PRI",
			"Default": null,
			"Extra": ""
		}, {
			"Field": "to_date",
			"Type": "date",
			"Null": "YES",
			"Key": "",
			"Default": null,
			"Extra": ""
		}]
	}
};

function DataTypes() {
	this.strings = ['CHARACTER', 'VARCHAR', 'CHAR'];
	this.numbers = ['INTEGER', 'INT', 'SMALLINT', 'INTEGER', 'BIGINT', 'DECIMAL', 'NUMERIC', 'FLOAT', 'REAL'];
	this.date = ['DATE'];
	this.timestamp = ['TIMESTAMP', 'TIME'];
	this.binary_data = ['VARBINARY', 'BINARY'];
	this.boolean = ['BOOLEAN'];
	this.array = ['ENUM'];
	this.isString = function(t) {
		return find(t, this.strings);
	};
	this.isNumber = function(t) {
		return find(t, this.numbers);
	};
	this.isDate = function(t) {
		return find(t, this.date);
	};
	this.isTimstamp = function(t) {
		return find(t, this.timestamp);
	};
	this.isBinaryData = function(t) {
		return find(t, this.binary_data);
	};
	this.isBoolean = function(t) {
		return find(t, this.boolean);
	};
	this.isArray = function(t) {
		return find(t, this.array);
	}
	this.getType = function(t) {
		if (this.isString(t)) return 'String';
		else if (this.isNumber(t)) return 'Number';
		else if (this.isDate(t)) return 'Date';
		else if (this.isTimstamp(t)) return 'Timestamp';
		else if (this.isBinaryData(t)) return 'Binary Data';
		else if (this.isBoolean(t)) return 'Boolean';
		else if (this.isArray(t)) return 'Array';
	}

	function find(t, list) {
		for (var i = 0, _list = list, length = _list.length; i < length; i++) {
			if (t.toUpperCase().indexOf(_list[i]) > -1) return true;
		}
		return false;
	}

}

function _embed(first, second, isArray) {
	var temp = {},
		isArray = isArray || false,
		dataTypes = new DataTypes();

	_.forEach(first.columns, function(e) {

		if (!e.selected) {
			temp[e.Field] = dataTypes.getType(e.Type);
		}
		else {
			var secondObj = {};

			_.forEach(second.columns, function(c) {
				if (!c.selected) secondObj[c.Field] = dataTypes.getType(e.Type);
			});

			temp[second.name] = isArray ? [secondObj] : secondObj;
		}
	});
	return temp;
}

function getId(first, second) {
	var firstId, secondId;

	_.forEach(first.columns, function(e) {
		if (e.selected) firstId = e.Field;
	});

	_.forEach(second.columns, function(e) {
		if (e.selected) secondId = e.Field;
	});

	return {
		firstId: firstId,
		secondId: secondId
	};
}


module.exports = function(Processus) {
	return {
		createConnection: function(req, res, next) {
			var connect = JSON.parse(req.query.connection || "{}"),
				host = connect.host || 'localhost',
				port = connect.port,
				user = connect.user || 'adln1',
				password = connect.password,
				database = connect.database || 'employees';

			connection = mysql.createConnection({
				host: host,
				port: port,
				user: user,
				password: password,
				database: database
			});
			console.log(connection);
			next();
		},
		connectMysql: function(req, res) {

			connection.query('SHOW TABLES', function(err, rows) {
				if (err) {
					return res.status(500).json({
						error: err
					});
				}
				var list = rows.map(function(e) {
					return e[Object.keys(e)[0]];
				});

				res.json(list);
			});
		},
		getTable: function(req, res) {
			var table = req.query.table,
				obj = {};
			obj.name = table;
			connection.query('SHOW COLUMNS FROM ' + table, function(err, cols) {
				obj.columns = cols;
				res.json(obj);
			});

		},
		/**
		 * For one to one associations
		 * @params association {first: {name:"",columns:[{}] }, second:{name: String,columns:[{}]}, type:{id:Number, label:String}}
		 */
		first: function(req, res) {
			var first = association.first,
				second = association.second,
				obj1 = {
					name: first.name,
					schema: [],
					request: ''
				},
				obj2 = {
					name: second.name,
					schema: [],
					request: ''
				},
				Ids = getId(first, second);
			console.log("SELECT * FROM " + first.name + " LEFT OUTER JOIN " + second.name + " ON " + first.name + "." + Ids.firstId + " = " + second.name + "." + Ids.secondId + ";");


			obj1.schema.push(_embed(first, second));
			obj1.request = "SELECT * FROM " + first.name + " LEFT OUTER JOIN " + second.name + " ON " + first.name + "." + Ids.firstId + " = " + second.name + "." + Ids.secondId + ";";
			obj1.schema.push(null);

			obj2.schema.push(_embed(second, first));
			obj1.schema.request = getId(second, first);
			obj2.schema.push(null);

			res.json({
				tables: [obj1, obj2]
			});
		},
		second: function(req, res) {
			var first = association.first,
				second = association.second,
				obj1 = {
					name: first.name,
					schema: []
				};
			obj1.schema.push(_embed(first, second, true));
			res.json({
				tables: [obj1]
			})
		},
		third: function(req, res) {
			var first = association.first,
				second = association.second,
				obj1 = {
					name: second.name,
					schema: []
				};
			obj1.schema.push(_embed(second, first, true));
			res.json({
				tables: [obj1]
			});
		},
		fourth: function(req, res) {
			var dataTypes = new DataTypes(),
				document1 = {
					name: association.first.name,
					schema: [{}]
				},
				document2 = {
					name: association.second.name,
					schema: [{}]
				};

			_.forOwn(association.first.columns, function(value, key) {
				document1['schema'][0][value.Field] = dataTypes.getType(value.Type);
			});
			_.forOwn(association.second.columns, function(value, key) {
				document2['schema'][0][value.Field] = dataTypes.getType(value.Type);
			});
			res.json([
				document1, document2
			]);
		},


		//Extract and merge data partially
		fourthData: function(req, res /*table1, table2*/ ) {
			connection.query("SELECT * FROM employees" /* + table1*/ , function(err, rows) {
				console.log(err);
				res.json({
					rows: rows
				});
			});
		}
	};
};
