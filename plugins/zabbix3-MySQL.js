/*zabbix3-MySQL.js*/

//database plugin for zabbix 3.x using MySQL.  Tested on MariaDB 5.5 and Zabbix 3.4
const config = require('../config.js');
const mysql = require('mysql');
const Promise = require('promise');

//according to an old post on the internet, zabbix stores its value_types as integers, where 0 = float, 1 = str, etc.
//this array maps those indices to those values.
const valueTypes = ['history','history_str','history_log','history_uint','history_text'];

//all plugins should have the following exposed to gatherer (even if they're dummies):
//connected - property to tell if the plugin is in the 'connected' state, ie, ready to accept queries
//init - method to initialize everything the plugin needs, including a connection to the database if required
//query - method to translate a link's valueSource into a database query, query for the data, and then pass a promise back with the data; data should be an object of the form {"value":latest Value, "time": unix timestamp when value was taken}
//disconnect - method to gracefully close all connection to the database
const plugin = {
	"pool" : undefined,
	"connected" : false,

	//This plugin's init method will create a pool of connections.
	//TODO: check to make sure that the connections actually WORK inside this init method.
	init() {

		//set connection params
		let options = {
			"connectionLimit"			: config.database.connections, 
			"password"						: config.database.password,
			"database"						: config.database.dbName,
			"user"								: config.database.user,
			"multipleStatements"	: true //TODO: figure out of it's better to use one set of multiple statements or one large statement
		};

		//if the user wants to use sockets, set those parameters, else use TCP
		if (config.database.useSocket) {
			options['socketPath'] = config.database.socket;
		} else {
			options['host'] = config.database.host,
			options['port'] = config.database.port
		}

		//create the pool
		this.pool = mysql.createPool(options);

		//TODO: error checking on pool creation - can a connection be made?  is mysql actually running?  etc
		this.connected = true;
	},

	//gracefully close anything 
	disconnect() {
		//don't run if there's no connection
		if (!(this.connected)) {
			return;
		}

		this.pool.end(function(err) {
			if (err) {
				//TODO: some error checking here
			}
			this.connected = false;
		});
	},

	//for zabbix, the valueSource should be an object of {"host":hostname, "key":keyname}.
	//we will consider using itemID, but that's hard for the user to figure out.
	//returns a promise for when query is done
	query(valueSource) {

		//TODO: consider sanity-checking valueSource

		//build the query.  This plugin expects queries to be asking for the latest value of a host:key pair, so it won't work with anything else!

		//example query to get the latest value of a host:key pair:
		//select @hostID := hostid from hosts where name = 'router1';
		//select @itemID := itemid from items where hostid = @hostID and key_ 'Router1ISP1Down';
		//select @valType := value_type from items where itemid = @itemID;
		//select @tableStr := case when @valType = 0 THEN 'history' when @valType = 1 THEN 'history_str' when @valType = 2 THEN 'history_log' when @valType = 3 THEN 'history_uint' when @valType = 4 THEN 'history_text' end;
		//set @queryString := concat('select value,MAX(clock) from ', @tableStr, ' where itemid = ', @itemID, ';');
		//prepare stmt from @queryString;
		//execute stmt;

		let query = "select @hostID := hostid from hosts where name = '" + valueSource['host'] + "'; ";
		query = query + "select @itemID := itemid from items where hostid = @hostID and key_ = '" + valueSource['key'] + "'; ";
		query = query + "select @valType := value_type from items where itemid = @itemID; ";
		query = query + "select @tableStr := case ";
		for (index in valueTypes) {
			query = query + "when @valType = " + index + " THEN '" + valueTypes[index] + "'";
		} 
		query = query + "end; ";
		query = query + "set @queryString := concat('select value,MAX(clock) from ', @tableStr, ' where itemid = ', @itemID, ';'); ";
		query = query + "prepare stmt from @queryString; execute stmt; ";

		//establish the connection
		let connectionEstablished = new Promise(function(resolve,reject) {
			this.pool.getConnection(function(err, connection) {
				if (err) {
					//TODO: error checking here
					return reject(err);
				} else {
					resolve(connection);
				}
			});
		}.bind(this));

		//set the promise chain as the return value for this function
		return connectionEstablished.then(function(connection) {

			//once the connection has been established, promisify the query function and send the query
			return new Promise(function(resolve,reject) {
				connection.query(query, function(err, res, fields) {
					//ALWAYS release the connection once finished
					connection.release();
					if (err) {
						//TODO: error checking here
					} else {
						//derive the correct data from the query result
						let retVal = {
							"value"	: res.slice(-1)[0][0]['value'],
							"time"	: res.slice(-1)[0][0]['MAX(clock)']
						};
						resolve(retVal)
					}
				});
			});
		});
	}
};

module.exports.plugin = plugin; 