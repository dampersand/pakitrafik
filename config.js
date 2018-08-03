/*config.js*/

const config = {};
config.redis = {};
config.settings = {};
config.database = {};

//config.redis
//variables specific to your machine

config.redis.host="hostname"; 						//string
config.redis.port=3000; 									//integer


//config.settings
//general settings for pakitrafik

//how old (in seconds) data on a map can be before it's considered too old to show
//prevents disabled items from showing past data as current data.
config.settings.linkValueTTL = 120; //integer

//how often (in seconds) to perform checksum testing on the in-memory map set.
//More often means map structures are updated more often but will increase backend load.
config.settings.mapSetUpdateInterval = 30; //integer

//whether or not to trust the in-memory map set on fresh map requests
//true = new requests can be served from the in-memory map set without immediate checksum testing (maps may be out of date until checksum test is performed)
//false = new requests should always cause a checksum test (resulting in fully up-to-date map, increases backend load)
config.settings.trustMapSet = false; 			//boolean

//where to find/save maps
config.settings.mapDirectory="./maps"; 		//string


//config.database
//information about the database you're using
//you may not need to fill all of these out, depending on the plugin you're using

//location/port, user, password, and DB name for your database
config.database.host = 'localhost'; 			//string
config.database.port = 3306; 							//integer
config.database.user = 'user'; 						//string
config.database.password = 'password'; 		//string
config.database.dbName = 'dbName'; //string

//if you wish to use a socket instead of TCP, fill this out
config.database.useSocket = false; 				//boolean
config.database.socket = '/var/lib/mysql/mysql.sock' //string

//if the database plugin supports multiple connections, you can set how many connections will be available here.  Must be greater than 1.
config.database.connections = 10 					//integer

//the plugin you're using to access the database.  Value must be the filename of the plugin located in the plugins directory
config.database.plugin = 'zabbix3-MySQL.js'; 		//string

module.exports = config;