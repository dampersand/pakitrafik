/*mapworker.js*/

//required modules
const fs = require("fs");
const checksum = require("checksum");
const Promise = require("promise");
const mapFactory = require("./mapFactory");

//config files
const config = require("./config.js");

//functions
//returns a promise that, when complete, returns the checksum of a map file.
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

//returns a promise that, when complete, returns a full map object and checksum from file.
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
		let map = mapFactory.newMap();
		let mapData = JSON.parse(result[1]);
		for entry in mapData {
			map[entry] = mapData[entry]; //TODO: consider what this might erase.  anything important?  What if the file has some garbage in it?  Is it possible to rewrite a function here?  Might be good to inherit from a prototype with the methods and call object.freeze
		}
		map['meta']['checksum'] = result[0]; //TODO: consider whether meta might not exist - should, since it's inherited from prototype, but double-check
		return map;
	});
}

module.exports = {
	checkMap,
	getMap
}