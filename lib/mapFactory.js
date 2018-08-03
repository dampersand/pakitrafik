/*mapFactory.js*/

//Factory for creating map objects, working with map objects, and components therein
//This feels super weird.  I want to use these functions to create the object fully-formed, not empty versions.

const prototypes = require('./prototypes.js');
const fs = require('fs');
const config = require('../config.js');

const mapFactory = {
//this function doesn't really fit here, but I don't know where else to put it
//it'll be pseudo-random.  We could use the crypto module, but that's just one more module to jam into the code.
//for our purposes there SHOULDN'T be any id collisions.  SHOULDN'T. :/
	idGenerator() {
		const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
		const idLength = 8;
	  let id = '';
	  for (var i = 0; i < idLength; i++) {
	    id += chars.charAt(Math.floor(Math.random() * chars.length));
	  }
	  return String(id); //always make sure we're returning a string
	},

	//factory function for empty prototypes
	newEmptyMap(filename = String(Date.now())) {
		let map = Object.create(prototypes.mapProto);

		//set filename (if unset) and id to current unix timestamp.  This should be unique enough between installs, but if not, 
		map.meta.fileName = filename;
		map.meta.id = this.idGenerator();
		return map;
	},

	//factory function to create a map and then load it from file.  returns a promise with the loaded map attached, because has to do async file reading.
	newMapFromFile(filename, directory = config.settings.mapDirectory) {
		let map = this.newEmptyMap(filename);
		return map.loadMap(directory).then(function(){return map});
	},

	//factory function to list all maps available via files.  returns a promise with the list when complete
	listMaps(directory = config.settings.mapDirectory) {
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
}

module.exports.mapFactory = mapFactory

