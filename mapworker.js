/*mapworker.js*/

//required modules
const fs = require("fs");
const checksum = require("checksum");
const Promise = require("promise");

//config files
var config = require("./config.js");

//functions
//returns a promise that should include the checksum for the map in question
function checkMap(mapName, directory = config.package.mapDirectory) {
	return new Promise(function(resolve, reject) {
		checksum.file(directory + "/" + mapName, function(err,sum) {
			if (err) { //TODO: error checking here
				return reject(err);
			} else {
				resolve(sum);
			}
		})
	});
}

//testing how this returns
function getMap(mapName, directory = config.package.mapDirectory) {
	//asynchronously get checksum of map file and read said map from file
	return new Promise.all([
		checkMap(mapName, directory), 
		new Promise(function(resolve,reject) {
			fs.readFile(directory + "/" + mapName, 'utf8', function(err, data) {
				if (err) { //TODO: error checking here
					return reject(err);
				} else {
					resolve(data);
				}
			});
		})
	]).then(function(result){ //after reading and getting checksum, put into 'map' variable and return 'map' variable
		var map;
		map = result[1];
		map['meta']['checksum'] = result[0]; //TODO: double-check that 'meta' exists
		return map;
	});

}

module.exports = {
	checkMap,
	getMap
}