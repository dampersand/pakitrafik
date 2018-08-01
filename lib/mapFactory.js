/*mapFactory.js*/

//Factory for creating map objects, working with map objects, and components therein
//This feels super weird.  I want to use these functions to create the object fully-formed, not empty versions.

const prototypes = require('./prototypes.js');
const fs = require('fs');
const config = require('../config.js');

//factory function for empty prototypes
function newEmptyMap(filename = String(Date.now())) {
	let map = Object.create(prototypes.mapProto);
	map.meta.fileName = filename;
	return map;
}

//factory function to create a map and then load it from file.  returns a promise with the loaded map attached, because has to do async file reading.
function newMapFromFile(filename, directory = config.package.mapDirectory) {
	let map = newEmptyMap(filename);
	return map.loadMap(directory).then(function(){return map});
}

//factory function to list all maps available via files.  returns a promise with the list when complete
function listMaps(directory = config.package.mapDirectory) {
	return new Promise(function(resolve,reject){
		fs.readdir(directory, function(err, data) {
			if (err) { //TODO: error checking here
				return reject(err);
			} else {
				resolve(data);
			}
		});
	});
}

module.exports = {
	newEmptyMap,
	newMapFromFile,
	listMaps
}
