'use strict';

/**
 * Module dependencies.
 */
var MongoClient = require('mongodb').MongoClient,
	mongoose = require('mongoose'),
	mysql = require('mysql'),
	_ = require('lodash'),
	connection;


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
		first: {
			name: first.name,
			id: firstId
		},
		second: {
			name: second.name,
			id: secondId
		}
	};
}

function MongoInsert(collec, data, next) {
	MongoClient.connect("mongodb://localhost:27017/mean-dev", {
		native_parser: true
	}, function(err, db) {
		if (err) {
			return console.dir(err);
		}
		var collection = db.collection(collec);
		collection.insert(data, function(err, result) {

			next(data._id);
			db.close();
		})

	});
}

function MongoUpdate(collec, prop, data, id, isArray) {

	MongoClient.connect("mongodb://localhost:27017/mean-dev", {
		native_parser: true
	}, function(err, db) {
		if (err) {
			return console.dir(err);
		}
		var collection = db.collection(collec);
		var obj = {},
			newObj = {};
		obj[prop] = data;

		if (isArray) {
			newObj = {
				$push: obj
			};
		}
		else {
			newObj = {
				$set: obj
			};

		}

		collection.update({
			_id: id
		}, newObj, function(err, result) {

			db.close();
		});

	});
}

/**
 * For one to one associations
 * @params association {first: {name:"",columns:[{}] }, second:{name: String,columns:[{}]}, type:{id:Number, label:String}}
 */
function first(association) {
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


	obj1.schema.push(_embed(first, second));
	obj1.ids = Ids;
	obj1.schema.push(null);

	obj2.schema.push(_embed(second, first));
	obj2.ids = Ids;
	obj2.schema.push(null);

	return {
		tables: [obj1, obj2]
	};
};

function second_third(association) {
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
	obj1.schema.push(_embed(first, second, true));
	obj1.ids = Ids;
	obj1.schema.push(null);

	obj2.schema.push(_embed(second, first, false));
	obj2.ids = Ids;
	obj2.schema.push(null);
	return {
		tables: [obj1, obj2]
	};
}

module.exports = function(Processus) {
	return {
		createConnection: function(req, res, next) {
			var connect = JSON.parse(req.query.connection || "{}"),
				host = connect.host || 'localhost',
				port = connect.port || 3306,
				user = connect.user || 'root',
				password = connect.password || 'Azerty12',
				database = connect.database || 'employees';

			connection = mysql.createConnection({
				host: host,
				port: port,
				user: user,
				password: password,
				database: database
			});
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
			res.json({
				tables: [document1, document2]
			});
		},
		makeSchema: function(req, res) {

			var associations = JSON.parse(req.body.associations) || [],
				schemas = [];

			for (var i = 0, length = associations.length; i < length; i++) {

				switch (associations[i].type.id) {
					case 1:
						schemas.push(first(associations[i]));
						break;
					case 2:
						schemas.push(second_third(associations[i]));
						break;
				}
			}
			res.json(schemas);
		},
		finalSchema: function(req, res) {
			var associations = JSON.parse(req.body.associations),
				list = [],
				schemas = [],
				Ids = [];

			for (var i = 0, length = associations.length; i < length; i++) {
				_.each(associations[i].tables, function(item) {

					_.each(item.schema, function(e) {
						if (e !== null)
							if (e.selected) list.push({
								name: item.name,
								schema: e,
								ids: item.ids
							});
					});

				});
			}
			for (var i = 0, length = list.length; i < length; i++) {
				var obj = {},
					schemas_names = schemas.map(function(e) {
						return e.name;
					});

				if (schemas_names.indexOf(list[i].name) === -1) {
					obj.name = list[i].name;
					obj.schema = {};
					obj.ids = [];
					obj.ids.push(list[i].ids);
					_.forOwn(list[i].schema, function(value, key) {
						if (key !== 'selected') obj.schema[key] = value;
					});
					schemas.push(obj);
				}
				else {
					_.each(schemas, function(item) {
						if (item.name == list[i].name) {
							item.ids.push(list[i].ids);

							_.forOwn(list[i].schema, function(value, key) {
								if (!item.schema[key] && key !== 'selected') {
									item.schema[key] = value;
								}
							})
						}
					});
				}
			}

			res.json(schemas);
		},
		migration: function(req, res) {
			var schema = JSON.parse(req.body.schema);
				// schema = schemas[1];

			//for (var i = 0, length = schemas.length; i < length; i++) {
			// get the value
			connection.query('SELECT * FROM ' + schema.name + ' LIMIT 10', function(err, lines) {
				// for each line
				_.forEach(lines, function(line) {
					// the new document
					var obj = {};

					// create the main document
					_.forOwn(schema.schema, function(value, key) {
						var type = Object.prototype.toString.call(value);
						if (type == '[object String]') {
							if (line[key]) obj[key] = line[key];
						}
					});

					// after the creation of the first document, add the embedded documents to it
					MongoInsert(schema.name, obj, function(_id) {

						_.forOwn(schema.schema, function(value, key) {

							var type = Object.prototype.toString.call(value);

							// if object, get all related data
							if (type == '[object Array]') {
								// get the foreign key to gett related data
								_.forEach(schema.ids, function(element) {

									if (element.second.name == key) {
										var id = element.second.id,
											sql = 'SELECT * FROM ' + key + ' WHERE ' + key + '.' + id + '="' + line[id] + '"';
										obj[key] = [];
										connection.query(sql, function(err, subs) {

											_.forEach(subs, function(sub) {
												var obj1 = {};
												_.forOwn(schema.schema[key][0], function(value1, key1) {
													if (sub[key1]) obj1[key1] = sub[key1];
												});

												MongoUpdate(schema.name, key, obj1, _id, true);
											})
										});

									}
								});
							}
							else if (type == '[object Object]') {
								// get the foreign key to gett related data
								_.forEach(schema.ids, function(element) {

									if (element.second.name == key) {
										var id = element.second.id,
											sql = 'SELECT * FROM ' + key + ' WHERE ' + key + '.' + id + '="' + line[id] + '" LIMIT 1';
										connection.query(sql, function(err, sub) {
											if (err) console.log(err);
											var obj2 = {};
											_.forOwn(schema.schema[key], function(value1, key1) {
												if (sub[0][key1]) obj2[key1] = sub[0][key1];
											});
											MongoUpdate(schema.name, key, obj2, _id, false);

										});

									}
								});
							}
						});
					});
					// for each schema property


				});

				res.json({});
			});

			// }
			// res.json({});
		},

	};
};
