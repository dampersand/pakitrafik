/*mapWorker.js*/

//provides file I/O functions relating to maps
//consider merging with mapFactory, except that function has no file I/O

//required modules
const fs = require("fs");
const checksum = require("checksum");
const Promise = require("promise");
const mapFactory = require("./mapFactory.js");
const prototypes = require("./prototypes.js");

//config files
const config = require("../config.js");

//functions
//returns a promise that, when complete, carries the checksum of a map file.
function checkMap(file, directory = config.package.mapDirectory) {
	return new Promise(function(resolve, reject) {
		checksum.file(directory + "/" + file, function(err,sum) {
			if (err) { //TODO: error checking here
				return reject(err);
			} else {
				resolve(sum);
			}
		})
	});
}

//returns a promise that, when complete, carries a full map object and checksum from file.
function loadMap(file, directory = config.package.mapDirectory) {
	//asynchronously get checksum of map file and read said map from file
	return new Promise.all([
		checkMap(file, directory), 
		new Promise(function(resolve,reject) {
			fs.readFile(directory + "/" + file, 'utf8', function(err, data) {
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
		for (entry in mapData) {
			map[entry] = mapData[entry]; //TODO: consider what this might erase.  anything important?  What if the file has some garbage in it?  Is it possible to rewrite a function here?  Might be good to inherit from a prototype with the methods and call object.freeze
		}
		map['meta']['checksum'] = result[0]; //TODO: consider whether meta might not exist - should, since it's inherited from prototype, but double-check
		return map;
	});
}

//saves a map object to file, returns a promise that points to the return value of fs.writeFile
function saveMap(mapObj, directory = config.package.mapDirectory) {
	
	if (!mapObj.isPrototypeOf(prototypes.mapProto)) { //TODO: some error handling here
		return;
	}

	//strip checksum
	delete mapObj['meta']['checksum'];

	//turn mapObj into string and jam it into file
	let mapString = JSON.stringify(mapObj);

	return new Promise(function(resolve,reject){
		fs.writeFile(directory + "/" + filename + ".map", mapString, function(err, data) {
			if (err) { //TODO: error checking here
				return reject(err);
			} else {
				resolve(data);
			}
		});
	});
}

//returns a promise that reads an entire directory
//TODO: right now this function expects the directory to be flat.  I'd like to add recursion here.
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
	checkMap,
	loadMap,
	saveMap,
	listMaps
}