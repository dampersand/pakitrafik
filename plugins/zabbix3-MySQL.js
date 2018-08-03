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
//parallel - property to tell if the plugin can serve multiple queries at once
//init - method to initialize everything the plugin needs, including a connection to the database if required
//query - method to translate a link's valueSource into a database query, query for the data, and then pass a promise back with the data.
//disconnect - method to gracefully close all connection to the database
const plugin = {
	"pool" : undefined,
	"connected" : false,
	"parallel" : true,

	//This plugin's init method will create a pool of connections.
	//TODO: check to make sure that the connections actually WORK inside this init method.
	init() {

		//set connection params
		let options = {
			"connectionLimit"	: config.database.connections, 
			"password"				: config.database.password,
			"database"				: config.database.dbName,
			"user"						: config.database.user
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

		//TODO: error checking on pool creation - can a connection be made?
		this.connected = true;
	},

	//gracefully close anything 
	disconnect() {
		//don't run if there's no connection
		if (!(this.connected)) {
			return;
		}

		pool.end(function(err) {
			if (err) {
				//TODO: some error checking here
			}
			this.connected = false;
		});
	}

	//for zabbix, the valueSource should be an object of {"host":hostname, "key":keyname}.
	//we will consider using itemID, but that's hard for the user to figure out.
	query(valueSource) {

		//TODO: consider sanity-checking valueSource

		//build the query
		//example queries to get the value
		//select @tableStr := case when @valType = 0 THEN 'history' when @valType = 1 THEN 'history_str' when @valType = 2 THEN 'history_log' when @valType = 3 THEN 'history_uint' when @valType = 4 THEN 'history_text' end;
		//set @queryString := concat('select value,MAX(clock) from ', @tableStr, ' where itemid = ', @itemID, ';');
		//prepare stmt from @queryString;
		//execute stmt;
		let query = "select @hostID := hostid from hosts where name = '" + valueSource['host'] + "';";
		query = query + "select @itemID := itemid from items where hostid = @hostID and key_ = '" + valueSource['key'] + "';";
		query = query + "select @valType := value_type from items where itemid = @itemID;";
		query = query + "select @tableStr := case when @valType = 0 THEN 'history' when @valType = 1 THEN 'history_str' when @valType = 2 THEN 'history_log' when @valType = 3 THEN 'history_uint' when @valType = 4 THEN 'history_text' end;";
		query = query + "set @queryString := concat('select value,MAX(clock) from ', @tableStr, ' where itemid = ', @itemID, ';')";
		query = query + "prepare stmt from @queryString; execute stmt;";

		//get/create a connection from the pool
		this.pool.getconnection(function(err, connection){
			if (err) {
				//TODO: handle error value
			}

			connection.query(query, function(err, res, fields){
				if (err) {
					//TODO: handle error value
				}
				//committing this for test purposes.  This query will probably need built differently.
				console.log('res: ' + res);
				console.log('fields: ' + fields)
			});

		})
	}
};

module.exports.plugin = plugin; 